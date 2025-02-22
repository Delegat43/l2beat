import {
  Project,
  ProjectContract,
  ProjectReference,
  ProjectTechnology,
  ProjectTechnologyChoice,
} from '@l2beat/config'
import { existsSync } from 'fs'
import path from 'path'

import {
  ContractsSectionProps,
  TechnologyContract,
} from '../view/ContractsSection'
import { PermissionsSectionProps } from '../view/PermissionsSection'
import {
  ReferencesSectionProps,
  TechnologyReference,
} from '../view/ReferencesSection'
import { TechnologyIncompleteProps } from '../view/TechnologyIncomplete'
import {
  TechnologyChoice,
  TechnologySectionProps,
} from '../view/TechnologySection'
import { getEditLink, getIssueLink } from './links'

interface TechnologyOverview {
  incomplete?: TechnologyIncompleteProps
  sections: TechnologySectionProps[]
  permissionsSection?: PermissionsSectionProps
  contractsSection: ContractsSectionProps
  referencesSection: ReferencesSectionProps
}

export function getTechnologyOverview(project: Project): TechnologyOverview {
  const tech = project.details.technology
  const references: TechnologyReference[] = []

  function addReference(reference: ProjectReference) {
    const index = references.findIndex((x) => x.href === reference.href)
    if (index !== -1) {
      return index + 1
    } else {
      const id = references.length + 1
      references.push({ id, text: reference.text, href: reference.href })
      return id
    }
  }

  function makeTechnologyChoice(
    id: string,
    item: ProjectTechnologyChoice,
  ): TechnologyChoice {
    const risks = item.risks.map((risk) => ({
      referenceIds: (risk.references ?? []).map(addReference),
      text: `${risk.category} ${risk.text}`,
      isCritical: !!risk.isCritical,
    }))

    const issueTitle = `Problem: ${project.name} - ${item.name}`

    return {
      id,
      name: item.name,
      editLink: getEditLink(project),
      issueLink: getIssueLink(issueTitle),
      description: item.description,
      isIncomplete: !!item.isIncomplete,
      referenceIds: item.references.map(addReference),
      risks,
    }
  }

  function makeSections(tech: ProjectTechnology) {
    const technology: TechnologySectionProps = {
      id: 'technology',
      title: 'Technology',
      items: [
        makeTechnologyChoice('state-correctness', tech.stateCorrectness),
        tech.newCryptography &&
          makeTechnologyChoice('new-cryptography', tech.newCryptography),
        makeTechnologyChoice('data-availability', tech.dataAvailability),
      ].filter(noUndefined),
    }

    const operator: TechnologySectionProps = {
      id: 'operator',
      title: 'Operator',
      items: [
        makeTechnologyChoice('operator', tech.operator),
        makeTechnologyChoice('force-transactions', tech.forceTransactions),
      ],
    }

    const withdrawals: TechnologySectionProps = {
      id: 'withdrawals',
      title: 'Withdrawals',
      items: [
        ...tech.exitMechanisms.map((x, i) =>
          makeTechnologyChoice(`exit-mechanisms-${i + 1}`, x),
        ),
        tech.massExit && makeTechnologyChoice('mass-exit', tech.massExit),
      ].filter(noUndefined),
    }

    const other: TechnologySectionProps = {
      id: 'other-considerations',
      title: 'Other considerations',
      items: [
        tech.additionalPrivacy &&
          makeTechnologyChoice('additional-privacy', tech.additionalPrivacy),
        tech.smartContracts &&
          makeTechnologyChoice('smart-contracts', tech.smartContracts),
      ].filter(noUndefined),
    }

    return [technology, operator, withdrawals, other].filter(
      (x) => x.items.length > 0,
    )
  }

  function makeTechnologyContract(item: ProjectContract): TechnologyContract {
    const links = []

    if (
      item.upgradeability?.type === 'EIP1967' ||
      item.upgradeability?.type === 'NutBerry' ||
      item.upgradeability?.type === 'ZeppelinOs'
    ) {
      links.push({
        name: 'Implementation (Upgradable)',
        href: `https://etherscan.io/address/${item.upgradeability.implementation}#code`,
      })
      links.push({
        name: 'Admin',
        href: `https://etherscan.io/address/${item.upgradeability.admin}#code`,
      })
    }

    if (item.upgradeability?.type === 'StarkWare') {
      const delay = item.upgradeability.upgradeDelay !== 0
      const days = item.upgradeability.upgradeDelay / (60 * 60 * 24)
      const implementation =
        item.upgradeability.callImplementation ??
        item.upgradeability.implementation
      links.push({
        name: `Implementation (Upgradable${
          delay ? ` ${days} days delay` : ''
        })`,
        href: `https://etherscan.io/address/${implementation}#code`,
      })
    }

    if (item.upgradeability?.type === 'Reference') {
      links.push({
        name: 'Code (Upgradable)',
        href: `https://etherscan.io/address/${item.address}#code`,
      })
    }

    if (item.upgradeability?.type === 'Arbitrum') {
      links.push({
        name: 'Admin',
        href: `https://etherscan.io/address/${item.upgradeability.admin}#code`,
      })
      links.push({
        name: 'Admin logic (Upgradable)',
        href: `https://etherscan.io/address/${item.upgradeability.adminImplementation}#code`,
      })
      links.push({
        name: 'User logic (Upgradable)',
        href: `https://etherscan.io/address/${item.upgradeability.userImplementation}#code`,
      })
    }

    const tokens = project.bridges.find(
      (x) => x.address === item.address,
    )?.tokens
    let description = item.description
    if (tokens) {
      const tokenText =
        tokens === '*'
          ? 'This contract can store any token'
          : `This contract stores the following tokens: ${tokens.join(', ')}.`
      if (!description) {
        description = tokenText
      } else {
        description += ' ' + tokenText
      }
    }

    return {
      name: item.name,
      address: item.address,
      description,
      links,
    }
  }

  function makePermissionsSection(tech: ProjectTechnology) {
    if (!tech.permissions) {
      return undefined
    }
    return {
      editLink: getEditLink(project),
      issueLink: getIssueLink(
        `Problem: ${project.name} - PermissionedAddresses`,
      ),
      permissions: tech.permissions,
    }
  }

  function makeContractSection(tech: ProjectTechnology) {
    const contracts = tech.contracts.addresses.map(makeTechnologyContract)

    const risks = tech.contracts.risks.map((risk) => ({
      referenceIds: (risk.references ?? []).map(addReference),
      text: `${risk.category} ${risk.text}`,
      isCritical: !!risk.isCritical,
    }))

    const file = path.join(
      __dirname,
      `../../../../static/images/${project.slug}-architecture.png`,
    )
    const architectureImage = existsSync(file)
      ? `/images/${project.slug}-architecture.png`
      : undefined

    return {
      editLink: getEditLink(project),
      issueLink: getIssueLink(`Problem: ${project.name} - Contracts`),
      contracts,
      risks,
      architectureImage,
    }
  }

  const sections = makeSections(tech)
  const isIncomplete = sections.some((x) =>
    x.items.some((x) => x.isIncomplete || x.referenceIds.length === 0),
  )

  const incomplete = isIncomplete
    ? {
        editLink: getEditLink(project),
        twitterLink: getTwitterLink(project),
      }
    : undefined

  return {
    incomplete,
    sections,
    permissionsSection: makePermissionsSection(tech),
    contractsSection: makeContractSection(tech),
    referencesSection: { items: references },
  }
}

function getTwitterLink(project: Project) {
  const twitterSocialMedia = project.details.links.socialMedia.find((x) =>
    x.includes('twitter'),
  )
  if (!twitterSocialMedia) {
    return
  }
  const twitterAccount = twitterSocialMedia.substring(
    'https://twitter.com/'.length,
  )

  const message = `Hey @${twitterAccount}. Your project overview on @l2beat would benefit from your help.`
  const url = `https://l2beat.com/projects/${project.slug}`

  const options = [
    ['text', encodeURIComponent(message)],
    ['url', encodeURIComponent(url)],
  ]
    .map((x) => `${x[0]}=${x[1]}`)
    .join('&')

  return `https://twitter.com/intent/tweet?${options}`
}

function noUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}

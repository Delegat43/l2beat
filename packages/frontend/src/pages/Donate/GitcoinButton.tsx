import React from 'react'

import { OutLink } from '../../components'
import { config } from '../config'

export function GitcoinButton() {
  if (!config.showGitcoinOption) {
    return null
  }
  return (
    <OutLink
      className="GitcoinButton"
      href="https://gitcoin.co/grants/3857/l2beat"
    >
      Donate using Gitcoin
    </OutLink>
  )
}

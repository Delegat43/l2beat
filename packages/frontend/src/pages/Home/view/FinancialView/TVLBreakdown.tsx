import React from 'react'

import { InfoIcon, WarningIcon } from '../../../../components/icons'

export interface TVLBreakdownProps {
  warning?: string
  warningSeverity: 'info' | 'warning' | 'bad'
  label: string
  empty: boolean
  associated: number
  ether: number
  stable: number
  other: number
}

export function TVLBreakdown(props: TVLBreakdownProps) {
  return (
    <span className="TVLBreakdown">
      {props.warning && (
        <div className="TVLBreakdown-TvlWarning">
          <div className="Tooltip" title={props.warning}>
            {props.warningSeverity === 'info' && (
              <InfoIcon fill="var(--text-info)" />
            )}
            {props.warningSeverity === 'warning' && (
              <WarningIcon fill="var(--text-warning)" />
            )}
            {props.warningSeverity === 'bad' && (
              <WarningIcon fill="var(--text-bad)" />
            )}
          </div>
        </div>
      )}
      <span className="Tooltip" data-tooltip-align="right" title={props.label}>
        <svg
          className="TVLBreakdown-Breakdown"
          width="100"
          height="21"
          viewBox="0 0 100 21"
          fill="none"
        >
          {getGradientGroups(props).map((g, i) => (
            <rect
              key={i}
              x={g.offset}
              y="0"
              width={g.size}
              height="21"
              fill={g.color}
            />
          ))}
        </svg>
      </span>
    </span>
  )
}

const GAP_SIZE = 2
const MIN_SIZE = 2

function getGradientGroups(breakdown: TVLBreakdownProps) {
  if (breakdown.empty) {
    return []
  }
  const groups = [
    { weight: breakdown.associated, color: 'var(--gradient-3)' },
    { weight: breakdown.ether, color: 'var(--gradient-1)' },
    { weight: breakdown.stable, color: 'var(--gradient-2)' },
    { weight: breakdown.other, color: 'var(--gradient-4)' },
  ].filter((x) => x.weight >= 0.005)
  const gaps = groups.length - 1
  const sizedGroups = groups.map((g) => ({
    ...g,
    size: Math.max(MIN_SIZE, Math.ceil(g.weight * (100 - gaps * GAP_SIZE))),
  }))
  const total = sizedGroups.reduce((sum, g) => sum + g.size, 0)
  const difference = total - (100 - gaps * GAP_SIZE)
  let largest = sizedGroups[0]
  for (const group of sizedGroups) {
    if (group.size > largest.size) {
      largest = group
    }
  }
  largest.size -= difference
  let offset = 0
  const withOffset = sizedGroups.map((g) => {
    const result = { ...g, offset: offset }
    offset += g.size + GAP_SIZE
    return result
  })
  return withOffset
}

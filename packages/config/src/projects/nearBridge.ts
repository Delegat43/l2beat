import { UnixTime } from '@l2beat/types'

import { Project } from './types'
import { bridge } from './types/bridge'

export const nearBridge: Project = bridge({
  name: 'Near Rainbow Bridge',
  slug: 'nearbridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://near.org/bridge/'],
  },
  associatedTokens: ['AURORA'],
  bridges: [
    {
      address: '0x23Ddd3e3692d1861Ed57EDE224608875809e127f',
      sinceTimestamp: new UnixTime(1615826693),
      tokens: ['DAI', 'USDC', 'AURORA', 'USDT', 'WBTC', 'PLY', 'OCT'],
    },
  ],
  connections: [],
})

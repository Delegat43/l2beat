import { Project } from './types'
import { bridge } from './types/bridge'

export const hopBridge: Project = bridge({
  name: 'Hop Bridge',
  slug: 'hopbridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://hop.exchange/'],
  },
  bridges: [
    {
      address: '0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a',
      sinceBlock: 12650032,
      tokens: ['USDC'],
    },
    {
      address: '0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1',
      sinceBlock: 13226217,
      tokens: ['DAI'],
    },
    {
      address: '0x3E4a3a4796d16c0Cd582C382691998f7c06420B6',
      sinceBlock: 12860139,
      tokens: ['USDT'],
    },
    {
      address: '0xb8901acB165ed027E32754E0FFe830802919727f',
      sinceBlock: 13331564,
      tokens: ['ETH'],
    },
    {
      address: '0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2',
      sinceBlock: 12969385,
      tokens: ['MATIC'],
    },
    {
      address: '0xb98454270065A31D71Bf635F6F7Ee6A518dFb849',
      sinceBlock: 13476113,
      tokens: ['WBTC'],
    },
  ],
  connections: [],
})

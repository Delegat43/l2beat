import { arbitrum } from './arbitrum'
import { aztec } from './aztec'
import { aztecconnect } from './aztecconnect'
import { bobanetwork } from './bobanetwork'
import { dydx } from './dydx'
import { fuelv1 } from './fuelv1'
import { gluon } from './gluon'
import { hermez } from './hermez'
import { immutablex } from './immutablex'
import { layer2finance } from './layer2finance'
import { layer2financezk } from './layer2financezk'
import { loopring } from './loopring'
import { metis } from './metis'
import { nova } from './nova'
import { omgnetwork } from './omgnetwork'
import { optimism } from './optimism'
import { rhinofi } from './rhinofi'
import { sorare } from './sorare'
import { starknet } from './starknet'
import { Project } from './types'
import { zkspace } from './zkspace'
import { zkswap } from './zkswap'
import { zkswap2 } from './zkswap2'
import { zksync } from './zksync'

export * from './types'

export const projects: Project[] = [
  arbitrum,
  aztec,
  aztecconnect,
  bobanetwork,
  rhinofi,
  dydx,
  fuelv1,
  gluon,
  hermez,
  immutablex,
  layer2finance,
  layer2financezk,
  loopring,
  metis,
  nova,
  omgnetwork,
  optimism,
  sorare,
  starknet,
  zkswap,
  zkswap2,
  zkspace,
  zksync,
]

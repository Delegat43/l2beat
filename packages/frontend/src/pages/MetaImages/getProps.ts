import { Project } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { formatUSD, getFromEnd, getPercentageChange } from '../../utils/utils'
import { MetaImageProps } from './MetaImage'

export function getProps(apiMain: ApiMain, project?: Project): MetaImageProps {
  const daily = project
    ? apiMain.projects[project.id.toString()]?.charts.daily.data ?? []
    : apiMain.charts.daily.data
  const tvl = getFromEnd(daily, 0)?.[1] ?? 0
  const tvlSevenDaysAgo = getFromEnd(daily, 7)?.[1] ?? 0
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  return {
    tvl: formatUSD(tvl),
    sevenDayChange,
    name: project?.name,
    icon: project && `/icons/${project.slug}.png`,
    apiEndpoint: `/api/${project?.slug ?? 'tvl'}.json`,
  }
}

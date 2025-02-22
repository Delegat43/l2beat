import { Project } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import {
  formatUSD,
  getFromEnd,
  getPercentageChange,
} from '../../../utils/utils'
import { HomePageProps } from '../view/HomePage'
import { getFinancialView } from './getFinancialView'
import { getPageMetadata } from './getPageMetadata'
import { getRiskView } from './getRiskView'

export function getProps(projects: Project[], apiMain: ApiMain): HomePageProps {
  const tvl = getFromEnd(apiMain.charts.hourly.data, 0)?.[1] ?? 0
  const tvlSevenDaysAgo = apiMain.charts.hourly.data[0]?.[1] ?? 0
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const getTvl = (project: Project) =>
    getFromEnd(
      apiMain.projects[project.id.toString()]?.charts.hourly.data ?? [],
      0,
    )?.[1] ?? 0
  const ordering = [...projects].sort((a, b) => getTvl(b) - getTvl(a))

  return {
    tvl: formatUSD(tvl),
    sevenDayChange,
    apiEndpoint: '/api/tvl.json',
    financialView: getFinancialView(ordering, apiMain, tvl),
    riskView: getRiskView(ordering),
    metadata: getPageMetadata(),
  }
}

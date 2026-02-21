import type { AtomicThemeConfig, SectionDistribution } from '@resumify/shared'

function flattenSections(distribution: SectionDistribution): string[] {
  return Object.values(distribution).flat()
}

function uniqueSectionIds(sectionIds: string[]): string[] {
  return Array.from(new Set(sectionIds))
}

function toTwoColumnSections(sectionIds: string[]): { sidebar: string[], main: string[] } {
  const defaultSidebar = ['personalInfo', 'skills']
  const sidebar = defaultSidebar.filter(id => sectionIds.includes(id))
  const main = sectionIds.filter(id => !sidebar.includes(id))
  return { sidebar, main }
}

function normalizeTwoColumnSections(distribution: SectionDistribution): { sidebar: string[], main: string[] } | null {
  const keys = Object.keys(distribution)
  if (keys.length !== 2)
    return null

  if ('sidebar' in distribution || 'main' in distribution) {
    return {
      sidebar: [...(distribution.sidebar ?? [])],
      main: [...(distribution.main ?? [])],
    }
  }

  return {
    sidebar: [...(distribution[keys[0]] ?? [])],
    main: [...(distribution[keys[1]] ?? [])],
  }
}

export function sectionDistributionForLayout(
  layout: AtomicThemeConfig['layout'],
  current: SectionDistribution,
  defaultDistribution: SectionDistribution,
): SectionDistribution {
  const baseDistribution = Object.keys(current).length > 0
    ? current
    : defaultDistribution
  const sectionIds = uniqueSectionIds(flattenSections(baseDistribution))

  if (layout === 'single') {
    return {
      main: sectionIds,
    }
  }

  const existingTwoColumns = normalizeTwoColumnSections(baseDistribution)
  const { sidebar, main } = existingTwoColumns ?? toTwoColumnSections(sectionIds)

  if (layout === 'double') {
    return {
      sidebar,
      main,
    }
  }

  return {
    main,
    sidebar,
  }
}

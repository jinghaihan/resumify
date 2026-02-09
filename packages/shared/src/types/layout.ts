/**
 * Column definition
 * Defines the structure of columns in a resume, fixed as part of theme configuration
 */
export interface ColumnDefinition {
  id: string
  width: string
}

/**
 * Section distribution
 * Records the order of sections in each column, arrays naturally maintain order
 */
export type SectionDistribution = Record<string, string[]>

/**
 * Layout definition
 * Fixed layout structure of a theme
 */
export interface Layout {
  columns: ColumnDefinition[]
}

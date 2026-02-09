import type { ExportSettings } from '@resumify/shared'

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  displayHeaderFooter: false,
  printBackground: true,
  omitBackground: false,
  landscape: false,
  preferCSSPageSize: false,
  format: 'a4',
  margin: {
    top: '0.4in',
    right: '0.4in',
    bottom: '0.4in',
    left: '0.4in',
  },
  pageRanges: {},
  scale: 1,
  outline: false,
  tagged: true,
}

/**
 * PDF export settings based on Puppeteer PDFOptions
 * @see https://pptr.dev/api/puppeteer.pdfoptions
 */
export interface ExportSettings {
  // Display options
  displayHeaderFooter: boolean
  printBackground: boolean
  omitBackground: boolean
  landscape: boolean
  preferCSSPageSize: boolean

  // Page format and dimensions
  format: PaperFormat
  width?: string | number
  height?: string | number

  // Margins
  margin: {
    top?: string | number
    right?: string | number
    bottom?: string | number
    left?: string | number
  }

  // Content options
  pageRanges: PageRange
  scale: number

  // Experimental features
  outline: boolean
  tagged: boolean

  // Export path
  path?: string
}

/**
 * Page range configuration
 */
export interface PageRange {
  start?: number
  end?: number
}

/**
 * Supported paper formats
 * @see https://pptr.dev/api/puppeteer.paperformat
 */
export type PaperFormat
  = | 'letter'
    | 'legal'
    | 'tabloid'
    | 'ledger'
    | 'a0'
    | 'a1'
    | 'a2'
    | 'a3'
    | 'a4'
    | 'a5'
    | 'a6'

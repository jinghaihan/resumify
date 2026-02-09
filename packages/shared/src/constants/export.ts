import type { PaperFormat } from '../types/export'

export const PAPER_SIZES: Record<PaperFormat, { width: number, height: number, unit: 'mm' | 'in' }> = {
  a0: { width: 841, height: 1189, unit: 'mm' },
  a1: { width: 594, height: 841, unit: 'mm' },
  a2: { width: 420, height: 594, unit: 'mm' },
  a3: { width: 297, height: 420, unit: 'mm' },
  a4: { width: 210, height: 297, unit: 'mm' },
  a5: { width: 148, height: 210, unit: 'mm' },
  a6: { width: 105, height: 148, unit: 'mm' },
  letter: { width: 8.5, height: 11, unit: 'in' },
  legal: { width: 8.5, height: 14, unit: 'in' },
  tabloid: { width: 11, height: 17, unit: 'in' },
  ledger: { width: 17, height: 11, unit: 'in' },
}

export const PAPER_FORMAT_OPTIONS = [
  { value: 'letter', label: 'Letter' },
  { value: 'legal', label: 'Legal' },
  { value: 'tabloid', label: 'Tabloid' },
  { value: 'ledger', label: 'Ledger' },
  { value: 'a0', label: 'A0' },
  { value: 'a1', label: 'A1' },
  { value: 'a2', label: 'A2' },
  { value: 'a3', label: 'A3' },
  { value: 'a4', label: 'A4' },
  { value: 'a5', label: 'A5' },
  { value: 'a6', label: 'A6' },
]

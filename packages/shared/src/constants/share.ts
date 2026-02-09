import { addDays, addHours } from 'date-fns'

export const SHARE_EXPIRATION_TIME_OPTIONS = [
  {
    label: '1 hour',
    value: '1h',
    getExpirationDate: () => addHours(new Date(), 1),
  },
  {
    label: '24 hours',
    value: '24h',
    getExpirationDate: () => addHours(new Date(), 24),
  },
  {
    label: '7 days',
    value: '7d',
    getExpirationDate: () => addDays(new Date(), 7),
  },
  {
    label: '30 days',
    value: '30d',
    getExpirationDate: () => addDays(new Date(), 30),
  },
]

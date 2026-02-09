import { ofetch } from 'ofetch'

interface IconSearchPayload {
  query: string
  limit?: number
}

interface IconSearchResponse {
  icons: string[]
  total: number
}

const DEFAULT_LIMIT = 1000

export async function searchIcons(payload: IconSearchPayload): Promise<IconSearchResponse> {
  if (!payload.query.trim())
    throw new Error('search query is required')

  const limit = typeof payload.limit === 'number' ? payload.limit : DEFAULT_LIMIT
  const url = new URL('/search', 'https://api.iconify.design')
  url.searchParams.set('query', payload.query)
  url.searchParams.set('limit', String(limit))

  return await ofetch(url.toString())
}

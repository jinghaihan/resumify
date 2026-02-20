'use client'

import type { DatabaseShareListItem } from '@resumify/database'
import { fetchShares } from '@resumify/api'
import { Header, InputSearch, List, ListSkeleton } from '@resumify/ui'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CardActions } from './actions'
import { CardTitle } from './card-title'
import { Metadata } from './metadata'
import { StatusBadges } from './status-badges'

export function ShareList() {
  const t = useTranslations()

  const [shares, setShares] = useState<DatabaseShareListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  const fetchSharesList = useCallback(async (query?: string) => {
    try {
      const data = await fetchShares(query || '')
      setShares(Array.isArray(data) ? data : [])
    }
    catch {
      toast.error(t('status.error'))
    }
    finally {
      setLoading(false)
      setSearching(false)
    }
  }, [t])

  useEffect(() => {
    fetchSharesList()
  }, [fetchSharesList])

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      await fetchSharesList()
      return
    }
    setSearching(true)
    await fetchSharesList(query)
  }, [fetchSharesList])

  return (
    <div className="flex flex-col gap-4">
      <Header
        title={t('share-list.title')}
        subtitle={t('share-list.subtitle')}
      />

      <InputSearch
        onSearch={handleSearch}
        placeholder={t('create-share.share-name')}
      />

      {loading || searching
        ? <ListSkeleton count={5} />
        : (
            <List
              cardClassName="gap-1"
              items={shares}
              title={share => <CardTitle share={share} />}
              subtitle={share => <StatusBadges share={share} />}
              actions={share => (
                <CardActions
                  share={share}
                  fetchShares={fetchSharesList}
                />
              )}
              content={share => <Metadata share={share} />}
            />
          )}
    </div>
  )
}

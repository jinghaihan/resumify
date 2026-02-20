'use client'

import type { DatabaseResumeListItem } from '@resumify/database'
import { getResumes } from '@resumify/api'
import { Header, InputSearch, List, ListSkeleton } from '@resumify/ui'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CardActions } from './actions'
import { CardTitle } from './card-title'
import { RelativeTime } from './relative-time'

export function ResumeList() {
  const t = useTranslations()

  const [resumes, setResumes] = useState<DatabaseResumeListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [selectedResume, setSelectedResume] = useState<DatabaseResumeListItem | null>(null)

  const fetchResumes = useCallback(async (query?: string) => {
    try {
      const data = await getResumes(query || '')
      setResumes(data)
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
    fetchResumes()
  }, [fetchResumes])

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      await fetchResumes()
      return
    }
    setSearching(true)
    await fetchResumes(query)
  }, [fetchResumes])

  return (
    <div className="flex flex-col gap-4">
      <Header
        title={t('resume-list.title')}
        subtitle={t('resume-list.subtitle')}
      />

      <InputSearch
        onSearch={handleSearch}
        placeholder={t('resume-list.resume-name')}
      />

      {loading || searching
        ? <ListSkeleton count={5} />
        : (
            <List
              items={resumes}
              title={resume => <CardTitle id={resume.id} name={resume.name} />}
              subtitle={resume => <RelativeTime date={resume.updatedAt} />}
              actions={resume => (
                <CardActions
                  resume={resume}
                  selectedResume={selectedResume}
                  setSelectedResume={setSelectedResume}
                  fetchResumes={fetchResumes}
                />
              )}
            />
          )}
    </div>
  )
}

'use client'
import { useWorkExperienceStore, workExperiences as workExperiencesGetter } from '@resumify/store'
import { AddButton, Header, ResetButton, SortableList } from '@resumify/ui'
import { useTranslations } from 'next-intl'

import { WorkExperienceSection } from './section'

export function WorkExperiencePanel() {
  const t = useTranslations()
  const store = useWorkExperienceStore()

  const workExperiences = workExperiencesGetter()

  const initState = () => {
    if (!workExperiences.length)
      store.reset()
  }

  const onReset = () => {
    store.reset()
  }

  initState()

  return (
    <div className="flex flex-col gap-4">
      <Header
        title={t('work-experience.title')}
        subtitle={t('work-experience.subtitle')}
        action={<ResetButton onConfirm={onReset} />}
      />

      <SortableList
        className="gap-4"
        items={workExperiences.map(item => item.id)}
        onClose={(id: string) => store.removeWorkExperience(id)}
        onChange={(items: string[]) => store.reorderWorkExperiences(items)}
        renderItem={(id, index, dragHandle, deleteButton) => (
          <WorkExperienceSection
            key={id}
            title={t('work-experience.title') + (index + 1)}
            name={workExperiences[index].name}
            role={workExperiences[index].role}
            startDate={workExperiences[index].startDate}
            endDate={workExperiences[index].endDate}
            description={workExperiences[index].description}
            achievements={workExperiences[index].achievements}
            dragHandle={dragHandle}
            deleteButton={deleteButton}
            onChange={updates => store.updateWorkExperience(id, updates)}
          />
        )}
      />

      <AddButton onAdd={() => store.addWorkExperience()} />
    </div>
  )
}

'use client'
import { projectExperiences as projectExperiencesGetter, useProjectExperienceStore } from '@resumify/store'
import { AddButton, Header, ResetButton, SortableList } from '@resumify/ui'
import { useTranslations } from 'next-intl'

import { ProjectExperienceSection } from './section'

export function ProjectExperiencePanel() {
  const t = useTranslations()
  const store = useProjectExperienceStore()

  const projectExperiences = projectExperiencesGetter()

  const initState = () => {
    if (!projectExperiences.length)
      store.reset()
  }

  const onReset = () => {
    store.reset()
  }

  initState()

  return (
    <div className="flex flex-col gap-4">
      <Header
        title={t('project-experience.title')}
        subtitle={t('project-experience.subtitle')}
        action={<ResetButton onConfirm={onReset} />}
      />

      <SortableList
        className="gap-4"
        items={projectExperiences.map(item => item.id)}
        onClose={(id: string) => store.removeProjectExperience(id)}
        onChange={(items: string[]) => store.reorderProjectExperiences(items)}
        renderItem={(id, index, dragHandle, deleteButton) => (
          <ProjectExperienceSection
            key={id}
            title={t('project-experience.title') + (index + 1)}
            name={projectExperiences[index].name}
            role={projectExperiences[index].role}
            startDate={projectExperiences[index].startDate}
            endDate={projectExperiences[index].endDate}
            description={projectExperiences[index].description}
            achievements={projectExperiences[index].achievements}
            techStack={projectExperiences[index].techStack}
            dragHandle={dragHandle}
            deleteButton={deleteButton}
            onChange={updates => store.updateProjectExperience(id, updates)}
          />
        )}
      />

      <AddButton onAdd={() => store.addProjectExperience()} />
    </div>
  )
}

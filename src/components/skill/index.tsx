'use client'

import { skills as skillsGetter, useSkillStore } from '@resumify/store'
import { AddButton, Header, ResetButton, SortableList } from '@resumify/ui'
import { useTranslations } from 'next-intl'
import { SkillSection } from './section'

export function SkillPanel() {
  const t = useTranslations()
  const store = useSkillStore()

  const skills = skillsGetter()

  const initState = () => {
    if (!skills.length)
      store.reset()
  }

  const onReset = () => {
    store.reset()
  }

  initState()

  return (
    <div className="flex flex-col gap-4">
      <Header
        title={t('skills.title')}
        subtitle={t('skills.subtitle')}
        action={<ResetButton onConfirm={onReset} />}
      />

      <SortableList
        className="gap-4"
        items={skills.map(item => item.id)}
        onClose={(id: string) => store.removeSkill(id)}
        onChange={(items: string[]) => store.reorderSkills(items)}
        renderItem={(id, index, dragHandle, deleteButton) => (
          <SkillSection
            key={id}
            title={t('skills.title') + (index + 1)}
            content={skills[index].content}
            dragHandle={dragHandle}
            deleteButton={deleteButton}
            onChange={updates => store.updateSkill(id, updates)}
          />
        )}
      />

      <AddButton onAdd={() => store.addSkill()} />
    </div>
  )
}

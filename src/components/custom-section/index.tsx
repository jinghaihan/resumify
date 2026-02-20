'use client'

import { sections as sectionsGetter, useSectionStore } from '@resumify/store'
import { AddButton, Header, ResetButton, SortableList } from '@resumify/ui'
import { useTranslations } from 'next-intl'
import { CustomSection } from './section'

export function CustomSectionPanel() {
  const t = useTranslations()
  const store = useSectionStore()

  const sections = sectionsGetter()

  const initState = () => {
    if (!sections.length)
      store.reset()
  }

  const onReset = () => {
    store.reset()
  }

  initState()

  return (
    <div className="flex flex-col gap-4">
      <Header
        title={t('custom-section.title')}
        subtitle={t('custom-section.subtitle')}
        action={<ResetButton onConfirm={onReset} />}
      />

      <SortableList
        className="gap-4"
        items={sections.map(item => item.id)}
        onClose={(id: string) => store.removeSection(id)}
        onChange={(items: string[]) => store.reorderSections(items)}
        renderItem={(id, index, dragHandle, deleteButton) => (
          <CustomSection
            key={id}
            title={t('custom-section.title') + (index + 1)}
            content={sections[index].content}
            dragHandle={dragHandle}
            deleteButton={deleteButton}
            onChange={updates => store.updateSection(id, updates)}
          />
        )}
      />
      <AddButton onAdd={() => store.addSection()} />
    </div>
  )
}

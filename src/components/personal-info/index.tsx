'use client'

import {
  personalInfo as personalInfoGetter,
  socialLinks as socialLinksGetter,
  usePersonalInfoStore,
} from '@resumify/store'
import { ResetButton, SortableList } from '@resumify/ui'
import { useTranslations } from 'next-intl'
import { BasicSection } from './basic-section'
import { AddableCard } from './card'
import { PersonalInfoSection } from './section'

export function PersonalInfoPanel() {
  const t = useTranslations()
  const store = usePersonalInfoStore()

  const personalInfo = personalInfoGetter()
  const socialLinks = socialLinksGetter()

  const initState = () => {
    if (!personalInfo.length)
      store.resetPersonalInfo(t)
    if (!socialLinks.length)
      store.resetSocialLinks()
  }

  initState()

  return (
    <div className="flex w-full flex-col gap-4">
      <AddableCard
        title={t('personal-info.title')}
        description={t('personal-info.subtitle')}
        onAdd={() => store.addPersonalInfo()}
        action={<ResetButton onConfirm={() => store.resetPersonalInfo(t)} />}
      >
        <BasicSection />
        <SortableList
          items={personalInfo.map(item => item.id)}
          onClose={(id: string) => store.removePersonalInfo(id)}
          onChange={(items: string[]) => store.reorderPersonalInfo(items)}
          renderItem={(id, index, dragHandle, deleteButton) => (
            <PersonalInfoSection
              key={id}
              icon={personalInfo[index].icon}
              name={personalInfo[index].name}
              value={personalInfo[index].value}
              dragHandle={dragHandle}
              deleteButton={deleteButton}
              onChange={updates => store.updatePersonalInfo(id, updates)}
            />
          )}
        >
        </SortableList>
      </AddableCard>

      <AddableCard
        title={t('social-links.title')}
        description={t('social-links.subtitle')}
        onAdd={() => store.addSocialLink()}
        action={<ResetButton onConfirm={() => store.resetSocialLinks()} />}
      >
        <SortableList
          items={socialLinks.map(item => item.id)}
          onClose={(id: string) => store.removeSocialLink(id)}
          onChange={(items: string[]) => store.reorderSocialLinks(items)}
          renderItem={(id, index, dragHandle, deleteButton) => (
            <PersonalInfoSection
              key={id}
              icon={socialLinks[index].icon}
              name={socialLinks[index].name}
              value={socialLinks[index].value}
              dragHandle={dragHandle}
              deleteButton={deleteButton}
              onChange={updates => store.updateSocialLink(id, updates)}
            />
          )}
        >
        </SortableList>
      </AddableCard>
    </div>
  )
}

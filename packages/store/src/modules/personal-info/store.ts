import type { PersonalInfo } from '@resumify/shared'
import type { _Translator } from 'next-intl'
import type { PersonalInfoStore } from './types'
import { APPLICATION_NAME, DEFAULT_PHOTO_SHAPE } from '@resumify/shared'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function createSection(icon: string = ''): PersonalInfo {
  return { id: nanoid(), icon, name: '', value: '' }
}

function createPersonalInfoList(t: _Translator): PersonalInfo[] {
  return [
    {
      id: nanoid(),
      icon: 'lucide:map-pin',
      name: t('personal-info.location'),
      value: '',
    },
    {
      id: nanoid(),
      icon: 'lucide:calendar',
      name: t('personal-info.age'),
      value: '',
    },
    {
      id: nanoid(),
      icon: 'lucide:phone',
      name: t('personal-info.phone'),
      value: '',
    },
    {
      id: nanoid(),
      icon: 'lucide:mail',
      name: t('personal-info.email'),
      value: '',
    },
    {
      id: nanoid(),
      icon: 'lucide:school',
      name: t('personal-info.school'),
      value: '',
    },
    {
      id: nanoid(),
      icon: 'lucide:book',
      name: t('personal-info.major'),
      value: '',
    },
  ]
}

function createSocialLinkList(): PersonalInfo[] {
  return [
    {
      id: nanoid(),
      icon: 'lucide:github',
      name: 'GitHub',
      value: '',
    },
  ]
}

export const usePersonalInfoStore = create<PersonalInfoStore>()(
  persist(
    set => ({
      name: '',
      jobObjective: '',

      photoUrl: '',
      photoShape: DEFAULT_PHOTO_SHAPE,

      personalInfo: [],
      socialLinks: [],

      updateName: name => set({ name }),
      updateJobObjective: jobObjective => set({ jobObjective }),

      updatePhotoUrl: photoUrl => set({ photoUrl }),
      updatePhotoShape: photoShape => set({ photoShape }),

      addPersonalInfo() {
        set(state => ({
          personalInfo: [...state.personalInfo, createSection()],
        }))
      },
      updatePersonalInfo(id: string, updates: Partial<PersonalInfo>) {
        set((state) => {
          const index = state.personalInfo.findIndex(section => section.id === id)
          if (index === -1)
            return state

          const fields = [...state.personalInfo]
          fields[index] = { ...fields[index], ...updates }

          return { personalInfo: fields }
        })
      },
      removePersonalInfo(id) {
        set((state) => {
          const index = state.personalInfo.findIndex(section => section.id === id)
          if (index === -1)
            return state

          const fields = [...state.personalInfo]
          fields.splice(index, 1)

          return { personalInfo: fields }
        })
      },
      reorderPersonalInfo(items) {
        set(state => ({
          personalInfo: items.map(id => state.personalInfo.find(item => item.id === id)!),
        }))
      },

      addSocialLink() {
        set(state => ({
          socialLinks: [...state.socialLinks, createSection('lucide:link')],
        }))
      },
      updateSocialLink(id: string, updates: Partial<PersonalInfo>) {
        set((state) => {
          const index = state.socialLinks.findIndex(section => section.id === id)
          if (index === -1)
            return state

          const fields = [...state.socialLinks]
          fields[index] = { ...fields[index], ...updates }

          return { socialLinks: fields }
        })
      },
      removeSocialLink(id) {
        set((state) => {
          const index = state.socialLinks.findIndex(section => section.id === id)
          if (index === -1)
            return state

          const fields = [...state.socialLinks]
          fields.splice(index, 1)

          return { socialLinks: fields }
        })
      },
      reorderSocialLinks(items) {
        set(state => ({
          socialLinks: items.map(id => state.socialLinks.find(item => item.id === id)!),
        }))
      },

      setPersonalInfo: items => set({ personalInfo: items }),
      setSocialLinks: items => set({ socialLinks: items }),

      resetPersonalInfo: t => set({
        name: '',
        jobObjective: '',
        photoUrl: '',
        photoShape: DEFAULT_PHOTO_SHAPE,
        personalInfo: createPersonalInfoList(t),
      }),
      resetSocialLinks: () => set({
        socialLinks: createSocialLinkList(),
      }),
      reset: () => set({
        name: '',
        jobObjective: '',
        photoUrl: '',
        photoShape: DEFAULT_PHOTO_SHAPE,
        personalInfo: [],
        socialLinks: [],
      }),
    }),
    {
      name: `${APPLICATION_NAME}-personal-info`,
      partialize: state => ({
        name: state.name,
        jobObjective: state.jobObjective,
        photoUrl: state.photoUrl,
        photoShape: state.photoShape,
        personalInfo: state.personalInfo,
        socialLinks: state.socialLinks,
      }),
    },
  ),
)

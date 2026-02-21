import type {
  AtomicThemeConfig,
  PhotoShape,
  Resume,
  SectionDistribution,
} from '@resumify/shared'
import type { ResumeStore } from './types'
import { saveResumes } from '@resumify/api'
import {
  APPLICATION_NAME,
  DEFAULT_RESUME_THEME,
  sanitizeResume,
  validateResume,
} from '@resumify/shared'
import { DEFAULT_SECTION_DISTRIBUTION, THEME_PRESETS } from '@resumify/themes'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  jobObjective,
  personalInfo,
  photoShape,
  photoUrl,
  projectExperiences,
  resumeName,
  sections,
  skills,
  socialLinks,
  workExperiences,
} from '..'
import { usePersonalInfoStore } from '../personal-info'
import { useProjectExperienceStore } from '../project-experience'
import { useSectionStore } from '../section'
import { useSkillStore } from '../skill'
import { useWorkExperienceStore } from '../work-experience'
import { sectionDistributionForLayout } from './utils'

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      id: null,
      resumeName: '',
      saving: false,
      resumeList: [],
      presentation: {
        theme: DEFAULT_RESUME_THEME,
        themeConfig: THEME_PRESETS[0].config,
        sectionDistribution: {},
      },

      updateTheme: theme =>
        set(state => ({
          presentation: {
            ...state.presentation,
            theme,
          },
        })),

      getResume: () => {
        const state = get()
        return {
          name: resumeName(),
          jobObjective: jobObjective(),
          photoUrl: photoUrl(),
          photoShape: photoShape(),
          personalInfo: personalInfo(),
          socialLinks: socialLinks(),
          skills: skills(),
          workExperiences: workExperiences(),
          projectExperiences: projectExperiences(),
          sections: sections(),
          presentation: state.presentation,
        }
      },

      updateResume: (updates: Partial<Resume>) => {
        const personalInfoStore = usePersonalInfoStore.getState()
        const workExperienceStore = useWorkExperienceStore.getState()
        const skillStore = useSkillStore.getState()
        const projectExperienceStore = useProjectExperienceStore.getState()
        const sectionStore = useSectionStore.getState()

        if (updates.name !== undefined)
          personalInfoStore.updateName(updates.name)
        if (updates.jobObjective !== undefined)
          personalInfoStore.updateJobObjective(updates.jobObjective)
        if (updates.photoUrl !== undefined)
          personalInfoStore.updatePhotoUrl(updates.photoUrl)
        if (updates.photoShape !== undefined)
          personalInfoStore.updatePhotoShape(updates.photoShape as PhotoShape)
        if (updates.personalInfo !== undefined)
          personalInfoStore.setPersonalInfo(updates.personalInfo)
        if (updates.socialLinks !== undefined)
          personalInfoStore.setSocialLinks(updates.socialLinks)
        if (updates.skills !== undefined)
          skillStore.setSkills(updates.skills)
        if (updates.workExperiences !== undefined)
          workExperienceStore.setWorkExperiences(updates.workExperiences)
        if (updates.projectExperiences !== undefined)
          projectExperienceStore.setProjectExperiences(updates.projectExperiences)
        if (updates.sections !== undefined)
          sectionStore.setSections(updates.sections)
        if (updates.presentation !== undefined) {
          if (updates.presentation.theme !== undefined)
            get().updateTheme(updates.presentation.theme)
          if (updates.presentation.themeConfig !== undefined) {
            const data = updates.presentation.themeConfig
            set(state => ({
              presentation: {
                ...state.presentation,
                themeConfig: data as AtomicThemeConfig,
              },
            }))
          }
          if (updates.presentation.sectionDistribution !== undefined)
            get().updateSectionDistribution(updates.presentation.sectionDistribution)
        }
      },

      clearResume: () => {
        usePersonalInfoStore.getState().reset()
        useWorkExperienceStore.getState().reset()
        useSkillStore.getState().reset()
        useProjectExperienceStore.getState().reset()
        useSectionStore.getState().reset()
        set({
          presentation: {
            theme: DEFAULT_RESUME_THEME,
            themeConfig: THEME_PRESETS[0].config,
            sectionDistribution: {},
          },
        })
      },

      computeResumeHash: data => JSON.stringify(data),

      getSectionDistribution: () => {
        const distribution = get().presentation.sectionDistribution
        return distribution || DEFAULT_SECTION_DISTRIBUTION
      },

      updateSectionDistribution: (distribution: SectionDistribution) =>
        set(state => ({
          presentation: {
            ...state.presentation,
            sectionDistribution: distribution,
          },
        })),

      updateResumeList: resumeList => set({ resumeList }),

      exportToJSON: () => {
        const resumeData = get().getResume()
        return JSON.stringify(sanitizeResume(resumeData), null, 2)
      },
      importFromJSON: (content: string) => {
        const data = JSON.parse(content)
        const result = validateResume(data)
        if (result.success)
          get().updateResume(data)
        return result.success
      },

      selectPreset: (presetId: string) => {
        const preset = THEME_PRESETS.find(p => p.id === presetId)
        if (!preset)
          return

        set(state => ({
          presentation: {
            ...state.presentation,
            theme: presetId,
            themeConfig: preset.config,
          },
        }))
      },

      updateThemeConfig: <K extends keyof AtomicThemeConfig>(
        key: K,
        value: AtomicThemeConfig[K],
      ) => set((state) => {
        const nextThemeConfig = {
          ...state.presentation.themeConfig,
          [key]: value,
        } as AtomicThemeConfig

        if (key === 'layout') {
          return {
            presentation: {
              ...state.presentation,
              themeConfig: nextThemeConfig,
              sectionDistribution: sectionDistributionForLayout(
                value as AtomicThemeConfig['layout'],
                state.presentation.sectionDistribution,
                DEFAULT_SECTION_DISTRIBUTION,
              ),
            },
          }
        }

        return {
          presentation: {
            ...state.presentation,
            themeConfig: nextThemeConfig,
          },
        }
      }),

      resetThemeConfig: () => {
        const presetId = get().presentation.theme
        const preset = THEME_PRESETS.find(p => p.id === presetId)
        if (!preset)
          return

        set(state => ({
          presentation: {
            ...state.presentation,
            themeConfig: preset.config,
          },
        }))
      },

      updateResumeName: (name: string) => {
        set({ resumeName: name })
      },

      save: async () => {
        const state = get()
        const resumeData = state.getResume()

        try {
          set({ saving: true })
          const result = await saveResumes({
            id: state.id || undefined,
            resumeName: state.resumeName || undefined,
            resume: resumeData,
          })

          set({ id: result.id })
          return { success: true }
        }
        catch (error: unknown) {
          if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
            return { success: false, notFound: true }
          }
          const errorMessage = error && typeof error === 'object' && 'message' in error
            ? String(error.message)
            : 'Save failed'
          return { success: false, error: errorMessage }
        }
        finally {
          set({ saving: false })
        }
      },
    }),
    {
      name: `${APPLICATION_NAME}-resume`,
      partialize: state => ({
        id: state.id,
        resumeName: state.resumeName,
        presentation: state.presentation,
      }),
    },
  ),
)

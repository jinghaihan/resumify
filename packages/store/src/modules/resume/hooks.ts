import { usePersonalInfoStore } from '../personal-info'
import { useProjectExperienceStore } from '../project-experience'
import { useSectionStore } from '../section'
import { useSkillStore } from '../skill'
import { useWorkExperienceStore } from '../work-experience'
import { useResumeStore } from './store'

export function useResume() {
  const presentation = useResumeStore(state => state.presentation)

  const name = usePersonalInfoStore(state => state.name)
  const jobObjective = usePersonalInfoStore(state => state.jobObjective)
  const photoUrl = usePersonalInfoStore(state => state.photoUrl)
  const photoShape = usePersonalInfoStore(state => state.photoShape)
  const personalInfo = usePersonalInfoStore(state => state.personalInfo)
  const socialLinks = usePersonalInfoStore(state => state.socialLinks)

  const skills = useSkillStore(state => state.skills)
  const workExperiences = useWorkExperienceStore(state => state.workExperiences)
  const projectExperiences = useProjectExperienceStore(state => state.projectExperiences)
  const sections = useSectionStore(state => state.sections)

  return {
    name,
    jobObjective,
    photoUrl,
    photoShape,
    personalInfo,
    socialLinks,
    skills,
    workExperiences,
    projectExperiences,
    sections,
    presentation,
  }
}

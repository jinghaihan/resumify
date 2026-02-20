'use client'

import { ChatBot } from '@resumify/chatbot'
import { PostMessageEvent } from '@resumify/shared'
import { cn } from '@resumify/shared/utils'
import { useEffect, useState } from 'react'
import { CustomSectionPanel } from '../custom-section'
import { SettingsPanel } from '../export-settings'
import { ModelProviderPanel } from '../model-provider'
import { PersonalInfoPanel } from '../personal-info'
import { ProjectExperiencePanel } from '../project-experience'
import { ResumeList } from '../resume-list'
import { ShareList } from '../share-list'
import { SkillPanel } from '../skill'
import { ThemePanel } from '../theme'
import { WorkExperiencePanel } from '../work-experience'
import { Navigation } from './navigation'

export function Sidebar() {
  const [activeId, setActiveId] = useState<string>('personal-info')
  const [chatMounted, setChatMounted] = useState(activeId === 'chat')

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin)
        return
      if (event.data.type === PostMessageEvent.NavigateToShareList)
        setActiveId('share-list')
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handleNavigate = (id: string) => {
    setActiveId(id)
    if (id === 'chat')
      setChatMounted(true)
  }

  return (
    <div className="flex size-full">
      <Navigation onChange={handleNavigate} />

      <div className="h-full flex-1 overflow-x-hidden overflow-y-auto p-4">
        {activeId === 'personal-info' && (
          <PersonalInfoPanel />
        )}
        {activeId === 'skill' && (
          <SkillPanel />
        )}
        {activeId === 'work-experience' && (
          <WorkExperiencePanel />
        )}
        {activeId === 'project-experience' && (
          <ProjectExperiencePanel />
        )}
        {activeId === 'section' && (
          <CustomSectionPanel />
        )}
        {activeId === 'theme' && (
          <ThemePanel />
        )}
        {activeId === 'settings' && (
          <SettingsPanel />
        )}
        {activeId === 'model-provider' && (
          <ModelProviderPanel />
        )}
        {activeId === 'resume-list' && (
          <ResumeList />
        )}
        {activeId === 'share-list' && (
          <ShareList />
        )}
        {chatMounted && (
          <div className={cn('h-full', activeId !== 'chat' && 'hidden')}>
            <ChatBot />
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar

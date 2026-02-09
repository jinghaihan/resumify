'use client'

import { authClient } from '@resumify/auth'
import { cn } from '@resumify/shared'
import { IconButton } from '@resumify/ui'
import { Separator } from '@shadcn/components/ui/separator'
import {
  BlocksIcon,
  BotIcon,
  BriefcaseBusinessIcon,
  FilesIcon,
  HistoryIcon,
  LightbulbIcon,
  MessageCircleMoreIcon,
  Settings2Icon,
  Share2Icon,
  SwatchBookIcon,
  UserIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface NavigationProps {
  onChange: (id: string) => void
}

export function Navigation({ onChange }: NavigationProps) {
  const t = useTranslations()
  const { data: session } = authClient.useSession()
  const [activeId, setActiveId] = useState<string>('personal-info')

  const navigationItems: Omit<NavigationItemProps, 'onClick' | 'activeId'>[] = [
    {
      id: 'personal-info',
      icon: <UserIcon />,
      name: t('navigation.personal-info'),
    },
    {
      id: 'skill',
      icon: <LightbulbIcon />,
      name: t('navigation.skill'),
    },
    {
      id: 'work-experience',
      icon: <BriefcaseBusinessIcon />,
      name: t('navigation.work-experience'),
    },
    {
      id: 'project-experience',
      icon: <HistoryIcon />,
      name: t('navigation.project-experience'),
    },
    {
      id: 'section',
      icon: <BlocksIcon />,
      name: t('navigation.section'),
    },
    {
      id: 'theme',
      icon: <SwatchBookIcon />,
      name: t('navigation.theme'),
    },
    {
      id: 'settings',
      icon: <Settings2Icon />,
      name: t('navigation.settings'),
    },
  ]

  const chatNavigationItems: Omit<NavigationItemProps, 'onClick' | 'activeId'>[] = [
    {
      id: 'model-provider',
      icon: <BotIcon />,
      name: t('navigation.model-provider'),
    },
    {
      id: 'chat',
      icon: <MessageCircleMoreIcon />,
      name: t('navigation.chat'),
    },
  ]

  const listNavigationItems: Omit<NavigationItemProps, 'onClick' | 'activeId'>[] = [
    {
      id: 'resume-list',
      icon: <FilesIcon />,
      name: t('navigation.resumes'),
    },
    {
      id: 'share-list',
      icon: <Share2Icon />,
      name: t('navigation.shares'),
    },
  ]

  const handleChange = (id: string) => {
    setActiveId(id)
    onChange(id)
  }

  return (
    <div className="
      flex h-full w-12 flex-col items-center gap-2 border-r border-border py-2
      text-muted-foreground
    "
    >
      <div className="flex flex-col gap-2">
        {navigationItems.map(item => (
          <NavigationItem
            id={item.id}
            key={item.id}
            name={item.name}
            activeId={activeId}
            icon={item.icon}
            onClick={() => handleChange(item.id)}
          />
        ))}
      </div>

      {session?.user && (
        <>
          <Separator orientation="horizontal" className="my-1" />

          <div className="flex flex-col gap-2">
            {listNavigationItems.map(item => (
              <NavigationItem
                id={item.id}
                key={item.id}
                name={item.name}
                activeId={activeId}
                icon={item.icon}
                onClick={() => handleChange(item.id)}
              />
            ))}
          </div>
        </>
      )}

      <Separator orientation="horizontal" className="my-1" />

      <div className="flex flex-col gap-2">
        {chatNavigationItems.map(item => (
          <NavigationItem
            id={item.id}
            key={item.id}
            name={item.name}
            activeId={activeId}
            icon={item.icon}
            onClick={() => handleChange(item.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface NavigationItemProps {
  id: string
  name: string
  icon: React.ReactNode
  onClick: (id: string) => void
  activeId: string
}

function NavigationItem({ id, name, icon, activeId, onClick }: NavigationItemProps) {
  return (
    <IconButton
      className={cn(
        `
          transition-all duration-150
          hover:scale-110
        `,
        activeId === id && 'bg-sidebar-accent! text-foreground',
      )}
      tooltipSide="right"
      key={id}
      icon={icon}
      title={name}
      onClick={() => onClick(id)}
    />
  )
}

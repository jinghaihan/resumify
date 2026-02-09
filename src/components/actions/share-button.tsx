'use client'

import type { ModalRef } from '@resumify/ui'
import { authClient } from '@resumify/auth'
import { PostMessageEvent, useClipboard } from '@resumify/shared'
import { useResumeStore } from '@resumify/store'
import { Confirm, IconButton } from '@resumify/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shadcn/components/ui/dropdown-menu'
import { CheckIcon, Share2Icon } from 'lucide-react'
import LZString from 'lz-string'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import { toast } from 'sonner'

import { ShareFormModal } from '../share-list/share-form-modal'

export function ShareButton() {
  const t = useTranslations()

  const { data: session } = authClient.useSession()
  const store = useResumeStore()

  const [copy, copied] = useClipboard()

  const createDialogRef = useRef<ModalRef>(null)

  const handleCopyDataLink = () => {
    const compressed = LZString.compressToEncodedURIComponent(store.exportToJSON())
    const url = `${window.location.origin}/share/data?data=${compressed}`
    copy(url)
    toast.success(t('message.copy-success'))
  }

  const navigateToShareList = () => {
    window.postMessage({ type: PostMessageEvent.NavigateToShareList }, window.location.origin)
  }

  return (
    <>
      {session?.user
        ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  icon={copied ? <CheckIcon /> : <Share2Icon />}
                  title={t('share-button.title')}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto min-w-[160px]">
                <DropdownMenuItem onClick={() => createDialogRef.current?.open()}>
                  {t('share-button.create-link')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={navigateToShareList}>
                  {t('share-button.view-links')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Confirm
                  title={t('share-button.data-link-confirm.title')}
                  description={t('share-button.data-link-confirm.description')}
                  onConfirm={handleCopyDataLink}
                >
                  <DropdownMenuItem onSelect={e => e.preventDefault()}>
                    {t('share-button.data-link')}
                  </DropdownMenuItem>
                </Confirm>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        : (
            <Confirm
              title={t('share-button.data-link-confirm.title')}
              description={t('share-button.data-link-confirm.description')}
              onConfirm={handleCopyDataLink}
            >
              <IconButton
                icon={copied ? <CheckIcon /> : <Share2Icon />}
                title={t('share-button.title')}
              />
            </Confirm>
          )}

      {session?.user && (
        <ShareFormModal
          ref={createDialogRef}
          mode="create"
          onUpdate={navigateToShareList}
        />
      )}
    </>
  )
}

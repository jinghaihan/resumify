import type { ResultStatus } from './result'
import { Icon } from '@iconify/react'
import { searchIcons } from '@resumify/api'
import { cn } from '@resumify/shared'
import { Button } from '@shadcn/components/ui/button'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { InputSearch } from './input-search'
import { Modal } from './modal'
import { Result } from './result'

interface IconPickerProps {
  icon?: string
  className?: string
  onConfirm: (icon: string | undefined) => void
}

export function IconPicker({ icon, className, onConfirm }: IconPickerProps) {
  const t = useTranslations()
  const [selected, setSelected] = useState<string | undefined>(icon)
  const [list, setList] = useState<string[]>([])
  const [status, setStatus] = useState<ResultStatus | null>('empty')

  const handleConfirm = () => {
    onConfirm(selected)
  }

  const handleSearch = async (name: string) => {
    const query = name.trim()
    if (!query) {
      setList([])
      setStatus('empty')
      return
    }

    setStatus('loading')
    try {
      const data = await searchIcons({ query })
      setList(data.icons)
      if (!data.icons)
        setStatus('empty')
      else
        setStatus(null)
    }
    catch {
      setList([])
      setStatus('error')
    }
  }

  return (
    <Modal
      title={t('icon-picker.title')}
      description={t('icon-picker.description')}
      width={600}
      confirmText={t('button.select')}
      trigger={(
        <Button variant="ghost" size="icon" className={className}>
          <Icon
            icon={icon || 'lucide:image'}
            className="size-3.5 text-muted-foreground"
          />
        </Button>
      )}
      onConfirm={handleConfirm}
    >
      <InputSearch
        placeholder={t('icon-picker.placeholder')}
        onSearch={handleSearch}
      />

      {status && (
        <Result className="h-96" status={status} />
      )}

      {!status && <IconPickerList list={list} selected={selected} setSelected={setSelected} />}
    </Modal>
  )
}

function IconPickerList({ list, selected, setSelected }: {
  list: string[]
  selected?: string
  setSelected: (icon: string) => void
}) {
  return (
    <div className="
      grid h-96 grid-cols-6 gap-2 overflow-y-auto
      md:grid-cols-8
      lg:grid-cols-10
    "
    >
      {list.map((data) => {
        return (
          <button
            key={data}
            className={cn(
              `
                group relative flex aspect-square w-full cursor-pointer
                items-center justify-center rounded-md transition-all
                hover:bg-muted
              `,
              data === selected && 'bg-muted',
            )}
            onClick={() => setSelected(data)}
          >
            <Icon
              icon={data}
              className="
                size-8 text-muted-foreground transition-transform
                group-hover:scale-110
              "
            />
          </button>
        )
      })}
    </div>
  )
}

import { RefreshCcwIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Confirm } from './confirm'
import { IconButton } from './icon-button'

interface ResetButtonProps {
  onConfirm: () => void
}

export function ResetButton({ onConfirm }: ResetButtonProps) {
  const t = useTranslations()
  return (
    <Confirm
      title={t('confirm.reset.title')}
      description={t('confirm.reset.description')}
      onConfirm={onConfirm}
    >
      <IconButton
        className="text-muted-foreground"
        icon={<RefreshCcwIcon />}
        title={t('button.reset')}
        tooltipSide="top"
      />
    </Confirm>

  )
}

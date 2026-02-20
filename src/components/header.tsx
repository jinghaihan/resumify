import { UserButton } from '@resumify/auth'
import { SnapshotButton } from '@resumify/chatbot'
import { APPLICATION_NAME, APPLICATION_VERSION } from '@resumify/shared'
import { DarkToggle, GitHubButton, LanguageSelector } from '@resumify/ui'
import { Separator } from '@shadcn/components/ui/separator'
import { ClearButton } from './actions/clear-button'
import { ExportButton } from './actions/export-button'
import { ImportButton } from './actions/import-button'
import { PrintButton } from './actions/print-button'
import { SaveButton } from './actions/save-button'
import { ShareButton } from './actions/share-button'

export function Header() {
  return (
    <header className="
      flex items-center justify-between border-b border-border px-4 py-2
    "
    >
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold capitalize">{APPLICATION_NAME}</h1>
        <small className="font-mono text-muted-foreground">
          v
          {APPLICATION_VERSION}
        </small>
      </div>

      <div className="flex items-center">
        <div className="mr-2 flex items-center gap-1 text-muted-foreground">
          <SnapshotButton />
          <ShareButton />
          <SaveButton />
          <Separator
            orientation="vertical"
            className="
              mx-2 h-6
              data-[orientation=vertical]:self-center
            "
          />
          <PrintButton />
          <ImportButton />
          <ExportButton />
          <ClearButton />
          <Separator
            orientation="vertical"
            className="
              mx-2 h-6
              data-[orientation=vertical]:self-center
            "
          />
          <LanguageSelector />
          <DarkToggle />
          <GitHubButton />
        </div>
        <UserButton size="icon" />
      </div>
    </header>
  )
}

import { APPLICATION_HOMEPAGE } from '@resumify/shared'
import { GithubIcon } from 'lucide-react'
import { IconButton } from './icon-button'

export function GitHubButton() {
  return (
    <IconButton
      icon={<GithubIcon />}
      title="GitHub"
      onClick={() => window.open(APPLICATION_HOMEPAGE, '_blank')}
    />
  )
}

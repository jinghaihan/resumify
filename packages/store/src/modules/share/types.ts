import type { DatabaseResumeListItem } from '@resumify/database'

export interface ShareState {
  shareList: DatabaseResumeListItem[]
}

export interface ShareActions {
  updateShareList: (list: DatabaseResumeListItem[]) => void
}

export type ShareStore = {} & ShareState & ShareActions

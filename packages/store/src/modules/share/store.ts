import type { ShareStore } from './types'
import { create } from 'zustand'

export const useShareStore = create<ShareStore>()(
  set => ({
    shareList: [],

    updateShareList: list => set({ shareList: list }),
  }),
)

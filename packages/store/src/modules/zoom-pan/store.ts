import type { ZoomPanStore } from './types'
import { create } from 'zustand'

export const useZoomPanStore = create<ZoomPanStore>()(
  set => ({
    zoom: 1,
    dragEnabled: false,

    updateZoom: zoom => set({ zoom }),
    updateDragEnabled: dragEnabled => set({ dragEnabled }),
    toggleDragEnabled: () => set(state => ({ dragEnabled: !state.dragEnabled })),
  }),
)

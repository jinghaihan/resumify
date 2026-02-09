export interface ZoomPanState {
  zoom: number
  dragEnabled: boolean
}

export interface ZoomPanActions {
  updateZoom: (zoom: number) => void
  updateDragEnabled: (dragEnabled: boolean) => void
  toggleDragEnabled: () => void
}

export type ZoomPanStore = {} & ZoomPanState & ZoomPanActions

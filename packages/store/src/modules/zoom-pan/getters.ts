import { useZoomPanStore } from './store'

export function zoom() {
  return useZoomPanStore.getState().zoom
}

export function dragEnabled() {
  return useZoomPanStore.getState().dragEnabled
}

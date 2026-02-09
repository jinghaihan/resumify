import { useCallback, useEffect, useRef, useState } from 'react'

export const ZOOM_MIN = 0.25
export const ZOOM_MAX = 3.0
export const ZOOM_STEP = 0.1
export const ZOOM_PADDING = 32

function isInputElement(target: HTMLElement): boolean {
  return target.tagName === 'INPUT'
    || target.tagName === 'TEXTAREA'
    || target.isContentEditable
}

export function useZoomContainer() {
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const calculateFitZoom = () => {
    if (!containerRef.current || !contentRef.current)
      return

    const container = containerRef.current
    const content = contentRef.current.firstElementChild as HTMLElement

    if (!content)
      return

    const containerWidth = container.clientWidth
    const contentWidth = content.offsetWidth
    const availableWidth = containerWidth - ZOOM_PADDING * 2
    const fitZoom = availableWidth / contentWidth

    if (fitZoom < 1)
      setZoom(Math.max(ZOOM_MIN, fitZoom))
  }

  useEffect(() => {
    calculateFitZoom()
    window.addEventListener('resize', calculateFitZoom)
    return () => window.removeEventListener('resize', calculateFitZoom)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container)
      return

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = -e.deltaY
        const zoomChange = (delta / 10) * ZOOM_STEP

        setZoom(prev => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, prev + zoomChange)))
      }
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    return () => container.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (isInputElement(target))
        return

      if (e.code === 'Space') {
        e.preventDefault()
        if (!isSpacePressed)
          setIsSpacePressed(true)
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (isInputElement(target))
        return

      if (e.code === 'Space') {
        e.preventDefault()
        setIsSpacePressed(false)
        setIsPanning(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [isSpacePressed])

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + ZOOM_STEP, ZOOM_MAX))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - ZOOM_STEP, ZOOM_MIN))
  }, [])

  const handleReset = useCallback(() => {
    setZoom(1)
    setPanOffset({ x: 0, y: 0 })
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isSpacePressed) {
      setIsPanning(true)
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
    }
  }, [isSpacePressed, panOffset])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }, [isPanning, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsPanning(false)
  }, [])

  const cursorStyle = isSpacePressed ? (isPanning ? 'grabbing' : 'grab') : 'default'

  return {
    zoom,
    containerRef,
    contentRef,
    panOffset,
    isPanning,
    cursorStyle,
    handleZoomIn,
    handleZoomOut,
    handleReset,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  }
}

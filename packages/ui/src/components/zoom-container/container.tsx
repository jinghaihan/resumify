import type { ReactNode } from 'react'
import { cn } from '@resumify/shared'
import { useZoomContainer, ZOOM_PADDING } from './hooks'
import { ZoomContainerToolbar } from './toolbar'

interface ZoomContainerProps {
  children: ReactNode
  className?: string
}

export function ZoomContainer({ children, className }: ZoomContainerProps) {
  const {
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
  } = useZoomContainer()

  const zoomPercentage = Math.round(zoom * 100)

  return (
    <div className={cn('relative size-full', className)}>
      <div
        ref={containerRef}
        className="h-full overflow-auto"
        style={{
          cursor: cursorStyle,
          userSelect: isPanning ? 'none' : 'auto',
          overflow: isPanning ? 'hidden' : 'auto',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={contentRef}
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: 'top center',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out',
            padding: ZOOM_PADDING,
          }}
        >
          {children}
        </div>
      </div>

      <ZoomContainerToolbar
        className="absolute right-6 bottom-6"
        percentage={zoomPercentage}
        isPanning={isPanning}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />
    </div>
  )
}

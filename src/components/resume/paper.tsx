import { getPaperDimensions } from '@resumify/shared'
import { useExportStore } from '@resumify/store'
import { useMemo } from 'react'

export function Paper({ children }: { children: React.ReactNode }) {
  const settings = useExportStore(state => state.settings)

  const paperStyle = useMemo(() => {
    const { format, landscape, preferCSSPageSize, printBackground } = settings

    const dimensions = getPaperDimensions(format, landscape)

    return {
      width: preferCSSPageSize ? 'auto' : `${dimensions.width}px`,
      minHeight: preferCSSPageSize ? 'auto' : `${dimensions.height}px`,
      padding: '0',
      transformOrigin: 'top center',
      backgroundColor: printBackground ? 'white' : 'transparent',
    }
  }, [settings])

  return (
    <div style={paperStyle} className="light mx-auto bg-white shadow-lg">
      {children}
    </div>
  )
}

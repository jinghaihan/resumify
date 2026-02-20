'use client'

import { exportSettings as exportSettingsGetter, useExportStore } from '@resumify/store'
import { Header, ResetButton } from '@resumify/ui'
import { useTranslations } from 'next-intl'
import { Accessibility } from './accessibility'
import { DisplayOptions } from './display-options'
import { Margins } from './margins'
import { PageFormat } from './page-format'
import { ScaleAndPages } from './scale-and-pages'

export function SettingsPanel() {
  const t = useTranslations()
  const store = useExportStore()

  const settings = exportSettingsGetter()

  return (
    <div className="space-y-4">
      {/* Header */}
      <Header
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
        action={<ResetButton onConfirm={() => store.reset()} />}
      />

      {/* Page Format */}
      <PageFormat
        format={settings.format}
        landscape={settings.landscape}
        preferCSSPageSize={settings.preferCSSPageSize}
        onFormatChange={format => store.updateSettings({ format })}
        onLandscapeChange={landscape => store.updateSettings({ landscape })}
        onPreferCSSPageSizeChange={preferCSSPageSize => store.updateSettings({ preferCSSPageSize })}
      />

      {/* Margins */}
      <Margins
        margin={settings.margin}
        onMarginChange={margin => store.updateMargin(margin)}
      />

      {/* Scale and Page Ranges */}
      <ScaleAndPages
        scale={settings.scale}
        pageRanges={settings.pageRanges}
        onScaleChange={scale => store.updateSettings({ scale })}
        onPageRangeChange={pageRange => store.updatePageRange(pageRange)}
      />

      {/* Display Options */}
      <DisplayOptions
        printBackground={settings.printBackground}
        omitBackground={settings.omitBackground}
        displayHeaderFooter={settings.displayHeaderFooter}
        onPrintBackgroundChange={printBackground => store.updateSettings({ printBackground })}
        onOmitBackgroundChange={omitBackground => store.updateSettings({ omitBackground })}
        onDisplayHeaderFooterChange={displayHeaderFooter => store.updateSettings({ displayHeaderFooter })}
      />

      {/* Accessibility */}
      <Accessibility
        tagged={settings.tagged}
        outline={settings.outline}
        onTaggedChange={tagged => store.updateSettings({ tagged })}
        onOutlineChange={outline => store.updateSettings({ outline })}
      />
    </div>
  )
}

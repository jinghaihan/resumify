import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./packages/i18n/src/request.ts')

export default withNextIntl({
  transpilePackages: [
    '@resumify/ai',
    '@resumify/api',
    '@resumify/auth',
    '@resumify/chatbot',
    '@resumify/database',
    '@resumify/i18n',
    '@resumify/shadcn',
    '@resumify/shared',
    '@resumify/store',
    '@resumify/themes',
    '@resumify/ui',
  ],
  serverExternalPackages: ['@sparticuz/chromium-min', 'puppeteer-core'],
  outputFileTracingIncludes: {
    '**': ['./fonts/**/*'],
  },
})

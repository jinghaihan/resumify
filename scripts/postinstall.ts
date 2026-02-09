import { Buffer } from 'node:buffer'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootPath = dirname(__dirname)

async function downloadCJKFonts() {
  const fontsPath = join(rootPath, 'fonts')

  if (!existsSync(fontsPath))
    mkdirSync(fontsPath, { recursive: true })

  const fonts = [
    {
      url: 'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/OTC/NotoSansCJK-Regular.ttc',
      dest: join(fontsPath, 'NotoSansCJK-Regular.ttc'),
    },
    {
      url: 'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/OTC/NotoSansCJK-Bold.ttc',
      dest: join(fontsPath, 'NotoSansCJK-Bold.ttc'),
    },
    {
      url: 'https://raw.githubusercontent.com/googlefonts/noto-emoji/main/fonts/NotoColorEmoji.ttf',
      dest: join(fontsPath, 'NotoColorEmoji.ttf'),
    },
  ]

  for (const font of fonts) {
    if (!existsSync(font.dest)) {
      const res = await fetch(font.url, {
        redirect: 'follow',
      })
      const buffer = Buffer.from(await res.arrayBuffer())
      await writeFile(font.dest, buffer)
    }
  }
}

function packChromium() {
  const path = import.meta.resolve('@sparticuz/chromium')
  const chromiumPath = path.replace(/^file:\/\//, '')
  const binPath = join(resolve(chromiumPath, '../../..'), 'bin')

  if (!existsSync(binPath)) {
    console.error('@sparticuz/chromium bin directory not found')
    process.exit(1)
  }

  const publicPath = join(rootPath, 'public')
  const outputPath = join(publicPath, 'chromium-pack.tar')

  if (existsSync(outputPath))
    return

  execSync(`mkdir -p ${publicPath} && tar -cf "${outputPath}" -C "${binPath}" .`, {
    stdio: 'inherit',
    cwd: rootPath,
  })
}

async function postinstall() {
  if (process.env.VERCEL) {
    await downloadCJKFonts()
    packChromium()
  }
}

postinstall()

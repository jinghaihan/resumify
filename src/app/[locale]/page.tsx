'use client'

import { ResizableLayout, SquaresGrid } from '@resumify/ui'
import dynamic from 'next/dynamic'
import { Header } from '@/components/header'
import '@/assets/editor.css'

const Sidebar = dynamic(() => import('@/components/sidebar'), { ssr: false })
const ResumePreviewer = dynamic(() => import('@/components/resume/previewer'), { ssr: false })

export default function Page() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <ResizableLayout sidebar={<Sidebar />}>
        <SquaresGrid>
          <ResumePreviewer />
        </SquaresGrid>
      </ResizableLayout>
    </div>
  )
}

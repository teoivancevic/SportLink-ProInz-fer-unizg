'use client'

import { useState } from 'react'
import NavMenu from '@/components/nav-org-profile'
import PageContent from './page-content'

export default function Home() {
  const [activePage, setActivePage] = useState('informacije')

  return (
    <div className="flex flex-col min-h-screen">
      <NavMenu onSelectPage={setActivePage} />
      <main className="flex-grow container mx-auto mt-8 px-4">
        <PageContent activePage={activePage} />
      </main>
    </div>
  )
}


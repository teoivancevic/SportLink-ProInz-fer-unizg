'use client'

import { useState } from 'react'

const menuItems = [
  { id: 'informacije', label: 'Informacije' },
  { id: 'klubovi', label: 'Klubovi' },
  { id: 'termini', label: 'Termini' },
  { id: 'natjecanja', label: 'Natjecanja' },
]

export default function NavMenu({ onSelectPage }: { onSelectPage: (id: string) => void }) {
  const [activePage, setActivePage] = useState('informacije')

  const handleClick = (id: string) => {
    setActivePage(id)
    onSelectPage(id)
  }

  return (
    <nav className="w-full border-b bg-white shadow-sm">
      <div className="container flex h-14 items-center justify-center">
        <ul className="flex items-center space-x-6">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className={`px-3 py-2 text-sm transition-colors hover:text-primary ${
                  activePage === item.id
                    ? 'font-medium text-primary border-b-2 border-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}


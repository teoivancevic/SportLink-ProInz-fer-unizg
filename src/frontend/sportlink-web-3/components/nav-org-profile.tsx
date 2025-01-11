'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/organization', label: 'Profil organizacije' },
  { href: '/organization/training-groups', label: 'Grupni treninzi' },
  { href: '/organization/sport-courts', label: 'Sportski tereni' },
  { href: '/organization/tournaments', label: 'Natjecanja' },
]

export default function NavMenu() {
  const pathname = usePathname()

  return (
    <nav className="w-full border-b bg-white shadow-sm">
      <div className="container flex h-14 items-center justify-center">
        <ul className="flex items-center space-x-6">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-3 py-2 text-sm transition-colors hover:text-primary ${
                  pathname === item.href
                    ? 'font-medium text-primary border-b-2 border-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}



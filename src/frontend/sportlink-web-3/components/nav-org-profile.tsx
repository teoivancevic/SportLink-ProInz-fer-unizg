'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavMenu({ orgId }: { orgId: number }){

  const menuItems = [
    { href: `/organization/${orgId}`, label: 'Profil organizacije' },
    { href: `/organization/${orgId}/training-groups`, label: 'Grupni treninzi' },
    { href: `/organization/${orgId}/sport-courts`, label: 'Sportski tereni' },
    { href: `/organization/${orgId}/tournaments`, label: 'Natjecanja' },
  ]

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



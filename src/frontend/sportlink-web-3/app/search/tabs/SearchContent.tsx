'use client'

import { useSearchParams } from 'next/navigation'
import GroupsSearch from './GrupeSearch'
import CompetitionsSearch from './NatjecanjaSearch'
import BookingsSearch from './TerminiSearch'

export default function SearchContent() {
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'groups'

  switch (currentTab) {
    case 'groups':
      return <GroupsSearch />
    case 'competitions':
      return <CompetitionsSearch />
    case 'bookings':
      return <BookingsSearch />
    default:
      return <div>Invalid tab selected</div>
  }
}
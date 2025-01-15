"use client"

import AuthorizedElement from '@/components/auth/authorized-element'
import { UserRole } from '@/types/roles'

import * as React from "react"
import {
  Command,
  GalleryVerticalEnd,
  Home,
  UsersRound,
  Building2,
  Search,
  Building,
  Star,
  LayoutDashboard,
  AudioWaveform
} from "lucide-react"

import Link from 'next/link'

import { NavMain } from "@/components/nav-main"
// import { NavAppAdmin } from "@/components/nav-app-admin"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { OrganizationSwitcher } from "./organization-switcher"
import { Button } from './ui/button'
import UnauthorizedElement from './auth/unauthorized-element'
import { useCallback, useEffect, useState } from 'react'
import { orgService } from '@/lib/services/api'
import { GetOrganizationResponse, Organization } from '@/types/org'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth/auth-context'
// import router from 'next/natigation'

const ACTIVE_ORG_KEY = 'activeOrganizationId'
const ORG_CACHE_KEY = 'cachedOrganizations'
const ORG_CACHE_TIMESTAMP_KEY = 'organizationsCacheTimestamp'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const data = {
  // organizations: [
  //   {
  //     name: "Acme Inc",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  //   {
  //     name: "Acme Corp.",
  //     logo: AudioWaveform,
  //     plan: "Startup",
  //   },
  //   {
  //     name: "Evil Corp.",
  //     logo: Command,
  //     plan: "Free",
  //   },
  // ],
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
      items: []
    },
    {
      title: "Pretraživanje",
      // url: "/search",
      icon: Search,
      isActive: true,
      items: [
        {
          title: "Grupe treninga",
          url: "/search?tab=groups",
        },
        {
          title: "Natjecanja",
          url: "/search?tab=competitions",
        },
        {
          title: "Termini",
          url: "/search?tab=bookings",
        },
      ],
    },
    
  ],
  // navOrgOwner: [
  //   {
  //     title: "Profil",
  //     url: "/organizations/1",
  //     icon: Building,
  //     isActive: true,
  //     items: []
  //   },
  //   {
  //     title: "Recenzije",
  //     url: "/organizations/1/reviews",
  //     icon: Star,
  //     isActive: true,
  //     items: []
  //   }
  // ],
  navAppAdmin: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Korisnici",
      url: "/users",
      icon: UsersRound,
      isActive: true,
      items: [],
    },
    {
      title: "Organizacije",
      url: "#",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: "Potvrđene",
          url: "/organizations/confirmed",
        },
        {
          title: "Nepotvrđene",
          url: "/organizations/unconfirmed",
        },
      ],
    }
  ],
  navAddOrg: [
    {
      title: "Dodaj organizaciju",
      url: "/organizations/create",
      icon: Building,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [myOrganizations, setOrganizations] = useState<Organization[]>([])
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null)
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true)
  const router = useRouter()
  const { userData } = useAuth()

  const fetchMyOrganizations = useCallback(async () => {
    try {
      // Check cache first
      const cachedData = localStorage.getItem(ORG_CACHE_KEY)
      const cacheTimestamp = localStorage.getItem(ORG_CACHE_TIMESTAMP_KEY)
      
      if (cachedData && cacheTimestamp) {
        const timestamp = parseInt(cacheTimestamp)
        if (Date.now() - timestamp < CACHE_DURATION) {
          setOrganizations(JSON.parse(cachedData))
          setIsLoadingOrgs(false)
          return
        }
      }

      const response: GetOrganizationResponse = await orgService.getMyOrganizations()
      setOrganizations(response.data)
      
      // Update cache
      localStorage.setItem(ORG_CACHE_KEY, JSON.stringify(response.data))
      localStorage.setItem(ORG_CACHE_TIMESTAMP_KEY, Date.now().toString())
    } catch (error) {
      console.error('Error fetching organizations:', error)
    } finally {
      setIsLoadingOrgs(false)
    }
  }, [])

  useEffect(() => {
    if (userData?.role === UserRole.OrganizationOwner) {
      fetchMyOrganizations()
    } else {
      setIsLoadingOrgs(false)
    }
  }, [userData, fetchMyOrganizations])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedOrgId = localStorage.getItem(ACTIVE_ORG_KEY)
    setActiveOrgId(savedOrgId)

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ACTIVE_ORG_KEY) {
        setActiveOrgId(e.newValue)
      }
    }

    const handleOrgChange = (e: CustomEvent<{ orgId: string }>) => {
      setActiveOrgId(e.detail.orgId)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('organizationChange', handleOrgChange as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('organizationChange', handleOrgChange as EventListener)
    }
  }, [])

  const navigateLogin = () => router.push('/login')
  const navigateSignup = () => router.push('/signup')

  // Create dynamic nav items based on activeOrgId
  const getOrgOwnerNavItems = () => [
    {
      title: "Profil",
      url: `/organization/${activeOrgId || ''}`,
      icon: Building,
      isActive: true,
      items: []
    },
    {
      title: "Recenzije",
      url: `/organization/${activeOrgId || ''}/reviews`,
      icon: Star,
      isActive: true,
      items: []
    }
  ]

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('authToken');
    // setUserData(null); // Clear user data from state
    setActiveOrgId(null); // Clear active organization ID
    //router.push('/logout'); // Redirect to logout page
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="h-[66px] flex items-center justify-center">
  <div className="relative w-[200px] h-[50px]">
    <Link href="/" className="block w-full h-full">
      <Image
        src="/logo-sportlink.png"
        alt="Logo"
        fill
        priority
        sizes="200px"
        className="object-contain"
        style={{
          minHeight: '50px',
          minWidth: '200px'
        }}
      />
    </Link>
  </div>
</SidebarHeader>
      <SidebarContent className="flex flex-col flex-grow">
        <div className="flex-grow">
          <NavMain navTitle="SportLink" items={data.navMain} />
          
          <AuthorizedElement roles={[UserRole.OrganizationOwner]}>
            {({ userData }) => (
              <NavMain 
                navTitle={`Moja organizacija${activeOrgId ? `: ${activeOrgId}` : ''}`} 
                items={getOrgOwnerNavItems()} 
              />
            )}
          </AuthorizedElement>
          
          <AuthorizedElement roles={[UserRole.AppAdmin]}>
            {({ userData }) => (
              <NavMain navTitle="App Admin" items={data.navAppAdmin} />
            )}
          </AuthorizedElement>
        </div>
        
        {/* Secondary navigation at the bottom of content */}
        <AuthorizedElement roles={[UserRole.User]}>
          {({ userData }) => (
                <NavSecondary items={data.navAddOrg} className='mt-auto'/>
              )
            }
        </AuthorizedElement>
      </SidebarContent>

      <SidebarFooter>
      <AuthorizedElement roles={[UserRole.OrganizationOwner]}>
          {({ userData }) => (

            <OrganizationSwitcher organizations={myOrganizations} isLoading={isLoadingOrgs} />

          )}
        </AuthorizedElement>

        <UnauthorizedElement>
          <div className="flex gap-2">
            <Button variant='outline' size='sm' onClick={navigateLogin} className="flex-1">Prijava</Button>
            <Button color='primary' size='sm' onClick={navigateSignup} className="flex-1">Registracija</Button>
          </div>
        </UnauthorizedElement>

        <AuthorizedElement>
          {({ userData }) => (
            <NavUser 
              user={{
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                avatar: ""
              }} 
            />
          )}
        </AuthorizedElement>
        
      </SidebarFooter>
    </Sidebar>
  )
}


// AAAAAAAAAA



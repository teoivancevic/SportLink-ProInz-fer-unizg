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
import { useEffect, useState } from 'react'
import { orgService } from '@/lib/services/api'
import { GetOrganizationResponse, Organization } from '@/types/org'
import router from 'next/router'

const ACTIVE_ORG_KEY = 'activeOrganizationId'

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
      url: "/search",
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
  navSecondary: [
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
  
  useEffect(() => {
    // Initial load of active org ID
    const savedOrgId = localStorage.getItem(ACTIVE_ORG_KEY)
    setActiveOrgId(savedOrgId)

    // Set up event listeners for both storage and custom event
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ACTIVE_ORG_KEY) {
        setActiveOrgId(e.newValue)
      }
    }

    const handleOrgChange = (e: CustomEvent<{ orgId: string }>) => {
      setActiveOrgId(e.detail.orgId)
    }

    // Add both event listeners
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('organizationChange', handleOrgChange as EventListener)

    // Clean up both listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('organizationChange', handleOrgChange as EventListener)
    }
  }, [])

  const navigateLogin = () => {
    window.location.href = '/login'
  }
  const navigateSignup = () => {
    window.location.href = '/signup'
  }

  const fetchMyOrganizations = async () => {
    try {
      const response: GetOrganizationResponse = await orgService.getMyOrganizations()
      console.log(response);
      setOrganizations(response.data)

    } catch (error) {
      console.error('Error fetching organizations:', error)
      //setError('Došlo je do greške prilikom učitavanja organizacija.')
    } finally {
      //setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMyOrganizations()
  }, [])

  // Create dynamic nav items based on activeOrgId
  const getOrgOwnerNavItems = () => [
    {
      title: "Profil",
      url: `/organizations/${activeOrgId || ''}`,
      icon: Building,
      isActive: true,
      items: []
    },
    {
      title: "Recenzije",
      url: `/organizations/${activeOrgId || ''}/reviews`,
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
      <SidebarHeader>
        <a href="/">
          <Image src="/logo-sportlink.png" alt="Logo" width={200} height={50} />
        </a>
      </SidebarHeader>
      <SidebarContent className="flex flex-col flex-grow">
        <div className="flex-grow">
          <NavMain navTitle="SportLink" items={data.navMain} />
          
          <AuthorizedElement roles={[UserRole.OrganizationOwner]}>
            {({ userData }) => {

              return(
                <NavMain 
                navTitle={`Moja organizacija${activeOrgId ? `: ${activeOrgId}` : ''}`} 
                items={getOrgOwnerNavItems()} 
              />
              );
            }}
          </AuthorizedElement>
          
          <AuthorizedElement roles={[UserRole.AppAdmin]}>
            {({ userData }) => {

              return(
                <NavMain navTitle="App Admin" items={data.navAppAdmin} />
              );
            }}
          </AuthorizedElement>
        </div>
        
        {/* Secondary navigation at the bottom of content */}
        <AuthorizedElement roles={[UserRole.User]}>
          {({ userData }) => {

              return(
                <NavSecondary items={data.navSecondary} className='mt-auto'/>
              );
            }}
        </AuthorizedElement>
      </SidebarContent>

      <SidebarFooter>
        
        <AuthorizedElement roles={[UserRole.OrganizationOwner]}>
            {({ userData }) => {

              return(
                <OrganizationSwitcher organizations={myOrganizations}/>
              );
            }}
        </AuthorizedElement>
        <UnauthorizedElement>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant='outline' size='sm' onClick={navigateLogin} style={{ flex: 1 }}>Prijava</Button>
            <Button color='primary' size='sm' onClick={navigateSignup} style={{ flex: 1 }}>Registracija</Button>
          </div>
        </UnauthorizedElement>
        <AuthorizedElement>
            {({ userData }) => {

              return(
                <NavUser user={{
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  email: userData.email,
                  avatar: ""
                } } onLogout={handleLogout}/>
              );
            }}
        </AuthorizedElement>
        
      </SidebarFooter>
    </Sidebar>
  )
}
"use client"

import AuthorizedElement from '@/components/auth/authorized-element'
import { UserRole } from '@/types/roles'

import * as React from "react"
import {
  
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  AudioWaveform,
  GalleryVerticalEnd,
  Home,
  User,
  UsersRound,
  Building2,
  Search,
  Building,
  Star,
  LayoutDashboard
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar"
import Image from "next/image"
import { TeamSwitcher } from "./team-switcher"
import { Button } from './ui/button'
import UnauthorizedElement from './auth/unauthorized-element'

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
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
  navOrgOwner: [
    {
      title: "Profil",
      url: "/organizations/1",
      icon: Building,
      isActive: true,
      items: []
    },
    {
      title: "Recenzije",
      url: "/organizations/reviews",
      icon: Star,
      isActive: true,
      items: []
    }
  ],
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
  const navigateLogin = () => {
    window.location.href = '/login'
  }
  const navigateSignup = () => {
    window.location.href = '/signup'
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <a href="/">
          <Image src="/logo-sportlink.png" alt="Logo" width={200} height={50} />
        </a>
      </SidebarHeader>
      <SidebarContent>
        <NavMain navTitle="SportLink" items={data.navMain} />
        
        <AuthorizedElement roles={[UserRole.OrganizationOwner]}>
          {({ userData }) => (
            <NavMain navTitle="Moja organizacija" items={data.navOrgOwner} />
          )}
        </AuthorizedElement>
        
        <AuthorizedElement roles={[UserRole.AppAdmin]}>
          {({ userData }) => (
            <NavMain navTitle="App Admin" items={data.navAppAdmin} />
          )}
        </AuthorizedElement>
        
        <AuthorizedElement roles={[UserRole.User]}>
          {({ userData }) => (
            <NavSecondary items={data.navSecondary} className="mt-auto" />
          )}
        </AuthorizedElement>
        
      </SidebarContent>

      <SidebarFooter>
        <AuthorizedElement roles={[UserRole.OrganizationOwner]}>
          {({ userData }) => (
            <TeamSwitcher teams={data.teams}/>
          )}
        </AuthorizedElement>
        <UnauthorizedElement>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant='outline' size='sm' onClick={navigateLogin} style={{ flex: 1 }}>Prijava</Button>
            <Button color='primary' size='sm' onClick={navigateSignup} style={{ flex: 1 }}>Registracija</Button>
          </div>
        </UnauthorizedElement>
        <AuthorizedElement>
          {({ userData }) => (
            <NavUser user={{
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              avatar: null
            }} />
          )}
        </AuthorizedElement>
        
      </SidebarFooter>
    </Sidebar>
  )
}
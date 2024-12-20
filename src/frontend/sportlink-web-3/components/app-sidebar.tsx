"use client"

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

const data = {
  user: {
    firstName: "shad",
    lastName: "CN",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
      title: "Pretrazivanje",
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
      title: "Login (temp.)",
      url: "/login",
      icon: LifeBuoy,
    },
    {
      title: "Signup (temp.)",
      url: "/signup",
      icon: Send,
    },
    {
      title: "Dodaj organizaciju",
      url: "/organizations/create",
      icon: Building,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <a href="/">
          <Image src="/logo-sportlink.png" alt="Logo" width={200} height={50} />
        </a>
        
      </SidebarHeader>
      <SidebarContent>
        <NavMain navTitle="SportLink" items={data.navMain} />
        <NavMain navTitle="Moja organizacija" items={data.navOrgOwner} />
        <NavMain navTitle="App Admin" items={data.navAppAdmin} />
        {/* <NavAppAdmin items={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <TeamSwitcher teams={data.teams}/>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

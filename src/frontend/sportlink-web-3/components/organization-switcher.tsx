"use client"

import * as React from "react"
import { Building, Building2, ChevronsUpDown, Command, Plus, Square } from "lucide-react"
import { useRouter } from 'next/navigation';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Organization } from "@/types/org";

const ACTIVE_ORG_KEY = 'activeOrganizationId'

// Create a custom event for organization changes
const dispatchOrgChange = (orgId: string) => {
  const event = new CustomEvent('organizationChange', { 
    detail: { orgId } 
  })
  window.dispatchEvent(event)
}


export function OrganizationSwitcher({
  organizations,
}: {
  organizations: Organization[]
}) {
  const { isMobile } = useSidebar()
  const [activeOrganization, setActiveOrganization] = React.useState<Organization | null>(null)
  const router = useRouter()

  React.useEffect(() => {
    if (organizations.length > 0 && !activeOrganization) {
      // Try to get the saved organization ID from localStorage
      const savedOrgId = localStorage.getItem(ACTIVE_ORG_KEY)
      
      if (savedOrgId) {
        // Find the organization with the saved ID
        const savedOrg = organizations.find(org => org.id.toString() === savedOrgId)
        if (savedOrg) {
          setActiveOrganization(savedOrg)
          return
        }
      }
      
      // If no saved org or saved org not found in list, use first org
      setActiveOrganization(organizations[0])
    }
  }, [organizations, activeOrganization])

  // Update localStorage and dispatch event when active organization changes
  const handleOrganizationChange = (organization: Organization) => {
    setActiveOrganization(organization)
    localStorage.setItem(ACTIVE_ORG_KEY, organization.id.toString())
    dispatchOrgChange(organization.id.toString())
  }

  if (!activeOrganization) {
    return null // or return a loading spinner
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" />
                {/* <span className="text-sm font-medium">{activeOrganization.id}</span> */}
              </div>
              
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeOrganization.name}
                </span>
                <span className="truncate text-xs">{activeOrganization.contactEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground flex justify-between">
              <span>Organizacije</span>
              <span>ID</span>
            </DropdownMenuLabel>
            {organizations.map((organization, index) => (
              <DropdownMenuItem
                key={organization.id}
                onClick={() => handleOrganizationChange(organization)}
                className="gap-2 p-2"
              >
                <div className="flex aspect-square size-6 shrink-0 items-center justify-center rounded-sm border text-xs font-medium">
                  {/* {organization.id} */}
                  <Building className="size-4 shrink-0" />
                </div>
                <span className="flex-1">{organization.name}</span>
                <DropdownMenuShortcut>{organization.id}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={() => router.push('/organizations/create')}>  
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Dodaj organizaciju</div>
              
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

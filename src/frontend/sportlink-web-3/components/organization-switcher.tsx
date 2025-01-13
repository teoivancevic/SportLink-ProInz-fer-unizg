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

const dispatchOrgChange = (orgId: string) => {
  const event = new CustomEvent('organizationChange', { 
    detail: { orgId } 
  })
  window.dispatchEvent(event)
}

interface OrganizationSwitcherProps {
  organizations: Organization[]
  isLoading?: boolean
}

export function OrganizationSwitcher({ organizations, isLoading }: OrganizationSwitcherProps) {
  const { isMobile } = useSidebar()
  const [activeOrganization, setActiveOrganization] = React.useState<Organization | null>(null)
  const router = useRouter()

  React.useEffect(() => {
    if (organizations.length > 0 && !activeOrganization) {
      // Try to get the saved organization ID from localStorage
      const savedOrgId = localStorage.getItem(ACTIVE_ORG_KEY)
      
      let organizationToSet: Organization | null = null

      if (savedOrgId) {
        // Find the organization with the saved ID
        organizationToSet = organizations.find(org => org.id.toString() === savedOrgId) || null
      }
      
      // If no saved org was found or no saved org ID exists, use the first org
      if (!organizationToSet && organizations.length > 0) {
        organizationToSet = organizations[0]
      }

      // Set both the active organization and update localStorage
      if (organizationToSet) {
        setActiveOrganization(organizationToSet)
        localStorage.setItem(ACTIVE_ORG_KEY, organizationToSet.id.toString())
        dispatchOrgChange(organizationToSet.id.toString())
      }
    }
  }, [organizations, activeOrganization])

  const handleOrganizationChange = (organization: Organization) => {
    setActiveOrganization(organization)
    localStorage.setItem(ACTIVE_ORG_KEY, organization.id.toString())
    dispatchOrgChange(organization.id.toString())
  }

  if (isLoading) {
    return <div className="h-10 animate-pulse bg-muted rounded-md" />
  }

  if (!activeOrganization) {
    return null
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
            {organizations.map((organization) => (
              <DropdownMenuItem
                key={organization.id}
                onClick={() => handleOrganizationChange(organization)}
                className="gap-2 p-2"
              >
                <div className="flex aspect-square size-6 shrink-0 items-center justify-center rounded-sm border text-xs font-medium">
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
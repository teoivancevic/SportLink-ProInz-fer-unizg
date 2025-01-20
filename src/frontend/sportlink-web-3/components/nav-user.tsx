"use client"

import {
  ChevronsUpDown,
  FileUser,
  LogOut,
  UserCircle,
} from "lucide-react"

import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserInfo } from "./ui-custom/user-info";
import AuthorizedElement from "./auth/authorized-element";
import { useAuth } from "./auth/auth-context";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function NavUser({
  user
}: {
  user: {
    firstName: string
    lastName: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter();
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/')
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
                <UserInfo 
                  user={user}
                  className="flex-1"
                />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <UserInfo 
                user={user}
                className="px-1 py-1.5"
              />
              
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <AuthorizedElement>
                {({ userData }) => (
                  <>
                    <div className="flex aspect-square size-6 shrink-0 items-center justify-center rounded-sm border text-xs font-medium">
                      <FileUser className="size-4 shrink-0" />
                    </div>
                    <span className="flex-1 ml-2">{userData.role}</span>
                  </>
                )}
              </AuthorizedElement>
            </DropdownMenuItem>
            <div className="px-2 py-1.5">
              <ThemeSwitcher />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

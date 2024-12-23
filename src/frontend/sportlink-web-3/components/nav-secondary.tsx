import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  className,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  
  console.log(items) // this logs 1 item, which is correct

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className={cn("grid gap-1", className)}>
          {items.map((item, index) => (
            <SidebarMenuItem
              key={index}
              
            >
                <a href={item.url}>
                  <SidebarMenuButton className="text-gray-500">  
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </a>
              </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

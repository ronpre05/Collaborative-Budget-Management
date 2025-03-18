import type * as React from "react"
import { Home, FolderKanban, Settings, LifeBuoy, Mail } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { UserButton } from "@clerk/clerk-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

  // Sidebar navigation items with icons
  const navItems = [
    {
      title: "Home",
      icon: Home,
      path: "/",
    },
    {
      title: "Projects",
      icon: FolderKanban,
      path: "/projects",
    },
    {
      title: "Invitations",
      icon: Mail,
      path: "/invitations",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
    {
      title: "Support",
      icon: LifeBuoy,
      path: "/support",
    },
  ]

  return (
    <Sidebar {...props}>
      <SidebarInset>
        <SidebarHeader className="p-4">
          <div className="flex flex-col space-y-4">
            <header className="text-sm font-semibold tracking-tight">COLLABORATIVE BUDGET MANAGEMENT TOOL</header>
            <div className="flex items-center">
              <UserButton />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                  <Link to={item.path} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </SidebarInset>
      <SidebarRail />      
    </Sidebar>

  )
}


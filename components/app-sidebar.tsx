"use client"

import { Calendar, Home, ListTodo, Settings, Timer, TrendingUp } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/sidebar-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    title: "Schedule",
    icon: Calendar,
    href: "/schedule",
  },
  {
    title: "Tasks",
    icon: ListTodo,
    href: "/tasks",
  },
  {
    title: "Timer",
    icon: Timer,
    href: "/timer",
  },
  {
    title: "Progress",
    icon: TrendingUp,
    href: "/progress",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b pb-2">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-lg font-bold text-primary-foreground">AC</span>
          </div>
          <div className="font-semibold">AnimeCode</div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <nav className="grid gap-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn("justify-start", pathname === item.href && "bg-secondary text-secondary-foreground")}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="text-xs text-muted-foreground">
            <span>© 2025 AnimeCode</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}


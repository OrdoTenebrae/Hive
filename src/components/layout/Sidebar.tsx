"use client"

import { usePathname } from "next/navigation"
import Logo from "@/components/logo"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderKanban,
  Users2,
  BarChart3,
  Settings,
  CreditCard,
} from "lucide-react"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Team', href: '/team', icon: Users2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Pricing', href: '/pricing', icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 w-64 border-r bg-white">
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-4 border-b">
          <Logo className="h-8 w-auto" />
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-50",
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              )}
            >
              <item.icon
                className={cn(
                  pathname === item.href
                    ? "text-primary"
                    : "text-gray-400 group-hover:text-gray-500",
                  "mr-3 h-5 w-5 flex-shrink-0"
                )}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
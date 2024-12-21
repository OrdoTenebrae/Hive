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
  ChevronRight,
  Brain,
} from "lucide-react"

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    description: 'Overview of your workspace'
  },
  { 
    name: 'Projects', 
    href: '/projects', 
    icon: FolderKanban,
    description: 'Manage your active projects'
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: BarChart3,
    description: 'Project insights and metrics'
  },
  { 
    name: 'AI Assistant', 
    href: '/assistant', 
    icon: Brain,
    description: 'Chat with Bee',
    highlight: true
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    description: 'Manage your preferences'
  },
  { 
    name: 'Pricing', 
    href: '/pricing', 
    icon: CreditCard,
    description: 'View plans and billing'
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 w-72 border-r bg-white">
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-6 border-b">
          <Logo className="h-8 w-auto" />
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 rounded-lg transition-all",
                pathname === item.href
                  ? "bg-amber-50 text-amber-900"
                  : "text-gray-600 hover:bg-gray-50",
                item.highlight && "relative overflow-hidden"
              )}
            >
              <div className="flex-1 flex items-start gap-3 relative z-10">
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    pathname === item.href
                      ? "text-amber-600"
                      : "text-gray-400 group-hover:text-gray-500"
                  )}
                />
                <div>
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-600">
                    {item.description}
                  </div>
                </div>
              </div>
              <ChevronRight 
                className={cn(
                  "w-4 h-4 opacity-0 -translate-x-2 transition-all",
                  "group-hover:opacity-100 group-hover:translate-x-0",
                  pathname === item.href ? "text-amber-600" : "text-gray-400"
                )}
              />
              {item.highlight && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50/50 to-transparent opacity-50" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 border-r border-primary-light/10", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-primary-dark/10"
            >
              Overview
            </Link>
            <Link
              href="/projects"
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-primary-dark/10"
            >
              Projects
            </Link>
            <Link
              href="/tasks"
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-primary-dark/10"
            >
              Tasks
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

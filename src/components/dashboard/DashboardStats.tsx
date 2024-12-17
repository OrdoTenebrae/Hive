import { Card } from "@/components/ui/card"
import { 
  BarChart3, 
  CheckCircle2, 
  GitPullRequest, 
  Users 
} from "lucide-react"

interface DashboardStatsProps {
  totalProjects: number
  completedTasks: number
}

export function DashboardStats({ totalProjects, completedTasks }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Projects"
        value={totalProjects}
        icon={<BarChart3 className="h-4 w-4" />}
        trend={+12}
      />
      <StatCard
        title="Completed Tasks"
        value={completedTasks}
        icon={<CheckCircle2 className="h-4 w-4" />}
        trend={+8}
      />
      <StatCard
        title="Team Members"
        value={6}
        icon={<Users className="h-4 w-4" />}
        trend={+2}
      />
      <StatCard
        title="Pull Requests"
        value={12}
        icon={<GitPullRequest className="h-4 w-4" />}
        trend={-3}
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  trend: number
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-primary-medium">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${trend > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
        <span className="ml-2 text-primary-medium">vs last month</span>
      </div>
    </Card>
  )
}

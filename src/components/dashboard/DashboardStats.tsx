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
    <div className="grid gap-4 md:grid-cols-2">
      <StatCard
        title="Total Projects"
        value={totalProjects}
        icon={<BarChart3 className="h-5 w-5" />}
        trend={+12}
        description="Active projects"
      />
      <StatCard
        title="Completed Tasks"
        value={completedTasks}
        icon={<CheckCircle2 className="h-5 w-5" />}
        trend={+8}
        description="Tasks this month"
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  trend: number
  description: string
}

function StatCard({ title, value, icon, trend, description }: StatCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{value}</p>
            <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className={`p-3 rounded-full ${trend > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

import { Card } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { LineChart, BarChart } from "@/components/analytics/Charts"
import { verifyJwt } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { cookies } from 'next/headers'

export default async function AnalyticsPage() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('Authorization')?.value
  const token = cookieStore.get('token')?.value
  
  // Get token from either cookie, removing Bearer prefix if present
  const finalToken = (authToken || token)?.replace('Bearer ', '')
  
  if (!finalToken) redirect('/auth/login')
  const payload = await verifyJwt(finalToken)
  if (!payload) redirect('/auth/login')

  const stats = await prisma.project.aggregate({
    where: {
      OR: [
        { ownerId: payload.id },
        { members: { some: { id: payload.id } } }
      ]
    },
    _count: { _all: true }
  })

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      
      <DashboardStats 
        totalProjects={stats._count._all} 
        completedTasks={0} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-medium mb-4">Project Progress</h3>
          <LineChart />
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-4">Task Distribution</h3>
          <BarChart />
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-4">Productivity Trends</h3>
          <LineChart />
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-4">Time Allocation</h3>
          <BarChart />
        </Card>
      </div>
    </div>
  )
}

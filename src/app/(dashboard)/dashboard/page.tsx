
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { ProjectsList } from "@/components/dashboard/ProjectsList"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { TeamOverview } from "@/components/dashboard/TeamOverview"
import { Card } from "@/components/ui/card"
import { verifyJwt } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const payload = await verifyJwt()
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

  const completedTasks = await prisma.task.count({
    where: {
      status: 'COMPLETED',
      project: {
        OR: [
          { ownerId: payload.id },
          { members: { some: { id: payload.id } } }
        ]
      }
    }
  })

  return (
    <div className="p-6">
      
      <div className="mt-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <DashboardStats 
            totalProjects={stats._count._all} 
            completedTasks={completedTasks} 
          />
          <Card className="overflow-hidden">
            <div className="border-b border-border p-4">
              <h2 className="font-semibold">Your Projects</h2>
            </div>
            <ProjectsList />
          </Card>
        </div>
        
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <TeamOverview />
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
import { verifyJwt } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { ProjectsList } from "@/components/dashboard/ProjectsList"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { TeamOverview } from "@/components/dashboard/TeamOverview"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const payload = await verifyJwt()
  
  if (!payload) {
    redirect('/auth/login')
  }

  const stats = await prisma.project.aggregate({
    where: {
      OR: [
        { ownerId: payload.id },
        { members: { some: { id: payload.id } } }
      ]
    },
    _count: {
      _all: true,
    }
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
    <div className="space-y-8">
      <DashboardHeader user={{ 
        id: payload.id, 
        name: payload.name as string, 
        email: payload.email 
      }} />
      
      <DashboardStats 
        totalProjects={stats._count._all}
        completedTasks={completedTasks}
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <ProjectsList />
          <TeamOverview />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}

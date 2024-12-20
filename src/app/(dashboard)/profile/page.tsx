import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { verifyJwt } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProjectCard } from "@/components/projects/ProjectCard"

export default async function ProfilePage() {
  const payload = await verifyJwt()
  if (!payload) redirect('/auth/login')

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    include: {
      projects: {
        include: {
          members: true,
          owner: true,
        }
      }
    }
  })

  if (!user) redirect('/auth/login')

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-2xl">
              {user.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <p className="text-primary-medium">{user.email}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
          <div className="grid gap-4">
            {user.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Activity Overview</h2>
            {/* Activity stats */}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Skills & Expertise</h2>
            {/* Skills list */}
          </Card>
        </div>
      </div>
    </div>
  )
}

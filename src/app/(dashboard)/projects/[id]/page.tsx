import { verifyJwt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { ProjectHeader } from "@/components/projects/ProjectHeader"
import { TaskBoard } from "@/components/projects/TaskBoard"

export default async function ProjectPage({
  params
}: {
  params: { id: string }
}) {
  const payload = await verifyJwt()
  
  if (!payload) {
    redirect('/auth/login')
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      owner: true,
      members: true,
      tasks: {
        include: {
          assignee: true
        }
      }
    }
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <TaskBoard projectId={project.id} tasks={project.tasks} />
    </div>
  )
}

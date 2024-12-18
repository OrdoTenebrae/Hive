import { verifyJwt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { ProjectHeader } from "@/components/projects/ProjectHeader"
import { TaskBoard } from "@/components/projects/TaskBoard"

type PageProps = {
  params: { id: string }
}

export default async function ProjectPage(props: PageProps) {
  const payload = await verifyJwt()
  
  if (!payload) {
    redirect('/auth/login')
  }

  const project = await prisma.project.findUnique({
    where: { id: props.params.id },
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
    <div className="p-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <ProjectHeader project={project} />
          <div className="mt-6">
            <TaskBoard projectId={project.id} tasks={project.tasks} />
          </div>
        </div>
      </div>
    </div>
  )
}

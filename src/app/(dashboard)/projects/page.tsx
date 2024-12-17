import { ProjectCard } from "@/components/projects/ProjectCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { verifyJwt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Project } from ".prisma/client"
import { ProjectWithRelations } from "@/types/project"

export default async function ProjectsPage() {
  const payload = await verifyJwt()
  
  if (!payload) {
    redirect('/auth/login')
  }

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: payload.id },
        { members: { some: { id: payload.id } } }
      ]
    },
    include: {
      owner: true,
      members: true,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link href="/projects/new">
          <Button>Create Project</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: ProjectWithRelations) => (
          <ProjectCard key={project.id} project={project as ProjectWithRelations} />
        ))}
      </div>
    </div>
  )
}

import { verifyJwt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Meta } from "@/components/seo/Meta"

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const payload = await verifyJwt()
  if (!payload) return notFound()

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { 
      members: true,
      owner: true,
      tasks: {
        include: {
          assignee: true
        }
      }
    }
  })

  if (!project) return notFound()

  const completedTasks = project.tasks.filter(task => task.status === 'COMPLETED').length
  const progress = project.tasks.length > 0 
    ? Math.round((completedTasks / project.tasks.length) * 100)
    : 0

  return (
    <>
      <Meta 
        title={project.name}
        description={project.description || `Collaborate and manage tasks for ${project.name}`}
        keywords={`${project.name}, project management, tasks, collaboration`}
      />
      <div className="flex items-center gap-6 flex-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight truncate">
              {project.name}
            </h1>
            <Badge 
              variant="secondary" 
              className="bg-[#40534C]/10 text-[#40534C] hover:bg-[#40534C]/20"
            >
              {project.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((member) => (
                  <Avatar 
                    key={member.id} 
                    className="h-6 w-6 border-2 border-background ring-0"
                  >
                    <AvatarFallback className="text-xs bg-[#677D6A]/10 text-[#677D6A]">
                      {member.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {project.members.length > 3 && (
                <span className="text-sm text-muted-foreground">
                  +{project.members.length - 3}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-32 flex items-center gap-2">
                <Progress 
                  value={progress} 
                  className="h-1.5"
                />
                <span className="text-xs tabular-nums">
                  {progress}%
                </span>
              </div>
              <span>•</span>
              <span>{project.tasks.length} tasks</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

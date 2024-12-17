import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Project } from ".prisma/client"

interface ProjectCardProps {
  project: Project & {
    members: { id: string; name: string | null }[];
    tasks?: { status: string }[];
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progress = project.tasks 
    ? Math.round((project.tasks.filter(task => task.status === 'COMPLETED').length / project.tasks.length) * 100)
    : 0;

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium truncate">{project.name}</h3>
            <p className="text-sm text-primary-medium line-clamp-1">
              {project.description}
            </p>
          </div>
          <Badge variant="outline" className="ml-2 shrink-0">
            {project.status}
          </Badge>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="border-2 border-background">
                <AvatarFallback>
                  {member.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-primary-dark/10 flex items-center justify-center text-xs">
                +{project.members.length - 3}
              </div>
            )}
          </div>
          <Progress value={progress} className="w-20" />
        </div>
      </Card>
    </Link>
  )
} 
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { CreateTaskModal } from "@/components/projects/CreateTaskModal"
import { ManageTeamModal } from "@/components/projects/ManageTeamModal"
import { ProjectWithFullRelations } from "@/types/project"
import { GitHubActivity } from "@/components/projects/GitHubActivity"
import { CommitSummary } from "@/components/projects/CommitSummary"

interface ProjectHeaderProps {
  project: ProjectWithFullRelations
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const completedTasks = project.tasks.filter(task => task.status === 'COMPLETED').length
  const progress = project.tasks.length > 0 
    ? Math.round((completedTasks / project.tasks.length) * 100)
    : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{project.name}</h1>
            <Badge variant="outline">{project.status}</Badge>
          </div>
          <p className="text-primary-medium mt-1">{project.description}</p>
        </div>
        <CreateTaskModal projectId={project.id} members={project.members} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {project.members.map((member) => (
                <Avatar key={member.id} className="border-2 border-background-light">
                  <AvatarFallback>
                    {member.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <ManageTeamModal 
              projectId={project.id} 
              members={project.members} 
              owner={project.owner} 
            />
          </div>
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-medium h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-primary-medium">
              {progress}% Complete
            </div>
          </div>
        </div>
        
        {project.githubRepo && (
          <>
            <GitHubActivity 
              projectId={project.id} 
              repoUrl={`https://github.com/${project.githubRepo}`} 
            />
            <CommitSummary projectId={project.id} />
          </>
        )}
      </div>
    </div>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { ProjectWithRelations } from "@/types/project"

interface ProjectCardProps {
  project: ProjectWithRelations
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium">{project.name}</h3>
            <p className="text-sm text-primary-medium line-clamp-2">
              {project.description}
            </p>
          </div>
          <Badge variant="outline">{project.status}</Badge>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="border-2 border-background-light">
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
          
          {project.githubRepo && (
            <div className="text-xs text-primary-medium">
              {project.githubRepo}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}

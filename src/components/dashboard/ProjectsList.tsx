"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectWithRelations } from "@/types/project"
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { ProjectCard } from './ProjectCard'
import { ProjectsListSkeleton } from './ProjectsListSkeleton'
import { EmptyState } from '../ui/empty-state'
import { CreateProjectButton } from './CreateProjectButton'
import { fetchClient } from "@/lib/fetch-client"
import { Project } from ".prisma/client"

export function ProjectsList() {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/projects', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) throw new Error('Failed to fetch projects')
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        toast.error('Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return <ProjectsListSkeleton />
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Active Projects</h2>
        <Link 
          href="/projects" 
          className="text-sm text-primary-medium hover:text-primary-dark"
        >
          View All
        </Link>
      </div>
      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to get started"
          action={<CreateProjectButton />}
        />
      ) : (
        <div className="space-y-4">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </Card>
  )
}

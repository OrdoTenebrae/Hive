import { verifyJwt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value || cookieStore.get('Authorization')?.value?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await verifyJwt(token)
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get all projects for the user
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
      tasks: {
        include: {
          assignee: true
        }
      }
    }
  })

  // Get unique team members from all projects
  const teamMembers = new Map()
  
  projects.forEach(project => {
    [...project.members, project.owner].forEach(member => {
      if (!teamMembers.has(member.id)) {
        const memberTasks = projects.flatMap(p => 
          p.tasks.filter(t => t.assigneeId === member.id)
        )
        
        teamMembers.set(member.id, {
          id: member.id,
          name: member.name,
          role: member.role,
          tasksCompleted: memberTasks.filter(t => t.status === 'COMPLETED').length,
          totalTasks: memberTasks.length,
          activeProject: project.name
        })
      }
    })
  })

  return NextResponse.json(Array.from(teamMembers.values()))
} 
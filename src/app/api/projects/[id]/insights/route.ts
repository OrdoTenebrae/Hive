import { verifyJwt } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { predictWorkload, generatePhaseReport } from "@/lib/services/ai-services"
import { Task } from '.prisma/client'
import { User } from '.prisma/client'
import { ProjectWithFullRelations } from "@/types/project"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const payload = await verifyJwt()
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        tasks: {
          include: {
            assignee: true
          }
        },
        members: true,
        owner: true
      }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Calculate basic metrics
    const completedTasks = project.tasks.filter((t: Task) => t.status === 'COMPLETED')
    const performance = {
      velocity: completedTasks.length / (project.tasks.length || 1),
      completionRate: (completedTasks.length / project.tasks.length) * 100 || 0,
      avgTaskDuration: calculateAvgDuration(completedTasks)
    }

    // Get AI predictions
    const workloadAnalysis = await predictWorkload(project as ProjectWithFullRelations)
    const phaseReport = await generatePhaseReport(project)

    return NextResponse.json({
      performance,
      predictions: {
        estimatedCompletion: calculateEstimatedCompletion(project),
        potentialDelays: extractDelays(workloadAnalysis || ''),
        recommendations: extractRecommendations(workloadAnalysis || '')
      },
      workload: project.members.map((member: User) => ({
        memberId: member.id,
        memberName: member.name,
        taskCount: project.tasks.filter((t: Task) => t.assigneeId === member.id).length,
        utilizationRate: calculateUtilization(project.tasks, member.id)
      }))
    })
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}

function calculateAvgDuration(tasks: any[]) {
  if (tasks.length === 0) return 0
  const durations = tasks.map(t => {
    const start = new Date(t.createdAt)
    const end = new Date(t.completedAt || Date.now())
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  })
  return Math.round(durations.reduce((a, b) => a + b, 0) / tasks.length)
}

function calculateEstimatedCompletion(project: any) {
  const avgDuration = calculateAvgDuration(project.tasks.filter((t: Task) => t.status === 'COMPLETED'))
  const remainingTasks = project.tasks.filter((t: Task) => t.status !== 'COMPLETED').length
  return new Date(Date.now() + (remainingTasks * avgDuration * 24 * 60 * 60 * 1000)).toISOString()
}

function calculateUtilization(tasks: any[], memberId: string) {
  const memberTasks = tasks.filter(t => t.assigneeId === memberId)
  if (memberTasks.length === 0) return 0
  const activeTasks = memberTasks.filter(t => t.status === 'IN_PROGRESS').length
  return Math.round((activeTasks / memberTasks.length) * 100)
}

function extractDelays(analysis: string): string[] {
  return analysis.match(/Bottlenecks:(.*?)(?=Recommendations:|$)/s)?.[1]
    ?.split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(s => s.trim().slice(2)) || []
}

function extractRecommendations(analysis: string): string[] {
  return analysis.match(/Recommendations:(.*?)(?=Risk Level:|$)/s)?.[1]
    ?.split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(s => s.trim().slice(2)) || []
}

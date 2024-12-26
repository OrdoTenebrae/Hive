import { verifyJwt } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { predictWorkload, generatePhaseReport, generateProjectInsights } from "@/lib/services/ai-services"
import { Task } from '.prisma/client'
import { User } from '.prisma/client'
import { ProjectWithFullRelations } from "@/types/project"
import { AIDataService, isStale } from '@/lib/services/ai-data'
import { cookies } from "next/headers"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value || cookieStore.get('Authorization')?.value?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await verifyJwt(token)
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get core project data from PostgreSQL
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        tasks: { include: { assignee: true } },
        members: true,
        owner: true
      }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Get AI insights from MongoDB
    const aiService = new AIDataService()
    const aiInsights = await aiService.getData(params.id, 'project_insights')

    // If no insights exist or they're old, generate new ones
    if (!aiInsights || isStale(aiInsights.metadata.updatedAt)) {
      const newInsights = await generateProjectInsights(project as ProjectWithFullRelations)
      await aiService.saveData({
        referenceId: params.id,
        documentType: 'project_insights',
        data: newInsights
      })
      return NextResponse.json(newInsights)
    }

    return NextResponse.json(aiInsights.data)
  } catch (error) {
    console.error('Error fetching insights:', error)
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 })
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

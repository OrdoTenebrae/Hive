import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth, verifyJwt } from '@/lib/auth'
import { io } from '@/lib/socket'
import { cookies } from 'next/headers';

interface JWTPayload {
  id: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value || cookieStore.get('Authorization')?.value?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJwt(token) as JWTPayload
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await req.json()

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        OR: [
          { ownerId: payload.id },
          { members: { some: { id: payload.id } } }
        ]
      }
    })

    if (!project) {
      return new Response('Project not found or access denied', { status: 404 })
    }

    // Update task
    const task = await prisma.task.update({
      where: { id: params.taskId },
      data: updates,
      include: { assignee: true }
    })

    // Notify other clients
    io.to(params.id).emit('task:updated', {
      taskId: params.taskId,
      updates: task,
      userId: payload.id
    })

    return Response.json(task)
  } catch (error) {
    console.error('Failed to update task:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
} 
import { prisma } from "@/lib/prisma"
import { verifyJwt } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await verifyJwt()
    if (!payload) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { 
        members: true,
        owner: true 
      }
    })

    if (!project) {
      return new NextResponse("Project not found", { status: 404 })
    }

    // Filter out duplicates by ID
    const allMembers = [
      project.owner,
      ...project.members.filter(member => member.id !== project.owner.id)
    ]

    return NextResponse.json(allMembers)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = await verifyJwt()
    if (!payload) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await request.json()
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        assigneeId: data.assigneeId,
        projectId: data.projectId,
        status: data.status,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: {
        assignee: true
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Task creation error:', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
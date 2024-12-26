import { verifyJwt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value || cookieStore.get('Authorization')?.value?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await verifyJwt(token)
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: payload.id },
        { members: { some: { id: payload.id } } }
      ]
    },
    include: {
      members: true,
      tasks: true,
    }
  })

  return NextResponse.json(projects)
}

export async function POST(req: Request) {
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
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: payload.id }
    })

    if (!user) {
      console.error("User not found:", payload.id)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("Creating project for user:", {
      userId: user.id,
      userName: user.name,
      userEmail: user.email
    })

    const json = await req.json()
    const project = await prisma.project.create({
      data: {
        name: json.name,
        description: json.description,
        githubRepo: json.githubRepo,
        ownerId: user.id,
        members: {
          connect: { id: user.id }
        }
      },
      include: {
        owner: true,
        members: true
      }
    })

    console.log("Project created successfully:", {
      projectId: project.id,
      projectName: project.name
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ 
      error: "Failed to create project",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 
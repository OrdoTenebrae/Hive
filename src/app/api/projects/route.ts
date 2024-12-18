import { verifyJwt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const payload = await verifyJwt()
  
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
  const payload = await verifyJwt()
  
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const json = await req.json()
    const project = await prisma.project.create({
      data: {
        name: json.name,
        description: json.description,
        githubRepo: json.githubRepo,
        ownerId: payload.id,
        members: {
          connect: { id: payload.id }
        }
      },
      include: {
        owner: true,
        members: true
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
} 
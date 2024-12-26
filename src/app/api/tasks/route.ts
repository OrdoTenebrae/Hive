import { verifyJwt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
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
    const json = await req.json()
    const task = await prisma.task.create({
      data: {
        title: json.title,
        description: json.description,
        projectId: json.projectId,
        assigneeId: json.assigneeId,
        dueDate: new Date(json.dueDate),
        status: "TODO"
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

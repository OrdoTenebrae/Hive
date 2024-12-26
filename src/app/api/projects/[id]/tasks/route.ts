import { prisma } from "@/lib/prisma"
import { verifyJwt } from "@/lib/auth"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value || cookieStore.get('Authorization')?.value?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJwt(token)
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tasks = await prisma.task.findMany({
      where: { 
        projectId: params.id 
      },
      include: {
        assignee: true
      }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
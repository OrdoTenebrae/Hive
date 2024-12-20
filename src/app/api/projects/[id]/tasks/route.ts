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
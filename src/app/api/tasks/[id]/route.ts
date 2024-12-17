import { verifyJwt } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const payload = await verifyJwt()
  
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const json = await req.json()
    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        status: json.status,
        updatedAt: new Date(),
      },
      include: {
        assignee: true
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

import { verifyJwt } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const payload = await verifyJwt()
  
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const json = await req.json()
    const user = await prisma.user.findUnique({
      where: { email: json.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        members: {
          connect: { id: user.id }
        }
      },
      include: {
        members: true
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json({ error: "Failed to add member" }, { status: 500 })
  }
}

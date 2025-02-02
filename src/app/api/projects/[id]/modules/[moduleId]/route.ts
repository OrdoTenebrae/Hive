import { verifyJwt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers";
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
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
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { installedModules: true }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    await prisma.project.update({
      where: { id: params.id },
      data: {
        installedModules: project.installedModules.filter(m => m !== params.moduleId)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to uninstall module:', error)
    return NextResponse.json({ error: "Failed to uninstall module" }, { status: 500 })
  }
} 
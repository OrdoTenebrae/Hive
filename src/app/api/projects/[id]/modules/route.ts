import { NextResponse } from "next/server"
import { verifyJwt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ModuleType } from "@/types/modules"

export async function GET(
  req: Request,
  { params }: { params: { id: string }}
) {
  try {
    const payload = await verifyJwt()
    if (!payload) return new NextResponse("Unauthorized", { status: 401 })

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        installedModules: true
      }
    })

    if (!project) return new NextResponse("Project not found", { status: 404 })
    
    const modules = project.installedModules as ModuleType[] || ['kanban']
    return NextResponse.json({ modules })
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await verifyJwt()
    if (!payload) return new NextResponse("Unauthorized", { status: 401 })

    const { moduleId } = await req.json()
    
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { installedModules: true }
    })

    if (!project) return new NextResponse("Project not found", { status: 404 })

    const currentModules = project.installedModules as ModuleType[] || []
    
    if (currentModules.includes(moduleId)) {
      return new NextResponse("Module already installed", { status: 400 })
    }

    await prisma.project.update({
      where: { id: params.id },
      data: {
        installedModules: {
          set: [...currentModules, moduleId]
        }
      }
    })

    return NextResponse.json({ modules: [...currentModules, moduleId] })
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

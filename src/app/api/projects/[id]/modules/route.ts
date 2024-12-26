import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ModuleType } from "@/types/modules"

export async function GET(
  request: Request, 
  context: { params: { id: string } }
) {
  const { id } = context.params
  
  try {
    // Get project
    const project = await prisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      console.log('❌ Project not found:', id)
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Return installed modules or default to kanban
    const defaultModules = ['kanban']
    console.log('✅ Returning modules for project:', id)
    return NextResponse.json({ 
      modules: project.installedModules?.length ? project.installedModules : defaultModules 
    })

  } catch (error) {
    console.error('❌ Error fetching modules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params
  
  try {
    const project = await prisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const { moduleId } = await request.json()
    const currentModules = project.installedModules as ModuleType[] || []
    
    if (currentModules.includes(moduleId)) {
      return NextResponse.json({ error: "Module already installed" }, { status: 400 })
    }

    await prisma.project.update({
      where: { id },
      data: {
        installedModules: {
          set: [...currentModules, moduleId]
        }
      }
    })

    return NextResponse.json({ modules: [...currentModules, moduleId] })
  } catch (error) {
    console.error('Error installing module:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

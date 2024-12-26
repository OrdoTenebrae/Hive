"use client"

import { KanbanModule } from "./KanbanModule"
import { ChatModule } from "./ChatModule"

interface ModuleLoaderProps {
  moduleId: string
  projectId: string
}

const moduleRegistry = {
  kanban: KanbanModule,
  chat: ChatModule
}

export function ModuleLoader({ moduleId, projectId }: ModuleLoaderProps) {
  const Module = moduleRegistry[moduleId as keyof typeof moduleRegistry]
  
  if (!Module) {
    return <div>Module not found</div>
  }

  return <Module projectId={projectId} />
}
"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { TaskBoard } from "@/components/projects/TaskBoard"
import { Grip, Maximize2, Minimize2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { fetchClient } from "@/lib/fetch-client"
import { TaskWithAssignee } from "@/types/project"
import { CreateTaskModal } from "@/components/projects/CreateTaskModal"

interface KanbanModuleProps {
  projectId: string
}

export function KanbanModule({ projectId }: KanbanModuleProps) {
  const [size, setSize] = useState<"normal" | "large">("normal")
  const [tasks, setTasks] = useState<TaskWithAssignee[]>([])
  const [members, setMembers] = useState<{ id: string; name: string | null }[]>([])

  useEffect(() => {
    fetchClient(`/api/projects/${projectId}/tasks?include=assignee`).then(setTasks)
    fetchClient(`/api/projects/${projectId}/members`).then(setMembers)
  }, [projectId])

  return (
    <Card className="relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="flex items-center gap-1">
          <CreateTaskModal projectId={projectId} members={members} />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Grip className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setSize(size === "normal" ? "large" : "normal")}
          >
            {size === "normal" ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      <div className={cn(
        "p-4",
        size === "large" ? "min-h-[600px]" : "min-h-[300px]"
      )}>
        <TaskBoard projectId={projectId} tasks={tasks} />
      </div>
    </Card>
  )
} 
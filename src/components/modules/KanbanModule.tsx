"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { TaskBoard } from "@/components/projects/TaskBoard"
import { Grip, Maximize2, Minimize2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { fetchClient } from "@/lib/fetch-client"
import { TaskWithAssignee } from "@/types/project"
import { CreateTaskModal } from "@/components/projects/CreateTaskModal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

interface KanbanModuleProps {
  projectId: string
}

export function KanbanModule({ projectId }: KanbanModuleProps) {
  const [size, setSize] = useState<"normal" | "large">("normal")
  const [tasks, setTasks] = useState<TaskWithAssignee[]>([])
  const [members, setMembers] = useState<{ id: string; name: string | null }[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchClient(`/api/projects/${projectId}/tasks?include=assignee`).then(setTasks)
    fetchClient(`/api/projects/${projectId}/members`).then(setMembers)
  }, [projectId])

  const handleUninstall = async () => {
    try {
      await fetchClient(`/api/projects/${projectId}/modules/kanban`, {
        method: 'DELETE',
      })
      window.location.reload()
    } catch (error) {
      console.error('Failed to uninstall module:', error)
    }
  }

  return (
    <Card className="relative group overflow-hidden">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Uninstall Kanban Module</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to uninstall the Kanban module? This will remove the board and its configuration, but your tasks will remain intact.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleUninstall} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Uninstall
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className={cn(
        "relative",
        size === "large" ? "h-[calc(100vh-12rem)]" : "h-[500px]"
      )}>
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="h-full flex gap-4 p-4 min-w-[calc(280px*4+1rem)]">
              <TaskBoard projectId={projectId} tasks={tasks} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 
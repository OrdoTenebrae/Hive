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
import { useRealTime } from "@/contexts/RealTimeContext"
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
import { toast } from "react-hot-toast"
import { useAuth } from "@/contexts/AuthContext"

interface KanbanModuleProps {
  projectId: string
}

export function KanbanModule({ projectId }: KanbanModuleProps) {
  const { user } = useAuth()
  const [size, setSize] = useState<"normal" | "large">("normal")
  const [tasks, setTasks] = useState<TaskWithAssignee[]>([])
  const [members, setMembers] = useState<{ id: string; name: string | null }[]>([])
  const router = useRouter()
  const { subscribe, publish } = useRealTime()

  useEffect(() => {
    fetchClient(`/api/projects/${projectId}/tasks?include=assignee`).then(setTasks)
    fetchClient(`/api/projects/${projectId}/members`).then(setMembers)

    const unsubscribe = subscribe((message: any) => {
      if (message.type === 'TASK_UPDATED' && message.payload) {
        setTasks(prev => prev.map(task => 
          task.id === message.payload.taskId 
            ? { ...task, ...message.payload.updates }
            : task
        ))
      }
    })

    return () => unsubscribe()
  }, [projectId, subscribe])

  const handleUninstall = async () => {
    try {
      await fetchClient(`/api/projects/${projectId}/modules/kanban`, {
        method: 'DELETE',
      })
      window.location.reload()
    } catch (error) {
      console.error('Failed to uninstall module:', error)
      toast.error('Failed to uninstall module')
    }
  }

  const handleTaskUpdate = async (taskId: string, updates: Partial<TaskWithAssignee>) => {
    try {
      // Optimistically update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, ...updates }
          : task
      ))

      // Send real-time update
      publish({
        type: 'TASK_UPDATED',
        payload: {
          taskId,
          updates
        }
      })

      // Persist to server
      await fetchClient(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      })
    } catch (error) {
      console.error('Failed to update task:', error)
      toast.error('Failed to update task')
      
      // Revert optimistic update on error
      fetchClient(`/api/projects/${projectId}/tasks?include=assignee`).then(setTasks)
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
              <TaskBoard 
                projectId={projectId} 
                tasks={tasks} 
                onTaskUpdate={handleTaskUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 
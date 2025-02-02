"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTaskStore } from "@/lib/store/task-store"
import { Plus } from "lucide-react"
import { TaskWithAssignee } from "@/types/project"
import { toast } from "react-hot-toast"
import { fetchClient } from "@/lib/fetch-client"

interface CreateTaskModalProps {
  projectId: string
  members: { id: string; name: string | null }[]
}

export function CreateTaskModal({ projectId, members }: CreateTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { setTasks } = useTaskStore()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      assigneeId: formData.get("assigneeId"),
      dueDate: formData.get("dueDate"),
      projectId,
      status: "TODO"
    }

    try {
      const newTask = await fetchClient("/api/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      }) as TaskWithAssignee

      setTasks((prev: TaskWithAssignee[]) => [...prev, newTask])
      setOpen(false)
      toast.success("Task created successfully")
    } catch (error) {
      toast.error("Failed to create task")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Task Title
            </label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Enter task title"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="w-full p-2 border rounded-lg min-h-[100px]"
              placeholder="Describe the task"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="assigneeId" className="text-sm font-medium">
              Assign To
            </label>
            <select
              id="assigneeId"
              name="assigneeId"
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Select assignee</option>
              {members?.length > 0 ? (
                members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name || 'Unnamed Member'}
                  </option>
                ))
              ) : (
                <option disabled>No team members available</option>
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

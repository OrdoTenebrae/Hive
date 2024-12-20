"use client"

import { Module } from "./base/Module"
import { TaskCard } from "@/components/projects/TaskCard"
import { useEffect, useState } from "react"
import { fetchClient } from "@/lib/fetch-client"
import { Task } from "@prisma/client"
import { TaskWithAssignee } from "@/types/project"

interface TasksModuleProps {
  projectId: string
  size: "normal" | "large"
  onSizeToggle: (id: string) => void
}

export function TasksModule({ projectId, size, onSizeToggle }: TasksModuleProps) {
  const [tasks, setTasks] = useState<TaskWithAssignee[]>([])

  useEffect(() => {
    fetchClient(`/api/projects/${projectId}/tasks?include=assignee`).then(setTasks)
  }, [projectId])

  return (
    <Module
      id="tasks"
      title="Recent Tasks"
      size={size}
      onSizeToggle={onSizeToggle}
    >
      <div className="space-y-2 overflow-auto max-h-[calc(100%-2rem)]">
        {tasks.slice(0, size === "normal" ? 3 : 6).map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </Module>
  )
} 
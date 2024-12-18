"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TaskWithAssignee } from "@/types/project"
import { CalendarIcon } from "lucide-react"

interface TaskCardProps {
  task: TaskWithAssignee
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="p-4 hover:shadow-sm transition-shadow">
      <div className="space-y-3">
        <h4 className="font-medium">{task.title}</h4>
        {task.description && (
          <p className="text-sm text-primary-medium line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">
                {task.assignee.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-primary-medium">
              {task.assignee.name}
            </span>
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-primary-medium">
              <CalendarIcon className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

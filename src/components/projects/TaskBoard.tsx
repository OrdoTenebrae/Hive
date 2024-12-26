"use client"

import { Card } from "@/components/ui/card"
import { Task } from ".prisma/client"
import { TaskCard } from "./TaskCard"
import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { TaskWithAssignee } from "@/types/project"
import { cn } from "@/lib/utils"
import { toast } from "react-hot-toast"

type Column = {
  id: string
  title: string
  status: Task["status"]
  color: string
}

const columns: Column[] = [
  { id: "todo", title: "To Do", status: "TODO", color: "bg-background hover:bg-muted/40" },
  { id: "in_progress", title: "In Progress", status: "IN_PROGRESS", color: "bg-background hover:bg-muted/40" },
  { id: "review", title: "In Review", status: "IN_REVIEW", color: "bg-background hover:bg-muted/40" },
  { id: "done", title: "Done", status: "COMPLETED", color: "bg-background hover:bg-muted/40" }
]

interface TaskBoardProps {
  projectId: string
  tasks: TaskWithAssignee[]
  onTaskUpdate?: (taskId: string, updates: Partial<TaskWithAssignee>) => void
}

export function TaskBoard({ projectId, tasks: initialTasks, onTaskUpdate }: TaskBoardProps) {
  const [tasks, setTasks] = useState<TaskWithAssignee[]>(initialTasks)

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const sourceColumn = columns.find(col => col.id === result.source.droppableId)
    const destColumn = columns.find(col => col.id === result.destination.droppableId)
    
    if (!sourceColumn || !destColumn || sourceColumn.id === destColumn.id) return

    const taskId = result.draggableId
    const updates = { status: destColumn.status }

    try {
      onTaskUpdate?.(taskId, updates)
    } catch (error) {
      console.error('Failed to update task:', error)
      toast.error('Failed to update task status')
      
      // Revert on error
      setTasks(initialTasks)
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-4 gap-4 w-full">
        {columns.map(column => (
          <div key={column.id} className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">{column.title}</h3>
              <span className="text-xs text-muted-foreground">
                {tasks.filter(task => task.status === column.status).length}
              </span>
            </div>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  className={cn(
                    "rounded-lg p-2 h-[calc(100%-2rem)] overflow-y-auto",
                    column.color,
                    snapshot.isDraggingOver && "ring-2 ring-primary/20 bg-muted/60",
                    "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
                    "border border-border/40"
                  )}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="space-y-3">
                    {tasks
                      .filter(task => task.status === column.status)
                      .map((task, index) => (
                        <Draggable 
                          key={task.id} 
                          draggableId={task.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "transform transition-transform",
                                snapshot.isDragging && "rotate-2 scale-105"
                              )}
                            >
                              <TaskCard 
                                task={task} 
                                onUpdate={(updates) => onTaskUpdate?.(task.id, updates)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}

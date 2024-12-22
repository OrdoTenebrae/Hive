"use client"

import { Card } from "@/components/ui/card"
import { Task } from ".prisma/client"
import { TaskCard } from "./TaskCard"
import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { useTaskStore } from "@/lib/store/task-store"
import { TaskWithAssignee } from "@/types/project"
import { fetchClient } from "@/lib/fetch-client"
import { cn } from "@/lib/utils"

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
}

export function TaskBoard({ projectId, tasks: initialTasks }: TaskBoardProps) {
  const { tasks, setTasks, updateTask } = useTaskStore()

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks, setTasks])

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    if (source.droppableId === destination.droppableId) return

    const newStatus = columns.find(col => col.id === destination.droppableId)?.status
    if (!newStatus) return

    // Optimistically update UI
    updateTask(draggableId, newStatus)

    try {
      await fetchClient(`/api/tasks/${draggableId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      })
    } catch (error) {
      console.error(error)
      // Revert on error
      setTasks(initialTasks)
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 h-full w-full">
        {columns.map(column => (
          <div key={column.id} className="flex-shrink-0 w-[280px]">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">{column.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-background-light">
                  {tasks.filter(task => task.status === column.status).length}
                </span>
              </div>
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
                              <TaskCard task={task} />
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

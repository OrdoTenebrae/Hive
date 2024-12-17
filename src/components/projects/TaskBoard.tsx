"use client"

import { Card } from "@/components/ui/card"
import { Task } from ".prisma/client"
import { TaskCard } from "./TaskCard"
import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { useTaskStore } from "@/lib/store/task-store"
import { TaskWithAssignee } from "@/types/project"
import { fetchClient } from "@/lib/fetch-client"

type Column = {
  id: string
  title: string
  status: Task["status"]
}

const columns: Column[] = [
  { id: "todo", title: "To Do", status: "TODO" },
  { id: "in_progress", title: "In Progress", status: "IN_PROGRESS" },
  { id: "review", title: "In Review", status: "IN_REVIEW" },
  { id: "done", title: "Done", status: "COMPLETED" }
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map(column => (
          <div key={column.id} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{column.title}</h3>
              <span className="text-sm text-primary-medium">
                {tasks.filter(task => task.status === column.status).length}
              </span>
            </div>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <Card 
                  className="p-4 space-y-4 min-h-[200px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tasks
                    .filter(task => task.status === column.status)
                    .map((task, index) => (
                      <Draggable 
                        key={task.id} 
                        draggableId={task.id} 
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </Card>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}

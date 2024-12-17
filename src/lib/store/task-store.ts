import { create } from 'zustand'
import { Task, User } from '.prisma/client'

type TaskWithAssignee = Task & {
  assignee: User
}

interface TaskStore {
  tasks: TaskWithAssignee[]
  setTasks: (tasks: TaskWithAssignee[]) => void
  updateTask: (taskId: string, status: Task['status']) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  updateTask: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      ),
    })),
}))

import { create } from 'zustand'
import { TaskWithAssignee } from '@/types/project'
import { Task } from '@prisma/client'

interface TaskStore {
  tasks: TaskWithAssignee[]
  setTasks: (tasks: TaskWithAssignee[] | ((prev: TaskWithAssignee[]) => TaskWithAssignee[])) => void
  updateTask: (taskId: string, status: Task['status']) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks: typeof tasks === 'function' ? tasks(useTaskStore.getState().tasks) : tasks }),
  updateTask: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      ),
    })),
}))

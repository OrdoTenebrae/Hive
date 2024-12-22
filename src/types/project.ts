import { Project, User, Task } from ".prisma/client"
import { ModuleType } from "./modules"

export type ProjectWithRelations = Project & {
  owner: User
  members: User[]
}

export type ProjectWithFullRelations = ProjectWithRelations & {
  tasks: TaskWithAssignee[]
  installedModules: ModuleType[]
}

export type TaskWithAssignee = Task & {
  assignee?: User
  labels?: string[]
  subtasks?: { id: string; completed: boolean }[]
  completedSubtasks: number
  estimatedTime?: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

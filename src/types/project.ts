import { Project, User, Task } from ".prisma/client"

export type ProjectWithRelations = Project & {
  owner: User
  members: User[]
}

export type ProjectWithFullRelations = ProjectWithRelations & {
  tasks: TaskWithAssignee[]
}

export type TaskWithAssignee = Task & {
  assignee: User
}

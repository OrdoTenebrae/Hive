export type ModuleType = 
  | 'kanban'
  | 'chat'
  | 'analytics'
  | 'calendar'
  | 'whiteboard'
  | 'files'
  | 'meetings'
  | 'insights'
  | 'project-management'
  | 'task-management'
  | 'time-tracking'
  | 'team-collaboration'
  | 'code-review'
  | 'code-generation'
  | 'task-board'
  // Add new module types here

export interface ModuleDefinition {
  id: ModuleType
  title: string
  description: string
  icon: React.ReactNode
  price: string
  features: string[]
  component: React.ComponentType<{ projectId: string }>
  requiredPlan?: 'free' | 'professional' | 'business'
}

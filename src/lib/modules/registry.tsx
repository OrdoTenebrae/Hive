import { ModuleDefinition, ModuleType } from "@/types/modules"
import { TaskBoard } from "@/components/projects/TaskBoard"
import { KanbanSquare, MessageSquare, BarChart2, Calendar } from "lucide-react"

const moduleRegistry = new Map<ModuleType, ModuleDefinition>()

export function registerModule(module: ModuleDefinition) {
  moduleRegistry.set(module.id, module)
}

export function getModule(id: ModuleType) {
  return moduleRegistry.get(id)
}

export function getAllModules() {
  return Array.from(moduleRegistry.values())
}


// Example of how to add a new module:
/*
registerModule({
  id: 'chat',
  title: "Team Chat",
  component: ChatModule,
  // ... other properties
})
*/
// Wrap TaskBoard to handle its own data fetching
const KanbanModule = ({ projectId }: { projectId: string }) => {
  return <TaskBoard projectId={projectId} tasks={[]} />
}

registerModule({
  id: 'kanban',
  title: "Kanban Board",
  description: "Visualize work progress with customizable kanban boards",
  icon: <KanbanSquare className="w-6 h-6" />,
  price: "0",
  features: [/* ... */],
  component: KanbanModule
})
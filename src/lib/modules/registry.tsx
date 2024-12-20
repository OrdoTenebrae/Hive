import React from "react"
import { ModuleType, ModuleDefinition } from "../../types/modules"
import { 
  KanbanSquare, MessageSquare, BarChart2, Calendar, 
  FileText, Video, Brain, GitBranch, Clock, Users, 
  Code, Terminal, Layout 
} from "lucide-react"
import { KanbanModule } from "../../components/modules/KanbanModule"

export const moduleDefinitions: Record<ModuleType, ModuleDefinition> = {
  kanban: {
    id: 'kanban',
    title: "Kanban Board",
    description: "Visualize and manage your workflow with a flexible Kanban board",
    icon: <KanbanSquare className="w-6 h-6" />,
    price: "0",
    features: [
      "AI-powered task organization",
      "Custom workflow states",
      "Task analytics",
      "Progress tracking"
    ],
    component: KanbanModule,
    requiredPlan: "free"
  },
  chat: {
    id: 'chat',
    title: "Team Chat",
    description: "Real-time communication for your team",
    icon: <MessageSquare className="w-6 h-6" />,
    price: "0",
    features: [
      "Real-time messaging",
      "File sharing",
      "Thread discussions",
      "Integrations"
    ],
    component: KanbanModule,
    requiredPlan: "free"
  },
  analytics: {
    id: 'analytics',
    title: "Analytics",
    description: "Track project metrics and team performance",
    icon: <BarChart2 className="w-6 h-6" />,
    price: "10",
    features: [
      "Performance metrics",
      "Custom reports",
      "Data visualization",
      "Export capabilities"
    ],
    component: KanbanModule,
    requiredPlan: "professional"
  },
  calendar: {
    id: 'calendar',
    title: "Calendar",
    description: "Schedule and manage project timelines",
    icon: <Calendar className="w-6 h-6" />,
    price: "0",
    features: [
      "Event scheduling",
      "Timeline view",
      "Deadline tracking",
      "Team availability"
    ],
    component: KanbanModule,
    requiredPlan: "free"
  },
  whiteboard: {
    id: 'whiteboard',
    title: "Whiteboard",
    description: "Collaborative digital whiteboard",
    icon: <Layout className="w-6 h-6" />,
    price: "10",
    features: ["Coming soon"],
    component: KanbanModule,
    requiredPlan: "professional"
  },
  files: {
    id: 'files',
    title: "Files",
    description: "File management system",
    icon: <FileText className="w-6 h-6" />,
    price: "0",
    features: ["Coming soon"],
    component: KanbanModule,
    requiredPlan: "free"
  },
  meetings: {
    id: 'meetings',
    title: "Meetings",
    description: "Meeting management",
    icon: <Video className="w-6 h-6" />,
    price: "10",
    features: ["Coming soon"],
    component: KanbanModule,
    requiredPlan: "professional"
  },
  insights: {
    id: 'insights',
    title: "Insights",
    description: "AI-powered project insights",
    icon: <Brain className="w-6 h-6" />,
    price: "10",
    features: ["Coming soon"],
    component: KanbanModule,
    requiredPlan: "professional"
  },
  'project-management': {
    id: 'project-management',
    title: "Project Management",
    description: "Advanced project management tools",
    icon: <GitBranch className="w-6 h-6" />,
    price: "10",
    features: ["Coming soon"],
    component: KanbanModule,
    requiredPlan: "professional"
  },
  'task-management': {
    id: 'task-management',
    title: "Task Management",
    description: "Task tracking and management",
    icon: <Clock className="w-6 h-6" />,
    price: "0",
    features: ["Coming soon"],
    component: KanbanModule,
    requiredPlan: "free"
  },
  'time-tracking': {
    id: 'time-tracking',
    title: "Time Tracking",
    description: "Track time spent on tasks",
    icon: <Clock className="w-6 h-6" />,
    price: "10",
    features: ["Coming soon"],
    component: KanbanModule,
    requiredPlan: "professional"
  },
  'team-collaboration': {
    id: 'team-collaboration',
    title: "Team Collaboration",
    description: "Enhanced team collaboration tools",
    icon: <Users className="w-6 h-6" />,
    price: "10",
    features: ["Coming soon"],
    component: KanbanModule,
    requiredPlan: "professional"
  },
  'code-review': {
    id: 'code-review',
    title: "Code Review",
    description: "Streamlined code review process",
    icon: <Code className="w-6 h-6" />,
    price: "10",
    features: ["Coming soon"],
    component: KanbanModule,
    requiredPlan: "professional"
  },
  'code-generation': {
    id: 'code-generation',
    title: "Code Generation",
    description: "AI-powered code generation",
    icon: <Terminal className="w-6 h-6" />,
    price: "10",
    features: ["Coming soon"],
    component: KanbanModule,
    requiredPlan: "professional"
  },
  'task-board': {
    id: 'task-board',
    title: "Task Board",
    description: "Visual task management board",
    icon: <Layout className="w-6 h-6" />,
    price: "0",
    features: ["Coming soon"],
    component: KanbanModule,
    requiredPlan: "free"
  }
}

export function getModule(moduleId: ModuleType) {
  return moduleDefinitions[moduleId]
}

export function getAllModules() {
  return Object.values(moduleDefinitions)
}
"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TaskWithAssignee } from "@/types/project"
import { 
  CalendarIcon, 
  Tag, 
  MoreVertical, 
  CheckCircle2,
  Clock,
  ArrowUpCircle,
  CircleDot,
  AlertCircle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider 
} from "@/components/ui/tooltip"

interface TaskCardProps {
  task: TaskWithAssignee
  onUpdate?: (updates: Partial<TaskWithAssignee>) => void
}

const priorityConfig = {
  HIGH: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    label: "High Priority"
  },
  MEDIUM: {
    icon: ArrowUpCircle,
    color: "text-orange-500",
    bg: "bg-orange-50",
    label: "Medium Priority"
  },
  LOW: {
    icon: CircleDot,
    color: "text-muted-foreground",
    bg: "bg-muted",
    label: "Low Priority"
  }
}

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const PriorityIcon = priorityConfig[task.priority]?.icon || CircleDot
  
  return (
    <TooltipProvider>
      <Card className="group relative bg-card hover:shadow-lg transition-all duration-200 border border-border/50">
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={() => onUpdate?.({ priority: 'HIGH' })}>Set High Priority</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onUpdate?.({ priority: 'MEDIUM' })}>Set Medium Priority</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onUpdate?.({ priority: 'LOW' })}>Set Low Priority</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete Task</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <span className={cn(
                    "inline-flex items-center justify-center rounded-full w-5 h-5",
                    priorityConfig[task.priority]?.bg,
                    priorityConfig[task.priority]?.color
                  )}>
                    <PriorityIcon className="w-3.5 h-3.5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>{priorityConfig[task.priority]?.label}</TooltipContent>
              </Tooltip>
              <h4 className="font-medium text-sm flex-1 truncate">{task.title}</h4>
              {task.status === 'COMPLETED' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {task.labels && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.map(label => (
                <Badge 
                  key={label} 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5 bg-secondary/50"
                >
                  {label}
                </Badge>
              ))}
            </div>
          )}

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{task.completedSubtasks}/{task.subtasks.length}</span>
              </div>
              <Progress 
                value={(task.completedSubtasks / task.subtasks.length) * 100} 
                className="h-1.5"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs bg-primary/10">
                  {task.assignee?.name?.slice(0, 2).toUpperCase() || 'NA'}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {task.assignee?.name || 'Unassigned'}
              </span>
            </div>
            
            {task.dueDate && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarIcon className="w-3.5 h-3.5" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </Card>
    </TooltipProvider>
  )
}

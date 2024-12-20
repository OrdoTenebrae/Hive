"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ModuleType } from "@/types/modules"
import { Grip, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, Reorder } from "framer-motion"

interface ModuleGridProps {
  moduleId: ModuleType
  projectId: string
}

interface ModuleState {
  id: string
  size: "normal" | "large"
  order: number
}

export function ModuleGrid({ moduleId, projectId }: ModuleGridProps) {
  const [modules, setModules] = useState<ModuleState[]>([
    { id: "tasks", size: "normal", order: 0 },
    { id: "activity", size: "normal", order: 1 },
    { id: "github", size: "normal", order: 2 },
    { id: "analytics", size: "large", order: 3 }
  ])

  const toggleSize = (id: string) => {
    setModules(modules.map(module => 
      module.id === id 
        ? { ...module, size: module.size === "normal" ? "large" : "normal" }
        : module
    ))
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-1">
      <Reorder.Group axis="y" values={modules} onReorder={setModules}>
        {modules.map((module) => (
          <Reorder.Item
            key={module.id}
            value={module}
            className={cn(
              "rounded-lg",
              module.size === "large" && "col-span-2"
            )}
          >
            <Card className="relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Grip className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => toggleSize(module.id)}
                  >
                    {module.size === "normal" ? (
                      <Maximize2 className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className={cn(
                "p-4",
                module.size === "large" ? "min-h-[400px]" : "min-h-[200px]"
              )}>
                {/* Module content will go here */}
                <div className="text-lg font-medium mb-4 capitalize">
                  {module.id}
                </div>
              </div>
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  )
}
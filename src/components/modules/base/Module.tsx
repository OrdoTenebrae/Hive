"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Grip, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModuleProps {
  id: string
  title: string
  size: "normal" | "large"
  onSizeToggle: (id: string) => void
  children: React.ReactNode
}

export function Module({ id, title, size, onSizeToggle, children }: ModuleProps) {
  return (
    <Card className="relative group h-full">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Grip className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onSizeToggle(id)}
          >
            {size === "normal" ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      <div className={cn(
        "p-4",
        size === "large" ? "min-h-[400px]" : "min-h-[200px]"
      )}>
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        {children}
      </div>
    </Card>
  )
} 
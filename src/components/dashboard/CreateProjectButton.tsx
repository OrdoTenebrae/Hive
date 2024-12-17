"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function CreateProjectButton() {
  const router = useRouter()

  return (
    <Button 
      onClick={() => router.push("/projects/new")}
      className="w-full"
    >
      <Plus className="w-4 h-4 mr-2" />
      Create Project
    </Button>
  )
} 
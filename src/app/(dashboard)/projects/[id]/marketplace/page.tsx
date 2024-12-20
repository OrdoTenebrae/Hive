"use client"

import { useState, useEffect } from "react"
import { ModuleCard } from "@/components/marketplace/ModuleCard"
import { getAllModules } from "@/lib/modules/registry"
import { fetchClient } from "@/lib/fetch-client"
import { toast } from "react-hot-toast"
import { ModuleType } from "@/types/modules"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

export default function MarketplacePage() {
  const [installedModules, setInstalledModules] = useState<ModuleType[]>([])
  const [loading, setLoading] = useState(true)
  const modules = getAllModules()
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    fetchInstalledModules()
  }, [])

  async function fetchInstalledModules() {
    try {
      const response = await fetchClient(`/api/projects/${params.id}/modules`)
      setInstalledModules(response.modules)
    } catch (error) {
      toast.error("Failed to fetch installed modules")
    } finally {
      setLoading(false)
    }
  }

  async function handleInstall(moduleId: ModuleType) {
    try {
      await fetchClient(`/api/projects/${params.id}/modules`, {
        method: 'POST',
        body: JSON.stringify({ moduleId })
      })
      setInstalledModules(prev => [...prev, moduleId])
      toast.success("Module installed successfully")
    } catch (error) {
      toast.error("Failed to install module")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-8 pb-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => router.push(`/projects/${params.id}`)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Marketplace</h1>
          <p className="text-sm text-muted-foreground">
            Enhance your project with powerful modules
          </p>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {modules.map(module => (
            <ModuleCard
              key={module.id}
              {...module}
              installed={installedModules.includes(module.id)}
              onInstall={() => handleInstall(module.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
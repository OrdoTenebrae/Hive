"use client"

import { useState, useEffect } from "react"
import { ModuleLoader } from "@/components/modules/ModuleLoader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getModule } from "@/lib/modules/registry"
import { ModuleType } from "@/types/modules"
import { Button } from "@/components/ui/button"
import { Store } from "lucide-react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { fetchClient } from "@/lib/fetch-client"

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const [installedModules, setInstalledModules] = useState<ModuleType[]>(['kanban'])
  const pathname = usePathname()
  const params = useParams()
  const isMarketplace = pathname.endsWith('/marketplace')
  
  useEffect(() => {
    fetchClient(`/api/projects/${params.id}/modules`)
      .then(response => setInstalledModules(response.modules))
      .catch(console.error)
  }, [params.id])

  if (isMarketplace) {
    return children
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 max-w-7xl mx-auto space-y-8 w-full">
        <div className="flex justify-between items-center">
          {children}
          <Link href={`/projects/${params.id}/marketplace`}>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Store className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <Tabs defaultValue={installedModules[0]} className="w-full">
          <TabsList className="mb-4">
            {installedModules.map(moduleId => {
              const module = getModule(moduleId as ModuleType)
              if (!module) return null
              return (
                <TabsTrigger key={moduleId} value={moduleId}>
                  {module.icon}
                  <span className="ml-2">{module.title}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {installedModules.map(moduleId => (
            <TabsContent key={moduleId} value={moduleId} className="mt-4">
              <ModuleLoader moduleId={moduleId as ModuleType} projectId={params.id as string} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
import { Suspense } from 'react'
import { getModule } from '@/lib/modules/registry'
import { ModuleType } from '@/types/modules'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface ModuleLoaderProps {
  moduleId: ModuleType
  projectId: string
}

export function ModuleLoader({ moduleId, projectId }: ModuleLoaderProps) {
  const module = getModule(moduleId)
  if (!module) return null
  
  const ModuleComponent = module.component
  
  return (
    <Suspense fallback={
      <Card className="p-4 flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </Card>
    }>
      <ModuleComponent projectId={projectId} />
    </Suspense>
  )
}
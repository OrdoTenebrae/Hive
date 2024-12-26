import { ModuleType } from "@/types/modules"

const moduleRegistry = new Map()

export function getModule(moduleId: ModuleType) {
  return moduleRegistry.get(moduleId)
}

export function registerModule(moduleId: ModuleType, module: any) {
  moduleRegistry.set(moduleId, module)
}
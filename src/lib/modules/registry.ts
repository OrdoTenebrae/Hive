import { AIDataService } from '@/lib/services/ai-data'
import { prisma } from '@/lib/prisma'

export async function installModule(projectId: string, moduleId: string) {
  // Update PostgreSQL for core module tracking
  await prisma.project.update({
    where: { id: projectId },
    data: { 
      installedModules: {
        set: ['kanban'] // Initialize with kanban as default if null
      }
    }
  })

  // Store module-specific AI data in MongoDB
  const aiService = new AIDataService()
  await aiService.saveData({
    referenceId: `${projectId}_${moduleId}`,
    documentType: 'module_data',
    data: {
      moduleId,
      configuration: {},
      aiState: {},
      lastAnalysis: null
    }
  })
}
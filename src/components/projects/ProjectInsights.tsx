import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Loader2, AlertTriangle, TrendingUp, Clock } from "lucide-react"

interface ProjectInsights {
  performance: {
    velocity: number
    completionRate: number
    avgTaskDuration: number
  }
  predictions: {
    estimatedCompletion: string
    potentialDelays: string[]
    recommendations: string[]
  }
  workload: {
    memberId: string
    memberName: string
    taskCount: number
    utilizationRate: number
  }[]
}

interface ProjectInsightsProps {
  projectId: string
}

export function ProjectInsights({ projectId }: ProjectInsightsProps) {
  const [insights, setInsights] = useState<ProjectInsights | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInsights() {
      try {
        const response = await fetch(`/api/projects/${projectId}/insights`)
        if (!response.ok) throw new Error('Failed to fetch insights')
        const data = await response.json()
        setInsights(data)
      } catch (error) {
        console.error('Error fetching insights:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [projectId])

  if (loading) {
    return (
      <Card className="p-4 flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin" />
      </Card>
    )
  }

  if (!insights) return null

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">AI Project Insights</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance Metrics
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-primary-medium">Sprint Velocity</p>
              <p className="text-lg font-medium">{insights.performance.velocity}</p>
            </div>
            <div>
              <p className="text-xs text-primary-medium">Completion Rate</p>
              <p className="text-lg font-medium">{insights.performance.completionRate}%</p>
            </div>
            <div>
              <p className="text-xs text-primary-medium">Avg Task Duration</p>
              <p className="text-lg font-medium">{insights.performance.avgTaskDuration}d</p>
            </div>
          </div>
        </div>

        {insights.predictions.potentialDelays.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Potential Risks
            </h4>
            <ul className="space-y-2">
              {insights.predictions.potentialDelays.map((delay, i) => (
                <li key={i} className="text-sm text-primary-medium">{delay}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            AI Recommendations
          </h4>
          <ul className="space-y-2">
            {insights.predictions.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-primary-medium">{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}

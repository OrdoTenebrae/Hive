import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface CommitSummaryProps {
  projectId: string
}

interface Summary {
  codeChanges: {
    features: string[]
    bugFixes: string[]
    refactoring: string[]
  }
  fileUpdates: {
    modified: number
    added: number
    deleted: number
  }
  milestone: string
}

export function CommitSummary({ projectId }: CommitSummaryProps) {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch(`/api/projects/${projectId}/commit-summary`)
        if (!response.ok) throw new Error('Failed to fetch summary')
        const data = await response.json()
        setSummary(data)
      } catch (error) {
        console.error('Error fetching summary:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [projectId])

  if (loading) {
    return (
      <Card className="p-4 flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin" />
      </Card>
    )
  }

  if (!summary) return null

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">AI Commit Summary</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Code Changes</h4>
          <div className="space-y-2">
            {summary.codeChanges.features.length > 0 && (
              <div>
                <p className="text-xs text-primary-medium">New Features:</p>
                <ul className="list-disc list-inside text-sm">
                  {summary.codeChanges.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            {summary.codeChanges.bugFixes.length > 0 && (
              <div>
                <p className="text-xs text-primary-medium">Bug Fixes:</p>
                <ul className="list-disc list-inside text-sm">
                  {summary.codeChanges.bugFixes.map((fix, i) => (
                    <li key={i}>{fix}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">File Updates</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-xs text-primary-medium">Modified</p>
              <p>{summary.fileUpdates.modified}</p>
            </div>
            <div>
              <p className="text-xs text-primary-medium">Added</p>
              <p>{summary.fileUpdates.added}</p>
            </div>
            <div>
              <p className="text-xs text-primary-medium">Deleted</p>
              <p>{summary.fileUpdates.deleted}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Current Milestone</h4>
          <p className="text-sm">{summary.milestone}</p>
        </div>
      </div>
    </Card>
  )
}

import { Card } from "@/components/ui/card"
import { 
  GitCommit, 
  CheckCircle2, 
  MessageSquare, 
  GitPullRequest 
} from "lucide-react"
import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  type: 'commit' | 'task' | 'comment' | 'pr'
  title: string
  project: string
  user: string
  time: Date
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch('/api/activities')
        if (!response.ok) throw new Error('Failed to fetch activities')
        const data = await response.json()
        setActivities(data)
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'commit': return <GitCommit className="w-4 h-4" />
      case 'task': return <CheckCircle2 className="w-4 h-4" />
      case 'comment': return <MessageSquare className="w-4 h-4" />
      case 'pr': return <GitPullRequest className="w-4 h-4" />
    }
  }

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map(activity => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-2 hover:bg-primary-dark/5 rounded-lg transition-colors"
          >
            <div className="mt-1 text-primary-medium">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{activity.title}</p>
              <p className="text-sm text-primary-medium">
                by {activity.user} in {activity.project}
              </p>
              <p className="text-xs text-primary-medium/70">
                {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

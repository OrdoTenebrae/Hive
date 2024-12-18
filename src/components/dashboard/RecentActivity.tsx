"use client"

import { Card } from "@/components/ui/card"
import { 
  GitCommit, 
  CheckCircle2, 
  MessageSquare, 
  GitPullRequest,
  Clock
} from "lucide-react"
import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

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
        const token = localStorage.getItem('token')
        const response = await fetch('/api/activities', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
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

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'commit': return 'text-blue-500'
      case 'task': return 'text-green-500'
      case 'comment': return 'text-purple-500'
      case 'pr': return 'text-orange-500'
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-4 h-4 rounded-full mt-1" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-[17px] w-px bg-gray-100" />
        <div className="space-y-6">
          {activities.map(activity => (
            <div key={activity.id} className="flex gap-4 relative">
              <div className={`mt-1 shrink-0 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">
                  <span className="text-primary-dark">{activity.user}</span>
                  {' '}
                  <span className="text-primary-medium">{activity.title}</span>
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-primary-medium/70">
                  <span>{activity.project}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(activity.time), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

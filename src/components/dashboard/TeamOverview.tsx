import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"

interface TeamMember {
  id: string
  name: string
  role: string
  tasksCompleted: number
  totalTasks: number
  activeProject: string
}

export function TeamOverview() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTeamData() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/team', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) throw new Error('Failed to fetch team data')
        const data = await response.json()
        setMembers(data)
      } catch (error) {
        console.error('Error fetching team data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [])

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Team Overview</h2>
      <div className="space-y-4">
        {members.map(member => (
          <div key={member.id} className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>
                {member.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-primary-medium">{member.role}</p>
              </div>
              <p className="text-sm text-primary-medium truncate">
                Working on: {member.activeProject}
              </p>
              <div className="mt-2">
                <Progress 
                  value={(member.tasksCompleted / member.totalTasks) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-primary-medium mt-1">
                  {member.tasksCompleted} of {member.totalTasks} tasks completed
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
} 
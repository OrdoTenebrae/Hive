"use client"

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
    <Card>
      <div className="border-b border-border p-4">
        <h2 className="font-semibold">Team Members</h2>
      </div>
      <div className="divide-y divide-border">
        {members.map(member => (
          <div key={member.id} className="p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {member.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{member.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {member.activeProject}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
} 
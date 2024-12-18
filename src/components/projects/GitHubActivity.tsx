"use client"

import { Card } from "@/components/ui/card"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"

interface Commit {
  id: string
  message: string
  author: string
  timestamp: string
  url: string
}

interface GitHubActivityProps {
  projectId: string
  repoUrl: string
}

export function GitHubActivity({ projectId, repoUrl }: GitHubActivityProps) {
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCommits() {
      try {
        const response = await fetch(`/api/projects/${projectId}/commits`)
        if (!response.ok) throw new Error('Failed to fetch commits')
        const data = await response.json()
        setCommits(data)
      } catch (error) {
        console.error('Error fetching commits:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCommits()
  }, [projectId])

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Recent Commits</h3>
        <a 
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary-medium hover:text-primary-dark flex items-center gap-2"
        >
          <GitHubLogoIcon className="w-4 h-4" />
          View Repository
        </a>
      </div>
      
      <div className="space-y-3">
        {loading ? (
          <div className="text-sm text-primary-medium">Loading commits...</div>
        ) : commits.length === 0 ? (
          <div className="text-sm text-primary-medium">No recent commits</div>
        ) : (
          commits.map(commit => (
            <a
              key={commit.id}
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2 hover:bg-primary-dark/5 rounded-lg transition-colors"
            >
              <p className="font-medium text-sm line-clamp-1">{commit.message}</p>
              <div className="flex justify-between text-xs text-primary-medium mt-1">
                <span>{commit.author}</span>
                <span>{formatDistanceToNow(new Date(commit.timestamp))} ago</span>
              </div>
            </a>
          ))
        )}
      </div>
    </Card>
  )
}

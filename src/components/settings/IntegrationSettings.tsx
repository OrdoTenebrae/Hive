"use client"

import { Button } from "@/components/ui/button"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Slack } from "lucide-react"

export function IntegrationSettings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <GitHubLogoIcon className="w-5 h-5" />
            <h4 className="font-medium">GitHub</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Connect your GitHub account
          </p>
        </div>
        <Button variant="outline">Connect</Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Slack />
            <h4 className="font-medium">Slack</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Connect with Slack for notifications
          </p>
        </div>
        <Button variant="outline">Connect</Button>
      </div>
    </div>
  )
}

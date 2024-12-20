"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function NotificationSettings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Email Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive email updates about your projects
          </p>
        </div>
        <Switch />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Task Reminders</Label>
          <p className="text-sm text-muted-foreground">
            Get notified about upcoming task deadlines
          </p>
        </div>
        <Switch />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Project Updates</Label>
          <p className="text-sm text-muted-foreground">
            Receive updates when project status changes
          </p>
        </div>
        <Switch />
      </div>
    </div>
  )
}

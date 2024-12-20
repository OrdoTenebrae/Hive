"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "react-hot-toast"

export function SettingsForm() {
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      // API call to update settings
      toast.success("Settings updated successfully")
    } catch (error) {
      toast.error("Failed to update settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input placeholder="Your name" />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" placeholder="your@email.com" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Bio</label>
        <Textarea placeholder="Tell us about yourself" />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}

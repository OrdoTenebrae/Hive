import { Card } from "@/components/ui/card"
import { verifyJwt } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SettingsForm } from "@/components/settings/SettingsForm"
import { NotificationSettings } from "@/components/settings/NotificationSettings"
import { IntegrationSettings } from "@/components/settings/IntegrationSettings"

export default async function SettingsPage() {
  const payload = await verifyJwt()
  if (!payload) redirect('/auth/login')

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Profile Settings</h2>
            <SettingsForm />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
            <NotificationSettings />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Integrations</h2>
            <IntegrationSettings />
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Account Summary</h2>
            {/* Account summary content */}
          </Card>
        </div>
      </div>
    </div>
  )
}

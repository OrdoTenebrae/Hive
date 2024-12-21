import { Card } from "@/components/ui/card"
import { verifyJwt } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SettingsForm } from "@/components/settings/SettingsForm"
import { NotificationSettings } from "@/components/settings/NotificationSettings"
import { IntegrationSettings } from "@/components/settings/IntegrationSettings"
import { Meta } from "@/components/seo/Meta"
import { PageTransition } from "@/components/transitions/PageTransition"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { ProjectsList } from "@/components/dashboard/ProjectsList"

export default async function SettingsPage() {
  const payload = await verifyJwt()
  if (!payload) redirect('/auth/login')

  return (
      <>
        <Meta 
          title="Dashboard"
          description="View your project statistics, recent activities, and manage your tasks"
        />
        <PageTransition>
          <div className="p-6">
            <div className="mt-8 grid grid-cols-12 gap-6">

                <Card className="overflow-hidden">
                  <div className="border-b border-border p-4">
                    <h2 className="font-semibold">Your Projects</h2>
                  </div>
                  <ProjectsList />
                </Card>
              </div>
              
              <div className="col-span-12 lg:col-span-3 space-y-6">
                <RecentActivity />
              </div>
            </div>
        </PageTransition>
      </>
  )
}

import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { verifyJwt } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const payload = await verifyJwt()
  
  if (!payload) {
    redirect('/auth/login')
  }

  return (
    <div className="h-screen flex">
      <div className="fixed inset-y-0 w-64">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64">
        <div className="sticky top-0 z-40">
          <Header user={{ name: payload.name as string, email: payload.email }} />
        </div>
        <main className="p-8 bg-background-light min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

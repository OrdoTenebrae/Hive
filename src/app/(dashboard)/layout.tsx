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
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header user={{ name: payload.name as string, email: payload.email }} />
        <main className="flex-1 overflow-y-auto bg-background-light">
          {children}
        </main>
      </div>
    </div>
  )
}

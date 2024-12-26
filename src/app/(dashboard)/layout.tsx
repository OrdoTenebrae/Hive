import { headers } from 'next/headers'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const user = {
    name: headersList.get('x-user-name') || 'User',
    email: headersList.get('x-user-email') || '',
    role: headersList.get('x-user-role') || 'USER'
  }

  return (
    <div className="h-screen flex">
      <div className="fixed inset-y-0 w-64">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64">
        <div className="sticky top-0 z-40">
          <Header user={user} />
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

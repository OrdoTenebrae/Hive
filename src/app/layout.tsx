import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Freelance Suite',
  description: 'Professional project management platform for freelancers and teams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background-light text-primary-dark`}>
        <div className="flex min-h-screen">
          <div className="flex-1">
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}

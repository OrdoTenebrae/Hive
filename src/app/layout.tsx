import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "react-hot-toast"

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
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}

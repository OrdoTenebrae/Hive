import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "react-hot-toast"
import Script from 'next/script'
import { AnimatePresence } from "framer-motion"

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
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url("https://use.typekit.net/[your-kit-code].css");
          
          .font-bold, .font-semibold, h1, h2, h3, h4, h5, h6 {
            font-family: zeitung, sans-serif;
          }
        `}} />
      </head>
      <body className={`${inter.className} bg-background-light text-primary-dark`}>
        <AuthProvider>
          <AnimatePresence mode="wait" initial={false}>
            {children}
          </AnimatePresence>
        </AuthProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}

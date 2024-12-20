"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Logo from "@/components/logo"
import { useAuth } from "@/contexts/AuthContext"
import { Card } from "@/components/ui/card"
import { Github } from "lucide-react"
import Image from "next/image"
import { AuthTransition } from "@/components/transitions/AuthTransition"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function RegisterPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      login(data.token, data.user)
      router.push('/dashboard')
      toast.success("Account created successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to register")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthTransition>
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md p-8 border-0 shadow-lg">
            <div className="text-center mb-8">
              <Link href="/" className="text-2xl font-bold tracking-tight">
                Hive
              </Link>
              <h1 className="mt-6 text-2xl font-bold tracking-tight">Create an account</h1>
              <p className="mt-2 text-sm text-gray-600">
                Get started with your free account
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button 
                variant="outline" 
                className="w-full bg-white border-2 hover:bg-gray-50 font-medium"
                onClick={() => void(0)}
              >
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>

              <Button 
                variant="outline" 
                className="w-full bg-white border-2 hover:bg-gray-50 font-medium"
                onClick={() => void(0)}
              >
                <Image 
                  src="/google.svg"
                  alt="Google" 
                  width={20} 
                  height={20} 
                  className="mr-2"
                />
                Google
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="" 
                          {...field}
                          className="border-2 focus:ring-0 focus:border-black" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="" 
                          {...field}
                          className="border-2 focus:ring-0 focus:border-black" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="" 
                          {...field}
                          className="border-2 focus:ring-0 focus:border-black" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-black hover:bg-gray-800 text-white py-6" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </Form>

            <p className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account?</span>{" "}
              <Link 
                href="/auth/login" 
                className="font-medium text-black hover:text-gray-900 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </Card>
        </div>

        {/* Right side - Image/Pattern */}
        <div className="hidden lg:block lg:w-1/2 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, #e5e5e5 1px, transparent 0)`,
            backgroundSize: '40px 40px' 
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80" />
          <div className="absolute bottom-0 left-0 right-0 p-16">
            <blockquote className="text-xl font-medium text-gray-900 mb-4">
              "The onboarding experience was seamless. Within minutes, our team was up and running."
            </blockquote>
            <cite className="text-gray-600 block">
              <span className="font-medium text-gray-900">Michael Chen</span>
              <br />
              Head of Engineering at StartupCo
            </cite>
          </div>
        </div>
      </div>
    </AuthTransition>
  )
} 
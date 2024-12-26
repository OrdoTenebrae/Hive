import { verifyJwt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value || cookieStore.get('Authorization')?.value?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJwt(token)
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock activities data matching your interface
    const activities = [
      {
        id: '1',
        type: 'commit',
        title: 'Updated README.md',
        project: 'Project Alpha',
        user: 'John Doe',
        time: new Date()
      },
      {
        id: '2',
        type: 'task',
        title: 'Completed API Integration',
        project: 'Project Beta',
        user: 'Jane Smith',
        time: new Date(Date.now() - 3600000)
      },
      // Add more mock activities as needed
    ]

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 
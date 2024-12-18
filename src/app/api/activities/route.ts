import { verifyJwt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const payload = await verifyJwt()
    if (!payload) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      })
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
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    })
  }
} 
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Octokit } from "@octokit/rest"
import { verifyJwt } from "@/lib/auth"
import { cookies } from "next/headers"

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value || cookieStore.get('Authorization')?.value?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { githubRepo: true }
    })

    if (!project?.githubRepo) {
      return new NextResponse("No GitHub repository linked", { status: 404 })
    }

    const [owner, repo] = project.githubRepo.split('/')
    const { data: commits } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: 5
    })

    return NextResponse.json(
      commits.map(commit => ({
        id: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author?.name || 'Unknown',
        timestamp: commit.commit.author?.date,
        url: commit.html_url
      }))
    )
  } catch (error) {
    console.error('Error fetching commits:', error)
    return new NextResponse("Failed to fetch commits", { status: 500 })
  }
}
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { analyzeCommits, parseAIAnalysis } from "@/lib/services/ai-services"
import { Octokit } from "@octokit/rest"
import { verifyJwt } from "@/lib/auth"
import { cookies } from 'next/headers'

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN
})

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value || cookieStore.get('Authorization')?.value?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await verifyJwt(token)
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch project and commits
    const project = await prisma.project.findUnique({
      where: { id: context.params.id },
      select: { githubRepo: true }
    })

    if (!project?.githubRepo) {
      return new NextResponse("No GitHub repository linked", { status: 404 })
    }

    const [owner, repo] = project.githubRepo.split('/')
    const { data: commits } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: 10
    })

    // Use AI to analyze commits
    const analysis = await analyzeCommits(commits)
    if (!analysis) {
      return NextResponse.json({ 
        codeChanges: { features: [], bugFixes: [], refactoring: [] },
        milestone: 'No commits to analyze'
      })
    }

    // Parse AI response and structure it
    const summary = parseAIAnalysis(analysis)
    
    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error generating commit summary:', error)
    return new NextResponse("Failed to generate summary", { status: 500 })
  }
}

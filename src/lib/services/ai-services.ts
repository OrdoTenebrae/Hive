import OpenAI from 'openai'
import { Project, Task, User } from '.prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface ProjectWithRelations extends Project {
  tasks: (Task & { assignee: User | null })[]
  members: User[]
  owner: User
}

export async function analyzeCommits(commits: any[]) {
  if (commits.length === 0) return null;
  const commitMessages = commits.map(c => c.message).join('\n')
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: `You are a code analysis expert. Analyze these git commits and provide a structured response in this format:
        Features:
        - [list new features]
        Bug Fixes:
        - [list bug fixes]
        Refactoring:
        - [list refactoring changes]
        Phase: [current development phase]
        Progress: [estimated progress percentage]
        Next Steps: [recommended next steps]`
    }, {
      role: "user",
      content: commitMessages
    }],
    temperature: 0.3,
  })

  return response.choices[0].message.content || null
}

export async function predictWorkload(project: ProjectWithRelations) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: `Analyze this project's workload distribution and provide insights in this format:
        Bottlenecks:
        - [list potential bottlenecks]
        Recommendations:
        - [list workload optimization suggestions]
        Risk Level: [LOW/MEDIUM/HIGH]
        Timeline Impact: [estimated impact on project timeline]`
    }, {
      role: "user",
      content: JSON.stringify({
        tasks: project.tasks,
        members: project.members.map(m => ({
          id: m.id,
          name: m.name,
          assignedTasks: project.tasks.filter(t => t.assigneeId === m.id)
        }))
      })
    }],
    temperature: 0.3,
  })

  return response.choices[0].message.content
}

export async function generatePhaseReport(project: ProjectWithRelations) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: `Generate a comprehensive phase report in this format:
        Completed Work:
        - [list completed tasks and features]
        In Progress:
        - [list ongoing work]
        Upcoming:
        - [list planned work]
        Risks:
        - [list potential risks]
        Timeline Status: [AHEAD/ON_TRACK/DELAYED]
        Recommendations:
        - [list actionable recommendations]`
    }, {
      role: "user",
      content: JSON.stringify(project)
    }],
    temperature: 0.3,
  })

  return response.choices[0].message.content
}

export function parseAIAnalysis(analysis: string) {
  return {
    codeChanges: {
      features: analysis.match(/Features:(.*?)(?=Bug Fixes:|$)/s)?.[1]?.split('\n').filter(line => line.trim().startsWith('-')).map(s => s.trim().slice(2)) || [],
      bugFixes: analysis.match(/Bug Fixes:(.*?)(?=Refactoring:|$)/s)?.[1]?.split('\n').filter(line => line.trim().startsWith('-')).map(s => s.trim().slice(2)) || [],
      refactoring: analysis.match(/Refactoring:(.*?)(?=Phase:|$)/s)?.[1]?.split('\n').filter(line => line.trim().startsWith('-')).map(s => s.trim().slice(2)) || []
    },
    phase: analysis.match(/Phase:(.*?)(?=Progress:|$)/s)?.[1]?.trim() || 'Unknown',
    progress: parseInt(analysis.match(/Progress: (\d+)%/)?.[1] || '0'),
    nextSteps: analysis.match(/Next Steps:(.*?)$/s)?.[1]?.split('\n').filter(line => line.trim().startsWith('-')).map(s => s.trim().slice(2)) || []
  }
}

export function parseWorkloadPrediction(analysis: string) {
  return {
    bottlenecks: analysis.match(/Bottlenecks:(.*?)(?=Recommendations:|$)/s)?.[1]?.split('\n').filter(line => line.trim().startsWith('-')).map(s => s.trim().slice(2)) || [],
    recommendations: analysis.match(/Recommendations:(.*?)(?=Risk Level:|$)/s)?.[1]?.split('\n').filter(line => line.trim().startsWith('-')).map(s => s.trim().slice(2)) || [],
    riskLevel: analysis.match(/Risk Level: (LOW|MEDIUM|HIGH)/)?.[1] || 'UNKNOWN',
    timelineImpact: analysis.match(/Timeline Impact:(.*?)$/s)?.[1]?.trim() || 'Unknown'
  }
}

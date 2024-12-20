import { ProjectWithRelations, ProjectWithFullRelations } from '@/types/project';
import { openai, gemini, getAIClient } from './ai-config';
import { Project, Task, User } from '.prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function processAIResponse(tier: 'free' | 'paid', taskComplexity: 'low' | 'high', prompt: string, content: string) {
  const clientType = getAIClient(tier, taskComplexity);

  if (clientType === 'openai') {
    const response = await openai!.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }, { role: "user", content }],
      temperature: 0.3,
    });
    return response.choices[0].message.content;
  } else {
    const model = gemini!.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.3,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });

    // Create a chat session
    const chat = model.startChat({
      history: [],
      generationConfig: { temperature: 0.3 }
    });

    // Send both system prompt and content
    const result = await chat.sendMessage(`${prompt}\n\nContent to analyze:\n${content}`);
    return result.response.text();
  }
}

export async function analyzeCommits(commits: any[], tier: 'free' | 'paid' = 'free') {
  if (commits.length === 0) return null;
  const commitMessages = commits.map(c => c.message).join('\n');
  
  return processAIResponse(tier, 'low',
    `You are a code analysis expert. Analyze these git commits...`,
    commitMessages
  );
}

export async function predictWorkload(project: ProjectWithFullRelations, tier: 'free' | 'paid' = 'free') {
  const response = await processAIResponse(tier, 'high',
    `Analyze this project's workload distribution...`,
    JSON.stringify({
      tasks: project.tasks,
      members: project.members.map(m => ({
        id: m.id,
        name: m.name,
        assignedTasks: project.tasks.filter((t: Task) => t.assigneeId === m.id)
      }))
    })
  );

  return response;
}

export async function generatePhaseReport(project: ProjectWithRelations, tier: 'free' | 'paid' = 'free') {
  const response = await processAIResponse(tier, 'low',
    `Generate a comprehensive phase report in this format:
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
      - [list actionable recommendations]`,
    JSON.stringify(project)
  );

  return response;
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

export async function generateProjectInsights(project: ProjectWithFullRelations) {
  const analysis = await processAIResponse(
    'free',
    'low',
    'Analyze this project and provide insights about performance, predictions, and workload.',
    JSON.stringify(project)
  )

  return {
    performance: {
      velocity: calculateVelocity(project.tasks),
      completionRate: calculateCompletionRate(project.tasks),
      avgTaskDuration: calculateAvgDuration(project.tasks)
    },
    predictions: {
      estimatedCompletion: calculateEstimatedCompletion(project),
      potentialDelays: extractDelays(analysis || ''),
      recommendations: extractRecommendations(analysis || '')
    },
    workload: project.members.map(member => ({
      memberId: member.id,
      memberName: member.name || 'Unknown',
      taskCount: project.tasks.filter(t => t.assigneeId === member.id).length,
      utilizationRate: calculateUtilization(project.tasks, member.id)
    }))
  }
}

function calculateVelocity(tasks: Task[]): number {
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
  const timeFrame = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  const recentTasks = completedTasks.filter(t => 
    new Date().getTime() - new Date(t.updatedAt).getTime() < timeFrame
  );
  return recentTasks.length;
}

function calculateCompletionRate(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  return (tasks.filter(t => t.status === 'COMPLETED').length / tasks.length) * 100;
}

function calculateAvgDuration(tasks: Task[]): number {
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
  if (completedTasks.length === 0) return 0;
  
  const totalDuration = completedTasks.reduce((sum, task) => {
    const duration = new Date(task.updatedAt).getTime() - new Date(task.createdAt).getTime();
    return sum + duration;
  }, 0);
  
  return Math.round(totalDuration / (completedTasks.length * 24 * 60 * 60 * 1000));
}

function calculateEstimatedCompletion(project: ProjectWithFullRelations): string {
  const incompleteTasks = project.tasks.filter(t => t.status !== 'COMPLETED');
  const avgDuration = calculateAvgDuration(project.tasks);
  const estimatedDays = avgDuration * incompleteTasks.length;
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);
  return estimatedDate.toISOString().split('T')[0];
}

function extractDelays(analysis: string): string[] {
  return analysis.match(/Delays:(.*?)(?=\n|$)/s)?.[1]?.split(',').map(s => s.trim()) || [];
}

function extractRecommendations(analysis: string): string[] {
  return analysis.match(/Recommendations:(.*?)(?=\n|$)/s)?.[1]?.split(',').map(s => s.trim()) || [];
}

function calculateUtilization(tasks: Task[], memberId: string): number {
  const memberTasks = tasks.filter(t => t.assigneeId === memberId);
  const activeTasks = memberTasks.filter(t => t.status === 'IN_PROGRESS');
  const maxRecommendedTasks = 5; // Configurable threshold
  
  return Math.min((activeTasks.length / maxRecommendedTasks) * 100, 100);
}
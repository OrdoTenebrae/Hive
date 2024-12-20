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

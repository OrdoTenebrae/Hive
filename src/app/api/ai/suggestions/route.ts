import { NextResponse } from "next/server"
import { processAIResponse } from "@/lib/services/ai-services"

export async function POST(req: Request) {
  try {
    const { input, projectName } = await req.json()
    
    if (!input || typeof input !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const prompt = `You are a professional technical writer helping to complete project descriptions.
      Project Name: "${projectName}"
      
      Rules:
      1. Continue the exact text from where it ends
      2. Match the tone and style of the input
      3. Keep the completion concise and professional
      4. Focus on technical and project-specific details
      5. Ensure the completion flows naturally from the input
      6. Do not start new sentences unless the current one is complete
      7. The completion should be relevant to the project name and context
      
      Current input: "${input}"
      
      Complete the text naturally, maintaining the same professional tone.`

    const response = await processAIResponse(
      'free',
      'low',
      prompt,
      input
    )

    return NextResponse.json({ suggestion: response })
  } catch (error) {
    console.error('AI suggestion error:', error)
    return NextResponse.json({ error: 'Failed to generate suggestion' }, { status: 500 })
  }
}
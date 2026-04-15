/**
 * AI Integration Service
 * Integrates with OpenAI API for proposal/description generation
 */

/**
 * Generate project description using AI
 */
export async function generateProjectDescription(
  projectTitle: string,
  requirements: string
): Promise<string> {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional project description writer. Write clear, concise, and compelling project descriptions for freelance marketplace.',
          },
          {
            role: 'user',
            content: `Generate a professional project description for: "${projectTitle}"\n\nRequirements: ${requirements}\n\nProvide a comprehensive description (100-200 words).`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${error.error?.message}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Unable to generate description'
  } catch (error) {
    console.error('[AI_DESCRIPTION_ERROR]', error)
    throw error
  }
}

/**
 * Generate proposal using AI
 */
export async function generateProposal(
  projectTitle: string,
  projectDescription: string,
  freelancerProfile: string
): Promise<string> {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert proposal writer for freelancers. Write compelling, professional proposals that highlight relevant skills and experience.',
          },
          {
            role: 'user',
            content: `Write a professional proposal for this project:
Title: "${projectTitle}"
Description: ${projectDescription}

Freelancer Profile: ${freelancerProfile}

Create a compelling proposal (150-250 words) that shows why the freelancer is perfect for this project.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 400,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${error.error?.message}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Unable to generate proposal'
  } catch (error) {
    console.error('[AI_PROPOSAL_ERROR]', error)
    throw error
  }
}

/**
 * Generate proposal summary using AI
 */
export async function summarizeProposal(proposal: string): Promise<string> {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a concise summarizer. Summarize proposals into key points only.',
          },
          {
            role: 'user',
            content: `Summarize this proposal in 2-3 bullet points:\n\n${proposal}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 150,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${error.error?.message}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Unable to summarize'
  } catch (error) {
    console.error('[AI_SUMMARY_ERROR]', error)
    throw error
  }
}

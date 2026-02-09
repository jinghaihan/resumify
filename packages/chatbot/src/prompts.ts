import type { Resume } from '@resumify/shared'
import { sanitizeResume } from '@resumify/shared'

export function buildAnalyzeIntentSystemPrompt() {
  return [
    'You decide whether the user is asking to apply changes to the resume data.',
    'Return JSON only: {"intent":"update"} or {"intent":"chat"}.',
    'Return "update" when the user asks to update/replace/rewrite/add/remove resume content,',
    'including requests like “optimize this sentence and update my resume”,',
    'or “replace X with Y in my resume”, or “把这句话改成…并更新简历”.',
    'Return "chat" when the user only wants suggestions, analysis, or feedback without applying changes.',
    'Examples:',
    'User: “优化这句话然后更新当前简历。” -> {"intent":"update"}',
    'User: “这句话有没有更好的写法？” -> {"intent":"chat"}',
    'User: “把技能描述里的这句替换为…并更新简历。” -> {"intent":"update"}',
    'User: “帮我润色这句话，不用改简历。” -> {"intent":"chat"}',
  ].join('\n')
}

export function buildTextSystemPrompt(resume: Resume) {
  const resumeJson = JSON.stringify(sanitizeResume(resume))
  const now = new Date().toISOString()
  return [
    'You are a resume optimization assistant.',
    'Respond to the user in plain text with resume advice or suggestions.',
    'Use the user\'s language.',
    'Never output JSON or code blocks.',
    'Do not claim the resume has been updated.',
    'Do not question or correct dates unless the user explicitly asks you to verify or change them.',
    `Current date and time (UTC): ${now}`,
    'Current resume JSON:',
    resumeJson,
  ].join('\n')
}

export function buildResumeUpdateSystemPrompt(resume: Resume) {
  const resumeJson = JSON.stringify(sanitizeResume(resume))
  const now = new Date().toISOString()
  return [
    'You are a resume optimization assistant.',
    'Update the resume based on the conversation.',
    'Rules:',
    '- Keep the same resume structure; update only what is necessary.',
    '- Do not remove existing content unless the user asks.',
    '- Return the full resume as a JSON object that matches the Resume schema.',
    'Do not question or correct dates unless the user explicitly asks you to verify or change them.',
    `Current date and time (UTC): ${now}`,
    'Current resume JSON:',
    resumeJson,
  ].join('\n')
}

export function buildChatTitlePrompt(text: string) {
  return [
    'Generate a concise chat title based on the user request.',
    'Requirements:',
    '- Use the user\'s language.',
    '- Maximum 20 characters.',
    '- No quotes, no punctuation at the end.',
    'Return JSON only: {"title":"..."}',
    '',
    `User request:\n${text}`,
  ].join('\n')
}

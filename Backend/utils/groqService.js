const DEFAULT_MODEL = 'openai/gpt-oss-20b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const requireKey = (apiKey) => {
  const key = apiKey || process.env.GROQ_API_KEY;
  if (!key) {
    const error = new Error('AI features are disabled. Add a Groq API key in Profile Settings or set GROQ_API_KEY on the server.');
    error.statusCode = 503;
    throw error;
  }
  return key;
};

const sourceText = (source) => typeof source === 'string' ? source : (source?.text || '');
const stripCodeFence = (text = '') => text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim();
const parseArray = (text = '') => {
  const cleaned = stripCodeFence(text);
  try { return JSON.parse(cleaned); } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    try { return match ? JSON.parse(match[0]) : null; } catch { return null; }
  }
};
const difficulty = (value = 'medium') => ['easy', 'medium', 'hard'].includes(String(value).toLowerCase()) ? String(value).toLowerCase() : 'medium';

const complete = async (prompt, apiKey) => {
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${requireKey(apiKey)}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: DEFAULT_MODEL, temperature: 0.2, max_completion_tokens: 1200, messages: [{ role: 'user', content: prompt }] }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error?.message || `Groq request failed (${response.status})`);
    error.statusCode = response.status;
    throw error;
  }
  return payload?.choices?.[0]?.message?.content || '';
};

export const generateFlashcards = async (source, count = 10, apiKey) => {
  const text = sourceText(source).substring(0, 12000);
  const output = await complete(`Create exactly ${count} study flashcards using only this document. Return ONLY JSON array with question, answer, and difficulty (easy, medium, or hard). Document:\n${text}`, apiKey);
  const cards = parseArray(output);
  return Array.isArray(cards) ? cards.map((card) => ({ question: String(card.question || '').trim(), answer: String(card.answer || '').trim(), difficulty: difficulty(card.difficulty) })).filter((card) => card.question && card.answer).slice(0, count) : [];
};

export const generateQuiz = async (source, count = 5, apiKey) => {
  const text = sourceText(source).substring(0, 12000);
  const output = await complete(`Create exactly ${count} multiple-choice questions using only this document. Return ONLY JSON array. Each item must have question, options (exactly 4 strings), correctAnswer (exact option text), explanation, and difficulty. Document:\n${text}`, apiKey);
  const questions = parseArray(output);
  return Array.isArray(questions) ? questions.map((item) => ({ question: String(item.question || '').trim(), options: Array.isArray(item.options) ? item.options.map(String).slice(0, 4) : [], correctAnswer: String(item.correctAnswer || '').trim(), explanation: String(item.explanation || '').trim(), difficulty: difficulty(item.difficulty) })).filter((item) => item.question && item.options.length === 4 && item.correctAnswer).slice(0, count) : [];
};

export const generateSummary = async (source, apiKey) => complete(`Summarize this document for a student using only its content. Use headings Main Topic, Key Concepts, Detailed Summary, Important Details & Examples, and Quick Revision Points.\nDocument:\n${sourceText(source).substring(0, 12000)}`, apiKey);

export const chatWithContext = async (question, chunks, source = null, apiKey) => complete(`Answer the question using only the document context. If it is not covered, say so.\nContext:\n${chunks.map((chunk) => chunk.content).join('\n\n').substring(0, 9000)}\nDocument:\n${sourceText(source).substring(0, 3000)}\nQuestion: ${question}`, apiKey);

export const explainConcept = async (concept, context, source = null, apiKey) => complete(`Explain "${concept}" using only this document. Include Definition, Key Details, Function/Significance, and Example.\nContext:\n${context.substring(0, 15000)}\nDocument:\n${sourceText(source).substring(0, 15000)}`, apiKey);

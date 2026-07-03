// src/lib/aiAssistant.js
//
// Everything the assistant needs client-side to feel like a real AI:
// persona definitions, lightweight language/emotion heuristics, a voice
// command parser for on-site navigation, and localStorage-backed memory.
//
// IMPORTANT: this file never talks to Anthropic directly. An API key can't
// be kept secret in browser code, so `sendMessage` calls YOUR OWN backend
// endpoint (default: POST /api/assistant), which then calls the model.
// See server-assistant-example.js for a drop-in Express implementation.

import { KB_CONTEXT_TEXT, SECTION_IDS, PROFILE } from "./knowledgeBase"

/* ────────────────────────────────
   PERSONAS
   Same knowledge base, three different lenses. The backend receives the
   persona key and folds its system-prompt fragment in with KB_CONTEXT_TEXT.
──────────────────────────────── */
export const PERSONAS = {
  visitor: {
    label: "General Visitor",
    tagline: "Friendly overview",
    systemPrompt:
      "You are Nova, a warm and approachable guide introducing Muhire Dieudonne to a general visitor. Keep language simple and welcoming, avoid heavy jargon, and focus on the big picture: who he is, what he's built, and how to get in touch. Offer to go deeper if the visitor seems interested.",
  },
  recruiter: {
    label: "Recruiter",
    tagline: "Impact & fit",
    systemPrompt:
      "You are Nova, speaking with a recruiter or hiring manager evaluating Muhire Dieudonne. Be concise and professional. Lead with impact, scope, and outcomes rather than raw tech lists. Proactively surface availability, years of relevant experience, and the CV download when appropriate. Never invent metrics that aren't in the knowledge base.",
  },
  developer: {
    label: "Developer",
    tagline: "Technical depth",
    systemPrompt:
      "You are Nova, speaking with a fellow developer or technical evaluator. Feel free to go deep on architecture, stack choices, and trade-offs for each project. Use precise technical vocabulary. It's fine to speculate reasonably about implementation details as long as you clearly flag it as inference rather than fact from the knowledge base.",
  },
}

export const DEFAULT_PERSONA = "visitor"

/* ────────────────────────────────
   LANGUAGE DETECTION (lightweight heuristic)
   Real language ID happens better on the backend/model, but a client-side
   guess lets us pick a matching speech-recognition locale and TTS voice
   immediately, before the network round-trip.
──────────────────────────────── */
const LANG_MARKERS = {
  rw: ["muraho", "murakoze", "nitwa", "amakuru", "ndagukunda", "byiza", "cyane", "ese", "sawa", "ndashaka"],
  fr: ["bonjour", "merci", "comment", "je m'appelle", "s'il vous", "salut", "pourquoi", "où est"],
  en: [], // default
}

export function detectLanguage(text) {
  const s = ` ${text.toLowerCase()} `
  for (const lang of ["rw", "fr"]) {
    if (LANG_MARKERS[lang].some(m => s.includes(m))) return lang
  }
  return "en"
}

export const SPEECH_LOCALES = {
  en: "en-US",
  fr: "fr-FR",
  // Browsers rarely ship Kinyarwanda speech recognition; fall back to
  // English recognition but the TTS/reply language is still respected.
  rw: "en-US",
}

/* ────────────────────────────────
   EMOTION DETECTION (lightweight heuristic)
   Used to soften/adjust tone locally and as a hint sent to the model.
──────────────────────────────── */
const EMOTION_LEXICON = {
  frustrated: ["annoying", "doesn't work", "not working", "broken", "confusing", "frustrated", "ugh", "hate"],
  excited: ["awesome", "amazing", "love it", "great", "excited", "impressive", "wow", "cool"],
  curious: ["how does", "why", "what if", "curious", "wonder", "explain"],
  polite: ["please", "thank you", "thanks", "appreciate"],
}

export function detectEmotion(text) {
  const s = text.toLowerCase()
  for (const [emotion, markers] of Object.entries(EMOTION_LEXICON)) {
    if (markers.some(m => s.includes(m))) return emotion
  }
  return "neutral"
}

/* ────────────────────────────────
   VOICE / TEXT COMMAND PARSER
   Handled entirely client-side and instantly — no need to round-trip to
   the model for "open my projects" style intents.
──────────────────────────────── */
const NAV_PATTERNS = [
  { re: /\b(open|show|go to|scroll to|navigate to)\s+(the\s+)?projects?\b/i, section: "projects" },
  { re: /\b(open|show|go to|scroll to)\s+(the\s+)?skills?\b/i, section: "skills" },
  { re: /\b(open|show|go to|scroll to)\s+(the\s+)?(about|bio)\b/i, section: "about" },
  { re: /\b(open|show|go to|scroll to)\s+(the\s+)?(experience|work history)\b/i, section: "experience" },
  { re: /\b(open|show|go to|scroll to)\s+(the\s+)?(education)\b/i, section: "education" },
  { re: /\b(open|show|go to|scroll to)\s+(the\s+)?(contact|contacts)\b/i, section: "contact" },
  { re: /\b(open|show|go to|scroll to)\s+(the\s+)?(testimonials|reviews)\b/i, section: "testimonials" },
]

const PERSONA_SWITCH_PATTERNS = [
  { re: /\b(talk|speak|act)\s+(to me\s+)?(like|as)\s+(a\s+)?(recruiter|hiring manager)\b/i, persona: "recruiter" },
  { re: /\b(switch to|use)\s+recruiter\s*(mode|persona)?\b/i, persona: "recruiter" },
  { re: /\b(talk|speak|act)\s+(to me\s+)?(like|as)\s+(a\s+)?(developer|engineer)\b/i, persona: "developer" },
  { re: /\b(switch to|use)\s+developer\s*(mode|persona)?\b/i, persona: "developer" },
  { re: /\b(switch to|use)\s+(visitor|general)\s*(mode|persona)?\b/i, persona: "visitor" },
]

export function parseVoiceCommand(text) {
  const s = text.trim()

  if (/\b(download|get|send me)\s+(the\s+|your\s+|his\s+)?(cv|resume)\b/i.test(s)) {
    return { type: "download_cv" }
  }
  if (/\b(open|show)\s+(the\s+)?(github|git hub)\b/i.test(s)) {
    return { type: "open_link", payload: PROFILE.github }
  }
  if (/\b(open|show)\s+(the\s+)?linkedin\b/i.test(s)) {
    return { type: "open_link", payload: PROFILE.linkedin }
  }
  for (const p of PERSONA_SWITCH_PATTERNS) {
    if (p.re.test(s)) return { type: "switch_persona", payload: p.persona }
  }
  for (const p of NAV_PATTERNS) {
    if (p.re.test(s) && SECTION_IDS[p.section]) return { type: "navigate", payload: p.section }
  }
  return null
}

/* ────────────────────────────────
   CONVERSATION MEMORY (localStorage)
   Lets Nova "remember" prior turns across page reloads / visits, for a
   bounded window (max messages + a max age) so memory doesn't go stale
   or grow unbounded.
──────────────────────────────── */
const MEMORY_KEY = "nova_conversation_v1"
const MEMORY_MAX_MESSAGES = 24
const MEMORY_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export function loadMemory() {
  try {
    const raw = localStorage.getItem(MEMORY_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > MEMORY_MAX_AGE_MS) {
      localStorage.removeItem(MEMORY_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function saveMemory({ messages, persona }) {
  try {
    const trimmed = messages.slice(-MEMORY_MAX_MESSAGES)
    localStorage.setItem(MEMORY_KEY, JSON.stringify({ messages: trimmed, persona, savedAt: Date.now() }))
  } catch {
    /* storage unavailable (private mode etc.) — memory just won't persist */
  }
}

export function clearMemory() {
  try { localStorage.removeItem(MEMORY_KEY) } catch { /* noop */ }
}

/* ────────────────────────────────
   BACKEND CALL
   Sends the rolling conversation + persona + detected language/emotion to
   your own server, which owns the actual model call and the full KB.
──────────────────────────────── */
const DEFAULT_API_URL = "/api/assistant"

export async function sendMessage({ messages, persona, language, emotion, apiUrl = DEFAULT_API_URL, signal }) {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      messages,           // [{ role: 'user'|'assistant', content: string }]
      persona,            // 'visitor' | 'recruiter' | 'developer'
      language,           // 'en' | 'fr' | 'rw'
      emotion,            // 'neutral' | 'frustrated' | 'excited' | 'curious' | 'polite'
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    throw new Error(`Assistant API error ${res.status}: ${detail || res.statusText}`)
  }

  const data = await res.json()
  // Expected shape: { reply: string, language?: string, emotion?: string }
  if (!data?.reply) throw new Error("Assistant API returned no reply")
  return data
}

export { KB_CONTEXT_TEXT }

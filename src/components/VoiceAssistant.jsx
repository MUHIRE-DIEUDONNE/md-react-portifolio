// src/components/VoiceAssistant.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMic, FiVolume2, FiVolumeX, FiUser,
  FiTrash2, FiX, FiMinimize2, FiMaximize2,
  FiBriefcase, FiCode, FiMail, FiGlobe,
  FiAward, FiChevronDown, FiChevronUp, FiDownload
} from 'react-icons/fi'
import { FaStop, FaPaperPlane } from 'react-icons/fa'

import { PROFILE, downloadCV, scrollToSection } from '../lib/knowledgeBase'
import {
  PERSONAS, DEFAULT_PERSONA, detectLanguage, detectEmotion, SPEECH_LOCALES,
  parseVoiceCommand, loadMemory, saveMemory, clearMemory, sendMessage,
} from '../lib/aiAssistant'

/* ─────────────────────────────────────────────
   DESIGN TOKENS — "Aurora Core" glass aesthetic
   (unchanged visual language from the previous pass — see Core avatar,
   drifting aurora field, glass panels, neon gradient accents.)
───────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    --au-bg-0: #05060d;
    --au-bg-1: #0a0c18;
    --au-surface: rgba(12,13,24,0.72);
    --au-glass: rgba(255,255,255,0.055);
    --au-glass-strong: rgba(255,255,255,0.10);
    --au-border: rgba(255,255,255,0.13);
    --au-border-bright: rgba(167,139,250,0.45);
    --au-cyan: #5eead4;
    --au-violet: #a78bfa;
    --au-pink: #f472b6;
    --au-ink: #f5f3fb;
    --au-dim: rgba(245,243,251,0.60);
    --au-faint: rgba(245,243,251,0.26);
    --au-shadow: 0 30px 80px rgba(2,3,10,0.72), 0 0 0 1px rgba(255,255,255,0.06), 0 0 70px rgba(167,139,250,0.14);
    --au-font-display: 'Space Grotesk', sans-serif;
    --au-font-body: 'Inter', sans-serif;
    --au-font-mono: 'JetBrains Mono', monospace;
  }

  .au-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .au-wrap { font-family: var(--au-font-body); -webkit-font-smoothing: antialiased; }

  .au-messages { -webkit-overflow-scrolling: touch; overscroll-behavior: contain; }
  .au-messages::-webkit-scrollbar { width: 3px; }
  .au-messages::-webkit-scrollbar-track { background: transparent; }
  .au-messages::-webkit-scrollbar-thumb { background: var(--au-border-bright); border-radius: 10px; }
  .au-panel { overscroll-behavior: contain; backdrop-filter: blur(28px) saturate(160%); -webkit-backdrop-filter: blur(28px) saturate(160%); }

  @keyframes drift-a { 0%,100% { transform: translate(-6%,-4%) scale(1); } 50% { transform: translate(8%,6%) scale(1.15); } }
  @keyframes drift-b { 0%,100% { transform: translate(6%,4%) scale(1.05); } 50% { transform: translate(-8%,-8%) scale(0.95); } }
  @keyframes drift-c { 0%,100% { transform: translate(0%,8%) scale(1); } 50% { transform: translate(-6%,-10%) scale(1.1); } }
  .au-aurora { position: absolute; inset: 0; overflow: hidden; z-index: 0; pointer-events: none; }
  .au-aurora span { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.32; }
  .au-aurora span:nth-child(1) { width: 220px; height: 220px; top: -40px; left: -30px; background: var(--au-cyan); animation: drift-a 14s ease-in-out infinite; }
  .au-aurora span:nth-child(2) { width: 200px; height: 200px; bottom: -50px; right: -30px; background: var(--au-violet); animation: drift-b 17s ease-in-out infinite; }
  .au-aurora span:nth-child(3) { width: 160px; height: 160px; bottom: 30%; left: 10%; background: var(--au-pink); animation: drift-c 20s ease-in-out infinite; opacity: 0.20; }

  @keyframes meter { 0%,100% { height: 30%; opacity: 0.5; } 50% { height: 100%; opacity: 1; } }
  .meter-bar { width: 2.5px; border-radius: 1px; background: var(--au-cyan); animation: meter 0.85s ease-in-out infinite; transition: background 0.25s; }
  .meter-bar:nth-child(2) { animation-delay: 0.10s; }
  .meter-bar:nth-child(3) { animation-delay: 0.20s; }
  .meter-bar:nth-child(4) { animation-delay: 0.06s; }
  .meter-bar:nth-child(5) { animation-delay: 0.16s; }

  @keyframes core-spin { to { transform: rotate(360deg); } }
  @keyframes core-spin-rev { to { transform: rotate(-360deg); } }
  .au-core-ring-slow { animation: core-spin 10s linear infinite; }
  .au-core-ring-fast { animation: core-spin-rev 3.4s linear infinite; }

  @keyframes core-glow-idle { 0%,100% { opacity: 0.35; } 50% { opacity: 0.6; } }
  @keyframes core-glow-active { 0%,100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
  .au-core-glow-idle { animation: core-glow-idle 3.2s ease-in-out infinite; }
  .au-core-glow-active { animation: core-glow-active 1.1s ease-in-out infinite; }

  @keyframes core-blink { 0%, 90%, 100% { transform: scaleY(1); } 94% { transform: scaleY(0.12); } }
  .au-core-eye { animation: core-blink 4.6s ease-in-out infinite; transform-origin: center; }

  @keyframes pulse-soft { 0%,100% { transform: scale(1); opacity: 0.55; } 50% { transform: scale(1.6); opacity: 0; } }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
  .au-dot { animation: blink 1.6s ease-in-out infinite; }

  @keyframes typedot { 0%,80%,100% { transform: translateY(0); opacity: 0.35; } 40% { transform: translateY(-4px); opacity: 1; } }
  .type-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--au-violet); animation: typedot 1.1s ease-in-out infinite; }
  .type-dot:nth-child(2) { animation-delay: 0.14s; }
  .type-dot:nth-child(3) { animation-delay: 0.28s; }

  .au-mic-btn { position: relative; overflow: hidden; transition: transform 0.18s ease, box-shadow 0.25s ease, border-color 0.25s ease; touch-action: manipulation; }
  .au-mic-btn:hover { transform: translateY(-1px); box-shadow: 0 0 0 4px rgba(167,139,250,0.10); }
  .au-mic-btn:active { transform: translateY(1px) scale(0.97); }
  .au-mic-btn.is-listening { box-shadow: 0 0 22px rgba(244,114,182,0.45), 0 0 0 4px rgba(244,114,182,0.12); }

  .au-chip { transition: background 0.18s, border-color 0.18s, transform 0.15s, box-shadow 0.25s; touch-action: manipulation; }
  .au-chip:hover { background: rgba(167,139,250,0.12) !important; border-color: var(--au-border-bright) !important; transform: translateX(2px); box-shadow: 0 0 18px rgba(167,139,250,0.18); }

  .au-bubble { transition: transform 0.18s ease, box-shadow 0.25s ease; }
  .au-bubble:hover { transform: translateY(-1px); }

  .au-input { -webkit-appearance: none; font-size: 16px; }
  .au-input:focus { outline: none; border-color: var(--au-violet); box-shadow: 0 0 0 3px rgba(167,139,250,0.16); }

  .au-toolbtn { transition: background 0.18s, color 0.18s, border-color 0.18s, box-shadow 0.25s, transform 0.15s; }
  .au-toolbtn:hover { box-shadow: 0 0 16px rgba(167,139,250,0.18); transform: translateY(-1px); }

  .au-send:not(:disabled):hover { box-shadow: 0 0 24px rgba(94,234,212,0.45); transform: translateY(-1px) scale(1.03); }

  .au-persona-row::-webkit-scrollbar { display: none; }

  @media (max-width: 380px) {
    .au-tight { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    .au-core-ring-slow, .au-core-ring-fast, .au-core-eye, .au-core-glow-idle, .au-core-glow-active,
    .au-aurora span, .meter-bar, .type-dot, .au-dot { animation: none !important; }
  }
`

/* ─────────────────────────────────────────────
   MINI COMPONENTS
───────────────────────────────────────────── */
const Meter = ({ active, color = 'var(--au-cyan)', count = 5, h = 14 }) => (
  <div className="flex items-end gap-[3px]" style={{ height: h }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="meter-bar" style={{ background: color, animationPlayState: active ? 'running' : 'paused', height: active ? undefined : '30%' }} />
    ))}
  </div>
)

const stateColor = {
  listening: 'var(--au-pink)',
  thinking: 'var(--au-violet)',
  speaking: 'var(--au-cyan)',
  idle: 'var(--au-faint)',
}

/* Signature element: THE CORE — blinking, waveform-ringed AI avatar that
   visibly shifts for listening / thinking / speaking. */
const Core = ({ state = 'idle', size = 46 }) => {
  const color = stateColor[state] || stateColor.idle
  const active = state !== 'idle'
  const bars = 22
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className={`absolute inset-0 rounded-full ${active ? 'au-core-glow-active' : 'au-core-glow-idle'}`}
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, filter: 'blur(6px)' }} />
      <svg width={size} height={size} viewBox="0 0 46 46" className="absolute inset-0">
        <defs>
          <linearGradient id="au-core-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--au-cyan)" />
            <stop offset="50%" stopColor="var(--au-violet)" />
            <stop offset="100%" stopColor="var(--au-pink)" />
          </linearGradient>
        </defs>
        <circle cx="23" cy="23" r="20.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <g className={active ? (state === 'speaking' ? 'au-core-ring-fast' : 'au-core-ring-slow') : 'au-core-ring-slow'} style={{ transformOrigin: '23px 23px', opacity: active ? 1 : 0.5 }}>
          {Array.from({ length: bars }).map((_, i) => {
            const a = (i / bars) * Math.PI * 2
            const wobble = active ? (i % 3 === 0 ? 3.4 : i % 2 === 0 ? 2.1 : 1.2) : 0
            const r1 = 20.5, r2 = 17.6 - wobble
            const x1 = 23 + r1 * Math.cos(a), y1 = 23 + r1 * Math.sin(a)
            const x2 = 23 + r2 * Math.cos(a), y2 = 23 + r2 * Math.sin(a)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? 'url(#au-core-grad)' : color} strokeWidth="1.5" strokeLinecap="round" opacity={active ? (i % 3 === 0 ? 1 : 0.45) : 0.28} />
          })}
        </g>
        <g className="au-core-eye">
          <circle cx="23" cy="23" r="4.2" fill={active ? 'url(#au-core-grad)' : 'rgba(245,243,251,0.5)'} opacity={active ? 0.9 : 0.55} />
        </g>
      </svg>
    </div>
  )
}

const StatusDot = ({ state }) => {
  const color = stateColor[state] || '#34d399'
  return (
    <span className="relative inline-flex w-1.5 h-1.5 flex-shrink-0">
      <span className="absolute inset-0 rounded-full" style={{ background: color, opacity: 0.5, animation: state !== 'idle' ? 'pulse-soft 1.3s ease-out infinite' : 'none' }} />
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: state === 'idle' ? '#34d399' : color }} />
    </span>
  )
}

const Avatar = ({ isUser, auraState }) => {
  if (!isUser) return <Core state={auraState} size={26} />
  return (
    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, var(--au-violet), var(--au-pink))' }}>
      <FiUser size={12} color="#fff" />
    </div>
  )
}

const StatusPanel = ({ auraState }) => {
  const items = [
    { key: 'listening', label: 'Listening' },
    { key: 'thinking', label: 'Thinking' },
    { key: 'speaking', label: 'Speaking' },
  ]
  return (
    <div className="flex gap-1.5">
      {items.map(it => {
        const on = auraState === it.key
        const color = stateColor[it.key]
        return (
          <div key={it.key} className="flex items-center gap-1.5 px-2 py-1 rounded-full border"
            style={{
              background: on ? `${color}1f` : 'var(--au-glass)',
              borderColor: on ? color : 'var(--au-border)',
              transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
              boxShadow: on ? `0 0 14px ${color}55` : 'none',
            }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: on ? color : 'var(--au-faint)', animation: on ? 'pulse-soft 1.2s ease-out infinite' : 'none' }} />
            <span className="text-[9.5px] tracking-wide" style={{ color: on ? color : 'var(--au-faint)', fontFamily: 'var(--au-font-mono)' }}>{it.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* Persona switcher + live language / mood readout */
const PersonaRow = ({ persona, onSwitch, language, emotion }) => (
  <div className="au-tight au-persona-row px-3 sm:px-4 py-2 border-b flex items-center gap-2 overflow-x-auto relative z-10"
    style={{ borderColor: 'var(--au-border)', background: 'rgba(10,11,20,0.45)' }}
  >
    <div className="flex gap-1.5 flex-shrink-0">
      {Object.entries(PERSONAS).map(([key, p]) => (
        <button key={key} onClick={() => onSwitch(key)}
          className="au-toolbtn px-2.5 py-1 rounded-full border text-[10px] whitespace-nowrap flex-shrink-0"
          style={{
            background: persona === key ? 'linear-gradient(90deg, rgba(94,234,212,0.20), rgba(167,139,250,0.20))' : 'var(--au-glass)',
            borderColor: persona === key ? 'var(--au-border-bright)' : 'var(--au-border)',
            color: persona === key ? 'var(--au-ink)' : 'var(--au-dim)',
            fontFamily: 'var(--au-font-mono)',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
    <div className="flex-1 min-w-[6px]" />
    <span className="text-[9.5px] px-2 py-1 rounded-full border flex-shrink-0 whitespace-nowrap"
      style={{ borderColor: 'var(--au-border)', color: 'var(--au-faint)', fontFamily: 'var(--au-font-mono)' }}
    >
      {language.toUpperCase()} · {emotion}
    </span>
  </div>
)

/* ─────────────────────────────────────────────
   OFFLINE FALLBACK
   Used only when the AI backend is unreachable/not configured, so the
   assistant degrades gracefully instead of going silent.
───────────────────────────────────────────── */
function localFallbackResponse(input) {
  const s = input.toLowerCase()
  if (/\b(hi|hello|hey)\b/.test(s))
    return `Hi! I'm Nova. I'm having trouble reaching my full AI brain right now, but I can still tell you the basics: ${PROFILE.name} is a ${PROFILE.title} based in ${PROFILE.location}.`
  if (s.includes('skill'))
    return "Muhire works across HTML5, CSS3, JavaScript, React.js, PHP & Laravel, Node.js, MySQL, MongoDB, and Firebase — full-stack, end to end."
  if (s.includes('project'))
    return "Some highlights: a Cooperative Management System, a School Management System, and this AI-powered portfolio itself."
  if (s.includes('contact') || s.includes('email'))
    return `Reach Muhire at ${PROFILE.email} or ${PROFILE.phone}.`
  if (s.includes('cv') || s.includes('resume'))
    return "You can say 'download the CV' and I'll grab it for you, even offline."
  return "I'm running on a limited offline mode right now — ask about skills, projects, or contact info, or try again in a moment for the full AI experience."
}

const SUGGESTIONS = [
  { text: "Who are you?", icon: FiUser },
  { text: "What are your skills?", icon: FiCode },
  { text: "Tell me about your projects", icon: FiBriefcase },
  { text: "What is your experience?", icon: FiAward },
  { text: "How can I contact you?", icon: FiMail },
  { text: "Download your CV", icon: FiDownload },
]

const WELCOME_MESSAGES = {
  visitor: "Hey there! I'm Nova, an AI assistant for Muhire Dieudonne. Ask me anything about his work, or say things like \"open projects\" or \"download the CV\" and I'll take care of it.",
  recruiter: "Hello — I'm Nova, here to walk you through Muhire Dieudonne's background as a Software Developer. Ask about impact, experience, or availability, or say \"download the CV\" any time.",
  developer: "Hey, I'm Nova. Happy to go deep on Muhire's stack and how his projects are built — React, Laravel, Node, MongoDB, the works. What do you want to dig into?",
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const VoiceAssistant = () => {
  const [isOpen, setIsOpen]                   = useState(false)
  const [isMinimized, setIsMinimized]         = useState(false)
  const [unreadCount, setUnreadCount]         = useState(0)
  const [isListening, setIsListening]         = useState(false)
  const [isSpeaking, setIsSpeaking]           = useState(false)
  const [transcript, setTranscript]           = useState('')
  const [conversation, setConversation]       = useState([])
  const [isMuted, setIsMuted]                 = useState(false)
  const [inputText, setInputText]             = useState('')
  const [isTypingIndicator, setIsTypingInd]   = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [welcomeDone, setWelcomeDone]         = useState(false)
  const [autoVoice, setAutoVoice]             = useState(true)
  const [voiceSpeed, setVoiceSpeed]           = useState(0.93)
  const [voicePitch, setVoicePitch]           = useState(1.08)

  const [persona, setPersona]                 = useState(DEFAULT_PERSONA)
  const [detectedLanguage, setDetectedLanguage] = useState('en')
  const [detectedEmotion, setDetectedEmotion] = useState('neutral')

  const recognitionRef    = useRef(null)
  const synthRef          = useRef(window.speechSynthesis)
  const messagesEndRef    = useRef(null)
  const inputRef          = useRef(null)
  const hasAutoSpokenRef  = useRef(false)

  const auraState = isListening ? 'listening' : isTypingIndicator ? 'thinking' : isSpeaking ? 'speaking' : 'idle'

  /* ── ESC to close ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        synthRef.current?.cancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  /* ── Speech recognition setup ── */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onstart  = () => { setIsListening(true); setTranscript('') }
    rec.onend    = () => setIsListening(false)
    rec.onerror  = () => setIsListening(false)

    rec.onresult = (e) => {
      let fin = '', inter = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) fin += t
        else inter += t
      }
      if (fin) { setTranscript(fin); processUserInput(fin) }
      else setTranscript(inter)
    }

    recognitionRef.current = rec
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── Restore memory or show a fresh, persona-tuned welcome ── */
  useEffect(() => {
    if (!isOpen || welcomeDone) return
    const mem = loadMemory()
    if (mem?.messages?.length) {
      setConversation(mem.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })))
      setPersona(mem.persona || DEFAULT_PERSONA)
      setWelcomeDone(true)
      return
    }
    const welcome = WELCOME_MESSAGES[persona] || WELCOME_MESSAGES.visitor
    setConversation([{ type: 'assistant', text: welcome, timestamp: new Date(), isTyping: false }])
    setWelcomeDone(true)
    const t = setTimeout(() => {
      if (!isMuted && autoVoice && !hasAutoSpokenRef.current) {
        hasAutoSpokenRef.current = true
        speak(welcome, 'en')
      }
    }, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  /* ── Persist conversation memory ── */
  useEffect(() => {
    if (conversation.length === 0) return
    saveMemory({ messages: conversation.filter(m => !m.isTyping), persona })
  }, [conversation, persona])

  /* ── Scroll to bottom ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation, isTypingIndicator])

  /* ── Unread badge ── */
  useEffect(() => {
    if (!isOpen && conversation.length > 0) {
      const last = conversation[conversation.length - 1]
      if (last.type === 'assistant' && !last.isTyping)
        setUnreadCount(c => c + 1)
    }
  }, [conversation])

  useEffect(() => { if (isOpen) setUnreadCount(0) }, [isOpen])

  /* ── Speak (language-aware voice selection) ── */
  const speak = useCallback((text, language = 'en') => {
    if (!synthRef.current || isMuted) return
    synthRef.current.cancel()
    const u = new SpeechSynthesisUtterance(text.replace(/[*•·]/g, ''))
    u.rate = voiceSpeed; u.pitch = voicePitch; u.volume = 1
    u.lang = SPEECH_LOCALES[language] || 'en-US'
    const voices = synthRef.current.getVoices?.() || []
    const match = voices.find(v => v.lang?.toLowerCase().startsWith(u.lang.split('-')[0].toLowerCase()))
    if (match) u.voice = match
    u.onstart = () => setIsSpeaking(true)
    u.onend   = () => setIsSpeaking(false)
    u.onerror = () => setIsSpeaking(false)
    synthRef.current.speak(u)
  }, [isMuted, voiceSpeed, voicePitch])

  /* ── Typing animation for assistant replies ── */
  const addAssistantMessage = useCallback((text) => {
    setConversation(prev => [...prev, {
      type: 'assistant', text: '',
      timestamp: new Date(), isTyping: true, fullText: text
    }])
    let i = 0
    const iv = setInterval(() => {
      setConversation(prev => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.isTyping && last.fullText) {
          last.text = last.fullText.slice(0, i + 1)
          if (i + 1 >= last.fullText.length) { last.isTyping = false; clearInterval(iv) }
        }
        return next
      })
      i++
    }, 18)
  }, [])

  /* ── Local intent handling (navigation, CV download, persona switch) ── */
  const handleCommand = useCallback((command) => {
    switch (command.type) {
      case 'download_cv':
        downloadCV()
        return "Sending you the CV now — check your downloads folder."
      case 'open_link':
        window.open(command.payload, '_blank', 'noopener')
        return "Opening that in a new tab for you."
      case 'navigate': {
        const ok = scrollToSection(command.payload)
        return ok
          ? `Here's the ${command.payload} section.`
          : `I'd take you to the ${command.payload} section, but I can't find it on this page.`
      }
      case 'switch_persona': {
        setPersona(command.payload)
        const p = PERSONAS[command.payload]
        return `Switched to ${p.label} mode — ${p.tagline.toLowerCase()}.`
      }
      default:
        return "Got it."
    }
  }, [])

  /* ── Process input: intercept commands, otherwise call the AI ── */
  const processUserInput = useCallback(async (input) => {
    if (!input.trim()) return
    synthRef.current?.cancel()
    const text = input.trim()
    const language = detectLanguage(text)
    const emotion = detectEmotion(text)
    setDetectedLanguage(language)
    setDetectedEmotion(emotion)

    const userMessage = { type: 'user', text, timestamp: new Date(), isTyping: false }
    setConversation(prev => [...prev, userMessage])
    setInputText('')

    const command = parseVoiceCommand(text)
    if (command) {
      setIsTypingInd(true)
      setTimeout(() => {
        setIsTypingInd(false)
        const reply = handleCommand(command)
        addAssistantMessage(reply)
        if (!isMuted && autoVoice) speak(reply, language)
      }, 300)
      return
    }

    setIsTypingInd(true)
    try {
      const history = [...conversation, userMessage]
        .filter(m => !m.isTyping)
        .slice(-16)
        .map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.text }))

      const { reply, language: replyLang } = await sendMessage({ messages: history, persona, language, emotion })
      setIsTypingInd(false)
      addAssistantMessage(reply)
      if (!isMuted && autoVoice) speak(reply, replyLang || language)
    } catch (err) {
      console.warn('Nova: AI backend unavailable, using offline fallback —', err.message)
      const reply = localFallbackResponse(text)
      setIsTypingInd(false)
      addAssistantMessage(reply)
      if (!isMuted && autoVoice) speak(reply, language)
    }
  }, [conversation, isMuted, autoVoice, persona, speak, addAssistantMessage, handleCommand])

  /* ── Toggle listening (uses last detected language's recognition locale) ── */
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported. Please use Chrome, Edge, or Safari.')
      return
    }
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.lang = SPEECH_LOCALES[detectedLanguage] || 'en-US'
      recognitionRef.current.start()
    }
  }

  /* ── Clear (wipes both UI and persisted memory) ── */
  const clearConversation = () => {
    clearMemory()
    const msg = WELCOME_MESSAGES[persona] || WELCOME_MESSAGES.visitor
    setConversation([{ type: 'assistant', text: msg, timestamp: new Date(), isTyping: false }])
    if (!isMuted && autoVoice) speak(msg, 'en')
  }

  /* ── Mute ── */
  const toggleMute = () => {
    if (!isMuted) { synthRef.current?.cancel(); setIsSpeaking(false) }
    setIsMuted(m => !m)
  }

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="au-wrap">
      <style>{style}</style>

      {/* ── FAB ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsOpen(true)}
            className="fixed z-[9999] w-16 h-16 rounded-full border-none cursor-pointer flex items-center justify-center"
            style={{
              bottom: 'max(1rem, env(safe-area-inset-bottom))',
              right: 'max(1rem, env(safe-area-inset-right))',
              background: 'linear-gradient(160deg, rgba(15,16,28,0.95), rgba(10,11,20,0.95))',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--au-border-bright)',
              boxShadow: '0 14px 34px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,139,250,0.10), 0 0 30px rgba(167,139,250,0.22)',
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="absolute inset-1.5 rounded-full"
              style={{ border: '1px solid var(--au-violet)' }}
            />
            <Core state="idle" size={34} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center border-2"
                style={{ background: 'var(--au-pink)', color: '#0a0c18', borderColor: 'var(--au-bg-0)', fontFamily: 'var(--au-font-mono)' }}
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── MAIN WINDOW ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="window"
            initial={{ opacity: 0, scale: 0.92, y: 24, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            className="au-panel fixed z-[9998] w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-2rem)] max-w-sm sm:max-w-md lg:max-w-lg rounded-2xl flex flex-col relative"
            style={{
              bottom: 'max(0.75rem, env(safe-area-inset-bottom))',
              right: 'max(0.75rem, env(safe-area-inset-right))',
              maxHeight: 'min(680px, calc(100dvh - 1.5rem))',
              background: 'var(--au-surface)',
              border: '1px solid var(--au-border)',
              boxShadow: 'var(--au-shadow)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <div className="au-aurora"><span /><span /><span /></div>

            {/* ── HEADER ── */}
            <div className="au-tight flex items-center gap-3 px-3 py-3 sm:p-4 border-b relative z-10 sticky top-0"
              style={{ background: 'rgba(10,11,20,0.75)', backdropFilter: 'blur(18px)', borderColor: 'var(--au-border)' }}
            >
              <div className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full"
                style={{ background: 'var(--au-glass)', border: '1px solid var(--au-border-bright)' }}
              >
                <Core state={auraState} size={38} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 font-semibold text-sm sm:text-base min-w-0" style={{ color: 'var(--au-ink)', fontFamily: 'var(--au-font-display)', letterSpacing: '-0.01em' }}>
                  <span className="truncate">Muhire Dieudonne</span>
                  <span className="hidden sm:inline-flex flex-shrink-0 text-[10px] font-medium tracking-wider px-1.5 py-0.5 rounded-full border uppercase"
                    style={{
                      background: 'linear-gradient(90deg, rgba(94,234,212,0.12), rgba(167,139,250,0.12))',
                      color: 'var(--au-cyan)', borderColor: 'var(--au-border-bright)', fontFamily: 'var(--au-font-mono)'
                    }}
                  >
                    Fullstack AI
                  </span>
                </div>
                <div className="text-[11px] mt-0.5 flex items-center gap-1.5 truncate" style={{ color: 'var(--au-dim)', fontFamily: 'var(--au-font-mono)' }}>
                  <StatusDot state={auraState} />
                  {auraState === 'listening' ? (
                    <span style={{ color: 'var(--au-pink)' }}>listening…</span>
                  ) : auraState === 'thinking' ? (
                    <span style={{ color: 'var(--au-violet)' }}>thinking…</span>
                  ) : auraState === 'speaking' ? (
                    <span style={{ color: 'var(--au-cyan)' }}>speaking…</span>
                  ) : (
                    <span>online · {PERSONAS[persona].label.toLowerCase()} mode</span>
                  )}
                </div>
              </div>

              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}
                  className="au-toolbtn w-9 h-9 rounded-full border flex items-center justify-center active:scale-95"
                  style={{
                    background: isMuted ? 'rgba(244,114,182,0.08)' : 'var(--au-glass)',
                    borderColor: isMuted ? 'rgba(244,114,182,0.4)' : 'var(--au-border)',
                    color: isMuted ? 'var(--au-pink)' : 'var(--au-dim)',
                  }}
                >
                  {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
                </button>
                <button onClick={() => setIsMinimized(m => !m)} title={isMinimized ? 'Expand' : 'Minimise'}
                  className="au-toolbtn hidden sm:flex w-9 h-9 rounded-full border items-center justify-center active:scale-95"
                  style={{ background: 'var(--au-glass)', borderColor: 'var(--au-border)', color: 'var(--au-dim)' }}
                >
                  {isMinimized ? <FiMaximize2 size={14} /> : <FiMinimize2 size={14} />}
                </button>
                <button
                  onClick={() => { setIsOpen(false); synthRef.current?.cancel() }}
                  title="Close (ESC)"
                  className="au-toolbtn w-9 h-9 rounded-full border flex items-center justify-center active:scale-95"
                  style={{ background: 'var(--au-glass)', borderColor: 'var(--au-border)', color: 'var(--au-dim)' }}
                >
                  <FiX size={17} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* ── PERSONA SWITCHER + LANGUAGE/MOOD READOUT ── */}
            <PersonaRow persona={persona} onSwitch={setPersona} language={detectedLanguage} emotion={detectedEmotion} />

            {/* ── LIVE STATUS PANEL ── */}
            <div className="au-tight px-3 sm:px-4 py-2 border-b relative z-10 flex items-center justify-between gap-2"
              style={{ background: 'rgba(10,11,20,0.55)', borderColor: 'var(--au-border)' }}
            >
              <StatusPanel auraState={auraState} />
              {(isSpeaking || isListening) && (
                <Meter active count={4} h={12} color={isListening ? 'var(--au-pink)' : 'var(--au-cyan)'} />
              )}
            </div>

            {/* ── BODY ── */}
            <AnimatePresence initial={false}>
              {!isMinimized && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden relative z-10"
                >
                  {/* ── MESSAGES ── */}
                  <div className="au-tight au-messages h-[min(42dvh,300px)] sm:h-[340px] overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 flex flex-col gap-2.5 relative z-10"
                    style={{ background: 'rgba(0,0,0,0.20)' }}
                  >
                    {conversation.length === 0 && (
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        className="text-center mx-auto mt-8"
                      >
                        <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center border"
                          style={{ background: 'var(--au-glass)', borderColor: 'var(--au-border-bright)' }}
                        >
                          <Core state="idle" size={30} />
                        </div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--au-ink)', fontFamily: 'var(--au-font-display)' }}>
                          Ask about Muhire Dieudonne
                        </p>
                        <p className="text-xs mt-1.5" style={{ color: 'var(--au-faint)', fontFamily: 'var(--au-font-mono)' }}>
                          fullstack · kigali, rwanda
                        </p>
                      </motion.div>
                    )}

                    {conversation.map((msg, idx) => (
                      <motion.div key={idx}
                        initial={{ opacity: 0, x: msg.type === 'user' ? 14 : -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.22 }}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-2 max-w-[88%] sm:max-w-[84%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                          <Avatar isUser={msg.type === 'user'} auraState={idx === conversation.length - 1 ? auraState : 'idle'} />
                          <div className="au-bubble px-3.5 py-2.5 rounded-2xl"
                            style={{
                              background: msg.type === 'user'
                                ? 'linear-gradient(135deg, var(--au-violet), var(--au-pink))'
                                : 'var(--au-glass)',
                              backdropFilter: msg.type === 'user' ? 'none' : 'blur(10px)',
                              border: msg.type === 'user' ? 'none' : '1px solid var(--au-border)',
                              borderLeft: msg.type === 'user' ? 'none' : '2px solid var(--au-cyan)',
                              borderRadius: msg.type === 'user' ? '14px 14px 3px 14px' : '3px 14px 14px 14px',
                              boxShadow: msg.type === 'user' ? '0 8px 24px rgba(167,139,250,0.25)' : 'none',
                            }}
                          >
                            <p className="text-[13px] leading-relaxed whitespace-pre-wrap"
                              style={{ color: msg.type === 'user' ? '#fff' : 'var(--au-ink)' }}
                            >
                              {msg.text}
                              {msg.isTyping && (
                                <span className="au-dot inline-block w-1 h-3 ml-1 align-middle" style={{ background: 'var(--au-cyan)' }} />
                              )}
                            </p>
                            <p className="text-[9.5px] mt-1.5" style={{ color: msg.type === 'user' ? 'rgba(255,255,255,0.5)' : 'var(--au-faint)', fontFamily: 'var(--au-font-mono)', textAlign: msg.type === 'user' ? 'right' : 'left' }}>
                              {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <AnimatePresence>
                      {isTypingIndicator && (
                        <motion.div key="typing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="flex gap-2 items-end"
                        >
                          <Avatar isUser={false} auraState="thinking" />
                          <div className="px-3.5 py-2.5 rounded-2xl flex gap-1.5 items-center"
                            style={{ background: 'var(--au-glass)', border: '1px solid var(--au-border)', borderLeft: '2px solid var(--au-violet)', borderRadius: '3px 14px 14px 14px' }}
                          >
                            {[0, 1, 2].map(i => <div key={i} className="type-dot" />)}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </div>

                  {/* ── LIVE TRANSCRIPT ── */}
                  <AnimatePresence>
                    {transcript && isListening && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="px-3 sm:px-4 py-2 border-t flex items-center gap-2 overflow-hidden"
                        style={{ background: 'rgba(244,114,182,0.06)', borderColor: 'var(--au-border)' }}
                      >
                        <Meter active count={4} color="var(--au-pink)" h={12} />
                        <p className="text-xs truncate" style={{ color: 'var(--au-pink)', fontFamily: 'var(--au-font-mono)' }}>
                          {transcript}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── INPUT AREA ── */}
                  <div className="au-tight px-3 py-3 sm:px-4 border-t" style={{ background: 'rgba(10,11,20,0.55)', borderColor: 'var(--au-border)' }}>
                    <div className="flex gap-2 items-center">
                      <button
                        className={`au-mic-btn w-11 h-11 rounded-full border flex items-center justify-center flex-shrink-0 ${isListening ? 'is-listening' : ''}`}
                        onClick={toggleListening}
                        title={isListening ? 'Stop' : 'Speak'}
                        style={{
                          background: isListening ? 'rgba(244,114,182,0.14)' : 'var(--au-glass)',
                          borderColor: isListening ? 'var(--au-pink)' : 'var(--au-border)',
                        }}
                      >
                        {isListening ? <FaStop size={13} color="var(--au-pink)" /> : <FiMic size={16} style={{ color: 'var(--au-cyan)' }} />}
                      </button>

                      <input
                        ref={inputRef}
                        className="au-input flex-1 min-w-0 h-11 px-4 rounded-full border"
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && processUserInput(inputText)}
                        placeholder="Ask about Muhire's work…"
                        style={{
                          border: '1px solid var(--au-border)',
                          background: 'rgba(255,255,255,0.035)',
                          color: 'var(--au-ink)',
                        }}
                      />

                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
                        onClick={() => processUserInput(inputText)}
                        disabled={!inputText.trim()}
                        className="au-send w-11 h-11 rounded-full border flex items-center justify-center flex-shrink-0"
                        style={{
                          background: inputText.trim() ? 'linear-gradient(135deg, var(--au-cyan), var(--au-violet))' : 'var(--au-glass)',
                          borderColor: inputText.trim() ? 'transparent' : 'var(--au-border)',
                          cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                        }}
                      >
                        <FaPaperPlane size={13} color={inputText.trim() ? '#0a0c18' : 'var(--au-faint)'} />
                      </motion.button>
                    </div>

                    <div className="flex gap-1.5 mt-2.5">
                      {[
                        {
                          label: showSuggestions ? 'Hide prompts' : 'Show prompts',
                          icon: showSuggestions ? FiChevronDown : FiChevronUp,
                          onClick: () => setShowSuggestions(s => !s),
                        },
                        {
                          label: autoVoice ? 'Voice on' : 'Voice off',
                          icon: autoVoice ? FiVolume2 : FiVolumeX,
                          onClick: () => setAutoVoice(v => !v),
                          accent: autoVoice,
                        },
                        {
                          label: 'Clear',
                          icon: FiTrash2,
                          onClick: clearConversation,
                          danger: true,
                        },
                      ].map((btn, i) => (
                        <button key={i} onClick={btn.onClick}
                          className="au-toolbtn flex-1 py-1.5 px-1.5 sm:px-2 rounded-full border text-[10px] flex items-center justify-center gap-1 sm:gap-1.5 active:scale-95"
                          style={{
                            background: btn.accent ? 'rgba(94,234,212,0.10)' : btn.danger ? 'rgba(244,114,182,0.07)' : 'var(--au-glass)',
                            borderColor: btn.accent ? 'var(--au-border-bright)' : btn.danger ? 'rgba(244,114,182,0.28)' : 'var(--au-border)',
                            color: btn.accent ? 'var(--au-cyan)' : btn.danger ? 'var(--au-pink)' : 'var(--au-dim)',
                            fontFamily: 'var(--au-font-mono)',
                          }}
                        >
                          <btn.icon size={11} />
                          <span className="truncate">{btn.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="text-[10px]" style={{ color: 'var(--au-faint)', fontFamily: 'var(--au-font-mono)' }}>rate</span>
                      <input type="range" min={0.5} max={1.5} step={0.05} value={voiceSpeed}
                        onChange={e => setVoiceSpeed(parseFloat(e.target.value))}
                        className="flex-1 h-1 rounded-full cursor-pointer"
                        style={{ accentColor: 'var(--au-violet)' }}
                      />
                      <span className="text-[10px] w-9 text-right" style={{ color: 'var(--au-faint)', fontFamily: 'var(--au-font-mono)' }}>{voiceSpeed.toFixed(2)}×</span>
                    </div>
                  </div>

                  {/* ── SUGGESTIONS ── */}
                  <AnimatePresence>
                    {showSuggestions && (
                      <motion.div
                        key="sugg"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t overflow-hidden"
                        style={{ background: 'rgba(0,0,0,0.18)', borderColor: 'var(--au-border)' }}
                      >
                        <div className="au-tight px-3 py-3 sm:px-4">
                          <p className="text-[10px] tracking-wider uppercase mb-2" style={{ color: 'var(--au-faint)', fontFamily: 'var(--au-font-mono)' }}>
                            quick_prompts
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {SUGGESTIONS.map((s, i) => (
                              <motion.button key={i} className="au-chip px-3 py-2 rounded-xl border text-left flex items-center gap-2"
                                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => processUserInput(s.text)}
                                style={{ background: 'var(--au-glass)', borderColor: 'var(--au-border)' }}
                              >
                                <s.icon size={11} style={{ color: 'var(--au-cyan)', flexShrink: 0 }} />
                                <span className="text-[11.5px] truncate" style={{ color: 'var(--au-ink)' }}>{s.text}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── FOOTER ── */}
                  <div className="px-3 py-2 sm:px-4 border-t flex items-center justify-center gap-2"
                    style={{ background: 'rgba(10,11,20,0.6)', borderColor: 'var(--au-border)' }}
                  >
                    {isSpeaking && <Meter active count={4} h={10} />}
                    <span className="text-[9.5px] tracking-wide truncate" style={{ color: 'var(--au-faint)', fontFamily: 'var(--au-font-mono)' }}>
                      {isSpeaking ? 'output_active' : isListening ? 'input_active' : 'muhire · fullstack · kigali'}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── MINIMISED BODY ── */}
            {isMinimized && (
              <div className="px-4 py-3 relative z-10" style={{ background: 'rgba(10,11,20,0.4)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <StatusDot state={auraState} />
                    <span className="text-xs font-semibold truncate" style={{ color: 'var(--au-ink)', fontFamily: 'var(--au-font-display)' }}>
                      Muhire · Fullstack
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0" style={{ background: 'var(--au-pink)', color: '#0a0c18', fontFamily: 'var(--au-font-mono)' }}>
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--au-glass)', borderColor: 'var(--au-border)', color: 'var(--au-dim)' }}
                  >
                    <FiMaximize2 size={14} />
                  </button>
                </div>
                {conversation.length > 0 && (
                  <p className="text-[11px] truncate mt-1.5" style={{ color: 'var(--au-dim)' }}>
                    {conversation[conversation.length - 1].text}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VoiceAssistant

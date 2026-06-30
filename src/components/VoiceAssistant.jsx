// src/components/VoiceAssistant.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMic, FiVolume2, FiVolumeX, FiUser,
  FiTrash2, FiX, FiMinimize2, FiMaximize2,
  FiBriefcase, FiCode, FiMail, FiGlobe,
  FiAward, FiChevronDown, FiChevronUp
} from 'react-icons/fi'
import { FaRobot, FaMicrophone, FaStop, FaPaperPlane } from 'react-icons/fa'

/* ─────────────────────────────────────────────
   DESIGN TOKENS — "Signal" console aesthetic
   A developer's instrument panel, not a chat-bot
   cliché. Mint signal accent on near-black slate,
   monospace status language, VU-meter ring as the
   one signature motif.
───────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    --sig-bg: #0a0c10;
    --sig-surface: rgba(15,17,22,0.98);
    --sig-glass: rgba(255,255,255,0.035);
    --sig-line: rgba(255,255,255,0.08);
    --sig-line-bright: rgba(94,234,212,0.30);
    --sig-mint: #5eead4;
    --sig-mint-dim: rgba(94,234,212,0.14);
    --sig-indigo: #818cf8;
    --sig-rose: #fb7185;
    --sig-ink: #eef1f6;
    --sig-dim: rgba(238,241,246,0.52);
    --sig-faint: rgba(238,241,246,0.24);
    --sig-shadow: 0 28px 70px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05);
    --sig-font-display: 'Space Grotesk', sans-serif;
    --sig-font-body: 'Inter', sans-serif;
    --sig-font-mono: 'JetBrains Mono', monospace;
  }

  .sig-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .sig-wrap { font-family: var(--sig-font-body); -webkit-font-smoothing: antialiased; }

  .sig-messages { -webkit-overflow-scrolling: touch; overscroll-behavior: contain; }
  .sig-messages::-webkit-scrollbar { width: 3px; }
  .sig-messages::-webkit-scrollbar-track { background: transparent; }
  .sig-messages::-webkit-scrollbar-thumb { background: var(--sig-line-bright); border-radius: 10px; }
  .sig-panel { overscroll-behavior: contain; }

  /* faint scanline texture for the "instrument" feel */
  .sig-scan::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background: repeating-linear-gradient(180deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px);
  }

  @keyframes meter {
    0%, 100% { height: 30%; opacity: 0.5; }
    50% { height: 100%; opacity: 1; }
  }
  .meter-bar { width: 2.5px; border-radius: 1px; background: var(--sig-mint); animation: meter 0.85s ease-in-out infinite; transition: background 0.25s; }
  .meter-bar:nth-child(2) { animation-delay: 0.10s; }
  .meter-bar:nth-child(3) { animation-delay: 0.20s; }
  .meter-bar:nth-child(4) { animation-delay: 0.06s; }
  .meter-bar:nth-child(5) { animation-delay: 0.16s; }

  @keyframes ring-spin { to { transform: rotate(360deg); } }
  .sig-ring { animation: ring-spin 6s linear infinite; }

  @keyframes pulse-soft {
    0%, 100% { transform: scale(1); opacity: 0.55; }
    50% { transform: scale(1.5); opacity: 0; }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; } 50% { opacity: 0.25; }
  }
  .sig-dot { animation: blink 1.6s ease-in-out infinite; }

  @keyframes typedot {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
    40% { transform: translateY(-4px); opacity: 1; }
  }
  .type-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--sig-mint); animation: typedot 1.1s ease-in-out infinite; }
  .type-dot:nth-child(2) { animation-delay: 0.14s; }
  .type-dot:nth-child(3) { animation-delay: 0.28s; }

  .sig-mic-btn { position: relative; overflow: hidden; transition: transform 0.18s ease, box-shadow 0.25s ease; touch-action: manipulation; }
  .sig-mic-btn:hover { transform: translateY(-1px); }
  .sig-mic-btn:active { transform: translateY(1px) scale(0.97); }

  .sig-chip { transition: background 0.18s, border-color 0.18s, transform 0.15s; touch-action: manipulation; }
  .sig-chip:hover { background: var(--sig-mint-dim) !important; border-color: var(--sig-line-bright) !important; transform: translateX(2px); }

  .sig-input { -webkit-appearance: none; font-size: 16px; }
  .sig-input:focus { outline: none; border-color: var(--sig-mint); box-shadow: 0 0 0 3px rgba(94,234,212,0.12); }

  .sig-toolbtn { transition: background 0.18s, color 0.18s, border-color 0.18s; }

  @media (max-width: 380px) {
    .sig-tight { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
  }
`

/* ─────────────────────────────────────────────
   MINI COMPONENTS
───────────────────────────────────────────── */
const Meter = ({ active, color = 'var(--sig-mint)', count = 5, h = 14 }) => (
  <div className="flex items-end gap-[3px]" style={{ height: h }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="meter-bar" style={{ background: color, animationPlayState: active ? 'running' : 'paused', height: active ? undefined : '30%' }} />
    ))}
  </div>
)

/* Signature element: instrument ring around the avatar — ticks like a VU dial,
   sweeping arc when listening/speaking, otherwise idle. */
const SignalRing = ({ listening, speaking }) => {
  const active = listening || speaking
  const color = listening ? 'var(--sig-rose)' : speaking ? 'var(--sig-mint)' : 'var(--sig-faint)'
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" className="absolute -inset-[3px] pointer-events-none">
      <circle cx="23" cy="23" r="20.5" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <g className={active ? 'sig-ring' : ''} style={{ transformOrigin: '23px 23px' }}>
        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i / 18) * Math.PI * 2
          const r1 = 20.5, r2 = 17.8
          const x1 = 23 + r1 * Math.cos(a), y1 = 23 + r1 * Math.sin(a)
          const x2 = 23 + r2 * Math.cos(a), y2 = 23 + r2 * Math.sin(a)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.4" opacity={active ? (i % 3 === 0 ? 0.9 : 0.35) : 0.25} />
        })}
      </g>
    </svg>
  )
}

const StatusDot = ({ listening, speaking }) => {
  const color = listening ? 'var(--sig-rose)' : speaking ? 'var(--sig-mint)' : '#34d399'
  return (
    <span className="relative inline-flex w-1.5 h-1.5 flex-shrink-0">
      <span className="absolute inset-0 rounded-full" style={{ background: color, opacity: 0.5, animation: (listening || speaking) ? 'pulse-soft 1.3s ease-out infinite' : 'none' }} />
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
    </span>
  )
}

const Avatar = ({ isUser }) => (
  <div className="w-7 h-7 rounded-md flex-shrink-0 flex items-center justify-center"
    style={{
      background: isUser ? 'var(--sig-indigo)' : 'rgba(94,234,212,0.12)',
      border: isUser ? 'none' : '1px solid var(--sig-line-bright)',
    }}>
    {isUser ? <FiUser size={12} color="#fff" /> : <FaRobot size={11} color="var(--sig-mint)" />}
  </div>
)

/* ─────────────────────────────────────────────
   KNOWLEDGE BASE
───────────────────────────────────────────── */
const KB = {
  introduction: {
    name: "My name is Muhire Dieudonne, a passionate Fullstack Developer from Kigali, Rwanda.",
    role: "I am a Fullstack Developer specializing in React, Next.js, Node.js, and modern web technologies.",
    location: "I'm based in Kigali, Rwanda — the heart of Africa's tech innovation.",
    all: "I'm Muhire Dieudonne, a Fullstack Developer from Kigali, Rwanda. I build amazing web applications with cutting-edge technologies."
  },
  skills: {
    frontend: "I specialise in React, Next.js, and TypeScript with 95% proficiency in React and 98% in JavaScript.",
    backend: "For back-end I work with Node.js, GraphQL, and Python — building RESTful APIs and GraphQL servers.",
    styling: "Expert in Tailwind CSS, SCSS, and Styled Components. I create responsive, beautiful designs.",
    animation: "I use Framer Motion, GSAP, and Three.js for stunning 3-D animations and interactive experiences.",
    threejs: "88% proficiency in Three.js — 3-D product showcases, interactive planets, procedural terrain generation.",
    fullstack: "As a Fullstack Developer, I handle both frontend and backend seamlessly — from database design to UI/UX implementation.",
    all: "React 95 · JavaScript 98 · TypeScript 88 · Next.js 85 · Three.js 88 · Framer Motion 92 · GSAP 90 · Tailwind 96 · Node.js 85 · GraphQL 75."
  },
  projects: {
    ecommerce: "Full-stack e-commerce platform with React, Node.js, and MongoDB — real-time inventory, payments, admin dashboard.",
    metaverse: "A 3-D metaverse in Three.js where users explore virtual spaces, interact with objects, and chat in real time.",
    portfolio: "This 3-D portfolio! Interactive 3-D elements, smooth animations, fully responsive design.",
    game: "Multiplayer browser-based 3-D game using Three.js and WebSocket with real-time physics and particle effects.",
    all: "Top projects: 3-D Interactive Portfolio · E-commerce Platform · Real-time Collaboration Tool · Metaverse · Multiplayer 3-D Game · Procedural Terrain Generator."
  },
  experience: {
    company1: "Lead Frontend Developer at Creative Agency (2022–Present), leading a team of 5 and delivering 25+ projects.",
    company2: "Senior React Developer at Tech Startup (2020–2022), cutting bundle size 35% and shipping real-time features.",
    company3: "3-D Graphics Developer at Procedural Worlds Lab (2021–Present), building terrain-gen systems and interactive worlds.",
    all: "5+ years across global companies — 50+ projects delivered, 30+ happy clients worldwide."
  },
  contact: {
    email: "Reach me at muhiredieu7@gmail.com — I reply within 24 hours.",
    phone: "+250 798 728 379 — call or WhatsApp any time.",
    location: "Based in Kigali, Rwanda — available for remote work worldwide.",
    all: "muhiredieu7@gmail.com · +250 798 728 379 · Kigali, Rwanda · remote-friendly globally."
  },
  education: {
    degree: "BSc Computer Science, focus on Web Development and 3-D Graphics.",
    certifications: "Certified in React Advanced Patterns, Three.js Journey, and Full-Stack Development.",
    all: "CS degree plus ongoing certifications in React, Three.js, and full-stack development."
  },
  availability: {
    status: "Currently available for freelance and full-time opportunities — 24-hour response time.",
    hours: "Flexible hours, comfortable with any time zone. Most active UTC+2 business hours (Kigali time).",
    all: "Open to freelance, full-time, or consultation — let's talk about your project!"
  }
}

function generateResponse(input) {
  const s = input.toLowerCase()

  if (s.includes('who are you') || s.includes('your name') || s.includes('introduce') || s.includes('tell me about yourself')) {
    return "I'm Muhire Dieudonne, a Fullstack Developer from Kigali, Rwanda. I specialize in building modern web applications with React, Next.js, Node.js, and Three.js. I'm passionate about creating immersive digital experiences that combine beautiful design with powerful functionality."
  }
  if (s.includes('where are you from') || s.includes('location') || s.includes('kigali') || s.includes('rwanda')) {
    return "I'm based in Kigali, Rwanda — a beautiful country in East Africa known as the land of a thousand hills. Kigali is an emerging tech hub, and I'm proud to be part of its growing developer community."
  }
  if (s.includes('what do you do') || s.includes('fullstack') || s.includes('full-stack') || s.includes('full stack')) {
    return "As a Fullstack Developer, I work on both frontend and backend development. I create complete web applications from database design to UI implementation. My tech stack includes React, Next.js, Node.js, TypeScript, and various modern frameworks."
  }
  if (s.includes('skill') || s.includes('technology') || s.includes('tech stack')) {
    if (s.includes('frontend') || s.includes('react')) return KB.skills.frontend
    if (s.includes('backend') || s.includes('node')) return KB.skills.backend
    if (s.includes('animation') || s.includes('gsap') || s.includes('motion')) return KB.skills.animation
    if (s.includes('three') || s.includes('3d') || s.includes('webgl')) return KB.skills.threejs
    if (s.includes('css') || s.includes('tailwind') || s.includes('style')) return KB.skills.styling
    if (s.includes('fullstack') || s.includes('full-stack')) return KB.skills.fullstack
    return KB.skills.all
  }
  if (s.includes('project') || s.includes('build') || s.includes('built')) {
    if (s.includes('ecommerce') || s.includes('shop')) return KB.projects.ecommerce
    if (s.includes('3d') || s.includes('metaverse') || s.includes('virtual')) return KB.projects.metaverse
    if (s.includes('game') || s.includes('multiplayer')) return KB.projects.game
    if (s.includes('portfolio')) return KB.projects.portfolio
    return KB.projects.all
  }
  if (s.includes('experience') || s.includes('career') || s.includes('job') || s.includes('work at')) {
    if (s.includes('creative') || s.includes('agency')) return KB.experience.company1
    if (s.includes('startup')) return KB.experience.company2
    if (s.includes('3d') || s.includes('graphics') || s.includes('procedural')) return KB.experience.company3
    return KB.experience.all
  }
  if (s.includes('contact') || s.includes('email') || s.includes('reach') || s.includes('phone')) {
    if (s.includes('email')) return KB.contact.email
    if (s.includes('phone') || s.includes('call') || s.includes('whatsapp')) return KB.contact.phone
    if (s.includes('location') || s.includes('where') || s.includes('based')) return KB.contact.location
    return KB.contact.all
  }
  if (s.includes('education') || s.includes('degree') || s.includes('study')) {
    if (s.includes('degree') || s.includes('university')) return KB.education.degree
    if (s.includes('cert') || s.includes('course')) return KB.education.certifications
    return KB.education.all
  }
  if (s.includes('available') || s.includes('hire') || s.includes('freelance') || s.includes('work with')) {
    if (s.includes('hour') || s.includes('time')) return KB.availability.hours
    return KB.availability.all
  }
  if (s.includes('hello') || s.includes('hi') || s.includes('hey'))
    return "Hey there! I'm Muhire Dieudonne — Fullstack Developer from Kigali, Rwanda. Ask me anything about my skills, projects, or how we can work together!"
  if (s.includes('how are you'))
    return "I'm doing great, thanks for asking! As a Fullstack Developer based in Kigali, I'm always excited to talk about tech and development. What would you like to know?"
  if (s.includes('thank'))
    return "You're very welcome! As a developer from Rwanda, I really appreciate your interest. Feel free to ask anything else!"
  if (s.includes('bye') || s.includes('goodbye'))
    return "Goodbye! It was great talking. Remember, I'm Muhire Dieudonne, Fullstack Developer from Kigali. Reach out anytime!"
  return "I'm Muhire Dieudonne, a Fullstack Developer from Kigali, Rwanda. I can tell you about my skills, projects, experience, or how to contact me. What interests you most?"
}

const SUGGESTIONS = [
  { text: "Who are you?", icon: FiUser },
  { text: "What are your skills?", icon: FiCode },
  { text: "Tell me about your projects", icon: FiBriefcase },
  { text: "What is your experience?", icon: FiAward },
  { text: "How can I contact you?", icon: FiMail },
  { text: "Are you available for work?", icon: FiGlobe },
]

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

  const recognitionRef    = useRef(null)
  const synthRef          = useRef(window.speechSynthesis)
  const messagesEndRef    = useRef(null)
  const inputRef          = useRef(null)
  const hasAutoSpokenRef  = useRef(false)

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
  }, [])

  /* ── Auto-welcome ── */
  useEffect(() => {
    if (!isOpen || welcomeDone) return
    const welcome = "Hey there! I'm Nova, your AI assistant for Muhire Dieudonne. Muhire is a Fullstack Developer from Kigali, Rwanda. I can tell you all about his skills, projects, and experience. Just press the mic or type below!"
    setConversation([{
      type: 'assistant', text: welcome,
      timestamp: new Date(), isTyping: false
    }])
    setWelcomeDone(true)
    const t = setTimeout(() => {
      if (!isMuted && autoVoice && !hasAutoSpokenRef.current) {
        hasAutoSpokenRef.current = true
        speak(welcome)
      }
    }, 400)
    return () => clearTimeout(t)
  }, [isOpen])

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

  /* ── Speak ── */
  const speak = useCallback((text) => {
    if (!synthRef.current || isMuted) return
    synthRef.current.cancel()
    const u = new SpeechSynthesisUtterance(text.replace(/[*•·]/g, ''))
    u.rate = voiceSpeed; u.pitch = voicePitch; u.volume = 1
    u.onstart = () => setIsSpeaking(true)
    u.onend   = () => setIsSpeaking(false)
    u.onerror = () => setIsSpeaking(false)
    synthRef.current.speak(u)
  }, [isMuted, voiceSpeed, voicePitch])

  /* ── Typing animation ── */
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

  /* ── Process input ── */
  const processUserInput = useCallback((input) => {
    if (!input.trim()) return
    synthRef.current?.cancel()
    setConversation(prev => [...prev, {
      type: 'user', text: input.trim(),
      timestamp: new Date(), isTyping: false
    }])
    setInputText('')
    setIsTypingInd(true)
    setTimeout(() => {
      const res = generateResponse(input)
      setIsTypingInd(false)
      addAssistantMessage(res)
      if (!isMuted && autoVoice) speak(res)
    }, 600)
  }, [isMuted, autoVoice, speak, addAssistantMessage])

  /* ── Toggle listening ── */
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported. Please use Chrome, Edge, or Safari.')
      return
    }
    if (isListening) recognitionRef.current.stop()
    else recognitionRef.current.start()
  }

  /* ── Clear ── */
  const clearConversation = () => {
    const msg = "Conversation cleared! I'm Muhire Dieudonne, Fullstack Developer from Kigali, Rwanda. Ask me anything about my work!"
    setConversation([{ type: 'assistant', text: msg, timestamp: new Date(), isTyping: false }])
    if (!isMuted && autoVoice) speak(msg)
  }

  /* ── Mute ── */
  const toggleMute = () => {
    if (!isMuted) { synthRef.current?.cancel(); setIsSpeaking(false) }
    setIsMuted(m => !m)
  }

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="sig-wrap">
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
            className="fixed z-[9999] w-14 h-14 rounded-2xl border-none cursor-pointer flex items-center justify-center"
            style={{
              bottom: 'max(1rem, env(safe-area-inset-bottom))',
              right: 'max(1rem, env(safe-area-inset-right))',
              background: 'var(--sig-surface)',
              border: '1px solid var(--sig-line-bright)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.55), 0 0 0 1px rgba(94,234,212,0.08), 0 0 24px rgba(94,234,212,0.12)',
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.6, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="absolute inset-2 rounded-xl"
              style={{ border: '1px solid var(--sig-mint)' }}
            />
            <Meter active count={4} h={16} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center border-2"
                style={{ background: 'var(--sig-rose)', color: '#0a0c10', borderColor: 'var(--sig-bg)', fontFamily: 'var(--sig-font-mono)' }}
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
            className="sig-scan sig-panel fixed z-[9998] w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-2rem)] max-w-sm sm:max-w-md lg:max-w-lg rounded-xl flex flex-col"
            style={{
              bottom: 'max(0.75rem, env(safe-area-inset-bottom))',
              right: 'max(0.75rem, env(safe-area-inset-right))',
              maxHeight: 'min(680px, calc(100dvh - 1.5rem))',
              background: 'var(--sig-surface)',
              border: '1px solid var(--sig-line)',
              boxShadow: 'var(--sig-shadow)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {/* ── HEADER ── */}
            <div className="sig-tight flex items-center gap-3 px-3 py-3 sm:p-4 border-b relative z-10 sticky top-0"
              style={{ background: 'var(--sig-surface)', borderColor: 'var(--sig-line)' }}
            >
              <div className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <SignalRing listening={isListening} speaking={isSpeaking} />
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(94,234,212,0.10)', border: '1px solid var(--sig-line-bright)' }}
                >
                  <FaRobot size={13} color="var(--sig-mint)" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 font-semibold text-sm sm:text-base min-w-0" style={{ color: 'var(--sig-ink)', fontFamily: 'var(--sig-font-display)', letterSpacing: '-0.01em' }}>
                  <span className="truncate">Muhire Dieudonne</span>
                  <span className="hidden sm:inline-flex flex-shrink-0 text-[10px] font-medium tracking-wider px-1.5 py-0.5 rounded border uppercase"
                    style={{ background: 'transparent', color: 'var(--sig-mint)', borderColor: 'var(--sig-line-bright)', fontFamily: 'var(--sig-font-mono)' }}
                  >
                    Fullstack
                  </span>
                </div>
                <div className="text-[11px] mt-0.5 flex items-center gap-1.5 truncate" style={{ color: 'var(--sig-dim)', fontFamily: 'var(--sig-font-mono)' }}>
                  <StatusDot listening={isListening} speaking={isSpeaking} />
                  {isListening ? (
                    <span style={{ color: 'var(--sig-rose)' }}>recording_input…</span>
                  ) : isSpeaking ? (
                    <span style={{ color: 'var(--sig-mint)' }}>speaking_output…</span>
                  ) : (
                    <span>online · kigali_rw</span>
                  )}
                </div>
              </div>

              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}
                  className="sig-toolbtn w-9 h-9 rounded-lg border flex items-center justify-center active:scale-95"
                  style={{
                    background: isMuted ? 'rgba(251,113,133,0.07)' : 'var(--sig-glass)',
                    borderColor: isMuted ? 'rgba(251,113,133,0.35)' : 'var(--sig-line)',
                    color: isMuted ? 'var(--sig-rose)' : 'var(--sig-dim)',
                  }}
                >
                  {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
                </button>
                <button onClick={() => setIsMinimized(m => !m)} title={isMinimized ? 'Expand' : 'Minimise'}
                  className="sig-toolbtn hidden sm:flex w-9 h-9 rounded-lg border items-center justify-center active:scale-95"
                  style={{ background: 'var(--sig-glass)', borderColor: 'var(--sig-line)', color: 'var(--sig-dim)' }}
                >
                  {isMinimized ? <FiMaximize2 size={14} /> : <FiMinimize2 size={14} />}
                </button>
                <button
                  onClick={() => { setIsOpen(false); synthRef.current?.cancel() }}
                  title="Close (ESC)"
                  className="sig-toolbtn w-9 h-9 rounded-lg border flex items-center justify-center active:scale-95"
                  style={{ background: 'var(--sig-glass)', borderColor: 'var(--sig-line)', color: 'var(--sig-dim)' }}
                >
                  <FiX size={17} strokeWidth={2} />
                </button>
              </div>
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
                  className="overflow-hidden"
                >
                  {/* ── MESSAGES ── */}
                  <div className="sig-tight sig-messages h-[min(42dvh,300px)] sm:h-[340px] overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 flex flex-col gap-2.5 relative z-10"
                    style={{ background: 'rgba(0,0,0,0.18)' }}
                  >
                    {conversation.length === 0 && (
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        className="text-center mx-auto mt-8"
                      >
                        <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center border"
                          style={{ background: 'rgba(94,234,212,0.06)', borderColor: 'var(--sig-line-bright)' }}
                        >
                          <FaRobot size={18} style={{ color: 'var(--sig-mint)' }} />
                        </div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--sig-ink)', fontFamily: 'var(--sig-font-display)' }}>
                          Ask about Muhire Dieudonne
                        </p>
                        <p className="text-xs mt-1.5" style={{ color: 'var(--sig-faint)', fontFamily: 'var(--sig-font-mono)' }}>
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
                          <Avatar isUser={msg.type === 'user'} />
                          <div className="px-3 py-2 sm:py-2.5 rounded-lg"
                            style={{
                              background: msg.type === 'user' ? 'var(--sig-indigo)' : 'var(--sig-glass)',
                              border: msg.type === 'user' ? 'none' : '1px solid var(--sig-line)',
                              borderLeft: msg.type === 'user' ? 'none' : '2px solid var(--sig-mint)',
                              borderRadius: msg.type === 'user' ? '10px 10px 2px 10px' : '2px 10px 10px 10px',
                            }}
                          >
                            <p className="text-[13px] leading-relaxed whitespace-pre-wrap"
                              style={{ color: msg.type === 'user' ? '#fff' : 'var(--sig-ink)' }}
                            >
                              {msg.text}
                              {msg.isTyping && (
                                <span className="sig-dot inline-block w-1 h-3 ml-1 align-middle" style={{ background: 'var(--sig-mint)' }} />
                              )}
                            </p>
                            <p className="text-[9.5px] mt-1.5" style={{ color: msg.type === 'user' ? 'rgba(255,255,255,0.45)' : 'var(--sig-faint)', fontFamily: 'var(--sig-font-mono)', textAlign: msg.type === 'user' ? 'right' : 'left' }}>
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
                          <Avatar isUser={false} />
                          <div className="px-3.5 py-2.5 rounded-lg flex gap-1.5 items-center"
                            style={{ background: 'var(--sig-glass)', border: '1px solid var(--sig-line)', borderLeft: '2px solid var(--sig-mint)', borderRadius: '2px 10px 10px 10px' }}
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
                        style={{ background: 'rgba(251,113,133,0.05)', borderColor: 'var(--sig-line)' }}
                      >
                        <Meter active count={4} color="var(--sig-rose)" h={12} />
                        <p className="text-xs truncate" style={{ color: 'var(--sig-rose)', fontFamily: 'var(--sig-font-mono)' }}>
                          {transcript}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── INPUT AREA ── */}
                  <div className="sig-tight px-3 py-3 sm:px-4 border-t" style={{ background: 'var(--sig-surface)', borderColor: 'var(--sig-line)' }}>
                    <div className="flex gap-2 items-center">
                      <button
                        className="sig-mic-btn w-11 h-11 rounded-lg border flex items-center justify-center flex-shrink-0"
                        onClick={toggleListening}
                        title={isListening ? 'Stop' : 'Speak'}
                        style={{
                          background: isListening ? 'rgba(251,113,133,0.12)' : 'var(--sig-glass)',
                          borderColor: isListening ? 'var(--sig-rose)' : 'var(--sig-line)',
                        }}
                      >
                        {isListening ? <FaStop size={13} color="var(--sig-rose)" /> : <FaMicrophone size={15} style={{ color: 'var(--sig-mint)' }} />}
                      </button>

                      <input
                        ref={inputRef}
                        className="sig-input flex-1 min-w-0 h-11 px-4 rounded-lg border"
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && processUserInput(inputText)}
                        placeholder="Ask about Muhire's work…"
                        style={{
                          border: '1px solid var(--sig-line)',
                          background: 'rgba(255,255,255,0.025)',
                          color: 'var(--sig-ink)',
                        }}
                      />

                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
                        onClick={() => processUserInput(inputText)}
                        disabled={!inputText.trim()}
                        className="w-11 h-11 rounded-lg border flex items-center justify-center flex-shrink-0"
                        style={{
                          background: inputText.trim() ? 'var(--sig-mint)' : 'var(--sig-glass)',
                          borderColor: inputText.trim() ? 'var(--sig-mint)' : 'var(--sig-line)',
                          cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                        }}
                      >
                        <FaPaperPlane size={13} color={inputText.trim() ? '#0a0c10' : 'var(--sig-faint)'} />
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
                          className="sig-toolbtn flex-1 py-1.5 px-1.5 sm:px-2 rounded-md border text-[10px] flex items-center justify-center gap-1 sm:gap-1.5 active:scale-95"
                          style={{
                            background: btn.accent ? 'var(--sig-mint-dim)' : btn.danger ? 'rgba(251,113,133,0.06)' : 'var(--sig-glass)',
                            borderColor: btn.accent ? 'var(--sig-line-bright)' : btn.danger ? 'rgba(251,113,133,0.25)' : 'var(--sig-line)',
                            color: btn.accent ? 'var(--sig-mint)' : btn.danger ? 'var(--sig-rose)' : 'var(--sig-dim)',
                            fontFamily: 'var(--sig-font-mono)',
                          }}
                        >
                          <btn.icon size={11} />
                          <span className="truncate">{btn.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="text-[10px]" style={{ color: 'var(--sig-faint)', fontFamily: 'var(--sig-font-mono)' }}>rate</span>
                      <input type="range" min={0.5} max={1.5} step={0.05} value={voiceSpeed}
                        onChange={e => setVoiceSpeed(parseFloat(e.target.value))}
                        className="flex-1 h-1 rounded-full cursor-pointer"
                        style={{ accentColor: 'var(--sig-mint)' }}
                      />
                      <span className="text-[10px] w-9 text-right" style={{ color: 'var(--sig-faint)', fontFamily: 'var(--sig-font-mono)' }}>{voiceSpeed.toFixed(2)}×</span>
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
                        style={{ background: 'rgba(0,0,0,0.15)', borderColor: 'var(--sig-line)' }}
                      >
                        <div className="sig-tight px-3 py-3 sm:px-4">
                          <p className="text-[10px] tracking-wider uppercase mb-2" style={{ color: 'var(--sig-faint)', fontFamily: 'var(--sig-font-mono)' }}>
                            quick_prompts
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {SUGGESTIONS.map((s, i) => (
                              <motion.button key={i} className="sig-chip px-3 py-2 rounded-md border text-left flex items-center gap-2"
                                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => processUserInput(s.text)}
                                style={{ background: 'var(--sig-glass)', borderColor: 'var(--sig-line)' }}
                              >
                                <s.icon size={11} style={{ color: 'var(--sig-mint)', flexShrink: 0 }} />
                                <span className="text-[11.5px] truncate" style={{ color: 'var(--sig-ink)' }}>{s.text}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── FOOTER ── */}
                  <div className="px-3 py-2 sm:px-4 border-t flex items-center justify-center gap-2"
                    style={{ background: 'var(--sig-surface)', borderColor: 'var(--sig-line)' }}
                  >
                    {isSpeaking && <Meter active count={4} h={10} />}
                    <span className="text-[9.5px] tracking-wide truncate" style={{ color: 'var(--sig-faint)', fontFamily: 'var(--sig-font-mono)' }}>
                      {isSpeaking ? 'output_active' : isListening ? 'input_active' : 'muhire · fullstack · kigali'}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── MINIMISED BODY ── */}
            {isMinimized && (
              <div className="px-4 py-3" style={{ background: 'var(--sig-surface)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <StatusDot listening={isListening} speaking={isSpeaking} />
                    <span className="text-xs font-semibold truncate" style={{ color: 'var(--sig-ink)', fontFamily: 'var(--sig-font-display)' }}>
                      Muhire · Fullstack
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0" style={{ background: 'var(--sig-rose)', color: '#0a0c10', fontFamily: 'var(--sig-font-mono)' }}>
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--sig-glass)', borderColor: 'var(--sig-line)', color: 'var(--sig-dim)' }}
                  >
                    <FiMaximize2 size={14} />
                  </button>
                </div>
                {conversation.length > 0 && (
                  <p className="text-[11px] truncate mt-1.5" style={{ color: 'var(--sig-dim)' }}>
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

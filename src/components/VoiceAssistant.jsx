// src/components/VoiceAssistant.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { 
  FiMic, FiMicOff, FiVolume2, FiVolumeX, FiUser, 
  FiType, FiTrash2, FiX, FiMinimize2, FiMaximize2,
  FiBriefcase, FiCode, FiMail, FiGlobe,
  FiAward, FiBook, FiZap, FiChevronDown, FiChevronUp
} from 'react-icons/fi'
import { FaRobot, FaMicrophone, FaStop, FaPaperPlane } from 'react-icons/fa'

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  :root {
    --nova-bg: #07070f;
    --nova-surface: rgba(14, 14, 26, 0.97);
    --nova-glass: rgba(255,255,255,0.03);
    --nova-border: rgba(255,255,255,0.07);
    --nova-border-accent: rgba(129,90,255,0.35);
    --nova-accent: #815aff;
    --nova-accent2: #ff5acd;
    --nova-accent3: #5af0ff;
    --nova-text: #f0eeff;
    --nova-muted: rgba(240,238,255,0.4);
    --nova-dim: rgba(240,238,255,0.18);
    --nova-success: #36f5a0;
    --nova-danger: #ff4f72;
    --nova-glow: 0 0 40px rgba(129,90,255,0.25);
    --nova-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06);
    --nova-r: 20px;
    --nova-font-display: 'Syne', sans-serif;
    --nova-font-body: 'DM Sans', sans-serif;
  }

  .nova-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .nova-wrap { font-family: var(--nova-font-body); -webkit-font-smoothing: antialiased; }

  .nova-messages { -webkit-overflow-scrolling: touch; overscroll-behavior: contain; }
  .nova-messages::-webkit-scrollbar { width: 3px; }
  .nova-messages::-webkit-scrollbar-track { background: transparent; }
  .nova-messages::-webkit-scrollbar-thumb { background: var(--nova-border-accent); border-radius: 10px; }

  .nova-panel { overscroll-behavior: contain; }

  @keyframes wave {
    0%, 100% { height: 4px; }
    50% { height: 20px; }
  }
  .wave-bar { width: 3px; border-radius: 2px; background: var(--nova-accent); animation: wave 0.8s ease-in-out infinite; transition: background 0.3s; }
  .wave-bar:nth-child(2) { animation-delay: 0.1s; }
  .wave-bar:nth-child(3) { animation-delay: 0.2s; }
  .wave-bar:nth-child(4) { animation-delay: 0.3s; }
  .wave-bar:nth-child(5) { animation-delay: 0.15s; }

  @keyframes speak {
    0%, 100% { height: 3px; }
    50% { height: 14px; }
  }
  .speak-bar { width: 2px; border-radius: 2px; background: var(--nova-accent3); animation: speak 0.6s ease-in-out infinite; }
  .speak-bar:nth-child(2) { animation-delay: 0.12s; }
  .speak-bar:nth-child(3) { animation-delay: 0.24s; }
  .speak-bar:nth-child(4) { animation-delay: 0.08s; }

  @keyframes orb-pulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.15); opacity: 0.3; }
  }

  @keyframes dot-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-5px); opacity: 1; }
  }
  .typing-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--nova-accent); animation: dot-bounce 1.2s ease-in-out infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.15s; }
  .typing-dot:nth-child(3) { animation-delay: 0.3s; }

  .nova-mic-btn { position: relative; overflow: hidden; transition: transform 0.2s, box-shadow 0.3s; touch-action: manipulation; }
  .nova-mic-btn::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.18), transparent 60%); pointer-events: none; }
  .nova-mic-btn:hover { transform: translateY(-1px); }
  .nova-mic-btn:active { transform: translateY(1px); }

  .nova-pill { transition: background 0.2s, border-color 0.2s, transform 0.15s; touch-action: manipulation; }
  .nova-pill:hover { background: rgba(129,90,255,0.18) !important; border-color: rgba(129,90,255,0.5) !important; transform: translateY(-1px); }

  .nova-input { -webkit-appearance: none; font-size: 16px; }
  .nova-input:focus { outline: none; border-color: var(--nova-accent); box-shadow: 0 0 0 3px rgba(129,90,255,0.15); }

  .nova-grain::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events: none; opacity: 0.4; z-index: 0; }

  /* Compact spacing + slightly smaller type on very narrow phones */
  @media (max-width: 380px) {
    .nova-tight { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
  }
`

/* ─────────────────────────────────────────────
   MINI COMPONENTS
───────────────────────────────────────────── */
const Waveform = ({ active, color = 'var(--nova-accent)', count = 5 }) => (
  <div className="flex items-center gap-1 h-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="wave-bar" style={{ background: color, animationPlayState: active ? 'running' : 'paused', height: active ? undefined : 4 }} />
    ))}
  </div>
)

const StatusOrb = ({ listening, speaking }) => {
  const color = listening ? 'var(--nova-danger)' : speaking ? 'var(--nova-accent3)' : 'var(--nova-success)'
  return (
    <div className="relative w-2.5 h-2.5">
      <div className="absolute -inset-1 rounded-full" style={{ background: color, opacity: 0.25, animation: (listening || speaking) ? 'orb-pulse 1.4s ease-in-out infinite' : 'none' }} />
      <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
    </div>
  )
}

const Avatar = ({ isUser }) => (
  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg" style={{
    background: isUser ? 'linear-gradient(135deg, #815aff 0%, #ff5acd 100%)' : 'linear-gradient(135deg, #5af0ff 0%, #815aff 100%)',
    boxShadow: isUser ? '0 2px 12px rgba(129,90,255,0.4)' : '0 2px 12px rgba(90,240,255,0.3)',
  }}>
    {isUser ? <FiUser size={14} color="#fff" /> : <FaRobot size={13} color="#fff" />}
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
  { text: "Who are you?", icon: FiUser, color: '#815aff' },
  { text: "What are your skills?", icon: FiCode, color: '#815aff' },
  { text: "Tell me about your projects", icon: FiBriefcase, color: '#ff5acd' },
  { text: "What is your experience?", icon: FiAward, color: '#5af0ff' },
  { text: "How can I contact you?", icon: FiMail, color: '#36f5a0' },
  { text: "Are you available for work?", icon: FiGlobe, color: '#ffb547' },
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
    <div className="nova-wrap">
      <style>{style}</style>

      {/* ── FAB ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsOpen(true)}
            className="fixed z-[9999] w-12 h-12 sm:w-14 sm:h-14 rounded-full border-none cursor-pointer flex items-center justify-center shadow-2xl"
            style={{
              bottom: 'max(1rem, env(safe-area-inset-bottom))',
              right: 'max(1rem, env(safe-area-inset-right))',
              background: 'linear-gradient(135deg, #815aff 0%, #ff5acd 100%)',
              boxShadow: '0 8px 32px rgba(129,90,255,0.55), 0 0 0 1px rgba(255,255,255,0.1)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(129,90,255,0.4)' }}
            />
            <FaRobot size={20} color="#fff" className="relative z-10" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#07070f]"
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
            initial={{ opacity: 0, scale: 0.88, y: 40, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 40 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="nova-grain nova-panel fixed z-[9998] w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-2rem)] max-w-sm sm:max-w-md lg:max-w-lg rounded-2xl flex flex-col"
            style={{
              bottom: 'max(0.75rem, env(safe-area-inset-bottom))',
              right: 'max(0.75rem, env(safe-area-inset-right))',
              maxHeight: 'min(680px, calc(100dvh - 1.5rem))',
              background: 'var(--nova-surface)',
              border: '1px solid var(--nova-border)',
              boxShadow: 'var(--nova-shadow)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {/* ── HEADER ── */}
            <div className="nova-tight flex items-center gap-2.5 sm:gap-3 px-3 py-3 sm:p-4 border-b border-white/10 relative z-10 sticky top-0"
              style={{ background: 'linear-gradient(135deg, rgba(129,90,255,0.12) 0%, rgba(255,90,205,0.07) 100%)', backdropFilter: 'blur(6px)' }}
            >
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #5af0ff, #815aff)',
                    boxShadow: '0 0 20px rgba(90,240,255,0.35)',
                  }}
                >
                  <FaRobot size={17} color="#fff" />
                </div>
                {(isListening || isSpeaking) && (
                  <motion.div
                    animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -inset-1.5 rounded-full border-2"
                    style={{ borderColor: isListening ? 'var(--nova-danger)' : 'var(--nova-accent3)' }}
                  />
                )}
                <div className="absolute -bottom-0.5 -right-0.5">
                  <StatusOrb listening={isListening} speaking={isSpeaking} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 font-bold text-sm sm:text-base min-w-0" style={{ color: 'var(--nova-text)', fontFamily: 'var(--nova-font-display)' }}>
                  <span className="truncate">Muhire Dieudonne</span>
                  <span className="hidden sm:inline-flex flex-shrink-0 text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full border border-green-500/20"
                    style={{ background: 'rgba(54,245,160,0.12)', color: 'var(--nova-success)' }}
                  >
                    Fullstack
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs mt-0.5 flex items-center gap-1.5 truncate" style={{ color: 'var(--nova-muted)' }}>
                  {isListening ? (
                    <><Waveform active count={4} color="var(--nova-danger)" /><span style={{ color: 'var(--nova-danger)' }}>Listening…</span></>
                  ) : isSpeaking ? (
                    <><Waveform active count={4} color="var(--nova-accent3)" /><span style={{ color: 'var(--nova-accent3)' }}>Speaking…</span></>
                  ) : (
                    <span>📍 Kigali, Rwanda</span>
                  )}
                </div>
              </div>

              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}
                  className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center transition-all active:scale-95"
                  style={{
                    background: isMuted ? 'rgba(255,79,114,0.08)' : 'rgba(129,90,255,0.15)',
                    color: isMuted ? 'var(--nova-danger)' : 'var(--nova-accent)',
                  }}
                >
                  {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
                </button>
                <button onClick={() => setIsMinimized(m => !m)} title={isMinimized ? 'Expand' : 'Minimise'}
                  className="hidden sm:flex w-9 h-9 rounded-lg border border-white/10 items-center justify-center transition-all active:scale-95"
                  style={{ background: 'var(--nova-glass)', color: 'var(--nova-muted)' }}
                >
                  {isMinimized ? <FiMaximize2 size={14} /> : <FiMinimize2 size={14} />}
                </button>
                <button
                  onClick={() => { setIsOpen(false); synthRef.current?.cancel() }}
                  title="Close (ESC)"
                  className="w-9 h-9 rounded-lg border border-red-500/30 flex items-center justify-center transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,79,114,0.15), rgba(255,79,114,0.08))',
                    color: 'var(--nova-danger)',
                    boxShadow: '0 0 12px rgba(255,79,114,0.2)',
                  }}
                >
                  <FiX size={18} strokeWidth={2.5} />
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
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  {/* ── MESSAGES ── */}
                  <div className="nova-tight nova-messages h-[min(42dvh,300px)] sm:h-[340px] overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 flex flex-col gap-3 sm:gap-3.5"
                    style={{
                      background: 'linear-gradient(180deg, rgba(7,7,15,0.6) 0%, rgba(7,7,15,0.9) 100%)',
                    }}
                  >
                    {conversation.length === 0 && (
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        className="text-center mx-auto mt-8"
                      >
                        <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center border border-purple-500/30"
                          style={{ background: 'linear-gradient(135deg, #5af0ff20, #815aff20)' }}
                        >
                          <FaRobot size={22} style={{ color: 'var(--nova-accent)' }} />
                        </div>
                        <p className="font-bold text-sm sm:text-base" style={{ color: 'var(--nova-text)', fontFamily: 'var(--nova-font-display)' }}>
                          Ask about Muhire Dieudonne
                        </p>
                        <p className="text-xs mt-1.5" style={{ color: 'var(--nova-dim)' }}>
                          Fullstack Developer from Kigali, Rwanda<br />Press the mic or type below.
                        </p>
                      </motion.div>
                    )}

                    {conversation.map((msg, idx) => (
                      <motion.div key={idx}
                        initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20, y: 8 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.28 }}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-2 sm:gap-2.5 max-w-[86%] sm:max-w-[82%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                          <Avatar isUser={msg.type === 'user'} />
                          <div className="px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg shadow-md"
                            style={{
                              background: msg.type === 'user'
                                ? 'linear-gradient(135deg, #815aff, #ff5acd)'
                                : 'rgba(255,255,255,0.05)',
                              border: msg.type === 'user' ? 'none' : '1px solid var(--nova-border)',
                              borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                              boxShadow: msg.type === 'user' ? '0 4px 20px rgba(129,90,255,0.35)' : '0 2px 12px rgba(0,0,0,0.3)',
                            }}
                          >
                            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal"
                              style={{ color: msg.type === 'user' ? '#fff' : 'var(--nova-text)' }}
                            >
                              {msg.text}
                              {msg.isTyping && (
                                <motion.span
                                  animate={{ opacity: [1, 0, 1] }}
                                  transition={{ duration: 0.8, repeat: Infinity }}
                                  className="inline-block w-0.5 h-3 ml-1 rounded-sm align-middle"
                                  style={{ background: 'var(--nova-accent)' }}
                                />
                              )}
                            </p>
                            <p className="text-[10px] mt-1.5" style={{ color: 'rgba(255,255,255,0.3)', textAlign: msg.type === 'user' ? 'right' : 'left' }}>
                              {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <AnimatePresence>
                      {isTypingIndicator && (
                        <motion.div key="typing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="flex gap-2.5 items-end"
                        >
                          <Avatar isUser={false} />
                          <div className="px-4 py-3 rounded-lg flex gap-1.5 items-center"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--nova-border)', borderRadius: '18px 18px 18px 4px' }}
                          >
                            {[0, 1, 2].map(i => (
                              <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
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
                        className="px-3 sm:px-4 py-2 border-t border-white/5 flex items-center gap-2 overflow-hidden"
                        style={{ background: 'rgba(129,90,255,0.06)' }}
                      >
                        <Waveform active count={5} color="var(--nova-danger)" />
                        <p className="text-xs italic truncate" style={{ color: 'rgba(255,100,100,0.8)' }}>
                          "{transcript}"
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── INPUT AREA ── */}
                  <div className="nova-tight px-3 py-3 sm:px-4 border-t border-white/10" style={{ background: 'rgba(7,7,15,0.8)' }}>
                    <div className="flex gap-2 items-center">
                      <button
                        className="nova-mic-btn w-11 h-11 rounded-xl border-none flex items-center justify-center flex-shrink-0 transition-all"
                        onClick={toggleListening}
                        title={isListening ? 'Stop' : 'Speak'}
                        style={{
                          background: isListening
                            ? 'var(--nova-danger)'
                            : 'linear-gradient(135deg, rgba(129,90,255,0.3), rgba(255,90,205,0.2))',
                          boxShadow: isListening ? '0 0 20px rgba(255,79,114,0.5)' : '0 2px 10px rgba(0,0,0,0.3)',
                        }}
                      >
                        {isListening ? <FaStop size={14} color="#fff" /> : <FaMicrophone size={16} style={{ color: 'var(--nova-accent)' }} />}
                      </button>

                      <input
                        ref={inputRef}
                        className="nova-input flex-1 min-w-0 h-11 px-4 rounded-xl border font-sans transition-all"
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && processUserInput(inputText)}
                        placeholder="Ask about Muhire's work..."
                        style={{
                          border: '1px solid var(--nova-border)',
                          background: 'rgba(255,255,255,0.04)',
                          color: 'var(--nova-text)',
                        }}
                      />

                      <motion.button
                        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                        onClick={() => processUserInput(inputText)}
                        disabled={!inputText.trim()}
                        className="w-11 h-11 rounded-xl border-none flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          background: inputText.trim()
                            ? 'linear-gradient(135deg, #815aff, #ff5acd)'
                            : 'rgba(255,255,255,0.05)',
                          boxShadow: inputText.trim() ? '0 4px 18px rgba(129,90,255,0.45)' : 'none',
                          cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                        }}
                      >
                        <FaPaperPlane size={14} color={inputText.trim() ? '#fff' : 'rgba(255,255,255,0.2)'} />
                      </motion.button>
                    </div>

                    <div className="flex gap-1.5 mt-2.5">
                      {[
                        {
                          label: showSuggestions ? 'Hide prompts' : 'Show prompts',
                          icon: showSuggestions ? FiChevronDown : FiChevronUp,
                          onClick: () => setShowSuggestions(s => !s),
                          accent: false,
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
                          className="flex-1 py-1.5 px-1.5 sm:px-2 rounded-lg border border-white/5 text-[10px] flex items-center justify-center gap-1 sm:gap-1.5 transition-all active:scale-95"
                          style={{
                            background: btn.accent ? 'rgba(129,90,255,0.12)' : btn.danger ? 'rgba(255,79,114,0.07)' : 'var(--nova-glass)',
                            color: btn.accent ? 'var(--nova-accent)' : btn.danger ? 'var(--nova-danger)' : 'var(--nova-muted)',
                          }}
                        >
                          <btn.icon size={11} />
                          <span className="truncate">{btn.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px]" style={{ color: 'var(--nova-dim)' }}>Speed</span>
                      <input type="range" min={0.5} max={1.5} step={0.05} value={voiceSpeed}
                        onChange={e => setVoiceSpeed(parseFloat(e.target.value))}
                        className="flex-1 h-1 rounded-full cursor-pointer"
                        style={{ accentColor: 'var(--nova-accent)' }}
                      />
                      <span className="text-[10px] w-9 text-right" style={{ color: 'var(--nova-dim)' }}>{voiceSpeed.toFixed(2)}×</span>
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
                        transition={{ duration: 0.22 }}
                        className="border-t border-white/10 overflow-hidden"
                        style={{ background: 'rgba(7,7,15,0.7)' }}
                      >
                        <div className="nova-tight px-3 py-3 sm:px-4">
                          <p className="text-[10px] tracking-wider uppercase flex items-center gap-1.5 mb-2" style={{ color: 'var(--nova-dim)' }}>
                            <FiZap size={10} style={{ color: 'var(--nova-accent)' }} />
                            Ask about Muhire
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {SUGGESTIONS.map((s, i) => (
                              <motion.button key={i} className="nova-pill px-3 py-2 rounded-lg border border-white/5 text-left flex items-center gap-2 transition-all"
                                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                onClick={() => processUserInput(s.text)}
                                style={{ background: 'var(--nova-glass)' }}
                              >
                                <div className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center"
                                  style={{ background: `${s.color}18` }}
                                >
                                  <s.icon size={10} color={s.color} />
                                </div>
                                <span className="text-[11px] truncate" style={{ color: 'var(--nova-text)' }}>{s.text}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── FOOTER ── */}
                  <div className="px-3 py-2 sm:px-4 border-t border-white/10 flex items-center justify-center gap-2"
                    style={{ background: 'rgba(7,7,15,0.9)' }}
                  >
                    {isSpeaking && (
                      <div className="flex gap-0.5 items-center mr-1">
                        {[0, 1, 2, 3].map(i => (
                          <div key={i} className="speak-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                      </div>
                    )}
                    <span className="text-[10px] tracking-wide truncate" style={{ color: 'var(--nova-dim)' }}>
                      {isSpeaking ? 'Nova is speaking…' : isListening ? 'Listening for your voice…' : 'Muhire · Fullstack · Kigali'}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── MINIMISED BODY ── */}
            {isMinimized && (
              <div className="px-4 py-3" style={{ background: 'rgba(7,7,15,0.9)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <StatusOrb listening={isListening} speaking={isSpeaking} />
                    <span className="text-xs font-bold truncate" style={{ color: 'var(--nova-text)', fontFamily: 'var(--nova-font-display)' }}>
                      Muhire · Fullstack
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white flex-shrink-0">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--nova-text)' }}
                  >
                    <FiMaximize2 size={14} />
                  </button>
                </div>
                {conversation.length > 0 && (
                  <p className="text-[11px] truncate mt-1.5" style={{ color: 'var(--nova-muted)' }}>
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

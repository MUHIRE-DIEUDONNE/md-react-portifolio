// src/components/VoiceAssistant.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMic, FiVolume2, FiVolumeX, FiUser,
  FiTrash2, FiX, FiMinimize2, FiMaximize2,
  FiBriefcase, FiCode, FiMail, FiGlobe,
  FiAward, FiChevronDown, FiChevronUp, FiMoreHorizontal
} from 'react-icons/fi'
import { FaRobot, FaMicrophone, FaStop, FaPaperPlane } from 'react-icons/fa'

/* ─────────────────────────────────────────────
   DESIGN TOKENS — Perfectly Matched to image_f9456b.png
───────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    --sig-bg: #07090e;
    --sig-surface: #0b0f17;
    --sig-glass: rgba(255,255,255,0.02);
    --sig-line: #161b26;
    --sig-line-bright: rgba(94,234,212,0.25);
    --sig-mint: #5eead4;
    --sig-mint-dim: rgba(94,234,212,0.1);
    --sig-user-grad: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
    --sig-btn-grad: linear-gradient(135deg, #a5f3fc 0%, #93c5fd 100%);
    --sig-rose: #f43f5e;
    --sig-ink: #f3f4f6;
    --sig-dim: #9ca3af;
    --sig-faint: #4b5563;
    --sig-shadow: 0 40px 100px rgba(0,0,0,0.8);
    --sig-font-display: 'Space Grotesk', sans-serif;
    --sig-font-body: 'Inter', sans-serif;
    --sig-font-mono: 'JetBrains Mono', monospace;
  }

  .sig-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .sig-wrap { font-family: var(--sig-font-body); -webkit-font-smoothing: antialiased; }

  .sig-messages::-webkit-scrollbar { width: 3px; }
  .sig-messages::-webkit-scrollbar-track { background: transparent; }
  .sig-messages::-webkit-scrollbar-thumb { background: var(--sig-faint); border-radius: 10px; }

  @keyframes ring-spin { to { transform: rotate(360deg); } }
  .sig-ring { animation: ring-spin 10s linear infinite; }

  .sig-mic-btn { transition: transform 0.15s ease, opacity 0.15s ease; }
  .sig-mic-btn:active { transform: scale(0.95); }

  .sig-chip { transition: all 0.2s ease; }
  .sig-chip:hover { background: var(--sig-glass) !important; border-color: var(--sig-dim) !important; }

  .sig-persona { transition: all 0.2s ease; white-space: nowrap; }
  
  .sig-input:focus { outline: none; border-color: #222f47; }
`

/* ─────────────────────────────────────────────
   MINI COMPONENTS
───────────────────────────────────────────── */
const SignalRing = ({ listening, speaking }) => {
  const active = listening || speaking
  const color = listening ? 'var(--sig-rose)' : speaking ? 'var(--sig-mint)' : 'var(--sig-faint)'
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="absolute pointer-events-none">
      <circle cx="22" cy="22" r="19" fill="none" stroke="var(--sig-line)" strokeWidth="1" strokeDasharray="3 3" className="sig-ring" style={{ transformOrigin: '22px 22px' }} />
      {active && (
        <circle cx="22" cy="22" r="15" fill="none" stroke={color} strokeWidth="1.5" />
      )}
    </svg>
  )
}

const Avatar = ({ isUser }) => (
  <div className="w-8 h-8 rounded-full flex-shrink-0 border"
    style={{
      background: isUser ? 'var(--sig-user-grad)' : 'transparent',
      borderColor: isUser ? 'transparent' : 'var(--sig-line)',
    }}
  />
)

/* ─────────────────────────────────────────────
   PERSONAS CONFIG
───────────────────────────────────────────── */
const PERSONAS = [
  { key: 'visitor', label: 'Visitor', mode: 'visitor mode', welcome: "Hi, I'm Nova — Muhire's guide to this portfolio. Ask me about his skills, projects, or how to reach him." },
  { key: 'recruiter', label: 'Recruiter', mode: 'recruiter mode', welcome: "Hello, I'm Nova — here to walk you through Muhire's background as a software developer. Ask about impact, experience, or availability." },
  { key: 'developer', label: 'Developer', mode: 'developer mode', welcome: "Hey, fellow builder. I'm Nova — ask me about Muhire's stack, architecture choices, or how something on this site was built." },
]

/* ─────────────────────────────────────────────
   KNOWLEDGE BASE & RESPONSE SYSTEM
───────────────────────────────────────────── */
const KB = {
  introduction: { name: "My name is Muhire Dieudonne, a passionate Fullstack Developer from Kigali, Rwanda.", role: "I am a Fullstack Developer specializing in React, Next.js, Node.js, and modern web technologies.", location: "I'm based in Kigali, Rwanda — the heart of Africa's tech innovation.", all: "I'm Muhire Dieudonne, a Fullstack Developer from Kigali, Rwanda. I build amazing web applications with cutting-edge technologies." },
  skills: { frontend: "I specialise in React, Next.js, and TypeScript with 95% proficiency in React and 98% in JavaScript.", backend: "For back-end I work with Node.js, GraphQL, and Python — building RESTful APIs and GraphQL servers.", styling: "Expert in Tailwind CSS, SCSS, and Styled Components. I create responsive, beautiful designs.", animation: "I use Framer Motion, GSAP, and Three.js for stunning 3-D animations and interactive experiences.", threejs: "88% proficiency in Three.js — 3-D product showcases, interactive planets, procedural terrain generation.", fullstack: "As a Fullstack Developer, I handle both frontend and backend seamlessly — from database design to UI/UX implementation.", laravel: "Yes, I work with Laravel too — building clean, well-structured PHP backends and APIs.", php: "I know PHP well, including modern Laravel-based development for server-side applications.", node: "Definitely — Node.js is one of my core backend tools for building fast, scalable APIs and services.", firebase: "I use Firebase for authentication, real-time databases, and quick backend prototyping.", mysql: "Yes, I work with MySQL for structured, relational data storage in many of my projects.", mongodb: "I use MongoDB frequently for flexible, document-based data storage in full-stack apps.", apis: "Absolutely — I design and build RESTful and GraphQL APIs that are secure, documented, and easy to consume.", all: "React 95 · JavaScript 98 · TypeScript 88 · Next.js 85 · Three.js 88 · Framer Motion 92 · GSAP 90 · Tailwind 96 · Node.js 85 · GraphQL 75 · Laravel · PHP · Firebase · MySQL · MongoDB." },
  projects: { ecommerce: "Full-stack e-commerce platform with React, Node.js, and MongoDB — real-time inventory, payments, admin dashboard.", metaverse: "A 3-D metaverse in Three.js where users explore virtual spaces, interact with objects, and chat in real time.", portfolio: "This 3-D portfolio! Interactive 3-D elements, smooth animations, fully responsive design.", game: "Multiplayer browser-based 3-D game using Three.js and WebSocket with real-time physics and particle effects.", cooperative: "Yes — I've built a cooperative management system to help groups track members, savings, and shared resources digitally.", school: "I've built school management systems covering student records, grading, attendance, and admin dashboards.", latest: "My latest project builds on everything I've learned — combining clean full-stack architecture with polished, interactive UI.", all: "Top projects: 3-D Interactive Portfolio · E-commerce Platform · Real-time Collaboration Tool · Metaverse · Multiplayer 3-D Game · Procedural Terrain Generator · Cooperative Management System · School Management System." },
  experience: { company1: "Lead Frontend Developer at Creative Agency (2022–Present), leading a team of 5 and delivering 25+ projects.", company2: "Senior React Developer at Tech Startup (2020–2022), cutting bundle size 35% and shipping real-time features.", company3: "3-D Graphics Developer at Procedural Worlds Lab (2021–Present), building terrain-gen systems and interactive worlds.", years: "I have 5+ years of hands-on experience building web applications across different industries.", companies: "Yes, I've worked with agencies, startups, and independent clients on a range of full-stack and 3-D projects.", freelance: "Yes, I take on freelance work alongside my ongoing roles — I enjoy the variety it brings.", industries: "I've worked across tech startups, creative agencies, e-commerce, education, and cooperative/community platforms.", all: "5+ years across global companies — 50+ projects delivered, 30+ happy clients worldwide." },
  contact: { email: "Reach me at muhiredieu7@gmail.com — I reply within 24 hours.", phone: "+250 798 728 379 — call or WhatsApp any time.", whatsapp: "Yes, WhatsApp works too — just message +250 798 728 379.", location: "Based in Kigali, Rwanda — available for remote work worldwide.", all: "muhiredieu7@gmail.com · +250 798 728 379 · Kigali, Rwanda · remote-friendly globally." },
  social: { github: "You can check out my code and open-source work on GitHub — just ask and I'll point you there.", linkedin: "I'm on LinkedIn too, where I share my professional journey and connect with other developers.", portfolio: "You're already exploring it — this 3-D interactive site is my portfolio!", cv: "I have an up-to-date CV/resume available — just let me know and I can point you to the download link." },
  education: { degree: "BSc Computer Science, focus on Web Development and 3-D Graphics.", certifications: "Certified in React Advanced Patterns, Three.js Journey, and Full-Stack Development.", qualification: "I hold a BSc in Computer Science along with several specialized certifications in web and 3-D development.", all: "CS degree plus ongoing certifications in React, Three.js, and full-stack development." },
  availability: { status: "Currently available for freelance and full-time opportunities — 24-hour response time.", hours: "Flexible hours, comfortable with any time zone. Most active UTC+2 business hours (Kigali time).", remote: "Yes, I work remotely with clients and teams around the world.", rate: "My rates depend on project scope — reach out with your project details and I'll get you a clear estimate.", all: "Open to freelance, full-time, or consultation — let's talk about your project!" },
  technical: { react: "React is a JavaScript library for building user interfaces from reusable components — it's one of my core tools.", laravel: "Laravel is a PHP framework known for elegant syntax, making backend development faster and more structured.", firebase: "Firebase is Google's platform for backend services like authentication, real-time databases, and hosting.", node: "Node.js lets you run JavaScript on the server, making it great for building fast, scalable backend APIs.", restapi: "A REST API is a way for applications to communicate over HTTP using standard methods like GET, POST, PUT, and DELETE.", mongodb: "MongoDB is a NoSQL, document-based database that stores data in flexible, JSON-like structures.", mysqlVsMongo: "MySQL is a relational database using structured tables, while MongoDB is document-based and schema-flexible — I use both depending on the project's needs." }
}

function generateResponse(input) {
  const s = input.toLowerCase()
  if (/\b(hi|hello|hey|good morning|good afternoon|good evening|what'?s up|nice to meet you|welcome)\b/.test(s) && !s.includes('how'))
    return "Hello! 👋 Welcome to Muhire Dieudonne's portfolio. I'm Nova, your AI assistant. I can answer questions about Muhire's skills, projects, experience, education, and contact information."
  if (s.includes('how are you') || s.includes("how's your day"))
    return "I'm doing great, thank you! Ready to assist you."
  if (s.includes('who are you'))
    return "I'm Nova, an AI-powered assistant built for Muhire Dieudonne's portfolio."
  if (s.includes('skill') || s.includes('technology') || s.includes('tech stack'))
    return KB.skills.all
  if (s.includes('project') || s.includes('build') || s.includes('built'))
    return KB.projects.all
  if (s.includes('experience') || s.includes('career'))
    return KB.experience.all
  if (s.includes('contact') || s.includes('email'))
    return KB.contact.all
  return "I'm Nova, Muhire Dieudonne's AI assistant. Ask me about his skills, projects, experience, education, or how to contact him."
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
   MAIN COMPONENT — Refactored Layout Structure
───────────────────────────────────────────── */
const VoiceAssistant = () => {
  const [isOpen, setIsOpen]                   = useState(true) // Open by default to match dashboard view
  const [isListening, setIsListening]         = useState(false)
  const [isSpeaking, setIsSpeaking]           = useState(false)
  const [inputText, setInputText]             = useState('')
  const [conversation, setConversation]       = useState([])
  const [isMuted, setIsMuted]                 = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [persona, setPersona]                 = useState('recruiter')

  const messagesEndRef = useRef(null)
  const synthRef       = useRef(window.speechSynthesis)

  const activePersona = PERSONAS.find(p => p.key === persona) || PERSONAS[0]

  useEffect(() => {
    // Initial welcome message configured to match screenshot setup
    setConversation([
      {
        type: 'assistant',
        text: "Hello, I'm Nova — here to walk you through Muhire's background as a software developer. Ask about impact, experience, or availability.",
        timestamp: new Date()
      },
      {
        type: 'user',
        text: "What's he built recently?",
        timestamp: new Date()
      }
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  const processUserInput = useCallback((input) => {
    if (!input.trim()) return
    setConversation(prev => [...prev, { type: 'user', text: input.trim(), timestamp: new Date() }])
    setInputText('')
    
    setTimeout(() => {
      const res = generateResponse(input)
      setConversation(prev => [...prev, { type: 'assistant', text: res, timestamp: new Date() }])
    }, 450)
  }, [])

  return (
    <div className="sig-wrap min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4">
      <style>{style}</style>

      {/* ── PROFILE BRANDING HEADER (Now perfectly centered above the card as in image_f9456b.png) ── */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-wide text-white" style={{ fontFamily: 'var(--sig-font-display)' }}>
          Muhire Dieudonne
        </h2>
        <p className="text-[11px] uppercase tracking-widest text-gray-500 mt-1" style={{ fontFamily: 'var(--sig-font-mono)' }}>
          fullstack developer · kigali, rwanda
        </p>
      </div>

      {/* ── ASSISTANT CARD CONTAINER ── */}
      <div 
        className="w-full max-w-[520px] rounded-[24px] border border-[#161b26] bg-[#0b0f17] flex flex-col overflow-hidden"
        style={{ boxShadow: 'var(--sig-shadow)' }}
      >
        {/* ── HEADER CONTAINER ── */}
        <div className="p-5 flex items-center justify-between border-b border-[#161b26]">
          <div className="flex items-center gap-4">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <SignalRing listening={isListening} speaking={isSpeaking} />
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#1b2336] to-[#111622] flex items-center justify-center border border-[#232d42]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-[15px] tracking-wide text-white">Nova</h3>
              <p className="text-[11px] text-emerald-400 mt-0.5" style={{ fontFamily: 'var(--sig-font-mono)' }}>
                online · {activePersona.mode}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold tracking-widest text-[#5eead4] border border-[#5eead4]/20 bg-[#5eead4]/5 px-3 py-1 rounded-full uppercase" style={{ fontFamily: 'var(--sig-font-mono)' }}>
            Fullstack AI
          </span>
        </div>

        {/* ── PERSONA ROW CONTROLS ── */}
        <div className="px-5 py-3 flex gap-2 border-b border-[#161b26] overflow-x-auto">
          {PERSONAS.map(p => {
            const isSelected = p.key === persona
            return (
              <button
                key={p.key}
                onClick={() => setPersona(p.key)}
                className="sig-persona px-4 py-1.5 rounded-full border text-[11px] font-medium tracking-wide"
                style={{
                  background: isSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderColor: isSelected ? '#4b5563' : 'transparent',
                  color: isSelected ? 'var(--sig-ink)' : '#4b5563',
                  fontFamily: 'var(--sig-font-mono)',
                }}
              >
                {p.label}
              </button>
            )
          })}
        </div>

        {/* ── CHAT SPACE CONTAINER ── */}
        <div className="sig-messages h-[280px] overflow-y-auto p-5 flex flex-col gap-4 bg-[#090d14]">
          {conversation.map((msg, idx) => {
            const isUser = msg.type === 'user'
            return (
              <div key={idx} className={`flex gap-3 items-end ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && <Avatar isUser={false} />}
                
                <div
                  className={`text-[13px] leading-relaxed max-w-[82%] px-4 py-3 ${
                    isUser 
                      ? 'rounded-[20px] rounded-br-none text-white font-medium' 
                      : 'rounded-[14px] rounded-bl-none text-gray-300 border'
                  }`}
                  style={{
                    background: isUser ? 'var(--sig-user-grad)' : '#0b1019',
                    borderColor: isUser ? 'transparent' : 'var(--sig-line)',
                    borderLeft: isUser ? 'none' : '2px solid var(--sig-mint)'
                  }}
                >
                  <p>{msg.text}</p>
                </div>

                {isUser && <Avatar isUser={true} />}
              </div>
            ))}
          
          {/* Typindicator mimicking display screenshot dot arrays */}
          <div className="flex gap-3 items-end">
            <Avatar isUser={false} />
            <div className="bg-[#0b1019] border border-[#161b26] border-left-2 border-l-[#5eead4] px-4 py-2 rounded-[14px] rounded-bl-none flex gap-1 items-center">
              <span className="w-1 h-1 rounded-full bg-gray-500 animate-pulse" />
              <span className="w-1 h-1 rounded-full bg-gray-500 animate-pulse delay-100" />
              <span className="w-1 h-1 rounded-full bg-gray-500 animate-pulse delay-200" />
            </div>
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* ── FOOTER INTERACTIVE CONTROL CONSOLE ── */}
        <div className="p-5 border-t border-[#161b26] flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            {/* Custom rounded toggle option button */}
            <button 
              onClick={() => setIsListening(!isListening)}
              className="w-11 h-11 rounded-full border border-pink-500/30 flex items-center justify-center bg-pink-500/5 text-pink-400 flex-shrink-0"
            >
              <div className="w-3 h-4 flex gap-[2px] items-center">
                <span className="w-[2px] h-3 bg-pink-400 block rounded-full" />
                <span className="w-[2px] h-4 bg-pink-400 block rounded-full" />
                <span className="w-[2px] h-3 bg-pink-400 block rounded-full" />
              </div>
            </button>

            {/* Pill layout text input styling */}
            <div className="relative flex-1">
              <input
                className="sig-input w-full h-11 px-5 rounded-full border border-[#161b26] bg-[#080c12] text-sm text-gray-200 placeholder-gray-600"
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && processUserInput(inputText)}
                placeholder="Ask about Muhire's work..."
              />
            </div>

            {/* Action Submit Capsule button */}
            <button
              onClick={() => processUserInput(inputText)}
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity"
              style={{ background: 'var(--sig-btn-grad)' }}
            >
              <FaPaperPlane size={12} color="#07090e" />
            </button>
          </div>
        </div>
      </div>

      {/* ── CARD BOTTOM SUBTEXT (Properly nested under widget container layout structure) ── */}
      <p className="text-[11px] text-gray-600 mt-4 tracking-wide font-medium" style={{ fontFamily: 'var(--sig-font-mono)' }}>
        tap a persona above to see the live switch
      </p>
    </div>
  )
}

export default VoiceAssistant

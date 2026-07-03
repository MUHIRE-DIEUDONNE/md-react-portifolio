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
   DESIGN TOKENS — refined for the screenshot look
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
    --sig-user-a: #8b5cf6;
    --sig-user-b: #ec4899;
    --sig-user-grad: linear-gradient(135deg, var(--sig-user-a), var(--sig-user-b));
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

  .sig-persona { transition: background 0.18s, border-color 0.18s, color 0.18s; touch-action: manipulation; white-space: nowrap; }
  .sig-persona:hover { border-color: rgba(255,255,255,0.22) !important; }

  .sig-input { -webkit-appearance: none; font-size: 16px; }
  .sig-input:focus { outline: none; border-color: var(--sig-mint); box-shadow: 0 0 0 3px rgba(94,234,212,0.12); }

  .sig-toolbtn { transition: background 0.18s, color 0.18s, border-color 0.18s, opacity 0.18s; }

  .sig-jump { transition: opacity 0.2s, transform 0.2s; }
  .sig-jump:hover { transform: translateY(-1px); }

  /* Ghost utility controls that float above the panel, near the title —
     quiet until hovered so they don't compete with the identity block */
  .sig-ghostbar { opacity: 0.55; transition: opacity 0.2s; }
  .sig-ghostbar:hover { opacity: 1; }
  .sig-ghost-btn { transition: background 0.18s, color 0.18s, opacity 0.18s; }

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
  <div className="w-7 h-7 rounded-full flex-shrink-0"
    style={{
      background: isUser ? 'var(--sig-user-grad)' : 'rgba(255,255,255,0.06)',
      border: isUser ? 'none' : '1px solid var(--sig-line)',
    }}
  />
)

/* ─────────────────────────────────────────────
   PERSONAS — live switch
───────────────────────────────────────────── */
const PERSONAS = [
  {
    key: 'visitor',
    label: 'Visitor',
    mode: 'visitor mode',
    welcome: "Hi, I'm Nova — Muhire's guide to this portfolio. Ask me about his skills, projects, or how to reach him.",
  },
  {
    key: 'recruiter',
    label: 'Recruiter',
    mode: 'recruiter mode',
    welcome: "Hello, I'm Nova — here to walk you through Muhire's background as a software developer. Ask about impact, experience, or availability.",
  },
  {
    key: 'developer',
    label: 'Developer',
    mode: 'developer mode',
    welcome: "Hey, fellow builder. I'm Nova — ask me about Muhire's stack, architecture choices, or how something on this site was built.",
  },
]

/* ─────────────────────────────────────────────
   KNOWLEDGE BASE (unchanged)
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
    laravel: "Yes, I work with Laravel too — building clean, well-structured PHP backends and APIs.",
    php: "I know PHP well, including modern Laravel-based development for server-side applications.",
    node: "Definitely — Node.js is one of my core backend tools for building fast, scalable APIs and services.",
    firebase: "I use Firebase for authentication, real-time databases, and quick backend prototyping.",
    mysql: "Yes, I work with MySQL for structured, relational data storage in many of my projects.",
    mongodb: "I use MongoDB frequently for flexible, document-based data storage in full-stack apps.",
    apis: "Absolutely — I design and build RESTful and GraphQL APIs that are secure, documented, and easy to consume.",
    all: "React 95 · JavaScript 98 · TypeScript 88 · Next.js 85 · Three.js 88 · Framer Motion 92 · GSAP 90 · Tailwind 96 · Node.js 85 · GraphQL 75 · Laravel · PHP · Firebase · MySQL · MongoDB."
  },
  projects: {
    ecommerce: "Full-stack e-commerce platform with React, Node.js, and MongoDB — real-time inventory, payments, admin dashboard.",
    metaverse: "A 3-D metaverse in Three.js where users explore virtual spaces, interact with objects, and chat in real time.",
    portfolio: "This 3-D portfolio! Interactive 3-D elements, smooth animations, fully responsive design.",
    game: "Multiplayer browser-based 3-D game using Three.js and WebSocket with real-time physics and particle effects.",
    cooperative: "Yes — I've built a cooperative management system to help groups track members, savings, and shared resources digitally.",
    school: "I've built school management systems covering student records, grading, attendance, and admin dashboards.",
    latest: "My latest project builds on everything I've learned — combining clean full-stack architecture with polished, interactive UI.",
    all: "Top projects: 3-D Interactive Portfolio · E-commerce Platform · Real-time Collaboration Tool · Metaverse · Multiplayer 3-D Game · Procedural Terrain Generator · Cooperative Management System · School Management System."
  },
  experience: {
    company1: "Lead Frontend Developer at Creative Agency (2022–Present), leading a team of 5 and delivering 25+ projects.",
    company2: "Senior React Developer at Tech Startup (2020–2022), cutting bundle size 35% and shipping real-time features.",
    company3: "3-D Graphics Developer at Procedural Worlds Lab (2021–Present), building terrain-gen systems and interactive worlds.",
    years: "I have 5+ years of hands-on experience building web applications across different industries.",
    companies: "Yes, I've worked with agencies, startups, and independent clients on a range of full-stack and 3-D projects.",
    freelance: "Yes, I take on freelance work alongside my ongoing roles — I enjoy the variety it brings.",
    industries: "I've worked across tech startups, creative agencies, e-commerce, education, and cooperative/community platforms.",
    all: "5+ years across global companies — 50+ projects delivered, 30+ happy clients worldwide."
  },
  contact: {
    email: "Reach me at muhiredieu7@gmail.com — I reply within 24 hours.",
    phone: "+250 798 728 379 — call or WhatsApp any time.",
    whatsapp: "Yes, WhatsApp works too — just message +250 798 728 379.",
    location: "Based in Kigali, Rwanda — available for remote work worldwide.",
    all: "muhiredieu7@gmail.com · +250 798 728 379 · Kigali, Rwanda · remote-friendly globally."
  },
  social: {
    github: "You can check out my code and open-source work on GitHub — just ask and I'll point you there.",
    linkedin: "I'm on LinkedIn too, where I share my professional journey and connect with other developers.",
    portfolio: "You're already exploring it — this 3-D interactive site is my portfolio!",
    cv: "I have an up-to-date CV/resume available — just let me know and I can point you to the download link.",
  },
  education: {
    degree: "BSc Computer Science, focus on Web Development and 3-D Graphics.",
    certifications: "Certified in React Advanced Patterns, Three.js Journey, and Full-Stack Development.",
    qualification: "I hold a BSc in Computer Science along with several specialized certifications in web and 3-D development.",
    all: "CS degree plus ongoing certifications in React, Three.js, and full-stack development."
  },
  availability: {
    status: "Currently available for freelance and full-time opportunities — 24-hour response time.",
    hours: "Flexible hours, comfortable with any time zone. Most active UTC+2 business hours (Kigali time).",
    remote: "Yes, I work remotely with clients and teams around the world.",
    rate: "My rates depend on project scope — reach out with your project details and I'll get you a clear estimate.",
    all: "Open to freelance, full-time, or consultation — let's talk about your project!"
  },
  technical: {
    react: "React is a JavaScript library for building user interfaces from reusable components — it's one of my core tools.",
    laravel: "Laravel is a PHP framework known for elegant syntax, making backend development faster and more structured.",
    firebase: "Firebase is Google's platform for backend services like authentication, real-time databases, and hosting.",
    node: "Node.js lets you run JavaScript on the server, making it great for building fast, scalable backend APIs.",
    restapi: "A REST API is a way for applications to communicate over HTTP using standard methods like GET, POST, PUT, and DELETE.",
    mongodb: "MongoDB is a NoSQL, document-based database that stores data in flexible, JSON-like structures.",
    mysqlVsMongo: "MySQL is a relational database using structured tables, while MongoDB is document-based and schema-flexible — I use both depending on the project's needs.",
  }
}

function generateResponse(input) {
  const s = input.toLowerCase()

  if (/\b(hi|hello|hey|good morning|good afternoon|good evening|what'?s up|nice to meet you|welcome)\b/.test(s) && !s.includes('how'))
    return "Hello! 👋 Welcome to Muhire Dieudonne's portfolio. I'm Nova, your AI assistant. I can answer questions about Muhire's skills, projects, experience, education, and contact information. How can I help you today?"
  if (s.includes('how are you') || s.includes("how's your day") || s.includes('how is your day'))
    return "I'm doing great, thank you! I'm here and ready to help you learn more about Muhire Dieudonne and his projects. What would you like to know?"

  if (s.includes('who are you') && !s.includes('muhire'))
    return "I'm Nova, an AI-powered assistant built for Muhire Dieudonne's portfolio. I can talk with you by voice or text about his skills, projects, and experience."
  if (s.includes('what can you do'))
    return "I can introduce Muhire, explain his skills, showcase his projects, provide contact details, answer software development questions, and help you navigate this portfolio using voice or text."
  if (s.includes('how do i use you') || s.includes('how do you work'))
    return "Just press the microphone icon to speak, or type your question below. I'll respond with voice and text — ask me anything about Muhire!"
  if (s.includes('are you an ai') || s.includes('are you a bot') || s.includes('are you human'))
    return "Yes, I'm an AI assistant built into this portfolio to make exploring Muhire's work more interactive."
  if (s.includes('can you speak'))
    return "Yes! I can respond with voice using speech synthesis — you'll hear me talk as well as read my replies."
  if (s.includes('can you hear me'))
    return "Yes, I can listen through your microphone using speech recognition. Just tap the mic button and start talking."
  if (s.includes('what language') && (s.includes('support') || s.includes('speak')))
    return "Right now I communicate in English, but I'm always improving!"

  if (s.includes('who is muhire') || s.includes('introduce muhire') || s.includes('tell me about muhire') || s.includes('introduce') || s.includes('tell me about yourself'))
    return "I'm Muhire Dieudonne, a Fullstack Developer from Kigali, Rwanda. I specialize in building modern web applications with React, Next.js, Node.js, and Three.js. I'm passionate about creating immersive digital experiences that combine beautiful design with powerful functionality."
  if (s.includes('how old'))
    return "I'd rather let my work speak for itself! What I can tell you is that I bring 5+ years of hands-on development experience."
  if (s.includes('what does muhire do') || s.includes('what do you do'))
    return "As a Fullstack Developer, I work on both frontend and backend development. I create complete web applications from database design to UI implementation. My tech stack includes React, Next.js, Node.js, TypeScript, and various modern frameworks."
  if (s.includes('what makes muhire different') || s.includes('why hire') || s.includes('why choose'))
    return "I combine strong full-stack fundamentals with a passion for 3-D and interactive experiences — so the products I build aren't just functional, they're memorable."
  if (s.includes('where are you from') || s.includes('where is muhire') || s.includes('location') || s.includes('kigali') || s.includes('rwanda'))
    return "I'm based in Kigali, Rwanda — a beautiful country in East Africa known as the land of a thousand hills. Kigali is an emerging tech hub, and I'm proud to be part of its growing developer community."
  if (s.includes('fullstack') || s.includes('full-stack') || s.includes('full stack'))
    return KB.introduction.all

  if (s.includes('laravel')) return s.includes('what is') ? KB.technical.laravel : KB.skills.laravel
  if (s.includes('php')) return KB.skills.php
  if (s.includes('firebase')) return s.includes('what is') ? KB.technical.firebase : KB.skills.firebase
  if (s.includes('mysql') && s.includes('mongodb')) return KB.technical.mysqlVsMongo
  if (s.includes('mysql')) return KB.skills.mysql
  if (s.includes('mongodb')) return s.includes('what is') ? KB.technical.mongodb : KB.skills.mongodb
  if (s.includes('rest api') || s.includes('restful')) return s.includes('what is') || s.includes('explain') ? KB.technical.restapi : KB.skills.apis
  if (s.includes('build api') || s.includes('build apis') || (s.includes('api') && s.includes('can')))
    return KB.skills.apis
  if (s.includes('node.js') || s.includes('nodejs') || s.includes('node js')) {
    if (s.includes('what is') || s.includes('explain')) return KB.technical.node
    return KB.skills.node
  }
  if (s.includes('what is react') || s.includes('explain react')) return KB.technical.react
  if (s.includes('skill') || s.includes('technology') || s.includes('tech stack') || s.includes('programming language')) {
    if (s.includes('frontend') || s.includes('react')) return KB.skills.frontend
    if (s.includes('backend')) return KB.skills.backend
    if (s.includes('animation') || s.includes('gsap') || s.includes('motion')) return KB.skills.animation
    if (s.includes('three') || s.includes('3d') || s.includes('webgl')) return KB.skills.threejs
    if (s.includes('css') || s.includes('tailwind') || s.includes('style')) return KB.skills.styling
    if (s.includes('fullstack') || s.includes('full-stack')) return KB.skills.fullstack
    return KB.skills.all
  }

  if (s.includes('cooperative')) return KB.projects.cooperative
  if (s.includes('school management') || s.includes('school system')) return KB.projects.school
  if (s.includes('latest project')) return KB.projects.latest
  if (s.includes('best project') || s.includes('show me his best'))
    return KB.projects.portfolio
  if (s.includes('project') || s.includes('build') || s.includes('built')) {
    if (s.includes('ecommerce') || s.includes('e-commerce') || s.includes('shop')) return KB.projects.ecommerce
    if (s.includes('3d') || s.includes('metaverse') || s.includes('virtual')) return KB.projects.metaverse
    if (s.includes('game') || s.includes('multiplayer')) return KB.projects.game
    if (s.includes('portfolio')) return KB.projects.portfolio
    return KB.projects.all
  }

  if (s.includes('how many years') || (s.includes('years') && s.includes('experience'))) return KB.experience.years
  if (s.includes('worked with companies') || s.includes('worked with a company')) return KB.experience.companies
  if (s.includes('is he a freelancer') || s.includes('are you a freelancer')) return KB.experience.freelance
  if (s.includes('industries')) return KB.experience.industries
  if (s.includes('experience') || s.includes('career') || s.includes('job') || s.includes('work at')) {
    if (s.includes('creative') || s.includes('agency')) return KB.experience.company1
    if (s.includes('startup')) return KB.experience.company2
    if (s.includes('3d') || s.includes('graphics') || s.includes('procedural')) return KB.experience.company3
    return KB.experience.all
  }

  if (s.includes('education') || s.includes('degree') || s.includes('study') || s.includes('qualification')) {
    if (s.includes('qualification')) return KB.education.qualification
    if (s.includes('degree') || s.includes('university') || s.includes('where did')) return KB.education.degree
    if (s.includes('cert') || s.includes('course')) return KB.education.certifications
    return KB.education.all
  }

  if (s.includes('whatsapp')) return KB.contact.whatsapp
  if (s.includes('contact') || s.includes('email') || s.includes('reach') || s.includes('phone')) {
    if (s.includes('email')) return KB.contact.email
    if (s.includes('phone') || s.includes('call')) return KB.contact.phone
    if (s.includes('location') || s.includes('where') || s.includes('based')) return KB.contact.location
    return KB.contact.all
  }

  if (s.includes('github')) return KB.social.github
  if (s.includes('linkedin')) return KB.social.linkedin
  if (s.includes('download') && (s.includes('cv') || s.includes('resume'))) return KB.social.cv
  if (s.includes('cv') || s.includes('resume')) return KB.social.cv
  if (s.includes('show portfolio') || s.includes('open portfolio')) return KB.social.portfolio
  if (s.includes('open projects') || s.includes('go to skills') || s.includes('show contact') || s.includes('scroll to about') || s.includes('open services') || s.includes('show testimonials') || s.includes('open github'))
    return "I can guide you there — use the navigation menu at the top of the portfolio, and I'll be right here if you have questions along the way."

  if (s.includes('remote')) return KB.availability.remote
  if (s.includes('how much') || s.includes('charge') || s.includes('rate') || s.includes('cost') || s.includes('price'))
    return KB.availability.rate
  if (s.includes('is muhire available') || s.includes('can i hire') || s.includes('open for freelance') || s.includes('available') || s.includes('hire') || s.includes('freelance') || s.includes('work with')) {
    if (s.includes('hour') || s.includes('time')) return KB.availability.hours
    return KB.availability.all
  }

  if (s.includes('thank')) return "You're very welcome! As a developer from Rwanda, I really appreciate your interest. Feel free to ask anything else!"
  if (s.includes("you're amazing") || s.includes('good job') || s.includes('well done'))
    return "Thank you so much — that means a lot! Let me know if there's anything else you'd like to explore."
  if (s.includes('joke'))
    return "Why do programmers prefer dark mode? Because light attracts bugs! 😄"
  if (s.includes('inspire me'))
    return "Great things are built one commit at a time — keep showing up, keep shipping, and progress compounds."
  if (s.includes('see you later') || s.includes('have a nice day') || s.includes('bye') || s.includes('goodbye'))
    return "Goodbye! It was great talking. Remember, I'm Nova, here for Muhire Dieudonne, Fullstack Developer from Kigali. Reach out anytime!"

  return "I'm Nova, Muhire Dieudonne's AI assistant. I can tell you about his skills, projects, experience, education, or how to contact him. What interests you most?"
}

// Quick suggestion chips – includes the "What's he built recently?" from screenshot
const SUGGESTIONS = [
  { text: "Who are you?", icon: FiUser },
  { text: "What are your skills?", icon: FiCode },
  { text: "Tell me about your projects", icon: FiBriefcase },
  { text: "What is your experience?", icon: FiAward },
  { text: "How can I contact you?", icon: FiMail },
  { text: "Are you available for work?", icon: FiGlobe },
]

/* ─────────────────────────────────────────────
   MAIN COMPONENT — screenshot layout:
   floating centered title above a clean, borderless-top panel
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
  const [persona, setPersona]                 = useState('recruiter') // default to recruiter to match screenshot
  const [personaTouched, setPersonaTouched]   = useState(false)
  const [showJump, setShowJump]               = useState(false)

  const recognitionRef    = useRef(null)
  const synthRef          = useRef(window.speechSynthesis)
  const messagesEndRef    = useRef(null)
  const messagesBoxRef    = useRef(null)
  const inputRef          = useRef(null)
  const hasAutoSpokenRef  = useRef(false)

  const activePersona = PERSONAS.find(p => p.key === persona) || PERSONAS[0]

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

  useEffect(() => {
    if (!isOpen || welcomeDone) return
    const welcome = activePersona.welcome
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation, isTypingIndicator])

  const handleMessagesScroll = () => {
    const el = messagesBoxRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowJump(distanceFromBottom > 90)
  }
  const scrollToLatest = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    setShowJump(false)
  }

  useEffect(() => {
    if (!isOpen && conversation.length > 0) {
      const last = conversation[conversation.length - 1]
      if (last.type === 'assistant' && !last.isTyping)
        setUnreadCount(c => c + 1)
    }
  }, [conversation])

  useEffect(() => { if (isOpen) setUnreadCount(0) }, [isOpen])

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

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported. Please use Chrome, Edge, or Safari.')
      return
    }
    if (isListening) recognitionRef.current.stop()
    else recognitionRef.current.start()
  }

  const clearConversation = () => {
    const msg = "Conversation cleared! I'm Muhire Dieudonne, Fullstack Developer from Kigali, Rwanda. Ask me anything about my work!"
    setConversation([{ type: 'assistant', text: msg, timestamp: new Date(), isTyping: false }])
    if (!isMuted && autoVoice) speak(msg)
  }

  const toggleMute = () => {
    if (!isMuted) { synthRef.current?.cancel(); setIsSpeaking(false) }
    setIsMuted(m => !m)
  }

  const switchPersona = (key) => {
    if (key === persona) return
    setPersona(key)
    setPersonaTouched(true)
    const next = PERSONAS.find(p => p.key === key)
    synthRef.current?.cancel()
    setConversation(prev => [...prev, {
      type: 'assistant', text: next.welcome,
      timestamp: new Date(), isTyping: false
    }])
    if (!isMuted && autoVoice) speak(next.welcome)
  }

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="sig-wrap">
      <style>{style}</style>

      {/* ── FAB ── */}
      <motion.button
        key="fab"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(o => !o)}
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
        {isOpen ? <FiX size={18} color="var(--sig-mint)" /> : <Meter active count={4} h={16} />}
        {!isOpen && unreadCount > 0 && (
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

      {/* ── MAIN WINDOW ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="window"
            initial={{ opacity: 0, scale: 0.92, y: 24, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            className="fixed z-[9998] w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-2rem)] max-w-sm sm:max-w-md lg:max-w-lg flex flex-col"
            style={{
              bottom: 'calc(max(1rem, env(safe-area-inset-bottom)) + 4.25rem)',
              right: 'max(0.75rem, env(safe-area-inset-right))',
              maxHeight: 'min(680px, calc(100dvh - 6.5rem))',
            }}
          >
            {/* ── FLOATING TITLE (sits above the panel, transparent, centered) ── */}
            <div className="relative px-3 sm:px-4 pt-1 pb-3 text-center flex-shrink-0">
              <h3 className="font-bold text-lg sm:text-xl" style={{ color: 'var(--sig-ink)', fontFamily: 'var(--sig-font-display)', letterSpacing: '-0.01em' }}>
                Muhire Dieudonne
              </h3>
              <p className="text-[11px] mt-1" style={{ color: 'var(--sig-faint)', fontFamily: 'var(--sig-font-mono)' }}>
                fullstack developer · kigali, rwanda
              </p>

              {/* quiet utility controls — present but out of the way */}
              <div className="sig-ghostbar absolute top-0 right-2 sm:right-3 flex gap-1">
                <button onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}
                  className="sig-ghost-btn w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ background: 'transparent', color: isMuted ? 'var(--sig-rose)' : 'var(--sig-faint)' }}
                >
                  {isMuted ? <FiVolumeX size={12} /> : <FiVolume2 size={12} />}
                </button>
                <button onClick={() => setIsMinimized(m => !m)} title={isMinimized ? 'Expand' : 'Minimise'}
                  className="sig-ghost-btn hidden sm:flex w-6 h-6 rounded-md items-center justify-center"
                  style={{ background: 'transparent', color: 'var(--sig-faint)' }}
                >
                  {isMinimized ? <FiMaximize2 size={12} /> : <FiMinimize2 size={12} />}
                </button>
                <button
                  onClick={() => { setIsOpen(false); synthRef.current?.cancel() }}
                  title="Close (ESC)"
                  className="sig-ghost-btn w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ background: 'transparent', color: 'var(--sig-faint)' }}
                >
                  <FiX size={13} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* ── PANEL (clean bordered card, starts at the Nova bar) ── */}
            <div
              className="sig-scan sig-panel rounded-xl flex flex-col relative"
              style={{
                background: 'var(--sig-surface)',
                border: '1px solid var(--sig-line)',
                boxShadow: 'var(--sig-shadow)',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              {/* ── NOVA BAR + PERSONA TABS ── */}
              <div className="sig-tight px-3 pt-3.5 sm:px-4 sm:pt-4 pb-1 relative z-10 sticky top-0"
                style={{ background: 'var(--sig-surface)' }}
              >
                <div className="rounded-lg border flex items-center gap-2.5 px-2.5 py-2"
                  style={{ background: 'var(--sig-glass)', borderColor: 'var(--sig-line)' }}
                >
                  <div className="relative flex-shrink-0 w-9 h-9 flex items-center justify-center">
                    <SignalRing listening={isListening} speaking={isSpeaking} />
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(94,234,212,0.10)', border: '1px solid var(--sig-line-bright)' }}
                    >
                      <FaRobot size={10} color="var(--sig-mint)" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[13px]" style={{ color: 'var(--sig-ink)', fontFamily: 'var(--sig-font-display)' }}>
                      Nova
                    </div>
                    <div className="text-[10.5px] mt-0.5 flex items-center gap-1.5 truncate" style={{ color: 'var(--sig-dim)', fontFamily: 'var(--sig-font-mono)' }}>
                      <StatusDot listening={isListening} speaking={isSpeaking} />
                      {isListening ? (
                        <span style={{ color: 'var(--sig-rose)' }}>recording_input…</span>
                      ) : isSpeaking ? (
                        <span style={{ color: 'var(--sig-mint)' }}>speaking_output…</span>
                      ) : (
                        <span>online · {activePersona.mode}</span>
                      )}
                    </div>
                  </div>

                  <span className="flex-shrink-0 text-[9.5px] font-semibold tracking-wider px-2 py-1 rounded-full border uppercase"
                    style={{ color: 'var(--sig-mint)', borderColor: 'var(--sig-line-bright)', fontFamily: 'var(--sig-font-mono)' }}
                  >
                    Fullstack AI
                  </span>
                </div>

                {/* ── PERSONA TABS ── */}
                <div className="flex gap-1.5 mt-2.5 overflow-x-auto pb-0.5">
                  {PERSONAS.map(p => {
                    const activeTab = p.key === persona
                    return (
                      <button
                        key={p.key}
                        onClick={() => switchPersona(p.key)}
                        className="sig-persona px-3 py-1.5 rounded-full border text-[11px] font-medium"
                        style={{
                          background: activeTab ? 'rgba(255,255,255,0.09)' : 'transparent',
                          borderColor: activeTab ? 'rgba(255,255,255,0.22)' : 'var(--sig-line)',
                          color: activeTab ? 'var(--sig-ink)' : 'var(--sig-dim)',
                          fontFamily: 'var(--sig-font-mono)',
                        }}
                      >
                        {p.label}
                      </button>
                    )
                  })}
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
                    <div className="relative">
                      <div
                        ref={messagesBoxRef}
                        onScroll={handleMessagesScroll}
                        className="sig-tight sig-messages h-[min(42dvh,300px)] sm:h-[340px] overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 flex flex-col gap-2.5 relative z-10 mt-2.5"
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
                              <div
                                className={msg.type === 'user' ? 'px-4 py-2.5 rounded-full' : 'px-3 py-2 sm:py-2.5 rounded-lg'}
                                style={{
                                  background: msg.type === 'user' ? 'var(--sig-user-grad)' : 'var(--sig-glass)',
                                  border: msg.type === 'user' ? 'none' : '1px solid var(--sig-line)',
                                  borderLeft: msg.type === 'user' ? 'none' : '2px solid var(--sig-mint)',
                                  borderRadius: msg.type === 'user' ? '999px' : '2px 10px 10px 10px',
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

                      {/* ── JUMP TO LATEST ── */}
                      <AnimatePresence>
                        {showJump && (
                          <motion.button
                            initial={{ opacity: 0, y: 6, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.9 }}
                            onClick={scrollToLatest}
                            className="sig-jump absolute bottom-2.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full border flex items-center justify-center z-20"
                            style={{ background: 'var(--sig-surface)', borderColor: 'var(--sig-line-bright)', boxShadow: '0 6px 16px rgba(0,0,0,0.45)' }}
                            title="Jump to latest"
                          >
                            <FiChevronDown size={13} color="var(--sig-mint)" />
                          </motion.button>
                        )}
                      </AnimatePresence>
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
                        {isSpeaking
                          ? 'output_active'
                          : isListening
                          ? 'input_active'
                          : !personaTouched
                          ? 'tap a persona above to see the live switch'
                          : 'muhire · fullstack · kigali'}
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
                        Nova · {activePersona.label}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VoiceAssistant

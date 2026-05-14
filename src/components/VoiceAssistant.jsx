// src/components/VoiceAssistant.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiMic, FiMicOff, FiVolume2, FiVolumeX, FiSend, FiUser, 
  FiType, FiTrash2, FiHeart, FiStar, FiX, FiMinimize2, FiMaximize2,
  FiBriefcase, FiCode, FiMail, FiMapPin, FiPhone, FiCpu,
  FiGlobe, FiAward, FiBook, FiZap, FiSettings
} from 'react-icons/fi'
import { FaMicrophoneAlt, FaPaperPlane, FaRobot, FaMicrophone, FaStop } from 'react-icons/fa'

const VoiceAssistant = () => {
  // State declarations
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [conversation, setConversation] = useState([])
  const [isMuted, setIsMuted] = useState(false)
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [welcomeDone, setWelcomeDone] = useState(false)
  const [autoVoice, setAutoVoice] = useState(true) // Auto voice response
  const [continuousListening, setContinuousListening] = useState(false) // Continuous listening mode
  const [voiceSpeed, setVoiceSpeed] = useState(0.9)
  const [voicePitch, setVoicePitch] = useState(1.1)
  
  // Refs
  const recognitionRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const threeContainerRef = useRef(null)
  const autoListenTimeoutRef = useRef(null)

  // Knowledge base about skills, projects, and experience
  const knowledgeBase = {
    skills: {
      frontend: "I specialize in React, Next.js, TypeScript, and modern JavaScript. I have 95% proficiency in React and 98% in JavaScript.",
      backend: "For backend, I work with Node.js, GraphQL, and Python. I've built RESTful APIs and GraphQL servers.",
      styling: "I'm expert in Tailwind CSS, SCSS, and Styled Components. I create responsive and beautiful designs.",
      animation: "I work with Framer Motion, GSAP, and Three.js for creating stunning 3D animations and interactive experiences.",
      threejs: "I have 88% proficiency in Three.js. I've created 3D product showcases, interactive planets, and procedural terrain generation.",
      all: "I'm proficient in React (95%), JavaScript (98%), TypeScript (88%), Next.js (85%), Three.js (88%), Framer Motion (92%), GSAP (90%), Tailwind CSS (96%), Node.js (85%), and GraphQL (75%)."
    },
    projects: {
      ecommerce: "I built a full-stack e-commerce platform with React, Node.js, and MongoDB featuring real-time inventory, payment integration, and admin dashboard.",
      metaverse: "A 3D metaverse experience using Three.js where users can explore virtual spaces, interact with objects, and chat with others in real-time.",
      portfolio: "This 3D portfolio you're viewing now! It features interactive 3D elements, smooth animations, and a fully responsive design.",
      game: "Developed a multiplayer browser-based 3D game using Three.js and WebSocket with real-time physics and particle effects.",
      all: "My best projects include: 3D Interactive Portfolio, E-commerce Platform, Real-time Collaboration Tool, Metaverse Experience, Multiplayer 3D Game, and Procedural Terrain Generator."
    },
    experience: {
      company1: "I worked as Lead Frontend Developer at Creative Agency (2022-Present), leading a team of 5 developers and delivering 25+ projects.",
      company2: "At Tech Startup (2020-2022), I served as Senior React Developer, reducing bundle size by 35% and implementing real-time features.",
      company3: "As 3D Graphics Developer at Procedural Worlds Lab (2021-Present), I created terrain generation systems and interactive 3D worlds.",
      all: "I have 5+ years of experience working with global companies. I've delivered 50+ successful projects and worked with 30+ satisfied clients worldwide."
    },
    contact: {
      email: "You can reach me at muhiredieu7@gmail.com. I typically respond within 24 hours.",
      phone: "My phone number is +250 798 728 379. Feel free to call or WhatsApp me.",
      location: "I'm based in Kigali, Rwanda, but I work remotely with clients worldwide.",
      all: "You can contact me via email at muhiredieu7@gmail.com or call +250 798 728 379. I'm located in Kigali, Rwanda and available for remote work globally."
    },
    education: {
      degree: "I have a Bachelor's Degree in Computer Science with focus on Web Development and 3D Graphics.",
      certifications: "I hold certifications in React Advanced Patterns, Three.js Journey, and Full-Stack Development.",
      all: "I have a CS degree and continuously update my skills through courses, workshops, and hands-on projects."
    },
    availability: {
      status: "I'm currently available for freelance projects and full-time opportunities. I respond within 24 hours.",
      hours: "I work flexible hours and can accommodate different time zones. I'm most active during business hours (UTC+2).",
      all: "I'm available for collaboration! Whether it's freelance work, full-time position, or consultation, let's discuss your project needs."
    }
  }

  // Initialize speech recognition with continuous mode support
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = continuousListening
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        setTranscript('')
      }

      recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript)
          processUserInput(finalTranscript)
          
          // Auto restart listening if continuous mode is on
          if (continuousListening && recognitionRef.current) {
            setTimeout(() => {
              if (!isListening && recognitionRef.current) {
                recognitionRef.current.start()
              }
            }, 1000)
          }
        } else {
          setTranscript(interimTranscript)
        }
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        
        // Auto restart on error if continuous mode is on
        if (continuousListening && event.error !== 'no-speech') {
          setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.start()
            }
          }, 2000)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        
        // Auto restart for continuous listening
        if (continuousListening && !isSpeaking) {
          autoListenTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current && !isListening && !isSpeaking) {
              recognitionRef.current.start()
            }
          }, 3000)
        }
      }

      recognitionRef.current = recognition
    }
    
    return () => {
      if (autoListenTimeoutRef.current) {
        clearTimeout(autoListenTimeoutRef.current)
      }
    }
  }, [continuousListening])

  // Auto-welcome with voice on page load
  useEffect(() => {
    if (!welcomeDone && isOpen) {
      const welcomeMessage = "🎙️ Hello! I'm Nova, your AI assistant with voice capabilities. I can listen and respond to you naturally. Just speak to me, and I'll answer with both voice and text. What would you like to know about my skills, projects, or experience?"
      
      setConversation([{ 
        type: 'assistant', 
        text: welcomeMessage, 
        timestamp: new Date(),
        isTyping: false
      }])
      
      // Auto-speak welcome message
      setTimeout(() => {
        if (isOpen && !isMuted && autoVoice) {
          speak(welcomeMessage)
        }
      }, 500)
      
      setWelcomeDone(true)
      
      // Auto-start listening after welcome
      setTimeout(() => {
        if (isOpen && !isListening) {
          toggleListening()
        }
      }, 3000)
    }
  }, [welcomeDone, isOpen, isMuted, autoVoice])

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [conversation])

  // Increment unread count when conversation gets new assistant message and window is closed
  useEffect(() => {
    if (!isOpen && conversation.length > 0) {
      const lastMessage = conversation[conversation.length - 1]
      if (lastMessage.type === 'assistant' && !lastMessage.isTyping) {
        setUnreadCount(prev => prev + 1)
      }
    }
  }, [conversation, isOpen])

  // Reset unread count when opening
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  // Process user input and generate smart response
  const processUserInput = async (input) => {
    if (!input.trim()) return
    
    // Stop any ongoing speech
    if (synthRef.current) {
      synthRef.current.cancel()
    }
    
    // Add user message
    setConversation(prev => [...prev, { 
      type: 'user', 
      text: input, 
      timestamp: new Date(),
      isTyping: false
    }])
    
    setInputText('')
    setIsTyping(true)
    
    // Generate response based on input
    setTimeout(() => {
      const response = generateResponse(input)
      addAssistantMessage(response)
      
      // Auto voice response
      if (!isMuted && autoVoice) {
        speak(response)
      }
      
      setIsTyping(false)
    }, 500)
  }

  // Generate intelligent responses based on keywords
  const generateResponse = (input) => {
    const lowerInput = input.toLowerCase()
    
    // Skills related
    if (lowerInput.includes('skill') || lowerInput.includes('technology') || lowerInput.includes('tech stack')) {
      if (lowerInput.includes('frontend') || lowerInput.includes('react')) {
        return knowledgeBase.skills.frontend
      } else if (lowerInput.includes('backend') || lowerInput.includes('node')) {
        return knowledgeBase.skills.backend
      } else if (lowerInput.includes('animation') || lowerInput.includes('motion') || lowerInput.includes('gsap')) {
        return knowledgeBase.skills.animation
      } else if (lowerInput.includes('three') || lowerInput.includes('3d') || lowerInput.includes('webgl')) {
        return knowledgeBase.skills.threejs
      } else if (lowerInput.includes('css') || lowerInput.includes('tailwind') || lowerInput.includes('style')) {
        return knowledgeBase.skills.styling
      } else {
        return knowledgeBase.skills.all
      }
    }
    
    // Projects related
    else if (lowerInput.includes('project') || lowerInput.includes('work') || lowerInput.includes('build')) {
      if (lowerInput.includes('ecommerce') || lowerInput.includes('shop')) {
        return knowledgeBase.projects.ecommerce
      } else if (lowerInput.includes('3d') || lowerInput.includes('metaverse') || lowerInput.includes('virtual')) {
        return knowledgeBase.projects.metaverse
      } else if (lowerInput.includes('game') || lowerInput.includes('multiplayer')) {
        return knowledgeBase.projects.game
      } else if (lowerInput.includes('portfolio')) {
        return knowledgeBase.projects.portfolio
      } else {
        return knowledgeBase.projects.all
      }
    }
    
    // Experience related
    else if (lowerInput.includes('experience') || lowerInput.includes('career') || lowerInput.includes('job') || lowerInput.includes('work at')) {
      if (lowerInput.includes('creative') || lowerInput.includes('agency')) {
        return knowledgeBase.experience.company1
      } else if (lowerInput.includes('startup') || lowerInput.includes('tech startup')) {
        return knowledgeBase.experience.company2
      } else if (lowerInput.includes('3d') || lowerInput.includes('graphics') || lowerInput.includes('procedural')) {
        return knowledgeBase.experience.company3
      } else {
        return knowledgeBase.experience.all
      }
    }
    
    // Contact related
    else if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('reach') || lowerInput.includes('phone')) {
      if (lowerInput.includes('email')) {
        return knowledgeBase.contact.email
      } else if (lowerInput.includes('phone') || lowerInput.includes('call') || lowerInput.includes('whatsapp')) {
        return knowledgeBase.contact.phone
      } else if (lowerInput.includes('location') || lowerInput.includes('where') || lowerInput.includes('based')) {
        return knowledgeBase.contact.location
      } else {
        return knowledgeBase.contact.all
      }
    }
    
    // Education related
    else if (lowerInput.includes('education') || lowerInput.includes('degree') || lowerInput.includes('study') || lowerInput.includes('learn')) {
      if (lowerInput.includes('degree') || lowerInput.includes('university')) {
        return knowledgeBase.education.degree
      } else if (lowerInput.includes('certification') || lowerInput.includes('course')) {
        return knowledgeBase.education.certifications
      } else {
        return knowledgeBase.education.all
      }
    }
    
    // Availability related
    else if (lowerInput.includes('available') || lowerInput.includes('hire') || lowerInput.includes('freelance') || lowerInput.includes('work with')) {
      if (lowerInput.includes('available') || lowerInput.includes('status')) {
        return knowledgeBase.availability.status
      } else if (lowerInput.includes('hours') || lowerInput.includes('time')) {
        return knowledgeBase.availability.hours
      } else {
        return knowledgeBase.availability.all
      }
    }
    
    // Voice commands
    else if (lowerInput.includes('stop listening') || lowerInput.includes('stop voice')) {
      if (isListening) {
        recognitionRef.current?.stop()
        return "Okay, I've stopped listening. Say 'start listening' or click the microphone to enable voice input again."
      }
      return "I'm not currently listening. Click the microphone button to start voice input."
    }
    
    else if (lowerInput.includes('start listening') || lowerInput.includes('enable voice')) {
      if (!isListening) {
        toggleListening()
        return "Voice input activated! I'm now listening for your questions. What would you like to know?"
      }
      return "I'm already listening! Feel free to ask me anything."
    }
    
    else if (lowerInput.includes('continuous mode') || lowerInput.includes('auto listen')) {
      setContinuousListening(!continuousListening)
      return `Continuous listening mode ${!continuousListening ? 'activated' : 'deactivated'}. I will ${!continuousListening ? 'keep listening after responses' : 'stop listening after each response'}.`
    }
    
    else if (lowerInput.includes('voice speed') && lowerInput.includes('faster')) {
      setVoiceSpeed(prev => Math.min(1.5, prev + 0.1))
      return `I've increased my speaking speed to ${(voiceSpeed + 0.1).toFixed(1)}x.`
    }
    
    else if (lowerInput.includes('voice speed') && lowerInput.includes('slower')) {
      setVoiceSpeed(prev => Math.max(0.5, prev - 0.1))
      return `I've decreased my speaking speed to ${(voiceSpeed - 0.1).toFixed(1)}x.`
    }
    
    // General greetings
    else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "Hello! Great to see you! I can hear you clearly. I can help you learn about my skills, projects, experience, or contact information. What would you like to know? Just speak naturally!"
    }
    
    else if (lowerInput.includes('how are you')) {
      return "I'm doing fantastic, thank you for asking! I'm excited to share information about my work. How can I help you today? You can ask me anything using your voice!"
    }
    
    else if (lowerInput.includes('thank')) {
      return "You're very welcome! I'm glad I could help. Feel free to ask me anything else about my skills, projects, or experience. I'm always here to listen and respond!"
    }
    
    else if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
      return "Goodbye! It was great talking with you. Feel free to come back anytime if you have more questions. Take care!"
    }
    
    // Default response
    else {
      return "I can tell you about my skills (React, Three.js, etc.), projects (3D portfolios, e-commerce apps), experience (5+ years), or how to contact me. What interests you? Just ask me anything with your voice!"
    }
  }

  // Add assistant message with typing animation
  const addAssistantMessage = (text) => {
    setConversation(prev => [...prev, { 
      type: 'assistant', 
      text: '', 
      timestamp: new Date(),
      isTyping: true,
      fullText: text
    }])
    
    let index = 0
    const interval = setInterval(() => {
      setConversation(prev => {
        const updated = [...prev]
        const lastMessage = updated[updated.length - 1]
        if (lastMessage && lastMessage.isTyping && lastMessage.fullText) {
          lastMessage.text = lastMessage.fullText.slice(0, index + 1)
          if (index + 1 >= lastMessage.fullText.length) {
            lastMessage.isTyping = false
            clearInterval(interval)
          }
        }
        return updated
      })
      index++
    }, 30)
  }

  // Enhanced text-to-speech function with configurable speed and pitch
  const speak = (text) => {
    if (!synthRef.current || isMuted) return
    
    synthRef.current.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = voiceSpeed
    utterance.pitch = voicePitch
    utterance.volume = 1
    
    utterance.onstart = () => {
      setIsSpeaking(true)
    }
    
    utterance.onend = () => {
      setIsSpeaking(false)
      
      // Auto restart listening after speaking if continuous mode is on
      if (continuousListening && recognitionRef.current && !isListening) {
        setTimeout(() => {
          if (recognitionRef.current && !isListening) {
            recognitionRef.current.start()
          }
        }, 1000)
      }
    }
    
    utterance.onerror = () => {
      setIsSpeaking(false)
    }
    
    synthRef.current.speak(utterance)
  }

  // Toggle voice recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return
    }
    
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      // Cancel any pending auto-restart
      if (autoListenTimeoutRef.current) {
        clearTimeout(autoListenTimeoutRef.current)
      }
      recognitionRef.current.start()
    }
  }

  // Clear conversation
  const clearConversation = () => {
    setConversation([{
      type: 'assistant',
      text: "Conversation cleared. I'm still listening! How can I help you today? Ask me about my skills, projects, or experience!",
      timestamp: new Date(),
      isTyping: false
    }])
    if (!isMuted && autoVoice) {
      speak("Conversation cleared. How can I help you today?")
    }
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted && synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
    if (!isMuted && autoVoice) {
      speak("Voice responses muted. You can unmute anytime.")
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    processUserInput(suggestion)
  }

  // Toggle continuous listening
  const toggleContinuousListening = () => {
    setContinuousListening(!continuousListening)
    if (!continuousListening && isListening) {
      // Restart recognition with new mode
      recognitionRef.current?.stop()
      setTimeout(() => {
        recognitionRef.current?.start()
      }, 500)
    }
    if (!isMuted && autoVoice) {
      speak(`Continuous listening mode ${!continuousListening ? 'activated' : 'deactivated'}`)
    }
  }

  // Suggested questions
  const suggestions = [
    { text: "What are your skills?", icon: FiCode },
    { text: "Tell me about your projects", icon: FiBriefcase },
    { text: "What is your experience?", icon: FiStar },
    { text: "How can I contact you?", icon: FiMail },
    { text: "What is your education?", icon: FiBook },
    { text: "Are you available for work?", icon: FiGlobe },
    { text: "Start continuous listening", icon: FiMic },
    { text: "Stop listening", icon: FiMicOff }
  ]

  return (
    <>
      {/* Enhanced Floating Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 flex items-center justify-center group"
        >
          <div className="relative">
            <FaRobot className="w-7 h-7 text-white" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-500/50"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.button>
      )}

      {/* Enhanced Assistant Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80' : 'w-[90vw] sm:w-[500px]'} bg-gradient-to-br from-gray-900/95 to-gray-950/98 backdrop-blur-2xl rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden`}
          >
            {/* Enhanced Header */}
            <div className="relative bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 border-b border-purple-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div ref={threeContainerRef} className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <FaRobot className="w-5 h-5 text-white" />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-purple-500/50"
                      animate={{ 
                        scale: isListening ? [1, 1.3, 1] : 1,
                        opacity: isListening ? [0.5, 0, 0.5] : 0
                      }}
                      transition={{ duration: 1.5, repeat: isListening ? Infinity : 0 }}
                    />
                    {isListening && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <FaRobot className="text-purple-400" />
                      Nova AI Assistant
                      <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        {continuousListening ? 'Always Listening' : 'Voice Ready'}
                      </span>
                    </h3>
                    <p className="text-xs text-white/50 flex items-center gap-2">
                      {isListening ? (
                        <><FaMicrophone className="w-3 h-3 text-red-400 animate-pulse" /> 🎤 Listening...</>
                      ) : isSpeaking ? (
                        <><FiVolume2 className="w-3 h-3 text-green-400" /> 🔊 Speaking...</>
                      ) : (
                        <><FiMic className="w-3 h-3" /> 💬 Click mic to speak</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleContinuousListening}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                      continuousListening ? 'bg-green-500/20 text-green-400' : 'bg-gray-800/50 text-white/50'
                    } hover:bg-purple-500/20`}
                    title={continuousListening ? "Continuous mode ON" : "Continuous mode OFF"}
                  >
                    <FiMic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center hover:bg-purple-500/20 transition"
                  >
                    {isMinimized ? <FiMaximize2 className="w-4 h-4 text-white" /> : <FiMinimize2 className="w-4 h-4 text-white" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center hover:bg-red-500/20 transition"
                  >
                    <FiX className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Voice Status Bar */}
                <div className="px-4 py-2 bg-purple-500/10 border-b border-purple-500/20">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-purple-400">
                      <FaMicrophoneAlt className="w-3 h-3" />
                      <span>Voice Mode: {autoVoice ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <span>Speed: {voiceSpeed}x</span>
                      <span>|</span>
                      <span>Pitch: {voicePitch}x</span>
                    </div>
                    {transcript && !isListening && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-purple-400 truncate max-w-[200px]"
                      >
                        Last: "{transcript.slice(0, 30)}..."
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Enhanced Messages Area */}
                <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-900/50 to-gray-950/50">
                  {conversation.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <FaRobot className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                      <h4 className="text-white font-semibold mb-2">Welcome to Voice-Enabled Nova AI!</h4>
                      <p className="text-white/60 text-sm">Click the microphone and start speaking naturally. I'll respond with both voice and text!</p>
                      <div className="mt-4 flex justify-center gap-2">
                        <button
                          onClick={toggleListening}
                          className="px-4 py-2 bg-purple-500/20 rounded-lg text-purple-400 text-sm flex items-center gap-2"
                        >
                          <FaMicrophoneAlt className="w-3 h-3" />
                          Start Voice Input
                        </button>
                      </div>
                    </motion.div>
                  )}
                  
                  {conversation.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: msg.type === 'user' ? 50 : -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-start gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.type === 'user' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'
                          }`}>
                            {msg.type === 'user' ? <FiUser className="w-4 h-4 text-white" /> : <FaRobot className="w-4 h-4 text-white" />}
                          </div>
                          <div className={`px-4 py-2 rounded-2xl ${
                            msg.type === 'user' 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                              : 'bg-gray-800/50 border border-purple-500/20 text-gray-100'
                          }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            <span className="text-xs opacity-60 mt-1 block">
                              {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-800/50 border border-purple-500/20 rounded-2xl px-4 py-2">
                        <div className="flex gap-1">
                          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-2 h-2 bg-purple-500 rounded-full" />
                          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, delay: 0.1, repeat: Infinity }} className="w-2 h-2 bg-purple-500 rounded-full" />
                          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, delay: 0.2, repeat: Infinity }} className="w-2 h-2 bg-purple-500 rounded-full" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Input Area */}
                <div className="p-4 border-t border-purple-500/20 bg-gray-900/50">
                  <div className="flex gap-2 mb-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleListening}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        isListening 
                          ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                          : 'bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30'
                      }`}
                      title={isListening ? 'Stop listening' : 'Start voice input'}
                    >
                      {isListening ? (
                        <FaStop className="w-5 h-5 text-white" />
                      ) : (
                        <FaMicrophoneAlt className="w-5 h-5 text-purple-400" />
                      )}
                    </motion.button>
                    
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && processUserInput(inputText)}
                        placeholder="Type or speak naturally..."
                        className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500 pr-12"
                      />
                      <FiType className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500/50" />
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => processUserInput(inputText)}
                      disabled={!inputText.trim()}
                      className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-purple-500/30"
                      title="Send message"
                    >
                      <FaPaperPlane className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                  
                  {/* Voice transcript display */}
                  <AnimatePresence>
                    {transcript && isListening && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-2 p-2 bg-purple-500/20 rounded-lg border border-purple-500/30"
                      >
                        <p className="text-xs text-purple-300 flex items-center gap-2">
                          <FaMicrophoneAlt className="w-3 h-3 animate-pulse" />
                          <span className="italic">"{transcript}"</span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowSuggestions(!showSuggestions)}
                      className="flex-1 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg text-xs text-purple-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiZap className="w-3 h-3" />
                      {showSuggestions ? 'Hide' : 'Show'} Suggestions
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearConversation}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-xs text-red-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiTrash2 className="w-3 h-3" />
                      Clear
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAutoVoice(!autoVoice)}
                      className="px-3 py-2 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-xs text-white/60 transition-colors flex items-center justify-center gap-2"
                    >
                      {autoVoice ? <FiVolume2 className="w-3 h-3" /> : <FiVolumeX className="w-3 h-3" />}
                      {autoVoice ? 'Auto Voice ON' : 'Auto Voice OFF'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={toggleMute}
                      className="px-3 py-2 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-xs text-white/60 transition-colors flex items-center justify-center gap-2"
                    >
                      {isMuted ? <FiVolumeX className="w-3 h-3" /> : <FiVolume2 className="w-3 h-3" />}
                      {isMuted ? 'Unmute' : 'Mute'}
                    </motion.button>
                  </div>
                  
                  {/* Voice speed controls */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setVoiceSpeed(prev => Math.max(0.5, prev - 0.1))}
                      className="flex-1 px-2 py-1 bg-gray-800/30 rounded text-xs text-white/50 hover:bg-purple-500/20 transition"
                    >
                      Slower Voice
                    </button>
                    <button
                      onClick={() => setVoiceSpeed(prev => Math.min(1.5, prev + 0.1))}
                      className="flex-1 px-2 py-1 bg-gray-800/30 rounded text-xs text-white/50 hover:bg-purple-500/20 transition"
                    >
                      Faster Voice
                    </button>
                  </div>
                </div>

                {/* Enhanced Suggestions */}
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-purple-500/20 bg-gray-900/30"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-purple-400 flex items-center gap-2 font-medium">
                            <FiZap className="w-4 h-4" />
                            Quick Voice Commands
                          </span>
                          {continuousListening && (
                            <span className="text-xs text-green-400 animate-pulse">
                              🎤 Always listening
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {suggestions.map((suggestion, idx) => (
                            <motion.button
                              key={idx}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSuggestionClick(suggestion.text)}
                              className="text-left p-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-all border border-purple-500/20 hover:border-purple-500/40 group"
                            >
                              <div className="flex items-center gap-2">
                                <suggestion.icon className="w-3 h-3 text-purple-400" />
                                <p className="text-xs text-white/80 group-hover:text-white transition-colors">
                                  {suggestion.text}
                                </p>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Enhanced Footer */}
                <div className="px-4 py-3 bg-gray-900/30 text-center text-xs text-white/40 flex items-center justify-center gap-3 border-t border-purple-500/20">
                  <FiHeart className="w-3 h-3 animate-pulse text-red-400" />
                  <span>🎙️ Voice-Enabled AI • Speak Naturally</span>
                  {isListening && (
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="flex items-center gap-1"
                    >
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>Recording...</span>
                    </motion.div>
                  )}
                </div>
              </>
            )}

            {/* Minimized View */}
            {isMinimized && (
              <div className="p-4 bg-gradient-to-br from-gray-900/95 to-gray-950/98">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaRobot className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-white font-medium">Nova AI Assistant</span>
                    {isListening && (
                      <span className="px-2 py-0.5 bg-red-500 rounded-full text-xs text-white animate-pulse">
                        🎤
                      </span>
                    )}
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-red-500 rounded-full text-xs text-white">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <FiMaximize2 className="w-4 h-4" />
                  </button>
                </div>
                {conversation.length > 0 && (
                  <p className="text-xs text-white/50 mt-2 truncate">
                    {conversation[conversation.length - 1].text}
                  </p>
                )}
                {isListening && (
                  <p className="text-xs text-purple-400 mt-1 animate-pulse">
                    🎤 Listening for voice input...
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default VoiceAssistant
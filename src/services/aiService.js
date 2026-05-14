// src/services/aiService.js

// AI Service for dynamic responses
class AIService {
  constructor() {
    this.apiKey = null // Can be configured for OpenAI, Claude, etc.
    this.baseUrl = 'https://api.openai.com/v1' // Example for OpenAI
  }

  // Process user query and generate response
  async processQuery(query, context = {}) {
    const lowerQuery = query.toLowerCase()
    
    // Check for specific portfolio sections
    const section = this.detectSection(lowerQuery)
    
    // Try AI API if available, fallback to predefined responses
    if (this.apiKey) {
      try {
        return await this.callAI(query, section, context)
      } catch (error) {
        console.warn('AI API failed, using fallback responses:', error)
        return this.getFallbackResponse(section, query)
      }
    }
    
    return this.getFallbackResponse(section, query)
  }

  // Detect which portfolio section the user is asking about
  detectSection(query) {
    const keywords = {
      greetings: ['hello', 'hi', 'hey', 'greetings', 'welcome'],
      about: ['about', 'who', 'tell me about', 'introduce', 'background'],
      skills: ['skill', 'expertise', 'technology', 'tech', 'programming', 'coding'],
      experience: ['experience', 'work', 'job', 'career', 'employment'],
      projects: ['project', 'portfolio', 'work', 'creation', 'build'],
      contact: ['contact', 'reach', 'email', 'hire', 'collaborate'],
      education: ['education', 'study', 'learn', 'school', 'university'],
      achievements: ['achievement', 'award', 'success', 'accomplishment'],
      future: ['future', 'goal', 'plan', 'next', 'upcoming']
    }

    for (const [section, words] of Object.entries(keywords)) {
      if (words.some(word => query.includes(word))) {
        return section
      }
    }

    return 'default'
  }

  // Get fallback response from predefined data
  getFallbackResponse(section, query) {
    const responses = portfolioResponses[section] || portfolioResponses.default
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Call AI API for dynamic responses
  async callAI(query, section, context) {
    const prompt = this.buildPrompt(query, section, context)
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant for Muhire Dieudonne's portfolio. You should:
            1. Be friendly and professional
            2. Provide accurate information about Muhire's skills, experience, and projects
            3. Keep responses concise but informative
            4. When asked about technical details, be specific about technologies used
            5. Always respond in first person as if you're Muhire's assistant
            6. If you don't know something, politely say so and suggest what you can help with`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  // Build prompt for AI API
  buildPrompt(query, section, context) {
    const contextInfo = {
      currentSection: context.currentSection || 'unknown',
      userInterests: context.userInterests || [],
      previousQuestions: context.previousQuestions || []
    }

    return `User query: "${query}"
    
Section detected: ${section}
Context: ${JSON.stringify(contextInfo)}

Please provide a helpful response about Muhire Dieudonne's portfolio.`
  }

  // Configure API key (should be called from environment variables)
  setApiKey(key) {
    this.apiKey = key
  }

  // Get smart suggestions based on context
  getSuggestions(context = {}) {
    const suggestions = [
      "Tell me about your React experience",
      "What projects have you worked on?",
      "How do you handle 3D graphics?",
      "What's your experience with procedural generation?",
      "Can you tell me about your background?",
      "How can I contact you?"
    ]

    // Filter suggestions based on context
    if (context.currentSection === 'skills') {
      return [
        "What technologies do you use?",
        "How proficient are you in Three.js?",
        "Tell me about your WebGL experience",
        "What's your expertise in animation?"
      ]
    }

    if (context.currentSection === 'experience') {
      return [
        "What companies have you worked with?",
        "Tell me about your leadership experience",
        "What was your role at Creative Agency?",
        "How long have you been freelancing?"
      ]
    }

    return suggestions
  }

  // Analyze user intent for better responses
  analyzeIntent(query) {
    const intents = {
      question: /\?$/,
      greeting: /^(hello|hi|hey|greetings)/i,
      request: /(tell me|show me|explain|describe)/i,
      comparison: /(compare|versus|vs|or)/i,
      technical: /(code|programming|technology|framework|library)/i,
      personal: /(your|you're|about yourself)/i
    }

    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(query)) {
        return intent
      }
    }

    return 'general'
  }
}

// Export singleton instance
export const aiService = new AIService()

// Portfolio data for fallback responses
export const portfolioResponses = {
  greetings: [
    "Hello! I'm Muhire's AI assistant. I can tell you about his skills, experience, and projects. What would you like to know?",
    "Hi there! I'm here to help you explore Muhire's portfolio. Just ask me anything about his work!",
    "Welcome! I'm your guide to Muhire's portfolio. Feel free to ask about his expertise in web development, 3D graphics, and more!"
  ],
  about: [
    "Muhire Dieudonne is a passionate creative developer with 5+ years of experience in building immersive web experiences. He specializes in React, Three.js, and advanced animations.",
    "Muhire is a skilled developer focused on creating stunning digital experiences. His expertise includes frontend development, 3D graphics, and procedural generation.",
    "Let me tell you about Muhire! He's an experienced developer who loves pushing the boundaries of web technology with creative solutions."
  ],
  skills: [
    "Muhire has expertise in React, JavaScript, TypeScript, Three.js, WebGL, and procedural generation. He's also skilled in GSAP, Framer Motion, and modern CSS frameworks.",
    "His technical skills include frontend development with React, 3D graphics with Three.js and WebGL, and advanced animation techniques.",
    "Muhire is proficient in web technologies including React, Three.js, WebGL, shader programming, and procedural world generation."
  ],
  experience: [
    "Muhire has worked as a Lead Frontend Developer, Senior React Developer, and 3D Graphics Developer. He's currently freelancing with Procedural Worlds Lab and Game Dev Studio.",
    "His experience includes leading development teams, creating 3D graphics, and building interactive web experiences for various clients.",
    "Muhire has worked with creative agencies, tech startups, and game studios, bringing his expertise in web development and 3D graphics."
  ],
  projects: [
    "Muhire has completed over 180 projects, including 3D product showcases, multiplayer games, terrain generation systems, and interactive web experiences.",
    "His portfolio features impressive projects like real-time terrain generation, interactive planet rendering, and voxel-based terrain editors.",
    "He has delivered numerous successful projects, from component libraries to 3D games and procedural world generators."
  ],
  contact: [
    "You can contact Muhire through his portfolio's contact section. He's available for freelance work and collaborations on exciting projects.",
    "To reach Muhire, check out the contact section of this portfolio. He's always interested in new opportunities and creative challenges.",
    "Muhire would love to hear from you! Visit the contact section to get in touch about potential projects or collaborations."
  ],
  education: [
    "Muhire has continuously expanded his knowledge through self-learning and hands-on experience with cutting-edge web technologies.",
    "His education comes from years of practical experience working with diverse technologies and solving complex technical challenges.",
    "Muhire believes in continuous learning and stays updated with the latest developments in web development and 3D graphics."
  ],
  achievements: [
    "Muhire has won awards for interactive design, led successful development teams, and delivered innovative solutions for global brands.",
    "His achievements include architecting component libraries, mentoring developers, and creating award-winning interactive experiences.",
    "Muhire has been recognized for his technical expertise and creative approach to web development and 3D graphics."
  ],
  future: [
    "Muhire is focused on advancing his expertise in procedural generation, WebGL, and creating more immersive web experiences.",
    "His future goals include exploring advanced AI integration, developing larger 3D projects, and contributing to open-source communities.",
    "Muhire plans to continue pushing the boundaries of what's possible on the web with innovative 3D and interactive experiences."
  ],
  default: [
    "That's interesting! While I can't answer that specifically, I'd be happy to tell you more about Muhire's skills, experience, or projects.",
    "I'm here to help you explore Muhire's portfolio. Would you like to know about his skills, experience, or perhaps see some of his projects?",
    "Let me guide you through Muhire's portfolio! I can share information about his expertise, background, and impressive work."
  ]
}

// src/components/Contact.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiMail, FiPhone, FiMapPin, FiSend, FiCheck, FiGithub, FiLinkedin, 
  FiTwitter, FiInstagram, FiDribbble, FiChevronDown, 
  FiUser, FiFileText, FiMessageCircle, FiAtSign, FiSmile, FiClock,
  FiAward, FiHeart, FiGlobe, FiCode, FiZap
} from 'react-icons/fi'
import { FaWhatsapp, FaDev, FaMedium } from 'react-icons/fa'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [focused, setFocused] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState({})
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [isMobile, setIsMobile] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
    }
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length >= 2 ? '' : 'Name must be at least 2 characters'
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address'
      case 'subject':
        return value.length >= 3 ? '' : 'Subject must be at least 3 characters'
      case 'message':
        return value.length >= 10 ? '' : 'Message must be at least 10 characters'
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    const fieldError = validateField(name, value)
    setIsValid(prev => ({ ...prev, [name]: !fieldError }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errors = {}
    Object.keys(formData).forEach(key => {
      const fieldError = validateField(key, formData[key])
      if (fieldError) errors[key] = fieldError
    })

    if (Object.keys(errors).length > 0) {
      setError('Please fill all fields correctly')
      return
    }

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsValid({})
    }, 3000)
  }

  const socialLinks = [
    { name: 'GitHub', icon: FiGithub, url: 'https://github.com/muhiredieu', color: '#ffffff' },
    { name: 'LinkedIn', icon: FiLinkedin, url: 'https://linkedin.com/in/muhiredieu', color: '#0077B5' },
    { name: 'Twitter', icon: FiTwitter, url: 'https://twitter.com/muhiredieu', color: '#1DA1F2' },
    { name: 'Instagram', icon: FiInstagram, url: 'https://instagram.com/muhiredieu', color: '#E4405F' },
    { name: 'WhatsApp', icon: FaWhatsapp, url: 'https://wa.me/250798728379', color: '#25D366' },
    { name: 'Dev.to', icon: FaDev, url: 'https://dev.to/muhiredieu', color: '#0A0A0A' }
  ]

  const contactInfo = [
    { 
      icon: FiMail,
      label: 'Email',
      value: 'muhiredieu7@gmail.com',
      link: 'mailto:muhiredieu7@gmail.com',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FiPhone,
      label: 'Phone',
      value: '+250 798 728 379',
      link: 'tel:+250798728379',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: FiMapPin,
      label: 'Location',
      value: 'Kigali, Rwanda',
      link: 'https://maps.google.com/?q=Kigali+Rwanda',
      gradient: 'from-red-500 to-orange-500'
    }
  ]

  const stats = [
    { value: '50+', label: 'Projects Completed', icon: FiCode, color: '#6366f1' },
    { value: '30+', label: 'Happy Clients', icon: FiSmile, color: '#10b981' },
    { value: '5+', label: 'Years Experience', icon: FiClock, color: '#f59e0b' },
    { value: '15+', label: 'Technologies', icon: FiZap, color: '#ef4444' }
  ]

  const faqs = [
    {
      question: 'What is your availability?',
      answer: 'I am currently available for freelance work and full-time opportunities. My typical response time is within 24 hours.'
    },
    {
      question: 'What technologies do you specialize in?',
      answer: 'I specialize in React, Next.js, Three.js, GSAP, Node.js, and modern frontend development with a focus on animations and 3D experiences.'
    },
    {
      question: 'How do you handle project timelines?',
      answer: 'I use agile methodology with clear milestones and regular updates. Projects are broken down into sprints for efficient delivery.'
    },
    {
      question: 'What is your pricing structure?',
      answer: 'I offer flexible pricing options including hourly rates, fixed project pricing, or retainer agreements for ongoing work.'
    }
  ]

  return (
    <section id="contact" className="relative py-20 sm:py-28 bg-gradient-to-br from-dark via-dark/95 to-dark overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{ 
              x: Math.random() * windowWidth, 
              y: Math.random() * 1000,
              opacity: 0
            }}
            animate={{ 
              y: [null, -100, -200],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4"
          >
            <FiMessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Get in Touch</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            Let's Work Together
          </h2>
          <p className="text-light/60 mt-4 max-w-2xl mx-auto text-lg">
            Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />
            
            <div className="relative bg-gradient-to-br from-dark/80 to-dark/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-primary/20 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                <FiSend className="w-6 h-6 text-primary" />
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    className={`w-full px-4 py-4 bg-dark/50 border-2 rounded-xl outline-none transition-all text-light ${
                      isValid.name === false ? 'border-red-500' : 'border-primary/30 focus:border-primary group-hover:border-primary/50'
                    }`}
                    required
                  />
                  <label
                    className={`absolute left-4 transition-all px-1 cursor-text ${
                      focused === 'name' || formData.name
                        ? '-top-2.5 text-xs bg-dark text-primary'
                        : 'top-4 text-light/60 group-hover:text-light/80'
                    }`}
                  >
                    Your Name *
                  </label>
                  <FiUser className="absolute right-4 top-4 text-light/40" />
                </div>

                {/* Email Field */}
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className={`w-full px-4 py-4 bg-dark/50 border-2 rounded-xl outline-none transition-all text-light ${
                      isValid.email === false ? 'border-red-500' : 'border-primary/30 focus:border-primary group-hover:border-primary/50'
                    }`}
                    required
                  />
                  <label
                    className={`absolute left-4 transition-all px-1 cursor-text ${
                      focused === 'email' || formData.email
                        ? '-top-2.5 text-xs bg-dark text-primary'
                        : 'top-4 text-light/60 group-hover:text-light/80'
                    }`}
                  >
                    Your Email *
                  </label>
                  <FiAtSign className="absolute right-4 top-4 text-light/40" />
                </div>

                {/* Subject Field */}
                <div className="relative group">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused(null)}
                    className={`w-full px-4 py-4 bg-dark/50 border-2 rounded-xl outline-none transition-all text-light ${
                      isValid.subject === false ? 'border-red-500' : 'border-primary/30 focus:border-primary group-hover:border-primary/50'
                    }`}
                    required
                  />
                  <label
                    className={`absolute left-4 transition-all px-1 cursor-text ${
                      focused === 'subject' || formData.subject
                        ? '-top-2.5 text-xs bg-dark text-primary'
                        : 'top-4 text-light/60 group-hover:text-light/80'
                    }`}
                  >
                    Subject *
                  </label>
                  <FiFileText className="absolute right-4 top-4 text-light/40" />
                </div>

                {/* Message Field */}
                <div className="relative group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    rows={5}
                    className={`w-full px-4 py-4 bg-dark/50 border-2 rounded-xl outline-none transition-all resize-none text-light ${
                      isValid.message === false ? 'border-red-500' : 'border-primary/30 focus:border-primary group-hover:border-primary/50'
                    }`}
                    required
                  />
                  <label
                    className={`absolute left-4 transition-all px-1 cursor-text ${
                      focused === 'message' || formData.message
                        ? '-top-2.5 text-xs bg-dark text-primary'
                        : 'top-4 text-light/60 group-hover:text-light/80'
                    }`}
                  >
                    Your Message *
                  </label>
                  <FiMessageCircle className="absolute right-4 top-4 text-light/40" />
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-red-500/20 border border-red-500 rounded-xl"
                    >
                      <p className="text-red-500 text-sm text-center">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-xl font-semibold text-lg relative overflow-hidden group shadow-lg"
                  disabled={submitted}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  />
                  {submitted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <FiCheck className="w-5 h-5 animate-bounce" />
                      Message Sent Successfully!
                    </motion.div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Send Message
                      <FiSend className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info & Social */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="bg-gradient-to-br from-dark/50 to-dark/30 backdrop-blur-sm rounded-xl p-4 border border-primary/20 text-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <stat.icon className="w-8 h-8 mx-auto mb-2" style={{ color: stat.color }} />
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-light/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.link}
                  target={info.link ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-dark/50 to-dark/30 backdrop-blur-sm rounded-xl p-4 text-center border border-primary/20 group cursor-pointer block"
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${info.gradient} p-2.5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <info.icon className="w-full h-full text-white" />
                  </div>
                  <h4 className="text-xs font-semibold text-primary mb-1">{info.label}</h4>
                  <p className="text-xs text-light/80 group-hover:text-light transition-colors">{info.value}</p>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div className="bg-gradient-to-br from-dark/50 to-dark/30 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiGlobe className="w-5 h-5 text-primary" />
                Connect With Me
              </h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative"
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-dark/50 border border-primary/30 hover:border-primary"
                      style={{ '--hover-color': social.color }}
                    >
                      <social.icon className="w-5 h-5 text-light/70 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-dark/80 px-2 py-1 rounded">
                      {social.name}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gradient-to-br from-dark/50 to-dark/30 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiHeart className="w-5 h-5 text-primary" />
                Frequently Asked Questions
              </h4>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-primary/20 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="w-full px-4 py-3 flex justify-between items-center text-left hover:bg-primary/5 transition-colors"
                    >
                      <span className="text-sm font-medium text-light/80">{faq.question}</span>
                      <FiChevronDown
                        className={`w-4 h-4 text-primary transition-transform ${
                          activeFaq === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {activeFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-4 pb-3"
                        >
                          <p className="text-sm text-light/60 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-3 border border-green-500/30"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-400">Available for Work</span>
                <FiSmile className="w-4 h-4 text-green-400" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
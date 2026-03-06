// src/components/Contact.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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
    { name: 'GitHub', icon: 'https://img.icons8.com/fluency/48/github.png', url: '#', color: '#333' },
    { name: 'LinkedIn', icon: 'https://img.icons8.com/fluency/48/linkedin.png', url: '#', color: '#0077B5' },
    { name: 'Twitter', icon: 'https://img.icons8.com/fluency/48/twitter.png', url: '#', color: '#1DA1F2' },
    { name: 'Instagram', icon: 'https://img.icons8.com/fluency/48/instagram-new.png', url: '#', color: '#E4405F' },
    { name: 'Dribbble', icon: 'https://img.icons8.com/fluency/48/dribbble.png', url: '#', color: '#EA4C89' },
    { name: 'Behance', icon: 'https://img.icons8.com/fluency/48/behance.png', url: '#', color: '#1769FF' }
  ]

  const contactInfo = [
    { 
      icon: 'https://img.icons8.com/fluency/48/email.png',
      label: 'Email',
      value: 'hello@example.com',
      link: 'mailto:hello@example.com'
    },
    {
      icon: 'https://img.icons8.com/fluency/48/phone.png',
      label: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: 'https://img.icons8.com/fluency/48/marker.png',
      label: 'Location',
      value: 'San Francisco, CA',
      link: null
    }
  ]

  const faqs = [
    {
      question: 'What is your availability?',
      answer: 'I am currently available for freelance work and full-time opportunities. My typical response time is within 24 hours.'
    },
    {
      question: 'What technologies do you specialize in?',
      answer: 'I specialize in React, Three.js, GSAP, and modern frontend development with a focus on animations and 3D experiences.'
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
    <section id="contact" className="py-16 sm:py-20 bg-gradient-to-b from-dark to-dark/95">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl">
            Let's Work Together
          </h2>
          <p className="text-light/60 mt-4 max-w-2xl mx-auto">
            Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-b from-dark/50 to-dark/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-primary/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <img src="https://img.icons8.com/fluency/48/send-mass-email.png" alt="Send" className="w-8 h-8" />
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    className={`w-full px-4 py-4 bg-transparent border-2 rounded-lg outline-none transition-all ${
                      isValid.name === false ? 'border-red-500' : 'border-primary/30 focus:border-primary'
                    }`}
                    required
                  />
                  <label
                    className={`absolute left-4 transition-all px-1 ${
                      focused === 'name' || formData.name
                        ? '-top-2.5 text-xs bg-dark text-primary'
                        : 'top-4 text-light/60'
                    }`}
                  >
                    Your Name *
                  </label>
                  {isValid.name === false && (
                    <p className="text-red-500 text-xs mt-1">Name is required</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className={`w-full px-4 py-4 bg-transparent border-2 rounded-lg outline-none transition-all ${
                      isValid.email === false ? 'border-red-500' : 'border-primary/30 focus:border-primary'
                    }`}
                    required
                  />
                  <label
                    className={`absolute left-4 transition-all px-1 ${
                      focused === 'email' || formData.email
                        ? '-top-2.5 text-xs bg-dark text-primary'
                        : 'top-4 text-light/60'
                    }`}
                  >
                    Your Email *
                  </label>
                </div>

                {/* Subject Field */}
                <div className="relative">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused(null)}
                    className={`w-full px-4 py-4 bg-transparent border-2 rounded-lg outline-none transition-all ${
                      isValid.subject === false ? 'border-red-500' : 'border-primary/30 focus:border-primary'
                    }`}
                    required
                  />
                  <label
                    className={`absolute left-4 transition-all px-1 ${
                      focused === 'subject' || formData.subject
                        ? '-top-2.5 text-xs bg-dark text-primary'
                        : 'top-4 text-light/60'
                    }`}
                  >
                    Subject *
                  </label>
                </div>

                {/* Message Field */}
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    rows={5}
                    className={`w-full px-4 py-4 bg-transparent border-2 rounded-lg outline-none transition-all resize-none ${
                      isValid.message === false ? 'border-red-500' : 'border-primary/30 focus:border-primary'
                    }`}
                    required
                  />
                  <label
                    className={`absolute left-4 transition-all px-1 ${
                      focused === 'message' || formData.message
                        ? '-top-2.5 text-xs bg-dark text-primary'
                        : 'top-4 text-light/60'
                    }`}
                  >
                    Your Message *
                  </label>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-red-500/20 border border-red-500 rounded-lg"
                    >
                      <p className="text-red-500 text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold text-lg relative overflow-hidden group"
                  disabled={submitted}
                >
                  {submitted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <img src="https://img.icons8.com/fluency/48/checkmark.png" alt="Success" className="w-6 h-6 animate-bounce" />
                      Message Sent Successfully!
                    </motion.div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Send Message
                      <img 
                        src="https://img.icons8.com/fluency/48/paper-plane.png" 
                        alt="Send"
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      />
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
            className="space-y-8"
          >
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-b from-dark/50 to-dark/30 backdrop-blur-sm rounded-xl p-6 text-center border border-primary/20"
                >
                  <img src={info.icon} alt={info.label} className="w-12 h-12 mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-primary mb-1">{info.label}</h4>
                  {info.link ? (
                    <a href={info.link} className="text-sm text-light/80 hover:text-primary transition-colors">
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sm text-light/80">{info.value}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div className="bg-gradient-to-b from-dark/50 to-dark/30 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <img src="https://img.icons8.com/fluency/48/social-network.png" alt="Social" className="w-6 h-6" />
                Connect With Me
              </h4>
              <div className="flex flex-wrap gap-4">
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
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                      style={{ backgroundColor: `${social.color}20` }}
                    >
                      <img 
                        src={social.icon} 
                        alt={social.name}
                        className="w-8 h-8"
                      />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {social.name}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gradient-to-b from-dark/50 to-dark/30 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <img src="https://img.icons8.com/fluency/48/faq.png" alt="FAQ" className="w-6 h-6" />
                Frequently Asked Questions
              </h4>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-primary/20 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="w-full px-4 py-3 flex justify-between items-center text-left hover:bg-primary/5 transition-colors"
                    >
                      <span className="text-sm font-medium">{faq.question}</span>
                      <img
                        src="https://img.icons8.com/fluency/48/expand-arrow.png"
                        alt="Toggle"
                        className={`w-4 h-4 transform transition-transform ${
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
                          <p className="text-sm text-light/60">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
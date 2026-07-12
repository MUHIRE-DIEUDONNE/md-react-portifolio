// src/components/Contact.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMail, FiPhone, FiMapPin, FiSend, FiCheck,
  FiGithub, FiLinkedin, FiTwitter, FiInstagram,
  FiChevronDown, FiUser, FiFileText, FiMessageCircle,
  FiAtSign, FiArrowUpRight
} from 'react-icons/fi'
import { FaWhatsapp, FaDev } from 'react-icons/fa'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [globalErr, setGlobalErr] = useState('')
  const [activeFaq, setActiveFaq] = useState(null)

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length >= 2 ? '' : 'At least 2 characters'
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address'
      case 'subject':
        return value.length >= 3 ? '' : 'At least 3 characters'
      case 'message':
        return value.length >= 10 ? '' : 'At least 10 characters'
      default:
        return ''
    }
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
    if (globalErr) setGlobalErr('')
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key])
      if (error) newErrors[key] = error
    })
    return newErrors
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setGlobalErr('Please fix the errors above.')
      return
    }
    
    setSubmitted(true)
    // Simulate API call
    setTimeout(() => {
      setSubmitted(false)
      setForm({ name: '', email: '', subject: '', message: '' })
      setErrors({})
      setGlobalErr('')
      alert('Message sent successfully! I will get back to you soon.')
    }, 2000)
  }

  // Data
  const CONTACT_INFO = [
    { Icon: FiMail, label: 'Email', value: 'muhiredieu7@gmail.com', href: 'mailto:muhiredieu7@gmail.com', color: '#7ec8e3' },
    { Icon: FiPhone, label: 'Phone', value: '+250 798 728 379', href: 'tel:+250798728379', color: '#2ecc9a' },
    { Icon: FiMapPin, label: 'Location', value: 'Kigali, Rwanda', href: 'https://maps.google.com/?q=Kigali+Rwanda', color: '#e07070' },
  ]

  const SOCIALS = [
    { Icon: FiGithub, href: 'https://github.com/MUHIRE-DIEUDONNE', label: 'GitHub' },
    { Icon: FiLinkedin, href: 'https://www.linkedin.com/in/muhire-dieudonne-498845419/', label: 'LinkedIn' },
    { Icon: FiTwitter, href: 'https://twitter.com/muhiredieu', label: 'Twitter' },
    { Icon: FiInstagram, href: 'https://www.instagram.com/muhiredieu7/', label: 'Instagram' },
    { Icon: FaWhatsapp, href: 'https://wa.me/250798728379', label: 'WhatsApp' },
    { Icon: FaDev, href: 'https://dev.to/muhiredieu', label: 'Dev.to' },
  ]

  const FAQS = [
    { q: 'What is your availability?', a: "Currently open for freelance and full-time roles — I respond within 24 hours." },
    { q: 'What technologies do you specialise in?', a: "React, Next.js, Three.js, GSAP, Node.js — with a focus on animations and 3D experiences." },
    { q: 'How do you handle project timelines?', a: "Agile sprints with clear milestones and transparent, regular progress updates." },
    { q: 'What is your pricing structure?', a: "Flexible: hourly, fixed-project, or retainer — let's find the model that works for you." },
  ]

  return (
    <section id="contact" style={{ 
      padding: 'clamp(60px, 8vw, 120px) 0',
      background: '#0c0b09',
      color: '#f5eed8',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorations */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(212,175,85,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(46,204,154,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(48px, 6vw, 72px)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 1, background: '#d4af55' }} />
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4af55' }}>
              Get in Touch
            </span>
            <div style={{ width: 40, height: 1, background: '#d4af55' }} />
          </div>
          <h2 style={{ 
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(36px, 7vw, 64px)',
            fontWeight: 900,
            marginBottom: 16,
            letterSpacing: '-0.02em'
          }}>
            Let's Work <span style={{ color: '#d4af55', fontStyle: 'italic' }}>Together</span>
          </h2>
          <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: 'rgba(245,238,216,0.6)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            Have a project in mind? I'd love to hear about it. Send me a message and let's create something extraordinary.
          </p>
        </motion.div>

        {/* Two column layout */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 48,
          alignItems: 'start'
        }}>
          
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              border: '1px solid rgba(255,245,220,0.1)',
              borderRadius: 24,
              padding: 'clamp(24px, 4vw, 40px)',
              background: 'rgba(22, 20, 16, 0.8)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>
                Send a Message
              </h3>
              
              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Name Field */}
                <div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      placeholder="Your Name *"
                      style={{
                        width: '100%',
                        padding: '14px 44px 14px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: `1px solid ${errors.name ? '#e07070' : 'rgba(255,245,220,0.1)'}`,
                        borderRadius: 12,
                        color: '#f5eed8',
                        fontSize: 14,
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                    />
                    <FiUser style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,238,216,0.4)' }} />
                  </div>
                  {errors.name && <p style={{ fontSize: 11, color: '#e07070', marginTop: 6, marginLeft: 4 }}>{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="Your Email *"
                      style={{
                        width: '100%',
                        padding: '14px 44px 14px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: `1px solid ${errors.email ? '#e07070' : 'rgba(255,245,220,0.1)'}`,
                        borderRadius: 12,
                        color: '#f5eed8',
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                    <FiAtSign style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,238,216,0.4)' }} />
                  </div>
                  {errors.email && <p style={{ fontSize: 11, color: '#e07070', marginTop: 6, marginLeft: 4 }}>{errors.email}</p>}
                </div>

                {/* Subject Field */}
                <div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={onChange}
                      placeholder="Subject *"
                      style={{
                        width: '100%',
                        padding: '14px 44px 14px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: `1px solid ${errors.subject ? '#e07070' : 'rgba(255,245,220,0.1)'}`,
                        borderRadius: 12,
                        color: '#f5eed8',
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                    <FiFileText style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,238,216,0.4)' }} />
                  </div>
                  {errors.subject && <p style={{ fontSize: 11, color: '#e07070', marginTop: 6, marginLeft: 4 }}>{errors.subject}</p>}
                </div>

                {/* Message Field */}
                <div>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      placeholder="Your Message *"
                      rows={5}
                      style={{
                        width: '100%',
                        padding: '14px 44px 14px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: `1px solid ${errors.message ? '#e07070' : 'rgba(255,245,220,0.1)'}`,
                        borderRadius: 12,
                        color: '#f5eed8',
                        fontSize: 14,
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                    <FiMessageCircle style={{ position: 'absolute', right: 14, top: 14, color: 'rgba(245,238,216,0.4)' }} />
                  </div>
                  {errors.message && <p style={{ fontSize: 11, color: '#e07070', marginTop: 6, marginLeft: 4 }}>{errors.message}</p>}
                </div>

                {/* Global Error */}
                <AnimatePresence>
                  {globalErr && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ fontSize: 12, color: '#e07070', padding: '8px 12px', background: 'rgba(224,112,112,0.1)', borderRadius: 8, border: '1px solid rgba(224,112,112,0.3)' }}
                    >
                      {globalErr}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitted}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    background: '#d4af55',
                    color: '#0c0b09',
                    border: 'none',
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: submitted ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    transition: 'all 0.2s',
                    opacity: submitted ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!submitted) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(212,175,85,0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {submitted ? (
                    <><FiCheck size={16} /> Message Sent!</>
                  ) : (
                    <><FiSend size={14} /> Send Message <FiArrowUpRight size={14} /></>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Right Column - Info & Social */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            {/* Availability Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 20px',
              background: 'rgba(46,204,154,0.1)',
              border: '1px solid rgba(46,204,154,0.3)',
              borderRadius: 100,
              width: 'fit-content'
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ecc9a' }} />
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2ecc9a' }}>
                Available for Work
              </span>
            </div>

            {/* Contact Info Cards */}
            <div style={{
              border: '1px solid rgba(255,245,220,0.1)',
              borderRadius: 20,
              padding: 24,
              background: 'rgba(22, 20, 16, 0.8)',
              backdropFilter: 'blur(10px)'
            }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4af55', marginBottom: 20 }}>
                Direct Contact
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {CONTACT_INFO.map((info, idx) => (
                  <a
                    key={idx}
                    href={info.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,245,220,0.05)',
                      borderRadius: 14,
                      textDecoration: 'none',
                      color: '#f5eed8',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(212,175,85,0.3)'
                      e.currentTarget.style.background = 'rgba(212,175,85,0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,245,220,0.05)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                    }}
                  >
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `${info.color}15`,
                      border: `1px solid ${info.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <info.Icon size={18} color={info.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: info.color, marginBottom: 4 }}>
                        {info.label}
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(245,238,216,0.7)' }}>{info.value}</div>
                    </div>
                    <FiArrowUpRight size={14} style={{ marginLeft: 'auto', color: 'rgba(245,238,216,0.3)' }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div style={{
              border: '1px solid rgba(255,245,220,0.1)',
              borderRadius: 20,
              padding: 24,
              background: 'rgba(22, 20, 16, 0.8)',
              backdropFilter: 'blur(10px)'
            }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4af55', marginBottom: 20 }}>
                Connect Online
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {SOCIALS.map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,245,220,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(245,238,216,0.6)',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#d4af55'
                      e.currentTarget.style.background = 'rgba(212,175,85,0.1)'
                      e.currentTarget.style.color = '#d4af55'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,245,220,0.08)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      e.currentTarget.style.color = 'rgba(245,238,216,0.6)'
                    }}
                  >
                    <social.Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div style={{
              border: '1px solid rgba(255,245,220,0.1)',
              borderRadius: 20,
              overflow: 'hidden',
              background: 'rgba(22, 20, 16, 0.8)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ padding: '20px 24px' }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4af55' }}>
                  Quick Answers
                </h4>
              </div>
              {FAQS.map((faq, idx) => (
                <div key={idx} style={{ borderTop: '1px solid rgba(255,245,220,0.08)' }}>
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      color: activeFaq === idx ? '#d4af55' : 'rgba(245,238,216,0.7)',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#f5eed8'}
                    onMouseLeave={(e) => {
                      if (activeFaq !== idx) e.currentTarget.style.color = 'rgba(245,238,216,0.7)'
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{faq.q}</span>
                    <motion.span animate={{ rotate: activeFaq === idx ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <FiChevronDown size={16} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{ padding: '0 24px 20px 24px', fontSize: 13, color: 'rgba(245,238,216,0.6)', lineHeight: 1.6 }}>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact

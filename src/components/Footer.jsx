// src/components/Footer.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiHome, FiUser,
  FiCode, FiFolder, FiBriefcase, FiMail, FiBookOpen, FiGift,
  FiChevronUp, FiCheck, FiHeart, FiArrowRight
} from 'react-icons/fi'
import { FaReact } from 'react-icons/fa'
import { SiThreedotjs } from 'react-icons/si'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [inputFocused, setInputFocused] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const checkTheme = () => {
      const html = document.documentElement
      setIsDarkMode(!html.classList.contains('light-mode'))
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const updateScrollProgress = () => {
      const winScroll = document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      setScrollProgress(height > 0 ? (winScroll / height) * 100 : 0)
    }
    window.addEventListener('scroll', updateScrollProgress)
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3500)
    }
  }

  const quickLinks = [
    { name: 'Home', href: '#home', icon: FiHome },
    { name: 'About', href: '#about', icon: FiUser },
    { name: 'Skills', href: '#skills', icon: FiCode },
    { name: 'Projects', href: '#projects', icon: FiFolder },
    { name: 'Experience', href: '#experience', icon: FiBriefcase },
    { name: 'Contact', href: '#contact', icon: FiMail }
  ]

  const resources = [
    { name: 'Blog', href: '#', icon: FiBookOpen },
    { name: 'Free Resources', href: '#', icon: FiGift },
    { name: 'GitHub', href: '#', icon: FiGithub }
  ]

  const legal = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Use', href: '#' },
    { name: 'Cookie Policy', href: '#' }
  ]

  const socialLinks = [
    { icon: FiGithub, href: '#', name: 'GitHub' },
    { icon: FiLinkedin, href: '#', name: 'LinkedIn' },
    { icon: FiTwitter, href: '#', name: 'Twitter' },
    { icon: FiInstagram, href: '#', name: 'Instagram' }
  ]

  const perks = ['Weekly insights', 'No spam, ever', 'Unsubscribe anytime']

  return (
    <footer className="py-[clamp(60px,8vw,100px)] pb-[clamp(40px,5vw,60px)] relative overflow-hidden" style={{ background: '#0c0b09' }}>
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[-10%] w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,85,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[10%] right-[-8%] w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(46,204,154,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="container-responsive relative z-10">
        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(32px,4vw,56px)] mb-[clamp(40px,5vw,64px)]">
          {/* BRAND */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-24 h-24 mb-4">
              <div className="relative z-10 w-full h-full rounded-full overflow-hidden transition-transform duration-400 hover:scale-105">
                <img
                  src="/images/muhire-dieudonne.jpg"
                  alt="Muhire Dieudonne"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p className="text-sm font-bold" style={{ color: '#f5eed8' }}>Muhire Dieudonne</p>
            <p className="text-xs font-medium mb-2.5" style={{ color: '#d4af55' }}>Full-Stack Developer</p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(245,238,216,0.42)' }}>
              Creating immersive digital experiences with cutting-edge web technologies. Let's build something amazing together.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full border border-[rgba(255,245,220,0.07)] flex items-center justify-center text-[rgba(245,238,216,0.42)] transition-all hover:border-[rgba(212,175,85,0.35)] hover:text-[#d4af55] hover:bg-[rgba(212,175,85,0.08)]"
                >
                  <social.icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* QUICK LINKS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-4" style={{ color: '#d4af55' }}>Quick Links</p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <motion.li key={link.name} whileHover={{ x: 4 }}>
                  <a href={link.href} className="flex items-center gap-2 text-xs transition-colors hover:text-[#f5eed8]" style={{ color: 'rgba(245,238,216,0.42)' }}>
                    <link.icon size={11} style={{ color: 'rgba(245,238,216,0.18)' }} />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* RESOURCES */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-4" style={{ color: '#d4af55' }}>Resources</p>
            <ul className="space-y-2">
              {resources.map((link) => (
                <motion.li key={link.name} whileHover={{ x: 4 }}>
                  <a href={link.href} className="flex items-center gap-2 text-xs transition-colors hover:text-[#f5eed8]" style={{ color: 'rgba(245,238,216,0.42)' }}>
                    <link.icon size={11} style={{ color: 'rgba(245,238,216,0.18)' }} />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* NEWSLETTER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass-card p-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border mb-3" style={{ borderColor: 'rgba(212,175,85,0.35)', background: 'rgba(212,175,85,0.12)', color: '#d4af55' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#d4af55' }} />
                Newsletter
              </div>
              <p className="text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: '#f5eed8' }}>
                Stay in the loop ✦
              </p>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(245,238,216,0.42)' }}>
                Get weekly insights on web dev, design trends, and exclusive tutorials.
              </p>

              <form onSubmit={handleSubscribe}>
                <div className="flex flex-col gap-2.5">
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="your@email.com"
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,245,220,0.07)] rounded-xl px-4 py-3 text-sm text-[#f5eed8] outline-none transition-all focus:border-[rgba(212,175,85,0.35)] focus:shadow-[0_0_0_3px_rgba(212,175,85,0.12)]"
                    required
                    animate={inputFocused ? { scale: 1.005 } : { scale: 1 }}
                    transition={{ duration: 0.15 }}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-xl border-none font-semibold text-sm flex items-center justify-center gap-2 transition-all min-h-[48px] whitespace-nowrap ${
                      subscribed
                        ? 'bg-[#10b981] text-white shadow-[0_4px_20px_rgba(16,185,129,0.35)]'
                        : 'bg-[#d4af55] text-[#0c0b09] shadow-[0_4px_20px_rgba(212,175,85,0.35)] hover:bg-[#e0be6a] hover:shadow-[0_8px_32px_rgba(212,175,85,0.5)]'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {subscribed ? (
                        <motion.span key="done" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                          <FiCheck size={14} /> You're in!
                        </motion.span>
                      ) : (
                        <motion.span key="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                          <FiArrowRight size={13} /> Subscribe
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </form>

              <div className="flex flex-wrap gap-2 mt-3.5">
                {perks.map((perk) => (
                  <span key={perk} className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(245,238,216,0.18)' }}>
                    <FiCheck size={9} style={{ color: '#d4af55' }} /> {perk}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RULE ── */}
        <div className="rule-gold mb-[clamp(28px,4vw,40px)]" />

        {/* ── BOTTOM BAR ── */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <p className="text-[11px]" style={{ color: 'rgba(245,238,216,0.18)' }}>
            © {new Date().getFullYear()} Muhire Dieudonne. All rights reserved.
          </p>
          <div className="flex gap-5 flex-wrap">
            {legal.map((link) => (
              <a key={link.name} href={link.href} className="text-[10px] transition-colors hover:text-[#f5eed8]" style={{ color: 'rgba(245,238,216,0.18)' }}>
                {link.name}
              </a>
            ))}
          </div>
          <p className="text-[10px] flex items-center gap-1.5" style={{ color: 'rgba(245,238,216,0.18)' }}>
            Built with
            <FaReact className="text-[#61DAFB]" size={14} />
            <SiThreedotjs className="text-[#049EF4]" size={14} />
            and
            <FiHeart style={{ color: '#d4af55' }} size={11} />
          </p>
        </div>
      </div>

      {/* ── SCROLL TO TOP ── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-[100] w-[52px] h-[52px] rounded-full border border-[rgba(212,175,85,0.35)] bg-[rgba(22,20,16,0.88)] backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-2xl transition-colors hover:border-[#d4af55]"
      >
        <svg className="absolute w-11 h-11 -rotate-90">
          <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,245,220,0.07)" strokeWidth="2.5" />
          <circle cx="22" cy="22" r="20" fill="none" stroke="#d4af55" strokeWidth="2.5"
            strokeDasharray={2 * Math.PI * 20}
            strokeDashoffset={2 * Math.PI * 20 * (1 - scrollProgress / 100)}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-100 ease-linear"
          />
        </svg>
        <FiChevronUp size={18} style={{ color: '#f5eed8' }} />
      </motion.button>
    </footer>
  )
}

export default Footer

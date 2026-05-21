// src/components/Footer.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiHome, FiUser,
  FiCode, FiFolder, FiBriefcase, FiMail, FiBookOpen, FiMail as FiNewsletter,
  FiGift, FiChevronUp, FiCheck, FiHeart, FiArrowRight
} from 'react-icons/fi'
import { FaReact, FaNodeJs } from 'react-icons/fa'
import { SiThreedotjs } from 'react-icons/si'

/* ─────────────────────────────────────────────
   PREMIUM DARK THEME STYLES
───────────────────────────────────────────── */
const PREMIUM_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ft-bg: #0c0b09;
    --ft-surface: #131210;
    --ft-card: rgba(22, 20, 16, 0.95);
    --ft-border: rgba(255,245,220,0.07);
    --ft-border-hi: rgba(212,175,85,0.35);
    --ft-gold: #d4af55;
    --ft-gold-dim: rgba(212,175,85,0.18);
    --ft-cream: #f5eed8;
    --ft-muted: rgba(245,238,216,0.42);
    --ft-dim: rgba(245,238,216,0.18);
    --ft-display: 'Playfair Display', Georgia, serif;
    --ft-body: 'Instrument Sans', system-ui, sans-serif;
  }

  .ft-root *, .ft-root *::before, .ft-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .ft-root {
    font-family: var(--ft-body);
    background: var(--ft-bg);
    color: var(--ft-cream);
    -webkit-font-smoothing: antialiased;
    position: relative; overflow: hidden;
  }

  .ft-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    opacity: 1;
  }

  .ft-root ::-webkit-scrollbar { width: 3px; }
  .ft-root ::-webkit-scrollbar-track { background: transparent; }
  .ft-root ::-webkit-scrollbar-thumb { background: var(--ft-border-hi); border-radius: 4px; }

  /* ── Avatar ring glow ── */
  .ft-avatar-wrap {
    position: relative;
    width: 96px;
    height: 96px;
    margin-bottom: 16px;
  }


  .ft-avatar-inner {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
  .ft-avatar-inner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .ft-avatar-wrap:hover .ft-avatar-inner img {
    transform: scale(1.08);
  }

  /* ── Newsletter box ── */
  .ft-newsletter-card {
    background: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
    position: relative;
    overflow: visible;
  }
  .ft-newsletter-card::before,
  .ft-newsletter-card::after {
    display: none;
  }

  .ft-newsletter-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.3);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #818cf8;
    margin-bottom: 12px;
  }
  .ft-newsletter-badge span.dot {
    width: 6px; height: 6px;
    background: #6366f1;
    border-radius: 50%;
    animation: ft-pulse-dot 1.5s ease-in-out infinite;
  }
  @keyframes ft-pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.7); }
  }

  .ft-newsletter-title {
    font-size: 17px;
    font-weight: 700;
    color: #f5eed8;
    margin-bottom: 6px;
    line-height: 1.3;
  }
  html.light-mode .ft-newsletter-title { color: #0f172a; }

  .ft-newsletter-sub {
    font-size: 12px;
    line-height: 1.6;
    margin-bottom: 18px;
    color: rgba(245,238,216,0.55);
  }
  html.light-mode .ft-newsletter-sub { color: rgba(15,23,42,0.55); }

  .ft-input-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ft-email-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(99,102,241,0.3);
    border-radius: 12px;
    padding: 13px 16px;
    font-size: 13px;
    color: #f5eed8;
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    font-family: inherit;
  }
  html.light-mode .ft-email-input {
    background: rgba(255,255,255,0.8);
    color: #0f172a;
  }
  .ft-email-input::placeholder {
    color: rgba(245,238,216,0.3);
  }
  html.light-mode .ft-email-input::placeholder {
    color: rgba(15,23,42,0.35);
  }
  .ft-email-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.18), 0 0 20px rgba(99,102,241,0.12);
    background: rgba(255,255,255,0.07);
  }

  .ft-subscribe-btn {
    width: 100%;
    padding: 13px 20px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    letter-spacing: 0.03em;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s, box-shadow 0.25s;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
  }
  .ft-subscribe-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.25s;
  }
  .ft-subscribe-btn:hover { box-shadow: 0 8px 32px rgba(99,102,241,0.55); }
  .ft-subscribe-btn:hover::before { opacity: 1; }

  .ft-subscribe-btn.success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    box-shadow: 0 4px 20px rgba(16,185,129,0.35);
  }

  .ft-perks {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }
  .ft-perk {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    color: rgba(245,238,216,0.45);
  }
  html.light-mode .ft-perk { color: rgba(15,23,42,0.45); }
  .ft-perk svg { color: #6366f1; flex-shrink: 0; }
`

const lightModeStyles = `
  html.light-mode .ft-root {
    --ft-bg: #ffffff;
    --ft-surface: #f8fafc;
    --ft-card: rgba(255, 255, 255, 0.95);
    --ft-border: rgba(0, 0, 0, 0.1);
    --ft-border-hi: rgba(99, 102, 241, 0.3);
    --ft-gold: #6366f1;
    --ft-gold-dim: rgba(99, 102, 241, 0.1);
    --ft-cream: #0f172a;
    --ft-muted: rgba(15, 23, 42, 0.7);
    --ft-dim: rgba(15, 23, 42, 0.5);
  }
  html.light-mode .ft-newsletter-card {
    background: linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(168,85,247,0.05) 50%, rgba(236,72,153,0.04) 100%);
    border-color: rgba(99,102,241,0.2);
  }
  html.light-mode .ft-avatar-inner {
    /* no border */
  }
`

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [inputFocused, setInputFocused] = useState(false)

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
    const handleResize = () => {}
    const updateScrollProgress = () => {
      const winScroll = document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      setScrollProgress(height > 0 ? (winScroll / height) * 100 : 0)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', updateScrollProgress)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', updateScrollProgress)
    }
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
    { name: 'Newsletter', href: '#', icon: FiNewsletter },
    { name: 'Free Resources', href: '#', icon: FiGift },
    { name: 'GitHub', href: '#', icon: FiGithub }
  ]

  const legal = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Use', href: '#' },
    { name: 'Cookie Policy', href: '#' }
  ]

  const socialLinks = [
    { icon: FiGithub, href: '#', name: 'GitHub', color: '#ffffff' },
    { icon: FiLinkedin, href: '#', name: 'LinkedIn', color: '#0A66C2' },
    { icon: FiTwitter, href: '#', name: 'Twitter', color: '#1DA1F2' },
    { icon: FiInstagram, href: '#', name: 'Instagram', color: '#E4405F' }
  ]

  const perks = [
    'Weekly tutorials',
    'No spam, ever',
    'Unsubscribe anytime'
  ]

  return (
    <footer className="ft-root relative border-t border-primary/20 pt-16 pb-8 overflow-hidden">
      <style>{PREMIUM_STYLES}{lightModeStyles}</style>

      {/* Animated Wave Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <motion.path
            fill="#6366f1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              d: [
                "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,160L48,165.3C96,171,192,181,288,176C384,171,480,149,576,138.7C672,128,768,128,864,138.7C960,149,1056,171,1152,181.3C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
        </svg>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* ── Brand Column with BIGGER photo ── */}
          <div>
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="ft-avatar-wrap"
            >
              <div className="ft-avatar-inner">
                <img
                  src="/images/muhire-dieudonne.jpg"
                  alt="Muhire Dieudonne"
                />
              </div>
            </motion.div>

            {/* Name + title under photo */}
            <div className="mb-3">
              <p className="text-sm font-semibold" style={{ color: isDarkMode ? '#f5eed8' : '#0f172a' }}>
                Muhire Dieudonne
              </p>
              <p className="text-xs" style={{ color: 'rgba(99,102,241,0.9)' }}>
                Full-Stack Developer
              </p>
            </div>

            <p className={`text-xs mb-4 leading-relaxed ${isDarkMode ? 'text-light/60' : 'text-dark/60'}`}>
              Creating immersive digital experiences with cutting-edge web technologies. Let's build something amazing together.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors group"
                >
                  <social.icon className={`w-4 h-4 group-hover:text-primary transition-colors ${isDarkMode ? 'text-light/70' : 'text-dark/70'}`} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <motion.li key={link.name} whileHover={{ x: 5 }}>
                  <a
                    href={link.href}
                    className={`flex items-center gap-2 text-sm hover:text-primary transition-colors group ${isDarkMode ? 'text-light/60' : 'text-dark/60'}`}
                  >
                    <link.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span>{link.name}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* ── Resources ── */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">Resources</h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <motion.li key={link.name} whileHover={{ x: 5 }}>
                  <a
                    href={link.href}
                    className={`flex items-center gap-2 text-sm hover:text-primary transition-colors group ${isDarkMode ? 'text-light/60' : 'text-dark/60'}`}
                  >
                    <link.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span>{link.name}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* ── Newsletter Card (redesigned) ── */}
          <div>
            <motion.div
              className="ft-newsletter-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <div className="ft-newsletter-badge">
                <span className="dot" />
                Newsletter
              </div>

              <p className="ft-newsletter-title">Stay in the loop ✦</p>
              <p className="ft-newsletter-sub">
                Get weekly insights on web dev, design trends, and exclusive tutorials straight to your inbox.
              </p>

              <form onSubmit={handleSubscribe}>
                <div className="ft-input-wrap">
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="your@email.com"
                    className="ft-email-input"
                    required
                    animate={inputFocused ? { scale: 1.01 } : { scale: 1 }}
                    transition={{ duration: 0.15 }}
                  />

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`ft-subscribe-btn ${subscribed ? 'success' : ''}`}
                  >
                    <AnimatePresence mode="wait">
                      {subscribed ? (
                        <motion.span
                          key="done"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                        >
                          <FiCheck size={14} />
                          You're in!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="sub"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                        >
                          <FiArrowRight size={13} />
                          Subscribe — it's free
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </form>

              {/* Perks row */}
              <div className="ft-perks">
                {perks.map((perk) => (
                  <span key={perk} className="ft-perk">
                    <FiCheck size={10} />
                    {perk}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 border-t border-primary/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className={`text-xs ${isDarkMode ? 'text-light/60' : 'text-dark/60'}`}>
            © {new Date().getFullYear()} Muhire Dieudonne. All rights reserved.
          </p>

          <div className="flex gap-6">
            {legal.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-xs hover:text-primary transition-colors ${isDarkMode ? 'text-light/60' : 'text-dark/60'}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <p className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-light/60' : 'text-dark/60'}`}>
            Built with
            <FaReact className="w-4 h-4 text-[#61DAFB]" />
            <SiThreedotjs className="w-4 h-4 text-[#049EF4]" />
            and
            <FiHeart className="w-3 h-3 text-primary animate-pulse" />
          </p>
        </div>
      </div>

      {/* ── Scroll Progress Circle Button ── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 w-14 h-14 backdrop-blur-sm rounded-full border-2 border-primary/30 flex items-center justify-center z-50 group hover:border-primary/60 transition-all ${isDarkMode ? 'bg-dark/80' : 'bg-white/80'}`}
      >
        <svg className="absolute w-12 h-12 -rotate-90">
          <circle cx="28" cy="28" r="24" fill="none" stroke="#1e293b" strokeWidth="4" />
          <circle
            cx="28" cy="28" r="24"
            fill="none"
            stroke="#6366f1"
            strokeWidth="4"
            strokeDasharray={2 * Math.PI * 24}
            strokeDashoffset={2 * Math.PI * 24 * (1 - scrollProgress / 100)}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <FiChevronUp className={`w-5 h-5 group-hover:text-primary transition-colors ${isDarkMode ? 'text-light' : 'text-dark'}`} />
      </motion.button>
    </footer>
  )
}

export default Footer
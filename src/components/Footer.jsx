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

  .ft-newsletter-card {
    border: 1px solid var(--ft-border);
    background: var(--ft-card);
    border-radius: 16px;
    padding: 24px 24px 26px;
    transition: border-color 0.3s, box-shadow 0.3s;
    position: relative; overflow: hidden;
  }
  .ft-newsletter-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--ft-gold-dim), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .ft-newsletter-card:hover {
    border-color: var(--ft-border-hi);
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  }
  .ft-newsletter-card:hover::before { opacity: 1; }

  .ft-newsletter-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ft-gold);
    background: var(--ft-gold-dim);
    border: 1px solid var(--ft-border-hi);
    margin-bottom: 12px;
  }
  .ft-newsletter-badge span.dot {
    width: 6px; height: 6px;
    background: var(--ft-gold);
    border-radius: 50%;
    animation: ft-pulse-dot 1.6s ease-in-out infinite;
  }
  @keyframes ft-pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  .ft-newsletter-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--ft-cream);
    margin-bottom: 4px;
    line-height: 1.3;
    font-family: var(--ft-display);
  }

  .ft-newsletter-sub {
    font-size: 12px;
    line-height: 1.7;
    margin-bottom: 18px;
    color: var(--ft-muted);
  }

  .ft-input-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ft-email-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--ft-border);
    border-radius: 12px;
    padding: 13px 16px;
    font-size: 13px;
    color: var(--ft-cream);
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    font-family: inherit;
  }
  .ft-email-input::placeholder {
    color: var(--ft-dim);
  }
  .ft-email-input:focus {
    border-color: var(--ft-border-hi);
    box-shadow: 0 0 0 3px rgba(212,175,85,0.12);
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
    background: var(--ft-gold);
    color: #0c0b09;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s, box-shadow 0.25s, background 0.2s;
    box-shadow: 0 4px 20px rgba(212,175,85,0.35);
  }
  .ft-subscribe-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(212,175,85,0.5);
    background: #e0be6a;
  }

  .ft-subscribe-btn.success {
    background: #10b981;
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
    color: var(--ft-dim);
  }
  .ft-perk svg { color: var(--ft-gold); flex-shrink: 0; }

  .ft-rule {
    height: 1px;
    background: linear-gradient(90deg, var(--ft-gold) 0%, rgba(212,175,85,0.15) 60%, transparent 100%);
  }
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
    <footer className="ft-root py-[clamp(60px,8vw,100px)] pb-[clamp(40px,5vw,60px)]">
      <style>{PREMIUM_STYLES}{lightModeStyles}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[-10%] w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,85,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[10%] right-[-8%] w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(46,204,154,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="container-responsive relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(32px,4vw,56px)] mb-[clamp(40px,5vw,64px)]">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="ft-avatar-wrap">
              <div className="ft-avatar-inner">
                <img src="/images/muhire-dieudonne.jpg" alt="Muhire Dieudonne" />
              </div>
            </div>
            <p className="text-sm font-bold" style={{ color: 'var(--ft-cream)' }}>Muhire Dieudonne</p>
            <p className="text-xs font-medium mb-2.5" style={{ color: 'var(--ft-gold)' }}>Full-Stack Developer</p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--ft-muted)' }}>
              Creating immersive digital experiences with cutting-edge web technologies. Let's build something amazing together.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full border border-[var(--ft-border)] flex items-center justify-center transition-all hover:border-[var(--ft-gold)] hover:text-[var(--ft-gold)] hover:bg-[var(--ft-gold-dim)]"
                  style={{ color: 'var(--ft-muted)' }}
                >
                  <social.icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-4" style={{ color: 'var(--ft-gold)' }}>Quick Links</p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <motion.li key={link.name} whileHover={{ x: 4 }}>
                  <a href={link.href} className="flex items-center gap-2 text-xs transition-colors hover:text-[var(--ft-cream)]" style={{ color: 'var(--ft-muted)' }}>
                    <link.icon size={11} style={{ color: 'var(--ft-dim)' }} />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-4" style={{ color: 'var(--ft-gold)' }}>Resources</p>
            <ul className="space-y-2">
              {resources.map((link) => (
                <motion.li key={link.name} whileHover={{ x: 4 }}>
                  <a href={link.href} className="flex items-center gap-2 text-xs transition-colors hover:text-[var(--ft-cream)]" style={{ color: 'var(--ft-muted)' }}>
                    <link.icon size={11} style={{ color: 'var(--ft-dim)' }} />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="ft-newsletter-card">
              <div className="ft-newsletter-badge">
                <span className="dot" />
                Newsletter
              </div>
              <p className="ft-newsletter-title">Stay in the loop ✦</p>
              <p className="ft-newsletter-sub">
                Get weekly insights on web dev, design trends, and exclusive tutorials.
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
                    animate={inputFocused ? { scale: 1.005 } : { scale: 1 }}
                    transition={{ duration: 0.15 }}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`ft-subscribe-btn ${subscribed ? 'success' : ''}`}
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

              <div className="ft-perks">
                {perks.map((perk) => (
                  <span key={perk} className="ft-perk">
                    <FiCheck size={9} /> {perk}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Rule */}
        <div className="ft-rule mb-[clamp(28px,4vw,40px)]" />

        {/* Bottom Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <p className="text-[11px]" style={{ color: 'var(--ft-dim)' }}>
            © {new Date().getFullYear()} Muhire Dieudonne. All rights reserved.
          </p>
          <div className="flex gap-5">
            {legal.map((link) => (
              <a key={link.name} href={link.href} className="text-[10px] transition-colors hover:text-[var(--ft-cream)]" style={{ color: 'var(--ft-dim)' }}>
                {link.name}
              </a>
            ))}
          </div>
          <p className="text-[10px] flex items-center gap-1.5" style={{ color: 'var(--ft-dim)' }}>
            Built with
            <FaReact className="text-[#61DAFB]" size={14} />
            <SiThreedotjs className="text-[#049EF4]" size={14} />
            and
            <FiHeart className="text-[var(--ft-gold)]" size={11} />
          </p>
        </div>
      </div>

      {/* Scroll to Top */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-[100] w-[52px] h-[52px] rounded-full border-[var(--ft-border-hi)] backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-2xl transition-colors"
        style={{
          border: '1px solid var(--ft-border-hi)',
          background: 'var(--ft-card)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--ft-gold)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--ft-border-hi)'}
      >
        <svg className="absolute w-11 h-11 -rotate-90">
          <circle cx="22" cy="22" r="20" fill="none" stroke="var(--ft-border)" strokeWidth="2.5" />
          <circle cx="22" cy="22" r="20" fill="none" stroke="var(--ft-gold)" strokeWidth="2.5"
            strokeDasharray={2 * Math.PI * 20}
            strokeDashoffset={2 * Math.PI * 20 * (1 - scrollProgress / 100)}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-100 ease-linear"
          />
        </svg>
        <FiChevronUp size={18} style={{ color: 'var(--ft-cream)' }} />
      </motion.button>
    </footer>
  )
}

export default Footer

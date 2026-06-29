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

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --footer-bg: #0c0b09;
    --footer-surface: #131210;
    --footer-card: rgba(22,20,16,0.95);
    --footer-border: rgba(255,245,220,0.07);
    --footer-border-hi: rgba(212,175,85,0.35);
    --footer-gold: #d4af55;
    --footer-gold-dim: rgba(212,175,85,0.18);
    --footer-cream: #f5eed8;
    --footer-muted: rgba(245,238,216,0.5);
    --footer-dim: rgba(245,238,216,0.2);
    --footer-display: 'Playfair Display', serif;
    --footer-body: 'Instrument Sans', sans-serif;
  }

  .footer-root *, .footer-root *::before, .footer-root *::after {
    box-sizing: border-box;
  }

  .footer-root {
    position: relative;
    overflow: hidden;
    background: var(--footer-bg);
    color: var(--footer-cream);
    font-family: var(--footer-body);
    padding: clamp(80px, 10vw, 120px) 0 clamp(40px, 5vw, 60px);
    padding-bottom: max(clamp(40px, 5vw, 60px), calc(env(safe-area-inset-bottom) + 32px));
  }

  .footer-root::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.5;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 clamp(20px, 5vw, 60px);
    position: relative;
    z-index: 1;
  }

  .footer-avatar {
    position: relative;
    width: clamp(72px, 18vw, 96px);
    height: clamp(72px, 18vw, 96px);
    margin-bottom: 16px;
  }
  .footer-avatar-inner {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
  .footer-avatar-inner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .footer-avatar:hover .footer-avatar-inner img {
    transform: scale(1.08);
  }

  .footer-card {
    border: 1px solid var(--footer-border);
    background: var(--footer-card);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: clamp(20px, 4vw, 24px) clamp(20px, 4vw, 24px) clamp(22px, 4vw, 26px);
    transition: border-color 0.3s, box-shadow 0.3s;
    position: relative;
    overflow: hidden;
  }
  .footer-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--footer-gold-dim), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .footer-card:hover {
    border-color: var(--footer-border-hi);
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  }
  .footer-card:hover::before { opacity: 1; }

  .footer-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--footer-border);
    border-radius: 14px;
    padding: 13px 16px;
    font-size: 13px;
    color: var(--footer-cream);
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    font-family: var(--footer-body);
  }
  .footer-input::placeholder {
    color: var(--footer-dim);
  }
  .footer-input:focus {
    border-color: var(--footer-border-hi);
    box-shadow: 0 0 0 3px rgba(212,175,85,0.12);
    background: rgba(255,255,255,0.07);
  }

  .footer-btn-primary {
    width: 100%;
    padding: 13px 20px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    font-family: var(--footer-body);
    letter-spacing: 0.03em;
    background: var(--footer-gold);
    color: #0c0b09;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s, box-shadow 0.25s, background 0.2s;
    box-shadow: 0 4px 20px rgba(212,175,85,0.35);
    min-height: 48px;
    white-space: nowrap;
    touch-action: manipulation;
  }
  .footer-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(212,175,85,0.5);
    background: #e0be6a;
  }
  .footer-btn-primary:active {
    transform: translateY(0) scale(0.98);
  }

  .footer-btn-success {
    background: #10b981;
    box-shadow: 0 4px 20px rgba(16,185,129,0.35);
  }

  .footer-rule {
    height: 1px;
    background: linear-gradient(90deg, var(--footer-gold) 0%, rgba(212,175,85,0.15) 60%, transparent 100%);
  }

  .footer-glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
    mix-blend-mode: screen;
  }

  .footer-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--footer-gold);
    background: var(--footer-gold-dim);
    border: 1px solid var(--footer-border-hi);
    margin-bottom: 12px;
  }
  .footer-badge span.dot {
    width: 6px; height: 6px;
    background: var(--footer-gold);
    border-radius: 50%;
    animation: footer-pulse-dot 1.6s ease-in-out infinite;
  }
  @keyframes footer-pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  .footer-perk {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    color: var(--footer-dim);
  }
  .footer-perk svg { color: var(--footer-gold); flex-shrink: 0; }

  .footer-social-link {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid var(--footer-border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--footer-muted);
    transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.15s;
    background: transparent;
    touch-action: manipulation;
  }
  .footer-social-link:hover,
  .footer-social-link:focus-visible {
    border-color: var(--footer-gold);
    color: var(--footer-gold);
    background: var(--footer-gold-dim);
  }
  .footer-social-link:active { transform: scale(0.92); }

  .footer-quicklink {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--footer-muted);
    text-decoration: none;
    transition: color 0.2s;
  }
  .footer-quicklink:hover { color: var(--footer-cream); }

  .footer-bottom-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  /* ── Scroll-to-top: bottom-left + safe-area aware so it never collides
     with a bottom-right chat / assistant FAB on the same page ── */
  .footer-scrolltop {
    position: fixed;
    left: max(20px, env(safe-area-inset-left));
    bottom: max(20px, env(safe-area-inset-bottom));
    z-index: 100;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 1px solid var(--footer-border-hi);
    background: var(--footer-card);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    transition: border-color 0.2s, transform 0.15s;
    touch-action: manipulation;
  }
  .footer-scrolltop:hover { border-color: var(--footer-gold); }
  .footer-scrolltop:active { transform: scale(0.93); }

  @media (max-width: 640px) {
    .footer-input { font-size: 16px; } /* prevents iOS Safari auto-zoom on focus */
    .footer-scrolltop {
      width: 44px;
      height: 44px;
      left: max(14px, env(safe-area-inset-left));
      bottom: max(14px, env(safe-area-inset-bottom));
    }
  }

  @media (max-width: 480px) {
    .footer-bottom-row {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 14px;
    }
  }
`

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

  const lightModeStyles = `
    html.light-mode .footer-root {
      --footer-bg: #ffffff;
      --footer-surface: #f8fafc;
      --footer-card: rgba(255, 255, 255, 0.95);
      --footer-border: rgba(0, 0, 0, 0.1);
      --footer-border-hi: rgba(99, 102, 241, 0.3);
      --footer-gold: #6366f1;
      --footer-gold-dim: rgba(99, 102, 241, 0.1);
      --footer-cream: #0f172a;
      --footer-muted: rgba(15, 23, 42, 0.5);
      --footer-dim: rgba(15, 23, 42, 0.2);
    }
    html.light-mode .footer-root::before {
      opacity: 0.1;
    }
  `

  return (
    <footer className="footer-root">
      <style>{STYLES}{lightModeStyles}</style>

      <div className="footer-glow-orb" style={{
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(212,175,85,0.06), transparent)',
        top: '5%', left: '-10%',
        zIndex: 0,
      }} />
      <div className="footer-glow-orb" style={{
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(46,204,154,0.04), transparent)',
        bottom: '10%', right: '-8%',
        zIndex: 0,
      }} />

      <div className="footer-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'clamp(32px, 4vw, 56px)',
          marginBottom: 'clamp(40px, 5vw, 64px)',
        }}>
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="footer-avatar">
              <div className="footer-avatar-inner">
                <img src="/images/muhire-dieudonne.jpg" alt="Muhire Dieudonne" />
              </div>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--footer-cream)', marginBottom: 2 }}>
              Muhire Dieudonne
            </p>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--footer-gold)', marginBottom: 10 }}>
              Full-Stack Developer
            </p>
            <p style={{ fontSize: 12, color: 'var(--footer-muted)', lineHeight: 1.7, marginBottom: 16 }}>
              Creating immersive digital experiences with cutting-edge web technologies. Let's build something amazing together.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="footer-social-link"
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
            <p style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--footer-gold)',
              marginBottom: 16,
            }}>
              Quick Links
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickLinks.map((link) => (
                <motion.li key={link.name} whileHover={{ x: 4 }}>
                  <a href={link.href} className="footer-quicklink">
                    <link.icon size={11} style={{ color: 'var(--footer-dim)' }} />
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
            <p style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--footer-gold)',
              marginBottom: 16,
            }}>
              Resources
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {resources.map((link) => (
                <motion.li key={link.name} whileHover={{ x: 4 }}>
                  <a href={link.href} className="footer-quicklink">
                    <link.icon size={11} style={{ color: 'var(--footer-dim)' }} />
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
            <div className="footer-card">
              <div className="footer-badge">
                <span className="dot" />
                Newsletter
              </div>
              <p style={{
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--footer-cream)',
                marginBottom: 4,
                lineHeight: 1.3,
                fontFamily: 'var(--footer-display)',
              }}>
                Stay in the loop ✦
              </p>
              <p style={{
                fontSize: 12,
                lineHeight: 1.7,
                marginBottom: 18,
                color: 'var(--footer-muted)',
              }}>
                Get weekly insights on web dev, design trends, and exclusive tutorials.
              </p>

              <form onSubmit={handleSubscribe}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="your@email.com"
                    className="footer-input"
                    required
                    animate={inputFocused ? { scale: 1.005 } : { scale: 1 }}
                    transition={{ duration: 0.15 }}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`footer-btn-primary ${subscribed ? 'footer-btn-success' : ''}`}
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
                          Subscribe
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </form>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                {perks.map((perk) => (
                  <span key={perk} className="footer-perk">
                    <FiCheck size={9} />
                    {perk}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="footer-rule" style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }} />

        <div className="footer-bottom-row">
          <p style={{ fontSize: 11, color: 'var(--footer-dim)' }}>
            © {new Date().getFullYear()} Muhire Dieudonne. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            {legal.map((link) => (
              <a
                key={link.name}
                href={link.href}
                style={{
                  fontSize: 10,
                  color: 'var(--footer-dim)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--footer-cream)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--footer-dim)'}
              >
                {link.name}
              </a>
            ))}
          </div>
          <p style={{
            fontSize: 10,
            color: 'var(--footer-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            Built with
            <FaReact style={{ color: '#61DAFB' }} size={14} />
            <SiThreedotjs style={{ color: '#049EF4' }} size={14} />
            and
            <FiHeart style={{ color: 'var(--footer-gold)' }} size={11} />
          </p>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="footer-scrolltop"
        aria-label="Scroll to top"
      >
        <svg style={{ position: 'absolute', width: 44, height: 44, transform: 'rotate(-90deg)' }}>
          <circle cx="22" cy="22" r="20" fill="none" stroke="var(--footer-border)" strokeWidth="2.5" />
          <circle
            cx="22" cy="22" r="20"
            fill="none"
            stroke="var(--footer-gold)"
            strokeWidth="2.5"
            strokeDasharray={2 * Math.PI * 20}
            strokeDashoffset={2 * Math.PI * 20 * (1 - scrollProgress / 100)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.1s ease' }}
          />
        </svg>
        <FiChevronUp size={18} style={{ color: 'var(--footer-cream)' }} />
      </motion.button>
    </footer>
  )
}

export default Footer

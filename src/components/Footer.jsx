// src/components/Footer.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FiGithub, FiLinkedin, FiInstagram, FiHome, FiUser,
  FiCode, FiFolder, FiBriefcase, FiMail, FiBookOpen, FiGift,
  FiChevronUp, FiHeart, FiArrowRight, FiAward
} from 'react-icons/fi'
import { FaReact } from 'react-icons/fa'
import { SiThreedotjs } from 'react-icons/si'
import profilePhoto from '../images/Muhire_dieudonne.JPG'

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
    --footer-dim: rgba(245,238,216,0.4);
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

  .footer-btn-primary {
    flex: 0 0 auto;
    width: auto;
    min-width: 208px;
    max-width: 100%;
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
  .footer-btn-primary span {
    flex: 0 0 auto;
  }
  .footer-btn-primary svg {
    flex: 0 0 auto;
  }
  .footer-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(212,175,85,0.5);
    background: #e0be6a;
  }
  .footer-btn-primary:active {
    transform: translateY(0) scale(0.98);
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
  .footer-social-link:focus-visible,
  .footer-quicklink:focus-visible,
  .footer-btn-primary:focus-visible,
  .footer-scrolltop:focus-visible {
    outline: 2px solid var(--footer-gold);
    outline-offset: 3px;
  }

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
  .footer-column-title {
    margin-bottom: 16px;
    color: var(--footer-gold);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .footer-cta-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
    margin-bottom: clamp(40px, 6vw, 64px);
    padding: clamp(24px, 4vw, 36px);
    border: 1px solid var(--footer-border-hi);
    border-radius: 24px;
    background: linear-gradient(115deg, rgba(212,175,85,.1), rgba(22,20,16,.72) 58%, rgba(46,204,154,.04));
    box-shadow: 0 24px 72px rgba(0,0,0,.2);
  }
  .footer-cta-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    color: var(--footer-gold);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
  }
  .footer-cta-kicker::before {
    content: '';
    width: 18px;
    height: 1px;
    background: currentColor;
  }
  .footer-cta-title {
    margin-bottom: 7px;
    color: var(--footer-cream);
    font-family: var(--footer-display);
    font-size: clamp(23px, 3vw, 34px);
    line-height: 1.15;
  }
  .footer-cta-copy {
    max-width: 560px;
    color: var(--footer-muted);
    font-size: 13px;
    line-height: 1.7;
  }
  .footer-main-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(140px, .75fr) minmax(140px, .75fr);
    gap: clamp(28px, 5vw, 64px);
    margin-bottom: clamp(40px, 5vw, 64px);
  }
  .footer-brand-column { max-width: 380px; }

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
    .footer-scrolltop {
      width: 44px;
      height: 44px;
      left: max(14px, env(safe-area-inset-left));
      bottom: max(14px, env(safe-area-inset-bottom));
    }
    .footer-main-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .footer-brand-column { grid-column: 1 / -1; max-width: none; }
    .footer-cta-banner { align-items: flex-start; }
  }

  @media (max-width: 480px) {
    .footer-bottom-row {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 14px;
    }
    .footer-container {
      padding-inline: 16px;
    }
    .footer-main-grid { grid-template-columns: 1fr; gap: 28px; }
    .footer-brand-column { grid-column: auto; }
    .footer-cta-banner { flex-direction: column; border-radius: 18px; }
    .footer-cta-banner .footer-btn-primary { width: 100%; min-width: 0; }
    .footer-avatar {
      margin-inline: auto;
    }
  }
`

const Footer = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const winScroll = document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      setScrollProgress(height > 0 ? (winScroll / height) * 100 : 0)
    }
    window.addEventListener('scroll', updateScrollProgress)
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  const quickLinks = [
    { name: 'Home', href: '/', icon: FiHome },
    { name: 'About', href: '/about', icon: FiUser },
    { name: 'Skills', href: '/skills', icon: FiCode },
    { name: 'Projects', href: '/projects', icon: FiFolder },
    { name: 'Experience', href: '/experience', icon: FiBriefcase },
    { name: 'Contact', href: '/contact', icon: FiMail }
  ]

  const resources = [
    { name: 'Education', href: '/education', icon: FiBookOpen },
    { name: 'Services', href: '/services', icon: FiGift },
    { name: 'Certificates', href: '/certificates', icon: FiAward },
    { name: 'Blog', href: '/blog', icon: FiHeart },
    { name: 'GitHub', href: 'https://github.com/MUHIRE-DIEUDONNE', icon: FiGithub }
  ]

  const legal = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Use', href: '/terms' },
    { name: 'Cookie Policy', href: '/privacy' }
  ]

  const socialLinks = [
    { icon: FiGithub, href: 'https://github.com/MUHIRE-DIEUDONNE', name: 'GitHub' },
    { icon: FiLinkedin, href: 'https://www.linkedin.com/in/muhire-dieudonne-498845419/', name: 'LinkedIn' },
    { icon: FiInstagram, href: 'https://www.instagram.com/muhiredieu7/', name: 'Instagram' }
  ]

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
      --footer-dim: rgba(15, 23, 42, 0.45);
    }
    html.light-mode .footer-root::before {
      opacity: 0.1;
    }
    html.light-mode .footer-cta-banner {
      background: linear-gradient(115deg, rgba(99,102,241,.08), rgba(255,255,255,.96) 58%, rgba(16,185,129,.04));
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
        <div className="footer-cta-banner">
          <div>
            <span className="footer-cta-kicker">Available for projects and collaboration</span>
            <h2 className="footer-cta-title">Have an idea? Let's build it well.</h2>
            <p className="footer-cta-copy">
              Share what you are working on, the problem you want to solve, and how I can help.
            </p>
          </div>
          <Link to="/contact" className="footer-btn-primary" style={{ textDecoration: 'none' }}>
            <span>Start a conversation</span> <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="footer-main-grid">
          {/* Brand */}
          <motion.div
            className="footer-brand-column"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="footer-avatar">
              <div className="footer-avatar-inner">
                <img src={profilePhoto} alt="Muhire Dieudonne" />
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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label={social.name}
                  title={social.name}
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
            <h2 className="footer-column-title">
              Quick Links
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickLinks.map((link) => (
                <motion.li key={link.name} whileHover={{ x: 4 }}>
                  <Link to={link.href} className="footer-quicklink">
                    <link.icon size={11} style={{ color: 'var(--footer-dim)' }} />
                    {link.name}
                  </Link>
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
            <h2 className="footer-column-title">
              Resources
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {resources.map((link) => (
                <motion.li key={link.name} whileHover={{ x: 4 }}>
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      className="footer-quicklink"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <link.icon size={11} style={{ color: 'var(--footer-dim)' }} />
                      {link.name}
                    </a>
                  ) : (
                    <Link to={link.href} className="footer-quicklink">
                      <link.icon size={11} style={{ color: 'var(--footer-dim)' }} />
                      {link.name}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>

        </div>

        <div className="footer-rule" style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }} />

        <div className="footer-bottom-row">
          <p style={{ fontSize: 11, color: 'var(--footer-dim)' }}>
            © {new Date().getFullYear()} Muhire Dieudonne. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            {legal.map((link) => (
              <Link
                key={link.name}
                to={link.href}
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
              </Link>
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

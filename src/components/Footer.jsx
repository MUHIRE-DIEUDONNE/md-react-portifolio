// src/components/Footer.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiHome, FiUser, 
  FiCode, FiFolder, FiBriefcase, FiMail, FiBookOpen, FiMail as FiNewsletter,
  FiGift, FiChevronUp, FiCheck, FiHeart, FiArrowRight
} from 'react-icons/fi'
import { FaReact, FaNodeJs, FaCss3Alt } from 'react-icons/fa'
import { SiThreedotjs } from 'react-icons/si'

const Footer = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [isMobile, setIsMobile] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
    }

    const updateScrollProgress = () => {
      const winScroll = document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      setScrollProgress((winScroll / height) * 100)
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
      setTimeout(() => setSubscribed(false), 3000)
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

  return (
    <footer className="relative bg-gradient-to-b from-dark to-dark/95 border-t border-primary/20 pt-16 pb-8 overflow-hidden">
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
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            x: [0, -10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30">
                <motion.img
                  src="/src/images/muhire dieudonne.JPG"
                  alt="Muhire Dieudonne"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
            <p className="text-sm text-light/60 mb-4 leading-relaxed">
              Creating immersive digital experiences with cutting-edge web technologies. Let's build something amazing together.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors group"
                  style={{ '--hover-color': social.color }}
                >
                  <social.icon className="w-5 h-5 text-light/70 group-hover:text-primary transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <motion.li key={link.name} whileHover={{ x: 5 }}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-light/60 hover:text-primary transition-colors group"
                  >
                    <link.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span>{link.name}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">Resources</h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <motion.li key={link.name} whileHover={{ x: 5 }}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-light/60 hover:text-primary transition-colors group"
                  >
                    <link.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span>{link.name}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">Stay Updated</h4>
            <p className="text-xs text-light/60 mb-3">
              Subscribe to my newsletter for the latest updates, tutorials, and insights.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-4 py-3 bg-dark border border-primary/30 rounded-lg text-sm focus:outline-none focus:border-primary pr-24 text-light"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-1 top-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-xs rounded-lg hover:shadow-lg transition-all flex items-center gap-1"
              >
                {subscribed ? <FiCheck className="w-3 h-3" /> : <FiArrowRight className="w-3 h-3" />}
                <span>{subscribed ? 'Sent!' : 'Subscribe'}</span>
              </motion.button>
            </form>
            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-500 text-xs mt-2 flex items-center gap-1"
              >
                <FiCheck className="w-4 h-4" />
                Thanks for subscribing!
              </motion.p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-light/60">
            © {new Date().getFullYear()} Muhire Dieudonne. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            {legal.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs text-light/60 hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <p className="text-xs text-light/60 flex items-center gap-1">
            Built with
            <FaReact className="w-4 h-4 text-[#61DAFB]" />
            <SiThreedotjs className="w-4 h-4 text-[#049EF4]" />
            and
            <FiHeart className="w-3 h-3 text-primary animate-pulse" />
          </p>
        </div>
      </div>

      {/* Scroll Progress Circle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-14 h-14 bg-dark/80 backdrop-blur-sm rounded-full border-2 border-primary/30 flex items-center justify-center z-50 group hover:border-primary/60 transition-all"
      >
        <svg className="absolute w-12 h-12 -rotate-90">
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            stroke="#1e293b"
            strokeWidth="4"
          />
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            stroke="#6366f1"
            strokeWidth="4"
            strokeDasharray={2 * Math.PI * 24}
            strokeDashoffset={2 * Math.PI * 24 * (1 - scrollProgress / 100)}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <FiChevronUp className="w-5 h-5 text-light group-hover:text-primary transition-colors" />
      </motion.button>
    </footer>
  )
}

export default Footer;
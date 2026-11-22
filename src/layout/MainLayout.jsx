import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Experience from '../components/Experience'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import AdditionalPage, { TechnicalSkillsPage } from '../components/AdditionalPages'
import { ProjectDetailPage, ArticleDetailPage } from '../components/DetailPages'
import {
  ProfessionalHome,
  ProfessionalAbout,
  ProfessionalSkills,
  ProfessionalServices,
  ProfessionalExperience,
  ProfessionalEducation,
} from '../components/ProfessionalPages'

const Page = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
  >
    {children}
  </motion.div>
)

const MainLayout = ({ playClick, playHover, soundEnabled, setSoundEnabled }) => {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const titles = {
      '/': 'Muhire Dieudonne | Full Stack Developer',
      '/about': 'About Muhire Dieudonne',
      '/skills': 'Skills | Muhire Dieudonne',
      '/projects': 'Projects | Muhire Dieudonne',
      '/services': 'Development Services',
      '/experience': 'Experience | Muhire Dieudonne',
      '/education': 'Education | Muhire Dieudonne',
      '/certificates': 'Certificates | Muhire Dieudonne',
      '/blog': 'Developer Blog | Muhire Dieudonne',
      '/testimonials': 'Testimonials | Muhire Dieudonne',
      '/contact': 'Contact Muhire Dieudonne',
      '/privacy': 'Privacy Policy',
      '/terms': 'Terms of Use',
    }
    document.title = titles[location.pathname] || 'Muhire Dieudonne | Full Stack Developer'
  }, [location.pathname])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-dark flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-light/60">Loading amazing experience...</p>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative" // ensure cursor is above content
      >
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Page><ProfessionalHome /></Page>} />
            <Route path="/about" element={<Page><ProfessionalAbout /></Page>} />
            <Route path="/skills" element={<Page><ProfessionalSkills /></Page>} />
            <Route path="/projects" element={<Page><Projects /></Page>} />
            <Route path="/experience" element={<Page><ProfessionalExperience /></Page>} />
            <Route path="/education" element={<Page><ProfessionalEducation /></Page>} />
            <Route path="/services" element={<Page><ProfessionalServices /></Page>} />
            <Route path="/testimonials" element={<Page><AdditionalPage page="testimonials" /></Page>} />
            <Route path="/certificates" element={<Page><AdditionalPage page="certificates" /></Page>} />
            <Route path="/blog" element={<Page><AdditionalPage page="blog" /></Page>} />
            <Route path="/blog/:articleId" element={<Page><ArticleDetailPage /></Page>} />
            <Route path="/projects/:projectId" element={<Page><ProjectDetailPage /></Page>} />
            <Route path="/privacy" element={<Page><AdditionalPage page="privacy" /></Page>} />
            <Route path="/terms" element={<Page><AdditionalPage page="terms" /></Page>} />
            <Route path="/contact" element={<Page><Contact /></Page>} />
            <Route path="*" element={<Page><Hero /></Page>} />
          </Routes>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  )
}

export default MainLayout

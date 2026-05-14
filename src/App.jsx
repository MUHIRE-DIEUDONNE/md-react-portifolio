// src/App.jsx
import React, { useState, useEffect } from 'react'
import MainLayout from './layout/MainLayout'
import VoiceAssistant from './components/VoiceAssistant'
import LoadingScreen from './components/LoadingScreen'
import { motion, AnimatePresence } from 'framer-motion'
import { useSound } from './hooks/useSound'

function App() {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { playClick, playHover } = useSound(soundEnabled)

  // Simulate app loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3500) // Total loading time matches LoadingScreen duration

    return () => clearTimeout(timer)
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <>
      <LoadingScreen isLoading={isLoading} onLoadingComplete={handleLoadingComplete} />
      
      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MainLayout
              playClick={playClick}
              playHover={playHover}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
            />
            
            {/* AI Voice Assistant */}
            <VoiceAssistant />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
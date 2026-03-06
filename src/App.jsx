// src/App.jsx
import React, { useState } from 'react'
import MainLayout from './layout/MainLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { useSound } from './hooks/useSound'

function App() {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const { playClick, playHover } = useSound(soundEnabled)

  return (
    <AnimatePresence mode="wait">
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
      </motion.div>
    </AnimatePresence>
  )
}

export default App
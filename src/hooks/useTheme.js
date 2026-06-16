// src/hooks/useTheme.js
import { useState, useEffect } from 'react'

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const checkTheme = () => {
      const html = document.documentElement
      setIsDarkMode(!html.classList.contains('light-mode'))
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    })
    return () => observer.disconnect()
  }, [])

  return isDarkMode
}

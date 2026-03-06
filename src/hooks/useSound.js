// src/hooks/useSound.js
import { useRef, useCallback, useEffect } from 'react'

export const useSound = (enabled = false) => {
  const clickSound = useRef(null)
  const hoverSound = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      clickSound.current = new Audio('/sounds/click.mp3')
      hoverSound.current = new Audio('/sounds/hover.mp3')
      if (clickSound.current) clickSound.current.volume = 0.3
      if (hoverSound.current) hoverSound.current.volume = 0.2
    }

    // Cleanup
    return () => {
      if (clickSound.current) {
        clickSound.current.pause()
        clickSound.current = null
      }
      if (hoverSound.current) {
        hoverSound.current.pause()
        hoverSound.current = null
      }
    }
  }, [])

  const playClick = useCallback(() => {
    if (enabled && clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play().catch(() => {})
    }
  }, [enabled])

  const playHover = useCallback(() => {
    if (enabled && hoverSound.current) {
      hoverSound.current.currentTime = 0
      hoverSound.current.play().catch(() => {})
    }
  }, [enabled])

  return { playClick, playHover }
}
// src/hooks/useMagneticEffect.js
import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export const useMagneticEffect = () => {
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const { left, top, width, height } = element.getBoundingClientRect()
      
      const x = (clientX - (left + width / 2)) * 0.3
      const y = (clientY - (top + height / 2)) * 0.3

      gsap.to(element, {
        x: x,
        y: y,
        duration: 0.6,
        ease: 'power3.out'
      })
    }

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)'
      })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return elementRef
}
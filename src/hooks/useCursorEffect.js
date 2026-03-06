import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export const useCursorEffect = () => {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    const onMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0,
        ease: 'power3.out'
      })
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: 'power3.out'
      })
    }

    const onMouseHover = (e) => {
      const target = e.target
      const isClickable = target.closest('button, a, [data-cursor="magnetic"]')
      if (isClickable) {
        gsap.to(cursor, {
          scale: 2,
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          duration: 0.3
        })
        gsap.to(follower, {
          scale: 3,
          borderColor: '#8b5cf6',
          duration: 0.3
        })
      } else {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          duration: 0.3
        })
        gsap.to(follower, {
          scale: 1,
          borderColor: '#6366f1',
          duration: 0.3
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseHover)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseHover)
    }
  }, [])

  return { cursorRef, followerRef }
}
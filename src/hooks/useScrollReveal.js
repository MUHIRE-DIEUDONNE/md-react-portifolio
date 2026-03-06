import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useScrollReveal = (options = {}) => {
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const defaultOptions = {
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      ...options
    }

    const animation = gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 50,
        ...options.from
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: defaultOptions,
        ...options.to
      }
    )

    return () => {
      animation.scrollTrigger?.kill()
      animation.kill()
    }
  }, [options])

  return elementRef
}
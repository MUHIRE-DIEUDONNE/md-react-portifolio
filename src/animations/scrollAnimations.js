import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const initScrollAnimations = () => {
  // Fade up animations
  gsap.utils.toArray('.fade-up').forEach((element) => {
    gsap.fromTo(
      element,
      {
        y: 100,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // Scale animations
  gsap.utils.toArray('.scale-in').forEach((element) => {
    gsap.fromTo(
      element,
      {
        scale: 0.8,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // Parallax effects
  gsap.utils.toArray('.parallax').forEach((element) => {
    gsap.to(element, {
      y: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
  })
}

export const textReveal = (element) => {
  const text = element.textContent
  element.innerHTML = ''

  text.split('').forEach((char, index) => {
    const span = document.createElement('span')
    span.textContent = char
    span.style.display = 'inline-block'
    span.style.opacity = '0'
    span.style.transform = 'translateY(20px)'
    span.style.transition = `all 0.4s ease ${index * 0.05}s`
    element.appendChild(span)
  })

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        Array.from(element.children).forEach((span) => {
          span.style.opacity = '1'
          span.style.transform = 'translateY(0)'
        })
        observer.unobserve(element)
      }
    })
  })

  observer.observe(element)
}
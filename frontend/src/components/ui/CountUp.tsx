'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  target: string
  duration?: number
  className?: string
}

function parseTarget(target: string): { prefix: string; value: number; suffix: string } {
  const match = target.match(/^([^0-9]*)([0-9]+)([^0-9]*)$/)
  if (!match) return { prefix: '', value: 0, suffix: target }
  return { prefix: match[1], value: parseInt(match[2]), suffix: match[3] }
}

export default function CountUp({ target, duration = 2000, className = '' }: CountUpProps) {
  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  const { prefix, value, suffix } = parseTarget(target)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.round(eased * value)
            setDisplay(current.toString())
            if (progress < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  )
}

import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useA11y } from '../hooks/useA11y'
import { speak, stop } from '../hooks/speech'

function extractText(el: Element | null): string {
  if (!el) return ''
  return (el.textContent || '').replace(/\s+/g, ' ').trim()
}

function isQuizMode(root: Element): boolean {
  return !!root.querySelector('.space-y-3 button') && !root.querySelector('.grid')
}

function getProfile(path: string, root: Element): string {
  if (path === '/') return 'home'
  if (path === '/aprender') return 'aprender'
  if (path.startsWith('/aprender/')) return 'licao'
  if (path === '/exercicios') return isQuizMode(root) ? 'exercicios-quiz' : 'exercicios-cat'
  if (path === '/jogar') return 'jogar'
  return 'other'
}

function getAllText(main: Element, profile: string): string[] {
  if (profile === 'jogar') return []

  const parts: string[] = []
  const seen = new Set<string>()

  function add(s: string) {
    const clean = s.replace(/\s+/g, ' ').trim()
    if (clean.length >= 2 && !seen.has(clean)) {
      seen.add(clean)
      parts.push(clean)
    }
  }

  const h1 = extractText(main.querySelector('h1'))

  if (profile === 'home') {
    if (h1) add(h1)
    const sub = main.querySelector('.text-center .text-gray-600, .text-center .text-xl')
    if (sub) {
      const st = extractText(sub)
      if (st !== h1) add(st)
    }
    main.querySelectorAll('.card a, .card').forEach((card) => {
      const h3 = card.querySelector('h3')
      if (h3) add(extractText(h3))
      const p = card.querySelector('p')
      if (p) {
        const pt = extractText(p)
        if (pt !== extractText(h3) && pt.length > 2 && !pt.includes('→')) add(pt)
      }
    })
    return parts
  }

  if (profile === 'aprender') {
    if (h1) add(h1)
    const sub = main.querySelector('.text-center .text-gray-600, .text-center .text-lg')
    if (sub) {
      const st = extractText(sub)
      if (st !== h1) add(st)
    }
    main.querySelectorAll('.card').forEach((card) => {
      const h3 = card.querySelector('h3')
      if (h3) add(extractText(h3))
      const p = card.querySelector('p.text-gray-600')
      if (p) {
        const pt = extractText(p)
        if (pt !== extractText(h3)) add(pt)
      }
    })
    return parts
  }

  if (profile === 'licao') {
    if (h1) add(h1)
    const cards = main.querySelectorAll('.card')
    cards.forEach((card) => {
      const h2 = card.querySelector('h2')
      if (h2) add(extractText(h2))
      const prose = card.querySelector('.prose, .whitespace-pre-line')
      if (prose) {
        const pt = extractText(prose)
        if (pt && pt !== extractText(h2)) add(pt)
      }
      const questionP = card.querySelector('p.text-lg, p.font-medium')
      if (questionP && !questionP.classList.contains('text-sm')) {
        add('Pergunta: ' + extractText(questionP))
      }
      const options = card.querySelectorAll('.space-y-3 button')
      if (options.length > 0) {
        options.forEach((opt, i) => {
          const label = extractText(opt).replace(/^[A-D]\.\s*/, '')
          if (label && label.length > 1) {
            add('Opção ' + String.fromCharCode(65 + i) + ': ' + label)
          }
        })
      }
      const feedback = card.querySelector('.bg-green-50, .bg-red-50')
      if (feedback) add(extractText(feedback))
    })
    return parts
  }

  if (profile === 'exercicios-cat') {
    if (h1) add(h1)
    const sub = main.querySelector('.text-center .text-gray-600')
    if (sub) {
      const st = extractText(sub)
      if (st !== h1) add(st)
    }
    main.querySelectorAll('.card h3').forEach((h3) => {
      add(extractText(h3))
    })
    return parts
  }

  if (profile === 'exercicios-quiz') {
    const catLabel = main.querySelector('.uppercase.tracking-wide')
    if (catLabel) add(extractText(catLabel))
    const questionP = main.querySelector('p.text-lg.font-medium')
    if (questionP) add('Pergunta: ' + extractText(questionP))
    const options = main.querySelectorAll('.space-y-3 button')
    options.forEach((opt, i) => {
      const label = extractText(opt).replace(/^[A-D]\.\s*/, '')
      if (label && label.length > 1) {
        add('Opção ' + String.fromCharCode(65 + i) + ': ' + label)
      }
    })
    const feedback = main.querySelector('.bg-green-50, .bg-red-50')
    if (feedback) add(extractText(feedback))
    return parts
  }

  return parts
}

function Narrator() {
  const location = useLocation()
  const { settings } = useA11y()
  const prevText = useRef('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const narrate = () => {
    if (!settings.narration) return
    const main = document.querySelector('main')
    if (!main) return

    const profile = getProfile(location.pathname, main)
    if (profile === 'jogar') return

    const texts = getAllText(main, profile)
    const unique = texts.filter((_t, i) => texts.indexOf(_t) === i)
    const combined = unique.join('. ')

    if (combined.length < 3) return
    if (combined === prevText.current) return
    prevText.current = combined

    stop()
    speak(combined, {
      enabled: settings.narration,
      character: settings.voiceCharacter,
      rate: 1,
      volume: 1,
    })
  }

  useEffect(() => {
    if (!settings.narration || location.pathname.startsWith('/jogar')) {
      stop()
      prevText.current = ''
      return
    }

    prevText.current = ''

    const main = document.querySelector('main')
    if (!main) return

    const timer = setTimeout(narrate, 800)

    const observer = new MutationObserver(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(narrate, 1200)
    })

    observer.observe(main, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [location.pathname, settings.narration, settings.voiceCharacter])

  return null
}

export default Narrator

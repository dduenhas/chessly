import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

type VoiceCharacter = 'male' | 'female' | 'robot'

export interface A11ySettings {
  highContrast: boolean
  fontSize: number
  reduceMotion: boolean
  narration: boolean
  voiceCharacter: VoiceCharacter
}

const STORAGE_KEY = 'chessly_a11y'

const defaults: A11ySettings = {
  highContrast: false,
  fontSize: 1,
  reduceMotion: false,
  narration: false,
  voiceCharacter: 'female',
}

function load(): A11ySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaults, ...JSON.parse(raw) }
  } catch {}
  return defaults
}

interface A11yContextValue {
  settings: A11ySettings
  toggleHighContrast: () => void
  setFontSize: (scale: number) => void
  toggleReduceMotion: () => void
  toggleNarration: () => void
  setVoiceCharacter: (c: VoiceCharacter) => void
  resetProgress: () => void
}

const A11yContext = createContext<A11yContextValue | null>(null)

export function A11yProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<A11ySettings>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    const root = document.documentElement
    if (settings.highContrast) {
      root.classList.add('a11y-high-contrast')
    } else {
      root.classList.remove('a11y-high-contrast')
    }
  }, [settings.highContrast])

  useEffect(() => {
    const root = document.documentElement
    if (settings.reduceMotion) {
      root.classList.add('a11y-reduce-motion')
    } else {
      root.classList.remove('a11y-reduce-motion')
    }
  }, [settings.reduceMotion])

  useEffect(() => {
    document.documentElement.style.setProperty('--a11y-font-scale', String(settings.fontSize))
  }, [settings.fontSize])

  const toggleHighContrast = useCallback(() => {
    setSettings((s) => ({ ...s, highContrast: !s.highContrast }))
  }, [])

  const setFontSize = useCallback((scale: number) => {
    setSettings((s) => ({ ...s, fontSize: scale }))
  }, [])

  const toggleReduceMotion = useCallback(() => {
    setSettings((s) => ({ ...s, reduceMotion: !s.reduceMotion }))
  }, [])

  const toggleNarration = useCallback(() => {
    setSettings((s) => ({ ...s, narration: !s.narration }))
  }, [])

  const setVoiceCharacter = useCallback((c: VoiceCharacter) => {
    setSettings((s) => ({ ...s, voiceCharacter: c }))
  }, [])

  const resetProgress = useCallback(() => {
    localStorage.removeItem('chessly_progress')
    window.location.reload()
  }, [])

  return (
    <A11yContext.Provider
      value={{
        settings,
        toggleHighContrast,
        setFontSize,
        toggleReduceMotion,
        toggleNarration,
        setVoiceCharacter,
        resetProgress,
      }}
    >
      {children}
    </A11yContext.Provider>
  )
}

export function useA11y() {
  const ctx = useContext(A11yContext)
  if (!ctx) throw new Error('useA11y must be used within A11yProvider')
  return ctx
}

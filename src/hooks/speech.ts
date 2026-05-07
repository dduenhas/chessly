type VoiceCharacter = 'male' | 'female' | 'robot'

interface SpeechOptions {
  enabled: boolean
  character: VoiceCharacter
  rate: number
  volume: number
}

let voicesLoaded: SpeechSynthesisVoice[] = []

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([])
      return
    }
    const existing = window.speechSynthesis.getVoices()
    if (existing.length > 0) {
      voicesLoaded = existing
      resolve(existing)
      return
    }
    const handler = () => {
      voicesLoaded = window.speechSynthesis.getVoices()
      window.speechSynthesis.removeEventListener('voiceschanged', handler)
      resolve(voicesLoaded)
    }
    window.speechSynthesis.addEventListener('voiceschanged', handler)
  })
}

loadVoices()

function resolveVoice(character: VoiceCharacter): SpeechSynthesisVoice | null {
  const ptVoices = voicesLoaded.filter((v) => v.lang.startsWith('pt'))

  if (character === 'male') {
    const male = ptVoices.find((v) => v.name.toLowerCase().includes('joão') || v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('ricardo') || v.name.toLowerCase().includes('felipe'))
    if (male) return male
    return ptVoices[0] || null
  }

  if (character === 'female') {
    const female = ptVoices.find((v) => v.name.toLowerCase().includes('francisca') || v.name.toLowerCase().includes('maria') || v.name.toLowerCase().includes('letícia') || v.name.toLowerCase().includes('ana') || v.name.toLowerCase().includes('heloísa'))
    if (female) return female
    if (ptVoices.length > 1) return ptVoices[1]
    return ptVoices[0] || null
  }

  return null
}

function speak(text: string, opts: SpeechOptions) {
  if (!opts.enabled) return
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'pt-BR'
  utterance.rate = opts.rate
  utterance.volume = opts.volume

  if (opts.character === 'male') {
    utterance.pitch = 0.8
    const voice = resolveVoice('male')
    if (voice) utterance.voice = voice
  } else if (opts.character === 'female') {
    utterance.pitch = 1.3
    const voice = resolveVoice('female')
    if (voice) utterance.voice = voice
  } else {
    utterance.pitch = 0.45
    utterance.rate = 0.85
  }

  window.speechSynthesis.speak(utterance)
}

function stop() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export { speak, stop }
export type { VoiceCharacter, SpeechOptions }

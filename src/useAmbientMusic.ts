import { useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'

type MusicState = 'idle' | 'loading' | 'playing' | 'muted'

type WebMusic = {
  context: AudioContext
  gain: GainNode
  timers: number[]
  startedAt: number
}

const notes = [261.63, 329.63, 392, 493.88, 440, 392, 329.63, 293.66]

export function useAmbientMusic(src: string) {
  const soundRef = useRef<Howl | null>(null)
  const webMusicRef = useRef<WebMusic | null>(null)
  const [state, setState] = useState<MusicState>('idle')
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    return () => {
      soundRef.current?.unload()
      soundRef.current = null
      const music = webMusicRef.current
      if (!music) {
        return
      }

      for (const timer of music.timers) {
        window.clearTimeout(timer)
      }

      music.gain.gain.cancelScheduledValues(music.context.currentTime)
      music.gain.gain.setTargetAtTime(0, music.context.currentTime, 0.5)
      window.setTimeout(() => {
        void music.context.close()
      }, 900)
      webMusicRef.current = null
    }
  }, [])

  const scheduleTone = (music: WebMusic, frequency: number, start: number, duration: number) => {
    const oscillator = music.context.createOscillator()
    const noteGain = music.context.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, start)
    noteGain.gain.setValueAtTime(0.0001, start)
    noteGain.gain.exponentialRampToValueAtTime(0.13, start + 0.08)
    noteGain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(noteGain)
    noteGain.connect(music.gain)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.08)
  }

  const startWebMusic = () => {
    if (webMusicRef.current) {
      webMusicRef.current.gain.gain.setTargetAtTime(0.22, webMusicRef.current.context.currentTime, 0.8)
      setState('playing')
      setIsFallback(true)
      return
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    const context = new AudioContextClass()
    const gain = context.createGain()
    const music: WebMusic = {
      context,
      gain,
      timers: [],
      startedAt: context.currentTime,
    }

    gain.gain.setValueAtTime(0.0001, context.currentTime)
    gain.gain.setTargetAtTime(0.22, context.currentTime, 1.1)
    gain.connect(context.destination)

    const scheduleLoop = () => {
      const base = context.currentTime + 0.05
      notes.forEach((note, index) => {
        const start = base + index * 0.72
        scheduleTone(music, note, start, 0.62)
        scheduleTone(music, note / 2, start + 0.03, 0.82)
      })

      const timer = window.setTimeout(scheduleLoop, notes.length * 720)
      music.timers.push(timer)
    }

    scheduleLoop()
    webMusicRef.current = music
    setIsFallback(true)
    setState('playing')
  }

  const play = () => {
    if (isFallback) {
      startWebMusic()
      return
    }

    if (!soundRef.current) {
      setState('loading')
      soundRef.current = new Howl({
        src: [src],
        loop: true,
        volume: 0,
        html5: true,
        onload: () => {
          setIsFallback(false)
          setState('playing')
        },
        onloaderror: () => {
          soundRef.current?.unload()
          soundRef.current = null
          startWebMusic()
        },
        onplayerror: () => {
          soundRef.current?.unload()
          soundRef.current = null
          startWebMusic()
        },
      })
    }

    const sound = soundRef.current
    if (!sound.playing()) {
      sound.play()
    }
    sound.fade(sound.volume(), 0.42, 1600)
    setIsFallback(false)
    setState('playing')
  }

  const toggle = () => {
    const webMusic = webMusicRef.current
    if (webMusic) {
      if (state === 'playing') {
        webMusic.gain.gain.setTargetAtTime(0, webMusic.context.currentTime, 0.45)
        setState('muted')
        return
      }

      webMusic.gain.gain.setTargetAtTime(0.22, webMusic.context.currentTime, 0.8)
      setState('playing')
      return
    }

    const sound = soundRef.current
    if (!sound) {
      play()
      return
    }

    if (sound.playing() && state === 'playing') {
      sound.fade(sound.volume(), 0, 700)
      window.setTimeout(() => sound.pause(), 720)
      setState('muted')
      return
    }

    sound.play()
    sound.fade(sound.volume(), 0.42, 1000)
    setIsFallback(false)
    setState('playing')
  }

  return {
    state,
    play,
    toggle,
    isPlaying: state === 'playing',
    isFallback,
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

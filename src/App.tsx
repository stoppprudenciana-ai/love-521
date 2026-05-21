import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { gsap } from 'gsap'
import Lenis from 'lenis'
import { Music2, ScanLine, Volume2, VolumeX } from 'lucide-react'
import './App.css'
import { giftConfig, type LetterBlock, type MemoirPhoto } from './giftConfig'
import { PetalCanvas } from './PetalCanvas'
import { useAmbientMusic } from './useAmbientMusic'

function normalizePasscode(value: string) {
  return value.replace(/\s/g, '').toLowerCase()
}

function LetterPhoto({
  src,
  caption,
  index,
}: {
  src: string
  caption: string
  index: number
}) {
  const [failed, setFailed] = useState(false)

  return (
    <figure className="memory-photo">
      {failed ? (
        <div className="photo-fallback">
          <span>Photo {index + 1}</span>
          <small>把你的照片放到 public/photos/photo-{index + 1}.jpg</small>
        </div>
      ) : (
        <img src={src} alt={caption} onError={() => setFailed(true)} />
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function MemoirPhotoCard({ photo, index }: { photo: MemoirPhoto; index: number }) {
  const [failed, setFailed] = useState(false)

  return (
    <figure
      className={`memoir-photo memoir-photo-${index + 1} memoir-photo-${photo.tone} ${
        photo.featured ? 'is-featured' : ''
      }`}
    >
      <div className="memoir-image-frame">
        {failed ? (
          <div className="photo-fallback">
            <span>Memory {index + 1}</span>
            <small>照片暂时没有加载出来</small>
          </div>
        ) : (
          <img
            src={photo.src}
            alt={photo.caption}
            width={photo.width}
            height={photo.height}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <figcaption>{photo.caption}</figcaption>
    </figure>
  )
}

function MemoirSpread({
  kicker,
  title,
  text,
  photos,
}: {
  kicker: string
  title: string
  text: string
  photos: MemoirPhoto[]
}) {
  return (
    <section className={`memoir-spread memoir-spread-${photos.length}`} aria-label={title}>
      <div className="memoir-intro">
        <p className="eyebrow">{kicker}</p>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <div className="memoir-grid">
        {photos.map((photo, index) => (
          <MemoirPhotoCard photo={photo} index={index} key={`${photo.src}-${index}`} />
        ))}
      </div>
    </section>
  )
}

function LetterBlockView({ block, index }: { block: LetterBlock; index: number }) {
  if (block.type === 'photo') {
    return <LetterPhoto src={block.src} caption={block.caption} index={index} />
  }

  if (block.type === 'memoir') {
    return (
      <MemoirSpread
        kicker={block.kicker}
        title={block.title}
        text={block.text}
        photos={block.photos}
      />
    )
  }

  if (block.type === 'quote') {
    return <blockquote>{block.text}</blockquote>
  }

  return <p>{block.text}</p>
}

function App() {
  const shouldPreviewUnlocked =
    import.meta.env.DEV && new URLSearchParams(window.location.search).has('preview')
  const [passcode, setPasscode] = useState('')
  const [gateError, setGateError] = useState('')
  const [unlocked, setUnlocked] = useState(shouldPreviewUnlocked)
  const [letterOpened, setLetterOpened] = useState(false)
  const [letterContentVisible, setLetterContentVisible] = useState(false)
  const [giftRevealed, setGiftRevealed] = useState(false)
  const appRef = useRef<HTMLDivElement | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const envelopeRef = useRef<HTMLDivElement | null>(null)
  const letterSectionRef = useRef<HTMLElement | null>(null)
  const paperRef = useRef<HTMLElement | null>(null)
  const qrRef = useRef<HTMLDivElement | null>(null)
  const { state: musicState, play, toggle, isPlaying, isFallback } = useAmbientMusic(
    giftConfig.music.src,
  )

  const isCorrect = useMemo(
    () => normalizePasscode(passcode) === normalizePasscode(giftConfig.passcode),
    [passcode],
  )

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!unlocked) {
      return
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        '.arrival-copy > *, .envelope-stage',
        { y: 24, opacity: 0.01 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.16, ease: 'power3.out' },
      )
    })

    return () => context.revert()
  }, [unlocked])

  useEffect(() => {
    if (!letterOpened || !envelopeRef.current) {
      return
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline
        .to('.envelope-flap', {
          rotateX: 178,
          y: -8,
          duration: 1.05,
          transformOrigin: '50% 0%',
          ease: 'power4.inOut',
        })
        .to(
          '.envelope-pocket',
          {
            y: 24,
            rotateX: -7,
            duration: 0.9,
          },
          '-=0.72',
        )
        .to(
          '.envelope-letter-preview',
          {
            y: -34,
            scale: 1.02,
            duration: 0.9,
          },
          '-=0.82',
        )
        .to(
          '.envelope-stage',
          {
            y: -18,
            scale: 0.97,
            duration: 0.82,
          },
          '-=0.42',
        )
    }, envelopeRef)

    const revealTimer = window.setTimeout(() => {
      setLetterContentVisible(true)
    }, 920)

    return () => {
      window.clearTimeout(revealTimer)
      context.revert()
    }
  }, [letterOpened])

  useEffect(() => {
    if (!letterContentVisible || !paperRef.current || !letterSectionRef.current) {
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const section = letterSectionRef.current
    const paper = paperRef.current

    const scrollTimer = window.setTimeout(() => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(section, {
          offset: -18,
          duration: reducedMotion ? 0.01 : 1.35,
        })
        return
      }

      section.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    }, reducedMotion ? 0 : 240)

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline
        .fromTo(
          section,
          { y: 70, opacity: 0, filter: 'blur(10px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.05 },
        )
        .fromTo(
          paper,
          { y: 54, scale: 0.965, opacity: 0.01 },
          { y: 0, scale: 1, opacity: 1, duration: 1.05 },
          '-=0.76',
        )
        .fromTo(
          '.letter-sheet .letter-block',
          { y: 22, opacity: 0.01 },
          { y: 0, opacity: 1, duration: 0.78, stagger: 0.09 },
          '-=0.18',
        )
        .to(
          '.scroll-cue',
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          '-=0.2',
        )
    }, appRef)

    return () => {
      window.clearTimeout(scrollTimer)
      context.revert()
    }
  }, [letterContentVisible])

  useEffect(() => {
    if (!giftRevealed || !qrRef.current) {
      return
    }

    gsap.fromTo(
      qrRef.current,
      { y: 22, scale: 0.96, opacity: 0, filter: 'blur(8px)' },
      { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
    )
  }, [giftRevealed])

  const unlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isCorrect) {
      setGateError('暗号还差一点点，再想想我怎么叫你。')
      gsap.fromTo('.passcode-input', { x: -7 }, { x: 7, duration: 0.08, repeat: 5, yoyo: true })
      return
    }

    setGateError('')
    gsap.to('.gate-screen', {
      opacity: 0,
      y: -16,
      duration: 0.54,
      ease: 'power2.inOut',
      onComplete: () => {
        setUnlocked(true)
        window.scrollTo({ top: 0 })
      },
    })
  }

  const openLetter = () => {
    if (letterOpened) {
      return
    }

    setLetterOpened(true)
    play()
  }

  const revealGift = () => {
    setGiftRevealed(true)
  }

  return (
    <div className={`app-shell ${unlocked ? 'is-unlocked' : 'is-gated'}`} ref={appRef}>
      {unlocked && <PetalCanvas />}
      {unlocked && (
        <>
          <div className="grain" aria-hidden="true" />
          <div className="corner-bouquet bouquet-left" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="corner-bouquet bouquet-right" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </>
      )}

      {!unlocked ? (
        <main className="gate-screen" key="gate">
          <p className="ambient-mark">{giftConfig.date}</p>
          <section className="gate-card" aria-labelledby="gate-title">
            <div className="pressed-flower" aria-hidden="true" />
            <p className="eyebrow">Une lettre pour toi</p>
            <h1 id="gate-title">一封只给你的信</h1>
            <p className="gate-copy">
              有些话想慢慢给你看。输入那个只有你知道的称呼，信封就会打开。
            </p>
            <form className="passcode-form" onSubmit={unlock}>
              <label htmlFor="passcode">暗号</label>
              <input
                id="passcode"
                className="passcode-input"
                value={passcode}
                onChange={(event) => setPasscode(event.target.value)}
                placeholder="请输入暗号"
                autoComplete="off"
              />
              <button type="submit">打开信封</button>
              <p className="gate-hint">提示：她的专属昵称</p>
              {gateError && <p className="form-error">{gateError}</p>}
            </form>
          </section>
        </main>
      ) : (
        <main className="gift-screen" key="gift">
          <button
            className="music-button"
            type="button"
            onClick={toggle}
            aria-label={isPlaying ? '暂停音乐' : '播放音乐'}
          >
            {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>
              {musicState === 'loading'
                ? '音乐加载中'
                : isPlaying
                  ? isFallback
                    ? '柔和音乐盒'
                    : '温柔钢琴'
                  : '播放音乐'}
            </span>
          </button>

          <section className="arrival">
            <div className="arrival-copy">
              <p className="eyebrow">{giftConfig.date}</p>
              <h1>{giftConfig.recipientName}，请收信</h1>
              <p>
                这封信被放在花店傍晚的光里。点击信封，音乐会轻轻响起，然后慢慢往下读。
              </p>
            </div>

            <div className={`envelope-stage ${letterOpened ? 'is-open' : ''}`} ref={envelopeRef}>
              <button
                className="envelope"
                type="button"
                onClick={openLetter}
                disabled={letterOpened}
                aria-label="打开信封"
              >
                <span className="envelope-shadow" />
                <span className="envelope-back" />
                <span className="envelope-letter-preview">
                  <span>Pour toi</span>
                </span>
                <span className="envelope-flap" />
                <span className="envelope-pocket" />
                <span className="wax-mark">521</span>
              </button>
              <p className="open-note">{letterOpened ? '信已经打开，往下读吧' : '轻点信封'}</p>
            </div>
          </section>

          {letterContentVisible && (
            <section
              className="letter-section is-visible"
              aria-label="情书正文"
              ref={letterSectionRef}
            >
              <article className="letter-sheet" ref={paperRef}>
                <header className="letter-head">
                  <p>Le vingt-et-un mai</p>
                  <h2>写给 {giftConfig.recipientName}</h2>
                </header>

                <div className="letter-body">
                  {giftConfig.letter.map((block, index) => (
                    <div className="letter-block" key={`${block.type}-${index}`}>
                      <LetterBlockView block={block} index={index} />
                    </div>
                  ))}
                </div>

                <footer className="letter-signature">
                  <span>{giftConfig.senderName}</span>
                  <small>{giftConfig.date}</small>
                </footer>

                <section className="gift-unlock" aria-labelledby="gift-title">
                  <p className="eyebrow">最后一枚火漆</p>
                  <h2 id="gift-title">读到这里，就可以领取小彩蛋了</h2>
                  <p>点开火漆印章，二维码里藏着今天的 521 暗号。</p>
                  <button
                    className={`seal-button ${giftRevealed ? 'is-open' : ''}`}
                    type="button"
                    onClick={revealGift}
                  >
                    <span>521</span>
                  </button>

                  {giftRevealed && (
                    <div className="qr-card" ref={qrRef}>
                      <div className="qr-frame">
                        <img src="/alipay-qr.png" alt="支付宝扫码领取 521 小彩蛋" />
                      </div>
                      <div>
                        <p className="qr-title">
                          <ScanLine size={18} />
                          用支付宝扫码
                        </p>
                        <p className="qr-copy">微信扫码识别不出来，记得用支付宝扫这个二维码。</p>
                      </div>
                    </div>
                  )}
                </section>
              </article>
              <p className="scroll-cue">慢慢往下读</p>
            </section>
          )}

          {letterContentVisible && (
            <aside className="music-note" aria-live="polite">
              <Music2 size={16} />
              <span>
                {isFallback
                  ? '正在使用内置柔和音乐盒；以后有 mp3 时可以直接替换成完整配乐。'
                  : giftConfig.music.source}
              </span>
            </aside>
          )}
        </main>
      )}
    </div>
  )
}

export default App

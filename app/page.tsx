"use client";

import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { loveStory } from "./content";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type BurstHeart = {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
};

function PhotoCard({
  file,
  caption,
  index,
}: {
  file: string;
  caption: string;
  index: number;
}) {
  const [loaded, setLoaded] = useState(true);

  return (
    <figure
      className={`polaroid polaroid-${index + 1}`}
      data-reveal
      style={{ "--delay": `${index * 70}ms` } as CSSProperties}
    >
      <div className="photo-frame">
        <div className="photo-placeholder" aria-hidden="true">
          <span className="placeholder-number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="placeholder-heart">♥</span>
          <span>ваше фото</span>
        </div>
        {loaded && (
          <img
            src={`${basePath}/media/photos/${file}`}
            alt={caption}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(false)}
          />
        )}
        <span className="photo-glint" aria-hidden="true" />
      </div>
      <figcaption>
        <span>{caption}</span>
        <small>наш момент · {String(index + 1).padStart(2, "0")}</small>
      </figcaption>
    </figure>
  );
}

export default function Home() {
  const [gateOpen, setGateOpen] = useState(false);
  const [showGate, setShowGate] = useState(true);
  const [letterOpen, setLetterOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songReady, setSongReady] = useState(true);
  const [musicProgress, setMusicProgress] = useState(0);
  const [pageProgress, setPageProgress] = useState(0);
  const [toast, setToast] = useState("");
  const [burst, setBurst] = useState<BurstHeart[]>([]);
  const [kissCount, setKissCount] = useState(0);
  const [pulseLevel, setPulseLevel] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const ambientHearts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        left: `${(index * 29 + 7) % 96}%`,
        top: `${(index * 43 + 11) % 93}%`,
        size: `${10 + (index % 5) * 4}px`,
        delay: `${-(index * 1.7)}s`,
        duration: `${10 + (index % 6) * 2}s`,
      })),
    [],
  );

  useEffect(() => {
    document.body.style.overflow = showGate ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showGate]);

  useEffect(() => {
    const revealItems = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.13 },
    );

    revealItems.forEach((item) => observer.observe(item));

    const onScroll = () => {
      const height =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      setPageProgress(Math.min(100, (window.scrollY / height) * 100));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const createHeartBurst = (amount = 22) => {
    const now = Date.now();
    setBurst(
      Array.from({ length: amount }, (_, index) => ({
        id: now + index,
        x: 25 + Math.random() * 50,
        y: 40 + Math.random() * 28,
        size: 14 + Math.random() * 25,
        rotation: -55 + Math.random() * 110,
        delay: Math.random() * 0.3,
      })),
    );
    window.setTimeout(() => setBurst([]), 1900);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio || !songReady) {
      setToast(
        "Добавьте песню: public/media/music/our-song.mp3 — и она заиграет здесь ♥",
      );
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      createHeartBurst(10);
    } catch {
      setSongReady(false);
      setToast(
        "Песня пока не найдена. Положите её в public/media/music/our-song.mp3",
      );
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!mainRef.current) return;
    mainRef.current.style.setProperty("--mx", `${event.clientX}px`);
    mainRef.current.style.setProperty("--my", `${event.clientY}px`);
  };

  return (
    <main ref={mainRef} onPointerMove={onPointerMove}>
      {showGate && (
        <div
          className={`cinematic-gate ${gateOpen ? "is-opening" : ""}`}
          aria-hidden={gateOpen}
        >
          <div className="gate-aurora" aria-hidden="true" />
          <div className="gate-stars" aria-hidden="true">
            {ambientHearts.slice(0, 10).map((heart) => (
              <i
                key={heart.id}
                style={
                  {
                    "--left": heart.left,
                    "--top": heart.top,
                    "--float-delay": heart.delay,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <div className="gate-content">
            <p>PRIVATE PREMIERE · 01 / ∞</p>
            <span className="gate-monogram">N</span>
            <h2>
              Николь,
              <em>это для тебя.</em>
            </h2>
            <p className="gate-note">
              Здесь каждая деталь говорит то, что я чувствую рядом с тобой.
            </p>
            <button
              type="button"
              className="gate-button"
              onClick={() => {
                setGateOpen(true);
                createHeartBurst(45);
                window.setTimeout(() => setShowGate(false), 1050);
              }}
            >
              <span>Войти в нашу вселенную</span>
              <i aria-hidden="true">♥</i>
            </button>
          </div>
          <div className="gate-signature">создано с любовью · только для неё</div>
        </div>
      )}

      <div
        className="page-progress"
        style={{ width: `${pageProgress}%` }}
        aria-hidden="true"
      />

      <div className="noise" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />
      <div className="ambient-hearts" aria-hidden="true">
        {ambientHearts.map((heart) => (
          <span
            key={heart.id}
            style={
              {
                "--left": heart.left,
                "--top": heart.top,
                "--size": heart.size,
                "--float-delay": heart.delay,
                "--float-duration": heart.duration,
              } as CSSProperties
            }
          >
            ♥
          </span>
        ))}
      </div>

      <nav className="topbar" aria-label="Навигация по истории">
        <a className="topbar-brand" href="#top" aria-label="В начало">
          <span>N</span>
          <small>для Николь</small>
        </a>
        <div>
          <a href="#photos">моменты</a>
          <a href="#pulse">чувства</a>
          <a href="#letter">письмо</a>
        </div>
        <a className="topbar-heart" href="#forever" aria-label="К финалу">
          ♥
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-orb orb-one" aria-hidden="true" />
        <div className="hero-orb orb-two" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <span>✦</span> {loveStory.eyebrow} <span>✦</span>
          </p>
          <h1>
            <span>{loveStory.hero[0]}</span>
            <em>{loveStory.hero[1]}</em>
            <span>{loveStory.hero[2]}</span>
          </h1>
          <p className="hero-note">{loveStory.heroNote}</p>
          <div className="hero-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => {
                createHeartBurst(30);
                setToast(loveStory.secretPhrase);
              }}
            >
              <span>Открыть моё сердце</span>
              <b aria-hidden="true">♥</b>
            </button>
            <button
              className="text-button"
              type="button"
              onClick={() =>
                document
                  .getElementById("photos")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Смотреть нашу историю <span aria-hidden="true">↓</span>
            </button>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-outer">
            <i />
          </div>
          <div className="orbit orbit-inner">
            <i />
          </div>
          <div className="heart-core">
            <span>∞</span>
          </div>
          <p>ты + я</p>
        </div>

        <div className="hero-index" aria-hidden="true">
          <span>01</span>
          <i />
          <span>∞</span>
        </div>
        <div className="scroll-whisper" aria-hidden="true">
          <span>листай медленно</span>
          <i />
        </div>
      </section>

      <section className="intro section-shell">
        <div className="intro-number" data-reveal>
          <span>365</span>
          <small>причин любить тебя — каждый день новые</small>
        </div>
        <div className="intro-copy" data-reveal>
          <p className="eyebrow">МОЯ ЛЮБИМАЯ</p>
          <h2>
            Рядом с тобой
            <br />
            мир звучит <em>по‑другому.</em>
          </h2>
          <p>{loveStory.intro}</p>
        </div>
      </section>

      <section className="chemistry-section" id="pulse">
        <div className="chemistry-glow" aria-hidden="true" />
        <div className="section-shell chemistry-grid">
          <div className="chemistry-copy" data-reveal>
            <p className="eyebrow">МЕЖДУ НАМИ · 120 УДАРОВ В МИНУТУ</p>
            <h2>
              Ты входишь —
              <em>и у меня сбивается ритм.</em>
            </h2>
            <p>
              В твоём взгляде есть что-то совершенно нечестное: он крадёт
              мысли, время и желание смотреть куда-либо ещё.
            </p>
          </div>
          <div
            className="pulse-experience"
            data-reveal
            style={
              {
                "--pulse-speed": `${Math.max(0.62, 1.5 - pulseLevel * 0.2)}s`,
              } as CSSProperties
            }
          >
            <div className="pulse-rings" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <button
              type="button"
              className="pulse-heart"
              onClick={() => {
                setPulseLevel((level) =>
                  Math.min(level + 1, loveStory.pulsePhrases.length - 1),
                );
                createHeartBurst(16 + pulseLevel * 5);
              }}
              aria-label="Ускорить пульс"
            >
              <span>♥</span>
              <small>коснись</small>
            </button>
            <p key={pulseLevel} className="pulse-phrase" aria-live="polite">
              {loveStory.pulsePhrases[pulseLevel]}
            </p>
            <div className="pulse-meter" aria-hidden="true">
              {loveStory.pulsePhrases.map((phrase, index) => (
                <i
                  className={index <= pulseLevel ? "is-active" : ""}
                  key={phrase}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-section" id="photos">
        <div className="section-shell gallery-heading" data-reveal>
          <div>
            <p className="eyebrow">НАШИ МОМЕНТЫ · НАША ИСТОРИЯ</p>
            <h2>Ты прекрасна в каждом кадре</h2>
          </div>
          <p>
            Здесь будут жить фотографии, к которым хочется возвращаться снова
            и снова.
          </p>
        </div>

        <div className="photo-grid section-shell">
          {loveStory.photos.map((photo, index) => (
            <PhotoCard key={photo.file} {...photo} index={index} />
          ))}
        </div>
      </section>

      <section className="phrase-ribbon" aria-label="Короткие признания">
        <div>
          {[...loveStory.ribbon, ...loveStory.ribbon].map((phrase, index) => (
            <span key={`${phrase}-${index}`}>
              {phrase} <b>♥</b>
            </span>
          ))}
        </div>
      </section>

      <section className="reasons section-shell">
        <div className="reasons-heading" data-reveal>
          <p className="eyebrow">НЕСКОЛЬКО ИЗ БЕСКОНЕЧНОСТИ</p>
          <h2>
            За что я тебя <em>люблю</em>
          </h2>
        </div>
        <div className="reason-list">
          {loveStory.reasons.map((reason, index) => (
            <article
              key={reason.title}
              data-reveal
              style={{ "--delay": `${index * 90}ms` } as CSSProperties}
            >
              <span className="reason-index">0{index + 1}</span>
              <div className="reason-icon" aria-hidden="true">
                {reason.icon}
              </div>
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="letter-section" id="letter">
        <div className="letter-aura" aria-hidden="true" />
        <div className="section-shell letter-grid">
          <div className="letter-heading" data-reveal>
            <p className="eyebrow">ПИСЬМО ДЛЯ ТЕБЯ</p>
            <h2>
              То, что мне всегда
              <br />
              хочется тебе сказать
            </h2>
            <p>
              Нажми на конверт. Некоторые слова заслуживают того, чтобы их
              открывали медленно.
            </p>
          </div>

          <div
            className={`letter-stage ${letterOpen ? "is-open" : ""}`}
            data-reveal
          >
            <div className="letter-paper">
              <div className="letter-date">тебе · сегодня и всегда</div>
              <h3>Моя Николь,</h3>
              {loveStory.letter.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="signature">
                <span>Навсегда твой</span>
                <b>♥</b>
              </div>
              <button
                className="close-letter"
                type="button"
                onClick={() => setLetterOpen(false)}
              >
                Свернуть письмо
              </button>
            </div>

            <button
              className="envelope"
              type="button"
              onClick={() => {
                setLetterOpen(true);
                createHeartBurst(18);
              }}
              aria-expanded={letterOpen}
              aria-label="Открыть любовное письмо"
            >
              <span className="envelope-back" />
              <span className="envelope-card">
                <small>Для самой прекрасной девушки</small>
                <b>только тебе</b>
              </span>
              <span className="envelope-front" />
              <span className="wax-seal">♥</span>
            </button>
          </div>
        </div>
      </section>

      <section className="promise section-shell">
        <div className="promise-quote" data-reveal>
          <span className="quote-mark">“</span>
          <blockquote>
            {loveStory.promise}
            <em> — и я выбираю тебя. Каждый раз.</em>
          </blockquote>
        </div>
        <div className="promise-timeline">
          {loveStory.timeline.map((item, index) => (
            <div key={item.label} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <i />
              <div>
                <small>{item.label}</small>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="finale" id="forever">
        <div className="finale-glow" aria-hidden="true" />
        <div className="finale-content" data-reveal>
          <p className="eyebrow">И ЭТО ТОЛЬКО НАЧАЛО</p>
          <h2>
            Николь, я люблю тебя
            <em>больше, чем помещается в слова.</em>
          </h2>
          <button
            className="kiss-button"
            type="button"
            onClick={() => {
              setKissCount((count) => count + 1);
              createHeartBurst(36);
              setToast(
                kissCount
                  ? `Ещё один поцелуй для тебя · ${kissCount + 1} 💋`
                  : "Этот поцелуй — только для тебя 💋",
              );
            }}
          >
            <span className="kiss-heart" aria-hidden="true">
              ♥
            </span>
            <span>Оставить ей поцелуй</span>
          </button>
        </div>
        <footer>
          <span>Сделано с любовью</span>
          <b>♥</b>
          <span>для Николь</span>
        </footer>
      </section>

      <audio
        ref={audioRef}
        src={`${basePath}/media/music/our-song.mp3`}
        preload="metadata"
        onError={() => setSongReady(false)}
        onEnded={() => {
          setIsPlaying(false);
          setMusicProgress(0);
        }}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          setMusicProgress(
            audio.duration ? (audio.currentTime / audio.duration) * 100 : 0,
          );
        }}
      />
      <button
        className={`music-dock ${isPlaying ? "is-playing" : ""}`}
        type="button"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Поставить песню на паузу" : "Включить песню"}
        style={{ "--music-progress": `${musicProgress}%` } as CSSProperties}
      >
        <span className="music-disc">
          <i>{isPlaying ? "Ⅱ" : "▶"}</i>
        </span>
        <span className="music-copy">
          <b>{songReady ? "Наша песня" : "Добавь нашу песню"}</b>
          <small>{isPlaying ? "сейчас играет" : "нажми, чтобы включить"}</small>
        </span>
        <span className="equalizer" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>

      {toast && (
        <div className="love-toast" role="status">
          <span>♥</span>
          {toast}
        </div>
      )}

      <div className="heart-burst" aria-hidden="true">
        {burst.map((heart) => (
          <span
            key={heart.id}
            style={
              {
                "--burst-x": `${heart.x}vw`,
                "--burst-y": `${heart.y}vh`,
                "--burst-size": `${heart.size}px`,
                "--burst-rotation": `${heart.rotation}deg`,
                "--burst-delay": `${heart.delay}s`,
              } as CSSProperties
            }
          >
            ♥
          </span>
        ))}
      </div>
    </main>
  );
}

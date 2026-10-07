import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import BrandGlyph from "@/components/BrandGlyph";
import { cn } from "@/lib/utils";

interface AnimatedMarqueeHeroProps {
  tagline?: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  videos: readonly string[];
  playIntro?: boolean;
  className?: string;
}

const VIDEO_START_RATIOS = [0.22, 0.34, 0.28, 0.4, 0.18, 0.31] as const;
const MotionLink = motion(Link);

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

function getPoster(src: string) {
  if (src === "/hero/faber-preview.mp4") {
    return "/work/faber-gayrimenkul/marka-tanitim-filmi.webp";
  }
  const match = src.match(/\/videos\/clip-(\d+)\.mp4$/);
  if (match) return `/work/posters/clip-${match[1]}.webp`;
  return src.replace(/\.mp4$/, ".webp");
}

function MarqueeVideo({ src, position }: { src: string; position: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wasActiveRef = useRef(false);
  const startPositionSetRef = useRef(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const reel = video?.closest(".hero-marquee__reel");
    if (!video || !reel) return;

    const savesData = (navigator as NavigatorWithConnection).connection?.saveData === true;
    const reducesMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (savesData || reducesMotion) return;

    if (!("IntersectionObserver" in window)) {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.intersectionRatio >= 0.5),
      { root: reel, threshold: [0, 0.5] }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (active) {
      startPositionSetRef.current = false;
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      if (wasActiveRef.current) video.load();
    }
    wasActiveRef.current = active;
  }, [active]);

  return (
    <video
      ref={videoRef}
      src={active ? src : undefined}
      poster={getPoster(src)}
      onLoadedMetadata={(event) => {
        if (startPositionSetRef.current) return;
        const video = event.currentTarget;
        if (!Number.isFinite(video.duration) || video.duration <= 1) return;

        // Curated previews already begin with their strongest shot.
        const ratio = src.startsWith("/hero/")
          ? 0
          : VIDEO_START_RATIOS[position % VIDEO_START_RATIOS.length];
        video.currentTime = Math.min(video.duration * ratio, video.duration - 0.5);
        startPositionSetRef.current = true;
      }}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}

const ActionButton = ({
  children,
  href = "/iletisim#form",
  secondary = false,
}: {
  children: React.ReactNode;
  href?: string;
  secondary?: boolean;
}) => {
  const className = cn(
    "btn hero-marquee__cta",
    secondary && "btn-ghost hero-marquee__cta--secondary"
  );
  const content = (
    <>
      <span>{children}</span>
      <ArrowUpRight className="button-icon" aria-hidden="true" />
    </>
  );

  if (/^https?:\/\//.test(href)) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={className}
        data-magnetic
      >
        {content}
      </motion.a>
    );
  }

  return (
    <MotionLink to={href} className={className} data-magnetic>
      {content}
    </MotionLink>
  );
};

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  videos,
  playIntro = false,
  className,
}) => {
  const reducedMotion = useReducedMotion();
  const entranceDelay = reducedMotion ? 0 : playIntro ? 1.6 : 0;
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 18, mass: 0.9 },
    },
  };

  const loopStart = videos.length - 1;
  const middleEnd = videos.length * 2 - 1;
  const reelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeCard, setActiveCard] = useState(middleEnd);
  const reversedVideos = [...videos].reverse();
  const reelVideos = [...reversedVideos, ...reversedVideos, ...reversedVideos];

  useEffect(() => {
    const reel = reelRef.current;
    const track = trackRef.current;
    if (!reel || !track || videos.length === 0) return;

    const MOVE_MS = 900;
    const DWELL_MS = 2300;
    let current = middleEnd;
    let cancelled = false;
    let advanceTimer: number | undefined;

    const getCardLeft = (index: number) => {
      const card = cardRefs.current[index];
      if (!card) return null;

      return card.offsetLeft - (reel.clientWidth - card.offsetWidth) / 2;
    };

    const positionTrack = (index: number, animate: boolean) => {
      const left = getCardLeft(index);
      if (left === null) return;
      track.style.transition = animate
        ? `transform ${MOVE_MS}ms cubic-bezier(.16, 1, .3, 1)`
        : "none";
      track.style.transform = `translate3d(${-left}px, 0, 0)`;
      if (!animate) void track.offsetWidth;
    };

    const centerInitialCard = () => {
      setActiveCard(middleEnd);
      positionTrack(middleEnd, false);
    };

    const initialFrame = window.requestAnimationFrame(centerInitialCard);

    const advance = () => {
      if (cancelled) return;

      let next = current - 1;
      if (next < loopStart) {
        // Matching copies make this rightward loop reset invisible.
        positionTrack(middleEnd, false);
        current = middleEnd;
        next = middleEnd - 1;
      }

      current = next;
      setActiveCard(current);
      positionTrack(current, true);
      advanceTimer = window.setTimeout(advance, MOVE_MS + DWELL_MS);
    };

    const handleResize = () => positionTrack(current, false);
    window.addEventListener("resize", handleResize);

    if (!reducedMotion) {
      const introDelay = playIntro ? 2450 : 0;
      advanceTimer = window.setTimeout(advance, introDelay + DWELL_MS);
    }

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(initialFrame);
      if (advanceTimer !== undefined) window.clearTimeout(advanceTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [loopStart, middleEnd, playIntro, reducedMotion, videos.length]);

  return (
    <section
      className={cn(
        "hero-marquee bg-background text-center",
        playIntro && "hero-marquee--intro",
        className
      )}
    >
      {playIntro && (
        <div className="site-intro" aria-hidden="true">
          <div className="site-intro__meta">
            <span>WM / 001</span>
            <span>TRABZON · TÜRKİYE</span>
          </div>
          <div className="site-intro__center">
            <BrandGlyph className="site-intro__glyph" />
            <span className="site-intro__name">WHITE MEDIA</span>
            <span className="site-intro__divider" />
            <span className="site-intro__sub">STRATEJİ / PRODÜKSİYON / DİJİTAL</span>
          </div>
          <div className="site-intro__footer">
            <span>Fikirden ekrana.</span>
            <span className="site-intro__progress"><span /></span>
            <span>01 / 01</span>
          </div>
        </div>
      )}
      <div className="hero-marquee__content">
        <div className="hero-marquee__eyebrow" aria-hidden="true">
          <span />
          WHITE MEDIA / DİJİTAL AJANS
          <span />
        </div>
        {tagline && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={FADE_IN_ANIMATION_VARIANTS}
            className="mb-4 inline-block rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm"
          >
            {tagline}
          </motion.div>
        )}

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                delayChildren: entranceDelay,
                staggerChildren: 0.16,
              },
            },
          }}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground"
        >
          {typeof title === "string" ? (
            title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="inline-block"
              >
                {word}&nbsp;
              </motion.span>
            ))
          ) : (
            title
          )}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: entranceDelay + (reducedMotion ? 0 : 0.34) }}
          className="mt-6 max-w-xl text-lg text-muted-foreground"
        >
          {description}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: entranceDelay + (reducedMotion ? 0 : 0.47) }}
          className="hero-marquee__actions"
        >
          <ActionButton href={ctaHref}>{ctaText}</ActionButton>
          {secondaryCtaText && (
            <ActionButton href={secondaryCtaHref} secondary>
              {secondaryCtaText}
            </ActionButton>
          )}
        </motion.div>
        <a className="hero-marquee__scroll" href="#secili-isler">
          <span className="hero-marquee__scroll-line" aria-hidden="true"><span /></span>
          <span>Aşağı kaydır</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div ref={reelRef} className="hero-marquee__reel" aria-hidden="true">
        <div ref={trackRef} className="hero-marquee__track">
          {reelVideos.map((src, index) => {
            const isActive = index === activeCard;

            return (
              <div
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                key={`${src}-${index}`}
                className={cn(
                  "hero-marquee__card",
                  isActive && "hero-marquee__card--active"
                )}
              >
                <MarqueeVideo src={src} position={index % videos.length} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

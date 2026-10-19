import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { Link } from "react-router-dom";
import BrandGlyph from "@/components/BrandGlyph";
import { useMediaActivity, usePlaybackPreference } from "@/hooks/useMediaActivity";

export default function CinematicHero({ whatsappUrl, playIntro }: { whatsappUrl: string; playIntro: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const active = useMediaActivity(sectionRef);
  const { playing, togglePlayback } = usePlaybackPreference();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active && playing) void video.play().catch(() => undefined);
    else video.pause();
  }, [active, playing]);

  return (
    <section ref={sectionRef} className="cinematic-hero" aria-labelledby="cinematic-title">
      {playIntro && (
        <div className="site-intro" aria-hidden="true">
          <div className="site-intro__meta"><span>WM / 001</span><span>TRABZON · TÜRKİYE</span></div>
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
      <video
        ref={videoRef}
        className="cinematic-hero__film"
        src={active && playing ? "/hero/cinematic-drone.mp4" : undefined}
        poster="/hero/cinematic-drone.webp"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      />
      <div className="cinematic-hero__shade" aria-hidden="true" />
      <div className="wrap cinematic-hero__layout">
        <div className="cinematic-hero__copy">
          <p className="cinematic-hero__eyebrow">WHITE MEDIA / STRATEJİ · PRODÜKSİYON · DİJİTAL</p>
          <h1 id="cinematic-title">Fikirden ekrana.</h1>
          <p className="cinematic-hero__lead">Markana ait hikâyeler üretiyoruz.</p>
          <div className="cinematic-hero__actions">
            <a className="btn cinematic-hero__cta" href={whatsappUrl} target="_blank" rel="noreferrer">
              <span>Projeni anlat</span><ArrowUpRight className="button-icon" aria-hidden="true" />
            </a>
            <Link className="btn cinematic-hero__cta cinematic-hero__cta--outline" to="/portfolyo">
              <span>İşleri incele</span><ArrowUpRight className="button-icon" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="cinematic-hero__footer">
          <a href="#video-vitrini" className="cinematic-hero__discover">
            <ArrowDown size={15} aria-hidden="true" /><span>İşlerimizi keşfet</span>
          </a>
          <button type="button" className="cinematic-hero__playback" onClick={togglePlayback} aria-label={playing ? "Giriş videosunu durdur" : "Giriş videosunu oynat"}>
            <span className="cinematic-hero__playback-icon">{playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}</span>
            <span>SEÇİLİ İŞLER / 2026</span>
          </button>
        </div>
      </div>
    </section>
  );
}

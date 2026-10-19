import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Volume2, VolumeX } from "lucide-react";
import BrandGlyph from "@/components/BrandGlyph";
import "@/styles/camera-intro.css";

type Phase = "loading" | "scene" | "signature" | "leaving";
type Props = { reviewTime?: number; reviewPhone?: boolean };
const FILM = "/intro/sony-camera-desktop.mp4";
const PHONE_FILM = "/intro/sony-camera-phone.mp4";
const POSTER = "/intro/sony-camera-poster.webp";
const SIGNATURE_AT = 4.43;

export default function CameraIntro({ reviewTime, reviewPhone }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadingRef = useRef<number>();
  const maximumRef = useRef<number>();
  const mountedAt = useRef(0);
  const failedRef = useRef(false);
  const review = reviewTime !== undefined;
  const [visible, setVisible] = useState(true);
  const [loadFilm, setLoadFilm] = useState(false);
  const [phone, setPhone] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");

  function fallback() {
    failedRef.current = true;
    setFailed(true);
    videoRef.current?.pause();
    setPhase("signature");
  }

  useEffect(() => {
    if (!visible) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!review && (motion.matches || connection?.saveData)) { setVisible(false); return; }
    const video = videoRef.current;
    const dismiss = () => { if (!review) setVisible(false); };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") dismiss(); };
    mountedAt.current = performance.now();
    failedRef.current = false;
    setPhone((rootRef.current?.clientWidth ?? window.innerWidth) <= 600);
    setLoadFilm(true);
    if (!review) {
      document.documentElement.dataset.introActive = "true";
      window.dispatchEvent(new Event("wm:intro"));
    }
    window.addEventListener("keydown", onKey);
    motion.addEventListener("change", dismiss);
    loadingRef.current = window.setTimeout(fallback, 3500);
    maximumRef.current = window.setTimeout(dismiss, 9000);
    return () => {
      window.clearTimeout(loadingRef.current); window.clearTimeout(maximumRef.current);
      video?.pause();
      window.removeEventListener("keydown", onKey); motion.removeEventListener("change", dismiss);
      if (!review) {
        delete document.documentElement.dataset.introActive;
        window.dispatchEvent(new Event("wm:intro"));
      }
    };
  }, [visible, review]);

  useEffect(() => {
    const video = videoRef.current;
    if (reviewTime !== undefined && video && Number.isFinite(video.duration)) {
      video.currentTime = Math.min(reviewTime, video.duration - .03);
    }
  }, [reviewTime, ready]);

  useEffect(() => {
    if (review || (phase !== "leaving" && phase !== "signature")) return;
    const timer = window.setTimeout(() => {
      if (phase === "signature") setPhase("leaving");
      else setVisible(false);
    }, phase === "signature" ? 1200 : 480);
    return () => window.clearTimeout(timer);
  }, [phase, review]);

  function showFilm() {
    if (failedRef.current) { videoRef.current?.pause(); return; }
    window.clearTimeout(loadingRef.current);
    setReady(true); setPhase("scene");
  }

  function toggleSound() {
    const video = videoRef.current;
    if (!video || !ready || failed) return;
    if (soundOn) { video.muted = true; setSoundOn(false); return; }
    // The visitor's gesture authorizes audible playback. Restart both picture
    // and muxed Foley together so the lock cannot drift or be missed.
    video.pause(); video.currentTime = 0; video.muted = false; video.volume = .75;
    setSoundOn(true); setPhase("scene");
    window.clearTimeout(maximumRef.current);
    maximumRef.current = window.setTimeout(() => setVisible(false), 9000);
    const elapsed = (performance.now() - mountedAt.current) / 1000;
    rootRef.current?.style.setProperty("--intro-timeout", `${elapsed + 9}s`);
    void video.play().catch(() => {
      video.muted = true; setSoundOn(false);
      void video.play().catch(fallback);
    });
  }

  if (!visible) return null;
  const shownPhase = review && ready && !failed ? (reviewTime >= SIGNATURE_AT ? "signature" : "scene") : phase;
  const portrait = reviewPhone ?? phone;

  return (
    <div ref={rootRef} className={`camera-intro camera-intro--${shownPhase}${ready ? " camera-intro--ready" : ""}${review ? " camera-intro--review" : ""}`}>
      <div className="camera-intro__stage" aria-hidden="true">
        <video
          ref={videoRef}
          className="camera-intro__film"
          src={loadFilm ? (portrait ? PHONE_FILM : FILM) : undefined}
          poster={loadFilm ? POSTER : undefined}
          autoPlay={!review}
          muted={!soundOn}
          playsInline
          preload={loadFilm ? "auto" : "none"}
          disablePictureInPicture
          tabIndex={-1}
          onLoadedMetadata={event => {
            if (reviewTime !== undefined) event.currentTarget.currentTime = Math.min(reviewTime, event.currentTarget.duration - .03);
          }}
          onLoadedData={() => { if (review) showFilm(); }}
          onPlaying={showFilm}
          onTimeUpdate={event => { if (!review && event.currentTarget.currentTime >= SIGNATURE_AT) setPhase("signature"); }}
          onEnded={() => { if (!review) setPhase("signature"); }}
          onError={fallback}
        />
      </div>
      <div className="camera-intro__shade" aria-hidden="true" />
      <div className="camera-intro__header" aria-hidden="true"><BrandGlyph className="camera-intro__header-glyph" /><span>White Media</span></div>
      <div className="camera-intro__signature" aria-hidden="true">
        <div className="camera-intro__wordmark"><BrandGlyph className="camera-intro__glyph" /><span>White Media</span></div>
        <p>Fikirden ekrana.</p>
      </div>
      {!review && <div className="camera-intro__controls">
        <button className="camera-intro__sound" type="button" onClick={toggleSound} disabled={!ready || failed} aria-pressed={soundOn}>
          {soundOn ? <VolumeX size={14} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
          {soundOn ? "Sesi kapat" : "Sesli izle"}
        </button>
        <button className="camera-intro__skip" type="button" onClick={() => setVisible(false)}>
          Girişi geç <ArrowUpRight size={14} aria-hidden="true" />
        </button>
      </div>}
    </div>
  );
}

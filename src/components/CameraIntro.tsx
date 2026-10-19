import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play, Volume2 } from "lucide-react";
import BrandGlyph from "@/components/BrandGlyph";
import "@/styles/camera-intro.css";

type Phase = "prompt" | "scene" | "signature" | "leaving";
const DESKTOP_FILM = "/intro/sony-camera-desktop.mp4";
const PHONE_FILM = "/intro/sony-camera-phone.mp4";
const POSTER = "/intro/sony-camera-poster.webp";
const SIGNATURE_AT = 5.02;

export default function CameraIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoRef = useRef<number>();
  const maximumRef = useRef<number>();
  const failedRef = useRef(false);
  const [visible, setVisible] = useState(true);
  const [phone, setPhone] = useState(false);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [phase, setPhase] = useState<Phase>("prompt");

  const start = useCallback((audible: boolean) => {
    const video = videoRef.current;
    if (!video || !ready || failedRef.current) return;
    window.clearTimeout(autoRef.current);
    window.clearTimeout(maximumRef.current);
    maximumRef.current = window.setTimeout(() => setVisible(false), 9000);
    video.pause();
    video.currentTime = 0;
    video.muted = !audible;
    video.volume = 1;
    setSoundOn(audible);
    setStarted(true);
    setPhase("scene");
    void video.play().catch(() => {
      video.muted = true;
      setSoundOn(false);
      void video.play().catch(() => {
        failedRef.current = true;
        setPhase("signature");
      });
    });
  }, [ready]);

  useEffect(() => {
    if (!visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false); return;
    }
    setPhone(window.innerWidth <= 600);
    document.documentElement.dataset.introActive = "true";
    window.dispatchEvent(new Event("wm:intro"));
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setVisible(false); };
    window.addEventListener("keydown", onKey);
    const promptLimit = window.setTimeout(() => setVisible(false), 20000);
    return () => {
      window.clearTimeout(promptLimit);
      window.clearTimeout(autoRef.current);
      window.clearTimeout(maximumRef.current);
      videoRef.current?.pause();
      window.removeEventListener("keydown", onKey);
      delete document.documentElement.dataset.introActive;
      window.dispatchEvent(new Event("wm:intro"));
    };
  }, [visible]);

  useEffect(() => {
    if (ready && !started) autoRef.current = window.setTimeout(() => start(false), 3500);
    return () => window.clearTimeout(autoRef.current);
  }, [ready, started, start]);

  useEffect(() => {
    if (phase !== "signature" && phase !== "leaving") return;
    const timer = window.setTimeout(() => {
      if (phase === "signature") setPhase("leaving");
      else setVisible(false);
    }, phase === "signature" ? 1350 : 480);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (!visible) return null;
  return (
    <div className={`camera-intro camera-intro--${phase}${ready ? " camera-intro--ready" : ""}`}>
      <div className="camera-intro__stage" aria-hidden="true">
        <video
          ref={videoRef}
          className="camera-intro__film"
          src={phone ? PHONE_FILM : DESKTOP_FILM}
          poster={POSTER}
          muted={!soundOn}
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
          onLoadedData={() => setReady(true)}
          onTimeUpdate={event => { if (event.currentTarget.currentTime >= SIGNATURE_AT) setPhase("signature"); }}
          onEnded={() => setPhase("signature")}
          onError={() => { failedRef.current = true; setPhase("signature"); }}
        />
      </div>
      <div className="camera-intro__shade" aria-hidden="true" />
      <div className="camera-intro__header" aria-hidden="true"><BrandGlyph className="camera-intro__header-glyph" /><span>White Media</span></div>
      <div className="camera-intro__signature" aria-hidden="true">
        <div className="camera-intro__wordmark"><BrandGlyph className="camera-intro__glyph" /><span>White Media</span></div>
        <p>Fikirden ekrana.</p>
      </div>
      {phase === "prompt" && <div className="camera-intro__invitation">
        <p>WHITE MEDIA / AÇILIŞ FİLMİ</p>
        <button type="button" onClick={() => start(true)} disabled={!ready}>
          <Play size={16} fill="currentColor" aria-hidden="true" />
          Sesi aç ve filmi izle
        </button>
        <span>Lensin takılışını sesli izle</span>
      </div>}
      <div className="camera-intro__controls">
        {phase === "scene" && !soundOn && <button className="camera-intro__sound" type="button" onClick={() => start(true)} aria-label="Filmi baştan sesli izle">
          <Volume2 size={18} aria-hidden="true" /> Filmi baştan sesli izle
        </button>}
        <button className="camera-intro__skip" type="button" onClick={() => setVisible(false)}>
          Girişi geç <ArrowUpRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

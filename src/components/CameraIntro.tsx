import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import BrandGlyph from "@/components/BrandGlyph";
import "@/styles/camera-intro.css";

type Phase = "loading" | "scene" | "signature" | "leaving";
type Props = { reviewTime?: number };
const FILM = "/intro/camera-studio.mp4";
const POSTER = "/intro/camera-studio.webp";

/** A locally rendered camera film keeps the same materials and motion on every device. */
export default function CameraIntro({ reviewTime }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadingRef = useRef<number>();
  const failedRef = useRef(false);
  const review = reviewTime !== undefined;
  const [visible, setVisible] = useState(true);
  const [loadFilm, setLoadFilm] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
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
    failedRef.current = false;
    setLoadFilm(true);
    if (!review) {
      document.documentElement.dataset.introActive = "true";
      window.dispatchEvent(new Event("wm:intro"));
    }
    window.addEventListener("keydown", onKey);
    motion.addEventListener("change", dismiss);
    loadingRef.current = window.setTimeout(fallback, 3500);
    const maximum = window.setTimeout(dismiss, 8500);
    return () => {
      window.clearTimeout(loadingRef.current); window.clearTimeout(maximum);
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
    }, phase === "signature" ? 1250 : 480);
    return () => window.clearTimeout(timer);
  }, [phase, review]);

  function showFilm() {
    if (failedRef.current) { videoRef.current?.pause(); return; }
    window.clearTimeout(loadingRef.current);
    setReady(true); setPhase("scene");
  }

  if (!visible) return null;
  const shownPhase = review && ready && !failed ? (reviewTime >= 3.45 ? "signature" : "scene") : phase;

  return (
    <div className={`camera-intro camera-intro--${shownPhase}${ready ? " camera-intro--ready" : ""}${review ? " camera-intro--review" : ""}`}>
      <div className="camera-intro__stage" aria-hidden="true">
        <video
          ref={videoRef}
          className="camera-intro__film"
          src={loadFilm ? FILM : undefined}
          poster={loadFilm ? POSTER : undefined}
          autoPlay={!review}
          muted
          playsInline
          preload={loadFilm ? "auto" : "none"}
          disablePictureInPicture
          tabIndex={-1}
          onLoadedData={() => { if (review) showFilm(); }}
          onPlaying={showFilm}
          onTimeUpdate={event => { if (!review && event.currentTarget.currentTime >= 3.45) setPhase("signature"); }}
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
      {!review && <button className="camera-intro__skip" type="button" onClick={() => setVisible(false)}>
        Girişi geç <ArrowUpRight size={14} aria-hidden="true" />
      </button>}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import BrandGlyph from "@/components/BrandGlyph";
import "@/styles/cinematic-camera-intro.css";

type Phase = "loading" | "playing" | "signature" | "leaving";

// Activate on Home only after the final film and poster are supplied and reviewed.
export default function CinematicCameraIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visible) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const dismiss = () => setVisible(false);
    if (motion.matches || connection?.saveData) {
      dismiss();
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    let loadingTimeout = window.setTimeout(dismiss, 2400);
    const onPlaying = () => {
      window.clearTimeout(loadingTimeout);
      loadingTimeout = 0;
      setPhase("playing");
    };
    video.addEventListener("playing", onPlaying);
    window.addEventListener("keydown", onKey);
    motion.addEventListener("change", dismiss);
    // Do not request the film for reduced-motion or data-saving visits.
    video.src = "/intro/white-media-camera-film.mp4";
    void video.play().catch(dismiss);
    const maximum = window.setTimeout(dismiss, 7000);
    return () => {
      window.clearTimeout(loadingTimeout);
      window.clearTimeout(maximum);
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.removeEventListener("playing", onPlaying);
      window.removeEventListener("keydown", onKey);
      motion.removeEventListener("change", dismiss);
    };
  }, [visible]);

  useEffect(() => {
    if (phase !== "signature" && phase !== "leaving") return;
    const timer = window.setTimeout(() => {
      if (phase === "signature") setPhase("leaving");
      else setVisible(false);
    }, phase === "signature" ? 850 : 480);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (!visible) return null;

  return (
    <div className={`cinema-intro cinema-intro--${phase}`}>
      <video
        ref={videoRef}
        className="cinema-intro__film"
        poster="/intro/white-media-camera-film.webp"
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        onEnded={() => setPhase("signature")}
        onError={() => setVisible(false)}
      />
      <div className="cinema-intro__vignette" aria-hidden="true" />
      <div className="cinema-intro__signature" aria-hidden="true">
        <div className="cinema-intro__wordmark">
          <BrandGlyph className="cinema-intro__glyph" />
          <span>White Media</span>
        </div>
        <p>Fikirden ekrana.</p>
      </div>
      <button type="button" className="cinema-intro__skip" onClick={() => setVisible(false)}>
        Girişi geç <ArrowUpRight size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

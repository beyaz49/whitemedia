import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import BrandGlyph from "@/components/BrandGlyph";
import type { CameraScene } from "@/lib/camera-scene";
import "@/styles/camera-intro.css";

type Phase = "loading" | "scene" | "signature" | "leaving";
type Props = { reviewTime?: number };

export default function CameraIntro({ reviewTime }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<CameraScene>();
  const timeRef = useRef(reviewTime);
  timeRef.current = reviewTime;
  const review = reviewTime !== undefined;
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!review && (motion.matches || connection?.saveData)) { setVisible(false); return; }
    let cancelled = false;
    const dismiss = () => { if (!review) setVisible(false); };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") dismiss(); };
    const contextLost = () => { if (!review) { setReady(true); setPhase("signature"); } };
    if (!review) {
      document.documentElement.dataset.introActive = "true";
      window.dispatchEvent(new Event("wm:intro"));
    }
    window.addEventListener("keydown", onKey);
    motion.addEventListener("change", dismiss);
    canvas.addEventListener("webglcontextlost", contextLost);
    const loading = window.setTimeout(() => { if (!review) { setReady(true); setPhase("signature"); } }, 3500);
    const maximum = window.setTimeout(dismiss, 8500);

    void import("@/lib/camera-scene").then(({ createCameraScene }) => {
      if (cancelled) return;
      return createCameraScene(canvas, {
        reviewTime: timeRef.current,
        onSignature: () => { if (!cancelled) setPhase("signature"); },
        onFinish: () => { if (!cancelled) setPhase("leaving"); },
      });
    }).then(scene => {
      if (!scene) return;
      if (cancelled) { scene.dispose(); return; }
      sceneRef.current = scene;
      window.clearTimeout(loading);
      setReady(true); setPhase("scene");
      if (timeRef.current !== undefined) scene.setTime(timeRef.current);
    }).catch(() => {
      if (!cancelled) { setReady(true); setPhase("signature"); }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(loading); window.clearTimeout(maximum);
      sceneRef.current?.dispose(); sceneRef.current = undefined;
      canvas.removeEventListener("webglcontextlost", contextLost);
      window.removeEventListener("keydown", onKey); motion.removeEventListener("change", dismiss);
      if (!review) {
        delete document.documentElement.dataset.introActive;
        window.dispatchEvent(new Event("wm:intro"));
      }
    };
  }, [visible, review]);

  useEffect(() => {
    if (reviewTime !== undefined) sceneRef.current?.setTime(reviewTime);
  }, [reviewTime]);

  useEffect(() => {
    if (review || (phase !== "leaving" && phase !== "signature")) return;
    const fallback = window.setTimeout(() => {
      if (phase === "signature") setPhase("leaving");
      else setVisible(false);
    }, phase === "signature" ? 1250 : 480);
    return () => window.clearTimeout(fallback);
  }, [phase, review]);

  if (!visible) return null;
  const shownPhase = review && ready ? (reviewTime >= 3.6 ? "signature" : "scene") : phase;

  return (
    <div className={`camera-intro camera-intro--${shownPhase}${ready ? " camera-intro--ready" : ""}${review ? " camera-intro--review" : ""}`}>
      <canvas ref={canvasRef} className="camera-intro__canvas" aria-hidden="true" />
      <div className="camera-intro__shade" aria-hidden="true" />
      <div className="camera-intro__header" aria-hidden="true">
        <BrandGlyph className="camera-intro__header-glyph" /><span>White Media</span>
      </div>
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

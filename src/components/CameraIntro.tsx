import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import BrandGlyph from "@/components/BrandGlyph";
import "@/styles/camera-intro.css";

const CAMERA_PARTS = "/intro/sony-a7iv-parts.webp";
const EMPTY_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E";

/** A single photographic atlas keeps the two moving parts in the same light. */
export default function CameraIntro() {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
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
    // A failed or slow image must never hold the visitor behind the opening.
    const fallback = window.setTimeout(dismiss, 4000);
    window.addEventListener("keydown", onKey);
    motion.addEventListener("change", dismiss);
    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener("keydown", onKey);
      motion.removeEventListener("change", dismiss);
    };
  }, [visible]);

  useEffect(() => {
    if (!ready || !visible) return;
    const finish = window.setTimeout(() => setVisible(false), 3220);
    return () => window.clearTimeout(finish);
  }, [ready, visible]);

  if (!visible) return null;

  return (
    <div
      className={`camera-intro${ready ? " camera-intro--ready" : ""}`}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) setVisible(false);
      }}
    >
      <div className="camera-intro__meta" aria-hidden="true">
        <span>WHITE MEDIA / PRODÜKSİYON</span>
        <span>TRABZON · TÜRKİYE</span>
      </div>

      <div className="camera-intro__center" aria-hidden="true">
        <div className="camera-intro__stage">
          <div className="camera-intro__light" />
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet={EMPTY_IMAGE} />
            <img
              className="camera-intro__part camera-intro__body"
              src={CAMERA_PARTS}
              alt=""
              width="1672"
              height="941"
              fetchPriority="high"
              decoding="async"
              draggable={false}
              onLoad={() => setReady(true)}
              onError={() => setVisible(false)}
            />
          </picture>
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet={EMPTY_IMAGE} />
            <img
              className="camera-intro__part camera-intro__lens"
              src={CAMERA_PARTS}
              alt=""
              width="1672"
              height="941"
              decoding="async"
              draggable={false}
              onError={() => setVisible(false)}
            />
          </picture>
        </div>

        <div className="camera-intro__brand">
          <BrandGlyph className="camera-intro__glyph" />
          <span className="camera-intro__name">WHITE MEDIA</span>
          <span className="camera-intro__tagline">Fikirden ekrana.</span>
        </div>
      </div>

      <div className="camera-intro__footer">
        <span className="camera-intro__caption" aria-hidden="true">STRATEJİ / PRODÜKSİYON / DİJİTAL</span>
        <span className="camera-intro__progress" aria-hidden="true"><span /></span>
        <button className="camera-intro__skip" type="button" onClick={() => setVisible(false)}>
          Girişi geç <ArrowUpRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

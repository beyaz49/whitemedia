import { useEffect, useState, type RefObject } from "react";

export function useMediaActivity(ref: RefObject<HTMLElement>) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let inView = !("IntersectionObserver" in window);
    const update = () => setActive(inView && !document.hidden);
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          update();
        }, { threshold: 0.1 })
      : null;
    observer?.observe(element);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [ref]);

  return active;
}

export function usePlaybackPreference() {
  const [preference, setPreference] = useState({ autoplay: false, reducedMotion: false });
  const [mode, setMode] = useState<"auto" | "playing" | "paused">("auto");

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      setPreference({ autoplay: !query.matches && !connection?.saveData, reducedMotion: query.matches });
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const playing = mode === "playing" || (mode === "auto" && preference.autoplay);
  return {
    playing,
    reducedMotion: preference.reducedMotion,
    togglePlayback: () => setMode(playing ? "paused" : "playing"),
  };
}

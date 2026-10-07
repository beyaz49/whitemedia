import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowLeftRight, ArrowRight, ArrowUpRight, Pause, Play, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useMediaActivity, usePlaybackPreference } from "@/hooks/useMediaActivity";
import { cn } from "@/lib/utils";

export type ShowcaseVideo = {
  name: string;
  category: string;
  preview: string;
  src: string;
  poster: string;
  projectHref: string;
};

const DWELL_MS = 8000;
const MANUAL_DWELL_MS = 15000;

function Preview({ video, playing }: { video: ShowcaseVideo; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const visible = useMediaActivity(ref);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (playing && visible) {
      setLoaded(true);
      void element.play().catch(() => undefined);
    } else element.pause();
  }, [playing, visible, loaded]);

  return <video ref={ref} src={loaded ? video.preview : undefined} poster={video.poster} muted loop playsInline preload="none" aria-hidden="true" />;
}

export default function VideoShowcase({ videos }: { videos: readonly ShowcaseVideo[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = useMediaActivity(sectionRef);
  const { playing, reducedMotion, togglePlayback } = usePlaybackPreference();
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: "center",
    startIndex: Math.min(3, videos.length - 1),
    duration: reducedMotion ? 0 : 55,
    skipSnaps: true,
    dragThreshold: 8,
  });
  const [selected, setSelected] = useState(Math.min(3, videos.length - 1));
  const [settled, setSettled] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [interaction, setInteraction] = useState(0);
  const [openVideo, setOpenVideo] = useState<ShowcaseVideo | null>(null);
  const [videoError, setVideoError] = useState(false);
  const holdUntil = useRef(0);
  const activeVideo = videos[selected];

  const manualInteraction = useCallback(() => {
    holdUntil.current = Date.now() + MANUAL_DWELL_MS;
    setInteraction((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!embla) return;
    const select = () => setSelected(embla.selectedScrollSnap());
    const scroll = () => setSettled(false);
    const settle = () => setSettled(true);
    const down = () => { setDragging(true); manualInteraction(); };
    const up = () => { setDragging(false); manualInteraction(); };
    const focus = () => { setFocused(true); manualInteraction(); };
    const reInit = () => { select(); setSettled(true); };
    select();
    embla.on("select", select).on("scroll", scroll).on("settle", settle)
      .on("pointerDown", down).on("pointerUp", up).on("slideFocus", focus).on("reInit", reInit);
    return () => {
      embla.off("select", select).off("scroll", scroll).off("settle", settle)
        .off("pointerDown", down).off("pointerUp", up).off("slideFocus", focus).off("reInit", reInit);
    };
  }, [embla, manualInteraction]);

  useEffect(() => {
    if (!embla || !active || !playing || !settled || dragging || hovered || focused || openVideo) return;
    const delay = Math.max(DWELL_MS, holdUntil.current - Date.now());
    const timer = window.setTimeout(() => embla.scrollPrev(), delay);
    return () => window.clearTimeout(timer);
  }, [embla, active, playing, settled, dragging, hovered, focused, openVideo, selected, interaction]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !openVideo) return;
    setVideoError(false);
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [openVideo]);

  const navigate = (direction: "prev" | "next") => {
    manualInteraction();
    if (direction === "prev") embla?.scrollPrev();
    else embla?.scrollNext();
  };

  return (
    <section ref={sectionRef} id="video-vitrini" className="video-showcase" aria-label="Seçili video çalışmalarımız" aria-roledescription="karusel"
      onFocusCapture={(event) => {
        if (event.target.matches(":focus-visible")) setFocused(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}>
      <div className="wrap video-showcase__head">
        <div>
          <p className="kicker">Seçili işler</p>
          <h2>Her markanın başka bir hikâyesi var.</h2>
        </div>
        <div className="video-showcase__controls">
          <button type="button" onClick={() => navigate("prev")} aria-label="Önceki video"><ArrowLeft size={18} aria-hidden="true" /></button>
          <button type="button" onClick={() => { togglePlayback(); setFocused(false); holdUntil.current = 0; }} aria-label={playing ? "Otomatik akışı durdur" : "Otomatik akışı başlat"} aria-pressed={!playing}>
            {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          </button>
          <button type="button" onClick={() => navigate("next")} aria-label="Sonraki video"><ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
      <div className="video-showcase__viewport" ref={emblaRef}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            navigate(event.key === "ArrowLeft" ? "prev" : "next");
          }
        }}>
        <div className="video-showcase__track">
          {videos.map((video, index) => (
            <div className="video-showcase__slide" key={video.preview} role="group" aria-roledescription="slayt" aria-label={`${index + 1} / ${videos.length}: ${video.name}`}>
              <button type="button" className={cn("video-showcase__card", index === selected && "video-showcase__card--active")}
                aria-label={index === selected ? `${video.name} videosunu izle` : `${video.name} videosunu merkeze al`}
                onClick={() => {
                  manualInteraction();
                  if (index === selected) setOpenVideo(video);
                  else embla?.scrollTo(index);
                }}>
                <Preview video={video} playing={active && playing && !openVideo} />
                <span className="video-showcase__card-shade" aria-hidden="true" />
                <span className="video-showcase__card-label"><span>{video.name}</span><span>{video.category}</span></span>
                <span className="video-showcase__watch"><Play size={12} aria-hidden="true" /><span>Videoyu izle</span></span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="wrap video-showcase__footer">
        <p className="video-showcase__hint"><ArrowLeftRight size={17} aria-hidden="true" /><span>Kaydır, keşfet.</span></p>
        <div className="video-showcase__pagination" aria-label="Video seçimi">
          {videos.map((video, index) => (
            <button type="button" key={video.preview} aria-label={`${video.name} videosunu seç`} aria-current={index === selected ? "true" : undefined}
              onClick={() => { manualInteraction(); embla?.scrollTo(index); }}><span /></button>
          ))}
        </div>
        <span className="video-showcase__count" aria-live={playing ? "off" : "polite"}>{String(selected + 1).padStart(2, "0")} <span>/ {String(videos.length).padStart(2, "0")}</span></span>
      </div>
      <div className="wrap video-showcase__more">
        <p>Bu, işlerimizden yalnızca bir seçki.</p>
        <Link to="/portfolyo">Tüm projeleri keşfet <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
      <p className="sr-only" aria-live="polite">{!playing || dragging ? `${activeVideo?.name}, ${selected + 1} / ${videos.length}` : ""}</p>
      <dialog ref={dialogRef} className="showcase-dialog" aria-label={openVideo ? `${openVideo.name} videosu` : "Video"}
        onCancel={() => setOpenVideo(null)} onClose={() => { setOpenVideo(null); manualInteraction(); }}
        onClick={(event) => { if (event.target === event.currentTarget) setOpenVideo(null); }}>
        {openVideo && <div className="showcase-dialog__content">
          <div className="showcase-dialog__head"><span>{openVideo.name}</span><button type="button" onClick={() => setOpenVideo(null)} aria-label="Videoyu kapat"><X size={22} aria-hidden="true" /></button></div>
          <video src={openVideo.src} poster={openVideo.poster} controls autoPlay playsInline preload="metadata" onError={() => setVideoError(true)} />
          {videoError && <p role="alert">Video şu an yüklenemedi. Proje sayfasından tekrar deneyebilirsin.</p>}
          <Link to={openVideo.projectHref} className="showcase-dialog__project">Projeyi incele <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>}
      </dialog>
    </section>
  );
}

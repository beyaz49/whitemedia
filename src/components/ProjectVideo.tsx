import { useRef, useState } from "react";
import { Play } from "lucide-react";
import type { ProjectMedia } from "@/data/portfolioProjects";

export default function ProjectVideo({ media }: { media: ProjectMedia }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const isLandscape = media.format === "landscape";

  function playVideo() {
    const video = videoRef.current;
    if (!video) return;

    // Attach the large file only after an explicit click. Calling play here
    // preserves the browser's permission to play with sound.
    video.src = media.src;
    setActive(true);
    void video.play().catch(() => undefined);
  }

  return (
    <article className={`case-media reveal${isLandscape ? " case-media--landscape" : ""}`}>
      <div className="case-media__frame">
        <video
          ref={videoRef}
          className="case-media__video"
          controls={active}
          playsInline
          preload="none"
          poster={media.poster}
          aria-label={media.title}
          style={{ display: active ? "block" : "none" }}
        />
        {!active && (
          <button
            type="button"
            className="case-media__preview"
            onClick={playVideo}
            aria-label={`${media.title} videosunu oynat`}
          >
            <img src={media.poster} alt="" loading="lazy" />
            <span className="case-media__play" aria-hidden="true">
              <Play size={30} fill="currentColor" />
            </span>
          </button>
        )}
      </div>
      <p className="case-media__caption">{media.title}</p>
    </article>
  );
}

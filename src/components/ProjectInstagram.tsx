import { ArrowUpRight, Instagram } from "lucide-react";
import type { ProjectMedia } from "@/data/portfolioProjects";

export default function ProjectInstagram({ media }: { media: ProjectMedia }) {
  return (
    <article className="case-media case-media--instagram reveal">
      <a
        href={media.src}
        target="_blank"
        rel="noopener noreferrer"
        className="case-instagram"
        aria-label={`${media.title} — Instagram'da aç`}
      >
        <div className="case-instagram__account">
          <Instagram size={20} aria-hidden="true" />
          <span>{media.instagramUsername ? `@${media.instagramUsername}` : "Instagram"}</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </div>
        <div className="case-instagram__cover">
          <img
            src={media.poster}
            alt={media.title}
            loading="lazy"
            decoding="async"
            width={1080}
            height={1920}
          />
          <span className="case-media__photo-open">
            <Instagram size={18} aria-hidden="true" />
            <span>Instagram'da aç</span>
          </span>
        </div>
        <div className="case-media__caption">{media.title}</div>
      </a>
    </article>
  );
}

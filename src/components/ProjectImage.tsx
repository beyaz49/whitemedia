import { ArrowUpRight } from "lucide-react";
import type { ProjectMedia } from "@/data/portfolioProjects";

export default function ProjectImage({ media }: { media: ProjectMedia }) {
  return (
    <figure className="case-media case-media--image reveal">
      <a
        href={media.src}
        target="_blank"
        rel="noopener noreferrer"
        className="case-media__photo"
        aria-label={`${media.title} — Tam boyutta aç`}
      >
        <img
          src={media.src}
          alt={media.title}
          loading="lazy"
          decoding="async"
          width={1365}
          height={2048}
        />
        <span className="case-media__photo-open">
          <ArrowUpRight size={18} aria-hidden="true" />
          <span>Tam boyutta aç</span>
        </span>
      </a>
      <figcaption className="case-media__caption">{media.title}</figcaption>
    </figure>
  );
}

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import BrandMark from "@/components/BrandMark";
import PageMeta from "@/components/PageMeta";
import ProjectVideo from "@/components/ProjectVideo";
import ProjectImage from "@/components/ProjectImage";
import ProjectInstagram from "@/components/ProjectInstagram";
import {
  portfolioProjectBySlug,
  portfolioProjectNotes,
  portfolioProjects,
} from "@/data/portfolioProjects";

export default function ProjeDetay() {
  const { slug = "" } = useParams();
  const project = portfolioProjectBySlug[slug];

  if (!project) {
    return (
      <main className="case-not-found">
        <PageMeta
          title="Proje Bulunamadı | White Media"
          description="Aradığınız portfolyo projesi bulunamadı. White Media portfolyosundaki diğer işleri inceleyin."
          path={`/portfolyo/${slug}`}
          noIndex
        />
        <div className="wrap">
          <p className="eyebrow">404</p>
          <h1 className="display">Proje bulunamadı.</h1>
          <Link className="btn" to="/portfolyo">
            <ArrowLeft className="button-icon" aria-hidden="true" />
            <span>Portfolyoya dön</span>
          </Link>
        </div>
      </main>
    );
  }

  const projectsWithWork = portfolioProjects.filter(
    (portfolioProject) => portfolioProject.media.length > 0
  );
  const currentPosition = projectsWithWork.findIndex(
    (portfolioProject) => portfolioProject.slug === project.slug
  );
  const nextProject =
    currentPosition >= 0
      ? projectsWithWork[(currentPosition + 1) % projectsWithWork.length]
      : projectsWithWork[0];
  const projectNote = portfolioProjectNotes[project.slug];
  const hasOnlyInstagramPosts =
    project.media.length > 0 && project.media.every((media) => media.type === "instagram");

  return (
    <main>
      <PageMeta
        title={`${project.name} | White Media Portfolyo`}
        description={project.summary}
        path={`/portfolyo/${project.slug}`}
        type="article"
      />
      <header className="case-hero">
        <div className="wrap">
          <Link className="case-back ul" to="/portfolyo">
            ← Portfolyo
          </Link>

          <div className="case-hero__head">
            <div>
              <p className="eyebrow reveal in">EX. {project.index} · {project.category}</p>
              <h1 className="display reveal in" data-d="1">{project.name}</h1>
            </div>
            <p className="case-hero__summary reveal" data-d="2">{project.summary}</p>
          </div>

          <div className={`case-logo case-logo--${project.panel} reveal`}>
            <BrandMark
              project={project}
              className={`case-logo__mark case-logo__mark--${project.logoShape}`}
            />
          </div>
        </div>
      </header>

      <section className="case-info section">
        <div className="wrap case-info__grid">
          <div>
            <p className="kicker reveal">{projectNote ? "Projeye bakış" : "Çalışma kapsamı"}</p>
            <h2 className="display reveal" data-d="1">
              {projectNote?.headline ?? "Markaya özel üretim."}
            </h2>
            {projectNote && <p className="case-info__note reveal" data-d="2">{projectNote.detail}</p>}
          </div>
          <div className="case-info__scope reveal" data-d="2">
            {projectNote && <p className="kicker">Çalışma kapsamı</p>}
            <ul className="case-services">
              {project.services.map((service, index) => (
                <li key={service}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="case-work section">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <p className="kicker">{hasOnlyInstagramPosts ? "Instagram paylaşımları" : "Seçili işler"}</p>
              <h2 className="display sec-title">{hasOnlyInstagramPosts ? "Hesabında paylaşılanlar" : "Ürettiklerimiz"}</h2>
            </div>
            <span className="case-work__count">
              {String(project.media.length).padStart(2, "0")} {hasOnlyInstagramPosts ? "gönderi" : "içerik"}
            </span>
          </div>

          {project.media.length > 0 ? (
            <div className={`case-gallery${hasOnlyInstagramPosts ? " case-gallery--instagram" : ""}`}>
              {project.media.map((media) => (
                media.type === "instagram"
                  ? <ProjectInstagram key={media.src} media={media} />
                  : media.type === "image"
                  ? <ProjectImage key={media.src} media={media} />
                  : <ProjectVideo key={media.src} media={media} />
              ))}
            </div>
          ) : (
            <div className="case-empty reveal">
              <span className="case-empty__index">EX. {project.index}</span>
              <p>Bu markaya ait seçili işleri ekliyoruz.</p>
            </div>
          )}
        </div>
      </section>

      {nextProject && nextProject.slug !== project.slug ? (
        <section className="case-next">
          <div className="wrap">
            <Link
              className="case-next__link reveal"
              to={`/portfolyo/${nextProject.slug}`}
            >
              <span className="case-next__kicker">Sıradaki proje</span>
              <span className="case-next__title-row">
                <span className="display case-next__title">
                  {nextProject.name}
                </span>
                <ArrowUpRight className="case-next__arrow" aria-hidden="true" />
              </span>
              <span className="case-next__category">{nextProject.category}</span>
            </Link>
          </div>
        </section>
      ) : null}

      <section className="section cta-band">
        <div className="wrap">
          <p className="kicker reveal">Benzer bir proje için</p>
          <h2 className="display cta-title reveal" data-d="1">
            Markanı birlikte
            <br />
            büyütelim.
          </h2>
          <div className="reveal" data-d="2" style={{ marginTop: 42 }}>
            <Link className="btn" to="/iletisim#form" data-magnetic>
              <span>Projeni anlat</span>
              <ArrowUpRight className="button-icon" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

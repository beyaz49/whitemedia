import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import BrandMark from "@/components/BrandMark";
import PageMeta from "@/components/PageMeta";
import { portfolioProjects } from "@/data/portfolioProjects";

const WIDE_POSITIONS = new Set([0, 5, 8, 11, 14]);
const DISPLAY_PROJECTS = [...portfolioProjects].sort(
  (a, b) => Number(b.media.length > 0) - Number(a.media.length > 0)
);

export default function Portfolyo() {
  return (
    <main>
      <PageMeta
        title="Portfolyo | White Media"
        description="White Media'nın sağlık, eğitim, otomotiv, gastronomi, turizm, inşaat ve etkinlik sektörleri için ürettiği seçili dijital işler."
        path="/portfolyo"
      />
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow reveal in">Portfolyo</p>
          <h1 className="display reveal in" data-d="1">
            İşler
            <br />
            konuşsun.
          </h1>
          <p className="reveal" data-d="2">
            Sağlıktan eğitime, gastronomiden otomotive; her markanın kendi
            diline göre ürettiğimiz seçili çalışmalar.
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 60 }}>
        <div className="wrap">
          <div className="work">
            {DISPLAY_PROJECTS.map((project, position) => (
              <Link
                className={`exhibit${
                  WIDE_POSITIONS.has(position) ? " exhibit--wide" : ""
                }`}
                key={project.slug}
                to={`/portfolyo/${project.slug}`}
              >
                <span className="exhibit__no">EX. {project.index}</span>
                <div
                  className={`exhibit__media brand-panel brand-panel--${project.panel}`}
                >
                  <BrandMark
                    project={project}
                    className={`brand-logo brand-logo--${project.logoShape}`}
                  />
                </div>
                <div className="exhibit__bar">
                  <span className="exhibit__name">{project.name}</span>
                  <span className="exhibit__tag">{project.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section collaborations-section">
        <div className="wrap">
          <p className="kicker reveal">Kollaborasyonlar</p>
          <h2 className="display reveal collaborations-title" data-d="1">
            İş birliği yaptığımız
            <br />
            ünlü isimler.
          </h2>

          <div className="work collab-grid">
            <Link
              to="/portfolyo/erdem-sanli"
              className="exhibit collab-card"
            >
              <img
                className="collab-card__image"
                src="/logos/erdem-sanli.jpg"
                alt="Erdem Şanlı"
              />
              <h3 className="collab-card__title">Erdem Şanlı</h3>
              <p className="collab-card__handle">2 Instagram paylaşımını gör ↗</p>
            </Link>

            <a
              href="https://instagram.com/kadmfutbol"
              target="_blank"
              rel="noreferrer"
              className="exhibit collab-card"
            >
              <img
                className="collab-card__image"
                src="/logos/kadim-futbol.jpg"
                alt="Kadim Futbol logosu"
              />
              <h3 className="collab-card__title">Kadim Futbol</h3>
              <p className="collab-card__handle">@kadmfutbol</p>
            </a>
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="wrap">
          <p className="kicker reveal">Sıradaki sen ol</p>
          <h2 className="display cta-title reveal" data-d="1">
            Markanı
            <br />
            buraya koyalım.
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

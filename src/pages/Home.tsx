import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import CinematicHero from "@/components/CinematicHero";
import VideoShowcase from "@/components/VideoShowcase";
import BrandMark from "@/components/BrandMark";
import PageMeta from "@/components/PageMeta";
import {
  portfolioProjectBySlug,
  portfolioProjects,
} from "@/data/portfolioProjects";
import { SERVICE_CATALOG } from "@/data/services";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import "@/styles/cinematic-hero.css";

// The opening slate plays once per visit, including when Home is reached
// from another route. Server rendering and the first client render agree.
let introWasShown = false;

const SHOWCASE_VIDEOS = [
  {"slug": "medicalpark", "preview": "/hero/curated-doctor-interview.mp4", "media": 1},
  {"slug": "sancak-turizm", "preview": "/hero/curated-uzungol.mp4", "media": 0},
  {"slug": "pesent-restaurant", "preview": "/hero/curated-pide.mp4", "media": 3},
  {"slug": "erdem-sanli", "preview": "/work/erdem-sanli/samsung-galaxy-reklam-preview.mp4", "poster": "/work/erdem-sanli/samsung-galaxy-reklam-filmi.webp", "media": 0},
  {"slug": "dk-gayrimenkul", "preview": "/hero/dk-showcase.mp4", "media": 0},
  {"slug": "kozalaklar-oyun-atolyesi", "preview": "/hero/curated-snow.mp4", "media": 2},
  {"slug": "gursoy-insaat", "preview": "/hero/gursoy-showcase.mp4", "media": 2},
  {"slug": "maziden-atiye-puruthana", "preview": "/hero/curated-craft.mp4", "media": 2},
  {"slug": "modatepe-resort", "preview": "/hero/curated-breakfast.mp4", "media": 4},
  {"slug": "kardesler-oto-lastik", "preview": "/work/kardesler-beyazli/kardesler-beyazli-34.mp4", "media": 4},
  {"slug": "the-vera-cafe-restaurant", "preview": "/hero/vera-dessert-preview.mp4", "media": 11},
  {"slug": "genc-musiad-trabzon", "preview": "/hero/curated-event.mp4", "media": 0},
  {"slug": "faber-gayrimenkul", "preview": "/hero/curated-sea-residence.mp4", "media": 4},
].map(({ slug, preview, media, poster }) => {
  const project = portfolioProjectBySlug[slug];
  return {
    name: project.name,
    title: project.media[media].title,
    category: project.category.split("·")[0].trim(),
    preview,
    poster: poster ?? preview.replace(/\.mp4$/, ".webp"),
    src: project.media[media].src,
    projectHref: `/portfolyo/${slug}`,
  };
});

const TICKER = [
  { t: "Sosyal Medya", o: false },
  { t: "Prodüksiyon", o: true },
  { t: "Drone", o: false },
  { t: "Google Ads", o: true },
  { t: "Meta Ads", o: false },
  { t: "Web Sitesi", o: true },
];

const APPROACH = [
  {
    number: "01",
    title: "İhtiyaçtan başlarız",
    text: "Önce markanın o an neyi başarması gerektiğini netleştirir, üretilecek her işi bu hedefin üzerine kurarız.",
  },
  {
    number: "02",
    title: "Markaya ait üretiriz",
    text: "Kurumsal kimliği, dili ve hedef kitlesi farklı olan markalara aynı şablonu uygulamayız; her içerik kendi markasına benzer.",
  },
  {
    number: "03",
    title: "Doğru kişiye ulaştırırız",
    text: "Mesajı, kancayı, organik yayını ve reklamı tek bir zincir gibi düşünür; geri dönüşlere göre üretimi geliştiririz.",
  },
];

const FEATURED_SLUGS = [
  "medicalpark",
  "trabzon-universitesi",
  "gursoy-insaat",
  "the-vera-cafe-restaurant",
];

const FEATURED_PROJECTS = FEATURED_SLUGS.map(
  (slug) => portfolioProjectBySlug[slug]
);

const OTHER_PROJECTS = portfolioProjects.filter(
  (project) => !FEATURED_SLUGS.includes(project.slug)
);

const TRUSTED_SLUGS = [
  "medicalpark",
  "trabzon-universitesi",
  "gursoy-insaat",
  "kardesler-oto-lastik",
  "pesent-restaurant",
  "dk-gayrimenkul",
] as const;

const TRUSTED_PROJECTS = TRUSTED_SLUGS.map(
  (slug) => portfolioProjectBySlug[slug]
);

export default function Home() {
  const whatsappUrl = getWhatsAppUrl();
  const playIntro = useRef(!introWasShown).current;
  useEffect(() => {
    introWasShown = true;
  }, []);

  return (
    <main>
      <PageMeta
        title="White Media | Sosyal Medya, Prodüksiyon ve Dijital Reklam"
        description="White Media; sosyal medya yönetimi, fotoğraf ve video prodüksiyon, drone çekimi, dijital reklam ve web hizmetleri sunan Trabzon merkezli dijital ajans."
        path="/"
      />
      <CinematicHero playIntro={playIntro} whatsappUrl={whatsappUrl} />
      <VideoShowcase videos={SHOWCASE_VIDEOS} />

      {/* TRUST */}
      <section className="client-proof" id="secili-isler" aria-labelledby="client-proof-title">
        <div className="wrap">
          <div className="client-proof__head reveal">
            <div>
              <p className="kicker">Seçili iş birlikleri</p>
              <h2 id="client-proof-title">Birlikte çalıştığımız markalardan bazıları.</h2>
            </div>
            <Link className="ul mono" to="/portfolyo">
              TÜM PORTFÖY →
            </Link>
          </div>

          <div className="client-proof__grid">
            {TRUSTED_PROJECTS.map((project) => (
              <Link
                className="client-proof__item client-proof__item--uniform brand-panel"
                to={`/portfolyo/${project.slug}`}
                aria-label={`${project.name} projesini incele`}
                key={project.slug}
              >
                <BrandMark
                  project={project}
                  className={`client-proof__logo brand-logo--${project.logoShape}`}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <section style={{ padding: "46px 0" }}>
        <hr className="hairline" />
        <div className="marquee" aria-hidden="true" style={{ padding: "32px 0" }}>
          <div className="marquee__track">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={i} style={{ display: "contents" }}>
                <span className="marquee__item">{item.t}</span>
                <span className="marquee__dot" />
              </span>
            ))}
          </div>
        </div>
        <hr className="hairline" />
      </section>

      {/* MANIFESTO */}
      <section className="section section--fill">
        <div className="wrap manifesto-grid">
          <div className="reveal">
            <p className="kicker">00 — Manifesto</p>
            <p className="manifesto">
              Markan beyaz bir tuval. Biz onu{" "}
              <span className="dim">boş bırakmıyoruz.</span>
            </p>
          </div>
          <div className="manifesto-aside reveal" data-d="1">
            <p>
              Hazır şablonlarla ilerlemiyoruz. Her işin mesajını markanın
              ihtiyacına göre kuruyoruz.
            </p>
            <p>
              Fikir, çekim, yayın ve reklamı aynı hikâyenin parçaları olarak
              planlıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section agency-intro" aria-labelledby="agency-intro-title">
        <div className="wrap agency-intro__grid">
          <div className="reveal">
            <p className="kicker">White Media</p>
            <h2 className="display" id="agency-intro-title">
              Masanın karşısında değil,
              <br />
              aynı tarafında.
            </h2>
          </div>
          <div className="agency-intro__copy reveal" data-d="1">
            <p>
              Önce markanı, kitleni ve o anki hedefini anlamaya çalışıyoruz.
            </p>
            <p>
              Ardından mesajı fotoğraf, video ve reklam içeriğine dönüştürüyoruz.
            </p>
            <Link className="agency-intro__link" to="/hakkimizda">
              BİZİ DAHA YAKINDAN TANI
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <p className="kicker">Hizmetler</p>
              <h2 className="display sec-title">Ne yapıyoruz</h2>
            </div>
            <Link className="ul mono" to="/hizmetler" style={{ fontSize: 13 }}>
              TÜMÜ →
            </Link>
          </div>

          <div className="srv" style={{ marginTop: 52 }}>
            {SERVICE_CATALOG.map((s) => (
              <Link className="srv__row reveal" key={s.number} to={`/hizmetler/${s.slug}`} aria-label={`${s.name} hizmetini incele`}>
                <span className="srv__num">{s.number}</span>
                <span className="srv__name">{s.name}</span>
                <span className="srv__desc">{s.description}</span>
                <ArrowUpRight className="srv__arrow" size={22} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="section section--ink">
        <div className="wrap">
          <div className="approach-head">
            <div className="reveal">
              <p className="kicker">Neden White Media?</p>
              <h2 className="display sec-title">
                Tek ekip,
                <br />
                net bir yön.
              </h2>
            </div>
            <p className="approach-head__copy reveal" data-d="1">
              Reklam, iyi içeriği doğru kişiye taşır. Bu yüzden üretim ve
              dağıtımı birlikte planlıyoruz.
            </p>
          </div>

          <div className="approach-grid">
            {APPROACH.map((item, index) => (
              <article
                className="approach-card reveal"
                data-d={String(index)}
                key={item.number}
              >
                <span className="approach-card__number">{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EXHIBITS */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <p className="kicker">Seçili İşler</p>
              <h2 className="display sec-title">Vitrin</h2>
            </div>
            <Link className="ul mono" to="/portfolyo" style={{ fontSize: 13 }}>
              PORTFOLYO →
            </Link>
          </div>

          <div className="work" style={{ marginTop: 52 }}>
            {FEATURED_PROJECTS.map((project, position) => {
              const isWide = position === 0 || position === FEATURED_PROJECTS.length - 1;

              return (
                <Link
                  className={`exhibit exhibit--story${isWide ? " exhibit--wide" : ""}`}
                  key={project.slug}
                  to={`/portfolyo/${project.slug}`}
                >
                  <span className="exhibit__no">EX. {project.index}</span>
                  <div className={`exhibit__media brand-panel brand-panel--${project.panel}`}>
                    <BrandMark
                      project={project}
                      className={`brand-logo brand-logo--${project.logoShape}`}
                    />
                  </div>
                  <div className="exhibit__bar">
                    <span className="exhibit__name">{project.name}</span>
                    <span className="exhibit__tag">{project.category}</span>
                  </div>
                  <div className="exhibit-story">
                    <p className="exhibit-story__summary">{project.summary}</p>
                    <div className="exhibit-story__services" aria-label="Çalışma kapsamı">
                      {project.services.slice(0, 2).map((service) => (
                        <span key={service}>{service}</span>
                      ))}
                    </div>
                    <span className="exhibit-story__link">
                      PROJEYİ İNCELE <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="brand-proof reveal">
            <div className="brand-proof__stat">
              <span className="brand-proof__eyebrow">Vitrinin devamı</span>
              <h3 className="brand-proof__title">Daha fazlası.</h3>
            </div>
            <p className="brand-proof__copy">
              Buradaki dört iş yalnızca seçki. Farklı sektörlerden daha fazla
              projeyi portfolyoda görebilirsin.
            </p>
            <Link className="brand-proof__link" to="/portfolyo">
              TÜM MARKALARI GÖR <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="brand-rail reveal" data-d="1" aria-label="Birlikte çalıştığımız diğer markalar">
            <div className="brand-rail__track">
              {[0, 1].map((group) => (
                <div
                  className="brand-rail__group"
                  aria-hidden={group === 1 ? "true" : undefined}
                  key={group}
                >
                  {OTHER_PROJECTS.map((project) => (
                    <Link
                      className="brand-rail__item"
                      key={`${group}-${project.slug}`}
                      tabIndex={group === 1 ? -1 : undefined}
                      to={`/portfolyo/${project.slug}`}
                    >
                      <span className="brand-rail__name">{project.name}</span>
                      <span className="brand-rail__sector">
                        {project.category.split("·")[0].trim()}
                      </span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-band">
        <div className="wrap">
          <p className="kicker reveal">Hadi başlayalım</p>
          <h2 className="display cta-title reveal" data-d="1">
            Tuvali birlikte
            <br />
            dolduralım.
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

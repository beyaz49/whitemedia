import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import BrandGlyph from "@/components/BrandGlyph";

const LINKS = [
  { to: "/", label: "Ana Sayfa", idx: "01" },
  { to: "/hakkimizda", label: "Hakkımızda", idx: "02" },
  { to: "/hizmetler", label: "Hizmetler", idx: "03" },
  { to: "/portfolyo", label: "Portfolyo", idx: "04" },
  { to: "/iletisim", label: "İletişim", idx: "05" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [brandPulse, setBrandPulse] = useState(0);
  const location = useLocation();

  const playBrand = () => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBrandPulse((pulse) => pulse + 1);
    }
  };

  // close sheet on route change + lock body scroll while open
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className={location.pathname === "/" ? "nav nav--cinematic" : "nav"}>
        <div className="wrap nav__inner">
          <Link
            className="brand"
            to="/"
            onClick={playBrand}
          >
            <BrandGlyph
              key={brandPulse}
              className={brandPulse ? "brand__mark--playing" : ""}
            />
            <span
              key={`word-${brandPulse}`}
              className={brandPulse ? "brand__wordmark--playing" : ""}
            >
              White Media
            </span>
          </Link>
          <div className="nav__links">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  isActive ? "nav__link active" : "nav__link ul"
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          <div className="nav__right">
            <Link className="btn nav__cta" to="/iletisim#form" data-magnetic>
              <span>Teklif Al</span>
            </Link>
            <button
              className="nav__burger"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X size={30} aria-hidden="true" />
              ) : (
                <Menu size={30} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        <span className="nav__progress" />
      </nav>

      <div
        id="mobile-menu"
        className={open ? "sheet open" : "sheet"}
        role="dialog"
        aria-label="Menü"
        aria-hidden={!open}
        aria-modal={open || undefined}
      >
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to} tabIndex={open ? 0 : -1}>
            <span>{l.label}</span>
            <span className="idx">{l.idx}</span>
          </Link>
        ))}
      </div>
    </>
  );
}

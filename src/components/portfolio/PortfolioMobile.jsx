"use client";
/* eslint-disable @next/next/no-img-element -- decorative images with fixed responsive widths */
import { useState } from "react";
import {
  about,
  certifications,
  contactLinks,
  experience,
  fillEndorsementCards,
  heroTagline,
  projects,
  tools,
} from "@/content/portfolio";
import {
  CertificateFace,
  DISPLAY,
  EndorsementFace,
  PhotoSlot,
  SANS,
  SERIF,
  starsFor,
} from "./parts";
import EndorsementDialog from "./EndorsementDialog";
import "./hero-bloom";
import "./signature";

const NAV = [
  ["hero", "Home"],
  ["about", "About me"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["certifications", "Certifications"],
  ["tools", "Tools"],
  ["endorsements", "Endorsements"],
  ["contact", "Contact"],
];

const heading = {
  fontFamily: SERIF,
  fontSize: 36,
  lineHeight: 1.15,
  fontWeight: 600,
  letterSpacing: "-0.025em",
  margin: 0,
};
const pad = { padding: "72px 20px", scrollMarginTop: 0 };
const pad2 = (n) => String(n).padStart(2, "0");
const timeline = [...experience].sort((a, b) => a.date - b.date);

function Menu() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(0, 0, 30, 0.4)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 400ms ease",
        }}
      />
      <nav
        aria-label="Sections"
        inert={!open}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 205,
          width: "min(320px, 82vw)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
          padding: "96px 32px 40px",
          background: "#FFFFFF",
          color: "var(--navy)",
          transform: open ? "translateX(0)" : "translateX(calc(100% + 80px))",
          transition: "transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        {NAV.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setOpen(false)}
            style={{
              fontFamily: DISPLAY,
              fontSize: 26,
              lineHeight: 1.3,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {label}
          </a>
        ))}
      </nav>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 210,
          width: 48,
          height: 48,
          padding: 0,
          border: "2px solid #FFFFFF",
          borderRadius: 14,
          background: "var(--navy)",
          cursor: "pointer",
        }}
      >
        <svg aria-hidden="true" viewBox="0 0 48 48" width="44" height="44">
          {[16, 23, 30].map((y) => (
            <rect
              key={y}
              x="14"
              y={y}
              width="20"
              height="2"
              rx="1"
              fill="#FFFFFF"
            />
          ))}
        </svg>
      </button>
    </>
  );
}

function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        height: "100svh",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <hero-bloom
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: "34%",
          transform: "translateY(-50%)",
          width: "100%",
          height: "40svh",
          pointerEvents: "none",
        }}
      >
        <signature-mark
          pen={15}
          size={0.8}
          speed={1300}
          color="#FFFFFF"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <img
        src="/design/hero-fig-1.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "2vw",
          // Stands on the signature's line: 34% down, plus the line's offset at this size.
          top: "calc(34% + 9vw)",
          transform: "translateY(-100%)",
          width: "24vw",
          height: "auto",
        }}
      />
      <img
        src="/design/hero-fig-2.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 0,
          bottom: 56,
          width: "74vw",
          height: "auto",
        }}
      />
      <p
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 12,
          zIndex: 3,
          margin: 0,
          fontFamily: DISPLAY,
          fontSize: "11.8vw",
          lineHeight: 1,
          letterSpacing: "0.01em",
          color: "#FFFFFF",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {heroTagline}
      </p>
    </section>
  );
}

function About() {
  return (
    <section
      id="about"
      style={{ ...pad, background: "var(--cream)", color: "var(--navy)" }}
    >
      <h2 style={heading}>{about.name}</h2>
      <p style={{ fontSize: 18, fontWeight: 300, margin: "12px 0 0" }}>
        {about.subtitle}
      </p>
      <p style={{ fontSize: 16, lineHeight: 1.65, margin: "20px 0 32px" }}>
        {about.bio}
      </p>
      <div
        style={{
          aspectRatio: "3 / 4",
          borderRadius: 24,
          background: "rgba(0, 0, 104, 0.08)",
        }}
      >
        <PhotoSlot
          src={about.photo}
          alt={about.name}
          radius={24}
          label="Portrait coming soon"
        />
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section
      id="experience"
      style={{
        ...pad,
        position: "relative",
        background: "#D8D8D8",
        color: "#3B2618",
      }}
    >
      <img
        src="/design/exp-bg.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.55,
        }}
      />
      <div style={{ position: "relative" }}>
        <h2 style={{ ...heading, color: "var(--navy)", textAlign: "center" }}>
          Experience
        </h2>
        <ol
          style={{
            listStyle: "none",
            margin: "40px 0 0",
            padding: "0 0 0 22px",
            borderLeft: "6px solid var(--gold)",
            display: "flex",
            flexDirection: "column",
            gap: 36,
          }}
        >
          {timeline.map((role) => (
            <li key={role.title}>
              <div style={{ height: 150, marginBottom: 14 }}>
                <PhotoSlot src={role.photo} alt={role.title} />
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 23,
                  lineHeight: 1.2,
                  fontWeight: 600,
                  margin: 0,
                  color: "var(--navy)",
                }}
              >
                {role.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--navy)",
                  margin: "6px 0 10px",
                }}
              >
                {role.meta}
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.6, margin: "0 0 8px" }}>
                {role.peek}
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.65, margin: 0 }}>
                {role.detail}
              </p>
            </li>
          ))}
        </ol>
        <p
          style={{
            fontFamily: DISPLAY,
            fontSize: 24,
            lineHeight: 1,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "var(--navy)",
            margin: "28px 0 0 28px",
          }}
        >
          Still going.
        </p>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section
      id="projects"
      style={{ padding: "64px 0 40px", overflow: "hidden" }}
    >
      <h2
        style={{
          fontFamily: DISPLAY,
          fontSize: "24.5vw",
          lineHeight: 1,
          fontWeight: 400,
          letterSpacing: "0.01em",
          textTransform: "uppercase",
          margin: "0 0 0 8px",
          whiteSpace: "nowrap",
        }}
      >
        Projects
      </h2>
      {projects.map((p, i) => (
        <article
          key={p.title}
          style={{
            padding: "32px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <p
            style={{
              fontFamily: DISPLAY,
              fontSize: 22,
              lineHeight: 1,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--gold)",
              margin: 0,
            }}
          >
            Project {pad2(i + 1)}/{pad2(projects.length)}
          </p>
          <div
            style={{
              height: 150,
              border: "2px solid var(--gold)",
              borderRadius: 12,
              color: "var(--gold)",
            }}
          >
            {p.photo ? (
              <PhotoSlot src={p.photo} alt={p.title} radius={10} />
            ) : (
              <div className="pf-tab-placeholder">
                Project image coming soon
              </div>
            )}
          </div>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 30,
              lineHeight: 1.15,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {p.title}
          </h3>
          {p.sub && (
            <p style={{ fontSize: 17, color: "var(--gold)", margin: 0 }}>
              {p.sub}
            </p>
          )}
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: "rgba(245, 239, 224, 0.92)",
              margin: 0,
            }}
          >
            {p.desc}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {p.tags.map((t) => (
              <span
                key={t}
                style={{
                  border: "1px solid rgba(198, 161, 91, 0.6)",
                  borderRadius: 9999,
                  padding: "5px 14px",
                  fontSize: 14,
                  color: "var(--gold)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {p.points.map((pt) => (
              <li
                key={pt}
                style={{
                  display: "flex",
                  gap: 10,
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "rgba(245, 239, 224, 0.85)",
                }}
              >
                <span aria-hidden="true" style={{ color: "var(--gold)" }}>
                  —
                </span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {p.links.map((l) => (
              <a
                key={l.href}
                className="pf-pill"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
              </a>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

function Certifications() {
  return (
    <section id="certifications" style={{ padding: "56px 0" }}>
      <h2 style={{ ...heading, textAlign: "center", padding: "0 20px" }}>
        Certifications &amp; Awards
      </h2>
      <div
        className="pf-scroller"
        style={{ gap: 16, padding: "32px 7vw 16px" }}
      >
        {certifications.map((c, i) => (
          <article
            key={i}
            style={{
              flex: "0 0 86vw",
              aspectRatio: "10 / 8",
              boxSizing: "border-box",
              padding: 10,
              borderRadius: 6,
              background: "var(--cream)",
              color: "var(--navy)",
              scrollSnapAlign: "center",
            }}
          >
            <CertificateFace cert={c} number={i + 1} />
          </article>
        ))}
      </div>
    </section>
  );
}

function Tools() {
  return (
    <section id="tools" style={{ paddingTop: 56 }}>
      <h2 style={{ ...heading, textAlign: "center", padding: "0 20px" }}>
        Tools I Use
      </h2>
      <div
        className="pf-scroller"
        style={{
          gap: 32,
          marginTop: 32,
          padding: "28px 24px 24px",
          background: "#FFFFFF",
        }}
      >
        {tools.map((t) => (
          <div
            key={t.name}
            style={{
              flex: "0 0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              minWidth: 88,
            }}
          >
            <div
              style={{
                display: "flex",
                height: 36,
                alignItems: "center",
                gap: 8,
              }}
            >
              {t.icons.map((Icon, i) => (
                <Icon
                  key={i}
                  size={30}
                  color="var(--navy)"
                  aria-hidden="true"
                />
              ))}
            </div>
            <span
              style={{
                fontSize: 14,
                whiteSpace: "nowrap",
                color: "var(--navy)",
              }}
            >
              {t.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Endorsements({ approved }) {
  return (
    <section
      id="endorsements"
      style={{
        background: "#FFFFFF",
        color: "var(--navy)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          background: "var(--navy)",
          color: "var(--cream)",
          padding: "56px 20px 0",
          textAlign: "center",
        }}
      >
        <h2 style={heading}>Endorsements from you ♥︎</h2>
        <img
          src="/design/tie-navy.webp"
          alt=""
          aria-hidden="true"
          style={{
            display: "block",
            width: "62vw",
            height: "46vw",
            objectFit: "cover",
            objectPosition: "top",
            margin: "24px auto 0",
          }}
        />
      </div>
      <div className="pf-scroller" style={{ gap: 16, padding: "40px 7vw" }}>
        {fillEndorsementCards(approved).map((e, i) => (
          <article
            key={i}
            style={{ flex: "0 0 86vw", scrollSnapAlign: "center" }}
          >
            <EndorsementFace
              endorsement={e}
              stars={starsFor(e.rating)}
              ratingLabel={e.rating ? `${e.rating} out of 5` : undefined}
              style={{
                height: "100%",
                boxShadow: "0 16px 32px rgba(0, 0, 40, 0.16)",
              }}
            />
          </article>
        ))}
      </div>
      <div style={{ textAlign: "center", padding: "0 20px 48px" }}>
        <EndorsementDialog />
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      style={{
        background: "var(--navy)",
        minHeight: "70svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "72px 20px",
      }}
    >
      <h2 style={heading}>Get in Touch</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "32px 36px",
        }}
      >
        {contactLinks.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            className="pf-contact-link"
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
          >
            <Icon size={36} aria-hidden="true" />
            <span style={{ fontSize: 14 }}>{label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function PortfolioMobile({ approved }) {
  return (
    <div
      style={{
        background: "var(--navy)",
        color: "var(--cream)",
        fontFamily: SANS,
        fontSize: 16,
        lineHeight: 1.55,
        overflowX: "clip",
      }}
    >
      <Menu />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Certifications />
      <Tools />
      <Endorsements approved={approved} />
      <Contact />
    </div>
  );
}

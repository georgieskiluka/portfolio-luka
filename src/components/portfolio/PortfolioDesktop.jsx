"use client";
/* eslint-disable @next/next/no-img-element -- these images are driven by the scroll engine */
import { about, contactLinks } from "@/content/portfolio";
import EndorsementDialog from "./EndorsementDialog";
import PortfolioLogic from "./PortfolioLogic";
import {
  CertificateFace,
  DISPLAY,
  EndorsementFace,
  PhotoSlot,
  SANS,
  SERIF,
} from "./parts";
import "./hero-bloom";
import "./signature";

function CubeLetters({ letters, hideSecondFace }) {
  return letters.map((l, i) => (
    <span key={i} style={{ display: "block", perspective: "4em" }}>
      <span
        data-cube="1"
        style={{
          display: "block",
          position: "relative",
          height: "1em",
          transformStyle: "preserve-3d",
          transformOrigin: "50% 50%",
        }}
      >
        <span
          style={{
            display: "block",
            transform: "translateZ(0.5em)",
            backfaceVisibility: "hidden",
          }}
        >
          {l.ch}
        </span>
        <span
          data-face2={hideSecondFace ? "1" : undefined}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            display: "block",
            opacity: hideSecondFace ? 0 : undefined,
            transform: "rotateX(-90deg) translateZ(0.5em)",
            backfaceVisibility: "hidden",
          }}
        >
          {l.ch}
        </span>
      </span>
    </span>
  ));
}

const fadeBottom =
  "linear-gradient(to bottom, #000 0%, #000 88%, transparent 100%)";
const sectionHeading = {
  fontFamily: SERIF,
  fontSize: "clamp(36px, 5vw, 48px)",
  fontWeight: 600,
  letterSpacing: "-0.025em",
  margin: 0,
};
const blurEdges =
  "linear-gradient(to right, #000 0, transparent 7%, transparent 93%, #000 100%), linear-gradient(to bottom, #000 0, transparent 9%, transparent 91%, #000 100%)";

export default class PortfolioDesktop extends PortfolioLogic {
  // Tuned values from the design's settings panel.
  static defaultProps = {
    endOrbit: 2.45,
    heroLiveBg: true,
    sigStroke: 15,
    sigSize: 60,
    sigSpeed: 1300,
    sil1Delay: 1600,
    sil2Delay: 1850,
    tagX: 1,
    tagY: 1,
    tagSize: 85,
    tagDelay: 2600,
    tagStagger: 35,
    expPPY: 900,
    expAngle: 32,
    expPPYV: 560,
    silOpacity: 92,
    sil1Size: 19,
    sil1X: 9,
    sil1Y: -0.25,
    sil2Size: 44,
    sil2X: 0,
    sil2Y: 100,
    aboutEdge: 180,
    photoSide: "Right",
    photoWidth: 390,
    photoAspect: "3:4",
    photoShadow: "Popping",
    showEndorsements: true,
    snapScroll: false,
  };

  render() {
    const v = this.renderVals();
    return (
      <div
        style={{
          background: "var(--navy)",
          color: "var(--cream)",
          fontFamily: SANS,
          fontSize: 16,
          lineHeight: 1.55,
        }}
      >
        <div
          data-menu-backdrop="1"
          onClick={v.closeMenu}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0, 0, 30, 0.4)",
            opacity: 0,
            pointerEvents: "none",
            transition: "opacity 500ms ease",
          }}
        />
        <nav
          ref={v.menuPanelRef}
          aria-label="Sections"
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
            gap: 4,
            padding: "120px 36px 48px",
            background: "var(--ml, #FFFFFF)",
            color: "var(--mb, var(--navy))",
            transform: "translateX(calc(100% + 140px))",
            transition:
              "transform 650ms cubic-bezier(0.22, 0.61, 0.36, 1), background-color 400ms ease, color 400ms ease",
            boxShadow: "-30px 0 80px rgba(0, 0, 30, 0.25)",
          }}
        >
          <p
            style={{
              margin: "0 0 20px",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            Sections
          </p>
          {v.navItems.map((it) => (
            <button
              key={it.key}
              type="button"
              className="pf-nav-item"
              data-nav-item={it.key}
              onClick={it.go}
            >
              <span
                data-nav-mark="1"
                aria-hidden="true"
                style={{
                  display: "block",
                  flex: "0 0 auto",
                  width: 0,
                  height: 3,
                  background: "currentColor",
                  transition: "width 300ms ease",
                }}
              />
              <span
                style={{
                  fontFamily: DISPLAY,
                  fontSize: "clamp(22px, 2.2vw, 30px)",
                  lineHeight: 1.1,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                {it.label}
              </span>
            </button>
          ))}
        </nav>
        <button
          ref={v.menuRef}
          type="button"
          aria-label="Open menu"
          aria-expanded="false"
          onClick={v.toggleMenu}
          onMouseEnter={v.menuEnter}
          onMouseLeave={v.menuLeave}
          onFocus={v.menuEnter}
          onBlur={v.menuLeave}
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 210,
            width: 52,
            height: 52,
            padding: 0,
            border: "2px solid var(--ml, #FFFFFF)",
            borderRadius: 14,
            background: "var(--mb, var(--navy))",
            overflow: "hidden",
            cursor: "pointer",
            outlineOffset: 3,
            transition: "border-color 400ms ease, background-color 400ms ease",
          }}
        >
          <span
            data-mfill="1"
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--ml, #FFFFFF)",
              clipPath: "inset(0 0 100% 0)",
              transition: "background-color 400ms ease",
            }}
          />
          <svg
            aria-hidden="true"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              overflow: "visible",
            }}
          >
            {[16, 23, 30].map((y) => (
              <rect
                key={y}
                data-mline="1"
                x="14"
                y={y}
                width="20"
                height="2"
                rx="1"
                style={{
                  fill: "var(--ml, #FFFFFF)",
                  transition: "fill 120ms ease",
                }}
              />
            ))}
          </svg>
        </button>

        <div
          ref={v.stageRef}
          style={{ position: "relative", width: "100%", height: "480vh" }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              width: "100%",
              overflow: "hidden",
            }}
          >
            {this.renderHero(v)}
            {this.renderAbout(v)}
          </div>
        </div>

        {this.renderExperience(v)}

        <div
          style={{
            position: "relative",
            isolation: "isolate",
            background: "#000046",
          }}
        >
          <div
            ref={v.navyBgRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: -1,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                height: "100vh",
                width: "100%",
                overflow: "hidden",
                background: "#000046",
              }}
            >
              <div
                data-core=""
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "170vmax",
                  height: "170vmax",
                  margin: "-85vmax 0 0 -85vmax",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(closest-side, #000068 0%, #000068 10%, #000062 28%, #000058 50%, #00004E 72%, rgba(0, 0, 70, 0) 100%)",
                  willChange: "transform",
                }}
              />
              <div
                data-flat=""
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--navy)",
                }}
              />
            </div>
          </div>
          {this.renderProjects(v)}
          {this.renderCertifications(v)}
          {this.renderTools(v)}
        </div>

        {this.renderEndorsements(v)}
        {this.renderContact(v)}
      </div>
    );
  }

  renderHero(v) {
    return (
      <section
        data-screen-label="Hero"
        ref={v.heroRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          textAlign: "center",
          padding: "96px 24px 14vh",
          transformOrigin: "50% 40%",
          willChange: "transform, opacity",
        }}
      >
        <svg
          aria-hidden="true"
          width="0"
          height="0"
          style={{ position: "absolute" }}
        >
          <filter id="silSolid" colorInterpolationFilters="sRGB">
            <feComponentTransfer in="SourceGraphic" result="a">
              <feFuncA type="linear" slope={v.silOpacity} />
            </feComponentTransfer>
            <feFlood floodColor="#000068" result="f" />
            <feComposite in="a" in2="f" operator="over" result="c" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 30 -0.6"
              result="m"
            />
            <feComposite in="c" in2="m" operator="in" />
          </filter>
        </svg>
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
            left: v.sil1X,
            top: v.sil1Y,
            width: v.sil1Size,
            transform: "translate(-50%, -100%)",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <img
            ref={v.sil1Ref}
            src="/design/hero-fig-1.webp"
            alt=""
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              opacity: v.silImgOp,
              filter: v.silFilter,
              userSelect: "none",
              transform: "translateY(101%)",
            }}
          />
        </div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: v.sil2X,
            top: v.sil2Y,
            width: v.sil2Size,
            transform: "translateY(-100%)",
            pointerEvents: "none",
          }}
        >
          <img
            ref={v.sil2Ref}
            src="/design/hero-fig-2.webp"
            alt=""
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              opacity: v.silImgOp,
              filter: v.silFilter,
              userSelect: "none",
              transform: "translateX(100vw)",
            }}
          />
        </div>
        <div
          ref={v.tagRef}
          onMouseEnter={v.tagHover}
          aria-label={v.tagLetters.map((l) => l.ch).join("")}
          style={{
            position: "absolute",
            left: v.tagX,
            bottom: v.tagY,
            zIndex: 3,
            fontFamily: DISPLAY,
            fontSize: v.tagSize,
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: "0.01em",
            color: "#FFFFFF",
            textTransform: "uppercase",
            textAlign: "left",
            cursor: "default",
            userSelect: "none",
          }}
        >
          <div
            data-tag-text="1"
            aria-hidden="true"
            style={{ display: "flex", opacity: 0 }}
          >
            <CubeLetters letters={v.tagLetters} />
          </div>
          <div
            data-tag-bar="1"
            style={{
              position: "absolute",
              left: "-0.06em",
              right: "-0.06em",
              top: "-0.14em",
              bottom: "-0.1em",
              zIndex: 1,
              background: "#FFFFFF",
              transform: "scaleX(0)",
              transformOrigin: "left center",
              pointerEvents: "none",
            }}
          />
        </div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: "40%",
            transform: "translateY(-50%)",
            width: "100%",
            height: "58vh",
            pointerEvents: "none",
          }}
        >
          <signature-mark
            pen={v.sigStroke}
            size={v.sigSize}
            speed={v.sigSpeed}
            color="#FFFFFF"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </section>
    );
  }

  renderAbout(v) {
    return (
      <section
        data-screen-label="About"
        ref={v.aboutPanelRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--cream)",
          color: "var(--navy)",
          transform: "translateY(100%)",
          willChange: "transform",
          paddingTop: 96,
          paddingBottom: 96,
          paddingLeft: v.aboutEdge,
          paddingRight: v.aboutEdge,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "clamp(40px, 6vw, 96px)",
            width: "100%",
            flexDirection: v.aboutDirection,
          }}
        >
          <div
            ref={v.aboutTextRef}
            style={{
              position: "relative",
              flex: "1 1 260px",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 24,
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h2 data-reveal="1" style={sectionHeading}>
                {about.name}
              </h2>
              <p
                data-reveal="1"
                style={{
                  fontSize: "clamp(18px, 2vw, 20px)",
                  fontWeight: 300,
                  margin: 0,
                }}
              >
                {about.subtitle}
              </p>
            </div>
            <p
              data-reveal="1"
              style={{
                maxWidth: "48ch",
                fontSize: 16,
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {about.bio}
            </p>
            <div
              ref={v.aboutMaskRef}
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 5,
              }}
            />
          </div>
          <div
            ref={v.aboutPhotoRef}
            style={{
              position: "relative",
              zIndex: 6,
              willChange: "transform",
              flex: "0 1 auto",
              width: "min(395px, 45%)",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: v.photoAspect,
                borderRadius: 28,
                background: "rgba(0, 0, 104, 0.08)",
                boxShadow: v.photoShadow,
              }}
            >
              <PhotoSlot
                src={about.photo}
                alt={about.name}
                radius={28}
                label="Portrait coming soon"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  renderExperience(v) {
    return (
      <div
        ref={v.expWrapRef}
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          marginTop: "-200vh",
          background:
            "linear-gradient(to bottom, transparent 0, transparent 200vh, #D8D8D8 200vh)",
          height: `calc(200vh + ${v.expScrollLen})`,
        }}
      >
        <section
          data-screen-label="Experience"
          ref={v.sectionRef}
          onClick={v.onSectionClick}
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            padding: 0,
            overflow: "hidden",
            background: "transparent",
            color: "#3B2618",
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <div
            aria-hidden="true"
            ref={v.expBgWrapRef}
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              opacity: 0,
              transform: "translateX(18%)",
              willChange: "transform, opacity",
              pointerEvents: "none",
            }}
          >
            <div
              ref={v.expBgRef}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                backgroundImage: "url('/design/exp-bg.webp')",
                backgroundSize: "100% 100%",
                willChange: "transform, filter",
                transition: "filter 1650ms cubic-bezier(0.65, 0, 0.35, 1)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                maskImage: blurEdges,
                WebkitMaskImage: blurEdges,
              }}
            />
          </div>
          <div
            ref={v.zoomRef}
            style={{
              position: "absolute",
              inset: 0,
              boxSizing: "border-box",
              padding: "96px 24px 0",
              transformOrigin: "0px 0px",
            }}
          >
            <h2
              ref={v.headerRef}
              onMouseEnter={v.headRoll}
              aria-label="Experience"
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(40px, 5vw, 56px)",
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                margin: 0,
                color: "var(--navy)",
                cursor: "default",
                userSelect: "none",
                textAlign: "center",
              }}
            >
              <span
                data-hdr-text="1"
                style={{
                  position: "relative",
                  display: "inline-block",
                  visibility: "hidden",
                }}
              >
                <span aria-hidden="true" style={{ display: "inline-flex" }}>
                  <CubeLetters letters={v.expLetters} />
                </span>
                <span
                  data-hdr-bar="1"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-0.1em",
                    right: "-0.1em",
                    top: "-0.1em",
                    bottom: "-0.1em",
                    background: "var(--navy)",
                    visibility: "visible",
                    transform: "scaleX(0)",
                    pointerEvents: "none",
                  }}
                />
              </span>
            </h2>
            <div
              ref={v.expSlideRef}
              style={{
                position: "absolute",
                inset: 0,
                transform: "translateX(100%)",
                willChange: "transform",
              }}
            >
              <div
                ref={v.scrollRef}
                style={{
                  position: "absolute",
                  top: v.tlTop,
                  bottom: 0,
                  left: v.tlLeft,
                  right: 0,
                  overflow: "hidden",
                  transition: "left 700ms cubic-bezier(0.22, 0.61, 0.36, 1)",
                  maskImage: v.tlMask,
                  WebkitMaskImage: v.tlMask,
                }}
              >
                {this.renderTimeline(v)}
              </div>
              {this.renderRoleCards(v)}
            </div>
          </div>
          <span
            ref={v.zoomTxtRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 79,
              display: "inline-block",
              visibility: "hidden",
              pointerEvents: "none",
              fontFamily: DISPLAY,
              fontSize: 24,
              lineHeight: 1,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "var(--navy)",
              whiteSpace: "nowrap",
              transformOrigin: "0 0",
            }}
          >
            Still going
            <span
              style={{
                display: "inline-block",
                width: "0.2em",
                height: "0.2em",
                borderRadius: "50%",
                background: "var(--navy)",
                marginLeft: "0.08em",
              }}
            />
          </span>
          <div
            ref={v.zoomOvRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 80,
              background: "var(--navy)",
              clipPath: "circle(0px at 0px 0px)",
              visibility: "hidden",
              pointerEvents: "none",
            }}
          />
        </section>
      </div>
    );
  }

  renderTimeline(v) {
    const railEase = "transform 450ms cubic-bezier(0.65, 0, 0.35, 1)";
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: v.tlWidth,
          height: v.tlHeight,
          transform: v.tlPan,
          transition: "transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: v.railHT,
            width: v.railHW,
            height: 6,
            background: "var(--gold)",
            transformOrigin: v.railHO,
            transform: v.railHS,
            transition: railEase,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: v.railVL,
            top: 0,
            width: 6,
            height: v.railVH,
            background: "var(--gold)",
            transformOrigin: v.railVO,
            transform: v.railVS,
            transition: railEase,
          }}
        />
        {v.tlYears.map((y) => (
          <div
            key={y.label}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: y.l,
              top: y.t,
              display: "flex",
              flexDirection: y.dir,
              alignItems: y.align,
              gap: 10,
              opacity: v.railOp,
              transition: v.railOpTr,
            }}
          >
            <span
              style={{
                display: "block",
                flex: "0 0 auto",
                width: y.tw,
                height: y.th,
                background: "var(--gold)",
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: "0.08em",
                fontVariantNumeric: "tabular-nums",
                color: "var(--navy)",
                transform: y.lt,
              }}
            >
              {y.label}
            </span>
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: v.endL,
            top: v.endT,
            display: "flex",
            flexDirection: v.endDir,
            alignItems: "flex-start",
            gap: 14,
            transform: v.endTf,
            opacity: v.railOp,
            transition: v.railOpTr,
          }}
        >
          <svg
            aria-hidden="true"
            width="22"
            height="24"
            viewBox="0 0 22 24"
            style={{
              display: "block",
              flex: "0 0 auto",
              transform: v.endArrowRot,
            }}
          >
            <path d="M0 0h10l12 12-12 12H0l12-12z" fill="var(--gold)" />
          </svg>
          <span
            data-sg=""
            style={{
              fontFamily: DISPLAY,
              fontSize: 24,
              lineHeight: 1,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "var(--navy)",
              whiteSpace: "nowrap",
            }}
          >
            Still going
            <span
              data-sg-dot=""
              style={{
                display: "inline-block",
                width: "0.2em",
                height: "0.2em",
                borderRadius: "50%",
                background: "var(--navy)",
                marginLeft: "0.08em",
              }}
            />
          </span>
        </div>
        {v.roles.map((role) => (
          <div
            key={role.title}
            style={{
              position: "absolute",
              left: role.ax,
              top: role.ay,
              width: 0,
              height: 0,
              opacity: v.railOp,
              transition: v.railOpTr,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: -3,
                bottom: 3,
                width: 6,
                height: role.stemVisH,
                background: role.lineColor,
                transition: role.stemTr,
              }}
            />
            <div
              onMouseEnter={role.onEnter}
              onMouseMove={role.onMove}
              onMouseLeave={role.onLeave}
              onClick={role.onClick}
              style={{
                position: "absolute",
                left: role.diagL,
                bottom: role.stemH,
                transformOrigin: role.origin,
                transform: role.diagT,
                clipPath: role.clip,
                WebkitClipPath: role.clip,
                opacity: role.op,
                cursor: "pointer",
                transition: role.diagTr,
              }}
            >
              <p
                style={{
                  clipPath: role.ulClip,
                  fontFamily: SERIF,
                  fontSize: "clamp(22px, 2vw, 28px)",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                  color: "var(--navy)",
                  whiteSpace: "nowrap",
                  textAlign: role.align,
                  margin: 0,
                  padding: role.pad,
                  borderBottom: `6px solid ${role.lineColor}`,
                  transition:
                    "border-color 300ms, padding 700ms cubic-bezier(0.22, 0.61, 0.36, 1)",
                }}
              >
                {role.label}
              </p>
              <p
                style={{
                  position: "absolute",
                  left: role.subL,
                  right: role.subR,
                  top: "100%",
                  fontSize: 15,
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  color: "var(--navy)",
                  whiteSpace: "nowrap",
                  textAlign: role.align,
                  margin: "8px 0 0",
                }}
              >
                {role.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  renderRoleCards(v) {
    return (
      <>
        {v.roles.map((role) => (
          <div key={role.title} style={role.cardStyle}>
            <div style={role.photoStyle}>
              <PhotoSlot src={role.photo} alt={role.title} />
            </div>
            <div
              data-detail-scroll="true"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: "1 1 auto",
                minHeight: 0,
                overflowY: "auto",
                scrollbarWidth: "none",
                maskImage: fadeBottom,
                WebkitMaskImage: fadeBottom,
              }}
            >
              <p
                style={{
                  fontFamily: SERIF,
                  fontSize: 20,
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                {role.title}
              </p>
              <p style={{ fontSize: 13, color: "var(--navy)", margin: 0 }}>
                {role.meta}
              </p>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(59, 38, 24, 0.9)",
                  margin: 0,
                }}
              >
                {role.peek}
              </p>
              <p style={role.detailStyle}>{role.detail}</p>
            </div>
          </div>
        ))}
        {v.roles.map((role) => (
          <div
            key={role.descKey}
            data-desc={role.descKey}
            onClick={v.stopClick}
            style={{
              position: "absolute",
              zIndex: 40,
              left: "clamp(50px, 10vw, 200px)",
              top: v.descTop,
              width: v.descW,
              bottom: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: 18,
              visibility: role.descVis,
              pointerEvents: role.descPE,
            }}
          >
            <div
              data-desc-photo="true"
              style={{
                position: "relative",
                width: "100%",
                height: 120,
                flex: "0 0 auto",
                borderRadius: 16,
                overflow: "hidden",
                background: "rgba(59, 38, 24, 0.06)",
                clipPath: "inset(0 0 100% 0)",
              }}
            >
              <PhotoSlot src={role.photo} alt={role.title} />
            </div>
            <div
              data-detail-scroll="true"
              style={{
                flex: "1 1 auto",
                minHeight: 0,
                overflowY: "auto",
                scrollbarWidth: "none",
                maskImage: fadeBottom,
                WebkitMaskImage: fadeBottom,
              }}
            >
              <div
                data-desc-text="true"
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <p
                  data-reveal="1"
                  style={{
                    fontFamily: SERIF,
                    fontSize: 28,
                    fontWeight: 600,
                    color: "#3B2618",
                    margin: 0,
                  }}
                >
                  {role.title}
                </p>
                <p
                  data-reveal="1"
                  style={{
                    fontSize: 17,
                    fontWeight: 500,
                    color: "var(--navy)",
                    margin: 0,
                  }}
                >
                  {role.meta}
                </p>
                <p
                  data-reveal="1"
                  style={{
                    fontSize: 19,
                    lineHeight: 1.6,
                    color: "#3B2618",
                    margin: 0,
                  }}
                >
                  {role.peek}
                </p>
                <p
                  data-reveal="1"
                  style={{
                    fontSize: 19,
                    lineHeight: 1.65,
                    color: "#3B2618",
                    margin: 0,
                  }}
                >
                  {role.detail}
                </p>
                <div
                  data-desc-mask="true"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 5,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  renderProjects(v) {
    const arrow = (dir, label, onClick) => (
      <g
        className="pf-mag-arrow"
        data-mag-arrow={dir}
        role="button"
        aria-label={label}
        onClick={onClick}
      >
        <circle
          data-btn=""
          r="22"
          style={{
            fill: "var(--sf)",
            stroke: "var(--gold)",
            strokeWidth: 2.5,
            transition: "fill 200ms ease",
          }}
        />
        <path
          data-arrow=""
          d="M-6 -10 L2 -10 L10 0 L2 10 L-6 10 L2 0 Z"
          style={{
            fill: "var(--ar)",
            stroke: "var(--ar)",
            strokeWidth: 1.5,
            strokeLinejoin: "round",
            transition: "fill 200ms ease, stroke 200ms ease",
          }}
        />
      </g>
    );
    const kickerPart = (key, content, translate) => (
      <span
        data-k={key}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translateX(${translate})`,
        }}
      >
        {content}
      </span>
    );
    return (
      <section
        data-screen-label="Projects"
        style={{
          position: "relative",
          background: "transparent",
          display: "flex",
          minHeight: "100vh",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 0,
          padding: "72px 0 96px",
          overflowX: "clip",
        }}
      >
        <h2
          aria-label="Projects"
          style={{
            position: "relative",
            zIndex: 0,
            alignSelf: "flex-start",
            fontFamily: DISPLAY,
            fontSize: "clamp(120px, 17vw, 300px)",
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            margin: "0 0 0 0.02em",
            padding: 0,
            cursor: "default",
            userSelect: "none",
          }}
        >
          <span aria-hidden="true" style={{ display: "inline-flex" }}>
            <CubeLetters letters={v.projLetters} hideSecondFace />
          </span>
        </h2>
        <div
          ref={v.pjRowRef}
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "minmax(0, 560px) minmax(0, 1fr)",
            alignItems: "start",
            minHeight: "max(600px, calc(100vh - 240px))",
            marginTop: "calc(clamp(120px, 17vw, 300px) * -0.32)",
          }}
        >
          <div
            ref={v.magRef}
            aria-label="Project selector"
            style={{
              position: "relative",
              alignSelf: "stretch",
              minHeight: 440,
              overflow: "visible",
              clipPath: "inset(0 -48px 0 0)",
              cursor: "grab",
              touchAction: "none",
              userSelect: "none",
              outline: "none",
              "--R": "280px",
              "--B": "42px",
              "--TL": "220px",
              "--TH": "60px",
            }}
          >
            <svg
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                width: 1,
                height: 1,
                overflow: "visible",
                pointerEvents: "none",
              }}
            >
              {arrow("1", "Previous project", v.magPrev)}
              {arrow("-1", "Next project", v.magNext)}
            </svg>
            <div
              data-rotor=""
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                width: 0,
                height: 0,
                willChange: "transform",
              }}
            >
              <svg
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 1,
                  height: 1,
                  overflow: "visible",
                }}
              >
                <path data-ring-path="" fill="var(--gold)" />
              </svg>
              {v.magTabs.map((t) => (
                <div
                  key={t.key}
                  data-slot={t.slot}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "var(--TL)",
                    height: "var(--TH)",
                    transformOrigin: "0 0",
                    transform: t.tf,
                    pointerEvents: "none",
                  }}
                >
                  <div
                    data-card=""
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: 0,
                      height: "100%",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 22px",
                      overflow: "hidden",
                      border: "2px solid var(--gold)",
                      borderRadius: "50%",
                      background: "var(--navy)",
                      color: "var(--gold)",
                      pointerEvents: "auto",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      data-card-img=""
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "calc(var(--B) + var(--TL) + 52px)",
                        height: "calc(var(--TH) + 16px)",
                        opacity: 0,
                        color: "var(--gold)",
                      }}
                    >
                      {t.photo ? (
                        <PhotoSlot src={t.photo} alt={t.title} radius={0} />
                      ) : (
                        <div className="pf-tab-placeholder">{t.title}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              data-mag-num=""
              style={{
                position: "absolute",
                left: "calc(var(--R) * 0.09)",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "baseline",
                fontFamily: DISPLAY,
                lineHeight: 1,
                color: "var(--gold)",
                pointerEvents: "none",
              }}
            >
              <span style={{ fontSize: "calc(var(--R) * 0.28)" }}>
                {v.pNum}
              </span>
              <span style={{ fontSize: "calc(var(--R) * 0.12)", opacity: 0.6 }}>
                /{v.pTotal}
              </span>
            </div>
          </div>
          <div
            ref={v.pjDescRef}
            style={{
              position: "relative",
              maxWidth: 820,
              padding: "0 clamp(24px, 6vw, 120px) 24px clamp(24px, 3vw, 48px)",
              visibility: v.pjVis,
            }}
          >
            <div
              data-pj-text=""
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: 22,
              }}
            >
              <div
                data-reveal="1"
                data-reveal-nocover="1"
                data-kicker=""
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 0,
                  height: 0,
                  fontFamily: DISPLAY,
                  fontSize: "max(16px, calc(clamp(120px, 17vw, 300px) * 0.11))",
                  lineHeight: 1,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                }}
              >
                {kickerPart(
                  "lab",
                  <>
                    Project
                    <span
                      data-kb=""
                      style={{ display: "inline-block", width: 0, height: 0 }}
                    />
                  </>,
                  "-100%"
                )}
                {kickerPart("num", v.pNum, "-50%")}
                {kickerPart("sl", "/", "-50%")}
                {kickerPart("tot", v.pTotal, "-50%")}
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <h3
                  data-reveal="1"
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(30px, 3.2vw, 44px)",
                    lineHeight: 1.15,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    margin: 0,
                    color: "var(--cream)",
                    textWrap: "balance",
                  }}
                >
                  {v.pj.title}
                </h3>
                {v.pj.sub && (
                  <p
                    data-reveal="1"
                    style={{ fontSize: 18, color: "var(--gold)", margin: 0 }}
                  >
                    {v.pj.sub}
                  </p>
                )}
              </div>
              <p
                data-reveal="1"
                style={{
                  fontSize: 18,
                  lineHeight: 1.65,
                  color: "rgba(245, 239, 224, 0.92)",
                  margin: 0,
                  textWrap: "pretty",
                }}
              >
                {v.pj.desc}
              </p>
              <div
                data-reveal-box="1"
                style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
              >
                {v.pj.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      border: "1px solid rgba(198, 161, 91, 0.6)",
                      borderRadius: 9999,
                      padding: "5px 14px",
                      fontSize: 14,
                      whiteSpace: "nowrap",
                      color: "var(--gold)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {v.pj.points.map((pt) => (
                  <li
                    key={pt}
                    data-reveal="1"
                    style={{
                      display: "flex",
                      gap: 12,
                      fontSize: 17,
                      lineHeight: 1.6,
                      color: "rgba(245, 239, 224, 0.85)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{ flex: "0 0 auto", color: "var(--gold)" }}
                    >
                      —
                    </span>
                    <span style={{ textWrap: "pretty" }}>{pt}</span>
                  </li>
                ))}
              </ul>
              <div
                data-reveal-box="1"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  paddingTop: 8,
                }}
              >
                {v.pj.links.map((l) => (
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
              <div
                data-pj-mask=""
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  zIndex: 5,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  renderCertifications(v) {
    return (
      <section
        data-screen-label="Certifications"
        style={{
          display: "flex",
          minHeight: "100vh",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          padding: "96px 24px",
          background: "transparent",
          overflow: "hidden",
        }}
      >
        <h2 style={sectionHeading}>Certifications &amp; Awards</h2>
        <div
          ref={v.certStageRef}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 1200,
            height: "calc(min(440px, 62vw) * 0.7 + 120px)",
            touchAction: "pan-y",
            cursor: "grab",
            userSelect: "none",
          }}
        >
          {v.certs.map((c, i) => (
            <article
              key={i}
              data-cert={i}
              style={{
                position: "absolute",
                left: "50%",
                top: 24,
                width: "min(440px, 62vw)",
                aspectRatio: "10 / 7",
                marginLeft: "calc(min(440px, 62vw) / -2)",
                boxSizing: "border-box",
                padding: 10,
                borderRadius: 6,
                background: "var(--cream)",
                color: "var(--navy)",
                boxShadow:
                  "0 18px 40px rgba(0, 0, 0, 0.35), 0 2px 6px rgba(0, 0, 0, 0.25)",
                opacity: 0,
                transformOrigin: "50% 100%",
                willChange: "transform",
              }}
            >
              <CertificateFace cert={c} number={c.n} />
            </article>
          ))}
        </div>
      </section>
    );
  }

  renderTools(v) {
    return (
      <section
        data-screen-label="Tools"
        style={{
          background: "transparent",
          display: "flex",
          minHeight: "60vh",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 56,
          padding: "96px 0 0",
        }}
      >
        <h2 style={{ ...sectionHeading, padding: "0 24px" }}>Tools I Use</h2>
        <div
          ref={v.toolBeltRef}
          style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            padding: "28px 0 24px",
            background: "#FFFFFF",
            cursor: "grab",
            touchAction: "pan-y",
            userSelect: "none",
          }}
        >
          <div
            data-tool-track=""
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 56,
              width: "max-content",
              paddingRight: 56,
              willChange: "transform",
              transform: "translate3d(-33.333%, 0, 0)",
            }}
          >
            {v.toolItems.map((t) => (
              <div
                key={t.key}
                style={{
                  flex: "0 0 auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  minWidth: 96,
                  textAlign: "center",
                  userSelect: "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    height: 36,
                    alignItems: "center",
                    justifyContent: "center",
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
        </div>
      </section>
    );
  }

  renderEndorsements(v) {
    const tieText = {
      fontFamily: SERIF,
      fontSize: 120,
      fontWeight: 600,
      letterSpacing: "-0.02em",
    };
    return (
      <section
        data-screen-label="Endorsements"
        ref={v.endSecRef}
        style={{
          position: "relative",
          height: v.endH,
          width: "100%",
          background: "#FFFFFF",
          color: "var(--navy)",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <div
            ref={v.endTieRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              height: "240vh",
              aspectRatio: "3456 / 4936",
              transform: "translateX(-50%)",
              zIndex: 2,
              pointerEvents: "none",
              willChange: "transform",
            }}
          >
            <svg
              viewBox="0 0 2100 3000"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "visible",
              }}
            >
              <polygon
                points="-4000,-10 700,-10 600,501 -4000,3247"
                fill="var(--navy)"
              />
              <polygon
                points="6100,-10 1400,-10 1500,501 6100,3247"
                fill="var(--navy)"
              />
              <text
                transform="translate(430 602) rotate(-30.8)"
                x="0"
                y="-46"
                textAnchor="end"
                fill="var(--cream)"
                style={tieText}
              >
                Endorsements
              </text>
              <text
                transform="translate(1670 602) rotate(30.8)"
                x="0"
                y="-46"
                textAnchor="start"
                fill="var(--cream)"
                style={tieText}
              >
                from you ♥︎
              </text>
            </svg>
            <div
              style={{
                position: "absolute",
                left: "36%",
                width: "28%",
                top: 0,
                height: "8.5%",
                background: "var(--navy)",
              }}
            />
            <img
              src="/design/tie-navy.webp"
              alt=""
              decoding="async"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                userSelect: "none",
              }}
            />
            <svg
              viewBox="0 0 2100 3000"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "visible",
              }}
            >
              <polygon
                points="760,-10 785,-10 1006,255 760,255"
                fill="#FFFFFF"
              />
              <polygon
                points="1346,-10 1370,-10 1370,255 1124,255"
                fill="#FFFFFF"
              />
              <polygon
                points="785,-10 1346,-10 1118,262 1012,262"
                fill="var(--navy)"
              />
            </svg>
          </div>
          {v.endorsements.map((e) => (
            <article
              key={e.key}
              ref={e.ref}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "min(440px, 80vw)",
                marginLeft: "calc(min(440px, 80vw) / -2)",
                marginTop: -150,
                transformStyle: "preserve-3d",
                visibility: "hidden",
                willChange: "transform",
              }}
            >
              <EndorsementFace
                endorsement={e}
                stars={e.stars}
                ratingLabel={e.ratingLabel}
                style={{
                  transform: "translateZ(0.5px)",
                  boxShadow:
                    "0 30px 60px rgba(0, 0, 40, 0.18), 0 8px 18px rgba(0, 0, 40, 0.10)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  opacity: "var(--o, 0)",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "rotateY(180deg) translateZ(0.5px)",
                  background: "var(--navy)",
                  boxSizing: "border-box",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  opacity: "var(--o, 0)",
                }}
              >
                <span
                  style={{
                    fontFamily: SERIF,
                    fontSize: 40,
                    lineHeight: 1,
                    color: "#FFFFFF",
                  }}
                >
                  ♥︎
                </span>
              </div>
            </article>
          ))}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 36,
              transform: "translateX(-50%)",
              zIndex: 5,
            }}
          >
            <EndorsementDialog />
          </div>
        </div>
      </section>
    );
  }

  renderContact(v) {
    return (
      <section
        data-screen-label="Contact"
        ref={v.contactRef}
        style={{
          position: "relative",
          zIndex: 6,
          height: "calc(130vh - 24px)",
          width: "100%",
          marginTop: v.contactPull,
          pointerEvents: "none",
        }}
      >
        <div
          data-c-white="1"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: "30vh",
            background: "#FFFFFF",
          }}
        />
        <div
          data-c-card="1"
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            bottom: 0,
            top: "30vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            padding: "0 24px",
            background: "var(--navy)",
            color: "var(--cream)",
            pointerEvents: "auto",
          }}
        >
          <h2 style={sectionHeading}>Get in Touch</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px 48px",
            }}
          >
            {contactLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                className="pf-contact-link"
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  href.startsWith("mailto:") ? undefined : "noopener noreferrer"
                }
              >
                <Icon size={36} aria-hidden="true" />
                <span style={{ fontSize: 14 }}>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }
}

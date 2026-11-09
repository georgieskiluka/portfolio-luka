/* eslint-disable @next/next/no-img-element -- slots are sized by animated parents */
import {
  PiCertificateDuotone,
  PiImageDuotone,
  PiMedalDuotone,
} from "react-icons/pi";

export const SERIF = "var(--font-fraunces), Georgia, serif";
export const SANS = "var(--font-ibm-plex-sans), system-ui, sans-serif";
export const DISPLAY = "var(--font-anton), Impact, sans-serif";

export function PhotoSlot({
  src,
  alt = "",
  label = "Photo coming soon",
  radius = 16,
}) {
  const box = {
    width: "100%",
    height: "100%",
    borderRadius: radius,
    overflow: "hidden",
  };
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ ...box, display: "block", objectFit: "cover" }}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={label}
      style={{
        ...box,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        background: "rgba(0, 0, 104, 0.1)",
        color: "rgba(0, 0, 104, 0.6)",
        fontFamily: SANS,
        fontSize: 13,
        textAlign: "center",
      }}
    >
      <PiImageDuotone size={26} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function CertificateFace({ cert, number }) {
  const frame = {
    display: "flex",
    height: "100%",
    boxSizing: "border-box",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "20px 28px",
    border: "1.5px solid var(--gold)",
    outline: "1px solid rgba(198, 161, 91, 0.5)",
    outlineOffset: -6,
    borderRadius: 3,
    textAlign: "center",
  };
  const kicker = {
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    margin: 0,
  };
  const heading = {
    fontFamily: SERIF,
    fontSize: "clamp(16px, 2vw, 22px)",
    lineHeight: 1.2,
    fontWeight: 600,
    margin: 0,
    textWrap: "balance",
  };
  if (cert.ph) {
    return (
      <div style={frame}>
        <PiCertificateDuotone
          size={30}
          color="rgba(198, 161, 91, 0.7)"
          aria-hidden="true"
        />
        <p style={{ ...kicker, color: "rgba(0, 0, 104, 0.5)" }}>Coming soon</p>
        <h3 style={{ ...heading, color: "rgba(0, 0, 104, 0.45)" }}>
          Certificate {number}
        </h3>
      </div>
    );
  }
  return (
    <div style={frame}>
      <PiMedalDuotone size={30} color="var(--gold)" aria-hidden="true" />
      <p style={{ ...kicker, color: "rgba(0, 0, 104, 0.65)" }}>
        Certificate of Completion
      </p>
      <h3 style={heading}>{cert.title}</h3>
      <p style={{ fontSize: 13, margin: 0 }}>{cert.issuer}</p>
      <p style={{ fontSize: 12, color: "rgba(0, 0, 104, 0.7)", margin: 0 }}>
        {cert.date}
      </p>
      {cert.extra && (
        <p style={{ fontSize: 11, color: "rgba(0, 0, 104, 0.6)", margin: 0 }}>
          {cert.extra}
        </p>
      )}
      {cert.href && (
        <a
          href={cert.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--navy)",
            textDecoration: "underline",
            marginTop: 2,
          }}
        >
          View Credential
        </a>
      )}
    </div>
  );
}

const corner = (position, size) => ({
  position: "absolute",
  pointerEvents: "none",
  ...position,
  width: size.w,
  height: size.h,
});

/** Front of an endorsement card. With no quote it renders as a blank card. */
export function EndorsementFace({ endorsement, stars, ratingLabel, style }) {
  const { quote, name, role } = endorsement;
  const ink = "var(--navy)";
  return (
    <div
      aria-hidden={quote ? undefined : true}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        minHeight: 300,
        padding: "44px 44px 40px",
        boxSizing: "border-box",
        background: "#FBF8F0",
        ...style,
      }}
    >
      <div
        style={{
          ...corner({ top: 10, right: 10 }, { w: "50%", h: "50%" }),
          borderTop: `3px solid ${ink}`,
          borderRight: `3px solid ${ink}`,
        }}
      />
      <div
        style={{
          ...corner(
            { top: 17, right: 17 },
            { w: "calc(50% - 7px)", h: "calc(50% - 7px)" }
          ),
          borderTop: `1px solid ${ink}`,
          borderRight: `1px solid ${ink}`,
        }}
      />
      <div
        style={{
          ...corner({ bottom: 10, left: 10 }, { w: "50%", h: "50%" }),
          borderBottom: `3px solid ${ink}`,
          borderLeft: `3px solid ${ink}`,
        }}
      />
      <div
        style={{
          ...corner(
            { bottom: 17, left: 17 },
            { w: "calc(50% - 7px)", h: "calc(50% - 7px)" }
          ),
          borderBottom: `1px solid ${ink}`,
          borderLeft: `1px solid ${ink}`,
        }}
      />
      {stars && (
        <div
          aria-label={ratingLabel}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 4,
            fontSize: 18,
            lineHeight: 1,
            color: ink,
          }}
        >
          {stars}
        </div>
      )}
      {quote && (
        <p
          style={{
            fontFamily: SERIF,
            fontSize: 21,
            lineHeight: 1.45,
            letterSpacing: "-0.01em",
            color: ink,
            margin: 0,
            textWrap: "pretty",
          }}
        >
          “{quote}”
        </p>
      )}
      {(name || role) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontFamily: SANS,
              fontSize: 15,
              fontWeight: 600,
              color: ink,
            }}
          >
            {name}
          </span>
          <span style={{ fontFamily: SANS, fontSize: 14, color: ink }}>
            {role}
          </span>
        </div>
      )}
    </div>
  );
}

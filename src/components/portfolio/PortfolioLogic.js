// Scroll and interaction engine for the desktop portfolio, carried over from the
// Claude Design export. Text and links live in src/content/portfolio.ts.
import React from "react";
import {
  certifications,
  endorsements,
  experience,
  heroTagline,
  projects,
  tools,
} from "@/content/portfolio";

export default class PortfolioLogic extends React.Component {
  state = {
    mode: "h",
    phase: "out",
    rail: false,
    shown: null,
    expP: 0,
    panX: 0,
    hovered: null,
    expanded: null,
    lockedSide: null,
    cx: 0,
    cy: 0,
    inView: true,
    headerBottom: 200,
    pIdx: 0,
    pShown: 0,
  };

  _setStage = (el) => {
    this._stage = el;
    this._armStage();
  };
  _setHero = (el) => {
    this._hero = el;
    this._armStage();
  };
  _setAboutPanel = (el) => {
    this._aboutPanel = el;
    this._armStage();
  };

  _armStage() {
    if (!this._stage || !this._hero || !this._aboutPanel || this._stageArmed)
      return;
    this._stageArmed = true;
    this._onStageScroll = () => {
      if (this._stageRaf) return;
      this._stageRaf = requestAnimationFrame(() => {
        this._stageRaf = 0;
        this._stageFrame();
      });
    };
    addEventListener("scroll", this._onStageScroll, { passive: true });
    this._armSnapGuard();
    addEventListener("resize", this._onStageScroll);
    this._stageFrame();
  }

  _stageFrame() {
    const st = this._stage,
      hero = this._hero,
      panel = this._aboutPanel;
    if (!st || !hero || !panel) return;
    const r = st.getBoundingClientRect();
    const T = innerHeight;
    const span = Math.max(1, st.offsetHeight - innerHeight - T);
    const p = Math.min(1, Math.max(0, -r.top / span));
    this._aboutZone = span * 0.08;
    this._snapCheck(
      Math.min(1, Math.max(0, (-r.top - span) / T)),
      r.top + scrollY + span,
      T
    );
    const ez = (t) => 1 - Math.pow(1 - t, 3);
    hero.style.transform = "scale(" + (1 + p * 1.9) + ")";
    const erase = Math.min(1, Math.max(0, p / 0.78));
    const sig = hero.querySelector("signature-mark");
    const up = p < (this._lastP ?? p);
    this._lastP = p;
    if (sig && sig.setErase) {
      if (up && erase > 0 && erase < 1) sig.setDrawn(1 - erase);
      else sig.setErase(erase);
    }
    hero.style.opacity = String(
      Math.min(1, Math.max(0, 1 - Math.pow(p / 0.84, 2.2)))
    );
    this._qT = Math.min(1, Math.max(0, (p - 0.6) / 0.4));
    if (this._qS == null) this._qS = this._qT;
    if (!this._qRaf) this._qRaf = requestAnimationFrame(this._panelTick);
  }
  _panelTick = () => {
    this._qRaf = null;
    const panel = this._aboutPanel;
    if (!panel) return;
    const d = this._qT - this._qS;
    this._qS = Math.abs(d) < 0.0005 ? this._qT : this._qS + d * 0.14;
    const q = 0.5 - Math.cos(Math.PI * this._qS) / 2;
    panel.style.transform =
      q >= 1
        ? "translateY(0)"
        : "translate3d(0," + (100 - q * 100).toFixed(3) + "%,0)";
    if (q > 0.82) this._playReveal();
    if (this._qS !== this._qT)
      this._qRaf = requestAnimationFrame(this._panelTick);
  };

  _setAboutPhoto = (el) => {
    this._aboutPhoto = el;
  };
  _setExpSlide = (el) => {
    this._expSlide = el;
    if (el) requestAnimationFrame(() => this._stageFrame());
  };
  _holdingAbout() {
    return !!this._revealed && performance.now() < (this._revealHold || 0);
  }
  _snapCheck(raw, y0, T) {
    this._bY0 = y0;
    this._bT = T;
    if (this._holdingAbout() && scrollY > y0 + 1) {
      scrollTo({ top: y0, behavior: "instant" });
      raw = 0;
    }
    const y = scrollY;
    if (this._lastSY != null && y !== this._lastSY)
      this._lastDir = Math.sign(y - this._lastSY);
    this._lastSY = y;
    if (scrollY >= y0 + T - 1.5) raw = 1;
    else if (scrollY <= y0 + 0.5) raw = 0;
    this._tpShown = raw;
    if (raw === 1 && this._tpSm !== 1 && scrollY >= y0 + T + 2) {
      cancelAnimationFrame(this._smRaf);
      this._smRaf = null;
      this._tpSm = 1;
      this._tpGoal = 1;
      this._bridge(1);
    } else this._smoothTo(raw);
    clearTimeout(this._settleT);
    const tg = this._settleTarget(y);
    if (!this._settling && tg != null && Math.abs(tg - y) > 0.5)
      this._settleT = setTimeout(() => this._settle(), 140);
  }
  _smoothTo(tp) {
    this._tpGoal = tp;
    if (this._tpSm == null) {
      this._tpSm = tp;
      this._bridge(tp);
      return;
    }
    if (this._smRaf) return;
    let last = performance.now();
    const step = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const g = this._tpGoal,
        d = g - this._tpSm;
      this._tpSm =
        Math.abs(d) < 0.0008 ? g : this._tpSm + d * (1 - Math.exp(-dt * 6));
      this._bridge(this._tpSm);
      this._smRaf = this._tpSm === g ? null : requestAnimationFrame(step);
    };
    this._smRaf = requestAnimationFrame(step);
  }
  _stopSettle() {
    if (this._settling) {
      cancelAnimationFrame(this._settleRaf);
      this._settling = false;
    }
  }
  _settleTarget(y) {
    const y0 = this._bY0,
      T = this._bT;
    if (y0 == null) return null;
    const pj = document.querySelector('[data-screen-label="Projects"]');
    if (pj && pj.getBoundingClientRect().top < innerHeight * 0.9) return null;
    const raw = (y - y0) / T;
    if (raw > 0 && raw < 0.08) return y0;
    if (raw > 0.92 && raw < 1) return y0 + T;
    if (y < y0 && y > y0 - (this._aboutZone || 0)) return y0;
    return null;
  }
  _settle() {
    if (this._ptrDown) return;
    const from = scrollY,
      to = this._settleTarget(from);
    if (to == null || Math.abs(to - from) < 0.5) return;
    const D = Math.min(420, 180 + Math.abs(to - from) * 1.2),
      t0 = performance.now();
    this._settling = true;
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / D),
        e = 1 - Math.pow(1 - k, 3);
      scrollTo({ top: from + (to - from) * e, behavior: "instant" });
      if (k < 1) {
        this._settleRaf = requestAnimationFrame(step);
        return;
      }
      this._settling = false;
      this._lockUntil = performance.now() + 250;
    };
    this._settleRaf = requestAnimationFrame(step);
  }
  _armSnapGuard() {
    if (this._snapLock) return;
    const intercept = (e, dy) => {
      if (this._menuOpen) {
        if (!(
          e.type === "keydown" &&
          e.target &&
          e.target.closest &&
          e.target.closest("button")
        ))
          e.preventDefault();
        return;
      }
      if (!dy) return;
      this._lastDir = Math.sign(dy);
      const now = performance.now();
      if (now < (this._lockUntil || 0)) {
        e.preventDefault();
        if (
          this._holdMax &&
          e.type === "wheel" &&
          Math.sign(dy) === this._lockDir
        )
          this._lockUntil = Math.min(
            this._holdMax,
            Math.max(this._lockUntil, now + 160)
          );
        return;
      }
      this._stopSettle();
      const y0 = this._bY0,
        T = this._bT;
      if (y0 == null) return;
      if (dy > 0 && this._holdingAbout() && scrollY + dy > y0) {
        e.preventDefault();
        if (scrollY < y0 - 1) scrollTo({ top: y0, behavior: "instant" });
        return;
      }
      const y = scrollY,
        stops = dy > 0 ? [y0, y0 + T] : [y0 + T, y0];
      for (const st of stops) {
        if (
          (dy > 0 && y < st - 1 && y + dy >= st) ||
          (dy < 0 && y > st + 1 && y + dy <= st)
        ) {
          e.preventDefault();
          scrollTo({ top: st, behavior: "instant" });
          this._lockUntil = now + 650;
          this._lockDir = Math.sign(dy);
          this._holdMax = st === y0 && dy > 0 ? now + 1100 : 0;
          return;
        }
      }
    };
    this._snapLock = (e) =>
      intercept(
        e,
        e.deltaY *
          (e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? innerHeight : 1)
      );
    this._snapKey = (e) => {
      const k = e.key,
        ih = innerHeight;
      const dy =
        k === "ArrowDown"
          ? 60
          : k === "ArrowUp"
            ? -60
            : k === "PageDown" || (k === " " && !e.shiftKey)
              ? ih
              : k === "PageUp" || (k === " " && e.shiftKey)
                ? -ih
                : k === "End"
                  ? 1e6
                  : k === "Home"
                    ? -1e6
                    : 0;
      if (dy) intercept(e, dy);
    };
    this._touchY = null;
    this._snapTS = (e) => {
      this._touchY = e.touches[0] ? e.touches[0].clientY : null;
    };
    this._snapTM = (e) => {
      const t = e.touches[0];
      if (!t || this._touchY == null) return;
      const dy = this._touchY - t.clientY;
      this._touchY = t.clientY;
      intercept(e, dy);
    };
    this._snapPD = () => {
      this._ptrDown = true;
      this._stopSettle();
    };
    this._snapPU = () => {
      if (!this._ptrDown) return;
      this._ptrDown = false;
      clearTimeout(this._settleT);
      this._settleT = setTimeout(() => this._settle(), 120);
    };
    addEventListener("wheel", this._snapLock, { passive: false });
    addEventListener("keydown", this._snapKey);
    addEventListener("touchstart", this._snapTS, { passive: true });
    addEventListener("touchmove", this._snapTM, { passive: false });
    addEventListener("pointerdown", this._snapPD, { passive: true });
    addEventListener("pointerup", this._snapPU, { passive: true });
    addEventListener("touchend", this._snapPU, { passive: true });
  }
  static NAV = [
    ["hero", "Home", "Hero"],
    ["about", "About me", "About"],
    ["experience", "Experience", "Experience"],
    ["projects", "Projects", "Projects"],
    ["certifications", "Certifications", "Certifications"],
    ["tools", "Tools", "Tools"],
    ["endorsements", "Endorsements", "Endorsements"],
    ["contact", "Contact", "Contact"],
  ];
  static THEME = {
    hero: ["var(--navy)", "#FFFFFF"],
    about: ["var(--cream)", "var(--navy)"],
    experience: ["#D8D8D8", "var(--navy)"],
    projects: ["var(--navy)", "var(--gold)"],
    certifications: ["var(--navy)", "var(--gold)"],
    tools: ["var(--navy)", "var(--gold)"],
    endorsements: ["#FFFFFF", "var(--navy)"],
    contact: ["var(--navy)", "#FFFFFF"],
    other: ["var(--navy)", "var(--gold)"],
  };
  static ENDORSE = endorsements;
  _endCards = [];
  _endCardRefs = PortfolioLogic.ENDORSE.map((_, i) => (el) => {
    this._endCards[i] = el;
    if (el) this._endQueue();
  });
  _setEndSec = (el) => {
    if (this._endSec === el) return;
    if (this._endOff) {
      this._endOff();
      this._endOff = null;
    }
    this._endSec = el;
    if (!el) return;
    const q = () => this._endQueue();
    addEventListener("scroll", q, { passive: true, capture: true });
    addEventListener("resize", q);
    this._endOff = () => {
      removeEventListener("scroll", q, { capture: true });
      removeEventListener("resize", q);
    };
    q();
  };
  _pocket(ax, dA, k, m) {
    const c = this._contact;
    if (!c) return;
    const key = [ax, dA, k, m].map((v) => v.toFixed(1)).join();
    if (key === this._pocketKey) return;
    this._pocketKey = key;
    const sL = 271 / 261,
      sR = 252 / 261,
      mL = m * Math.hypot(1, sL),
      mR = m * Math.hypot(1, sR);
    const d = dA + (mL + mR) / (sL + sR),
      px = ax - sL * (dA - d) - mL;
    const poly = (ox, w) =>
      "polygon(0 0," +
      (px - ox - sL * d).toFixed(1) +
      "px 0," +
      (px - ox).toFixed(1) +
      "px " +
      d.toFixed(1) +
      "px," +
      (px - ox + sR * d).toFixed(1) +
      "px 0,100% 0,100% 100%,0 100%)";
    const wh = c.querySelector("[data-c-white]"),
      cd = c.querySelector("[data-c-card]");
    if (wh) wh.style.clipPath = poly(0);
    if (cd) cd.style.clipPath = poly(m);
  }
  _endQueue = () => {
    if (this._endRaf) return;
    this._endRaf = requestAnimationFrame(() => {
      this._endRaf = 0;
      this._endUpdate();
    });
  };
  _endUpdate() {
    const sec = this._endSec;
    if (!sec) return;
    const N = PortfolioLogic.ENDORSE.length,
      vh = innerHeight,
      vw = innerWidth,
      r = sec.getBoundingClientRect();
    const span = (N + 1) * vh,
      s = Math.min(1, Math.max(0, -r.top / span)) * (N + 1);
    const cp = Math.min(1, Math.max(0, (-r.top - span) / vh));
    if (r.bottom < -vh || r.top > vh * 2) return;
    const tie = this._endTie;
    // tie descends across the orbit, then rises its tip into the Contact pocket while the card slides up
    if (tie) {
      const tH = tie.offsetHeight,
        tW = tie.offsetWidth,
        k = tH / 3000,
        m = 24;
      const T = vh * 0.3,
        A = T + 215 * k;
      const base = (-(tH - vh) * s) / (N + 1),
        tipY0 = base + 2935 * k;
      const lift = (tipY0 - A) * cp;
      tie.style.transform =
        "translateX(-50%) translateY(" + (base - lift) + "px)";
      const tb = tie.getBoundingClientRect();
      this._pocket(tb.left + (tb.width * 1058) / 2100, A - T, k, m);
    }
    // tie body spans ~38%–62% of the image width; cards orbit just outside its edges
    const tieHalf = tie && tie.offsetWidth ? tie.offsetWidth * 0.12 : 120;
    const R = Math.max(80, tieHalf * (this.props.endOrbit ?? 1.9)),
      tilt = 9 * Math.sin(s * Math.PI * 0.5);
    this._endCards.forEach((el, i) => {
      if (!el) return;
      const ph = s - (i + 1);
      if (Math.abs(ph) >= 1) {
        el.style.visibility = "hidden";
        return;
      }
      const a = ph * 170,
        rad = (a * Math.PI) / 180,
        c = Math.cos(rad);
      const x = R * Math.sin(rad),
        z = R * c - R,
        y = -ph * vh * 0.38;
      el.style.visibility = "visible";
      el.style.zIndex = c >= 0 ? 4 : 1;
      el.style.setProperty(
        "--o",
        Math.min(1, Math.max(0, (c + 0.97) / 0.17)).toFixed(3)
      );
      el.style.transform =
        "perspective(1200px) rotateX(" +
        tilt.toFixed(2) +
        "deg) translate3d(" +
        x.toFixed(1) +
        "px," +
        y.toFixed(1) +
        "px," +
        z.toFixed(1) +
        "px) rotateY(" +
        a.toFixed(2) +
        "deg)";
    });
    const t = this._endTitle;
    if (t) {
      const e = Math.min(1, Math.max(0, (s - 1 + 0.45) / 0.5));
      t.style.clipPath = "inset(0 0 0 " + (e * 100).toFixed(2) + "%)";
    }
  }
  _setMenuBtn = (el) => {
    this._menuBtn = el;
    this._armNav();
  };
  _setMenuPanel = (el) => {
    this._menuPanel = el;
    if (el) el.inert = !this._menuOpen;
  };
  _armNav() {
    if (this._navArmed || !this._menuBtn) return;
    this._navArmed = true;
    this._navScroll = () => {
      if (this._navRaf) return;
      this._navRaf = requestAnimationFrame(() => {
        this._navRaf = 0;
        this._navTheme();
      });
    };
    this._navKey = (e) => {
      if (e.key === "Escape" && this._menuOpen) this._setMenu(false);
    };
    addEventListener("scroll", this._navScroll, { passive: true });
    addEventListener("resize", this._navScroll);
    addEventListener("keydown", this._navKey);
    this._navTheme();
  }
  _navCurrent() {
    const mid = innerHeight * 0.5,
      tp = this._bridgeTp ?? this._tpShown ?? 0;
    if (tp >= 0.5) {
      const w = this._expWrap;
      if (!w || w.getBoundingClientRect().bottom > mid)
        return (this._z || 0) > 0.85 ? "projects" : "experience";
      let cur = "experience";
      for (const [key, , label] of PortfolioLogic.NAV.slice(3)) {
        const el = document.querySelector(
          '[data-screen-label="' + label + '"]'
        );
        if (el && el.getBoundingClientRect().top <= mid) cur = key;
      }
      return cur;
    }
    const st = this._stage;
    if (!st) return "hero";
    const span = Math.max(1, st.offsetHeight - 2 * innerHeight);
    return -st.getBoundingClientRect().top / span > 0.87 ? "about" : "hero";
  }
  _navTheme() {
    const cur = this._navCurrent();
    if (cur === this._navCur) return;
    this._navCur = cur;
    const [mb, ml] = PortfolioLogic.THEME[cur] || PortfolioLogic.THEME.other;
    const s = document.documentElement.style;
    s.setProperty("--mb", mb);
    s.setProperty("--ml", ml);
    document.querySelectorAll("[data-nav-item]").forEach((b) => {
      const on = b.getAttribute("data-nav-item") === cur;
      b.style.opacity = on ? "1" : "";
      const m = b.querySelector("[data-nav-mark]");
      if (m) m.style.width = on ? "20px" : "0px";
    });
  }
  _menuAnim(target) {
    this._mTarget = target;
    if (this._mRaf) return;
    const fr = [17 / 48, 24 / 48, 31 / 48],
      D = 420;
    let last = performance.now();
    const step = (now) => {
      const b = this._menuBtn;
      if (!b) {
        this._mRaf = 0;
        return;
      }
      const dt = Math.min(50, now - last);
      last = now;
      let k = (this._mK || 0) + ((this._mTarget ? 1 : -1) * dt) / D;
      k = Math.min(1, Math.max(0, k));
      this._mK = k;
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      b.querySelector("[data-mfill]").style.clipPath =
        "inset(0 0 " + ((1 - e) * 100).toFixed(2) + "% 0)";
      b.querySelectorAll("[data-mline]").forEach((l, i) => {
        l.style.fill =
          e >= fr[i] ? "var(--mb, var(--navy))" : "var(--ml, #FFFFFF)";
      });
      if (k === (this._mTarget ? 1 : 0)) {
        this._mRaf = 0;
        return;
      }
      this._mRaf = requestAnimationFrame(step);
    };
    this._mRaf = requestAnimationFrame(step);
  }
  _setMenu(open) {
    this._menuOpen = open;
    const p = this._menuPanel,
      bd = document.querySelector("[data-menu-backdrop]"),
      b = this._menuBtn;
    if (p) {
      p.style.transform = open
        ? "translateX(0)"
        : "translateX(calc(100% + 140px))";
      p.inert = !open;
    }
    if (bd) {
      bd.style.opacity = open ? "1" : "0";
      bd.style.pointerEvents = open ? "auto" : "none";
    }
    if (b) {
      b.setAttribute("aria-expanded", String(open));
      b.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  }
  _goTo(key) {
    const y0 = this._bY0,
      T = this._bT;
    let y, tp;
    if (key === "hero") {
      y = 0;
      tp = 0;
    } else if (key === "about") {
      if (y0 == null) return;
      y = y0;
      tp = 0;
    } else if (key === "experience") {
      if (y0 == null) return;
      y = y0 + T;
      tp = 1;
    } else {
      const label = (PortfolioLogic.NAV.find((n) => n[0] === key) || [])[2];
      const el =
        label && document.querySelector('[data-screen-label="' + label + '"]');
      if (!el) return;
      y = el.getBoundingClientRect().top + scrollY;
      tp = 1;
    }
    this._stopSettle();
    clearTimeout(this._settleT);
    this._lockUntil = 0;
    this._revealHold = 0;
    this._tpShown = tp;
    cancelAnimationFrame(this._smRaf);
    this._smRaf = null;
    this._tpSm = tp;
    this._tpGoal = tp;
    this._bridge(tp);
    scrollTo({ top: y, behavior: "instant" });
    this._navCur = null;
    this._navTheme();
    setTimeout(() => this._setMenu(false), 60);
  }
  _bridge(tp) {
    this._bridgeTp = tp;
    this._navTheme();
    const cl = (x) => Math.min(1, Math.max(0, x));
    const ez = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const ss = (t) => t * t * (3 - 2 * t);
    const e1 = ss(cl(tp / 0.8)),
      e2 = ez(cl((tp - 0.35) / 0.65));
    const panel = this._aboutPanel,
      photo = this._aboutPhoto,
      text = this._aboutText,
      sec = this._section,
      slide = this._expSlide;
    const A = [245, 239, 224],
      B = [216, 216, 216];
    if (panel)
      panel.style.background =
        "rgb(" +
        A.map((v, k) => Math.round(v + (B[k] - v) * ez(cl(tp)))).join(",") +
        ")";
    if (photo && text) {
      const dx = -e1 * innerWidth;
      const pr =
        photo.getBoundingClientRect().right - (this._photoDx || 0) + dx;
      photo.style.transform = dx ? "translateX(" + dx + "px)" : "";
      this._photoDx = dx;
      const trc = text.getBoundingClientRect(),
        prc = photo.getBoundingClientRect();
      const overlapY = prc.top < trc.bottom && prc.bottom > trc.top;
      const clip = e1 > 0 && overlapY ? trc.right - prc.left : 0;
      text.style.clipPath =
        clip > 0 ? "inset(-40px " + clip + "px -40px -40px)" : "";
    }
    const tg = this._tpGoal ?? tp,
      done = tp >= 1 || tg >= 1;
    if (sec) {
      sec.style.opacity = tp > 0 || tg > 0 ? "1" : "0";
      sec.style.pointerEvents = done ? "auto" : "none";
      sec.style.background = done ? "#D8D8D8" : "transparent";
    }
    const bw = this._expBgWrap;
    if (bw) {
      const eb = done ? 1 : e2;
      bw.style.opacity = eb.toFixed(3);
      bw.style.transform =
        eb >= 1 ? "" : "translateX(" + ((1 - eb) * 18).toFixed(2) + "%)";
    }
    if (slide)
      slide.style.transform =
        "translateX(" + (tg >= 1 ? 0 : 1 - e2) * 100 + "%)";
    if (done && !this._hdrOn) {
      this._hdrReveal(true);
      this._tlReveal(true);
    } else if (!done && this._hdrOn) {
      this._hdrReveal(false);
      this._tlReveal(false);
    }
    if (tp < 0.7 && !this._hdrOn && this._hdrDirty) this._hdrClear();
  }
  _hdrClear() {
    const h = this._header,
      txt = h && h.querySelector("[data-hdr-text]"),
      bar = h && h.querySelector("[data-hdr-bar]");
    this._hdrDirty = false;
    this._hTok = (this._hTok || 0) + 1;
    if (!txt || !bar) return;
    bar.getAnimations().forEach((x) => x.cancel());
    bar.style.transform = "scaleX(0)";
    txt.style.visibility = "hidden";
  }
  _hdrReveal(on) {
    const h = this._header,
      txt = h && h.querySelector("[data-hdr-text]"),
      bar = h && h.querySelector("[data-hdr-bar]");
    if (!txt || !bar) return;
    this._hdrOn = on;
    this._hdrDirty = true;
    const tok = (this._hTok = (this._hTok || 0) + 1);
    bar.getAnimations().forEach((x) => x.cancel());
    const E = "cubic-bezier(0.76, 0, 0.24, 1)";
    const o1 = on ? "left center" : "right center",
      o2 = on ? "right center" : "left center";
    const a = bar.animate(
      [
        { transform: "scaleX(0)", transformOrigin: o1 },
        { transform: "scaleX(1)", transformOrigin: o1 },
      ],
      { duration: on ? 460 : 180, easing: E, fill: "forwards" }
    );
    a.onfinish = () => {
      if (tok !== this._hTok) return;
      txt.style.visibility = on ? "visible" : "hidden";
      bar.animate(
        [
          { transform: "scaleX(1)", transformOrigin: o2 },
          { transform: "scaleX(0)", transformOrigin: o2 },
        ],
        { duration: on ? 520 : 200, easing: E, fill: "forwards" }
      ).onfinish = () => {
        if (tok === this._hTok && !on) this._hdrDirty = false;
      };
    };
  }
  _setAboutText = (el) => {
    this._aboutText = el;
    this._maybeArmReveal();
  };
  _setAboutMask = (el) => {
    this._aboutMask = el;
    this._maybeArmReveal();
  };

  _maybeArmReveal() {
    if (!this._aboutText || !this._aboutMask || this._revealArmed) return;
    this._revealArmed = true;
    const start = () => this._buildReveal();
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(() => setTimeout(start, 60));
    else setTimeout(start, 200);
  }

  _lineRects(el, rootRect) {
    const out = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.nodeValue;
      const re = /\S+/g;
      let m;
      while ((m = re.exec(text))) {
        const range = document.createRange();
        range.setStart(node, m.index);
        range.setEnd(node, m.index + m[0].length);
        const rc = range.getBoundingClientRect();
        if (!rc.width || !rc.height) continue;
        const last = out[out.length - 1];
        if (last && Math.abs(last.top - rc.top) < rc.height * 0.6) {
          last.left = Math.min(last.left, rc.left);
          last.right = Math.max(last.right, rc.right);
          last.top = Math.min(last.top, rc.top);
          last.bottom = Math.max(last.bottom, rc.bottom);
        } else {
          out.push({
            top: rc.top,
            bottom: rc.bottom,
            left: rc.left,
            right: rc.right,
          });
        }
      }
    }
    return out.map((r) => {
      const h = r.bottom - r.top;
      return {
        x: r.left - rootRect.left - 2,
        y: r.top - rootRect.top - h * 0.18,
        w: r.right - r.left + 6,
        h: h * 1.36,
      };
    });
  }

  _buildReveal() {
    const wrap = this._aboutText,
      mask = this._aboutMask;
    if (!wrap || !mask) return;
    mask.textContent = "";
    const rootRect = wrap.getBoundingClientRect();
    const lines = [];
    wrap.querySelectorAll("[data-reveal]").forEach((el) => {
      for (const r of this._lineRects(el, rootRect)) lines.push(r);
    });
    this._lines = lines.map((r) => {
      const base =
        "position:absolute;left:" +
        r.x +
        "px;top:" +
        r.y +
        "px;width:" +
        r.w +
        "px;height:" +
        r.h +
        "px;";
      const cover = document.createElement("div");
      cover.setAttribute("style", base + "background:var(--cream);");
      const bar = document.createElement("div");
      bar.setAttribute(
        "style",
        base +
          "background:var(--navy);transform:scaleX(0);transform-origin:left center;will-change:transform;"
      );
      mask.appendChild(cover);
      mask.appendChild(bar);
      return { cover, bar };
    });
    this._revealed = false;
    this._stageFrame();
  }

  _playReveal() {
    if (this._revealed || !this._lines || !this._lines.length) return;
    this._revealed = true;
    const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
    const COVER = 460,
      OPEN = 520,
      STAGGER = 85;
    this._revealHold =
      performance.now() +
      (this._lines.length - 1) * STAGGER +
      COVER +
      OPEN +
      80;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this._revealHold = 0;
      this._lines.forEach((l) => {
        l.cover.remove();
        l.bar.remove();
      });
      return;
    }
    this._lines.forEach((l, i) => {
      const delay = i * STAGGER;
      const a = l.bar.animate(
        [
          { transform: "scaleX(0)", transformOrigin: "left center" },
          { transform: "scaleX(1)", transformOrigin: "left center" },
        ],
        { duration: COVER, delay, easing: EASE, fill: "forwards" }
      );
      a.onfinish = () => {
        l.cover.remove();
        const b = l.bar.animate(
          [
            { transform: "scaleX(1)", transformOrigin: "right center" },
            { transform: "scaleX(0)", transformOrigin: "right center" },
          ],
          { duration: OPEN, easing: EASE, fill: "forwards" }
        );
        b.onfinish = () => l.bar.remove();
      };
    });
  }

  _setSection = (el) => {
    if (this._section === el) return;
    if (this._section)
      this._section.removeEventListener("wheel", this._onWheel);
    this._section = el;
    if (el) el.addEventListener("wheel", this._onWheel, { passive: false });
    this._checkInView();
  };
  _setScroller = (el) => {
    this._scroller = el;
  };
  _setHeader = (el) => {
    this._header = el;
    if (el) this._measureHeader();
  };
  _measureHeader = () => {
    const el = this._header;
    if (!el) return;
    const bottom = el.offsetTop + el.offsetHeight + 32;
    if (bottom !== this.state.headerBottom)
      this.setState({ headerBottom: bottom });
  };

  _onWheel = () => {};
  _tlReveal(on) {
    if (this.state.expanded !== null) return;
    const tok = (this._mTok = (this._mTok || 0) + 1);
    (this._mT || []).forEach(clearTimeout);
    if (!on) {
      this.setState({ phase: "out", rail: false });
      this._mT = [];
      return;
    }
    this.setState({ rail: true });
    this._mT = [
      setTimeout(() => {
        if (tok === this._mTok) this.setState({ phase: "in" });
      }, 450),
    ];
  }
  _morph(mode, after, onExtend) {
    const tok = (this._mTok = (this._mTok || 0) + 1);
    const ok = () => tok === this._mTok;
    (this._mT || []).forEach(clearTimeout);
    const at = (ms, fn) =>
      setTimeout(() => {
        if (ok()) fn();
      }, ms);
    const t1 = mode === "v" ? 620 : 420;
    this.setState({ phase: "out" });
    this._mT = [
      at(t1, () => this.setState({ rail: false })),
      at(t1 + 450, () => {
        this.setState({ mode });
        after && after();
      }),
      at(t1 + 750, () => {
        this.setState({ rail: true });
        onExtend && onExtend();
      }),
      at(t1 + 1200, () => this.setState({ phase: "in" })),
    ];
  }
  _descEl(i) {
    return this._section && i != null
      ? this._section.querySelector('[data-desc="d' + i + '"]')
      : null;
  }
  _descLines(el) {
    const wrap = el.querySelector("[data-desc-text]"),
      mask = el.querySelector("[data-desc-mask]");
    mask.textContent = "";
    const root = wrap.getBoundingClientRect();
    const out = [];
    wrap.querySelectorAll("[data-reveal]").forEach((p) => {
      const pr = p.getBoundingClientRect(),
        ox = pr.left - root.left,
        oy = pr.top - root.top;
      const st = { p, rects: [], on: [] };
      const apply = () => {
        if (st.on.every(Boolean)) {
          p.style.clipPath = "";
          return;
        }
        const d = st.rects
          .filter((_, k) => st.on[k])
          .map(
            (r) =>
              "M" +
              (r.x - ox - 2) +
              " " +
              (r.y - oy - 2) +
              "h" +
              (r.w + 4) +
              "v" +
              (r.h + 4) +
              "h" +
              -(r.w + 4) +
              "z"
          )
          .join(" ");
        p.style.clipPath = d ? "path('" + d + "')" : "inset(50%)";
      };
      for (const r of this._lineRects(p, root)) {
        const k = st.rects.length;
        st.rects.push(r);
        st.on.push(false);
        const bar = document.createElement("div");
        bar.setAttribute(
          "style",
          "position:absolute;left:" +
            r.x +
            "px;top:" +
            r.y +
            "px;width:" +
            r.w +
            "px;height:" +
            r.h +
            "px;background:var(--navy);transform:scaleX(0);"
        );
        mask.appendChild(bar);
        out.push({
          bar,
          cover: {
            remove: () => {
              st.on[k] = true;
              apply();
            },
            show: () => {
              st.on[k] = false;
              apply();
            },
          },
        });
      }
      apply();
    });
    return out;
  }
  _descReset(el) {
    if (!el) return;
    el.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    const m = el.querySelector("[data-desc-mask]");
    if (m) m.textContent = "";
    el.querySelectorAll("[data-desc-text] [data-reveal]").forEach((p) => {
      p.style.clipPath = "";
    });
  }
  _showDesc(i) {
    const tok = (this._dTok = (this._dTok || 0) + 1);
    this._descReset(this._descEl(this.state.shown));
    this.setState({ shown: i }, () => {
      const el = this._descEl(i);
      if (!el || tok !== this._dTok) return;
      this._descReset(el);
      const sc = el.querySelector("[data-detail-scroll]");
      if (sc) sc.scrollTop = 0;
      const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
      const photo = el.querySelector("[data-desc-photo]");
      photo.animate(
        [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }],
        { duration: 700, easing: EASE, fill: "forwards" }
      );
      const lines = this._descLines(el);
      lines.forEach((l, k) => {
        const a = l.bar.animate(
          [
            { transform: "scaleX(0)", transformOrigin: "left center" },
            { transform: "scaleX(1)", transformOrigin: "left center" },
          ],
          {
            duration: 420,
            delay: 200 + Math.min(k, 10) * 70,
            easing: EASE,
            fill: "forwards",
          }
        );
        a.onfinish = () => {
          if (tok !== this._dTok) return;
          l.cover.remove();
          const b = l.bar.animate(
            [
              { transform: "scaleX(1)", transformOrigin: "right center" },
              { transform: "scaleX(0)", transformOrigin: "right center" },
            ],
            { duration: 460, easing: EASE, fill: "forwards" }
          );
          b.onfinish = () => l.bar.remove();
        };
      });
    });
  }
  _hideDesc(cb) {
    const tok = (this._dTok = (this._dTok || 0) + 1);
    const i = this.state.shown,
      el = this._descEl(i);
    if (!el) {
      cb && cb();
      return;
    }
    this._descReset(el);
    const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
    el.querySelector("[data-desc-photo]").animate(
      [{ clipPath: "inset(0 0 0% 0)" }, { clipPath: "inset(0 0 100% 0)" }],
      { duration: 600, easing: EASE, fill: "forwards" }
    );
    const lines = this._descLines(el);
    lines.forEach((l) => l.cover.remove());
    const n = lines.length;
    let left = n,
      done = () => {
        if (tok === this._dTok && --left <= 0) {
          this.setState({ shown: null });
          cb && cb();
        }
      };
    if (!n) {
      setTimeout(() => {
        left = 0;
        done();
      }, 600);
      return;
    }
    lines.forEach((l, k) => {
      const a = l.bar.animate(
        [
          { transform: "scaleX(0)", transformOrigin: "right center" },
          { transform: "scaleX(1)", transformOrigin: "right center" },
        ],
        {
          duration: 320,
          delay: Math.min(n - 1 - k, 10) * 45,
          easing: EASE,
          fill: "forwards",
        }
      );
      a.onfinish = () => {
        if (tok !== this._dTok) return;
        l.cover.show();
        const b = l.bar.animate(
          [
            { transform: "scaleX(1)", transformOrigin: "left center" },
            { transform: "scaleX(0)", transformOrigin: "left center" },
          ],
          { duration: 340, easing: EASE, fill: "forwards" }
        );
        b.onfinish = done;
      };
    });
  }
  _setZoom = (el) => {
    this._zoomEl = el;
  };
  _setZoomOv = (el) => {
    this._zoomOv = el;
  };
  _setZoomTxt = (el) => {
    this._zoomTxt = el;
  };
  _applyZoom(z) {
    const zw = this._zoomEl,
      ov = this._zoomOv,
      sec = this._section;
    if (!zw || !ov || !sec) return;
    this._z = z;
    if (z <= 0) {
      if (this._zOn) {
        const t0 = this._zoomTxt,
          o0 = sec.querySelector("[data-sg]");
        if (t0) t0.style.visibility = "hidden";
        if (o0) o0.style.visibility = "";
        zw.style.opacity = "";
        zw.style.transform = "";
        ov.style.visibility = "hidden";
        ov.style.clipPath = "circle(0px at 0px 0px)";
        this._zOn = false;
        this._zS = 1;
        this._navTheme && this._navTheme();
      }
      return;
    }
    const dot = sec.querySelector("[data-sg-dot]"),
      txt = sec.querySelector("[data-sg]");
    if (!dot || !txt) return;
    const sr = sec.getBoundingClientRect(),
      dr = dot.getBoundingClientRect();
    const s0 = this._zOn ? this._zS || 1 : 1,
      O = this._zOn ? this._zO || [0, 0] : [0, 0];
    const cx = (dr.left + dr.width / 2 - sr.left - O[0]) / s0 + O[0];
    const cy = (dr.top + dr.height / 2 - sr.top - O[1]) / s0 + O[1];
    const dotR = dr.width / 2 / s0,
      tw = txt.offsetWidth || 170;
    if (!this._zOn) {
      const tr = txt.getBoundingClientRect();
      this._zD = [
        dr.left + dr.width / 2 - tr.left,
        dr.top + dr.height / 2 - tr.top,
      ];
    }
    const sw = sec.clientWidth,
      sh = sec.clientHeight;
    const S1 = Math.max(2, (sw * 0.82) / tw),
      SA = 0.62,
      K = 3;
    const ez = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    let s, r;
    if (z <= SA) {
      s = Math.pow(S1, ez(z / SA));
      r = dotR * s;
    } else {
      const b = ez((z - SA) / (1 - SA));
      s = S1 * Math.pow(K, b);
      const diag =
        Math.hypot(Math.max(cx, sw - cx), Math.max(cy, sh - cy)) * 1.05;
      r = dotR * S1 * Math.pow(diag / (dotR * S1), b);
    }
    this._zO = [cx, cy];
    this._zS = s;
    this._zOn = true;
    zw.style.transformOrigin = cx + "px " + cy + "px";
    zw.style.transform = "scale(" + s + ")";
    zw.style.opacity = String(Math.max(0, 1 - z / 0.35));
    const zt = this._zoomTxt,
      D = this._zD || [0, 0];
    if (zt) {
      txt.style.visibility = "hidden";
      zt.style.visibility = "visible";
      zt.style.fontSize = 24 * s + "px";
      zt.style.transform =
        "translate(" + (cx - D[0] * s) + "px, " + (cy - D[1] * s) + "px)";
    }
    ov.style.visibility = "visible";
    ov.style.clipPath = "circle(" + r + "px at " + cx + "px " + cy + "px)";
    if (this._navTheme) this._navTheme();
  }
  _measureSG = () => {
    const e = this._section && this._section.querySelector("[data-sg]");
    if (
      e &&
      e.offsetWidth &&
      Math.abs(e.offsetWidth - (this._sgW || 0)) > 0.5
    ) {
      this._sgW = e.offsetWidth;
      this.forceUpdate();
    }
  };
  _setExpWrap = (el) => {
    this._expWrap = el;
    this._expScroll();
  };
  _expScroll = () => {
    const w = this._expWrap;
    if (!w) return;
    const vh = document.documentElement.clientHeight;
    const zl = this._zl || Math.round(innerHeight * 1.6);
    const len = w.offsetHeight - vh - innerHeight - zl;
    const sc = -w.getBoundingClientRect().top - innerHeight;
    const p = len > 0 ? Math.max(0, Math.min(1, sc / len)) : 0;
    if (Math.abs(p - (this.state.expP || 0)) > 0.0005)
      this.setState({ expP: p });
    this._applyZoom(Math.max(0, Math.min(1, (sc - Math.max(0, len)) / zl)));
    this._zFollowUntil = performance.now() + 450;
    if (!this._zFollow) {
      const step = () => {
        if (this._z > 0) this._applyZoom(this._z);
        this._zFollow =
          performance.now() < this._zFollowUntil
            ? requestAnimationFrame(step)
            : 0;
      };
      this._zFollow = requestAnimationFrame(step);
    }
  };
  _scrollToRole(date) {
    const w = this._expWrap,
      v = this._toV;
    if (!w || !v) return;
    const target =
      v.maxV > 0
        ? Math.max(0, Math.min(1, (v.Y(date) - v.vpH * 0.4) / v.maxV))
        : 0;
    const len =
      w.offsetHeight -
      document.documentElement.clientHeight -
      innerHeight -
      (this._zl || 0);
    window.scrollTo({
      top:
        w.getBoundingClientRect().top +
        window.scrollY +
        innerHeight +
        target * len,
      behavior: "instant",
    });
  }

  _checkInView = () => {
    const sec = this._section;
    if (!sec) return;
    const vh = document.documentElement.clientHeight;
    const r = sec.getBoundingClientRect();
    this._expScroll();
    const inView = r.top < vh * 0.5 && r.bottom > vh * 0.5;
    if (inView !== this.state.inView) {
      this.setState(inView ? { inView } : { inView, hovered: null });
    }
  };

  sil1Ref = React.createRef();
  sil2Ref = React.createRef();
  _introHeroImages() {
    const a = this.sil1Ref.current,
      b = this.sil2Ref.current;
    if (!a || !b) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const opts = (delay, duration, easing) => ({
      delay: reduce ? 0 : delay,
      duration: reduce ? 1 : duration,
      easing,
      fill: "forwards",
    });
    a.animate(
      [{ transform: "translateY(101%)" }, { transform: "translateY(0)" }],
      opts(this.props.sil1Delay ?? 1600, 1300, "cubic-bezier(.22,.8,.3,1)")
    );
    b.animate(
      [{ transform: "translateX(100vw)" }, { transform: "translateX(0)" }],
      opts(this.props.sil2Delay ?? 1850, 1500, "cubic-bezier(.2,.75,.25,1)")
    );
  }
  tagRef = React.createRef();
  _introTag() {
    const el = this.tagRef.current;
    if (!el) return;
    const text = el.querySelector("[data-tag-text]"),
      bar = el.querySelector("[data-tag-bar]");
    const done = () => {
      text.style.opacity = 1;
      bar.remove();
      this._tagReady = true;
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return done();
    const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
    const a = bar.animate(
      [
        { transform: "scaleX(0)", transformOrigin: "left center" },
        { transform: "scaleX(1)", transformOrigin: "left center" },
      ],
      {
        duration: 460,
        delay: this.props.tagDelay ?? 2600,
        easing: EASE,
        fill: "forwards",
      }
    );
    a.onfinish = () => {
      text.style.opacity = 1;
      const b = bar.animate(
        [
          { transform: "scaleX(1)", transformOrigin: "right center" },
          { transform: "scaleX(0)", transformOrigin: "right center" },
        ],
        { duration: 520, easing: EASE, fill: "forwards" }
      );
      b.onfinish = done;
    };
  }
  _tagRoll = () => {
    if (!this._tagReady || this._tagRolling) return;
    const cubes = this.tagRef.current.querySelectorAll("[data-cube]");
    this._tagRolling = true;
    const stagger = this.props.tagStagger ?? 35;
    cubes.forEach((c, i) => {
      const an = c.animate(
        [{ transform: "rotateX(0deg)" }, { transform: "rotateX(90deg)" }],
        {
          duration: 560,
          delay: i * stagger,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
        }
      );
      if (i === cubes.length - 1)
        an.onfinish = () => {
          this._tagRolling = false;
        };
    });
  };
  _headRoll = (e) => {
    const el = e.currentTarget;
    if (!el || el.dataset.rolling === "1") return;
    const cubes = el.querySelectorAll("[data-cube]");
    if (!cubes.length) return;
    el.dataset.rolling = "1";
    const f2 = el.querySelectorAll("[data-face2]");
    f2.forEach((f) => {
      f.style.opacity = "1";
    });
    const stagger = this.props.tagStagger ?? 35;
    cubes.forEach((c, i) => {
      const an = c.animate(
        [{ transform: "rotateX(0deg)" }, { transform: "rotateX(90deg)" }],
        {
          duration: 560,
          delay: i * stagger,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
        }
      );
      if (i === cubes.length - 1)
        an.onfinish = () => {
          el.dataset.rolling = "";
          f2.forEach((f) => {
            f.style.opacity = "";
          });
        };
    });
  };
  static PROJECTS = projects;
  static TOOLS = tools;
  _tx = 0;
  _tv = 0;
  _tBoost = 0;
  _tDir = 1;
  _setToolBelt = (el) => {
    if (this._tBelt === el) return;
    this._teardownToolBelt();
    this._tBelt = el;
    if (!el) return;
    this._tTrack = el.querySelector("[data-tool-track]");
    this._toolWheel = (e) => {
      const dy =
        e.deltaY *
          (e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? innerHeight : 1) ||
        e.deltaX;
      if (!dy || this._menuOpen) return;
      e.preventDefault();
      e.stopPropagation();
      this._tDir = Math.sign(dy);
      this._tBoost = Math.max(-3200, Math.min(3200, this._tBoost + dy * 9));
    };
    el.addEventListener("wheel", this._toolWheel, { passive: false });
    this._tlDown = (e) => {
      if (e.button !== 0) return;
      this._tDrag = {
        id: e.pointerId,
        x: e.clientX,
        t: performance.now(),
        vx: 0,
      };
      this._tBoost = 0;
      this._tv = 0;
      try {
        el.setPointerCapture(e.pointerId);
      } catch (_) {}
      el.style.cursor = "grabbing";
    };
    this._tlMove = (e) => {
      const d = this._tDrag;
      if (!d || e.pointerId !== d.id) return;
      const now = performance.now(),
        dx = e.clientX - d.x,
        dtt = Math.max(1, now - d.t) / 1000;
      this._tx += dx;
      d.vx = d.vx * 0.6 + (dx / dtt) * 0.4;
      d.x = e.clientX;
      d.t = now;
    };
    this._tlUp = (e) => {
      const d = this._tDrag;
      if (!d || e.pointerId !== d.id) return;
      this._tDrag = null;
      el.style.cursor = "grab";
      const v = performance.now() - d.t > 120 ? 0 : d.vx;
      if (Math.abs(v) > 20) this._tDir = Math.sign(v);
      this._tBoost = Math.max(-3200, Math.min(3200, v));
    };
    el.addEventListener("pointerdown", this._tlDown);
    el.addEventListener("pointermove", this._tlMove);
    el.addEventListener("pointerup", this._tlUp);
    el.addEventListener("pointercancel", this._tlUp);
    el.addEventListener(
      "dragstart",
      (this._tlDrag0 = (e) => e.preventDefault())
    );
    this._toolResize = () => {
      this._tW = this._tTrack ? this._tTrack.scrollWidth / 3 : 0;
    };
    addEventListener("resize", this._toolResize);
    this._toolResize();
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(this._toolResize);
    this._toolIO = new IntersectionObserver(([en]) => {
      this._tOn = en.isIntersecting;
      if (this._tOn && !this._tRaf) {
        this._tT = performance.now();
        this._tRaf = requestAnimationFrame(this._toolLoop);
      }
    });
    this._toolIO.observe(el);
  };
  _teardownToolBelt() {
    if (!this._tBelt) return;
    this._tBelt.removeEventListener("wheel", this._toolWheel);
    ["pointerdown", "pointermove", "pointerup", "pointercancel"].forEach(
      (n, i) =>
        this._tBelt.removeEventListener(
          n,
          [this._tlDown, this._tlMove, this._tlUp, this._tlUp][i]
        )
    );
    this._tBelt.removeEventListener("dragstart", this._tlDrag0);
    removeEventListener("resize", this._toolResize);
    if (this._toolIO) this._toolIO.disconnect();
    cancelAnimationFrame(this._tRaf);
    this._tRaf = null;
  }
  _toolLoop = (t) => {
    if (!this._tOn || !this._tTrack) {
      this._tRaf = null;
      return;
    }
    const dt = Math.min(0.05, (t - this._tT) / 1000);
    this._tT = t;
    if (!this._tW) this._toolResize();
    if (!this._tDrag) {
      const target = this._tDir * (this.props.toolSpeed ?? 26);
      this._tv += (target - this._tv) * (1 - Math.exp(-dt * 2.5));
      this._tBoost *= Math.exp(-dt * 3.5);
      this._tx += (this._tv + this._tBoost) * dt;
    }
    const W = this._tW || 1,
      pos = ((this._tx % W) + W) % W;
    this._tTrack.style.transform = "translate3d(" + (pos - W) + "px, 0, 0)";
    this._tRaf = requestAnimationFrame(this._toolLoop);
  };
  static CERTS = certifications;
  _cPos = 0;
  _cTarget = 0;
  _cHover = null;
  _cHoldUntil = 0;
  _cLast = 0;
  _cIntro = -1;
  _setCertStage = (el) => {
    if (this._cStage === el) return;
    this._teardownCerts();
    this._cStage = el;
    if (!el) return;
    this._cCards = [...el.querySelectorAll("[data-cert]")];
    this._cH = this._cCards.map(() => 0);
    this._cCards.forEach((c, i) => {
      c.addEventListener("pointerenter", () => {
        if (!this._cDown) this._cHover = i;
      });
      c.addEventListener("pointerleave", () => {
        if (this._cHover === i) this._cHover = null;
      });
    });
    this._cOnDown = (e) => {
      if (e.button !== 0 || (e.target.closest && e.target.closest("a"))) return;
      const card = e.target.closest && e.target.closest("[data-cert]");
      this._cDown = {
        x: e.clientX,
        start: this._cTarget,
        card: card ? +card.getAttribute("data-cert") : null,
        moved: 0,
        id: e.pointerId,
      };
      el.style.cursor = "grabbing";
    };
    this._cOnMove = (e) => {
      const d = this._cDown;
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x;
      d.moved = Math.max(d.moved, Math.abs(dx));
      if (d.moved > 6) {
        if (!d.cap) {
          try {
            el.setPointerCapture(e.pointerId);
          } catch (_) {}
          d.cap = true;
          this._cHover = null;
        }
        this._cTarget = d.start - dx / this._cStep();
        this._cPos = this._cTarget;
      }
    };
    this._cOnUp = (e) => {
      const d = this._cDown;
      if (!d || e.pointerId !== d.id) return;
      this._cDown = null;
      el.style.cursor = "grab";
      if (d.moved <= 6 && d.card != null) {
        this._cTarget =
          Math.round(this._cTarget) +
          Math.round(this._cK(d.card, Math.round(this._cTarget)));
      } else this._cTarget = Math.round(this._cTarget);
      this._cHoldUntil = performance.now() + 10000;
      this._cLast = performance.now();
    };
    this._cOnWheel = (e) => {
      if (!this._cDown) return;
      e.preventDefault();
      e.stopPropagation();
      this._cDown.moved = 99;
      this._cWheelAcc = (this._cWheelAcc || 0) + e.deltaY;
      if (Math.abs(this._cWheelAcc) > 60) {
        this._cTarget = Math.round(this._cTarget) + Math.sign(this._cWheelAcc);
        this._cWheelAcc = 0;
        this._cDown.start = this._cTarget;
        this._cDown.x = e.clientX;
      }
    };
    el.addEventListener("pointerdown", this._cOnDown);
    addEventListener("pointermove", this._cOnMove);
    addEventListener("pointerup", this._cOnUp);
    addEventListener("pointercancel", this._cOnUp);
    el.addEventListener("wheel", this._cOnWheel, { passive: false });
    this._cIO = new IntersectionObserver(
      ([en]) => {
        this._cOn = en.isIntersecting;
        if (this._cOn && this._cIntro < 0 && en.intersectionRatio > 0.35)
          this._cIntro = performance.now();
        if (this._cOn && !this._cRaf) {
          this._cT = performance.now();
          this._cLast = this._cT;
          this._cRaf = requestAnimationFrame(this._certLoop);
        }
      },
      { threshold: [0, 0.35, 0.6] }
    );
    this._cIO.observe(el);
  };
  _teardownCerts() {
    if (!this._cStage) return;
    this._cStage.removeEventListener("pointerdown", this._cOnDown);
    this._cStage.removeEventListener("wheel", this._cOnWheel);
    removeEventListener("pointermove", this._cOnMove);
    removeEventListener("pointerup", this._cOnUp);
    removeEventListener("pointercancel", this._cOnUp);
    if (this._cIO) this._cIO.disconnect();
    cancelAnimationFrame(this._cRaf);
    this._cRaf = null;
  }
  _cW() {
    const c = this._cCards && this._cCards[0];
    return c ? c.offsetWidth : 440;
  }
  _cStep() {
    return this._cW() * 0.34;
  }
  _cK(i, pos) {
    const N = this._cCards.length;
    let k = (((i - pos) % N) + N) % N;
    if (k >= N / 2) k -= N;
    return k;
  }
  _certLoop = (t) => {
    if (!this._cOn || !this._cCards) {
      this._cRaf = null;
      return;
    }
    const dt = Math.min(0.05, (t - this._cT) / 1000);
    this._cT = t;
    const busy = this._cDown || this._cHover !== null;
    if (
      this._cIntro >= 0 &&
      !busy &&
      t > this._cHoldUntil &&
      t - this._cLast > 4000 &&
      t - this._cIntro > 2400
    ) {
      this._cTarget = Math.round(this._cTarget) + 1;
      this._cLast = t;
    }
    if (busy) this._cLast = t;
    if (!this._cDown)
      this._cPos += (this._cTarget - this._cPos) * (1 - Math.exp(-dt * 7));
    const W = this._cW(),
      N = this._cCards.length;
    const ip = this._cIntro < 0 ? 0 : Math.min(1, (t - this._cIntro) / 1700);
    const e3 = (x) => 1 - Math.pow(1 - x, 3),
      eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const hv = this._cHover;
    this._cH = this._cH.map(
      (v, i) => v + ((hv === i ? 1 : 0) - v) * (1 - Math.exp(-dt * 10))
    );
    if (hv !== null) this._cHL = hv;
    const hl = this._cHL ?? null,
      kh = hl !== null ? this._cK(hl, this._cPos) : 0,
      H = hl !== null ? this._cH[hl] : 0;
    this._cCards.forEach((c, i) => {
      const k0 = this._cK(i, this._cPos),
        a = Math.abs(k0);
      const rise = e3(Math.min(1, ip / 0.45)),
        fan = eio(Math.max(0, Math.min(1, (ip - 0.4) / 0.6)));
      const k = k0 * fan,
        ak = Math.abs(k),
        sg = Math.sign(k);
      const hi = this._cH[i];
      let x = sg * (ak <= 1 ? ak * W * 0.36 : W * 0.36 + (ak - 1) * W * 0.26);
      let y = k * k * 14 + (1 - rise) * 220;
      let rot = k * 7 * (1 - hi);
      let sc = (1 - Math.min(ak, 2.5) * 0.09) * (1 + 0.1 * hi);
      if (hl !== null && hl !== i)
        x += Math.sign(k0 - kh || (i < hl ? -1 : 1)) * W * 0.14 * H * fan;
      y *= 1 - hi;
      const op = Math.max(0, Math.min(1, (2.5 - a) * 2)) * rise;
      c.style.transform =
        "translate3d(" +
        x.toFixed(2) +
        "px, " +
        y.toFixed(2) +
        "px, 0) rotate(" +
        rot.toFixed(3) +
        "deg) scale(" +
        sc.toFixed(4) +
        ")";
      c.style.opacity = op.toFixed(3);
      c.style.zIndex = String(hi > 0.5 ? 200 : 100 - Math.round(a * 10));
      c.style.pointerEvents = op < 0.2 ? "none" : "";
    });
    this._cRaf = requestAnimationFrame(this._certLoop);
  };
  _rot = 0;
  _rotT = 0;
  _pjShownIdx = null;
  _pjTarget = null;
  _magN() {
    return PortfolioLogic.PROJECTS.length;
  }
  _magSlots() {
    const N = this._magN();
    return N * Math.max(1, Math.ceil(8 / N));
  }
  _magStep() {
    return 360 / this._magSlots();
  }
  _magIdx(rot) {
    const N = this._magN(),
      k = Math.round(rot / this._magStep());
    return ((k % N) + N) % N;
  }
  _setPjRow = (el) => {
    this._pjRow = el;
    if (el) this._magLayout();
  };
  _setPjDesc = (el) => {
    if (this._pjDesc === el) return;
    if (this._pjIO) this._pjIO.disconnect();
    this._pjDesc = el;
    if (!el) return;
    this._pjShownIdx = null;
    this._pjTarget = null;
    this._pjIO = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting) && this._pjShownIdx === null) {
          this._pjIO.disconnect();
          this._startIntro();
        }
      },
      { threshold: 0.2 }
    );
    this._pjIO.observe(el);
    this._magLayout();
    if (!this._pjScroll) {
      this._pjScroll = () => this._pjCheck();
      addEventListener("scroll", this._pjScroll, { passive: true });
    }
    setTimeout(() => this._pjCheck(), 300);
  };
  _pjCheck() {
    if (this._pjShownIdx !== null || !this._pjDesc) return;
    const r = this._pjDesc.getBoundingClientRect();
    if (r.top < innerHeight * 0.85 && r.bottom > innerHeight * 0.15)
      this._startIntro();
  }
  _setMag = (el) => {
    if (this._mag === el) return;
    this._teardownMag();
    this._mag = el;
    if (!el) return;
    this._rotor = el.querySelector("[data-rotor]");
    el.tabIndex = 0;
    this._magResize = () => this._magLayout();
    addEventListener("resize", this._magResize);
    this._magRO = new ResizeObserver((es) => {
      const w = Math.round(es[0].contentRect.width);
      if (w === this._magROW) return;
      this._magROW = w;
      this._magLayout();
    });
    this._magRO.observe(el.parentElement || el);
    el.addEventListener("pointerdown", this._magDown);
    el.addEventListener("keydown", this._magKey);
    this._magLayout();
    setTimeout(() => this._magLayout(), 0);
    setTimeout(() => this._magLayout(), 250);
  };
  _teardownMag() {
    if (!this._mag) return;
    removeEventListener("resize", this._magResize);
    if (this._magRO) this._magRO.disconnect();
    this._mag.removeEventListener("pointerdown", this._magDown);
    this._mag.removeEventListener("keydown", this._magKey);
    cancelAnimationFrame(this._magRaf);
    this._magRaf = 0;
  }
  _magLayout() {
    const m = this._mag;
    if (!m) return;
    const vw = innerWidth || document.documentElement.clientWidth;
    if (!vw || !innerHeight) {
      clearTimeout(this._magLT);
      this._magLT = setTimeout(() => this._magLayout(), 60);
      return;
    }
    const wide = vw >= 900;
    let R, TL, TH;
    if (wide) {
      R = Math.max(170, Math.min(360, vw * 0.19));
      TL = Math.max(210, Math.min(290, vw * 0.15));
      TH = 76;
    } else {
      R = Math.min(190, vw * 0.32);
      TL = Math.min(200, vw * 0.4);
      TH = 58;
    }
    const H = wide ? Math.max(600, innerHeight - 240) : 0;
    if (wide) R = Math.min(R, H / 2 - 16);
    const LL = wide ? this._kickLabLeft() : 0;
    if (LL) TL = Math.max(120, Math.min(TL, LL - 24 - R - 32 - 16));
    const B = Math.max(40, R * 0.28),
      hL = B * 0.72,
      tw = hL * 0.6,
      bw = hL * 1.62,
      S = this._magSlots(),
      st = 360 / S;
    this._mg = { B, TL, TH, R, hL, tw };
    m.style.setProperty("--R", R + "px");
    m.style.setProperty("--B", B + "px");
    m.style.setProperty("--TL", TL + "px");
    m.style.setProperty("--TH", TH + "px");
    m.style.height = Math.round(wide ? H : 2 * (R + hL) + 48) + "px";
    const rad = Math.PI / 180,
      f = (n) => n.toFixed(2);
    const circ = (cx, cy, r, sw) =>
      "M" +
      f(cx + r) +
      " " +
      f(cy) +
      "A" +
      f(r) +
      " " +
      f(r) +
      " 0 1 " +
      sw +
      " " +
      f(cx - r) +
      " " +
      f(cy) +
      "A" +
      f(r) +
      " " +
      f(r) +
      " 0 1 " +
      sw +
      " " +
      f(cx + r) +
      " " +
      f(cy) +
      "Z";
    let ring = circ(0, 0, R, 1) + circ(0, 0, R - B, 0);
    const x0 = Math.sqrt(R * R - bw * bw);
    for (let k = 0; k < S; k++) {
      const a = -k * st * rad,
        ca = Math.cos(a),
        sa = Math.sin(a),
        q = (x, y) => f(x * ca - y * sa) + " " + f(x * sa + y * ca);
      const xt = R + hL,
        yb = bw,
        xc = Math.sqrt(R * R - yb * yb);
      const qa = (x, y) => [x * ca - y * sa, x * sa + y * ca];
      const Em = qa(xc, -yb),
        Tm = qa(xt, -tw),
        Tp = qa(xt, tw),
        Ep = qa(xc, yb);
      const arc = (P, Q, E, T) => {
        const ex = E[0] / R,
          ey = E[1] / R,
          dxT = T[0] - E[0],
          dyT = T[1] - E[1],
          rho = (dxT * dxT + dyT * dyT) / (2 * (dxT * ex + dyT * ey)),
          Fx = E[0] + ex * rho,
          Fy = E[1] + ey * rho,
          cr = (P[0] - Fx) * (Q[1] - Fy) - (P[1] - Fy) * (Q[0] - Fx);
        return (
          "A" +
          f(rho) +
          " " +
          f(rho) +
          " 0 0 " +
          (cr > 0 ? 1 : 0) +
          " " +
          f(Q[0]) +
          " " +
          f(Q[1])
        );
      };
      ring +=
        "M" +
        q(xc - B * 0.3, -yb * 0.92) +
        "L" +
        q(xc, -yb) +
        arc(Em, Tm, Em, Tm) +
        "L" +
        q(xt, tw) +
        arc(Tp, Ep, Ep, Tp) +
        "L" +
        q(xc - B * 0.3, yb * 0.92) +
        "Z";
    }
    const rp = m.querySelector("[data-ring-path]");
    if (rp) rp.setAttribute("d", ring);
    const w = 22,
      Ra = R + hL + 14 + w;
    const ttl = this._pjRow && this._pjRow.previousElementSibling,
      fs = ttl ? parseFloat(getComputedStyle(ttl).fontSize) || 160 : 160;
    const colH = wide ? H : 2 * (R + hL) + 48,
      tabTop = Math.max(0, colH / 2 - (R + hL));
    if (this._pjRow) {
      this._pjRow.style.marginTop = -Math.round(0.24 * fs + tabTop) + "px";
      this._pjRow.style.gridTemplateColumns = wide
        ? Math.round(LL ? LL - 24 : Math.max(R + TL + 56, Ra + w + 24)) +
          "px minmax(0, 1fr)"
        : "minmax(0, 1fr)";
    }
    const P = (r, a) =>
      f(r * Math.cos(a * rad)) + " " + f(r * Math.sin(a * rad));
    this._arw = {
      Ra,
      ab: Math.asin(Math.min(0.9, (TH / 2 + 8 + 16 + 22) / Ra)) / rad,
    };
    this._introX = R + hL + 60;
    if (!this._introDone && !this._introRun) {
      const tx = -this._introX + "px 0",
        nm = m.querySelector("[data-mag-num]");
      if (this._rotor) this._rotor.style.translate = tx;
      if (nm) nm.style.translate = tx;
      this._arrowK = 0;
    }
    this._magArrows();
    this._rotor &&
      this._rotor.querySelectorAll("[data-card]").forEach((c) => {
        c.dataset.p = "";
      });
    this._magPaint();
    const upS = m.querySelector('[data-mag-arrow="1"] [data-btn]'),
      f0 =
        ttl &&
        ttl.dataset.rolling !== "1" &&
        ttl.querySelector("[data-cube] > span:first-child");
    if (upS && f0 && this._pjRow) {
      const mk = document.createElement("span");
      mk.style.cssText = "display:inline-block;width:0;height:0";
      f0.appendChild(mk);
      const baseY = mk.getBoundingClientRect().top;
      mk.remove();
      const k0 = this._arrowK;
      this._arrowK = 1;
      this._magArrows();
      const need = baseY + 12 - upS.getBoundingClientRect().top;
      this._arrowK = k0;
      this._magArrows();
      if (need > 0)
        this._pjRow.style.marginTop =
          Math.round(parseFloat(this._pjRow.style.marginTop || "0") + need) +
          "px";
    }
    this._pjKicker();
    this._pjCheck();
  }
  _magArrows() {
    const m = this._mag,
      A = this._arw;
    if (!m || !A) return;
    const k = this._arrowK ?? 1,
      rad = Math.PI / 180,
      f = (n) => n.toFixed(2);
    m.querySelectorAll("[data-mag-arrow]").forEach((g) => {
      const dir = +g.dataset.magArrow,
        a = (dir > 0 ? -A.ab : A.ab) * k * rad;
      const cx = A.Ra * Math.cos(a),
        cy = A.Ra * Math.sin(a);
      const rot =
        Math.atan2(
          dir > 0 ? -Math.cos(a) : Math.cos(a),
          dir > 0 ? Math.sin(a) : -Math.sin(a)
        ) / rad;
      const c = g.querySelector("[data-btn]");
      c.setAttribute("cx", f(cx));
      c.setAttribute("cy", f(cy));
      g.querySelector("[data-arrow]").setAttribute(
        "transform",
        "translate(" + f(cx) + " " + f(cy) + ") rotate(" + f(rot) + ")"
      );
      g.style.opacity = k >= 1 ? "" : Math.min(1, k * 2).toFixed(3);
      g.style.pointerEvents = k >= 1 ? "auto" : "none";
    });
  }
  _startIntro() {
    if (this._introRun || !this._mag || !this._rotor) return;
    if (this._introDone) {
      if (this._pjShownIdx === null) this._pjReveal(this._magIdx(this._rotT));
      return;
    }
    const rotor = this._rotor,
      num = this._mag.querySelector("[data-mag-num]");
    const finish = () => {
      rotor.style.translate = "";
      if (num) num.style.translate = "";
      this._rot = this._rotT = 0;
      this._cardGain = 1;
      this._magPaint();
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this._introDone = true;
      finish();
      this._arrowK = 1;
      this._magArrows();
      this._pjReveal(0);
      return;
    }
    this._introRun = true;
    cancelAnimationFrame(this._magRaf);
    this._magRaf = 0;
    const t0 = performance.now(),
      X = this._introX || 600;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / 1500),
        ts = Math.min(1, (now - t0) / 750);
      const tx = (-X * Math.pow(1 - ts, 3)).toFixed(1) + "px 0";
      rotor.style.translate = tx;
      if (num) num.style.translate = tx;
      this._rot = this._rotT = -1080 * Math.pow(1 - t, 4);
      this._cardGain = t < 0.8 ? 0 : (t - 0.8) / 0.2;
      this._magPaint();
      if (t < 1) {
        requestAnimationFrame(tick);
        return;
      }
      finish();
      this._pjReveal(0);
      const a0 = performance.now();
      const at = (n) => {
        const k = Math.min(1, (n - a0) / 550);
        this._arrowK = 1 - Math.pow(1 - k, 3);
        this._magArrows();
        if (k < 1) requestAnimationFrame(at);
        else {
          this._introRun = false;
          this._introDone = true;
        }
      };
      requestAnimationFrame(at);
    };
    requestAnimationFrame(tick);
  }
  _kickNumW(num) {
    const c = num.cloneNode(false);
    c.textContent = "00";
    c.style.visibility = "hidden";
    num.parentNode.appendChild(c);
    const w = c.offsetWidth;
    c.remove();
    return w;
  }
  _kickLabLeft() {
    const d = this._pjDesc,
      row = this._pjRow;
    if (!d || !row) return 0;
    const h2 = row.previousElementSibling,
      k = d.querySelector("[data-kicker]");
    if (!h2 || !k) return 0;
    const faces = h2.querySelectorAll("[data-cube] > span:first-child");
    if (faces.length < 8) return 0;
    const tr = faces[6].getBoundingClientRect(),
      num = k.querySelector('[data-k="num"]'),
      lab = k.querySelector('[data-k="lab"]');
    if (!num || !lab || !lab.offsetWidth) return 0;
    return (
      (tr.left + tr.right) / 2 -
      this._kickNumW(num) / 2 -
      12 -
      lab.offsetWidth -
      row.getBoundingClientRect().left
    );
  }
  _tabAng(t) {
    return (
      ((((-+t.dataset.slot * this._magStep() + this._rot) % 360) + 540) % 360) -
      180
    );
  }
  _magPaint() {
    if (!this._rotor) return;
    this._rotor.style.transform = "rotate(" + this._rot + "deg)";
    const st = this._magStep(),
      g = this._mg;
    if (!g) return;
    const poke = g.B + 18,
      L = (a, b, p) => a + (b - a) * p;
    this._rotor.querySelectorAll("[data-slot]").forEach((t) => {
      const c = t.firstElementChild;
      if (!c) return;
      let p = Math.max(
        0,
        Math.min(1, 1 - Math.abs(this._tabAng(t)) / (st * 0.8))
      );
      p = p * p * (3 - 2 * p) * (this._cardGain ?? 1);
      const key = p.toFixed(3);
      if (c.dataset.p === key) return;
      c.dataset.p = key;
      t.style.zIndex = p > 0 ? "2" : "";
      c.style.left = L(2 + g.hL * 0.2, -poke, p) + "px";
      c.style.width = L(g.hL * 0.8, poke + g.TL + 34, p) + "px";
      c.style.top = L(g.TH / 2 - g.tw, -8, p) + "px";
      c.style.height = L(2 * g.tw, g.TH + 16, p) + "px";
      c.style.borderRadius = L(2, 10, p) + "px";
      c.style.opacity = Math.min(1, p * 5).toFixed(3);
      c.style.boxShadow =
        p > 0.005
          ? "0 " +
            (14 * p).toFixed(1) +
            "px " +
            (28 * p).toFixed(1) +
            "px rgba(12, 8, 4, " +
            (0.5 * p).toFixed(3) +
            "), 0 " +
            (3 * p).toFixed(1) +
            "px " +
            (8 * p).toFixed(1) +
            "px rgba(12, 8, 4, " +
            (0.35 * p).toFixed(3) +
            ")"
          : "none";
      const tt = c.firstElementChild;
      if (tt) tt.style.opacity = Math.max(0, (p - 0.45) / 0.55).toFixed(3);
    });
    const i = this._magIdx(this._rot);
    if (i !== this.state.pIdx) this.setState({ pIdx: i });
  }
  _pjKicker() {
    const d = this._pjDesc,
      row = this._pjRow;
    if (!d || !row) return;
    const k = d.querySelector("[data-kicker]"),
      wrap = d.querySelector("[data-pj-text]"),
      h2 = row.previousElementSibling;
    if (!k || !wrap || !h2 || h2.dataset.rolling === "1") return;
    const faces = h2.querySelectorAll("[data-cube] > span:first-child");
    if (faces.length < 8) return;
    const T = faces[6],
      S = faces[7];
    const mk = document.createElement("span");
    mk.style.cssText = "display:inline-block;width:0;height:0";
    T.appendChild(mk);
    const base = mk.getBoundingClientRect().top;
    mk.remove();
    const wide = (innerWidth || 0) >= 900;
    const dr = d.getBoundingClientRect();
    d.style.paddingTop = wide
      ? Math.max(0, Math.round(base - dr.top + 40)) + "px"
      : "0px";
    const tr = T.getBoundingClientRect(),
      sr = S.getBoundingClientRect();
    const lab = k.querySelector('[data-k="lab"]'),
      kb = k.querySelector("[data-kb]"),
      num = k.querySelector('[data-k="num"]');
    if (wide)
      d.style.paddingLeft =
        Math.max(
          24,
          Math.round(
            (tr.left + tr.right) / 2 -
              this._kickNumW(num) / 2 -
              12 -
              lab.offsetWidth -
              dr.left
          )
        ) + "px";
    else d.style.paddingLeft = "";
    const wr = wrap.getBoundingClientRect();
    const y =
      base -
      wr.top -
      (kb.getBoundingClientRect().top - lab.getBoundingClientRect().top);
    const numX = (tr.left + tr.right) / 2 - wr.left;
    const put = (n, x) => {
      const e = k.querySelector('[data-k="' + n + '"]');
      e.style.left = x.toFixed(1) + "px";
      e.style.top = y.toFixed(1) + "px";
    };
    put("num", numX);
    put("sl", (tr.right + sr.left) / 2 - wr.left);
    put("tot", (sr.left + sr.right) / 2 - wr.left);
    put("lab", numX - this._kickNumW(num) / 2 - 12);
  }
  _magTo(t) {
    this._rotT = t;
    this._pjSwap(this._magIdx(t));
    if (this._magRaf) return;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(48, now - last);
      last = now;
      this._rot += (this._rotT - this._rot) * (1 - Math.exp(-dt / 110));
      if (Math.abs(this._rotT - this._rot) < 0.03) this._rot = this._rotT;
      this._magPaint();
      this._magRaf =
        this._rot !== this._rotT && !this._mDrag
          ? requestAnimationFrame(tick)
          : 0;
    };
    this._magRaf = requestAnimationFrame(tick);
  }
  _magBy(d) {
    if (this._introRun) return;
    const st = this._magStep();
    this._magTo(Math.round(this._rotT / st) * st + d * st);
  }
  _magNext = () => this._magBy(1);
  _magPrev = () => this._magBy(-1);
  _magKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this._magNext();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this._magPrev();
    }
  };
  _magDown = (e) => {
    if (
      e.button !== 0 ||
      this._introRun ||
      e.target.closest("[data-mag-arrow]")
    )
      return;
    const r = this._mag.getBoundingClientRect(),
      cx = r.left,
      cy = r.top + r.height / 2;
    const ang = (x, y) => (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
    cancelAnimationFrame(this._magRaf);
    this._magRaf = 0;
    const d = (this._mDrag = {
      id: e.pointerId,
      a: ang(e.clientX, e.clientY),
      x: e.clientX,
      y: e.clientY,
      moved: false,
      v: 0,
      t: performance.now(),
      tab: e.target.closest("[data-slot]"),
    });
    this._mag.style.cursor = "grabbing";
    const move = (ev) => {
      if (ev.pointerId !== d.id) return;
      if (!d.moved && Math.hypot(ev.clientX - d.x, ev.clientY - d.y) < 4)
        return;
      d.moved = true;
      const a = ang(ev.clientX, ev.clientY);
      let da = a - d.a;
      if (da > 180) da -= 360;
      if (da < -180) da += 360;
      d.a = a;
      const now = performance.now(),
        dt = Math.max(1, now - d.t);
      d.t = now;
      this._rot += da;
      this._rotT = this._rot;
      d.v = 0.75 * d.v + 0.25 * (da / dt);
      this._magPaint();
    };
    const up = (ev) => {
      if (ev.pointerId !== d.id) return;
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      removeEventListener("pointercancel", up);
      this._mDrag = null;
      this._mag.style.cursor = "";
      const st = this._magStep();
      if (!d.moved) {
        if (d.tab) {
          const a = this._tabAng(d.tab);
          this._magTo(Math.round((this._rot - a) / st) * st);
        }
        return;
      }
      const fling = Math.max(-1.2, Math.min(1.2, d.v)) * 160;
      this._magTo(Math.round((this._rot + fling) / st) * st);
    };
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
    addEventListener("pointercancel", up);
  };
  _pjRects(wrap) {
    const root = wrap.getBoundingClientRect(),
      out = [];
    wrap.querySelectorAll("[data-reveal],[data-reveal-box]").forEach((el) => {
      const nc = el.hasAttribute("data-reveal-nocover");
      if (nc && this._kickDone) return;
      if (el.hasAttribute("data-reveal")) {
        for (const r of this._lineRects(el, root))
          out.push({ ...r, el: nc ? el : null });
        return;
      }
      const rows = [];
      [...el.children].forEach((c) => {
        const b = c.getBoundingClientRect();
        if (!b.width) return;
        const l = rows[rows.length - 1];
        if (l && Math.abs(l.top - b.top) < b.height * 0.5) {
          l.right = Math.max(l.right, b.right);
          l.bottom = Math.max(l.bottom, b.bottom);
        } else
          rows.push({
            top: b.top,
            bottom: b.bottom,
            left: b.left,
            right: b.right,
          });
      });
      rows.forEach((q) =>
        out.push({
          x: q.left - root.left - 2,
          y: q.top - root.top - 2,
          w: q.right - q.left + 4,
          h: q.bottom - q.top + 4,
          el: null,
        })
      );
    });
    out.forEach((r) => {
      if (r.el) return;
      const right = r.x + r.w;
      r.x = -2;
      r.w = right + 2;
    });
    return out;
  }
  _pjLines() {
    const wrap = this._pjDesc.querySelector("[data-pj-text]"),
      mask = this._pjDesc.querySelector("[data-pj-mask]");
    mask.textContent = "";
    // covered lines are hidden by clipping the text itself (no painted cover boxes, so nothing shows over the live background)
    const kids = [...wrap.children].filter(
      (c) => c !== mask && !c.hasAttribute("data-reveal-nocover")
    );
    const root = wrap.getBoundingClientRect(),
      offs = kids.map((c) => {
        const b = c.getBoundingClientRect();
        return [b.left - root.left, b.top - root.top];
      });
    const rects = [],
      covered = new Set();
    const apply = () => {
      if (!covered.size) {
        kids.forEach((c) => {
          c.style.clipPath = "";
        });
        return;
      }
      kids.forEach((c, j) => {
        const [ox, oy] = offs[j];
        const d = rects
          .filter((q, i) => q && !covered.has(i))
          .map(
            (q) =>
              "M" +
              (q.x - ox) +
              " " +
              (q.y - oy) +
              "h" +
              q.w +
              "v" +
              q.h +
              "h" +
              -q.w +
              "Z"
          )
          .join("");
        c.style.clipPath = d ? "path('" + d + "')" : "inset(50%)";
      });
    };
    this._pjClipKids = kids;
    return this._pjRects(wrap).map((r, idx) => {
      const base =
        "position:absolute;left:" +
        r.x +
        "px;top:" +
        r.y +
        "px;width:" +
        r.w +
        "px;height:" +
        r.h +
        "px;";
      const bar = document.createElement("div");
      bar.setAttribute(
        "style",
        base +
          "background:" +
          (r.el ? "var(--gold)" : "var(--cream)") +
          ";transform:scaleX(0);"
      );
      let cover;
      if (r.el) {
        const el = r.el;
        cover = {
          remove: () => {
            el.style.opacity = "";
          },
          show: () => {
            el.style.opacity = "0";
          },
        };
        cover.show();
      } else {
        rects[idx] = r;
        covered.add(idx);
        apply();
        cover = {
          remove: () => {
            covered.delete(idx);
            apply();
          },
          show: () => {
            covered.add(idx);
            apply();
          },
        };
      }
      mask.appendChild(bar);
      return { cover, bar };
    });
  }
  _pjReset() {
    const el = this._pjDesc;
    if (!el) return;
    el.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    const m = el.querySelector("[data-pj-mask]");
    if (m) m.textContent = "";
    (this._pjClipKids || []).forEach((c) => {
      c.style.clipPath = "";
    });
    el.querySelectorAll("[data-reveal-nocover]").forEach((n) => {
      n.style.opacity = "";
    });
  }
  _pjReveal(i) {
    const tok = (this._pTok = (this._pTok || 0) + 1);
    this._pjShownIdx = i;
    this._pjTarget = i;
    this.setState({ pShown: i, pjOn: true }, () => {
      if (tok !== this._pTok || !this._pjDesc) return;
      this._pjReset();
      this._pjKicker();
      this._pjDesc.style.visibility = "visible";
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
      const pl = this._pjLines();
      this._kickDone = true;
      pl.forEach((l, k) => {
        const a = l.bar.animate(
          [
            { transform: "scaleX(0)", transformOrigin: "left center" },
            { transform: "scaleX(1)", transformOrigin: "left center" },
          ],
          {
            duration: 420,
            delay: 80 + Math.min(k, 14) * 60,
            easing: EASE,
            fill: "forwards",
          }
        );
        a.onfinish = () => {
          if (tok !== this._pTok) return;
          l.cover.remove();
          const b = l.bar.animate(
            [
              { transform: "scaleX(1)", transformOrigin: "right center" },
              { transform: "scaleX(0)", transformOrigin: "right center" },
            ],
            { duration: 460, easing: EASE, fill: "forwards" }
          );
          b.onfinish = () => l.bar.remove();
        };
      });
    });
  }
  _pjSwap(i) {
    if (this._pjShownIdx === null || i === this._pjTarget || !this._pjDesc)
      return;
    this._pjTarget = i;
    const tok = (this._pTok = (this._pTok || 0) + 1);
    this._pjReset();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this._pjReveal(i);
      return;
    }
    const lines = this._pjLines();
    lines.forEach((l) => l.cover.remove());
    const n = lines.length;
    let left = n;
    if (!n) {
      this._pjReveal(i);
      return;
    }
    const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
    lines.forEach((l, k) => {
      const a = l.bar.animate(
        [
          { transform: "scaleX(0)", transformOrigin: "right center" },
          { transform: "scaleX(1)", transformOrigin: "right center" },
        ],
        {
          duration: 280,
          delay: Math.min(n - 1 - k, 12) * 30,
          easing: EASE,
          fill: "forwards",
        }
      );
      a.onfinish = () => {
        if (tok !== this._pTok) return;
        l.cover.show();
        const b = l.bar.animate(
          [
            { transform: "scaleX(1)", transformOrigin: "left center" },
            { transform: "scaleX(0)", transformOrigin: "left center" },
          ],
          { duration: 300, easing: EASE, fill: "forwards" }
        );
        b.onfinish = () => {
          if (tok === this._pTok && --left <= 0) this._pjReveal(i);
        };
      };
    });
  }
  _setExpBg = (el) => {
    this._expBg = el;
  };
  _setExpBgWrap = (el) => {
    this._expBgWrap = el;
    if (el) {
      this._bgT = this._bgT || { x: 0, y: 0 };
      addEventListener("resize", () => {
        this._bgW = 0;
        if (!this._bgRaf) this._bgRaf = requestAnimationFrame(this._bgTick);
      });
      requestAnimationFrame(this._bgTick);
    }
    if (el && this._bridgeTp != null) this._bridge(this._bridgeTp);
  };
  _bgMove = (e) => {
    this._bgT = {
      x: (e.clientX / innerWidth - 0.5) * 2,
      y: (e.clientY / innerHeight - 0.5) * 2,
    };
    if (!this._bgRaf) this._bgRaf = requestAnimationFrame(this._bgTick);
  };
  _bgTick = () => {
    const c = this._bgC || (this._bgC = { x: 0, y: 0 }),
      t = this._bgT;
    c.x += (t.x - c.x) * 0.08;
    c.y += (t.y - c.y) * 0.08;
    const zt = this._bgBlurOn ? 1.3 : 1;
    this._bgZ = this._bgZ ?? 1;
    if (this._zAnim && this._zAnim.to !== zt) this._zAnim = null;
    if (!this._zAnim && this._bgZ !== zt)
      this._zAnim = { from: this._bgZ, to: zt, t0: performance.now() };
    if (this._zAnim) {
      const k = Math.min(1, (performance.now() - this._zAnim.t0) / 1650);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      this._bgZ = this._zAnim.from + (this._zAnim.to - this._zAnim.from) * e;
      if (k >= 1) {
        this._bgZ = zt;
        this._zAnim = null;
      }
    }
    const el = this._expBg,
      box = this._expBgWrap;
    if (el && box) {
      const vw = box.clientWidth,
        vh = box.clientHeight,
        IW = 2363,
        IH = 1575;
      const s = Math.max((vw * 1.08) / IW, (vh * 1.08) / IH),
        w = IW * s,
        ht = IH * s;
      if (this._bgW !== w) {
        this._bgW = w;
        el.style.width = w + "px";
        el.style.height = ht + "px";
      }
      const rx = (w - vw) / 2,
        ry = (ht - vh) / 2;
      el.style.transform =
        "translate3d(" +
        (-rx - c.x * rx).toFixed(2) +
        "px," +
        (-ry - c.y * ry).toFixed(2) +
        "px,0) scale(" +
        this._bgZ.toFixed(4) +
        ")";
    }
    this._bgRaf =
      Math.abs(t.x - c.x) + Math.abs(t.y - c.y) > 0.001 || this._bgZ !== zt
        ? requestAnimationFrame(this._bgTick)
        : null;
  };
  componentDidMount() {
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
      addEventListener("mousemove", this._bgMove);
    setTimeout(() => this._magLayout(), 50);
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(() => this._magLayout());
    setTimeout(this._measureSG, 0);
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(this._measureSG);
    addEventListener("resize", this._measureSG);
    this._introTag();
    this._introHeroImages();
    this.sync();
    this._checkInView();
    window.addEventListener("scroll", this._checkInView, { passive: true });
    window.addEventListener("resize", this._measureHeader);
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(this._measureHeader);
  }
  componentWillUnmount() {
    removeEventListener("mousemove", this._bgMove);
    if (this._bgRaf) cancelAnimationFrame(this._bgRaf);
    if (this._navScroll) {
      removeEventListener("scroll", this._navScroll);
      removeEventListener("resize", this._navScroll);
      removeEventListener("keydown", this._navKey);
    }
    window.removeEventListener("scroll", this._checkInView);
    window.removeEventListener("resize", this._measureHeader);
    removeEventListener("resize", this._measureSG);
    if (this._section)
      this._section.removeEventListener("wheel", this._onWheel);
    this._teardownMag();
    if (this._pjIO) this._pjIO.disconnect();
    if (this._pjScroll) removeEventListener("scroll", this._pjScroll);
    this._teardownToolBelt();
    this._teardownCerts();
  }
  componentDidUpdate() {
    this.sync();
    const on = this.state.expanded !== null;
    if (this._expBg && this._bgBlurOn !== on) {
      this._bgBlurOn = on;
      this._expBg.style.filter = on ? "blur(10px)" : "blur(0px)";
      if (!this._bgRaf) this._bgRaf = requestAnimationFrame(this._bgTick);
    }
  }

  roles() {
    return experience;
  }
  sync() {
    const on = this.props.snapScroll ?? false;
    if (on) document.documentElement.setAttribute("data-snap", "");
    else document.documentElement.removeAttribute("data-snap");
  }
  renderVals() {
    const shadows = {
      Soft: "0 18px 40px rgba(0, 0, 0, 0.35)",
      Lifted: "0 34px 70px rgba(0, 0, 0, 0.5), 0 10px 22px rgba(0, 0, 0, 0.35)",
      Popping:
        "0 60px 110px rgba(0, 0, 0, 0.6), 0 22px 44px rgba(0, 0, 0, 0.45), 0 2px 0 rgba(245, 239, 224, 0.12)",
    };
    const aspects = {
      "3:4": "3 / 4",
      "2:3": "2 / 3",
      "4:5": "4 / 5",
      "9:16": "9 / 16",
    };
    const { hovered, expanded, lockedSide, cx, cy } = this.state;
    const ease = "cubic-bezier(0.22, 0.61, 0.36, 1)";
    const sw = this._section ? this._section.clientWidth : window.innerWidth;
    const sh = this._section ? this._section.clientHeight : window.innerHeight;
    const V = this.state.mode === "v";
    const out = this.state.phase === "out";
    const EZ = "cubic-bezier(0.65, 0, 0.35, 1)";
    const panelPx = Math.min(520, sw * 0.42);
    const openLeft = 50 + panelPx + 40;
    const vpW = V ? sw - openLeft : sw;
    const vpH = Math.max(200, sh - this.state.headerBottom);
    const ppy = this.props.expPPY ?? 900;
    const ppyV = this.props.expPPYV ?? 560;
    const ang = this.props.expAngle ?? 32;
    const data = this.roles();
    const now = (() => {
      const d = new Date();
      return d.getFullYear() + d.getMonth() / 12 + d.getDate() / 365;
    })();
    const t0 = Math.floor(Math.min(...data.map((r) => r.date))) - 0.08;
    const X = (d) => 64 + (d - t0) * ppy;
    const Y = (d) => 72 + (d - t0) * ppyV;
    const railY = Math.round(vpH * 0.76);
    const railX = Math.round(vpW * 0.74);
    const AP = 13,
      AC = 5,
      snap = (v) => Math.round((v - AC) / AP) * AP + AC;
    const nH = Math.ceil(X(now + 0.08) / AP),
      nV = Math.ceil(Y(now + 0.08) / AP);
    const endX = nH * AP,
      endY = nV * AP;
    const sorted = data
      .map((r, i) => ({ i, x: X(r.date) }))
      .sort((p, q) => p.x - q.x);
    const lanes = {};
    let prev = null;
    const sinA = Math.sin((ang * Math.PI) / 180);
    sorted.forEach((o) => {
      lanes[o.i] =
        prev && (o.x - prev.x) * sinA < 90 ? (lanes[prev.i] + 1) % 3 : 0;
      prev = o;
    });
    const contentW = Math.max(endX + 260, ...sorted.map((o) => o.x + 480));
    const contentH = endY + 140;
    const maxH = Math.max(0, contentW - sw),
      maxV = Math.max(0, contentH - vpH);
    const sgW = this._sgW || 170;
    const TX = Math.max(24, sw - 90 - sgW);
    const railXV = Math.round((sw - openLeft) * 0.74);
    const panH = Math.max(0, endX + 36 - TX);
    const panV = Math.max(0, endY + 38 - railY + 12.5);
    const dxV = TX - (openLeft + railXV - 12);
    this._zl = Math.round(window.innerHeight * 1.6);
    this._expLen = Math.max(panH, panV, 400);
    const p = this.state.expP || 0;
    this._toV = { Y, vpH, maxV: panV };
    const tlYears = [];
    for (let y = Math.ceil(t0); y <= now; y++)
      tlYears.push(
        V
          ? {
              label: String(y),
              l: railX + 3 + "px",
              t: snap(Y(y)) - 3 + "px",
              dir: "row",
              align: "center",
              tw: "14px",
              th: "6px",
              lt: "none",
            }
          : {
              label: String(y),
              l: snap(X(y)) - 3 + "px",
              t: railY + 3 + "px",
              dir: "column",
              align: "flex-start",
              tw: "6px",
              th: "14px",
              lt: "translateX(calc(3px - 50%))",
            }
      );
    const tl = {
      tlTop: this.state.headerBottom + "px",
      tlLeft: V ? openLeft + "px" : "0px",
      tlWidth: (V ? vpW : contentW) + "px",
      tlHeight: (V ? contentH : vpH) + "px",
      tlPan: V
        ? "translate(" + dxV + "px, " + -p * panV + "px)"
        : "translate(" + -p * panH + "px, 0px)",
      tlMask: V
        ? "linear-gradient(to bottom, transparent 0, #000 40px, #000 calc(100% - 64px), transparent 100%)"
        : "linear-gradient(to right, transparent 0, #000 48px, #000 calc(100% - 64px), transparent 100%)",
      railHT: railY - 3 + "px",
      railHW: endX + 14 + "px",
      railHO: Math.min(endX, p * panH + sw) + "px 50%",
      railVO: "50% " + Math.min(endY, p * panV + vpH) + "px",
      railHS: !V && this.state.rail ? "scaleX(1)" : "scaleX(0)",
      railOp: this.state.rail ? 1 : 0,
      railOpTr: this.state.rail
        ? "opacity 220ms ease 470ms"
        : "opacity 200ms ease",
      railVL: railX - 3 + "px",
      railVH: endY + 14 + "px",
      railVS: V && this.state.rail ? "scaleY(1)" : "scaleY(0)",
      endL: (V ? railX : endX) + "px",
      endT: (V ? endY : railY) + "px",
      endDir: V ? "column" : "row",
      endTf: V ? "translate(-12px, 0px)" : "translate(0px, -12px)",
      endArrowRot: V ? "translate(1px, -1px) rotate(90deg)" : "none",
      tlYears,
      expScrollLen: this._expLen + this._zl + "px",
      expWrapRef: this._setExpWrap,
      zoomRef: this._setZoom,
      zoomOvRef: this._setZoomOv,
      zoomTxtRef: this._setZoomTxt,
    };
    const LT = 6,
      sA = Math.sin((ang * Math.PI) / 180),
      cA = Math.cos((ang * Math.PI) / 180),
      mT0 = (LT * (sA - 1)) / cA;
    const roles = data.map((r, i) => {
      const side = cx > sw * 0.55 ? "right" : "left";
      const isOpen = expanded === i;
      const isPeek = expanded === null && !V && !out && hovered === i;
      const top = this.state.headerBottom;
      const open = {
        left: "50px",
        top: top + "px",
        width: panelPx + "px",
        height: "calc(100% - " + (top + 24) + "px)",
      };
      const peek = {
        left:
          side === "right"
            ? "max(12px, " + (cx - 322) + "px)"
            : "min(" + (cx + 22) + "px, calc(100% - 330px))",
        top: Math.max(top, Math.min(cy - 300, sh - 300)) + "px",
        width: "300px",
        height: "280px",
      };
      const cOpen = false;
      const geo = peek;
      return {
        ...r,
        title: r.title,
        meta: r.meta,
        descKey: "d" + i,
        descVis: this.state.shown === i ? "visible" : "hidden",
        descPE: this.state.shown === i ? "auto" : "none",
        ax: (V ? railX : snap(X(r.date))) + "px",
        ay: (V ? snap(Y(r.date)) : railY) + "px",
        stemH: V ? "-3px" : out ? "0px" : 56 + lanes[i] * 84 + mT0 * sA + "px",
        stemVisH:
          V || out
            ? "0px"
            : 56 + lanes[i] * 84 + (LT * (1 - sA)) / cA - LT / 2 + "px",
        clip: out
          ? V
            ? "inset(-60% -10% -160% 100%)"
            : "inset(-60% 100% -160% -10%)"
          : "inset(-60% -10% -160% -10%)",
        stemTr:
          "background 300ms, height " +
          (out ? "260ms " + EZ + " 340ms" : "260ms " + EZ),
        diagTr:
          "clip-path " +
          (out ? "380ms " + EZ : "480ms " + EZ + " " + (V ? "0ms" : "220ms")) +
          ", -webkit-clip-path " +
          (out ? "380ms " + EZ : "480ms " + EZ + " " + (V ? "0ms" : "220ms")) +
          ", transform 380ms cubic-bezier(0.22, 0.61, 0.36, 1), bottom " +
          (out ? "260ms " + EZ + " 340ms" : "260ms " + EZ) +
          (out ? ", opacity 1ms linear 400ms" : ", opacity 200ms"),
        origin: V ? "100% 100%" : "0% 100%",
        arrowL: V ? "-12px" : "-5px",
        arrowT: V ? "-5px" : "-12px",
        diagL: V ? "-3px" : LT / 2 + mT0 * cA + "px",
        arrowD: V
          ? "M0 0v10l12 12 12-12V0L12 12z"
          : "M0 0h10l12 12-12 12H0l12-12z",
        ulClip: "none",
        diagT: V
          ? "translateX(-100%) rotate(0deg) scale(" +
            (hovered === i || isOpen ? 1.08 : 1) +
            ")"
          : "rotate(-" + ang + "deg) scale(" + (isPeek ? 1.08 : 1) + ")",
        align: V ? "right" : "left",
        pad: V ? "0 18px 9px 10px" : "0 32px 9px 10px",
        subL: V ? "auto" : "10px",
        subR: V ? "18px" : "auto",
        op: out ? 0 : expanded === null || isOpen ? 1 : 0.45,
        lineColor: isOpen || isPeek ? "var(--navy)" : "var(--gold)",
        cardStyle: {
          position: "absolute",
          zIndex: 40,
          left: geo.left,
          top: geo.top,
          width: geo.width,
          height: geo.height,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "18px",
          borderRadius: cOpen ? "0px" : "22px",
          background: cOpen ? "transparent" : "#D8D8D8",
          border: cOpen
            ? "1px solid transparent"
            : "1px solid rgba(0, 0, 104, 0.35)",
          boxShadow: cOpen
            ? "none"
            : "0 40px 90px rgba(59, 38, 24, 0.22), 0 12px 28px rgba(59, 38, 24, 0.16)",
          opacity: cOpen || isPeek ? 1 : 0,
          pointerEvents: cOpen ? "auto" : "none",
          overflow: "hidden",
          transition:
            cOpen || expanded !== null
              ? "left 700ms " +
                ease +
                ", top 700ms " +
                ease +
                ", width 700ms " +
                ease +
                ", height 700ms " +
                ease +
                ", opacity 400ms " +
                ease
              : "left 140ms linear, top 140ms linear, opacity 250ms " + ease,
        },
        photoStyle: {
          position: "relative",
          width: "100%",
          flex: "0 0 auto",
          height: cOpen ? "120px" : "150px",
          borderRadius: "16px",
          overflow: "hidden",
          background: "rgba(59, 38, 24, 0.06)",
          transition: "height 700ms " + ease + ", flex-basis 700ms " + ease,
        },
        detailStyle: {
          fontSize: "14px",
          lineHeight: "1.65",
          margin: 0,
          color: "rgba(59, 38, 24, 0.82)",
          opacity: cOpen ? 1 : 0,
          flex: "0 0 auto",
          maxHeight: cOpen ? "1000px" : "0px",
          overflow: "hidden",
          transition:
            "opacity 500ms " + ease + " 150ms, max-height 700ms " + ease,
        },
        onEnter: () => this.setState({ hovered: i }),
        onMove: (e) => {
          if (this.state.expanded !== null) return;
          const r = this._section
            ? this._section.getBoundingClientRect()
            : { left: 0, top: 0 };
          this.setState({
            hovered: i,
            cx: e.clientX - r.left,
            cy: e.clientY - r.top,
          });
        },
        onLeave: () => this.setState({ hovered: null }),
        onClick: (e) => {
          e.stopPropagation();
          if (this.state.mode === "v" && this.state.phase === "in") {
            if (this.state.shown === i) return;
            this.setState({ expanded: i });
            if (this.state.shown === null) this._showDesc(i);
            else this._hideDesc(() => this._showDesc(i));
            return;
          }
          this.setState({ expanded: i, hovered: null });
          this._hideDesc();
          this._morph(
            "v",
            () => this._scrollToRole(r.date),
            () => this._showDesc(i)
          );
        },
      };
    });
    return {
      heroLiveBg: this.props.heroLiveBg ?? true,
      roles,
      ...tl,
      stageRef: this._setStage,
      menuRef: this._setMenuBtn,
      menuPanelRef: this._setMenuPanel,
      toggleMenu: (e) => {
        e.stopPropagation();
        this._setMenu(!this._menuOpen);
      },
      closeMenu: () => this._setMenu(false),
      menuEnter: () => this._menuAnim(1),
      menuLeave: () => this._menuAnim(0),
      navItems: PortfolioLogic.NAV.filter(
        (n) => n[0] !== "endorsements" || (this.props.showEndorsements ?? true)
      ).map((n, i) => ({ key: n[0], label: n[1], go: () => this._goTo(n[0]) })),
      heroRef: this._setHero,
      aboutPanelRef: this._setAboutPanel,
      aboutTextRef: this._setAboutText,
      aboutPhotoRef: this._setAboutPhoto,
      expSlideRef: this._setExpSlide,
      aboutMaskRef: this._setAboutMask,
      sectionRef: this._setSection,
      expBgRef: this._setExpBg,
      expBgWrapRef: this._setExpBgWrap,
      magRef: this._setMag,
      pjRowRef: this._setPjRow,
      pjDescRef: this._setPjDesc,
      toolBeltRef: this._setToolBelt,
      certStageRef: this._setCertStage,
      certs: PortfolioLogic.CERTS.map((c, i) => ({
        ...c,
        real: !c.ph,
        ph: !!c.ph,
        n: i + 1,
      })),
      toolItems: [0, 1, 2].flatMap((c) =>
        PortfolioLogic.TOOLS.map((t, i) => ({ ...t, key: c + "-" + i }))
      ),
      magNext: this._magNext,
      magPrev: this._magPrev,
      pjVis: this.state.pjOn ? "visible" : "hidden",
      ...(() => {
        const P = PortfolioLogic.PROJECTS,
          N = P.length,
          S = this._magSlots(),
          st = 360 / S,
          pad = (n) => String(n).padStart(2, "0"),
          cur = this.state.pShown ?? 0;
        return {
          magTabs: Array.from({ length: S }, (_, k) => ({
            slot: k,
            key: "s" + k,
            title: P[k % N].title,
            photo: P[k % N].photo,
            tf:
              "rotate(" +
              -k * st +
              "deg) translate(calc(var(--R) - 2px), -50%)",
          })),
          pNum: pad((this.state.pIdx ?? 0) + 1),
          pTotal: pad(N),
          pj: { ...P[cur], num: pad(cur + 1) },
        };
      })(),
      scrollRef: this._setScroller,
      headerRef: this._setHeader,
      onSectionClick: () => {
        if (this.state.expanded !== null) {
          this.setState({ expanded: null, hovered: null });
          this._hideDesc();
          this._morph("h");
        }
      },
      stopClick: (e) => e.stopPropagation(),
      descTop: this.state.headerBottom + "px",
      descW:
        Math.min(
          520,
          (this._section ? this._section.clientWidth : window.innerWidth) * 0.42
        ) + "px",
      showEndorsements: this.props.showEndorsements ?? true,
      navyBgRef:
        this._navyBgRef ||
        (this._navyBgRef = (el) => {
          cancelAnimationFrame(this._nbRaf);
          if (!el) return;
          const wrap = el.parentElement,
            core = el.querySelector("[data-core]"),
            flat = el.querySelector("[data-flat]");
          const reduce =
            window.matchMedia &&
            matchMedia("(prefers-reduced-motion: reduce)").matches;
          const cl = (v) => Math.max(0, Math.min(1, v)),
            ease = (v) => v * v * (3 - 2 * v);
          let cx = null,
            cy = null;
          const tick = (t) => {
            this._nbRaf = requestAnimationFrame(tick);
            const vw = innerWidth,
              vh = innerHeight,
              wr = wrap.getBoundingClientRect();
            if (wr.bottom < 0 || wr.top > vh) return;
            // flat navy at the hand-off from Experience, easing into the gradient over the first ~90vh
            const f = ease(cl(-wr.top / (vh * 0.9)));
            flat.style.opacity = (1 - f).toFixed(3);
            const pj = wrap.querySelector('[data-screen-label="Projects"]');
            const row = pj && pj.children[1];
            const rr = (row || pj || wrap).getBoundingClientRect();
            const ax = rr.left + rr.width * 0.82,
              ay = Math.max(vh * 0.28, rr.top + Math.min(rr.height, vh) * 0.18);
            const cert = wrap.querySelector(
              '[data-screen-label="Certifications"]'
            );
            let m = 0;
            if (cert) {
              const cr = cert.getBoundingClientRect();
              m = ease(cl((vh - cr.top) / (vh * 0.8)));
            }
            const s2 = t / 1000,
              amp = reduce ? 0 : 1 - m * 0.5;
            const dx =
              (Math.sin(s2 * 0.11) * 0.05 + Math.sin(s2 * 0.047 + 1.3) * 0.03) *
              vw *
              amp;
            const dy =
              (Math.cos(s2 * 0.09 + 0.6) * 0.04 +
                Math.sin(s2 * 0.052) * 0.025) *
              vh *
              amp;
            const tx = ax + (vw / 2 - ax) * m + dx,
              ty = ay + (vh / 2 - ay) * m + dy;
            cx = tx;
            cy = ty;
            const sc = 1 + (reduce ? 0 : Math.sin(s2 * 0.07) * 0.06);
            core.style.transform =
              "translate3d(" +
              cx.toFixed(1) +
              "px," +
              cy.toFixed(1) +
              "px,0) scale(" +
              sc.toFixed(3) +
              ")";
          };
          this._nbRaf = requestAnimationFrame(tick);
        }),
      endSecRef: this._setEndSec,
      _endKick: this._endQueue && this._endQueue(),
      endTieRef: (el) => {
        this._endTie = el;
        if (el) {
          el.onload = this._endQueue;
          this._endQueue();
        }
      },
      endTitleRef: (el) => {
        this._endTitle = el;
      },
      endH: (PortfolioLogic.ENDORSE.length + 3) * 100 + "vh",
      contactPull: (this.props.showEndorsements ?? true) ? "-100vh" : "0px",
      contactRef: (el) => {
        this._contact = el;
        if (el) this._endQueue && this._endQueue();
      },
      endorsements: PortfolioLogic.ENDORSE.map((e, i) => ({
        ...e,
        key: "end" + i,
        ref: this._endCardRefs[i],
        stars: e.rating ? "★".repeat(e.rating) + "☆".repeat(5 - e.rating) : "",
        ratingLabel: e.rating ? e.rating + " out of 5" : undefined,
      })),
      sigStroke: this.props.sigStroke ?? 12,
      sigSize: (this.props.sigSize ?? 62) / 100,
      sigSpeed: this.props.sigSpeed ?? 1500,
      silOpacity: (this.props.silOpacity ?? 92) / 100,
      silImgOp:
        (this.props.heroLiveBg ?? true)
          ? 1
          : (this.props.silOpacity ?? 92) / 100,
      silFilter: (this.props.heroLiveBg ?? true) ? "url(#silSolid)" : "none",
      sil1Ref: this.sil1Ref,
      tagRef: this.tagRef,
      tagHover: this._tagRoll,
      headRoll: this._headRoll,
      expLetters: "Experience".split("").map((ch) => ({ ch })),
      projLetters: "Projects".split("").map((ch) => ({ ch })),
      toolLetters: "Tools".split("").map((ch) => ({ ch })),
      tagLetters: heroTagline
        .split("")
        .map((ch) => ({ ch: ch === " " ? "\u00A0" : ch })),
      tagX: (this.props.tagX ?? 4) + "vw",
      tagY: (this.props.tagY ?? 6) + "vh",
      tagSize: (this.props.tagSize ?? 85) + "px",
      sil2Ref: this.sil2Ref,
      sil1Size: (this.props.sil1Size ?? 19) + "vw",
      sil1X: (this.props.sil1X ?? 14) + "%",
      sil1Y:
        "calc(40vh + " +
        (
          ((133.36 * ((this.props.sigSize ?? 62) / 100)) / 1152) * 100 +
          (this.props.sil1Y ?? -0.25)
        ).toFixed(3) +
        "vw)",
      sil2Size: (this.props.sil2Size ?? 44) + "vw",
      sil2X: (this.props.sil2X ?? 0) + "vw",
      sil2Y: (this.props.sil2Y ?? 100) + "%",
      aboutEdge: (this.props.aboutEdge ?? 50) + "px",
      aboutDirection:
        (this.props.photoSide ?? "Right") === "Left" ? "row-reverse" : "row",
      photoWidth: (this.props.photoWidth ?? 360) + "px",
      photoAspect: aspects[this.props.photoAspect ?? "3:4"] || "3 / 4",
      photoShadow:
        shadows[this.props.photoShadow ?? "Popping"] || shadows.Popping,
    };
  }
}

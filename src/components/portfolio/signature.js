// <signature-mark> — animated handwritten signature drawn as one continuous pen stroke.
(() => {
  const SEGS = [
    {
      d: "M-6000 415.36 L305.58 415.36",
      kind: "stroke",
      a: 0,
      b: 620,
      sharp: true,
    },
    {
      d: "M305.58 415.36 C334.13 409.79 343.73 405.22 360.02 390.66 C376.30 376.09 388.74 352.50 403.27 327.99 C417.79 303.47 435.61 269.40 447.15 243.55 C458.70 217.70 466.48 193.37 472.55 172.88 C478.62 152.39 480.61 133.61 483.59 120.61 C486.58 107.61 488.70 99.63 490.47 94.87 C492.24 90.11 493.27 91.86 494.20 92.06 C495.13 92.26 496.90 90.02 496.06 96.08 C495.22 102.13 493.57 107.93 489.15 128.42 C484.73 148.91 475.84 185.97 469.55 219.03 C463.25 252.09 455.58 298.65 451.40 326.79 C447.22 354.93 445.56 374.64 444.48 387.88 C443.41 401.11 444.17 402.73 444.95 406.18 C445.73 409.62 446.46 409.84 449.15 408.54 C451.84 407.23 454.48 406.42 461.07 398.36 C467.67 390.30 476.94 381.35 488.70 360.18 C500.47 339.01 518.00 303.36 531.68 271.35 C545.35 239.33 561.77 193.62 570.78 168.09 C579.78 142.57 583.91 127.95 585.73 118.21 C587.55 108.48 585.96 111.38 581.72 109.68 C577.47 107.99 578.02 106.00 560.26 108.03 C542.50 110.05 508.73 115.47 475.17 121.85 C441.62 128.23 365.87 142.25 358.94 146.30 C352.01 150.34 383.59 149.60 433.60 146.12 C483.61 142.64 608.90 129.98 659.01 125.43 C709.12 120.88 729.12 118.91 734.25 118.82 C739.38 118.73 702.04 122.29 689.79 124.89 C677.54 127.50 670.08 129.79 660.77 134.45 C651.46 139.12 643.56 144.62 633.91 152.91 C624.27 161.19 613.47 171.62 602.88 184.17 C592.29 196.73 580.27 214.04 570.37 228.25 C560.48 242.45 551.66 256.47 543.50 269.41 C535.33 282.36 528.62 293.18 521.39 305.92 C514.15 318.65 504.66 335.89 500.09 345.80 C495.51 355.71 490.07 365.70 493.93 365.36 C497.79 365.02 510.97 353.48 523.24 343.75 C535.50 334.02 559.46 312.45 567.54 307.01 C575.62 301.57 568.86 308.85 571.69 311.14 C574.52 313.42 572.90 323.67 584.50 320.71 C596.10 317.76 628.71 298.94 641.29 293.39 C653.87 287.85 659.68 284.80 659.96 287.45 C660.24 290.11 645.06 304.72 642.99 309.33 C640.91 313.93 642.37 317.39 647.51 315.09 C652.65 312.79 665.95 302.44 673.81 295.51 C681.67 288.58 690.06 278.18 694.67 273.51 C699.29 268.84 700.59 267.50 701.50 267.49 C702.40 267.48 701.60 270.76 700.11 273.45 C698.61 276.14 694.92 279.54 692.51 283.62 C690.11 287.71 685.83 295.00 685.69 297.96 C685.54 300.91 687.98 303.29 691.66 301.37 C695.33 299.44 704.24 289.13 707.74 286.39 C711.23 283.65 708.01 284.85 712.62 284.92 C717.23 285.00 718.56 290.59 735.37 286.85 C752.19 283.11 800.48 266.56 813.50 262.50",
      kind: "stroke",
      a: 620,
      b: 4282,
    },
    {
      d: "M828.004 244.613C815.77 247.542 819.344 268.396 831.999 265.387C844.343 262.453 840.609 241.595 828.004 244.613z",
      kind: "dot",
      a: 4282,
      b: 4432,
    },
    {
      d: "M408 477 L952.7 247.1 Q989.5 231.5 1029.5 231.4 L7000 229",
      kind: "stroke",
      a: 4432,
      b: 7432,
    },
  ];
  const TOTAL = 7432;
  const BOX = { x: 0, y: 79, w: 1152, h: 406 };
  const SVGNS = "http://www.w3.org/2000/svg";

  function cubicBezier(x1, y1, x2, y2) {
    const cx = 3 * x1,
      bx = 3 * (x2 - x1) - cx,
      ax = 1 - cx - bx;
    const cy = 3 * y1,
      by = 3 * (y2 - y1) - cy,
      ay = 1 - cy - by;
    const X = (t) => ((ax * t + bx) * t + cx) * t,
      Y = (t) => ((ay * t + by) * t + cy) * t;
    const dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (x) => {
      let t = x;
      for (let i = 0; i < 8; i++) {
        const e = X(t) - x,
          d = dX(t);
        if (Math.abs(e) < 1e-5 || Math.abs(d) < 1e-6) break;
        t = Math.min(1, Math.max(0, t - e / d));
      }
      return Y(t);
    };
  }
  const ease = cubicBezier(0.45, 0.05, 0.35, 1);

  class SignatureMark extends HTMLElement {
    static get observedAttributes() {
      return [
        "pen",
        "stroke-width",
        "strokewidth",
        "size",
        "color",
        "speed",
        "delay",
        "replay",
      ];
    }
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.style.display = "block";
      if (!this.style.height) this.style.height = "100%";
      if (!this.style.position) this.style.position = "relative";
      this.style.overflow = "hidden";
      const svg = document.createElementNS(SVGNS, "svg");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "Signature");
      Object.assign(svg.style, {
        display: "block",
        width: "100%",
        height: "100%",
        overflow: "visible",
      });
      this._paths = SEGS.map((seg) => {
        const el = document.createElementNS(SVGNS, "path");
        el.setAttribute("d", seg.d);
        if (seg.kind === "dot") {
          el.setAttribute("fill", "currentColor");
          el.style.transformBox = "fill-box";
          el.style.transformOrigin = "center";
          el.style.transform = "scale(0)";
        } else {
          el.setAttribute("fill", "none");
          el.setAttribute("stroke", "currentColor");
          el.setAttribute("stroke-linecap", seg.sharp ? "butt" : "round");
          el.setAttribute("stroke-linejoin", seg.sharp ? "miter" : "round");
          if (seg.sharp) el.setAttribute("stroke-miterlimit", "20");
          el.setAttribute("pathLength", "1");
          el.setAttribute("stroke-dasharray", "1 2");
          el.style.strokeDashoffset = "1.001";
        }
        svg.appendChild(el);
        return el;
      });
      this._svg = svg;
      this.appendChild(svg);
      this._ro = new ResizeObserver(() => this._fit());
      this._ro.observe(this);
      this._onResize = () => this._fit();
      window.addEventListener("resize", this._onResize);
      this._fit();
      setTimeout(() => this._fit(), 0);
      setTimeout(() => this._fit(), 120);
      setTimeout(() => this._fit(), 500);
      this._sync();
      this.play();
    }
    disconnectedCallback() {
      this._ro && this._ro.disconnect();
      window.removeEventListener("resize", this._onResize);
      clearTimeout(this._raf);
    }
    attributeChangedCallback(name) {
      if (!this._built) return;
      this._sync();
      if (name === "size") this._fit();
      if (name === "replay" || name === "speed" || name === "size") this.play();
    }
    _num(attr, fallback) {
      for (const n of [attr, attr.replace(/-/g, "")]) {
        const v = parseFloat(this.getAttribute(n));
        if (Number.isFinite(v)) return v;
      }
      return fallback;
    }
    _sync() {
      const w = this._num("pen", this._num("stroke-width", 10));
      this.style.color = this.getAttribute("color") || "#ffffff";
      for (const el of this._paths)
        if (el.getAttribute("stroke")) el.setAttribute("stroke-width", w);
    }
    _fit() {
      const size = this._num("size", 0.62);
      const rect = this.getBoundingClientRect();
      const cw = rect.width || 1152,
        ch = rect.height || 600;
      this._lastW = cw;
      this._lastH = ch;
      const k = (cw * size) / BOX.w;
      const vbW = cw / k,
        vbH = ch / k;
      const cx = BOX.x + BOX.w / 2,
        cy = BOX.y + BOX.h / 2;
      this._svg.setAttribute(
        "viewBox",
        [cx - vbW / 2, cy - vbH / 2, vbW, vbH].join(" ")
      );
    }
    setProgress(p) {
      const s = ease(Math.min(1, Math.max(0, p))) * TOTAL;
      SEGS.forEach((seg, i) => {
        const el = this._paths[i];
        const k = (s - seg.a) / (seg.b - seg.a);
        if (seg.kind === "dot") {
          const v = Math.min(1, Math.max(0, k));
          el.style.transform =
            "scale(" + (v < 1 ? v * v * (3 - 2 * v) : 1) + ")";
        } else {
          el.style.strokeDashoffset = k <= 0 ? 1.001 : Math.max(0, 1 - k);
        }
      });
    }
    setDrawn(p) {
      p = Math.min(1, Math.max(0, p));
      if (p < 1 && !this._manual) {
        clearTimeout(this._raf);
        this._manual = true;
      }
      const s = p * TOTAL;
      SEGS.forEach((seg, i) => {
        const el = this._paths[i];
        const k = (s - seg.a) / (seg.b - seg.a);
        if (seg.kind === "dot") {
          const v = Math.min(1, Math.max(0, k));
          el.style.visibility = v > 0 ? "visible" : "hidden";
          el.style.transform =
            "scale(" + (v < 1 ? v * v * (3 - 2 * v) : 1) + ")";
        } else if (k <= 0) {
          el.style.visibility = "hidden";
        } else {
          el.style.visibility = "visible";
          el.style.strokeDasharray = "1 2";
          el.style.strokeDashoffset = String(Math.max(0, 1 - k));
        }
      });
      if (p >= 1) this._manual = false;
    }
    setErase(p) {
      p = Math.min(1, Math.max(0, p));
      if (p > 0 && !this._manual) {
        clearTimeout(this._raf);
        this._manual = true;
      }
      if (p === 0 && this._manual) {
        this._manual = false;
        for (const el of this._paths) {
          el.style.visibility = "visible";
          if (el.getAttribute("stroke")) {
            el.style.strokeDasharray = "1 2";
            el.style.strokeDashoffset = "0";
          } else el.style.transform = "scale(1)";
        }
        return;
      }
      if (!this._manual) return;
      const s = p * TOTAL;
      SEGS.forEach((seg, i) => {
        const el = this._paths[i];
        const e = Math.min(1, Math.max(0, (s - seg.a) / (seg.b - seg.a)));
        if (seg.kind === "dot") {
          const v = 1 - e;
          el.style.transform = "scale(" + v * v * (3 - 2 * v) + ")";
        } else if (e >= 1) {
          el.style.visibility = "hidden";
        } else {
          el.style.visibility = "visible";
          el.style.strokeDasharray = 1 - e + " 2";
          el.style.strokeDashoffset = String(-e);
        }
      });
    }
    play() {
      this._manual = false;
      for (const el of this._paths)
        if (el.getAttribute("stroke")) el.style.strokeDasharray = "1 2";
      clearTimeout(this._raf);
      const dur = TOTAL / this._num("speed", 1500);
      const delay = this._num("delay", 0.25);
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        this.setProgress(1);
        return;
      }
      this.setProgress(0);
      const t0 = performance.now();
      const tick = () => {
        const r = this.getBoundingClientRect();
        if (
          Math.abs(r.width - this._lastW) > 0.5 ||
          Math.abs(r.height - this._lastH) > 0.5
        )
          this._fit();
        const p = ((performance.now() - t0) / 1000 - delay) / dur;
        this.setProgress(p);
        if (p < 1) this._raf = setTimeout(tick, 16);
      };
      this._raf = setTimeout(tick, 16);
    }
  }
  if (!customElements.get("signature-mark"))
    customElements.define("signature-mark", SignatureMark);
})();

// <hero-bloom> — breathing navy fold background; the cursor permanently pushes, bends and breaks the folds (WebGL).
// Remove the tag (or turn off "Live background" in Tweaks) to revert.
(function () {
  if (customElements.get("hero-bloom")) return;
  const NI = 32;
  const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  // Displacement map is stored as 16-bit-per-axis packed into RGBA8 (range ±2 in pattern units).
  const COMMON = `precision highp float;
vec2 dec(vec4 c){return vec2(c.r*65280.+c.g*255.,c.b*65280.+c.a*255.)/65535.*4.-2.;}
vec4 enc(vec2 d){vec2 v=floor(clamp((d+2.)/4.,0.,1.)*65535.+.5);vec2 hi=floor(v/256.);vec2 lo=v-hi*256.;return vec4(hi.x,lo.x,hi.y,lo.y)/255.;}
vec2 sampD(sampler2D t,vec2 uv,vec2 r){vec2 q=uv*r-.5;vec2 i=floor(q);vec2 f=q-i;
 vec2 a=dec(texture2D(t,(i+vec2(.5,.5))/r)),b=dec(texture2D(t,(i+vec2(1.5,.5))/r)),c=dec(texture2D(t,(i+vec2(.5,1.5))/r)),d=dec(texture2D(t,(i+vec2(1.5,1.5))/r));
 return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
`;
  const SIM =
    COMMON +
    `uniform vec2 Rs;uniform float dt;uniform sampler2D P;uniform vec4 I[${NI}];uniform float A[${NI}];
void main(){
 float S=.8;float px=S/min(Rs.x,Rs.y);vec2 x=(gl_FragCoord.xy-.5*Rs)*px;
 vec2 u=vec2(0.);
 for(int i=0;i<${NI};i++){vec2 d=x-I[i].xy;float a=A[i];
  float g=exp(-dot(d,d)/.028)*exp(-a*4.)*smoothstep(1.55,1.,a);
  u+=(I[i].zw+d*length(I[i].zw)*2.2)*g;}
 vec2 xb=x-u*dt;
 vec2 ub=(xb/px+.5*Rs)/Rs;vec2 e=1./Rs;
 vec2 Dc=sampD(P,ub,Rs);
 vec2 Db=(sampD(P,ub+vec2(e.x,0.)*1.5,Rs)+sampD(P,ub-vec2(e.x,0.)*1.5,Rs)+sampD(P,ub+vec2(0.,e.y)*1.5,Rs)+sampD(P,ub-vec2(0.,e.y)*1.5,Rs))*.25;
 float mv=clamp(length(u)*4.,0.,1.);
 vec2 D=mix(Db,Dc,.35+.6*mv)-u*dt;
 vec2 uv0=gl_FragCoord.xy/Rs;float edge=smoothstep(0.,.06,min(min(uv0.x,1.-uv0.x),min(uv0.y,1.-uv0.y)));
 gl_FragColor=enc(D*exp(-dt*.6)*mix(.9,1.,edge));}`;
  const MAIN =
    "#extension GL_OES_standard_derivatives : enable\n" +
    COMMON +
    `uniform vec2 R;uniform float T;uniform vec2 O;uniform sampler2D D;uniform vec2 Rs;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<2;i++){v+=a*n(p);p=m*p;a*=.5;}return v/.75;}
float field(vec2 p,float t){
 vec2 q=vec2(fbm(p+vec2(0.,t)),fbm(p+vec2(5.2,1.3)-t));
 vec2 r=vec2(fbm(p+1.1*q+vec2(1.7,9.2)+.9*t),fbm(p+1.1*q+vec2(8.3,2.8)-.8*t));
 return fbm(p+1.05*r+vec2(.3*t,-.25*t));}
void main(){
 vec2 uv=gl_FragCoord.xy/R;float S=.8;float px=S/min(R.x,R.y);
 vec2 p0=(gl_FragCoord.xy-.5*R)*px;
 vec2 p=p0+sampD(D,uv,Rs)+O;
 float t=T*.045;float N=8.;
 float f=field(p,t);float k=f*N;float fr=fract(k);float id=floor(k);
#ifdef GL_OES_standard_derivatives
 vec2 gk=vec2(dFdx(k),dFdy(k));
#else
 vec2 gk=vec2(.02);
#endif
 float base=.8+.2*h(vec2(id,7.3));
 float shade=base*mix(.8,1.,smoothstep(0.,.85,fr));
 vec3 nn=normalize(vec3(-gk/(N*px)*.35,1.));
 shade*=mix(.92,1.,smoothstep(.3,1.,dot(nn,normalize(vec3(-.5,.55,.65)))));
 shade=clamp(shade*mix(.9,1.,smoothstep(1.3,.2,length(uv-.5)*1.4)),0.,1.);
 float dpx=min(fr,1.-fr)/max(length(gk),1e-4);
 float ln=(1.-smoothstep(.5,1.4,dpx))*.65;
 vec3 deep=vec3(0.,0.,.12);vec3 navy=vec3(0.,0.,104./255.);
 gl_FragColor=vec4(mix(mix(deep,navy,shade),vec3(1.),ln),1.);}`;

  class HeroBloom extends HTMLElement {
    connectedCallback() {
      this.style.cssText +=
        ";display:block;position:absolute;inset:0;overflow:hidden;pointer-events:none;background:#000068";
      const c = document.createElement("canvas");
      c.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;display:block";
      this.appendChild(c);
      const gl = c.getContext("webgl", {
        antialias: false,
        alpha: false,
        premultipliedAlpha: false,
        powerPreference: "low-power",
      });
      if (!gl) return;
      gl.getExtension("OES_standard_derivatives");
      const sh = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
          console.warn(gl.getShaderInfoLog(s));
        return s;
      };
      const prog = (fs) => {
        const p = gl.createProgram();
        gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
        gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
        gl.bindAttribLocation(p, 0, "p");
        gl.linkProgram(p);
        return p;
      };
      const pSim = prog(SIM),
        pMain = prog(MAIN);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      const U = (p, n) => gl.getUniformLocation(p, n);
      const s = {
        Rs: U(pSim, "Rs"),
        dt: U(pSim, "dt"),
        P: U(pSim, "P"),
        I: U(pSim, "I"),
        A: U(pSim, "A"),
      };
      const m = {
        R: U(pMain, "R"),
        T: U(pMain, "T"),
        O: U(pMain, "O"),
        D: U(pMain, "D"),
        Rs: U(pMain, "Rs"),
      };

      // ping-pong displacement targets
      let SW = 0,
        SH = 0,
        tgt = [],
        cur = 0;
      const mkTarget = (w, h) => {
        const t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          w,
          h,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          null
        );
        const f = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, f);
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          t,
          0
        );
        gl.viewport(0, 0, w, h);
        gl.clearColor(127 / 255, 1, 127 / 255, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return { t, f };
      };
      const sizeSim = () => {
        const cw = Math.max(1, this.clientWidth),
          ch = Math.max(1, this.clientHeight),
          k = Math.min(1, 360 / Math.max(cw, ch));
        const w = Math.max(8, Math.round(cw * k)),
          h = Math.max(8, Math.round(ch * k));
        if (w === SW && h === SH) return;
        tgt.forEach((o) => {
          gl.deleteTexture(o.t);
          gl.deleteFramebuffer(o.f);
        });
        SW = w;
        SH = h;
        tgt = [mkTarget(w, h), mkTarget(w, h)];
        cur = 0;
      };

      // cursor impulses (velocity sources that fade fast; their effect accumulates permanently in the map)
      const imp = new Float32Array(NI * 4),
        age = new Float32Array(NI).fill(99);
      let head = 0,
        ox = 0,
        oy = 0,
        fvx = 0,
        fvy = 0,
        pt = null,
        lastEmit = 0,
        svx = 0,
        svy = 0;
      this._onMove = (ev) => {
        const r = this.getBoundingClientRect();
        if (
          ev.clientX < r.left ||
          ev.clientX > r.right ||
          ev.clientY < r.top ||
          ev.clientY > r.bottom
        ) {
          pt = null;
          return;
        }
        const k = 0.8 / Math.min(r.width, r.height),
          now = performance.now();
        const x = (ev.clientX - r.left - r.width / 2) * k,
          y = (r.height / 2 - (ev.clientY - r.top)) * k;
        if (pt) {
          const dt = Math.max(8, now - pt.t) / 1000;
          svx += ((x - pt.x) / dt - svx) * 0.4;
          svy += ((y - pt.y) / dt - svy) * 0.4;
          if (now - lastEmit > 50 && age[head] > 1.55) {
            lastEmit = now;
            let vx = svx * 0.3,
              vy = svy * 0.3;
            const mg = Math.hypot(vx, vy);
            if (mg > 1.2) {
              vx *= 1.2 / mg;
              vy *= 1.2 / mg;
            }
            if (mg > 0.01) {
              imp.set([x, y, vx, vy], head * 4);
              age[head] = 0;
              head = (head + 1) % NI;
              fvx -= vx * 0.004;
              fvy -= vy * 0.004;
            }
          }
        }
        pt = { x, y, t: now };
      };

      const dpr = window.devicePixelRatio || 1;
      let scale = Math.min(dpr, 1.5);
      const seed = 40 + Math.random() * 200;
      const resize = () => {
        const w = Math.max(1, Math.round(this.clientWidth * scale)),
          hh = Math.max(1, Math.round(this.clientHeight * scale));
        if (c.width !== w || c.height !== hh) {
          c.width = w;
          c.height = hh;
        }
        sizeSim();
      };
      const t0 = performance.now();
      let last = t0,
        slow = 0;
      const frame = (now, dt) => {
        resize();
        if (dt > 0) {
          const a = tgt[cur],
            b = tgt[1 - cur];
          gl.useProgram(pSim);
          gl.bindFramebuffer(gl.FRAMEBUFFER, b.f);
          gl.viewport(0, 0, SW, SH);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, a.t);
          gl.uniform1i(s.P, 0);
          gl.uniform2f(s.Rs, SW, SH);
          gl.uniform1f(s.dt, dt);
          gl.uniform4fv(s.I, imp);
          gl.uniform1fv(s.A, age);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          cur = 1 - cur;
        }
        gl.useProgram(pMain);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, c.width, c.height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tgt[cur].t);
        gl.uniform1i(m.D, 0);
        gl.uniform2f(m.Rs, SW, SH);
        gl.uniform2f(m.R, c.width, c.height);
        gl.uniform1f(m.T, seed + (now - t0) / 1000);
        gl.uniform2f(m.O, ox, oy);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const loop = (now) => {
        this._raf = requestAnimationFrame(loop);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (this.getBoundingClientRect().bottom <= 0 || document.hidden) return;
        if (dt > 0.024) {
          if (++slow > 20 && scale > 0.5) {
            scale = Math.max(0.5, scale * 0.8);
            slow = 0;
          }
        } else slow = Math.max(0, slow - 1);
        for (let i = 0; i < NI; i++) age[i] += dt;
        const k = Math.exp(-dt * 0.4);
        fvx *= k;
        fvy *= k;
        ox += fvx * dt;
        oy += fvy * dt;
        frame(now, dt);
      };
      if (reduce) {
        frame(t0, 0);
        this._ro = new ResizeObserver(() => frame(t0, 0));
        this._ro.observe(this);
      } else {
        frame(t0, 0);
        this._raf = requestAnimationFrame(loop);
        window.addEventListener("pointermove", this._onMove, { passive: true });
      }
    }
    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      this._onMove && window.removeEventListener("pointermove", this._onMove);
      this._ro && this._ro.disconnect();
    }
  }
  customElements.define("hero-bloom", HeroBloom);
})();

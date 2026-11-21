import { useEffect, useRef, useState, CSSProperties, ReactNode, PointerEvent } from "react";
import { slides } from "./data";

/* ---------- helpers ---------- */
const u = (n: number) => `calc(var(--u) * ${n})`;
type Vars = CSSProperties & Record<`--${string}`, string | number>;
type FaceName = "front" | "back" | "left" | "right" | "top" | "bottom";
const FACES: FaceName[] = ["front", "back", "left", "right", "top", "bottom"];

/** A 3D box built from six CSS faces. w/h/d are in "u" units (1u = 1% of the stage width). */
function Cuboid({ w, h, d, className = "", faces = {}, style }: {
  w: number; h: number; d: number; className?: string;
  faces?: Partial<Record<FaceName, ReactNode>>; style?: Vars;
}) {
  const v: Vars = { "--w": u(w), "--h": u(h), "--d": u(d), ...style };
  return (
    <div className={`cub ${className}`} style={v}>
      {FACES.map((f) => <div key={f} className={`face ${f}`}>{faces[f]}</div>)}
    </div>
  );
}

/** Positions an object in the scene (x/y/z in u units, rotations in degrees). */
function Obj({ x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, children }: {
  x?: number; y?: number; z?: number; rx?: number; ry?: number; rz?: number; children: ReactNode;
}) {
  return (
    <div className="obj" style={{ transform: `translate3d(${u(x)},${u(y)},${u(z)}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
      {children}
    </div>
  );
}

const Bob = ({ dur = 7, delay = 0, amp = 2, children }: { dur?: number; delay?: number; amp?: number; children: ReactNode }) => (
  <div className="bob" style={{ "--dur": `${dur}s`, "--delay": `${delay}s`, "--amp": u(amp) } as Vars}>{children}</div>
);

/** Fakes solid depth by stacking copies of a glyph or shape along Z. */
function Extrude({ layers = 10, step = 0.7, children }: { layers?: number; step?: number; children: ReactNode }) {
  return (
    <div className="ext">
      {Array.from({ length: layers }, (_, i) => (
        <span
          key={i}
          className={i === layers - 1 ? "ext-l top" : "ext-l"}
          style={{ transform: `translateZ(${u(i * step)})`, "--k": i / (layers - 1) } as Vars}
        >{children}</span>
      ))}
    </div>
  );
}

/* ---------- stage: perspective + pointer / touch-drag interaction ---------- */
function Stage({ className = "", label, base = [-8, -24], children }: {
  className?: string; label: string; base?: [number, number]; children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const start = useRef<number | null>(null);
  const set = (k: string, v: string) => ref.current?.style.setProperty(k, v);

  const move = (e: PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    if (e.pointerType === "mouse") {
      const r = el.getBoundingClientRect();
      set("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
      set("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
    } else if (start.current !== null) {
      set("--dx", String(Math.max(-60, Math.min(60, (e.clientX - start.current) * 0.3))));
    }
  };
  const down = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") start.current = e.clientX;
  };
  const end = () => { start.current = null; set("--dx", "0"); };
  const leave = () => { set("--px", "0"); set("--py", "0"); };

  return (
    <div
      ref={ref}
      className={`stage ${className}`}
      role="img"
      aria-label={label}
      onPointerMove={move}
      onPointerDown={down}
      onPointerUp={end}
      onPointerCancel={end}
      onPointerLeave={(e) => { leave(); if (e.pointerType !== "mouse") end(); }}
    >
      <div className="persp" aria-hidden="true">
        <div className="sway">
          <div className="tilt" style={{ "--bx": `${base[0]}deg`, "--by": `${base[1]}deg` } as Vars}>
            <div className="scene">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- hero objects ---------- */
function Book() {
  return (
    <div className="bob-spin">
      <Cuboid
        className="book" w={46} h={60} d={14}
        faces={{
          front: (
            <div className="cover">
              <i className="frame" />
              <Extrude layers={10} step={0.75}><b className="glyph">S</b></Extrude>
              <span className="cover-name">Suxess Schools</span>
            </div>
          ),
          left: <div className="spine"><i /><i /><i /><i /></div>,
          back: <div className="cover back-cover" />,
        }}
      />
      <div className="ribbon" />
    </div>
  );
}

const LETTERS: Partial<Record<FaceName, ReactNode>> = {
  front: "A", right: "B", back: "C", left: "1", top: "2", bottom: "3",
};

function Polaroid() {
  const n = slides.length;
  const [a, setA] = useState(0);          // photo on the front face
  const [b, setB] = useState(1 % n);      // photo on the back face
  const [flip, setFlip] = useState(false);

  // preload, then flip the card on a timer (skipped for reduced motion)
  useEffect(() => {
    slides.forEach((s) => { const i = new Image(); i.src = s.img; });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setFlip((f) => !f), 5600);
    return () => clearInterval(t);
  }, []);

  // once a flip has finished, load the next photo onto the face that is now hidden
  useEffect(() => {
    const id = setTimeout(() => {
      const next = ((flip ? b : a) + 1) % n;
      if (flip) setA(next); else setB(next);
    }, 1400);
    return () => clearTimeout(id);
  }, [flip]); // eslint-disable-line react-hooks/exhaustive-deps

  const face = (i: number, cls: string) => (
    <div className={`pface ${cls}`}>
      <img src={slides[i].img} alt="" style={{ objectPosition: slides[i].pos }} />
      <span>{slides[i].label}</span>
    </div>
  );
  return (
    <div className={flip ? "polaroid flipped" : "polaroid"}>
      <div className="pflip">{face(a, "pf")}{face(b, "pb")}</div>
    </div>
  );
}

const SPARKS: [number, number, number, number][] = [
  [-44, -6, 18, 0], [44, -8, 10, 1.2], [-18, -44, 6, 2.1], [14, 38, 24, 0.7],
  [-40, 40, 8, 1.7], [30, -26, 26, 2.6], [-8, 46, 14, 3.1],
];

export function HeroStage() {
  return (
    <Stage className="hero-stage" label="A 3D illustration of a Suxess Schools book, learning blocks and photos from school life" base={[-10, -32]}>
      <div className="glow" />
      <Obj y={46}><div className="floor" /></Obj>
      <Obj x={-10} y={-3}><Bob dur={7} amp={1.8}><Book /></Bob></Obj>
      <Obj x={28} y={13} z={22} ry={-14} rz={2}><Bob dur={6} delay={-2} amp={1.4}><Polaroid /></Bob></Obj>
      <Obj x={-37} y={-31} z={16}><Bob dur={8} delay={-1} amp={2.2}><div className="spin s1"><Cuboid w={11} h={11} d={11} className="block gold" faces={LETTERS} /></div></Bob></Obj>
      <Obj x={39} y={-33} z={-8}><Bob dur={9} delay={-4} amp={2}><div className="spin s2"><Cuboid w={9} h={9} d={9} className="block green" faces={LETTERS} /></div></Bob></Obj>
      <Obj x={-36} y={30} z={26}><Bob dur={6.5} delay={-3} amp={1.6}><div className="spin s3"><Cuboid w={7} h={7} d={7} className="block green" faces={LETTERS} /></div></Bob></Obj>
      {SPARKS.map(([x, y, z, d], i) => (
        <Obj key={i} x={x} y={y} z={z}><Bob dur={5 + (i % 3)} delay={-d} amp={2.5}><i className="spark" /></Bob></Obj>
      ))}
    </Stage>
  );
}

/* ---------- schools: steps from Nursery to Secondary ---------- */
const STEPS: [string, number, string][] = [
  ["Nursery", 12, "#2f8f68"],
  ["Primary", 22, "#1b6a4b"],
  ["Secondary", 32, "#0f4332"],
];

export function Stairs() {
  const ground = 26;
  return (
    <Stage className="stairs-stage" label="3D steps rising from Nursery to Primary to Secondary" base={[-20, -30]}>
      <Obj y={ground + 1}><div className="floor wide" /></Obj>
      {STEPS.map(([name, h, c], i) => (
        <Obj key={name} x={(i - 1) * 25} y={ground - h / 2}>
          <Cuboid w={22} h={h} d={28} className="step" style={{ "--c": c }} faces={{ front: <span className="step-label">{name}</span> }} />
        </Obj>
      ))}
      <Obj x={25} y={ground - 32 - 9}>
        <Bob dur={5} amp={1.5}>
          <div className="spin s2"><Extrude layers={7} step={0.6}><i className="star" /></Extrude></div>
        </Bob>
      </Obj>
    </Stage>
  );
}

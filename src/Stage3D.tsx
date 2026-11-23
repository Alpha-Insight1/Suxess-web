import { useRef, CSSProperties, ReactNode, PointerEvent } from "react";

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

/** Fakes solid depth by stacking copies of a shape along Z. */
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

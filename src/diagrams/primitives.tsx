import type { ReactNode } from 'react';

export type Tone = '' | 'accent' | 'ok' | 'bad' | 'info' | 'warn';

export function Svg({ w, h, children, title }: { w: number; h: number; children: ReactNode; title: string }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={title}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="d-arrow" />
        </marker>
        <marker id="arr-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="d-arrow-accent" />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

export function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  tone = '',
  r = 10,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string | string[];
  tone?: Tone;
  r?: number;
}) {
  const subs = Array.isArray(sub) ? sub : sub ? [sub] : [];
  const lines = 1 + subs.length;
  const lineH = 15;
  const startY = y + h / 2 - ((lines - 1) * lineH) / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} className={`d-box${tone ? '-' + tone : ''}`} />
      <text x={x + w / 2} y={startY} textAnchor="middle" dominantBaseline="middle" className="d-text-bold">
        {title}
      </text>
      {subs.map((s, i) => (
        <text key={i} x={x + w / 2} y={startY + (i + 1) * lineH} textAnchor="middle" dominantBaseline="middle" className="d-text-sm">
          {s}
        </text>
      ))}
    </g>
  );
}

export function Arrow({
  from,
  to,
  label,
  accent = false,
  dash = false,
  labelDy = -6,
  curve,
}: {
  from: [number, number];
  to: [number, number];
  label?: string;
  accent?: boolean;
  dash?: boolean;
  labelDy?: number;
  /** Optional control point for a quadratic curve. */
  curve?: [number, number];
}) {
  const d = curve ? `M${from[0]} ${from[1]} Q${curve[0]} ${curve[1]} ${to[0]} ${to[1]}` : `M${from[0]} ${from[1]} L${to[0]} ${to[1]}`;
  const mx = curve ? (from[0] + 2 * curve[0] + to[0]) / 4 : (from[0] + to[0]) / 2;
  const my = curve ? (from[1] + 2 * curve[1] + to[1]) / 4 : (from[1] + to[1]) / 2;
  return (
    <g>
      <path d={d} className={`${accent ? 'd-line-accent' : 'd-line'} ${dash ? 'd-dash' : ''}`} markerEnd={`url(#${accent ? 'arr-accent' : 'arr'})`} />
      {label && (
        <text x={mx} y={my + labelDy} textAnchor="middle" className="d-text-sm">
          {label}
        </text>
      )}
    </g>
  );
}

export function Label({ x, y, children, bold = false, anchor = 'start' }: { x: number; y: number; children: ReactNode; bold?: boolean; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={bold ? 'd-text-bold' : 'd-text-sm'}>
      {children}
    </text>
  );
}

export function Group({ x, y, w, h, title }: { x: number; y: number; w: number; h: number; title: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} className="d-box d-dash" style={{ fill: 'transparent' }} />
      <text x={x + 12} y={y + 18} className="d-text-sm" style={{ fontWeight: 700 }}>
        {title}
      </text>
    </g>
  );
}

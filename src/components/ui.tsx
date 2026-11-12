import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Certification, Concept, Domain } from '../content/types';
import { conceptsForDomain } from '../lib/content';
import { useProgress } from '../lib/progress';

export function ProgressBar({ value, max, ok }: { value: number; max: number; ok?: boolean }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={`progress ${ok ? 'progress-ok' : ''}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Chip({ children, tone = '' }: { children: ReactNode; tone?: '' | 'accent' | 'ok' | 'bad' | 'info' | 'warn' }) {
  return <span className={`chip ${tone ? 'chip-' + tone : ''}`}>{children}</span>;
}

export function DifficultyChip({ d }: { d: Concept['difficulty'] }) {
  const tone = d === 'foundations' ? 'ok' : d === 'intermediate' ? 'info' : 'warn';
  return <Chip tone={tone}>{d}</Chip>;
}

export function DomainWeights({ cert, linkable = true }: { cert: Certification; linkable?: boolean }) {
  const max = Math.max(...cert.domains.map((d) => d.weight));
  return (
    <div className="weights">
      {cert.domains.map((d) => {
        const inner = (
          <>
            <div className="weight-label">
              <span className="weight-name">
                {d.number}. {d.name}
              </span>
              <div className="weight-bar">
                <span style={{ width: `${(d.weight / max) * 100}%` }} />
              </div>
            </div>
            <span className="weight-pct">
              {d.weightLow}–{d.weightHigh}%
            </span>
          </>
        );
        return linkable ? (
          <Link key={d.id} className="weight-row" to={`/cert/${cert.id}/domain/${d.id}`}>
            {inner}
          </Link>
        ) : (
          <div key={d.id} className="weight-row">
            {inner}
          </div>
        );
      })}
    </div>
  );
}

export function ConceptCard({ c, certId }: { c: Concept; certId?: string }) {
  const [p] = useProgress();
  const read = Boolean(p.readConcepts[c.id]);
  const to = certId ? `/cert/${certId}/concept/${c.id}` : `/concept/${c.id}`;
  return (
    <Link to={to} className="card card-link">
      <div className="row spread" style={{ marginBottom: '0.4rem' }}>
        <DifficultyChip d={c.difficulty} />
        {read && <Chip tone="ok">read</Chip>}
      </div>
      <h3 style={{ marginBottom: '0.3rem' }}>{c.title}</h3>
      <p className="muted small" style={{ marginBottom: '0.6rem' }}>
        {c.summary}
      </p>
      <div className="row small faint">
        <span>{c.flashcards.length} cards</span>
        <span>·</span>
        <span>{c.quiz.length} questions</span>
        <span>·</span>
        <span>{c.examples.length} examples</span>
      </div>
    </Link>
  );
}

export function DomainCoverage({ domain, certId }: { domain: Domain; certId: string }) {
  const [p] = useProgress();
  const list = conceptsForDomain(domain.id);
  const read = list.filter((c) => p.readConcepts[c.id]).length;
  return (
    <Link to={`/cert/${certId}/domain/${domain.id}`} className="card card-link">
      <div className="row spread">
        <span className="eyebrow">Group {domain.number}</span>
        <Chip tone="accent">
          {domain.weightLow}–{domain.weightHigh}%
        </Chip>
      </div>
      <h3>{domain.name}</h3>
      <p className="small muted" style={{ marginBottom: '0.6rem' }}>
        {list.length} concept{list.length === 1 ? '' : 's'} · {read} read
      </p>
      <ProgressBar value={read} max={list.length || 1} ok={read === list.length && list.length > 0} />
    </Link>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
      <h3>{title}</h3>
      <div className="muted">{children}</div>
    </div>
  );
}

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <pre>
      <code data-lang={language}>{code}</code>
    </pre>
  );
}

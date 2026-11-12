import { Link } from 'react-router-dom';
import { certifications, conceptsForCert, outcomeCoverage, totals } from '../lib/content';
import type { Track } from '../content/types';
import { useProgress } from '../lib/progress';
import { Chip, ProgressBar } from '../components/ui';

const TRACKS: { id: Track; blurb: string }[] = [
  {
    id: 'Microsoft 365 Copilot & Agents',
    blurb: 'For business users, leaders, admins, makers and architects working with Microsoft 365 Copilot, Copilot Studio and agents.',
  },
  {
    id: 'Azure AI & Foundry',
    blurb: 'For engineers building AI apps, agents and operations on Microsoft Foundry and Azure.',
  },
  {
    id: 'GitHub Copilot & Agentic AI',
    blurb: 'For developers and business professionals using GitHub Copilot and agentic workflows across the SDLC.',
  },
];

export function HomePage() {
  const t = totals();
  const [p] = useProgress();
  const outcomesTotal = certifications.reduce((n, c) => n + outcomeCoverage(c.id).total, 0);
  return (
    <>
      <section className="hero">
        <div className="eyebrow">Open-source exam prep</div>
        <h1>Master every Microsoft AI and Copilot certification, outcome by outcome.</h1>
        <p className="lead">
          Built around the official "skills measured" from Microsoft Learn: {certifications.length} exams, {outcomesTotal} learning
          outcomes. Learn each one with worked examples and diagrams, then prove it with flashcards, true/false drills and timed
          exam simulations.
        </p>
        <div className="row" style={{ marginTop: '1rem' }}>
          <Link className="btn btn-primary btn-lg" to="/cert/ab-730">
            Start with AI Business Professional
          </Link>
          <Link className="btn btn-lg" to="/outcomes">
            Browse the outcome checklist
          </Link>
        </div>
        <div className="row" style={{ marginTop: '1.4rem', gap: '1.6rem' }}>
          <div className="stat">
            <b>{certifications.length}</b>
            <span className="small muted">exams</span>
          </div>
          <div className="stat">
            <b>{outcomesTotal}</b>
            <span className="small muted">learning outcomes</span>
          </div>
          <div className="stat">
            <b>{t.concepts}</b>
            <span className="small muted">concepts</span>
          </div>
          <div className="stat">
            <b>{t.flashcards}</b>
            <span className="small muted">flashcards</span>
          </div>
          <div className="stat">
            <b>{t.questions}</b>
            <span className="small muted">quiz questions</span>
          </div>
          <div className="stat">
            <b>{t.statements}</b>
            <span className="small muted">statements</span>
          </div>
        </div>
      </section>

      {TRACKS.map((tr) => (
        <section key={tr.id} style={{ marginTop: '1.5rem' }}>
          <h2>{tr.id}</h2>
          <p className="muted">{tr.blurb}</p>
          <div className="grid">
            {certifications
              .filter((c) => c.track === tr.id)
              .map((c) => {
                const list = conceptsForCert(c.id);
                const read = list.filter((x) => p.readConcepts[x.id]).length;
                const cov = outcomeCoverage(c.id);
                return (
                  <Link key={c.id} to={`/cert/${c.id}`} className="card card-link">
                    <div className="row spread" style={{ marginBottom: '0.4rem' }}>
                      <Chip tone="accent">{c.code}</Chip>
                      <span className="row" style={{ gap: '0.3rem' }}>
                        {c.beta && <Chip tone="warn">beta</Chip>}
                        <Chip>{c.level}</Chip>
                      </span>
                    </div>
                    <h3>{c.shortName}</h3>
                    <p className="muted small">{c.tagline}</p>
                    <div className="row small faint" style={{ marginBottom: '0.6rem' }}>
                      <span>{cov.total} outcomes</span>
                      <span>·</span>
                      <span>{list.length} concepts</span>
                      <span>·</span>
                      <span>{cov.covered} outcomes covered</span>
                    </div>
                    <ProgressBar value={read} max={list.length || 1} />
                  </Link>
                );
              })}
          </div>
        </section>
      ))}

      <section style={{ marginTop: '2.5rem' }}>
        <h2>How to study here</h2>
        <div className="grid">
          <div className="card">
            <h3>1. Start from the outcomes</h3>
            <p className="muted small">
              The outcome checklist lists exactly what Microsoft says each exam measures, weighted the way the exam is. Tick what you
              already know.
            </p>
          </div>
          <div className="card">
            <h3>2. Learn</h3>
            <p className="muted small">
              Each concept teaches the mechanism, the tradeoffs and the exam angle, with worked examples including a realistic
              mistake and its fix.
            </p>
          </div>
          <div className="card">
            <h3>3. Drill</h3>
            <p className="muted small">Leitner flashcards bring back what you miss. Statements are quick true/false checks.</p>
          </div>
          <div className="card">
            <h3>4. Simulate</h3>
            <p className="muted small">
              Exam mode draws questions in functional-group proportions, runs a timer and reports a per-group breakdown.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

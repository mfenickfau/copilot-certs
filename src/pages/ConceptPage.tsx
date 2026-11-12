import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { certById, conceptById, conceptsFor, domainById } from '../lib/content';
import { markRead, useProgress } from '../lib/progress';
import { Markdown } from '../components/Markdown';
import { Chip, CodeBlock, DifficultyChip, EmptyState } from '../components/ui';
import { Diagram, diagramMeta } from '../diagrams';
import { FlashcardDeck } from '../components/FlashcardDeck';
import { QuizRunner } from '../components/QuizRunner';
import { StatementDrill } from '../components/StatementDrill';
import { cardsFrom, questionsFrom, statementsFrom } from '../lib/content';

type Tab = 'learn' | 'examples' | 'diagram' | 'flashcards' | 'quiz' | 'statements';

export function ConceptPage() {
  const { certId, conceptId } = useParams();
  const c = conceptById(conceptId ?? '');
  const cert = certById(certId ?? '') ?? (c ? certById(c.certs[0]) : undefined);
  const [tab, setTab] = useState<Tab>('learn');
  const [p] = useProgress();

  useEffect(() => {
    setTab('learn');
  }, [conceptId]);

  const related = useMemo(() => {
    if (!c) return [];
    const pool = conceptsFor(undefined, c.domains).filter((x) => x.id !== c.id);
    return pool.slice(0, 6);
  }, [c]);

  if (!c) return <EmptyState title="Concept not found" />;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'learn', label: 'Learn' },
    { id: 'examples', label: 'Examples', count: c.examples.length },
    ...(c.diagram ? [{ id: 'diagram' as Tab, label: 'Diagram' }] : []),
    { id: 'flashcards', label: 'Flashcards', count: c.flashcards.length },
    { id: 'quiz', label: 'Quiz', count: c.quiz.length },
    { id: 'statements', label: 'Statements', count: c.statements.length },
  ];
  const read = Boolean(p.readConcepts[c.id]);

  return (
    <>
      <div className="eyebrow">
        <Link to="/">Home</Link>
        {cert && (
          <>
            {' / '}
            <Link to={`/cert/${cert.id}`}>{cert.code}</Link>
          </>
        )}
        {' / '}
        <Link to="/concepts">Concepts</Link>
      </div>
      <h1>{c.title}</h1>
      <p className="lead">{c.summary}</p>
      <div className="row" style={{ margin: '0.4rem 0 0.2rem' }}>
        <DifficultyChip d={c.difficulty} />
        {c.certs.map((id) => (
          <Link key={id} to={`/cert/${id}`} className="chip chip-accent">
            {certById(id)?.code}
          </Link>
        ))}
        {c.tags.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
      <div className="row small muted" style={{ marginTop: '0.5rem' }}>
        <span>Supports:</span>
        {c.domains.map((d) => {
          const hit = domainById(d);
          if (!hit) return null;
          return (
            <Link key={d} to={`/cert/${hit.cert.id}/domain/${d}`}>
              {hit.cert.code} D{hit.domain.number} {hit.domain.name}
            </Link>
          );
        })}
      </div>

      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
            {t.count !== undefined && <span className="count">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === 'learn' && (
        <div className="grid-2" style={{ alignItems: 'start', gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)' }}>
          <div>
            {c.sections.map((s) => (
              <section key={s.heading} style={{ marginBottom: '1.5rem' }}>
                <h2>{s.heading}</h2>
                <Markdown source={s.body} />
              </section>
            ))}
            <div className="row" style={{ marginTop: '1rem' }}>
              <button className={`btn ${read ? '' : 'btn-primary'}`} onClick={() => markRead(c.id)} disabled={read}>
                {read ? '✓ Marked as read' : 'Mark as read'}
              </button>
              <button className="btn" onClick={() => setTab('examples')}>
                Next: examples →
              </button>
            </div>
          </div>
          <aside className="stack">
            <div className="card">
              <h3>Key points</h3>
              <ul style={{ paddingLeft: '1.1rem', margin: 0 }} className="small">
                {c.keyPoints.map((k) => (
                  <li key={k} style={{ marginBottom: '0.4rem' }}>
                    {k}
                  </li>
                ))}
              </ul>
            </div>
            {c.diagram && (
              <div className="card">
                <h3>Diagram</h3>
                <p className="small muted">{diagramMeta[c.diagram]?.title}</p>
                <button className="btn btn-sm" onClick={() => setTab('diagram')}>
                  View diagram
                </button>
              </div>
            )}
            {c.resources.length > 0 && (
              <div className="card">
                <h3>Official docs</h3>
                <ul className="list-plain small">
                  {c.resources.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noreferrer">
                        {r.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {related.length > 0 && (
              <div className="card">
                <h3>Related concepts</h3>
                <ul className="list-plain small">
                  {related.map((r) => (
                    <li key={r.id}>
                      <Link to={cert ? `/cert/${cert.id}/concept/${r.id}` : `/concept/${r.id}`}>{r.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      )}

      {tab === 'examples' && (
        <div className="stack">
          {c.examples.map((e, i) => (
            <article key={e.title} className="card">
              <div className="eyebrow">Example {i + 1}</div>
              <h3>{e.title}</h3>
              <Markdown source={e.description} />
              {e.code && <CodeBlock code={e.code} language={e.language} />}
              <div className="explain">
                <b>Takeaway:</b> {e.takeaway}
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'diagram' && c.diagram && (
        <div className="stack">
          <div className="card">
            <h3>{diagramMeta[c.diagram]?.title}</h3>
            <p className="muted small">{diagramMeta[c.diagram]?.caption}</p>
            <Diagram id={c.diagram} />
          </div>
        </div>
      )}

      {tab === 'flashcards' && <FlashcardDeck cards={cardsFrom([c])} />}
      {tab === 'quiz' && <QuizRunner questions={questionsFrom([c])} mode="practice" />}
      {tab === 'statements' && <StatementDrill statements={statementsFrom([c])} />}
    </>
  );
}

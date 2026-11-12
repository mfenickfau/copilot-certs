import { Link, useParams } from 'react-router-dom';
import { certById, conceptsForDomain, conceptsForOutcome } from '../lib/content';
import { Chip, ConceptCard, EmptyState } from '../components/ui';
import { useProgress } from '../lib/progress';

export function DomainPage() {
  const { certId, domainId } = useParams();
  const cert = certById(certId ?? '');
  const domain = cert?.domains.find((d) => d.id === domainId);
  const [p] = useProgress();
  if (!cert || !domain) return <EmptyState title="Unknown functional group" />;
  const list = conceptsForDomain(domain.id);
  const read = list.filter((c) => p.readConcepts[c.id]).length;
  const outcomes = domain.skills.flatMap((s) => s.outcomes);
  const covered = outcomes.filter((o) => conceptsForOutcome(o.id).length > 0).length;

  return (
    <>
      <div className="eyebrow">
        <Link to="/">Home</Link> / <Link to={`/cert/${cert.id}`}>{cert.code}</Link> / Group {domain.number}
      </div>
      <h1>{domain.name}</h1>
      <div className="row" style={{ margin: '0.4rem 0 1.2rem' }}>
        <Chip tone="accent">
          {domain.weightLow}–{domain.weightHigh}% of the exam
        </Chip>
        <Chip>≈ {Math.round((domain.weight / 100) * cert.simulationItems)} questions</Chip>
        <Chip>
          {covered} / {outcomes.length} outcomes covered
        </Chip>
        <Chip>
          {read} / {list.length} concepts read
        </Chip>
      </div>

      <div className="grid-2" style={{ alignItems: 'start', gridTemplateColumns: 'minmax(0, 3fr) minmax(260px, 2fr)' }}>
        <div className="card">
          <h2>Skills and learning outcomes</h2>
          <p className="small muted">
            Transcribed from Microsoft's study guide. Each outcome links to the concepts that teach it; grey outcomes have no study
            material yet.
          </p>
          {domain.skills.map((s) => (
            <div key={s.id} style={{ marginBottom: '1.1rem' }}>
              <h3 style={{ fontSize: '1rem' }}>{s.name}</h3>
              <ul className="list-plain small">
                {s.outcomes.map((o) => {
                  const teach = conceptsForOutcome(o.id);
                  return (
                    <li key={o.id} className="checkline" style={{ padding: '0.4rem 0' }}>
                      <span className={`dot ${teach.length ? 'done' : ''}`} />
                      <span>
                        {o.text}
                        {teach.length > 0 && (
                          <span className="faint">
                            {' '}
                            ·{' '}
                            {teach.map((c, i) => (
                              <span key={c.id}>
                                {i > 0 && ', '}
                                <Link to={`/cert/${cert.id}/concept/${c.id}`}>{c.title}</Link>
                              </span>
                            ))}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="stack">
          <div className="card">
            <h3>Drill this group</h3>
            <div className="row">
              <Link className="btn btn-primary" to={`/quiz?cert=${cert.id}&domain=${domain.id}`}>
                Quiz
              </Link>
              <Link className="btn" to={`/flashcards?cert=${cert.id}&domain=${domain.id}`}>
                Flashcards
              </Link>
              <Link className="btn" to={`/statements?cert=${cert.id}&domain=${domain.id}`}>
                Statements
              </Link>
            </div>
          </div>
          <div className="card">
            <h3>Concepts</h3>
            {list.length === 0 ? (
              <p className="small muted">No concepts yet for this group. See CONTRIBUTING.md to add some.</p>
            ) : (
              <div className="stack">
                {list.map((c) => (
                  <ConceptCard key={c.id} c={c} certId={cert.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

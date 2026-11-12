import { Link } from 'react-router-dom';
import { cardsFrom, certifications, conceptsForCert, conceptsForDomain, domainById } from '../lib/content';
import { resetProgress, useProgress } from '../lib/progress';
import { ProgressBar } from '../components/ui';

export function ProgressPage() {
  const [p] = useProgress();
  const attempts = p.attempts.slice(0, 15);

  return (
    <>
      <h1>Your progress</h1>
      <p className="lead">Everything here is stored only in this browser. Clear it any time.</p>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {certifications.map((c) => {
          const list = conceptsForCert(c.id);
          const read = list.filter((x) => p.readConcepts[x.id]).length;
          const cards = cardsFrom(list);
          const mastered = cards.filter((k) => (p.cards[k.id]?.box ?? 0) >= 3).length;
          const seenCards = cards.filter((k) => p.cards[k.id]).length;
          const lastExam = p.attempts.find((a) => a.mode === 'exam' && a.certId === c.id);
          return (
            <div className="card" key={c.id}>
              <div className="row spread">
                <h3>
                  <Link to={`/cert/${c.id}`}>{c.name}</Link>
                </h3>
                {lastExam && (
                  <span className={`chip ${lastExam.scaled! >= c.passingScore ? 'chip-ok' : 'chip-warn'}`}>Last sim {lastExam.scaled}</span>
                )}
              </div>
              <div className="stack" style={{ gap: '0.5rem' }}>
                <div>
                  <div className="row spread small muted">
                    <span>Concepts read</span>
                    <span>
                      {read} / {list.length}
                    </span>
                  </div>
                  <ProgressBar value={read} max={list.length || 1} />
                </div>
                <div>
                  <div className="row spread small muted">
                    <span>Flashcards mastered (box 3+)</span>
                    <span>
                      {mastered} / {cards.length} · {seenCards} seen
                    </span>
                  </div>
                  <ProgressBar value={mastered} max={cards.length || 1} ok />
                </div>
                <details>
                  <summary className="small muted" style={{ cursor: 'pointer' }}>
                    Per domain
                  </summary>
                  <div className="weights" style={{ marginTop: '0.5rem' }}>
                    {c.domains.map((d) => {
                      const dl = conceptsForDomain(d.id);
                      const dr = dl.filter((x) => p.readConcepts[x.id]).length;
                      return (
                        <Link key={d.id} to={`/cert/${c.id}/domain/${d.id}`} className="weight-row">
                          <div className="weight-label">
                            <span className="weight-name small">
                              D{d.number} {d.name}
                            </span>
                            <div className="weight-bar">
                              <span style={{ width: `${dl.length ? (dr / dl.length) * 100 : 0}%` }} />
                            </div>
                          </div>
                          <span className="weight-pct small">
                            {dr}/{dl.length}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </details>
              </div>
            </div>
          );
        })}
      </div>

      <section style={{ marginTop: '2rem' }}>
        <h2>Recent quiz attempts</h2>
        {attempts.length === 0 ? (
          <p className="muted">No quizzes yet.</p>
        ) : (
          <div className="card" style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>When</th>
                  <th>Mode</th>
                  <th>Scope</th>
                  <th>Score</th>
                  <th>Weakest domain</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => {
                  const weakest = Object.entries(a.byDomain)
                    .map(([d, r]) => ({ d, pct: r.total ? r.correct / r.total : 1 }))
                    .sort((x, y) => x.pct - y.pct)[0];
                  const hit = weakest ? domainById(weakest.d) : undefined;
                  return (
                    <tr key={a.id}>
                      <td>{new Date(a.at).toLocaleString()}</td>
                      <td>{a.mode}</td>
                      <td>{a.certId ? a.certId.toUpperCase() : 'all'}</td>
                      <td>
                        {a.correct}/{a.total}
                        {a.mode === 'exam' && a.scaled ? ` · ${a.scaled}` : ''}
                      </td>
                      <td>{hit ? `D${hit.domain.number} ${hit.domain.name} (${Math.round(weakest.pct * 100)}%)` : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <button
          className="btn"
          style={{ color: 'var(--bad)', borderColor: 'var(--bad)' }}
          onClick={() => {
            if (confirm('Reset all progress stored in this browser?')) resetProgress();
          }}
        >
          Reset all progress
        </button>
      </section>
    </>
  );
}

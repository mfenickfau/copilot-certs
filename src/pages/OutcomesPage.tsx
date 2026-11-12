import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { certById, certifications, conceptsForOutcome, outcomeCoverage } from '../lib/content';
import type { CertId } from '../content/types';
import { Chip, ProgressBar } from '../components/ui';

/**
 * The learning-outcome checklist: every skill Microsoft says the exam measures,
 * with the concepts that teach it. Learners can tick outcomes off as they go.
 */
export function OutcomesPage() {
  const { certId } = useParams();
  const [sel, setSel] = useState<CertId>((certId as CertId) || 'ab-730');
  const cert = certById(certId ?? sel) ?? certById(sel)!;
  const cov = outcomeCoverage(cert.id);
  const [ticks, setTicks] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('copilot-cert-academy:ticks') ?? '{}');
    } catch {
      return {};
    }
  });
  const toggle = (id: string) => {
    const next = { ...ticks, [id]: !ticks[id] };
    setTicks(next);
    try {
      localStorage.setItem('copilot-cert-academy:ticks', JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };
  const ticked = cert.domains.flatMap((d) => d.skills.flatMap((s) => s.outcomes)).filter((o) => ticks[o.id]).length;

  return (
    <>
      <h1>Learning outcomes</h1>
      <p className="lead">
        Every outcome Microsoft lists in the official study guide, grouped exactly as the exam weights them. Tick what you can do;
        follow the links to learn the rest.
      </p>
      <div className="toolbar">
        <label>
          Exam
          <select className="select" value={cert.id} onChange={(e) => setSel(e.target.value as CertId)}>
            {certifications.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} · {c.shortName}
              </option>
            ))}
          </select>
        </label>
        <span className="small muted" style={{ marginLeft: 'auto' }}>
          {ticked} / {cov.total} ticked · {cov.covered} with study material
        </span>
      </div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="row spread">
          <h2>
            <Link to={`/cert/${cert.id}`}>{cert.name}</Link>
          </h2>
          <Chip tone="accent">{cert.code}</Chip>
        </div>
        <ProgressBar value={ticked} max={cov.total || 1} ok />
      </div>
      {cert.domains.map((d) => (
        <section key={d.id} className="card" style={{ marginBottom: '1rem' }}>
          <div className="row spread">
            <h2>
              {d.number}. {d.name}
            </h2>
            <Chip>
              {d.weightLow}–{d.weightHigh}%
            </Chip>
          </div>
          {d.skills.map((s) => (
            <div key={s.id} style={{ margin: '0.8rem 0 0.4rem' }}>
              <h3 style={{ fontSize: '1rem' }}>{s.name}</h3>
              <ul className="list-plain small">
                {s.outcomes.map((o) => {
                  const teach = conceptsForOutcome(o.id);
                  return (
                    <li key={o.id} style={{ padding: '0.35rem 0' }}>
                      <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                        <input type="checkbox" checked={Boolean(ticks[o.id])} onChange={() => toggle(o.id)} style={{ marginTop: '0.3rem' }} />
                        <span>
                          <span style={{ textDecoration: ticks[o.id] ? 'line-through' : 'none', color: ticks[o.id] ? 'var(--fg-faint)' : undefined }}>
                            {o.text}
                          </span>
                          {teach.length > 0 ? (
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
                          ) : (
                            <span className="chip" style={{ marginLeft: '0.4rem', fontSize: '0.68rem' }}>
                              no material yet
                            </span>
                          )}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </>
  );
}

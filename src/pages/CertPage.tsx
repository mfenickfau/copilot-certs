import { Link, useParams } from 'react-router-dom';
import { certById, conceptsForCert, outcomeCoverage } from '../lib/content';
import type { CertId } from '../content/types';
import { Chip, DomainCoverage, DomainWeights, EmptyState, ProgressBar } from '../components/ui';
import { useProgress } from '../lib/progress';

export function CertPage() {
  const { certId } = useParams();
  const cert = certById(certId ?? '');
  const [p] = useProgress();
  if (!cert) return <EmptyState title="Unknown certification" />;
  const list = conceptsForCert(cert.id as CertId);
  const read = list.filter((c) => p.readConcepts[c.id]).length;
  const lastExam = p.attempts.find((a) => a.mode === 'exam' && a.certId === cert.id);
  const cov = outcomeCoverage(cert.id);
  const skillCount = cert.domains.reduce((n, d) => n + d.skills.length, 0);

  return (
    <>
      <div className="eyebrow">
        <Link to="/">Home</Link> / {cert.track} / {cert.code}
      </div>
      <h1>{cert.name}</h1>
      <p className="lead">{cert.description}</p>
      <div className="row" style={{ margin: '0.5rem 0 1.5rem' }}>
        <Chip tone="accent">Exam {cert.code}</Chip>
        <Chip>{cert.level}</Chip>
        {cert.beta && <Chip tone="warn">Beta</Chip>}
        <Chip>{cert.domains.length} functional groups</Chip>
        <Chip>{skillCount} skills</Chip>
        <Chip>{cov.total} learning outcomes</Chip>
        {cert.skillsAsOf && <Chip>Skills measured as of {cert.skillsAsOf}</Chip>}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h2>Skills measured</h2>
          <p className="small muted">
            Microsoft's weighted functional groups for exam {cert.code}. Click one to see its skills and every learning outcome.
          </p>
          <DomainWeights cert={cert} />
          <p className="small faint" style={{ marginTop: '0.8rem' }}>
            Source:{' '}
            <a href={cert.studyGuideUrl} target="_blank" rel="noreferrer">
              official study guide ↗
            </a>{' '}
            ·{' '}
            <a href={cert.certificationUrl} target="_blank" rel="noreferrer">
              certification page ↗
            </a>
          </p>
        </div>
        <div className="stack">
          <div className="card">
            <h2>Your progress</h2>
            <div className="stack" style={{ gap: '0.5rem', marginBottom: '0.8rem' }}>
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
                  <span>Learning outcomes with study material</span>
                  <span>
                    {cov.covered} / {cov.total}
                  </span>
                </div>
                <ProgressBar value={cov.covered} max={cov.total || 1} ok />
              </div>
              {lastExam && (
                <p className="small muted" style={{ margin: 0 }}>
                  Last exam simulation: {lastExam.scaled} / 1,000
                </p>
              )}
            </div>
            <div className="row">
              <Link className="btn btn-primary" to={`/quiz?cert=${cert.id}&mode=exam`}>
                Exam simulation
              </Link>
              <Link className="btn" to={`/cert/${cert.id}/outcomes`}>
                Outcome checklist
              </Link>
              <Link className="btn" to={`/flashcards?cert=${cert.id}`}>
                Flashcards
              </Link>
              <Link className="btn" to={`/statements?cert=${cert.id}`}>
                Statements
              </Link>
              <Link className="btn" to={`/quiz?cert=${cert.id}`}>
                Practice quiz
              </Link>
            </div>
          </div>
          <div className="card">
            <h3>Audience profile</h3>
            <p className="small muted">{cert.audience}</p>
          </div>
        </div>
      </div>

      <section style={{ marginTop: '2rem' }}>
        <h2>Functional groups</h2>
        <div className="grid">
          {cert.domains.map((d) => (
            <DomainCoverage key={d.id} domain={d} certId={cert.id} />
          ))}
        </div>
      </section>
    </>
  );
}

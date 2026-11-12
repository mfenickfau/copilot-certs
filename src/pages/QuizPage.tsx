import { useMemo, useState } from 'react';
import { buildExam, certById, conceptsFor, questionsFrom, shuffle } from '../lib/content';
import type { TaggedQuestion } from '../lib/content';
import { QuizRunner } from '../components/QuizRunner';
import { StudyFilter, useStudyFilter } from '../components/StudyFilter';
import { Chip } from '../components/ui';

export function QuizPage() {
  const { certId, domainId, params, set } = useStudyFilter();
  const mode = params.get('mode') === 'exam' ? 'exam' : 'practice';
  const [count, setCount] = useState(10);
  const [session, setSession] = useState<{ questions: TaggedQuestion[]; key: number } | null>(null);

  const pool = useMemo(
    () => questionsFrom(conceptsFor(certId || undefined, domainId ? [domainId] : undefined)),
    [certId, domainId],
  );
  const cert = certId ? certById(certId) : undefined;

  function start() {
    if (mode === 'exam' && cert) {
      setSession({ questions: buildExam(cert.id, Math.min(cert.simulationItems, pool.length)), key: Date.now() });
    } else {
      setSession({ questions: shuffle(pool).slice(0, Math.min(count, pool.length)), key: Date.now() });
    }
  }

  if (session) {
    return (
      <>
        <h1>{mode === 'exam' ? `${cert?.code} exam simulation` : 'Practice quiz'}</h1>
        <QuizRunner
          key={session.key}
          questions={session.questions}
          mode={mode}
          certId={certId || undefined}
          domainIds={domainId ? [domainId] : undefined}
          minutes={mode === 'exam' ? cert?.minutes : undefined}
          onExit={() => setSession(null)}
        />
      </>
    );
  }

  return (
    <>
      <h1>Quiz</h1>
      <p className="lead">
        Practice mode shows the explanation after every question. Exam mode hides feedback, runs the official time limit, draws
        questions in blueprint proportions and reports a per-domain breakdown at the end.
      </p>
      <div className="tabs">
        <button className={`tab ${mode === 'practice' ? 'active' : ''}`} onClick={() => set({ mode: null })}>
          Practice
        </button>
        <button className={`tab ${mode === 'exam' ? 'active' : ''}`} onClick={() => set({ mode: 'exam', domain: null })}>
          Exam simulation
        </button>
      </div>
      <StudyFilter>
        {mode === 'practice' && (
          <label>
            Questions
            <select className="select" value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[5, 10, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
        <span className="small muted" style={{ marginLeft: 'auto' }}>
          {pool.length} questions available
        </span>
      </StudyFilter>

      {mode === 'exam' && !cert && <p className="muted">Choose an exam above to run a simulation.</p>}
      {mode === 'exam' && cert && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3>{cert.name}</h3>
          <div className="row">
            <Chip>{Math.min(cert.simulationItems, pool.length)} questions</Chip>
            <Chip>{cert.minutes} minutes</Chip>
            <Chip>Cut score {cert.passingScore}</Chip>
            <Chip>Blueprint-weighted draw</Chip>
          </div>
          {pool.length < cert.simulationItems && (
            <p className="small muted" style={{ marginTop: '0.6rem' }}>
              Only {pool.length} questions exist for this exam so far, so the simulation will be shorter than the real {cert.simulationItems}
              -item exam.
            </p>
          )}
        </div>
      )}
      <button className="btn btn-primary btn-lg" onClick={start} disabled={pool.length === 0 || (mode === 'exam' && !cert)}>
        Start {mode === 'exam' ? 'simulation' : 'quiz'}
      </button>
    </>
  );
}

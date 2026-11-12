import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { TaggedStatement } from '../lib/content';
import { shuffle } from '../lib/content';
import { recordStatement } from '../lib/progress';
import { Markdown } from './Markdown';
import { EmptyState, ProgressBar } from './ui';

export function StatementDrill({ statements }: { statements: TaggedStatement[] }) {
  const deck = useMemo(() => shuffle(statements), [statements]);
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<TaggedStatement[]>([]);

  useEffect(() => {
    setI(0);
    setAnswer(null);
    setScore(0);
    setMissed([]);
  }, [deck]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (answer === null) {
        if (e.key === 't' || e.key === 'ArrowRight') choose(true);
        if (e.key === 'f' || e.key === 'ArrowLeft') choose(false);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, i, deck]);

  if (deck.length === 0) return <EmptyState title="No statements in this selection" />;
  const s = deck[Math.min(i, deck.length - 1)];
  const done = i >= deck.length;

  function choose(v: boolean) {
    if (answer !== null) return;
    const ok = v === s.isTrue;
    recordStatement(s.id, ok);
    if (ok) setScore((x) => x + 1);
    else setMissed((m) => [...m, s]);
    setAnswer(v);
  }
  function next() {
    setAnswer(null);
    setI((n) => n + 1);
  }

  if (done) {
    return (
      <div className="stack">
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="eyebrow">Drill complete</div>
          <div className="score-big">
            {score} / {deck.length}
          </div>
          <p className="muted">{Math.round((score / deck.length) * 100)}% correct</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setI(0);
              setScore(0);
              setMissed([]);
            }}
          >
            Go again
          </button>
        </div>
        {missed.length > 0 && (
          <div className="card">
            <h3>Statements to revisit</h3>
            <ul className="list-plain">
              {missed.map((m) => (
                <li key={m.id}>
                  <span className={`chip ${m.isTrue ? 'chip-ok' : 'chip-bad'}`}>{m.isTrue ? 'TRUE' : 'FALSE'}</span> {m.text}
                  <div className="small muted">
                    {m.explanation} · <Link to={`/concept/${m.conceptId}`}>{m.conceptTitle}</Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const correct = answer !== null && answer === s.isTrue;

  return (
    <div className="stack">
      <div className="row spread small muted">
        <span>
          Statement {i + 1} of {deck.length} · <span className="faint">{s.conceptTitle}</span>
        </span>
        <span>Score {score}</span>
      </div>
      <ProgressBar value={i} max={deck.length} />
      <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
        <div className="eyebrow">True or false?</div>
        <div style={{ fontSize: '1.25rem', maxWidth: 640, margin: '0 auto 1.2rem' }}>
          <Markdown source={s.text} />
        </div>
        {answer === null ? (
          <div className="row" style={{ justifyContent: 'center' }}>
            <button className="btn btn-lg" style={{ borderColor: 'var(--bad)', color: 'var(--bad)' }} onClick={() => choose(false)}>
              False <span className="kbd">F</span>
            </button>
            <button className="btn btn-lg" style={{ borderColor: 'var(--ok)', color: 'var(--ok)' }} onClick={() => choose(true)}>
              True <span className="kbd">T</span>
            </button>
          </div>
        ) : (
          <>
            <div className={`explain ${correct ? 'good' : 'bad'}`} style={{ textAlign: 'left' }}>
              <b>
                {correct ? 'Correct.' : 'Not quite.'} The statement is {s.isTrue ? 'true' : 'false'}.
              </b>{' '}
              {s.explanation}
            </div>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={next}>
              Next <span className="kbd">space</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

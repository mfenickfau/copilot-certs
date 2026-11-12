import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { TaggedQuestion } from '../lib/content';
import { certById, domainById } from '../lib/content';
import { recordAttempt, recordQuizQuestion, scaledScore } from '../lib/progress';
import { Markdown } from './Markdown';
import { EmptyState, ProgressBar } from './ui';
import type { CertId } from '../content/types';

interface Props {
  questions: TaggedQuestion[];
  mode: 'practice' | 'exam';
  certId?: CertId;
  domainIds?: string[];
  /** Exam timer in minutes. */
  minutes?: number;
  onExit?: () => void;
}

const LETTERS = 'ABCDEF';

function sameSet(a: number[], b: number[]) {
  return a.length === b.length && a.every((x) => b.includes(x));
}

export function QuizRunner({ questions, mode, certId, domainIds, minutes, onExit }: Props) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(minutes ? minutes * 60 : 0);

  useEffect(() => {
    setI(0);
    setPicked([]);
    setAnswers({});
    setRevealed(false);
    setFinished(false);
    setSecondsLeft(minutes ? minutes * 60 : 0);
  }, [questions, minutes]);

  useEffect(() => {
    if (mode !== 'exam' || !minutes || finished) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [mode, minutes, finished]);

  const results = useMemo(() => {
    if (!finished) return null;
    let correct = 0;
    const byDomain: Record<string, { total: number; correct: number }> = {};
    for (const q of questions) {
      const ok = sameSet(answers[q.id] ?? [], q.correct);
      if (ok) correct++;
      const doms = certId ? q.domains.filter((d) => d.startsWith(certId + '-')) : q.domains;
      for (const d of doms.slice(0, 1)) {
        byDomain[d] = byDomain[d] ?? { total: 0, correct: 0 };
        byDomain[d].total++;
        if (ok) byDomain[d].correct++;
      }
    }
    return { correct, byDomain, scaled: scaledScore(correct, questions.length) };
  }, [finished, answers, questions, certId]);

  useEffect(() => {
    if (!results) return;
    recordAttempt({
      id: `${Date.now()}`,
      at: Date.now(),
      mode,
      certId,
      domainIds,
      total: questions.length,
      correct: results.correct,
      byDomain: results.byDomain,
      scaled: results.scaled,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  if (questions.length === 0) return <EmptyState title="No questions in this selection">Pick a different exam or domain.</EmptyState>;

  const q = questions[Math.min(i, questions.length - 1)];
  const multi = q.correct.length > 1;

  function toggle(idx: number) {
    if (revealed) return;
    setPicked((cur) => (multi ? (cur.includes(idx) ? cur.filter((x) => x !== idx) : [...cur, idx]) : [idx]));
  }

  function submit() {
    const ok = sameSet(picked, q.correct);
    recordQuizQuestion(q.id, ok);
    setAnswers((a) => ({ ...a, [q.id]: picked }));
    if (mode === 'practice') {
      setRevealed(true);
    } else {
      next();
    }
  }

  function next() {
    setRevealed(false);
    setPicked([]);
    if (i + 1 >= questions.length) setFinished(true);
    else setI(i + 1);
  }

  if (finished && results) {
    const cert = certId ? certById(certId) : undefined;
    const pass = cert ? results.scaled >= cert.passingScore : undefined;
    return (
      <div className="stack">
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="eyebrow">{mode === 'exam' ? 'Exam simulation complete' : 'Quiz complete'}</div>
          <div className="score-big">
            {results.correct} / {questions.length}
          </div>
          <p className="muted">{Math.round((results.correct / questions.length) * 100)}% correct</p>
          {mode === 'exam' && cert && (
            <>
              <div className={`chip ${pass ? 'chip-ok' : 'chip-bad'}`} style={{ fontSize: '0.95rem', padding: '0.4rem 0.9rem' }}>
                Estimated scaled score {results.scaled} / 1,000 · {pass ? 'PASS' : 'below the 720 cut'}
              </div>
              <p className="small faint" style={{ marginTop: '0.8rem' }}>
                The real exam uses a standard-setting study to map raw to scaled scores. This estimate assumes roughly 70% correct
                at the 720 cut and is only a rough indicator.
              </p>
            </>
          )}
          <div className="row" style={{ justifyContent: 'center', marginTop: '1rem' }}>
            {onExit && (
              <button className="btn btn-primary" onClick={onExit}>
                New quiz
              </button>
            )}
            <Link className="btn" to="/progress">
              View progress
            </Link>
          </div>
        </div>

        {Object.keys(results.byDomain).length > 1 && (
          <div className="card">
            <h3>By domain</h3>
            <p className="small muted">The official score report shows percent correct per domain. Weak domains are where to study next.</p>
            <div className="weights">
              {Object.entries(results.byDomain)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([d, r]) => {
                  const hit = domainById(d);
                  const pct = Math.round((r.correct / r.total) * 100);
                  return (
                    <div key={d} className="weight-row">
                      <div className="weight-label">
                        <span className="weight-name">
                          {hit ? `D${hit.domain.number} ${hit.domain.name}` : d}{' '}
                          <span className="faint small">
                            ({r.correct}/{r.total})
                          </span>
                        </span>
                        <div className="weight-bar">
                          <span style={{ width: `${pct}%`, background: pct >= 70 ? 'var(--ok)' : 'var(--bad)' }} />
                        </div>
                      </div>
                      <span className="weight-pct">{pct}%</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        <div className="card">
          <h3>Review</h3>
          <div className="stack">
            {questions.map((qq, n) => {
              const mine = answers[qq.id] ?? [];
              const ok = sameSet(mine, qq.correct);
              return (
                <details key={qq.id} className="card" style={{ boxShadow: 'none' }}>
                  <summary style={{ cursor: 'pointer' }}>
                    <span className={`chip ${ok ? 'chip-ok' : 'chip-bad'}`}>{ok ? 'Correct' : 'Missed'}</span>{' '}
                    <b>Q{n + 1}.</b> {qq.question.slice(0, 120)}
                    {qq.question.length > 120 ? '…' : ''}
                  </summary>
                  <div style={{ marginTop: '0.8rem' }}>
                    <Markdown source={qq.question} />
                    <ul style={{ paddingLeft: '1.1rem' }}>
                      {qq.options.map((o, k) => (
                        <li
                          key={k}
                          style={{
                            color: qq.correct.includes(k) ? 'var(--ok)' : mine.includes(k) ? 'var(--bad)' : undefined,
                            fontWeight: qq.correct.includes(k) ? 700 : 400,
                          }}
                        >
                          {LETTERS[k]}. {o}
                        </li>
                      ))}
                    </ul>
                    <div className={`explain ${ok ? 'good' : 'bad'}`}>{qq.explanation}</div>
                    <p className="small faint" style={{ marginTop: '0.5rem' }}>
                      From <Link to={`/concept/${qq.conceptId}`}>{qq.conceptTitle}</Link>
                    </p>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const correctNow = revealed && sameSet(picked, q.correct);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="stack">
      <div className="row spread small muted">
        <span>
          Question {i + 1} of {questions.length}
          {mode === 'practice' && (
            <>
              {' '}
              · <span className="faint">{q.conceptTitle}</span>
            </>
          )}
        </span>
        {mode === 'exam' && minutes ? (
          <span className={`timer ${secondsLeft < 300 ? 'chip chip-bad' : ''}`}>
            {mm}:{ss}
          </span>
        ) : (
          <span>{multi ? 'Select all that apply' : 'Select one'}</span>
        )}
      </div>
      <ProgressBar value={i} max={questions.length} />
      <div className="card">
        <Markdown source={q.question} />
        {multi && <p className="small muted">Select {q.correct.length}.</p>}
        <div className="stack" style={{ gap: '0.5rem' }}>
          {q.options.map((o, idx) => {
            let cls = 'option';
            if (picked.includes(idx)) cls += ' selected';
            if (revealed && q.correct.includes(idx)) cls += ' correct';
            if (revealed && picked.includes(idx) && !q.correct.includes(idx)) cls += ' wrong';
            return (
              <button key={idx} className={cls} onClick={() => toggle(idx)} aria-pressed={picked.includes(idx)}>
                <span className="letter">{LETTERS[idx]}</span>
                <span>{o}</span>
              </button>
            );
          })}
        </div>
        {revealed && (
          <div className={`explain ${correctNow ? 'good' : 'bad'}`}>
            <b>{correctNow ? 'Correct.' : 'Not quite.'}</b> {q.explanation}
          </div>
        )}
        <div className="row spread" style={{ marginTop: '1rem' }}>
          {onExit ? (
            <button className="btn btn-ghost btn-sm" onClick={onExit}>
              Quit
            </button>
          ) : (
            <span />
          )}
          {!revealed ? (
            <button className="btn btn-primary" disabled={picked.length === 0} onClick={submit}>
              {mode === 'exam' ? (i + 1 === questions.length ? 'Finish' : 'Next') : 'Check answer'}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={next}>
              {i + 1 === questions.length ? 'See results' : 'Next question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

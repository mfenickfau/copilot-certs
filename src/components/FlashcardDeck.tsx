import { useEffect, useMemo, useState } from 'react';
import type { TaggedCard } from '../lib/content';
import { shuffle } from '../lib/content';
import { rateCard, useProgress } from '../lib/progress';
import { Markdown } from './Markdown';
import { EmptyState, ProgressBar } from './ui';

interface Props {
  cards: TaggedCard[];
  /** Only show cards that are due or new (spaced repetition mode). */
  dueOnly?: boolean;
}

export function FlashcardDeck({ cards, dueOnly = false }: Props) {
  const [p] = useProgress();
  const deck = useMemo(() => {
    const now = Date.now();
    const filtered = dueOnly ? cards.filter((c) => (p.cards[c.id]?.due ?? 0) <= now) : cards;
    return shuffle(filtered);
    // Intentionally only reshuffle when the card set or mode changes, not on every rating.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, dueOnly]);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState<{ known: number; missed: number }>({ known: 0, missed: 0 });

  useEffect(() => {
    setI(0);
    setFlipped(false);
    setResults({ known: 0, missed: 0 });
  }, [deck]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && (e.key === 'ArrowRight' || e.key === 'k')) rate(true);
      else if (flipped && (e.key === 'ArrowLeft' || e.key === 'j')) rate(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, i, deck]);

  if (deck.length === 0) {
    return (
      <EmptyState title={dueOnly ? 'Nothing due right now' : 'No flashcards in this selection'}>
        {dueOnly ? 'Come back later, or switch off "due only" to review everything.' : 'Pick a different exam or domain.'}
      </EmptyState>
    );
  }

  const card = deck[Math.min(i, deck.length - 1)];
  const done = i >= deck.length;

  function rate(known: boolean) {
    rateCard(card.id, known);
    setResults((r) => ({ known: r.known + (known ? 1 : 0), missed: r.missed + (known ? 0 : 1) }));
    setFlipped(false);
    setI((n) => n + 1);
  }

  if (done) {
    const pct = Math.round((results.known / deck.length) * 100);
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="eyebrow">Deck complete</div>
        <div className="score-big">{pct}%</div>
        <p className="muted">
          {results.known} known · {results.missed} to review. Missed cards return tomorrow; known cards move up a box.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => {
            setI(0);
            setResults({ known: 0, missed: 0 });
          }}
        >
          Go again
        </button>
      </div>
    );
  }

  const box = p.cards[card.id]?.box ?? 0;

  return (
    <div className="stack">
      <div className="row spread small muted">
        <span>
          Card {i + 1} of {deck.length} · <span className="faint">{card.conceptTitle}</span>
        </span>
        <span title="Leitner box: higher means you know it better">Box {box} / 4</span>
      </div>
      <ProgressBar value={i} max={deck.length} />
      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped((f) => !f)} role="button" tabIndex={0} aria-label="Flip card">
        <div className="flashcard-inner">
          <div className="flashcard-face">
            <span className="face-label">Question</span>
            <Markdown source={card.front} />
          </div>
          <div className="flashcard-face flashcard-back">
            <span className="face-label">Answer</span>
            <Markdown source={card.back} />
          </div>
        </div>
      </div>
      <div className="row" style={{ justifyContent: 'center' }}>
        {!flipped ? (
          <button className="btn btn-primary btn-lg" onClick={() => setFlipped(true)}>
            Show answer <span className="kbd">space</span>
          </button>
        ) : (
          <>
            <button className="btn btn-lg" style={{ borderColor: 'var(--bad)', color: 'var(--bad)' }} onClick={() => rate(false)}>
              ← Still learning <span className="kbd">←</span>
            </button>
            <button className="btn btn-lg" style={{ borderColor: 'var(--ok)', color: 'var(--ok)' }} onClick={() => rate(true)}>
              Got it <span className="kbd">→</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

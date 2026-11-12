import { useMemo } from 'react';
import { cardsFrom, conceptsFor } from '../lib/content';
import { FlashcardDeck } from '../components/FlashcardDeck';
import { StudyFilter, useStudyFilter } from '../components/StudyFilter';
import { useProgress } from '../lib/progress';

export function FlashcardsPage() {
  const { certId, domainId, params, set } = useStudyFilter();
  const dueOnly = params.get('due') === '1';
  const [p] = useProgress();
  const cards = useMemo(() => cardsFrom(conceptsFor(certId || undefined, domainId ? [domainId] : undefined)), [certId, domainId]);
  const due = cards.filter((c) => (p.cards[c.id]?.due ?? 0) <= Date.now()).length;
  const mastered = cards.filter((c) => (p.cards[c.id]?.box ?? 0) >= 3).length;

  return (
    <>
      <h1>Flashcards</h1>
      <p className="lead">
        Flip, then rate yourself. Cards you know move up through five boxes with longer gaps between reviews (1, 3, 7, 21 days).
        Cards you miss drop back to box 0 and return tomorrow.
      </p>
      <StudyFilter>
        <label>
          <input type="checkbox" checked={dueOnly} onChange={(e) => set({ due: e.target.checked ? '1' : null })} /> Due only
        </label>
        <span className="small muted" style={{ marginLeft: 'auto' }}>
          {cards.length} cards · {due} due · {mastered} mastered
        </span>
      </StudyFilter>
      <FlashcardDeck cards={cards} dueOnly={dueOnly} />
    </>
  );
}

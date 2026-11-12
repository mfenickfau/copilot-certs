/**
 * Learner progress, stored in localStorage only. Nothing leaves the browser.
 * Every read and write is wrapped so private windows or blocked storage degrade
 * gracefully to an in-memory session.
 */
import { useCallback, useEffect, useState } from 'react';

const KEY = 'copilot-cert-academy:v1';

export interface CardState {
  /** Leitner box 0..4. Higher means better known. */
  box: number;
  /** Epoch ms when the card is next due. */
  due: number;
  seen: number;
  correct: number;
}

export interface QuizAttempt {
  id: string;
  at: number;
  mode: 'practice' | 'exam';
  certId?: string;
  domainIds?: string[];
  total: number;
  correct: number;
  /** Percent correct per domain id. */
  byDomain: Record<string, { total: number; correct: number }>;
  scaled?: number;
}

export interface Progress {
  readConcepts: Record<string, number>;
  cards: Record<string, CardState>;
  statements: Record<string, { seen: number; correct: number }>;
  quizQuestions: Record<string, { seen: number; correct: number }>;
  attempts: QuizAttempt[];
  theme?: 'light' | 'dark';
}

const empty = (): Progress => ({
  readConcepts: {},
  cards: {},
  statements: {},
  quizQuestions: {},
  attempts: [],
});

let memory: Progress | null = null;

export function loadProgress(): Progress {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    memory = raw ? { ...empty(), ...(JSON.parse(raw) as Progress) } : empty();
  } catch {
    memory = empty();
  }
  return memory;
}

const listeners = new Set<() => void>();

export function saveProgress(p: Progress) {
  memory = p;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable; keep in memory */
  }
  listeners.forEach((l) => l());
}

export function updateProgress(fn: (p: Progress) => Progress) {
  saveProgress(fn(structuredClone(loadProgress())));
}

export function resetProgress() {
  saveProgress(empty());
}

export function useProgress(): [Progress, (fn: (p: Progress) => Progress) => void] {
  const [state, setState] = useState<Progress>(loadProgress);
  useEffect(() => {
    const l = () => setState(loadProgress());
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  const update = useCallback((fn: (p: Progress) => Progress) => updateProgress(fn), []);
  return [state, update];
}

/** Leitner intervals in days per box. */
const INTERVALS = [0, 1, 3, 7, 21];
const DAY = 86_400_000;

export function rateCard(cardId: string, known: boolean) {
  updateProgress((p) => {
    const cur = p.cards[cardId] ?? { box: 0, due: 0, seen: 0, correct: 0 };
    const box = known ? Math.min(4, cur.box + 1) : 0;
    p.cards[cardId] = {
      box,
      due: Date.now() + INTERVALS[box] * DAY,
      seen: cur.seen + 1,
      correct: cur.correct + (known ? 1 : 0),
    };
    return p;
  });
}

export function markRead(conceptId: string) {
  updateProgress((p) => {
    p.readConcepts[conceptId] = Date.now();
    return p;
  });
}

export function recordStatement(id: string, correct: boolean) {
  updateProgress((p) => {
    const cur = p.statements[id] ?? { seen: 0, correct: 0 };
    p.statements[id] = { seen: cur.seen + 1, correct: cur.correct + (correct ? 1 : 0) };
    return p;
  });
}

export function recordQuizQuestion(id: string, correct: boolean) {
  updateProgress((p) => {
    const cur = p.quizQuestions[id] ?? { seen: 0, correct: 0 };
    p.quizQuestions[id] = { seen: cur.seen + 1, correct: cur.correct + (correct ? 1 : 0) };
    return p;
  });
}

export function recordAttempt(a: QuizAttempt) {
  updateProgress((p) => {
    p.attempts = [a, ...p.attempts].slice(0, 100);
    return p;
  });
}

/**
 * Approximate Anthropic's 100–1,000 scale. The real exams use a standard-setting
 * study we cannot reproduce, so this is a linear map where ~70% correct lands
 * at the 720 cut score. Treat it as a rough indicator only.
 */
export function scaledScore(correct: number, total: number): number {
  if (total === 0) return 100;
  const pct = correct / total;
  // 0% -> 100, 70% -> 720, 100% -> 1000
  const s = pct <= 0.7 ? 100 + (pct / 0.7) * 620 : 720 + ((pct - 0.7) / 0.3) * 280;
  return Math.round(s);
}

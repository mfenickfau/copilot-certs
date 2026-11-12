import { allConcepts } from '../content/concepts';
import { certifications, certById, domainById, allOutcomes } from '../content/certifications';
import type { CertId, Concept, Flashcard, QuizQuestion, Statement } from '../content/types';

export { certifications, certById, domainById, allOutcomes };

export const concepts: Concept[] = [...allConcepts].sort((a, b) => a.title.localeCompare(b.title));

export const conceptById = (id: string) => concepts.find((c) => c.id === id);

export function conceptsForCert(certId: CertId): Concept[] {
  return concepts.filter((c) => c.certs.includes(certId));
}

export function conceptsForDomain(domainId: string): Concept[] {
  return concepts.filter((c) => c.domains.includes(domainId));
}

export function conceptsFor(certId?: CertId, domainIds?: string[]): Concept[] {
  let list = certId ? conceptsForCert(certId) : concepts;
  if (domainIds && domainIds.length) {
    list = list.filter((c) => c.domains.some((d) => domainIds.includes(d)));
  }
  return list;
}

/** Primary domain for a concept within a cert: the first listed domain of that cert. */
export function primaryDomain(c: Concept, certId: CertId): string | undefined {
  return c.domains.find((d) => d.startsWith(certId + '-'));
}

export interface TaggedCard extends Flashcard {
  id: string;
  conceptId: string;
  conceptTitle: string;
}
export interface TaggedQuestion extends QuizQuestion {
  id: string;
  conceptId: string;
  conceptTitle: string;
  domains: string[];
}
export interface TaggedStatement extends Statement {
  id: string;
  conceptId: string;
  conceptTitle: string;
}

export function cardsFrom(list: Concept[]): TaggedCard[] {
  return list.flatMap((c) =>
    c.flashcards.map((f, i) => ({ ...f, id: `${c.id}#f${i}`, conceptId: c.id, conceptTitle: c.title })),
  );
}
export function questionsFrom(list: Concept[]): TaggedQuestion[] {
  return list.flatMap((c) =>
    c.quiz.map((q, i) => ({
      ...q,
      id: `${c.id}#q${i}`,
      conceptId: c.id,
      conceptTitle: c.title,
      domains: c.domains,
    })),
  );
}
export function statementsFrom(list: Concept[]): TaggedStatement[] {
  return list.flatMap((c) =>
    c.statements.map((s, i) => ({ ...s, id: `${c.id}#s${i}`, conceptId: c.id, conceptTitle: c.title })),
  );
}

export function shuffle<T>(arr: T[], seed?: number): T[] {
  const a = [...arr];
  let s = seed ?? Math.floor(Math.random() * 2 ** 31);
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 2 ** 32;
    return s / 2 ** 32;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick exam questions so each domain gets roughly its blueprint weight.
 * Falls back to whatever is available when a domain has too few questions.
 */
export function buildExam(certId: CertId, count: number): TaggedQuestion[] {
  const cert = certById(certId);
  if (!cert) return [];
  const pool = questionsFrom(conceptsForCert(certId));
  const used = new Set<string>();
  const picked: TaggedQuestion[] = [];
  for (const d of cert.domains) {
    const want = Math.round((d.weight / 100) * count);
    const candidates = shuffle(pool.filter((q) => q.domains.includes(d.id) && !used.has(q.id)));
    for (const q of candidates.slice(0, want)) {
      used.add(q.id);
      picked.push(q);
    }
  }
  // Top up if rounding or sparse domains left us short.
  for (const q of shuffle(pool)) {
    if (picked.length >= count) break;
    if (!used.has(q.id)) {
      used.add(q.id);
      picked.push(q);
    }
  }
  return shuffle(picked.slice(0, count));
}

export function searchConcepts(query: string): Concept[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return concepts
    .map((c) => {
      const hay = [c.title, c.summary, c.tags.join(' '), c.keyPoints.join(' '), c.sections.map((s) => s.heading).join(' ')]
        .join(' ')
        .toLowerCase();
      const score = terms.reduce((acc, t) => acc + (c.title.toLowerCase().includes(t) ? 3 : 0) + (hay.includes(t) ? 1 : 0), 0);
      return { c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.c);
}

export const totals = () => ({
  concepts: concepts.length,
  flashcards: concepts.reduce((n, c) => n + c.flashcards.length, 0),
  questions: concepts.reduce((n, c) => n + c.quiz.length, 0),
  statements: concepts.reduce((n, c) => n + c.statements.length, 0),
  examples: concepts.reduce((n, c) => n + c.examples.length, 0),
});

/** Concepts that teach a given official learning outcome. */
export function conceptsForOutcome(outcomeId: string): Concept[] {
  return concepts.filter((c) => c.outcomes.includes(outcomeId));
}

/** Outcome coverage for a certification: covered / total. */
export function outcomeCoverage(certId: CertId) {
  const cert = certById(certId);
  if (!cert) return { covered: 0, total: 0 };
  let covered = 0;
  let total = 0;
  for (const d of cert.domains)
    for (const s of d.skills)
      for (const o of s.outcomes) {
        total++;
        if (concepts.some((c) => c.outcomes.includes(o.id))) covered++;
      }
  return { covered, total };
}

import { useMemo, useState } from 'react';
import { certifications, concepts, searchConcepts } from '../lib/content';
import type { CertId } from '../content/types';
import { ConceptCard, EmptyState } from '../components/ui';

export function ConceptsPage() {
  const [q, setQ] = useState('');
  const [cert, setCert] = useState<'' | CertId>('');
  const [difficulty, setDifficulty] = useState('');
  const list = useMemo(() => {
    let base = q.trim() ? searchConcepts(q) : concepts;
    if (cert) base = base.filter((c) => c.certs.includes(cert));
    if (difficulty) base = base.filter((c) => c.difficulty === difficulty);
    return base;
  }, [q, cert, difficulty]);

  return (
    <>
      <h1>All concepts</h1>
      <p className="lead">Search across every lesson, or filter by exam and difficulty.</p>
      <div className="toolbar">
        <input
          className="input"
          style={{ flex: '1 1 240px' }}
          placeholder="Search concepts, e.g. caching, MCP, hooks…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search concepts"
        />
        <select className="select" value={cert} onChange={(e) => setCert(e.target.value as '' | CertId)} aria-label="Filter by exam">
          <option value="">All exams</option>
          {certifications.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} · {c.shortName}
            </option>
          ))}
        </select>
        <select className="select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} aria-label="Filter by difficulty">
          <option value="">Any difficulty</option>
          <option value="foundations">Foundations</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <span className="small muted">{list.length} shown</span>
      </div>
      {list.length === 0 ? (
        <EmptyState title="Nothing matches">Try a broader search term.</EmptyState>
      ) : (
        <div className="grid">
          {list.map((c) => (
            <ConceptCard key={c.id} c={c} certId={cert || undefined} />
          ))}
        </div>
      )}
    </>
  );
}

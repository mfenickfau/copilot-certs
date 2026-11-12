import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Diagram, diagramIds, diagramMeta } from '../diagrams';
import { concepts } from '../lib/content';

export function DiagramsPage() {
  const [active, setActive] = useState<string>(diagramIds[0]);
  const meta = diagramMeta[active];
  const using = concepts.filter((c) => c.diagram === active);
  return (
    <>
      <h1>Diagrams</h1>
      <p className="lead">Visual representations of the moving parts behind each concept. Pick one to view it large.</p>
      <div className="grid-2" style={{ gridTemplateColumns: 'minmax(220px, 1fr) minmax(0, 3fr)', alignItems: 'start' }}>
        <div className="card" style={{ padding: '0.5rem' }}>
          {diagramIds.map((id) => (
            <button
              key={id}
              className={`tab ${active === id ? 'active' : ''}`}
              style={{ display: 'block', width: '100%', textAlign: 'left', whiteSpace: 'normal', borderBottom: 'none', borderLeft: '2px solid', borderLeftColor: active === id ? 'var(--accent)' : 'transparent', borderRadius: 0 }}
              onClick={() => setActive(id)}
            >
              {diagramMeta[id].title}
            </button>
          ))}
        </div>
        <div className="card">
          <h2>{meta.title}</h2>
          <p className="muted">{meta.caption}</p>
          <Diagram id={active} />
          {using.length > 0 && (
            <p className="small muted" style={{ marginTop: '1rem' }}>
              Used in:{' '}
              {using.map((c, i) => (
                <span key={c.id}>
                  {i > 0 && ', '}
                  <Link to={`/concept/${c.id}`}>{c.title}</Link>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

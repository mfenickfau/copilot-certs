import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { certById, certifications } from '../lib/content';
import type { CertId } from '../content/types';

/** Shared exam/domain picker that syncs to the URL (?cert=…&domain=…). */
export function useStudyFilter() {
  const [params, setParams] = useSearchParams();
  const certId = (params.get('cert') || '') as '' | CertId;
  const domainId = params.get('domain') || '';
  const cert = certId ? certById(certId) : undefined;
  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    }
    setParams(next, { replace: true });
  };
  return { params, certId, domainId, cert, set };
}

export function StudyFilter({ children }: { children?: ReactNode }) {
  const { certId, domainId, cert, set } = useStudyFilter();
  return (
    <div className="toolbar">
      <label>
        Exam
        <select className="select" value={certId} onChange={(e) => set({ cert: e.target.value, domain: null })}>
          <option value="">All exams</option>
          {certifications.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} · {c.shortName}
            </option>
          ))}
        </select>
      </label>
      <label>
        Domain
        <select className="select" value={domainId} disabled={!cert} onChange={(e) => set({ domain: e.target.value })}>
          <option value="">All domains</option>
          {cert?.domains.map((d) => (
            <option key={d.id} value={d.id}>
              D{d.number} · {d.name}
            </option>
          ))}
        </select>
      </label>
      {children}
    </div>
  );
}

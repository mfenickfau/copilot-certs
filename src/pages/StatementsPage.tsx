import { useMemo } from 'react';
import { conceptsFor, statementsFrom } from '../lib/content';
import { StatementDrill } from '../components/StatementDrill';
import { StudyFilter, useStudyFilter } from '../components/StudyFilter';

export function StatementsPage() {
  const { certId, domainId } = useStudyFilter();
  const statements = useMemo(
    () => statementsFrom(conceptsFor(certId || undefined, domainId ? [domainId] : undefined)),
    [certId, domainId],
  );
  return (
    <>
      <h1>Statements</h1>
      <p className="lead">
        Quick true/false checks. Each statement is a small, specific claim, and the false ones are written to be plausible, the
        way exam distractors are.
      </p>
      <StudyFilter>
        <span className="small muted" style={{ marginLeft: 'auto' }}>
          {statements.length} statements
        </span>
      </StudyFilter>
      <StatementDrill statements={statements} />
    </>
  );
}

import { Arrow, Box, Group, Label, Svg } from './primitives';

export function PromptInjectionDefense() {
  return (
    <Svg w={820} h={360} title="Prompt injection and defense in depth">
      <Box x={20} y={30} w={170} h={60} title="Trusted instructions" sub={['system prompt,', 'developer policy']} tone="ok" />
      <Box x={20} y={110} w={170} h={60} title="Untrusted content" sub={['web pages, documents,', 'tool results, user text']} tone="bad" />
      <Box x={250} y={60} w={150} h={70} title="LLM / agent" sub="cannot tell them apart by itself" tone="accent" />
      <Arrow from={[190, 60]} to={[250, 85]} />
      <Arrow from={[190, 140]} to={[250, 105]} label='"ignore previous instructions…"' labelDy={32} />
      <Box x={460} y={60} w={150} h={70} title="Sensitive action" sub={['send email, refund,', 'delete, exfiltrate']} tone="bad" />
      <Arrow from={[400, 95]} to={[460, 95]} dash label="attempted" labelDy={-8} />

      <Group x={20} y={200} w={780} h={140} title="Layered defenses (no single control is enough)" />
      <Box x={40} y={235} w={140} h={60} title="Isolate" sub={['wrap untrusted data', 'in clear delimiters']} tone="info" />
      <Box x={190} y={235} w={140} h={60} title="Least privilege" sub={['only the tools', 'the task needs']} tone="info" />
      <Box x={340} y={235} w={140} h={60} title="Hooks / approval" sub={['gate sensitive', 'actions deterministically']} tone="info" />
      <Box x={490} y={235} w={140} h={60} title="Validate output" sub={['schema, filters,', 'secret scanning']} tone="info" />
      <Box x={640} y={235} w={140} h={60} title="Monitor" sub={['log, alert,', 'review samples']} tone="info" />
      <Label x={40} y={325}>
        A polite request in the system prompt is not a control. A bigger model is not a control either.
      </Label>
    </Svg>
  );
}

export function RagPipeline() {
  return (
    <Svg w={820} h={360} title="RAG pipeline">
      <Label x={20} y={30} bold>
        Indexing (offline)
      </Label>
      <Box x={20} y={40} w={120} h={50} title="Documents" tone="info" />
      <Box x={165} y={40} w={120} h={50} title="Chunk" sub="size, overlap, structure" tone="warn" />
      <Box x={310} y={40} w={120} h={50} title="Embed" sub="+ metadata" tone="warn" />
      <Box x={455} y={40} w={120} h={50} title="Index" sub="vector + keyword" tone="ok" />
      <Arrow from={[140, 65]} to={[165, 65]} />
      <Arrow from={[285, 65]} to={[310, 65]} />
      <Arrow from={[430, 65]} to={[455, 65]} />
      <Label x={600} y={60}>
        Re-index on refresh; stale or
      </Label>
      <Label x={600} y={78}>
        mismatched embeddings cause confident-wrong answers.
      </Label>

      <Label x={20} y={150} bold>
        Query (online)
      </Label>
      <Box x={20} y={160} w={120} h={50} title="User question" tone="info" />
      <Box x={165} y={160} w={120} h={50} title="Retrieve" sub="hybrid search" tone="warn" />
      <Box x={310} y={160} w={120} h={50} title="Rerank / filter" sub="top-k, metadata" tone="warn" />
      <Box x={455} y={160} w={140} h={50} title="LLM / agent" sub="answer with citations" tone="accent" />
      <Box x={620} y={160} w={180} h={50} title="Validate & log" sub="groundedness, feedback" tone="ok" />
      <Arrow from={[140, 185]} to={[165, 185]} />
      <Arrow from={[285, 185]} to={[310, 185]} />
      <Arrow from={[430, 185]} to={[455, 185]} />
      <Arrow from={[595, 185]} to={[620, 185]} />
      <Arrow from={[515, 90]} to={[225, 160]} dash label="index lookup" labelDy={-6} />

      <Label x={20} y={260} bold>
        Design choices
      </Label>
      <Label x={20} y={282}>
        Chunk by structure (sections, tables) when documents have it; fixed windows with overlap otherwise.
      </Label>
      <Label x={20} y={302}>
        Small corpus? Long context (1M tokens) with caching may beat RAG. Structured data? Use SQL or tools, not vectors.
      </Label>
      <Label x={20} y={322}>
        Debug order after a quality drop: retrieval first, then prompt, then model.
      </Label>
    </Svg>
  );
}

export function EvalLoop() {
  return (
    <Svg w={820} h={340} title="Evaluation loop">
      <Box x={40} y={40} w={170} h={64} title="Eval set" sub={['real traffic + edge cases,', 'labeled or rubric-graded']} tone="info" />
      <Box x={320} y={40} w={170} h={64} title="Run candidate" sub={['prompt / model / config', 'under test']} tone="accent" />
      <Box x={600} y={40} w={170} h={64} title="Grade" sub={['exact match, code checks,', 'LLM-as-judge, humans']} tone="warn" />
      <Arrow from={[210, 72]} to={[320, 72]} />
      <Arrow from={[490, 72]} to={[600, 72]} />
      <Box x={600} y={180} w={170} h={64} title="Metrics" sub={['accuracy · latency · cost', 'safety · per-segment']} tone="ok" />
      <Arrow from={[685, 104]} to={[685, 180]} />
      <Box x={320} y={180} w={170} h={64} title="Diagnose & change" sub={['one variable at a time;', 'keep a test split untouched']} tone="info" />
      <Arrow from={[600, 212]} to={[490, 212]} />
      <Arrow from={[405, 180]} to={[405, 104]} label="iterate" labelDy={-4} />
      <Box x={40} y={180} w={170} h={64} title="Production monitoring" sub={['sampled review, drift alerts,', 'feed failures back into the set']} tone="warn" />
      <Arrow from={[125, 180]} to={[125, 104]} />
      <Label x={40} y={290}>
        Evaluate before changing models or prompts. Aggregate accuracy can hide a segment that fails; stratify by type.
      </Label>
    </Svg>
  );
}




export function EscalationDecision() {
  return (
    <Svg w={820} h={380} title="Escalation decision flow">
      <Box x={310} y={20} w={200} h={50} title="Customer request" tone="info" />
      <Box x={310} y={100} w={200} h={50} title="Asked for a human?" tone="warn" />
      <Arrow from={[410, 70]} to={[410, 100]} />
      <Box x={600} y={100} w={190} h={50} title="Escalate now" sub="do not investigate first" tone="bad" />
      <Arrow from={[510, 125]} to={[600, 125]} label="yes" labelDy={-6} />
      <Box x={310} y={180} w={200} h={50} title="Policy covers it?" tone="warn" />
      <Arrow from={[410, 150]} to={[410, 180]} label="no" labelDy={-4} />
      <Box x={600} y={180} w={190} h={50} title="Escalate" sub="policy gap or exception" tone="bad" />
      <Arrow from={[510, 205]} to={[600, 205]} label="no / ambiguous" labelDy={-6} />
      <Box x={310} y={260} w={200} h={50} title="Can make progress?" tone="warn" />
      <Arrow from={[410, 230]} to={[410, 260]} label="yes" labelDy={-4} />
      <Box x={600} y={260} w={190} h={50} title="Escalate with handoff" sub="customer id, root cause, action" tone="bad" />
      <Arrow from={[510, 285]} to={[600, 285]} label="no" labelDy={-6} />
      <Box x={310} y={330} w={200} h={40} title="Resolve autonomously" tone="ok" />
      <Arrow from={[410, 310]} to={[410, 330]} label="yes" labelDy={-4} />
      <Label x={20} y={120} bold>
        Unreliable triggers
      </Label>
      <Label x={20} y={142}>
        sentiment alone
      </Label>
      <Label x={20} y={160}>
        self-reported confidence
      </Label>
      <Label x={20} y={178}>
        "it seems complex"
      </Label>
      <Label x={20} y={230} bold>
        Multiple matches?
      </Label>
      <Label x={20} y={252}>
        Ask for another identifier;
      </Label>
      <Label x={20} y={270}>
        never pick by heuristic.
      </Label>
    </Svg>
  );
}

export function LayeredGuardrails() {
  return (
    <Svg w={820} h={360} title="Layered guardrails">
      <rect x={20} y={30} width={780} height={300} rx={16} className="d-box" />
      <Label x={40} y={55} bold>
        Governance: usage policy, access control, audit, compliance (GDPR, HIPAA, FedRAMP)
      </Label>
      <rect x={60} y={70} width={700} height={240} rx={14} className="d-box-info" />
      <Label x={80} y={95} bold>
        Input layer: classify, sanitize, isolate untrusted content, rate-limit
      </Label>
      <rect x={100} y={110} width={620} height={180} rx={12} className="d-box-warn" />
      <Label x={120} y={135} bold>
        Capability layer: least-privilege tools, scoped agents, hooks and approvals on sensitive actions
      </Label>
      <rect x={140} y={150} width={540} height={120} rx={10} className="d-box-ok" />
      <Label x={160} y={175} bold>
        Model layer: system prompt policy, safety training, refusal stop reason
      </Label>
      <rect x={180} y={190} width={460} height={60} rx={8} className="d-box-accent" />
      <Label x={200} y={215} bold>
        Output layer: schema validation, filters, human review for high-stakes results
      </Label>
      <Label x={200} y={235}>
        Monitoring wraps every layer: logs, metrics, sampled review, alerts.
      </Label>
    </Svg>
  );
}

export function CoordinatorSubagents() {
  return (
    <Svg w={820} h={380} title="Coordinator and subagents">
      <Box x={310} y={20} w={200} h={64} title="Coordinator" sub={['decomposes, delegates,', 'aggregates, handles errors']} tone="accent" />
      <Box x={20} y={160} w={170} h={64} title="Web search agent" sub="tools: search, fetch" tone="info" />
      <Box x={215} y={160} w={170} h={64} title="Document analyst" sub="tools: load_document" tone="info" />
      <Box x={410} y={160} w={170} h={64} title="Synthesizer" sub="tools: verify_fact" tone="info" />
      <Box x={605} y={160} w={195} h={64} title="Report writer" sub="tools: write_file" tone="info" />
      <Arrow from={[360, 84]} to={[105, 160]} label="Task" labelDy={-6} />
      <Arrow from={[390, 84]} to={[300, 160]} />
      <Arrow from={[430, 84]} to={[495, 160]} />
      <Arrow from={[460, 84]} to={[700, 160]} />
      <Arrow from={[130, 160]} to={[380, 84]} dash />
      <Label x={20} y={270} bold>
        Rules of the pattern
      </Label>
      <Label x={20} y={292}>
        Subagents start with empty context: pass complete findings and metadata (source URLs, dates) in the prompt.
      </Label>
      <Label x={20} y={312}>
        Spawn in parallel by emitting several Task calls in one response. Scope each agent's tools to its role.
      </Label>
      <Label x={20} y={332}>
        All communication routes through the coordinator (hub-and-spoke) for observability and error handling.
      </Label>
      <Label x={20} y={352}>
        Return structured errors (failure type, attempted query, partial results) rather than generic "unavailable".
      </Label>
    </Svg>
  );
}

export function StructuredOutputFlow() {
  return (
    <Svg w={820} h={360} title="Structured output flow">
      <Box x={20} y={40} w={150} h={60} title="Document" sub="invoice PDF" tone="info" />
      <Box x={210} y={40} w={190} h={60} title="the model + schema" sub={['output_config.format or', 'strict tool input_schema']} tone="accent" />
      <Box x={440} y={40} w={150} h={60} title="Schema-valid JSON" sub="syntax guaranteed" tone="ok" />
      <Box x={630} y={40} w={170} h={60} title="Semantic checks" sub={['line items sum to total?', 'dates plausible?']} tone="warn" />
      <Arrow from={[170, 70]} to={[210, 70]} />
      <Arrow from={[400, 70]} to={[440, 70]} />
      <Arrow from={[590, 70]} to={[630, 70]} />
      <Box x={630} y={160} w={170} h={56} title="Accept → downstream" tone="ok" />
      <Arrow from={[715, 100]} to={[715, 160]} label="pass" labelDy={-4} />
      <Box x={400} y={160} w={190} h={56} title="Retry with errors" sub="append specific validation errors" tone="warn" />
      <Arrow from={[630, 190]} to={[590, 190]} label="fail" labelDy={-6} />
      <Arrow from={[495, 160]} to={[330, 100]} dash />
      <Box x={170} y={160} w={190} h={56} title="Route to human" sub="info absent or still conflicting" tone="bad" />
      <Arrow from={[400, 195]} to={[360, 195]} dash label="retries can't add missing data" labelDy={22} />
      <Label x={20} y={270} bold>
        Schema design that prevents fabrication
      </Label>
      <Label x={20} y={292}>
        Make fields optional/nullable when the source may lack them. Add enum values "unclear" and "other" + detail string.
      </Label>
      <Label x={20} y={312}>
        Extract calculated_total alongside stated_total and a conflict_detected flag so disagreements are visible.
      </Label>
      <Label x={20} y={332}>
        Schemas eliminate syntax errors, not semantic ones. Validate meaning in code.
      </Label>
    </Svg>
  );
}

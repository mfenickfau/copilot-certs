import { Arrow, Box, Group, Label, Svg } from './primitives';

export function M365CopilotSystem() {
  return (
    <Svg w={820} h={400} title="How Microsoft 365 Copilot works">
      <Group x={20} y={20} w={780} h={360} title="Microsoft 365 tenant boundary: prompts, grounding data and responses stay inside; not used to train foundation models" />
      <Box x={40} y={70} w={150} h={70} title="Copilot surface" sub={['Word, Excel, Teams,', 'Copilot Chat, agents']} tone="info" />
      <Box x={240} y={70} w={170} h={70} title="Orchestrator" sub={['pre-processing,', 'grounding, post-processing']} tone="accent" />
      <Box x={460} y={70} w={150} h={70} title="LLM" sub={['Azure-hosted', 'foundation model']} tone="warn" />
      <Box x={650} y={70} w={130} h={70} title="RAI checks" sub={['safety, compliance,', 'citations']} tone="ok" />
      <Arrow from={[190, 95]} to={[240, 95]} label="1. prompt" labelDy={-8} />
      <Arrow from={[410, 95]} to={[460, 95]} label="3. grounded prompt" labelDy={-8} />
      <Arrow from={[610, 105]} to={[650, 105]} label="4." labelDy={-8} />
      <Arrow from={[715, 140]} to={[115, 140]} curve={[415, 200]} label="5. response with citations" labelDy={-10} accent />
      <Box x={40} y={250} w={160} h={64} title="Microsoft Graph" sub={['mail, chats, meetings,', 'files, people']} tone="ok" />
      <Box x={220} y={250} w={160} h={64} title="Semantic index + Work IQ" sub={['meaning-based search,', 'organisational context']} tone="ok" />
      <Box x={400} y={250} w={140} h={64} title="Open document" sub="the file in front of you" tone="ok" />
      <Box x={560} y={250} w={110} h={64} title="Web" sub="if enabled" tone="ok" />
      <Box x={690} y={250} w={95} h={64} title="Agent knowledge" sub="scoped" tone="ok" />
      <Arrow from={[300, 250]} to={[310, 140]} label="2. grounding, as the user" labelDy={-4} dash />
      <Arrow from={[120, 250]} to={[290, 140]} dash />
      <Arrow from={[470, 250]} to={[340, 140]} dash />
      <Label x={40} y={345}>
        Permissions gate every lookup: Copilot retrieves only what the signed-in user can already open. Labels, DLP, retention and audit still apply.
      </Label>
    </Svg>
  );
}

export function CopilotStudioAgentAnatomy() {
  return (
    <Svg w={820} h={420} title="Anatomy of a Copilot Studio agent">
      <Box x={310} y={160} w={200} h={80} title="Orchestrator" sub={['generative orchestration', 'or topic triggers']} tone="accent" />
      <Box x={40} y={40} w={200} h={64} title="Instructions" sub={['name, description,', 'behaviour and tone']} tone="info" />
      <Box x={310} y={40} w={200} h={64} title="Knowledge" sub={['SharePoint, Dataverse, websites,', 'files, Graph connectors']} tone="ok" />
      <Box x={580} y={40} w={200} h={64} title="Tools / actions" sub={['connectors, MCP servers,', 'Power Automate, agent flows, APIs']} tone="warn" />
      <Box x={40} y={170} w={200} h={64} title="Topics" sub={['authored conversation paths,', 'Power Fx, variables']} tone="info" />
      <Box x={580} y={170} w={200} h={64} title="Triggers" sub={['events, schedules,', 'autonomous runs']} tone="warn" />
      <Box x={40} y={300} w={200} h={64} title="Channels" sub={['Teams, Microsoft 365 Copilot,', 'web, Slack, custom']} tone="info" />
      <Box x={310} y={300} w={200} h={64} title="Security & auth" sub={['user vs agent auth,', 'Entra ID, DLP policies']} tone="bad" />
      <Box x={580} y={300} w={200} h={64} title="Analytics & ALM" sub={['test, analytics, solutions,', 'environments, publishing']} tone="ok" />
      <Arrow from={[240, 72]} to={[330, 160]} />
      <Arrow from={[410, 104]} to={[410, 160]} />
      <Arrow from={[580, 72]} to={[490, 160]} />
      <Arrow from={[240, 202]} to={[310, 200]} />
      <Arrow from={[580, 202]} to={[510, 200]} />
      <Arrow from={[240, 332]} to={[330, 240]} />
      <Arrow from={[410, 300]} to={[410, 240]} />
      <Arrow from={[580, 332]} to={[490, 240]} />
      <Label x={40} y={400}>
        Plan knowledge and tools first; let generative orchestration choose between them; use topics for deterministic paths; govern through Power Platform and Microsoft 365 admin centers.
      </Label>
    </Svg>
  );
}

export function CopilotDataProtection() {
  return (
    <Svg w={820} h={360} title="Data protection layers for Copilot">
      <rect x={20} y={30} width={780} height={300} rx={16} className="d-box" />
      <Label x={40} y={55} bold>
        Audit and eDiscovery (Purview): every Copilot interaction is logged and searchable
      </Label>
      <rect x={60} y={70} width={700} height={240} rx={14} className="d-box-info" />
      <Label x={80} y={95} bold>
        Identity and access (Entra ID): Conditional Access, licences, who can use which Copilot and agents
      </Label>
      <rect x={100} y={110} width={620} height={180} rx={12} className="d-box-warn" />
      <Label x={120} y={135} bold>
        Permissions (SharePoint, Teams, Graph): Copilot sees only what the user can open; fix oversharing first
      </Label>
      <rect x={140} y={150} width={540} height={120} rx={10} className="d-box-ok" />
      <Label x={160} y={175} bold>
        Sensitivity labels and DLP: labelled content inherits protection; DLP can block grounding and actions
      </Label>
      <rect x={180} y={190} width={460} height={60} rx={8} className="d-box-accent" />
      <Label x={200} y={215} bold>
        Retention: Copilot prompts and responses follow Teams/Copilot retention policies
      </Label>
      <Label x={200} y={235}>
        Copilot Control System ties these together for admins.
      </Label>
    </Svg>
  );
}

export function CopilotExtensibilityOptions() {
  return (
    <Svg w={820} h={360} title="Copilot extensibility options">
      <Arrow from={[40, 300]} to={[790, 300]} label="more control, more effort →" labelDy={18} />
      <Arrow from={[40, 300]} to={[40, 30]} />
      <Label x={48} y={40}>
        who builds it
      </Label>
      <Box x={60} y={220} w={150} h={64} title="Prebuilt agents" sub={['Researcher, Analyst...', 'just enable']} tone="ok" />
      <Box x={220} y={170} w={160} h={64} title="Declarative agents" sub={['Agent Builder / Copilot Studio', 'instructions + knowledge']} tone="info" />
      <Box x={395} y={120} w={170} h={64} title="Copilot Studio agents" sub={['tools, topics, triggers,', 'channels, MCP']} tone="accent" />
      <Box x={580} y={70} w={200} h={64} title="Custom engine agents" sub={['your orchestrator and models', '(Foundry, Agent SDK)']} tone="warn" />
      <Box x={60} y={60} w={200} h={50} title="Connectors & plugins" sub="bring external data and APIs in" tone="info" />
      <Label x={60} y={140} bold>
        Business users
      </Label>
      <Label x={290} y={260} bold>
        Makers
      </Label>
      <Label x={450} y={210} bold>
        Pro developers
      </Label>
      <Label x={600} y={160} bold>
        Engineering teams
      </Label>
    </Svg>
  );
}

export function FoundryAgentStack() {
  return (
    <Svg w={820} h={380} title="Microsoft Foundry agent stack">
      <Box x={40} y={30} w={740} h={50} title="Your app or Copilot surface" sub="chat UI, Teams, API client, workflow" tone="info" />
      <Box x={40} y={100} w={740} h={60} title="Foundry Agent Service" sub={['threads, runs, orchestration, tool calling,', 'multi-agent (connected agents), identity via Entra Agent ID']} tone="accent" />
      <Box x={40} y={180} w={175} h={70} title="Models" sub={['model catalog, Azure OpenAI,', 'open-weight, fine-tuning']} tone="warn" />
      <Box x={230} y={180} w={175} h={70} title="Knowledge" sub={['Azure AI Search (RAG),', 'files, Fabric, Bing grounding']} tone="ok" />
      <Box x={420} y={180} w={175} h={70} title="Tools" sub={['OpenAPI, Azure Functions,', 'MCP servers, Logic Apps']} tone="ok" />
      <Box x={610} y={180} w={170} h={70} title="Safety" sub={['Content Safety, prompt shields,', 'groundedness, RAI policies']} tone="bad" />
      <Box x={40} y={270} w={360} h={60} title="Evaluation" sub="built-in evaluators, custom metrics, red teaming, CI gates" tone="info" />
      <Box x={420} y={270} w={360} h={60} title="Observability & ops" sub="tracing, Application Insights, cost and quota, deployment" tone="info" />
      <Arrow from={[410, 80]} to={[410, 100]} />
      <Label x={40} y={360}>
        Build left to right: pick a model, ground it, give it tools, wrap it in safety, then evaluate and monitor before and after deployment.
      </Label>
    </Svg>
  );
}

export function ResponsibleAiPrinciples() {
  return (
    <Svg w={820} h={330} title="Microsoft responsible AI principles">
      <Box x={20} y={30} w={250} h={70} title="Fairness" sub={['treat all people equitably;', 'test across groups']} tone="info" />
      <Box x={285} y={30} w={250} h={70} title="Reliability & safety" sub={['perform as intended;', 'evaluate, content safety, red team']} tone="ok" />
      <Box x={550} y={30} w={250} h={70} title="Privacy & security" sub={['protect data; least privilege;', 'tenant boundary, labels, DLP']} tone="warn" />
      <Box x={20} y={120} w={250} h={70} title="Inclusiveness" sub={['empower everyone;', 'accessibility by design']} tone="info" />
      <Box x={285} y={120} w={250} h={70} title="Transparency" sub={['explain behaviour; cite sources;', 'disclose AI use']} tone="ok" />
      <Box x={550} y={120} w={250} h={70} title="Accountability" sub={['people stay responsible;', 'human oversight, governance']} tone="warn" />
      <Box x={20} y={220} w={780} h={60} title="Product controls" sub="Azure AI Content Safety · prompt shields · groundedness detection · Purview · Copilot Control System · Entra Agent ID · evaluations and audit" tone="accent" />
      <Label x={20} y={310}>
        Exam tip: match the scenario to the principle first (bias → fairness, hallucination → reliability, disclosure → transparency), then to the control.
      </Label>
    </Svg>
  );
}

export function AgenticSdlc() {
  return (
    <Svg w={820} h={380} title="Agentic software development lifecycle">
      <Box x={20} y={60} w={120} h={64} title="Plan" sub={['issues, specs,', 'Copilot Chat']} tone="info" />
      <Box x={160} y={60} w={120} h={64} title="Code" sub={['completions,', 'agent mode']} tone="accent" />
      <Box x={300} y={60} w={120} h={64} title="Delegate" sub={['coding agent', 'opens a PR']} tone="warn" />
      <Box x={440} y={60} w={120} h={64} title="Review" sub={['Copilot code review', '+ human review']} tone="ok" />
      <Box x={580} y={60} w={100} h={64} title="Build & test" sub="Actions, CI" tone="info" />
      <Box x={700} y={60} w={100} h={64} title="Ship" sub="release, monitor" tone="ok" />
      <Arrow from={[140, 92]} to={[160, 92]} />
      <Arrow from={[280, 92]} to={[300, 92]} />
      <Arrow from={[420, 92]} to={[440, 92]} />
      <Arrow from={[560, 92]} to={[580, 92]} />
      <Arrow from={[680, 92]} to={[700, 92]} />
      <Box x={160} y={190} w={520} h={56} title="Human checkpoints" sub="PR approval, branch protection, required reviews, policy and content exclusions, audit log" tone="bad" />
      <Arrow from={[360, 124]} to={[360, 190]} dash />
      <Arrow from={[500, 124]} to={[500, 190]} dash />
      <Box x={20} y={280} w={370} h={60} title="Context the agent sees" sub="repo, custom instructions, MCP servers, issue text, CI results" tone="info" />
      <Box x={410} y={280} w={390} h={60} title="Guardrails" sub="least-privilege tokens, sandboxed runs, secret scanning, dependency review" tone="warn" />
    </Svg>
  );
}

export function MlopsGenaiopsLoop() {
  return (
    <Svg w={820} h={360} title="MLOps and GenAIOps loop">
      <Box x={40} y={40} w={160} h={64} title="Data / prompts" sub={['datasets, feature store;', 'prompt and eval sets']} tone="info" />
      <Box x={330} y={40} w={160} h={64} title="Train / tune" sub={['training jobs, AutoML;', 'prompt flow, fine-tuning']} tone="accent" />
      <Box x={620} y={40} w={160} h={64} title="Evaluate" sub={['metrics, fairness;', 'groundedness, safety']} tone="warn" />
      <Box x={620} y={200} w={160} h={64} title="Deploy" sub={['managed endpoints;', 'model deployments, agents']} tone="ok" />
      <Box x={330} y={200} w={160} h={64} title="Monitor" sub={['drift, performance;', 'tracing, quality, cost']} tone="ok" />
      <Box x={40} y={200} w={160} h={64} title="Feedback" sub={['retrain triggers;', 'red-team findings, new evals']} tone="info" />
      <Arrow from={[200, 72]} to={[330, 72]} />
      <Arrow from={[490, 72]} to={[620, 72]} />
      <Arrow from={[700, 104]} to={[700, 200]} label="quality gate" labelDy={-4} />
      <Arrow from={[620, 232]} to={[490, 232]} />
      <Arrow from={[330, 232]} to={[200, 232]} />
      <Arrow from={[120, 200]} to={[120, 104]} label="loop" labelDy={-4} />
      <Label x={40} y={310}>
        Same loop, different artefacts: MLOps versions models and features; GenAIOps versions prompts, evaluators, guardrails and agents.
      </Label>
      <Label x={40} y={330}>
        Automate with pipelines, registries and CI/CD so every change is evaluated before it reaches users.
      </Label>
    </Svg>
  );
}

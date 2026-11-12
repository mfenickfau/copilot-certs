import { Arrow, Box, Group, Label, Svg } from './primitives';

export function AgenticLoop() {
  return (
    <Svg w={820} h={330} title="The agentic loop">
      <Box x={30} y={120} w={150} h={70} title="Your code" sub={['builds messages', 'sends request']} tone="info" />
      <Box x={330} y={30} w={160} h={70} title="LLM / agent" sub={['reasons, picks', 'next action']} tone="accent" />
      <Box x={330} y={215} w={160} h={70} title="Execute tool" sub={['your function,', 'API, DB, shell']} tone="warn" />
      <Box x={640} y={120} w={150} h={70} title="Done" sub={['stop_reason =', '"end_turn"']} tone="ok" />
      <Arrow from={[180, 140]} to={[330, 75]} label="POST /v1/messages" labelDy={-10} />
      <Arrow from={[490, 75]} to={[640, 140]} label="no tool needed" labelDy={-10} />
      <Arrow from={[410, 100]} to={[410, 215]} label='stop_reason = "tool_use"' accent labelDy={-4} />
      <Arrow from={[330, 250]} to={[180, 190]} label="append tool_result, loop" accent labelDy={16} />
      <Label x={30} y={300}>
        The model decides each step from context. The loop ends on end_turn, not on an iteration cap or by parsing text.
      </Label>
    </Svg>
  );
}

export function WorkflowVsAgent() {
  return (
    <Svg w={820} h={340} title="Workflow versus agent">
      <Group x={20} y={20} w={380} h={290} title="Workflow: code decides the path" />
      <Box x={45} y={60} w={100} h={50} title="Step 1" sub="classify" tone="info" />
      <Box x={165} y={60} w={100} h={50} title="Step 2" sub="extract" tone="info" />
      <Box x={285} y={60} w={100} h={50} title="Step 3" sub="format" tone="info" />
      <Arrow from={[145, 85]} to={[165, 85]} />
      <Arrow from={[265, 85]} to={[285, 85]} />
      <Label x={45} y={150}>
        Predictable, testable, cheap.
      </Label>
      <Label x={45} y={170}>
        Each LLM call has a fixed role.
      </Label>
      <Label x={45} y={190}>
        Best when steps are known in advance.
      </Label>
      <Label x={45} y={240} bold>
        Prompt chaining · routing · parallelization
      </Label>
      <Label x={45} y={260} bold>
        orchestrator-workers · evaluator-optimizer
      </Label>

      <Group x={420} y={20} w={380} h={290} title="Agent: the model decides the path" />
      <Box x={520} y={60} w={160} h={50} title="LLM / agent" sub="plans next action" tone="accent" />
      <Box x={450} y={160} w={90} h={44} title="search" tone="warn" />
      <Box x={560} y={160} w={90} h={44} title="read file" tone="warn" />
      <Box x={670} y={160} w={90} h={44} title="run tests" tone="warn" />
      <Arrow from={[560, 110]} to={[495, 160]} dash />
      <Arrow from={[600, 110]} to={[605, 160]} dash />
      <Arrow from={[640, 110]} to={[715, 160]} dash />
      <Arrow from={[495, 204]} to={[580, 240]} curve={[500, 250]} />
      <Label x={590} y={245}>
        results feed the next decision
      </Label>
      <Label x={445} y={280}>
        Open-ended tasks. Higher cost and latency. Needs guardrails and a way to catch errors.
      </Label>
    </Svg>
  );
}

export function OrchestrationPatterns() {
  return (
    <Svg w={820} h={420} title="Orchestration patterns">
      <Label x={20} y={30} bold>
        Prompt chaining
      </Label>
      <Box x={20} y={40} w={70} h={36} title="A" tone="info" />
      <Box x={110} y={40} w={70} h={36} title="B" tone="info" />
      <Box x={200} y={40} w={70} h={36} title="C" tone="info" />
      <Arrow from={[90, 58]} to={[110, 58]} />
      <Arrow from={[180, 58]} to={[200, 58]} />
      <Label x={20} y={100}>
        Fixed sequence; add gates between steps.
      </Label>

      <Label x={320} y={30} bold>
        Routing
      </Label>
      <Box x={320} y={40} w={80} h={36} title="Router" tone="accent" />
      <Box x={440} y={20} w={80} h={30} title="billing" tone="info" />
      <Box x={440} y={58} w={80} h={30} title="tech" tone="info" />
      <Box x={440} y={96} w={80} h={30} title="refund" tone="info" />
      <Arrow from={[400, 50]} to={[440, 35]} />
      <Arrow from={[400, 58]} to={[440, 73]} />
      <Arrow from={[400, 66]} to={[440, 111]} />
      <Label x={320} y={140}>
        Classify, then send to a specialist prompt.
      </Label>

      <Label x={580} y={30} bold>
        Parallelization
      </Label>
      <Box x={580} y={40} w={70} h={30} title="task" tone="info" />
      <Box x={690} y={20} w={100} h={26} title="section 1" tone="warn" />
      <Box x={690} y={52} w={100} h={26} title="section 2" tone="warn" />
      <Box x={690} y={84} w={100} h={26} title="voter / judge" tone="warn" />
      <Arrow from={[650, 50]} to={[690, 33]} />
      <Arrow from={[650, 55]} to={[690, 65]} />
      <Arrow from={[650, 60]} to={[690, 97]} />
      <Label x={580} y={140}>
        Sectioning or voting, then aggregate.
      </Label>

      <Label x={20} y={200} bold>
        Orchestrator-workers (manager / supervisor)
      </Label>
      <Box x={150} y={215} w={130} h={44} title="Orchestrator" sub="decomposes, delegates" tone="accent" />
      <Box x={20} y={310} w={100} h={40} title="Worker 1" tone="info" />
      <Box x={165} y={310} w={100} h={40} title="Worker 2" tone="info" />
      <Box x={310} y={310} w={100} h={40} title="Worker 3" tone="info" />
      <Arrow from={[185, 259]} to={[80, 310]} />
      <Arrow from={[215, 259]} to={[215, 310]} />
      <Arrow from={[245, 259]} to={[350, 310]} />
      <Arrow from={[120, 330]} to={[165, 330]} dash />
      <Label x={20} y={375}>
        Subagents hold isolated context; the orchestrator
      </Label>
      <Label x={20} y={393}>
        synthesizes. Hub-and-spoke, not peer-to-peer.
      </Label>

      <Label x={480} y={200} bold>
        Evaluator-optimizer
      </Label>
      <Box x={480} y={225} w={120} h={44} title="Generator" tone="info" />
      <Box x={670} y={225} w={120} h={44} title="Evaluator" tone="warn" />
      <Arrow from={[600, 238]} to={[670, 238]} label="draft" labelDy={-8} />
      <Arrow from={[670, 258]} to={[600, 258]} label="feedback" labelDy={16} />
      <Box x={575} y={310} w={120} h={40} title="Accept" sub="meets rubric" tone="ok" />
      <Arrow from={[730, 269]} to={[660, 310]} />
      <Label x={480} y={375}>
        Loop until the evaluator passes it.
      </Label>
      <Label x={480} y={393}>
        Use clear, checkable criteria.
      </Label>
    </Svg>
  );
}


export function ContextWindow() {
  return (
    <Svg w={820} h={330} title="The context window as a budget">
      <rect x={20} y={40} width={780} height={60} rx={10} className="d-box" />
      <rect x={20} y={40} width={110} height={60} rx={10} className="d-box-info" />
      <rect x={130} y={40} width={90} height={60} className="d-box-ok" />
      <rect x={220} y={40} width={300} height={60} className="d-box-warn" />
      <rect x={520} y={40} width={110} height={60} className="d-box-accent" />
      <Label x={75} y={74} anchor="middle" bold>
        system
      </Label>
      <Label x={175} y={74} anchor="middle" bold>
        tools
      </Label>
      <Label x={370} y={66} anchor="middle" bold>
        conversation history
      </Label>
      <Label x={370} y={84} anchor="middle">
        incl. verbose tool results
      </Label>
      <Label x={575} y={74} anchor="middle" bold>
        new turn
      </Label>
      <Label x={715} y={74} anchor="middle">
        headroom for output
      </Label>
      <Label x={20} y={125}>
        One window (1M tokens on current models) holds input and output. Tool results pile up fastest.
      </Label>

      <Label x={20} y={170} bold>
        Keep it healthy
      </Label>
      <Box x={20} y={185} w={180} h={56} title="Prune tool output" sub="keep only relevant fields" tone="ok" />
      <Box x={215} y={185} w={180} h={56} title="Compact / summarize" sub="server-side or your own" tone="ok" />
      <Box x={410} y={185} w={180} h={56} title="Isolate in subagents" sub="verbose work elsewhere" tone="ok" />
      <Box x={605} y={185} w={195} h={56} title="Persist key facts" sub="case-facts block, scratchpad" tone="ok" />

      <Label x={20} y={280} bold>
        Watch for
      </Label>
      <Label x={100} y={280}>
        drift (model forgets earlier specifics) · bloat (cost and latency climb) · lost-in-the-middle (middle sections ignored)
      </Label>
    </Svg>
  );
}

export function McpArchitecture() {
  return (
    <Svg w={820} h={360} title="MCP architecture">
      <Group x={20} y={20} w={360} h={220} title="Host application (Copilot Studio, GitHub Copilot, VS Code, your app)" />
      <Box x={45} y={60} w={140} h={60} title="LLM / agent" sub="picks tools" tone="accent" />
      <Box x={210} y={60} w={150} h={60} title="MCP client" sub="one per server" tone="info" />
      <Arrow from={[185, 90]} to={[210, 90]} />
      <Label x={45} y={160}>
        Discovers tools, resources and prompts at
      </Label>
      <Label x={45} y={178}>
        connection time; all servers available at once.
      </Label>

      <Box x={470} y={40} w={310} h={60} title="MCP server: GitHub" sub="tools: create_issue, list_prs · resources: repo tree" tone="warn" />
      <Box x={470} y={120} w={310} h={60} title="MCP server: Postgres" sub="tools: query · resources: schema catalog" tone="warn" />
      <Box x={470} y={200} w={310} h={60} title="MCP server: internal inventory" sub="custom, team-specific" tone="warn" />
      <Arrow from={[360, 80]} to={[470, 70]} label="stdio (local process)" labelDy={-8} />
      <Arrow from={[360, 95]} to={[470, 150]} label="Streamable HTTP (remote)" labelDy={22} />
      <Arrow from={[360, 105]} to={[470, 230]} />

      <Label x={20} y={290} bold>
        Primitives
      </Label>
      <Box x={20} y={300} w={150} h={40} title="Tools" sub="model-invoked actions" tone="ok" />
      <Box x={185} y={300} w={150} h={40} title="Resources" sub="app-provided data" tone="ok" />
      <Box x={350} y={300} w={150} h={40} title="Prompts" sub="user-invoked templates" tone="ok" />
      <Label x={515} y={300}>
        Copilot Studio, Foundry Agent Service and GitHub
      </Label>
      <Label x={515} y={318}>
        Copilot can all act as MCP hosts for your tools.
      </Label>
    </Svg>
  );
}

export function ToolUseSequence() {
  return (
    <Svg w={820} h={380} title="Tool use message sequence">
      <Box x={40} y={20} w={160} h={40} title="Your app" tone="info" />
      <Box x={620} y={20} w={160} h={40} title="Model API" tone="accent" />
      <path d="M120 60 L120 360" className="d-line d-dash" />
      <path d="M700 60 L700 360" className="d-line d-dash" />
      <Arrow from={[120, 95]} to={[700, 95]} label="1. messages + tools[] (name, description, input_schema)" labelDy={-8} />
      <Arrow from={[700, 150]} to={[120, 150]} label='2. stop_reason "tool_use" · content: [text?, tool_use{id, name, input}]' labelDy={-8} accent />
      <Box x={30} y={175} w={180} h={44} title="3. run the tool" sub="validate input first" tone="warn" />
      <Arrow from={[120, 255]} to={[700, 255]} label="4. user turn: tool_result{tool_use_id, content, is_error?} — all results in ONE message" labelDy={-8} />
      <Arrow from={[700, 310]} to={[120, 310]} label='5. final answer · stop_reason "end_turn" (or another tool_use → repeat)' labelDy={-8} accent />
      <Label x={40} y={350}>
        Parallel calls: several tool_use blocks arrive together; return every tool_result in a single user message.
      </Label>
    </Svg>
  );
}




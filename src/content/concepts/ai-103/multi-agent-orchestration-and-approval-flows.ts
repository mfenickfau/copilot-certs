import type { Concept } from '../../types';

export const multiAgentOrchestrationAndApprovalFlows: Concept = {
  id: 'multi-agent-orchestration-and-approval-flows',
  title: 'Multi-Agent Orchestration, Autonomous Workflows and Approval Controls',
  summary:
    'Patterns and Foundry features for orchestrating several agents (sequential, concurrent, handoff, group chat, magentic, coordinator with subagents), the mechanisms that connect them (Microsoft Agent Framework, Responses API multi-agent orchestration, A2A, workflows, routines), and how to build autonomous or semi-autonomous flows safely with approval gates, human-in-the-loop pauses, oversight modes, constraints and tool-access controls.',
  certs: ['ai-103'],
  domains: ['ai-103-2', 'ai-103-1'],
  outcomes: ['ai-103-2-2-4', 'ai-103-2-2-5', 'ai-103-1-4-4'],
  tags: ['multi-agent', 'orchestration', 'agent-framework', 'a2a', 'workflows', 'routines', 'human-in-the-loop', 'approvals', 'governance', 'advanced'],
  difficulty: 'advanced',
  diagram: 'coordinator-subagents',
  sections: [
    {
      heading: 'Orchestration patterns and when to use them',
      body: `A single agent with many tools eventually degrades: long instructions, tool confusion, bloated context. Multi-agent designs split the work. The patterns Microsoft Agent Framework names (and the exam expects):

| Pattern | Shape | Use when |
|---|---|---|
| **Sequential** | A → B → C, each sees prior output | Pipelines: draft, review, translate, format |
| **Concurrent** | Fan out to several agents, gather | Independent analyses of the same input, parallel research |
| **Handoff** | Control passes to the best-suited agent based on context | Triage then specialist; escalation |
| **Group chat** | Agents converse under a manager that picks the next speaker | Debate, brainstorming, iterative refinement |
| **Magentic** | A manager plans, tracks a ledger, delegates and re-plans | Open-ended complex tasks with uncertain steps |
| **Coordinator + subagents** | Root agent spawns bounded subagents in parallel and reconciles | Work divisible into independent bounded tasks (code review of several modules, evaluating several proposals) |

The decision rule from the Responses API multi-agent guidance: prefer *one* agent when every step depends on the previous one, when the task is small, when agents would contend over the same mutable resource, or when you need a fixed deterministic graph (use code or a workflow). Prefer *many* when work splits into bounded independent parts, separate context improves focus, or parallelism cuts wall-clock time. Multi-agent systems cost more tokens and are harder to debug, so tracing with the multi-agent OpenTelemetry conventions (agent invocations, handoffs, workflow spans) is not optional.`,
    },
    {
      heading: 'Mechanisms in Foundry',
      body: `Several ways exist to connect agents; know which is current.

- **Microsoft Agent Framework** (Python \`agent-framework\`, .NET \`Microsoft.Agents.AI\`): the recommended code path. \`SequentialBuilder(participants=[writer, reviewer]).build()\`, plus \`ConcurrentBuilder\`, \`HandoffBuilder\`, \`GroupChatBuilder\` and \`MagenticBuilder\`; workflows can mix agents with custom executors, support human-in-the-loop through approval-required tools and request-info pauses, and checkpoint state. Host the orchestrator as a **Foundry hosted agent** (\`agent-framework-foundry-hosting\`, \`ResponsesHostServer\`) to get a managed endpoint, identity, scaling and tracing.
- **Responses API multi-agent orchestration (preview)**: \`openai.beta.responses.create(model=..., input=prompt, multi_agent={"enabled": True, "max_concurrent_subagents": 3})\` lets a root agent create subagents in parallel and merge their work; filter output items by \`agent.agent_name == "/root"\` and \`phase == "final_answer"\`.
- **Agent-to-Agent (A2A) tool**: a Foundry agent calls any A2A 1.0 endpoint, including another Foundry agent that has incoming A2A enabled; the caller needs Foundry Agent Consumer on the target project. This replaced the classic *connected agents* feature.
- **Foundry workflows (preview, retiring 1 December 2026)**: visual builder with sequential, group chat and human-in-the-loop templates; migrate to Agent Framework.
- **Routines**: one trigger (timer, recurring schedule, GitHub issue or Teams message event) → one agent invocation, with run history; the automation layer for autonomous agents.
- **Toolbox**: shared tools and skills for all agents in the system; **Foundry Control Plane**: fleet-wide monitoring and policy.

Shared state travels either through the conversation (sequential patterns), through explicit messages (A2A, handoff) or through external stores (Cosmos DB, durable task state for long-running hosted agents).`,
    },
    {
      heading: 'Autonomous and semi-autonomous workflows with safeguards',
      body: `Autonomy is a dial, not a switch. Design each action on three axes: reversibility, blast radius, and confidence.

- **Fully autonomous**: read-only lookups, drafts saved for later, routine summaries; triggered by **routines** or events; still bounded by guardrails, token limits and allowed_tools.
- **Semi-autonomous**: the agent proposes, a person approves consequential steps. Mechanisms: MCP \`require_approval="always"\` producing \`mcp_approval_request\` items answered with \`mcp_approval_response\` in the same conversation; Agent Framework \`@tool(approval_mode="always_require")\` and workflow request-info pauses; hosted long-running agents that suspend a \`@multi_turn_task\` chain and resume later on the same \`task_id\` (minutes, hours or days, surviving restarts); **steerable** hosted agents that accept mid-turn redirection; the workflow **human-in-the-loop** node.
- **Attended**: a signed-in user drives the conversation and tools run under **user delegation**, so downstream systems enforce the user's own permissions.

Safeguards to layer regardless of mode: **guardrails** at tool call and tool response intervention points (indirect attacks, task adherence, PII), **Task Adherence** detection to flag tool calls misaligned with user intent and escalate to a human, **constraints** in instructions and structured inputs, **iteration and budget caps**, **idempotent tools** with compensating actions for rollback, **timeouts and dead-letter handling**, **audit trails** (traces plus recorded approvals), and **kill switches** (disable the routine, deactivate the agent version, revoke the agent identity's roles).`,
    },
    {
      heading: 'Governing agent behaviour and the exam angle',
      body: `Governance questions combine identity, tool access and oversight:

- **Identity**: every agent has an Entra **agent identity** under a blueprint; grant it only the roles it needs; use **user delegation** for per-user data; endpoint authorization decides who may call the agent (Azure RBAC with Foundry Agent Consumer, or Entra blueprint tokens).
- **Tool-access controls**: allow-lists (\`allowed_tools\`), approvals, Toolbox governance and versioning, an **AI gateway** in front of MCP servers (auth, rate limits, IP restrictions, logging), network egress controls for hosted agents, and Azure Policy on which models and tools may be used.
- **Oversight**: tracing and the monitoring dashboard, continuous evaluation (Task Adherence, Prohibited Actions, Sensitive Data Leakage), scheduled red teaming, alerts, Foundry Control Plane fleet views with Defender and Purview signals, Agent 365 integration for Microsoft 365 surfaces.

Typical items: "a nightly agent must file Jira tickets but a person must approve any ticket marked critical" → routine-triggered agent with an MCP tool whose critical operation requires approval; "three specialist agents must review a proposal independently and a lead must reconcile" → concurrent or coordinator-subagents pattern (Agent Framework ConcurrentBuilder or Responses multi-agent); "triage agent routes to billing or technical agents" → handoff; "the agent must pause for days until a manager approves an expense" → hosted long-running agent with a suspended multi-turn task; "one team's agent must call another team's agent in a different project" → A2A tool with Foundry Agent Consumer on the target. Wrong answers tend to be: giving the agent Owner, using a longer system prompt as a "control", or disabling guardrails for speed.`,
    },
  ],
  examples: [
    {
      title: 'Sequential orchestration with Agent Framework',
      description:
        'A marketing pipeline chains a writer agent and a reviewer agent. The reviewer sees the writer\'s draft and the original request; the final output is the reviewer\'s message. The same code can be hosted as a Foundry hosted agent.',
      language: 'python',
      code: `import asyncio
from agent_framework import Agent, AgentResponse
from agent_framework.foundry import FoundryChatClient
from agent_framework.orchestrations import SequentialBuilder
from azure.identity import DefaultAzureCredential

client = FoundryChatClient(project_endpoint=PROJECT_ENDPOINT, model="gpt-5-mini",
                           credential=DefaultAzureCredential())
writer = Agent(client=client, name="writer",
               instructions="Write one punchy tagline for the product described.")
reviewer = Agent(client=client, name="reviewer",
                 instructions="Review the tagline for clarity and brand fit; return the final version.")

async def main() -> None:
    workflow = SequentialBuilder(participants=[writer, reviewer]).build()
    events = await workflow.run("A budget-friendly folding e-bike for commuters.")
    final: AgentResponse = events.get_outputs()[0]
    for msg in final.messages:
        print(f"[{msg.author_name}] {msg.text}")

asyncio.run(main())`,
      takeaway: 'Agent Framework builders express orchestration patterns declaratively; sequential passes the growing conversation from one agent to the next.',
    },
    {
      title: 'Coordinator with parallel subagents via the Responses API (preview)',
      description:
        'Three disaster-recovery proposals must be assessed independently and then reconciled against shared requirements. A root agent spawns one subagent per proposal and produces a single recommendation.',
      language: 'python',
      code: `from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import OpenAI

token = get_bearer_token_provider(DefaultAzureCredential(), "https://ai.azure.com/.default")
openai = OpenAI(base_url="https://contoso.openai.azure.com/openai/v1/", api_key=token,
                default_query={"api-version": "preview"})

response = openai.beta.responses.create(
    model="gpt-5.6-sol",
    input=("Evaluate three DR proposals (Alpha, Beta, Gamma described below). Create one subagent "
           "per proposal to assess RTO, RPO, cost and risk, then compare and recommend one.\\n" + proposals),
    multi_agent={"enabled": True, "max_concurrent_subagents": 3},
)
for item in response.output:
    if (item.type == "message" and item.phase == "final_answer"
            and item.agent and item.agent.agent_name == "/root"):
        print("".join(part.text for part in item.content))`,
      takeaway: 'Use coordinator-subagents when work splits into bounded independent pieces; the root agent reconciles, and you read only its final answer.',
    },
    {
      title: 'The runaway autonomous agent (a realistic mistake) and the approval fix',
      description:
        'An expense-processing agent ran fully autonomously on a routine, had Contributor on the finance system, and approved a fraudulent 12,000 claim after a prompt-injected receipt. The redesign keeps the routine but inserts a human approval for anything above policy limits using a long-running hosted agent task, adds an indirect-attack guardrail on tool responses, and shrinks the agent identity\'s role to submit-only.',
      language: 'python',
      code: `from azure.ai.agentserver.core.tasks import multi_turn_task, TaskContext

@multi_turn_task(name="expense-approval")
async def approve(ctx: TaskContext[dict]) -> dict:
    if ctx.entry_mode == "resumed":                       # a manager replied, maybe days later
        if ctx.input["decision"] == "approved":
            await submit_expense(ctx.metadata["expense_id"])   # identity: submit-only role
            return {"status": "submitted"}
        return {"status": "rejected"}
    expense = await build_expense(ctx.input)              # OCR + extraction already screened by guardrail
    ctx.metadata["expense_id"] = expense.id
    if expense.amount <= POLICY_AUTO_LIMIT:               # bounded autonomy
        await submit_expense(expense.id)
        return {"status": "submitted"}
    return {"status": "awaiting_approval", "summary": expense.summary}   # chain suspends

# Turn 1 from the routine; turn 2 from the approval UI on the same task_id
r1 = await approve.run(task_id=f"exp-{claim_id}", input=claim)
r2 = await approve.run(task_id=f"exp-{claim_id}", input={"decision": "approved"})`,
      takeaway: 'Bound autonomy by amount or risk, suspend for human approval on the same task id, screen tool responses for injection, and keep the agent identity to the minimum role.',
    },
  ],
  keyPoints: [
    'Patterns: sequential, concurrent, handoff, group chat, magentic and coordinator-subagents; prefer one agent when steps are strictly dependent, small, contend on shared state or need a fixed graph.',
    'Microsoft Agent Framework builders (SequentialBuilder, ConcurrentBuilder, HandoffBuilder, GroupChatBuilder, MagenticBuilder) are the recommended orchestration code path and can be hosted as Foundry hosted agents.',
    'The Responses API multi-agent option (multi_agent enabled, max_concurrent_subagents) lets a root agent spawn parallel subagents; read the /root final_answer.',
    'A2A tools connect Foundry agents to other A2A 1.0 endpoints (including other Foundry agents) and replace classic connected agents; the caller needs Foundry Agent Consumer on the target project.',
    'Foundry workflows (sequential, group chat, human-in-the-loop) retire on 1 December 2026; routines provide one-trigger-one-action automation with run history.',
    'Semi-autonomous flows use approvals: MCP require_approval and mcp_approval_response, Agent Framework approval_mode, workflow human-in-the-loop nodes, and suspended multi-turn tasks in long-running hosted agents.',
    'Safeguards: guardrails at tool call and tool response, Task Adherence detection, allowed_tools, iteration and budget caps, idempotent tools, audit traces, kill switches.',
    'Govern with least-privilege agent identities, user delegation, endpoint authorization, Toolbox and AI gateway controls, continuous evaluation and Foundry Control Plane.',
  ],
  flashcards: [
    { front: 'Which orchestration pattern passes control to the best-suited agent based on conversation context?', back: 'Handoff orchestration.' },
    { front: 'Which pattern has a manager that plans, keeps a task ledger, delegates and re-plans for open-ended tasks?', back: 'Magentic orchestration.' },
    { front: 'When does Microsoft advise against multi-agent orchestration?', back: 'When each step depends directly on the previous one, the task is small, agents would contend over the same mutable resource, or a fixed deterministic graph is required.' },
    { front: 'How do you enable parallel subagents with the Responses API?', back: 'Call openai.beta.responses.create with multi_agent={"enabled": True, "max_concurrent_subagents": N} (preview, api-version preview).' },
    { front: 'What replaced the classic connected agents feature for agent-to-agent calls?', back: 'The A2A tool (protocol 1.0), optionally with the target Foundry agent exposing an incoming A2A endpoint.' },
    { front: 'What is a routine in Foundry Agent Service?', back: 'One trigger (timer, recurring schedule, or event such as a GitHub issue or Teams message) that invokes one agent, with run history and enable/disable lifecycle.' },
    { front: 'How does a hosted agent pause for a human decision that may take days?', back: 'A @multi_turn_task chain returns an awaiting-approval turn and suspends; a later call on the same task_id resumes it with entry_mode "resumed".' },
    { front: 'Which guardrail risk flags tool calls that do not match the user\'s intent?', back: 'Task Adherence (preview), which can signal blocking or escalation to human review.' },
    { front: 'Which role does a calling agent need to invoke another Foundry agent over A2A?', back: 'Foundry Agent Consumer (or higher) on the target project.' },
    { front: 'When do Foundry portal workflows retire and what replaces them?', back: '1 December 2026; Microsoft Agent Framework workflows.' },
  ],
  quiz: [
    {
      question:
        'A legal team wants three specialist agents (privacy, IP, employment) to review a contract independently and a lead agent to merge their findings into one memo. Which pattern fits BEST?',
      options: ['Sequential orchestration', 'Concurrent (fan-out) or coordinator-subagents orchestration', 'Handoff orchestration', 'A single agent with three tools'],
      correct: [1],
      explanation:
        'Independent reviews of the same input are a fan-out with aggregation. Sequential would make reviews depend on each other, handoff routes to one specialist, and a single agent loses the benefit of separate focused context.',
    },
    {
      question:
        'An agent runs every night to triage new GitHub issues and may label them automatically, but closing an issue must be approved by a maintainer. Which TWO features implement this? (Select two)',
      options: [
        'A routine with a github_issue event trigger that invokes the agent.',
        'require_approval on the MCP tool operation that closes issues, with approvals answered in the same conversation.',
        'Granting the agent identity Owner on the repository connection.',
        'Disabling guardrails to reduce latency.',
      ],
      correct: [0, 1],
      explanation:
        'Routines provide the event trigger and approvals gate the consequential operation. Owner violates least privilege and disabling guardrails removes a safeguard.',
    },
    {
      question:
        'A procurement workflow must wait, sometimes for several days, for a director to approve a purchase before an agent places the order. Which approach is MOST appropriate?',
      options: [
        'Keep the HTTP request open until the director responds.',
        'A long-running hosted agent whose multi-turn task suspends after requesting approval and resumes on the same task_id when the decision arrives.',
        'Poll the model every minute asking whether it has been approved.',
        'Store the request in the agent\'s instructions.',
      ],
      correct: [1],
      explanation:
        'Suspended multi-turn tasks survive restarts and wait indefinitely without holding connections. Open requests time out, polling the model is meaningless, and instructions are not a state store.',
    },
    {
      question: 'A team is building a new multi-agent orchestration today and asks whether to use the Foundry portal workflow designer. What should you advise?',
      options: [
        'Use workflows; they are the long-term orchestration platform.',
        'Use Microsoft Agent Framework orchestrations (hostable as a hosted agent) because Foundry workflows are retiring on 1 December 2026.',
        'Use the classic connected agents feature.',
        'Orchestration is not supported in Foundry.',
      ],
      correct: [1],
      explanation:
        'Microsoft is retiring workflows and recommends Agent Framework. Connected agents belong to the deprecated classic API, and orchestration is well supported through Agent Framework, A2A and the Responses API.',
    },
    {
      question: 'Which control most directly prevents a compromised agent from reaching resources beyond its job, even if its instructions are hijacked?',
      options: [
        'A more detailed system prompt.',
        'Least-privilege RBAC on the agent\'s Entra agent identity plus an allowed_tools list.',
        'Raising the temperature.',
        'Using a larger model.',
      ],
      correct: [1],
      explanation:
        'Identity permissions and tool allow-lists are enforced outside the model, so they hold even when prompts fail. Prompts, temperature and model size are not security boundaries.',
    },
  ],
  statements: [
    { text: 'Adding subagents always reduces total token usage because work is parallelised.', isTrue: false, explanation: 'Multi-agent orchestration typically increases token usage; it reduces wall-clock time for divisible tasks.' },
    { text: 'Agent Framework orchestrations can mix LLM agents with custom non-LLM executors.', isTrue: true, explanation: 'Sequential and other builders accept custom executors for deterministic steps.' },
    { text: 'A routine can have multiple triggers and branch to several agents.', isTrue: false, explanation: 'A routine has one trigger and one action; branching and multiple agents need a workflow or Agent Framework orchestration.' },
    { text: 'In the Responses API multi-agent preview, you should read the final answer from the item whose agent_name is "/root".', isTrue: true, explanation: 'Subagent messages are intermediate; the root agent\'s final_answer phase holds the consolidated result.' },
    { text: 'The A2A tool supports streaming responses and image modalities from Foundry agent targets.', isTrue: false, explanation: 'Current Foundry A2A targets support text only and no streaming.' },
    { text: 'Routines invoke the agent with the agent identity by default, and the dispatch identity is fixed at creation.', isTrue: true, explanation: 'Switching between agent and creator identity requires deleting and recreating the routine.' },
    { text: 'Guardrail controls at the tool call intervention point can stop an agent from sending hateful content to a downstream tool.', isTrue: true, explanation: 'Tool call is one of the four intervention points for agent guardrails (preview).' },
  ],
  resources: [
    { label: 'Multi-agent orchestration with the Responses API', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/responses-multi-agent' },
    { label: 'Connect to an A2A agent endpoint', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/agent-to-agent' },
    { label: 'Routines in Foundry Agent Service', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/routines' },
    { label: 'Add a human-in-the-loop approval step', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/add-human-in-the-loop' },
  ],
};

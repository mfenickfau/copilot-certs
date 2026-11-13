import type { Concept } from '../../types';

export const decomposingGoalsIntoAgentWorkflows: Concept = {
  id: 'decomposing-goals-into-agent-workflows',
  title: 'Decomposing Goals into Workflows, Agents, Tools and Human Checkpoints',
  summary:
    'How an expert turns a business objective into a multi-agent design: deciding what is a deterministic workflow step versus an agent, scoping each agent with a persona, boundaries and an autonomy level, matching models to task demands, and designing human-in-the-loop controls that satisfy HAX and responsible-AI principles.',
  certs: ['ai-500'],
  domains: ['ai-500-1', 'ai-500-2'],
  outcomes: ['ai-500-1-1-1', 'ai-500-1-1-2', 'ai-500-1-1-3', 'ai-500-1-1-6', 'ai-500-1-1-8', 'ai-500-2-4-2'],
  tags: ['architecture', 'decomposition', 'agent-framework', 'human-in-the-loop', 'hax', 'model-selection', 'foundry-agent-service'],
  difficulty: 'advanced',
  diagram: 'coordinator-subagents',
  sections: [
    {
      heading: 'Workflow, agent or tool? The decomposition ladder',
      body: `Start from the business goal and work down. Microsoft Agent Framework's own guidance is blunt: *if you can write a function to handle the task, do that instead of an agent*. Decomposition therefore proceeds in three tiers:

1. **Workflow steps** are deterministic. Parsing a form, calling a pricing API, or routing on a status code belongs in code (an Agent Framework *executor*, a Foundry hosted-agent handler, or a plain function). Workflows give you explicit execution order, typed message routing, checkpoints and replay.
2. **Agents** own open-ended, language-heavy or judgement-heavy work: triaging a ticket, drafting a response, deciding which tool to call next. Give each agent one responsibility so that its instructions and tool list stay small; tool selection degrades as a single agent accumulates dozens of tools.
3. **Tools** are the side-effecting leaves: function tools, MCP servers, OpenAPI operations, search and code interpreter. A tool does one thing and returns structured output the agent can validate.

The classic smell is an "everything agent" with a 2,000-word prompt and 30 tools. Split it along *capability boundaries* (research vs. write vs. review), *data boundaries* (HR data vs. finance data, which also simplifies permissions) and *control boundaries* (steps that need approval before a side effect). The result is normally a coordinator or workflow at the top, specialist agents or subagents in the middle, and tools at the bottom, which is exactly the shape Foundry's connected-agent, A2A and Agent Framework orchestration features assume.`,
    },
    {
      heading: 'Personas, scopes, boundaries and autonomy levels',
      body: `Every agent in the design needs a short specification that an exam question could quote back at you:

- **Persona and task**: what it is and the single outcome it owns ("You are the refund specialist for Contoso Retail; you resolve refund requests under the returns policy").
- **Scope and boundaries**: topics, data and actions it must not touch, and the explicit fallback ("if the request is outside returns, hand off to triage"). Foundry's safety system-message guidance recommends stating the *when unsure* policy, not just the happy path.
- **Autonomy level**: how far it may go without a person. A useful ladder is *suggest* (drafts for a human), *act with approval* (pauses before each consequential tool call), *act and report* (acts, logs, and a human reviews later), and *fully autonomous* (bounded by limits such as max iterations and spend). Reversibility, blast radius and data sensitivity decide the level; irreversible or high-impact actions almost never run fully autonomously.
- **Behavioural guidelines**: tone, citation requirements, output contract (JSON schema), and refusal behaviour.

Autonomy is enforced in code, not just in prose. In Agent Framework you mark a function tool with \`approval_mode="always_require"\` so the run pauses with a tool-approval request; in Foundry prompt agents you set \`require_approval\` on MCP tools; loops get \`max_iterations\`, and Magentic orchestration gets \`max_round_count\` and \`max_stall_count\`. A persona written in the prompt that is not backed by such controls is a design gap the exam likes to probe.`,
    },
    {
      heading: 'Human-in-the-loop as a first-class workflow node',
      body: `Human-in-the-loop (HITL) is not an error path; it is a planned pause. Design for three kinds of human interaction:

- **Approval**: the agent proposes a consequential action (refund, deployment, email to a customer) and waits for yes/no.
- **Clarification or information**: the workflow needs a value only a person can supply.
- **Override and edge cases**: a human can redirect or stop a run that drifted, and policies define what happens when the human never answers (timeout, escalate, abandon).

Agent Framework implements the pause with *request/response handling*: an executor calls \`ctx.request_info(request_data=..., response_type=...)\`, the workflow emits a request-info event and suspends; your application shows the request to a person and sends the response back, which routes to the \`@response_handler\` method. Because checkpoints are taken at superstep boundaries, a suspended workflow can be resumed hours later from durable storage (Cosmos DB in production). Foundry hosted agents offer the same shape with the \`@multi_turn_task\` chain: the first turn returns \`awaiting_approval\`, the chain suspends under one \`task_id\`, and a later turn on the same id re-enters the handler with \`ctx.entry_mode == "resumed"\`. Magentic orchestration adds *plan review* (\`enable_plan_review=True\`) so a human signs off on the manager's plan before any agent acts.

Good HAX (human-AI experience) design surrounds these pauses with transparency: show what the agent intends to do and why, show its confidence or the evidence (citations, tool results), make it easy to correct or dismiss, and remember the correction. Those are the Microsoft HAX Guidelines in practice, and they map directly to the responsible-AI principles of transparency and accountability.`,
    },
    {
      heading: 'Matching task demands to model families',
      body: `Not every agent in a system needs the same model. Match the *task demand* to *model capacity* along four axes:

| Demand | Choose | Why |
|---|---|---|
| Multi-step reasoning, planning, synthesis across sources | A frontier or reasoning model | Coordinators, Magentic managers and RAG synthesis consistently need higher capability |
| Mechanistic tool calls, classification, extraction | A small or mini model | Structured JSON generation with strict schemas does not need frontier reasoning and is far cheaper and faster |
| Long documents | A model whose context window fits the input, or chunk first | Context limits, not quality, decide |
| Latency-critical voice or chat turns | Small, fast models; stream output | User-perceived latency dominates |

Foundry's **model router** automates part of this: one deployment routes each request to the most suitable underlying model in *Balanced*, *Cost* or *Quality* mode, and agents can use it directly, so a greeting goes to a cheap model while a complex tool-calling chain goes to a frontier model. Agent Framework's agents-as-tools pattern also lets each inner agent use a different client, so the coordinator and specialists can run on different models. Whatever you pick, evaluate it: Foundry evaluations and benchmarks exist precisely so that model choice is measured, not assumed.`,
    },
    {
      heading: 'The exam angle',
      body: `Architecture items on AI-500 are "which design is MOST appropriate" questions. Patterns to recognise:

- A deterministic sequence that must run in a fixed order with auditability is a **workflow**, not a group of chatting agents.
- A request that can be split into independent, bounded subtasks benefits from a **coordinator with parallel subagents**; a chain where each step depends on the previous favours **sequential** orchestration; a task whose path is unknown in advance favours **Magentic** (manager plus specialists).
- Any action that is irreversible, costly or affects a customer should sit behind an **approval** pause, implemented with request/response handling or tool approval, not with a prompt that says "ask first".
- "The agent sometimes ignores its boundaries" is solved by narrowing scope and adding enforced controls (tool allowlists, approval, termination conditions), not by writing a longer persona.
- When one model is used everywhere and cost is the complaint, the answer is model matching (small models for mechanical steps, frontier for reasoning) or the model router, not reducing quality across the board.

Distractors tend to be real features applied to the wrong problem: content filters to fix orchestration bugs, fine-tuning to fix missing knowledge, or a bigger model to fix a missing approval gate.`,
    },
  ],
  examples: [
    {
      title: 'Decomposing an invoice-exception process',
      description:
        'A finance team wants to "automate invoice exceptions". The architect decomposes it: a workflow step validates the invoice schema (code), a classifier agent on a mini model labels the exception type (agent, low autonomy), a specialist agent per exception type investigates with ERP tools (agents with scoped tools), and a human approves any adjustment over a threshold (HITL node). The coordinator is a workflow, because the order is fixed and auditors need a replayable trace.',
      takeaway: 'Deterministic steps become code, judgement steps become narrowly scoped agents, and consequential actions get an explicit approval node.',
    },
    {
      title: 'An approval pause with Agent Framework request/response',
      description:
        'The refund executor asks a human before issuing refunds above a limit. The workflow suspends at request_info, your app collects the decision, and the response routes back to the handler. Checkpoint storage lets the pause last for hours.',
      language: 'python',
      code: `from dataclasses import dataclass
from agent_framework import Executor, WorkflowBuilder, WorkflowContext, handler, response_handler

@dataclass
class RefundApproval:
    order_id: str
    amount: float

class RefundExecutor(Executor):
    def __init__(self) -> None:
        super().__init__(id="refund")

    @handler
    async def propose(self, req: RefundApproval, ctx: WorkflowContext[str, str]) -> None:
        if req.amount > 500:
            # Pause the workflow; a human answers True/False later.
            await ctx.request_info(request_data=req, response_type=bool)
        else:
            await ctx.yield_output(f"Auto-refunded {req.order_id}")

    @response_handler
    async def on_decision(self, original: RefundApproval, approved: bool, ctx: WorkflowContext[str, str]) -> None:
        await ctx.yield_output(("Refunded " if approved else "Declined ") + original.order_id)

workflow = WorkflowBuilder(start_executor=RefundExecutor()).build()`,
      takeaway: 'HITL is a typed request/response pause in the graph, so the decision is auditable and the run can resume from a checkpoint.',
    },
    {
      title: 'The "ask before you act" prompt that never asked (a realistic mistake)',
      description:
        'A team wrote "Always ask the user before sending any email" into a sales agent\'s instructions. During a long conversation the model sent a follow-up email without asking. The fix was to make the send_email tool approval-required (approval_mode="always_require") so the run returns a tool-approval request instead of executing, and to add a tool-call guardrail. Prose instructions are probabilistic; approval gates are deterministic.',
      language: 'python',
      code: `from typing import Annotated
from agent_framework import Agent, tool
from agent_framework.foundry import FoundryChatClient

@tool(approval_mode="always_require")  # the run pauses with an approval request
def send_email(to: Annotated[str, "Recipient"], body: Annotated[str, "Email body"]) -> str:
    """Send an email to a customer."""
    return f"sent to {to}"

agent = Agent(
    client=FoundryChatClient(),           # endpoint/model from environment
    name="SalesAssistant",
    instructions="Draft and send follow-ups for the sales team.",
    tools=[send_email],
)`,
      takeaway: 'Enforce autonomy limits with approval-required tools and guardrails, not only with instructions.',
    },
    {
      title: 'Right-sizing models across a research pipeline',
      description:
        'A research assistant used one frontier model for everything and cost twice the budget. Profiling traces showed 70% of calls were entity extraction and JSON formatting. Moving those subagents to a mini model and keeping the synthesis agent on the frontier model cut cost by half with no measured drop in the Task Completion evaluator. A later iteration replaced the per-agent choice with a Foundry model router deployment in Balanced mode.',
      takeaway: 'Match model capacity to task demand per agent, then verify with evaluations rather than intuition.',
    },
  ],
  keyPoints: [
    'Decompose top-down: deterministic steps become workflow code, judgement steps become narrowly scoped agents, side effects become tools.',
    'If a plain function can do the job, use a function; agents add cost, latency and non-determinism.',
    'Each agent needs a persona, scope and boundaries, an autonomy level, and behavioural guidelines, with the "when unsure" fallback stated explicitly.',
    'Autonomy levels are enforced by controls (approval-required tools, iteration and round limits, termination conditions), never by prompt text alone.',
    'HITL is a planned pause: Agent Framework request_info/response_handler, Foundry multi_turn_task suspend/resume, Magentic plan review.',
    'HAX and responsible AI mean the UI shows intent, evidence and confidence, makes correction easy, and keeps humans accountable for consequential actions.',
    'Match model family to task demand (reasoning vs. mechanical tool calls vs. latency) per agent, or use Foundry model router, and confirm with evaluations.',
  ],
  flashcards: [
    { front: 'What is the first question to ask when decomposing a goal into agents?', back: 'Can this step be done deterministically by code? If so, make it a workflow step or function, not an agent.' },
    { front: 'Name the four elements of an agent specification.', back: 'Persona and task, scope and boundaries (with fallback), autonomy level, behavioural guidelines (tone, output contract, refusals).' },
    { front: 'Give a four-step autonomy ladder.', back: 'Suggest only; act with approval; act and report; fully autonomous within limits.' },
    { front: 'How does an Agent Framework executor pause for a human?', back: 'It calls ctx.request_info(request_data, response_type); the workflow emits a request-info event and resumes when a response is routed to the @response_handler method.' },
    { front: 'How does a Foundry hosted agent implement a long approval wait?', back: 'With a @multi_turn_task chain: the first turn returns an awaiting_approval status and suspends under one task_id; a later turn on the same id resumes with ctx.entry_mode == "resumed".' },
    { front: 'What does Magentic plan review add?', back: 'A human signs off on the manager\'s plan (enable_plan_review=True) before specialist agents act.' },
    { front: 'Which tasks justify a frontier/reasoning model?', back: 'Multi-step reasoning, planning, coordination and synthesis across sources; mechanical tool calls and extraction can use small models.' },
    { front: 'What does Foundry model router do for agents?', back: 'Routes each request to the most suitable underlying model (Balanced, Cost or Quality mode) behind one deployment, so simple turns use cheap models and complex ones use frontier models.' },
    { front: 'Why is "ask before acting" in the prompt insufficient?', back: 'Instructions are probabilistic; use approval-required tools, tool-call guardrails and termination limits to enforce the boundary.' },
    { front: 'Which decomposition boundaries help with permissions?', back: 'Data boundaries: separate agents per data domain so each agent identity gets only the access it needs.' },
  ],
  quiz: [
    {
      question:
        'You are designing an order-fulfilment automation. Steps: validate the order payload, check inventory via an API, decide how to handle a backorder (requires judgement and customer context), and issue a refund if needed. Auditors require a replayable, fixed-order trace. Which design is MOST appropriate?',
      options: [
        'A single agent with all four capabilities as tools and detailed instructions about the order of steps.',
        'A group-chat orchestration where four agents discuss each order until consensus.',
        'A workflow with deterministic executors for validation and inventory, a scoped agent for the backorder decision, and an approval pause before refunds.',
        'Four independent agents exposed as A2A endpoints with no coordinator.',
      ],
      correct: [2],
      explanation:
        'Deterministic steps belong in workflow executors, judgement in a scoped agent, and consequential actions behind approval; workflows give the fixed order and checkpointed trace auditors need. A single agent cannot guarantee order, group chat is for iterative refinement, and uncoordinated A2A endpoints provide no end-to-end trace.',
    },
    {
      question:
        'A support agent\'s instructions say "Never issue a refund above $500 without manager approval", yet traces show it called issue_refund for $1,200 directly. What is the BEST fix?',
      options: [
        'Move the sentence to the top of the system prompt and put it in bold.',
        'Mark issue_refund as approval-required so the run pauses with a tool-approval request, and add a tool-call guardrail.',
        'Switch to a larger model that follows instructions more reliably.',
        'Lower the model temperature to zero.',
      ],
      correct: [1],
      explanation:
        'Autonomy limits must be enforced by controls. Approval-required tools deterministically pause execution. Prompt emphasis, a larger model or sampling settings only change probabilities.',
    },
    {
      question: 'Which TWO signals most strongly indicate that a subtask should be a deterministic workflow step rather than an agent? (Select two)',
      options: [
        'The step is a schema validation with a fixed rule set.',
        'The step requires interpreting free-text customer sentiment.',
        'The step must run in an exact position in a fixed sequence for audit purposes.',
        'The step requires choosing between several tools based on conversation context.',
      ],
      correct: [0, 2],
      explanation:
        'Fixed rules and fixed ordering are deterministic concerns handled best by code and workflow edges. Interpreting free text and context-dependent tool choice are judgement tasks suited to agents.',
    },
    {
      question:
        'A multi-agent research system uses one frontier model for every agent. Finance reports the cost is double the budget, while quality evaluations are satisfactory. What should you do FIRST?',
      options: [
        'Reduce the number of research sources retrieved per question.',
        'Profile traces to identify mechanical subagents (extraction, formatting) and move them to smaller models or a model router, then re-run evaluations.',
        'Disable tracing to save Application Insights costs.',
        'Replace the frontier model with a mini model for all agents.',
      ],
      correct: [1],
      explanation:
        'Model matching per task is the direct lever: mechanical steps do not need frontier capacity. Replacing all models risks quality, retrieving fewer sources changes behaviour, and tracing costs are not the issue.',
    },
    {
      question:
        'A Magentic-style manager coordinates specialists to plan a data migration. Stakeholders want to review the plan before any agent touches production systems. Which feature addresses this directly?',
      options: [
        'Enable plan review on the Magentic workflow so a human signs off before execution.',
        'Set max_round_count to 1.',
        'Add a content-safety guardrail at the output intervention point.',
        'Use a concurrent orchestration so all specialists run at once.',
      ],
      correct: [0],
      explanation:
        'Magentic plan review pauses for human sign-off on the plan. A round limit does not insert a human, content safety does not review plans, and concurrency changes execution shape rather than oversight.',
    },
    {
      question: 'Which practice BEST reflects HAX guidance for an agent that files expense reports on a user\'s behalf?',
      options: [
        'Hide tool calls from the user so the experience feels seamless.',
        'Show the proposed report, the evidence (receipt data) and the action it will take, allow one-click correction, and remember corrections for next time.',
        'Ask the user to confirm every single token the agent generates.',
        'Run fully autonomously and email a summary at month end.',
      ],
      correct: [1],
      explanation:
        'HAX principles emphasise making clear what the system can do, showing why, supporting efficient correction, and learning from behaviour. Hiding actions reduces transparency, confirming every token is unusable, and month-end summaries remove timely control over a consequential action.',
    },
  ],
  statements: [
    { text: 'If a task can be completed by a deterministic function, Microsoft Agent Framework guidance recommends writing that function instead of using an agent.', isTrue: true, explanation: 'Agents add cost and non-determinism; the framework docs say to use a function when one suffices.' },
    { text: 'Writing an autonomy rule into the system prompt is sufficient to enforce it in production.', isTrue: false, explanation: 'Prompts are probabilistic; enforce limits with approval-required tools, guardrails and iteration or round limits.' },
    { text: 'In Agent Framework, an executor pauses a workflow for human input by calling ctx.request_info and handles the answer in a @response_handler method.', isTrue: true, explanation: 'This is the request/response mechanism behind human-in-the-loop workflows.' },
    { text: 'Group-chat orchestration is the recommended pattern when a fixed, auditable execution order is required.', isTrue: false, explanation: 'Fixed order with auditability is a workflow (sequential or graph) concern; group chat is for iterative, collaborative refinement.' },
    { text: 'Each agent in a multi-agent system can use a different model, and Foundry model router can select a model per request.', isTrue: true, explanation: 'Agents-as-tools and workflows allow per-agent clients; model router routes per request by complexity and routing mode.' },
    { text: 'Magentic orchestration is best suited to tasks whose solution path is known in advance.', isTrue: false, explanation: 'Magentic is designed for open-ended tasks where a manager plans and re-plans dynamically; known paths suit sequential workflows.' },
    { text: 'A Foundry hosted agent can keep a human approval pending for days by suspending a @multi_turn_task chain under one task_id.', isTrue: true, explanation: 'The chain persists between turns and survives container restarts.' },
  ],
  resources: [
    { label: 'Microsoft Agent Framework overview (when to use agents vs workflows)', url: 'https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview' },
    { label: 'Agent Framework workflows: human-in-the-loop', url: 'https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop' },
    { label: 'Build a multiple-agent workflow automation solution (Azure Architecture Center)', url: 'https://learn.microsoft.com/en-us/azure/architecture/ai-ml/idea/multiple-agent-workflow-automation' },
    { label: 'Use model router with Foundry agents', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/model-router-agents' },
  ],
};

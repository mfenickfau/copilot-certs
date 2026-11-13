import type { Concept } from '../../types';

export const orchestrationPatternsAndFrameworks: Concept = {
  id: 'orchestration-patterns-and-frameworks',
  title: 'Orchestration Patterns and Frameworks: Sequential, Concurrent, Hub-and-Spoke, Peer-to-Peer, Magentic',
  summary:
    'Implementing multi-agent orchestration patterns (sequential, parallel or concurrent, hub-and-spoke group chat, peer-to-peer handoff, orchestrator-subagent and agents-as-tools) with Microsoft Agent Framework, LangChain and LangGraph on Foundry, understanding how Semantic Kernel and AutoGen map onto them, and where Hugging Face Transformers models fit into a multi-agent solution.',
  certs: ['ai-500'],
  domains: ['ai-500-2'],
  outcomes: ['ai-500-2-4-1', 'ai-500-2-4-6', 'ai-500-2-4-7'],
  tags: ['orchestration', 'agent-framework', 'langgraph', 'langchain', 'semantic-kernel', 'autogen', 'magentic', 'handoff', 'hugging-face'],
  difficulty: 'advanced',
  diagram: 'orchestration-patterns',
  sections: [
    {
      heading: 'The pattern catalogue and when each wins',
      body: `The exam names five patterns; Agent Framework ships builders for each, and the mapping matters more than the vocabulary:

| Exam term | Agent Framework | Shape | Use when |
|---|---|---|---|
| **Sequential** | \`SequentialBuilder\` | Pipeline; each agent sees the conversation (or only the prior response with \`chain_only_agent_responses=True\`) | Fixed stages: draft, review, translate; audit needs order |
| **Parallel** | \`ConcurrentBuilder\` (fan-out/fan-in, custom aggregator) | All agents process the same input independently; results aggregated | Diverse perspectives, ensemble voting, independent sub-analyses, latency reduction |
| **Hub-and-spoke** | \`GroupChatBuilder\` (star topology, orchestrator selects speaker: round-robin, function or agent) | Shared conversation, central speaker selection, termination condition | Iterative refinement, debate, multi-perspective review |
| **Peer-to-peer** | \`HandoffBuilder\` (mesh, no orchestrator) | Agents transfer full ownership and context to each other | Triage to specialist routing, customer support, expert hand-offs |
| **Orchestrator-subagent** | \`MagenticBuilder\` (manager plans, selects, tracks progress, re-plans) and agents-as-tools | Manager keeps context and delegates; subagents return results | Open-ended tasks with unknown path; coordinator with focused specialists |

Two design truths follow. First, **handoff versus agents-as-tools** differ in ownership: in handoff the receiving agent owns the task and the whole conversation; in agents-as-tools the outer agent retains responsibility and sees only the inner agent's final text. Second, **group chat versus Magentic** share a star architecture, but Magentic's manager plans and re-plans with explicit limits (\`max_round_count\`, \`max_stall_count\`, \`max_reset_count\`), so use plain group chat when coordination is simple. Every pattern needs a **termination condition** or round limit; unbounded loops are the most common production defect.`,
    },
    {
      heading: 'Implementing patterns with Agent Framework workflows',
      body: `Agent Framework (the successor to Semantic Kernel and AutoGen, built by the same teams) separates two layers. **Agents** wrap a chat client (\`FoundryChatClient\`, Azure OpenAI, OpenAI, Anthropic, Ollama), instructions, tools, context providers and middleware; a *Harness Agent* adds batteries for long tasks (planning and todos, compaction, file memory, don't-ask-again approvals). **Workflows** connect agents and functions through explicit execution paths: the graph API (\`WorkflowBuilder\` with executors, typed edges, fan-out and fan-in, conditions, sub-workflows) and the Python functional API (\`@workflow\`, \`@step\`, native \`asyncio.gather\`). The orchestration builders are pre-built graphs on this runtime, which is why they all support streaming events, checkpoints at superstep boundaries, request/response HITL and tool approval, and can be wrapped as agents with \`.as_agent()\` to nest inside larger workflows.

Practical details the exam probes:

- Handoff requires agents that execute tools locally and stable agent ids/names when rehydrating from checkpoints; autonomous mode lets an agent keep working without user input up to a turn limit.
- Group chat termination can be a function over the conversation (message count, a keyword) and selection can be an orchestrator agent for intelligent routing.
- Concurrent aggregation defaults to one assistant message per participant; a custom aggregator (often a summariser agent) can merge them.
- Magentic supports plan review (human sign-off) and intermediate outputs for streaming visibility.
- Checkpoint storage choices are in-memory (tests), file (single machine) and Cosmos DB (production, distributed); orchestration builders accept a name so checkpoints are grouped and resumable.

Hosting: wrap the agent or workflow with \`ResponsesHostServer\` or \`InvocationsHostServer\` from \`agent-framework-foundry-hosting\` and deploy as a Foundry hosted agent, or use the Durable Extension (Azure Functions or self-hosted) when orchestrations must run for days.`,
    },
    {
      heading: 'LangChain and LangGraph on Foundry; Semantic Kernel and AutoGen lineage',
      body: `Foundry is framework-agnostic, and the exam expects you to place each framework correctly.

**LangChain and LangGraph.** The \`langchain-azure-ai\` package connects LangGraph to Foundry in two ways. \`AgentServiceFactory\` turns Foundry prompt agents into LangGraph nodes (\`get_agent_node(name, version)\`), so you compose graphs with conditional routing, tool-enabled workflows and interrupts for approvals while Foundry manages the agent definitions, conversations and tracing (the conversation id lands in graph state). \`langchain-azure-ai[hosting]\` exposes a compiled graph through \`ResponsesHostServer\` or \`InvocationsHostServer\` so LangGraph (and Deep Agents) run as hosted agents with Foundry sessions, identity and telemetry. Tracing uses the Microsoft OpenTelemetry distro and OpenInference instrumentation.

**Semantic Kernel.** Microsoft's earlier enterprise SDK (kernel, plugins, planners, agent framework with group chat). It continues to be supported and its agents emit Foundry traces natively, but new multi-agent work should target Agent Framework, which inherited Semantic Kernel's enterprise features (session-based state, type safety, middleware, telemetry). A migration guide maps plugins to tools and kernel functions to function tools.

**AutoGen.** The research-origin framework that pioneered conversational multi-agent patterns (round-robin and selector group chats, Magentic-One). Agent Framework adopted AutoGen's simple abstractions and the Magentic orchestration; a migration guide maps AutoGen teams to Agent Framework orchestrations.

**OpenAI Agents SDK and others** can also be hosted on Foundry (hosted agents accept any container) and traced with OpenInference. The design question is never "which framework is best" but which runtime owns state, identity, tracing and approvals, and whether a managed hosted agent or your own compute runs it.`,
    },
    {
      heading: 'Where Hugging Face Transformers fit',
      body: `Not every agent in a multi-agent solution should call a frontier LLM. Hugging Face models provide specialised, often cheaper capabilities, and there are two integration routes:

- **Hugging Face models in the Foundry model catalog**, deployed with Foundry Managed Compute (preview) on GPU accelerators you select, invoked through the deployment endpoint like any other model. Use them for open-weight chat models, domain models, embeddings, classifiers or rerankers behind an agent or tool. They are non-Microsoft products: evaluate safety and licence terms yourself, and plan GPU quota separately from VM quota.
- **The \`transformers\` library in your own agent code** (hosted agent container, Container Apps or Functions) for lightweight local inference: zero-shot or fine-tuned classifiers for routing and triage, named-entity recognition for entity continuity, sentiment and toxicity scorers used as custom evaluators or guardrails, cross-encoder rerankers for retrieval precision, and small summarisers for compaction. Wrap the model call as a **tool** or an **executor** so the orchestrator treats it like any other capability, pin model revisions, and load the model once at startup (or at image build) to keep hosted-agent cold starts low.

Advanced multi-agent capabilities this enables: a Transformers router that classifies intent before an LLM is invoked (saving tokens), an ensemble where a Transformers judge scores candidate outputs from concurrent agents, and domain-specific specialists (biomedical, legal, code) deployed from the catalog and placed in a sequential or Magentic workflow. Keep observability consistent by emitting OpenTelemetry spans around local inference so these steps appear in the same trace as LLM calls.`,
    },
  ],
  examples: [
    {
      title: 'Sequential and concurrent stages in one Agent Framework workflow',
      description:
        'A market-entry report runs three analysts concurrently (independent perspectives), aggregates them, then passes the result through a writer and a compliance reviewer sequentially, chaining only agent responses to keep context tight.',
      language: 'python',
      code: `from agent_framework import Agent
from agent_framework.foundry import FoundryChatClient
from agent_framework.orchestrations import ConcurrentBuilder, SequentialBuilder

client = FoundryChatClient()
mk = lambda name, inst: Agent(client=client, name=name, instructions=inst)

analysis = ConcurrentBuilder(participants=[
    mk("Market", "Assess market size and growth."),
    mk("Regulatory", "List regulatory constraints."),
    mk("Finance", "Estimate cost and margin."),
]).build().as_agent(name="Analysis")          # fan-out/fan-in wrapped as one agent

report = SequentialBuilder(
    participants=[analysis, mk("Writer", "Write an executive summary."),
                  mk("Reviewer", "Check compliance wording; return the final text.")],
    chain_only_agent_responses=True,
).build()

events = await report.run("Should Contoso launch e-bikes in Spain in 2027?")
print(events.get_outputs()[0].messages[-1].text)`,
      takeaway: 'Compose patterns: a concurrent sub-workflow becomes a participant in a sequential pipeline, and context flow is controlled explicitly.',
    },
    {
      title: 'Peer-to-peer handoff for customer support with a termination condition',
      description:
        'A triage agent receives the conversation and hands off ownership to refund, order or returns specialists. The conversation ends when a specialist says the closing phrase, and checkpoint storage makes the mesh resumable.',
      language: 'python',
      code: `from agent_framework import CosmosCheckpointStorage   # agent-framework-azure-cosmos
from agent_framework.orchestrations import HandoffBuilder

storage = CosmosCheckpointStorage(endpoint=COSMOS_URL, database="agents", container="checkpoints")

workflow = (
    HandoffBuilder(
        name="support_handoff",
        participants=[triage_agent, refund_agent, order_agent, returns_agent],
        termination_condition=lambda conv: bool(conv) and "case closed" in conv[-1].text.lower(),
        checkpoint_storage=storage,
    )
    .with_start_agent(triage_agent)              # triage owns the first turn
    .add_handoff(triage_agent, [refund_agent, order_agent, returns_agent])
    .add_handoff([refund_agent, order_agent, returns_agent], triage_agent)
    .build()
)
async for event in workflow.run("My order 12345 arrived damaged.", stream=True):
    if event.type == "request_info":             # approval-required tool or user input needed
        ...`,
      takeaway: 'Handoff transfers full ownership; always bound it with termination conditions and persist checkpoints for long support sessions.',
    },
    {
      title: 'Group chat that never ended (a realistic mistake)',
      description:
        'A writer and a reviewer were placed in a group chat with an LLM-based speaker selector and no termination condition. The reviewer kept requesting "one more improvement", the writer kept complying, and a single request consumed 400,000 tokens before an operator killed it. Fixes: a hard termination condition (maximum assistant messages), a reviewer instruction to return APPROVED when criteria are met, Magentic-style stall detection for the manager, and a token-budget alert.',
      takeaway: 'Every collaborative pattern needs explicit termination (count, keyword, judge) plus budget alerts; selection intelligence does not replace limits.',
    },
    {
      title: 'LangGraph routing to Foundry prompt agents',
      description:
        'A LangGraph graph keeps a local router node and delegates to existing Foundry prompt agents as nodes created by AgentServiceFactory, so agent definitions stay centrally managed and traced in Foundry while LangGraph owns the routing logic.',
      language: 'python',
      code: `import os
from typing import Literal
from azure.identity import DefaultAzureCredential
from langchain_azure_ai.agents import AgentServiceFactory
from langgraph.graph import StateGraph, MessagesState, START, END

factory = AgentServiceFactory(project_endpoint=os.environ["AZURE_AI_PROJECT_ENDPOINT"],
                              credential=DefaultAzureCredential())
billing = factory.get_agent_node(name="billing-agent", version="latest")   # existing Foundry agent
tech = factory.get_agent_node(name="tech-support-agent", version="3")      # pinned version

def route(state: MessagesState) -> Literal["billing", "tech"]:
    return "billing" if "invoice" in state["messages"][-1].content.lower() else "tech"

g = StateGraph(MessagesState)
g.add_node("billing", billing); g.add_node("tech", tech)
g.add_conditional_edges(START, route)
g.add_edge("billing", END); g.add_edge("tech", END)
app = g.compile()   # host with ResponsesHostServer(app) via langchain-azure-ai[hosting]`,
      takeaway: 'LangGraph can orchestrate Foundry-managed agents as nodes; pin versions for stability and host the graph as a Foundry hosted agent.',
    },
  ],
  keyPoints: [
    'Sequential = SequentialBuilder pipeline; parallel = ConcurrentBuilder fan-out/fan-in; hub-and-spoke = GroupChatBuilder star with speaker selection; peer-to-peer = HandoffBuilder mesh; orchestrator-subagent = MagenticBuilder manager or agents-as-tools.',
    'Handoff transfers full task ownership and context; agents-as-tools keeps the outer agent responsible and shows it only the inner agent\'s final response.',
    'Magentic adds planning, progress tracking and re-planning with max_round_count, max_stall_count, max_reset_count and optional plan review; use plain group chat for simple coordination.',
    'All Agent Framework orchestrations run on the workflow runtime: streaming events, superstep checkpoints (in-memory, file, Cosmos DB), request/response HITL and tool approval, and .as_agent() nesting.',
    'Every collaborative pattern needs an explicit termination condition or round limit plus budget alerts.',
    'LangGraph integrates with Foundry via AgentServiceFactory nodes for prompt agents and langchain-azure-ai[hosting] for hosted agents; Semantic Kernel and AutoGen are the predecessors Agent Framework unified, with migration guides.',
    'Hugging Face models enter via the Foundry model catalog (managed compute) or the transformers library inside agent code, typically as classifiers, rerankers, embeddings, judges or domain specialists wrapped as tools or executors.',
  ],
  flashcards: [
    { front: 'Which Agent Framework builder implements peer-to-peer routing without a central orchestrator?', back: 'HandoffBuilder (mesh topology; agents transfer control and full context to each other).' },
    { front: 'How does group chat differ from handoff?', back: 'Group chat uses a central orchestrator to select speakers in a shared conversation (star); handoff passes ownership directly between agents (mesh).' },
    { front: 'What distinguishes Magentic from group chat?', back: 'Magentic has a planning manager that maintains a task ledger, tracks progress and re-plans, with round, stall and reset limits and optional plan review.' },
    { front: 'In agents-as-tools, what does the outer agent see from the inner agent?', back: 'Only the inner agent\'s final text response, not its reasoning, tool calls or context.' },
    { front: 'Which SequentialBuilder option passes only the previous agent\'s response to the next agent?', back: 'chain_only_agent_responses=True.' },
    { front: 'Name the three built-in Agent Framework checkpoint storages and their use.', back: 'InMemoryCheckpointStorage (tests), FileCheckpointStorage (single machine), CosmosCheckpointStorage (production, distributed).' },
    { front: 'How does LangGraph use existing Foundry prompt agents?', back: 'AgentServiceFactory.get_agent_node(name, version) returns a LangGraph node that runs through Foundry Agent Service.' },
    { front: 'What is Agent Framework\'s relationship to Semantic Kernel and AutoGen?', back: 'It is their successor, combining AutoGen\'s multi-agent abstractions with Semantic Kernel\'s enterprise features; migration guides exist for both.' },
    { front: 'Two ways to use Hugging Face models in a Foundry-based multi-agent solution?', back: 'Deploy catalog models on Foundry Managed Compute, or run transformers locally inside agent code as tools or executors (classifiers, rerankers, judges).' },
    { front: 'What is the most common production defect in collaborative orchestrations?', back: 'Missing termination conditions or round limits, leading to runaway loops and token spend.' },
  ],
  quiz: [
    {
      question:
        'A support bot must route a customer to a billing, shipping or returns specialist, and the specialist should take over the whole conversation including prior context, returning to triage only when the issue is outside its scope. Which pattern fits?',
      options: ['Sequential pipeline', 'Concurrent fan-out', 'Peer-to-peer handoff', 'Agents-as-tools from a coordinator'],
      correct: [2],
      explanation:
        'Handoff transfers ownership and full context between agents. Sequential has a fixed order, concurrent runs all agents on the same input, and agents-as-tools keeps the coordinator in charge and hides context from specialists.',
    },
    {
      question:
        'Three independent analysts must each assess a proposal from their own perspective, and their outputs must be combined into one brief. Which TWO Agent Framework features implement this directly? (Select two)',
      options: [
        'ConcurrentBuilder with the analysts as participants.',
        'A custom aggregator (for example a summariser agent) on the concurrent workflow.',
        'HandoffBuilder with autonomous mode.',
        'A termination condition that stops after one message.',
      ],
      correct: [0, 1],
      explanation:
        'Concurrent orchestration fans out the same input and a custom aggregator merges results. Handoff is for sequential ownership transfer, and a one-message termination is unrelated.',
    },
    {
      question:
        'A planning task has no known solution path; a manager must break it down, delegate to a researcher and a coder, track progress and re-plan when stuck, with bounded rounds. Which builder should you use?',
      options: ['SequentialBuilder', 'GroupChatBuilder with round-robin selection', 'MagenticBuilder with max_round_count and max_stall_count', 'ConcurrentBuilder'],
      correct: [2],
      explanation:
        'Magentic is designed for open-ended tasks with a planning manager and explicit limits. Round-robin group chat lacks planning, sequential assumes a known order, and concurrent lacks coordination.',
    },
    {
      question:
        'Your team has LangGraph expertise and several prompt agents already defined in Foundry. You want LangGraph to own routing while Foundry keeps managing agent definitions, conversations and traces. What should you use?',
      options: [
        'Re-implement the prompt agents as LangGraph nodes with raw model calls.',
        'AgentServiceFactory.get_agent_node to wrap each Foundry agent as a LangGraph node.',
        'Semantic Kernel planners.',
        'Export the agents to Copilot Studio.',
      ],
      correct: [1],
      explanation:
        'AgentServiceFactory creates LangGraph-compatible nodes backed by Foundry Agent Service. Re-implementation discards central management, Semantic Kernel is a different framework, and Copilot Studio is unrelated here.',
    },
    {
      question:
        'An orchestrator should classify intent before invoking any LLM to save tokens, using a small open-weight classifier the team fine-tuned. Which integration is MOST appropriate?',
      options: [
        'Run the classifier with the transformers library inside the hosted agent, wrapped as a tool or workflow executor, loading the model at startup.',
        'Ask the frontier LLM to classify intent first.',
        'Store the classifier weights in a Foundry memory store.',
        'Replace the orchestrator with the classifier.',
      ],
      correct: [0],
      explanation:
        'Local Transformers inference as an executor or tool integrates cleanly and avoids LLM cost for a mechanical step. Using the LLM defeats the purpose, memory stores hold memories not weights, and a classifier cannot orchestrate.',
    },
    {
      question: 'A group chat between a writer and reviewer occasionally runs for hundreds of turns. Which change is REQUIRED regardless of other improvements?',
      options: [
        'Switch the reviewer to a larger model.',
        'Add an explicit termination condition or maximum iteration count.',
        'Remove the reviewer agent.',
        'Enable streaming output.',
      ],
      correct: [1],
      explanation:
        'Bounded loops are mandatory; a termination condition or round limit prevents runaway runs. Model size, removing review or streaming do not bound execution.',
    },
  ],
  statements: [
    { text: 'In Agent Framework, handoff orchestration is implemented as a mesh where agents transfer control directly without a central orchestrator.', isTrue: true, explanation: 'This distinguishes it from group chat\'s star topology.' },
    { text: 'In the agents-as-tools pattern, the inner agent takes over ownership of the whole task and conversation.', isTrue: false, explanation: 'The outer agent retains responsibility and sees only the inner agent\'s final response; that is handoff\'s behaviour.' },
    { text: 'Microsoft Agent Framework is the successor to both Semantic Kernel and AutoGen.', isTrue: true, explanation: 'It combines AutoGen\'s multi-agent abstractions with Semantic Kernel\'s enterprise features.' },
    { text: 'Magentic orchestration uses the same star architecture as group chat but adds a planning manager with round, stall and reset limits.', isTrue: true, explanation: 'Use group chat when simple coordination suffices.' },
    { text: 'LangGraph agents cannot be hosted as Foundry hosted agents.', isTrue: false, explanation: 'langchain-azure-ai[hosting] exposes a compiled graph through the Responses or Invocations protocol for hosted agents.' },
    { text: 'Hugging Face models deployed from the Foundry catalog are tested and certified by Microsoft for safety.', isTrue: false, explanation: 'They are non-Microsoft products; you must perform your own safety evaluation and licence review.' },
    { text: 'Agent Framework workflow checkpoints are created at superstep boundaries and can be stored in Azure Cosmos DB for distributed production use.', isTrue: true, explanation: 'CosmosCheckpointStorage is the production-grade provider.' },
  ],
  resources: [
    { label: 'Agent Framework workflow orchestrations overview', url: 'https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/' },
    { label: 'Agent Framework: agents as tools', url: 'https://learn.microsoft.com/en-us/agent-framework/journey/agents-as-tools' },
    { label: 'Use Foundry Agent Service with LangGraph', url: 'https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/langchain-agents' },
    { label: 'Hugging Face models in Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/hugging-face-models' },
  ],
};

import type { Concept } from '../../types';

export const memoryAndContextManagement: Concept = {
  id: 'memory-and-context-management',
  title: 'Memory Tiers, Context Management and Context-Window Failure Modes',
  summary:
    'Designing short-term and long-term memory for single agents and teams of agents: session state, shared team state and long-term semantic memory, context accumulation, retrieval, injection and compaction, tenant isolation and lifecycle policies, and how to diagnose sliding-window amnesia, summary drift, vector-only recall and entity-continuity failures.',
  certs: ['ai-500'],
  domains: ['ai-500-1', 'ai-500-2', 'ai-500-3'],
  outcomes: ['ai-500-1-1-7', 'ai-500-1-2-3', 'ai-500-2-2-1', 'ai-500-2-2-2', 'ai-500-3-2-2'],
  tags: ['memory', 'context-window', 'compaction', 'foundry-memory', 'cosmos-db', 'agent-framework', 'state'],
  difficulty: 'advanced',
  diagram: 'context-window',
  sections: [
    {
      heading: 'Three tiers of state, three different stores',
      body: `The exam's phrase "multi-tier state persistence" maps to three tiers with different lifetimes, owners and isolation rules:

| Tier | What it holds | Lifetime | Typical component |
|---|---|---|---|
| **Session (short-term)** | The current conversation: messages, tool calls and results, in-flight workflow state | One conversation or run | Foundry conversations (service-managed), Agent Framework session state, hosted-agent session filesystem, workflow checkpoints |
| **Shared team state** | Facts several agents in one run need: the plan, intermediate artifacts, decisions | One task or workflow run | Agent Framework workflow state (shared scope), Foundry durable state store, Cosmos DB documents keyed by run id |
| **Long-term semantic memory** | Distilled knowledge that outlives sessions: user preferences, prior resolutions, procedures | Days to years, with TTL | Foundry Memory (preview) memory stores, Mem0, vector-backed chat-history memory providers, your own database |

Short-term memory is normally managed by the orchestration layer (every call to the model includes the relevant history). Long-term memory needs an *extraction, consolidation and retrieval* pipeline: Foundry Memory extracts user-profile, chat-summary and procedural memories from conversations, merges duplicates and resolves conflicts with an LLM, and retrieves them per turn. Agent Framework exposes memory as **context providers**: components that run before each invocation to inject context and after it to persist what was learned (\`InMemoryHistoryProvider\`, \`FileMemoryProvider\`, \`ChatHistoryMemoryProvider\` over a vector store, Mem0, Redis, Cosmos DB).

Design question to ask for every piece of state: *who owns it, how long must it live, and which tenant or user may read it?*`,
    },
    {
      heading: 'Isolation, lifecycle and compliance',
      body: `Memory is where multi-tenant systems leak. Build isolation into the key, not into application logic you hope every caller remembers:

- **Scope keys.** Foundry memory stores partition by a \`scope\` value; attach the memory search tool with \`scope="{{$userId}}"\` so each user's memories are isolated automatically. Foundry's durable state store supports per-user isolation derived from the platform-verified caller (\`x-agent-foundry-call-id\`), and the docs warn never to encode an end-user identifier in a store name you build yourself. Agent Framework providers separate a *storage scope* from a *search scope* (store per session, search per user), and Mem0 requires both \`user_id\` and \`search_user_id\`.
- **Session isolation.** Hosted agents isolate conversations, sessions and stored data per Microsoft Entra caller by default; a trusted backend can pass \`x-ms-user-identity\` for its own users only if it holds the \`UserIdentityImpersonation\` data action.
- **Lifecycle.** Set a default TTL on memory stores, honour explicit "forget" commands (direct remember-or-forget), expire state-store items (default 30-day idle window, renewed by writes), and delete conversations when they end. Sessions on hosted agents persist for up to 30 days.
- **Compliance.** Memory often contains personal data: minimise what you extract, redact before persisting, protect sensitive trace tables, and document retention. Purview middleware in Agent Framework can apply DLP to prompts and responses before they are stored.
- **Portability.** Caller-managed history (you hold the messages) lets a router switch models or providers mid-conversation; service-managed history (an opaque conversation id) ties you to the originating service. Choose deliberately.`,
    },
    {
      heading: 'Context management: accumulate, retrieve, inject, compact',
      body: `Within a run, context management is a loop of four operations:

1. **Accumulate**: append user turns, assistant text and tool-call groups. Tool calls and their results are atomic; removing one without the other breaks the API contract.
2. **Retrieve**: pull only what the next step needs: relevant memories, retrieved documents, the specific prior decision. Retrieval beats dumping everything in.
3. **Inject**: place retrieved context deliberately (system prompt for stable facts, a "## Memories" or "## Additional Context" block for per-turn facts) and keep the system message developer-controlled; untrusted text never becomes a system message.
4. **Compact**: when history grows, drop or summarise old groups. Agent Framework's experimental compaction offers \`SlidingWindowStrategy(keep_last_groups=N)\` and \`SummarizationStrategy\` (a separate, usually smaller model summarises old groups into a summary group), with triggers such as tokens, messages or turns exceeded and a target that says when to stop. Compaction applies only to agents that manage history in memory; Foundry conversations and the Responses API with \`store=True\` manage context server-side.

Between agents, control how much flows: Agent Framework's \`SequentialBuilder(chain_only_agent_responses=True)\` passes only the previous agent's response rather than the whole conversation, agents-as-tools pass only the tool arguments, and sub-workflows isolate state. Handoff passes the full conversation because the receiving agent takes ownership. Over-sharing context between agents is a leading cause of token bloat and of one agent being steered by another's stray instruction.`,
    },
    {
      heading: 'Diagnosing context-window failure modes',
      body: `When a long-running agent "forgets", the symptom tells you which mechanism failed:

- **Sliding-window amnesia**: the agent loses a constraint stated early ("budget is $20k") after many turns. A fixed window or message-count reducer evicted it. Fix: pin durable constraints into shared state or the system prompt, summarise instead of truncating, or store them as long-term memory retrieved each turn.
- **Summary drift**: after repeated summarisation, details mutate (dates, amounts, names). Each summary is lossy and the next summary compounds the error. Fix: summarise only once per segment and keep the original groups retrievable, use a prompt such as "preserve decisions, numbers and names exactly", keep structured facts in state rather than prose, and evaluate summaries for faithfulness.
- **Vector-only recall**: the agent recalls semantically similar but wrong items (another customer's similar ticket) or misses an exact identifier. Pure embedding search is fuzzy. Fix: hybrid retrieval (keyword plus vector, with filters on user or tenant scope), metadata filters, and exact-match lookups for IDs; Foundry memory consolidates and scopes memories for this reason.
- **Entity-continuity issues**: pronouns and references ("send it to him") break after compaction or between agents because the entity table lived only in removed messages. Fix: maintain an explicit entities or working-set block in state, pass identifiers rather than descriptions between agents, and re-inject the entity list after compaction.

Trace Replay in Foundry and token-level span filters help you see where context was dropped: look for a summary span followed by a wrong answer, or a retrieval span returning unrelated hits.`,
    },
  ],
  examples: [
    {
      title: 'Choosing stores for a customer-care agent team',
      description:
        'A care team runs an intake agent, a billing agent and a resolution agent. Design: the Foundry conversation holds the session; a Cosmos DB document keyed by case id holds shared team state (plan, verified identity, actions taken); a Foundry memory store scoped by {{$userId}} holds long-term preferences (contact channel, prior issues) with a 365-day TTL. Billing data is never written to memory; it is re-fetched from the system of record with the user\'s delegated identity.',
      takeaway: 'Each tier gets its own store, key and TTL; sensitive data is retrieved on demand rather than memorised.',
    },
    {
      title: 'Per-user long-term memory with Agent Framework context providers',
      description:
        'A travel assistant stores memories per session but searches across all of a user\'s sessions, so a preference learned last month is recalled today while another user\'s data is never searched.',
      language: 'python',
      code: `from agent_framework import Agent, InMemoryHistoryProvider
from agent_framework.foundry import FoundryChatClient
from agent_framework_mem0 import Mem0ContextProvider   # pip install agent-framework-mem0 --pre

def build_agent(user_id: str) -> Agent:
    return Agent(
        client=FoundryChatClient(),
        name="TravelAssistant",
        instructions="Help the user plan trips. Use remembered preferences.",
        context_providers=[
            InMemoryHistoryProvider("history", load_messages=True),   # short-term, per session
            Mem0ContextProvider(                                       # long-term, per user
                source_id="mem0",
                user_id=user_id,          # storage scope
                search_user_id=user_id,   # retrieval scope must be set explicitly
            ),
        ],
    )`,
      takeaway: 'Short-term and long-term memory are separate providers; retrieval scope must be set deliberately so memories are found but never cross users.',
    },
    {
      title: 'Compaction that summarised away the budget (a realistic mistake)',
      description:
        'A procurement agent used a message-count reducer keeping the last 20 messages. After a long negotiation it proposed a vendor at $45k although the user set a $20k ceiling in turn 2 (sliding-window amnesia). The team switched to SummarizationStrategy and the ceiling survived, but after several compactions the summary said "$25k" (summary drift). The durable fix was to write hard constraints to workflow state when they are stated and re-inject them every turn, keeping summarisation for narrative history only.',
      language: 'python',
      code: `from agent_framework import SlidingWindowStrategy, SummarizationStrategy

# Narrative history: summarise old groups with a cheaper model, keep recent groups intact.
summarize_old = SummarizationStrategy(
    client=summarizer_client,            # separate, smaller model
    target_count=8,                      # keep roughly this many recent groups
    summarization_prompt=(
        "Summarize prior turns. Preserve decisions, amounts, dates and names exactly."
    ),
)
keep_recent = SlidingWindowStrategy(keep_last_groups=20)

# Hard constraints never go through summarisation; they live in state.
constraints = {"budget_ceiling_usd": 20000, "preferred_region": "westeurope"}
system_suffix = "Constraints (authoritative): " + str(constraints)`,
      takeaway: 'Truncation causes amnesia, repeated summarisation causes drift; keep authoritative facts in structured state and re-inject them.',
    },
    {
      title: 'Vector-only recall returning the wrong customer',
      description:
        'A support agent\'s memory search returned another customer\'s "printer offline" resolution because the embeddings were similar and the search scope was the whole store. The fix was to scope the memory store per user, add a tenant filter to the vector query, and perform an exact lookup by ticket id instead of semantic search when an identifier is present.',
      takeaway: 'Semantic similarity is not identity; scope and filter retrieval, and use exact lookups for identifiers.',
    },
  ],
  keyPoints: [
    'Three state tiers: session (conversation and run state), shared team state (plan and artifacts for one run) and long-term semantic memory (preferences, procedures) each need their own store, key and TTL.',
    'Foundry Memory (preview) extracts, consolidates and retrieves user-profile, chat-summary and procedural memories; isolate users with the scope parameter such as {{$userId}}.',
    'Agent Framework context providers run before and after each invocation to inject and persist memory; storage scope and search scope are configured separately.',
    'Context management is accumulate, retrieve, inject, compact; tool-call groups are atomic and system messages stay developer-controlled.',
    'Compaction (SlidingWindowStrategy, SummarizationStrategy) applies only to caller-managed history; Foundry conversations and store=True Responses manage context server-side.',
    'Limit context flow between agents (chain_only_agent_responses, agents-as-tools arguments, sub-workflow isolation) to cut tokens and cross-agent steering.',
    'Sliding-window amnesia: fixed windows evict early constraints. Summary drift: repeated lossy summaries mutate facts. Vector-only recall: similar is not identical. Entity continuity: references break when the entity table is dropped.',
    'Keep authoritative constraints and entity lists in structured state and re-inject them every turn; use hybrid or filtered retrieval and exact lookups for identifiers.',
  ],
  flashcards: [
    { front: 'Name the three tiers of multi-agent state persistence.', back: 'Session (short-term conversation and run state), shared team state (per-task artifacts and plan), long-term semantic memory (preferences, procedures across sessions).' },
    { front: 'Which three memory types does Foundry Memory extract?', back: 'User profile memory, chat summary memory and procedural memory.' },
    { front: 'How do you isolate Foundry memories per user when attaching the memory search tool?', back: 'Set the tool\'s scope to {{$userId}} so each user gets an isolated partition in the memory store.' },
    { front: 'What is a context provider in Agent Framework?', back: 'A component that runs around each invocation to add context before execution (retrieval, memories) and process or persist data after execution.' },
    { front: 'When does compaction have no effect?', back: 'For service-managed history, such as Foundry agents or the Responses API with store enabled, because the service manages the context.' },
    { front: 'What is summary drift?', back: 'Progressive mutation of facts (numbers, dates, names) caused by repeated lossy summarisation of conversation history.' },
    { front: 'What is sliding-window amnesia and its fix?', back: 'Loss of early constraints when a fixed window evicts them; fix by persisting constraints in structured state or long-term memory and re-injecting them.' },
    { front: 'Why does vector-only recall fail for identifiers?', back: 'Embedding similarity is fuzzy; exact IDs and tenant boundaries need keyword or exact-match lookups and filters (hybrid retrieval).' },
    { front: 'How does SequentialBuilder reduce context passed between agents?', back: 'chain_only_agent_responses=True passes only the previous agent\'s response messages instead of the full conversation.' },
    { front: 'What is the default idle lifetime of items in the Foundry durable state store?', back: '30 days, renewed by writes (not reads); configurable, including never expiring.' },
    { front: 'Why should you not encode an end-user id in a Foundry state-store name?', back: 'Store names appear in logs and are not verified identities; use the store\'s user-isolation option, which derives the partition from the platform-verified caller.' },
  ],
  quiz: [
    {
      question:
        'A procurement agent is told in turn 2 that the budget ceiling is $20,000. After 40 turns it recommends a $45,000 option. The team uses a reducer that keeps the last 20 messages. Which failure mode is this and what is the BEST fix?',
      options: [
        'Vector-only recall; switch to a larger embedding model.',
        'Sliding-window amnesia; persist hard constraints in workflow state or long-term memory and re-inject them each turn.',
        'Summary drift; increase the summary length.',
        'Entity continuity; replace pronouns with names in the prompt.',
      ],
      correct: [1],
      explanation:
        'A fixed message window evicted the early constraint. Structured state re-injected every turn survives compaction. The other options describe different failure modes.',
    },
    {
      question:
        'A multi-tenant support agent must remember each customer\'s preferences across sessions, and compliance requires that memories expire after a year and that explicit "forget that" requests take effect immediately. Which design satisfies this with the LEAST custom code?',
      options: [
        'Store preferences in the agent\'s system prompt per deployment.',
        'Use a Foundry memory store with a default TTL, attach the memory search tool with scope set to {{$userId}}, and rely on direct remember-or-forget commands.',
        'Keep all conversation transcripts in a shared blob container searched by embeddings.',
        'Append every preference to the conversation history and never compact.',
      ],
      correct: [1],
      explanation:
        'Foundry Memory provides scoped partitions, store-level TTL and immediate remember-or-forget behaviour. System prompts are not per user, a shared embedding store lacks isolation and TTL, and uncompacted history breaks context limits.',
    },
    {
      question: 'Which TWO practices reduce the risk that one agent in a sequential pipeline is steered by irrelevant content from earlier turns? (Select two)',
      options: [
        'Enable chain_only_agent_responses so each agent receives only the previous agent\'s response.',
        'Give every agent the full conversation and all tool results for maximum context.',
        'Pass identifiers and structured outputs between agents rather than raw transcripts.',
        'Increase every agent\'s context window by choosing the largest available model.',
      ],
      correct: [0, 2],
      explanation:
        'Limiting what flows between agents (response-only chaining, structured handoffs) cuts tokens and cross-agent steering. Passing everything or buying a bigger context window increases exposure rather than reducing it.',
    },
    {
      question:
        'After several summarisation passes, an agent\'s summary states a contract renewal date of 15 March although the user said 5 March. What is the MOST effective remediation?',
      options: [
        'Summarise more frequently so each summary covers fewer messages.',
        'Store dates, amounts and names as structured facts in state when stated, instruct the summariser to preserve them exactly, and evaluate summaries for faithfulness.',
        'Switch from summarisation to a sliding window of the last 10 messages.',
        'Disable tracing to reduce overhead.',
      ],
      correct: [1],
      explanation:
        'Summary drift comes from compounding lossy summaries; structured facts and faithfulness evaluation address the root cause. More frequent summarisation compounds faster, a sliding window causes amnesia, and tracing is unrelated.',
    },
    {
      question:
        'A hosted agent built with LangGraph needs its graph checkpoints to survive container restarts and idle eviction, with each end user\'s data isolated without the agent code passing user ids. Which Foundry component fits?',
      options: [
        'The agent\'s local $HOME filesystem.',
        'The durable state store created with user isolation enabled.',
        'A Foundry memory store with user-profile memory.',
        'Application Insights custom events.',
      ],
      correct: [1],
      explanation:
        'The durable state store persists JSON items across restarts and partitions per end user from the platform-verified caller. $HOME is session-scoped, memory stores hold extracted semantic memories rather than checkpoints, and Application Insights is telemetry.',
    },
    {
      question: 'Why does configuring an Agent Framework compaction strategy have no effect on a Foundry prompt agent invoked through a conversation?',
      options: [
        'Compaction requires .NET.',
        'Foundry manages conversation context server-side, so the client never holds the in-memory history that compaction operates on.',
        'Prompt agents have unlimited context windows.',
        'Compaction only works with OpenAI models.',
      ],
      correct: [1],
      explanation:
        'Compaction applies to agents that manage their own in-memory message list; service-managed conversations handle context on the server.',
    },
  ],
  statements: [
    { text: 'Foundry Memory is designed for long-term memory and extracts user profile, chat summary and procedural memories from conversations.', isTrue: true, explanation: 'Short-term context is handled by the orchestration or conversation; Foundry Memory consolidates durable knowledge across sessions.' },
    { text: 'In Agent Framework, a tool-call message and its tool-result messages can be compacted independently of each other.', isTrue: false, explanation: 'They form an atomic message group; removing one without the other causes API errors.' },
    { text: 'Service-managed conversation history makes it easier to switch inference providers mid-conversation than caller-managed history.', isTrue: false, explanation: 'Caller-managed history can be replayed to another provider; service-managed history is an opaque id tied to the originating service.' },
    { text: 'Hybrid retrieval with tenant and user filters mitigates vector-only recall problems.', isTrue: true, explanation: 'Keyword matching, metadata filters and exact lookups complement fuzzy embedding similarity.' },
    { text: 'Agent Framework context providers can use different scopes for storing and for searching memories.', isTrue: true, explanation: 'For example, store per session but search across all sessions of a user.' },
    { text: 'Hosted-agent sessions in Foundry are deleted as soon as the container is deprovisioned after the idle timeout.', isTrue: false, explanation: 'State is saved and the session can resume; sessions persist for up to 30 days.' },
    { text: 'Repeated summarisation of conversation history can introduce factual errors that compound over time.', isTrue: true, explanation: 'This is summary drift; keep authoritative facts in structured state.' },
  ],
  resources: [
    { label: 'Memory in Foundry Agent Service (preview)', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory' },
    { label: 'Agent Framework: context providers', url: 'https://learn.microsoft.com/en-us/agent-framework/concepts/agents/conversations/context-providers' },
    { label: 'Agent Framework: compaction', url: 'https://learn.microsoft.com/en-us/agent-framework/concepts/agents/conversations/compaction' },
    { label: 'Durable state store for Foundry hosted agents', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-state-store' },
  ],
};

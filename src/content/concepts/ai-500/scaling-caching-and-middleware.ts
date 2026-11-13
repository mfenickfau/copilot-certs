import type { Concept } from '../../types';

export const scalingCachingAndMiddleware: Concept = {
  id: 'scaling-caching-and-middleware',
  title: 'Scaling, Concurrency, Caching and Middleware for Multi-Agent Systems',
  summary:
    'Making a multi-agent solution fast and affordable at scale: controlling agent spawning, batching and concurrent execution, optimising task duration with parallelism inside rate limits (TPM, PTU, 429 handling), layering prompt caching, semantic caching and response caching, and building reusable middleware for logging, authorization and exception handling across every agent.',
  certs: ['ai-500'],
  domains: ['ai-500-2', 'ai-500-3'],
  outcomes: ['ai-500-2-4-3', 'ai-500-2-4-4', 'ai-500-2-4-8', 'ai-500-3-2-1'],
  tags: ['scaling', 'concurrency', 'rate-limits', 'prompt-caching', 'semantic-caching', 'api-management', 'middleware', 'agent-framework', 'latency'],
  difficulty: 'advanced',
  sections: [
    {
      heading: 'Parallelism, rate limits and task duration',
      body: `Wall-clock time in an agent task is dominated by sequential model calls, so the first optimisation is to find independent work and run it concurrently: \`ConcurrentBuilder\` fan-out, the functional workflow's \`asyncio.gather\`, parallel tool calls in one turn, agentic retrieval's parallel subqueries, and the Responses API's multi-agent orchestration (\`multi_agent={"enabled": True, "max_concurrent_subagents": N}\`) which lets a root agent spawn subagents in parallel. Parallelism pays only when subtasks are independent and bounded; chains where each step depends on the previous, or steps that contend over shared mutable state, do not benefit, and extra subagents increase total tokens.

Concurrency then meets **rate limits**. Standard deployments admit requests by tokens-per-minute (TPM) and requests-per-minute quota per subscription, region and model; exceeding them returns **429** with a \`Retry-After\` header. Provisioned throughput (PTU) gives reserved capacity where latency depends on workload shape and cache hit rate. Design levers:

- Estimate system-level throughput from historical *Processed Prompt Tokens* and *Generated Completion Tokens* metrics or per-request \`usage\`, then size TPM quota or PTUs; keep input short because prompt size drives latency as much as output.
- Use a **semaphore or worker pool** so spawned subagents never exceed the deployment's concurrency; back off with jitter on 429, honour \`Retry-After\`, and fail over between deployments or regions through an API Management AI gateway with load balancing and spillover from PTU to pay-as-you-go.
- Prefer streaming for perceived latency, stream-friendly guardrail modes where acceptable, and small models or model router for mechanical steps.
- Request quota increases or use the Foundry shared quota pool only for testing; production needs dedicated quota.

Measure task duration per span in traces (Trace Replay's duration waterfall shows the critical path), and optimise the longest sequential chain first.`,
    },
    {
      heading: 'Controlling spawning, batching and concurrent execution',
      body: `Uncontrolled spawning is how a multi-agent system turns a single request into thousands of model calls. Put hard limits at three levels:

1. **Orchestration limits**: Magentic \`max_round_count\`, \`max_stall_count\`, \`max_reset_count\`; group-chat and handoff termination conditions and turn limits; \`AgentLoopMiddleware(max_iterations=N)\` or \`LoopAgent\` caps for self-refinement; \`max_concurrent_subagents\` in Responses multi-agent orchestration. Every recursion (an agent that can spawn agents) needs a depth limit and a per-request budget of tokens or calls, enforced in middleware or workflow state.
2. **Runtime limits**: hosted agents run one sandbox per session and scale sessions independently; set CPU and memory per sandbox, idle timeout, and use background responses with resilience for long work so clients poll instead of holding connections. Container Apps and Functions scale on queue length or HTTP concurrency; Durable Task orchestrations fan out activities with bounded parallelism and checkpoint between them.
3. **Batching**: group similar independent items (classify 50 tickets in one prompt with a strict array schema, or embed documents in batches) to cut per-call overhead and improve cache reuse; offline evaluation and data-generation jobs run as batch rather than interactive calls. Watch token limits per request and prefer idempotent batches so retries are safe.

Design concurrency with **isolation**: each spawned subagent gets its own session or conversation, scoped identity and tool allowlist; shared state goes through workflow state or a durable store with optimistic concurrency, never through shared mutable Python objects. Track spawn counts and depth as span attributes so traces and alerts expose runaway fan-out early.`,
    },
    {
      heading: 'Three caches, three different hit conditions',
      body: `Caching lowers both latency and cost, but each layer answers a different question:

| Cache | Hit when | Where | Notes |
|---|---|---|---|
| **Prompt caching** | The *prefix* of the prompt is identical to a recent request on the same deployment | Inside the model service (Azure OpenAI) | Cache reads are discounted on Standard deployments and do not consume PTU on most models; put static content first (system message, tool definitions, few-shot examples, stable context) and variable content last; prefixes must reach the minimum cacheable length (around 1,024 tokens); on GPT-5.6+ use \`prompt_cache_key\` for related requests and explicit breakpoints and TTL (30 minutes default, up to 12 hours), noting cache writes can be billed |
| **Semantic caching** | A new prompt is *similar in meaning* to a previously answered one | API Management AI gateway with Azure Managed Redis (RediSearch) and an embeddings deployment | \`azure-openai-semantic-cache-lookup\` / \`-store\` policies with a similarity threshold; great for FAQ-style traffic, dangerous for personalised or permission-scoped answers unless the cache key includes the user or tenant |
| **Response caching** | The *exact* request (or tool call with the same arguments) was seen before | Your application, API Management \`cache-lookup\`, or a tool-level cache | Ideal for deterministic tools (product lookup, policy text) with a TTL and explicit invalidation; the staleness notice belongs in the agent's instructions |

Multi-agent systems compound savings: every subagent shares the same cached instruction prefix, a toolbox's tool definitions can be stable across agents, and a research agent's retrieval results can be cached for the writer and reviewer. Never cache across security boundaries: include tenant and user scope in semantic and response cache keys, and skip caching for tool results that carry user-specific data. Measure hit rates (cached tokens in \`usage\`, gateway metrics) and token savings alongside quality, since an over-aggressive semantic threshold returns wrong answers to similar-looking questions.`,
    },
    {
      heading: 'Middleware for reusable cross-cutting capabilities',
      body: `Middleware is how one implementation of logging, authorization, rate limiting, retries, PII redaction or exception handling applies to every agent and tool. Agent Framework defines three interception points, each a chain where every component calls the next:

- **Agent (run) middleware** sees the whole run: inspect or modify input messages, enforce per-tenant policies, add correlation ids, measure duration, and **terminate** early (set \`context.result\` and raise \`MiddlewareTermination\`, or skip \`call_next()\`) for blocked content or exhausted budgets.
- **Function (tool) middleware** wraps each tool call: authorization checks against the caller's claims before execution, argument validation, retries, result validation, redaction and exception translation into model-readable errors.
- **Chat-client middleware** intercepts the inference request itself: inject headers, route to another model, cache, or record token usage.

Middleware can be registered at agent scope (every run) or run scope (one invocation), shares state through the context, and composes with built-in pieces such as \`ToolApprovalMiddleware\`, \`AgentLoopMiddleware\`, Purview DLP middleware (\`PurviewPolicyMiddleware\`) and FIDES information-flow enforcement. Package your organisation's middleware as a library every team imports; that is the "reusable capabilities across the solution" the exam describes.

Outside the process, the equivalent layers are **Foundry guardrails** (content controls at four intervention points), **API Management policies** (authentication, token limits, caching, correlation IDs, header hygiene) and **hosted-agent protocol adapters** which already handle health checks and telemetry. Choose the layer by scope: in-process middleware for logic that needs agent context, gateway policies for fleet-wide traffic rules.`,
    },
  ],
  examples: [
    {
      title: 'Bounded fan-out with a semaphore and backoff',
      description:
        'A document-processing orchestrator spawns one summariser subagent per document. A semaphore caps concurrency below the deployment\'s rate limit, 429 responses back off with jitter honouring Retry-After, and the whole batch completes far faster than a sequential loop without tripping throttling.',
      language: 'python',
      code: `import asyncio, random
from agent_framework import Agent

MAX_PARALLEL = 8                       # sized from TPM quota and average tokens per call
sem = asyncio.Semaphore(MAX_PARALLEL)

async def run_bounded(agent: Agent, text: str) -> str:
    async with sem:
        for attempt in range(5):
            try:
                return (await agent.run(f"Summarise:\\n{text}")).text
            except Exception as exc:                       # SDK raises on 429 / 5xx
                retry_after = getattr(exc, "retry_after", None) or (2 ** attempt)
                await asyncio.sleep(retry_after + random.uniform(0, 0.5))
        raise RuntimeError("summariser exhausted retries")

async def summarise_all(agent: Agent, docs: list[str]) -> list[str]:
    return await asyncio.gather(*(run_bounded(agent, d) for d in docs))`,
      takeaway: 'Parallelise independent work, but cap concurrency to the deployment\'s limits and back off with jitter on 429.',
    },
    {
      title: 'Structuring prompts for prompt-cache hits across subagents',
      description:
        'All specialist agents share a long, static instruction block and tool definitions placed first, with the per-request context last. Related requests use the same prompt_cache_key so the cached prefix is reused, and the usage block confirms cached tokens.',
      language: 'python',
      code: `from openai import OpenAI

STATIC_PREFIX = open("specialist_instructions.md").read()   # > 1,024 tokens, identical every call

def ask(client: OpenAI, deployment: str, tenant: str, question: str, context: str):
    resp = client.responses.create(
        model=deployment,
        instructions=STATIC_PREFIX,                 # static first -> cacheable prefix
        input=[{"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {question}"}],
        prompt_cache_key=f"specialist-{tenant}",    # GPT-5.6+: groups related requests
    )
    cached = resp.usage.input_tokens_details.cached_tokens   # measure hit rate
    return resp.output_text, cached`,
      takeaway: 'Put stable content first and variable content last; group related requests with a cache key and measure cached tokens.',
    },
    {
      title: 'Semantic cache that leaked between tenants (a realistic mistake)',
      description:
        'An FAQ agent behind API Management used semantic caching with a 0.9 similarity threshold and a cache partition shared by all customers. A tenant asked "what is my renewal date?" and received another tenant\'s cached answer because the questions were semantically identical. The fix partitioned the cache by tenant id (vary-by header), excluded personalised intents from caching entirely, and lowered aggressiveness; hit rate fell slightly, correctness and compliance were restored.',
      takeaway: 'Semantic caching keys must include the security scope, and personalised or permission-bound answers should not be cached.',
    },
    {
      title: 'Reusable authorization and logging middleware',
      description:
        'A shared library provides function middleware that checks the caller\'s claims before any write tool runs and logs every tool call with correlation id and duration; every team adds it to their agents instead of re-implementing checks per tool.',
      language: 'python',
      code: `import time, logging
from collections.abc import Awaitable, Callable
from agent_framework import FunctionInvocationContext

WRITE_TOOLS = {"issue_refund", "update_record", "send_email"}
log = logging.getLogger("contoso.tools")

def authz_and_audit(get_claims: Callable[[], dict]):
    async def middleware(ctx: FunctionInvocationContext, call_next: Callable[[], Awaitable[None]]) -> None:
        claims = get_claims()                                   # from the request context
        if ctx.function.name in WRITE_TOOLS and "agent.write" not in claims.get("roles", []):
            ctx.result = {"error": "forbidden", "tool": ctx.function.name}   # deny, do not call
            log.warning("denied %s for %s", ctx.function.name, claims.get("sub"))
            return
        start = time.perf_counter()
        await call_next()
        log.info("tool=%s corr=%s ms=%.0f", ctx.function.name, claims.get("corr"),
                 (time.perf_counter() - start) * 1000)
    return middleware`,
      takeaway: 'One middleware library gives every agent consistent authorization, auditing and timing without per-tool code.',
    },
  ],
  keyPoints: [
    'Reduce task duration by running independent subtasks concurrently (ConcurrentBuilder, asyncio.gather, parallel tool calls, Responses multi-agent subagents) and by shortening the longest sequential chain found in traces.',
    'Rate limits are TPM/RPM quota per subscription, region and model; 429 with Retry-After means back off with jitter, cap concurrency with semaphores, and load-balance or spill over through an AI gateway; PTU gives reserved capacity.',
    'Bound spawning at orchestration (round, stall, iteration, max_concurrent_subagents, depth and token budgets), runtime (sandbox resources, idle timeout, queue-based scaling) and batching levels.',
    'Prompt caching hits on identical prompt prefixes: static content first, variable last, minimum prefix length, prompt_cache_key and breakpoints on newer models; cache reads are discounted.',
    'Semantic caching (API Management plus Redis and embeddings) serves similar questions; response and tool-result caching serves exact repeats; both need tenant and user scope in the key and TTL plus invalidation.',
    'Agent Framework middleware types: agent (run), function (tool) and chat-client; chains call next, can short-circuit with MiddlewareTermination, and compose with approval, loop, Purview and FIDES middleware.',
    'Package logging, authorization, retries, redaction and exception handling as a shared middleware library; use API Management policies and Foundry guardrails for fleet-wide traffic and content rules.',
  ],
  flashcards: [
    { front: 'What HTTP status indicates a TPM or RPM rate limit was exceeded, and how should an agent respond?', back: '429 Too Many Requests; honour Retry-After, back off with jitter, and cap concurrency.' },
    { front: 'Which Responses API option lets a root agent spawn parallel subagents with a cap?', back: 'multi_agent={"enabled": True, "max_concurrent_subagents": N} (preview, GPT-5.6 models).' },
    { front: 'Where should static content sit in a prompt to maximise prompt-cache hits?', back: 'At the beginning (system instructions, tool definitions, examples); variable content goes last. The prefix must meet the minimum cacheable length.' },
    { front: 'What does prompt_cache_key do?', back: 'On GPT-5.6 and later, groups related requests so they match the same cached prefix; spread high-volume traffic across keys.' },
    { front: 'Which Azure components implement semantic caching for LLM APIs?', back: 'Azure API Management semantic-cache lookup/store policies with Azure Managed Redis (RediSearch) and an embeddings deployment.' },
    { front: 'Why must semantic cache keys include tenant or user scope?', back: 'Semantically similar questions from different users would otherwise receive each other\'s cached, possibly personalised, answers.' },
    { front: 'Name the three Agent Framework middleware types.', back: 'Agent (run) middleware, function (tool-call) middleware, and chat-client middleware.' },
    { front: 'How does Python Agent Framework middleware stop a run early?', back: 'Set context.result and raise MiddlewareTermination, or return without calling call_next().' },
    { front: 'Which limits bound a Magentic orchestration?', back: 'max_round_count, max_stall_count and max_reset_count.' },
    { front: 'When does adding parallel subagents not reduce task duration?', back: 'When steps depend on each other, agents contend over shared mutable state, or one slow external operation dominates; it also increases token usage.' },
    { front: 'What is the difference between prompt caching and response caching?', back: 'Prompt caching reuses processed input-token computation for identical prefixes inside the model service; response caching returns a stored full answer for an exact repeated request or tool call.' },
  ],
  quiz: [
    {
      question:
        'A nightly job spawns one subagent per customer account (12,000 accounts) and frequently fails with 429 errors, then retries immediately, making it worse. Which combination fixes this MOST directly?',
      options: [
        'Switch to a larger model so each call does more work.',
        'Cap concurrency with a semaphore sized to the deployment\'s TPM, back off with jitter honouring Retry-After, and batch similar accounts per request.',
        'Disable retries entirely.',
        'Move the job to a Foundry prompt agent.',
      ],
      correct: [1],
      explanation:
        'Bounded concurrency, respectful backoff and batching address throttling at its cause. A larger model does not change quota behaviour, disabling retries drops work, and the agent type is irrelevant.',
    },
    {
      question:
        'Twenty specialist agents share a 3,000-token instruction block and identical tool definitions, but each request also includes a unique customer record. Costs are high. What should you do to benefit from prompt caching?',
      options: [
        'Place the customer record first so the model reads it early.',
        'Keep the shared instructions and tool definitions first and the customer record last, and use a shared prompt_cache_key for related requests.',
        'Shorten the instructions below 500 tokens so they fit in the cache.',
        'Enable semantic caching in API Management instead.',
      ],
      correct: [1],
      explanation:
        'Prompt caching matches identical prefixes; static-first ordering and a shared key maximise hits. Variable content first breaks the prefix, very short prefixes fall below the minimum cacheable length, and semantic caching solves a different problem.',
    },
    {
      question: 'Which TWO statements about semantic caching for an agent that answers account-specific questions are correct? (Select two)',
      options: [
        'The cache key or partition must include the tenant or user scope.',
        'Personalised answers should generally be excluded from semantic caching.',
        'A similarity threshold of 0.5 is recommended to maximise hit rate.',
        'Semantic caching is implemented inside the model deployment by Azure OpenAI.',
      ],
      correct: [0, 1],
      explanation:
        'Scope in the key and excluding personalised intents prevent leaks. Low thresholds return wrong answers, and semantic caching is an API Management gateway capability with Redis, not a model-service feature.',
    },
    {
      question:
        'Every team re-implements tool-call authorization and logging slightly differently, and an audit found two agents with no authorization at all. What is the BEST remedy?',
      options: [
        'Add authorization instructions to every agent\'s system prompt.',
        'Publish a shared Agent Framework function-middleware library that enforces authorization and audit logging, and require all agents to register it.',
        'Ask each team to review their tools quarterly.',
        'Turn off write tools for all agents.',
      ],
      correct: [1],
      explanation:
        'Middleware provides one reusable, enforceable implementation across agents and tools. Prompts are not security controls, reviews are periodic and manual, and disabling tools removes functionality.',
    },
    {
      question:
        'A research task currently runs six sequential model calls taking 90 seconds. Traces show four of the calls are independent lookups. What should you do FIRST to reduce task duration?',
      options: [
        'Run the four independent lookups concurrently (for example with ConcurrentBuilder or asyncio.gather) within the deployment\'s rate limits.',
        'Increase the model\'s max output tokens.',
        'Add a semantic cache.',
        'Remove tracing to reduce overhead.',
      ],
      correct: [0],
      explanation:
        'Parallelising independent steps shortens the critical path directly. Output limits add latency, semantic caching helps only on repeats, and tracing overhead is negligible compared with model calls.',
    },
    {
      question: 'An agent that can spawn sub-agents recursively occasionally produces thousands of calls from one request. Which control is essential?',
      options: [
        'A recursion depth limit and a per-request token or call budget enforced in middleware or workflow state.',
        'A larger TPM quota.',
        'Streaming responses.',
        'A longer idle timeout on the hosted agent.',
      ],
      correct: [0],
      explanation:
        'Spawning must be bounded explicitly. More quota just lets the runaway spend more, and streaming or idle timeouts do not limit fan-out.',
    },
  ],
  statements: [
    { text: 'Adding more parallel subagents always reduces end-to-end task duration.', isTrue: false, explanation: 'Dependent steps, shared mutable state and single slow external operations do not benefit, and tokens increase.' },
    { text: 'Prompt caching requires the reused content to appear at the beginning of the prompt.', isTrue: true, explanation: 'Caching matches identical prefixes; variable content should come last.' },
    { text: 'Semantic caching returns cached responses only for byte-identical prompts.', isTrue: false, explanation: 'Semantic caching matches prompts similar in meaning using embeddings; exact-match caching is response caching.' },
    { text: 'When a request exceeds a token-per-minute limit, the service returns HTTP 429 and may include a Retry-After header.', isTrue: true, explanation: 'Back off with jitter and cap concurrency accordingly.' },
    { text: 'Agent Framework function middleware can prevent a tool from executing by setting the result and not calling the next handler.', isTrue: true, explanation: 'This short-circuits the chain for authorization or validation failures.' },
    { text: 'Magentic orchestration has no built-in limits on rounds or stalls, so loops must be controlled only through instructions.', isTrue: false, explanation: 'MagenticBuilder exposes max_round_count, max_stall_count and max_reset_count.' },
    { text: 'Cache reads from prompt caching are billed at a discount on Standard deployments.', isTrue: true, explanation: 'Cached input tokens cost less; on newer models cache writes may incur charges, so structure prompts to favour reads.' },
  ],
  resources: [
    { label: 'Prompt caching in Azure OpenAI (Microsoft Foundry)', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/prompt-caching' },
    { label: 'Enable semantic caching for LLM APIs in Azure API Management', url: 'https://learn.microsoft.com/en-us/azure/api-management/azure-openai-enable-semantic-caching' },
    { label: 'Performance and latency (throughput vs latency, TPM, PTU)', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/latency' },
    { label: 'Agent Framework: agent middleware', url: 'https://learn.microsoft.com/en-us/agent-framework/concepts/agents/middleware/' },
  ],
};

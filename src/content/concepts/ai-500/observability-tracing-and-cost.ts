import type { Concept } from '../../types';

export const observabilityTracingAndCost: Concept = {
  id: 'observability-tracing-and-cost',
  title: 'Observability in Production: Tracing, Reliability Monitoring, Token Optimisation and Cost Management',
  summary:
    'Running multi-agent systems in production with Foundry observability: implementing tracing with tokens, prompts, correlation IDs and alerting, monitoring reliability (agent health, workflow failures, drift, regressions, remediation) and platform SLAs, optimising token usage with limits and loop controls, and governing cost through quotas, token limits, allocations and chargebacks.',
  certs: ['ai-500', 'ai-300'],
  domains: ['ai-500-3', 'ai-300-4'],
  outcomes: ['ai-500-3-3-1', 'ai-500-3-3-2', 'ai-500-3-3-3', 'ai-500-3-3-4', 'ai-500-3-3-5', 'ai-300-4-2-3', 'ai-300-4-2-4'],
  tags: ['tracing', 'application-insights', 'opentelemetry', 'monitoring', 'sla', 'tokens', 'cost', 'quota', 'chargeback', 'control-plane'],
  difficulty: 'advanced',
  sections: [
    {
      heading: 'Implementing tracing in Foundry',
      body: `Tracing in Foundry is OpenTelemetry stored in **Azure Monitor Application Insights**. Enabling it is a project-level act: connect an Application Insights resource (Build > Agents > Traces > Connect, or Project details > Connected resources). From then on **server-side traces** for prompt agents, hosted agents and workflows are captured automatically for 90 days with no code change; Agent Framework and Semantic Kernel agents emit traces natively, LangChain/LangGraph use the Microsoft OpenTelemetry distro, and the OpenAI Agents SDK uses OpenInference instrumentation. Add **client-side tracing** when you need spans around your own code: in Python, \`client.configure_azure_monitor()\` on a \`FoundryChatClient\` pulls the connection string from the project; in .NET set the \`Azure.Experimental.EnableGenAITracing\` switch and add the Azure Monitor exporter.

What a trace carries, per the GenAI semantic conventions: agent invocation and workflow spans, model call spans with **token usage** (input, output, cached), tool spans with arguments and results, latency, errors, and the **conversation and response ids** that let you jump from a complaint to the exact run. **Correlation IDs** are the glue: propagate W3C Trace Context between services, stamp your own correlation id as a span attribute (and as an \`X-Correlation-Id\` header at the API Management gateway), and ensure every agent in the chain reports into the same Application Insights or a shared Log Analytics workspace. Hosted agents can also export OTLP to a second backend.

**Prompts** are sensitive: content recording (\`gen_ai.input.messages\`, outputs, tool arguments) should be on in development and off or protected in production via the \`AppGenAIContent\` protected table and Privileged Monitoring Data Reader. Viewing traces requires Log Analytics Reader on the resource; trace ingestion from code needs Monitoring Metrics Publisher when using Entra authentication.

**Alerting** uses Azure Monitor alert rules over Application Insights data (failed runs, p95 latency, token spikes, evaluation scores from continuous evaluation, red-team findings) wired to action groups, and the agent Monitor tab exposes preview alert settings for latency, tokens, evaluation scores and red-team results.`,
    },
    {
      heading: 'Monitoring reliability, availability and SLA adherence',
      body: `Two layers of monitoring answer two questions: *is the platform up?* and *is the system doing its job?*

**Platform availability and performance.** Azure Monitor metrics and diagnostic logs for the Foundry resource (Request and Response logs, Azure OpenAI Request Usage, AllMetrics) give request counts by status code and latency percentiles (p50 to p99) via KQL; Service Health alerts announce platform incidents; the Microsoft Foundry **SLA** is published in the Online Services SLA document and preview features carry no SLA. Design for the SLA you need rather than the one you get: zone-redundant and backed-up BYO dependencies (Cosmos DB continuous backup, AI Search replicas, geo-replicated ACR), resource locks against deletion, duplicate projects in a second region with your own traffic routing, and documented recovery runbooks, because Foundry does not fail over automatically.

**Agent health and workflow reliability.** The per-agent **Monitor** dashboard tracks run success rate (investigate below roughly 95%), latency (above about 10 seconds suggests throttling, slow tools or network), token usage, evaluation scores and red-team results. Workflow failures surface as failed spans and workflow events; Magentic stalls and loop terminations appear in orchestration spans. Define service-level indicators such as run success rate, p95 time to first token, tool call success rate and task-completion score, and set SLOs with alert thresholds.

**Drift and quality regression.** Continuous evaluation scores sampled production traffic; scheduled evaluations rerun a fixed set; scheduled red teaming probes safety; **Insights** clusters recurring behaviour by category; **Foundry Control Plane** aggregates health, cost and compliance across the fleet, including external agents you register. Track model version changes and data refreshes as deployment events so regressions can be correlated.

**Remediation.** Alerts call action groups that run Logic Apps, Functions or runbooks: route traffic to the previous agent version, disable an endpoint, pin a model version, scale a dependency, or open an incident with the Trace Replay link attached. Decide the automated action when you define the alert.`,
    },
    {
      heading: 'Optimising token usage: limits, loop controls and tool calls',
      body: `Tokens are the unit of both cost and latency, and multi-agent systems multiply them. Work through the levers in order of impact:

1. **Right-size context.** Retrieve instead of dumping, compact history (sliding window or summarisation), pass only agent responses between sequential agents, and keep tool definitions small with tool search so hundreds of tools do not enter every prompt.
2. **Hard limits.** Set \`max_output_tokens\` and request-level \`max_tool_calls\`; cap iterations with \`AgentLoopMiddleware(max_iterations)\`, round and stall limits in Magentic, termination conditions in group chat and handoff, and a per-request token budget enforced in middleware that terminates the run when exceeded.
3. **Tool-call discipline.** Return concise structured results (not whole pages), cache deterministic tool results, use strict schemas so the model does not retry malformed calls, and prefer one well-described tool over several overlapping ones. Trace Replay's token filter (Low under 500, Medium 500-2k, High over 2k tokens per span) finds the hotspots quickly.
4. **Model matching and caching.** Mini models for mechanical steps, model router for mixed traffic, prompt caching for stable prefixes, semantic or response caching for repeats.
5. **Observe.** Token metrics per agent, per version and per tenant come from span attributes and the Monitor dashboard; Insights' Cost and tokens category flags verbose prompts or responses; alert on tokens per run above a threshold to catch loops early.

A useful rule from the docs: adding subagents increases token usage, so justify fan-out with measured latency or quality gains.`,
    },
    {
      heading: 'Cost monitoring: usage, quotas, allocations and chargebacks',
      body: `Foundry cost is mostly token consumption (pay-as-you-go per input and output token, discounted cached tokens, or PTU reserved capacity) plus the services around it: Application Insights ingestion and retention, AI Search, Cosmos DB, Storage, hosted-agent compute, evaluation and red-team runs (which consume quota and cost tokens), and fine-tuning training and hosting.

- **Usage visibility.** Cost Management (Cost Management Reader role) grouped by resource and meter, reconciled against the Azure pricing calculator estimate after a representative test workload; consistent tags on every resource so costs roll up by team, product and environment. Report latency means you compare trends, not minutes.
- **Quotas.** TPM and PTU quota is allocated per subscription, region and model under Manage > Quota (Cognitive Services Usages Reader to view, Contributor to edit); split a deployment's quota across projects, request increases for production, and use the shared quota pool only for temporary tests.
- **Allocation and enforcement.** Put model traffic behind an **AI Gateway** (API Management) so **Foundry Control Plane** can enforce per-project **tokens-per-minute limits** (429 when exceeded) and **total token quotas** per hour, day, week, month or year (403 when exhausted); the APIM \`llm-token-limit\` policy does the same per subscription key, IP or any counter key, and emits remaining-token headers. This prevents one team from monopolising capacity and gives predictable ceilings for regulated workloads.
- **Chargebacks.** Attribute tokens to consumers with per-project or per-app gateway keys, token metrics emitted by APIM, and span attributes (tenant, agent, version); export to Log Analytics or a data warehouse and join with meter costs for showback or chargeback reports. Budgets and cost alerts in Cost Management warn before overruns; Control Plane dashboards show cost trends and anomalies across the fleet.

Cost governance and observability share the same data: the span that explains a slow run also explains an expensive one.`,
    },
  ],
  examples: [
    {
      title: 'Client-side tracing with correlation id, token capture and alert-ready attributes',
      description:
        'An Agent Framework orchestrator configures Azure Monitor from the Foundry project, disables prompt content capture in production, and records tenant, agent version and correlation id as span attributes so dashboards, alerts and chargebacks can slice by them.',
      language: 'python',
      code: `import os
from opentelemetry import trace
from agent_framework import Agent
from agent_framework.foundry import FoundryChatClient
from agent_framework.observability import enable_instrumentation
from azure.identity.aio import DefaultAzureCredential

PROD = os.getenv("ENVIRONMENT") == "prod"

async def run(text: str, tenant: str, corr_id: str) -> str:
    async with DefaultAzureCredential() as cred:
        client = FoundryChatClient(credential=cred)
        await client.configure_azure_monitor()                    # App Insights from the project
        enable_instrumentation(enable_sensitive_data=not PROD)    # prompts only outside prod
        agent = Agent(client=client, name="Orchestrator", instructions="Coordinate specialists.")
        with trace.get_tracer("contoso").start_as_current_span("orchestrator.run") as span:
            span.set_attributes({"contoso.tenant": tenant, "contoso.correlation_id": corr_id,
                                 "contoso.agent_version": os.getenv("AGENT_VERSION", "dev")})
            result = await agent.run(text)
            span.set_attribute("contoso.output_chars", len(result.text))
            return result.text`,
      takeaway: 'Attributes on the parent span make traces filterable for alerting, drift analysis and per-tenant cost attribution.',
    },
    {
      title: 'KQL for an SLO dashboard and alert',
      description:
        'A Log Analytics query computes run success rate and p95 latency per agent version from GenAI spans, used both for the SLO dashboard and as the basis of an alert rule that fires when success drops below 95% or p95 exceeds 10 seconds.',
      language: 'text',
      code: `dependencies
| where timestamp > ago(1h)
| where name startswith "invoke_agent"
| extend agent = tostring(customDimensions["gen_ai.agent.name"]),
         version = tostring(customDimensions["contoso.agent_version"])
| summarize runs = count(),
            success_rate = round(100.0 * countif(success == true) / count(), 1),
            p95_ms = percentile(duration, 95)
    by agent, version, bin(timestamp, 5m)
| where success_rate < 95 or p95_ms > 10000`,
      takeaway: 'Define SLIs from span data, visualise them per version, and alert on SLO breaches.',
    },
    {
      title: 'The loop that cost a week of budget (a realistic mistake)',
      description:
        'A self-refining writer agent had no iteration cap and no per-run token budget; a tool outage made every iteration fail and retry, and 30 runs consumed a month\'s token budget overnight. No alert existed on tokens per run. Fixes: AgentLoopMiddleware with max_iterations=5, a middleware token budget that terminates the run, Control Plane TPM and daily token quotas on the project through the AI Gateway, and an Azure Monitor alert on tokens per run and on daily spend.',
      language: 'python',
      code: `from collections.abc import Awaitable, Callable
from agent_framework import (Agent, AgentContext, AgentMiddleware, AgentLoopMiddleware,
                             AgentResponse, Message, MiddlewareTermination)

class TokenBudget(AgentMiddleware):
    def __init__(self, max_tokens: int) -> None:
        self.max_tokens, self.used = max_tokens, 0
    async def process(self, context: AgentContext, call_next: Callable[[], Awaitable[None]]) -> None:
        await call_next()
        usage = getattr(context.result, "usage_details", None)
        self.used += (usage.total_token_count if usage else 0)
        if self.used > self.max_tokens:                      # stop further iterations
            context.result = AgentResponse(messages=[Message(role="assistant",
                contents=["Token budget exceeded; escalating to a human."])])
            raise MiddlewareTermination()

agent = Agent(client=client, name="Writer", instructions="Draft, then refine until DONE.",
              middleware=[AgentLoopMiddleware(lambda *, last_result, **_: "DONE" not in last_result.text,
                                              max_iterations=5),
                          TokenBudget(max_tokens=40_000)])`,
      takeaway: 'Bound loops and tokens in code, enforce quotas at the gateway, and alert on tokens per run before the bill does.',
    },
    {
      title: 'Allocating and charging back model capacity across teams',
      description:
        'Three product teams share one gpt deployment. The platform team routes all traffic through an AI Gateway, sets per-project TPM limits and monthly token quotas in Control Plane, tags every Foundry resource with cost-centre tags, and builds a monthly chargeback report joining APIM token metrics (per subscription key) with Cost Management meters. A team exceeding its quota gets 403 responses instead of starving the others.',
      takeaway: 'Gateway-enforced token limits plus consistent tags and per-consumer metrics turn shared capacity into fair, auditable allocations.',
    },
  ],
  keyPoints: [
    'Tracing = connect Application Insights to the project; server-side traces for prompt and hosted agents need no code; client-side tracing adds your spans via configure_azure_monitor or the Azure Monitor exporter.',
    'Traces carry token usage, latency, tool arguments and results, conversation and response ids; propagate W3C Trace Context and stamp correlation ids so all agents and the gateway share one trace.',
    'Protect prompt content in traces (AppGenAIContent protected table, Privileged Monitoring Data Reader); viewing needs Log Analytics Reader; Entra-based ingestion needs Monitoring Metrics Publisher.',
    'Monitor reliability with run success rate, latency, workflow failure spans, continuous and scheduled evaluations, scheduled red teaming, Insights and Control Plane; wire alerts to action groups for automated remediation such as rolling back a version.',
    'Platform availability: diagnostic logs and metrics (latency percentiles by status code), Service Health, the published Foundry SLA (none for previews), and your own HA/DR for BYO dependencies because Foundry has no automatic failover.',
    'Token optimisation: right-size context and tool definitions, cap output tokens, tool calls and iterations, enforce per-run token budgets in middleware, cache, match models, and use Trace Replay token filters to find hotspots.',
    'Cost governance: Cost Management views and tags, TPM/PTU quota per subscription-region-model, AI Gateway enforced TPM limits (429) and token quotas (403) per project, per-consumer metrics for chargeback, budgets and alerts.',
  ],
  flashcards: [
    { front: 'How is tracing enabled for Foundry agents?', back: 'Connect an Application Insights resource to the project; server-side traces for prompt and hosted agents are then captured automatically (90 days of out-of-the-box traces).' },
    { front: 'Which OpenTelemetry attributes in traces are considered sensitive content?', back: 'gen_ai.input.messages, gen_ai.output.messages, gen_ai.system_instructions, gen_ai.tool.definitions, gen_ai.tool.call.arguments, gen_ai.tool.call.result, gen_ai.evaluation.explanation.' },
    { front: 'Which roles are needed to view traces and to ingest them with Entra authentication?', back: 'Log Analytics Reader (plus Privileged Monitoring Data Reader for protected tables) to view; Monitoring Metrics Publisher on the Application Insights resource to ingest.' },
    { front: 'What thresholds does the Foundry agent dashboard suggest for investigation?', back: 'Run success rate below about 95% and latency above about 10 seconds warrant investigation.' },
    { front: 'What HTTP codes do Control Plane token limits return when exceeded?', back: '429 Too Many Requests for the tokens-per-minute limit and 403 Forbidden when the total token quota for the period is exhausted.' },
    { front: 'What prerequisite does Control Plane token-limit enforcement have?', back: 'An AI Gateway (Azure API Management) configured on the Foundry resource with the model deployment added to it.' },
    { front: 'Which roles are needed to view and edit model quota in Foundry?', back: 'Cognitive Services Usages Reader (subscription scope) to view; Cognitive Services Contributor plus Usages Reader to edit; Owner or Contributor to request increases.' },
    { front: 'Which Trace Replay token levels help find hotspots?', back: 'Low under 500 tokens, Medium 500-2k, High over 2k tokens per span.' },
    { front: 'Does Microsoft Foundry automatically fail over agents to another region?', back: 'No; you design multi-region deployments and recovery of BYO dependencies yourself.' },
    { front: 'Which Insights category flags verbose prompts and responses?', back: 'Cost and tokens (alongside Latency, Reliability errors, Tool call failures, Hallucinations, Context and memory, Output quality, Security and risk).' },
    { front: 'How can per-consumer token usage be attributed for chargeback?', back: 'Per-project or per-app gateway keys with APIM token metrics, tenant and agent attributes on spans, resource tags, joined with Cost Management meters.' },
  ],
  quiz: [
    {
      question:
        'A customer reports a wrong answer from yesterday. You have the conversation id. Which capability lets you see each model call, tool call and token cost of that interaction in order?',
      options: [
        'Cost Management cost analysis.',
        'Trace Replay in Foundry, opened from the conversation or trace id.',
        'The Quota page.',
        'Service Health.',
      ],
      correct: [1],
      explanation:
        'Trace Replay reconstructs the run span by span with duration and token views. Cost analysis, quota and service health do not show per-run execution.',
    },
    {
      question: 'Which TWO configurations are required for an SRE to view trace data while prompt content remains restricted to a compliance group? (Select two)',
      options: [
        'Log Analytics Reader for the SRE on the Application Insights resource.',
        'The AppGenAIContent table set to Protected with Privileged Monitoring Data Reader granted only to the compliance group.',
        'Owner on the subscription for the SRE.',
        'Disabling Application Insights.',
      ],
      correct: [0, 1],
      explanation:
        'Reader access shows traces; the protected table hides sensitive content from everyone without the privileged role. Owner is excessive, and disabling telemetry removes observability.',
    },
    {
      question:
        'Three teams share a gpt deployment and one team\'s batch job keeps consuming all capacity. You want predictable per-project ceilings with no code changes in the agents. What should you configure?',
      options: [
        'Ask the team to run the job at night.',
        'Enable an AI Gateway for the Foundry resource and set per-project tokens-per-minute limits and token quotas in Foundry Control Plane.',
        'Increase max_output_tokens for the other teams.',
        'Create a separate Application Insights resource per team.',
      ],
      correct: [1],
      explanation:
        'Control Plane with the AI Gateway enforces per-project TPM (429) and quota (403) limits centrally. Scheduling is not enforcement, output limits do not allocate capacity, and telemetry separation does not control usage.',
    },
    {
      question:
        'An agent\'s task-adherence score has drifted down over two weeks while run success rate stayed at 99%. Which monitoring component detects this kind of quality regression?',
      options: ['Diagnostic request logs', 'Continuous evaluation on sampled production traffic with alerts on evaluator thresholds', 'The Quota page', 'Resource locks'],
      correct: [1],
      explanation:
        'Continuous evaluation measures quality, not just operational success. Request logs show status codes and latency, quota and locks are unrelated.',
    },
    {
      question:
        'A writer agent with self-refinement occasionally runs for hours and burns tokens when a tool fails. Which combination of controls is MOST appropriate?',
      options: [
        'A longer idle timeout and more TPM quota.',
        'A maximum iteration count on the loop, a per-run token budget enforced in middleware, gateway token quotas, and an alert on tokens per run.',
        'Switching to a frontier model.',
        'Removing the tool.',
      ],
      correct: [1],
      explanation:
        'Loop and token limits in code plus gateway quotas and alerts bound the damage at every layer. More quota or a bigger model increases spend, and removing the tool removes functionality.',
    },
    {
      question: 'Which statement about Foundry platform availability design is correct?',
      options: [
        'Preview features are covered by the same SLA as GA features.',
        'Foundry automatically replicates agents and their BYO data stores to a paired region.',
        'You must design HA/DR for BYO dependencies (Cosmos DB, AI Search, Storage, ACR) and your own multi-region routing because Foundry has no automatic failover.',
        'Resource locks replace the need for backups.',
      ],
      correct: [2],
      explanation:
        'Shared responsibility: Microsoft runs the runtime, you own dependency durability and failover. Previews have no SLA, there is no automatic replication, and locks prevent deletion but are not backups.',
    },
  ],
  statements: [
    { text: 'Tracing in a Foundry project is off until an Application Insights resource is connected.', isTrue: true, explanation: 'No trace data is collected unless tracing is explicitly enabled by connecting App Insights.' },
    { text: 'Prompt content captured in traces should remain enabled in production for all users to ease debugging.', isTrue: false, explanation: 'Disable content recording in production or route it to the protected table with restricted access.' },
    { text: 'Foundry Control Plane can enforce total token quotas per period on model deployments when an AI Gateway is configured.', isTrue: true, explanation: 'TPM limits return 429 and exhausted quotas return 403.' },
    { text: 'Adding more subagents to a task never increases total token usage.', isTrue: false, explanation: 'Documentation notes subagents increase token usage; justify fan-out with measured gains.' },
    { text: 'Run success rate and p95 latency per agent version are reasonable service-level indicators for an agent system.', isTrue: true, explanation: 'They are visible in the Monitor dashboard and computable from span data.' },
    { text: 'Evaluation and red-team runs are free because they are part of observability.', isTrue: false, explanation: 'They consume quota and tokens and should be included in cost planning.' },
    { text: 'Consistent resource tags are a prerequisite for reliable cost roll-ups and chargebacks in Cost Management.', isTrue: true, explanation: 'Tags let costs be grouped by team, product and environment.' },
  ],
  resources: [
    { label: 'Set up tracing in Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-setup' },
    { label: 'Monitor agents with the Agent Monitoring Dashboard', url: 'https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard' },
    { label: 'Enforce token limits for models (Foundry Control Plane)', url: 'https://learn.microsoft.com/en-us/azure/foundry/control-plane/how-to-enforce-limits-models' },
    { label: 'Plan and manage costs for Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs' },
  ],
};

import type { Concept } from '../../types';

export const genaiObservabilityTracingCost: Concept = {
  id: 'genai-observability-tracing-cost',
  title: 'Observability for Generative AI: Continuous Monitoring, Performance, Cost and Tracing',
  summary:
    'How a deployed LLM application or agent is watched in production: the Foundry monitoring dashboards backed by Application Insights, the Azure Monitor metrics for latency and throughput, token and cost tracking with the levers that reduce spend, and OpenTelemetry tracing that turns a slow or wrong answer into a debuggable span timeline.',
  certs: ['ai-300', 'ai-103', 'ai-500'],
  domains: ['ai-300-4', 'ai-103-2', 'ai-500-3'],
  outcomes: ['ai-300-4-2-1', 'ai-300-4-2-2', 'ai-300-4-2-3', 'ai-300-4-2-4', 'ai-103-2-3-3', 'ai-500-3-3-5'],
  tags: ['observability', 'application-insights', 'opentelemetry', 'tracing', 'azure-monitor', 'token-cost', 'latency', 'foundry'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Continuous monitoring in Foundry',
      body: `Foundry observability has three cooperating capabilities: **evaluation** (quality and safety scoring), **monitoring** (dashboards and alerts) and **tracing** (execution detail). All of them are built on **Azure Monitor Application Insights**: you connect an Application Insights resource to the Foundry resource once (Tracing or Monitoring in the project), and every project in the resource can then send telemetry.

The **Monitoring** area of a Foundry project shows Application analytics dashboards: request volume, latency, exceptions, **token consumption** and **response quality** from continuous evaluation, filterable by time range, application and model. Under the hood these are Azure Workbooks running KQL over Application Insights, so you can open any tile's query, customise the workbook, and create **Azure Monitor alert rules** from the same KQL (for example, alert when the hourly groundedness pass rate falls below 85 percent or when 5xx errors exceed a count).

**Continuous evaluation** for agents samples production traces at a configured rate and scores them with quality and safety evaluators, writing the scores back as telemetry so quality trends sit next to operational metrics. Add **scheduled evaluations** on a fixed dataset to detect drift independent of traffic, and **scheduled red teaming** for safety posture over time. The exam angle: continuous monitoring in Foundry is not just uptime; it is quality, safety, performance and cost in one place, with Azure Monitor providing alerting and retention. Hub-based projects do not support the Foundry monitoring experience; it requires a Foundry project.`,
    },
    {
      heading: 'Performance metrics: latency, throughput and response times',
      body: `Model deployments on a Foundry resource emit **Azure Monitor platform metrics** automatically (no configuration). The ones to know:

- **Azure OpenAI Requests** (count, split by status code and deployment) – throughput and error rate; 429 means quota or PTU exhaustion.
- **Time to Response**, **Time to Last Byte**, **Time Between Tokens** – the latency family to use for user experience; **Time to Response** (first token) drives perceived responsiveness for streaming, Time Between Tokens reflects generation speed. The legacy **Latency** metric is deprecated for this purpose.
- **Processed Prompt Tokens**, **Generated Completion Tokens**, **Processed Inference Tokens** – volume drivers for cost and quota.
- **Provisioned-managed Utilization V2** – percentage of PTU capacity in use; sustained values near 100 percent predict 429s.
- **Tokens per second**, **Active Tokens**, and **Azure OpenAI Context Tokens Cache Match Rate** for cache effectiveness.

Use **Metrics Explorer** with splitting by \`ModelDeploymentName\` and \`StatusCode\` to compare deployments or to see spillover traffic, and create **metric alerts** with static or dynamic thresholds. Route metrics and **resource logs** to a Log Analytics workspace with a **diagnostic setting** so you can join them with application traces in KQL. On the application side, Application Insights **requests** and **dependencies** record end-to-end latency per operation, including retrieval and tool calls that the model metrics cannot see. Latency reduction levers: streaming, smaller models or fewer output tokens, prompt caching, provisioned throughput for consistent latency, regional deployments close to users, and parallelising independent tool calls.`,
    },
    {
      heading: 'Tracking and optimising cost: tokens and resources',
      body: `Generative AI cost is dominated by **tokens** (input, output, cached input, and separate rates for batch and PTU hours), plus the resources around the model: AI Search, storage, Application Insights ingestion, evaluation judge calls and agent runtime.

**Track** it on three levels:

1. **Azure Cost Management**: costs per resource, resource group and tag; use **tags** (team, application, environment) on Foundry resources and deployments, set **budgets** with alerts, and analyse PTU reservations versus hourly.
2. **Azure Monitor token metrics** split by deployment to attribute consumption to applications; combine with a per-request \`app\` or \`tenant\` attribute in traces for chargeback.
3. **Traces**: the GenAI semantic conventions record \`gen_ai.usage.input_tokens\` and \`gen_ai.usage.output_tokens\` on each model span, so a KQL query sums tokens per feature or user journey.

**Optimise** with levers the exam expects you to name:

- **Prompt caching**: identical prompt prefixes are billed at a discount (and do not consume PTU on older models); put static instructions and documents first, use \`prompt_cache_key\` and explicit breakpoints on newer models.
- **Right-size the model**: route simple intents to mini or nano models; use a **model router** or a tiered design.
- **Batch** deployments for non-interactive workloads at roughly half price.
- **Trim prompts and outputs**: fewer retrieved chunks, summarised history, \`max_output_tokens\`, structured outputs.
- **Provisioned throughput plus reservations** for steady high volume; **spillover** to standard for bursts instead of over-provisioning.
- **Evaluation cost**: sample rather than score every request; use deterministic evaluators where possible.
- **Quota as a brake**: TPM limits per deployment stop a runaway agent loop from spending unbounded money; add loop limits in the agent itself.`,
    },
    {
      heading: 'Logging, tracing and debugging in production',
      body: `**Tracing** records each request as a tree of **spans**: the application operation, retrieval calls, each model call with its prompt and completion (optionally), tool invocations and their results, with timings and attributes. Foundry tracing is **OpenTelemetry**-based and stores spans in Application Insights; the Tracing page in the project shows the timeline, inputs and outputs per span, errors and token counts.

\`\`\`python
# pip install azure-ai-projects azure-monitor-opentelemetry opentelemetry-instrumentation-openai-v2
import os
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry.instrumentation.openai_v2 import OpenAIInstrumentor
from opentelemetry import trace

project = AIProjectClient(endpoint=os.environ["AZURE_AI_PROJECT_ENDPOINT"], credential=DefaultAzureCredential())
configure_azure_monitor(connection_string=project.telemetry.get_application_insights_connection_string())
OpenAIInstrumentor().instrument()            # auto-spans for every model call
tracer = trace.get_tracer(__name__)

@tracer.start_as_current_span("answer_question")   # custom span around business logic
def answer_question(question: str) -> str:
    span = trace.get_current_span()
    span.set_attribute("prompt.version", "2.3.0")
    span.set_attribute("tenant", "contoso")
    chunks = retrieve(question)                      # retrieval shows as a child span if instrumented
    resp = project.get_openai_client().responses.create(model=os.environ["ASSISTANT_DEPLOYMENT"], input=build_prompt(question, chunks))
    return resp.output_text
\`\`\`

Set \`OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=true\` to record prompt and completion text (consider privacy and retention before enabling in production). Agent Service runs are traced automatically when Application Insights is connected; popular frameworks (Agent Framework, LangChain, LangGraph, OpenAI Agents SDK) have instrumentations. Add **custom attributes** (prompt version, model deployment, correlation ID, user segment) so traces join to evaluations and cost.

Debugging workflow: alert fires on quality or latency, open Monitoring, filter to the window, jump to Tracing, sort by duration or error, open a trace and read the spans: was retrieval empty, did the tool call fail, did the model return a refusal, which step took the time. **Diagnostic settings** on the Foundry resource send request logs to Log Analytics for the model-side view, and KQL joins the two by operation ID. Viewing traces needs at least Log Analytics Reader on the Application Insights resource.`,
    },
  ],
  examples: [
    {
      title: 'KQL for token cost attribution by application',
      description:
        'Finance asks for monthly token usage per internal application. Each application sets an app attribute on its root span, and model spans carry gen_ai usage attributes. One KQL query over Application Insights dependencies joins them and sums tokens, which the team multiplies by the published per-token price in a workbook.',
      language: 'text',
      code: `dependencies
| where timestamp > ago(30d) and name startswith "chat"
| extend app = tostring(customDimensions["app"]),
         in_tok = toint(customDimensions["gen_ai.usage.input_tokens"]),
         out_tok = toint(customDimensions["gen_ai.usage.output_tokens"]),
         model = tostring(customDimensions["gen_ai.request.model"])
| summarize input_tokens = sum(in_tok), output_tokens = sum(out_tok), calls = count() by app, model
| order by input_tokens desc`,
      takeaway: 'Attribute cost by tagging spans; token metrics alone show the deployment, not who used it.',
    },
    {
      title: 'Latency alert on first-token time',
      description:
        'A streaming chat app promises a first token within two seconds. The team creates an Azure Monitor metric alert on Time to Response for the production deployment with a dynamic threshold, routed to the on-call action group, and a second alert on 429 request count split by deployment to catch PTU exhaustion before users do.',
      language: 'bash',
      code: `RES=$(az cognitiveservices account show -n fdry-prod -g rg-ai-prod --query id -o tsv)
az monitor metrics alert create -n ttr-high -g rg-ai-prod --scopes "$RES" \\
  --condition "avg TimeToResponse > 2000" --window-size 5m --evaluation-frequency 1m \\
  --action /subscriptions/<sub>/resourceGroups/rg-ai-prod/providers/microsoft.insights/actionGroups/ag-oncall \\
  --description "p50 first-token latency above 2s on assistant-ptu"`,
      takeaway: 'Alert on the latency metric that matches the user experience (first token for streaming), not the deprecated aggregate latency.',
    },
    {
      title: 'The silent cost explosion (a realistic mistake and the fix)',
      description:
        'An agent with a retry-on-failure tool loop hit a flaky API, retried 40 times per request, and tripled the monthly bill before anyone noticed; there were no budget alerts and no token attribution. The fix combined a loop limit and tool error handling in the agent, a TPM quota on the deployment as a hard brake, a Cost Management budget alert, and a KQL alert on tokens per request exceeding a ceiling.',
      language: 'text',
      code: `dependencies
| where timestamp > ago(1h)
| extend tok = toint(customDimensions["gen_ai.usage.input_tokens"]) + toint(customDimensions["gen_ai.usage.output_tokens"])
| summarize tokens_per_request = sum(tok) by operation_Id
| where tokens_per_request > 50000
| count
// alert rule: fire when count > 10 in a 1h window`,
      takeaway: 'Treat tokens like any resource: quotas as brakes, budgets as alarms, per-request ceilings as early warning.',
    },
  ],
  keyPoints: [
    'Foundry observability = evaluation + monitoring + tracing, all built on Azure Monitor Application Insights connected to the Foundry resource; the monitoring dashboards require a Foundry project.',
    'Continuous evaluation samples production traces and scores quality and safety; scheduled evaluations and scheduled red teaming detect drift over time; alerts come from Azure Monitor.',
    'Latency metrics to use: Time to Response (first token), Time to Last Byte, Time Between Tokens; throughput and errors from Azure OpenAI Requests split by status code and deployment.',
    'Token metrics (Processed Prompt Tokens, Generated Completion Tokens) and Provisioned-managed Utilization V2 drive cost and capacity decisions.',
    'Attribute cost with tags in Cost Management, token metrics per deployment, and gen_ai.usage.* attributes on trace spans; set budgets and TPM quotas as brakes.',
    'Cost levers: prompt caching (stable prefix first), smaller or routed models, batch deployments, trimmed prompts and outputs, PTU plus reservations with spillover, sampled evaluation.',
    'Tracing is OpenTelemetry: configure_azure_monitor plus OpenAIInstrumentor (and framework instrumentations) produce spans with prompts, tools, timings and tokens; add custom attributes such as prompt version and correlation ID.',
    'Capturing message content requires OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=true and a privacy decision; diagnostic settings add model-side logs in Log Analytics.',
  ],
  flashcards: [
    { front: 'Which Azure service stores Foundry traces and powers its monitoring dashboards?', back: 'Azure Monitor Application Insights, connected once to the Foundry resource.' },
    { front: 'What does continuous evaluation do?', back: 'Scores a sampled share of production agent traces with quality and safety evaluators and records the results as telemetry.' },
    { front: 'Which metric best reflects perceived responsiveness for a streaming chat app?', back: 'Time to Response (time to first token).' },
    { front: 'What does a rising count of 429 responses on a PTU deployment indicate?', back: 'Provisioned capacity is exhausted; scale PTUs or enable spillover to a standard deployment.' },
    { front: 'Which trace attributes carry token usage under the GenAI semantic conventions?', back: 'gen_ai.usage.input_tokens and gen_ai.usage.output_tokens.' },
    { front: 'How do you make model calls appear as spans with minimal code?', back: 'Call configure_azure_monitor with the project\'s Application Insights connection string and OpenAIInstrumentor().instrument().' },
    { front: 'Which environment variable enables capturing prompt and completion text in traces?', back: 'OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=true.' },
    { front: 'Name three cost-reduction levers for LLM workloads.', back: 'Prompt caching with stable prefixes, smaller or routed models, batch deployments (also trimmed prompts, PTU reservations with spillover).' },
    { front: 'How do you attribute token spend to internal applications for chargeback?', back: 'Tag resources for Cost Management, split token metrics by deployment, and add an application attribute to trace spans then aggregate with KQL.' },
    { front: 'What minimum role is needed to view traces in the Foundry portal?', back: 'Log Analytics Reader on the connected Application Insights resource.' },
  ],
  quiz: [
    {
      question:
        'A support agent in production is suspected of answering off-topic in some conversations. Which Foundry capability lets you detect this on live traffic without evaluating every request?',
      options: [
        'Azure Monitor metric alerts on Processed Prompt Tokens',
        'Continuous evaluation sampling production traces with quality evaluators and alerting on thresholds',
        'A diagnostic setting routing logs to Storage',
        'Increasing the TPM quota',
      ],
      correct: [1],
      explanation:
        'Continuous evaluation scores sampled traces for quality and safety. Token metrics and diagnostic logs do not judge relevance, and quota does not affect quality.',
    },
    {
      question:
        'Users complain that answers take too long to start appearing, although total generation time is acceptable. Which metric should you alert on?',
      options: [
        'Time to Response',
        'Generated Completion Tokens',
        'Processed Prompt Tokens',
        'Azure OpenAI Requests',
      ],
      correct: [0],
      explanation:
        'Time to Response measures first-token latency, which is what users perceive while streaming. Token counts and request counts measure volume, not latency.',
    },
    {
      question:
        'Finance needs monthly LLM cost per internal application, but all applications share one model deployment. Which TWO actions make this attribution possible? (Select two)',
      options: [
        'Add an application attribute to each request\'s trace span and aggregate gen_ai.usage token attributes with KQL',
        'Rely on Cost Management at the Foundry resource level',
        'Create a separate deployment per application and split Azure Monitor token metrics by ModelDeploymentName',
        'Disable prompt caching so all tokens are billed at full rate',
      ],
      correct: [0, 2],
      explanation:
        'Either trace attributes or per-application deployments give attribution. Resource-level cost cannot split a shared deployment, and disabling caching raises cost without adding attribution.',
    },
    {
      question:
        'A single request returned a wrong answer. You need to see whether retrieval returned empty context, which tool was called, and how long each step took. What should you use?',
      options: [
        'Metrics Explorer with splitting by StatusCode',
        'The trace for the request in the Foundry Tracing view, inspecting its spans',
        'Cost analysis in the Azure portal',
        'The model retirement schedule',
      ],
      correct: [1],
      explanation:
        'Tracing shows the span tree with inputs, outputs and timings for retrieval, tools and model calls. Metrics are aggregates; cost analysis and retirement schedules are unrelated.',
    },
    {
      question:
        'An agent entered a retry loop and consumed millions of tokens overnight. Which control would have limited the financial damage most directly at the platform level?',
      options: [
        'A higher max_output_tokens setting',
        'A tokens-per-minute quota on the deployment combined with a Cost Management budget alert',
        'Switching the deployment to Global Standard',
        'Enabling message content capture in traces',
      ],
      correct: [1],
      explanation:
        'Quota caps consumption rate and budgets alert on spend. More output tokens increases cost, deployment type does not cap spend, and content capture aids debugging but not containment.',
    },
  ],
  statements: [
    { text: 'Foundry tracing is based on OpenTelemetry and stores spans in Application Insights.', isTrue: true, explanation: 'Instrumentations export spans to the connected Application Insights resource.' },
    { text: 'Prompt and completion text is captured in traces by default.', isTrue: false, explanation: 'Content capture must be enabled with OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=true.' },
    { text: 'The legacy Latency metric is the recommended way to measure Azure OpenAI response time.', isTrue: false, explanation: 'Use Time to Response, Time to Last Byte and Time Between Tokens.' },
    { text: 'Azure Monitor platform metrics for model deployments are collected automatically without configuration.', isTrue: true, explanation: 'Resource logs, by contrast, require a diagnostic setting.' },
    { text: 'The Foundry monitoring dashboards are available for hub-based projects.', isTrue: false, explanation: 'Monitoring requires a Foundry project; hub-based projects are not supported.' },
    { text: 'Prompt caching reduces both latency and input token cost for requests that share a long identical prefix.', isTrue: true, explanation: 'Cached prefixes are not reprocessed and are billed at a discount.' },
  ],
  resources: [
    { label: 'Observability in generative AI (Microsoft Foundry)', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/observability' },
    { label: 'Monitor your generative AI applications (preview)', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/monitor-applications' },
    { label: 'View trace results for AI applications using the OpenAI SDK', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/develop/trace-application' },
    { label: 'Monitor Azure OpenAI', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/monitor-openai' },
  ],
};

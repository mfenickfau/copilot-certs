import type { Concept } from '../../types';

export const opentelemetryTracingAndKql: Concept = {
  id: 'opentelemetry-tracing-and-kql',
  title: 'Distributed Tracing with OpenTelemetry and Log Analysis with KQL',
  summary:
    'Instrument Azure back ends with the OpenTelemetry SDKs and the Azure Monitor distro so requests, dependencies, exceptions, logs and custom metrics flow into Application Insights with W3C trace context, then analyse them in Log Analytics with Kusto Query Language: where, summarize, bin, join, percentiles, render and the Application Insights tables.',
  certs: ['ai-200', 'az-401'],
  domains: ['ai-200-4', 'az-401-5'],
  outcomes: ['ai-200-4-2-1', 'ai-200-4-2-2', 'az-401-5-3-5'],
  tags: ['opentelemetry', 'application-insights', 'azure-monitor', 'distributed-tracing', 'kql', 'log-analytics'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'OpenTelemetry and the Azure Monitor distro',
      body: `**OpenTelemetry (OTel)** is the vendor-neutral standard for the three telemetry signals: **traces** (a trace is one end-to-end operation made of **spans**, each with a name, kind, duration, status and attributes, linked by parent ids), **metrics** (counters, histograms, gauges) and **logs**. Context travels between services in the **W3C Trace Context** headers (\`traceparent\`, \`tracestate\`), so a request that enters an API, drops a Service Bus message and is processed by a worker shows up as one trace with the same operation id.

Microsoft's recommended path is a **distro**: a package that bundles the OTel SDK, instrumentation libraries and the Azure Monitor exporter, configured in one call. For Python the long-standing package is \`azure-monitor-opentelemetry\` with \`configure_azure_monitor(connection_string=...)\`; the newer \`microsoft-opentelemetry\` package exposes \`use_microsoft_opentelemetry(enable_azure_monitor=True)\` and can also export to any OTLP endpoint. For .NET it is \`Azure.Monitor.OpenTelemetry.AspNetCore\` (\`builder.Services.AddOpenTelemetry().UseAzureMonitor()\`) or the newer Microsoft.OpenTelemetry distro; Java uses the Application Insights Java agent (\`-javaagent\`), Node.js has a matching distro. Do not initialise two distros in one process.

The connection string comes from the **APPLICATIONINSIGHTS_CONNECTION_STRING** environment variable (store it as an app setting or Key Vault reference). Auto-instrumentation covers HTTP frameworks (FastAPI, Flask, Django, ASP.NET Core), outbound HTTP clients, database drivers (psycopg, SQLAlchemy), and the Azure SDKs, so a basic service gets request and dependency telemetry with no code changes beyond the initialisation. **Sampling** defaults to rate-limited (about five requests per second) with dependencies and logs kept for sampled requests; set a fixed percentage (\`APPLICATIONINSIGHTS_SAMPLING_PERCENTAGE\`) when you need statistically even sampling. Set **cloud role name** with the \`service.name\` resource attribute or \`OTEL_SERVICE_NAME\` so each service is a distinct node on the Application Map.`,
    },
    {
      heading: 'Custom spans, attributes, exceptions and metrics',
      body: `Auto-instrumentation misses the parts that matter most in AI back ends: the embedding call, the vector query, the model completion, the agent tool loop. Add **manual spans** with the OTel API, not an Azure-specific API, so the code stays portable:

- Python: \`tracer = trace.get_tracer(__name__)\`, then \`with tracer.start_as_current_span("embed-chunk") as span: span.set_attribute("doc.id", doc_id)\`. .NET uses \`ActivitySource.StartActivity\`; Java \`@WithSpan\`.
- **Span kind** controls which Application Insights table receives the span: \`SpanKind.SERVER\` (and CONSUMER) becomes a **request**, \`CLIENT\`/\`PRODUCER\` become **dependencies**, \`INTERNAL\` becomes a dependency with type InProc. A background job that is not auto-instrumented should start a SERVER span so it appears in \`requests\`.
- **Attributes** become \`customDimensions\`. Standard ones such as \`enduser.id\` and \`http.client_ip\` map to built-in columns (\`user_Id\`, \`client_IP\`). For LLM calls record model name, token counts and latency as attributes; the GenAI semantic conventions standardise names like \`gen_ai.request.model\` and \`gen_ai.usage.input_tokens\`.
- **Exceptions**: caught exceptions are not reported unless you call \`span.record_exception(e)\` and \`span.set_status(Status(StatusCode.ERROR))\`; they land in the \`exceptions\` table and link to the span.
- **Logs**: standard \`logging\` records attach the trace id and appear in \`traces\`; pass \`logger_name\` so the SDK's own logs are not collected.
- **Metrics**: \`meter = metrics.get_meter("rag")\`, then a histogram for retrieval latency or a counter for cache hits; they appear in \`customMetrics\`.

Propagation across **messaging** is manual unless the SDK does it: inject the trace context into message application properties on send and extract it on receive so the consumer span continues the trace; the Azure SDKs do this for Service Bus and Event Hubs when tracing is enabled. Live Metrics gives a real-time stream; the **Application Map** and **transaction search** (end-to-end transaction details) are the views built from these spans.`,
    },
    {
      heading: 'KQL fundamentals for logs and metrics',
      body: `Logs land in a **Log Analytics workspace** and are queried with **Kusto Query Language (KQL)**: start from a **table**, pipe (\`|\`) through operators left to right. Application Insights data appears twice-named: in the Application Insights resource blade as \`requests\`, \`dependencies\`, \`exceptions\`, \`traces\`, \`customEvents\`, \`customMetrics\`, \`availabilityResults\` (columns \`timestamp\`, \`duration\`, \`resultCode\`, \`operation_Id\`, \`customDimensions\`); in the workspace as \`AppRequests\`, \`AppDependencies\`, \`AppExceptions\`, \`AppTraces\`, \`AppEvents\`, \`AppMetrics\` (columns \`TimeGenerated\`, \`DurationMs\`, \`ResultCode\`, \`OperationId\`, \`Properties\`). Platform logs use their own tables (\`ContainerAppConsoleLogs_CL\`, \`ContainerLogV2\`, \`AzureDiagnostics\` or resource-specific tables, \`AzureMetrics\` for platform metrics).

Operators you must know:

- **Filter**: \`where TimeGenerated > ago(1h) and ResultCode startswith "5"\`; \`==\` is case-sensitive, \`=~\` is not; \`has\` matches whole terms and is faster than \`contains\`.
- **Shape**: \`project\` (pick/rename columns), \`extend\` (compute new columns, e.g. \`extend tenant = tostring(Properties.tenantId)\`), \`parse_json\`, \`tostring\`/\`toint\`.
- **Aggregate**: \`summarize count(), avg(DurationMs), percentiles(DurationMs, 50, 95, 99) by Name, bin(TimeGenerated, 5m)\`; \`dcount\` for distinct counts, \`countif\` for conditional counts, \`arg_max(TimeGenerated, *)\` for latest row per group.
- **Order/limit**: \`top 10 by DurationMs desc\`, \`sort by\`, \`take\`.
- **Combine**: \`join kind=inner (AppDependencies) on OperationId\` to stitch a request to its dependencies; \`union\` across tables; \`let\` to name sub-queries and constants.
- **Visualise**: \`render timechart\` (needs a datetime column, usually from \`bin\`), \`barchart\`, \`piechart\`.
- \`search\` scans all columns or tables; use it to find a term, not for production queries.

Queries drive **alerts** (log search alert rules on a KQL result count or metric measurement), **workbooks**, and dashboards; the same KQL works in the portal, \`az monitor log-analytics query\`, and the Azure Monitor Query SDK.`,
    },
    {
      heading: 'Troubleshooting recipes and the exam angle',
      body: `Three queries cover most incidents:

1. **Failure rate per operation over time**: \`AppRequests | where TimeGenerated > ago(6h) | summarize total=count(), failed=countif(Success == false) by Name, bin(TimeGenerated, 15m) | extend failRate = 100.0 * failed / total | render timechart\`.
2. **Slowest dependencies behind a slow endpoint**: \`AppRequests | where Name == "POST /chat" and DurationMs > 5000 | join kind=inner (AppDependencies | project OperationId, DependencyType, Target, DepName=Name, DepMs=DurationMs) on OperationId | summarize avg(DepMs), percentiles(DepMs, 95) by DependencyType, Target | order by percentile_DepMs_95 desc\`.
3. **Exceptions with context**: \`AppExceptions | where TimeGenerated > ago(1d) | summarize n=count(), sample=any(OuterMessage) by ExceptionType, ProblemId | top 20 by n\`.

Exam-style cues:

- *"Correlate a request across an API and a Service Bus worker."* Same **operation id** via W3C trace context propagation; join on \`OperationId\`/\`operation_Id\`.
- *"A background job does not appear in the requests table."* Create its span with **SpanKind.SERVER**.
- *"Caught exceptions are missing."* Call **record_exception** (and set error status).
- *"Services all show as one node on the Application Map."* Set **service.name / OTEL_SERVICE_NAME** (cloud role name) per service.
- *"Telemetry volume and cost too high."* Configure **sampling**.
- *"Show the p95 latency per 5 minutes."* \`summarize percentiles(DurationMs, 95) by bin(TimeGenerated, 5m) | render timechart\`.
- *"Count 5xx per endpoint in the last hour."* \`where ResultCode startswith "5" | summarize count() by Name\`.
- *"Which table has container stdout for Container Apps?"* ContainerAppConsoleLogs_CL (ContainerLogV2 for AKS).

Distractors: using the deprecated Application Insights SDK or OpenCensus for new code, \`contains\` where \`has\` is correct, \`summarize\` without \`bin\` when a time series is wanted, and expecting metrics data in the \`traces\` table (it is \`customMetrics\`/\`AppMetrics\`).`,
    },
  ],
  examples: [
    {
      title: 'Instrument a FastAPI RAG service with the Azure Monitor distro and custom spans',
      description:
        'One call configures tracing, metrics and logs for the whole app; manual spans wrap the embedding and vector search steps with attributes and token counts, and a histogram tracks retrieval latency.',
      language: 'python',
      code: `import logging, time
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import trace, metrics
from opentelemetry.trace import SpanKind, Status, StatusCode

configure_azure_monitor(logger_name="rag")          # reads APPLICATIONINSIGHTS_CONNECTION_STRING
tracer = trace.get_tracer("rag")
meter = metrics.get_meter("rag")
retrieval_ms = meter.create_histogram("rag.retrieval.duration", unit="ms")
log = logging.getLogger("rag")

def answer(question: str, tenant: str):
    with tracer.start_as_current_span("rag.answer") as span:
        span.set_attribute("tenant.id", tenant)
        t0 = time.perf_counter()
        with tracer.start_as_current_span("rag.embed", kind=SpanKind.CLIENT) as s:
            vec = embed(question)
            s.set_attribute("gen_ai.request.model", "text-embedding-3-small")
        chunks = vector_search(tenant, vec)              # psycopg auto-instrumented
        retrieval_ms.record((time.perf_counter() - t0) * 1000, {"tenant": tenant})
        try:
            return complete(question, chunks)
        except Exception as e:                            # caught: must record explicitly
            span.record_exception(e); span.set_status(Status(StatusCode.ERROR)); raise`,
      takeaway: 'configure_azure_monitor wires the SDK and exporter; manual spans, attributes and metrics add the AI-specific detail; caught exceptions must be recorded to appear in the exceptions table.',
    },
    {
      title: 'KQL: p95 latency and failure rate per endpoint, then the dependency behind the slow one',
      description:
        'An on-call engineer first charts the chat endpoint\'s p95 and failure rate per five minutes, then joins slow requests to their dependencies to see that the vector database, not the model, is the culprit.',
      language: 'text',
      code: `AppRequests
| where TimeGenerated > ago(2h) and Name startswith "POST /chat"
| summarize p95 = percentiles(DurationMs, 95), total = count(),
            failed = countif(Success == false) by bin(TimeGenerated, 5m)
| extend failRate = round(100.0 * failed / total, 1)
| render timechart

AppRequests
| where TimeGenerated > ago(2h) and Name startswith "POST /chat" and DurationMs > 4000
| join kind=inner (
    AppDependencies
    | where TimeGenerated > ago(2h)
    | project OperationId, DependencyType, Target, DepMs = DurationMs
  ) on OperationId
| summarize avgMs = avg(DepMs), p95Ms = percentiles(DepMs, 95), calls = count()
          by DependencyType, Target
| order by p95Ms desc`,
      takeaway: 'summarize with bin builds the time series; join on OperationId follows a request into its dependencies; percentiles beats avg for latency work.',
    },
    {
      title: 'The invisible worker (a realistic mistake)',
      description:
        'A Service Bus consumer processes embedding jobs and the team instruments it with start_as_current_span("process-job"). In Application Insights nothing appears under requests and the Application Map shows the worker as a dependency of nothing. Two causes: the span defaulted to INTERNAL kind (so it landed in dependencies), and the worker did not extract the trace context from the message, so each job started a new trace unrelated to the API call. The fix is a SERVER (or CONSUMER) span whose context is extracted from the message\'s application properties.',
      language: 'python',
      code: `from opentelemetry import trace, context
from opentelemetry.propagate import extract, inject
from opentelemetry.trace import SpanKind

# producer (API): carry the trace into the message
props = {}; inject(props)                      # adds traceparent/tracestate
sender.send_messages(ServiceBusMessage(body, application_properties=props))

# consumer (worker): continue the same trace as a server-side operation
for msg in receiver:
    ctx = extract(dict(msg.application_properties or {}))
    with tracer.start_as_current_span("process-job", context=ctx,
                                      kind=SpanKind.SERVER) as span:
        span.set_attribute("messaging.system", "servicebus")
        process(msg); receiver.complete_message(msg)`,
      takeaway: 'Span kind decides the table (SERVER -> requests) and explicit context propagation through message properties keeps the API and worker in one trace.',
    },
  ],
  keyPoints: [
    'OpenTelemetry signals: traces (spans), metrics, logs; W3C traceparent propagates context so one operation id spans API, messaging and workers.',
    'Use the Azure Monitor distro (azure-monitor-opentelemetry configure_azure_monitor, Azure.Monitor.OpenTelemetry.AspNetCore UseAzureMonitor, Java agent) or the newer Microsoft OpenTelemetry distro; never two distros at once.',
    'Connection string via APPLICATIONINSIGHTS_CONNECTION_STRING; set service.name/OTEL_SERVICE_NAME for cloud role name; configure sampling to control cost.',
    'Span kind maps to tables: SERVER/CONSUMER -> requests, CLIENT/PRODUCER -> dependencies, INTERNAL -> InProc dependency; attributes -> customDimensions.',
    'Caught exceptions need span.record_exception; custom metrics via get_meter go to customMetrics; logging records go to traces with the trace id attached.',
    'KQL starts from a table and pipes through where, project, extend, summarize (with bin for time series), join on OperationId, top/sort, render.',
    'Application Insights tables: requests/dependencies/exceptions/traces (classic names) or AppRequests/AppDependencies/AppExceptions/AppTraces (workspace names); operation_Id vs OperationId.',
    'Prefer has over contains, percentiles over avg for latency, and countif for failure rates; KQL also powers log alerts and workbooks.',
  ],
  flashcards: [
    { front: 'Which HTTP header carries W3C trace context between services?', back: 'traceparent (plus tracestate).' },
    { front: 'Python call that configures the Azure Monitor OpenTelemetry distro?', back: 'configure_azure_monitor() from azure-monitor-opentelemetry (or use_microsoft_opentelemetry from microsoft-opentelemetry).' },
    { front: 'Which environment variable supplies the Application Insights connection string?', back: 'APPLICATIONINSIGHTS_CONNECTION_STRING.' },
    { front: 'Which span kind makes a span appear in the requests table?', back: 'SpanKind.SERVER (and CONSUMER); CLIENT/PRODUCER become dependencies.' },
    { front: 'How do caught exceptions reach the exceptions table?', back: 'Call span.record_exception(e) (and set the span status to ERROR).' },
    { front: 'How do you set the cloud role name shown on the Application Map?', back: 'The service.name resource attribute or OTEL_SERVICE_NAME.' },
    { front: 'Workspace-based table name for Application Insights requests, and its duration column?', back: 'AppRequests; DurationMs (classic: requests, duration).' },
    { front: 'KQL operator to aggregate per 5-minute bucket?', back: 'summarize ... by bin(TimeGenerated, 5m).' },
    { front: 'KQL function for the 95th percentile of latency?', back: 'percentiles(DurationMs, 95) inside summarize.' },
    { front: 'Which column joins a request to its dependencies and exceptions?', back: 'OperationId (operation_Id in classic tables).' },
    { front: 'has versus contains in KQL?', back: 'has matches whole terms using the index and is faster; contains matches substrings.' },
    { front: 'Which operator turns a summarized time series into a chart?', back: 'render timechart.' },
  ],
  quiz: [
    {
      question:
        'A Python API and a separate Service Bus worker are both instrumented with the Azure Monitor OpenTelemetry distro, but each job appears as an unrelated trace. What should you do so one end-to-end transaction shows the API call and the job?',
      options: [
        'Inject the trace context into message application properties on send and extract it in the worker before starting its span',
        'Set the same APPLICATIONINSIGHTS_CONNECTION_STRING on both apps',
        'Increase the sampling percentage to 100',
        'Rename both services to the same service.name',
      ],
      correct: [0],
      explanation:
        'Correlation depends on propagating traceparent through the message. A shared connection string only puts data in the same resource, sampling affects volume, and a shared role name merges nodes on the map without correlating traces.',
    },
    {
      question:
        'A background job instrumented with a manual OpenTelemetry span never appears in the Application Insights requests table, only under dependencies. Why?',
      options: [
        'The span was created with the default INTERNAL kind instead of SpanKind.SERVER',
        'The job runs on Container Apps, which only emits dependencies',
        'Exceptions were not recorded on the span',
        'The connection string is missing',
      ],
      correct: [0],
      explanation:
        'Span kind determines the destination table; SERVER spans become requests. Hosting does not change the mapping, exceptions are a separate table, and a missing connection string would mean no telemetry at all.',
    },
    {
      question:
        'You need a chart of the 95th percentile duration of requests named "POST /chat" per five minutes over the last two hours. Which KQL query is correct?',
      options: [
        'AppRequests | where TimeGenerated > ago(2h) and Name == "POST /chat" | summarize percentiles(DurationMs, 95) by bin(TimeGenerated, 5m) | render timechart',
        'AppRequests | where TimeGenerated > ago(2h) and Name == "POST /chat" | summarize avg(DurationMs) | render timechart',
        'AppDependencies | where Name contains "chat" | top 95 by DurationMs',
        'search "POST /chat" | summarize count() by bin(TimeGenerated, 5m)',
      ],
      correct: [0],
      explanation:
        'percentiles with bin produces the per-interval p95 and render draws it. The second query has no time axis and uses avg, the third queries the wrong table and misuses top, and search is a slow full scan that does not compute latency.',
    },
    {
      question:
        'Which TWO actions reduce Application Insights ingestion cost from an OpenTelemetry-instrumented service without losing the ability to diagnose individual failed requests? (Select two)',
      options: [
        'Configure fixed-percentage sampling in the distro',
        'Exclude noisy dependency instrumentation (for example health-check HTTP calls) with filtering',
        'Stop setting service.name on the services',
        'Switch all SERVER spans to INTERNAL kind',
      ],
      correct: [0, 1],
      explanation:
        'Sampling and filtering lower volume while keeping correlated samples. Role names cost nothing, and changing span kinds hides requests rather than reducing volume meaningfully.',
    },
    {
      question:
        'A developer wraps a model call in try/except, logs the message and continues. The failures do not appear in the exceptions table in Application Insights. What is the fix?',
      options: [
        'Call span.record_exception(e) and set the span status to ERROR inside the except block',
        'Set APPLICATIONINSIGHTS_SAMPLING_PERCENTAGE to 100',
        'Query the traces table with contains "error" instead',
        'Change the span kind to CLIENT',
      ],
      correct: [0],
      explanation:
        'Caught exceptions are only reported when recorded on the span. Sampling at 100 percent would not create exception records that were never emitted, searching logs sidesteps the table, and span kind is unrelated.',
    },
    {
      question:
        'Operations wants the count of HTTP 5xx responses per operation name in the last hour from workspace-based Application Insights. Which query is correct?',
      options: [
        'AppRequests | where TimeGenerated > ago(1h) and ResultCode startswith "5" | summarize count() by Name',
        'requests | where timestamp > ago(1h) | summarize count() by resultCode',
        'AppExceptions | where TimeGenerated > ago(1h) | summarize count() by Name',
        'AppRequests | where ResultCode == 500 | project Name',
      ],
      correct: [0],
      explanation:
        'The workspace table is AppRequests with ResultCode as a string; grouping by Name gives per-operation counts. The second uses classic names and groups by code not operation, exceptions are not HTTP responses, and the last ignores the time window and other 5xx codes.',
    },
  ],
  statements: [
    { text: 'OpenTelemetry propagates trace context between services using the W3C traceparent header.', isTrue: true, explanation: 'W3C Trace Context is the default propagator.' },
    { text: 'You should initialise both the Azure Monitor OpenTelemetry distro and the Microsoft OpenTelemetry distro in the same process for full coverage.', isTrue: false, explanation: 'Microsoft explicitly says not to initialise two distros in one application.' },
    { text: 'A span created with SpanKind.CLIENT appears in the Application Insights dependencies table.', isTrue: true, explanation: 'CLIENT and PRODUCER spans map to dependencies; SERVER and CONSUMER map to requests.' },
    { text: 'Caught exceptions are automatically reported to Application Insights by the OpenTelemetry SDK.', isTrue: false, explanation: 'Only unhandled exceptions captured by instrumentation are reported; caught ones need record_exception.' },
    { text: 'In KQL, the has operator is generally faster than contains because it matches indexed whole terms.', isTrue: true, explanation: 'Prefer has for term matching.' },
    { text: 'AppRequests and requests refer to the same Application Insights data under different naming schemes.', isTrue: true, explanation: 'Workspace-based tables use App* names and TimeGenerated/DurationMs columns.' },
    { text: 'render timechart works on any query result, even without a datetime column.', isTrue: false, explanation: 'A time chart needs a datetime x-axis, usually produced by bin(TimeGenerated, ...).' },
    { text: 'Custom OpenTelemetry metrics recorded with a meter appear in the customMetrics (AppMetrics) table.', isTrue: true, explanation: 'Metrics map to customMetrics; logs map to traces.' },
  ],
  resources: [
    { label: 'Enable OpenTelemetry for .NET, Node.js, Python and Java (Azure Monitor)', url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable' },
    { label: 'Add, modify and filter OpenTelemetry telemetry', url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-add-modify' },
    { label: 'Get started with log queries in Azure Monitor', url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/get-started-queries' },
    { label: 'Learn common KQL operators', url: 'https://learn.microsoft.com/en-us/kusto/query/tutorials/learn-common-operators' },
  ],
};

import type { Concept } from '../../types';

export const managingMonitoringAndSecuringAiSystems: Concept = {
  id: 'managing-monitoring-and-securing-ai-systems',
  title: 'Managing Quota and Cost, Monitoring Quality, and Securing Foundry',
  summary:
    'Operating a Foundry solution day to day: TPM and PTU quota, rate limits, scaling and cost controls; monitoring model performance, drift, safety events and grounding quality with Azure Monitor, tracing and continuous evaluation; watching ingestion, index health and relevance in Azure AI Search; and securing everything with Entra ID, managed and agent identities, keyless credentials, RBAC roles and private networking.',
  certs: ['ai-103'],
  domains: ['ai-103-1'],
  outcomes: ['ai-103-1-3-1', 'ai-103-1-3-2', 'ai-103-1-3-3', 'ai-103-1-3-4'],
  tags: ['quota', 'ptu', 'cost-management', 'azure-monitor', 'application-insights', 'ai-search', 'rbac', 'managed-identity', 'private-link', 'intermediate'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Quota, rate limits, scaling and cost',
      body: `**Quota** for standard deployments is granted per subscription, per region, per model (and per deployment type) in **tokens per minute (TPM)**. You spread it across deployments: 240K TPM for a model in East US can be one 240K deployment or several smaller ones. Each deployment's TPM maps to an enforced TPM limit and a derived **requests per minute (RPM)** limit (for example 6 RPM per 1,000 TPM on older chat models, 1 RPM per 1,000 TPM on some reasoning models). Hitting either returns **HTTP 429** with a \`Retry-After\` header, so clients must implement exponential backoff. Viewing quota needs the **Cognitive Services Usages Reader** role at subscription scope; requesting more needs Owner or Contributor and the quota increase form; **Foundry shared quota** gives temporary capacity for testing only.

**Provisioned throughput (PTU)** replaces TPM with reserved capacity; size it from historical input and output TPM, buy hourly or with monthly/yearly reservations, enable **spillover** to a Standard deployment for overflow, and watch the *Provisioned-managed Utilization V2* metric. **Instant access** models draw from a separate global pool.

Scaling and throttling levers:
- Reduce tokens: shorter system prompts, **prompt caching** (discounted cached input tokens, \`prompt_cache_key\` and breakpoints on newer models), structured outputs, smaller models or **model router** in Cost mode.
- Move volume off the hot path: **Batch** deployments for asynchronous jobs at about half price.
- Protect capacity: an **AI gateway** (Azure API Management connected through Foundry Control Plane) enforces per-project TPM limits (429) and total token quotas (403) so one team cannot starve another.

Cost visibility: Azure Cost Management (Cost Management Reader) grouped by resource and meter, the deployment **Metrics** tab in the portal, tags on every resource, budgets and alerts. Agent workloads add Application Insights ingestion, agentic retrieval tokens, Content Understanding and Search costs, so estimate with the pricing calculator per service.`,
    },
    {
      heading: 'Monitoring model performance, drift, safety and grounding',
      body: `Three signal planes cover a running system:

1. **Platform metrics (Azure Monitor)**: every Foundry resource emits metrics with no configuration: requests, *Processed Prompt Tokens*, *Generated Completion Tokens*, *Time to Response* (maps to time-to-first-token), total latency, 429s, provisioned utilization. Use Metrics Explorer with splitting by deployment or model, workbooks, Grafana and alerts. Enable **diagnostic settings** (Audit Logs, Request and Response Logs, Azure OpenAI Request Usage, AllMetrics) to Log Analytics or Storage for forensics. A latency rise without a token-count rise points to capacity pressure; a latency rise *with* longer prompts points to prompt growth.
2. **Traces (Application Insights via OpenTelemetry)**: connect Application Insights to the project and Foundry records server-side traces for prompt agents, hosted agents and workflows automatically (90-day search in the portal). Spans show inputs, outputs, tool calls, token usage and latency per step, so you can see *which* step introduced an error or a slow call. Client-side code adds spans with \`azure-core-tracing-opentelemetry\`.
3. **Quality and safety signals (evaluation)**: the **Agent Monitoring Dashboard** shows token usage, latency, run success rate, evaluator scores and red-team results; **continuous (recurring) evaluation** samples production traffic and runs evaluators such as groundedness, relevance, task adherence, intent resolution and content-safety; **scheduled red-team scans** probe for jailbreaks and data leakage; **alerts** fire on evaluation failures or anomalies. Content-filter annotations and the *Hate/Sexual/Violence/Self-harm* blocked counts are your safety-event feed; Foundry Control Plane aggregates them across a fleet.

"Drift" on this exam means quality degradation over time: a model version auto-upgrade, changing user intents or stale grounding data. Detect it by comparing evaluator trends week over week, convert problematic traces into evaluation datasets, and pin model versions when stability matters more than freshness.`,
    },
    {
      heading: 'Monitoring ingestion, index health and relevance in Azure AI Search',
      body: `RAG quality decays silently when the index does. Watch three things:

- **Ingestion**: indexer status (In Progress, Success, Failed, Reset) in the portal or \`GET /indexers/{name}/status\`; execution history with per-document errors and warnings; *Max failed items* thresholds; Azure Monitor metrics *Document processed count* and *Skill execution invocation count* split by indexer or skill. Warnings such as "image or PDF contains no text" are common for OCR skills and are not always a problem, but a jump in failed items usually means a schema or permission change at the source. Schedule indexers for incremental refresh and reset them after a skillset change.
- **Index health and capacity**: storage and vector index size against tier limits, replica and partition counts (replicas for query throughput and availability, partitions for storage), search latency and throttled queries (503). Quantization and narrow data types shrink vector footprint.
- **Relevance**: use the **Retrieval** and **Document Retrieval** evaluators (with labelled relevance judgements) and **Groundedness**/**Relevance** on generated answers; log the chosen chunks per query; A/B hybrid vs hybrid plus semantic ranker; inspect agentic retrieval **activity logs** (subqueries, reranked references) to see why a document was or was not retrieved. Stale embeddings after changing the embedding model mean re-indexing, because vectors from different models are not comparable.

For Foundry IQ knowledge bases, the same indexer pipeline runs underneath (data source, skillset, indexer, index), so indexer monitoring still applies, and permission sync (ACLs, Purview labels) is part of ingestion health.`,
    },
    {
      heading: 'Security: identities, keyless access, roles and networking',
      body: `Security items reward "Entra ID everywhere, least privilege, private by default".

**Identity and keyless credentials.** Prefer Microsoft Entra ID over API keys: keys grant full access, cannot be scoped and must be rotated. Set \`disableLocalAuth\` on the resource, use \`DefaultAzureCredential\` locally and **managed identity** in Azure, and use the Azure OpenAI v1 endpoint with a bearer token provider for the \`https://ai.azure.com/.default\` (or \`https://cognitiveservices.azure.com/.default\`) scope. Agents get their own **Entra agent identity** (a special service principal under an agent blueprint) that starts with *no* permissions; you grant it roles on downstream resources (for example Storage Blob Data Reader) and never embed secrets in prompts or tool arguments. Tools can also run **on behalf of the user** (user delegation) when downstream authorization must be per user.

**RBAC.** Foundry roles were renamed in 2026: **Foundry User** (build in a project: create agents, run evaluations, call endpoints), **Foundry Agent Consumer** (only call agent endpoints, least privilege for apps), **Foundry Project Manager** (manage projects and assign Foundry User), **Foundry Account Owner** (create accounts and projects, manage models), **Foundry Owner** (everything). Supporting roles: Cognitive Services OpenAI User for direct Azure OpenAI data-plane calls, Cognitive Services Usages Reader for quota, Search Index Data Reader/Contributor for AI Search, Storage Blob Data Contributor for uploads, Log Analytics Reader for traces, Cost Management Reader for cost. The project managed identity needs Foundry User on the resource. Avoid the legacy *Azure AI Developer* role (hub projects) and other *Cognitive Services* roles for Foundry work.

**Networking.** Inbound: set public network access to Disabled (private endpoint via Private Link) or Selected networks. Outbound: Private Link to Storage, Key Vault, Search and Cosmos DB, and for agents the **standard setup with private networking** injects agent compute into a delegated subnet with no public egress; hosted agents can add network **egress controls** in a guardrail. Customer-managed keys and Key Vault connections cover encryption and secrets. Use **Azure Policy** built-ins (allowed models and deployment types, disabled local auth) and Foundry Control Plane to enforce at scale.`,
    },
  ],
  examples: [
    {
      title: 'Handling 429s and watching quota',
      description:
        'A batch job calling a 50K TPM Global Standard deployment fails intermittently with 429 Too Many Requests. The team adds client-side retry with backoff that honours Retry-After, reads the remaining-token headers, and moves the nightly portion to a Global Batch deployment so the interactive deployment keeps its headroom.',
      language: 'python',
      code: `import time
from openai import OpenAI, RateLimitError
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

token = get_bearer_token_provider(DefaultAzureCredential(), "https://ai.azure.com/.default")
client = OpenAI(base_url="https://contoso.openai.azure.com/openai/v1/", api_key=token)

def ask(prompt: str, attempts: int = 5) -> str:
    for n in range(attempts):
        try:
            r = client.with_raw_response.responses.create(model="gpt-5-mini", input=prompt)
            print("remaining tokens:", r.headers.get("x-ratelimit-remaining-tokens"))
            return r.parse().output_text
        except RateLimitError as e:              # HTTP 429: TPM or RPM exhausted
            wait = float(e.response.headers.get("retry-after", 2 ** n))
            time.sleep(wait)
    raise RuntimeError("quota exhausted after retries")`,
      takeaway: 'Treat 429 as a quota signal: back off using Retry-After, split traffic across deployments or Batch, and request quota increases before launch.',
    },
    {
      title: 'Keyless, least-privilege access for an app and its agent',
      description:
        'A web app calls a prompt agent and the agent reads policy PDFs from Blob Storage. Rather than sharing the resource key, the app\'s managed identity receives Foundry Agent Consumer on the project (it only invokes the endpoint), the developers hold Foundry User, and the agent identity receives Storage Blob Data Reader on the one container it needs. Local auth is disabled on the Foundry resource.',
      language: 'bash',
      code: `# App identity may only call agent endpoints
az role assignment create --assignee $APP_MI_PRINCIPAL_ID \\
  --role "Foundry Agent Consumer" --scope $PROJECT_RESOURCE_ID

# Developers build and evaluate agents
az role assignment create --assignee $DEV_GROUP_ID \\
  --role "Foundry User" --scope $PROJECT_RESOURCE_ID

# The agent's own Entra identity reads one container, nothing else
az role assignment create --assignee $AGENT_IDENTITY_ID \\
  --role "Storage Blob Data Reader" \\
  --scope "$STORAGE_ID/blobServices/default/containers/policies"

# No API keys anywhere
az cognitiveservices account update -n contoso-foundry -g rg-ai \\
  --set properties.disableLocalAuth=true`,
      takeaway: 'Separate the three boundaries (developer, caller, agent-to-resource) and give each identity the narrowest Foundry or data-plane role, with keys disabled.',
    },
    {
      title: 'The silent index regression (a realistic mistake)',
      description:
        'Support-bot answers get vaguer over two weeks. Nobody changed the prompt. The indexer had been failing on 30% of new documents since a SharePoint permission change, and the Groundedness score in continuous evaluation had drifted from 4.6 to 3.1. The fix: alert on indexer failed-item count and Document processed count, fix the data source credential (managed identity), reset and rerun the indexer, and add a weekly Retrieval evaluation with labelled queries so relevance regressions are caught before users notice.',
      language: 'python',
      code: `from azure.search.documents.indexes import SearchIndexerClient
from azure.identity import DefaultAzureCredential

client = SearchIndexerClient(endpoint=SEARCH_ENDPOINT, credential=DefaultAzureCredential())
status = client.get_indexer_status("kb-indexer")
last = status.last_result
print(status.status, last.status, "failed:", last.failed_item_count,
      "succeeded:", last.item_count)
for err in (last.errors or [])[:5]:
    print(err.key, err.error_message)     # e.g. 403 from the data source

if last.failed_item_count > 0:
    client.reset_indexer("kb-indexer")    # reprocess everything after fixing the cause
    client.run_indexer("kb-indexer")`,
      takeaway: 'Grounding quality depends on index health: monitor indexer failures and relevance evaluators continuously, not just model metrics.',
    },
  ],
  keyPoints: [
    'Quota is TPM per subscription, region and model; RPM is derived from TPM; exceeding either returns 429 and clients must back off using Retry-After.',
    'Provisioned throughput gives reserved capacity with spillover to Standard for overflow; Batch halves cost for asynchronous work; prompt caching and smaller models cut token spend.',
    'An AI gateway (API Management via Foundry Control Plane) enforces per-project TPM limits (429) and total token quotas (403).',
    'Azure Monitor metrics and diagnostic logs cover availability and usage; Application Insights traces (OpenTelemetry) cover per-step behaviour; continuous evaluation and red-team scans cover quality and safety.',
    'Detect drift by trending evaluator scores (groundedness, relevance, task adherence) over time and by pinning model versions when stability matters.',
    'Monitor indexers (status, failed items, Document processed count), index capacity (replicas, partitions, vector size) and relevance (Retrieval and Document Retrieval evaluators).',
    'Prefer Entra ID and managed or agent identities over keys; disable local auth; agent identities start with no permissions and are granted least-privilege roles.',
    'Foundry roles: Agent Consumer (call endpoints), User (build), Project Manager, Account Owner, Owner; secure inbound with private endpoints and outbound with Private Link or VNet-injected standard agent setup.',
  ],
  flashcards: [
    { front: 'What HTTP status indicates a TPM or RPM rate limit was exceeded, and how should a client respond?', back: '429 Too Many Requests; wait for the Retry-After interval with exponential backoff, or spread load across deployments and Batch.' },
    { front: 'Which role lets a user view quota usage with minimal access?', back: 'Cognitive Services Usages Reader at subscription scope.' },
    { front: 'What does spillover do for a provisioned deployment?', back: 'Routes requests that would fail with 429 (PTUs exhausted) to a matching Standard deployment, billed at pay-per-token rates.' },
    { front: 'Which Azure Monitor metric best diagnoses time-to-first-token latency?', back: 'Time to Response (AzureOpenAITimeToResponse); pair it with Processed Prompt Tokens to see whether prompt size grew.' },
    { front: 'Where are Foundry agent traces stored and in what format?', back: 'In the Application Insights resource connected to the project, using OpenTelemetry GenAI semantic conventions; searchable in the portal for 90 days.' },
    { front: 'Which two evaluators measure retrieval quality against labelled relevance judgements?', back: 'Retrieval and Document Retrieval evaluators.' },
    { front: 'What is the least-privilege role for an application that only needs to call an agent endpoint?', back: 'Foundry Agent Consumer (not Foundry User).' },
    { front: 'What permissions does a newly created Entra agent identity have?', back: 'None; you grant least-privilege roles on downstream resources explicitly.' },
    { front: 'How do you stop API-key access to a Foundry resource?', back: 'Set disableLocalAuth to true and authenticate with Entra ID (DefaultAzureCredential, managed identity).' },
    { front: 'How does an AI gateway signal a per-project TPM limit versus a total token quota breach?', back: 'TPM limit exceeded returns 429; total quota for the period exceeded returns 403.' },
    { front: 'Why must you re-index after switching embedding models?', back: 'Vectors from different embedding models are not comparable, so existing vectors would return meaningless similarity scores.' },
  ],
  quiz: [
    {
      question:
        'Users report sporadic failures from a 100K TPM Global Standard deployment during peak hours. Logs show HTTP 429 responses. Which TWO actions address the problem? (Select two)',
      options: [
        'Implement retry with exponential backoff that honours the Retry-After header.',
        'Switch the deployment to the Developer type.',
        'Request a quota increase or add a provisioned deployment with spillover for peak traffic.',
        'Disable content filtering to reduce latency.',
      ],
      correct: [0, 2],
      explanation:
        '429 means rate limits were hit; clients should back off and the platform side needs more capacity (quota increase, PTU with spillover). Developer deployments are for fine-tuned model evaluation and content filtering does not affect rate limits.',
    },
    {
      question:
        'A product owner wants to know whether answer quality is degrading in production without reading transcripts. What should you set up?',
      options: [
        'Diagnostic settings sending Audit Logs to a storage account.',
        'Continuous evaluation on sampled production traffic with groundedness and relevance evaluators, plus alerts on the Agent Monitoring Dashboard.',
        'A Global Batch deployment.',
        'A Cost Management budget alert.',
      ],
      correct: [1],
      explanation:
        'Continuous evaluation scores live traffic with evaluators and surfaces trends and alerts. Audit logs, Batch deployments and budgets do not measure answer quality.',
    },
    {
      question:
        'A RAG application\'s answers have become stale. The indexer shows status Success but a high failed-item count under Max failed items. What is the FIRST thing to investigate?',
      options: [
        'The model deployment\'s TPM quota.',
        'The indexer execution history errors for the failing documents (for example data source permission errors).',
        'The content filter severity level.',
        'The number of search replicas.',
      ],
      correct: [1],
      explanation:
        'Per-document errors in execution history explain why items fail (often permissions or schema changes). Quota, content filters and replicas do not cause document ingestion failures.',
    },
    {
      question:
        'A web application\'s managed identity should be able to invoke a published agent but must not be able to modify agents or run evaluations. Which role should you assign at the project scope?',
      options: ['Foundry User', 'Foundry Agent Consumer', 'Foundry Project Manager', 'Cognitive Services OpenAI Contributor'],
      correct: [1],
      explanation:
        'Foundry Agent Consumer grants only agent-endpoint interaction. Foundry User allows building and evaluation, Project Manager can manage projects and assign roles, and the Cognitive Services roles are not intended for Foundry project access.',
    },
    {
      question:
        'Security policy forbids API keys and requires that no agent traffic traverse the public internet. Which combination satisfies the policy?',
      options: [
        'Enable key rotation every 30 days and use Global Standard deployments.',
        'Disable local authentication, use managed and agent identities, and deploy the standard agent setup with private networking (VNet injection and private endpoints).',
        'Store the API key in Azure Key Vault and allow selected IP addresses.',
        'Use Data Zone Standard deployments with public network access enabled.',
      ],
      correct: [1],
      explanation:
        'Keyless Entra authentication plus the private-networking standard setup removes keys and public egress. Rotating or vaulting keys still uses keys, and data-zone deployment types control processing location, not network exposure.',
    },
    {
      question: 'Which metric and signal pair best detects quality drift after a model version auto-upgrade?',
      options: [
        'Processed Prompt Tokens and storage account egress.',
        'Evaluator score trends (for example groundedness) from recurring evaluations compared before and after the upgrade date.',
        'Indexer Document processed count.',
        'Cost Management daily spend.',
      ],
      correct: [1],
      explanation:
        'Drift is a change in output quality; evaluator trends over time reveal it. Token counts, indexer throughput and spend are operational signals that do not measure answer quality.',
    },
  ],
  statements: [
    { text: 'Quota TPM is unrelated to a model\'s maximum input context length.', isTrue: true, explanation: 'TPM governs throughput per minute; context length is a property of the model.' },
    { text: 'Exceeding a project token quota enforced by an AI gateway returns HTTP 429.', isTrue: false, explanation: 'The per-minute TPM limit returns 429; exceeding the total quota for the period returns 403 Forbidden.' },
    { text: 'Server-side tracing for prompt agents requires code changes in the client application.', isTrue: false, explanation: 'Connecting Application Insights to the project enables server-side traces automatically; client-side spans are optional extras.' },
    { text: 'An indexer run can report Success even when some documents failed, as long as failures stay under Max failed items.', isTrue: true, explanation: 'That is why failed-item counts must be monitored separately from the overall status.' },
    { text: 'API keys on a Foundry resource can be scoped to a single project or action.', isTrue: false, explanation: 'Keys grant full resource access without role restrictions; use Entra ID with RBAC for granularity.' },
    { text: 'The legacy Azure AI Developer role is the recommended role for building in Foundry projects.', isTrue: false, explanation: 'It targets hubs and Azure Machine Learning workspaces; use Foundry User or Foundry Owner for Foundry projects.' },
    { text: 'Replicas in Azure AI Search increase query throughput and availability, while partitions add storage.', isTrue: true, explanation: 'Scale replicas for QPS and resilience, partitions for index size.' },
  ],
  resources: [
    { label: 'Manage Azure OpenAI quota', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/quotas-limits' },
    { label: 'Role-based access control for Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry' },
    { label: 'Configure network isolation for Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/foundry/how-to/configure-private-link' },
    { label: 'Monitor agents with the Agent Monitoring Dashboard', url: 'https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard' },
  ],
};

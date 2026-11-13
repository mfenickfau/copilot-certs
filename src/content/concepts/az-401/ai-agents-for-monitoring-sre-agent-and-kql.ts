import type { Concept } from '../../types';

export const aiAgentsForMonitoringSreAgentAndKql: Concept = {
  id: 'ai-agents-for-monitoring-sre-agent-and-kql',
  title: 'Monitoring Azure Workloads with AI Agents: SRE Agent, Observability Agent, Telemetry Analysis and KQL',
  summary:
    'Deploying and configuring the Azure Copilot Observability Agent and Azure SRE Agent, investigating and resolving the issues they raise, and analysing infrastructure indicators (CPU, memory, disk, network), application performance telemetry and distributed traces in Application Insights with natural language and basic Kusto Query Language.',
  certs: ['az-401'],
  domains: ['az-401-5'],
  outcomes: ['az-401-5-2-1', 'az-401-5-2-2', 'az-401-5-2-3', 'az-401-5-3-1', 'az-401-5-3-2', 'az-401-5-3-3', 'az-401-5-3-5'],
  tags: ['azure-sre-agent', 'observability-agent', 'azure-monitor', 'application-insights', 'distributed-tracing', 'kql', 'log-analytics', 'vm-insights', 'aiops'],
  difficulty: 'advanced',
  diagram: 'agentic-loop',
  sections: [
    {
      heading: 'Azure Copilot Observability Agent: deploy and configure',
      body: `The **Azure Copilot Observability Agent** is the AI companion inside **Azure Monitor**. Without any provisioning, users with Azure Copilot access can **chat with their data** (natural-language exploration of logs, metrics and related telemetry, scoped to the resource where you launch it) and run **deep investigations** (a focused, multi-layer analysis of an active problem across application, infrastructure and Azure platform signals that produces findings and recommended next steps, optimised for AKS, Application Insights and virtual machines). Findings can be saved as **Azure Monitor issues** so context survives the session and can be shared.

To go beyond on-demand use you **deploy an Observability Agent resource** (\`Microsoft.Monitor/observabilityAgents\`, public preview; up to five per subscription by default). It gives the agent a durable identity, scope, configuration and governance boundary for **autonomous operations**: correlating fired alerts within the scope into fewer, higher-signal issues and, optionally, running investigations on each issue automatically. Configuration steps in the portal (Observability Agents > Create): subscription and resource group, name, region (same region as the target **Azure Monitor workspace** where issues are stored), a **system-assigned or user-assigned managed identity**, the **monitored Application Insights resource** (one in the portal, up to ten via the API), the autonomous operations toggles (Correlation + issue creation with **custom instructions**, Investigation), notification action groups on the workspace, and tags; templates (ARM or Bicep) are available for IaC pipelines. Identity needs **Issue Contributor** on the workspace and **Monitoring Reader** on every subscription holding alert rules and application resources (Monitoring Contributor at subscription scope is the simple option); creating the resource needs **Monitoring Contributor** on the resource group.

**Custom instructions** (up to 8,192 characters, stored as a resource property, auditable through Azure Resource Graph) encode knowledge telemetry lacks: which services are distinct, which dependencies cascade, which workloads are revenue critical. The agent never restarts resources or changes configuration on its own; humans review the issues it creates. Current limits include English-only support and conversations that cannot continue beyond 24 hours.`,
    },
    {
      heading: 'Azure SRE Agent: deploy and configure',
      body: `**Azure SRE Agent** is the operational agent that investigates incidents and, when allowed, **executes mitigations** across Azure resources, observability tools, incident platforms and source control. Create it from the Azure SRE Agent web experience (**Create agent**: Basics > Review > Deploy) with a subscription, resource group, name, region, **model provider** (varies by region; for example Azure OpenAI or Anthropic) and an Application Insights instance for the agent's own telemetry. Creating it requires Owner, or Contributor plus User Access Administrator, on the target scope; adding Azure scopes requires Owner or User Access Administrator on each scope so the portal can assign roles to the agent's identity. New customers can evaluate it without the always-on charge for the first 30 days.

Deployment creates **two managed identities**: a **user-assigned managed identity (UAMI)** that you manage, assign RBAC roles to and select in connectors, and an internal system-assigned identity. During setup you pick a **permission level** for the UAMI on the chosen resource groups: **Reader** (core monitoring roles plus resource-type reader roles) or **Privileged** (contributor-level roles that allow mitigations); Reader, Log Analytics Reader and Monitoring Reader are always assigned. Then you **connect**: source control (GitHub via a governed GitHub App model or Azure DevOps repositories and work items), telemetry (Azure Monitor, Application Insights, Log Analytics, Azure Data Explorer, partner platforms through **MCP connectors** such as Datadog, Splunk, New Relic, Dynatrace, Elasticsearch), incident platforms (**Azure Monitor alerts**, PagerDuty, ServiceNow) and communications (Teams, Outlook).

Governance is layered: **run modes** are set per incident response plan and per scheduled task (Review mode asks an SRE Agent Administrator to approve Azure write actions; Autonomous mode executes and reports; default to Review for new plans), **tool access policies** (allow, ask, deny per tool at global, custom agent and conversation scope), **agent hooks** (automations after tool runs or when the agent stops), **network isolation** through VNet integration, and Bicep-based deployment of the agent, identity and policies through your normal pipelines. Extension points are skills (runbooks, Azure CLI scripts, a governed private plugin marketplace), custom agents built in the agent builder, Python tools and MCP servers.`,
    },
    {
      heading: 'Investigating and resolving issues raised by SRE Agent',
      body: `The incident flow: an alert fires in Azure Monitor (or PagerDuty or ServiceNow); the agent **acknowledges it and opens an investigation thread** (repeated firings of the same rule merge into one thread); it queries Application Insights, Log Analytics, metrics and connected platforms, **correlates with deployments** from the connected GitHub or Azure DevOps repositories (for example a memory trend that began 40 minutes before the alert and a deployment two hours earlier), forms a **root cause hypothesis**, and **proposes mitigations** such as restarting a pod, adjusting an autoscale threshold or rolling back; it can prefill a ServiceNow or PagerDuty ticket with the investigation summary and an approval action. **Incident response plans** route incidents by filters (severity, resource type, alert rule) to specialist **custom agents** with the right autonomy, so a database incident reaches a database-aware agent in Review mode while a P1 outage on a known pattern runs Autonomous.

Resolving means working the thread: read the cited evidence (every answer is grounded and source-cited), ask follow-up questions in natural language ("what changed in the last hour?"), compare with **memory** of previous investigations (retained root causes, resolution steps and preferences), then **Approve or Deny** the proposed Azure action (only SRE Agent Administrators can approve), or run the mitigation yourself. Close the loop by creating the work item or GitHub issue from the thread for the permanent fix, updating the response plan or custom instructions with what you learned, and reviewing **Live Reports** and the **Operations Hub** for incident value and agent usage. Non-Azure actions (emails, Teams posts, external queries) follow the response plan; use hooks or tool policies to add approval checkpoints to them. The mental model for the exam: run modes decide whether the agent asks, permissions decide whether it can, and both must allow an action for it to happen.`,
    },
    {
      heading: 'Analysing infrastructure and application performance with telemetry',
      body: `Whether a person or an agent does the analysis, the data model is the same.

**Infrastructure indicators.** Azure collects **host metrics** (CPU percentage, network in and out, disk read and write bytes and operations) automatically for VMs and scale sets at no cost; **guest metrics and logs** (available memory, logical disk free space, per-process data) require the **Azure Monitor Agent** with a data collection rule, which VM insights enables and which stores performance counters in the \`Perf\` and \`InsightsMetrics\` tables; the **Dependency agent** adds the process-level **Map**. Baseline with **Azure Monitor Baseline Alerts** and investigate spikes with **Performance Diagnostics**. The analysis pattern: find the saturated resource (CPU above 80% sustained, available memory under 10%, disk queue length or latency, network throttling), correlate with deployments and scaling events, and decide between fixing the workload and resizing.

**Application performance.** **Application Insights** (via the OpenTelemetry Distro or autoinstrumentation) records **requests** (duration, result code), **dependencies** (outbound calls with duration and success), **exceptions**, **traces** (logs), **customMetrics** and **availability** results. Start with Failures and Performance views, then query: p95 request duration by operation, slowest dependencies, exception rate per version, and use **release annotations** to line up regressions with deployments. Add **Smart detection** and alerts for anomalies.

**Agents in the loop.** The Observability Agent's chat and deep investigation and SRE Agent's investigation both run these analyses, explain which signals they considered, and cite the data; Copilot in Azure answers "why is CPU high on vm-web-01?" by pulling metrics and generating KQL. Your job shifts to asking precise questions, validating the cited evidence and encoding what you learn in custom instructions.`,
    },
    {
      heading: 'Distributed tracing and KQL for interrogating logs',
      body: `**Distributed tracing** in Application Insights relies on the correlation model: every telemetry item carries an \`operation_Id\` shared across all components of one logical operation, each request and dependency has its own \`id\`, and a downstream request's \`operation_ParentId\` equals the upstream dependency's \`id\`; W3C Trace Context carries these across services. Two experiences consume it: the **transaction search and end-to-end transaction details** view (a Gantt-style timeline of one operation across components) and **Application Map** (topology with call rates, latency and failure rates per edge). Analysis pattern: find a slow or failed request, open its transaction to see which dependency consumed the time, then query by \`operation_Id\` to pull every trace and exception in that operation.

**Basic KQL** you must read and write: a table name, then a pipeline of operators. \`where\` filters (\`TimeGenerated > ago(1h)\`), \`summarize\` aggregates (\`count()\`, \`avg()\`, \`percentile(duration, 95)\`) \`by\` a column and \`bin(TimeGenerated, 5m)\` for time buckets, \`project\` picks columns, \`extend\` computes new ones, \`top 10 by\` or \`order by\` sorts, \`join\` combines tables, \`render timechart\` charts, \`take 10\` samples, and \`search\` finds text across tables (slow, use sparingly). Key tables: \`requests\`, \`dependencies\`, \`exceptions\`, \`traces\` (Application Insights); \`Perf\`, \`InsightsMetrics\`, \`Heartbeat\`, \`Syslog\`, \`Event\` (VMs); \`AzureDevOpsAuditing\` and custom tables for platform events. **Natural language to KQL** is available through Copilot in Azure in Log Analytics (it generates an example query you can refine), the Observability Agent's chat, and SRE Agent's Kusto tools; review the generated query, check the time range and the table, and save good queries as functions or workbook parameters so the team can reuse them.`,
    },
  ],
  examples: [
    {
      title: 'Observability Agent resource for autonomous alert correlation',
      description:
        'The on-call team receives dozens of individual alerts per incident. They create an Observability Agent resource scoped to the checkout Application Insights resource, with a user-assigned identity holding Monitoring Contributor on the subscription, autonomous correlation and investigation enabled, and custom instructions describing service boundaries. Alerts are grouped into issues in the Azure Monitor workspace and investigations start automatically.',
      language: 'text',
      code: `Custom instructions (excerpt):
- checkout-api and payments-api are separate services; do not merge their alerts into one issue.
- Any alert on sql-shop-prod is revenue-critical: create an issue immediately, severity Sev1.
- cache-redis failures usually cascade into checkout-api 5xx within 2 minutes; treat them as one issue.
- Ignore CPU alerts on the batch node pool between 01:00 and 03:00 UTC (nightly jobs).`,
      takeaway: 'The resource gives the agent identity and scope; custom instructions give it the team knowledge that turns alert noise into a few meaningful issues.',
    },
    {
      title: 'SRE Agent incident response plan in Review mode',
      description:
        'A team connects Azure Monitor alerts, GitHub and Log Analytics to SRE Agent and creates a response plan: alerts with severity Sev1 or Sev2 on resource group rg-shop-prod route to a custom "web-tier-investigator" agent in Review mode. When a memory alert fires, the agent correlates a deployment from two hours earlier, proposes restarting the affected App Service and scaling out, and waits for an SRE Agent Administrator to Approve.',
      language: 'text',
      code: `Thread: High memory on shop-api (alert rule mem-above-85)
  Evidence: performanceCounters shows available MB falling since 09:40; deployment
  run #482 (commit a1b2c3, PR #512 "cache sessions in-process") at 07:55 via GitHub.
  Hypothesis: in-process session cache grows unbounded.
  Proposed action: Restart App Service 'shop-api' (brief downtime 30-60 s) and
  scale out to 3 instances.          [Approve] [Deny]
  Follow-up: open GitHub issue referencing PR #512 for a bounded cache.`,
      takeaway: 'Review mode plus deployment correlation gives you a grounded hypothesis and a reversible first action, with the permanent fix routed back to the repository.',
    },
    {
      title: 'Autonomous mode without permissions discipline (a realistic mistake)',
      description:
        'An operations lead switches every response plan to Autonomous mode and gives the agent’s UAMI the Privileged level on the whole subscription so "it can fix anything". The agent restarts a stateful database VM during a transient alert, causing an outage. The fix: Review mode for production plans until the agent’s behaviour is validated, Privileged only on the resource groups where automated mitigation is acceptable, a tool access policy that denies restart and delete operations on data-tier resources, and an agent hook that posts every proposed action to the incident channel.',
      takeaway: 'Run modes govern asking, permissions govern reach and tool policies govern specific actions; set all three deliberately before granting autonomy.',
    },
    {
      title: 'KQL for performance and trace analysis',
      description:
        'A developer asks Copilot in Azure: "show p95 duration per operation for the checkout API in the last 6 hours and the slowest dependency calls for failed requests". Copilot generates the queries; the developer narrows the time range and keeps them in a workbook.',
      language: 'text',
      code: `// p95 request duration per operation, 15-minute buckets
requests
| where timestamp > ago(6h) and cloud_RoleName == "checkout-api"
| summarize p95 = percentile(duration, 95), count() by name, bin(timestamp, 15m)
| render timechart

// Slowest dependencies inside failed requests (correlate by operation_Id)
requests
| where timestamp > ago(6h) and success == false
| join kind=inner (dependencies | where timestamp > ago(6h)) on operation_Id
| summarize avg(duration1), count() by target, type
| top 10 by avg_duration1 desc

// VM memory pressure from VM insights
InsightsMetrics
| where TimeGenerated > ago(1h) and Namespace == "Memory" and Name == "AvailableMB"
| summarize min(Val) by Computer, bin(TimeGenerated, 5m)`,
      takeaway: 'operation_Id ties requests to dependencies and traces; summarize with bin and percentile turns raw telemetry into a performance picture an agent or a human can act on.',
    },
  ],
  keyPoints: [
    'Observability Agent: chat with data and deep investigations need no provisioning; an Observability Agent resource (Microsoft.Monitor/observabilityAgents, preview) adds managed identity, scope (Application Insights), custom instructions and autonomous alert correlation and investigation that create Azure Monitor issues; it never changes resources itself.',
    'Observability Agent resource prerequisites: Azure Monitor workspace in the same region, Monitoring Contributor on the resource group, identity with Issue Contributor on the workspace and Monitoring Reader on monitored subscriptions.',
    'Azure SRE Agent: create via the SRE Agent portal (Owner or Contributor plus User Access Administrator), choose model provider and region; it gets a UAMI you assign Reader or Privileged permission levels to, connects to Azure Monitor, Log Analytics, Application Insights, GitHub, Azure DevOps, PagerDuty, ServiceNow, Teams and MCP connectors.',
    'SRE Agent governance: run modes per response plan and scheduled task (Review asks an SRE Agent Administrator to approve Azure writes; Autonomous executes), tool access policies (allow, ask, deny), agent hooks, VNet integration, Bicep deployment; both permissions and run mode must allow an action.',
    'Investigate and resolve: read the grounded, cited thread, follow up in natural language, approve or deny proposed mitigations, create the work item for the permanent fix, and feed learnings into response plans, custom instructions and memory.',
    'Infrastructure analysis: host metrics (CPU, network, disk) are free; guest memory and disk space need Azure Monitor Agent (Perf, InsightsMetrics); application analysis uses requests, dependencies, exceptions and traces with release annotations.',
    'Distributed tracing: operation_Id spans the operation, operation_ParentId links to the parent dependency id; use transaction details and Application Map, then query by operation_Id.',
    'Basic KQL: table | where | summarize ... by bin() | project | top | join | render; natural language to KQL via Copilot in Azure, the Observability Agent and SRE Agent, always reviewed before use.',
  ],
  flashcards: [
    { front: 'Which Observability Agent capabilities work without creating any Azure resource?', back: 'Chat with your data and deep investigations (saved as issues); autonomous operations require an Observability Agent resource.' },
    { front: 'What resource type is an Observability Agent and what does it scope to?', back: 'Microsoft.Monitor/observabilityAgents, scoped to an Application Insights resource (one in the portal, up to ten via API) and an Azure Monitor workspace for issues.' },
    { front: 'Which roles does the Observability Agent’s identity need?', back: 'Issue Contributor on the Azure Monitor workspace and Monitoring Reader on subscriptions with alert rules and application resources (or Monitoring Contributor at subscription scope).' },
    { front: 'Does the Observability Agent restart resources or change configuration autonomously?', back: 'No; it correlates alerts, creates issues and investigates, leaving actions to humans.' },
    { front: 'What are the two run modes in Azure SRE Agent and where are they set?', back: 'Review (approval required for Azure write actions) and Autonomous; set per incident response plan and per scheduled task, not at agent level.' },
    { front: 'Who can approve an action proposed by SRE Agent in Review mode?', back: 'Only SRE Agent Administrators.' },
    { front: 'Which identity do you assign RBAC roles to for SRE Agent?', back: 'The agent’s user-assigned managed identity (UAMI); the system-assigned identity is internal.' },
    { front: 'What do the Reader and Privileged permission levels mean for SRE Agent?', back: 'Reader grants monitoring and resource-type reader roles; Privileged adds contributor roles so the agent can execute mitigations.' },
    { front: 'Which Application Insights field is shared by all telemetry in one distributed operation?', back: 'operation_Id (operation_ParentId links a request to the dependency that called it).' },
    { front: 'Which tables hold guest performance counters collected by VM insights?', back: 'Perf and InsightsMetrics.' },
    { front: 'Write KQL for average CPU per computer in 5-minute bins over the last hour.', back: 'Perf | where TimeGenerated > ago(1h) and CounterName == "% Processor Time" | summarize avg(CounterValue) by Computer, bin(TimeGenerated, 5m)' },
    { front: 'Where can you turn a natural-language question into KQL?', back: 'Copilot in Azure within Log Analytics, the Observability Agent chat, and SRE Agent’s Kusto tools.' },
  ],
  quiz: [
    {
      question:
        'Your on-call team receives many individual Azure Monitor alerts per incident and wants an agent to group them into issues automatically and start investigations, while guaranteeing that no resource is modified without a human. What should you deploy?',
      options: [
        'Azure SRE Agent in Autonomous mode',
        'An Observability Agent resource with autonomous correlation and investigation enabled',
        'A Log Analytics workspace with a summary rule',
        'An Azure Monitor action group',
      ],
      correct: [1],
      explanation:
        'The Observability Agent resource correlates alerts into issues and investigates under a controlled-autonomy model that never changes resources. SRE Agent Autonomous mode executes mitigations, and summary rules or action groups do not provide AI correlation.',
    },
    {
      question:
        'When creating an Observability Agent resource, validation fails on the Azure Monitor workspace selection. What is the MOST likely cause?',
      options: [
        'The workspace is in a different region from the agent resource.',
        'The workspace has fewer than five alert rules.',
        'The subscription has no Application Insights resource.',
        'The identity is user-assigned rather than system-assigned.',
      ],
      correct: [0],
      explanation:
        'The Azure Monitor workspace and the agent resource must share a region. Alert rule counts are irrelevant, Application Insights is selected separately, and either identity type is allowed.',
    },
    {
      question:
        'Which TWO prerequisites apply when creating an Azure SRE Agent and granting it access to Azure resources? (Select two)',
      options: [
        'Owner, or Contributor plus User Access Administrator, on the subscription or resource group where the agent is created',
        'Owner or User Access Administrator on each Azure scope you add so roles can be assigned to the agent’s identity',
        'Project Collection Administrator in Azure DevOps',
        'A GitHub Enterprise Cloud licence for every on-call engineer',
      ],
      correct: [0, 1],
      explanation:
        'Both Azure role requirements come from the SRE Agent setup. Azure DevOps and GitHub roles matter only for optional connectors, not for creating the agent.',
    },
    {
      question:
        'SRE Agent proposes restarting a production App Service but no Approve button appears for a team member, while an administrator sees it. Why?',
      options: [
        'The response plan is in Autonomous mode.',
        'Only SRE Agent Administrators can approve actions in Review mode.',
        'The agent lacks the Privileged permission level.',
        'The App Service is not connected through MCP.',
      ],
      correct: [1],
      explanation:
        'Approval is restricted to SRE Agent Administrators. In Autonomous mode there would be no prompt at all, missing permissions would prevent the action rather than hide the button, and MCP connectors are for external platforms.',
    },
    {
      question:
        'A request to the orders API is slow and you need to see which downstream call consumed the time across three services. Which Application Insights capability should you use first?',
      options: ['Live Metrics', 'End-to-end transaction details for the request, correlated by operation_Id', 'Smart detection', 'Usage funnels'],
      correct: [1],
      explanation:
        'The transaction details view shows the timeline of requests and dependencies for one operation. Live Metrics is real-time aggregate data, Smart detection flags anomalies, and funnels analyse user behaviour.',
    },
    {
      question:
        'Which KQL query returns the number of failed requests per operation name in 10-minute intervals for the last day?',
      options: [
        'requests | where timestamp > ago(1d) and success == false | summarize count() by name, bin(timestamp, 10m)',
        'requests | project name | take 10',
        'dependencies | where success == false | render piechart',
        'exceptions | summarize avg(duration) by bin(timestamp, 10m)',
      ],
      correct: [0],
      explanation:
        'The first query filters failures and aggregates by name and time bin. The others sample, chart dependencies or aggregate a column that exceptions do not have.',
    },
  ],
  statements: [
    { text: 'You must create an Observability Agent resource before you can chat with your observability data in Azure Monitor.', isTrue: false, explanation: 'Chat and deep investigations work on demand; the resource is only required for autonomous operations and custom instructions.' },
    { text: 'Observability Agent custom instructions are stored on the resource and are limited to 8,192 characters.', isTrue: true, explanation: 'They are a resource property, auditable through Azure Resource Graph.' },
    { text: 'Azure SRE Agent run modes are configured once at the agent level.', isTrue: false, explanation: 'Run modes are set per incident response plan and per scheduled task.' },
    { text: 'In Review mode, SRE Agent still sends Teams messages and queries external data without an Approve prompt.', isTrue: true, explanation: 'Approve and Deny apply to Azure infrastructure write actions; other actions follow the response plan unless hooks or tool policies add checks.' },
    { text: 'Host-level CPU and network metrics for Azure VMs require installing the Azure Monitor Agent.', isTrue: false, explanation: 'Host metrics are collected automatically; the agent is needed for guest metrics such as memory and logical disk.' },
    { text: 'All telemetry items from one distributed operation share the same operation_Id.', isTrue: true, explanation: 'That is the Application Insights correlation model.' },
    { text: 'The summarize operator with bin() groups results into time intervals in KQL.', isTrue: true, explanation: 'bin(TimeGenerated, 5m) buckets timestamps for aggregation.' },
  ],
  resources: [
    { label: 'Azure Copilot Observability Agent overview', url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/aiops/observability-agent-overview' },
    { label: 'Overview of Azure SRE Agent', url: 'https://learn.microsoft.com/en-us/azure/sre-agent/overview' },
    { label: 'Run modes in Azure SRE Agent', url: 'https://learn.microsoft.com/en-us/azure/sre-agent/run-modes' },
    { label: 'Get started with log queries in Azure Monitor (KQL)', url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/get-started-queries' },
  ],
};

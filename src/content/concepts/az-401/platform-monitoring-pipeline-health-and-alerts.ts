import type { Concept } from '../../types';

export const platformMonitoringPipelineHealthAndAlerts: Concept = {
  id: 'platform-monitoring-pipeline-health-and-alerts',
  title: 'Monitoring the DevOps Platform: Pipeline Health, GitHub Insights, Azure Monitor Integration, Alerts and Copilot Agent Logs',
  summary:
    'Monitoring pipeline health (failure rate, duration, flaky tests) in Azure Pipelines and GitHub Actions, enabling GitHub insights and charts, integrating Azure DevOps and GitHub with Azure Monitor and Log Analytics through audit streaming and telemetry, configuring alerts for pipeline and workflow events, and collecting and managing GitHub Copilot agent logs and session data.',
  certs: ['az-401'],
  domains: ['az-401-5', 'az-401-3'],
  outcomes: ['az-401-5-1-2', 'az-401-5-1-3', 'az-401-5-1-4', 'az-401-3-6-1', 'az-401-5-3-4'],
  tags: ['pipeline-analytics', 'flaky-tests', 'actions-metrics', 'projects-insights', 'audit-streaming', 'log-analytics', 'alerts', 'copilot-logs', 'opentelemetry'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Monitoring pipeline health: failure rate, duration and flaky tests',
      body: `Pipeline health has three vital signs and both platforms expose them natively.

**Azure Pipelines** has an **Analytics** tab per pipeline with **Pipeline pass rate** (trend, top failing tasks and their failed runs), **Pipeline duration** (trend and top tasks by duration) and **Test failures** reports; the default window is 14 days. **Test Analytics** adds pass rate and failing tests per branch, and **flaky test management** detects tests that pass and fail on the same code (system detection by rerun, or custom detection), marks them so results are tagged across pipelines for the branch, optionally **excludes flaky failures from the pass or fail decision**, and lets you create bugs and manually mark or unmark tests. Dashboard widgets (Build History, Test Results Trend, Deployment status) put the same signals in front of the team. The data is also queryable through the Analytics OData feed (PipelineRuns, TestRuns) for Power BI.

**GitHub Actions** has **usage metrics** (minutes per workflow, job, repository, runtime OS and runner type) and **performance metrics** (average run time, average queue time, failure rate per workflow, job, repository and runner type) at organization and repository level under Insights > Actions; organization owners can delegate access with the "View organization Actions metrics" custom role permission. Workflow run history, job logs and the re-run failed jobs option support diagnosis, and the GitHub MCP server lets Copilot read a failing run and explain it.

Health targets to track: pass rate on main (aim above 95%), p50 and p95 duration, queue time (a capacity signal), number of flaky tests and their age. A sustained drop in pass rate with the same top failing task is a code or infrastructure problem; a scatter of unrelated failures is flakiness or capacity.`,
    },
    {
      heading: 'GitHub insights and charts',
      body: `GitHub offers several "insights" surfaces and the exam expects you to pick the right one:

- **Projects insights**: in a Project, the Insights tab lets you create **current charts** (snapshot of items grouped by assignee, status, iteration, label, with filters) and **historical charts** (items over time, including the default **Burn up** chart; set the X-axis to Time). Insights ignore archived and deleted items. Historical charts are an organization-plan feature.
- **Repository Insights**: Pulse, Contributors, Community, Commits, Code frequency, Dependency graph (including Dependabot), Network and Forks, plus the **Actions** usage and performance metrics described above.
- **Organization Insights**: Dependency insights (vulnerabilities and licences across repositories), Actions metrics, and on Enterprise Cloud the security overview and **Copilot usage metrics** (adoption, acceptance, code review and agent usage, also available through the Copilot usage metrics REST API).
- **Enterprise AI controls**: active and recent **agent sessions** across the enterprise with filters, and links to audit logs for agentic activity.

Configuring a chart means choosing the project, applying a filter (for example \`is:issue label:bug -status:Done\`), picking the chart type and layout, and saving it so the team shares it. For delivery metrics across GitHub and Azure, many teams export Projects data through the GraphQL API or the Actions metrics into Log Analytics or Power BI to sit beside Azure Boards Analytics, which is where the next section comes in.`,
    },
    {
      heading: 'Integrating Azure DevOps and GitHub with Azure Monitor and Log Analytics',
      body: `Azure Monitor becomes the shared observability plane when DevOps platform events land in a **Log Analytics workspace**:

- **Azure DevOps auditing streams** (Organization settings > Auditing > Streams; auditing must be enabled by a Project Collection Administrator) send audit events every half hour or less to **Azure Monitor Logs** (table \`AzureDevOpsAuditing\`), **Splunk** or **Azure Event Grid**. In Log Analytics you can query who changed a pipeline, policy or permission, build workbooks and alert rules, and connect Microsoft Sentinel.
- **GitHub enterprise audit log streaming** (Enterprise Cloud) sends audit and Git events to **Azure Event Hubs**, **Azure Blob Storage**, Splunk, Datadog, Amazon S3 or Google Cloud Storage; from Event Hubs a Logic App, Function or the Sentinel GitHub connector writes to Log Analytics. Copilot agent session events can be included in streaming (public preview for EMU and data-residency enterprises).
- **Pipeline and workflow telemetry**: Azure Pipelines **service hooks** can post to Azure Monitor through a webhook to a Logs ingestion endpoint or to Event Grid; GitHub webhooks (\`workflow_run\`, \`deployment_status\`) do the same. Release annotations in **Application Insights** mark deployments on performance charts so incidents can be correlated with releases, which Azure SRE Agent also uses.
- **Deployment gates in reverse**: the Query Azure Monitor alerts check reads Azure Monitor from the pipeline; the integrations above let Azure Monitor read the pipeline.

Once the data is in a workspace, the same KQL, workbooks, dashboards and alert rules apply to platform events as to application telemetry, and Copilot in Azure can generate the queries ("show failed pipeline runs by project in the last 7 days from AzureDevOpsAuditing").`,
    },
    {
      heading: 'Configuring alerts for Azure Pipelines and GitHub Actions events',
      body: `Alerting choices by scope:

| Need | Azure Pipelines | GitHub Actions |
|---|---|---|
| Notify the team when a pipeline fails | **Team or project notification subscription** on "Build completes" filtered to Failed (email); **service hook** to Teams, Slack or a webhook | **Notifications for workflow runs** (email or web for runs you triggered, optionally only failures); GitHub app for Teams or Slack subscribed to the repository; a final job with \`if: failure()\` posting to a channel |
| Notify on deployment or approval events | Service hooks for release and stage events; approval emails from environment Approvals checks | Environment required-reviewer notifications; \`deployment_status\` webhooks |
| Alert on trends (failure rate above X, queue time above Y) | Analytics data exported to Log Analytics or Power BI with **Azure Monitor log alert rules** on the workspace | Actions metrics exported (API or stream) to Log Analytics with alert rules |
| Alert on security or governance events | Audit streaming to Log Analytics with alert rules (for example pipeline permission changes), Advanced Security alert notifications | Audit log streaming to SIEM, \`code_scanning_alert\` and \`secret_scanning_alert\` webhooks, Dependabot notifications |

Azure Monitor **alert rules** (log search alerts on KQL results, with action groups delivering email, SMS, Teams via webhook, ITSM, Logic Apps or Azure Functions) give a single alerting model across platform and application events. Design guidance: alert people on actionable conditions (production deploy failed, main pipeline red for 2 runs, queue time above 10 minutes), send everything else to dashboards, and route alerts through action groups so on-call rotations are maintained in one place. For agentic operations, the same alerts can trigger Azure SRE Agent or an agentic workflow to begin an investigation.`,
    },
    {
      heading: 'Collecting and managing GitHub Copilot agent logs',
      body: `Agent activity needs the same observability as pipelines, and GitHub provides it at four layers:

1. **Session logs**: every Copilot cloud agent session has a log (reasoning, tools used, tests run, token usage and session length) in the Agents tab or github.com/copilot; each commit links to its session log, so a reviewer or auditor can trace why a change was made. Sessions can be steered, stopped and archived (not deleted); sessions on GitHub Actions are shared with everyone who can read the repository, cloud sandbox sessions are private by default. Local sessions (Copilot CLI, Copilot app) are stored under \`~/.copilot/session-state/\` and synced to the account when the "Store local sessions in the Cloud" policy allows.
2. **Audit log**: enterprise and organization audit logs record Copilot settings and licence changes (\`action:copilot\`) and agent activity on GitHub (\`actor:Copilot\`), retained 180 days; stream to a SIEM for longer retention and alerting. The audit log does **not** contain local prompts.
3. **Enterprise AI controls**: a view of active and recent agent sessions across the enterprise (last 24 hours) with filters, plus links to agentic audit events; policies to block agentic features where required.
4. **OpenTelemetry export**: enterprise managed settings can send Copilot client telemetry to an OTel collector (\`telemetry.enabled\`, \`endpoint\`, \`protocol\`) with per-class **capture** controls; identity capture adds account and machine identity without content, and additional classes (prompts, responses, tools) are off by default and should be enabled only for an audit with an approved collector.

Management decisions: retention of session data and exported telemetry (it can contain source code), who may view shared sessions, whether session syncing is allowed, and which capture classes are legal in your jurisdiction. Combined with GitHub Actions logs for Actions-based sessions and Copilot usage metrics for adoption, this is the "collection and management" of Copilot agent logs the exam refers to.`,
    },
  ],
  examples: [
    {
      title: 'Alerting on pipeline failures from Log Analytics',
      description:
        'A platform team wants one alerting model. They stream Azure DevOps auditing to Log Analytics and forward GitHub workflow_run webhooks into a custom table through a Logic App, then create log alert rules with an action group that pages the on-call engineer and posts to Teams.',
      language: 'text',
      code: `// Failed workflow runs on main in the last hour (custom table from webhook ingestion)
GitHubWorkflowRuns_CL
| where TimeGenerated > ago(1h)
| where conclusion_s == "failure" and head_branch_s == "main"
| summarize failures = count() by repository_s, workflow_name_s
| where failures >= 2

// Who changed pipeline permissions this week (Azure DevOps auditing)
AzureDevOpsAuditing
| where TimeGenerated > ago(7d)
| where Area == "Pipelines" and ActionId has "Permission"
| project TimeGenerated, ActorDisplayName, Details, ProjectName`,
      takeaway: 'Once platform events are in Log Analytics, KQL alert rules and action groups give pipelines the same alerting as production workloads.',
    },
    {
      title: 'A Projects historical chart for flow of work',
      description:
        'A team lead wants to see whether open bugs are shrinking sprint over sprint. In the Project’s Insights tab she creates a historical chart with X-axis Time, Y-axis count of items, grouped by Status, filtered to is:issue label:bug, and saves it next to the default Burn up chart so the team reviews both in sprint review.',
      takeaway: 'Current charts answer "how is work distributed now"; historical charts with Time on the X-axis answer "is it trending the right way".',
    },
    {
      title: 'The pass rate that hid a flaky test (a realistic mistake)',
      description:
        'A team re-runs failed jobs until they pass and reports a 98% success rate. Pipeline analytics shows the top failing task is the integration test step and Test Analytics reveals one test failing 20% of the time on identical code. Rather than keep re-running, they enable flaky test management with system detection, choose to exclude flaky failures from the pass decision, create a bug, and alert when the count of flaky tests rises above five. Pipeline duration also falls because fewer full re-runs are needed.',
      takeaway: 'Measure flakiness explicitly instead of masking it with re-runs; manage it as inventory with an owner and a trend alert.',
    },
    {
      title: 'Governing Copilot agent telemetry with enterprise managed settings',
      description:
        'A regulated enterprise needs to attribute agent sessions to users for audit, without collecting prompts or source code. They enable OpenTelemetry export to an approved collector with identity capture only, stream the enterprise audit log to their SIEM for the actor:Copilot events, and set session-data retention in the collector to 90 days.',
      language: 'json',
      code: `{
  "telemetry": {
    "enabled": true,
    "endpoint": "https://otel-collector.contoso.internal",
    "protocol": "http/protobuf",
    "capture": {
      "identity": true
    }
  }
}`,
      takeaway: 'Capture classes default to off; enable identity for attribution and add content classes only for a specific, approved investigation.',
    },
  ],
  keyPoints: [
    'Azure Pipelines Analytics reports pass rate (with top failing tasks), duration (top tasks by duration) and test failures; flaky test management detects, tags, optionally excludes flaky results from pass or fail, and tracks resolution.',
    'GitHub Actions usage metrics show minutes by workflow, job, repository, OS and runner type; performance metrics show average run time, queue time and failure rate; access via Insights > Actions or a custom organization role.',
    'GitHub Projects insights provide current charts (snapshot) and historical charts (over time, Burn up by default); repository, organization and enterprise Insights cover dependencies, Actions, security and Copilot usage.',
    'Azure DevOps auditing streams to Azure Monitor Logs (AzureDevOpsAuditing table), Splunk or Event Grid; GitHub enterprise audit logs stream to Azure Event Hubs, Blob Storage, Splunk, Datadog, S3 or GCS; webhooks and service hooks carry run and deployment events; release annotations mark deployments in Application Insights.',
    'Alerts: Azure DevOps notification subscriptions (personal, team, project, global) and service hooks; GitHub workflow-run notifications, Teams or Slack apps and failure jobs; Azure Monitor log alert rules with action groups for trend- and audit-based alerting across both platforms.',
    'Copilot agent logs: session logs linked from commits, enterprise audit log (action:copilot, actor:Copilot; 180 days, stream to SIEM), AI controls agent session view, and OpenTelemetry export with per-class capture controls.',
    'Govern retention, sharing and capture of agent session data because it can contain prompts and source code.',
  ],
  flashcards: [
    { front: 'Where do you find pass rate, duration and test failure trends for an Azure Pipeline?', back: 'The pipeline’s Analytics tab (Pipeline pass rate, Pipeline duration and Test failures reports).' },
    { front: 'What does Azure Pipelines flaky test management do when a test is marked flaky?', back: 'Tags its results across pipelines for the branch and can exclude its failures from the pass or fail decision while a bug is tracked.' },
    { front: 'Which GitHub metrics show queue time and failure rate per workflow?', back: 'GitHub Actions performance metrics (Insights > Actions).' },
    { front: 'How do you create a chart that shows project items over time in GitHub Projects?', back: 'In Insights, create a historical chart with the X-axis set to Time (the default Burn up chart is one).' },
    { front: 'Which Log Analytics table receives Azure DevOps audit events?', back: 'AzureDevOpsAuditing.' },
    { front: 'Name the Azure targets for GitHub enterprise audit log streaming.', back: 'Azure Event Hubs and Azure Blob Storage (plus Splunk, Datadog, Amazon S3 and Google Cloud Storage).' },
    { front: 'Who receives GitHub notifications for a scheduled workflow’s runs?', back: 'The user who last modified the cron schedule (or re-enabled the workflow).' },
    { front: 'How long does the GitHub audit log retain events and how do you keep them longer?', back: '180 days; stream to a SIEM or storage for longer retention.' },
    { front: 'Which audit log search shows agent activity performed by Copilot?', back: 'actor:Copilot (action:copilot shows Copilot settings and licence events).' },
    { front: 'How are Copilot client telemetry events exported for enterprise monitoring?', back: 'Through OpenTelemetry configured in enterprise managed settings, with capture classes (identity, prompts, responses, tools) that default to off.' },
    { front: 'Can the Copilot cloud agent sessions be deleted?', back: 'No, they can be archived but not deleted; only local sessions can be deleted.' },
  ],
  quiz: [
    {
      question:
        'A release manager wants to know which pipeline task causes most failures on main over the last two weeks. Where should she look first?',
      options: ['The Azure Boards Velocity widget', 'The pipeline’s Analytics tab, Pipeline pass rate report', 'Organization auditing', 'The Azure Artifacts feed statistics'],
      correct: [1],
      explanation:
        'The pass rate report lists top failing tasks with links to failed runs over a configurable window (14 days by default). Velocity, auditing and feed statistics do not describe task failures.',
    },
    {
      question:
        'Security requires that any change to Azure DevOps pipeline permissions raises an alert within an hour and that the events are retained for a year. What should you configure?',
      options: [
        'A team notification subscription for build completion',
        'Audit streaming to Azure Monitor Logs with a log alert rule on AzureDevOpsAuditing and workspace retention set to 365 days',
        'A service hook to Microsoft Teams for work item updates',
        'Pipeline analytics with a 14-day window',
      ],
      correct: [1],
      explanation:
        'Audit streaming delivers events to Log Analytics in near real time, alert rules fire on KQL conditions and workspace retention handles the year. Notifications, Teams hooks for work items and analytics do not cover permission changes.',
    },
    {
      question:
        'Which TWO GitHub features provide metrics about workflow efficiency such as queue time and failure rate? (Select two)',
      options: ['GitHub Actions performance metrics at organization level', 'GitHub Actions performance metrics at repository level', 'Projects historical charts', 'Dependency graph'],
      correct: [0, 1],
      explanation:
        'Performance metrics exist at both organization and repository level. Projects charts track work items, and the dependency graph tracks packages.',
    },
    {
      question:
        'A team wants to visualise whether the number of open bugs in their GitHub Project is decreasing over time. What should they create?',
      options: ['A current chart grouped by assignee', 'A historical chart with the X-axis set to Time and a filter for open bugs', 'A repository Pulse view', 'An Actions usage metrics report'],
      correct: [1],
      explanation:
        'Historical charts plot items over time. Current charts are snapshots, Pulse summarises repository activity, and usage metrics concern Actions minutes.',
    },
    {
      question:
        'An auditor asks for evidence of which Copilot cloud agent session produced a specific commit and what tools the agent used. What should you provide?',
      options: [
        'The GitHub Actions usage metrics for the repository',
        'The session log linked from the commit message, which records the agent’s reasoning and tool usage',
        'The Dependabot alert history',
        'The Copilot usage metrics API output',
      ],
      correct: [1],
      explanation:
        'Each Copilot commit links to its session log containing reasoning and tool calls. Usage metrics and Dependabot data do not trace individual changes.',
    },
    {
      question:
        'A regulated enterprise must attribute Copilot CLI agent activity to users centrally without collecting prompts or code. Which configuration is appropriate?',
      options: [
        'Enable OpenTelemetry export in enterprise managed settings with only the identity capture class enabled',
        'Enable all capture classes and store the data in a shared repository',
        'Rely on the GitHub audit log, which contains local prompts',
        'Disable session syncing for all users',
      ],
      correct: [0],
      explanation:
        'Identity capture adds attribution without content. Enabling all classes over-collects, the audit log does not include local prompts, and disabling syncing removes visibility rather than adding attribution.',
    },
  ],
  statements: [
    { text: 'Azure Pipelines flaky test management can prevent flaky failures from failing the pipeline while still reporting them.', isTrue: true, explanation: 'You can choose to exclude flaky test failures from the pass or fail decision.' },
    { text: 'GitHub Actions usage metrics show average queue time per job.', isTrue: false, explanation: 'Queue time is a performance metric; usage metrics show minutes consumed.' },
    { text: 'Azure DevOps audit events can be streamed to Azure Monitor Logs and queried in the AzureDevOpsAuditing table.', isTrue: true, explanation: 'Azure Monitor Logs is one of the three stream targets.' },
    { text: 'The GitHub enterprise audit log records the prompts users send to Copilot in their IDE.', isTrue: false, explanation: 'Client session data is not in the audit log; OpenTelemetry export or custom hooks are needed for that.' },
    { text: 'GitHub Projects insights include items that have been archived.', isTrue: false, explanation: 'Insights do not track archived or deleted items.' },
    { text: 'Azure Monitor log alert rules can trigger action groups that notify Teams, run Logic Apps or page on-call engineers.', isTrue: true, explanation: 'Action groups support email, SMS, voice, webhooks, Logic Apps, Functions and ITSM connectors.' },
    { text: 'Copilot cloud agent sessions that run on GitHub Actions are visible to anyone with access to the repository.', isTrue: true, explanation: 'Actions-based cloud sessions are shared by default; cloud sandbox sessions are private by default.' },
  ],
  resources: [
    { label: 'Pipeline reports and analytics (Azure Pipelines)', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/reports/pipelinereport' },
    { label: 'Set up an audit stream (Azure DevOps)', url: 'https://learn.microsoft.com/en-us/azure/devops/organizations/audit/auditing-streaming' },
    { label: 'About insights for Projects (GitHub)', url: 'https://docs.github.com/en/issues/planning-and-tracking-with-projects/viewing-insights-from-your-project/about-insights-for-projects' },
    { label: 'Monitoring agentic activity in your enterprise (GitHub Copilot)', url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/monitor-agentic-activity' },
  ],
};

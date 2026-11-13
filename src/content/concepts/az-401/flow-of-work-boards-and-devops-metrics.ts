import type { Concept } from '../../types';

export const flowOfWorkBoardsAndDevopsMetrics: Concept = {
  id: 'flow-of-work-boards-and-devops-metrics',
  title: 'Flow of Work, Azure Boards Traceability and DevOps Metrics',
  summary:
    'How to structure plan-build-deploy-operate as one traceable flow in Azure Boards and GitHub, design feedback loops and notifications, translate business KPIs into DORA and flow metrics, and build the queries and dashboards (with AI help) that prove the metrics are moving.',
  certs: ['az-401'],
  domains: ['az-401-1', 'az-401-5'],
  outcomes: ['az-401-1-1-1', 'az-401-1-1-2', 'az-401-1-1-3', 'az-401-1-1-4', 'az-401-1-2-1', 'az-401-1-2-2', 'az-401-5-1-1'],
  tags: ['azure-boards', 'dora-metrics', 'traceability', 'dashboards', 'wiql', 'analytics', 'feedback-loops'],
  difficulty: 'intermediate',
  diagram: 'agentic-sdlc',
  sections: [
    {
      heading: 'One flow: plan, build, deploy, operate',
      body: `AZ-401 treats DevOps as a single loop rather than four departments. **Plan** produces work items (Azure Boards) or issues (GitHub). **Build** turns them into branches, pull requests and pipeline runs. **Deploy** promotes an artifact through environments with approvals. **Operate** generates telemetry, alerts and incidents that become new work items, closing the loop.

Designing the structure means deciding, for each phase, *what the unit of work is* and *how it links to the next phase*:

| Phase | Unit of work | Link to the next phase |
|---|---|---|
| Plan | Epic > Feature > User Story / PBI > Task, plus Bugs | Branch created from the work item; AB#123 in commits |
| Build | Branch, pull request, pipeline run | PR requires a linked work item; build publishes tests and coverage |
| Deploy | Stage, environment, release | Deployment status visible on the work item; release notes generated from linked items |
| Operate | Alert, incident, Azure Monitor issue | Bug or work item created from the incident, linked to the deployment |

The agentic twist is that AI participates in each phase: Copilot drafts the user story acceptance criteria, the Copilot cloud agent turns a work item into a pull request (directly from Azure Boards), Copilot code review comments on the PR, and Azure SRE Agent investigates the incident. Every one of those contributions must still be traceable to a human-owned work item. If you cannot answer "which requirement caused this change and which deployment shipped it?", the flow design is incomplete.`,
    },
    {
      heading: 'Designing feedback cycles and notifications',
      body: `A feedback cycle is a loop that returns information to the person who can act on it, fast enough to matter. Design them deliberately at three speeds:

- **Seconds to minutes**: PR build validation, Copilot code review, status checks. Feedback goes to the author in the PR.
- **Hours**: pipeline failure and flaky-test reports, deployment approvals, canary health checks. Feedback goes to the team channel.
- **Days to weeks**: sprint review, DORA trend, escaped defects, cost reports. Feedback goes to the dashboard and retrospective.

In **Azure DevOps**, notifications are subscriptions at four scopes: **personal**, **team**, **project** and **global (organization)**. Team and project subscriptions need Team Administrator or Project Administrator rights; global ones need Project Collection Administrator. Typical designs: a team subscription for "build fails on main", a personal default for "I am added as a reviewer", and **service hooks** that post to Microsoft Teams, Slack, a webhook, Azure Service Bus or Grafana when a release completes. In **GitHub**, users receive workflow-run notifications for runs they triggered; scheduled-workflow notifications go to whoever last touched the cron line. Team-wide alerting uses the GitHub app for Teams or Slack, webhooks, or a step with \`if: failure()\` that posts to a channel.

The rule of thumb the exam rewards: route noise to dashboards and signal to people. Everyone subscribed to everything is the same as nobody subscribed to anything.`,
    },
    {
      heading: 'Tracking work and traceability in Azure Boards',
      body: `Azure Boards tracking starts with the **process**: Basic (Issue/Task), Agile (User Story), Scrum (Product Backlog Item) or CMMI (Requirement). Each project uses one process; inherited processes let you add fields, states and rules without losing upgrades. Below the process you shape **area paths** (what the work is about, usually one per team or component) and **iteration paths** (when). Each team owns a backlog, a board, sprints and dashboards; when you create a team you can generate its area path automatically.

Traceability is built from links:

- **Repositories**: create a branch from a work item, or mention \`AB#123\` in a commit message or PR description once the project is connected to GitHub. Branch policies can require a linked work item before a PR completes.
- **Bugs**: decide whether bugs appear on the backlog as requirements, as tasks, or not at all (a team setting). Link bugs to the commit that fixed them and to the test case that caught them.
- **Quality**: pipeline runs publish test results and code coverage; failed tests can create bugs automatically; Test Plans link test cases to requirements so a requirement shows its test status.
- **Deployments**: with the GitHub or Azure Pipelines connection, a work item shows the stages it has been deployed to.

GitHub offers the same ideas with different names: issues, \`Fixes #45\` in a PR to close an issue on merge, Projects for planning, and the dependency graph and code scanning for quality. The Azure Boards app for GitHub lets you keep planning in Boards while code lives in GitHub, and it now also lets you send a work item to the Copilot cloud agent to open a pull request.`,
    },
    {
      heading: 'From business KPIs to success metrics',
      body: `Business KPIs ("increase conversion", "reduce incidents that reach customers") are outcomes you cannot deploy. Success metrics are the leading indicators each DevOps phase can actually move, with a standard (target) attached.

| Business KPI | Phase | Success metric | Standard |
|---|---|---|---|
| Ship features faster | Planning / development | Lead time for changes, cycle time, WIP | Cycle time under 5 days; WIP limit per column |
| Fewer customer-facing defects | Testing | Change failure rate, test pass rate, escaped defects | Change failure rate under 15%; zero failing required checks |
| Predictable releases | Delivery | Deployment frequency, pipeline pass rate and duration | Deploy to production daily; p95 pipeline under 20 minutes |
| Reliable service | Operations | Mean time to recovery (MTTR), SLO attainment | Restore within 1 hour; 99.9% availability |
| Secure by default | Security | Mean time to remediate critical alerts, secrets blocked at push | Critical alerts fixed within 7 days |

The first four operational metrics are the **DORA** measures (deployment frequency, lead time for changes, change failure rate, time to restore). Flow metrics come from Boards: **lead time** is created-to-completed, **cycle time** is first In Progress-to-completed, and the **cumulative flow diagram** shows where work queues. A good dashboard puts flow (CFD, Lead Time, Cycle Time, Velocity widgets), delivery (Build History, Deployment status, Test Results Trend) and recovery (an Azure Monitor alert count or MTTR chart) on one page per team, because a metric nobody looks at is not a feedback loop.`,
    },
    {
      heading: 'Implementing the queries with AI assistance',
      body: `Three query languages appear in this exam, and Copilot can draft all of them when you give it the schema and the question:

- **WIQL** (Work Item Query Language) for Boards queries: \`SELECT [System.Id] FROM WorkItems WHERE [System.WorkItemType] = 'Bug' AND [System.State] <> 'Closed'\`. Queries power the Query Results widget, charts and the Query Tile.
- **OData against Analytics** for trends across time (WorkItemSnapshot, PipelineRuns, TestRuns). This is what Analytics views and the Power BI connector use.
- **KQL** against Log Analytics for deployment and incident data (for example, \`AzureDevOpsAuditing\` from audit streaming, or your own deployment markers).

The **Azure DevOps MCP server** (remote endpoint \`https://mcp.dev.azure.com/{organization}\`) gives Copilot Chat or any MCP-aware agent tools such as listing work items in the current iteration, searching work items, reading pipeline runs and querying test plans. In practice you ask "which bugs opened this sprint are linked to deployments in the last 7 days?" and the agent composes the calls. Treat generated queries like generated code: check the field names against your process, run them on a small date range first, and pin the final query in a shared query folder so the dashboard is reproducible. On the exam, "AI-assisted" means Copilot or an MCP tool drafts and runs the query; it never means the metric definition is left to the model.`,
    },
  ],
  examples: [
    {
      title: 'Turning a KPI into a dashboard',
      description:
        'Contoso leadership asks the platform team to "reduce the time between a customer reporting a defect and the fix being live". The team maps this to two metrics: cycle time for work items tagged Customer-Reported, and deployment frequency to production. They build a team dashboard with the Cycle Time widget filtered to that tag, a Deployment status widget for the production stage and a Query Tile counting open customer-reported bugs older than 14 days, and they set the standard at 7 days median cycle time.',
      takeaway: 'A KPI becomes actionable when it is decomposed into phase-level metrics with a target and a widget someone owns.',
    },
    {
      title: 'Copilot drafts the WIQL',
      description:
        'A scrum master asks Copilot Chat, with the Azure DevOps MCP server connected: "List bugs in the Payments area created in the last 30 days that have no linked pull request." Copilot proposes the query, runs it through the MCP work item search tool, and offers to save it as a shared query for the Query Results widget.',
      language: 'text',
      code: `SELECT [System.Id], [System.Title], [System.State], [System.CreatedDate]
FROM WorkItems
WHERE [System.WorkItemType] = 'Bug'
  AND [System.AreaPath] UNDER 'Contoso\\Payments'
  AND [System.CreatedDate] >= @Today - 30
  AND [System.ExternalLinkCount] = 0
ORDER BY [System.CreatedDate] DESC`,
      takeaway: 'Let the agent draft and execute the query, but verify field names (such as ExternalLinkCount for GitHub links) against your process before you trust the number.',
    },
    {
      title: 'The velocity trap (a realistic mistake)',
      description:
        'A team reports rising velocity every sprint, yet releases slip. Their dashboard shows only the Velocity and Sprint Burndown widgets. Adding a Cumulative Flow Diagram reveals a growing "Ready for test" band: work is finished by developers but queues for days because test environments are shared. The fix is a WIP limit on the testing column, a Cycle Time widget as the headline metric, and a pipeline change that provisions ephemeral test environments so the queue drains.',
      takeaway: 'Velocity measures output, not flow; cycle time and the CFD expose the queue that is actually delaying value.',
    },
    {
      title: 'Designing notifications that reach the right person',
      description:
        'After a production incident nobody noticed a failed nightly deployment for two days. The release engineer creates a team subscription in Azure DevOps for "Build completes: failed" on the deployment pipeline, a service hook that posts release failures to the on-call Teams channel, and leaves individual developers with only the default personal subscriptions (PR reviewer assigned, my build fails). In GitHub she adds a final job to the release workflow that runs on failure and posts to the same channel.',
      language: 'yaml',
      code: `# GitHub Actions: alert the channel only when the deploy job failed
  notify:
    needs: deploy
    if: \${{ failure() }}
    runs-on: ubuntu-latest
    steps:
      - name: Post to Teams
        run: |
          curl -s -X POST "$TEAMS_WEBHOOK" -H 'Content-Type: application/json' \\
            -d '{"text":"Release failed: \${{ github.repository }} run \${{ github.run_id }}"}'
        env:
          TEAMS_WEBHOOK: \${{ secrets.TEAMS_WEBHOOK }}`,
      takeaway: 'Scope notifications to the audience that can act: team subscriptions and channel hooks for shared failures, personal subscriptions for individual work.',
    },
  ],
  keyPoints: [
    'Design plan, build, deploy and operate as one loop where every artifact links back to a work item or issue and forward to a deployment and its telemetry.',
    'Azure Boards structure: one process per project (Basic, Agile, Scrum, CMMI), area paths for what, iteration paths for when, and a backlog, board and dashboard per team.',
    'Traceability levers: branch from work item, AB#123 mentions, branch policies requiring linked work items, published test results and coverage, and deployment status on work items.',
    'Notifications have four scopes in Azure DevOps (personal, team, project, global); service hooks push events to Teams, Slack, webhooks and other services; GitHub notifies the user who triggered a run.',
    'DORA metrics (deployment frequency, lead time for changes, change failure rate, time to restore) plus flow metrics (lead time, cycle time, WIP, CFD) are how business KPIs become engineering targets.',
    'Lead time is created-to-completed; cycle time is first In Progress-to-completed. Both have dashboard widgets backed by Analytics.',
    'Queries live in WIQL (Boards), OData (Analytics) and KQL (Log Analytics); Copilot and the Azure DevOps MCP server can draft and run them, but humans own the metric definition.',
  ],
  flashcards: [
    { front: 'Name the four DORA metrics.', back: 'Deployment frequency, lead time for changes, change failure rate, and time to restore service (MTTR).' },
    { front: 'In Azure Boards, what is the difference between lead time and cycle time?', back: 'Lead time runs from work item creation to completion; cycle time runs from the first In Progress state to completion.' },
    { front: 'Which Azure Boards artifact decides whether a team uses User Stories or Product Backlog Items?', back: 'The process (Agile uses User Stories, Scrum uses PBIs, CMMI uses Requirements, Basic uses Issues).' },
    { front: 'How do you link a GitHub commit or PR to an Azure Boards work item?', back: 'Connect the project to the GitHub repository and mention AB#<id> in the commit message or PR description; "Fixes AB#123" can also transition the item.' },
    { front: 'What are the four notification subscription scopes in Azure DevOps?', back: 'Personal, team, project and global (organization-level).' },
    { front: 'Which dashboard widget shows where work is queuing between columns?', back: 'The Cumulative Flow Diagram (CFD).' },
    { front: 'What query language do Azure Boards queries and the Query Results widget use?', back: 'WIQL (Work Item Query Language).' },
    { front: 'Which data source feeds Analytics views, the Power BI connector and trend widgets?', back: 'Azure DevOps Analytics, queried with OData.' },
    { front: 'What is the remote endpoint of the Azure DevOps MCP server?', back: 'https://mcp.dev.azure.com/{organization} (streamable HTTP, Microsoft Entra authentication).' },
    { front: 'Who can create a team-scoped notification subscription?', back: 'A Team Administrator or a member of the Project Administrators or Project Collection Administrators group.' },
  ],
  quiz: [
    {
      question:
        'Contoso wants to shorten the time from a feature request being approved to the feature running in production. Which metric from Azure Boards Analytics BEST measures this?',
      options: ['Velocity', 'Lead time', 'Sprint burndown', 'Pipeline pass rate'],
      correct: [1],
      explanation:
        'Lead time measures created-to-completed, which maps to "approved request to delivered feature". Velocity counts completed effort per sprint, burndown tracks remaining sprint work, and pipeline pass rate measures build reliability, not time to value.',
    },
    {
      question:
        'A release team misses failed nightly deployments because the only notifications are individual developers’ personal subscriptions. You need every team member to be alerted when the deployment pipeline fails, with the least administrative effort. What should you do?',
      options: [
        'Ask each developer to add a personal subscription for the pipeline.',
        'Create a team notification subscription for the "Build completes" event filtered to failed status.',
        'Enable auditing and stream events to Log Analytics.',
        'Add a Deployment status widget to the team dashboard.',
      ],
      correct: [1],
      explanation:
        'A single team subscription covers everyone and survives membership changes. Personal subscriptions must be maintained by each user, audit streaming is for compliance logging rather than alerting, and a dashboard widget is passive, not a notification.',
    },
    {
      question:
        'Which TWO practices create traceability from an Azure Boards work item to the code that implemented it? (Select two)',
      options: [
        'Creating the branch from the work item in Azure Boards',
        'Mentioning AB#<id> in the pull request description of the connected GitHub repository',
        'Adding the work item ID as a tag on the pipeline run',
        'Pinning the work item to the team dashboard',
      ],
      correct: [0, 1],
      explanation:
        'Branching from the work item and AB# mentions both create development links on the work item. Pipeline tags and dashboard pins do not link code to the requirement.',
    },
    {
      question:
        'The CFO asks for "fewer incidents reaching customers" to be tracked by the DevOps team. Which pair of metrics is the MOST appropriate translation?',
      options: [
        'Velocity and story points committed',
        'Change failure rate and time to restore service',
        'Number of pull requests and lines of code changed',
        'Agent pool utilisation and parallel job count',
      ],
      correct: [1],
      explanation:
        'Change failure rate measures how often deployments cause incidents and MTTR how fast they are resolved, directly reflecting customer impact. Velocity, PR counts and infrastructure utilisation do not measure customer-facing reliability.',
    },
    {
      question:
        'A team lead wants Copilot Chat to answer "which work items in the current iteration have no linked pull request?" without writing WIQL by hand. What should be configured FIRST?',
      options: [
        'A Power BI workspace connected to Analytics',
        'The Azure DevOps MCP server in the client’s mcp.json so Copilot can call work item tools',
        'A service hook that posts work item updates to Teams',
        'A dashboard Query Tile',
      ],
      correct: [1],
      explanation:
        'The MCP server gives the agent tools to search and read work items, so the natural-language question can be executed. Power BI, service hooks and Query Tiles are reporting or notification surfaces, not an AI query path.',
    },
    {
      question:
        'A dashboard shows velocity rising while releases slip. Which widget should you add to find where work is queuing?',
      options: ['Sprint Capacity', 'Cumulative Flow Diagram', 'Build History', 'Test Results Trend'],
      correct: [1],
      explanation:
        'The CFD shows the width of each state band over time, exposing queues. Sprint Capacity shows planned hours, Build History shows pipeline runs and Test Results Trend shows test outcomes.',
    },
  ],
  statements: [
    { text: 'Cycle time in Azure Boards starts when a work item is created.', isTrue: false, explanation: 'Cycle time starts at the first In Progress state; lead time starts at creation.' },
    { text: 'A single Azure DevOps project can use only one process (for example Agile or Scrum).', isTrue: true, explanation: 'The process is chosen per project; inherited processes customise it without switching.' },
    { text: 'Global notification subscriptions in Azure DevOps can be created by any project contributor.', isTrue: false, explanation: 'Global subscriptions require Project Collection Administrator membership.' },
    { text: 'Deployment frequency, lead time for changes, change failure rate and time to restore are the DORA metrics.', isTrue: true, explanation: 'These four are the standard DORA measures of software delivery performance.' },
    { text: 'Using AB#123 in a pull request comment creates a link on the Azure Boards work item.', isTrue: false, explanation: 'Links are created from commit messages, PR descriptions and issue descriptions, not from comments or PR titles.' },
    { text: 'The Azure DevOps MCP server exposes work item, pipeline, repository, wiki and test plan tools to AI agents.', isTrue: true, explanation: 'Its toolsets include wit, pipelines, repos, wiki, work, testplan and advsec.' },
    { text: 'Service hooks can post Azure DevOps events to Microsoft Teams, Slack and generic webhooks.', isTrue: true, explanation: 'Service hooks support many consumers including Teams, Slack, webhooks, Azure Service Bus and Grafana.' },
  ],
  resources: [
    { label: 'What is Azure Boards?', url: 'https://learn.microsoft.com/en-us/azure/devops/boards/get-started/what-is-azure-boards' },
    { label: 'Configure lead time and cycle time widgets', url: 'https://learn.microsoft.com/en-us/azure/devops/report/dashboards/cycle-time-and-lead-time' },
    { label: 'Out-of-the-box dashboard widget catalog', url: 'https://learn.microsoft.com/en-us/azure/devops/report/dashboards/widget-catalog' },
    { label: 'About notifications in Azure DevOps', url: 'https://learn.microsoft.com/en-us/azure/devops/organizations/notifications/about-notifications' },
  ],
};

import type { Concept } from '../../types';

export const pipelinePlatformRunnersAndOptimization: Concept = {
  id: 'pipeline-platform-runners-and-optimization',
  title: 'Choosing Azure Pipelines or GitHub Actions, Designing Agents and Runners, and Optimising Pipelines',
  summary:
    'Selecting a deployment automation platform, designing and implementing agent and runner infrastructure (Microsoft-hosted, self-hosted, scale sets, Managed DevOps Pools, GitHub-hosted, larger and self-hosted runners, ARC) with cost, licensing, connectivity and maintenance in mind, connecting Azure Pipelines to GitHub repositories, and optimising pipelines for cost, time, performance and reliability.',
  certs: ['az-401'],
  domains: ['az-401-3'],
  outcomes: ['az-401-3-3-1', 'az-401-3-3-2', 'az-401-3-3-3', 'az-401-3-3-4', 'az-401-3-6-2'],
  tags: ['azure-pipelines', 'github-actions', 'agents', 'runners', 'managed-devops-pools', 'larger-runners', 'arc', 'parallel-jobs', 'caching', 'optimization'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Selecting Azure Pipelines or GitHub Actions',
      body: `Both are first-class YAML CI/CD engines with Microsoft support, so the exam asks you to justify a choice from context rather than pick a winner:

| Factor | Favours Azure Pipelines | Favours GitHub Actions |
|---|---|---|
| Where code and work live | Azure Repos, Azure Boards, Test Plans, Azure Artifacts feeds | GitHub repositories, issues, Projects, Packages |
| Governance model | Environments with rich **checks** (approvals, Azure Monitor alerts, required templates, business hours), project-level policies, Required template for compliance | Environments with protection rules, **rulesets** and required workflows, enterprise policies for actions and runners |
| Agent and compute | Microsoft-hosted agents, self-hosted, scale sets, **Managed DevOps Pools**, parallel-job licensing | GitHub-hosted runners, **larger runners**, self-hosted and **Actions Runner Controller**, billed per minute |
| Ecosystem | Tasks and extensions from the marketplace, classic release pipelines still exist | Actions marketplace, reusable workflows, composite actions, **GitHub Agentic Workflows** |
| Secretless auth to Azure | Workload identity federation service connections | OIDC with azure/login and federated credentials |
| Hybrid | Azure Pipelines can build **GitHub repositories** via the Azure Pipelines GitHub App | GitHub Actions can deploy to Azure and call Azure DevOps APIs |

Decision heuristics that score on the exam: keep the pipeline next to the repository unless there is a governance feature only the other platform has; choose Azure Pipelines when you need Azure DevOps-specific gates (Query Azure Monitor alerts, Required template, ServiceNow checks) or classic release management for many on-premises targets; choose GitHub Actions when the team is GitHub-native, needs GitHub Packages/ghcr.io integration, or wants agentic workflows and Copilot cloud agent sessions to run in the same system. Migrating pipelines is a project of its own, so "least effort" questions usually mean "stay where the repository is and integrate".`,
    },
    {
      heading: 'Designing agent and runner infrastructure',
      body: `Design dimensions: **cost**, **tool selection**, **licences**, **connectivity** and **maintainability**.

**Azure Pipelines agents.** *Microsoft-hosted agents* are fresh VMs per job with a curated toolset, no maintenance, limited to 60 minutes per job on the free tier and no network path into your VNet. *Self-hosted agents* run on your VMs, containers or on-premises machines (one agent per parallel job), give you any software and private connectivity, and cost you patching and capacity. *Azure Virtual Machine Scale Set agents* autoscale self-hosted agents from an image you own; Microsoft now recommends **Managed DevOps Pools** instead: a fully managed service where the VMs live in a Microsoft subscription but can join your VNet, use your custom or marketplace images, keep state up to 7 days for cache hits, run jobs up to 2 days, fetch certificates from Key Vault via managed identity and scale by schedule or demand. Licensing is by **parallel jobs**: each Microsoft-hosted or self-hosted parallel job is a lane; the free tier (one job, 60 minutes, 1,800 minutes per month for Microsoft-hosted; one free self-hosted job plus one per Visual Studio Enterprise subscriber) must be requested for private projects. Agent **capabilities** and job **demands** route jobs to the right pool.

**GitHub runners.** *GitHub-hosted runners* (\`ubuntu-latest\`, \`windows-latest\`, \`macos-latest\`) are billed per minute beyond the plan allowance. *Larger runners* (Team and Enterprise Cloud) add more vCPUs, GPUs, static IP ranges for firewall allowlists, **Azure private networking** and runner groups with concurrency controls. *Self-hosted runners* are free of per-minute charges and run anywhere; **Actions Runner Controller (ARC)** is the Kubernetes operator that autoscales ephemeral containerised runners via runner scale sets installed with Helm. Runner groups scope which repositories may use which runners. The Copilot cloud agent and Copilot code review also run on Actions runners when configured for the Actions environment, and an organization can force a labelled runner group for them.

Design rule: hosted for anything public and stateless, private pools or VNet-connected runners for anything that must reach internal resources, ephemeral runners for anything that runs untrusted code (PRs from forks, agent sessions).`,
    },
    {
      heading: 'Implementing the infrastructure and connecting Azure Pipelines to GitHub',
      body: `Implementation steps you should be able to recite:

- **Self-hosted Azure Pipelines agent**: create an agent pool (organization settings > Agent pools), grant the pool to the project, download the agent, run \`config.sh\` or \`config.cmd\` with the organization URL and a PAT or, better, register with a service principal, run as a service, and target it with \`pool: { name: 'contoso-linux', demands: [docker] }\`.
- **Managed DevOps Pool**: create the \`Microsoft.DevOpsInfrastructure/pools\` resource (portal or Bicep) referencing a Dev Center project, choose an image and SKU, set agent profile (stateless or stateful), scaling (standby agents, schedules), and networking (optional VNet subnet). Agents appear in the Azure DevOps pool automatically.
- **GitHub self-hosted runner**: Settings > Actions > Runners > New runner, run \`config.sh --url ... --token ...\`, optionally \`--ephemeral\`, add labels and put it in a runner group; or deploy ARC with Helm and target \`runs-on: contoso-arc-set\`.
- **Larger runners**: Organization settings > Actions > Runners > New runner > GitHub-hosted, choose image and size, assign to a runner group, optionally enable static IPs or Azure private networking.

**Azure Pipelines with a GitHub repository.** When creating a pipeline you select GitHub as the source; the recommended authentication is the **Azure Pipelines GitHub App** (installed by a GitHub org owner or repo admin), which runs builds without a personal identity, posts **status checks and PR comments**, and supports CI and PR triggers. OAuth and PAT connections exist but tie the pipeline to a user. Branch protection in GitHub can then require the Azure Pipelines status check, and \`trigger\`, \`pr\` and path filters in the YAML control when it runs. The Azure Boards app and the Azure Pipelines app are different apps with different jobs; a question about work item linking is Boards, a question about builds is Pipelines.`,
    },
    {
      heading: 'Optimising a pipeline for cost, time, performance and reliability',
      body: `Optimisation is iterative: measure, change one thing, measure again. Use **Pipeline analytics** (pass rate, duration, top failing tasks), the **Test Analytics** flaky test report, and **GitHub Actions usage and performance metrics** (minutes by workflow, job, runner type; average run time, queue time, failure rate) to pick the bottleneck.

| Goal | Levers |
|---|---|
| **Time** | Run independent jobs in parallel; \`matrix\` with \`maxParallel\` (Azure) or \`max-parallel\` (GitHub); split long test suites across agents; shallow clone (\`fetchDepth: 1\`, \`fetch-depth: 1\`); **caching** (\`Cache@2\` keyed on lock files, \`actions/cache\`) for package restores; stateful Managed DevOps Pool agents to reuse workspaces; larger runners for CPU-bound builds; incremental builds. |
| **Cost** | Path filters so docs changes do not build code; \`concurrency\` with \`cancel-in-progress\` and \`batch: true\` to collapse redundant runs; scheduled pipelines only when main changed (\`always: false\`); right-size runners (self-hosted for high volume, hosted for bursty); scale pools to zero off-hours; short artifact and log retention; avoid retrying whole pipelines when one job failed (\`re-run failed jobs\`). |
| **Performance** | Container jobs with prebuilt images instead of installing tools every run; prewarmed custom images in Managed DevOps Pools; download only the artifacts a stage needs; move heavy integration tests to a nightly stage with a smaller PR gate. |
| **Reliability** | Pin task and action versions (\`actions/checkout@v4\` or a SHA); \`retryCountOnTaskFailure\` for flaky network steps; timeouts on jobs; **flaky test management** (auto-detect by rerun, quarantine without failing the build, create bugs); health checks before deploy; idempotent deployment steps; queue-time alerts to add capacity. |

Copilot helps at every step: ask it to explain a slow job from the timeline, propose a cache key, convert sequential jobs to a dependency graph, or draft the \`concurrency\` block. The exam phrasing "optimize for X" is asking you to name the lever, so learn the table rather than memorising a single best practice.`,
    },
  ],
  examples: [
    {
      title: 'Managed DevOps Pool for VNet-connected builds',
      description:
        'Integration tests must reach a SQL managed instance in a corporate VNet and the team is tired of patching self-hosted VMs. The platform team creates a Managed DevOps Pool with a marketplace Ubuntu image, a subnet in the hub VNet, 2 standby agents during office hours and scale-to-zero at night, and points the pipeline at it.',
      language: 'yaml',
      code: `# Bicep (excerpt): Managed DevOps Pool joined to a VNet subnet
resource pool 'Microsoft.DevOpsInfrastructure/pools@2025-01-21' = {
  name: 'mdp-contoso-linux'
  location: location
  properties: {
    organizationProfile: { kind: 'AzureDevOps', organizations: [ { url: 'https://dev.azure.com/contoso', parallelism: 4 } ] }
    devCenterProjectResourceId: devCenterProjectId
    maximumConcurrency: 4
    agentProfile: { kind: 'Stateless' }
    fabricProfile: {
      kind: 'Vmss'
      sku: { name: 'Standard_D4ads_v5' }
      images: [ { wellKnownImageName: 'ubuntu-24.04/latest' } ]
      networkProfile: { subnetId: buildSubnetId }
    }
  }
}
# azure-pipelines.yml
pool: mdp-contoso-linux`,
      takeaway: 'Managed DevOps Pools give VNet access and custom images without owning VMs; parallelism and standby settings are the cost levers.',
    },
    {
      title: 'Azure Pipelines building a GitHub repository',
      description:
        'A team keeps code in GitHub but needs Azure Pipelines environment checks for production. A GitHub org owner installs the Azure Pipelines GitHub App on the repository; the pipeline is created from GitHub as the source, posts a status check named "Azure Pipelines" on every PR, and that check is made required in the GitHub ruleset.',
      language: 'yaml',
      code: `# azure-pipelines.yml in the GitHub repository
trigger:
  branches: { include: [main] }
  paths: { exclude: [docs/*, '*.md'] }
pr:
  branches: { include: [main] }
pool: { vmImage: ubuntu-latest }
steps:
  - checkout: self
    fetchDepth: 1
  - script: npm ci && npm test`,
      takeaway: 'Use the Azure Pipelines GitHub App rather than OAuth or a PAT so builds, status checks and triggers do not depend on one person’s identity.',
    },
    {
      title: 'The PAT-registered agent that stopped at midnight (a realistic mistake)',
      description:
        'An engineer registers twelve self-hosted agents with his personal PAT. He leaves, the PAT is revoked, and the agents fail to authenticate overnight, blocking every release. The fix: register agents with a service principal or managed identity (or at least a dedicated service account), put agents in a pool owned by the platform team, and move to Managed DevOps Pools so registration is handled by the service. Add a queue-time alert so a dead pool is noticed before the release train.',
      takeaway: 'Agent infrastructure must not depend on an individual’s credentials; use service identities and managed pools.',
    },
    {
      title: 'Cutting a 40-minute GitHub Actions workflow to 12',
      description:
        'Actions performance metrics show the build workflow averages 40 minutes with 6 minutes of queue time. Copilot analyses the logs and proposes: cache node_modules keyed on the lock file, split tests into a 4-way matrix, cancel superseded runs on the same branch, skip the workflow for docs-only changes, and move to a larger runner for the compile step. Average run time drops to 12 minutes and minutes billed fall despite the larger runner.',
      language: 'yaml',
      code: `on:
  push:
    branches: [main]
    paths-ignore: ['docs/**', '**.md']
  pull_request:
concurrency:
  group: build-\${{ github.ref }}
  cancel-in-progress: true
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      max-parallel: 4
      matrix: { shard: [1, 2, 3, 4] }
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 1 }
      - uses: actions/cache@v4
        with:
          path: ~/.npm
          key: npm-\${{ runner.os }}-\${{ hashFiles('**/package-lock.json') }}
      - run: npm ci && npx jest --shard=\${{ matrix.shard }}/4`,
      takeaway: 'Measure with Actions metrics, then apply caching, parallel shards, concurrency cancellation and path filters; faster is usually cheaper too.',
    },
  ],
  keyPoints: [
    'Choose the platform by where the repository and governance live: Azure Pipelines for Azure DevOps-centric teams and rich environment checks; GitHub Actions for GitHub-native teams, Packages and agentic workflows; Azure Pipelines can build GitHub repos via the Azure Pipelines GitHub App.',
    'Azure Pipelines agent options: Microsoft-hosted (no maintenance, no VNet), self-hosted (full control, you patch), scale set agents (legacy autoscale), Managed DevOps Pools (recommended managed autoscale with VNet, custom images, stateful option).',
    'Azure Pipelines licensing is per parallel job; the free Microsoft-hosted tier is one job, 60 minutes per job, 1,800 minutes per month and must be requested; self-hosted gets one free job plus one per Visual Studio Enterprise subscriber.',
    'GitHub runner options: GitHub-hosted (per-minute billing), larger runners (Team/Enterprise; static IPs, Azure private networking, GPUs, runner groups), self-hosted (no minute charges) and ARC for Kubernetes autoscaling.',
    'Use ephemeral runners or agents for untrusted code and agent sessions; use VNet-connected pools or larger runners with private networking for internal dependencies.',
    'Connect Azure Pipelines to GitHub with the GitHub App (recommended) rather than OAuth or PAT; it posts status checks and supports CI and PR triggers.',
    'Optimise with data: Pipeline analytics and Actions usage and performance metrics identify duration, queue time and failure hotspots; levers are parallelism, caching, shallow fetch, path filters, concurrency cancellation, right-sized runners, pinned versions, retries, timeouts and flaky test management.',
  ],
  flashcards: [
    { front: 'Which Azure DevOps agent option does Microsoft recommend instead of Virtual Machine Scale Set agents?', back: 'Managed DevOps Pools, a fully managed autoscaling pool with VNet, custom image and stateful agent support.' },
    { front: 'What is a parallel job in Azure Pipelines?', back: 'The compute capacity to run one pipeline job at a time; licensing is counted in parallel jobs for Microsoft-hosted and self-hosted agents separately.' },
    { front: 'What does the Microsoft-hosted free tier provide for private projects?', back: 'One parallel job, 60 minutes per job, 1,800 minutes per month, granted on request.' },
    { front: 'Which GitHub plans can use larger runners?', back: 'GitHub Team and GitHub Enterprise Cloud.' },
    { front: 'What is Actions Runner Controller?', back: 'A Kubernetes operator that autoscales ephemeral self-hosted GitHub runners using runner scale sets, installed with Helm.' },
    { front: 'What is the recommended authentication for Azure Pipelines building a GitHub repository?', back: 'The Azure Pipelines GitHub App, which runs without a personal identity and posts status checks.' },
    { front: 'Which YAML setting cancels superseded in-progress runs in GitHub Actions?', back: 'concurrency: with a group and cancel-in-progress: true.' },
    { front: 'Which Azure Pipelines task caches dependencies between runs?', back: 'Cache@2, keyed on files such as package-lock.json.' },
    { front: 'How do you route a job to agents with specific software in Azure Pipelines?', back: 'Agent capabilities matched by job demands in the pool definition.' },
    { front: 'Where do you see average run time, queue time and failure rate per workflow in GitHub?', back: 'GitHub Actions performance metrics (organization or repository Insights > Actions).' },
    { front: 'How long can a job run on a Managed DevOps Pool agent?', back: 'Up to two days; longer pipelines should be split into shorter jobs.' },
  ],
  quiz: [
    {
      question:
        'Contoso keeps source code in GitHub but requires production deployments to pass a Query Azure Monitor alerts check and a ServiceNow change check. Which approach meets the requirement with the least migration effort?',
      options: [
        'Move the repositories to Azure Repos and use Azure Pipelines',
        'Keep the code in GitHub and create an Azure Pipelines YAML pipeline using the Azure Pipelines GitHub App, with the checks on an Azure Pipelines environment',
        'Use GitHub Actions with a wait timer on the production environment',
        'Build in GitHub Actions and redeploy manually after checking Azure Monitor',
      ],
      correct: [1],
      explanation:
        'Azure Pipelines can build GitHub repositories and provides those specific checks. Moving repos is unnecessary effort, a wait timer is not an alert or change check, and manual steps defeat the automation goal.',
    },
    {
      question:
        'Integration tests need access to resources in a corporate virtual network. The team wants autoscaling, custom images and no VM patching responsibility. Which Azure Pipelines agent option should you choose?',
      options: ['Microsoft-hosted agents', 'Self-hosted agents on dedicated VMs', 'Managed DevOps Pools with a VNet subnet', 'Azure Container Instances started by a script'],
      correct: [2],
      explanation:
        'Managed DevOps Pools are managed, autoscale, support custom images and VNet integration. Hosted agents cannot reach the VNet, dedicated VMs require patching, and ad hoc containers are not an agent pool offering.',
    },
    {
      question:
        'A GitHub Enterprise Cloud organization must allow build runners through a partner firewall that only accepts fixed IP ranges, without maintaining its own runner VMs. What should you use?',
      options: ['Standard GitHub-hosted runners', 'Larger runners with static IP addresses', 'Self-hosted runners on-premises', 'Actions Runner Controller on AKS'],
      correct: [1],
      explanation:
        'Larger runners support static IP ranges and remain GitHub-managed. Standard hosted runners have changing IPs, and self-hosted or ARC runners require managing infrastructure.',
    },
    {
      question:
        'Which TWO changes reduce GitHub Actions minutes billed for a repository where many pushes land on the same branch within minutes and most commits only touch documentation? (Select two)',
      options: [
        'Add concurrency with cancel-in-progress for the branch',
        'Add paths-ignore for docs/** and *.md on the push trigger',
        'Increase the artifact retention period',
        'Switch all jobs to larger runners',
      ],
      correct: [0, 1],
      explanation:
        'Cancelling superseded runs and skipping docs-only changes directly cut minutes. Retention affects storage, and larger runners cost more per minute.',
    },
    {
      question:
        'A nightly pipeline fails roughly once a week because a test intermittently times out, and developers have started ignoring red builds. What is the MOST appropriate first action?',
      options: [
        'Delete the test.',
        'Enable flaky test management so the test is detected, reported and does not fail the build while a bug is opened to fix it.',
        'Add retryCountOnTaskFailure: 10 to every task.',
        'Move the pipeline to self-hosted agents.',
      ],
      correct: [1],
      explanation:
        'Flaky test management quarantines the test visibly and keeps the signal trustworthy. Deleting loses coverage, blanket retries hide real failures, and agents are not the cause.',
    },
    {
      question:
        'Twelve self-hosted Azure Pipelines agents stop authenticating after an engineer leaves the company. Which design change prevents a recurrence?',
      options: [
        'Register agents with a long-lived PAT belonging to the team lead',
        'Register agents with a service principal or managed identity, or move to Managed DevOps Pools',
        'Give all engineers Project Collection Administrator rights',
        'Increase the PAT lifespan policy to the maximum',
      ],
      correct: [1],
      explanation:
        'Service identities and managed pools remove the dependency on a person. Another individual’s PAT recreates the problem, broad admin rights are a security regression, and longer PAT lifespans only delay the failure.',
    },
  ],
  statements: [
    { text: 'Microsoft-hosted Azure Pipelines agents can connect directly to resources inside your private virtual network.', isTrue: false, explanation: 'Hosted agents run outside your network; use self-hosted agents, scale sets or Managed DevOps Pools with VNet integration.' },
    { text: 'Managed DevOps Pools can keep agent state for up to seven days to improve cache hits.', isTrue: true, explanation: 'Stateful agents retain their workspace for up to seven days.' },
    { text: 'Self-hosted GitHub runners consume GitHub Actions minutes at the same rate as hosted runners.', isTrue: false, explanation: 'Self-hosted runners do not consume Actions minutes; you pay for your own infrastructure.' },
    { text: 'The Azure Pipelines GitHub App posts build status checks to GitHub pull requests.', isTrue: true, explanation: 'Status checks and PR comments are part of the GitHub App integration.' },
    { text: 'Actions Runner Controller requires Kubernetes.', isTrue: true, explanation: 'ARC is a Kubernetes operator installed with Helm.' },
    { text: 'Azure Pipelines charges per minute for self-hosted agents.', isTrue: false, explanation: 'Self-hosted capacity is licensed per parallel job, not per minute.' },
    { text: 'Shallow fetch and dependency caching are primarily time optimisations that also reduce cost.', isTrue: true, explanation: 'Shorter jobs consume fewer billed minutes.' },
  ],
  resources: [
    { label: 'Azure Pipelines agents overview', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/agents' },
    { label: 'Managed DevOps Pools overview', url: 'https://learn.microsoft.com/en-us/azure/devops/managed-devops-pools/overview' },
    { label: 'Build GitHub repositories with Azure Pipelines', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/repos/github' },
    { label: 'About GitHub Actions metrics', url: 'https://docs.github.com/en/actions/concepts/metrics' },
  ],
};

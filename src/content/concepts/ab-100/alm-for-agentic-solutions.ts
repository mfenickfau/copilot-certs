import type { Concept } from '../../types';

export const almForAgenticSolutions: Concept = {
  id: 'alm-for-agentic-solutions',
  title: 'Application Lifecycle Management for Agents, Models and Data',
  summary:
    'Designing one coherent ALM process for agentic solutions: solutions, environments, pipelines and source control for Copilot Studio agents, connectors and actions; CI/CD, versioning and traffic shifting for Microsoft Foundry Agent Service; MLOps for custom models; data lifecycle for grounding and training data; and the specific ALM mechanics of Dynamics 365 finance and supply chain and customer experience apps.',
  certs: ['ab-100', 'ab-620'],
  domains: ['ab-100-3', 'ab-620-3'],
  outcomes: ['ab-100-3-3-1', 'ab-100-3-3-2', 'ab-100-3-3-3', 'ab-100-3-3-4', 'ab-100-3-3-5', 'ab-100-3-3-6', 'ab-620-3-2-4'],
  tags: ['alm', 'solutions', 'pipelines', 'environments', 'ci-cd', 'mlops', 'foundry', 'dynamics-365'],
  difficulty: 'advanced',
  diagram: 'agentic-sdlc',
  sections: [
    {
      heading: 'Copilot Studio agents, connectors and actions',
      body: `Copilot Studio ALM is Power Platform ALM. Every agent is created inside a **solution** in a Dataverse environment; architects change the default to a purpose-built unmanaged solution in development so that the agent, its topics, knowledge references, prompts, agent flows, custom connectors, connection references and environment variables travel together. Rules that make agent ALM work:

- **Environment strategy.** Separate development, test and production environments at minimum, often plus UAT and training; **managed environments** for test and production; **environment routing** so makers land in a governed developer environment rather than the Default. Ring deployments (pilot users before everyone) use additional environments or audience controls on channels.
- **Environment variables** for anything that differs per environment (SharePoint site URLs, API base URLs, Azure AI Search index names, model deployment names). **Connection references** so connectors bind to the right credentials per environment; after import, connections must be set in the target (a classic post-deployment task for finance and operations knowledge flows and Dynamics 365 knowledge integration).
- **Pipelines in Power Platform** for push-button, governed deployment from development to test to production, with approvals and deployment history; extend with the Power Platform CLI or Build Tools for Azure DevOps and GitHub Actions when you need code and agent artefacts in one pipeline. **Git integration** syncs solutions with Azure DevOps or GitHub repositories from developer environments (not test or production), giving version control, change tracking and pull-request review of agent definitions.
- **Managed solutions** in test and production; never edit production directly. Hotfixes go through the pipeline too.
- **Testing gates**: run agent evaluation test sets through the Power Platform REST API after each import and block promotion on failure.
- **Publish step**: importing a solution does not publish the agent; include the publish and channel configuration in the release runbook or automation, and verify authentication settings per environment.
- **Harness awareness**: both Copilot Studio harnesses support solutions and ALM, but the components differ (topics and prompts versus skills, workflows and hooks); keep harness choice stable across environments.
- **Shared components**: custom connectors, prompts and child agents reused across solutions belong in their own base solution so dependencies stay clean.

Declarative agents built in code for Microsoft 365 Copilot use the Agents Toolkit's environment files (one per target or version) to provision development, staging and production with placeholders in manifests, and submit production versions through the organisation catalog and admin approval.`,
    },
    {
      heading: 'Microsoft Foundry Agent Service and custom models',
      body: `**Foundry agents** are code and configuration, so their ALM looks like software delivery with AI-specific gates.

- **Source control** for agent definitions, instructions, tool schemas, infrastructure as code (Bicep or Terraform) and evaluation data sets.
- **Separate Foundry projects per environment**; environment names alone do not isolate resources. The Azure Developer CLI (azd) initialises hosted agent projects and azd pipeline config sets up GitHub Actions or Azure DevOps pipelines that build, provision and deploy.
- **Promotion**: deploy the same source revision to development, test and production projects, packaging per environment. Hosted agents support **versioning with stable endpoints**, so you can roll out a new version gradually by shifting a share of traffic and route back to the previous version if problems appear.
- **Evaluation in the pipeline**: the Foundry evaluation GitHub Action runs offline evaluations with chosen evaluators and reports confidence intervals; fail the build on threshold breaches. Red-team scans before major releases. Continuous evaluation after release.
- **Model lifecycle**: deployments carry a model version and an **update policy** (stay on a version or auto-upgrade when new versions release); pin production to tested versions, schedule upgrades through the pipeline with evaluation, and track retirement dates. Model router versions are date-stamped and the latest version receives new models in place, so re-evaluate when its pool changes.
- **Governance**: RBAC roles (Foundry Account Owner, Foundry Owner, Foundry User, Project Manager) separate who can create projects, deploy models and run agents; Azure Policy governs allowed models and deployment types; agents are published to Teams, Microsoft 365 Copilot and the Entra agent registry through the same release process.

**Custom models** add MLOps: versioned data sets and feature definitions, reproducible training jobs (Foundry fine-tuning jobs or Azure Machine Learning pipelines), a **model registry** with lineage from data to model to deployment, validation against the criteria defined before training, approval gates, controlled rollout (shadow or canary), drift and performance monitoring, and a retraining trigger. **AI Builder** custom models are solution-aware and move between environments in solutions, with retraining in the target environment on its data. Fine-tuned Foundry models remain exclusively yours and should be treated as versioned artefacts with their checkpoints under access control.`,
    },
    {
      heading: 'Data used in models and agents',
      body: `Data has its own lifecycle, and agents fail when it is ignored. Design ALM for three kinds of data:

**Grounding data** (knowledge sources). Keep a **registry** of every knowledge source per agent with owner, refresh cadence, sensitivity, residency and the environments it serves. Use environment variables so development agents point at test libraries and production agents at production libraries. Promote content changes with a review step (new policy version approved, superseded version archived) and a smoke evaluation afterwards. For indexed sources (Azure AI Search, Copilot connectors) version the index schema and re-index deliberately. For uploaded files in Copilot Studio, remember that files are part of the solution's Dataverse storage; replace rather than duplicate.

**Training and evaluation data**. Version data sets with snapshots and lineage; separate training, validation and test splits; document provenance, consent and licensing; store labels with reviewer identity; and refresh evaluation sets from production themes without leaking them into training.

**Transactional data created by agents**. Agent-created records (cases, orders, journal entries) must be identifiable (created-by agent identity, correlation to the conversation or run), auditable (Dataverse auditing on affected tables) and reversible where possible. Test data in lower environments should be masked copies with the same shape.

Cross-cutting: data residency per environment (do not point an EU production agent at a US test index), retention and deletion aligned with Purview policies, and access control changes treated as releases because they change what agents can retrieve. Microsoft's guidance in the Power Platform Well-Architected intelligent application workload ("manage the AI model lifecycle", "establish an ALM strategy") frames data and model lifecycle as part of Operational Excellence, not an afterthought.`,
    },
    {
      heading: 'Dynamics 365 finance and supply chain, and customer experience apps',
      body: `**Finance and supply chain (finance and operations apps).** Two tracks run in parallel and must be coordinated:
- *X++ and application*: code in Azure DevOps, builds with Microsoft-hosted agents and Azure Pipelines producing deployable packages (compilation and packaging; runtime tests such as SysTest still need a runtime), deployment through Lifecycle Services (with management migrating to the Power Platform admin center over time), and RSAT regression suites in test.
- *Copilot and agents*: the Copilot for finance and operations apps agent, custom topics, low-code plugins, knowledge, virtual entity configuration and dual-write maps live in the **linked Dataverse environment** and move as solutions through pipelines. Every finance and operations environment is linked to exactly one Dataverse environment, so your environment pairs (dev to dev, test to test, prod to prod) must be mirrored and kept in sync. Microsoft-provided agents deploy as managed solutions through the **agent deployment wizard** per environment; record their versions and post-deployment configuration. Feature management flags (Immersive Home, Agent management, ERP MCP) must be enabled consistently across environments. The Dynamics 365 ERP MCP server exposes tools by security role, so role changes are part of the release.

**Customer experience and service (Sales, Customer Service, Contact Center).** These apps are model-driven on Dataverse, so standard solution ALM applies: Copilot in Dynamics 365 Sales customisations (topics, SalesSparks prompt guide, glossary and synonyms) are made in Copilot Studio inside a solution; Customer Service Copilot settings, experience profiles, Copilot agent configuration and autonomous agent rules are configured per environment in Copilot Service admin center (many are configuration data, so use configuration migration or document them in the runbook); Contact Center voice agents need per-environment Azure Communication Services numbers and workstream bindings; knowledge-management integrations require **connection references** to be set after import. Rollout plans let you stage autonomous agent activation after deployment.

**One ALM strategy.** The architect's deliverable is a single process map showing which artefact lives where (solution, repository, model registry, configuration), who approves, which tests gate each stage, and how a release spans Copilot Studio, Foundry, Dynamics 365 and data. Exam questions typically present a broken release (connection not set, agent not published, environment unlinked, model auto-upgraded without testing) and ask which ALM control was missing.`,
    },
  ],
  examples: [
    {
      title: 'The agent that worked in test and failed in production (a realistic mistake)',
      description:
        'A Copilot Studio agent is imported to production via a pipeline but answers from the test SharePoint library and its order-lookup flow fails. The SharePoint URL was hard-coded instead of an environment variable, the flow\'s connection reference was never set in production, and nobody published the agent after import. The fix adds environment variables, a post-deployment step to set connections, an automated publish and a smoke evaluation.',
      takeaway: 'Environment variables, connection references, publishing and post-import evaluation are the four most common gaps in agent ALM.',
    },
    {
      title: 'Gradual rollout of a Foundry hosted agent',
      description:
        'A bank promotes a new version of its Foundry hosted agent through development and test projects with the evaluation GitHub Action gating each stage, then deploys to production and shifts 10% of traffic to the new version while continuous evaluation compares quality. A groundedness regression appears; traffic is routed back to the previous version within minutes and the fix goes through the pipeline.',
      takeaway: 'Separate projects per environment, pipeline evaluations and versioned endpoints with traffic shifting give safe rollouts and fast rollback.',
    },
    {
      title: 'Model auto-upgrade surprise',
      description:
        'A production deployment was configured to auto-upgrade to new model versions. A new version changed output formatting and broke a downstream parser. The team moves production to a pinned version with a scheduled upgrade policy, adds a pipeline job that runs the evaluation set against the candidate version during the retention window, and uses the same approach for Copilot Studio\'s 30-day model retention.',
      takeaway: 'Pin and test model versions through the pipeline; treat model upgrades as releases.',
    },
    {
      title: 'Coordinated release across finance and operations and Dataverse',
      description:
        'A supply chain release includes an X++ package, a new mserp_ virtual entity used as knowledge, a Copilot Studio topic for the supplier agent and the Supplier Communications Agent deployment. The runbook sequences: deploy the package to the test finance and operations environment, enable the virtual entity in the linked test Dataverse environment, import the solution with the topic via pipeline, deploy the Microsoft agent with the wizard, run RSAT plus agent evaluations, then repeat for production with the same artefact versions.',
      takeaway: 'Finance and operations ALM runs two synchronised tracks: application packages and solutions in the linked Dataverse environment.',
    },
  ],
  keyPoints: [
    'Copilot Studio agents live in solutions; move them with pipelines (or Build Tools and CLI) through dev, test and production, using environment variables and connection references, managed solutions in non-development environments, and Git integration from developer environments.',
    'Importing a solution does not publish the agent; releases must include publish, channel and authentication verification and a post-import evaluation gate via the Power Platform REST API.',
    'Foundry agents use source control, infrastructure as code, azd pipelines into separate projects per environment, versioned endpoints with gradual traffic shifting and rollback, evaluation actions in CI/CD and continuous evaluation in production.',
    'Model lifecycle: pin production model versions with explicit update policies, test upgrades through the pipeline, track retirements; model router versions are date-stamped and updated in place.',
    'Custom models follow MLOps: versioned data, reproducible training, a model registry with lineage, pre-defined validation gates, controlled rollout and drift monitoring; AI Builder models are solution-aware.',
    'Data ALM covers grounding sources (registry, owners, environment-specific references, reviewed promotion), training and evaluation data (versioned, split, provenance) and agent-created transactional data (identifiable, audited, reversible).',
    'Finance and operations ALM pairs X++ packages (Azure DevOps, Lifecycle Services, RSAT) with solutions in the one linked Dataverse environment per environment, plus agent deployment wizard versions and feature flags.',
    'Customer experience apps use standard Dataverse solution ALM for Copilot Studio customisations, with per-environment configuration in Copilot Service admin center and connection references set after import.',
  ],
  flashcards: [
    { front: 'What acts as the carrier for a Copilot Studio agent through environments?', back: 'A Power Platform solution; agents are created in a solution and should be moved as managed solutions via pipelines.' },
    { front: 'Which two solution components make an agent portable across environments?', back: 'Environment variables (per-environment values such as URLs) and connection references (per-environment connector credentials).' },
    { front: 'Where should Power Platform Git integration be used?', back: 'With developer environments only, not test or production; use builds and pipelines to deploy.' },
    { front: 'Does importing a solution publish the Copilot Studio agent?', back: 'No. Publishing and channel configuration are separate release steps.' },
    { front: 'How are Foundry hosted agent releases promoted safely?', back: 'Same source revision deployed to separate Foundry projects per environment, with evaluation gates and gradual traffic shifting between agent versions and rollback.' },
    { front: 'What does the Foundry evaluation GitHub Action do in a pipeline?', back: 'Runs offline evaluations of an agent against a query data set with chosen evaluators and reports results with statistical significance.' },
    { front: 'What is a model deployment update policy?', back: 'The setting that keeps a deployment on a pinned model version or auto-upgrades it when new versions release; pin production and test upgrades.' },
    { front: 'Name four elements of MLOps for custom models.', back: 'Versioned data sets, reproducible training, a model registry with lineage, validation gates and controlled rollout with drift monitoring (any four).' },
    { front: 'How many Dataverse environments is a finance and operations environment linked to, and why does it matter for ALM?', back: 'Exactly one; environment pairs must be mirrored across dev, test and production so solutions and virtual entities move consistently.' },
    { front: 'How are Microsoft-provided Dynamics 365 ERP agents deployed per environment?', back: 'As managed solutions through the agent deployment wizard in the Power Platform admin center Copilot Hub.' },
    { front: 'How do declarative agents built in code handle multiple environments and versions?', back: 'Agents Toolkit environment files (.env per target) with placeholders in manifests, provisioned with a single command per environment.' },
  ],
  quiz: [
    {
      question:
        'After a pipeline deploys a Copilot Studio agent to production, users report that it answers from the test SharePoint library. What was MOST likely missing from the ALM design?',
      options: [
        'A managed environment',
        'An environment variable for the SharePoint knowledge URL with a production value',
        'A second Copilot Studio licence',
        'Generative orchestration',
      ],
      correct: [1],
      explanation:
        'Hard-coded knowledge references travel unchanged; environment variables carry per-environment values. Managed environments, licences and orchestration mode do not change the URL.',
    },
    {
      question:
        'Which TWO practices does Microsoft recommend for Power Platform Git integration and deployment? (Select two)',
      options: [
        'Connect Git integration to developer environments and use pipelines to deploy to test and production',
        'Connect Git integration directly to the production environment for faster hotfixes',
        'Deploy managed solutions to test and production',
        'Edit production agents directly and sync back to Git afterwards',
      ],
      correct: [0, 2],
      explanation:
        'Git integration belongs with developer environments, and non-development environments receive managed solutions via pipelines. Direct production edits bypass ALM.',
    },
    {
      question:
        'A Foundry hosted agent release must be validated per environment, rolled out gradually in production and quickly reversible. Which design meets this?',
      options: [
        'One Foundry project with environment names in tags, redeploying over the live agent',
        'Separate Foundry projects per environment, azd pipelines with evaluation gates, versioned endpoints and gradual traffic shifting with rollback',
        'Manual portal deployments on Friday evenings',
        'Copy the agent to Copilot Studio for production',
      ],
      correct: [1],
      explanation:
        'Microsoft guidance: environment names alone do not isolate resources; use separate projects, pipelines, evaluation and version traffic shifting. Manual or single-project approaches lack isolation and rollback.',
    },
    {
      question:
        'A production model deployment auto-upgraded overnight and broke a downstream parser. Which ALM control prevents a recurrence?',
      options: [
        'Pin the deployment to a tested version with an explicit update policy and test candidate versions in the pipeline before scheduled upgrades',
        'Switch to classic orchestration',
        'Increase quota on the deployment',
        'Disable evaluations to speed up deployments',
      ],
      correct: [0],
      explanation:
        'Model upgrades are releases and need pinned versions, evaluation and scheduling. Orchestration mode, quota and skipping evaluation are unrelated or harmful.',
    },
    {
      question:
        'A finance release includes an X++ package and a new virtual entity used as agent knowledge. The virtual entity appears in test but the agent in production cannot see it. What is the MOST likely cause?',
      options: [
        'Virtual entities require Microsoft 365 Copilot licences',
        'The entity was enabled in the Dataverse environment linked to test but not in the one linked to the production finance and operations environment',
        'The X++ package must be deployed through Copilot Studio',
        'RSAT was not run',
      ],
      correct: [1],
      explanation:
        'Each finance and operations environment is linked to one Dataverse environment; configuration must be repeated per environment pair. Licences, RSAT and package deployment paths are unrelated to entity visibility.',
    },
    {
      question:
        'A Customer Service knowledge-management integration with a Copilot Studio agent works in test but fails after import to production with a connection error. What should the release runbook include?',
      options: [
        'Re-creating the agent manually in production',
        'Setting the connection references for the imported flows in the production environment after import',
        'Disabling data policies in production',
        'Switching the agent to the Microsoft Copilot harness',
      ],
      correct: [1],
      explanation:
        'Microsoft documents that connection references must be set again after importing the solution into production. The other options are unnecessary or unsafe.',
    },
  ],
  statements: [
    { text: 'Copilot Studio agents are created inside Power Platform solutions by default.', isTrue: true, explanation: 'A default solution carries the agent; you can change it to a custom solution.' },
    { text: 'Power Platform pipelines require professional developers to write YAML for every deployment.', isTrue: false, explanation: 'Pipelines give makers a guided deployment experience; developers can optionally extend them with the CLI.' },
    { text: 'In Foundry, giving two deployments different environment names is sufficient isolation between test and production.', isTrue: false, explanation: 'Bind each environment to a separate Foundry project; names alone do not isolate resources.' },
    { text: 'Fine-tuned models sold by Azure in Foundry are available exclusively to the customer who trained them.', isTrue: true, explanation: 'Microsoft states fine-tuned models are for your exclusive use.' },
    { text: 'Agent-created transactional records should be attributable to the agent identity and audited.', isTrue: true, explanation: 'Identifiable, audited and reversible records are part of data ALM.' },
    { text: 'Finance and operations Copilot customisations are deployed inside the X++ deployable package.', isTrue: false, explanation: 'They live as solutions in the linked Dataverse environment and move through Power Platform pipelines.' },
    { text: 'Copilot Studio\'s 30-day model retention after a default-model change gives time to run evaluations before migrating.', isTrue: true, explanation: 'Use the window to test and migrate through the pipeline.' },
  ],
  resources: [
    { label: 'Solutions and ALM in Copilot Studio', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-overview' },
    { label: 'Pipelines in Power Platform', url: 'https://learn.microsoft.com/en-us/power-platform/alm/pipelines' },
    { label: 'Promote releases and roll out versions for Foundry hosted agents', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/deploy-hosted-agent-production' },
    { label: 'Power Platform integration with finance and operations apps', url: 'https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/power-platform/overview' },
  ],
};

import type { Concept } from '../../types';

export const deploymentStrategiesAndResiliency: Concept = {
  id: 'deployment-strategies-and-resiliency',
  title: 'Deployment Strategies, Ordering, Zero Downtime, Hotfixes and Resiliency',
  summary:
    'Designing deployments that limit blast radius (blue-green, canary, rings, progressive exposure, feature flags, A/B testing), ordering dependent deployments reliably, minimising downtime with load balancing, slot swaps and rolling updates, planning a hotfix path, building resiliency with health checks and rollback, and implementing deployments of containers, binaries, scripts and databases in Azure Pipelines and GitHub Actions.',
  certs: ['az-401'],
  domains: ['az-401-3'],
  outcomes: ['az-401-3-4-1', 'az-401-3-4-2', 'az-401-3-4-3', 'az-401-3-4-4', 'az-401-3-4-5', 'az-401-3-4-6'],
  tags: ['blue-green', 'canary', 'rings', 'feature-flags', 'deployment-slots', 'rolling', 'hotfix', 'rollback', 'containers', 'dacpac'],
  difficulty: 'advanced',
  sections: [
    {
      heading: 'Choosing a deployment strategy',
      body: `Every strategy trades infrastructure cost against the size of the audience that sees a bad release first:

| Strategy | Mechanism | Exposure control | Rollback | Good for |
|---|---|---|---|---|
| **Blue-green** | Two identical environments; deploy to idle one, switch traffic | All or nothing at the switch | Switch back | Stateless web tiers, App Service slots |
| **Canary** | New version receives a small share of traffic (for example 5%), then more | Percentage of traffic | Shift traffic back | Services with good telemetry |
| **Ring-based** | Deploy to ring 0 (team), ring 1 (early adopters), ring 2 (region), ring 3 (everyone) with **bake time** | Audience groups | Stop the train at the failing ring | Products with distinct user populations |
| **Progressive exposure** | Umbrella term: any gradual rollout gated by health signals (canary + rings + flags) | Health-gated | Automated halt | Microsoft's safe deployment practices |
| **Feature flags** | Code ships dark; **Azure App Configuration Feature Management** turns it on by percentage, targeting groups or time window | Per feature, per user | Flip the flag (kill switch) | Decoupling deploy from release, trunk-based teams |
| **A/B testing** | Two variants served to cohorts to measure an outcome | Experiment cohorts | End experiment | Product decisions, not reliability |

Microsoft's **safe deployment practices** add rules: deploy during working hours, allow bake time (often a full business day including peak), watch quality signals, and stop at the first bad ring. On the exam, match the word in the scenario: "two production environments" is blue-green, "percentage of users" is canary or a percentage feature filter, "internal users first then regions" is rings, "turn off without redeploying" is a feature flag, "which version converts better" is A/B.`,
    },
    {
      heading: 'Ordering dependent deployments reliably',
      body: `Dependency failures look like flakiness but are design errors. Model the dependency graph explicitly:

- **Infrastructure before application**: a stage that deploys Bicep or Terraform (database, Key Vault, identity, networking) runs first; the application stage \`dependsOn\` it and reads its **outputs** (connection strings, resource names) rather than hard-coding them. Inside Bicep, implicit dependencies come from referencing another resource's properties; use \`dependsOn\` only when there is no reference.
- **Database before code when the schema is additive; code before database when removing**: the expand-and-contract pattern (add column, deploy code that writes both, backfill, deploy code that reads new, drop old) keeps every step backward compatible, so each deployment is independently safe.
- **Shared services before consumers**: platform components (API gateway, message broker, identity) deploy in their own pipeline; consumers trigger with a **pipeline resource trigger** or \`workflow_run\` after the platform pipeline succeeds, and gate on the platform's health check.
- **Across pipelines and teams**: use environments plus Exclusive lock to serialise deployments to a shared environment; publish versioned contracts (OpenAPI, schema packages) so consumers can pin.
- **Inside a stage**: deployment job lifecycle hooks (\`preDeploy\`, \`deploy\`, \`routeTraffic\`, \`postRouteTraffic\`) order migration, deploy, traffic switch and verification.

A reliable ordering design also handles the failure case: if the database migration fails, the application stage must not run (\`condition: succeeded()\`), and the failed stage should leave the system in the previous good state (idempotent scripts, transactional migrations).`,
    },
    {
      heading: 'Minimising downtime: load balancing, slot swaps and rolling updates',
      body: `Zero-downtime techniques keep at least one healthy instance serving while others change:

**Load balancing.** Put instances behind Azure Load Balancer, Application Gateway, Front Door or Traffic Manager and drain one instance at a time: mark it unhealthy (health probe fails on purpose or remove from the backend pool), update, warm up, re-add. Front Door and Traffic Manager also enable blue-green across regions by shifting weights.

**App Service deployment slots.** Available on Standard, Premium and Isolated tiers. Deploy to a \`staging\` slot, warm it up (slot swap triggers application initialisation; all instances must return any HTTP response), optionally validate with **swap with preview** (two-phase swap applies production settings to the slot first), then swap. Settings marked **slot settings** (sticky) stay with the slot; others move with the app. **Auto swap** removes the manual step when validation is not needed. Rollback is swapping back. Pipelines use \`AzureWebApp@1\` with \`deployToSlotOrASE\` plus \`AzureAppServiceManage@0\` (swap) or \`az webapp deployment slot swap\`; GitHub uses \`azure/webapps-deploy@v3\` with \`slot-name\` and a CLI swap step.

**Rolling deployments.** Replace instances in batches: Azure Pipelines deployment jobs with \`strategy: rolling\` and \`maxParallel\` (count or percentage) against VM environment resources; Kubernetes \`RollingUpdate\` with \`maxSurge\` and \`maxUnavailable\` plus readiness probes; Virtual Machine Scale Set rolling upgrade policy. The canary strategy in deployment jobs (\`increments: [10, 20]\`) is the percentage variant.

Complementary practices: database changes that stay backward compatible, connection draining, session state in a cache not in memory, retries with backoff in clients, and health endpoints that reflect dependencies so probes catch a half-ready instance. Downtime is usually caused by the step people forget: the schema change, the sticky session, or the config that was not a slot setting.`,
    },
    {
      heading: 'Hotfix path and resiliency strategy',
      body: `A **hotfix path** is a pre-agreed, faster route to production for high-priority fixes that keeps the controls that matter and drops the ones that only add latency:

1. Branch from the **tag or release branch** currently in production (\`hotfix/AB-1234\` from \`v3.1.2\`), never from main, so the fix contains only the fix.
2. Run the same pipeline with a \`hotfix\` parameter that skips long stages (full regression, load test) but keeps build, unit tests, security scanning, and the production approval; use Branch control to allow \`hotfix/*\` artifacts into production.
3. Deploy with the fastest safe strategy (slot swap or canary with a short bake) and verify with smoke tests.
4. **Cherry-pick the fix to main** (an agentic workflow can open that PR automatically) so the next release includes it.
5. Record the change: work item, incident link, retrospective. Copilot can draft the incident summary from the PR and the Azure SRE Agent investigation thread.

A **resiliency strategy for deployment** assumes deployments fail and makes failure cheap:

- **Health checks and automatic gates**: smoke tests in \`postRouteTraffic\`, the Query Azure Monitor alerts check before promoting rings, canary metrics with automatic rollback.
- **Rollback and roll-forward**: slot swap back, redeploy the previous immutable artifact (retained with a lease), feature flag off; keep database changes backward compatible so rolling back code never requires rolling back data.
- **Idempotent and retryable steps**: \`retryCountOnTaskFailure\`, idempotent IaC (Bicep what-if before apply), scripts that can rerun.
- **Isolation**: deploy region by region behind Front Door; Exclusive lock so two releases never overlap; timeouts on every job.
- **Observability**: release annotations in Application Insights, deployment markers in dashboards, alerts routed to the release channel, Azure SRE Agent correlating the incident with the deployment event.
- **Game days**: rehearse rollback in staging so the first rollback is not in production.`,
    },
    {
      heading: 'Implementing deployments: containers, binaries, scripts and databases',
      body: `Know the task or action for each target.

| Target | Azure Pipelines | GitHub Actions |
|---|---|---|
| **Containers** | \`Docker@2\` (build and push to ACR or ghcr.io), \`AzureWebAppContainer@1\`, \`AzureContainerApps@1\`, \`KubernetesManifest@1\` (bake, deploy, canary and blue-green strategies), Helm tasks | \`docker/build-push-action\`, \`azure/container-apps-deploy-action\`, \`azure/k8s-deploy\` (strategies: basic, canary, blue-green), \`azure/webapps-deploy\` with an image |
| **Binaries** | \`AzureWebApp@1\` (zip or package to App Service and slots), \`AzureFunctionApp@2\`, \`AzureRmWebAppDeployment@4\`, \`CopyFiles@2\` plus \`AzureFileCopy@6\` to storage or VMs, \`IISWebAppDeploymentOnMachineGroup@0\` for VM deployment groups | \`azure/webapps-deploy@v3\`, \`Azure/functions-action\`, \`azure/cli\` with \`az storage blob upload-batch\` for static sites |
| **Scripts** | \`AzureCLI@2\`, \`AzurePowerShell@5\`, \`Bash@3\`, \`PowerShell@2\`, \`SSH@0\`; \`AzureResourceManagerTemplateDeployment@3\` for ARM or Bicep | \`azure/cli@v2\`, \`azure/powershell@v2\`, \`azure/arm-deploy\` or \`az deployment group create\` for Bicep |
| **Databases** | \`SqlAzureDacpacDeployment@1\` (DACPAC publish, SQL scripts, or SQLCMD against Azure SQL), EF Core migrations via \`dotnet ef database update\` or a migrations bundle, Flyway or Liquibase CLI, \`AzureMysqlDeployment@1\` | \`azure/sql-action@v2\` (DACPAC, SQL scripts, SQL projects), EF or Flyway in a script step |

Cross-cutting rules: authenticate with a workload identity federation service connection or OIDC \`azure/login\`, never a stored secret; run database steps before the app for additive changes and make them idempotent; use \`KubernetesManifest\` or \`azure/k8s-deploy\` strategies rather than hand-rolled traffic switching; reference container images by digest in production; and wrap each target in a deployment job so the environment's approvals and history apply. Copilot can generate these tasks quickly, so the exam tests whether you know *which* task fits the target and *where* in the lifecycle it belongs.`,
    },
  ],
  examples: [
    {
      title: 'Canary deployment job with automatic health gate',
      description:
        'A checkout API deploys with the canary strategy: 10% of instances first, smoke tests and an Application Insights failure-rate query in postRouteTraffic, then the rest. If the query shows elevated failures, on: failure redeploys the previous image tag.',
      language: 'yaml',
      code: `- deployment: DeployApi
  environment: production
  strategy:
    canary:
      increments: [10]
      preDeploy:
        steps: [ { script: ./scripts/run-migrations.sh --idempotent } ]
      deploy:
        steps:
          - task: KubernetesManifest@1
            inputs: { action: deploy, strategy: canary, percentage: $(strategy.increment),
                      manifests: k8s/api.yml, containers: 'acr.azurecr.io/checkout-api:$(Build.BuildNumber)' }
      postRouteTraffic:
        steps:
          - script: ./scripts/smoke.sh https://api.contoso.com/health
          - task: AzureCLI@2
            inputs: { azureSubscription: sc-prod-wif, scriptType: bash, scriptLocation: inlineScript,
                      inlineScript: ./scripts/check-failure-rate.sh --max 1.0 }
      on:
        failure:
          steps: [ { task: KubernetesManifest@1, inputs: { action: reject, strategy: canary, manifests: k8s/api.yml } } ]
        success:
          steps: [ { task: KubernetesManifest@1, inputs: { action: promote, strategy: canary, manifests: k8s/api.yml } } ]`,
      takeaway: 'Lifecycle hooks turn a canary into a resilient deployment: migrate first, expose a slice, verify with telemetry, then promote or reject automatically.',
    },
    {
      title: 'Zero-downtime App Service release with slot swap in GitHub Actions',
      description:
        'The web app deploys to a staging slot, runs smoke tests against the slot URL, then swaps. Connection strings are slot settings so staging never talks to production data before the swap, and the swap is reversible.',
      language: 'yaml',
      code: `deploy:
  runs-on: ubuntu-latest
  environment: production
  permissions: { id-token: write, contents: read }
  steps:
    - uses: actions/download-artifact@v4
      with: { name: app, path: dist }
    - uses: azure/login@v2
      with: { client-id: \${{ secrets.AZURE_CLIENT_ID }}, tenant-id: \${{ secrets.AZURE_TENANT_ID }},
              subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }} }
    - uses: azure/webapps-deploy@v3
      with: { app-name: shop-web, slot-name: staging, package: dist }
    - run: curl --fail --retry 5 https://shop-web-staging.azurewebsites.net/health
    - run: az webapp deployment slot swap -g rg-shop -n shop-web --slot staging --target-slot production`,
      takeaway: 'Deploy to the slot, warm and verify it, then swap; rollback is the same command in reverse.',
    },
    {
      title: 'The schema change that broke the rollback (a realistic mistake)',
      description:
        'A team renames a database column and deploys the matching code in one release. Production errors spike; they swap slots back, but the old code expects the old column name and now fails too. The fix is expand-and-contract: add the new column, deploy code that writes both and reads the new one, backfill, then remove the old column in a later release. Each step is backward compatible so a swap back always works.',
      takeaway: 'Rollback only works when the database remains compatible with the previous code; sequence schema changes as additive first, destructive last.',
    },
    {
      title: 'Hotfix path with automatic back-merge',
      description:
        'A severity-1 bug is found in v3.1.2. The on-call engineer branches hotfix/AB-7788 from the v3.1.2 tag, the pipeline runs with hotfix=true (skipping load tests but keeping unit tests, security scan and the production approval), deploys via slot swap, and an agentic workflow opens a cherry-pick pull request to main when the hotfix PR merges.',
      language: 'yaml',
      code: `parameters:
  - name: hotfix
    type: boolean
    default: false
stages:
  - stage: Build
  - stage: Test
    condition: and(succeeded(), eq('\${{ parameters.hotfix }}', 'false'))   # full regression + load
  - stage: Security
  - stage: Production
    dependsOn: [Build, Security, Test]
    condition: and(in(dependencies.Build.result, 'Succeeded'), in(dependencies.Security.result, 'Succeeded'),
                   in(dependencies.Test.result, 'Succeeded', 'Skipped'))`,
      takeaway: 'A hotfix path is the normal pipeline with pre-agreed skips, branched from what is in production, and always followed by a merge back to main.',
    },
  ],
  keyPoints: [
    'Blue-green switches between two environments; canary shifts a traffic percentage; rings expose audience groups with bake time; progressive exposure is health-gated gradual rollout; feature flags decouple deploy from release; A/B tests measure outcomes.',
    'Order dependent deployments with stage dependsOn and outputs, Bicep references, expand-and-contract schema changes, pipeline resource or workflow_run triggers across pipelines, and Exclusive lock on shared environments.',
    'Zero downtime: drain instances behind a load balancer, use App Service slots (Standard, Premium, Isolated) with warm-up, swap with preview, slot settings and auto swap, and rolling or canary deployment job strategies with maxParallel or increments.',
    'Hotfix path: branch from the production tag, run the pipeline with agreed skips but keep tests, scanning and approval, deploy with slot swap or short canary, then cherry-pick to main.',
    'Resiliency: health checks in postRouteTraffic, Query Azure Monitor alerts gates, automatic rollback via on: failure, immutable retained artifacts, backward-compatible data changes, idempotent steps, region isolation and rehearsed rollbacks.',
    'Containers: Docker@2, KubernetesManifest@1 (canary and blue-green), AzureContainerApps@1, azure/k8s-deploy; binaries: AzureWebApp@1, AzureFunctionApp@2, azure/webapps-deploy; scripts: AzureCLI@2, AzurePowerShell@5, azure/cli; databases: SqlAzureDacpacDeployment@1, azure/sql-action, EF migrations, Flyway.',
    'Authenticate deployments with workload identity federation or OIDC and wrap them in deployment jobs so environment approvals and history apply.',
  ],
  flashcards: [
    { front: 'Which deployment strategy routes a small percentage of traffic to the new version before expanding?', back: 'Canary (progressive exposure by traffic percentage).' },
    { front: 'What is a ring-based deployment?', back: 'Rolling out to successive audience groups (team, early adopters, regions, everyone) with bake time between rings.' },
    { front: 'Which App Service tiers support deployment slots?', back: 'Standard, Premium and Isolated.' },
    { front: 'What does "swap with preview" do?', back: 'A two-phase swap that applies the target slot’s settings to the source slot first so you can validate before completing the swap.' },
    { front: 'Which lifecycle hooks does an Azure Pipelines deployment job offer?', back: 'preDeploy, deploy, routeTraffic, postRouteTraffic, and on: failure / on: success.' },
    { front: 'Which deployment job strategy deploys in increments such as [10, 20]?', back: 'canary; rolling uses maxParallel across environment resources; runOnce runs each hook once.' },
    { front: 'What is the expand-and-contract pattern?', back: 'Make database changes additive first, deploy compatible code, backfill, then remove the old structure later so every step can be rolled back.' },
    { front: 'Where should a hotfix branch be created from?', back: 'The tag or release branch currently in production, then cherry-picked back to main.' },
    { front: 'Which Azure Pipelines task publishes a DACPAC to Azure SQL?', back: 'SqlAzureDacpacDeployment@1 (GitHub equivalent: azure/sql-action).' },
    { front: 'Which task deploys Kubernetes manifests with built-in canary and blue-green strategies?', back: 'KubernetesManifest@1 (GitHub: azure/k8s-deploy).' },
    { front: 'Which Azure service provides feature flags with percentage and targeting filters?', back: 'Azure App Configuration Feature Management.' },
  ],
  quiz: [
    {
      question:
        'Contoso wants to release a new checkout flow to 5% of users, then 25%, then everyone, turning it off instantly if error rates rise, without redeploying. Which approach is MOST appropriate?',
      options: [
        'Blue-green deployment with two App Service plans',
        'A feature flag in Azure App Configuration with a percentage filter',
        'A rolling deployment with maxParallel 25%',
        'A/B testing with two variants',
      ],
      correct: [1],
      explanation:
        'Feature flags expose by percentage and act as a kill switch without redeploying. Blue-green is all-or-nothing, rolling controls instance replacement rather than user exposure, and A/B testing measures outcomes rather than controlling risk.',
    },
    {
      question:
        'An application stage sometimes fails because the Azure SQL database it depends on has not finished deploying from the infrastructure stage in the same pipeline. What should you do?',
      options: [
        'Add a 10-minute sleep before the application stage.',
        'Make the application stage dependsOn the infrastructure stage and consume its output variables.',
        'Run both stages in parallel on different agents.',
        'Move the database deployment to a scheduled pipeline.',
      ],
      correct: [1],
      explanation:
        'Explicit dependencies and outputs make ordering deterministic. Sleeps are fragile, parallel execution worsens the race, and a schedule decouples the deployments further.',
    },
    {
      question:
        'A web app on an App Service Standard plan must deploy with no dropped requests and allow instant rollback. Which TWO steps should the pipeline include? (Select two)',
      options: [
        'Deploy to a staging slot and warm it up',
        'Swap the staging slot into production',
        'Stop the production app before deploying',
        'Scale the plan to Basic to reduce cost during deployment',
      ],
      correct: [0, 1],
      explanation:
        'Slot deploy plus swap gives zero downtime and swap-back rollback. Stopping the app causes downtime and the Basic tier does not support slots.',
    },
    {
      question:
        'A severity-1 defect is found in production (tag v4.2.0) while main already contains unreleased features. Where should the hotfix branch be created and what must happen afterwards?',
      options: [
        'From main; deploy main to production',
        'From the v4.2.0 tag; after release, cherry-pick the fix into main',
        'From the develop branch; merge develop into main',
        'From the staging environment configuration',
      ],
      correct: [1],
      explanation:
        'Branching from the production tag keeps the change minimal; back-merging prevents regression. Deploying main ships untested features, and develop or environment configs are not the production baseline.',
    },
    {
      question:
        'Which Azure Pipelines task should you use to publish a DACPAC to an Azure SQL database as part of a deployment job?',
      options: ['AzureCLI@2', 'SqlAzureDacpacDeployment@1', 'AzureWebApp@1', 'KubernetesManifest@1'],
      correct: [1],
      explanation:
        'SqlAzureDacpacDeployment@1 publishes DACPACs and runs SQL scripts. AzureCLI runs arbitrary commands, AzureWebApp deploys app packages and KubernetesManifest targets clusters.',
    },
    {
      question:
        'After a canary deployment, you want the pipeline to automatically roll back when Application Insights shows an elevated failure rate for the new version. Where should the verification run?',
      options: [
        'In the preDeploy hook',
        'In the postRouteTraffic hook, with rollback steps under on: failure',
        'In a separate pipeline triggered weekly',
        'In the build stage',
      ],
      correct: [1],
      explanation:
        'postRouteTraffic runs after traffic reaches the new version, so health can be measured; on: failure performs the rollback. preDeploy runs before deployment, and build or weekly pipelines cannot gate the rollout.',
    },
  ],
  statements: [
    { text: 'Blue-green deployment exposes the new version to a small percentage of users first.', isTrue: false, explanation: 'Blue-green switches all traffic at once; canary exposes a percentage.' },
    { text: 'Microsoft’s safe deployment practices recommend bake time between rings, ideally covering a period of peak usage.', isTrue: true, explanation: 'Bake time lets latent issues surface before expanding exposure.' },
    { text: 'App Service deployment slots are available on the Basic tier.', isTrue: false, explanation: 'Slots require Standard, Premium or Isolated.' },
    { text: 'Settings marked as slot settings stay with the slot during a swap.', isTrue: true, explanation: 'Sticky slot settings do not move; other settings swap with the app.' },
    { text: 'A rolling deployment job in Azure Pipelines uses maxParallel to control how many targets update at once.', isTrue: true, explanation: 'maxParallel is a count or percentage of environment resources.' },
    { text: 'Rolling back application code is always sufficient to recover from a failed release.', isTrue: false, explanation: 'Incompatible database changes can make the previous code fail; data changes must stay backward compatible.' },
    { text: 'KubernetesManifest@1 supports canary and blue-green strategies natively.', isTrue: true, explanation: 'The task provides deploy, promote and reject actions for both strategies.' },
  ],
  resources: [
    { label: 'Deployment jobs and strategies (Azure Pipelines)', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/process/deployment-jobs' },
    { label: 'Set up staging environments in Azure App Service', url: 'https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots' },
    { label: 'Safe deployment practices', url: 'https://learn.microsoft.com/en-us/devops/operate/safe-deployment-practices' },
    { label: 'Feature management in Azure App Configuration', url: 'https://learn.microsoft.com/en-us/azure/azure-app-configuration/concept-feature-management' },
  ],
};

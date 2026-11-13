import type { Concept } from '../../types';

export const releaseStrategiesAndCicd: Concept = {
  id: 'release-strategies-and-cicd',
  title: 'Release Methodologies, Multi-Environment Rollout and CI/CD for Agents',
  summary:
    'Shipping multi-agent solutions safely on Azure: choosing between DTAP, blue/green and canary releases, implementing multi-environment promotion with immutable agent versions, traffic selectors and rollback, and specifying CI/CD with infrastructure as code (Bicep or Terraform), OIDC authentication, azd pipelines, GitHub Actions or Azure DevOps stages, and evaluation gates.',
  certs: ['ai-500'],
  domains: ['ai-500-4'],
  outcomes: ['ai-500-4-3-1', 'ai-500-4-3-2', 'ai-500-4-3-4'],
  tags: ['ci-cd', 'release', 'canary', 'blue-green', 'dtap', 'azd', 'bicep', 'terraform', 'github-actions', 'azure-devops', 'rollback'],
  difficulty: 'advanced',
  diagram: 'agentic-sdlc',
  sections: [
    {
      heading: 'Choosing a release methodology',
      body: `Agents change along three axes at once: code, prompt and model. A release methodology must cover all three.

- **DTAP (Development, Test, Acceptance, Production)** separates environments. In Foundry each environment should be a **separate project** (ideally separate resource groups or subscriptions), because environment names alone do not isolate Azure resources, quotas, connections or role assignments. Promote the *same source revision* through each stage; acceptance is where human evaluation templates and compliance sign-off live.
- **Blue/green** keeps two complete production deployments and switches traffic at once. For agents this maps to two agent versions behind one endpoint or two projects behind a gateway; it gives instant rollback but doubles quota and makes gradual observation impossible.
- **Canary** routes a small share of production traffic to the candidate while the stable version serves the rest, then increases the share as evaluation scores, success rate and latency hold. Foundry hosted agents support this natively: both versions share one agent endpoint and \`agentEndpoint.versionSelector\` (set with \`azd ai agent endpoint update\`) controls the split; prompt agents are immutable versions you can target by \`name:version\` or switch the default to.

Choose canary when behaviour is probabilistic and you need production evidence (most LLM changes), blue/green when a change must be all-or-nothing (protocol or schema changes consumers depend on), and DTAP always as the backbone that gates what reaches production. Model version updates deserve the same treatment: pin model versions in dev and test, evaluate, then promote, rather than enabling auto-update everywhere.`,
    },
    {
      heading: 'Multi-environment release: promotion, rollout, rollback',
      body: `A release pipeline for Foundry agents follows a repeatable sequence:

1. **Build once, deploy per environment.** Container images (Azure Container Registry, pinned by digest, geo-replicated if needed) or source zips are built from a tagged commit; azd deploys the same revision with environment-specific values resolved from \`.azure/<env>/.env\` (\`\${FOUNDRY_PROJECT_ENDPOINT}\`, model deployment names, connection names) so one \`azure.yaml\` serves dev, test and prod.
2. **Deploy and smoke test** in development (\`azd deploy -e development\`, \`azd ai agent invoke --new-session --new-conversation\`), then repeat in test and run regression, integration and automated evaluations against the deployed agent version.
3. **Approve.** GitHub environment protection rules or Azure DevOps environment approvals and checks gate the production stage; serialise production deployments and route changes so two writers never update the same agent concurrently (Terraform state locks do not coordinate other tools).
4. **Roll out gradually.** Create the production version while the stable version keeps serving, then shift the canary share with the version selector, watching the Monitor dashboard, continuous evaluation and alerts between steps.
5. **Roll back** by pointing the selector or default version back to the previous immutable version; because versions are immutable and retained, rollback is a routing change, not a rebuild. Keep the previous image and prompt version until the new one has served a full cycle.
6. **Record** the version, model version, dataset version and evaluation results together so regressions are attributable, and update the agent card or published endpoint metadata only after the new version is stable.

Rollback must also consider state: a new version that changed memory schemas, tool contracts or workflow checkpoints needs backward-compatible readers or a migration plan, or old sessions will fail after rollback.`,
    },
    {
      heading: 'CI/CD requirements: infrastructure as code, identity, pipelines',
      body: `Specify the pipeline in terms an exam question can check:

- **Infrastructure as code.** Platform resources (Foundry account and project, model deployments, connections, Key Vault, AI Search, Cosmos DB, ACR, Application Insights, RAI policies, role assignments, networking) are Bicep or Terraform in the ARM control plane; the logical hosted agent is a data-plane resource (\`Microsoft.Foundry/agents@v1\`) managed through azd, the SDK, REST or Terraform's \`azapi_data_plane_resource\`. Separate the shared platform layer (platform team, slower cadence) from agent releases (application team, frequent), and let \`azd ai agent init --infra=bicep|terraform\` eject editable infrastructure. Commit provider lockfiles; never commit Terraform state, plans or \`.azure/\` environment state. Terraform remote state lives in Azure Storage with Entra authentication, one state key per environment.
- **Identity.** Pipelines authenticate with **OpenID Connect federated credentials**, no stored secrets; the workload identity gets Foundry User and Contributor on the target project for code deployment (plus ACR push and related roles for container deployment), scoped per environment. Secrets the agent needs come from Key Vault references, not pipeline variables.
- **Pipeline stages.** Lint and unit tests; build and push image; \`azd provision\` (IaC) and \`azd deploy\`; deployed smoke test; automated evaluation gate (Foundry evaluation GitHub Action or Azure DevOps task, or \`azd ai eval run start --fail-on\`), guardrail and red-team probes; promotion with approvals; canary rollout and rollback job. \`azd pipeline config\` generates the GitHub Actions or Azure Pipelines workflow, service principal and repository variables, and \`azd ai agent doctor\` fails fast on missing roles or variables.
- **Testing in CI** reuses the testing strategy: unit tests with mocked models, local integration via \`azd ai agent run\`, deployed integration via \`azd ai agent invoke\`, regression datasets, and statistical comparison of candidate against baseline versions.

Non-interactive flags matter: \`--no-prompt\`, \`--output json\`, \`--force\` only where replacement is intended (connection create is not an upsert).`,
    },
    {
      heading: 'The exam angle',
      body: `Deployment items are scenario comparisons. Recognise these cues:

- "Gradually increase the share of traffic and watch evaluation scores" means **canary** with the hosted-agent **version selector**; "switch all traffic at once with instant rollback" means **blue/green**; "separate environments for sign-off" means **DTAP** with separate Foundry projects.
- "Rollback" for Foundry agents is re-pointing to a retained **immutable version**, not redeploying old code; if the question mentions changed state schemas, the correct answer includes compatibility or migration.
- "No secrets in the pipeline" means **OIDC federated credentials** with scoped role assignments; "pipeline cannot deploy" often means the identity lacks Foundry User or Contributor on the project, or ACR push rights for container mode.
- "Platform team and app team release at different cadences" means separating platform IaC (Bicep or Terraform, control plane) from agent definitions (data plane via azd, SDK or AzAPI).
- "Prevent regressions before production" means an **automated evaluation gate** on a versioned dataset with thresholds and statistical comparison, plus guardrail probes and red-team scans, not manual playground checks.
- Distractors: Azure Policy where a pipeline gate is needed, content filters where rollback is needed, environment names as isolation, committing Terraform state, or auto-updating model versions straight into production.`,
    },
  ],
  examples: [
    {
      title: 'Canary rollout and rollback of a hosted agent version',
      description:
        'After the test stage passes, production receives version 13 while version 12 keeps serving. The pipeline shifts 10%, then 50%, then 100% of traffic through the endpoint version selector, checking the evaluation gate between steps, and the rollback job re-points to version 12 if alerts fire.',
      language: 'bash',
      code: `TARGET_ENV=production
# Deploy the same tested commit; the stable version keeps serving until routing changes.
azd deploy support-agent -e "$TARGET_ENV" --no-prompt
NEW=$(azd ai agent show support-agent -e "$TARGET_ENV" --output json --no-prompt | jq -r '.latestVersion')

# Smoke-test the candidate explicitly before any production traffic sees it.
azd ai agent invoke support-agent "Where is my order 12345?" -e "$TARGET_ENV" \\
  --version "$NEW" --protocol responses --new-session --new-conversation --no-prompt

# Canary: shift traffic in steps (version selector on the shared endpoint), gating on evaluations/alerts.
for share in 10 50 100; do
  azd ai agent endpoint update support-agent -e "$TARGET_ENV" \\
    --version-selector "{\\"$NEW\\": $share, \\"$STABLE\\": $((100 - share))}" --no-prompt
  azd ai eval run start --fail-on "task_adherence<0.9" || { \\
    azd ai agent endpoint update support-agent -e "$TARGET_ENV" --version-selector "{\\"$STABLE\\": 100}" --no-prompt; exit 1; }
done`,
      takeaway: 'Versions are immutable: rollout and rollback are routing changes on the endpoint, gated by evaluations and alerts.',
    },
    {
      title: 'GitHub Actions stages with OIDC and an evaluation gate',
      description:
        'The workflow authenticates with federated credentials (no secrets), deploys to test, runs the Foundry evaluation action comparing the candidate with the production baseline, and only then proceeds to a protected production environment.',
      language: 'yaml',
      code: `on: { push: { branches: [main] } }   # agent-release workflow
permissions: { id-token: write, contents: read }
jobs:
  test:
    runs-on: ubuntu-latest
    environment: test
    steps:
      - uses: actions/checkout@v4
      - uses: Azure/setup-azd@v2
      - uses: azure/login@v2
        with: { client-id: \${{ vars.AZURE_CLIENT_ID }}, tenant-id: \${{ vars.AZURE_TENANT_ID }}, subscription-id: \${{ vars.AZURE_SUBSCRIPTION_ID }} }
      - run: azd ext install microsoft.foundry && azd config set auth.useAzCliAuth true && azd env select test && azd deploy --no-prompt && azd ai agent doctor --no-prompt && azd ai agent invoke "Hello from CI" --no-prompt
      - name: Evaluation gate (candidate vs baseline, statistical comparison)
        uses: microsoft/ai-agent-evals@v2-beta
        with:
          azure-ai-project-endpoint: \${{ vars.FOUNDRY_PROJECT_ENDPOINT }}
          deployment-name: \${{ vars.JUDGE_DEPLOYMENT }}
          data-path: evals/regression.json
          agent-ids: "support-agent:\${{ github.run_number }},support-agent:12"
          baseline-agent-id: "support-agent:12"
  production:   # protection rules require approval; promotes the same commit with a canary rollout
    needs: test
    environment: production
    runs-on: ubuntu-latest
    steps: [ { run: "echo promote same commit with canary rollout" } ]`,
      takeaway: 'OIDC login, per-environment variables, a doctor and smoke step, an evaluation gate, then a protected production stage.',
    },
    {
      title: 'Rollback that broke old sessions (a realistic mistake)',
      description:
        'A team rolled a hosted agent from version 9 back to version 8 after a quality regression. Version 9 had changed the state-store checkpoint schema; version 8 could not read the new checkpoints and every active session failed. The fix: treat state schema changes as breaking, version the checkpoint payloads, keep readers backward compatible for one release, and include a "state compatibility" check in the release checklist. Rollback is only safe when the previous version can read the current state.',
      takeaway: 'Routing rollback is instant, but state, memory and tool contracts must stay compatible across the versions in play.',
    },
    {
      title: 'Separating platform infrastructure from agent releases with Terraform',
      description:
        'The platform team manages the Foundry account, project, model deployments, RAI policy and ACR connection in a foundry_base configuration; the application team applies the hosted agent definition as a data-plane resource with the image digest and policy id as inputs, then waits for readiness before promoting.',
      language: 'text',
      code: `# hosted_agent/main.tf (application team) - platform resources are inputs, not managed here
resource "azapi_data_plane_resource" "support_agent" {
  type      = "Microsoft.Foundry/agents@v1"
  parent_id = var.project_data_plane_endpoint     # from the platform team's outputs
  name      = "support-agent"
  body = {
    definition = {
      kind  = "hosted"
      image = "contoso.azurecr.io/support-agent@sha256:\${var.image_digest}"   # immutable digest
      model = var.model_deployment_name
      rai_config = { rai_policy_name = var.rai_policy_resource_id }       # full ARM id
    }
  }
}
# Unchanged apply = no new version; changed definition = new version under the same logical agent.
# Pin production to the stable version before applying a candidate definition.`,
      takeaway: 'Control-plane platform IaC and data-plane agent definitions have different owners, cadences and tooling; keep them in separate configurations.',
    },
  ],
  keyPoints: [
    'DTAP needs separate Foundry projects per environment (names do not isolate resources); promote the same source revision through each stage.',
    'Canary uses the hosted-agent endpoint version selector to shift traffic gradually with evaluation gates; blue/green switches all traffic at once for all-or-nothing changes; prompt agents roll out by targeting or switching immutable versions.',
    'Rollback is re-pointing to a retained immutable version; keep state, memory and tool contracts backward compatible or plan migrations.',
    'Build once, deploy per environment with azd environments and variable substitution; serialise production writers; record agent, model and dataset versions with evaluation results.',
    'IaC: platform resources in Bicep or Terraform (control plane); the logical agent via azd, SDK, REST or azapi_data_plane_resource (data plane); commit lockfiles, never state or .azure folders; remote Terraform state in Azure Storage with Entra auth.',
    'Pipelines authenticate with OIDC federated credentials and scoped roles (Foundry User and Contributor on the project; ACR push for containers); secrets come from Key Vault.',
    'Pipeline stages: unit tests, build, provision, deploy, doctor and smoke test, evaluation gate (GitHub Action, Azure DevOps task or azd ai eval --fail-on), guardrail and red-team probes, approvals, canary, rollback job.',
  ],
  flashcards: [
    { front: 'Why should each DTAP stage be a separate Foundry project?', back: 'Environment names alone do not isolate Azure resources, quota, connections or role assignments; separate projects (or subscriptions) do.' },
    { front: 'How does a canary rollout work for Foundry hosted agents?', back: 'Both versions share one endpoint; agentEndpoint.versionSelector (azd ai agent endpoint update) sets the traffic share, increased stepwise while monitoring.' },
    { front: 'How do you roll back a Foundry agent after a bad release?', back: 'Point the endpoint selector or default version back to the previous immutable version; no rebuild required, provided state remains compatible.' },
    { front: 'Which Terraform resource type manages a logical hosted agent?', back: 'azapi_data_plane_resource with type Microsoft.Foundry/agents@v1 against the project data-plane endpoint.' },
    { front: 'Which files must NOT be committed in an azd/Terraform agent project?', back: 'Terraform state, saved plans, .terraform/ and the .azure/ environment state (they can contain sensitive values).' },
    { front: 'How should a CI pipeline authenticate to Azure for agent deployment?', back: 'OpenID Connect federated credentials on a Microsoft Entra application, with scoped role assignments; no stored client secrets.' },
    { front: 'Which roles does a workload identity need for code-mode hosted agent deployment?', back: 'Foundry User and Contributor on the target Foundry project (plus container registry push/pull roles for container mode).' },
    { front: 'What does azd pipeline config do?', back: 'Detects the Git provider, creates a service principal, sets repository variables and secrets from the azd environment, and generates the GitHub Actions or Azure Pipelines workflow.' },
    { front: 'When is blue/green preferable to canary for an agent release?', back: 'When a change must be all-or-nothing, such as a protocol or schema change that consumers depend on, and instant full rollback matters more than gradual evidence.' },
    { front: 'What should gate promotion to production in an agent pipeline?', back: 'Automated evaluations on a versioned dataset with thresholds and statistical comparison to the baseline, guardrail and red-team probes, and environment approvals.' },
  ],
  quiz: [
    {
      question:
        'A new prompt and tool change passed test. The team wants production evidence before full exposure and the ability to revert instantly. Which release approach is MOST appropriate for the hosted agent?',
      options: [
        'Blue/green: deploy a second project and switch DNS.',
        'Canary: deploy the new version to the same endpoint and shift traffic gradually with the version selector, rolling back by re-pointing to the previous version.',
        'Deploy directly to production and monitor.',
        'Enable model auto-update in production.',
      ],
      correct: [1],
      explanation:
        'Canary gives gradual production evidence and instant routing rollback. Blue/green is all-or-nothing, direct deployment lacks safety, and model auto-update is unrelated and risky.',
    },
    {
      question: 'Which TWO practices are correct for CI/CD authentication and secrets in a Foundry agent pipeline? (Select two)',
      options: [
        'Use OIDC federated credentials for the pipeline identity with roles scoped to each environment\'s project.',
        'Store the agent\'s third-party API keys as GitHub repository variables.',
        'Reference secrets from Azure Key Vault through project connections rather than pipeline variables.',
        'Commit the .azure environment folder so runners share configuration.',
      ],
      correct: [0, 2],
      explanation:
        'OIDC removes stored secrets and Key Vault keeps agent secrets out of pipelines. Repository variables are not secret stores, and .azure state must not be committed.',
    },
    {
      question:
        'A platform team owns Foundry accounts, model deployments and RAI policies and changes them quarterly; application teams release agents weekly. How should infrastructure as code be organised?',
      options: [
        'One Terraform configuration containing everything, applied by every team.',
        'Separate configurations: platform resources in the control plane (Bicep or Terraform) owned by the platform team, and agent definitions as data-plane resources (azd, SDK or azapi_data_plane_resource) owned by application teams, with platform outputs as inputs.',
        'Manual portal changes for agents and IaC for platform.',
        'Store agent definitions in the model deployment metadata.',
      ],
      correct: [1],
      explanation:
        'Different owners, cadences and API surfaces call for separate layers. A single configuration couples cadences, manual changes are unrepeatable, and model metadata is not an agent definition.',
    },
    {
      question:
        'After rolling back from version 7 to version 6, active sessions started failing. Version 7 had introduced a new checkpoint format. What should the release process have required?',
      options: [
        'A longer canary period.',
        'Backward-compatible state readers or a migration plan, with a state-compatibility check before promotion.',
        'Deleting all sessions before deployment.',
        'Pinning the model version.',
      ],
      correct: [1],
      explanation:
        'Routing rollback cannot fix incompatible state. Compatibility planning is the control; longer canaries do not change compatibility, deleting sessions harms users, and model pinning is unrelated.',
    },
    {
      question: 'Which pipeline step provides the strongest protection against shipping a quality regression to production?',
      options: [
        'A manual playground conversation by the developer.',
        'An automated evaluation gate that compares the candidate agent version with the baseline on a versioned dataset and fails below thresholds.',
        'A linter on the prompt text.',
        'Deploying at night.',
      ],
      correct: [1],
      explanation:
        'Automated, statistically compared evaluations detect regressions objectively. Manual chats and linters miss behavioural regressions, and timing does not reduce risk.',
    },
    {
      question: 'Your pipeline\'s azd deploy fails with an authorization error on the Foundry project although Azure login succeeded. What is the MOST likely cause?',
      options: [
        'The runner lacks Node.js.',
        'The workload identity lacks Foundry User and Contributor roles on the target project (or ACR push rights for container mode).',
        'Application Insights is not connected.',
        'The guardrail policy is missing.',
      ],
      correct: [1],
      explanation:
        'Deployment is a data-plane and resource operation requiring Foundry roles on the project. Runtime dependencies, telemetry and guardrails do not cause authorization failures during deploy.',
    },
  ],
  statements: [
    { text: 'Using azd environment names such as test and production is sufficient to isolate Azure resources between stages.', isTrue: false, explanation: 'Bind each environment to a separate Foundry project; names alone do not isolate resources, quota or permissions.' },
    { text: 'Foundry prompt agent versions are immutable, which makes rollback a matter of targeting a previous version.', isTrue: true, explanation: 'Each saved change creates a new version; older versions remain available.' },
    { text: 'Terraform state locking coordinates concurrent updates to the same hosted agent made by azd or the portal.', isTrue: false, explanation: 'State locking protects Terraform operations only; serialise other writers yourself.' },
    { text: 'A canary deployment for hosted agents routes a share of traffic to a candidate version on the same endpoint.', isTrue: true, explanation: 'The endpoint version selector controls the split.' },
    { text: 'Unchanged Terraform applies of a hosted agent definition create new agent versions each run.', isTrue: false, explanation: 'Only a changed definition creates a new version; unchanged applies produce no new release identifier.' },
    { text: 'The Foundry evaluation GitHub Action can compare multiple agent versions against a baseline with statistical significance testing.', isTrue: true, explanation: 'Pass comma-separated agent-ids and a baseline-agent-id.' },
    { text: 'Blue/green releases are generally preferable to canary for probabilistic LLM behaviour changes that need production evidence.', isTrue: false, explanation: 'Canary provides gradual production evidence; blue/green suits all-or-nothing changes.' },
  ],
  resources: [
    { label: 'Promote hosted agents to production with the Azure Developer CLI (canary rollout)', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/deploy-hosted-agent-production' },
    { label: 'Set up CI/CD for hosted agents with the Azure Developer CLI', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/set-up-ci-cd-cli' },
    { label: 'Deploy a Microsoft Foundry hosted agent with Terraform', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/deploy-hosted-agent-terraform' },
    { label: 'Test a hosted agent (unit, integration, structured evaluation)', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/test-hosted-agent' },
  ],
};

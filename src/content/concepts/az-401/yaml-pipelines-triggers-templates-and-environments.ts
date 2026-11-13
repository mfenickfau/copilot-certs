import type { Concept } from '../../types';

export const yamlPipelinesTriggersTemplatesAndEnvironments: Concept = {
  id: 'yaml-pipelines-triggers-templates-and-environments',
  title: 'YAML Pipelines with Copilot: Triggers, Stages, Templates and Environment Approvals',
  summary:
    'Authoring Azure Pipelines and GitHub Actions YAML with GitHub Copilot, controlling when pipelines run with trigger rules, ordering jobs with dependencies, parallelism and multi-stage pipelines, reusing YAML through templates, task groups, variables and variable groups, and gating stages with YAML-based environments, checks and approvals.',
  certs: ['az-401'],
  domains: ['az-401-3'],
  outcomes: ['az-401-3-3-5', 'az-401-3-3-6', 'az-401-3-3-7', 'az-401-3-3-8', 'az-401-3-3-9'],
  tags: ['yaml', 'azure-pipelines', 'github-actions', 'triggers', 'stages', 'templates', 'variable-groups', 'environments', 'approvals', 'copilot'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Developing pipeline YAML with GitHub Copilot',
      body: `Copilot is good at YAML when you give it the schema and the constraints. In VS Code, install the **Azure Pipelines** extension (schema validation and IntelliSense for \`azure-pipelines.yml\`) or rely on GitHub's workflow schema for \`.github/workflows/*.yml\`, then work in **Copilot Chat or agent mode** with prompts that state platform, trigger, stages and policies: "Azure Pipelines YAML, trigger on main and release/*, stages build, test, deploy-staging, deploy-prod using the environment \`prod\` with approvals, use the shared template repo \`pipeline-templates\`". Copilot can also convert a classic pipeline or a GitHub Actions workflow into the other platform's YAML, explain an existing pipeline, and fix the error from a failed run when you paste the log or let the GitHub MCP server fetch it.

Habits that keep generated YAML trustworthy:

- Validate before you run: the Azure Pipelines editor's **Validate** action, \`az pipelines runs\` on a feature branch, or GitHub's workflow editor; for Actions run \`actionlint\` locally.
- Pin versions Copilot guesses: \`actions/checkout@v4\`, task versions such as \`AzureCLI@2\`; ask for SHAs where policy requires.
- Review permissions it adds: GitHub \`permissions:\` blocks should be minimal; Azure Pipelines should use existing service connections, never inline secrets.
- Keep repository instructions (\`.github/copilot-instructions.md\`) describing your pipeline conventions (template repo, naming, approved pools) so every generated pipeline follows them.

Copilot drafts; the pipeline policy (required templates, environment checks, protected service connections) decides what is allowed to run.`,
    },
    {
      heading: 'Trigger rules',
      body: `Triggers decide when a pipeline runs, and misconfigured triggers are the most common cost and reliability bug.

**Azure Pipelines**
- \`trigger:\` (CI) with \`branches: include/exclude\`, \`paths: include/exclude\` (case-sensitive), \`tags\`, and \`batch: true\` to collapse pushes while a run is in progress; \`trigger: none\` disables CI.
- \`pr:\` for pull request validation **only for GitHub and Bitbucket Cloud repos**; Azure Repos uses the **build validation branch policy** instead. \`pr: none\` disables it.
- \`schedules:\` with \`cron\` (UTC), \`branches\` and \`always: false\` so scheduled runs skip when nothing changed.
- \`resources: pipelines:\` with \`trigger:\` for **pipeline completion triggers**, and \`resources: repositories:\` to trigger from another repository's changes; \`resources: containers:\` for container image updates.
- Manual runs can override parameters; \`condition:\` on jobs and stages controls what runs inside the pipeline.

**GitHub Actions**
- \`on: push\` and \`on: pull_request\` with \`branches\`, \`branches-ignore\`, \`paths\`, \`paths-ignore\`, \`tags\` filters (you cannot combine \`branches\` with \`branches-ignore\` on one event; use \`!\` patterns).
- \`pull_request_target\` runs in the base repository context with secrets, so treat it with care for fork PRs.
- \`workflow_dispatch\` (manual, with inputs), \`schedule\` (cron, UTC, from the default branch), \`workflow_run\` (chain after another workflow), \`workflow_call\` (reusable workflow), \`release\`, \`issues\`, \`deployment\` and dozens of other events.
- \`concurrency\` groups serialise or cancel runs; \`if:\` conditions and \`github.event\` payload filters refine behaviour.

Exam patterns: "run only when src/ changes" means path filters; "do not run twice for rapid pushes" means \`batch: true\` or \`concurrency\` with \`cancel-in-progress\`; "run after the build pipeline in another project" means a pipeline resource trigger; "validate PRs on Azure Repos" means a branch policy, not \`pr:\`.`,
    },
    {
      heading: 'Job execution order, parallelism and multi-stage pipelines',
      body: `Pipelines are graphs. In **Azure Pipelines**, a pipeline has **stages**, stages have **jobs**, jobs have **steps**. Stages run sequentially by default; \`dependsOn\` makes the graph explicit (an empty \`dependsOn: []\` makes stages parallel) and \`condition\` decides whether a stage runs (\`succeeded()\`, \`failed()\`, custom expressions on variables or stage outputs). Jobs inside a stage run **in parallel** by default up to your parallel-job licence; \`dependsOn\` serialises them and lets one consume another's output variables (\`$[ dependencies.A.outputs['step.var'] ]\`). The \`strategy\` keyword gives \`matrix\` (fan out over OS or versions with \`maxParallel\`) and \`parallel\` (slice tests across agents). **Deployment jobs** target an environment and use \`runOnce\`, \`rolling\` or \`canary\` strategies with lifecycle hooks.

In **GitHub Actions**, a workflow has **jobs** that run in parallel unless \`needs:\` orders them; outputs flow through \`jobs.<id>.outputs\`; \`strategy.matrix\` with \`max-parallel\` and \`fail-fast\` fans out; \`if:\` conditions and \`continue-on-error\` shape failure handling; reusable workflows called with \`uses:\` act like stages, and **environments** give each deployment job its gates. There is no native stage keyword, so a multi-stage pipeline is a chain of jobs (or reusable workflows) linked with \`needs\` and environments.

Design guidance for both: build once in the first stage and publish the artifact; fan out tests in parallel; deploy sequentially through environments (dev, test, staging, production), with the production stage depending on staging success; use conditions so a hotfix path can skip non-essential stages; and set timeouts per job. A pipeline that rebuilds in every stage is the classic anti-pattern because the thing tested is not the thing deployed.`,
    },
    {
      heading: 'Reusable elements: templates, task groups, variables and variable groups',
      body: `Reuse removes drift between pipelines and lets a platform team enforce standards.

**Azure Pipelines templates** come in two flavours. *Includes* templates insert steps, jobs, stages or variables (\`- template: steps/build.yml@templates\` with \`parameters\`), typically from a shared repository declared under \`resources: repositories:\`. *Extends* templates define the skeleton a pipeline must follow (\`extends: template: secure-pipeline.yml@templates\`) and can reject disallowed steps; combined with the **Required template** check on a protected resource, they guarantee every production deployment passes through approved logic. Template expressions \`\${{ }}\` are evaluated at compile time, \`$[ ]\` at runtime, \`$( )\` for macro variables. **Task groups** are the classic-pipeline equivalent (a reusable set of tasks) and do not apply to YAML.

**Variables**: pipeline variables (\`variables:\` block, UI variables, parameters for typed inputs), predefined variables (\`Build.BuildNumber\`, \`System.AccessToken\`), output variables between jobs and stages, and **variable groups** (Library) shared across pipelines, optionally **linked to Azure Key Vault** so secrets are pulled at run time. Secret variables are masked and must be mapped into \`env:\` explicitly for scripts. Variable groups are protected resources: pipelines must be authorised to use them and they can carry approvals and checks.

**GitHub Actions** reuse: **reusable workflows** (\`on: workflow_call\` with \`inputs\`, \`secrets\`, \`outputs\`; called with \`uses: org/repo/.github/workflows/x.yml@v1\`), **composite actions** (bundle steps in \`action.yml\`), **required workflows** via rulesets for organization-wide enforcement, configuration **variables** (\`vars.NAME\`) and **secrets** at repository, environment and organization scope. The exam maps extends templates to required workflows, variable groups to organization or environment variables and secrets, and task groups to composite actions.`,
    },
    {
      heading: 'YAML-based environments, checks and approvals',
      body: `An **Azure Pipelines environment** (Pipelines > Environments) is a named target such as \`dev\`, \`staging\` or \`production\`, optionally with resources (Kubernetes namespaces, virtual machines). A YAML **deployment job** references it with \`environment: production\` (or \`environment: production.web\` for a resource). The environment is where you attach **approvals and checks**: Approvals (users or groups, instructions, timeout, allow or forbid approving your own run), Branch control, Business hours, Evaluate artifact, Exclusive lock, Invoke Azure Function, Invoke REST API, Query Azure Monitor alerts, Required template and ServiceNow. Checks also exist on service connections, variable groups, secure files and agent pools, and the same stage must pass all of them. Environments record **deployment history** per run and work item, giving traceability from environment back to change.

In **GitHub Actions**, an environment is declared on a job (\`environment: { name: production, url: ... }\`) and configured under repository settings with **deployment protection rules**: required reviewers (up to 6, one must approve, optional prevent self-review), wait timer, deployment branches and tags, custom protection rules from GitHub Apps, and **environment secrets and variables** released only after the rules pass. Admins can bypass protection rules when allowed.

Design points: approvals belong on the environment, not in the YAML, so they cannot be edited away in a PR; use Branch control so only artifacts from protected branches reach production; give approvers a timeout so stuck releases fail visibly; separate who can approve from who can trigger (prevent self-approval); and in regulated settings add Required template plus Exclusive lock so one deployment at a time runs approved logic.`,
    },
  ],
  examples: [
    {
      title: 'Multi-stage Azure Pipelines YAML extending a secure template',
      description:
        'Copilot generates a pipeline from the prompt "CI on main and release/*, ignore docs, build once, parallel unit and integration test jobs, deploy to staging then production with approvals, extend our secure template". The platform team’s template enforces the allowed steps and the production environment carries the approval and Azure Monitor checks.',
      language: 'yaml',
      code: `trigger:
  batch: true
  branches: { include: [main, release/*] }
  paths: { exclude: [docs/*] }
pr: none            # Azure Repos: PR validation comes from branch policy
resources:
  repositories:
    - { repository: templates, type: git, name: Platform/pipeline-templates, ref: refs/tags/v3 }
variables:
  - group: checkout-shared      # Library variable group (Key Vault linked)
extends:
  template: secure-pipeline.yml@templates
  parameters:
    buildSteps:
      - script: dotnet publish -c Release -o $(Build.ArtifactStagingDirectory)
    testJobs:
      - { job: unit, steps: [ { script: dotnet test tests/Unit } ] }
      - { job: integration, steps: [ { script: dotnet test tests/Integration } ] }
    deployments:
      - { environment: staging, dependsOn: Test }
      - { environment: production, dependsOn: Staging }`,
      takeaway: 'Extends templates plus a Required template check make the generated pipeline safe by construction; approvals live on the environment, not in the file.',
    },
    {
      title: 'GitHub Actions: reusable workflow with environments and needs',
      description:
        'A GitHub-native team builds once, fans out tests with a matrix, then deploys to staging and production through a reusable deploy workflow. Production is a protected environment with two required reviewers and a wait timer.',
      language: 'yaml',
      code: `on:
  push: { branches: [main], paths-ignore: ['docs/**'] }
permissions: { contents: read, id-token: write }
jobs:
  build:
    runs-on: ubuntu-latest
    outputs: { version: \${{ steps.v.outputs.version }} }
    steps:
      - uses: actions/checkout@v4
      - { id: v, run: echo "version=1.4.\${{ github.run_number }}" >> "$GITHUB_OUTPUT" }
      - { uses: actions/upload-artifact@v4, with: { name: app, path: dist/ } }
  test:
    needs: build
    strategy: { matrix: { suite: [unit, integration] }, max-parallel: 2 }
    runs-on: ubuntu-latest
    steps: [ { run: npm test -- --suite \${{ matrix.suite }} } ]   # fan-out
  deploy-staging:
    needs: test
    uses: ./.github/workflows/deploy.yml     # reusable workflow (on: workflow_call)
    with: { environment: staging, version: \${{ needs.build.outputs.version }} }
    secrets: inherit
  deploy-production:
    needs: deploy-staging
    uses: ./.github/workflows/deploy.yml
    with: { environment: production, version: \${{ needs.build.outputs.version }} }   # secrets: inherit`,
      takeaway: 'needs builds the stage graph, outputs carry the version, reusable workflows remove duplication and environments carry the protection rules.',
    },
    {
      title: 'The pipeline that validated the wrong thing (a realistic mistake)',
      description:
        'A team adds pr: triggers to an Azure Repos pipeline, sees nothing run, then "fixes" it by rebuilding the application inside every stage so the deploy stage always has fresh binaries. PR validation still does not run, and production once deployed a build that tests never saw because a dependency changed between stages. The fix: a build validation branch policy for PR runs, build once in the first stage, publish the artifact, and have every deployment stage download that artifact.',
      takeaway: 'Azure Repos PR validation is a branch policy, and the artifact you deploy must be the artifact you tested.',
    },
    {
      title: 'Variable group linked to Key Vault and mapped into a script',
      description:
        'Secrets for the deployment are stored in Key Vault, surfaced through a variable group linked to the vault, and explicitly mapped into the script’s environment because secret variables are not exposed automatically.',
      language: 'yaml',
      code: `variables:
  - group: checkout-prod-secrets   # linked to Key Vault kv-checkout-prod
steps:
  - task: AzureCLI@2
    inputs:
      azureSubscription: sc-prod-wif        # workload identity federation
      scriptType: bash
      scriptLocation: inlineScript
      inlineScript: |
        az webapp config appsettings set -g rg-shop -n shop-api \\
          --settings "Db__Connection=$DB_CONN"
    env:
      DB_CONN: $(DbConnectionString)     # secret must be mapped explicitly`,
      takeaway: 'Variable groups centralise configuration; Key Vault linkage keeps secrets out of Azure DevOps, and secrets reach scripts only through explicit env mappings.',
    },
  ],
  keyPoints: [
    'Use Copilot Chat or agent mode with explicit platform, trigger, stage and policy requirements; validate generated YAML, pin versions and keep permissions minimal.',
    'Azure Pipelines triggers: trigger (CI, batch, branch and path filters), pr (GitHub and Bitbucket only), schedules (cron UTC, always), resources pipelines and repositories; Azure Repos PR validation uses the build validation branch policy.',
    'GitHub Actions triggers: push, pull_request (and pull_request_target), workflow_dispatch, schedule, workflow_run, workflow_call and many events; filters with branches, paths, tags; concurrency to serialise or cancel.',
    'Order work with dependsOn and conditions (Azure) or needs and if (GitHub); jobs run in parallel by default; matrix fans out with maxParallel or max-parallel; build once, publish, deploy the same artifact through stages.',
    'Reuse: includes and extends templates (compile-time ${{ }} expressions, Required template check), task groups for classic pipelines only, variables and variable groups (Key Vault linked); GitHub reusable workflows, composite actions, required workflows, vars and secrets.',
    'Azure Pipelines environments are targets for deployment jobs and carry approvals and checks (Approvals, Branch control, Business hours, Evaluate artifact, Exclusive lock, Invoke Azure Function or REST API, Query Azure Monitor alerts, Required template, ServiceNow) plus deployment history.',
    'GitHub environments carry deployment protection rules (required reviewers up to 6, wait timer, deployment branches and tags, custom rules) and release environment secrets only after rules pass.',
    'Keep approvals on the environment rather than in YAML so a pull request cannot remove them.',
  ],
  flashcards: [
    { front: 'How do you make two Azure Pipelines stages run in parallel?', back: 'Give the second stage dependsOn: [] (an empty list) or make both depend on the same earlier stage.' },
    { front: 'What does batch: true do on an Azure Pipelines CI trigger?', back: 'Pushes that arrive while a run is in progress are batched into one subsequent run instead of one run each.' },
    { front: 'Which GitHub Actions keyword chains jobs so one runs after another?', back: 'needs.' },
    { front: 'What is the difference between includes and extends templates?', back: 'Includes templates insert reusable content; extends templates define the structure a pipeline must follow and can reject disallowed steps.' },
    { front: 'Which check enforces that a stage extends an approved template?', back: 'The Required template check on the environment, service connection or other protected resource.' },
    { front: 'Where do task groups apply?', back: 'Classic (visual) pipelines only; in YAML use templates instead.' },
    { front: 'How do secret variables reach a script step in Azure Pipelines?', back: 'They must be mapped explicitly with env: NAME: $(secretVar); they are not exposed as environment variables automatically.' },
    { front: 'How does a GitHub Actions job opt into environment protection rules and secrets?', back: 'By declaring environment: <name> on the job.' },
    { front: 'Which Azure Pipelines keyword triggers a run when another pipeline completes?', back: 'resources: pipelines: with a trigger block (pipeline completion trigger).' },
    { front: 'Which expression syntax is evaluated at compile time in Azure Pipelines?', back: '${{ }} template expressions; $[ ] is runtime and $( ) is macro substitution.' },
  ],
  quiz: [
    {
      question:
        'A pipeline for an Azure Repos repository must run only for pushes to main that change files under src/, and rapid successive pushes should not each start a run. Which YAML satisfies this?',
      options: [
        'trigger: { branches: { include: [main] }, paths: { include: [src/*] }, batch: true }',
        'pr: { branches: { include: [main] }, paths: { include: [src/*] } }',
        'schedules: [ { cron: "0 * * * *", branches: { include: [main] } } ]',
        'trigger: none with a build validation policy',
      ],
      correct: [0],
      explanation:
        'A CI trigger with branch and path filters plus batch meets all three requirements. pr: does not apply to Azure Repos, a schedule is not push-driven, and trigger: none disables CI.',
    },
    {
      question:
        'A platform team must guarantee that every pipeline deploying to the production service connection runs only approved steps, even if developers edit their pipeline YAML. What should they implement?',
      options: [
        'A variable group with a locked flag',
        'An extends template in a shared repository and a Required template check on the service connection',
        'A comment resolution branch policy',
        'A Business hours check on the environment',
      ],
      correct: [1],
      explanation:
        'Extends templates define the allowed structure and the Required template check refuses stages that do not extend them. Variable groups, comment policies and business hours do not constrain pipeline logic.',
    },
    {
      question:
        'Which TWO deployment protection rules can be configured on a GitHub Actions environment? (Select two)',
      options: ['Required reviewers', 'Deployment branches and tags', 'Exclusive lock', 'Query Azure Monitor alerts'],
      correct: [0, 1],
      explanation:
        'Required reviewers and deployment branch/tag restrictions are GitHub environment rules. Exclusive lock and Query Azure Monitor alerts are Azure Pipelines checks.',
    },
    {
      question:
        'Developers notice production receives binaries that differ from those tested because each stage runs dotnet build. What is the correct design?',
      options: [
        'Add retryCountOnTaskFailure to the build step.',
        'Build once in the first stage, publish a pipeline artifact, and download that artifact in every deployment stage.',
        'Run all stages on the same self-hosted agent.',
        'Use a canary deployment strategy.',
      ],
      correct: [1],
      explanation:
        'Build once, deploy many ensures the tested artifact is the deployed artifact. Retries, agent affinity and deployment strategies do not address artifact identity.',
    },
    {
      question:
        'A GitHub Actions workflow should run its deploy job only after both the lint and test jobs succeed, and tests should run across Node 18, 20 and 22 in parallel. Which features do you use?',
      options: [
        'needs: [lint, test] on the deploy job and strategy.matrix on the test job',
        'workflow_run for deploy and concurrency for tests',
        'if: always() on deploy and max-parallel: 1 on tests',
        'A composite action for deploy and paths filters for tests',
      ],
      correct: [0],
      explanation:
        'needs orders jobs on success and matrix fans tests out. workflow_run chains separate workflows, if: always() would deploy on failure, and composite actions or path filters do not express ordering.',
    },
    {
      question:
        'A release manager approved her own production deployment. Compliance requires that approvers cannot approve runs they triggered, in Azure Pipelines. Where should this be configured?',
      options: [
        'In the pipeline YAML under the deployment job',
        'In the Approvals check on the production environment, by disallowing approvers from approving their own runs',
        'In a variable group named approvals',
        'In the build validation branch policy',
      ],
      correct: [1],
      explanation:
        'The Approvals check has an explicit setting for self-approval. YAML cannot define approvals, variable groups hold values, and branch policies gate merges rather than deployments.',
    },
  ],
  statements: [
    { text: 'In Azure Pipelines, jobs within a stage run in parallel by default.', isTrue: true, explanation: 'Jobs run concurrently up to the available parallel jobs unless dependsOn orders them.' },
    { text: 'Task groups can be referenced from YAML pipelines.', isTrue: false, explanation: 'Task groups are a classic pipeline feature; YAML uses templates.' },
    { text: 'GitHub Actions scheduled workflows run from the default branch.', isTrue: true, explanation: 'Schedule triggers use the workflow file on the default branch.' },
    { text: 'Approvals for an Azure Pipelines environment are defined inside the YAML file.', isTrue: false, explanation: 'Approvals and checks are configured on the environment (or other protected resource), not in YAML.' },
    { text: 'A variable group can be linked to Azure Key Vault so secrets are fetched at run time.', isTrue: true, explanation: 'Key Vault-linked variable groups pull selected secrets when the pipeline runs.' },
    { text: 'Environment secrets in GitHub Actions are available to a job before its required reviewers approve.', isTrue: false, explanation: 'Environment secrets are released only after the protection rules pass.' },
    { text: 'The ${{ }} syntax in Azure Pipelines is evaluated at compile time.', isTrue: true, explanation: 'Template expressions are resolved when the pipeline is compiled.' },
  ],
  resources: [
    { label: 'Specify events that trigger pipelines (Azure Pipelines)', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/build/triggers' },
    { label: 'Template usage reference (Azure Pipelines)', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/process/templates' },
    { label: 'Create and target an environment (Azure Pipelines)', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/process/environments' },
    { label: 'Reuse workflows (GitHub Actions)', url: 'https://docs.github.com/en/actions/how-tos/sharing-automations/reuse-workflows' },
  ],
};

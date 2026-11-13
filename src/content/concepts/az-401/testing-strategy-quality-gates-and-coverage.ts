import type { Concept } from '../../types';

export const testingStrategyQualityGatesAndCoverage: Concept = {
  id: 'testing-strategy-quality-gates-and-coverage',
  title: 'Testing Strategy, Quality and Release Gates, and Code Coverage with Copilot',
  summary:
    'Designing a layered testing strategy (local, unit, integration, load), turning test and health signals into quality and release gates in Azure Pipelines and GitHub Actions, running tests on the right agents and publishing results and coverage, and using GitHub Copilot and MCP servers to write, run and interpret all of it.',
  certs: ['az-401'],
  domains: ['az-401-3'],
  outcomes: ['az-401-3-2-1', 'az-401-3-2-2', 'az-401-3-2-3', 'az-401-3-2-4', 'az-401-3-2-5'],
  tags: ['testing', 'quality-gates', 'release-gates', 'code-coverage', 'load-testing', 'environments', 'checks', 'copilot'],
  difficulty: 'intermediate',
  diagram: 'eval-loop',
  sections: [
    {
      heading: 'A comprehensive testing strategy',
      body: `A testing strategy is a set of layers, each answering a different question quickly enough to be worth running at that point in the flow:

| Layer | Question | Runs where | Typical tools |
|---|---|---|---|
| **Local tests** | Did I break the thing I am editing? | Developer machine or agent sandbox, before commit (hooks, watch mode) | Test explorer, \`dotnet test\`, \`pytest\`, Playwright locally; Copilot generates and runs tests in agent mode |
| **Unit tests** | Does each unit behave as specified, in isolation? | Every CI run, PR validation | xUnit, NUnit, Jest, pytest; fast, no network |
| **Integration tests** | Do components work together with real dependencies? | CI after unit tests, or a dedicated stage with ephemeral infrastructure (containers, test databases) | Testcontainers, API tests, Playwright against a deployed test slot |
| **Load and performance tests** | Does it meet SLOs under expected and peak traffic? | Pre-production environment, scheduled or before release | **Azure Load Testing** (JMeter or Locust scripts, URL-based quick tests) with fail criteria |
| **Smoke and synthetic tests** | Is the deployment alive? | After each deployment, as a gate before routing traffic | Health endpoints, Application Insights availability tests |

Design principles: push cheap tests early (shift left) and expensive tests to the fewest points that still catch regressions; make every layer produce a machine-readable result (JUnit, TRX, NUnit XML, coverage XML) so gates can read it; keep test data and environments reproducible, ideally created by the pipeline; and quarantine flaky tests rather than letting them train people to ignore red. For agent-generated code, the strategy must include **tests the agent did not write or could not alter**, for example contract tests owned by the consuming team, because a model that writes both code and tests can make both agree while both are wrong.`,
    },
    {
      heading: 'Designing quality gates and release gates',
      body: `A **quality gate** blocks a change from merging or an artifact from being produced; a **release gate** blocks a deployment from proceeding to the next environment. Both evaluate signals automatically; approvals add a human decision.

**Quality gates (pre-merge)**: Azure Repos **build validation** and **status checks** policies; GitHub **required status checks** in branch protection or rulesets, including code scanning results and a coverage threshold check; minimum reviewers; Copilot code review requested automatically. Typical thresholds: all tests pass, diff coverage at or above 80%, no new high-severity code scanning alerts, no secrets.

**Release gates (pre- and post-deploy)**: in Azure Pipelines they are **checks on environments, service connections, variable groups and agent pools**: Approvals, Branch control (only artifacts from \`main\` or \`release/*\`), Business hours, Evaluate artifact (policy on container image metadata), Exclusive lock, Invoke Azure Function, Invoke REST API, **Query Azure Monitor alerts** (succeeds only if no alerts fire), Required template (the stage must extend an approved template) and ServiceNow change management. Checks have a timeout and a retry interval and run in a defined order within their categories. In GitHub Actions, gates are **deployment protection rules on environments**: required reviewers (up to 6, one approval suffices, optional prevent self-review), wait timer, deployment branches and tags, and **custom deployment protection rules** implemented by GitHub Apps (Datadog, Honeycomb, New Relic, ServiceNow, or your own) that must respond within 30 days.

Design rule: gates must be *automatic where the signal is objective* (tests, alerts, policy) and *human only where judgement is needed* (business sign-off). A gate nobody can explain is a gate someone will bypass.`,
    },
    {
      heading: 'Implementing tests and gates in pipelines with Copilot and MCP',
      body: `Implementation has three parts: **test tasks**, **test agents** and **documented results**.

In Azure Pipelines, tasks such as \`DotNetCoreCLI@2\` (\`command: test\`), \`VSTest@3\`, \`Maven@4\` and script steps run the tests; \`PublishTestResults@2\` uploads JUnit, NUnit, VSTest/TRX, xUnit or cTest files (and \`failTaskOnFailedTests\` makes the step fail); the **Tests** tab, Test Analytics, and the Test Results Trend widget document the outcome. In GitHub Actions, run the same commands and upload reports with \`actions/upload-artifact\`, publish summaries to \`$GITHUB_STEP_SUMMARY\`, and use a reporter action to annotate the PR; the result feeds a required status check.

**Test agents** are a scheduling question: unit tests run anywhere; integration tests need network access to test dependencies (self-hosted agents, Managed DevOps Pools or larger runners inside a VNet); UI tests need browsers or specific OS images (hosted \`windows-latest\`, \`macos-latest\`, or a container job); load tests run from Azure Load Testing's engines, not from the build agent. \`VSTest@3\` can distribute tests across a multi-agent job (\`strategy: parallel\`), and the \`matrix\` strategy in both platforms runs the suite per OS or runtime version.

**Where Copilot and MCP fit**: Copilot agent mode writes the missing unit tests and the pipeline YAML (ask it to "add a test job that publishes TRX results and fails on failures"); the **Playwright MCP server** lets it drive a browser to author or debug end-to-end tests; the **GitHub MCP server** reads failed workflow runs and their logs so Copilot can explain the failure and propose a fix; the **Azure DevOps MCP server** (\`pipelines\` and \`testplan\` toolsets) reads build results and test plan outcomes. An **agentic workflow** can be the gate: on every PR it reads the diff and flags files without tests, as a review comment, while the deterministic coverage threshold stays a required status check.`,
    },
    {
      heading: 'Code coverage analysis',
      body: `Coverage tells you which code your tests exercised; it does not tell you the tests were good, which is why the exam pairs it with gates rather than treating it as a goal. The pipeline flow is: collect (\`dotnet test --collect "XPlat Code Coverage"\` produces Cobertura; JaCoCo for Java; \`coverage.py\` or Jest produce Cobertura or LCOV), merge, publish, and gate.

In Azure Pipelines, \`PublishCodeCoverageResults@2\` takes \`summaryFileLocation\` with minimatch patterns, merges multiple files, auto-detects the format (Cobertura, JaCoCo, Clover and other XML; also .coverage and .cjson) and renders the **Code Coverage** tab with folder, file and source drill-down. For **pull requests to Azure Repos**, the coverage policy in an \`azurepipelines-coverage.yml\` file at the repository root (\`coverage: status: diff: target: 80%\`) posts a **diff coverage** status on the PR, and a Status checks branch policy can make it required. In GitHub, coverage actions post a check with the percentage and a PR comment; make that check required to gate. Full coverage trends belong on the dashboard; diff coverage belongs on the PR, because it measures the change being reviewed.

Copilot's role is analysis, not just generation: paste the coverage report or let the MCP server fetch it and ask "which uncovered branches are in code changed by this PR?"; then ask agent mode to write tests for those branches and rerun. Guard against gaming: tests that assert nothing raise coverage without value, so combine coverage with mutation testing or at least review the generated assertions. On the exam, when a scenario mentions "coverage on pull requests for Azure Repos", the answer involves \`PublishCodeCoverageResults@2\` plus the coverage policy file; when it mentions GitHub, it involves a required status check produced by a coverage action.`,
    },
  ],
  examples: [
    {
      title: 'A PR job that tests, publishes results and enforces diff coverage',
      description:
        'A .NET team asks Copilot to add a validation job to their Azure Pipelines YAML. Copilot proposes a job that runs unit tests with coverage collection, publishes TRX and Cobertura results, and the team adds the coverage policy file so PRs show diff coverage; a Status checks branch policy makes it required.',
      language: 'yaml',
      code: `# azure-pipelines.yml (validation job)
- job: test
  pool: { vmImage: ubuntu-latest }
  steps:
    - task: DotNetCoreCLI@2
      displayName: Unit tests with coverage
      inputs:
        command: test
        projects: '**/*Tests.csproj'
        arguments: '--collect "XPlat Code Coverage" --logger trx'
        publishTestResults: true
    - task: PublishCodeCoverageResults@2
      inputs:
        summaryFileLocation: '$(Agent.TempDirectory)/**/coverage.cobertura.xml'
        failIfCoverageEmpty: true

# azurepipelines-coverage.yml (repo root)
coverage:
  status:
    comments: on
    diff:
      target: 80%`,
      takeaway: 'Collect, publish and gate: DotNetCoreCLI publishes results, PublishCodeCoverageResults@2 renders coverage, and the coverage policy file turns diff coverage into a PR status you can require.',
    },
    {
      title: 'Release gate: no Azure Monitor alerts, business hours, then approval',
      description:
        'The production environment in Azure Pipelines gets three checks: Query Azure Monitor alerts against the canary resource group (retry every 5 minutes, timeout 30 minutes), Business hours (Mon-Thu 09:00-16:00), and an Approval by the release managers group who may not approve their own runs. In GitHub the equivalent is an environment with two required reviewers, prevent self-review, a wait timer and a Datadog custom protection rule.',
      language: 'yaml',
      code: `# GitHub Actions: deploy job bound to a protected environment
deploy-prod:
  needs: [deploy-canary, smoke-tests]
  runs-on: ubuntu-latest
  environment:
    name: production            # required reviewers, wait timer and
    url: https://shop.contoso.com   # custom protection rules live on the environment
  steps:
    - uses: azure/login@v2
      with:
        client-id: \${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: \${{ secrets.AZURE_TENANT_ID }}
        subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }}
    - run: az webapp deployment slot swap -g rg-shop -n shop-api --slot staging`,
      takeaway: 'Gates are attached to the environment, not to the YAML steps, so every pipeline that targets production inherits the same automatic checks and approvals.',
    },
    {
      title: 'Letting the agent write the tests and the gate (a realistic mistake)',
      description:
        'A team asks the Copilot cloud agent to "raise coverage to 90%". It generates hundreds of tests that call methods and assert nothing meaningful; coverage hits 91% and the PR passes the gate. A month later a pricing bug ships untested. The fix: keep a human-owned set of contract tests the agent cannot change, require assertions review in Copilot code review instructions, add mutation testing to the nightly pipeline, and gate on diff coverage plus failing mutants rather than on a global percentage.',
      takeaway: 'Coverage is a necessary signal, not a sufficient one; when an agent writes both code and tests, add tests and checks it does not control.',
    },
    {
      title: 'Load test as a pre-release gate with Azure Load Testing',
      description:
        'Before promoting to production, a GitHub Actions job runs an Azure Load Testing JMeter scenario against the staging slot with fail criteria on p95 response time and error rate; the job fails, and the production environment is never reached, when the criteria are violated.',
      language: 'yaml',
      code: `- name: Run load test
  uses: azure/load-testing@v1
  with:
    loadTestConfigFile: loadtests/checkout.yaml   # references checkout.jmx
    loadTestResource: lt-contoso
    resourceGroup: rg-perf
    env: |
      [{ "name": "host", "value": "shop-api-staging.azurewebsites.net" }]
# loadtests/checkout.yaml
# failureCriteria:
#   - avg(response_time_ms) > 400
#   - percentage(error) > 2`,
      takeaway: 'Load tests belong in the pre-production stage with explicit fail criteria so performance regressions block the release rather than surprise users.',
    },
  ],
  keyPoints: [
    'Layer tests: local (hooks, agent sandbox), unit (every CI run), integration (ephemeral dependencies), load (Azure Load Testing with fail criteria), smoke (post-deploy); each must emit machine-readable results.',
    'Quality gates block merges: build validation, required status checks (tests, coverage, code scanning), reviewers, Copilot code review. Release gates block deployments: Azure Pipelines environment checks and GitHub deployment protection rules.',
    'Azure Pipelines checks include Approvals, Branch control, Business hours, Evaluate artifact, Exclusive lock, Invoke Azure Function, Invoke REST API, Query Azure Monitor alerts, Required template and ServiceNow; they have timeouts and retry intervals.',
    'GitHub environments support required reviewers (up to 6, one approval needed, prevent self-review), wait timers, deployment branch and tag rules, and custom protection rules from GitHub Apps.',
    'Publish results with PublishTestResults@2 (JUnit, NUnit, VSTest, xUnit, cTest) and coverage with PublishCodeCoverageResults@2 (auto-detects Cobertura, JaCoCo and others); in GitHub upload reports and surface them as a required check.',
    'Diff coverage on Azure Repos PRs comes from an azurepipelines-coverage.yml policy; full coverage trends belong on dashboards.',
    'Copilot writes tests and pipeline YAML; MCP servers (GitHub, Azure DevOps, Playwright) let it read failed runs, test results and drive browsers; agentic workflows can add judgement-based review while deterministic thresholds stay required checks.',
    'Guard against agents gaming coverage: human-owned contract tests, assertion review, mutation testing.',
  ],
  flashcards: [
    { front: 'What is the difference between a quality gate and a release gate?', back: 'A quality gate blocks a merge or artifact (PR checks); a release gate blocks a deployment from advancing (environment checks or protection rules).' },
    { front: 'Which Azure Pipelines check fails a stage if any alert rule is firing?', back: 'Query Azure Monitor alerts.' },
    { front: 'Where do Azure Pipelines approvals and checks attach?', back: 'To protected resources: environments, service connections, variable groups, secure files and agent pools.' },
    { front: 'How many required reviewers can a GitHub environment have and how many must approve?', back: 'Up to 6 people or teams; only one needs to approve. Prevent self-review is optional.' },
    { front: 'Which task publishes test results in Azure Pipelines and which formats does it accept?', back: 'PublishTestResults@2: JUnit, NUnit, VSTest (TRX), xUnit and cTest.' },
    { front: 'Which file enables diff coverage status on Azure Repos pull requests?', back: 'azurepipelines-coverage.yml at the repository root (coverage: status: diff: target: N%), used with PublishCodeCoverageResults@2.' },
    { front: 'Which test frameworks does Azure Load Testing support?', back: 'Apache JMeter and Locust scripts, plus URL-based quick tests; fail criteria gate CI/CD.' },
    { front: 'Which MCP server lets Copilot read a failed GitHub Actions run and its logs?', back: 'The GitHub MCP server (Actions toolset).' },
    { front: 'What is the Required template check for?', back: 'It requires that the pipeline stage using the resource extends from an approved YAML template.' },
    { front: 'Why should some tests remain outside the agent’s control?', back: 'An agent that writes both code and tests can make them agree while both are wrong; independent contract tests and mutation testing catch this.' },
  ],
  quiz: [
    {
      question:
        'A team wants production deployments in Azure Pipelines to proceed only when no Azure Monitor alerts are active for the application and only during business hours, with no manual step. What should you configure?',
      options: [
        'Approvals and Business hours checks on the production environment',
        'Query Azure Monitor alerts and Business hours checks on the production environment',
        'A build validation branch policy on main',
        'A Required template check on the service connection',
      ],
      correct: [1],
      explanation:
        'Both requirements are automatic checks on the environment. Approvals add a manual step, build validation is a pre-merge quality gate, and Required template enforces pipeline structure rather than health.',
    },
    {
      question:
        'Developers want every pull request to an Azure Repos repository to show the coverage of changed lines and block completion below 80%. Which combination achieves this?',
      options: [
        'PublishTestResults@2 and a minimum reviewers policy',
        'PublishCodeCoverageResults@2, an azurepipelines-coverage.yml with a diff target, and a Status checks branch policy',
        'A coverage badge in the README and a build validation policy',
        'VSTest@3 with a code coverage flag and a Comment resolution policy',
      ],
      correct: [1],
      explanation:
        'Diff coverage on Azure Repos PRs requires the coverage task plus the coverage policy file, and the status check policy makes the result required. Test results alone, badges and comment resolution do not measure or enforce coverage of changed lines.',
    },
    {
      question:
        'Which TWO controls are deployment protection rules available on a GitHub Actions environment? (Select two)',
      options: ['Required reviewers', 'Wait timer', 'Minimum reviewers branch policy', 'Exclusive lock check'],
      correct: [0, 1],
      explanation:
        'Required reviewers and wait timers (plus deployment branches and custom rules) are GitHub environment protection rules. Minimum reviewers is an Azure Repos branch policy and Exclusive lock is an Azure Pipelines check.',
    },
    {
      question:
        'An integration test suite needs to reach a database inside a corporate virtual network. Microsoft-hosted agents cannot connect. What is the MOST appropriate change?',
      options: [
        'Run the tests on a self-hosted agent or Managed DevOps Pool with VNet connectivity',
        'Mark the tests as flaky so failures do not block the build',
        'Move the tests to the local layer and run them on developer laptops only',
        'Replace the integration tests with more unit tests',
      ],
      correct: [0],
      explanation:
        'Agent selection is the fix for connectivity. Marking tests flaky hides real failures, laptop-only tests are not a gate, and unit tests cannot validate integration behaviour.',
    },
    {
      question:
        'A release manager asks whether a load test should run on the build agent as part of the CI job. What should you recommend?',
      options: [
        'Yes, run JMeter on the Microsoft-hosted agent during CI.',
        'No, run it from Azure Load Testing against a pre-production environment with fail criteria, as a gate before production.',
        'No, load tests should only be run manually after release.',
        'Yes, but only on pull request builds.',
      ],
      correct: [1],
      explanation:
        'Load tests need realistic scale and a deployed target; Azure Load Testing provides engines and fail criteria that can gate the release. Build agents are not load generators, manual-only testing loses the gate, and PR builds have no deployed environment to test.',
    },
    {
      question:
        'After the Copilot cloud agent added tests, coverage rose to 92% but a regression still reached production. Which action BEST strengthens the testing strategy?',
      options: [
        'Raise the coverage threshold to 95%.',
        'Add mutation testing and human-owned contract tests, and have Copilot code review check that generated tests contain meaningful assertions.',
        'Disable the Copilot cloud agent for the repository.',
        'Remove the coverage gate because it is misleading.',
      ],
      correct: [1],
      explanation:
        'The gap is test quality, not quantity. Mutation testing and independent contract tests detect weak assertions. A higher threshold invites more empty tests, disabling the agent removes value without fixing the gap, and removing the gate loses a useful signal.',
    },
  ],
  statements: [
    { text: 'Azure Pipelines checks can be applied to service connections and variable groups, not only to environments.', isTrue: true, explanation: 'Approvals and checks protect environments, service connections, variable groups, secure files and agent pools.' },
    { text: 'PublishCodeCoverageResults@2 requires you to specify the coverage format explicitly.', isTrue: false, explanation: 'Version 2 auto-detects formats such as Cobertura and JaCoCo from the summary files.' },
    { text: 'Only one of the required reviewers on a GitHub environment needs to approve a deployment.', isTrue: true, explanation: 'Up to six reviewers can be listed; a single approval lets the job proceed.' },
    { text: 'Code coverage for pull requests in Azure Pipelines works for GitHub-hosted repositories.', isTrue: false, explanation: 'The PR diff coverage feature is currently available only for Azure Repos.' },
    { text: 'Azure Load Testing supports JMeter and Locust test scripts.', isTrue: true, explanation: 'Those are the two supported frameworks, plus URL-based quick tests.' },
    { text: 'A custom deployment protection rule in GitHub waits up to 30 days for the GitHub App to respond.', isTrue: true, explanation: 'After 30 days without a response the job fails.' },
    { text: 'High code coverage guarantees that tests would catch regressions.', isTrue: false, explanation: 'Coverage measures executed code, not assertion quality; mutation testing and review are needed.' },
  ],
  resources: [
    { label: 'Define approvals and checks (Azure Pipelines)', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/process/approvals' },
    { label: 'Review and configure code coverage results in Azure Pipelines', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/test/codecoverage-for-pullrequests' },
    { label: 'Managing environments for deployment (GitHub Actions)', url: 'https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments' },
    { label: 'What is Azure Load Testing?', url: 'https://learn.microsoft.com/en-us/azure/load-testing/overview-what-is-azure-load-testing' },
  ],
};

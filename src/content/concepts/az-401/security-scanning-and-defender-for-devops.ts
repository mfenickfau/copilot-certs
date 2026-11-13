import type { Concept } from '../../types';

export const securityScanningAndDefenderForDevops: Concept = {
  id: 'security-scanning-and-defender-for-devops',
  title: 'Security, Vulnerability and Compliance Scanning with GitHub Advanced Security and Defender for Cloud',
  summary:
    'Designing a code-to-cloud scanning strategy, configuring dependency scanning, code scanning and secret scanning with GitHub Advanced Security (Code Security and Secret Protection) on GitHub and GitHub Advanced Security for Azure DevOps, and connecting Microsoft Defender for Cloud DevOps security to Azure DevOps and GitHub for unified posture, IaC scanning and pull request annotations.',
  certs: ['az-401'],
  domains: ['az-401-4'],
  outcomes: ['az-401-4-3-1', 'az-401-4-3-2', 'az-401-4-3-3'],
  tags: ['github-advanced-security', 'codeql', 'dependabot', 'secret-scanning', 'push-protection', 'defender-for-cloud', 'devops-security', 'msdo'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Designing a scanning strategy',
      body: `A scanning strategy answers *what* you scan, *where* in the flow, *what blocks*, and *who fixes*. Map the scan types to the SDLC:

| Scan type | Finds | Earliest useful point | Blocking control |
|---|---|---|---|
| **Secret scanning** | Credentials in code, history and comments | On push (**push protection**) and continuously on the repository | Push blocked; alert with remediation |
| **Dependency scanning** (SCA) | Known CVEs in direct and transitive packages, licence issues | PR (dependency review) and scheduled | Required check; Dependabot or Advanced Security PRs |
| **Code scanning** (SAST, CodeQL) | Injection, auth bypass, unsafe deserialisation in your code | PR and default branch | Required check; rulesets can require code scanning results |
| **IaC scanning** | Misconfigured Bicep, ARM, Terraform, Kubernetes manifests | PR via Microsoft Security DevOps (Template Analyzer, Checkov, Terrascan) | Required check |
| **Container image scanning** | CVEs in images | Build (Trivy via MSDO) and registry (Defender for Containers) | Fail build on critical |
| **Compliance and posture** | Missing branch protection, unscanned repos, exposed secrets across the estate | Continuous in Defender for Cloud | Recommendations, workbooks, governance rules |

Design principles: shift left (push protection and PR checks) but keep continuous scanning because new CVEs appear after merge; make high and critical findings blocking and lower ones visible; route findings to the people who can fix them (PR annotations, Security tab, work items); choose a single pane for security teams (Defender for Cloud) while developers stay in GitHub or Azure DevOps; and define SLAs (for example criticals within 7 days) that your dashboards measure. AI helps on both sides: Copilot **Autofix** proposes fixes for code scanning alerts, Copilot cloud agent can be assigned an alert to remediate, and an agentic workflow can triage new alerts, but every fix still lands as a reviewed pull request.`,
    },
    {
      heading: 'GitHub Advanced Security on GitHub: Code Security and Secret Protection',
      body: `GitHub Advanced Security is sold as two products on GitHub Team and Enterprise Cloud (several features are free for public repositories):

**GitHub Secret Protection**: secret scanning alerts for hundreds of partner patterns plus custom patterns, **push protection** that blocks a push containing a secret (with a bypass flow that creates an alert and can require reviewer approval), validity checks, and the security overview. Enable it at organization level with a default configuration so new repositories inherit it.

**GitHub Code Security**: **code scanning** with CodeQL (default setup picks languages and query suites automatically; advanced setup uses a workflow for custom queries and build steps), **Copilot Autofix** suggestions on alerts, third-party SARIF upload, **Dependabot** alerts, security updates and version updates (\`dependabot.yml\`), **dependency review** on pull requests to block vulnerable or disallowed-licence additions, and the security overview with risk and coverage views.

Enforcement lives in **rulesets**: require code scanning results (with severity thresholds) before merging, require the dependency review workflow as a required status check, and required workflows for organization-wide scans. Alerts appear on the repository **Security** tab and the organization security overview; the audit log and webhooks (\`code_scanning_alert\`, \`secret_scanning_alert\`, \`dependabot_alert\`) feed SIEM and automation. Billing is per active committer (unique committers in the billing period across enabled repositories), so enable products deliberately and at the scope you need.`,
    },
    {
      heading: 'GitHub Advanced Security for Azure DevOps',
      body: `**GitHub Advanced Security for Azure DevOps** brings the same three capabilities to **Azure Repos** (Azure DevOps Services only, Git repositories), also packaged as **Secret Protection for Azure DevOps** and **Code Security for Azure DevOps**. You enable it at **repository**, **project** or **organization** level (Project settings > Repos > Repositories > repository > Enable and Begin billing; or Enable all at project or organization scope, optionally auto-enabling new repositories), which requires Project Collection Administrator or the "Advanced Security: manage settings" permission. Billing is per active committer; a shield icon marks enabled repositories.

Capabilities and how they run:

- **Secret scanning**: repository scanning for exposed secrets with alerts, and **push protection** that rejects pushes containing secrets at the server (the pusher sees the blocked secret and can remove it or bypass with justification).
- **Dependency scanning**: the \`AdvancedSecurity-Dependency-Scanning@1\` pipeline task (or dependency scanning **default setup** enabled in repository options) analyses direct and transitive dependencies and raises alerts with upgrade guidance.
- **Code scanning**: CodeQL via \`AdvancedSecurity-Codeql-Init@1\` (languages, query suite, \`enableAutomaticCodeQLInstall: true\`), the build steps, then \`AdvancedSecurity-Codeql-Analyze@1\`; results appear in **Repos > Advanced Security** with alert details, affected branches and dismissal (Project Administrator permission). A **build validation** policy plus the Advanced Security **status check** policy can block PRs with new alerts.
- Self-hosted agents need allow-list access to \`advsec.dev.azure.com\`, \`dev.azure.com\` and \`governance.dev.azure.com\`, a compatible .NET runtime and the CodeQL bundle (auto-install or manual tool cache).

The Azure DevOps **MCP server** exposes an \`advsec\` toolset so Copilot can list and explain Advanced Security alerts, and Copilot Chat can draft the pipeline tasks; the decision to dismiss remains a human one with the right permission.`,
    },
    {
      heading: 'Connecting Microsoft Defender for Cloud DevOps security',
      body: `**Defender for Cloud DevOps security** gives security teams one console across **Azure DevOps, GitHub and GitLab**: inventory of connected organizations and repositories, posture recommendations (branch protection missing, secret scanning off), findings from code, secrets, dependencies and IaC scans, **pull request annotations**, code-to-cloud mapping of container images and IaC to the running resources, and governance rules that assign owners and due dates.

**Connecting Azure DevOps**: Defender for Cloud > **Environment settings > Add environment > Azure DevOps**; name the connector, pick subscription, resource group and region (the connector is a \`Microsoft.Security/securityConnectors\` resource); **Authorize** with an identity that is **Project Collection Administrator** with **Basic** (not Stakeholder) access and has third-party OAuth access enabled; choose all existing organizations (auto-discover) or select organizations and projects; Defender then installs the **Microsoft Defender for DevOps Container Mapping** extension in the organization. Activities Defender performs are attributed to the authorising identity in Azure DevOps audit logs.

**Connecting GitHub**: Add environment > **GitHub**; Authorize as a GitHub **organization owner**; **Install** the Defender for Cloud (DevOps security) **GitHub App** on the organizations to protect, choosing all repositories; select auto-discovery of existing or existing and future organizations. **Pull request annotations** are enabled per repository (currently Azure DevOps) so developers see IaC and dependency findings in the PR. The **Microsoft Security DevOps (MSDO)** extension or GitHub Action runs open-source analysers (Bandit, BinSkim, Checkov, ESLint, Template Analyzer, Terrascan, Trivy, AntiMalware) in your pipelines and publishes SARIF so Defender for Cloud can show IaC and container findings alongside GitHub Advanced Security results. The connector reads metadata and findings; it does not replace Advanced Security, it correlates it with cloud context.

Exam cues: "single view across Azure DevOps and GitHub for the security team" means Defender for Cloud DevOps security; "block a push containing a key" means push protection; "find CVEs in my packages" means dependency scanning or Dependabot; "SQL injection in my code" means CodeQL code scanning; "misconfigured Bicep in a PR" means MSDO Template Analyzer or Checkov with Defender annotations.`,
    },
  ],
  examples: [
    {
      title: 'Advanced Security for Azure DevOps pipeline: CodeQL and dependency scanning',
      description:
        'After enabling Code Security on the repository, the team adds CodeQL initialisation and analysis around their build plus dependency scanning. A status check policy on main requires the Advanced Security check so PRs with new high-severity alerts cannot complete.',
      language: 'yaml',
      code: `pool: { vmImage: ubuntu-latest }
steps:
  - task: AdvancedSecurity-Codeql-Init@1
    inputs:
      languages: 'csharp,javascript'
      querysuite: security-extended
      enableAutomaticCodeQLInstall: true
  - script: dotnet build src/Shop.sln -c Release
    displayName: Build (CodeQL traces the compilation)
  - task: AdvancedSecurity-Dependency-Scanning@1
  - task: AdvancedSecurity-Codeql-Analyze@1
# Branch policy on main: Status check "Advanced Security" required + Build validation`,
      takeaway: 'Init, build, analyze: CodeQL needs to observe the build, and the Advanced Security status check turns alerts into a merge gate.',
    },
    {
      title: 'GitHub default setup plus rulesets that require scan results',
      description:
        'A GitHub organization enables Secret Protection and Code Security through a security configuration applied to all repositories (push protection on, CodeQL default setup, Dependabot alerts and security updates). An organization ruleset requires code scanning results with no new high-severity alerts and the dependency review workflow as a required check before merging to default branches.',
      language: 'yaml',
      code: `# .github/workflows/dependency-review.yml (required status check via ruleset)
name: dependency-review
on: pull_request
permissions: { contents: read, pull-requests: write }
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: high
          deny-licenses: GPL-3.0, AGPL-3.0
          comment-summary-in-pr: always`,
      takeaway: 'Security configurations enable the products consistently; rulesets make the results blocking; dependency review stops vulnerable or disallowed packages at the PR.',
    },
    {
      title: 'Push protection bypassed and nobody noticed (a realistic mistake)',
      description:
        'A developer in a hurry bypasses push protection with the justification "false positive" and commits a real Azure storage key. No one reviews bypasses, and the key is live for weeks. The fix: configure push protection bypass to require approval from a security reviewer group (delegated bypass), route secret_scanning_alert webhooks to the security channel, connect the organization to Defender for Cloud so the exposed secret appears as a high-severity recommendation with an owner and due date, and rotate the key.',
      takeaway: 'Push protection only works when bypasses are governed and alerts reach someone accountable; Defender for Cloud gives that estate-wide visibility.',
    },
    {
      title: 'IaC scanning with Microsoft Security DevOps and Defender annotations',
      description:
        'Infrastructure pull requests in Azure DevOps run the Microsoft Security DevOps task to analyse Bicep and Terraform with Template Analyzer, Checkov and Terrascan, and to scan the container image with Trivy. With the Azure DevOps connector and PR annotations enabled, findings appear as comments in the PR and in the Defender for Cloud DevOps security console with code-to-cloud mapping.',
      language: 'yaml',
      code: `steps:
  - task: MicrosoftSecurityDevOps@1
    displayName: Microsoft Security DevOps
    inputs:
      categories: 'IaC,containers'
      tools: 'templateanalyzer,checkov,terrascan,trivy'
      break: true          # fail the job on findings at or above the configured severity
  - task: PublishBuildArtifacts@1
    inputs:
      PathtoPublish: $(Build.ArtifactStagingDirectory)/.gdn
      ArtifactName: CodeAnalysisLogs   # SARIF consumed by Defender for Cloud`,
      takeaway: 'MSDO brings IaC and container scanning into the pipeline; Defender for Cloud surfaces the SARIF results as annotations and posture findings.',
    },
  ],
  keyPoints: [
    'Strategy: push protection and PR checks shift left; continuous scanning catches new CVEs; critical findings block, lower ones are visible; findings route to developers in the PR and to security teams in Defender for Cloud.',
    'GitHub Advanced Security = GitHub Secret Protection (secret scanning, push protection, validity checks) + GitHub Code Security (CodeQL code scanning with Copilot Autofix, Dependabot, dependency review); billed per active committer; some features free for public repos.',
    'Enforce with rulesets: require code scanning results, required dependency review workflow, required workflows; alerts live on the Security tab and security overview, and emit webhooks and audit events.',
    'GitHub Advanced Security for Azure DevOps (Secret Protection and Code Security for Azure DevOps) is enabled per repository, project or organization with Begin billing; tasks AdvancedSecurity-Codeql-Init@1, Analyze@1 and AdvancedSecurity-Dependency-Scanning@1; push protection and the Advanced Security status check policy enforce.',
    'Self-hosted agents need advsec.dev.azure.com, dev.azure.com and governance.dev.azure.com allowed, a compatible .NET runtime and the CodeQL bundle.',
    'Defender for Cloud DevOps security connectors: Environment settings > Add environment > Azure DevOps (authorise as PCA with Basic access, OAuth enabled) or GitHub (organization owner installs the DevOps security GitHub App); provides inventory, posture recommendations, PR annotations, code-to-cloud mapping and governance.',
    'Microsoft Security DevOps runs Bandit, BinSkim, Checkov, ESLint, Template Analyzer, Terrascan, Trivy and AntiMalware in pipelines and publishes SARIF that Defender for Cloud consumes.',
  ],
  flashcards: [
    { front: 'What are the two GitHub Advanced Security products?', back: 'GitHub Secret Protection (secret scanning, push protection) and GitHub Code Security (code scanning with CodeQL, Dependabot, dependency review).' },
    { front: 'What does push protection do?', back: 'It blocks a push that contains a detected secret before it reaches the repository; bypasses can be governed and create alerts.' },
    { front: 'Which Azure Pipelines tasks run CodeQL for Advanced Security for Azure DevOps?', back: 'AdvancedSecurity-Codeql-Init@1 before the build and AdvancedSecurity-Codeql-Analyze@1 after it.' },
    { front: 'Which task performs dependency scanning in Azure DevOps Advanced Security?', back: 'AdvancedSecurity-Dependency-Scanning@1 (or dependency scanning default setup on the repository).' },
    { front: 'At which scopes can Advanced Security for Azure DevOps be enabled?', back: 'Repository, project or organization, optionally auto-enabling new repositories or projects.' },
    { front: 'Who can dismiss an Advanced Security alert in Azure DevOps?', back: 'Users with Project Administrator permissions.' },
    { front: 'Which Azure DevOps roles are required to authorise the Defender for Cloud connector?', back: 'Project Collection Administrator with Basic (or Basic + Test Plans) access; Stakeholder is not sufficient; third-party OAuth must be enabled.' },
    { front: 'Where do you create a Defender for Cloud DevOps connector?', back: 'Defender for Cloud > Environment settings > Add environment > Azure DevOps, GitHub or GitLab.' },
    { front: 'How does Defender for Cloud gain access to GitHub repositories?', back: 'An organization owner authorises and installs the Defender for Cloud DevOps security GitHub App on the organizations.' },
    { front: 'Name four analysers bundled in Microsoft Security DevOps.', back: 'Template Analyzer, Checkov, Terrascan and Trivy (also Bandit, BinSkim, ESLint and AntiMalware).' },
    { front: 'How is GitHub Advanced Security billed?', back: 'Per active committer across repositories where the product is enabled.' },
  ],
  quiz: [
    {
      question:
        'Contoso’s security team needs one console showing scan findings and posture recommendations across its Azure DevOps organization and its GitHub organization, correlated with the Azure resources the code deploys to. What should you implement?',
      options: [
        'GitHub security overview only',
        'Microsoft Defender for Cloud DevOps security with Azure DevOps and GitHub connectors',
        'Azure DevOps Advanced Security dashboards',
        'Azure Monitor workbooks fed by pipeline logs',
      ],
      correct: [1],
      explanation:
        'Defender for Cloud DevOps security unifies multiple DevOps platforms with code-to-cloud context. The GitHub overview and Azure DevOps dashboards are each single-platform, and Azure Monitor workbooks do not provide posture or scan correlation.',
    },
    {
      question:
        'Developers keep committing API keys to an Azure Repos repository. Which configuration stops the keys from entering the repository at all?',
      options: [
        'A nightly dependency scanning pipeline',
        'Enable Secret Protection (Advanced Security) so push protection blocks pushes containing secrets',
        'A minimum reviewers branch policy',
        'Defender for Cloud pull request annotations',
      ],
      correct: [1],
      explanation:
        'Push protection rejects the push server-side. Dependency scanning targets packages, reviewers may miss secrets, and annotations report after the fact.',
    },
    {
      question:
        'A CodeQL analysis task in Azure Pipelines fails on a self-hosted agent with a CodeQL bundle not found error. Which TWO actions resolve it? (Select two)',
      options: [
        'Set enableAutomaticCodeQLInstall: true on AdvancedSecurity-Codeql-Init@1',
        'Allow the agent to reach advsec.dev.azure.com, dev.azure.com and governance.dev.azure.com',
        'Switch the repository to TFVC',
        'Grant the agent Project Collection Administrator rights',
      ],
      correct: [0, 1],
      explanation:
        'Automatic install fetches the bundle and the network allow-list lets the tasks download and report. TFVC is unsupported by Advanced Security, and agent permissions are unrelated to tool installation.',
    },
    {
      question:
        'When authorising the Defender for Cloud Azure DevOps connector, the Authorize step fails for a user who is a Project Collection Administrator. What is the MOST likely cause?',
      options: [
        'The user has Stakeholder access level instead of Basic.',
        'The user is not a GitHub organization owner.',
        'The Azure subscription has no Log Analytics workspace.',
        'Advanced Security is not enabled on the repositories.',
      ],
      correct: [0],
      explanation:
        'The connector requires PCA plus Basic access and OAuth enabled; Stakeholder is explicitly insufficient. GitHub ownership applies to the GitHub connector, and Log Analytics or Advanced Security enablement are not prerequisites.',
    },
    {
      question:
        'A GitHub organization wants every pull request to its default branches to fail if it introduces a dependency with a high-severity vulnerability or a GPL licence. What should you configure?',
      options: [
        'Dependabot version updates with a weekly schedule',
        'The dependency review action in a workflow made a required status check through an organization ruleset',
        'Secret scanning with custom patterns',
        'A CodeQL advanced setup workflow',
      ],
      correct: [1],
      explanation:
        'Dependency review evaluates the PR’s dependency changes against severity and licence rules. Dependabot updates existing dependencies, secret scanning looks for credentials, and CodeQL analyses your code rather than packages.',
    },
    {
      question:
        'Infrastructure pull requests in Azure DevOps must surface Bicep misconfigurations as comments in the PR and in Defender for Cloud. Which combination achieves this?',
      options: [
        'Microsoft Security DevOps task with Template Analyzer and Checkov, plus the Azure DevOps connector with pull request annotations enabled',
        'AdvancedSecurity-Codeql-Init@1 with the javascript language',
        'A what-if step and an approval check',
        'Dependabot alerts',
      ],
      correct: [0],
      explanation:
        'MSDO performs IaC analysis and Defender’s connector annotates PRs and shows findings. CodeQL does not analyse Bicep, what-if previews changes rather than misconfigurations, and Dependabot handles packages.',
    },
  ],
  statements: [
    { text: 'GitHub Advanced Security for Azure DevOps works with TFVC repositories.', isTrue: false, explanation: 'It is available only for Git repositories in Azure DevOps Services.' },
    { text: 'Push protection in Azure DevOps blocks pushes that contain detected secrets.', isTrue: true, explanation: 'Secret Protection’s push protection rejects such pushes with details for the pusher.' },
    { text: 'Defender for Cloud DevOps security replaces GitHub Advanced Security.', isTrue: false, explanation: 'It correlates and surfaces findings alongside advanced security status; the scanners still run in GitHub or Azure DevOps.' },
    { text: 'The Defender for Cloud Azure DevOps connector attributes its actions to the identity that authorised it.', isTrue: true, explanation: 'Repository reads, PR annotations and metadata queries appear under that identity in audit logs.' },
    { text: 'Code scanning and secret scanning are enabled by default for public repositories on GitHub.com.', isTrue: true, explanation: 'Several Advanced Security features are free and on by default for public repositories.' },
    { text: 'Rulesets can require code scanning results before merging.', isTrue: true, explanation: 'Code scanning merge protection is a ruleset rule with severity thresholds.' },
    { text: 'Microsoft Security DevOps is a replacement for CodeQL.', isTrue: false, explanation: 'MSDO orchestrates open-source IaC, container and linting analysers; CodeQL is the SAST engine in Advanced Security.' },
  ],
  resources: [
    { label: 'Configure GitHub Advanced Security for Azure DevOps', url: 'https://learn.microsoft.com/en-us/azure/devops/repos/security/configure-github-advanced-security-features' },
    { label: 'About GitHub Advanced Security', url: 'https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security' },
    { label: 'Connect your Azure DevOps organizations to Defender for Cloud', url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/quickstart-onboard-devops' },
    { label: 'Connect your GitHub organizations to Defender for Cloud', url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/quickstart-onboard-github' },
  ],
};

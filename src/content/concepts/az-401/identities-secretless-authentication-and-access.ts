import type { Concept } from '../../types';

export const identitiesSecretlessAuthenticationAndAccess: Concept = {
  id: 'identities-secretless-authentication-and-access',
  title: 'Identities, Secretless Authentication, Permissions and Project Configuration',
  summary:
    'Choosing between Microsoft Entra service principals and managed identities, authenticating to GitHub with GitHub Apps, GITHUB_TOKEN and personal access tokens, going secretless in Azure Pipelines (workload identity federation) and GitHub Actions (OIDC), managing Azure DevOps service connections and PATs, and designing permissions, access levels, projects and teams in Azure DevOps and GitHub.',
  certs: ['az-401'],
  domains: ['az-401-4'],
  outcomes: ['az-401-4-1-1', 'az-401-4-1-2', 'az-401-4-1-3', 'az-401-4-1-4', 'az-401-4-1-5', 'az-401-4-1-6'],
  tags: ['managed-identity', 'service-principal', 'workload-identity-federation', 'oidc', 'github-apps', 'github-token', 'pat', 'service-connections', 'access-levels', 'teams'],
  difficulty: 'advanced',
  sections: [
    {
      heading: 'Service principals versus managed identities',
      body: `Both are Microsoft Entra identities for workloads; the difference is who manages the credential.

| | Service principal (app registration) | Managed identity |
|---|---|---|
| Credential | You manage: client secret, certificate, or **federated credential** (no secret) | Azure manages it; no credential to rotate or leak |
| Where it can run | Anywhere (on-premises agents, GitHub-hosted runners, other clouds) | Only on Azure resources that support it (VMs, App Service, Functions, AKS, Container Apps, Managed DevOps Pools, Azure SRE Agent) |
| Flavours | Single or multi-tenant app | **System-assigned** (lifecycle tied to one resource) or **user-assigned** (standalone, shareable across resources) |
| Typical DevOps use | Pipeline service connections, GitHub Actions OIDC, Terraform providers, agents outside Azure | Self-hosted agents on Azure VMs, Managed DevOps Pools, deployed apps reading Key Vault, SRE Agent acting on resources |

Decision rule: **prefer a managed identity whenever the workload runs on an Azure resource that supports it**; when it does not (GitHub-hosted runners, Microsoft-hosted agents, external systems), use a service principal **with workload identity federation** rather than a secret or certificate. Use a user-assigned identity when several resources or pools must share one set of role assignments or when the identity must survive the resource. Grant roles with Azure RBAC at the narrowest scope (resource group, not subscription) and, for Azure DevOps itself, add service principals or managed identities to the organization so they can call REST APIs with short-lived Entra tokens instead of PATs.`,
    },
    {
      heading: 'GitHub authentication: GitHub Apps, GITHUB_TOKEN and PATs',
      body: `Three credentials cover almost every GitHub automation question:

- **GITHUB_TOKEN** is created automatically for each workflow job as a GitHub App installation token. It expires when the job finishes (or after 24 hours), is scoped to the repository, and its permissions are controlled by the workflow or job \`permissions:\` block (set a least-privilege default at repository or organization level and add only what a job needs, such as \`contents: read\`, \`packages: write\`, \`id-token: write\`). It cannot trigger new \`pull_request\` workflow runs without approval when it creates a PR, and it cannot access other repositories.
- **GitHub Apps** are the right identity for integrations and cross-repository automation: fine-grained permissions, installed per organization or repository, short-lived installation tokens minted from a private key, webhook subscriptions, and actions attributed to the app rather than a person. The Azure Pipelines app, Azure Boards app, Defender for Cloud DevOps app and Copilot's own integrations are GitHub Apps. Prefer an app over a service account with a PAT.
- **Personal access tokens**: **fine-grained PATs** (per repository, per permission, expiring, owner-approvable by the organization) are acceptable for a person's scripting; **classic PATs** are broad and should be blocked by organization policy. Any PAT ties automation to a human and dies when they leave.

Exam heuristics: "workflow needs to push a package to GitHub Packages" means \`GITHUB_TOKEN\` with \`packages: write\`; "automation across many repositories that should not run as a user" means a GitHub App; "a developer's local script" means a fine-grained PAT with expiry; "the token must authenticate to Azure" means OIDC, not a PAT.`,
    },
    {
      heading: 'Secretless authentication: workload identity federation and OIDC',
      body: `Secretless means the pipeline never holds a long-lived credential; it presents a short-lived token issued by the platform, and Microsoft Entra trusts that issuer through a **federated credential** on the service principal or user-assigned managed identity.

**Azure Pipelines**: create an **Azure Resource Manager service connection** with authentication **Workload identity federation** (automatic creates the app registration and federated credential; manual lets you use an existing app or managed identity and copy the issuer and subject identifier into Entra). Tasks such as \`AzureCLI@2\`, \`AzurePowerShell@5\`, \`AzureKeyVault@2\` and deployment tasks exchange the pipeline's token for an Azure token; nothing to rotate. Service connections using the old Azure DevOps issuer are being converted to the Microsoft Entra issuer (the old issuer retires on 1 July 2027); convert existing connections and avoid service principal secret connections. For calls to Azure DevOps itself, the **Azure DevOps service connection type** uses Entra workload identity federation instead of PATs.

**GitHub Actions**: add a federated credential on the Entra app (or user-assigned identity) with issuer \`https://token.actions.githubusercontent.com\` and a **subject** such as \`repo:contoso/shop:environment:production\` or \`repo:contoso/shop:ref:refs/heads/main\`; grant the job \`permissions: id-token: write\`; run \`azure/login@v2\` with \`client-id\`, \`tenant-id\` and \`subscription-id\` (these are identifiers, not secrets, even if stored as secrets). Terraform's AzureRM provider uses the same flow with \`use_oidc\`. Scoping the subject to an environment ties the credential to the environment's protection rules, which is the exam's favourite detail.

Across both platforms, the remaining long-lived credentials (PATs, service principal secrets) should be inventoried, replaced, and blocked by policy.`,
    },
    {
      heading: 'Azure DevOps service connections and PATs',
      body: `A **service connection** is Azure DevOps' stored identity for an external system: Azure Resource Manager, Azure DevOps, GitHub, Docker Registry, Kubernetes, generic. Governance features:

- **Pipeline permissions**: by default a new connection must be authorised per pipeline; "Grant access permission to all pipelines" is convenient and not recommended for production connections.
- **Approvals and checks** on the connection (Approvals, Branch control, Required template, Business hours) so only compliant stages can use it, regardless of which pipeline references it.
- **Roles**: Reader, User, Creator, Administrator at the project and connection level; **Endpoint Administrators** and **Endpoint Creators** groups; connections can be shared across projects.
- Prefer **workload identity federation** or **managed identity** authentication; audit connections still using secrets.

**Personal access tokens** remain for a shrinking set of scenarios (some third-party tools, legacy agents). Control them with **tenant-level policies** in Organization Settings > Microsoft Entra: restrict creation of **global PATs** (force organization-scoped), restrict **full-scoped PATs** (force custom scopes), set a **maximum lifespan**, and enable **automatic revocation of leaked PATs** detected by secret scanning. Each policy has an allowlist for exceptions. Users create PATs under User settings with scopes and expiry; administrators can revoke them. For automation, replace PATs with Entra tokens from service principals or managed identities added to the organization, and for agents register with a service identity.`,
    },
    {
      heading: 'Permissions, access levels, projects and teams',
      body: `**Azure DevOps** layers three things. **Access levels** decide which features a user can see and are tied to licensing: **Stakeholder** (free, limited: work items, dashboards, no code), **Basic** (most features; first five free), **Basic + Test Plans**, and **Visual Studio subscriber** (recognised automatically; assign it rather than Basic to avoid charges). **Security groups** carry **permissions** (Allow, Deny, Not set, with inheritance; an explicit Deny wins): organization-level groups such as Project Collection Administrators, Project Collection Build Service Accounts; project-level groups such as Project Administrators, Contributors, Readers, Build Administrators, Release Administrators, Endpoint Administrators; plus Microsoft Entra groups you add. Object-level permissions (repositories, branches, pipelines, environments, feeds) refine them. **Roles** (for pipeline resources, agent pools, feeds) are a simpler Reader/User/Creator/Administrator model.

**Projects** are the container: one process, its own repos, boards, pipelines and artifacts, visibility private or public. The default **team** carries the project name; add **teams** per product area, each with its own area path (optionally auto-created), iterations, backlog, board, dashboards and team administrators. Design guidance: fewer, larger projects with multiple teams keep traceability and reporting simple; separate projects when permissions or processes must differ.

**GitHub**: enterprise > organizations > repositories. Organization roles (owner, member, billing manager, security manager, custom roles), **base permissions** for members, **teams** (nestable, synced from Entra groups on Enterprise Cloud) that hold repository roles (Read, Triage, Write, Maintain, Admin, custom), and repository rulesets for enforcement. Policies cascade from enterprise to organization (Actions permissions, Copilot policies, MCP allowlists). Least privilege rules the exam: Stakeholder for people who only track work, Readers for auditors, Contributors or Write for developers, admin roles for very few, and agents with the narrowest role that completes their task.`,
    },
  ],
  examples: [
    {
      title: 'GitHub Actions deploying to Azure with OIDC scoped to an environment',
      description:
        'Contoso removes the client secret from its deployment workflow. An Entra app registration gets a federated credential whose subject is repo:contoso/shop:environment:production, so only jobs that pass the production environment’s protection rules can obtain a token.',
      language: 'yaml',
      code: `# Federated credential (Entra): issuer https://token.actions.githubusercontent.com
#   subject repo:contoso/shop:environment:production, audience api://AzureADTokenExchange
deploy:
  runs-on: ubuntu-latest
  environment: production
  permissions:
    id-token: write      # request the OIDC token
    contents: read
  steps:
    - uses: azure/login@v2
      with:
        client-id: \${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: \${{ secrets.AZURE_TENANT_ID }}
        subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }}
    - run: az webapp deploy -g rg-shop -n shop-api --src-path app.zip`,
      takeaway: 'id-token: write plus a federated credential whose subject names the environment gives secretless, environment-gated access to Azure.',
    },
    {
      title: 'Workload identity federation service connection with checks',
      description:
        'The Azure DevOps project creates an ARM service connection sc-prod-wif using Workload identity federation (automatic), does not grant access to all pipelines, and adds a Required template check and an Approvals check so only stages extending the approved template, approved by release managers, can use it.',
      language: 'text',
      code: `Project settings > Service connections > New > Azure Resource Manager
  Identity type: App registration (automatic)
  Credential: Workload identity federation
  Scope: Subscription > Resource group rg-shop-prod
  Grant access permission to all pipelines: OFF
Approvals and checks on sc-prod-wif:
  - Required template: Platform/pipeline-templates/secure-pipeline.yml@refs/tags/v3
  - Approvals: contoso-release-managers (approvers cannot approve own runs, timeout 1 day)`,
      takeaway: 'The connection is secretless and protected by checks that apply to every pipeline, so authorising a pipeline is never enough on its own.',
    },
    {
      title: 'The admin’s PAT in a variable group (a realistic mistake)',
      description:
        'An administrator stores his full-scoped, global PAT in a variable group so pipelines can call the Azure DevOps REST API. When he leaves, every pipeline breaks; when the PAT later appears in a log, it grants access to every organization he belonged to. The fix: an Azure DevOps service connection using Entra workload identity federation (or a service principal added to the organization with the minimum access level), tenant policies restricting global and full-scoped PATs with a maximum lifespan, and automatic revocation of leaked PATs.',
      takeaway: 'PATs bind automation to a person and widen blast radius; replace them with Entra identities and enforce PAT policies at the tenant.',
    },
    {
      title: 'Minimal GITHUB_TOKEN permissions for a package publish job',
      description:
        'A workflow needs to publish a container image to ghcr.io and nothing else. The organization default for GITHUB_TOKEN is read-only, and the job adds only packages: write.',
      language: 'yaml',
      code: `permissions:
  contents: read
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - run: docker build -t ghcr.io/contoso/shop:\${{ github.sha }} . && docker push ghcr.io/contoso/shop:\${{ github.sha }}`,
      takeaway: 'GITHUB_TOKEN is scoped per job; set a read-only default and add only the permission the job needs.',
    },
  ],
  keyPoints: [
    'Use a managed identity whenever the workload runs on an Azure resource that supports it; otherwise use a service principal with a federated credential, never a long-lived secret.',
    'GITHUB_TOKEN is a per-job installation token, repository-scoped, expiring with the job (max 24 hours), controlled by permissions:; GitHub Apps are for cross-repository or integration identities; fine-grained PATs are for individuals and should expire.',
    'Azure Pipelines secretless auth: ARM service connections with workload identity federation (Microsoft Entra issuer; old Azure DevOps issuer retires 1 July 2027) and the Azure DevOps service connection type for calling Azure DevOps APIs.',
    'GitHub Actions secretless auth: federated credential with issuer token.actions.githubusercontent.com and a subject scoped to environment, branch or tag; job permission id-token: write; azure/login@v2 with client-id, tenant-id and subscription-id.',
    'Service connections: authorise per pipeline (avoid Grant access to all pipelines), add approvals and checks, assign Reader/User/Creator/Administrator roles, share across projects deliberately.',
    'PAT governance: tenant policies restrict global and full-scoped PATs, cap lifespan and auto-revoke leaked tokens; prefer Entra tokens from service principals or managed identities added to the organization.',
    'Azure DevOps access levels (Stakeholder, Basic, Basic + Test Plans, Visual Studio subscriber) gate features; security groups and object permissions (Allow, Deny, Not set, inherited; Deny wins) gate actions; projects hold one process and many teams with their own area paths, iterations and dashboards.',
    'GitHub access flows enterprise > organization > repository through roles (owner, member, custom), base permissions, teams (Entra-synced) and repository roles Read to Admin.',
  ],
  flashcards: [
    { front: 'When should you choose a service principal over a managed identity?', back: 'When the workload does not run on an Azure resource that supports managed identities (GitHub-hosted runners, external systems); then use workload identity federation instead of a secret.' },
    { front: 'What is the difference between system-assigned and user-assigned managed identities?', back: 'System-assigned is tied to one resource’s lifecycle; user-assigned is a standalone resource that can be shared by several resources.' },
    { front: 'How long does GITHUB_TOKEN remain valid?', back: 'Until the job finishes, or at most 24 hours.' },
    { front: 'Which GitHub credential should a cross-repository integration use?', back: 'A GitHub App with fine-grained permissions and short-lived installation tokens.' },
    { front: 'Which permission must a GitHub Actions job declare to use OIDC with azure/login?', back: 'id-token: write.' },
    { front: 'What is the issuer URL for GitHub Actions OIDC federated credentials?', back: 'https://token.actions.githubusercontent.com' },
    { front: 'Which Azure Pipelines service connection authentication avoids secrets for Azure Resource Manager?', back: 'Workload identity federation (automatic or manual) using the Microsoft Entra issuer.' },
    { front: 'Why is "Grant access permission to all pipelines" discouraged?', back: 'It lets any pipeline, including new or compromised ones, use the connection; authorise pipelines individually and add checks.' },
    { front: 'Name the four Azure DevOps PAT tenant policies.', back: 'Restrict global PAT creation, restrict full-scoped PAT creation, maximum PAT lifespan, and automatic revocation of leaked PATs.' },
    { front: 'Which Azure DevOps access level is free and intended for people who only track work?', back: 'Stakeholder.' },
    { front: 'In Azure DevOps permissions, what happens when a user has Allow from one group and Deny from another?', back: 'Deny wins (unless overridden by explicit Allow at a more specific object level in limited cases).' },
    { front: 'What does creating a team in an Azure DevOps project typically generate?', back: 'A team with its own backlog, board, dashboards, iterations and optionally an area path named after the team.' },
  ],
  quiz: [
    {
      question:
        'A self-hosted Azure Pipelines agent runs on an Azure VM and must read secrets from Key Vault. Which identity minimises credential management?',
      options: ['A service principal with a client secret stored in a variable group', 'A system-assigned managed identity on the VM with a Key Vault role assignment', 'A personal access token of the pipeline owner', 'A GitHub App'],
      correct: [1],
      explanation:
        'The VM supports managed identities, so no credential needs storing or rotating. Secrets and PATs are long-lived credentials, and a GitHub App is unrelated to Azure Key Vault access.',
    },
    {
      question:
        'A GitHub Actions workflow on GitHub-hosted runners must deploy to Azure without storing a client secret. Which TWO configurations are required? (Select two)',
      options: [
        'A federated credential on the Entra application trusting token.actions.githubusercontent.com with a subject for the repository and environment',
        'The job permission id-token: write',
        'A classic PAT with the repo scope',
        'A system-assigned managed identity on the runner',
      ],
      correct: [0, 1],
      explanation:
        'OIDC requires the federated credential and the id-token permission. PATs are long-lived GitHub credentials, and GitHub-hosted runners cannot have Azure managed identities.',
    },
    {
      question:
        'An organization must ensure that no Azure DevOps user can create a PAT that works across all their organizations or lasts longer than 30 days. Where is this configured?',
      options: [
        'In each project’s security settings',
        'In Organization settings > Microsoft Entra, with the tenant PAT policies for global PAT creation and maximum lifespan',
        'In the pipeline YAML',
        'In GitHub enterprise settings',
      ],
      correct: [1],
      explanation:
        'PAT restrictions are tenant-level policies administered under the Microsoft Entra section of Organization settings. Project settings, YAML and GitHub cannot control Azure DevOps PATs.',
    },
    {
      question:
        'A product owner needs to view backlogs, edit work items and see dashboards but never touches code or pipelines. Which Azure DevOps access level is the MOST cost-effective and appropriate?',
      options: ['Basic', 'Basic + Test Plans', 'Stakeholder', 'Visual Studio subscriber'],
      correct: [2],
      explanation:
        'Stakeholder is free and covers work tracking and dashboards. Basic adds code and pipeline access, Test Plans adds test management, and the subscriber level depends on owning a subscription.',
    },
    {
      question:
        'A GitHub Actions job must publish a package to GitHub Packages and should hold no other rights. Which configuration follows least privilege?',
      options: [
        'Use a classic PAT with write:packages stored as a secret',
        'Set permissions: packages: write (with contents: read) on the job and authenticate with GITHUB_TOKEN',
        'Grant the workflow write-all permissions',
        'Create a GitHub App and store its private key as a repository variable',
      ],
      correct: [1],
      explanation:
        'GITHUB_TOKEN with a job-scoped permissions block is short-lived and minimal. PATs and write-all are over-privileged, and private keys must never be stored as variables.',
    },
    {
      question:
        'Several pipelines must deploy to production, and the security team requires that a human approves use of the production credentials regardless of which pipeline runs. What should you configure?',
      options: [
        'Grant access permission to all pipelines on the production service connection',
        'An Approvals check on the production service connection',
        'A minimum reviewers branch policy',
        'A fine-grained PAT per pipeline',
      ],
      correct: [1],
      explanation:
        'Checks on the service connection apply to every stage that uses it. Granting access to all pipelines removes control, branch policies gate merges, and PATs are credentials rather than approval gates.',
    },
  ],
  statements: [
    { text: 'A user-assigned managed identity can be shared by several Azure resources.', isTrue: true, explanation: 'It is a standalone resource that multiple resources can use.' },
    { text: 'GITHUB_TOKEN can access any repository in the organization.', isTrue: false, explanation: 'It is scoped to the repository running the workflow.' },
    { text: 'Azure Pipelines workload identity federation service connections store no client secret.', isTrue: true, explanation: 'They exchange the pipeline token for an Azure token using a federated credential.' },
    { text: 'Setting id-token: write grants a GitHub Actions workflow permission to modify repository contents.', isTrue: false, explanation: 'It only allows the job to request an OIDC token.' },
    { text: 'Azure DevOps tenant policies can automatically revoke PATs that are detected as leaked.', isTrue: true, explanation: 'Automatic revocation of leaked PATs is one of the tenant policies.' },
    { text: 'Basic access level is required to view dashboards in Azure DevOps.', isTrue: false, explanation: 'Stakeholders can view dashboards and work items.' },
    { text: 'GitHub Apps authenticate with short-lived installation access tokens.', isTrue: true, explanation: 'Tokens are minted from the app’s private key and expire after about an hour.' },
  ],
  resources: [
    { label: 'Use service principals and managed identities in Azure DevOps', url: 'https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/service-principal-managed-identity' },
    { label: 'Configure workload identity federation service connections (Azure Pipelines)', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/release/configure-workload-identity' },
    { label: 'Configuring OpenID Connect in Azure (GitHub Actions)', url: 'https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-azure' },
    { label: 'Access levels in Azure DevOps', url: 'https://learn.microsoft.com/en-us/azure/devops/organizations/security/access-levels' },
  ],
};

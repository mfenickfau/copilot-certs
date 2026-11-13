import type { Concept } from '../../types';

export const mlIacGithubActionsNetworking: Concept = {
  id: 'ml-iac-github-actions-networking',
  title: 'Infrastructure as Code for Machine Learning: Bicep, GitHub Actions, Networking and Git',
  summary:
    'How an MLOps platform is provisioned and operated from a repository: Bicep and Azure CLI for the workspace and its dependencies, GitHub Actions with OpenID Connect for secret-free automation, managed virtual networks and private endpoints to lock the workspace down, and Git conventions that make training jobs traceable.',
  certs: ['ai-300'],
  domains: ['ai-300-1'],
  outcomes: ['ai-300-1-3-1', 'ai-300-1-3-2', 'ai-300-1-3-3', 'ai-300-1-3-4', 'ai-300-1-3-5'],
  tags: ['iac', 'bicep', 'github-actions', 'oidc', 'managed-vnet', 'private-link', 'git', 'azure-ml'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Secure GitHub to Azure access: OpenID Connect, not secrets',
      body: `Every automated workflow needs an identity in Azure. The exam has one preferred answer: **OpenID Connect (OIDC) federated credentials**. You create a Microsoft Entra application (or a **user-assigned managed identity**), add a **federated identity credential** that trusts tokens issued by GitHub Actions for a specific repository, branch or environment, and assign that identity a role (for example Contributor on the ML resource group, or narrower). The workflow exchanges its short-lived GitHub token for an Azure token at run time, so **no client secret is stored anywhere**.

The alternative, a service principal with a client secret saved as the \`AZURE_CREDENTIALS\` GitHub secret, still works but is documented as less secure and not recommended: secrets expire, leak and need rotation.

What the workflow needs: \`permissions: id-token: write\`, and three non-secret values stored as GitHub secrets for hygiene: \`AZURE_CLIENT_ID\`, \`AZURE_TENANT_ID\`, \`AZURE_SUBSCRIPTION_ID\`. The \`azure/login@v2\` action performs the exchange:

\`\`\`yaml
permissions:
  id-token: write
  contents: read
steps:
  - uses: actions/checkout@v4
  - uses: azure/login@v2
    with:
      client-id: \${{ secrets.AZURE_CLIENT_ID }}
      tenant-id: \${{ secrets.AZURE_TENANT_ID }}
      subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }}
\`\`\`

For public repositories, put secrets on a **GitHub environment** that requires reviewer approval, so a pull request from a fork cannot reach production credentials. Scope the federated credential's *subject* to \`environment:prod\` for the same reason.`,
    },
    {
      heading: 'Bicep and Azure CLI for the workspace and its dependencies',
      body: `Infrastructure as code (IaC) makes dev, test and prod workspaces identical except for parameters. **Bicep** compiles to ARM templates and is the Microsoft-preferred authoring language. The resource provider is \`Microsoft.MachineLearningServices\`; a workspace declares its associated storage account, Key Vault, Application Insights and container registry by resource ID.

\`\`\`bicep
param location string = resourceGroup().location
param env string
resource ws 'Microsoft.MachineLearningServices/workspaces@2024-10-01' = {
  name: 'mlw-\${env}'
  location: location
  identity: { type: 'SystemAssigned' }
  properties: {
    storageAccount: st.id
    keyVault: kv.id
    applicationInsights: appi.id
    containerRegistry: acr.id
    publicNetworkAccess: 'Disabled'
    managedNetwork: { isolationMode: 'AllowOnlyApprovedOutbound' }
  }
}
\`\`\`

Deploy with \`az deployment group create -g rg-ml-prod --template-file main.bicep --parameters env=prod\`. Bicep is **idempotent**: rerunning it converges the environment, which is why it belongs in a pipeline rather than a one-off script. Day-two assets (compute, datastores, data assets) are usually created with \`az ml ... create -f <yaml>\` because the ML CLI understands their schemas; infrastructure (network, identity, workspace) stays in Bicep. Use **Azure Policy** built-ins for ML (for example "workspaces should use private link") to enforce the baseline across subscriptions.`,
    },
    {
      heading: 'GitHub Actions workflows for provisioning and training',
      body: `A typical repository has two workflow families. **Provisioning** runs Bicep on changes under \`infra/\`; **ML operations** runs \`az ml job create\` or \`az ml online-deployment create\` on changes under \`src/\` or \`jobs/\`. Both share the OIDC login step and the \`az extension add -n ml\` setup.

\`\`\`yaml
name: provision-ml
on:
  push: { branches: [main], paths: ['infra/**'] }
  workflow_dispatch:
permissions: { id-token: write, contents: read }
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: prod
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with:
          client-id: \${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: \${{ secrets.AZURE_TENANT_ID }}
          subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }}
      - run: az deployment group create -g rg-ml-prod --template-file infra/main.bicep -p env=prod
      - run: az extension add -n ml && az ml compute create -f infra/compute/cpu-cluster.yml -w mlw-prod -g rg-ml-prod
\`\`\`

Patterns worth memorising: \`workflow_dispatch\` for manual runs, \`schedule\` (cron) for retraining, \`pull_request\` with \`paths\` filters so only relevant changes trigger, GitHub **environments** with required reviewers as the approval gate before prod, and \`az deployment group what-if\` in the PR job to preview infrastructure changes. Azure DevOps pipelines map one-to-one (service connection with workload identity federation, stages with approvals), and the exam may name either.`,
    },
    {
      heading: 'Restricting network access to the workspace',
      body: `Network isolation has an **inbound** side and an **outbound** side.

**Inbound**: set \`publicNetworkAccess: Disabled\` and create a **private endpoint** for the workspace in your Azure virtual network. Clients (studio users, CI runners, VS Code) must then reach the workspace from that network, for example through VPN, ExpressRoute or a self-hosted runner in the VNet. A softer option allows selected public IP ranges.

**Outbound**: use the **workspace managed virtual network**. Managed compute (compute instances, clusters, serverless, managed online endpoints) is placed in a Microsoft-managed VNet, with private endpoints to the workspace storage, Key Vault and container registry. Three isolation modes:

| Mode | Behaviour | Pick when |
|---|---|---|
| **Allow internet outbound** | All outbound allowed; private endpoints still used for Azure resources you flag | You need PyPI, Hugging Face and the like without rules |
| **Allow only approved outbound** | Only default rules plus the service tags, private endpoints and FQDNs you add | Data exfiltration risk must be minimised |
| **Disabled** | No managed VNet; you bring your own VNet | Legacy or custom networking |

Add outbound rules with \`az ml workspace outbound-rule set\` (types \`private_endpoint\`, \`service_tag\`, \`fqdn\`; FQDN rules rely on Azure Firewall and add cost). Two gotchas the exam likes: a workspace set to *allow internet outbound* cannot go back to *disabled*, and *allow only approved outbound* cannot go back to *allow internet outbound*; and Key Vault with a firewall needs **Allow trusted Microsoft services to bypass this firewall** even with private endpoints. The managed network itself is free; private endpoints and firewall rules are billed.`,
    },
    {
      heading: 'Git for machine learning projects',
      body: `Azure ML treats Git as the source of truth and records it on every job. When you submit a job from a local Git repository, the job's properties capture the **repository URI, branch and commit** (for example \`azureml.git.repository_uri\`, \`mlflow.source.git.commit\`), so any registered model can be traced back to the exact code that produced it. This works with GitHub, Azure Repos, Bitbucket or any Git host because the information is read from the local clone.

On a **compute instance**, clone repositories into your user folder under \`~/cloudfiles/code/Users/<you>/\` (the shared workspace file share) or into the local disk for speed; authenticate with SSH keys generated on the instance or with a personal access token over HTTPS. Keep one branch per experiment, open pull requests to merge into \`main\`, and let CI run unit tests on scoring scripts and a short smoke-training job before merge.

Repository layout conventions that make the rest of MLOps work: \`infra/\` (Bicep), \`jobs/\` or \`pipelines/\` (job and component YAML), \`src/\` (training and scoring code), \`environments/\` (conda and Dockerfiles), \`.github/workflows/\`. Large data never goes in Git; data assets and datastores point to it. Model binaries never go in Git either; the model registry and registries hold them. Treat YAML job definitions and prompts the same way as code: reviewed, versioned, promoted by pull request.`,
    },
  ],
  examples: [
    {
      title: 'Federated credential for a GitHub environment',
      description:
        'The platform team creates a user-assigned managed identity for CI, assigns it Contributor on the prod ML resource group and Storage Blob Data Contributor on the data account, then adds a federated credential whose subject matches only the prod environment of the repo. A workflow running from a feature branch gets no token.',
      language: 'bash',
      code: `az identity create -n id-mlops-ci -g rg-ml-prod
CLIENT_ID=$(az identity show -n id-mlops-ci -g rg-ml-prod --query clientId -o tsv)
az identity federated-credential create --name gh-prod --identity-name id-mlops-ci -g rg-ml-prod \\
  --issuer https://token.actions.githubusercontent.com \\
  --subject repo:contoso/mlops-platform:environment:prod \\
  --audiences api://AzureADTokenExchange
az role assignment create --assignee "$CLIENT_ID" --role Contributor \\
  --scope /subscriptions/<sub>/resourceGroups/rg-ml-prod`,
      takeaway: 'OIDC federation scopes trust to a repository and environment; nothing secret is created or rotated.',
    },
    {
      title: 'Locked-down workspace in Bicep plus required outbound rule',
      description:
        'A healthcare customer requires no public access and minimal egress. The workspace is deployed with public network access disabled and AllowOnlyApprovedOutbound. Training needs a private Azure AI Search index for feature lookups, so the team adds a private endpoint outbound rule instead of opening the internet.',
      language: 'bash',
      code: `az deployment group create -g rg-ml-prod --template-file infra/main.bicep -p env=prod
az ml workspace outbound-rule set --workspace-name mlw-prod -g rg-ml-prod \\
  --rule search-pe --type private_endpoint \\
  --service-resource-id /subscriptions/<sub>/resourceGroups/rg-data/providers/Microsoft.Search/searchServices/srch-feat \\
  --subresource-target searchService
az ml workspace provision-network -n mlw-prod -g rg-ml-prod   # pre-provision the managed VNet`,
      takeaway: 'Approved-outbound mode plus explicit outbound rules gives access to exactly the services the workload needs.',
    },
    {
      title: 'The leaked service principal secret (a realistic mistake and the fix)',
      description:
        'A team stored the JSON output of az ad sp create-for-rbac as AZURE_CREDENTIALS. A contractor forked the public repo, and a workflow in the fork printed the secret via a debug step before environment protection was added. The fix: delete the secret, remove the service principal credential, switch the workflow to azure/login with OIDC, move the three IDs to an environment with required reviewers, and restrict the federated subject to that environment.',
      language: 'yaml',
      code: `# before (not recommended)
- uses: azure/login@v2
  with:
    creds: \${{ secrets.AZURE_CREDENTIALS }}
# after
permissions: { id-token: write, contents: read }
jobs:
  train:
    environment: prod        # requires reviewer approval; holds the three IDs
    steps:
      - uses: azure/login@v2
        with:
          client-id: \${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: \${{ secrets.AZURE_TENANT_ID }}
          subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }}`,
      takeaway: 'Client secrets in CI are a liability; OIDC plus protected environments removes the secret and adds an approval gate.',
    },
  ],
  keyPoints: [
    'Prefer OpenID Connect federated credentials (Entra app or user-assigned managed identity) over a service principal secret for GitHub Actions; the workflow needs id-token: write and azure/login@v2.',
    'Store AZURE_CLIENT_ID, AZURE_TENANT_ID and AZURE_SUBSCRIPTION_ID as GitHub secrets; use environment secrets with required reviewers for production and public repositories.',
    'Bicep (Microsoft.MachineLearningServices/workspaces) provisions the workspace and its associated resources idempotently; az ml ... create -f handles day-two assets such as compute and datastores.',
    'Inbound isolation = publicNetworkAccess Disabled plus a private endpoint; outbound isolation = workspace managed virtual network.',
    'Managed VNet modes: allow internet outbound, allow only approved outbound (service tags, private endpoints, FQDN rules), disabled; you cannot move back to a less isolated mode.',
    'Key Vault behind a firewall needs "Allow trusted Microsoft services" even when private endpoints exist.',
    'Jobs submitted from a Git clone record repository URI, branch and commit, giving model-to-code lineage.',
    'Keep infra, job YAML, source and environments in the repo; keep data and model binaries out of it (datastores, data assets, registries).',
  ],
  flashcards: [
    { front: 'What is the recommended way for a GitHub Actions workflow to authenticate to Azure?', back: 'OpenID Connect with a federated identity credential on a Microsoft Entra application or user-assigned managed identity; no client secret.' },
    { front: 'Which workflow permission is required for OIDC login?', back: 'permissions: id-token: write.' },
    { front: 'Which three values does azure/login@v2 need for OIDC?', back: 'client-id, tenant-id and subscription-id (typically from GitHub secrets).' },
    { front: 'Which Azure resource provider defines an Azure ML workspace in Bicep?', back: 'Microsoft.MachineLearningServices/workspaces.' },
    { front: 'Which CLI command deploys a Bicep file to a resource group?', back: 'az deployment group create --resource-group <rg> --template-file main.bicep.' },
    { front: 'Name the three managed virtual network isolation modes.', back: 'Allow internet outbound, allow only approved outbound, disabled.' },
    { front: 'Which outbound rule type requires Azure Firewall and adds cost?', back: 'FQDN rules.' },
    { front: 'How do you block all public inbound access to a workspace?', back: 'Set public network access to Disabled and create a private endpoint for the workspace in your VNet.' },
    { front: 'What Git metadata does Azure ML record on a job submitted from a local clone?', back: 'Repository URI, branch and current commit (as job properties such as mlflow.source.git.commit).' },
    { front: 'Why use GitHub environment secrets rather than repository secrets for production?', back: 'Environments can require reviewer approval, and jobs cannot read environment secrets until approved, which protects public repos from fork-based attacks.' },
  ],
  quiz: [
    {
      question:
        'Your GitHub Actions workflow must create Azure ML jobs in a production workspace. Security requires that no long-lived credential is stored in GitHub. What should you configure?',
      options: [
        'A service principal client secret stored as AZURE_CREDENTIALS',
        'A federated identity credential on a user-assigned managed identity trusted by the repository, used by azure/login with OIDC',
        'The workspace account key stored as a GitHub secret',
        'A personal access token for the Azure CLI',
      ],
      correct: [1],
      explanation:
        'OIDC federation issues short-lived tokens at run time; no secret is stored. Client secrets, keys and PATs are all long-lived credentials.',
    },
    {
      question:
        'A regulated customer needs training compute that can reach the workspace storage account and a private Azure AI Search service, but nothing else on the internet. Which managed virtual network configuration should you choose?',
      options: [
        'Allow internet outbound with a private endpoint rule for the search service',
        'Allow only approved outbound with a private endpoint outbound rule for the search service',
        'Disabled, relying on NSGs on the compute instance',
        'Allow internet outbound with Azure Policy denying public IPs',
      ],
      correct: [1],
      explanation:
        'Approved-outbound mode blocks everything except default rules and the rules you add; the private endpoint rule admits the search service. Internet-outbound modes allow general egress, and disabled means no managed network at all.',
    },
    {
      question: 'Which TWO statements about Azure ML managed virtual network isolation are correct? (Select two)',
      options: [
        'A workspace configured for allow only approved outbound can later be switched back to allow internet outbound.',
        'FQDN outbound rules depend on Azure Firewall and incur additional cost.',
        'Key Vault with a firewall must allow trusted Microsoft services even when a private endpoint exists.',
        'The managed virtual network protects inbound access to the workspace.',
      ],
      correct: [1, 2],
      explanation:
        'FQDN rules use Azure Firewall, and Key Vault needs the trusted-services bypass. Isolation modes cannot be relaxed once tightened, and inbound protection comes from private endpoints on your own VNet, not the managed VNet.',
    },
    {
      question:
        'You want pull requests that change infra/ to show the infrastructure changes before merge, and deployment to prod to require a manual approval. Which combination achieves this?',
      options: [
        'Run az deployment group what-if in the pull_request workflow and deploy from a job bound to a GitHub environment with required reviewers',
        'Run az deployment group create on every pull request and rely on code review',
        'Store the Bicep in a release branch and deploy manually from a laptop',
        'Use workflow_dispatch only and skip pull request checks',
      ],
      correct: [0],
      explanation:
        'what-if previews changes safely; GitHub environments with required reviewers provide the approval gate. Deploying on every PR changes prod before approval, and manual laptop deployments defeat IaC.',
    },
    {
      question:
        'An auditor asks how you can prove which code produced model version 14. The model was trained by a job submitted from a CI runner that checked out the repository. What is the best evidence?',
      options: [
        'The job properties recording the Git repository URI, branch and commit hash',
        'The timestamp of the model registration compared with the commit log',
        'The compute cluster logs',
        'The data asset version used by the job',
      ],
      correct: [0],
      explanation:
        'Azure ML records Git metadata on jobs submitted from a clone, giving direct lineage. Timestamps are circumstantial, cluster logs do not identify code, and the data version answers a different question.',
    },
  ],
  statements: [
    { text: 'Using a service principal with a client secret is the Microsoft-recommended way to authenticate GitHub Actions to Azure.', isTrue: false, explanation: 'OpenID Connect with federated credentials is recommended; secrets are documented as less secure.' },
    { text: 'Bicep deployments are idempotent, so rerunning the same template converges resources to the declared state.', isTrue: true, explanation: 'This is why Bicep belongs in CI/CD pipelines.' },
    { text: 'After enabling allow internet outbound on a managed VNet workspace, you can reconfigure it to disabled.', isTrue: false, explanation: 'Isolation modes can only move toward more isolation, not back.' },
    { text: 'The workspace managed virtual network is free, but private endpoints and FQDN firewall rules are billed.', isTrue: true, explanation: 'Charges come from Private Link and Azure Firewall usage, not the managed network itself.' },
    { text: 'Azure ML can only record Git lineage for repositories hosted on GitHub.', isTrue: false, explanation: 'The information is read from the local clone, so any Git host works.' },
    { text: 'Setting publicNetworkAccess to Disabled on a workspace requires clients to connect through a private endpoint in a virtual network.', isTrue: true, explanation: 'Inbound access then flows only over Private Link.' },
  ],
  resources: [
    { label: 'Use GitHub Actions with Azure Machine Learning', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-github-actions-machine-learning' },
    { label: 'Create a workspace by using an Azure Resource Manager template', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-create-workspace-template' },
    { label: 'Workspace managed virtual network isolation', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-managed-network' },
    { label: 'Git integration for Azure Machine Learning', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/concept-train-model-git-integration' },
  ],
};

import type { Concept } from '../../types';

export const foundryResourcesIdentityNetworking: Concept = {
  id: 'foundry-resources-identity-networking',
  title: 'Microsoft Foundry Resources, Projects, RBAC, Networking and Bicep',
  summary:
    'The GenAIOps platform layer: how a Foundry resource and its projects are structured, which built-in roles and managed identities grant least-privilege access, how private endpoints and virtual network injection isolate traffic, and how to stamp it all out repeatably with Bicep and the Azure CLI.',
  certs: ['ai-300', 'ai-103'],
  domains: ['ai-300-3', 'ai-103-1'],
  outcomes: ['ai-300-3-1-1', 'ai-300-3-1-2', 'ai-300-3-1-3', 'ai-300-3-1-4', 'ai-103-1-3-4'],
  tags: ['foundry', 'foundry-project', 'rbac', 'managed-identity', 'private-link', 'bicep', 'genaiops'],
  difficulty: 'intermediate',
  diagram: 'foundry-agent-stack',
  sections: [
    {
      heading: 'Resource model: one Foundry resource, many projects',
      body: `**Microsoft Foundry** (formerly Azure AI Foundry) is an Azure resource of type \`Microsoft.CognitiveServices/accounts\` with \`kind: AIServices\`. It is the **governance boundary**: networking, encryption, model **deployments**, connections and policies live here. Inside it you create **projects** (\`Microsoft.CognitiveServices/accounts/projects\`), the **development boundary** where a team keeps agents, evaluations, files, traces and datasets. Projects reuse the resource's model deployments and connections, so platform teams configure once and application teams build without repeating IT setup.

**Connected resources** such as Azure Storage, Key Vault, Azure AI Search, Cosmos DB and Application Insights are separate Azure resources referenced through **connections**; they keep their own networking and RBAC, which you must configure independently. A Foundry resource that hosts agents in a "standard" (bring-your-own) setup stores agent threads, files and vectors in your own Storage, AI Search and Cosmos DB so data stays in your tenant.

Two project types exist. **Foundry projects** (on a Foundry resource) are the current model and the only one with the new portal, Agent Service, continuous evaluation and the unified \`azure-ai-projects\` SDK. **Hub-based projects** (built on an Azure ML hub workspace) are the classic model and still host serverless API endpoints, managed compute deployments and prompt flow; new investment goes to Foundry projects. Typical layout: one resource per environment (dev, test, prod) or per business unit, with a project per application or team.`,
    },
    {
      heading: 'Identity and access: Foundry roles and managed identities',
      body: `Foundry separates **control-plane** actions (create projects, deployments, connections) from **data-plane** actions (build agents, run evaluations, upload files, call models). Azure RBAC assignments can be scoped to the **resource**, a **project**, or even an individual **agent**.

| Built-in role | Grants |
|---|---|
| **Foundry User** | Build and develop inside projects (data actions), read resource and projects; the least-privilege developer role |
| **Foundry Project Manager** | Create and manage projects, build in them, and conditionally assign Foundry User to others; minimum role to publish agents |
| **Foundry Account Owner** | Create resources and projects, manage deployments and connections; cannot build in projects |
| **Foundry Owner** | Everything above plus building; a highly privileged self-serve role |
| **Foundry Agent Consumer** | Only call agent endpoints; for end users and service principals that consume agents |

(These were renamed from Azure AI User, Azure AI Project Manager, Azure AI Account Owner and Azure AI Owner; IDs and permissions are unchanged.) Classic **Owner**, **Contributor** and **Reader** manage the Azure resource but do **not** grant data-plane access: a Contributor cannot build an agent without Foundry User. Do not use Cognitive Services roles (except Cognitive Services Usages Reader for quota visibility) or the Azure AI Developer role, which targets ML workspaces and hubs.

**Managed identities** carry the non-human side. The project's managed identity needs **Foundry User** on the resource so it can call models and tools. Connections to Storage, Search or Key Vault should use the identity (Storage Blob Data Contributor, Search Index Data Reader, Key Vault Secrets User) rather than keys. A published agent gets its own identity, and permissions on the project identity do **not** transfer automatically. Prefer Microsoft Entra authentication over API keys everywhere: keys bypass RBAC entirely, and you can disable local auth on the resource to enforce this.`,
    },
    {
      heading: 'Network isolation: inbound, outbound and agent injection',
      body: `Plan isolation in three places.

**Inbound to the Foundry resource**: the \`publicNetworkAccess\` flag. \`Disabled\` requires a **private endpoint** (target type "account") in your VNet; **Selected networks** admits listed IP ranges and VNets. Clients inside the VNet use the same endpoint URL; a private DNS zone (\`privatelink.*\`) resolves it to the private IP. Creating the private endpoint needs Network Contributor on the VNet and Contributor on the resource (or the connection waits for approval).

**Outbound from the resource** to PaaS dependencies: Storage, Key Vault, AI Search, Cosmos DB and Application Insights are isolated with their own **Private Link** endpoints; with public access disabled on those resources, grant their roles to the Foundry and project identities and enable trusted-service bypass where offered.

**Outbound from agents**: Agent Service runs agents in platform containers. For network-isolated agents you either bring a VNet with a dedicated subnet delegated to \`Microsoft.App/environments\` (**customer-managed VNet, container injection**) so agents reach your private data sources, or let Foundry manage the VNet (**managed VNet**) for simpler but less customisable isolation. Some private-endpoint-only configurations cannot be done in the portal and need the CLI, SDK or Bicep.

Combine with **customer-managed keys** when key lifecycle control is required, and **Azure Policy** to force private link, allowed regions and SKUs across every Foundry resource the organisation creates. Model deployments inherit the resource's network settings; the deployment type (global, data zone, regional) governs where inference data is processed, not whether the network is private.`,
    },
    {
      heading: 'Bicep and Azure CLI for repeatable environments',
      body: `Because projects, deployments and connections are ARM resources under one provider, a single Bicep template can stand up a complete environment and be reapplied for dev, test and prod.

\`\`\`bicep
param name string
param location string = resourceGroup().location
resource account 'Microsoft.CognitiveServices/accounts@2025-06-01' = {
  name: name
  location: location
  kind: 'AIServices'
  sku: { name: 'S0' }
  identity: { type: 'SystemAssigned' }
  properties: {
    customSubDomainName: name
    allowProjectManagement: true
    publicNetworkAccess: 'Disabled'
    disableLocalAuth: true
  }
}
resource project 'Microsoft.CognitiveServices/accounts/projects@2025-06-01' = {
  parent: account
  name: '\${name}-proj'
  location: location
  identity: { type: 'SystemAssigned' }
  properties: { displayName: 'Retention assistant' }
}
resource gpt 'Microsoft.CognitiveServices/accounts/deployments@2025-06-01' = {
  parent: account
  name: 'gpt-4.1'
  sku: { name: 'GlobalStandard', capacity: 50 }
  properties: { model: { format: 'OpenAI', name: 'gpt-4.1', version: '2025-04-14' } }
}
\`\`\`

\`az deployment group create -g rg-ai-prod --template-file main.bicep -p name=fdry-prod\`. Add role assignments (\`Microsoft.Authorization/roleAssignments\`) for Foundry User to the project identity and developer groups, private endpoints and connections in the same template. The deploying identity needs rights to create role assignments (Owner or User Access Administrator) or the deployment fails partway. If a resource already exists, **Automation > Export template** in the portal produces Bicep to start from; replace hard-coded IDs with parameters. Microsoft publishes production-ready templates in the \`foundry-samples\` repository (\`infrastructure-setup-bicep\`), and \`az cognitiveservices account deployment create\` handles a one-off model deployment from the CLI. Use \`what-if\` in pull requests and GitHub environments for approvals exactly as for ML workspaces.`,
    },
  ],
  examples: [
    {
      title: 'Least-privilege onboarding for a new team',
      description:
        'A platform team provisions fdry-prod and a project per application. The team lead gets Foundry Project Manager on the resource so she can create projects and invite people; developers get Foundry User on their project plus Reader on the resource; the project managed identity gets Foundry User on the resource; the customer-facing web app\'s service principal gets Foundry Agent Consumer on the published agent only.',
      language: 'bash',
      code: `RES=$(az cognitiveservices account show -n fdry-prod -g rg-ai-prod --query id -o tsv)
PROJ="$RES/projects/retention-proj"
PMI=$(az resource show --ids "$PROJ" --query identity.principalId -o tsv)
az role assignment create --assignee lead@contoso.com --role "Foundry Project Manager" --scope "$RES"
az role assignment create --assignee dev-group-object-id --role "Foundry User" --scope "$PROJ"
az role assignment create --assignee dev-group-object-id --role Reader --scope "$RES"
az role assignment create --assignee-object-id "$PMI" --assignee-principal-type ServicePrincipal --role "Foundry User" --scope "$RES"
az role assignment create --assignee webapp-sp-object-id --role "Foundry Agent Consumer" --scope "$PROJ"`,
      takeaway: 'Scope roles to the smallest boundary (project or agent) and give the project identity Foundry User on the resource.',
    },
    {
      title: 'Contributor cannot build (a realistic mistake and the fix)',
      description:
        'A developer with Contributor on the resource group opens the Foundry portal and gets authorization errors when creating an agent, even though he can create deployments. Contributor covers control-plane actions only. The fix is to assign Foundry User at project scope; alternatively enabling key-based auth would have "worked" but bypasses RBAC and is the wrong answer.',
      language: 'bash',
      code: `# wrong: widening Azure RBAC further
# az role assignment create --assignee dev@contoso.com --role Owner --scope $RES
# right: add the data-plane role at the narrowest scope
az role assignment create --assignee dev@contoso.com --role "Foundry User" --scope "$PROJ"`,
      takeaway: 'Azure Owner/Contributor/Reader do not include Foundry data actions; developers need Foundry User.',
    },
    {
      title: 'Private Foundry with BYO VNet for agents',
      description:
        'A bank requires that agents reach an on-premises-synced SQL database and a private AI Search index with no public egress. The template disables public network access, adds a private endpoint for the account, delegates a subnet to Microsoft.App/environments for agent container injection, and links private endpoints for Storage, Search and Cosmos DB used as agent stores.',
      language: 'text',
      code: `resource agentSubnet 'Microsoft.Network/virtualNetworks/subnets@2024-05-01' = {
  parent: vnet
  name: 'snet-agents'
  properties: {
    addressPrefix: '10.20.2.0/24'
    delegations: [{ name: 'app', properties: { serviceName: 'Microsoft.App/environments' } }]
  }
}
resource pe 'Microsoft.Network/privateEndpoints@2024-05-01' = {
  name: 'pe-fdry-prod'
  location: location
  properties: {
    subnet: { id: peSubnet.id }
    privateLinkServiceConnections: [{
      name: 'fdry'
      properties: { privateLinkServiceId: account.id, groupIds: ['account'] }
    }]
  }
}`,
      takeaway: 'Inbound isolation is a private endpoint on the account; agent outbound isolation is a delegated subnet the platform injects into.',
    },
  ],
  keyPoints: [
    'A Foundry resource is Microsoft.CognitiveServices/accounts with kind AIServices; projects are child resources and the development boundary; deployments and connections live on the resource.',
    'Foundry projects are the current model (new portal, Agent Service, continuous evaluation); hub-based projects are classic (serverless API endpoints, managed compute, prompt flow).',
    'Foundry User is the least-privilege developer role; Foundry Project Manager creates projects and is the minimum to publish agents; Foundry Agent Consumer only calls agent endpoints.',
    'Azure Owner, Contributor and Reader are control-plane only and do not let anyone build agents or run evaluations.',
    'The project managed identity needs Foundry User on the resource; published agents get their own identity and must be re-granted access.',
    'Inbound isolation: publicNetworkAccess Disabled plus a private endpoint of group account; outbound to PaaS dependencies via their own private endpoints; agents via customer-managed VNet injection or managed VNet.',
    'Prefer Entra ID over API keys (keys bypass RBAC); disableLocalAuth enforces it.',
    'Bicep templates define account, projects, deployments, role assignments and private endpoints together; deploy with az deployment group create and export existing resources as a starting point.',
  ],
  flashcards: [
    { front: 'What Azure resource type and kind represent a Microsoft Foundry resource?', back: 'Microsoft.CognitiveServices/accounts with kind AIServices.' },
    { front: 'What is the relationship between a Foundry resource and a project?', back: 'The resource is the governance boundary (network, security, deployments, connections); projects are child resources where teams build agents, evaluations and files.' },
    { front: 'Which Foundry role is the least-privilege choice for a developer building agents?', back: 'Foundry User.' },
    { front: 'Which role is the minimum needed to publish an agent?', back: 'Foundry Project Manager on the Foundry resource scope.' },
    { front: 'Can a user with Contributor on the Foundry resource build agents?', back: 'No. Contributor is control-plane only; they also need Foundry User.' },
    { front: 'Which role should a service principal that only calls agent endpoints receive?', back: 'Foundry Agent Consumer.' },
    { front: 'What role does the project managed identity need, and where?', back: 'Foundry User on the Foundry resource.' },
    { front: 'How do you block public inbound access to a Foundry resource?', back: 'Set publicNetworkAccess to Disabled and add a private endpoint (group id account) in your VNet with private DNS.' },
    { front: 'What subnet delegation enables agent container injection into your VNet?', back: 'Microsoft.App/environments.' },
    { front: 'Why are API keys discouraged on Foundry resources?', back: 'A key grants full access and bypasses RBAC; Entra ID authentication honours role assignments.' },
    { front: 'Which CLI command deploys a Foundry Bicep template?', back: 'az deployment group create --resource-group <rg> --template-file main.bicep --parameters ...' },
  ],
  quiz: [
    {
      question:
        'A developer has Contributor on the resource group containing your Foundry resource but receives authorization errors when creating an agent in a project. Which action resolves this with least privilege?',
      options: [
        'Assign Owner on the resource group',
        'Assign Foundry User at the project scope',
        'Enable key-based authentication on the resource',
        'Assign Cognitive Services Contributor at the subscription scope',
      ],
      correct: [1],
      explanation:
        'Foundry User grants the data-plane actions needed to build. Owner is excessive and still lacks data actions, key auth bypasses RBAC, and Cognitive Services roles are not for Foundry scenarios.',
    },
    {
      question:
        'Compliance requires that no traffic to your Foundry resource traverses the public internet and that agents can reach a private Azure SQL database. Which TWO configurations are required? (Select two)',
      options: [
        'Set publicNetworkAccess to Disabled and create a private endpoint for the Foundry account',
        'Deploy models with the Data Zone Standard deployment type',
        'Provide a VNet subnet delegated to Microsoft.App/environments for agent container injection',
        'Assign Foundry Owner to all developers',
      ],
      correct: [0, 2],
      explanation:
        'Private endpoint plus disabled public access covers inbound; the delegated subnet lets agents reach private resources. Deployment type controls data-processing geography, not network path, and roles do not affect networking.',
    },
    {
      question:
        'A customer-facing web app must call a published agent and nothing else in the project. Which role assignment is the most appropriate?',
      options: [
        'Foundry User on the Foundry resource',
        'Foundry Agent Consumer on the project (or the specific agent)',
        'Reader on the Foundry resource',
        'Foundry Project Manager on the project',
      ],
      correct: [1],
      explanation:
        'Agent Consumer is designed for principals that only interact with agent endpoints. Foundry User allows building, Reader grants no data actions, and Project Manager is far too broad.',
    },
    {
      question:
        'Your Bicep deployment of a Foundry resource, project and role assignments fails partway with an authorization error on the role assignment step. What is the most likely cause?',
      options: [
        'The Bicep API version is too new',
        'The identity running the deployment lacks permission to create role assignments (needs Owner or User Access Administrator)',
        'Projects cannot be created in Bicep',
        'The resource must be created in the portal first',
      ],
      correct: [1],
      explanation:
        'Role assignments require Microsoft.Authorization/roleAssignments/write, typically via Owner or User Access Administrator. Projects and resources deploy fine from Bicep.',
    },
    {
      question:
        'A team needs serverless API endpoints for a partner model and prompt flow for an existing application. Which project type still supports these?',
      options: [
        'A Foundry project on a Foundry resource',
        'A hub-based (classic) project',
        'An Azure OpenAI resource without projects',
        'An Azure Machine Learning registry',
      ],
      correct: [1],
      explanation:
        'Serverless API endpoints, managed compute deployments and prompt flow are hub-based project features. Foundry projects use standard deployments on the resource, Azure OpenAI resources lack projects, and registries store assets.',
    },
  ],
  statements: [
    { text: 'A Foundry project is a child resource of the Foundry resource under the Microsoft.CognitiveServices provider.', isTrue: true, explanation: 'The type is Microsoft.CognitiveServices/accounts/projects.' },
    { text: 'The Azure Reader role on a Foundry resource allows a user to run evaluations in a project.', isTrue: false, explanation: 'Reader is control-plane read only; evaluations need Foundry User.' },
    { text: 'Permissions granted to the project managed identity automatically apply to a published agent\'s identity.', isTrue: false, explanation: 'Published agents receive their own identity; reassign the needed roles.' },
    { text: 'Connected resources such as Storage and AI Search keep their own networking and RBAC settings separate from the Foundry resource.', isTrue: true, explanation: 'They are independent Azure resources referenced through connections.' },
    { text: 'The Foundry roles Foundry User and Foundry Owner were previously named Azure AI User and Azure AI Owner.', isTrue: true, explanation: 'The rename kept role IDs and permissions.' },
    { text: 'Choosing a Data Zone deployment type is sufficient to keep model traffic off the public internet.', isTrue: false, explanation: 'Deployment type governs data-processing location; private endpoints govern the network path.' },
  ],
  resources: [
    { label: 'Microsoft Foundry architecture', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/architecture' },
    { label: 'Role-based access control for Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/rbac-azure-ai-foundry' },
    { label: 'How to configure network isolation for Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/configure-private-link' },
    { label: 'Quickstart: Deploy a Microsoft Foundry resource by using a Bicep file', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/create-resource-template' },
  ],
};

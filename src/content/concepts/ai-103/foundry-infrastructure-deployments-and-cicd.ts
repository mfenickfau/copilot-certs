import type { Concept } from '../../types';

export const foundryInfrastructureDeploymentsAndCicd: Concept = {
  id: 'foundry-infrastructure-deployments-and-cicd',
  title: 'Foundry Infrastructure, Deployment Types and CI/CD',
  summary:
    'How a Foundry resource, projects, connections and agent setup (basic vs standard, bring-your-own storage, Cosmos DB and AI Search) fit together, how to choose between Global Standard, Data Zone, regional Standard, Provisioned, Batch and Developer deployment types, how to configure model and agent deployments, and how to deliver Foundry projects through Bicep, azd and CI/CD pipelines with evaluation gates.',
  certs: ['ai-103', 'ai-901'],
  domains: ['ai-103-1', 'ai-901-1'],
  outcomes: ['ai-103-1-2-1', 'ai-103-1-2-2', 'ai-103-1-2-3', 'ai-103-1-2-4', 'ai-901-1-2-3'],
  tags: ['foundry', 'deployment-types', 'ptu', 'infrastructure', 'bicep', 'azd', 'ci-cd', 'github-actions', 'intermediate'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Designing the Azure footprint for AI apps and agents',
      body: `A **Foundry resource** (Azure resource provider \`Microsoft.CognitiveServices/accounts\`, kind AIServices) is the administrative, security and billing boundary. It holds model **deployments**, and one or more **Foundry projects** that organise agents, files, evaluations, connections and RBAC. Everything speaks one endpoint family: \`https://<resource>.services.ai.azure.com/api/projects/<project>\` for the project, and \`https://<resource>.openai.azure.com/openai/v1/\` for the raw Azure OpenAI surface. Hub-based projects and standalone Azure OpenAI resources are the *classic* generation; new work targets Foundry projects, and an Azure OpenAI resource can be upgraded in place.

Around the resource you design supporting services:

- **Application Insights** connected to the project for tracing, monitoring and continuous evaluation.
- **Azure AI Search** for RAG indexes and Foundry IQ knowledge bases.
- **Azure Storage**, **Azure Cosmos DB** and **Azure Key Vault** when you choose **standard agent setup**: agent conversations, vector stores and files are stored in *your* resources instead of Microsoft-managed ones, which gives data sovereignty and project-level isolation. Cosmos DB needs at least 3,000 RU/s because the setup provisions several containers. **Basic agent setup** uses platform-managed storage and is simplest.
- **Virtual network injection** (standard setup with private networking): a delegated subnet for agent compute, private endpoints for dependencies, no public egress.
- **Azure Container Registry** for hosted agent images; **API Management as an AI gateway** when you want token limits, rate limits and MCP tool governance.
- Identity: the project **managed identity** plus per-agent **Entra agent identities**; keyless access everywhere.

Region strategy matters: models, Content Understanding, agentic retrieval and evaluation features each have region lists, so an architecture item that mentions "all features in one region" expects you to check **feature availability by region** before committing, and to place the Foundry resource near the data for latency and residency.`,
    },
    {
      heading: 'Choosing a deployment type',
      body: `Deployment types apply to serverless (API) deployments and decide *where data is processed*, *how you pay* and *latency behaviour*:

| Type (SKU) | Processing | Billing | Choose when |
|---|---|---|---|
| **Global Standard** (GlobalStandard) | Any Azure region | Pay-per-token | Default: newest models first, highest quota, lowest price |
| **Data Zone Standard** | Within US, EU or APAC data zone | Pay-per-token | Data-zone compliance without reserved capacity |
| **Standard** (regional) | Within the Azure geography | Pay-per-token | Geography residency, lower volume |
| **Global / Data Zone / Regional Provisioned** (PTU) | As above | Reserved provisioned throughput units, hourly or reserved | Predictable high throughput, low latency variance, SLA |
| **Global / Data Zone Batch** | As above | About 50% discount, 24-hour turnaround | Large asynchronous jobs |
| **Developer** | Any region | Pay-per-token, 24-hour lifetime, no SLA | Evaluating fine-tuned models only |

Rules of thumb the exam rewards: start with Global Standard; move to Data Zone when EU/US/APAC processing is required; choose Provisioned when traffic is steady and latency variance must be low, and enable **spillover** so overflow routes to a matching Standard deployment instead of returning 429s; choose Batch for nightly summarisation of millions of records; never put Developer in production. Data at rest always stays in the resource's geography; the type governs inference processing location. Models from partners deploy either as **serverless** (pay-per-token) or on **managed compute** (dedicated VMs billed by core-hour, classic hub projects), and open-weight or Hugging Face models are the typical managed-compute case.`,
    },
    {
      heading: 'Configuring model and agent deployments',
      body: `A **model deployment** is an alias with a name, model name and version, deployment type, capacity (TPM or PTU), a **content filter / guardrail** assignment, and a version-update policy (auto-update to default, upgrade when expired, or no auto-upgrade). Create it in the portal (Build > Models), with the CLI (\`az cognitiveservices account deployment create\`), with Bicep (\`Microsoft.CognitiveServices/accounts/deployments\`) or with the control-plane REST API. Quota is allocated per subscription, per region, per model in TPM; RPM is derived from TPM by a model-specific ratio.

An **agent deployment** is different: a prompt agent is a *versioned definition* (model, instructions, tools, structured inputs) saved in a project. Each save creates an immutable version; clients reference \`<agent_name>:<version>\` or the agent's **active version** on its stable endpoint. Configure endpoint authorization (Azure RBAC or Entra agent blueprint), assign a guardrail, connect Application Insights, and grant the agent identity least-privilege roles on downstream resources. A **hosted agent** is deployed from a container image (or source code) with \`azd ai agent\` commands or Terraform; Foundry provisions compute per session, scales to zero, and keeps a version history you can promote or roll back.

Both kinds of deployment should be reproducible: keep the Bicep or Terraform for the resource, deployments and connections in source control, and keep agent definitions (azure.yaml for azd, or SDK create_version calls) alongside the application code.`,
    },
    {
      heading: 'CI/CD for Foundry projects and the exam angle',
      body: `Microsoft's reference pattern has three layers:

1. **Infrastructure as code**: Bicep (the \`foundry-samples\` infrastructure-setup-bicep templates) or Terraform create the Foundry resource, project, model deployments, connections, networking and dependent services. You can also export an existing resource as Bicep from the Azure portal.
2. **Application and agent delivery**: the **Azure Developer CLI** (\`azd\`) with the Foundry extensions. \`azd ai agent init\` scaffolds a hosted agent project, \`azd up\` provisions and deploys, and \`azd pipeline config\` generates a GitHub Actions or Azure Pipelines workflow (service principal with OpenID Connect, repository variables, \`azd provision\` then \`azd deploy\`). Each deploy creates a new agent version; promotion to production is a separate step.
3. **Quality gates**: the **Foundry evaluation GitHub Action** (and the Azure DevOps task) runs offline evaluations against one or more agent versions (\`agent-ids: my-agent:1,my-agent:2\`) with evaluators from the catalog and reports statistical significance, so a pull request can fail if task adherence or groundedness regresses. Red-teaming scans and safety evaluations can be scheduled the same way.

Secrets never go in code: pipelines sign in with OIDC, applications use \`DefaultAzureCredential\`, and keys that cannot be avoided live in Key Vault.

Exam framings: "process data only inside the EU" → Data Zone; "consistent sub-second latency for a trading desk" → Provisioned with spillover; "cheapest way to summarise 10 million tickets overnight" → Global Batch; "evaluate a fine-tuned model for a day" → Developer; "all agent data must stay in our tenant" → standard agent setup with BYO Storage, Cosmos DB and AI Search; "block merges that lower groundedness" → the evaluation GitHub Action with a baseline agent id.`,
    },
  ],
  examples: [
    {
      title: 'Bicep for a Foundry resource, project and a Global Standard deployment',
      description:
        'A platform team wants every environment (dev, test, prod) to get an identical Foundry resource with a gpt-5-mini deployment and a project, created from a pipeline rather than by hand in the portal.',
      language: 'yaml',
      code: `// main.bicep (abridged)
resource account 'Microsoft.CognitiveServices/accounts@2025-04-01-preview' = {
  name: aiFoundryName
  location: location
  kind: 'AIServices'
  sku: { name: 'S0' }
  identity: { type: 'SystemAssigned' }
  properties: { allowProjectManagement: true, customSubDomainName: aiFoundryName,
                disableLocalAuth: true }
}
resource project 'Microsoft.CognitiveServices/accounts/projects@2025-04-01-preview' = {
  parent: account
  name: aiProjectName
  location: location
  identity: { type: 'SystemAssigned' }
  properties: {}
}
resource chat 'Microsoft.CognitiveServices/accounts/deployments@2025-04-01-preview' = {
  parent: account
  name: 'gpt-5-mini'
  sku: { name: 'GlobalStandard', capacity: 50 }   // 50K TPM
  properties: { model: { format: 'OpenAI', name: 'gpt-5-mini', version: '2025-08-07' } }
}`,
      takeaway: 'Deployments are Azure resources: declare the SKU (deployment type) and capacity in Bicep so every environment is identical and policy-governed.',
    },
    {
      title: 'Pipeline with azd and an evaluation gate',
      description:
        'The team deploys a hosted agent with azd from GitHub Actions and refuses to promote a new version unless it beats the current baseline on the evaluation dataset.',
      language: 'yaml',
      code: `# .github/workflows/azure-dev.yml (abridged)
on: { push: { branches: [main] } }
permissions: { id-token: write, contents: read }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: Azure/setup-azd@v2
      - run: azd auth login --client-id \${{ vars.AZURE_CLIENT_ID }} \\
               --federated-credential-provider github --tenant-id \${{ vars.AZURE_TENANT_ID }}
      - run: azd provision --no-prompt
      - run: azd deploy --no-prompt          # creates a new hosted agent version
      - name: Offline evaluation gate
        uses: microsoft/ai-agent-evals@v2
        with:
          azure-ai-project-endpoint: \${{ vars.AZURE_AI_PROJECT_ENDPOINT }}
          deployment-name: gpt-5-mini
          data-path: evals/support-eval.json
          agent-ids: support-agent:12,support-agent:13
          baseline-agent-id: support-agent:12`,
      takeaway: 'Use OIDC sign-in, azd provision/deploy for delivery, and the evaluation action with a baseline agent to turn quality into a merge gate.',
    },
    {
      title: 'The deployment-type mistake',
      description:
        'A European bank deploys gpt-4.1 as Global Standard because it was the only type offered on launch day, then fails an internal review because prompts may be processed outside the EU. The fix is to redeploy as Data Zone Standard (EU data zone) and, because traffic is steady during trading hours, to size a Data Zone Provisioned deployment with spillover to the Data Zone Standard deployment for peaks.',
      language: 'bash',
      code: `# Recreate the deployment in the EU data zone
az cognitiveservices account deployment create \\
  --name contoso-foundry --resource-group rg-ai \\
  --deployment-name gpt-41-eu \\
  --model-name gpt-4.1 --model-version 2025-04-14 --model-format OpenAI \\
  --sku-name DataZoneStandard --sku-capacity 100

# Provisioned for steady traffic; spilloverDeploymentName routes 429 overflow
# to the standard deployment (set via the control-plane REST API)
az rest --method put \\
  --url "https://management.azure.com/subscriptions/$SUB/resourceGroups/rg-ai/providers/Microsoft.CognitiveServices/accounts/contoso-foundry/deployments/gpt-41-eu-ptu?api-version=2024-10-01" \\
  --body '{"sku":{"name":"DataZoneProvisionedManaged","capacity":50},
           "properties":{"spilloverDeploymentName":"gpt-41-eu",
             "model":{"format":"OpenAI","name":"gpt-4.1","version":"2025-04-14"}}}'`,
      takeaway: 'Deployment type controls where inference happens; Data Zone types keep processing inside the EU, US or APAC, and Provisioned plus spillover handles steady traffic with bursts.',
    },
  ],
  keyPoints: [
    'A Foundry resource is the security and billing boundary; projects organise agents, files, connections and RBAC; both expose a single endpoint family.',
    'Basic agent setup uses Microsoft-managed storage; standard setup brings your own Storage, Cosmos DB (3,000 RU/s minimum) and AI Search so all agent data stays in your tenant, optionally with VNet injection and private endpoints.',
    'Global Standard is the default deployment type (newest models, highest quota, lowest price); Data Zone keeps processing in EU, US or APAC; regional Standard keeps it in a geography.',
    'Provisioned (PTU) types give reserved throughput and low latency variance; enable spillover to a Standard deployment to absorb bursts instead of returning 429.',
    'Batch types trade a 24-hour turnaround for roughly 50% lower cost; Developer is for evaluating fine-tuned models only and has no SLA.',
    'A model deployment defines name, model and version, SKU, capacity, guardrail and update policy; a prompt agent is an immutable versioned definition referenced as name:version.',
    'Reproduce environments with Bicep or Terraform for infrastructure and azd (azd ai agent init, azd up, azd pipeline config) for agent delivery.',
    'Gate releases with the Foundry evaluation GitHub Action or Azure DevOps task, comparing new agent versions against a baseline with statistical significance.',
  ],
  flashcards: [
    { front: 'Which deployment type should you start with for most workloads, and why?', back: 'Global Standard: it launches first for new models, has the broadest region coverage, the highest quota and the lowest price.' },
    { front: 'Which deployment types keep inference inside the EU, US or APAC boundary?', back: 'Data Zone Standard, Data Zone Provisioned and Data Zone Batch.' },
    { front: 'What is spillover?', back: 'A setting on a provisioned deployment that routes overflow requests (429s when PTUs are exhausted) to a matching pay-per-token Standard deployment in the same resource.' },
    { front: 'What is the Developer deployment type for?', back: 'Evaluating fine-tuned models only: pay-per-token, 24-hour lifetime, no SLA and no data-residency guarantee.' },
    { front: 'What resources does standard agent setup require you to bring?', back: 'Azure Storage (files), Azure Cosmos DB for NoSQL (conversations and agent state, at least 3,000 RU/s) and Azure AI Search (vector stores), plus Key Vault.' },
    { front: 'How do you reference a specific prompt agent version in code?', back: 'By <agent_name>:<version>; saving a change creates a new immutable version, and the stable endpoint serves the active version.' },
    { front: 'Which azd command generates a GitHub Actions or Azure Pipelines workflow for a hosted agent?', back: 'azd pipeline config; the generated pipeline runs azd provision then azd deploy.' },
    { front: 'How can a CI pipeline block a regression in agent quality?', back: 'Run the Foundry evaluation GitHub Action (or Azure DevOps task) with a data file of queries and evaluators, passing agent-ids and a baseline-agent-id to compare with statistical tests.' },
    { front: 'In what unit is quota for standard deployments allocated?', back: 'Tokens per minute (TPM) per subscription, per region, per model; RPM is derived from TPM by a model-specific ratio.' },
    { front: 'Which deployment option bills by VM core-hours rather than tokens?', back: 'Managed compute, used for open-weight and Hugging Face models (classic hub-based projects).' },
  ],
  quiz: [
    {
      question:
        'A healthcare provider in Germany must ensure that prompts and completions are processed only within the European Union. Traffic is bursty and unpredictable. Which deployment type should you choose?',
      options: ['Global Standard', 'Data Zone Standard', 'Global Batch', 'Developer'],
      correct: [1],
      explanation:
        'Data Zone Standard processes data within the EU data zone and bills per token, which suits bursty traffic. Global types may process anywhere, Batch is asynchronous, and Developer has no residency guarantee or SLA.',
    },
    {
      question:
        'A trading application needs predictable low-latency responses during market hours with occasional spikes above the purchased capacity. What should you configure? (Select two)',
      options: [
        'A provisioned (PTU) deployment of the model.',
        'Spillover to a Standard deployment of the same model and version.',
        'A Global Batch deployment.',
        'A Developer deployment for production traffic.',
      ],
      correct: [0, 1],
      explanation:
        'Provisioned throughput gives reserved capacity and low latency variance; spillover sends overflow to a pay-per-token deployment instead of failing with 429. Batch is for 24-hour asynchronous jobs and Developer deployments are unsuitable for production.',
    },
    {
      question:
        'A compliance team requires that agent conversation history, uploaded files and vector stores are stored only in storage the company owns. Which option satisfies this?',
      options: [
        'Basic agent setup with a private endpoint.',
        'Standard agent setup with bring-your-own Azure Storage, Cosmos DB and Azure AI Search.',
        'A Global Provisioned model deployment.',
        'Enabling diagnostic logging to a Log Analytics workspace.',
      ],
      correct: [1],
      explanation:
        'Standard setup stores agent state, files and vector stores in customer-owned resources. Basic setup uses Microsoft-managed storage regardless of networking; deployment type and diagnostics do not change where agent data is stored.',
    },
    {
      question:
        'You want pull requests that change an agent\'s instructions to fail automatically when groundedness drops compared with the production version. What is the MOST appropriate approach?',
      options: [
        'Add the Foundry evaluation GitHub Action with agent-ids for the new and current versions and a baseline-agent-id.',
        'Enable Azure Monitor alerts on token usage.',
        'Run azd deploy and check the portal manually after each merge.',
        'Increase the content filter blocking level to High.',
      ],
      correct: [0],
      explanation:
        'The evaluation action runs offline evaluations and statistical comparison against a baseline agent version inside CI. Monitor alerts and content filters do not measure groundedness, and manual checks are not a gate.',
    },
    {
      question: 'Which statement about model deployments in Foundry is correct?',
      options: [
        'Quota is assigned per deployment name globally across all regions.',
        'A deployment is an Azure resource that defines model, version, SKU, capacity and a guardrail assignment, and can be created with Bicep.',
        'Changing a deployment\'s model version always requires deleting the Foundry project.',
        'Deployments cannot be created with the Azure CLI.',
      ],
      correct: [1],
      explanation:
        'Deployments are Microsoft.CognitiveServices/accounts/deployments resources configurable in Bicep, CLI, REST and the portal. Quota is per subscription, region and model, and version changes are an in-place update of the deployment.',
    },
  ],
  statements: [
    { text: 'Data stored at rest for a Global Standard deployment can be moved to any Azure region.', isTrue: false, explanation: 'Data at rest stays in the resource geography; only inference processing may occur in any region for Global types.' },
    { text: 'Batch deployment types offer roughly a 50% discount with a 24-hour target turnaround.', isTrue: true, explanation: 'Global Batch and Data Zone Batch trade latency for cost on large asynchronous jobs.' },
    { text: 'Each save of a prompt agent creates a new immutable version.', isTrue: true, explanation: 'Versions are immutable; clients can pin name:version or use the active version on the stable endpoint.' },
    { text: 'azd pipeline config writes a workflow that runs azd provision and azd deploy on push to main.', isTrue: true, explanation: 'It also creates the service principal and repository variables for OIDC sign-in.' },
    { text: 'Standard agent setup can run with a Cosmos DB account limited to 400 RU/s.', isTrue: false, explanation: 'The setup requires at least 3,000 RU/s total because it provisions multiple containers.' },
    { text: 'Managed compute deployments are billed per token like serverless deployments.', isTrue: false, explanation: 'Managed compute bills for the virtual machine core-hours used by the deployment.' },
    { text: 'Hub-based projects and standalone Azure OpenAI resources are the recommended targets for new Foundry development.', isTrue: false, explanation: 'They are the classic generation; new investment goes to Foundry projects, and Azure OpenAI resources can be upgraded to Foundry.' },
  ],
  resources: [
    { label: 'Deployment types for Microsoft Foundry Models', url: 'https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types' },
    { label: 'Set up standard agent resources', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/standard-agent-setup' },
    { label: 'Deploy a Foundry resource by using a Bicep file', url: 'https://learn.microsoft.com/en-us/azure/foundry/how-to/create-resource-template' },
    { label: 'Run evaluations in GitHub Actions', url: 'https://learn.microsoft.com/en-us/azure/foundry/how-to/evaluation-github-action' },
  ],
};

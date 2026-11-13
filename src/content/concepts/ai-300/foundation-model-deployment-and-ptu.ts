import type { Concept } from '../../types';

export const foundationModelDeploymentAndPtu: Concept = {
  id: 'foundation-model-deployment-and-ptu',
  title: 'Deploying Foundation Models: Deployment Types, Model Selection, Versioning and Provisioned Throughput',
  summary:
    'How foundation models reach production in Microsoft Foundry: standard (serverless) deployments versus serverless API endpoints and managed compute, picking a model with benchmarks and evaluation, handling model versions and retirements with upgrade policies, and sizing provisioned throughput units with spillover for high-volume workloads.',
  certs: ['ai-300', 'ai-103'],
  domains: ['ai-300-3', 'ai-103-1'],
  outcomes: ['ai-300-3-2-1', 'ai-300-3-2-2', 'ai-300-3-2-3', 'ai-300-3-2-4', 'ai-103-1-2-2'],
  tags: ['foundry-models', 'deployment-types', 'global-standard', 'ptu', 'provisioned-throughput', 'spillover', 'model-versions', 'managed-compute'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Three ways to deploy a model',
      body: `The **Foundry model catalog** lists thousands of models from Microsoft, OpenAI, Anthropic, Meta, Mistral, Hugging Face and others. How a model is served depends on the deployment option:

| Option | Where | Billing | Typical models | Notes |
|---|---|---|---|---|
| **Standard deployment in a Foundry resource** (serverless, API-based) | The Foundry resource | Per token, or **PTU** | Flagship "Foundry Models sold by Azure" and partner models | Preferred; global, data-zone or regional processing; content filtering; keyless auth |
| **Serverless API endpoint** | A hub-based project | Per token | Partner and community models (pay-as-you-go) | Regional only; dedicated endpoint per model; classic |
| **Managed compute** | A hub-based project on dedicated VMs | Per compute hour | Open-source, Hugging Face, NVIDIA NIM, custom and fine-tuned models | You need **GPU quota**; no built-in content filtering; full control over the container |

Rule: use a standard deployment whenever the model offers it; use managed compute when you need a model that is only available as weights, a custom container, or a fine-tuned open model; use serverless API endpoints for pay-per-token partner models that are still on hub projects.

\`\`\`bash
# standard deployment on a Foundry resource
az cognitiveservices account deployment create -g rg-ai-prod -n fdry-prod \\
  --deployment-name gpt-4.1 --model-format OpenAI --model-name gpt-4.1 --model-version 2025-04-14 \\
  --sku-name GlobalStandard --sku-capacity 50     # capacity = thousands of tokens per minute
\`\`\`

For managed compute, you pick an \`instance_type\` and \`instance_count\` just like an Azure ML managed online endpoint, and quota for that VM family must exist in the subscription.`,
    },
    {
      heading: 'Deployment types: where data is processed and how you pay',
      body: `Standard deployments come in **deployment types** that fix two things: the geography where prompts are processed and the billing model.

| Deployment type (SKU) | Processing | Billing | Use |
|---|---|---|---|
| **Global Standard** (\`GlobalStandard\`) | Any Azure region | Pay per token | Default; newest models first, highest quota, lowest price |
| **Data Zone Standard** (\`DataZoneStandard\`) | Within US, EU or APAC data zone | Pay per token | Data-zone residency |
| **Standard** (\`Standard\`) | Within the resource's Azure geography | Pay per token | Strict geography, low volume |
| **Global / Data Zone / Regional Provisioned** (\`GlobalProvisionedManaged\`, \`DataZoneProvisionedManaged\`, \`ProvisionedManaged\`) | As above | Per PTU per hour or reservation | Predictable, latency-sensitive, high volume |
| **Global Batch / Data Zone Batch** | As above | About 50 percent discount, 24-hour target | Large asynchronous jobs via file upload |
| **Developer** (\`DeveloperTier\`) | Any region | Pay per token | Evaluating a **fine-tuned** model; 24-hour lifetime, no SLA |

Decision heuristics the exam uses: start with Global Standard; move to Data Zone or regional only for residency; move to Provisioned when traffic is steady and latency variance matters; move bulk, non-interactive work to Batch; use Developer only to test a fine-tuned model before paying for a real deployment. Data at rest always stays in the resource's geography regardless of type. Standard types are best effort; provisioned types carry a latency SLA. Standard quota is expressed as **tokens per minute (TPM)** per model per region, with requests per minute derived from it.`,
    },
    {
      heading: 'Selecting the right model for the use case',
      body: `Model selection is an engineering decision with three inputs: **task fit**, **operational constraints** and **evidence**.

- **Task fit**: reasoning-heavy, multi-step agent work favours frontier or reasoning models; classification, extraction and routing favour small models (mini, nano, Phi) that are cheaper and faster; vision, audio and realtime need multimodal variants; embeddings use dedicated embedding models.
- **Constraints**: context window needed, required region or data zone, availability as PTU, content filtering support, tool-calling and structured-output support, cost per million tokens and latency targets.
- **Evidence**: the **Foundry model benchmarks** compare quality, safety, cost and throughput on public datasets, and the **model leaderboard** ranks by scenario. Then run **your own evaluation**: the same test dataset and evaluators (groundedness, relevance, task adherence) against several candidate deployments, which is the "base model selection" stage of the observability lifecycle.

A common production pattern is a **tiered architecture**: a small model handles the easy majority and escalates hard cases to a large model, or a **model router** deployment picks per request. Evaluate the router or the tiering with the same dataset, not by intuition. Watch for the trap in questions: "most accurate on benchmarks" is not the answer when the scenario emphasises cost, latency or a data-zone requirement that the top model cannot meet.`,
    },
    {
      heading: 'Model versioning, retirement and production rollout',
      body: `Two version numbers matter: the **model version** (for example \`gpt-4.1\` version \`2025-04-14\`) and the **API version** your code targets. Each deployment pins a model version and carries an **upgrade policy**:

- **Upgrade once a new default version becomes available** (auto-upgrade).
- **Upgrade once the current version expires** (auto-upgrade only at retirement).
- **No auto-upgrade**: you upgrade manually; when the version is **retired** the deployment stops working.

Microsoft announces new default versions at least two weeks in advance, keeps the previous major version until its retirement date, and publishes a **model retirement schedule** (lifecycle stages GA, deprecated, legacy, retired) with recommended replacements. Notifications arrive by email to subscription owners and in Azure Service Health.

GenAIOps versioning strategy mirrors ML deployments:

1. Deploy the new model version as a **separate deployment** (\`gpt-4.1-2025-xx-candidate\`) rather than mutating the production one.
2. Run the **evaluation suite** against it and compare with the current deployment's scores.
3. Route a **canary** share of traffic from the application layer (feature flag or Azure API Management policy), watch quality, latency and cost.
4. Promote by changing the deployment name the app targets, keep the old deployment for **rollback**, then delete it.

Pin **production deployments to explicit versions with no auto-upgrade** so a behaviour change never arrives unannounced, and let **dev deployments auto-upgrade** so you see changes early. Track model version, prompt version and evaluation results together in Git and in the evaluation run metadata so you always know which combination is live.`,
    },
    {
      heading: 'Provisioned throughput units and spillover',
      body: `**Provisioned throughput** reserves model processing capacity for your deployment, measured in **provisioned throughput units (PTUs)**. Unlike standard deployments, the capacity is yours whether or not requests arrive, which buys predictable throughput and lower latency variance.

Key facts:

- PTU **quota** is per subscription, per region and per deployment type (Global, Data Zone, Regional Provisioned are separate pools). Quota is a policy limit and costs nothing; **capacity** is what is actually available in the region and can be exhausted even when you have quota. Check with the capacity calculator or the model capacities API before purchasing.
- PTUs are **model-independent**; the tokens per minute one PTU delivers depends on the model, and each model has a **minimum PTU count**.
- **Sizing**: estimate requests per minute, average input and output tokens, the model's output-to-input weighting and the **prompt cache hit rate** (cached input tokens do not consume PTU for pre-GPT-6 models), then divide normalised TPM by the model's TPM-per-PTU.
- **Billing**: hourly per PTU, or **Azure Reservations** (one month or one year) for a discount. Reservations are a billing discount, not a capacity guarantee: create the deployment first, then buy the reservation.
- **Spillover**: when the PTU deployment returns 429 (or 500/503), overflow requests are routed to a **standard deployment of the same model and version in the same resource**. Enable for all traffic with the \`spilloverDeploymentName\` property, or per request with the \`x-ms-spillover-deployment\` header; response headers \`x-ms-spillover-from-deployment\` and \`x-ms-deployment-name\` show what happened.

\`\`\`bash
az cognitiveservices account deployment create -g rg-ai-prod -n fdry-prod \\
  --deployment-name gpt-4.1-ptu --model-format OpenAI --model-name gpt-4.1 --model-version 2025-04-14 \\
  --sku-name GlobalProvisionedManaged --sku-capacity 100
# spilloverDeploymentName is set on the deployment properties (REST/Bicep/portal) and must name a standard deployment
\`\`\`

Monitor **Provisioned-managed Utilization V2** in Azure Monitor; sustained utilisation near 100 percent means scale PTUs or widen spillover; low utilisation means you are paying for idle capacity. Do not plan to scale PTUs up and down with daily traffic: capacity may not be there when you scale back up.`,
    },
  ],
  examples: [
    {
      title: 'Choosing deployment types across environments',
      description:
        'A retailer runs a customer assistant. Dev uses Global Standard with auto-upgrade to see new versions early. Prod in the EU uses Data Zone Provisioned for the steady daytime load with spillover to a Data Zone Standard deployment of the same model for Black Friday bursts. Nightly catalogue enrichment of 5 million products uses Data Zone Batch at half price.',
      language: 'text',
      code: `resource ptu 'Microsoft.CognitiveServices/accounts/deployments@2025-06-01' = {
  parent: account
  name: 'assistant-ptu'
  sku: { name: 'DataZoneProvisionedManaged', capacity: 150 }
  properties: {
    model: { format: 'OpenAI', name: 'gpt-4.1', version: '2025-04-14' }
    versionUpgradeOption: 'NoAutoUpgrade'
    spilloverDeploymentName: 'assistant-std'
  }
}
resource std 'Microsoft.CognitiveServices/accounts/deployments@2025-06-01' = {
  parent: account
  name: 'assistant-std'
  sku: { name: 'DataZoneStandard', capacity: 200 }
  properties: { model: { format: 'OpenAI', name: 'gpt-4.1', version: '2025-04-14' }, versionUpgradeOption: 'NoAutoUpgrade' }
}`,
      takeaway: 'Match deployment type to traffic shape and residency; PTU plus same-version standard spillover absorbs bursts without 429s.',
    },
    {
      title: 'Pinning versions and rolling to a new model',
      description:
        'The prod deployment is pinned to gpt-4.1 2025-04-14 with no auto-upgrade. When a newer version appears, the team creates assistant-candidate, runs the evaluation suite from CI against both deployments, and flips an app setting to route 10 percent, then 100 percent, keeping the old deployment for a week.',
      language: 'python',
      code: `import os
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

project = AIProjectClient(endpoint=os.environ["AZURE_AI_PROJECT_ENDPOINT"], credential=DefaultAzureCredential())
client = project.get_openai_client()
deployment = os.environ.get("ASSISTANT_DEPLOYMENT", "assistant-ptu")   # flipped by config, not code
resp = client.responses.create(model=deployment, input="Summarise the return policy in one sentence.")
print(resp.output_text)`,
      takeaway: 'Treat the deployment name as configuration so promotion and rollback are a setting change backed by evaluation evidence.',
    },
    {
      title: 'PTU deployment fails despite quota (a realistic mistake and the fix)',
      description:
        'A team was granted 300 PTUs of Regional Provisioned quota in West Europe, bought a one-year reservation, then found deployment creation failing for lack of capacity. Quota is a limit, capacity is physical availability, and reservations do not reserve capacity. The fix: check capacity with the calculator or capacities API, create the deployment first (possibly Global Provisioned or a different region), and only then purchase the reservation; meanwhile serve traffic from a standard deployment.',
      language: 'bash',
      code: `# check deployable capacity before committing
az rest --method get --url "https://management.azure.com/subscriptions/<sub>/providers/Microsoft.CognitiveServices/modelCapacities?api-version=2024-10-01&modelFormat=OpenAI&modelName=gpt-4.1&modelVersion=2025-04-14" \\
  --query "value[?location=='westeurope']"
# then create the deployment, confirm it succeeds, then buy the reservation`,
      takeaway: 'Deploy first, reserve second: PTU quota and reservations never guarantee that regional capacity exists.',
    },
  ],
  keyPoints: [
    'Standard deployments on a Foundry resource are the preferred option (token or PTU billing, global/data-zone/regional processing, content filtering); serverless API endpoints and managed compute live on hub-based projects.',
    'Managed compute is for open-source, custom or fine-tuned open models and requires GPU quota; you pay per compute hour and get no built-in content filter.',
    'Deployment types: Global Standard (default), Data Zone Standard, Standard (regional), Provisioned variants (PTU), Batch (about 50 percent off, 24-hour target), Developer (fine-tuned evaluation only, 24-hour lifetime, no SLA).',
    'Select models by task fit, constraints (region, context, PTU availability, cost, latency) and evidence from benchmarks plus your own evaluation dataset.',
    'Each deployment pins a model version and an upgrade policy; production should pin explicit versions with no auto-upgrade and promote via a separate candidate deployment and evaluation.',
    'Retired model versions stop working on deployments without auto-upgrade; watch the retirement schedule and Service Health notices.',
    'PTU quota (per subscription, region and deployment type) is a limit; capacity is physical availability; reservations discount billing but do not reserve capacity.',
    'Spillover routes 429/500/503 overflow from a PTU deployment to a same-model standard deployment via spilloverDeploymentName or the x-ms-spillover-deployment header.',
  ],
  flashcards: [
    { front: 'Which deployment option should you choose first for a model that supports it?', back: 'A standard deployment in a Foundry resource; it offers the most capabilities (regional, data zone, global; standard and PTU; content filtering; keyless auth).' },
    { front: 'When is managed compute required?', back: 'For models only available as weights or containers: Hugging Face, NVIDIA NIM, custom and fine-tuned open models; it needs GPU quota and bills per compute hour.' },
    { front: 'What does a Global Standard deployment guarantee about data processing location?', back: 'Nothing beyond Azure; prompts may be processed in any region. Data at rest stays in the resource geography.' },
    { front: 'What is the Developer deployment type for?', back: 'Evaluating a fine-tuned model cheaply: 24-hour lifetime, no SLA, no data residency guarantee.' },
    { front: 'What discount and turnaround does Global Batch offer?', back: 'About 50 percent lower price than Global Standard with a 24-hour target turnaround for asynchronous file-based jobs.' },
    { front: 'Name the three model version upgrade policies.', back: 'Upgrade once a new default version is available; upgrade once the current version expires; no auto-upgrade.' },
    { front: 'What happens to a no-auto-upgrade deployment when its model version is retired?', back: 'It stops accepting requests and returns errors until you move it to a supported version.' },
    { front: 'What is the difference between PTU quota and capacity?', back: 'Quota is the policy maximum you may deploy per subscription, region and deployment type; capacity is the physical availability at deployment time and can be exhausted.' },
    { front: 'Do Azure Reservations for PTUs guarantee capacity?', back: 'No. They discount the hourly PTU meter; create the deployment first, then buy the reservation.' },
    { front: 'How does spillover work?', back: 'When a provisioned deployment returns 429/500/503, requests are redirected to a standard deployment of the same model and version in the same resource, enabled via spilloverDeploymentName or the x-ms-spillover-deployment header.' },
    { front: 'How is standard deployment quota expressed?', back: 'Tokens per minute (TPM) per model per region, with requests per minute derived from it.' },
  ],
  quiz: [
    {
      question:
        'A European insurer needs a chat assistant whose prompts must be processed within the EU, with steady weekday traffic and strict latency targets. Which deployment type should you choose?',
      options: [
        'Global Standard',
        'Data Zone Provisioned',
        'Global Batch',
        'Developer',
      ],
      correct: [1],
      explanation:
        'Data Zone Provisioned keeps processing in the EU data zone and reserves capacity for consistent latency. Global Standard may process anywhere, Batch is asynchronous, and Developer is for fine-tuned model evaluation only.',
    },
    {
      question:
        'A team wants to deploy a Hugging Face model that is only distributed as weights, with a custom inference container. Which option is required?',
      options: [
        'Standard deployment in a Foundry resource',
        'Serverless API endpoint',
        'Managed compute deployment',
        'Global Batch deployment',
      ],
      correct: [2],
      explanation:
        'Managed compute hosts open and custom models on dedicated VMs with your container. The other options serve catalog models through Azure-managed inference and do not accept custom containers.',
    },
    {
      question:
        'Your production deployment is pinned to a model version with no auto-upgrade. Microsoft announces that the version will be retired in 60 days. Which TWO actions form the correct GenAIOps response? (Select two)',
      options: [
        'Create a separate candidate deployment on the replacement version and run the evaluation suite against it',
        'Switch the production deployment to auto-upgrade immediately so it changes on the retirement date without testing',
        'Promote the candidate by changing the deployment name the application targets, keeping the old deployment for rollback until retirement',
        'Ignore the notice because retired versions continue to work for pinned deployments',
      ],
      correct: [0, 2],
      explanation:
        'Evaluate the new version in isolation, then promote with rollback available. Blind auto-upgrade skips evaluation, and retired versions stop working on no-auto-upgrade deployments.',
    },
    {
      question:
        'A PTU deployment returns HTTP 429 during marketing campaigns. The business wants no failed requests while keeping PTU cost flat. What should you configure?',
      options: [
        'Double the PTU capacity permanently',
        'Enable spillover to a standard deployment of the same model and version in the same resource',
        'Switch the deployment to Global Batch',
        'Set versionUpgradeOption to auto-upgrade',
      ],
      correct: [1],
      explanation:
        'Spillover routes overflow to pay-per-token capacity only when needed. Doubling PTUs raises fixed cost, Batch is asynchronous, and upgrade policy is unrelated to throughput.',
    },
    {
      question:
        'You have 200 PTUs of Regional Provisioned quota in a region, but deployment creation fails with insufficient capacity. What is the correct understanding?',
      options: [
        'Quota guarantees capacity; the error must be an RBAC problem',
        'Quota is a policy limit, while capacity is physical availability that can be exhausted; check capacity and consider another region or deployment type',
        'Buying an Azure Reservation will reserve the capacity',
        'Standard deployments consume PTU quota, so delete them first',
      ],
      correct: [1],
      explanation:
        'Quota and capacity are distinct. Reservations only discount billing, and standard deployments use TPM quota, not PTU quota.',
    },
  ],
  statements: [
    { text: 'Global Standard deployments offer the highest default quota and receive new models first.', isTrue: true, explanation: 'Global routing provides the broadest availability and earliest access.' },
    { text: 'Serverless API endpoints support global and data-zone processing options.', isTrue: false, explanation: 'Serverless API endpoints (hub projects) are regional only.' },
    { text: 'Provisioned throughput units are tied to a specific model when purchased.', isTrue: false, explanation: 'PTU quota is model-independent; the same quota can deploy any supported model, though TPM per PTU varies by model.' },
    { text: 'A Developer deployment has a 24-hour lifetime and no SLA.', isTrue: true, explanation: 'It exists to evaluate fine-tuned models cheaply.' },
    { text: 'Cached input tokens on pre-GPT-6 models do not consume PTU capacity.', isTrue: true, explanation: 'Prompt cache hits reduce PTU requirements for those models.' },
    { text: 'Deployments set to no auto-upgrade keep working after the model version is retired.', isTrue: false, explanation: 'They stop accepting requests at retirement; only auto-upgrade policies move them to a supported version.' },
  ],
  resources: [
    { label: 'Deployment types for Microsoft Foundry Models', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/foundry-models/concepts/deployment-types' },
    { label: 'Deployment overview for Microsoft Foundry Models (classic)', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/deployments-overview' },
    { label: 'What is provisioned throughput for Foundry Models?', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/provisioned-throughput' },
    { label: 'Model versions in Microsoft Foundry Models', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/model-versions' },
  ],
};

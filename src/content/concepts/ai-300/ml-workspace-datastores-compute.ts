import type { Concept } from '../../types';

export const mlWorkspaceDatastoresCompute: Concept = {
  id: 'ml-workspace-datastores-compute',
  title: 'Azure Machine Learning Workspaces, Datastores, Compute and Access',
  summary:
    'The workspace is the top-level MLOps resource: what it provisions, how datastores link storage without copying data, which compute target fits each job, and how Azure RBAC and managed identities control who and what can act inside it.',
  certs: ['ai-300'],
  domains: ['ai-300-1'],
  outcomes: ['ai-300-1-1-1', 'ai-300-1-1-2', 'ai-300-1-1-3', 'ai-300-1-1-4'],
  tags: ['azure-ml', 'workspace', 'datastore', 'compute', 'rbac', 'managed-identity', 'cli-v2'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'What a workspace is and what it drags along',
      body: `An Azure Machine Learning **workspace** (\`Microsoft.MachineLearningServices/workspaces\`) is the boundary inside which jobs, models, endpoints, data assets and environments live. Creating one also wires up four associated Azure resources: a **storage account** (default datastores, job outputs, notebooks file share), a **Key Vault** (datastore credentials and secrets), **Application Insights** (endpoint telemetry) and, created lazily on first image build, an **Azure Container Registry**. You can bring existing instances of any of these, which is common in enterprises that already have a governed storage account or key vault.

The workspace has a **managed identity** (system-assigned by default, or user-assigned) that it uses to talk to those resources. Workspaces created after 19 November 2024 give that identity the narrower **Azure AI Administrator** role on the resource group instead of Contributor.

With CLI v2 the minimum is a one-liner, and everything else is a YAML file:

\`\`\`bash
az extension add -n ml
az ml workspace create --name mlw-prod --resource-group rg-ml --location westeurope
az configure --defaults workspace=mlw-prod group=rg-ml
\`\`\`

Workspace *kinds* matter for the exam: a **default** workspace for MLOps, a **feature store** workspace for managed features, and **hub** and **project** kinds that back Foundry hub-based (classic) projects. Treat the workspace as the unit you replicate per environment (dev, test, prod); cross-workspace sharing is the job of registries, covered in the assets concept.`,
    },
    {
      heading: 'Datastores: pointers, not copies',
      body: `A **datastore** is a saved reference to an existing storage service plus the way to authenticate to it. It never creates storage and never copies data. Supported types are **Azure Blob**, **Azure Data Lake Storage Gen2**, **Azure Files** and **OneLake**. Every workspace starts with \`workspaceblobstore\` (the default datastore for outputs) and \`workspacefilestore\`.

Authentication is the decision the exam probes:

- **Credential-based**: an account key or SAS token stored in the workspace Key Vault. Anyone with Reader on the workspace can list the datastore, so this is convenient but coarse.
- **Identity-based**: no secret is stored. Interactive users authenticate as themselves and jobs authenticate with the **compute's managed identity**, which must hold **Storage Blob Data Reader** (or Contributor for writes) on the storage account. This is the least-privilege pattern and the one to pick when a question mentions "no secrets" or "per-user access".

\`\`\`yaml
# blob-datastore.yml  (identity-based: no credentials block)
$schema: https://azuremlschemas.azureedge.net/latest/azureBlob.schema.json
name: curated_blob
type: azure_blob
account_name: stcurated001
container_name: features
\`\`\`

\`az ml datastore create -f blob-datastore.yml\` registers it. Jobs then reference data as \`azureml://datastores/curated_blob/paths/2026/\`, which is also the path you use when you later promote a folder into a versioned data asset.`,
    },
    {
      heading: 'Choosing a compute target',
      body: `A **compute target** is where code runs. The exam expects you to match the workload to the target, and to recognise the cost lever of each.

| Target | Typical use | Key properties |
|---|---|---|
| **Compute instance** | A single data scientist's notebook and VS Code workstation | One owner, full Python/Git tooling, supports **idle shutdown** and start/stop schedules |
| **Compute cluster** | Training jobs, sweeps, pipelines, batch endpoints | Autoscales between \`min_instances\` (0 to avoid idle cost) and \`max_instances\`; \`tier: low_priority\` for cheap, pre-emptible capacity |
| **Serverless compute** | Jobs with no cluster to manage | Specify \`instance_type\` per job; Azure provisions and tears down |
| **Kubernetes (AKS or Arc-enabled)** | Reuse an existing cluster, on-premises or hybrid | Attach once, then target by name for training or inference |
| **Managed online endpoints / batch endpoints** | Inference | Fully managed; covered in the deployment concept |

\`\`\`yaml
# gpu-cluster.yml
$schema: https://azuremlschemas.azureedge.net/latest/amlCompute.schema.json
name: gpu-cluster
type: amlcompute
size: Standard_NC6s_v3
min_instances: 0
max_instances: 4
idle_time_before_scale_down: 180
tier: low_priority
\`\`\`

Rules of thumb that appear as scenario answers: set \`min_instances: 0\` to stop paying for idle clusters; enable idle shutdown on compute instances; use low-priority tiers for fault-tolerant experiments but not for latency-sensitive inference; attach Kubernetes when a platform team already runs a cluster the ML team must use.`,
    },
    {
      heading: 'Identity and access: people and compute',
      body: `Access is Azure RBAC on the workspace scope. The built-in roles you must be able to tell apart:

- **Owner** – everything, including role assignments.
- **Contributor** – create and manage all assets and compute; cannot assign roles.
- **Reader** – list and view assets (including datastore credentials), nothing else.
- **AzureML Data Scientist** – do everything inside the workspace *except* create or delete compute and modify the workspace itself.
- **AzureML Compute Operator** – create, manage and delete compute only.
- **AzureML Registry User** – read/write assets in a registry without creating or deleting registries.

Combine them: a self-service data scientist gets *Data Scientist + Compute Operator*; a reviewer gets *Reader*. Custom roles use actions such as \`Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*\`.

Non-human access runs on **managed identities**: the workspace identity reaches Key Vault, storage and ACR; a **compute cluster's** system- or user-assigned identity reads identity-based datastores (Storage Blob Data Reader) and pulls images; an **online endpoint's** identity can call downstream Azure services during scoring. Assigning a role to a managed identity requires the Managed Identity Operator role or Owner. Whenever an exam scenario says "without storing secrets" or "rotate nothing", the answer is a managed identity with an RBAC role, not a key in Key Vault.`,
    },
  ],
  examples: [
    {
      title: 'Identity-based datastore for a regulated dataset',
      description:
        'A bank registers an ADLS Gen2 container holding transaction history. Compliance forbids shared account keys. The MLOps engineer creates the datastore without credentials, grants the training cluster\'s managed identity Storage Blob Data Reader on the storage account, and grants individual data scientists the same role so notebooks can read interactively. Nothing is stored in Key Vault.',
      language: 'bash',
      code: `az ml datastore create -f adls-datastore.yml
# adls-datastore.yml: type: azure_data_lake_gen2, account_name, filesystem (no credentials)

PRINCIPAL=$(az ml compute show -n cpu-cluster --query identity.principal_id -o tsv)
az role assignment create \\
  --assignee-object-id "$PRINCIPAL" --assignee-principal-type ServicePrincipal \\
  --role "Storage Blob Data Reader" \\
  --scope /subscriptions/<sub>/resourceGroups/rg-data/providers/Microsoft.Storage/storageAccounts/stcurated001`,
      takeaway: 'Identity-based datastores shift authorisation to Azure RBAC on the storage account; the compute identity, not a secret, does the work.',
    },
    {
      title: 'Self-service compute without handing out Contributor',
      description:
        'A team lead wants data scientists to create their own compute clusters but not to change networking or delete the workspace. Contributor would allow too much. Assigning both AzureML Data Scientist and AzureML Compute Operator at workspace scope gives exactly experiment-plus-compute rights.',
      language: 'bash',
      code: `WS=$(az ml workspace show -n mlw-dev -g rg-ml --query id -o tsv)
for ROLE in "AzureML Data Scientist" "AzureML Compute Operator"; do
  az role assignment create --assignee user@contoso.com --role "$ROLE" --scope "$WS"
done`,
      takeaway: 'Combine the two AzureML built-in roles for self-service experimentation; reserve Contributor and Owner for platform engineers.',
    },
    {
      title: 'The idle cluster bill (a realistic mistake and the fix)',
      description:
        'A compute cluster was created from the studio with min_instances set to 2 "so jobs start fast". Nobody ran jobs over the holidays and two NC-series nodes billed for three weeks. The fix is to set min_instances to 0 and accept the few minutes of scale-up latency, or to use serverless compute for sporadic jobs. For notebooks, enable idle shutdown on compute instances.',
      language: 'bash',
      code: `az ml compute update --name gpu-cluster --min-instances 0 --idle-time-before-scale-down 120
# compute instances: schedule/idle shutdown
az ml compute create -f ci.yml
# ci.yml -> type: computeinstance, size: Standard_DS11_v2, idle_time_before_shutdown_minutes: 30`,
      takeaway: 'Idle capacity is the most common MLOps cost leak; min_instances 0 and idle shutdown are the standard answers.',
    },
  ],
  keyPoints: [
    'A workspace provisions or links a storage account, Key Vault, Application Insights and (lazily) a container registry, and talks to them with its managed identity.',
    'Datastores are references to Blob, ADLS Gen2, Azure Files or OneLake; they never copy data and can be credential-based or identity-based.',
    'Identity-based access means the user or the compute managed identity needs Storage Blob Data Reader or Contributor on the storage account.',
    'Compute instance = one person\'s workstation; compute cluster = autoscaling job runner; serverless = no cluster to manage; Kubernetes = bring your own cluster.',
    'min_instances: 0, idle_time_before_scale_down and low-priority tiers control training cost; idle shutdown controls compute instance cost.',
    'AzureML Data Scientist cannot create compute; AzureML Compute Operator only manages compute; combine them for self-service.',
    'Reader can see datastore credentials, so credential-based datastores are only as private as the workspace membership.',
    'Use `az configure --defaults workspace= group=` so CLI v2 commands and YAML files stay portable across environments.',
  ],
  flashcards: [
    { front: 'Which four Azure resources are associated with an Azure ML workspace?', back: 'Storage account, Key Vault, Application Insights and Azure Container Registry (the registry is created on first use).' },
    { front: 'What role does a workspace\'s system-assigned identity receive if the workspace was created after 19 Nov 2024?', back: 'Azure AI Administrator on the resource group (older workspaces got Contributor).' },
    { front: 'Does creating a datastore create storage?', back: 'No. A datastore links an existing Blob, ADLS Gen2, Azure Files or OneLake location and stores how to authenticate.' },
    { front: 'What RBAC role does a compute cluster\'s managed identity need to read an identity-based blob datastore?', back: 'Storage Blob Data Reader on the storage account (Contributor if it must write).' },
    { front: 'Which compute target is designed for a single user\'s notebooks and VS Code sessions?', back: 'A compute instance.' },
    { front: 'How do you stop a compute cluster billing when no jobs are running?', back: 'Set min_instances to 0 (and tune idle_time_before_scale_down).' },
    { front: 'What can the AzureML Data Scientist role NOT do?', back: 'Create or delete compute resources, or modify the workspace itself.' },
    { front: 'Which built-in role grants only compute management inside a workspace?', back: 'AzureML Compute Operator.' },
    { front: 'Name the two default datastores in every workspace.', back: 'workspaceblobstore and workspacefilestore.' },
    { front: 'What is the low-priority tier on a compute cluster for?', back: 'Cheaper, pre-emptible VMs suited to fault-tolerant training and experiments, not latency-sensitive work.' },
  ],
  quiz: [
    {
      question:
        'Your security team prohibits storing storage account keys anywhere in the ML platform. Data scientists must read training data interactively, and scheduled training jobs on a compute cluster must read the same container. What should you do?',
      options: [
        'Create a SAS-based datastore with a 90-day token and rotate it with Azure Automation.',
        'Create an identity-based datastore and assign Storage Blob Data Reader to the data scientists and to the compute cluster\'s managed identity.',
        'Grant the data scientists Contributor on the workspace so they can read any datastore.',
        'Upload the data into the default workspaceblobstore so no additional credentials are needed.',
      ],
      correct: [1],
      explanation:
        'Identity-based datastores store no secret; access is granted with Azure RBAC on the storage account to both humans and the compute identity. SAS tokens are still stored secrets, workspace Contributor does not grant data-plane access to storage, and copying into the default store still uses stored credentials.',
    },
    {
      question:
        'A data scientist needs to submit training jobs, register models and create pipelines, and also create their own compute clusters, but must not be able to change the workspace network settings. Which role assignment meets the requirement with least privilege?',
      options: [
        'Contributor on the workspace',
        'AzureML Data Scientist and AzureML Compute Operator on the workspace',
        'Owner on the resource group',
        'AzureML Data Scientist on the workspace and Reader on the resource group',
      ],
      correct: [1],
      explanation:
        'Data Scientist covers all in-workspace actions except compute and workspace changes; Compute Operator adds compute management. Contributor and Owner also allow modifying the workspace. Data Scientist alone cannot create compute.',
    },
    {
      question: 'Which TWO settings reduce the cost of a compute cluster that runs nightly training jobs? (Select two)',
      options: [
        'Set min_instances to 0',
        'Increase max_instances to 10',
        'Use tier: low_priority',
        'Switch the cluster to a compute instance',
      ],
      correct: [0, 2],
      explanation:
        'Scaling to zero removes idle cost and low-priority VMs are discounted. Raising max_instances increases potential spend, and a compute instance is a single-user workstation, not a job runner.',
    },
    {
      question:
        'A platform team already operates an AKS cluster with GPU node pools and wants the ML team to train on it instead of creating new clusters. What should the MLOps engineer do?',
      options: [
        'Create an Azure ML compute cluster with the same VM size',
        'Attach the AKS cluster to the workspace as a Kubernetes compute target',
        'Register the AKS cluster as a datastore',
        'Use serverless compute and point it at the AKS subscription',
      ],
      correct: [1],
      explanation:
        'Azure ML supports attaching AKS or Arc-enabled Kubernetes as a compute target for training and inference. A new compute cluster duplicates infrastructure, datastores are for storage, and serverless compute is Azure-managed and cannot target AKS.',
    },
    {
      question:
        'An auditor asks which users can see the account key stored in a credential-based datastore. Which statement is correct?',
      options: [
        'Only Owners of the workspace can see datastore credentials.',
        'Any user with at least Reader on the workspace can view the datastore credentials.',
        'Credentials are never visible after creation.',
        'Only the workspace managed identity can read the credentials.',
      ],
      correct: [1],
      explanation:
        'Readers can list and view assets including datastore credentials. This is exactly why identity-based datastores are recommended for sensitive data.',
    },
  ],
  statements: [
    { text: 'Creating an Azure Machine Learning datastore copies the data into the workspace storage account.', isTrue: false, explanation: 'Datastores only reference existing storage; no data is copied.' },
    { text: 'Workspaces created after November 2024 assign the Azure AI Administrator role, not Contributor, to the workspace system-assigned identity.', isTrue: true, explanation: 'Microsoft narrowed the identity\'s permissions to the minimum needed.' },
    { text: 'The AzureML Data Scientist role can create compute clusters.', isTrue: false, explanation: 'Compute creation requires AzureML Compute Operator, Contributor or Owner.' },
    { text: 'A compute cluster with min_instances 0 incurs no VM charges while idle.', isTrue: true, explanation: 'Nodes are deallocated after idle_time_before_scale_down elapses.' },
    { text: 'OneLake is a supported datastore type in Azure Machine Learning.', isTrue: true, explanation: 'Blob, ADLS Gen2, Azure Files and OneLake are supported.' },
    { text: 'A compute instance is the recommended target for running scheduled production training pipelines.', isTrue: false, explanation: 'Compute instances are single-user development workstations; clusters or serverless compute run pipelines.' },
  ],
  resources: [
    { label: 'What is an Azure Machine Learning workspace?', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/concept-workspace' },
    { label: 'Create datastores', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-datastore' },
    { label: 'What are compute targets in Azure Machine Learning?', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/concept-compute-target' },
    { label: 'Manage access to Azure Machine Learning workspaces', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-assign-roles' },
  ],
};

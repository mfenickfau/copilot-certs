import type { Concept } from '../../types';

export const containerAppsRevisionsAndKeda: Concept = {
  id: 'container-apps-revisions-and-keda',
  title: 'Azure Container Apps: Environments, Revisions and KEDA Scaling',
  summary:
    'Deploy and operate services on Azure Container Apps: environments as the shared boundary, secrets and environment variables, single versus multiple revision mode with traffic splitting and labels, and event-driven autoscaling with KEDA scale rules that can scale to zero.',
  certs: ['ai-200'],
  domains: ['ai-200-1'],
  outcomes: ['ai-200-1-2-1', 'ai-200-1-2-2'],
  tags: ['container-apps', 'revisions', 'keda', 'autoscaling', 'secrets', 'traffic-splitting'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Environments, apps and configuration',
      body: `A **Container Apps environment** is the secure boundary around one or more container apps and jobs. Apps in the same environment share a virtual network (Azure creates one, or you bring your own), write logs to the same destination (typically a Log Analytics workspace), and can call each other over internal ingress or Dapr. Put apps in separate environments when they must be network-isolated or belong to different stages (test versus production). New environments are **workload profiles** environments, which support both the serverless Consumption plan and Dedicated plans; "Consumption only" environments are legacy.

Configuration lives at two scopes, and the distinction drives exam questions:

- **Application-scope** settings (secrets, ingress, Dapr, revision mode) change the app without creating a revision.
- **Revision-scope** settings (container image, environment variables, CPU/memory, scale rules) create a **new revision** whenever they change.

Secrets are defined on the app with \`--secrets name=value\` and consumed in a revision as an environment variable with \`--env-vars DB_PASSWORD=secretref:db-password\`, or mounted as a volume. A secret can instead point at Key Vault: \`name=keyvaultref:https://kv.vault.azure.net/secrets/db,identityref:system\` (or a user-assigned identity resource id), which requires the identity to hold **Key Vault Secrets User**. Changing a secret does **not** create a revision and does not update running replicas; deploy a new revision or restart the existing one. Ingress is \`external\` (public) or \`internal\` (environment only) and routes to the container's **target port**.`,
    },
    {
      heading: 'Revisions, traffic splitting and labels',
      body: `Every revision-scope change produces an immutable **revision** named \`<app>--<suffix>\`; set the suffix yourself with \`--revision-suffix v2\`. Container Apps keeps up to 100 inactive revisions by default (adjustable with \`--max-inactive-revisions\`), and you can \`activate\`, \`deactivate\`, \`restart\` or \`copy\` revisions with \`az containerapp revision ...\`.

The **revision mode** decides how many revisions can run:

- **Single** (default): the new revision is provisioned and scaled to the desired size, then traffic flips to it. If the update fails, traffic stays on the old revision and the old one is deprovisioned only after success. Zero-downtime, but no gradual rollout.
- **Multiple**: several revisions are active at once and you control traffic with weights, for example \`az containerapp ingress traffic set --revision-weight app--v1=90 app--v2=10\`. This is how you do blue-green or canary releases and A/B tests. Switch with \`az containerapp revision set-mode --mode multiple\`.

**Labels** give a revision a stable URL (\`https://<app>---<label>.<env>.azurecontainerapps.io\`) independent of traffic weights. A label belongs to one revision at a time; moving it moves the test audience without touching the main URL's split. Labels are most useful in multiple revision mode, for example "give QA a URL that always points to the candidate revision".

Typical troubleshooting: "users still see the old version" usually means multiple revision mode with weights still pointing at the old revision, or an update that failed validation so the old revision kept 100%.`,
    },
    {
      heading: 'Scaling with KEDA',
      body: `Container Apps scales replicas between \`--min-replicas\` and \`--max-replicas\` using **KEDA (Kubernetes Event-driven Autoscaling)** under the hood; you configure scale rules, not KEDA objects. Three rule families exist:

- **HTTP**: the number of concurrent requests per replica (default 10) via \`--scale-rule-type http --scale-rule-http-concurrency 100\`.
- **TCP**: concurrent connections per replica (default 10).
- **Custom (KEDA scalers)**: any KEDA scaler such as \`azure-servicebus\`, \`azure-queue\`, \`azure-eventhub\`, \`kafka\`, \`redis\`, \`cpu\` or \`memory\`, configured with \`--scale-rule-metadata\` key-value pairs (for example \`queueName=jobs messageCount=5\`) and \`--scale-rule-auth\` to map a secret to the scaler's auth parameter (\`connection=sb-conn\`). Azure Queue Storage, Service Bus and Event Hubs scalers also support **managed identity** instead of a connection string.

The algorithm is \`desiredReplicas = ceil(currentMetricValue / targetMetricValue)\`. Defaults worth memorising: KEDA **polls event sources every 30 seconds**, and the **cool-down period is 300 seconds** after the last event before scaling back to the minimum. Neither applies to HTTP/TCP rules, which recompute concurrency every 15 seconds.

**Scale to zero** (\`--min-replicas 0\`) is the cost argument: you are not billed usage when no replicas run. The trade-off is a cold start on the first request or message; set \`--min-replicas 1\` for latency-sensitive front ends. CPU and memory rules cannot scale to zero because an idle replica still reports CPU. If you host Azure Functions on Container Apps, the platform generates scale rules from the function triggers automatically.`,
    },
    {
      heading: 'The exam angle',
      body: `Expect scenario items that pick a specific CLI flag or concept:

- *"Deploy a new image but keep 90 percent of traffic on the current version."* Multiple revision mode plus \`ingress traffic set\` with weights.
- *"Give testers a stable URL that always points to the candidate revision."* A revision **label**.
- *"Changed a secret but the app still uses the old value."* Secrets do not create revisions; create a new revision or restart the active one.
- *"Scale the worker based on messages in a Service Bus queue and run nothing when idle."* Custom \`azure-servicebus\` scale rule with \`--min-replicas 0\`; authenticate with a secret reference or managed identity.
- *"Replicas keep running five minutes after the queue drains."* That is the default 300 second cool-down, expected behaviour.
- *"Apps in test must not reach production apps."* Separate environments.
- *"Add 1 replica for every 50 concurrent requests."* HTTP rule with concurrency 50.

Distractors: creating a Kubernetes HorizontalPodAutoscaler (that is AKS, not Container Apps), using App Service deployment slots (not a Container Apps feature), storing the Service Bus connection string in a plain environment variable instead of a secret, and expecting a CPU-based rule to scale to zero.`,
    },
  ],
  examples: [
    {
      title: 'Queue-driven worker that scales to zero',
      description:
        'A document-ingestion worker reads Service Bus messages, calls an embedding model and writes to a vector store. It should run zero replicas when idle and add a replica for every five waiting messages, up to 20.',
      language: 'bash',
      code: `az containerapp create -g rg-ai -n ingest-worker --environment env-ai \\
  --image contosoacr.azurecr.io/ingest-worker:1.8 \\
  --registry-server contosoacr.azurecr.io --registry-identity system \\
  --secrets "sb-conn=keyvaultref:https://kv-ai.vault.azure.net/secrets/sb-conn,identityref:system" \\
  --env-vars "SERVICEBUS_CONN=secretref:sb-conn" "QUEUE=ingest" \\
  --min-replicas 0 --max-replicas 20 \\
  --scale-rule-name sb-depth \\
  --scale-rule-type azure-servicebus \\
  --scale-rule-metadata "queueName=ingest" "messageCount=5" \\
  --scale-rule-auth "connection=sb-conn"`,
      takeaway: 'A KEDA azure-servicebus rule with min-replicas 0 gives true event-driven, pay-per-use processing; the scaler authenticates through a secret reference, never a plain env var.',
    },
    {
      title: 'Canary release with traffic weights and a QA label',
      description:
        'The API team wants to ship v2 of a chat back end to 10 percent of users while QA hits v2 directly through a fixed URL.',
      language: 'bash',
      code: `az containerapp revision set-mode -g rg-ai -n chat-api --mode multiple

az containerapp update -g rg-ai -n chat-api \\
  --image contosoacr.azurecr.io/chat-api:2.0.0 --revision-suffix v2

az containerapp ingress traffic set -g rg-ai -n chat-api \\
  --revision-weight chat-api--v1=90 chat-api--v2=10

az containerapp revision label add -g rg-ai -n chat-api \\
  --label qa --revision chat-api--v2
# QA URL: https://chat-api---qa.<env-domain>.azurecontainerapps.io`,
      takeaway: 'Multiple revision mode controls the percentage split; labels provide a revision-specific URL that moves independently of the split.',
    },
    {
      title: 'The secret that never changed (a realistic mistake)',
      description:
        'An engineer rotates the OpenAI key in Key Vault, updates the Container Apps secret, and declares victory. Hours later the app is still failing with 401 because the running revision was never restarted. Secrets are application-scope: updating one does not create a revision or refresh running replicas. The fix is to restart the active revision (or deploy a new one) after changing a secret.',
      language: 'bash',
      code: `az containerapp secret set -g rg-ai -n chat-api \\
  --secrets "openai-key=keyvaultref:https://kv-ai.vault.azure.net/secrets/openai-key,identityref:system"

REV=$(az containerapp revision list -g rg-ai -n chat-api \\
  --query "[?properties.active].name" -o tsv)
az containerapp revision restart -g rg-ai -n chat-api --revision $REV`,
      takeaway: 'Secret changes are not picked up by running replicas; restart the revision or roll a new one.',
    },
  ],
  keyPoints: [
    'An environment is the shared boundary (network, logging) for container apps; use separate environments for isolation.',
    'Revision-scope changes (image, env vars, resources, scale rules) create a new revision; application-scope changes (secrets, ingress, revision mode) do not.',
    'Secrets are referenced with secretref: in env vars or keyvaultref:...,identityref:... for Key Vault; changes require a restart or new revision.',
    'Single revision mode flips traffic after the new revision is healthy; multiple revision mode allows weighted traffic splitting and blue-green.',
    'Labels give a revision its own stable URL, independent of traffic weights, and belong to one revision at a time.',
    'Scale rules use KEDA: HTTP/TCP concurrency (default 10) or any KEDA scaler such as azure-servicebus with metadata and auth.',
    'Defaults: 30 second polling interval, 300 second cool-down; min-replicas 0 scales to zero and stops usage billing.',
    'CPU and memory rules cannot scale to zero; Azure resource scalers can authenticate with managed identity.',
  ],
  flashcards: [
    { front: 'What is a Container Apps environment?', back: 'A secure boundary (shared VNet and log destination) around one or more container apps and jobs.' },
    { front: 'Which changes create a new revision?', back: 'Revision-scope changes: container image, environment variables, CPU/memory, scale rules.' },
    { front: 'Does updating a secret create a new revision?', back: 'No. Secrets are application-scope; restart the revision or deploy a new one to pick up the change.' },
    { front: 'How do you reference a secret in an environment variable?', back: 'NAME=secretref:<secret-name> in --env-vars.' },
    { front: 'How do you reference a Key Vault secret from Container Apps?', back: 'name=keyvaultref:<secret URI>,identityref:system (or the user-assigned identity resource id); the identity needs Key Vault Secrets User.' },
    { front: 'What does multiple revision mode enable?', back: 'Several active revisions with weighted traffic splitting (blue-green, canary, A/B).' },
    { front: 'What is a revision label?', back: 'A name that gives one revision a stable, dedicated URL; moving the label re-points that URL.' },
    { front: 'Default KEDA polling interval and cool-down period in Container Apps?', back: '30 seconds polling; 300 seconds cool-down before scaling to the minimum.' },
    { front: 'Default concurrency threshold for an HTTP scale rule?', back: '10 concurrent requests per replica.' },
    { front: 'Which scale rule types cannot scale to zero?', back: 'CPU and memory rules.' },
    { front: 'Scaling formula used by KEDA?', back: 'desiredReplicas = ceil(currentMetricValue / targetMetricValue).' },
  ],
  quiz: [
    {
      question:
        'You deploy a new version of a Container App and want 20 percent of production traffic to reach it while the rest stays on the current version. What should you do first?',
      options: [
        'Set the revision mode to multiple and then configure revision weights',
        'Create a deployment slot and swap it after testing',
        'Set --min-replicas 2 on the new revision',
        'Add a revision label named canary to the new revision',
      ],
      correct: [0],
      explanation:
        'Traffic splitting needs multiple revision mode. Deployment slots are an App Service feature, min-replicas affects scale not traffic, and a label gives a separate URL rather than splitting the main URL.',
    },
    {
      question:
        'A background worker in Azure Container Apps processes Azure Service Bus messages. It must run no replicas when the queue is empty and add replicas as messages accumulate. Which configuration should you use?',
      options: [
        'A CPU scale rule with --min-replicas 0',
        'An HTTP scale rule with --scale-rule-http-concurrency 1',
        'A custom azure-servicebus scale rule with --min-replicas 0 and --scale-rule-auth for the connection',
        'A Kubernetes HorizontalPodAutoscaler targeting the queue length',
      ],
      correct: [2],
      explanation:
        'KEDA Service Bus scaler reacts to queue depth and supports scale to zero. CPU rules cannot scale to zero, HTTP rules measure requests not messages, and HPAs are an AKS construct.',
    },
    {
      question:
        'After rotating a connection string stored as a Container Apps secret, the running app still uses the old value. Why?',
      options: [
        'Secrets are cached by Log Analytics for 24 hours',
        'Secret changes do not create a revision or refresh running replicas; the revision must be restarted or redeployed',
        'The secret must also be added to the environment, not only the app',
        'Secret references only work in multiple revision mode',
      ],
      correct: [1],
      explanation:
        'Secrets are application-scope and an update does not propagate to running replicas. Log Analytics is unrelated, secrets are defined per app, and revision mode has no effect on secret resolution.',
    },
    {
      question:
        'QA needs a URL that always points at the candidate revision of a Container App, regardless of how production traffic is weighted. What should you configure?',
      options: [
        'A revision label on the candidate revision',
        'A second Container Apps environment for QA',
        'Internal ingress on the candidate revision',
        'A traffic weight of 100 percent to the candidate revision',
      ],
      correct: [0],
      explanation:
        'Labels give a revision a dedicated URL independent of traffic splitting. A second environment duplicates infrastructure, ingress visibility does not create a per-revision URL, and 100 percent weight would send all production traffic to the candidate.',
    },
    {
      question:
        'Which TWO statements about scaling in Azure Container Apps are correct? (Select two)',
      options: [
        'The default cool-down period before scaling in is 300 seconds',
        'A memory scale rule can scale an app to zero replicas',
        'KEDA polls non-HTTP event sources every 30 seconds by default',
        'HTTP scale rules default to 100 concurrent requests per replica',
      ],
      correct: [0, 2],
      explanation:
        'Cool-down defaults to 300 seconds and polling to 30 seconds. CPU and memory rules cannot scale to zero, and the HTTP default concurrency is 10, not 100.',
    },
    {
      question:
        'A team runs its test and production container apps in the same Container Apps environment. Production must be unreachable from test over the internal network. What is the MOST appropriate change?',
      options: [
        'Move production apps to a separate Container Apps environment',
        'Switch production apps to single revision mode',
        'Set --min-replicas 1 on production apps',
        'Add a revision label named prod to each production app',
      ],
      correct: [0],
      explanation:
        'Apps in one environment share a network; isolation requires separate environments. Revision mode, replica counts and labels do not affect network reachability.',
    },
  ],
  statements: [
    { text: 'Changing an environment variable on a Container App creates a new revision.', isTrue: true, explanation: 'Environment variables are revision-scope settings.' },
    { text: 'Updating a Container Apps secret immediately changes the value seen by running replicas.', isTrue: false, explanation: 'Secrets are application-scope; the revision must be restarted or a new one deployed.' },
    { text: 'In single revision mode, if a new revision fails to become healthy, traffic remains on the previous revision.', isTrue: true, explanation: 'Traffic only moves after the new revision\'s replicas are running.' },
    { text: 'A revision label can be attached to several revisions at the same time.', isTrue: false, explanation: 'A label belongs to exactly one revision at a time.' },
    { text: 'Azure Container Apps uses KEDA to implement its scale rules.', isTrue: true, explanation: 'Scale rules are translated into KEDA scalers under the hood.' },
    { text: 'A Container App that scales to zero still incurs usage charges while idle.', isTrue: false, explanation: 'You are not billed usage while the app runs zero replicas.' },
    { text: 'Scale rules for Azure Service Bus can authenticate with managed identity instead of a connection string.', isTrue: true, explanation: 'Azure Queue Storage, Service Bus and Event Hubs scalers support managed identity.' },
  ],
  resources: [
    { label: 'Revisions in Azure Container Apps', url: 'https://learn.microsoft.com/en-us/azure/container-apps/revisions' },
    { label: 'Set scaling rules in Azure Container Apps', url: 'https://learn.microsoft.com/en-us/azure/container-apps/scale-app' },
    { label: 'Manage secrets in Azure Container Apps', url: 'https://learn.microsoft.com/en-us/azure/container-apps/manage-secrets' },
  ],
};

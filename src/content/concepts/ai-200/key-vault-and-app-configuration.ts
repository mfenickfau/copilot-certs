import type { Concept } from '../../types';

export const keyVaultAndAppConfiguration: Concept = {
  id: 'key-vault-and-app-configuration',
  title: 'Azure Key Vault Secrets and Azure App Configuration',
  summary:
    'Keep secrets and settings out of code: Key Vault for secrets, keys and certificates with Azure RBAC data-plane roles, soft delete, versioning and automated rotation driven by Event Grid; App Configuration for key-values, labels, feature flags, Key Vault references and dynamic refresh with a sentinel key, all accessed with managed identity.',
  certs: ['ai-200', 'ai-500'],
  domains: ['ai-200-4', 'ai-500-4'],
  outcomes: ['ai-200-4-1-1', 'ai-200-4-1-2', 'ai-500-4-1-3'],
  tags: ['key-vault', 'secrets', 'rotation', 'rbac', 'app-configuration', 'feature-flags', 'managed-identity'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Key Vault: what it stores and who may read it',
      body: `Azure Key Vault holds three object types: **secrets** (connection strings, API keys, passwords), **keys** (cryptographic keys for encrypt/sign/wrap, including customer-managed keys) and **certificates** (with private keys and auto-renewal through integrated CAs). Every object has **versions**; referencing an object without a version returns the current one, which is what makes rotation transparent to consumers. Vault URIs look like \`https://<vault>.vault.azure.net/secrets/<name>[/<version>]\`.

Access has two planes. The **control plane** (create or delete the vault, set network rules) uses Azure RBAC. The **data plane** (read a secret) uses either the legacy **vault access policy** model or, recommended, **Azure RBAC for data-plane operations** with built-in roles: **Key Vault Secrets User** (read secret values; what workloads need), **Key Vault Secrets Officer** (manage secrets), **Key Vault Crypto User/Officer**, **Key Vault Certificates Officer/User**, **Key Vault Reader** (metadata only) and **Key Vault Administrator**. Assign at vault scope; per-secret assignments are possible but not recommended. Be aware that *Contributor* on the vault lets someone grant themselves access via access policies in the legacy model, and switching a vault to RBAC invalidates existing access policies.

Protective settings: **soft delete** (deleted objects recoverable for 7 to 90 days; on by default) and **purge protection** (nobody can permanently delete during the retention window). Network: firewall, private endpoints, and "allow trusted Microsoft services" for services like App Service. Logging via diagnostic settings and Event Grid notifications for lifecycle events. Guidance: one vault per application per environment (and per region), never store certificates as plain secrets, and treat the vault as a secret *store*, not a high-throughput database. Throttling returns **HTTP 429**; cache secrets in memory and reread only when the cached copy stops working, and spread load across vaults if needed.`,
    },
    {
      heading: 'Retrieving secrets and automating rotation',
      body: `Applications read secrets with the Azure SDK: \`SecretClient(vault_url, DefaultAzureCredential())\` then \`get_secret("db-password")\` (Python \`azure-keyvault-secrets\`; .NET \`Azure.Security.KeyVault.Secrets\`). In Azure the credential chain resolves to the **managed identity**, locally to your developer login; the code is identical. Platform integrations avoid SDK calls entirely: **Key Vault references** in App Service and Functions app settings (\`@Microsoft.KeyVault(SecretUri=...)\`), \`keyvaultref:\` secrets in Container Apps, the Secrets Store CSI driver in AKS, and Key Vault references in App Configuration. All of them need the platform identity to hold Key Vault Secrets User.

**Rotation** means producing a new credential at the target system and publishing it as a **new secret version**, with consumers picking it up automatically because they reference the secret without a version:

- Set an **expiration date** on each secret. Key Vault emits the **SecretNearExpiry** event to Event Grid 30 days before expiry (and SecretExpired at expiry).
- An **Azure Function with an Event Grid trigger** receives the event, generates a new password or key at the resource (SQL login, storage account key, Redis key), stores it as a new version in Key Vault with a fresh expiry, and (for single-credential systems) updates the resource. Event Grid retries delivery for the configured policy if the function fails.
- For resources with **two sets of credentials** (storage keys, Cosmos DB keys) rotate the inactive key and swap the active one, so there is zero downtime; a tag such as \`CredentialId\` records which key is live.
- **Keys** can rotate automatically with a **rotation policy** in Key Vault itself; **certificates** auto-renew with integrated CAs. Secrets have no built-in rotation because Key Vault cannot change the target system, hence the Event Grid plus Function pattern.

Consumers must tolerate rotation: SDK clients should re-fetch on authentication failure, App Service refreshes references within 24 hours or on restart, and Container Apps need a revision restart. Better still, remove secrets entirely with **managed identity** to Azure services (Cosmos DB, Service Bus, Storage, PostgreSQL via Entra), so there is nothing to rotate. Multi-agent systems should give **each agent or service its own identity and vault scope**, so a compromised component cannot read another component's secrets.`,
    },
    {
      heading: 'App Configuration: settings, labels and feature flags',
      body: `**Azure App Configuration** centralises non-secret settings and feature flags so they can change without redeploying. Data is stored as **key-values**: hierarchical keys (\`Rag:Retriever:TopK\`), optional **labels** to version or stage values (\`dev\`, \`prod\`, or a build id), a content type (for example JSON), and tags. A key-value (key, value and attributes) is limited to 10 KB. Snapshots freeze a set of key-values for a release; geo-replication and private link are available on Standard and Premium; Free is for development.

Three content kinds matter:

1. **Plain settings**: read with the provider libraries (\`azure-appconfiguration-provider\` for Python, \`Microsoft.Extensions.Configuration.AzureAppConfiguration\` for .NET, Spring Cloud Azure for Java). \`load(endpoint=..., credential=DefaultAzureCredential(), selects=[SettingSelector(key_filter="Rag:*", label_filter="prod")], trim_prefixes=["Rag:"])\` returns a dictionary-like object. The identity needs **App Configuration Data Reader**.
2. **Key Vault references**: a key-value whose content type marks it as a pointer to a Key Vault secret URI. App Configuration never stores or reads the secret; the client resolves it with its own credential (\`AzureAppConfigurationKeyVaultOptions(credential=...)\`), which must hold Key Vault Secrets User. One endpoint for settings and secrets, with separation of duties intact.
3. **Feature flags**: stored under \`.appconfig.featureflag/\` with the **Feature Manager** UI. Flags can be simple on/off, filtered by **time window**, **targeting** (users, groups, percentage rollout) or custom filters, and **variant** flags for A/B experiments. In Python, \`load(..., feature_flag_enabled=True, feature_flag_refresh_enabled=True)\` plus \`FeatureManager(config).is_enabled("NewRanker")\` from the \`featuremanagement\` package.

CLI basics: \`az appconfig kv set -n store --key Rag:TopK --value 5 --label prod\`, \`az appconfig kv export/import\` for bulk moves, \`az appconfig feature set\`.`,
    },
    {
      heading: 'Dynamic refresh and the exam angle',
      body: `Changing a value in the store does nothing until clients refresh. Providers cache values and check for changes on a **refresh interval** (default 30 seconds in Python); they watch either every key or, preferably, a **sentinel key**: you update all the real keys, then bump the sentinel, and the provider reloads everything atomically when it sees the sentinel change. Configure with \`refresh_on=[WatchKey("Sentinel")]\`, \`refresh_interval=...\`, and call \`config.refresh()\` on a request path (or let middleware do it); an \`on_refresh_success\` callback lets you rewire objects. The watch costs one request per interval instead of one per key, and avoids half-applied configuration.

Exam scenarios map cleanly to features:

- *"Store a database password securely and read it from an App Service app."* Key Vault + Key Vault reference + managed identity with **Key Vault Secrets User**.
- *"Rotate a SQL password every 60 days automatically."* Secret expiry + **SecretNearExpiry** event → Event Grid → **Function** that rotates and writes a new version.
- *"An app fails after RBAC was enabled on the vault."* Access policies were invalidated; assign the equivalent roles.
- *"Prevent permanent deletion of secrets."* **Purge protection** (with soft delete).
- *"Key Vault returns 429 under load."* **Cache** secrets in memory, back off exponentially, split across vaults.
- *"Change TopK for retrieval in production without redeploying."* App Configuration with **labels** and **dynamic refresh**.
- *"Roll a new ranking model out to 10 percent of users."* **Feature flag** with a targeting (percentage) filter.
- *"Many keys changed; clients refresh mid-change and break."* Use a **sentinel key**.
- *"Keep secrets out of App Configuration but give apps one endpoint."* **Key Vault references** in App Configuration.

Distractors: Key Vault Contributor for reading secrets (control plane only), storing secrets as App Configuration values, polling Key Vault on every request, and expecting a secret to rotate itself without a Function or automation.`,
    },
  ],
  examples: [
    {
      title: 'Read settings, a Key Vault-backed secret and a feature flag with one provider',
      description:
        'A retrieval service loads its production settings from App Configuration, resolves the Azure OpenAI key through a Key Vault reference, watches a sentinel key for refresh, and checks a feature flag before using a new ranker.',
      language: 'python',
      code: `from azure.appconfiguration.provider import (load, SettingSelector, WatchKey,
                                             AzureAppConfigurationKeyVaultOptions)
from azure.identity import DefaultAzureCredential
from featuremanagement import FeatureManager

cred = DefaultAzureCredential()
config = load(
    endpoint="https://contoso-config.azconfig.io", credential=cred,
    selects=[SettingSelector(key_filter="Rag:*", label_filter="prod")],
    trim_prefixes=["Rag:"],
    key_vault_options=AzureAppConfigurationKeyVaultOptions(credential=cred),
    refresh_on=[WatchKey("Rag:Sentinel", label="prod")], refresh_interval=30,
    feature_flag_enabled=True, feature_flag_refresh_enabled=True,
)
features = FeatureManager(config)

def retrieve(query, user_id):
    config.refresh()                                  # no-op until interval elapses
    top_k = int(config["Retriever:TopK"])            # plain setting
    openai_key = config["OpenAIKey"]                 # Key Vault reference, resolved by client
    ranker = "v2" if features.is_enabled("NewRanker", user=user_id) else "v1"
    return search(query, top_k=top_k, ranker=ranker, key=openai_key)`,
      takeaway: 'One provider call yields settings, resolved secrets and feature flags; the sentinel key makes refresh atomic and cheap.',
    },
    {
      title: 'Rotation function triggered by SecretNearExpiry',
      description:
        'A Function with an Event Grid trigger receives Key Vault near-expiry events, generates a new PostgreSQL password, updates the database role, and writes the new value as a new secret version with a fresh 60 day expiry.',
      language: 'python',
      code: `import azure.functions as func, secrets, datetime as dt
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
app = func.FunctionApp()

@app.event_grid_trigger(arg_name="event")
def rotate(event: func.EventGridEvent):
    if event.event_type != "Microsoft.KeyVault.SecretNearExpiry":
        return
    data = event.get_json()                    # VaultName, ObjectName, Version, EXP
    kv = SecretClient(f"https://{data['VaultName']}.vault.azure.net",
                      DefaultAzureCredential())
    new_password = secrets.token_urlsafe(32)
    set_postgres_password(role=data["ObjectName"], password=new_password)  # target first
    kv.set_secret(data["ObjectName"], new_password,
                  expires_on=dt.datetime.now(dt.timezone.utc) + dt.timedelta(days=60),
                  tags={"rotatedBy": "rotate-fn"})`,
      takeaway: 'Key Vault signals, Event Grid delivers, a Function changes the target and publishes a new version; consumers referencing the secret without a version follow along.',
    },
    {
      title: 'The vault that went dark after enabling RBAC (a realistic mistake)',
      description:
        'A security review flips a production vault from access policies to the Azure RBAC permission model. Minutes later every API starts failing with 403 Forbidden from Key Vault. Enabling RBAC invalidates all access policies, and nobody had assigned the equivalent roles. The fix is to assign Key Vault Secrets User to each workload identity at vault scope before (or immediately after) switching, and to check role assignments with az role assignment list.',
      language: 'bash',
      code: `VAULT_ID=$(az keyvault show -n kv-ai-prod --query id -o tsv)
for APP in rag-api ingest-worker rotate-fn; do
  PID=$(az identity show -g rg-ai -n id-$APP --query principalId -o tsv)
  az role assignment create --assignee-object-id $PID --assignee-principal-type ServicePrincipal \\
    --role "Key Vault Secrets User" --scope $VAULT_ID
done
az keyvault update -n kv-ai-prod --enable-rbac-authorization true
az role assignment list --scope $VAULT_ID -o table`,
      takeaway: 'RBAC and access policies are mutually exclusive; map every policy to a data-plane role before switching.',
    },
  ],
  keyPoints: [
    'Key Vault stores secrets, keys and certificates with versions; reference without a version to pick up rotations automatically.',
    'Data-plane access should use Azure RBAC roles: Key Vault Secrets User to read, Secrets Officer to manage; Contributor is control plane only and switching to RBAC invalidates access policies.',
    'Soft delete and purge protection prevent loss; one vault per app per environment; cache secrets and back off on 429.',
    'Read secrets with SecretClient + DefaultAzureCredential or via platform Key Vault references (App Service, Functions, Container Apps, App Configuration).',
    'Secret rotation = expiry date + SecretNearExpiry event (30 days before) via Event Grid + a Function that updates the target and writes a new version; keys have native rotation policies.',
    'App Configuration stores key-values with labels, Key Vault references and feature flags; clients need App Configuration Data Reader and resolve Key Vault references with their own identity.',
    'Dynamic refresh polls on an interval (default 30 s); watch a sentinel key so many changes apply atomically with one request per interval.',
    'Feature flags support time-window, targeting (users, groups, percentage) and variant filters via the Feature Manager.',
  ],
  flashcards: [
    { front: 'Which Key Vault RBAC role lets a workload read secret values?', back: 'Key Vault Secrets User.' },
    { front: 'Does the Azure Contributor role on a vault allow reading secrets?', back: 'No. Contributor is control plane; data-plane access needs a Key Vault data role (or an access policy in the legacy model).' },
    { front: 'What happens to access policies when a vault switches to the RBAC permission model?', back: 'They are invalidated; equivalent role assignments must exist or workloads get 403.' },
    { front: 'Soft delete retention range and the purpose of purge protection?', back: '7 to 90 days; purge protection prevents permanent deletion during that window.' },
    { front: 'Which Event Grid event fires 30 days before a secret expires?', back: 'Microsoft.KeyVault.SecretNearExpiry.' },
    { front: 'Why do consumers reference secrets without a version?', back: 'So they automatically receive the latest version after rotation.' },
    { front: 'How should an app respond to HTTP 429 from Key Vault?', back: 'Exponential back-off and retry, cache secrets in memory, and spread load across vaults if sustained.' },
    { front: 'Which role does an app need to read from App Configuration with managed identity?', back: 'App Configuration Data Reader.' },
    { front: 'What is a Key Vault reference in App Configuration?', back: 'A key-value pointing to a Key Vault secret URI; the client resolves it with its own credential, App Configuration never holds the secret.' },
    { front: 'What is a sentinel key?', back: 'A single key clients watch; you update it last so all other changes are reloaded together with one request per interval.' },
    { front: 'Default refresh interval for the Python App Configuration provider?', back: '30 seconds.' },
    { front: 'Which feature-flag filter enables a percentage rollout to a subset of users?', back: 'The targeting filter (users, groups, default percentage).' },
  ],
  quiz: [
    {
      question:
        'A Container App uses its system-assigned managed identity to read a secret from Key Vault and receives 403 Forbidden. The vault uses the Azure RBAC permission model. Which role assignment fixes the problem with least privilege?',
      options: [
        'Key Vault Secrets User at the vault scope',
        'Key Vault Administrator at the subscription scope',
        'Contributor on the vault',
        'Key Vault Reader on the vault',
      ],
      correct: [0],
      explanation:
        'Secrets User grants read of secret values. Administrator is excessive, Contributor is control plane only, and Reader sees metadata but not values.',
    },
    {
      question:
        'Compliance requires a PostgreSQL password stored in Key Vault to rotate every 60 days without downtime for consuming apps that use Key Vault references. Which design should you implement?',
      options: [
        'Set an expiry on the secret and create an Event Grid subscription for SecretNearExpiry that triggers a Function to change the database password and write a new secret version',
        'Enable the Key Vault key rotation policy on the secret',
        'Schedule a Logic App to delete and recreate the secret monthly',
        'Store the password in App Configuration with a label per month',
      ],
      correct: [0],
      explanation:
        'Secrets have no native rotation because Key Vault cannot change the target; the event-driven Function pattern does both halves. Rotation policies apply to keys, deleting secrets breaks references, and App Configuration is not for secrets.',
    },
    {
      question:
        'Under peak load an API calls Key Vault for its API key on every request and starts receiving HTTP 429. What should you do?',
      options: [
        'Cache the secret in memory and re-read only when the cached value fails or on a schedule, with exponential back-off on 429',
        'Switch the vault to the access policy permission model',
        'Assign Key Vault Administrator to the API identity',
        'Enable purge protection',
      ],
      correct: [0],
      explanation:
        'Key Vault is not a high-throughput store; caching and back-off are the documented remedy. Permission model, role level and purge protection do not affect throttling.',
    },
    {
      question:
        'You need to change the retrieval TopK for the production RAG service without redeploying, while development keeps a different value, and all services must switch at the same instant when several related keys change. Which TWO App Configuration features should you use? (Select two)',
      options: [
        'Labels (for example prod and dev) on the key-values',
        'A sentinel key watched for refresh',
        'Soft delete on the configuration store',
        'A Key Vault reference for TopK',
      ],
      correct: [0, 1],
      explanation:
        'Labels separate environments and the sentinel key makes refresh atomic. Soft delete protects against deletion, and TopK is not a secret.',
    },
    {
      question:
        'An application reads an Azure OpenAI key through a Key Vault reference stored in App Configuration and gets an authorization error, although it can read ordinary settings. What is the MOST likely cause?',
      options: [
        'The application identity has App Configuration Data Reader but lacks Key Vault Secrets User on the vault',
        'The App Configuration store is on the Free tier',
        'The key-value exceeds 10 KB',
        'Feature flag refresh is disabled',
      ],
      correct: [0],
      explanation:
        'Key Vault references are resolved by the client with its own credential, so the identity needs vault access separately. Tier, size limit and feature flag settings are unrelated.',
    },
    {
      question:
        'A team wants to expose a new reranking model to 10 percent of users and increase gradually without redeploying. What should they configure?',
      options: [
        'A feature flag in App Configuration with a targeting filter and a default percentage',
        'A Key Vault secret named RerankerEnabled',
        'An App Configuration label called ten-percent',
        'A timer-triggered Function that edits appsettings.json',
      ],
      correct: [0],
      explanation:
        'Targeting filters implement percentage and group rollouts natively. Secrets are not flags, labels do not partition users, and editing deployed files is fragile.',
    },
  ],
  statements: [
    { text: 'Referencing a Key Vault secret without a version returns the latest version.', isTrue: true, explanation: 'That is why rotations are transparent to consumers.' },
    { text: 'The Key Vault Reader role allows reading secret values.', isTrue: false, explanation: 'Reader sees metadata; Key Vault Secrets User reads values.' },
    { text: 'Key Vault publishes a SecretNearExpiry event to Event Grid 30 days before a secret expires.', isTrue: true, explanation: 'This event is the trigger for automated rotation functions.' },
    { text: 'Key Vault secrets rotate automatically with a built-in rotation policy like keys do.', isTrue: false, explanation: 'Only keys have native rotation policies; secrets need an automation (Function) that updates the target system.' },
    { text: 'App Configuration stores the actual secret value when you add a Key Vault reference.', isTrue: false, explanation: 'It stores only the secret URI; clients resolve the value from Key Vault with their own identity.' },
    { text: 'A sentinel key reduces the number of requests the provider makes to detect changes.', isTrue: true, explanation: 'Only the sentinel is watched, instead of every key.' },
    { text: 'App Configuration feature flags can target a percentage of users through the targeting filter.', isTrue: true, explanation: 'Targeting supports users, groups and a default rollout percentage.' },
    { text: 'Purge protection can be disabled at any time after it is enabled on a vault.', isTrue: false, explanation: 'Once enabled, purge protection cannot be turned off.' },
  ],
  resources: [
    { label: 'Azure RBAC for Key Vault data plane operations', url: 'https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide' },
    { label: 'Automate secret rotation with Key Vault, Event Grid and Functions', url: 'https://learn.microsoft.com/en-us/azure/key-vault/secrets/tutorial-rotation' },
    { label: 'What is Azure App Configuration?', url: 'https://learn.microsoft.com/en-us/azure/azure-app-configuration/overview' },
    { label: 'Dynamic configuration in Python with App Configuration', url: 'https://learn.microsoft.com/en-us/azure/azure-app-configuration/enable-dynamic-configuration-python' },
  ],
};

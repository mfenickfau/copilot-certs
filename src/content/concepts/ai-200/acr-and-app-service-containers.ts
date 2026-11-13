import type { Concept } from '../../types';

export const acrAndAppServiceContainers: Concept = {
  id: 'acr-and-app-service-containers',
  title: 'Azure Container Registry, ACR Tasks and Containers on App Service',
  summary:
    'How to build, tag, store and protect container images in Azure Container Registry, automate builds with ACR Tasks (quick tasks, triggers, multi-step YAML), and run those images on Azure App Service with environment variables, Key Vault references and managed-identity image pulls.',
  certs: ['ai-200'],
  domains: ['ai-200-1'],
  outcomes: ['ai-200-1-1-1', 'ai-200-1-1-2', 'ai-200-1-1-3'],
  tags: ['containers', 'acr', 'acr-tasks', 'app-service', 'managed-identity', 'key-vault-references'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Registry basics: SKUs, naming and versioning',
      body: `Azure Container Registry (ACR) is a private, Microsoft Entra-integrated OCI registry. You create it with \`az acr create --sku Basic|Standard|Premium\`. All three SKUs expose the same data-plane API and the same Entra authentication, image deletion and webhooks; they differ in included storage, throughput and a few features. **Premium** is the one to pick when a question mentions **geo-replication** (one registry served from many regions), **private endpoints / Private Link**, or a **retention policy for untagged manifests**. Exceeding your SKU's request rate returns HTTP 429 with a Retry-After header.

An image reference is \`<registry>.azurecr.io/<repository>:<tag>\`, and the same manifest can also be pulled by digest (\`@sha256:...\`). Tags are mutable pointers; digests are immutable. The recommended practice is a **unique tag scheme** (build id, git SHA, semantic version) rather than relying on \`latest\`, because a moving tag makes rollbacks and audits guesswork.

Three housekeeping features show up in exam items:

- **Lock** an image or repository so it cannot be overwritten or deleted: \`az acr repository update --name myregistry --image app:1.4 --write-enabled false\` (and \`--delete-enabled false\`).
- **Retention policy** (Premium, preview): automatically delete *untagged* manifests after N days. Do not enable it if systems pull by digest.
- **Purge / delete**: \`az acr repository delete --image app:1.3\` removes a tag or manifest; \`az acr show-usage\` shows storage against the SKU limit.

For a developer the day-to-day flow is \`az acr login --name myregistry\`, \`docker tag app myregistry.azurecr.io/app:1.4\`, \`docker push ...\`. Roles that matter: **AcrPush** to push, **AcrPull** for runtimes that only read images.`,
    },
    {
      heading: 'ACR Tasks: build in the cloud, rebuild on triggers',
      body: `ACR Tasks moves the Docker build off your laptop or CI agent and into Azure. There are three flavours:

1. **Quick task**: \`az acr build --registry myregistry --image app:{{.Run.ID}} --file Dockerfile .\` uploads the build context, runs \`docker build\` in Azure and pushes the result. No local Docker Engine is required, which is why it is the standard answer for "build an image from a machine that cannot run Docker" or "build inside a CI pipeline using only the Azure CLI".
2. **Automatically triggered task**: \`az acr task create\` with a Git context (\`--context https://github.com/org/repo.git#main\`) and triggers for **source-code commits or pull requests** (needs a personal access token so ACR can create the webhook), **base-image updates**, and **timers** (\`--schedule\`). The base-image trigger is the headline feature: when the OS or framework image your Dockerfile starts \`FROM\` is updated (in your registry or a public one such as Docker Hub), ACR rebuilds every dependent application image, which automates OS and framework patching.
3. **Multi-step task**: a YAML file with \`steps\` that build, push, and run containers (for example build the app image, run its test container, then push on success). Each step runs in its own container.

Useful commands: \`az acr task run\` to run on demand, \`az acr task list-runs\` to see history, \`az acr task logs\` to stream a run. The \`{{.Run.ID}}\` placeholder gives every build a unique tag. A commit trigger on a GitHub Enterprise repository is not supported, and a quick task with \`az acr build\` is also the correct way to produce images when your pipeline's service principal has no Docker daemon.`,
    },
    {
      heading: 'Running the image on App Service',
      body: `Azure App Service runs custom Linux (and Windows) containers on an App Service plan. Create the app with \`az webapp create --plan ... --container-image-name myregistry.azurecr.io/app:1.4\` (older scripts use \`--deployment-container-image-name\`), or point an existing app at a new image with \`az webapp config container set --container-image-name ...\`.

**Pulling from ACR.** The recommended approach is managed identity rather than admin credentials: enable the identity (\`az webapp identity assign\`), grant it **AcrPull** on the registry, then set \`az webapp config set --generic-configurations '{"acrUseManagedIdentityCreds": true}'\`. For a user-assigned identity also set \`acrUserManagedIdentityID\` to its client id. Service principals for Windows image pulls are no longer supported.

**Ports and environment.** App Service assumes the container listens on port 80; otherwise set the app setting **WEBSITES_PORT** (for example 8000). Every **app setting is injected into the container as an environment variable**, so \`az webapp config appsettings set --settings DB_HOST=... LOG_LEVEL=info\` is how you configure the image without rebuilding it. You can verify what the container sees at \`https://<app>.scm.azurewebsites.net/Env\`.

**Secrets.** Do not paste secrets into app settings. Use a **Key Vault reference** as the app-setting value: \`@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/db-password)\` or \`@Microsoft.KeyVault(VaultName=myvault;SecretName=db-password)\`. The app's managed identity needs **Key Vault Secrets User** (RBAC) or *Get* secret permission (access policy). Omit the version and App Service picks up rotated secrets automatically; cached values are refreshed every 24 hours or immediately on any configuration change or restart.

Persistent storage under \`/home\` is optional (\`WEBSITES_ENABLE_APP_SERVICE_STORAGE\`); anything written elsewhere in the container filesystem is lost on restart.`,
    },
    {
      heading: 'The exam angle',
      body: `AI-200 items in this area are "which command or setting" questions dressed as scenarios:

- *"Rebuild the API image automatically whenever the Python base image is patched."* An ACR task with a **base-image update trigger**, not a timer and not a webhook on App Service.
- *"The build agent has no Docker installed."* \`az acr build\` (quick task), which builds in the cloud.
- *"Containers must be pulled from a registry only reachable over a private network."* Premium SKU with a **private endpoint**.
- *"Images were overwritten in production; prevent it."* Lock the tag or repository with \`--write-enabled false\`, and adopt unique tags.
- *"Supply the database password to the container without storing it in configuration."* Key Vault reference in an app setting plus managed identity with **Key Vault Secrets User**.
- *"App returns 'application error' after switching to a container that listens on 5000."* Set **WEBSITES_PORT=5000**.
- *"Stop using registry admin credentials."* Managed identity + AcrPull + \`acrUseManagedIdentityCreds\`.

Distractors to recognise: enabling the ACR admin user (works, but is the least secure option), storing the secret directly in an app setting, using Azure Container Instances when the question is about App Service, and choosing Basic SKU for geo-replication.`,
    },
  ],
  examples: [
    {
      title: 'Build in the cloud and deploy to App Service with managed identity',
      description:
        'A team wants a repeatable script that builds the inference API image without a local Docker daemon, then runs it on an existing Linux App Service plan pulling via managed identity.',
      language: 'bash',
      code: `ACR=contosoacr; APP=contoso-rag-api; RG=rg-ai
az acr build --registry $ACR --image rag-api:$(git rev-parse --short HEAD) .

az webapp create -g $RG -p plan-linux -n $APP \\
  --container-image-name $ACR.azurecr.io/rag-api:$(git rev-parse --short HEAD)

PRINCIPAL=$(az webapp identity assign -g $RG -n $APP --query principalId -o tsv)
ACR_ID=$(az acr show -n $ACR --query id -o tsv)
az role assignment create --assignee $PRINCIPAL --role AcrPull --scope $ACR_ID
az webapp config set -g $RG -n $APP \\
  --generic-configurations '{"acrUseManagedIdentityCreds": true}'

az webapp config appsettings set -g $RG -n $APP --settings \\
  WEBSITES_PORT=8000 \\
  OPENAI_ENDPOINT=https://contoso-oai.openai.azure.com \\
  "OPENAI_KEY=@Microsoft.KeyVault(VaultName=kv-ai;SecretName=openai-key)"`,
      takeaway: 'az acr build removes the local Docker dependency; AcrPull plus acrUseManagedIdentityCreds replaces registry passwords; app settings become container environment variables.',
    },
    {
      title: 'Automated rebuild when the base image changes',
      description:
        'Security asks that every service image be rebuilt within hours of a patched Python base image landing in the registry. The team creates an ACR task with a Git context; the base-image trigger is enabled by default.',
      language: 'bash',
      code: `az acr task create --registry contosoacr --name build-rag-api \\
  --image rag-api:{{.Run.ID}} \\
  --context https://github.com/contoso/rag-api.git#main \\
  --file Dockerfile \\
  --git-access-token $GH_PAT \\
  --base-image-trigger-enabled true

# run once now and inspect history
az acr task run --registry contosoacr --name build-rag-api
az acr task list-runs --registry contosoacr --name build-rag-api -o table`,
      takeaway: 'ACR Tasks track the FROM image; when it is updated, the dependent application image is rebuilt and pushed automatically.',
    },
    {
      title: 'The "latest" rollback that went nowhere (a realistic mistake)',
      description:
        'A developer deploys App Service from contosoacr.azurecr.io/rag-api:latest. A bad build is pushed as latest, the app breaks, and "rolling back" by restarting the app just pulls the same broken image. The fix is to tag every build uniquely (git SHA or run id), deploy by that tag, lock the production tag with az acr repository update --write-enabled false, and roll back by pointing the app at the previous tag with az webapp config container set.',
      language: 'bash',
      code: `# lock the known-good image so it cannot be overwritten or deleted
az acr repository update -n contosoacr --image rag-api:2.3.0 \\
  --write-enabled false --delete-enabled false

# roll back by re-pointing the app
az webapp config container set -g rg-ai -n contoso-rag-api \\
  --container-image-name contosoacr.azurecr.io/rag-api:2.3.0`,
      takeaway: 'Moving tags make rollbacks impossible to reason about; unique tags plus image locks give you immutable, auditable deployments.',
    },
  ],
  keyPoints: [
    'ACR SKUs: Basic, Standard, Premium share the same API; Premium adds geo-replication, private endpoints and the untagged-manifest retention policy.',
    'Use unique tags (SHA, run id) rather than latest; lock critical images with az acr repository update --write-enabled false.',
    'az acr build is a quick task: a cloud docker build + push with no local Docker Engine.',
    'az acr task create supports commit/PR triggers, base-image update triggers and timer triggers; multi-step tasks are defined in YAML.',
    'App Service pulls from ACR best with managed identity: AcrPull role plus acrUseManagedIdentityCreds=true.',
    'App settings are injected as environment variables; set WEBSITES_PORT when the container does not listen on 80.',
    'Key Vault references (@Microsoft.KeyVault(SecretUri=...)) keep secrets out of app settings; the identity needs Key Vault Secrets User.',
    'Key Vault references without a version follow rotation automatically (refreshed within 24 hours or on restart).',
  ],
  flashcards: [
    { front: 'Which ACR SKU is required for geo-replication and private endpoints?', back: 'Premium.' },
    { front: 'Which CLI command builds and pushes an image in Azure without a local Docker daemon?', back: 'az acr build --registry <name> --image <repo:tag> <context>' },
    { front: 'Name the three trigger types for an automatically triggered ACR task.', back: 'Source code commit/PR, base image update, and timer (schedule).' },
    { front: 'How do you prevent an image tag from being overwritten or deleted?', back: 'az acr repository update --image repo:tag --write-enabled false (and --delete-enabled false).' },
    { front: 'What is {{.Run.ID}} in an ACR task?', back: 'A placeholder that tags each build with the unique task run id.' },
    { front: 'Which app setting tells App Service the custom container listens on a non-80 port?', back: 'WEBSITES_PORT.' },
    { front: 'How does an App Service app pull from ACR without admin credentials?', back: 'Enable managed identity, grant it AcrPull on the registry, set acrUseManagedIdentityCreds to true.' },
    { front: 'Write a Key Vault reference for an app setting.', back: '@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret) or @Microsoft.KeyVault(VaultName=myvault;SecretName=mysecret).' },
    { front: 'How often does App Service refresh a Key Vault reference without a version?', back: 'Every 24 hours, or immediately when configuration changes cause a restart.' },
    { front: 'What does a multi-step ACR task use to define its steps?', back: 'A YAML file whose steps build, push and run containers.' },
  ],
  quiz: [
    {
      question:
        'Your CI pipeline runs on an agent that cannot run Docker. You must build a Dockerfile in a Git repository and push the image to Azure Container Registry using only the Azure CLI. What should you run?',
      options: [
        'az acr import --source docker.io/library/python:3.12',
        'az acr build --registry contosoacr --image api:{{.Run.ID}} https://github.com/contoso/api.git#main',
        'docker buildx build --push -t contosoacr.azurecr.io/api:1 .',
        'az webapp up --runtime PYTHON:3.12',
      ],
      correct: [1],
      explanation:
        'az acr build is an ACR quick task that performs the build in Azure. az acr import copies an existing image, docker buildx needs a local Docker engine, and az webapp up deploys code to App Service without building a container image.',
    },
    {
      question:
        'Security requires that application images be rebuilt automatically whenever the Linux base image they derive from is patched. Which configuration meets the requirement with the least effort?',
      options: [
        'An ACR task created with az acr task create with the base-image update trigger enabled',
        'An ACR webhook that calls an Azure Function on every push',
        'A timer-triggered ACR task that runs every hour',
        'Azure Policy that denies images older than 30 days',
      ],
      correct: [0],
      explanation:
        'ACR Tasks can track the FROM image and rebuild dependent images when it changes. A webhook requires custom code, an hourly timer rebuilds needlessly and may still miss patches between runs, and Azure Policy does not rebuild anything.',
    },
    {
      question:
        'An App Service custom container starts but requests fail with an application error. The container listens on port 5000. What should you configure?',
      options: [
        'Set the app setting WEBSITES_PORT to 5000',
        'Set the app setting WEBSITE_RUN_FROM_PACKAGE to 1',
        'Enable Always On for the App Service plan',
        'Change the Dockerfile to EXPOSE 80',
      ],
      correct: [0],
      explanation:
        'App Service forwards traffic to port 80 unless WEBSITES_PORT says otherwise. WEBSITE_RUN_FROM_PACKAGE is for zip deployments, Always On prevents idling, and EXPOSE alone does not change the listening port.',
    },
    {
      question:
        'You need an App Service web app to pull its image from Azure Container Registry without storing registry credentials. Which TWO actions are required? (Select two)',
      options: [
        'Assign the AcrPull role on the registry to the web app\'s managed identity',
        'Enable the ACR admin user and store the password in an app setting',
        'Set acrUseManagedIdentityCreds to true in the web app configuration',
        'Create a Docker Hub access token for the web app',
      ],
      correct: [0, 2],
      explanation:
        'Managed-identity pulls need the identity to hold AcrPull and the app to be told to use the identity (acrUseManagedIdentityCreds). The admin user stores credentials, which is what you are avoiding; Docker Hub is unrelated.',
    },
    {
      question:
        'A containerized API on App Service must read a database password from Azure Key Vault. The app has a system-assigned managed identity and the vault uses the Azure RBAC permission model. Which TWO steps complete the configuration? (Select two)',
      options: [
        'Set the app setting value to @Microsoft.KeyVault(SecretUri=https://kv-ai.vault.azure.net/secrets/db-password)',
        'Assign the Key Vault Secrets User role to the managed identity on the vault',
        'Assign the Key Vault Contributor role to the managed identity on the vault',
        'Copy the secret value into the app setting and mark it as a slot setting',
      ],
      correct: [0, 1],
      explanation:
        'A Key Vault reference resolves the secret at runtime, and the identity needs data-plane read access via Key Vault Secrets User. Key Vault Contributor is a control-plane role and grants no secret access; copying the value defeats the purpose.',
    },
    {
      question:
        'A production image tag was accidentally overwritten by a developer push. Which action prevents this from recurring for the known-good image?',
      options: [
        'Run az acr repository update --image api:2.3.0 --write-enabled false',
        'Enable a retention policy for untagged manifests',
        'Downgrade the registry to the Basic SKU',
        'Enable geo-replication to a second region',
      ],
      correct: [0],
      explanation:
        'Disabling write on the tag locks it against overwrite. Retention policies delete untagged manifests, SKU changes do not affect permissions, and geo-replication copies the registry rather than protecting tags.',
    },
  ],
  statements: [
    { text: 'Only the Premium SKU of Azure Container Registry supports geo-replication.', isTrue: true, explanation: 'Geo-replication and private endpoints are Premium-only features.' },
    { text: 'az acr build requires Docker to be installed on the machine that runs the command.', isTrue: false, explanation: 'A quick task uploads the build context and runs docker build in Azure.' },
    { text: 'ACR Tasks can rebuild an application image when its base image is updated in Docker Hub.', isTrue: true, explanation: 'Base-image update triggers work for base images in your registry or in public registries such as Docker Hub.' },
    { text: 'App Service app settings are exposed to a custom container as environment variables.', isTrue: true, explanation: 'App Service injects app settings into the container process environment.' },
    { text: 'A Key Vault reference in an app setting requires the Key Vault Contributor role on the managed identity.', isTrue: false, explanation: 'It needs data-plane read access: Key Vault Secrets User (RBAC) or Get secret permission (access policy). Contributor is control plane only.' },
    { text: 'If a Key Vault reference omits the secret version, App Service picks up rotated secrets automatically within 24 hours.', isTrue: true, explanation: 'App Service caches reference values and refetches them every 24 hours, or immediately on configuration change.' },
    { text: 'The ACR retention policy for untagged manifests is safe to enable when deployments pull images by digest.', isTrue: false, explanation: 'Deleting untagged manifests breaks pulls by digest; Microsoft advises not to enable it in that case.' },
  ],
  resources: [
    { label: 'About ACR Tasks (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tasks-overview' },
    { label: 'Azure Container Registry service tiers', url: 'https://learn.microsoft.com/en-us/azure/container-registry/container-registry-skus' },
    { label: 'Configure a custom container for Azure App Service', url: 'https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container' },
    { label: 'Use Key Vault references as app settings in App Service', url: 'https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references' },
  ],
};

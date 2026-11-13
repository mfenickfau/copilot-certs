import type { Concept } from '../../types';

export const secretsKeyVaultAndLeakPrevention: Concept = {
  id: 'secrets-key-vault-and-leak-prevention',
  title: 'Secrets, Keys and Certificates: Key Vault Integration and Leak Prevention in Pipelines',
  summary:
    'Integrating Azure Key Vault into Azure Pipelines and GitHub Actions, managing secrets, keys and certificates through their lifecycle, choosing between Key Vault, variable groups, secure files, GitHub secrets and environment secrets for deployment-time sensitive data, and designing pipelines so that secrets cannot leak through logs, forks, artifacts or agents.',
  certs: ['az-401'],
  domains: ['az-401-4'],
  outcomes: ['az-401-4-2-1', 'az-401-4-2-2', 'az-401-4-2-3', 'az-401-4-2-4'],
  tags: ['key-vault', 'secrets', 'certificates', 'secure-files', 'github-secrets', 'variable-groups', 'secret-masking', 'push-protection'],
  difficulty: 'intermediate',
  diagram: 'layered-guardrails',
  sections: [
    {
      heading: 'Integrating Azure Key Vault into pipelines',
      body: `Azure Key Vault stores three object types: **secrets** (connection strings, API keys), **keys** (cryptographic keys for encryption and signing, optionally HSM-backed) and **certificates** (X.509 with automatic renewal from integrated CAs). Pipelines should fetch from the vault at run time with a secretless identity rather than copying values into the CI system.

**Azure Pipelines** offers two integrations. The \`AzureKeyVault@2\` task (\`azureSubscription\`, \`KeyVaultName\`, \`SecretsFilter\` as \`*\` or a comma-separated list, \`RunAsPreJob\` to make secrets available to the whole job) downloads secrets as **secret pipeline variables**, masked in logs and available as \`$(secretName)\`. Alternatively, a **variable group linked to Key Vault** selects named secrets once and makes them available to every authorised pipeline; the pipeline reads them like any variable group. In both cases the service connection identity needs **Get and List** secret permissions (access policies) or the **Key Vault Secrets User** role (RBAC), and the vault's firewall must allow the agents (Microsoft-hosted agents need the "Allow trusted Microsoft services" exception or a self-hosted agent inside the network).

**GitHub Actions** has no built-in Key Vault action in the current recommended set; the pattern is \`azure/login@v2\` with OIDC followed by \`az keyvault secret show --vault-name kv --name db-conn --query value -o tsv\` in an \`azure/cli\` step, writing the value to \`$GITHUB_OUTPUT\` and immediately masking it with \`::add-mask::\`. Even better, avoid pulling the secret into the runner at all: let the deployed application read Key Vault with its managed identity (App Service and Container Apps Key Vault references, App Configuration Key Vault references), so the pipeline only configures the *reference*.`,
    },
    {
      heading: 'Managing secrets, keys and certificates',
      body: `Lifecycle management is what separates a vault from a password list:

- **Create and store** with naming conventions per environment and vault per environment (or per application), soft delete and purge protection enabled so deleted objects can be recovered and cannot be destroyed during the retention window.
- **Access** through Azure RBAC (Key Vault Secrets User, Key Vault Certificates Officer, Key Vault Crypto User) at the narrowest scope, by managed identities and federated service principals, with private endpoints and firewall rules.
- **Rotate**: secrets by dual-write rotation (new version, consumers refresh, old version disabled), with Event Grid \`SecretNearExpiry\` events triggering a Function or pipeline; keys by Key Vault **rotation policies**; certificates by **auto-renewal** with integrated CAs (DigiCert, GlobalSign) or by importing renewed certificates. Set expiry on everything so near-expiry alerts fire.
- **Consume** by versionless reference where possible so rotation does not require a redeploy, or pin versions when you need deterministic builds.
- **Audit** with diagnostic settings to Log Analytics (\`AzureDiagnostics\` or resource-specific tables) and Defender for Key Vault alerts.

Code-signing and TLS certificates deserve a specific plan: store the certificate in Key Vault, sign with the vault's key (for example Azure Trusted Signing or \`AzureSignTool\`) so the private key never leaves the HSM, and use \`DownloadSecureFile@1\` only when a tool insists on a file. Copilot can draft the rotation Function and the Bicep for RBAC and diagnostics, and an agentic workflow can open a PR when a certificate is 30 days from expiry, but the identity that performs rotation must still be scoped and audited.`,
    },
    {
      heading: 'Sensitive information during deployment: secure files, variable groups, GitHub secrets',
      body: `Choose the store by the kind of data and where the deployment runs:

| Need | Azure Pipelines | GitHub Actions |
|---|---|---|
| Secret value shared by many pipelines | Variable group (Key Vault-linked preferred), with pipeline permissions and checks | Organization secret (selected repositories) |
| Secret for one pipeline or environment | Secret variable in the pipeline UI (lock icon) or variable group per environment | Repository secret, or **environment secret** released only after protection rules pass |
| File-based secret (certificate .pfx, keystore, Apple provisioning profile, kubeconfig) | **Secure files** library (encrypted at rest, up to 10 MB each), downloaded with \`DownloadSecureFile@1\` to \`$(Agent.TempDirectory)\`, pipeline must be authorised | Store base64 in a secret and decode to a file; or fetch the certificate from Key Vault at run time |
| Non-secret configuration | Variables, variable groups, parameters | Configuration variables (\`vars.\`) |
| Dynamic per-run secret | AzureKeyVault@2 at job start | azure/cli fetch after OIDC login |

Rules that hold on both platforms: secrets are **masked** in logs but only as whole values (substrings and transformed values are not), **secret variables are not exposed to scripts as environment variables automatically** in Azure Pipelines (map them with \`env:\`), secrets are **not passed to workflows triggered by pull requests from forks**, and secrets stored in Azure DevOps or GitHub cannot be read back through the UI or API (write-only). Secure files and variable groups are protected resources: authorise pipelines individually and add approvals and checks if the material is sensitive enough.`,
    },
    {
      heading: 'Designing pipelines that cannot leak',
      body: `Leaks happen through logs, artifacts, forks, agents, source control and AI tools. Design against each:

1. **Logs**: never \`echo\` a secret or run commands with \`set -x\`; masking only catches exact values, so a secret that is base64-encoded, URL-encoded or split across lines prints in clear. Use \`::add-mask::\` (GitHub) or \`##vso[task.setvariable variable=x;issecret=true]\` (Azure) for values derived at run time. Disable debug logging on production pipelines (\`system.debug\`, \`ACTIONS_STEP_DEBUG\`).
2. **Artifacts and caches**: do not publish directories that contain \`.env\`, \`appsettings.*.json\` with values, or kubeconfig; secrets written to disk belong in \`$(Agent.TempDirectory)\` or \`$RUNNER_TEMP\`, which are cleaned per job on hosted agents; on self-hosted agents clean the workspace and avoid caching secret-bearing paths.
3. **Forks and untrusted triggers**: \`pull_request\` from forks runs without secrets; never switch to \`pull_request_target\` and check out the PR head with secrets available. Require approval for first-time contributors' workflow runs. In Azure Pipelines, disable "Make secrets available to builds of forks" and limit fork builds.
4. **Agents and runners**: ephemeral runners for untrusted code and agent sessions; self-hosted agents for secrets-heavy deployments should be dedicated and not shared with public repositories; Copilot cloud agent sessions receive only Agents secrets and COPILOT_MCP_-prefixed values, and the firewall limits exfiltration.
5. **Source control**: push protection (GitHub Advanced Security and GitHub Advanced Security for Azure DevOps) blocks pushes with secrets; secret scanning finds historical leaks; pre-commit gitleaks gives early feedback; \`.gitignore\` for local secret files.
6. **Scope and lifetime**: OIDC and workload identity federation instead of stored cloud credentials; short-lived tokens; separate vaults per environment so a dev leak cannot reach production.
7. **Humans and AI**: review generated YAML for hard-coded values; add a Copilot instruction to never print or commit secrets; treat an agent's logs (session logs, OTel exports) as potentially containing sensitive data and govern their retention.

The exam scenario usually describes a leak path and asks for the control: masked substring means change the design, fork PR means secrets are correctly withheld, debug logging means turn it off, secret in a committed file means push protection plus rotation.`,
    },
  ],
  examples: [
    {
      title: 'Key Vault secrets at job start with AzureKeyVault@2',
      description:
        'A deployment stage pulls two secrets from the production vault using a workload identity federation service connection and maps one into a script. SecretsFilter limits what is downloaded; RunAsPreJob makes the values available to every step.',
      language: 'yaml',
      code: `- task: AzureKeyVault@2
  displayName: Fetch deployment secrets
  inputs:
    azureSubscription: sc-prod-wif
    KeyVaultName: kv-shop-prod
    SecretsFilter: 'DbConnectionString,StripeApiKey'
    RunAsPreJob: true
- task: AzureCLI@2
  inputs:
    azureSubscription: sc-prod-wif
    scriptType: bash
    scriptLocation: inlineScript
    inlineScript: |
      az webapp config connection-string set -g rg-shop -n shop-api -t SQLAzure \\
        --settings Db="$DB_CONN"
  env:
    DB_CONN: $(DbConnectionString)   # explicit mapping; never echoed`,
      takeaway: 'Filter to the secrets you need, fetch with a secretless connection, and pass values to scripts only through explicit env mappings.',
    },
    {
      title: 'GitHub Actions reading Key Vault after OIDC login and masking the value',
      description:
        'A workflow needs a third-party API key stored in Key Vault for a smoke test. It logs in with OIDC, reads the secret with the Azure CLI, masks it immediately, and passes it as a step output rather than writing it to a file.',
      language: 'yaml',
      code: `- uses: azure/login@v2
  with: { client-id: \${{ secrets.AZURE_CLIENT_ID }}, tenant-id: \${{ secrets.AZURE_TENANT_ID }},
          subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }} }
- id: kv
  run: |
    value=$(az keyvault secret show --vault-name kv-shop-test --name SmokeApiKey --query value -o tsv)
    echo "::add-mask::$value"
    echo "apikey=$value" >> "$GITHUB_OUTPUT"
- run: ./smoke.sh
  env:
    API_KEY: \${{ steps.kv.outputs.apikey }}`,
      takeaway: 'Fetch at run time with a federated identity, mask before any other command can print it, and keep the value out of files and artifacts.',
    },
    {
      title: 'The masked secret that printed anyway (a realistic mistake)',
      description:
        'A pipeline builds a connection string from a Key Vault secret, base64-encodes it for a Kubernetes Secret manifest and prints the manifest for debugging. Masking only hides the original value, so the encoded secret appears in a log retained for 30 days and readable by every project contributor. The fix: stop printing manifests, mark derived values as secret with the setvariable logging command or ::add-mask::, generate the Kubernetes Secret with the KubernetesManifest createSecret action from the masked variable, and rotate the exposed credential.',
      language: 'yaml',
      code: `# Azure Pipelines: mark a derived value as secret before anything can log it
- bash: |
    encoded=$(printf '%s' "$DB_CONN" | base64 -w0)
    echo "##vso[task.setvariable variable=dbConnB64;issecret=true]$encoded"
  env:
    DB_CONN: $(DbConnectionString)
- task: KubernetesManifest@1
  inputs:
    action: createSecret
    secretType: generic
    secretName: db-conn
    secretArguments: --from-literal=connection=$(DbConnectionString)`,
      takeaway: 'Masking protects exact values only; mark every derived form as secret and never print configuration that embeds credentials.',
    },
    {
      title: 'Certificate for code signing without exposing the private key',
      description:
        'A desktop installer must be signed. Instead of a .pfx in secure files, the team keeps the certificate in Key Vault and signs with the vault’s key using AzureSignTool, so the private key never reaches the agent; secure files are reserved for the Apple provisioning profile that the tooling requires as a file.',
      language: 'yaml',
      code: `- task: AzureCLI@2
  displayName: Sign installer via Key Vault
  inputs:
    azureSubscription: sc-build-wif
    scriptType: pscore
    scriptLocation: inlineScript
    inlineScript: |
      $token = az account get-access-token --resource https://vault.azure.net --query accessToken -o tsv
      dotnet tool install --global AzureSignTool
      AzureSignTool sign -kvu https://kv-signing.vault.azure.net -kvc contoso-codesign -kva $token \`
        -tr http://timestamp.digicert.com -v "$(Build.ArtifactStagingDirectory)/Setup.exe"
- task: DownloadSecureFile@1
  name: profile
  inputs: { secureFile: 'contoso-ios.mobileprovision' }   # file-based secret the tooling needs`,
      takeaway: 'Prefer signing and decryption inside Key Vault; use secure files only when a tool genuinely needs a file, and authorise the pipeline for them explicitly.',
    },
  ],
  keyPoints: [
    'AzureKeyVault@2 (azureSubscription, KeyVaultName, SecretsFilter, RunAsPreJob) and Key Vault-linked variable groups bring vault secrets into Azure Pipelines as masked secret variables; the identity needs Get and List or Key Vault Secrets User.',
    'In GitHub Actions, log in with OIDC and read Key Vault with the Azure CLI, masking with ::add-mask::, or better, let the deployed app read Key Vault via managed identity references.',
    'Key Vault holds secrets, keys and certificates: enable soft delete and purge protection, use RBAC at narrow scope, set expiries, automate rotation (rotation policies, Event Grid near-expiry events, CA auto-renewal) and audit through diagnostic settings.',
    'Deployment-time sensitive data: variable groups and secret variables (Azure), repository, environment and organization secrets (GitHub), secure files (encrypted files up to 10 MB via DownloadSecureFile@1); all are write-only and need pipeline authorisation.',
    'Secrets are masked only as exact values, are not automatic environment variables in Azure Pipelines (map with env:), and are withheld from fork pull request workflows.',
    'Leak-prevention design: no echo or set -x, mark derived values secret, no secrets in artifacts or caches, ephemeral runners for untrusted code, push protection and secret scanning, per-environment vaults, secretless cloud auth and short-lived tokens.',
    'When a secret leaks, rotate first, then remove it from history and logs, then add the control that would have prevented it.',
  ],
  flashcards: [
    { front: 'Which task downloads Key Vault secrets into Azure Pipelines variables and what does SecretsFilter do?', back: 'AzureKeyVault@2; SecretsFilter is * for all secrets or a comma-separated list of secret names.' },
    { front: 'What permission does the service connection identity need on the vault for AzureKeyVault@2?', back: 'Get and List on secrets (access policy) or the Key Vault Secrets User RBAC role.' },
    { front: 'How do you make a value computed in a script a masked secret in Azure Pipelines?', back: 'echo "##vso[task.setvariable variable=name;issecret=true]value".' },
    { front: 'How do you mask a value in GitHub Actions logs?', back: 'echo "::add-mask::<value>" before the value is printed.' },
    { front: 'What is the size limit of a secure file in Azure Pipelines and which task downloads it?', back: '10 MB per file; DownloadSecureFile@1 downloads it to the agent temp directory.' },
    { front: 'Are GitHub secrets available to workflows triggered by pull requests from forks?', back: 'No, secrets (other than GITHUB_TOKEN with read permissions) are not passed to fork PR workflows.' },
    { front: 'Why can a masked secret still appear in logs?', back: 'Masking matches exact values only; encoded, concatenated or substring forms are not masked.' },
    { front: 'Which Key Vault features protect against accidental or malicious deletion?', back: 'Soft delete and purge protection.' },
    { front: 'How can certificates in Key Vault renew automatically?', back: 'Through integrated certificate authorities (for example DigiCert, GlobalSign) with an auto-renewal lifetime action.' },
    { front: 'When are GitHub environment secrets released to a job?', back: 'Only after the environment’s protection rules (reviewers, wait timer) have passed.' },
    { front: 'How are secret variables exposed to scripts in Azure Pipelines?', back: 'They are not automatic; map them explicitly with env: VAR: $(secret).' },
  ],
  quiz: [
    {
      question:
        'Several Azure Pipelines across a project need the same production database connection string from Key Vault, and the security team wants a single place to control which pipelines may use it. What should you configure?',
      options: [
        'A secret variable in each pipeline’s UI',
        'A variable group linked to Key Vault with pipeline permissions and an approval check',
        'The connection string in azure-pipelines.yml with the secret keyword',
        'A secure file containing the connection string',
      ],
      correct: [1],
      explanation:
        'A Key Vault-linked variable group centralises access and is a protected resource with authorisations and checks. Per-pipeline variables scatter the secret, YAML cannot hold secrets, and secure files are for file-based material.',
    },
    {
      question:
        'A GitHub Actions workflow prints a base64-encoded Kubernetes manifest that embeds a secret retrieved from Key Vault. The raw secret is masked, yet the encoded value is visible in the logs. What is the BEST remediation?',
      options: [
        'Enable ACTIONS_STEP_DEBUG to see where the leak occurs',
        'Stop printing the manifest, mask the encoded value with ::add-mask:: and rotate the secret',
        'Move the secret to a repository variable',
        'Store the manifest as a workflow artifact instead of printing it',
      ],
      correct: [1],
      explanation:
        'Masking covers exact values only, so derived forms must be masked explicitly and the exposed credential rotated. Debug logging increases exposure, variables are not secret, and artifacts would persist the leak.',
    },
    {
      question:
        'An iOS build needs an Apple provisioning profile file during the pipeline run on a Microsoft-hosted macOS agent. Where should the file be stored?',
      options: ['In the repository under a .secrets folder', 'In the Azure Pipelines secure files library, downloaded with DownloadSecureFile@1', 'As a plain pipeline variable', 'In a public blob container'],
      correct: [1],
      explanation:
        'Secure files are encrypted at rest and only available to authorised pipelines. Repositories, plain variables and public storage expose the file.',
    },
    {
      question:
        'Which TWO settings reduce the risk of secrets leaking from a pipeline that builds pull requests from public forks? (Select two)',
      options: [
        'Keep secrets unavailable to fork builds (the default in both platforms)',
        'Require approval before running workflows for first-time contributors',
        'Use pull_request_target and check out the PR head so tests have access to secrets',
        'Store secrets as configuration variables so they are visible in logs',
      ],
      correct: [0, 1],
      explanation:
        'Withholding secrets from forks and gating first-time contributors are standard controls. pull_request_target with the PR head exposes secrets to untrusted code, and variables are not secret.',
    },
    {
      question:
        'A TLS certificate stored in Key Vault expired and took down a service. Which change prevents recurrence with the least operational effort?',
      options: [
        'Set a calendar reminder for the operations team',
        'Issue the certificate through an integrated CA with auto-renewal and alert on SecretNearExpiry or CertificateNearExpiry events',
        'Download the certificate to a secure file each month',
        'Increase the certificate validity to ten years',
      ],
      correct: [1],
      explanation:
        'Integrated CAs renew automatically and Event Grid events provide alerts. Reminders are manual, secure files do not renew anything, and long validity is not permitted by public CAs and increases risk.',
    },
    {
      question:
        'A script step in Azure Pipelines cannot read a secret variable from the pipeline UI even though the variable exists. What is the MOST likely cause?',
      options: [
        'Secret variables must be mapped explicitly into the step’s env: block.',
        'The agent must be self-hosted to read secrets.',
        'Secret variables are only available in classic pipelines.',
        'The variable must be in a variable group.',
      ],
      correct: [0],
      explanation:
        'Secret variables are not decrypted into environment variables automatically. Agent type, pipeline type and variable group membership are not the cause.',
    },
  ],
  statements: [
    { text: 'Azure Pipelines masks any substring of a secret that appears in the log.', isTrue: false, explanation: 'Only the exact secret value is masked; substrings and transformations are not.' },
    { text: 'RunAsPreJob on AzureKeyVault@2 makes the fetched secrets available to all steps in the job.', isTrue: true, explanation: 'The task then runs before the job’s steps.' },
    { text: 'Secrets stored in GitHub can be read back through the REST API by repository admins.', isTrue: false, explanation: 'Secrets are write-only; they can be listed by name and updated but not read.' },
    { text: 'Key Vault purge protection prevents a soft-deleted vault or object from being permanently deleted during the retention period.', isTrue: true, explanation: 'That is the purpose of purge protection.' },
    { text: 'Azure Pipelines secure files can be up to 10 MB each.', isTrue: true, explanation: 'The per-file limit is 10 MB.' },
    { text: 'Letting the deployed application read Key Vault through a managed identity reference removes the need for the pipeline to handle the secret value.', isTrue: true, explanation: 'The pipeline configures only the reference; the app resolves it at run time.' },
    { text: 'Enabling system.debug on a production deployment pipeline has no effect on secret exposure.', isTrue: false, explanation: 'Debug logging increases the chance that derived or environment values are printed.' },
  ],
  resources: [
    { label: 'AzureKeyVault@2 task reference', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/azure-key-vault-v2' },
    { label: 'Set secret variables in Azure Pipelines', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/process/set-secret-variables' },
    { label: 'Use secure files in Azure Pipelines', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/library/secure-files' },
    { label: 'Using secrets in GitHub Actions', url: 'https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets' },
  ],
};

import type { Concept } from '../../types';

export const infrastructureAsCodeAndConfigurationManagement: Concept = {
  id: 'infrastructure-as-code-and-configuration-management',
  title: 'Infrastructure as Code and Configuration Management Strategy',
  summary:
    'Recommending an IaC approach (Bicep, ARM templates, Terraform, Azure Verified Modules, deployment stacks) and a configuration management strategy for application infrastructure (Azure App Configuration, Key Vault, Azure Machine Configuration, DSC, Ansible), and implementing them in pipelines with what-if previews, policy, drift detection and AI assistance.',
  certs: ['az-401'],
  domains: ['az-401-3'],
  outcomes: ['az-401-3-5-1', 'az-401-3-5-2'],
  tags: ['bicep', 'terraform', 'arm-templates', 'iac', 'what-if', 'machine-configuration', 'app-configuration', 'configuration-management', 'policy-as-code'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Recommending an IaC strategy',
      body: `Infrastructure as code makes environments reproducible, reviewable and traceable. The exam expects a reasoned recommendation among the Microsoft-supported options:

| Option | Model | State | Strengths | Watch out |
|---|---|---|---|---|
| **Bicep** | Declarative, Azure-native; compiles to ARM JSON | None to manage; Azure Resource Manager holds state | Day-0 support for Azure resources, idempotent, modules, **what-if**, Azure Verified Modules, Copilot support, decompile from ARM | Azure only |
| **ARM templates** | Declarative JSON | None | Universal, every Bicep deploys as ARM | Verbose; author in Bicep instead |
| **Terraform (AzureRM / AzAPI providers)** | Declarative HCL | **State file** (store remotely in Azure Storage with locking) | Multi-cloud and SaaS providers, mature module ecosystem, plan output | State management, provider lag for new features, secrets in state |
| **Azure Deployment Stacks** | Bicep or ARM deployed as a managed unit | Tracked by the stack | Delete or detach resources removed from the template, deny-settings to block out-of-band changes | Newer feature; scope planning needed |
| **Imperative scripts** (Azure CLI, PowerShell) | Procedural | None | Glue, one-off operations, tasks IaC cannot express | Not idempotent by default; hard to review |

Recommendation heuristics: Azure-only estate with Microsoft tooling favours **Bicep** (plus Azure Verified Modules for standard patterns); multi-cloud or existing Terraform skills favour **Terraform** with remote state in Azure Storage, workload identity federation and \`terraform plan\` as a PR check; use **deployment stacks** when resources must be lifecycle-managed as a unit and protected from portal edits; wrap everything in pipelines with **what-if** or **plan** output posted to the pull request, environment approvals before \`apply\`, and **Azure Policy** (policy as code) to enforce guardrails whichever tool deploys. Copilot writes Bicep and Terraform well when given resource types and naming conventions, and the Azure MCP server or Azure CLI tooling lets agent mode validate against the real subscription, but the human still reviews the what-if diff.`,
    },
    {
      heading: 'Configuration management for application infrastructure',
      body: `Configuration management covers everything that is *not* the resource definition: application settings, feature flags, secrets, OS and middleware state on servers, and compliance settings. A coherent strategy separates them:

- **Application configuration**: **Azure App Configuration** as the central store with labels per environment, key-value references to Key Vault for secrets, feature flags with filters, and dynamic refresh in the app. Pipelines write non-secret settings there (import from a JSON or Bicep output) instead of baking them into app settings; App Service and Container Apps can also reference Key Vault secrets directly.
- **Secrets**: **Azure Key Vault**, referenced from App Configuration, App Service settings, variable groups and \`AzureKeyVault@2\`; never in IaC parameters files committed to Git (use secure parameters and \`getSecret()\` in Bicep).
- **Server and VM configuration**: **Azure Machine Configuration** (formerly Azure Policy guest configuration) audits or applies settings to Azure and Arc-enabled machines at scale using DSC-based packages, with audit, audit-and-deploy and remediation modes and compliance reporting in Azure Policy. **Azure Automation State Configuration** (classic DSC pull server) is retiring on 30 September 2027, so new designs use Machine Configuration or the DSC extension. Agent-based tools such as **Ansible**, Chef or Puppet remain valid for hybrid fleets and can run from pipelines.
- **Immutable infrastructure** as the alternative: bake configuration into images (Azure Image Builder, containers) and replace instances instead of mutating them; configuration drift then becomes a redeploy, not a remediation.
- **Container and Kubernetes configuration**: Helm values, Kustomize overlays and GitOps (Flux on AKS) reconcile the cluster to Git continuously.

Decision rule: declarative and centrally reported for anything compliance cares about (Machine Configuration, Azure Policy), externalised and environment-labelled for anything the app reads (App Configuration plus Key Vault), and immutable wherever the platform allows it.`,
    },
    {
      heading: 'Implementing IaC and configuration in pipelines',
      body: `A production-grade IaC pipeline has four stages: **validate**, **preview**, **approve**, **apply**, followed by **verify** and **drift detection**.

1. **Validate**: \`az bicep build\` or \`terraform validate\`, linters (Bicep linter rules, \`tflint\`), security scanning of templates (Microsoft Security DevOps with Template Analyzer and Checkov, or PSRule for Azure), and unit tests with \`bicep test\`-style assertions or Terraform test files.
2. **Preview**: \`az deployment group what-if\` (or \`AzureResourceManagerTemplateDeployment@3\` with \`deploymentMode: Validation\` plus a what-if step) and \`terraform plan -out\`; post the diff to the pull request so reviewers see Create, Modify, Delete per resource.
3. **Approve**: the apply stage targets an environment with approvals, Branch control and Required template checks; the service connection uses workload identity federation; Terraform's state lives in an Azure Storage backend with state locking and the plan file from the preview stage is the only input to apply.
4. **Apply**: \`az deployment group create --template-file main.bicep --parameters main.bicepparam\` or \`terraform apply plan.tfplan\`; capture outputs as pipeline variables for later stages.
5. **Verify and detect drift**: run smoke checks, then schedule what-if or \`terraform plan\` nightly and alert when the diff is non-empty; deployment stacks with deny settings and Azure Policy deny effects prevent drift in the first place.

Configuration follows the same path: App Configuration key-values imported from a versioned file per environment, Machine Configuration assignments deployed as Bicep (\`Microsoft.GuestConfiguration/guestConfigurationAssignments\`) or Azure Policy assignments, and Kubernetes configuration reconciled by Flux. Copilot accelerates each step (writing the Bicep module, explaining a what-if diff, converting a parameters JSON to .bicepparam), and an agentic workflow can open a pull request when nightly drift is detected, with the deterministic policy still deciding what may be applied.`,
    },
    {
      heading: 'Exam angle and common traps',
      body: `Questions in this skill area tend to present a constraint and ask for the tool or the step:

- "Azure-only, no state files to manage, preview changes before deployment" points to **Bicep with what-if**.
- "Also provisions resources in another cloud or a SaaS provider" points to **Terraform**, and the follow-up trap is state: store it remotely in Azure Storage with locking and protect it like a secret.
- "Resources deleted from the template must be removed and portal changes blocked" points to **deployment stacks** with deny settings.
- "Audit TLS settings on all VMs including on-premises Arc servers" points to **Azure Machine Configuration** through Azure Policy, not to a pipeline script.
- "Change a setting across environments without redeploying, and toggle features" points to **Azure App Configuration** with labels and feature flags.
- "Secrets must not appear in the repository" points to **Key Vault references** and secure parameters, never to encrypted files in Git.
- "Automation State Configuration" in a new design is wrong because of the 2027 retirement.

Also watch wording about idempotency (Bicep and Terraform are idempotent, scripts are not unless written to be), about Copilot (it drafts templates and explains diffs, but a reviewer approves the what-if), and about environments (apply stages belong behind approvals, previews belong on pull requests).`,
    },
  ],
  examples: [
    {
      title: 'Bicep pipeline with what-if on the pull request and approval before apply',
      description:
        'The platform team’s infrastructure repository validates and previews every pull request, and applies only from main after an environment approval. Copilot generated the first version of the YAML from a description of these stages; the team added the Required template check on the service connection.',
      language: 'yaml',
      code: `stages:
  - stage: Preview
    jobs:
      - job: whatif
        steps:
          - task: AzureCLI@2
            inputs:
              azureSubscription: sc-infra-wif
              scriptType: bash
              scriptLocation: inlineScript
              inlineScript: |
                az bicep build --file infra/main.bicep
                az deployment group what-if -g rg-shop-prod --template-file infra/main.bicep \\
                  --parameters infra/prod.bicepparam | tee $(Build.ArtifactStagingDirectory)/whatif.txt
          - { publish: $(Build.ArtifactStagingDirectory)/whatif.txt, artifact: whatif }
  - stage: Apply
    dependsOn: Preview
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: apply
        environment: infra-prod          # approvals + Branch control live here
        strategy: { runOnce: { deploy: { steps: [ { task: AzureResourceManagerTemplateDeployment@3,
            inputs: { deploymentScope: Resource Group, azureResourceManagerConnection: sc-infra-wif,
            resourceGroupName: rg-shop-prod, location: westeurope, csmFile: infra/main.bicep,
            csmParametersFile: infra/prod.bicepparam, deploymentOutputs: infraOutputs } } ] } } }`,
      takeaway: 'Preview on the PR, apply from main behind an environment approval, and feed deploymentOutputs to the application stages instead of hard-coding names.',
    },
    {
      title: 'Terraform in GitHub Actions with OIDC and remote state',
      description:
        'A multi-cloud team keeps Terraform state in an Azure Storage account with blob leasing for locks, authenticates with OIDC (no client secret) and posts the plan as a PR comment; apply runs only on main in the production environment.',
      language: 'yaml',
      code: `permissions: { id-token: write, contents: read, pull-requests: write }
env:
  ARM_USE_OIDC: true
  ARM_CLIENT_ID: \${{ secrets.AZURE_CLIENT_ID }}
  ARM_TENANT_ID: \${{ secrets.AZURE_TENANT_ID }}
  ARM_SUBSCRIPTION_ID: \${{ secrets.AZURE_SUBSCRIPTION_ID }}
jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform init -backend-config="storage_account_name=sttfstate" -backend-config="container_name=tfstate" -backend-config="key=shop.tfstate" -backend-config="use_oidc=true"
      - run: terraform plan -out plan.tfplan -no-color | tee plan.txt
      - uses: actions/upload-artifact@v4
        with: { name: plan, path: plan.tfplan }
  apply:
    needs: plan
    if: github.ref == 'refs/heads/main'
    environment: production
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with: { name: plan }
      - run: terraform apply -auto-approve plan.tfplan`,
      takeaway: 'Remote locked state, OIDC instead of secrets, and applying the exact plan that was reviewed are the three Terraform controls the exam looks for.',
    },
    {
      title: 'Secrets in a parameters file (a realistic mistake)',
      description:
        'A developer asks Copilot to "add the SQL admin password to prod.parameters.json" and commits it. Secret scanning blocks the push, but a copy exists in a fork. The remediation: rotate the password, mark the Bicep parameter @secure(), read it with getSecret() from Key Vault in the .bicepparam file (or pass it from a Key Vault-linked variable group), and add a Checkov or PSRule check in the Preview stage that fails on plaintext secrets.',
      language: 'text',
      code: `// main.bicep
@secure()
param sqlAdminPassword string

// prod.bicepparam
using 'main.bicep'
param sqlAdminPassword = az.getSecret('<subId>', 'rg-shared', 'kv-shop-prod', 'sqlAdminPassword')`,
      takeaway: 'Secure parameters plus Key Vault references keep secrets out of Git; scanning in the pipeline catches the mistake before it reaches main.',
    },
    {
      title: 'Auditing TLS on every server with Machine Configuration',
      description:
        'Security requires TLS 1.2 or later on 600 Windows servers, half of them on-premises and connected through Azure Arc. Instead of a pipeline script that runs once, the team authors a Machine Configuration package, publishes it, and assigns an Azure Policy in audit mode first, then audit-and-deploy after reviewing compliance results.',
      language: 'powershell',
      code: `# Build and publish the configuration package (DSC-based)
New-GuestConfigurationPackage -Name 'EnforceTls12' -Configuration ./EnforceTls12/localhost.mof -Type AuditAndSet
Publish-GuestConfigurationPackage -Path ./EnforceTls12.zip -ResourceGroupName rg-mc -StorageAccountName stmcpackages
# Create a policy definition and assign it in audit mode to the subscription
New-GuestConfigurationPolicy -PolicyId (New-Guid) -ContentUri $uri -DisplayName 'TLS 1.2 required' -Path ./policy -Platform Windows -PolicyVersion 1.0.0 -Mode ApplyAndMonitor
New-AzPolicyDefinition -Name 'tls12-required' -Policy ./policy/EnforceTls12_DeployIfNotExists.json`,
      takeaway: 'Machine Configuration applies and reports configuration continuously across Azure and Arc machines; a pipeline script would only check once.',
    },
  ],
  keyPoints: [
    'Bicep: Azure-native, idempotent, no state file, modules, what-if preview, Azure Verified Modules, decompile from ARM; recommended for Azure-only estates.',
    'Terraform: multi-cloud with HCL and a state file that must be stored remotely (Azure Storage with locking) and protected; plan on PR, apply the saved plan behind approval.',
    'Deployment stacks manage Bicep or ARM resources as a unit, remove resources dropped from the template and can deny out-of-band changes.',
    'Configuration strategy: Azure App Configuration (labels, feature flags, Key Vault references) for app settings, Key Vault for secrets, Azure Machine Configuration via Azure Policy for server state, immutable images or GitOps where possible.',
    'Azure Automation State Configuration retires on 30 September 2027; new designs use Azure Machine Configuration (or the DSC extension).',
    'IaC pipeline shape: validate (build, lint, scan), preview (what-if or plan posted to the PR), approve (environment checks, WIF or OIDC), apply, verify and nightly drift detection.',
    'Never commit secrets in parameters files; use @secure() parameters, getSecret() from Key Vault in .bicepparam, Key Vault-linked variable groups and template scanning.',
    'Copilot drafts Bicep and Terraform and explains diffs; a human reviews the what-if or plan before apply.',
  ],
  flashcards: [
    { front: 'Which IaC language is Azure-native, has no state file and supports what-if?', back: 'Bicep (compiled to ARM templates).' },
    { front: 'Where should Terraform state be stored for Azure pipelines?', back: 'Remotely in an Azure Storage account backend with state locking, accessed with workload identity or OIDC.' },
    { front: 'What does the what-if operation show?', back: 'The resources that would be created, modified or deleted and the property changes, before deployment.' },
    { front: 'What do Azure deployment stacks add over a plain Bicep deployment?', back: 'Lifecycle management as a unit: removing resources dropped from the template and deny settings that block out-of-band changes.' },
    { front: 'Which service audits or applies OS settings across Azure and Arc-enabled machines?', back: 'Azure Machine Configuration (formerly Azure Policy guest configuration), orchestrated by Azure Policy.' },
    { front: 'When does Azure Automation State Configuration retire?', back: '30 September 2027; migrate to Azure Machine Configuration.' },
    { front: 'How do you keep a secret out of a Bicep parameters file?', back: 'Declare the parameter @secure() and use az.getSecret() in the .bicepparam file to pull it from Key Vault.' },
    { front: 'Which Azure service centralises application settings and feature flags with per-environment labels?', back: 'Azure App Configuration.' },
    { front: 'Which Azure Pipelines task deploys ARM or Bicep templates?', back: 'AzureResourceManagerTemplateDeployment@3 (or AzureCLI@2 with az deployment commands).' },
    { front: 'What is drift detection in IaC?', back: 'Periodically running what-if or terraform plan and alerting when the live environment differs from the code.' },
  ],
  quiz: [
    {
      question:
        'Contoso deploys only to Azure and wants reviewers to see exactly which resources a change will create, modify or delete before approval, without managing state files. Which approach should you recommend?',
      options: ['Terraform with local state', 'Bicep with az deployment group what-if in the pull request pipeline', 'Azure CLI scripts run from a release pipeline', 'ARM templates edited in the Azure portal'],
      correct: [1],
      explanation:
        'Bicep has no state to manage and what-if provides the preview. Terraform adds state, scripts are imperative, and portal edits are not code.',
    },
    {
      question:
        'A team uses Terraform for Azure and AWS resources. A pipeline run failed because two engineers ran apply simultaneously and corrupted state. What should you change?',
      options: [
        'Commit the terraform.tfstate file to Git after every apply.',
        'Store state in an Azure Storage backend with locking and run apply only from the pipeline behind an environment approval.',
        'Switch to Bicep for the AWS resources.',
        'Run terraform apply with -parallelism=1.',
      ],
      correct: [1],
      explanation:
        'Remote state with locking and a single controlled apply path prevents concurrent writes. State in Git leaks secrets and does not lock, Bicep cannot deploy AWS, and parallelism controls resource creation within one run.',
    },
    {
      question:
        'Security must verify that every Windows server, including on-premises servers connected through Azure Arc, has a required registry setting and report compliance centrally. Which solution is MOST appropriate?',
      options: [
        'A PowerShell step in the nightly build pipeline',
        'Azure Machine Configuration assigned through Azure Policy',
        'Azure App Configuration with a feature flag',
        'A deployment stack with deny settings',
      ],
      correct: [1],
      explanation:
        'Machine Configuration audits and remediates guest OS settings on Azure and Arc machines with Policy compliance reporting. Pipeline scripts are one-off, App Configuration is for app settings, and deployment stacks govern Azure resources rather than OS state.',
    },
    {
      question:
        'Which TWO practices keep secrets out of an IaC repository while still allowing automated deployment? (Select two)',
      options: [
        'Mark the Bicep parameter @secure() and reference Key Vault with getSecret() in the .bicepparam file',
        'Use a Key Vault-linked variable group to supply the value at run time',
        'Base64-encode the password in the parameters file',
        'Store the password in a pipeline variable that is not marked secret',
      ],
      correct: [0, 1],
      explanation:
        'Secure parameters with Key Vault references and Key Vault-linked variable groups keep the value out of Git and masked. Encoding is not encryption and unmarked variables are visible in logs.',
    },
    {
      question:
        'An operations team wants resources removed from the Bicep template to be deleted automatically and portal edits to those resources blocked. What should they use?',
      options: ['Azure deployment stacks with deny settings', 'What-if validation', 'Azure Automation State Configuration', 'Resource locks on each resource'],
      correct: [0],
      explanation:
        'Deployment stacks track managed resources, clean up removed ones and support deny settings. What-if only previews, State Configuration manages OS state and is retiring, and resource locks do not remove orphaned resources.',
    },
    {
      question:
        'A new project proposes Azure Automation State Configuration as its DSC pull server for VM configuration. What should you advise?',
      options: [
        'Proceed; it is the current recommended service.',
        'Use Azure Machine Configuration instead, because Automation State Configuration retires on 30 September 2027.',
        'Use Azure App Configuration instead.',
        'Use deployment slots instead.',
      ],
      correct: [1],
      explanation:
        'The retirement date makes State Configuration unsuitable for new designs; Machine Configuration is the successor. App Configuration and slots address different problems.',
    },
  ],
  statements: [
    { text: 'Bicep files are idempotent, so deploying the same file repeatedly yields the same resource state.', isTrue: true, explanation: 'Idempotency is a core property of Bicep and ARM deployments.' },
    { text: 'Terraform requires no state management when targeting Azure.', isTrue: false, explanation: 'Terraform always keeps state; for Azure store it remotely in Azure Storage with locking.' },
    { text: 'The what-if operation changes resources in Azure.', isTrue: false, explanation: 'It previews changes without deploying.' },
    { text: 'Azure Machine Configuration can target Arc-enabled servers outside Azure.', isTrue: true, explanation: 'It supports Azure VMs and Arc-enabled machines.' },
    { text: 'Azure App Configuration can reference secrets stored in Key Vault.', isTrue: true, explanation: 'Key Vault references keep secret values in the vault while App Configuration holds the pointer.' },
    { text: 'Decompiling an ARM template to Bicep is not supported.', isTrue: false, explanation: 'az bicep decompile converts ARM JSON to Bicep.' },
    { text: 'Posting a what-if or plan diff on the pull request is a recommended IaC review practice.', isTrue: true, explanation: 'Reviewers approve the concrete change set rather than inferring it from code.' },
  ],
  resources: [
    { label: 'What is Bicep?', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview' },
    { label: 'Bicep deployment what-if operation', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-what-if' },
    { label: 'Terraform on Azure overview', url: 'https://learn.microsoft.com/en-us/azure/developer/terraform/overview' },
    { label: 'Azure Machine Configuration overview', url: 'https://learn.microsoft.com/en-us/azure/governance/machine-configuration/overview' },
  ],
};

import type { Concept } from '../../types';

export const almSolutionsPipelines: Concept = {
  id: 'alm-solutions-pipelines',
  title: 'ALM for Agents: Solutions, Environment Variables and Power Platform Pipelines',
  summary:
    'How agents move from development to production: Power Platform solutions as the carrier for agents and their dependencies, managed versus unmanaged layers, environment variables and connection references that make a solution portable, and pipelines (including delegated deployments and extensions) that automate and govern promotion between environments.',
  certs: ['ab-620'],
  domains: ['ab-620-3'],
  outcomes: ['ab-620-3-2-1', 'ab-620-3-2-2', 'ab-620-3-2-3', 'ab-620-3-2-4'],
  tags: ['copilot-studio', 'alm', 'solutions', 'environment-variables', 'pipelines', 'power-platform', 'devops'],
  difficulty: 'advanced',
  diagram: 'agentic-sdlc',
  sections: [
    {
      heading: 'Solutions as the carrier for agents',
      body: `Every Copilot Studio agent is created inside a **Power Platform solution** in a Dataverse environment. By default it lands in the **Default solution**, which cannot be exported, so for ALM you create a **custom solution** with your own **publisher** (prefix) and either set it as the **preferred solution** (so new agents land there) or **Add existing > Agent** to move agents in. The solution explorer is reachable from the agent (**... > View solution**, or **Import agent** and **Export agent**) and from the side bar (**... > Solutions**); it inherits your Dataverse security roles, so you need at least **System Customizer**.

Key properties of solutions on the exam:

- **Unmanaged** solutions are for development; you edit components directly. **Managed** solutions are the deployable artefact: you export as managed from development and import into test and production, where the components are locked and layered. You cannot export a managed solution; if you converted yours, create a new unmanaged one.
- **Solution layers**: a managed agent in production can acquire an **unmanaged layer** if someone edits it there; **Remove unmanaged layer** (Agents > ... > Advanced > See solution layers) restores the managed behaviour.
- **Dependencies** must travel with the agent: topics, knowledge, tools, agent flows, prompts, custom connectors, connection references and environment variables. Use **Advanced > Add required objects** on the agent and on flows to pull them in.
- **Import order**: custom connectors first, then the connection references with the agent solution.
- Some things do not export: topic and node comments, the agent icon, channel configuration, environment-specific IDs. After import you must **reconfigure authentication** and **publish** before sharing. Topic names with periods block export, and removing components directly from the solution rather than through the authoring UI breaks export and import.

**Upgrade or update** a solution when deploying a new version; **upgrade** removes components deleted in the source, **update** leaves them. Agent flows have their own drafts and versioning inside solutions.`,
    },
    {
      heading: 'Environment variables and connection references',
      body: `**Environment variables** separate configuration from logic. Each has a **definition** (schema name, display name, data type: text, decimal, JSON, yes/no, data source, secret) and a **value** that can differ per environment. In Copilot Studio you reference them in Power Fx with the **\`Environment.\`** prefix, and **secret** variables can point to **Azure Key Vault** so tokens and keys never sit in the solution.

ALM rules that the exam tests:

- Add environment variables to the solution (**Add existing > More > Environment variable**) and then **Add required objects** so dependencies are complete.
- Before exporting, **remove the current value** from the variable (**... > Remove from this solution** under Current Value). The development value stays in development, and the importer (or pipeline) supplies the target value. If a value is included, it is applied on first import and ignored on later ones unless the target has no value.
- Pipelines **prompt for environment variable values and connections up front** and validate them before deploying, so no post-import editing is needed.
- Connections themselves do not travel; **connection references** in the solution are bound to connections in the target environment during import or by the pipeline, and existing references without a value cannot be updated during deployment, only populated.
- Changing a value takes effect for agents, apps and flows without redeploying the solution.

Typical uses in agents: API base URLs that differ between test and production, SharePoint site URLs for knowledge, tenant-specific IDs, feature flags as yes/no, and Key Vault secrets for HTTP node headers and computer use credentials.`,
    },
    {
      heading: 'Power Platform pipelines',
      body: `**Pipelines** bring CI/CD into the platform without external tooling. An admin installs the **Power Platform Pipelines** app in a **host** environment (a production-type environment), then creates a pipeline with **development** environments and **target** stages (for example Test, then Production). Makers run the pipeline from their unmanaged solution (**Pipelines** in the Copilot Studio solution explorer, or the solution in Power Apps); pipelines cannot be run from the default solution, managed solutions or target environments. The system exports managed and unmanaged artefacts, stores them in the host, **pre-validates** dependencies against the target, collects connections and environment variable values, and deploys the **same managed artefact** through each stage in order so nothing can skip QA.

Requirements and facts:

- Target environments must be **managed environments** (the host need not be; development environments may be Developer type). From October 2026 admins are notified when a pipeline deploys to an unmanaged target and must enable managed environments within 30 days.
- The deploying identity owns the deployed objects. With **delegated deployments**, a **service principal** or the **pipeline stage owner** performs the deployment so makers need no access to production; an approval from an authorised identity is required.
- Pipelines deploy solutions plus connections, connection references and environment variables, never Dataverse table data.
- Developers can list and run pipelines from the **Power Platform CLI** (\`pac pipeline\`), and view diffs between layers in the target.
- Pipelines complement rather than replace **Azure DevOps**, **GitHub** and the **ALM Accelerator**; Copilot Studio also supports GitHub-backed source control and deploy-from-Git with audit trails, and the **Copilot Studio extension for Visual Studio Code** can clone and edit agent components.`,
    },
    {
      heading: 'Extending pipelines, and the exam angle',
      body: `Pipelines emit **Dataverse business events** at the start and end of each step, which you subscribe to with the Dataverse connector's **When an action is performed** trigger (catalog Microsoft Dataverse Common, category Power Platform Pipelines) in cloud flows in the host environment: \`OnDeploymentRequested\`, \`OnApprovalStarted\`, \`OnApprovalCompleted\`, \`OnPreDeploymentStarted\`, \`OnPreDeploymentCompleted\`, \`OnDeploymentStarted\`, \`OnDeploymentCompleted\`. Use **trigger conditions** such as \`@equals(triggerOutputs()?['body/OutputParameters/DeploymentStageName'], 'Contoso UAT')\` to target one pipeline or stage.

**Gated extensions** insert pending steps that your logic must complete or reject with **Perform an unbound action** (status **20** completes, **30** rejects, with maker-facing comments):

- **Pre-export step required** (\`UpdatePreExportStepStatus\`): validation before the solution is exported, for the first stage only, for example running the agent evaluation set or a solution checker.
- **Is delegated deployment** (\`UpdateApprovalStatus\`): routes the deployment through an approval and performs it as the service principal or stage owner.
- **Pre-deployment step required** (\`UpdatePreDeploymentStepStatus\`): a final gate after approval, such as a change-advisory sign-off.

Exam cues: "makers must not have access to production" means **delegated deployment with a service principal**; "require an approval before production" means **Is delegated deployment** or **Pre-deployment step** with an approvals flow; "run tests automatically before export" means **Pre-export step** with a flow that calls the evaluation API; "different API URL in test and production" means an **environment variable** with the current value removed before export; "the agent imported but tools fail" means **reconfigure authentication, bind connection references, publish**; "changes made directly in production were lost on the next deployment" means an **unmanaged layer** was removed, which is correct behaviour; "cannot see the pipeline" means you are not in a linked development environment or an unmanaged solution.

Distractors: exporting managed from production back to development, storing secrets as text environment variables, adding the agent to a solution without **Add required objects**, or expecting pipelines to move Dataverse data.`,
    },
  ],
  examples: [
    {
      title: 'Preparing an agent solution for export',
      description:
        'A developer has an HR agent, two agent flows, a custom connector to the payroll API and a prompt, all created in the Default solution. They create the custom solution Contoso HR Agents with publisher contoso, set it as preferred, Add existing > Agent, then Advanced > Add required objects on the agent and on each flow, add the custom connector and the PayrollApiBaseUrl environment variable, remove the variable\'s current value, and export as managed. In the test environment they import the custom connector solution first, then the agent solution, supply the test URL and connections, reconfigure authentication and publish.',
      code: `Solution: Contoso HR Agents (publisher: contoso, version 1.2.0.0, managed export)
  Agents:                 HR Assistant                 [Add required objects applied]
  Agent flows:            Get leave balance, Submit leave request
  Prompts:                Classify HR request
  Custom connectors:      contoso_PayrollApi           (imported first in target)
  Connection references:  contoso_PayrollApiRef, contoso_SharePointRef
  Environment variables:  contoso_PayrollApiBaseUrl  (Text, current value removed before export)
                          contoso_PayrollApiKey      (Secret -> Azure Key Vault)`,
      language: 'text',
      takeaway: 'Custom solution plus complete dependencies, portable environment variables and connection references is what makes an agent deployable.',
    },
    {
      title: 'The hard-coded URL (a realistic mistake)',
      description:
        'A topic\'s HTTP request node calls https://api-test.contoso.com directly. After deployment to production the agent still talks to the test API. The fix is a text environment variable Environment.PayrollApiBaseUrl referenced in the node URL, with the test value removed before export so the pipeline prompts for the production value. A second variable of type secret replaces the API key that had been pasted into the header.',
      code: `// HTTP request node URL (Formula)
Concatenate(Environment.PayrollApiBaseUrl, "/v1/leave/balance")

// Header: Authorization (Formula)
Concatenate("Bearer ", Environment.PayrollApiKey)`,
      language: 'text',
      takeaway: 'Anything that differs between environments belongs in an environment variable, and secrets belong in Key Vault-backed secret variables.',
    },
    {
      title: 'Gating production with an approval and a service principal',
      description:
        'Security requires that no maker has access to the production environment and that a release manager approves every production deployment. The admin creates a pipeline Dev > Test > Prod in the host environment, enables Is delegated deployment on the Prod stage with a service principal, and builds a cloud flow on OnApprovalStarted that posts a Teams approval to the release manager and then calls Perform an unbound action UpdateApprovalStatus with 20 (approve) or 30 (reject) and comments.',
      code: `Trigger: Dataverse - When an action is performed
  Catalog: Microsoft Dataverse Common   Category: Power Platform Pipelines
  Action name: OnApprovalStarted
  Trigger condition: @equals(triggerOutputs()?['body/OutputParameters/DeploymentStageName'], 'Prod')
Action: Start and wait for an approval (release manager)
Condition: Outcome = Approve
  Yes -> Perform an unbound action: UpdateApprovalStatus
           ApprovalStatus: 20   ApprovalComments: "Approved by release management"
  No  -> Perform an unbound action: UpdateApprovalStatus
           ApprovalStatus: 30   ApprovalComments: "Rejected: see change ticket CHG-4471"`,
      language: 'text',
      takeaway: 'Delegated deployments plus pipeline business events give approval-gated, service-principal-executed releases without external tooling.',
    },
    {
      title: 'Automatic evaluation before export',
      description:
        'The team enables the Pre-export step required extension on the Dev stage. A flow on OnDeploymentRequested calls the Power Platform API to run the agent\'s regression test set, waits for completion, and completes the step with UpdatePreExportStepStatus 20 if the pass rate is at least 90 percent, otherwise 30 with the failing case names in the comments the maker sees in run history.',
      takeaway: 'Pre-export gates turn agent evaluation into an enforced quality bar at the start of every deployment.',
    },
  ],
  keyPoints: [
    'Agents are created in a solution; create a custom solution with your own publisher and set it as preferred or Add existing > Agent, then Add required objects to pull in dependencies.',
    'Unmanaged solutions are for development and export; managed solutions are imported into test and production; managed solutions cannot be exported; remove unmanaged layers in production to restore managed behaviour.',
    'Import custom connectors first, then the agent solution with connection references; after import reconfigure authentication and publish before sharing; comments, icon and channel settings do not transfer.',
    'Environment variables (text, decimal, JSON, yes/no, data source, secret via Key Vault) are referenced as Environment.name; remove the current value before export so targets supply their own.',
    'Connection references bind to target-environment connections during import or pipeline deployment; connections themselves never travel.',
    'Pipelines run from an unmanaged solution in a linked development environment, pre-validate, collect connections and variable values, store artefacts in the host and deploy the same managed artefact through every stage; targets must be managed environments.',
    'Delegated deployments run as a service principal or stage owner with approval so makers need no production access; pac pipeline exposes pipelines to the CLI.',
    'Extend pipelines with Dataverse business events (OnDeploymentRequested, OnApprovalStarted, OnPreDeploymentStarted, OnDeploymentCompleted and others) and gated extensions completed with unbound actions (20 complete, 30 reject).',
  ],
  flashcards: [
    { front: 'Why can you not export an agent that lives in the Default solution?', back: 'The Default solution cannot be exported; create a custom solution with your own publisher and add the agent (and required objects) to it.' },
    { front: 'Which solution type is imported into test and production?', back: 'Managed. Unmanaged is for development; managed solutions cannot be re-exported.' },
    { front: 'What should you do to an environment variable before exporting a solution?', back: 'Remove its current value from the solution so the target environment or pipeline supplies its own value.' },
    { front: 'How do you reference an environment variable in Copilot Studio Power Fx?', back: 'With the Environment. prefix, for example Environment.PayrollApiBaseUrl.' },
    { front: 'In which order do you import custom connectors and the agent solution?', back: 'Custom connectors first, then the connection references with the agent solution.' },
    { front: 'What must be true of pipeline target environments?', back: 'They must be managed environments (the host need not be; development can be Developer type).' },
    { front: 'From where can a maker run a pipeline?', back: 'From an unmanaged solution in a linked development environment (Copilot Studio solution explorer > Pipelines or Power Apps), not from the default solution, managed solutions or targets.' },
    { front: 'What does a delegated deployment do?', back: 'Performs the deployment as a service principal or pipeline stage owner after approval, so makers need no access to the target environment.' },
    { front: 'Which status values complete or reject a gated pipeline step?', back: '20 completes the step; 30 rejects it (10 is the system-set pending status).' },
    { front: 'Which trigger fires for every pipeline deployment?', back: 'OnDeploymentRequested, via the Dataverse When an action is performed trigger.' },
    { front: 'What happens to edits made directly to a managed agent in production?', back: 'They create an unmanaged layer that overrides the managed component; Remove unmanaged layer restores the deployed version.' },
  ],
  quiz: [
    {
      question:
        'A developer built an agent in the Default solution and now needs to move it to a test environment. What should they do FIRST?',
      options: [
        'Export the Default solution as managed',
        'Create a custom solution with a publisher, add the existing agent and its required objects',
        'Share the agent with users in the test environment',
        'Run the pipeline from the Default solution',
      ],
      correct: [1],
      explanation:
        'The Default solution cannot be exported or used with pipelines; agents must be in a custom solution with their dependencies. Sharing does not move an agent between environments.',
    },
    {
      question:
        'An agent\'s HTTP request node must call a different API URL in test and production without editing the agent after deployment. Which approach is correct?',
      options: [
        'Hard-code the production URL and change it after import',
        'Create a text environment variable, reference it as Environment.ApiBaseUrl, and remove its current value before export',
        'Store the URL in a global variable set in Conversation Start',
        'Create two agents, one per environment',
      ],
      correct: [1],
      explanation:
        'Environment variables with the value removed before export let each environment supply its own value, which pipelines collect up front. Hard-coding requires post-import edits (and creates unmanaged layers), global variables are per session not per environment, and duplicating agents defeats ALM.',
    },
    {
      question:
        'Security policy forbids makers from having any access to the production environment, yet they must be able to request deployments. Which pipeline feature satisfies this?',
      options: [
        'Pre-export step required',
        'Is delegated deployment with a service principal',
        'Running pac pipeline deploy from the maker\'s workstation',
        'Granting makers the Deployment Pipeline Administrator role',
      ],
      correct: [1],
      explanation:
        'Delegated deployments perform the deployment as a service principal or stage owner after approval, so makers need no production privileges. Pre-export gates validate before export, the CLI still uses the caller\'s identity, and the admin role grants more access rather than less.',
    },
    {
      question:
        'Which TWO statements about solutions and agents are correct? (Select two)',
      options: [
        'Custom connectors should be imported before the connection references and agent solution',
        'Topic and node comments are exported with the agent',
        'After importing an agent you must reconfigure authentication and publish before sharing it',
        'A managed solution can be exported from production to seed a new development environment',
      ],
      correct: [0, 2],
      explanation:
        'Import order and post-import reconfiguration are documented requirements. Comments do not export, and managed solutions cannot be exported.',
    },
    {
      question:
        'You need every production deployment to wait for a release manager\'s approval and to be rejected automatically if the agent\'s evaluation pass rate is below 90 percent. Which combination should you configure?',
      options: [
        'A Pre-export step flow on OnDeploymentRequested that runs the evaluation, plus delegated deployment approval on the production stage',
        'A data policy blocking deployments and a manual checklist',
        'An unmanaged layer in production that disables the agent until approved',
        'Environment variables for the pass rate threshold only',
      ],
      correct: [0],
      explanation:
        'Gated extensions provide both gates: Pre-export step for automated validation and Is delegated deployment for approvals, completed or rejected with unbound actions. Data policies do not govern deployments, unmanaged layers are an anti-pattern, and a variable alone enforces nothing.',
    },
  ],
  statements: [
    { text: 'Agents created in Copilot Studio are automatically placed in a solution.', isTrue: true, explanation: 'They land in the Default solution unless a preferred custom solution is set.' },
    { text: 'You can export a managed solution to move an agent to another environment.', isTrue: false, explanation: 'Only unmanaged solutions can be exported; the export can produce a managed artefact for import.' },
    { text: 'Pipelines deploy Dataverse table data along with the solution.', isTrue: false, explanation: 'Pipelines deploy solutions, connections, connection references and environment variables, never table data.' },
    { text: 'The same managed artefact exported once is deployed through each pipeline stage in order.', isTrue: true, explanation: 'This prevents bypassing QA or approval stages.' },
    { text: 'Removing an agent from a solution also removes its components from the solution.', isTrue: false, explanation: 'Components must be removed separately; removing them directly can break export and import.' },
    { text: 'Pipeline extensions are built with the Dataverse connector trigger When an action is performed in the host environment.', isTrue: true, explanation: 'Actions such as OnDeploymentRequested and OnApprovalStarted are available under the Power Platform Pipelines category.' },
    { text: 'Secret environment variables store their values inside the solution file.', isTrue: false, explanation: 'Secret variables reference Azure Key Vault; the value never sits in the solution.' },
  ],
  resources: [
    { label: 'Create and manage solutions in Copilot Studio', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-overview' },
    { label: 'Export and import agents using solutions', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-import-export' },
    { label: 'Environment variables for Power Platform overview', url: 'https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables' },
    { label: 'Extend pipelines in Power Platform', url: 'https://learn.microsoft.com/en-us/power-platform/alm/extend-pipelines' },
  ],
};

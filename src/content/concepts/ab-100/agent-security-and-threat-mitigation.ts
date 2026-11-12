import type { Concept } from '../../types';

export const agentSecurityAndThreatMitigation: Concept = {
  id: 'agent-security-and-threat-mitigation',
  title: 'Agent Security, Model Security and Threat Mitigation',
  summary:
    'Designing layered security for agentic solutions: identity and authentication for agents (Entra Agent ID, Conditional Access, agent users), least-privilege access to grounding data and model tuning, model security in Foundry (RBAC, guardrails, network controls), and analysing vulnerabilities such as prompt injection, data exfiltration and tool abuse with concrete mitigations across Copilot Studio, Microsoft 365 Copilot and Foundry.',
  certs: ['ab-100'],
  domains: ['ab-100-3'],
  outcomes: ['ab-100-3-4-1', 'ab-100-3-4-3', 'ab-100-3-4-4', 'ab-100-3-4-7'],
  tags: ['security', 'entra-agent-id', 'prompt-injection', 'prompt-shields', 'content-safety', 'dlp', 'rbac', 'least-privilege'],
  difficulty: 'advanced',
  diagram: 'layered-guardrails',
  sections: [
    {
      heading: 'Designing security for agents: identity first',
      body: `An agent is a new kind of principal, so agent security starts with **who the agent is** and **whose permissions it uses**.

- **Access patterns.** An agent can act *on behalf of the signed-in user* (most Copilot Studio and Microsoft 365 Copilot agents; knowledge and tools run with end-user credentials by default), with *its own agent identity* (service-principal style, for autonomous agents), or with an *agent user account* (an Entra identity with mailbox and Teams presence, in preview, so the agent can own a process end to end). Each pattern changes what Conditional Access, auditing and least privilege mean.
- **Microsoft Entra Agent ID** gives agents purpose-built identities: **agent identity blueprints** as templates with parent-child relationships, agent identities and agent users, owners and sponsors, OAuth 2.0 tokens, support for MCP and A2A, and integration of non-Microsoft agents through the Auth SDK or workload identity federation. Copilot Studio agents can automatically receive an Entra agent identity; to reach Dataverse data an **Entra agent user** is associated and assigned security roles. **Conditional Access for agents** evaluates agent and user context, device, location and risk; **Identity Protection** flags risky agents; **ID Governance** applies access packages, inactivity policies and lifecycle.
- **Authentication choices in Copilot Studio.** Authenticate with Microsoft (default) for employee agents, manual Entra ID with certificates for custom scenarios, and *no authentication* only for genuinely public content. The **security scan** warns before publishing when defaults change: no authentication, **maker-provided credentials** on connectors (every user then acts as the maker), or sharing with everyone in the organisation. **Agent runtime protection status** (Protected, Needs review, Unknown) summarises authentication, policies and content moderation per published agent.
- **Governance controls that double as security**: data policies (connector classification Business, Non-business, Blocked; HTTP request and trigger restrictions), knowledge-source rules, channel publishing controls, connected-agent access, and **Microsoft Agent 365** as the control plane with Entra network egress and ingress controls and Defender signals.
- **Secrets and endpoints**: store keys in Azure Key Vault referenced by environment variables, prefer Entra authentication over API keys for Foundry (keys bypass RBAC), and use customer-managed keys where policy requires.

Design principle for the exam: *the agent must never have more access than the least-privileged human who would otherwise do the task, and its actions must be attributable.*`,
    },
    {
      heading: 'Access controls on grounding data and model tuning',
      body: `**Grounding data.** Copilot and Copilot Studio retrieve knowledge with the end user's identity, so the first control is **permission hygiene** in the sources: SharePoint and OneDrive sharing reviews (Microsoft Purview oversharing assessments, SharePoint Advanced Management, Restricted Content Discovery; the older Restricted SharePoint Search is a temporary allow-list that is retiring), Dataverse **security roles**, column-level security and record ownership for Dataverse knowledge and MCP tools, finance and operations security roles for virtual entities and the ERP MCP server. The second control is **scope at the agent**: attach specific folders, tables or indexes rather than whole sites; use the **Knowledge sources for agents** rule in the Power Platform admin center to allow or deny SharePoint and OneDrive sites, public websites and file uploads per environment group; apply **sensitivity labels** so labelled content is protected or excluded (Purview labels are honoured for SharePoint and OneDrive knowledge). For Azure AI Search indexes used by Foundry agents, implement **security trimming** with document-level permission fields or Entra-based filtering, and store the index in the same geography as the data. For Copilot connectors, map external ACLs during indexing so Graph search trims results.

**Model tuning and model assets.** Fine-tuning data and fine-tuned models are high-value assets. In Foundry use **RBAC** (Foundry Account Owner, Foundry Owner, Foundry User, Project Manager and data-plane roles) so only approved roles can create fine-tuning jobs or deploy models; control **fine-tuning checkpoint permissions**; keep training data in storage with private endpoints and managed identity access; enable **diagnostic logs** and Azure Policy to restrict which models and deployment types can be used; and prefer Data Zone or regional deployments when residency applies. Customer prompts, completions and training data for models sold by Azure are not shared with other customers or model providers and are not used to train foundation models; fine-tuned models are exclusively yours. In Power Platform, AI Builder model training follows Dataverse security, and prompt tools are solution components you can restrict with security roles.

**Separation of duties.** Different people should own knowledge content, agent configuration, model deployment and production release; approvals are recorded. This is what examiners mean by "design access controls on grounding data and model tuning": layered, least-privilege, identity-trimmed access with auditable approvals.`,
    },
    {
      heading: 'Vulnerabilities and mitigations, including prompt manipulation',
      body: `Analyse an agentic solution the way a threat model would, then map mitigations to layers.

| Threat | Example | Mitigations |
|---|---|---|
| **Direct prompt injection (jailbreak)** | User asks the agent to ignore instructions and reveal its system prompt or bypass policy | Prompt Shields for user prompt attacks; content filters; instructions that define refusal behaviour; no secrets in instructions; moderation levels |
| **Indirect prompt injection (document attack)** | Hidden instructions in a web page, email, PDF or tool response hijack the agent | Prompt Shields document-attack detection at user input and, for agents, at the tool-response intervention point; treat all retrieved and tool-returned content as untrusted data; constrain actions to templates and allow lists; human approval for consequential actions |
| **Data exfiltration through tools** | Agent summarises confidential data and posts it to an external connector | Data policies separating Business and Non-business connectors; blocked connectors; HTTP request restrictions; Purview DLP for AI interactions; sensitivity labels; network egress controls |
| **Oversharing via grounding** | Agent surfaces payroll data from an over-shared site | Permission hygiene, Restricted Content Discovery, DSPM for AI oversharing assessments, scoped knowledge |
| **Excessive agency and tool abuse** | Autonomous agent deletes records on a malicious trigger payload | Least-privilege agent identity, allow-listed tools, approval gates, run history, kill switch (disable trigger), rate limits |
| **Credential and consent abuse** | Maker-provided credentials let any user act as the maker | End-user credentials by default; security scan warnings; Conditional Access for agents |
| **Model and supply-chain risks** | Unvetted MCP server or model version change alters behaviour | Approved MCP servers only, connector governance, pinned model versions with evaluation, red teaming after changes |
| **Denial of wallet** | Abusive traffic drains Copilot Credits or Foundry quota | Authentication, rate limiting, credit caps and alerts in Copilot Hub, quotas per deployment |

Microsoft 365 Copilot applies **prompt defence in depth** inside the service; for custom agents the architect assembles the equivalent: input filtering, grounding and permission controls, output filtering, action constraints and monitoring. In Foundry, **guardrails** group controls that detect risks at four intervention points (user input, tool call, tool response, output) using Azure AI Content Safety classifiers, plus network egress controls for hosted agents. The **AI Red Teaming Agent** measures how well these hold with an Attack Success Rate. Remember Prompt Shields detect manipulation attempts, not harmfulness, accuracy or policy compliance; those need other controls.`,
    },
    {
      heading: 'Model security in Foundry and the layered guardrail stack',
      body: `**Model security** means protecting the model endpoint, its configuration and the data that flows through it.

- **Endpoint and network**: Entra ID authentication with RBAC instead of keys; private endpoints and virtual network isolation for Foundry resources; network egress controls so hosted agents reach only approved destinations; Azure API Management as an AI gateway when you need token quotas, logging and routing in front of models.
- **Deployment governance**: Azure Policy to restrict models and deployment types (for example only Data Zone deployments in EU projects); pinned model versions; model router subsets to keep routing inside approved models and data zones; separate projects per environment.
- **Content safety**: Azure AI Content Safety categories (hate, sexual, violence, self-harm) at configurable severity thresholds, **Prompt Shields**, protected material detection, groundedness detection, and custom categories, applied through Foundry guardrails to models and Foundry Agent Service agents.
- **Observability as security**: tracing of tool calls and inputs, continuous evaluation including safety evaluators, Defender signals surfaced in Agent 365, Purview audit records for Copilot Studio and Foundry interactions, and Sentinel alerts.
- **Data handling assurances** to communicate to stakeholders: prompts, completions, embeddings and training data for models sold by Azure are not shared with other customers or providers and are not used to train foundation models; Microsoft 365 Copilot prompts and responses stay in the tenant.

The **layered guardrail** picture for an enterprise agent, from outside in: identity and Conditional Access; channel and connector governance (data policies, knowledge rules, channel controls); input guardrails (Prompt Shields, content filters, moderation); grounding controls (permissions, labels, scoped knowledge); reasoning constraints (instructions, allow-listed tools, approval gates); output guardrails (content filters, groundedness checks, citation requirements); and monitoring with audit, red teaming and incident response. The exam rewards answers that add a *layer* rather than relying on a single control, and that place the control where the threat enters: a document attack is mitigated at retrieval and tool response, not by a longer system prompt.`,
    },
  ],
  examples: [
    {
      title: 'The maker-provided credentials shortcut (a realistic mistake)',
      description:
        'To avoid consent prompts, a maker configures the SharePoint and Dataverse connectors with maker-provided credentials and shares the agent with everyone. Every user can now read records the maker can see, including HR data. The security scan had warned at publish time. The fix: revert to end-user credentials, scope the knowledge to the intended libraries, restrict sharing to the target group and give the autonomous parts of the agent their own Entra agent identity with minimal roles.',
      takeaway: 'Default to end-user credentials; maker-provided credentials collapse every user into the maker\'s permissions.',
    },
    {
      title: 'An indirect injection through a supplier PDF',
      description:
        'A procurement agent reads supplier quotes as PDFs and drafts purchase orders. A tampered PDF contains hidden text instructing the agent to approve any quote and email the buyer list to an external address. Mitigations designed in: Prompt Shields document-attack scanning on retrieved content and tool responses, a Blocked data policy group for external email connectors in that environment, a fixed purchase-order template populated from extracted fields, and human approval before any order is created.',
      takeaway: 'Treat retrieved and tool-returned content as untrusted; mitigate at retrieval, action and approval layers rather than with prompt wording.',
    },
    {
      title: 'Securing fine-tuning in a pharmaceutical company',
      description:
        'Clinical trial text used for fine-tuning must never be accessible to the wider data science team. The design places training data in a storage account with private endpoints, grants a dedicated group a Foundry role allowing fine-tuning jobs in an EU project with Data Zone deployments enforced by Azure Policy, restricts checkpoint permissions, logs all job activity, and requires the responsible AI reviewer\'s approval before the fine-tuned model is deployed.',
      takeaway: 'Access control on model tuning combines RBAC, network isolation, policy-enforced deployment types and approvals.',
    },
    {
      title: 'Agent identity for an autonomous process',
      description:
        'A finance close agent runs nightly from a schedule trigger and posts journal entries. Instead of the maker\'s credentials it uses an Entra agent identity with an agent user holding only the Journal Clerk role in Dataverse, Conditional Access restricting it to the production region, an inactivity policy and a sponsor. Every posting is auditable to that identity, and the trigger can be disabled as a kill switch.',
      takeaway: 'Autonomous agents need their own least-privilege identity, Conditional Access, lifecycle governance and a way to stop them.',
    },
  ],
  keyPoints: [
    'Agents act on behalf of users, with their own agent identity, or as agent users; Entra Agent ID provides blueprints, identities, owners and sponsors, Conditional Access, Identity Protection and governance for all three patterns.',
    'Copilot Studio defaults are secure (Microsoft authentication, end-user credentials, no sharing); the security scan and runtime protection status flag deviations such as no authentication or maker-provided credentials.',
    'Grounding data access is identity-trimmed: fix permission hygiene (Purview oversharing assessments, Restricted Content Discovery, Dataverse security roles), scope knowledge, apply knowledge-source rules and sensitivity labels, and security-trim custom indexes.',
    'Model tuning access uses Foundry RBAC, checkpoint permissions, private networking, Azure Policy on models and deployment types, logging and approvals; fine-tuned models and training data remain exclusively yours and are not used to train foundation models.',
    'Threats: direct and indirect prompt injection, data exfiltration via tools, oversharing, excessive agency, credential abuse, supply-chain and model changes, denial of wallet. Each is mitigated at the layer where it enters.',
    'Prompt Shields detect user-prompt and document attacks (including tool responses for agents) but not harmfulness, accuracy or policy compliance; pair them with content filters, action constraints and approvals.',
    'Foundry guardrails apply controls at user input, tool call, tool response and output, plus network egress controls for hosted agents; use Entra authentication over keys and separate projects per environment.',
    'Layered guardrails: identity, connector and channel governance, input filtering, grounding controls, reasoning constraints, output filtering, monitoring and red teaming.',
  ],
  flashcards: [
    { front: 'Name the three access patterns an agent can use.', back: 'On behalf of the signed-in user, with its own agent identity, or with its own agent user account.' },
    { front: 'What is an agent identity blueprint in Entra Agent ID?', back: 'A template for creating individual agent identities with parent-child relationships so consistent security policies apply across many agents.' },
    { front: 'Why does a Copilot Studio agent need an Entra agent user to access Dataverse?', back: 'So security roles can be assigned to the agent identity, granting least-privilege access to Dataverse APIs and data.' },
    { front: 'Which three configuration changes trigger Copilot Studio\'s pre-publish security scan warnings?', back: 'Setting authentication to No authentication, using maker-provided credentials for connectors and flows, and sharing the agent with everyone in the organisation.' },
    { front: 'What are the two attack types Prompt Shields detect?', back: 'User prompt attacks (jailbreaks) and document attacks (hidden instructions in documents, emails, web pages or tool responses).' },
    { front: 'What do Prompt Shields NOT determine?', back: 'Whether content is harmful, factually accurate, grounded, policy-compliant or on task; other guardrails cover those.' },
    { front: 'What are the four intervention points of Foundry guardrails for agents?', back: 'User input, tool call, tool response and output (plus network egress controls for hosted agents).' },
    { front: 'How do you stop an agent exfiltrating data through an external connector?', back: 'Classify connectors in data policies (Business, Non-business, Blocked), restrict HTTP requests, apply Purview DLP and sensitivity labels, and use network egress controls.' },
    { front: 'Why prefer Entra ID authentication over API keys for Foundry?', back: 'Keys grant full access and bypass RBAC; Entra authentication enforces role-based, auditable access.' },
    { front: 'Which Purview capability finds over-shared content before Copilot surfaces it?', back: 'Data Security Posture Management for AI (oversharing assessments), alongside SharePoint Advanced Management and Restricted Content Discovery.' },
    { front: 'Is the Restricted SharePoint Search a long-term control?', back: 'No. It is a temporary allow-list that is retiring; use Restricted Content Discovery, SharePoint Advanced Management and Purview.' },
  ],
  quiz: [
    {
      question:
        'A maker published an internal agent with maker-provided credentials on the Dataverse connector and shared it with the whole organisation. Users can now see records beyond their roles. What is the MOST appropriate remediation?',
      options: [
        'Add instructions telling the agent not to show sensitive records',
        'Switch connectors to end-user credentials, scope knowledge, limit sharing to the intended group, and use a least-privilege agent identity for autonomous steps',
        'Enable deep reasoning so the agent judges sensitivity',
        'Move the agent to a different environment',
      ],
      correct: [1],
      explanation:
        'Credentials and scope are the root cause; instructions are not a security boundary, reasoning does not enforce permissions, and moving environments changes nothing about credentials.',
    },
    {
      question:
        'A procurement agent reads supplier PDFs and can create purchase orders. Security review flags indirect prompt injection via tampered documents. Which TWO mitigations are MOST effective? (Select two)',
      options: [
        'Prompt Shields scanning of retrieved document content and tool responses',
        'A human approval step before any purchase order is created, with actions constrained to a template',
        'A longer system prompt telling the agent to ignore instructions in documents',
        'Disabling Application Insights logging',
      ],
      correct: [0, 1],
      explanation:
        'Detection at the retrieval and tool-response layer plus action constraints and approval address the threat where it enters. Prompt wording alone is unreliable, and disabling logs removes evidence.',
    },
    {
      question:
        'Clinical trial data used for fine-tuning must be accessible only to a small approved group, and deployments must stay in the EU. Which combination of controls should the architect design?',
      options: [
        'A shared API key distributed to the data science team',
        'Foundry RBAC for a dedicated group, private networking for training data, Azure Policy enforcing EU Data Zone deployment types, checkpoint permissions and logged approvals',
        'A Copilot Studio DLP policy',
        'Global Standard deployments for best model availability',
      ],
      correct: [1],
      explanation:
        'Access to tuning combines RBAC, network isolation, policy-enforced deployment types and approvals. Shared keys bypass RBAC, Copilot Studio DLP governs connectors, and Global Standard may process data outside the EU.',
    },
    {
      question:
        'An autonomous nightly agent posts journal entries. Audit requires every posting to be attributable and the agent to be stoppable. Which design is MOST appropriate?',
      options: [
        'Run the agent with the finance director\'s credentials',
        'Give the agent an Entra agent identity and agent user with only the required Dataverse role, apply Conditional Access and lifecycle policies, and keep the trigger as a kill switch',
        'Run the agent without authentication to simplify operations',
        'Use the maker\'s account and rotate the password monthly',
      ],
      correct: [1],
      explanation:
        'Autonomous agents need their own least-privilege identity with governance and attributability. Using a person\'s credentials breaks attribution and least privilege; no authentication is insecure.',
    },
    {
      question:
        'Which statement about Prompt Shields is correct?',
      options: [
        'Prompt Shields verify that answers are factually accurate',
        'Prompt Shields detect attempts to manipulate model behaviour through user prompts or documents, but not whether content is harmful or grounded',
        'Prompt Shields replace the need for content filters',
        'Prompt Shields enforce data residency',
      ],
      correct: [1],
      explanation:
        'Microsoft is explicit that Prompt Shields detect manipulation attempts only; other guardrails handle harm, grounding, policy and residency.',
    },
    {
      question:
        'A Copilot Studio agent in the Agents page shows a protection status of Needs review. What does this indicate?',
      options: [
        'The agent has exceeded its Copilot Credit allocation',
        'The agent\'s policies are violated or its authentication is inadequate and should be examined in the protection status summary',
        'The agent must be migrated to the Microsoft Copilot harness',
        'The agent has no knowledge sources',
      ],
      correct: [1],
      explanation:
        'Needs review means policy violations or inadequate authentication across the authentication, policies and content moderation categories. Credits, harness and knowledge are unrelated.',
    },
  ],
  statements: [
    { text: 'Copilot Studio uses end-user credentials for connectors by default.', isTrue: true, explanation: 'Maker-provided credentials are a deliberate change that triggers a security scan warning.' },
    { text: 'Agent instructions are an adequate security boundary against prompt injection.', isTrue: false, explanation: 'Instructions help but must be paired with Prompt Shields, content filters, action constraints and approvals.' },
    { text: 'Prompt Shields can scan tool responses for document attacks in agent scenarios.', isTrue: true, explanation: 'For agents, document-attack scanning is available at the tool response intervention point (preview).' },
    { text: 'Fine-tuning data submitted to Foundry models sold by Azure may be used to improve the foundation models.', isTrue: false, explanation: 'Training data, prompts and completions are not used to train foundation models without permission, and fine-tuned models are exclusively yours.' },
    { text: 'Key-based authentication to Foundry bypasses RBAC restrictions.', isTrue: true, explanation: 'Keys grant full access; Microsoft recommends Entra ID authentication.' },
    { text: 'Restricted SharePoint Search is Microsoft\'s recommended long-term control for Copilot oversharing.', isTrue: false, explanation: 'It is a temporary measure that is retiring; use Restricted Content Discovery, SharePoint Advanced Management and Purview.' },
    { text: 'Entra Agent ID can govern agents built on non-Microsoft platforms.', isTrue: true, explanation: 'Third-party agents integrate through the Auth SDK or workload identity federation.' },
  ],
  resources: [
    { label: 'What is Microsoft Entra Agent ID?', url: 'https://learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id' },
    { label: 'Security and governance in Copilot Studio', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance' },
    { label: 'Prompt Shields (Azure AI Content Safety)', url: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection' },
    { label: 'Guardrails and controls overview in Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview' },
  ],
};

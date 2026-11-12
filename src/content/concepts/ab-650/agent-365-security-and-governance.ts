import type { Concept } from '../../types';

export const agent365SecurityAndGovernance: Concept = {
  id: 'agent-365-security-and-governance',
  title: 'Securing and Governing Agents with Microsoft Agent 365',
  summary:
    'How Microsoft Agent 365 extends Defender, Purview and Entra to AI agents: observing agent activity (admin center overview, Teams activity tab, Copilot all-agents view, Defender inventory and hunting), protecting sensitive data agents touch (labels, DLP, audit, Insider Risk, eDiscovery), evaluating compliance gaps with Compliance Manager and DSPM, and the data residency and retention commitments behind it.',
  certs: ['ab-650'],
  domains: ['ab-650-3'],
  outcomes: ['ab-650-3-3-1', 'ab-650-3-3-2', 'ab-650-3-3-3'],
  tags: ['agent-365', 'observability', 'defender-security-for-ai', 'purview', 'compliance-manager', 'data-residency', 'policy-templates', 'layered-guardrails'],
  difficulty: 'advanced',
  diagram: 'layered-guardrails',
  sections: [
    {
      heading: 'Agent 365: the control plane and its four pillars',
      body: `**Microsoft Agent 365** is Microsoft's observability platform and control plane for AI agents, whether built in Copilot Studio, Agent Builder, Microsoft Foundry, SharePoint, the Agents Toolkit, or on third-party platforms. It is licensed **per user**, included in **Microsoft 365 E7**, and works best on an E5 base; at least one licence enables it. Its four pillars map neatly to the exam's three Agent 365 outcomes:

- **Management**: the agent registry, Agent Map and connected platforms (inventory and ownership).
- **Governance**: approval before publishing, policy templates, tool controls, ownerless-agent handling, and Purview audit trails.
- **Security**: consolidated **risk signals from Defender, Entra and Purview** in the registry, Entra access control, Purview data protection, Defender threat detection, and one-click **Block**.
- **Business value**: Agent overview usage, assisted hours and Copilot Credit cost management.

The service description splits capabilities between what every Microsoft 365 plan gets (registry inventory, basic actions, management rules, syncing external platforms) and what needs **E7 or Agent 365**: policy templates, observability and telemetry, tenant-wide tool control, the Graph API, access packages, lifecycle policies, Conditional Access and ID Protection for agents, Purview audit, eDiscovery, retention, DSPM AI observability, Insider Risk, DLP for agents, Defender posture, detection and hunting, and Intune device compliance for agent Conditional Access.

Agent 365's model is **layered guardrails**: Entra governs identity and access, Purview governs data, Defender governs threats, Intune governs devices, and the Microsoft 365 admin center wraps agents with policy and observability without controlling their internal behaviour. Agents built on Microsoft platforms send observability data automatically; custom and third-party agents must integrate through the **Agent 365 SDK** (OpenTelemetry-based) or they appear as **unmanaged** with limited insight.`,
    },
    {
      heading: 'Monitoring agent activity',
      body: `Agent observability data records what an agent did in a **session**: the **trigger** (email, chat, @mention, schedule), each **action or tool call**, optional **thought process**, status (Running, Completed, Failed), channel and timing. Who sees what:

| Surface | Audience | What it shows |
|---|---|---|
| **Agents > Overview** (Microsoft 365 admin center) | Admins | 30-day snapshot: agents, active users, sessions, assisted hours, agents at risk, ownerless agents, pending requests, top platforms |
| **Agent details > Activity tab** and **Agent Map usage filters** | Admins | Per-agent usage, exceptions, sessions, assisted hours; single-agent map (preview) of users and tools |
| **Microsoft Defender portal** | Security teams | AI agent **inventory**, posture and **attack paths**, **alerts and incidents** for suspicious agent activity, **advanced hunting** over unified agent observability logs, real-time tool-call protection |
| **Agent Activity tab in Teams** | The **agent manager** (assigned in Entra) and users for their own sessions | Session list with triggers, actions, summaries and status |
| **All agents > Agent activity in Copilot** (preview) | Each user for their own interactions | Progress, outputs, actions taken; read-only, 30-day history; admins do not see detailed timelines here |
| **Purview DSPM AI observability and activity explorer** | Compliance teams | Prompts, responses, referenced files, labels and sensitive data in agent interactions |
| **Entra sign-in and audit logs (agent logs)** | Identity teams | Agent authentication events and administrative changes |

Enabling Defender security for AI agents: after onboarding to Agent 365, go to **Defender portal > Settings > Security for AI > Get started**; data collection is on by default, and the **Microsoft 365 connector** with **Entra ID management events** and **Microsoft 365 activities** must be connected for Copilot Studio alerts and hunting. Copilot Studio agents can additionally be onboarded for **real-time protection** that blocks malicious tool invocations. Exam framing: "which users interacted with agent X and what did it do" is the admin center Activity tab or Defender hunting; "a business owner must oversee an agent's sessions" is the **agent manager** in Teams; "prove what prompts an agent processed" is Purview audit and DSPM.`,
    },
    {
      heading: 'Protecting sensitive data that agents touch',
      body: `Agent 365 reuses the Purview controls you already have, with agent-specific wrinkles. When an **agent instance** is created it is **automatically enabled for audit**, for **sensitive data detection with data classification**, and included in **Compliance Manager** AI assessments; for every other capability you **include the agent instance in policies as you would a user**.

- **Sensitivity labels**: agents honour labels; for encrypted content the agent instance needs **VIEW and EXTRACT** usage rights granted **explicitly** (labels scoped to "all users in the organization" or "any authenticated users" do not cover agents). Content an agent creates does **not** inherit labels automatically, so pair agents with auto-labelling or DLP. Agents only access content **explicitly shared with them**.
- **DLP**: the Copilot, Copilot Chat and Cowork DLP location and workload policies block agents from accessing or sharing sensitive content; policy templates include a **Know your data** policy that applies these controls at activation. Agents with their own identity behave like users for DLP, Information Barriers and Conditional Access.
- **Audit and eDiscovery**: all agent-to-human, human-to-agent, agent-to-tool and agent-to-agent interactions land in the unified audit log and are searchable, holdable and exportable in **eDiscovery**; audit logs for **non-Microsoft AI apps** use pay-as-you-go billing with 180-day retention.
- **Data lifecycle management**: retention policies cover agent-generated interactions (Copilot Studio, Foundry and other AI app locations) so they are kept only as long as needed.
- **Insider Risk Management** and **communication compliance**: detect anomalous or risky agent activity and non-compliant interactions, scoped to agent instances.
- **Access design**: an agent with its **own identity** has **persistent, accumulating access** to everything shared with it and may answer anyone who can talk to it, so apply **context filtering** (Microsoft-built agents trim context), **information barriers** and least-privilege sharing; Microsoft lets IT **disable any agent that does not support the required Agent 365 controls**.

SharePoint adds **agent access insights**, **restrict external sharing by agent** and **site access control** naming which agents may reach a site; all are bundled in the default policy template with the Entra, Purview and Defender policies.`,
    },
    {
      heading: 'Evaluating compliance gaps, residency and the exam angle',
      body: `**Compliance gaps** are evaluated through three lenses:

1. **Compliance Manager** (Purview) runs **assessments for AI regulations** (EU AI Act, NIST AI RMF and others) and automatically includes agent instances; the **AI compliance assessment** policy in the default template "continuously monitors and evaluates agents for compliance gaps". The agent details **Security** tab in the admin center summarises monitoring, sensitive data protection and compliance gaps for one agent.
2. **DSPM for AI / DSPM AI observability**: recommendations, data risk assessments and the **AI observability** page listing active agent instances and their data exposure.
3. **Defender posture**: misconfigurations and exposure risks (missing authentication, over-privileged tools), **AI agent risk posture** (preview) and attack paths.

**Data handling and residency**: Agent 365 observability stores customer content in the **tenant's default geography**, honours the **EU Data Boundary**, may replicate some service-generated metrics to the EU (for EU tenants) or the US, does **not** support Advanced Data Residency, retains observability data for **30 days**, encrypts data at rest and in transit, isolates per tenant, and is processed under the Microsoft DPA and Product Terms. Third-party agent data is stored only after a trial or licence plus acceptance of the Agent 365 terms; Anthropic models used by agents are excluded from the EU Data Boundary. **Shadow AI** detection (Frontier) covers unmanaged local agents such as OpenClaw, Claude Desktop and ChatGPT Desktop via Defender for Endpoint, with Intune-based blocking for Windows devices.

Exam patterns: "block agents from summarising Highly Confidential files" is a **DLP Copilot-location policy** plus label usage rights; "demonstrate EU AI Act readiness for agents" is **Compliance Manager**; "prove where agent telemetry is stored" is **tenant default geography, 30-day retention**; "detect an agent whose behaviour changed overnight" is **Defender detections** or **ID Protection for agents**; "a partner agent will not emit observability data" means it stays **unmanaged** and can be **disabled**. Remember the free-versus-licensed split: inventory and basic actions are in every plan; observability, templates, tool control and the Purview and Defender extensions need **E7 or Agent 365**.`,
    },
  ],
  examples: [
    {
      title: 'Standing up Defender monitoring for agents',
      description:
        'After purchasing Agent 365, Contoso\'s SOC sees no agent alerts. The Security Administrator opens Defender > Settings > Security for AI > Get started, confirms data collection is enabled, and completes the Microsoft 365 connector step by selecting Microsoft Entra ID management events and Microsoft 365 activities. A Power Platform administrator onboards Copilot Studio for real-time protection. Within a day the AI agent inventory, posture recommendations and hunting tables populate, and a suspicious tool-invocation alert from a sales agent is investigated through the registry\'s Defender deep link.',
      takeaway: 'Agent 365 enables security for AI by default, but the Microsoft 365 connector components are required for Copilot Studio alerts and advanced hunting.',
    },
    {
      title: 'The agent that could read everything shared with it (a realistic mistake)',
      description:
        'A department deploys an AI teammate with its own agent user account into several Teams channels. Staff forward confidential deal emails to it for summaries. Later, a contractor in one channel asks the agent about pipeline numbers and receives details from a different team\'s deals. The agent\'s persistent identity accumulated access to everything shared with it and answered anyone who could chat with it. The fix: scope what is shared with the agent, apply information barriers and a sensitivity label with explicit VIEW/EXTRACT only for intended users, add a DLP rule for the Copilot and agent location, and review the Purview audit trail of the agent\'s interactions.',
      takeaway: 'Agents with their own identity need least-privilege sharing, labels that explicitly include the agent, and DLP; policies apply to the agent instance as to a user.',
    },
    {
      title: 'Evidencing EU AI Act readiness for agents',
      description:
        'The compliance lead must show auditors how agents comply with the EU AI Act. In Purview Compliance Manager she opens the EU AI Act assessment, which already includes the tenant\'s Agent 365 agent instances, exports the improvement actions and maps the open items (human oversight, logging) to the Agent 365 features in use: agent managers reviewing sessions in Teams, 30-day observability plus Purview audit retention, and the default template\'s AI compliance assessment policy.',
      takeaway: 'Compliance Manager automatically scopes agent instances into AI regulation assessments; observability and audit supply the evidence.',
    },
    {
      title: 'Answering the data-residency question',
      description:
        'A German works council asks where agent telemetry is stored and for how long. The admin answers from the Agent 365 data handling documentation: observability data is stored in the tenant\'s default geography (EU), the EU Data Boundary is honoured with limited service metrics replicated within the EU, retention is 30 days, Advanced Data Residency is not supported, and Anthropic-model usage by agents is excluded from the EU Data Boundary, which is why Claude is disabled by default for the tenant.',
      takeaway: 'Know the residency facts: default geography, EUDB honoured, 30-day retention, no ADR, Claude excluded from EUDB.',
    },
  ],
  keyPoints: [
    'Agent 365 is the control plane for all agents (management, governance, security, business value); licensed per user, included in E7; inventory and basic actions are free, observability, templates, tool control and the Purview, Defender and Entra extensions need E7 or Agent 365.',
    'Monitor agent activity in the admin center Overview and Activity tabs, Agent Map, the Teams Agent Activity tab (agent manager), the Copilot all-agents activity view (user-scoped, 30 days), Defender inventory, alerts and hunting, and Purview DSPM activity explorer.',
    'Defender security for AI is enabled on Agent 365 onboarding; connect the Microsoft 365 connector (Entra ID management events, Microsoft 365 activities) for alerts and hunting; Copilot Studio can get real-time tool-call protection.',
    'Agent instances are auto-enabled for audit, data classification and Compliance Manager; include them in labels, DLP, retention, Insider Risk and eDiscovery like users; encrypted content needs explicit VIEW and EXTRACT for the agent, and agent-created content does not inherit labels.',
    'Agents with their own identity accumulate access to whatever is shared with them, so apply least-privilege sharing, information barriers, context filtering and DLP; IT can disable agents that do not support required controls.',
    'Compliance gaps are evaluated with Compliance Manager AI regulation assessments, DSPM AI observability and Defender posture; the default policy template bundles Identity Protection, network visibility, lifecycle management, SharePoint controls, audit, Know your data, AI compliance assessment and Defender hunting.',
    'Observability data is stored in the tenant default geography, honours the EU Data Boundary, is retained 30 days, is encrypted and tenant-isolated, and Advanced Data Residency is not supported.',
  ],
  flashcards: [
    { front: 'What are the four pillars of Microsoft Agent 365?', back: 'Management, governance, security and business value.' },
    { front: 'Which Agent 365 capabilities are available in every Microsoft 365 plan?', back: 'Registry inventory, basic governance actions, condition-based management rules and synchronising external platform agents into the registry.' },
    { front: 'Where does a business owner oversee an agent\'s sessions?', back: 'The Agent Activity tab in Teams, as the agent manager assigned in Entra (users see only their own sessions).' },
    { front: 'How long is the all-agents activity history in Copilot retained?', back: '30 days; the view is read-only and user-scoped.' },
    { front: 'What must be connected in Defender for Copilot Studio agent alerts and hunting?', back: 'The Microsoft 365 connector with Microsoft Entra ID management events and Microsoft 365 activities.' },
    { front: 'What is automatically enabled when an Agent 365 agent instance is created?', back: 'Audit, sensitive data detection with data classification, and inclusion in Compliance Manager AI regulation assessments.' },
    { front: 'Does content created by an Agent 365 agent inherit the source sensitivity label?', back: 'No. Newly created content is not automatically labelled or encrypted; use auto-labelling or DLP.' },
    { front: 'Which usage rights must a label grant the agent instance for encrypted files?', back: 'VIEW and EXTRACT, granted explicitly to the agent (not via "all users in the organization").' },
    { front: 'Which Purview solution assesses agents against AI regulations?', back: 'Compliance Manager, with assessments such as the EU AI Act that include agent instances automatically.' },
    { front: 'Where is Agent 365 observability data stored and for how long?', back: 'In the tenant\'s default geography (EU Data Boundary honoured), retained for 30 days; Advanced Data Residency is not supported.' },
    { front: 'What is an unmanaged agent?', back: 'An agent created or managed outside Agent 365 without its risk protection and observability (for example a custom agent not integrated with the SDK).' },
    { front: 'What does Shadow AI (Frontier) detect?', back: 'Unmanaged local AI agents such as OpenClaw, Claude Desktop and ChatGPT Desktop via Defender for Endpoint, with Intune blocking for OpenClaw on managed Windows devices.' },
  ],
  quiz: [
    {
      question:
        'A business owner must be able to review every session of the procurement agent, including triggers and tool calls, without being an administrator. What should you configure?',
      options: [
        'Assign the owner the AI Reader role.',
        'Assign the owner as the agent manager in Microsoft Entra so the Agent Activity tab in Teams shows all sessions.',
        'Grant the owner Security Reader in Defender.',
        'Share the Purview audit log with the owner.',
      ],
      correct: [1],
      explanation:
        'The agent manager sees all sessions of the agent in the Teams Agent Activity tab. AI Reader and Security Reader are admin roles with portal access, and audit logs are a compliance tool rather than a business oversight surface.',
    },
    {
      question:
        'Copilot Studio agents are onboarded to Agent 365, but no agent alerts or incidents appear in the Defender portal. What is the MOST likely cause?',
      options: [
        'The Microsoft 365 connector is not connected with Entra ID management events and Microsoft 365 activities.',
        'Restricted content discovery is enabled on the agent\'s knowledge site.',
        'The agents lack a Copilot Credit spending policy.',
        'The agents were not pinned for users.',
      ],
      correct: [0],
      explanation:
        'Defender documentation states that without the Microsoft 365 connector, Copilot Studio alerts and incidents do not appear. RCD, spending policies and pinning are unrelated to Defender ingestion.',
    },
    {
      question: 'Which TWO statements about Purview protection for Agent 365 agents are correct? (Select two)',
      options: [
        'Agent instances are automatically enabled for audit when created.',
        'A sensitivity label encrypted for "all users in the organization" is sufficient for an agent instance to read the content.',
        'Content an agent creates automatically inherits the most restrictive source label.',
        'For DLP, retention and Insider Risk, you include the agent instance in policies as you would a user.',
      ],
      correct: [0, 3],
      explanation:
        'Audit is automatic and other policies treat the agent instance like a user. Encryption must explicitly grant the agent VIEW and EXTRACT, and agent-created content does not inherit labels.',
    },
    {
      question:
        'Auditors ask for evidence that the organization\'s agents are assessed against the EU AI Act. Which tool provides this?',
      options: ['Microsoft Purview Compliance Manager', 'Microsoft 365 Service health', 'The Copilot readiness report', 'SharePoint data access governance reports'],
      correct: [0],
      explanation:
        'Compliance Manager AI regulation assessments include agent instances. Service health, readiness and DAG reports address availability, licensing and oversharing.',
    },
    {
      question:
        'A privacy officer asks how long Agent 365 observability data is kept and whether it stays in the EU for an EU tenant. Which answer is correct?',
      options: [
        '30 days, stored in the tenant\'s default geography with the EU Data Boundary honoured.',
        'Indefinitely, stored in the United States.',
        '7 years, stored wherever the agent platform runs.',
        '24 hours, stored in the Defender portal only.',
      ],
      correct: [0],
      explanation:
        'Agent 365 retains observability data for 30 days in the tenant default geography and honours the EU Data Boundary, although Advanced Data Residency is not supported.',
    },
    {
      question:
        'A partner-built agent cannot send observability data to Agent 365 and does not support Conditional Access. What is the recommended administrative response?',
      options: [
        'Disable or block the agent until it supports the required Agent 365 controls.',
        'Assign the agent the Global Reader role so it can be monitored.',
        'Move the agent to the Shared by creator publisher type.',
        'Create a Microsoft 365 Backup policy for the agent.',
      ],
      correct: [0],
      explanation:
        'Microsoft\'s model lets IT disable agents that do not support required controls; they otherwise remain unmanaged. Roles, publisher types and Backup do not add observability or access control.',
    },
  ],
  statements: [
    { text: 'Microsoft Agent 365 can govern agents built on Amazon Bedrock and Google Vertex AI.', isTrue: true, explanation: 'Connected platforms sync these agents into the registry; the SDK integrates custom agents.' },
    { text: 'Agent 365 enforces the internal runtime behaviour of third-party agents.', isTrue: false, explanation: 'It wraps agents with identity, policy and observability guardrails but does not control internal behaviour.' },
    { text: 'Agent 365 observability data is retained for 30 days.', isTrue: true, explanation: 'After 30 days it is automatically deleted.' },
    { text: 'Agent 365 supports Advanced Data Residency.', isTrue: false, explanation: 'ADR is not currently supported, although the tenant default geography and EU Data Boundary are honoured.' },
    { text: 'Users can see other users\' agent activity in the Copilot all-agents activity view.', isTrue: false, explanation: 'The view is user-scoped; admins do not see detailed timelines there either.' },
    { text: 'Agents with their own identity can accumulate access to content that not all conversation participants may see.', isTrue: true, explanation: 'This is why least-privilege sharing, information barriers and context filtering are recommended.' },
    { text: 'Policy templates and observability are available in every Microsoft 365 plan without Agent 365.', isTrue: false, explanation: 'They require Microsoft 365 E7 or an Agent 365 licence.' },
    { text: 'Compliance Manager automatically includes Agent 365 agent instances in AI regulation assessments.', isTrue: true, explanation: 'Agent instances are enrolled when created.' },
  ],
  resources: [
    { label: 'Overview of Microsoft Agent 365', url: 'https://learn.microsoft.com/en-us/microsoft-agent-365/overview' },
    { label: 'Use Microsoft Purview to manage data security and compliance for Microsoft Agent 365', url: 'https://learn.microsoft.com/en-us/purview/ai-agent-365' },
    { label: 'Enable security for AI agents using Microsoft Defender', url: 'https://learn.microsoft.com/en-us/defender-xdr/security-for-ai/get-started-defender-security-for-ai' },
    { label: 'Data handling, data residency, and compliance in Agent 365 observability', url: 'https://learn.microsoft.com/en-us/microsoft-agent-365/admin/data-residency-protection-compliance' },
  ],
};

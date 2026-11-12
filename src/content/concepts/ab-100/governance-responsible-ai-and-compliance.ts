import type { Concept } from '../../types';

export const governanceResponsibleAiAndCompliance: Concept = {
  id: 'governance-responsible-ai-and-compliance',
  title: 'Agent Governance, Responsible AI Review, Data Residency and Audit Trails',
  summary:
    'How an architect governs an agent estate end to end: the governance model and tooling (Agent 365, Power Platform admin center, Microsoft 365 admin center, Purview), reviewing solutions against Microsoft\'s six responsible AI principles and the Responsible AI Standard, validating data residency and cross-region data movement for Copilot Studio, Dynamics 365 and Foundry, and designing audit trails for changes to models, agents and data.',
  certs: ['ab-100', 'ab-731'],
  domains: ['ab-100-3', 'ab-731-3'],
  outcomes: ['ab-100-3-4-2', 'ab-100-3-4-5', 'ab-100-3-4-6', 'ab-100-3-4-8', 'ab-731-3-1-4'],
  tags: ['governance', 'responsible-ai', 'agent-365', 'purview', 'data-residency', 'audit', 'compliance'],
  difficulty: 'advanced',
  diagram: 'responsible-ai-principles',
  sections: [
    {
      heading: 'Designing governance for agents',
      body: `Governance answers four questions for every agent: who owns it, what may it access and do, where may it run, and how is it reviewed. The CAF **AI Govern** guidance frames this with the NIST AI Risk Management Framework (govern, map, measure, manage) and recommends assessing each AI workload against the responsible AI principles to identify risks.

**Governance model.** A central function (AI CoE or AI council) sets policy and standards; business units build within those boundaries; platform admins enforce controls. Use a **zoned** approach: personal productivity agents (Agent Builder, light controls), team agents (managed environments, data policies), and enterprise agents (full ALM, security review, evaluation gates, named owner and sponsor). Every agent needs an **owner**, a **sponsor**, a classification, a lifecycle state and a review date; orphaned agents are reassigned or retired.

**Tooling by plane.**
- **Microsoft Agent 365** is the observability and control plane: the **agent registry** in the Microsoft 365 admin center (Microsoft, partner, published-by-org and shared agents with owner, usage and risk signals from Defender, Entra and Purview), **Agent Map** by platform, connected platforms for non-Microsoft agents, approval and publishing workflows, policy templates applied to new agents, blocking of risky agents and Entra network controls.
- **Power Platform admin center**: environment groups and rules, data policies, knowledge-source rules, channel publishing and connected-agent access controls, authentication controls for agents, Copilot Credit allocation and caps, agent inventory and discovery, environment routing, maker welcome messages, Copilot Hub settings per product (for example Dynamics 365 Customer Service cross-region data movement).
- **Microsoft 365 admin center**: agent approval and deployment, Copilot usage reports, integrated apps management; Teams admin policies for agent availability.
- **Microsoft Purview**: DSPM for AI insights and one-click policies, sensitivity labels and DLP applied to AI interactions, Insider Risk Management, Communication Compliance, eDiscovery, retention and audit for Copilot Studio and Foundry agents (non-Microsoft channels and AI apps need pay-as-you-go billing for interaction logs).
- **Microsoft Foundry**: RBAC, Azure Policy, guardrails, the Foundry control plane and agent registration.
- **Copilot Agent Kit Compliance Hub** to evaluate Copilot Studio agent configurations against organisational controls with risk levels and enforcement actions (review, quarantine, delete).

Governance also includes **licensing and cost** (credit caps, consumption monitoring), **lifecycle** (inactivity policies for agent identities, retirement), and **third-party AI** discovery through Defender for Cloud Apps and DSPM for AI.`,
    },
    {
      heading: 'Reviewing a solution against responsible AI principles',
      body: `Microsoft's six **responsible AI principles** are fairness, reliability and safety, privacy and security, inclusiveness, transparency and accountability; the **Responsible AI Standard** turns them into goals and requirements, and the exam expects you to review a design against them.

| Principle | Review questions | Evidence in the design |
|---|---|---|
| **Fairness** | Could the agent treat groups differently (language, region, disability, customer segment)? Is training or grounding data representative? | Cohort evaluation results, bias checks on custom models, multilingual test sets |
| **Reliability and safety** | What happens when the model is wrong, a tool fails or a trigger misfires? Are consequential actions gated? | Evaluation thresholds, fallback and escalation design, approvals, red-team results, content safety configuration |
| **Privacy and security** | What personal data enters prompts, logs and training data? Who can access it? Where is it processed? | PII redaction, DLP and labels, least-privilege identities, residency decisions, retention settings |
| **Inclusiveness** | Can everyone use it (accessibility of adaptive cards and voice, languages, reading level)? | Accessibility testing, language coverage, alternative channels |
| **Transparency** | Do users know they are talking to AI, what it can do, where answers come from? | AI disclosure and privacy statement at conversation start, citations, documented capabilities and limitations, model cards, feedback mechanisms |
| **Accountability** | Who owns outcomes? Can decisions be explained, audited and contested? | Named owner and sponsor, human-in-the-loop for high-impact decisions, audit trails, incident process |

Review process: run an **impact assessment** at design time (intended uses, stakeholders, potential harms, mitigations), require evidence for each principle before go-live, re-review on material changes (new autonomy, new data, new model), and publish transparency notes to users. Microsoft's own Responsible AI FAQs for each Copilot feature (Sales, Customer Service, finance and operations, Power Apps) model the format. The CAF AI Govern step adds policy: acceptable use, approved tools, human oversight requirements and incident reporting. Distractors on the exam tend to confuse principles (labelling a bias issue as "transparency") or propose a technical control as the whole answer; a correct review pairs each risk with both a control and an accountable owner.`,
    },
    {
      heading: 'Validating data residency and movement',
      body: `Residency questions have three parts: where data is **stored**, where it is **processed**, and when it **moves** across a boundary. Validate each for every component.

- **Copilot Studio.** Agents and their Dataverse data reside in the environment's Azure geography (with limited exceptions such as disaster-recovery replication for Brazil and globally stored metadata like agent name and description). Generative AI features draw on Azure OpenAI and Bing; in some non-US geographies global or Power Platform admins must **allow data movement across regions** for them to work, after which prompts and outputs may be processed where the feature is hosted and the consent cannot retroactively undo past movement. Some models and features (deep reasoning, experimental models, preview capabilities) are flagged **cross-geo** or carry no residency commitment. Copilot Credits processing for pay-as-you-go may also occur outside the home region. Validation: list every feature and model used, check the geographic availability tables, record the admin consent state per environment, and route sensitive agents to environments and models that stay in-geo.
- **Dynamics 365 and Power Platform Copilot features.** Enabled by default where available; the Power Platform admin center setting **Allow data movement across regions** governs features hosted elsewhere, with a published mapping of environment region to Azure OpenAI and Bing processing regions. Customer Service and Sales agents document their own data movement for AI features; some require the setting to be on.
- **Microsoft Foundry.** Data at rest stays in the Azure geography of the resource; **deployment type** decides processing: **Global** may process anywhere, **Data Zone** processes only within the US, EU or APAC zone, and **Standard or Regional Provisioned** process within the customer-specified geography. Model router honours data zone boundaries and routes only to eligible models. Use Azure Policy to enforce allowed deployment types per project.
- **Microsoft 365 Copilot** follows Microsoft 365 data residency commitments (including Advanced Data Residency where purchased); prompts and responses stay in the tenant and are not used to train foundation models. Web grounding and Bing-powered features are governed separately.
- **Agents that cross systems**: a connected Foundry agent in another region, an A2A agent hosted by a partner, or an MCP server abroad each create a movement you must document and, if needed, block with network and connector controls.

Deliverable: a data flow diagram with storage and processing regions per component, the admin settings that control movement, the consent and approval records, and residual risks accepted by the compliance owner.`,
    },
    {
      heading: 'Designing audit trails for changes to models and data',
      body: `Auditability means you can reconstruct **who changed what, when, and what the agent did with which data and model**. Design the trail across four layers:

1. **Interactions.** Microsoft Purview **Audit (Standard)** logs user and admin interactions for Microsoft Copilot and AI applications, including Copilot Studio agents and Foundry-based apps (non-Microsoft AI apps need pay-as-you-go with 180-day retention). Copilot Studio also records conversation transcripts in Dataverse (the msdyn_copilotinteraction and transcript tables, with their own retention) and session details on the Monitor page; Application Insights telemetry adds tool inputs and outputs when enabled. Foundry tracing captures each step, tool call and model response. Agent 365 correlates agent inventory and ownership with audit records; Sentinel can alert on agent activity.
2. **Agent and configuration changes.** Solution history, pipeline deployment records and Git commit history show who changed topics, knowledge, tools, prompts and instructions; GitHub-backed deploy-from-Git gives auditable deployment history; Dataverse auditing on configuration tables adds field-level change logs; Microsoft 365 admin center records agent approval and publishing actions; Power Platform admin activity logs record policy and setting changes.
3. **Model changes.** Foundry deployments carry model names, versions and update policies; fine-tuning jobs log data sets, hyperparameters and checkpoints; Azure activity logs and diagnostic logs record deployments and guardrail changes; model router version changes are published. Record model cards and evaluation results per version in the repository so every production answer can be traced to a model version and a test run. Copilot Studio publishes model changes with a retention window and shows the primary model per agent.
4. **Data changes.** Dataverse **auditing** (enable per table and column, with user access logging and a configurable retention period) covers records agents read and write; SharePoint and Purview audit cover knowledge content changes and access; version history on documents shows what an agent could have cited at a given time; index rebuilds and knowledge-source edits appear in solution history and Monitor.

Design rules: enable auditing before go-live, keep retention aligned with regulatory requirements, make agent actions attributable to an agent identity, correlate conversation IDs across Copilot Studio, flows and downstream systems, protect logs from tampering (immutable storage, restricted roles), and test that you can answer "why did the agent do X on this date" within the SLA your regulators expect. Sensitive logs (transcripts with personal data) need their own access controls and minimisation.`,
    },
  ],
  examples: [
    {
      title: 'A governance model for a global insurer',
      description:
        'The architect defines three zones: personal agents built in Agent Builder with default controls; team agents in managed environments with data policies and knowledge rules; enterprise agents with named owners and sponsors in Agent 365, mandatory evaluation gates, security review and Purview policies. Agent 365\'s registry gives the CISO one view, Compliance Hub quarantines non-compliant Copilot Studio agents, and an inactivity policy retires unused agent identities.',
      takeaway: 'Zoned governance scales controls with risk and keeps ownership explicit through the agent registry.',
    },
    {
      title: 'A responsible AI review that changed the design',
      description:
        'A claims-triage agent proposed auto-rejecting low-score claims. The review against the principles found a fairness risk (training data under-represented rural claimants), an accountability gap (no appeal path) and a transparency gap (no disclosure that AI made the decision). The redesign keeps rejection with a human adjuster, adds cohort evaluation, a disclosure and an appeal process, and assigns the claims director as accountable owner.',
      takeaway: 'Map each risk to a principle, a control and an owner; high-impact decisions keep a human in the loop.',
    },
    {
      title: 'Residency assumed, not validated (a realistic mistake)',
      description:
        'A German bank believed its Copilot Studio agent kept all data in the EU. Validation showed deep reasoning (preview, no residency commitment) was enabled, the environment relied on allowed cross-region movement for a generative feature, and a connected Foundry agent used a Global Standard deployment. The fix: disable deep reasoning for that agent, document the admin consent and residual risk, and move the Foundry deployment to EU Data Zone enforced by Azure Policy.',
      takeaway: 'Validate residency per feature, model and deployment type, and record the admin settings and consents that govern movement.',
    },
    {
      title: 'Answering the regulator in two hours',
      description:
        'A regulator asks why an agent changed a customer\'s credit limit on a specific date. The team correlates the Purview audit record, the Copilot Studio transcript and Application Insights tool-call span, the Dataverse audit entry showing the agent identity that updated the record, the solution version and pipeline run active that day, and the model version and evaluation results pinned for that release.',
      takeaway: 'Audit trails span interactions, configuration, model and data layers and must be correlated by identity, time and conversation ID.',
    },
  ],
  keyPoints: [
    'Governance assigns every agent an owner, sponsor, zone, lifecycle state and review date; CAF AI Govern aligns the process with the NIST AI RMF and responsible AI principles.',
    'Agent 365 (registry, Agent Map, connected platforms, policy templates, blocking), Power Platform admin center (data policies, knowledge and channel rules, credits, inventory), Microsoft 365 admin center (approval, usage), Purview (DSPM for AI, labels, DLP, audit, eDiscovery) and Foundry (RBAC, Azure Policy, guardrails) are the governance planes.',
    'Microsoft\'s six responsible AI principles are fairness, reliability and safety, privacy and security, inclusiveness, transparency and accountability; review each with questions, evidence and an accountable owner, and repeat on material change.',
    'Transparency evidence includes AI disclosure and privacy statements at conversation start, citations and documented limitations; accountability needs human oversight of high-impact decisions and an appeal path.',
    'Residency: Copilot Studio data stays in the environment geography but generative features may need admin-approved cross-region movement; some models and previews are cross-geo; Foundry deployment type (Global, Data Zone, Standard or Regional) decides processing location; Microsoft 365 Copilot follows Microsoft 365 residency.',
    'Validate residency per feature, model and connected agent with a data flow diagram, admin settings, consent records and accepted residual risk.',
    'Audit trails cover interactions (Purview Audit, transcripts, Application Insights, Foundry tracing), configuration (solution history, pipelines, Git, admin logs), models (deployment versions, fine-tuning jobs, model cards) and data (Dataverse auditing, SharePoint and Purview audit).',
    'Enable auditing before go-live, align retention with regulation, make agent actions attributable to agent identities, correlate IDs across systems and protect logs.',
  ],
  flashcards: [
    { front: 'List Microsoft\'s six responsible AI principles.', back: 'Fairness, reliability and safety, privacy and security, inclusiveness, transparency, accountability.' },
    { front: 'Which framework does CAF AI Govern align AI risk management with?', back: 'The NIST AI Risk Management Framework (govern, map, measure, manage).' },
    { front: 'Where is the Agent 365 agent registry and what does it show?', back: 'Microsoft 365 admin center > Agents > All agents > Registry: Microsoft, partner, published-by-org and shared agents with owner, usage and risk signals from Defender, Entra and Purview.' },
    { front: 'Which Purview capabilities apply to Copilot Studio agent interactions?', back: 'DSPM for AI, auditing, data classification, sensitivity labels, DLP, Insider Risk Management, Communication Compliance, eDiscovery, Data Lifecycle Management and Compliance Manager (not encryption without labels).' },
    { front: 'What must admins do for Copilot Studio generative features in some non-US geographies?', back: 'Allow data movement across regions in Power Platform (global or Power Platform admins); the consent cannot undo movement that already happened.' },
    { front: 'How do Foundry deployment types affect residency?', back: 'Global may process anywhere; Data Zone processes within the US, EU or APAC zone; Standard and Regional Provisioned process within the customer-specified geography; data at rest stays in the resource geography.' },
    { front: 'Are Copilot Studio and Foundry agent interactions covered by Purview Audit (Standard)?', back: 'Yes, as Microsoft applications; non-Microsoft AI apps need pay-as-you-go billing with 180-day retention.' },
    { front: 'Which Dataverse feature records field-level changes and user access for audit?', back: 'Dataverse auditing, enabled per table and column with a configurable retention period and optional user access logging.' },
    { front: 'What evidence supports the transparency principle in an agent design?', back: 'AI disclosure and privacy statement at conversation start, citations, documented capabilities and limitations, model cards and a feedback mechanism.' },
    { front: 'What is the Copilot Agent Kit Compliance Hub?', back: 'A Power CAT tool that evaluates Copilot Studio agent configurations from Agent Inventory against controls and can trigger review, quarantine or deletion.' },
  ],
  quiz: [
    {
      question:
        'A multinational wants one view of all agents, including those built on a non-Microsoft platform, with ownership, usage and risk signals, and the ability to block a risky agent immediately. Which solution should the architect propose?',
      options: [
        'Copilot Studio Monitor page for each agent',
        'Microsoft Agent 365 with the agent registry and connected platforms',
        'Power Platform pipelines',
        'Viva Insights Copilot Dashboard',
      ],
      correct: [1],
      explanation:
        'Agent 365 provides the cross-platform registry, risk signals and blocking. Monitor is per agent, pipelines deploy, and the Viva dashboard reports adoption.',
    },
    {
      question:
        'A claims agent would automatically reject low-scoring claims using a model trained mostly on urban claimants, with no notice to customers and no appeal path. Which TWO responsible AI principles are MOST clearly at risk? (Select two)',
      options: ['Fairness', 'Accountability', 'Performance efficiency', 'Cost optimisation'],
      correct: [0, 1],
      explanation:
        'Unrepresentative data creates fairness risk and the lack of oversight and appeal is an accountability gap (transparency is also affected). Performance efficiency and cost optimisation are Well-Architected pillars, not responsible AI principles.',
    },
    {
      question:
        'A German bank requires that prompts for its Foundry-hosted agent are processed only within the EU. Which deployment type and control should you specify?',
      options: [
        'Global Standard, because it has the broadest model availability',
        'EU Data Zone (or regional) deployments, enforced with Azure Policy',
        'Any deployment type, since data at rest is always in the EU',
        'Model router in Quality mode',
      ],
      correct: [1],
      explanation:
        'Data Zone and regional deployments constrain processing location; Global may process anywhere. Data at rest staying in the EU does not cover processing, and model router mode does not set residency.',
    },
    {
      question:
        'A Copilot Studio agent in a non-US environment cannot use a generative feature, and the agents overview page shows a message about availability. What must happen, and who can do it?',
      options: [
        'A maker enables generative orchestration in the agent settings',
        'A global or Power Platform administrator allows data movement across regions in Power Platform, accepting that prompts and outputs may be processed where the feature is hosted',
        'Microsoft Support must move the tenant to the United States',
        'The maker adds more Copilot Credits',
      ],
      correct: [1],
      explanation:
        'Cross-region data movement consent is an admin decision in Power Platform. Orchestration settings, tenant moves and credits do not unlock a region-restricted feature.',
    },
    {
      question:
        'A regulator may ask why an agent changed a record and which model produced the recommendation. Which design provides the required audit trail?',
      options: [
        'Keep the Copilot Studio test panel history',
        'Enable Dataverse auditing on affected tables, attribute actions to an agent identity, retain Purview audit and transcripts, pin model versions with evaluation results per release, and correlate conversation IDs across systems',
        'Export the Monitor page summary monthly',
        'Rely on the model provider\'s logs',
      ],
      correct: [1],
      explanation:
        'Only a layered trail across data, interaction, configuration and model records answers both questions. Test panel history, monthly summaries and provider logs are incomplete or unavailable.',
    },
    {
      question:
        'An organisation needs interaction audit logs for a Copilot Studio agent published to a non-Microsoft channel and for a third-party AI assistant. Which statement is correct?',
      options: [
        'Both are included in Purview Audit (Standard) at no additional cost',
        'Copilot Studio agents on non-Microsoft channels and non-Microsoft AI apps require pay-as-you-go billing for interaction audit logs, retained for 180 days',
        'Audit logs are not available for Copilot Studio agents',
        'Only Microsoft 365 Copilot interactions can be audited',
      ],
      correct: [1],
      explanation:
        'Microsoft documents pay-as-you-go billing for non-Microsoft AI app interactions and for Copilot Studio agents on non-Microsoft channels. Microsoft applications, including Copilot Studio and Foundry apps, are otherwise covered by Audit Standard.',
    },
  ],
  statements: [
    { text: 'Microsoft Agent 365 can block a risky agent while the security team investigates.', isTrue: true, explanation: 'Blocking is part of the Agent 365 security pillar.' },
    { text: 'Transparency is satisfied by publishing the agent\'s source code to users.', isTrue: false, explanation: 'Transparency means users know they interact with AI, what it can do and where answers come from; disclosure, citations and documented limitations are the evidence.' },
    { text: 'Once cross-region data movement is allowed in Power Platform, removing consent reverses past data movement.', isTrue: false, explanation: 'Microsoft states movement that occurred while enabled cannot be reversed by removing consent.' },
    { text: 'Foundry Data Zone deployments process data only within the specified zone such as the EU.', isTrue: true, explanation: 'Data Zone types constrain processing to the US, EU or APAC zone.' },
    { text: 'Copilot Studio agent name and description are stored globally rather than only in the primary geography.', isTrue: true, explanation: 'Microsoft lists application name, description and logo as globally stored metadata.' },
    { text: 'Dataverse auditing must be enabled per table and column to record data changes made by agents.', isTrue: true, explanation: 'Auditing is configured at environment, table and column level with a retention period.' },
    { text: 'Microsoft 365 Copilot prompts are used to train foundation models unless the tenant opts out.', isTrue: false, explanation: 'Prompts and responses stay in the tenant and are not used to train foundation models.' },
  ],
  resources: [
    { label: 'Cloud Adoption Framework: Govern AI', url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/ai/govern' },
    { label: 'Microsoft Agent 365 overview', url: 'https://learn.microsoft.com/en-us/microsoft-agent-365/overview' },
    { label: 'Geographic data residency in Copilot Studio', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/geo-data-residency' },
    { label: 'Audit logs for Copilot and AI applications (Microsoft Purview)', url: 'https://learn.microsoft.com/en-us/purview/audit-copilot' },
  ],
};

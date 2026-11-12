import type { Concept } from '../../types';

export const purviewDataProtection: Concept = {
  id: 'purview-data-protection',
  title: 'Protecting Data for Microsoft 365 and AI with Microsoft Purview',
  summary:
    'Identifying requirements for Purview Data Loss Prevention (including the Copilot, Copilot Chat and Cowork location), information protection (sensitive information types, sensitivity labels and label policies), data lifecycle management (retention policies and labels, including Copilot interactions), responding to DLP alerts, and monitoring AI activity with Data Security Posture Management for AI.',
  certs: ['ab-650', 'ab-900'],
  domains: ['ab-650-2', 'ab-900-2'],
  outcomes: ['ab-650-2-4-1', 'ab-650-2-4-2', 'ab-650-2-4-3', 'ab-650-2-4-4', 'ab-650-2-4-5', 'ab-900-2-1-2', 'ab-900-2-3-7'],
  tags: ['microsoft-purview', 'dlp', 'sensitivity-labels', 'sensitive-information-types', 'retention', 'dspm-for-ai', 'audit', 'copilot-data-protection'],
  difficulty: 'intermediate',
  diagram: 'copilot-data-protection',
  sections: [
    {
      heading: 'Data Loss Prevention across workloads and Copilot',
      body: `A **DLP policy** in the Microsoft Purview portal (**Data loss prevention > Policies**) combines **locations**, **rules** (conditions, exceptions, actions, user notifications, incident reports and alerts) and a **mode** (test with or without policy tips, or on). Requirements differ by location:

| Location | Typical requirement | Notes |
|---|---|---|
| **Exchange** | Block or encrypt email with sensitive info to external recipients | Conditions on recipient domain, attachments, sender; actions block, encrypt, notify, override with justification |
| **SharePoint and OneDrive** | Restrict external sharing links of files containing PII | Actions block everyone, block external only, or block Anyone links; can scope to sites or accounts |
| **Teams** | Block sensitive text in chat and channel messages | Needs Teams in scope; applies to guests and external chats |
| **Devices (Endpoint DLP)** | Prevent copying to USB, printing, uploading to unsanctioned sites | Devices must be onboarded; restricted app groups and service domains |
| **On-premises repositories, Fabric and Power BI, cloud apps** | Extend to file shares and SaaS via the Purview scanner and Defender for Cloud Apps | Non-Microsoft connected apps in preview |
| **Microsoft 365 Copilot, Copilot Chat and Cowork** | Stop Copilot from using labelled content as grounding or processing sensitive prompts | Conditions: *content contains sensitivity label* (one rule) or *sensitive info types* (separate rule); actions: prevent Copilot from processing content, including *performing web searches*; preview control to exclude external email |

The Copilot location is what the exam means by "DLP for Copilot": *if a file carries the Highly Confidential label, Copilot and agents must not reference it*; *if a prompt contains credit card numbers, do not send it to web search*. Labels and SITs cannot share a rule. **AI Administrator**, **Purview Data Security AI Admin**, Compliance Administrator and Information Protection Admin can create these policies. Design points: start in **simulation mode**, use **policy tips**, set rule **priority** (the most restrictive match wins), and allow **justification overrides** sparingly; **Adaptive Protection** can scope DLP to users at elevated insider risk.`,
    },
    {
      heading: 'Information protection: SITs, sensitivity labels and label policies',
      body: `**Sensitive information types (SITs)** are pattern-based classifiers (regex, keywords, checksums, confidence levels) such as credit card numbers, passport numbers or national IDs; Microsoft ships hundreds, plus **named entity SITs** (names, addresses, medical terms), **credential SITs** (E5) and **exact data match** for your own records. You can **copy a built-in SIT to customise it** or create custom SITs and keyword dictionaries. **Trainable classifiers** use machine learning for document types such as contracts or source code. SITs feed DLP, auto-labelling, retention labels, Insider Risk Management and communication compliance.

**Sensitivity labels** classify and optionally protect content. Label settings include **scope** (files and emails, meetings, groups and sites, schematised data assets), **content marking** (header, footer, watermark), **encryption** with usage rights (assign permissions now or let users assign), **auto-labelling** in Office apps based on SITs, and **container settings** for Teams, groups and SharePoint sites (privacy, external sharing, unmanaged device access, authentication context). Labels are published to users through a **label policy** (which users see which labels, default label, mandatory labelling, justification for downgrades, custom help link) and can be applied automatically at scale by **auto-labelling policies** (service-side, simulation first) and to SharePoint libraries by default.

For Copilot the rules are precise: Copilot only returns labelled, encrypted content when the user has **VIEW and EXTRACT** usage rights; a response that draws on labelled files **inherits the most restrictive label**; label names and markings show in the apps; and sensitivity labels must be **enabled for SharePoint and OneDrive** for encrypted files to be processed at rest. Agent 365 agent instances need explicit VIEW and EXTRACT rights too, because "all users in the organization" does not include agents. Requirements analysis means choosing: a label (classify and protect wherever the file travels), DLP (block an action), or both (DLP conditioned on the label).`,
    },
    {
      heading: 'Data lifecycle management: retention policies and labels',
      body: `**Retention** keeps content for compliance (retain-only), deletes it when it is no longer needed (delete-only), or does both (retain then delete). Two mechanisms:

- **Retention policies** apply the same settings to a **whole location** (Exchange mailboxes, SharePoint sites, OneDrive accounts, Microsoft 365 groups, Teams chats and channel messages, Viva Engage, and the **Microsoft Copilot experiences** and other AI app locations). They are the right answer for "retain all Teams chats for 3 years" or "delete Copilot prompts after 180 days". **Adaptive scopes** target locations by attributes.
- **Retention labels** apply settings to **individual items** (documents, emails, folders) and are published through a **retention label policy** (users apply manually) or applied automatically with **auto-apply policies** (by SIT, keyword, trainable classifier or cloud attachment). Labels can mark items as **records** or **regulatory records**, start retention from an event (**event-based retention**), trigger a **disposition review**, and apply a default label to a library. Only labels support records management.

How it works under the covers: retained content stays in place; edited or deleted copies go to the **Preservation Hold library** (SharePoint and OneDrive) or **Recoverable Items** (Exchange), and Teams, Copilot and AI app messages go to a hidden **SubstrateHolds** folder in the user's mailbox, searchable with eDiscovery. **Principles of retention** resolve conflicts: retention wins over deletion, the longest retention period wins, explicit (label) wins over implicit (policy), and the shortest deletion period wins. Copilot and Copilot Chat retention is now its own location (separate from Teams chats), and newer policies can also cover Copilot Studio, Security Copilot, Entra-registered AI apps and, with collection policies, third-party apps like ChatGPT. Requirements questions hinge on *location-level versus item-level*, *records versus ordinary retention*, and *which workloads must be in scope*.`,
    },
    {
      heading: 'DLP alerts and Data Security Posture Management for AI',
      body: `**DLP alerts** are configured per rule (incident reports, alert severity, single-event or aggregated thresholds, email recipients) and investigated in **Purview portal > Data loss prevention > Alerts**. The dashboard filters by severity, policy, workload and status; each alert shows **Details**, **Events** (with matched sensitive content preview for users holding the Content Explorer Content Viewer role group), **User activity summary** (needs Insider Risk Management sharing), and allows **triage** (status, assignment, comments) and resolution. **Security Copilot** can summarise alerts and the **Alert Triage Agent** ranks them. Access needs the **Manage alerts** role plus DLP Compliance Management (or View-Only); role groups such as Information Protection Admins, Analysts and Investigators, Compliance Administrator and Security Operator qualify. Alert retention follows your audit log retention. For AI services, DLP alerts for the Copilot location show which prompt matched which SIT or label; activity also lands in **activity explorer**.

**Data Security Posture Management (DSPM) for AI** (Purview portal > Solutions > DSPM for AI, now being folded into the broader **DSPM** with an **AI observability** page for agent instances) is the front door for securing AI usage: **Reports** on prompts and responses containing sensitive data across Copilot, agents, Enterprise AI apps (Entra-registered apps, ChatGPT Enterprise, Foundry) and third-party sites (via the Purview browser extension and onboarded devices); **Recommendations** with **one-click policies** (DLP policy to detect sensitive info sent to AI sites, default sensitivity labels, block labelled content from Copilot processing, Insider Risk Management *risky AI usage* policy, Compliance Manager AI regulation assessments); a **weekly data risk assessment** of the top 100 SharePoint sites by usage plus custom assessments to find oversharing; and **activity explorer** showing prompt and response text, referenced files, web search queries and labels. Prerequisites are **audit on** and, for Copilot interactions, licensed users; allow 24 hours for new policies. Administrators using administrative units must be unrestricted to create the one-click policies. Interactions are also in the **unified audit log** (record types for Copilot interactions, 180-day pay-as-you-go retention for non-Microsoft AI apps) and searchable with **eDiscovery**.`,
    },
  ],
  examples: [
    {
      title: 'Blocking Copilot from summarising Highly Confidential documents',
      description:
        'Legal requires that files labelled Highly Confidential never appear in Copilot or agent responses, even for users who can open them. The compliance admin creates a DLP policy with the Microsoft 365 Copilot, Copilot Chat and Copilot Cowork location, a rule with the condition "Content contains > Sensitivity labels > Highly Confidential" and the action "Prevent Copilot from processing content", runs it in simulation for a week to size the impact, then turns it on. A second rule in the same policy uses SITs for credit card numbers with the action to prevent web searches.',
      language: 'json',
      code: `{
  "policy": "Copilot - protect labelled and sensitive content",
  "locations": ["Microsoft 365 Copilot, Copilot Chat, and Copilot Cowork"],
  "rules": [
    { "name": "Block labelled grounding",
      "condition": { "contentContainsSensitivityLabel": ["Highly Confidential"] },
      "action": "PreventCopilotFromProcessingContent" },
    { "name": "No web search for card numbers",
      "condition": { "contentContainsSensitiveInfoType": ["Credit Card Number"] },
      "action": "PreventCopilotFromProcessingContent:PerformingWebSearches" }
  ],
  "mode": "TestWithoutNotifications -> Enable"
}`,
      takeaway: 'The Copilot DLP location controls what Copilot may process; labels and SITs go in separate rules.',
    },
    {
      title: 'Retention label versus retention policy',
      description:
        'Finance must keep signed contracts for ten years as immutable records, while all other content in the Finance site should be deleted after seven years. The admin publishes a "Contract - Record" retention label (10 years, declared as record) and auto-applies it to documents matching the contract trainable classifier, and creates a retention policy on the Finance site that deletes after seven years. Because explicit label retention wins over the policy and retention wins over deletion, contracts survive the seven-year delete.',
      takeaway: 'Policies set location-wide baselines; labels handle item-level exceptions and records; the principles of retention resolve the overlap.',
    },
    {
      title: 'Labels without EXTRACT rights broke Copilot (a realistic mistake)',
      description:
        'A team publishes a "Confidential - Finance" label that encrypts documents and grants Finance users only VIEW permission to keep them from copying text. Finance then reports that Copilot in Word cannot summarise any labelled file. Copilot needs both VIEW and EXTRACT usage rights to use encrypted content. The fix is to grant EXTRACT (for example Co-Author or a custom permission set including Extract) to the intended users, and to enable sensitivity labels for SharePoint and OneDrive so encrypted files are processed at rest.',
      takeaway: 'Encryption that denies EXTRACT hides content from Copilot for everyone, including authorised users; design usage rights with AI in mind.',
    },
    {
      title: 'Using DSPM for AI to find what Copilot is exposing',
      description:
        'After rollout, the CISO asks how much sensitive data Copilot is touching. The compliance admin opens DSPM for AI, confirms audit is on, activates the one-click policies, and a day later reviews the Reports section: 340 prompts referenced files with credit card numbers, mostly from two SharePoint sites flagged in the weekly data risk assessment as overshared. The admin applies restricted content discovery to those sites, launches a site access review, and creates the recommended DLP policy from the Recommendations card.',
      takeaway: 'DSPM for AI connects AI interaction insights to the data risk assessments and one-click remediation policies.',
    },
  ],
  keyPoints: [
    'DLP policies combine locations, rules and modes; the Microsoft 365 Copilot, Copilot Chat and Cowork location can prevent Copilot from processing labelled content or sensitive prompts, including blocking web search grounding.',
    'Sensitivity labels classify and protect (markings, encryption with usage rights, container settings); label policies publish them; auto-labelling applies them at scale. Copilot needs VIEW and EXTRACT rights and responses inherit the most restrictive label.',
    'SITs are pattern classifiers used by DLP, labels, retention and insider risk; copy built-in SITs to customise, or use trainable classifiers for document types.',
    'Retention policies work at location level; retention labels at item level with records, event-based retention and disposition; Copilot and AI app interactions have their own retention location stored in SubstrateHolds.',
    'Principles of retention: retention beats deletion, longest retention wins, explicit beats implicit, shortest deletion wins.',
    'DLP alerts are triaged in the Purview DLP Alerts dashboard (Manage alerts role plus DLP Compliance Management) with event details, user activity and Security Copilot summaries.',
    'DSPM for AI provides AI usage reports, one-click policies, weekly data risk assessments of the top 100 sites, activity explorer with prompts and responses, and Compliance Manager AI assessments; audit must be on.',
  ],
  flashcards: [
    { front: 'Which DLP location controls what Microsoft 365 Copilot can use as grounding?', back: 'The Microsoft 365 Copilot, Copilot Chat and Copilot Cowork location, with the action "Prevent Copilot from processing content".' },
    { front: 'Can one DLP rule contain both a sensitivity label condition and a sensitive info type condition?', back: 'No. Use separate rules in the same policy.' },
    { front: 'Which usage rights must a user have for Copilot to use an encrypted, labelled file?', back: 'VIEW and EXTRACT.' },
    { front: 'What label does a Copilot response inherit when it draws on several labelled files?', back: 'The most restrictive applicable label.' },
    { front: 'What publishes sensitivity labels to users?', back: 'A sensitivity label policy (which users, default label, mandatory labelling, justification settings).' },
    { front: 'How do you customise a built-in sensitive information type?', back: 'Copy it and edit the copy; built-in SITs themselves cannot be edited.' },
    { front: 'Retention policy or retention label: which applies to a whole SharePoint site?', back: 'A retention policy. Labels apply per item and are the only way to declare records.' },
    { front: 'Where are retained Copilot and Teams messages stored?', back: 'In the hidden SubstrateHolds folder of the user\'s Exchange mailbox, searchable by eDiscovery.' },
    { front: 'State the four principles of retention.', back: 'Retention wins over deletion; longest retention wins; explicit (label) wins over implicit (policy); shortest deletion period wins.' },
    { front: 'Which role is needed to view the DLP Alerts dashboard?', back: 'Manage alerts plus DLP Compliance Management (or View-Only DLP Compliance Management), typically via Information Protection role groups.' },
    { front: 'What does DSPM for AI\'s default data risk assessment cover?', back: 'A weekly assessment of the top 100 SharePoint sites by usage for oversharing; custom assessments can target other locations.' },
    { front: 'What is the prerequisite for seeing Copilot interaction insights in DSPM for AI?', back: 'Microsoft Purview Audit turned on (plus licensed Copilot users).' },
    { front: 'Which Purview tool lets you read the actual prompts, responses and web search queries?', back: 'Activity explorer in DSPM for AI (also searchable through the audit log and eDiscovery).' },
  ],
  quiz: [
    {
      question:
        'Legal requires that documents labelled "Attorney-Client" are never summarised or referenced by Microsoft 365 Copilot or agents, even for lawyers who can open them. What should you configure?',
      options: [
        'A DLP policy with the Microsoft 365 Copilot, Copilot Chat and Copilot Cowork location and a rule that prevents Copilot from processing content with the Attorney-Client label.',
        'A retention label that marks the documents as records.',
        'A sensitivity label policy that makes Attorney-Client the default label.',
        'Restricted SharePoint Search with the legal site excluded.',
      ],
      correct: [0],
      explanation:
        'The Copilot DLP location is designed for this. Retention controls lifecycle, a default label does not block processing, and Restricted SharePoint Search is a discovery stopgap that does not stop users who already access the content.',
    },
    {
      question:
        'Users with permission to Finance files report that Copilot in Excel says it cannot use the workbook. The files carry an encrypting sensitivity label granting the Finance group Viewer rights. What is the cause?',
      options: [
        'Copilot requires the EXTRACT usage right in addition to VIEW to use encrypted content.',
        'Copilot is not licensed for Excel.',
        'The files exceed the Copilot size limit.',
        'Sensitivity labels are not supported in Excel.',
      ],
      correct: [0],
      explanation:
        'Viewer rights lack EXTRACT, so Copilot cannot use the content. Excel is a supported Copilot app, size limits would be reported differently, and labels are supported in Excel.',
    },
    {
      question: 'Which TWO requirements can be met ONLY with retention labels rather than retention policies? (Select two)',
      options: [
        'Declare specific documents as regulatory records.',
        'Start retention when a contract expires (event-based retention).',
        'Retain all Teams channel messages for five years.',
        'Delete all content in a SharePoint site after seven years.',
      ],
      correct: [0, 1],
      explanation:
        'Records declaration and event-based retention are label capabilities. Location-wide retention or deletion is handled by retention policies.',
    },
    {
      question:
        'The CISO wants a weekly view of SharePoint sites that are overshared and are being referenced in Copilot responses that contain sensitive information. Which Purview capability provides this?',
      options: ['DSPM for AI data risk assessments and reports', 'Communication compliance', 'eDiscovery (Premium) review sets', 'Retention label disposition review'],
      correct: [0],
      explanation:
        'DSPM for AI runs a weekly data risk assessment of the top 100 sites and reports sensitive data in Copilot interactions. Communication compliance monitors messages for policy violations, eDiscovery is for investigations, and disposition reviews concern retention expiry.',
    },
    {
      question:
        'A DLP alert shows a Copilot prompt that matched the credit card SIT. The analyst can see the alert but not the matched content preview. Which role group membership resolves this?',
      options: ['Content Explorer Content Viewer', 'Global Reader', 'Attack Simulation Administrator', 'Reports Reader'],
      correct: [0],
      explanation:
        'Content preview and matched sensitive content require the Content Explorer Content Viewer role group. Global Reader and Reports Reader are read-only directory and reporting roles, and Attack Simulation Administrator is unrelated.',
    },
    {
      question:
        'Your organization must retain all Microsoft 365 Copilot prompts and responses for three years and then delete them, without changing the retention applied to Teams chats. What should you create?',
      options: [
        'A retention policy scoped to the Microsoft Copilot experiences location with retain for three years and then delete.',
        'A retention label published to all users.',
        'A DLP policy for the Copilot location.',
        'A Microsoft 365 Backup policy for Exchange mailboxes.',
      ],
      correct: [0],
      explanation:
        'Copilot interactions now have their own retention location, separate from Teams chats. Labels must be applied per item, DLP does not retain, and Backup is for recovery.',
    },
  ],
  statements: [
    { text: 'A single DLP rule can use both a sensitivity label condition and a sensitive information type condition.', isTrue: false, explanation: 'They must be in separate rules of the same policy.' },
    { text: 'Copilot responses that use labelled content inherit the most restrictive label.', isTrue: true, explanation: 'Labels and their protections follow the response.' },
    { text: 'Built-in sensitive information types can be edited directly.', isTrue: false, explanation: 'Copy a built-in SIT to customise it.' },
    { text: 'Retention policies can declare items as records.', isTrue: false, explanation: 'Only retention labels can mark records or regulatory records.' },
    { text: 'When a retention policy says delete after 5 years and a label says retain 10 years, the content is kept for 10 years.', isTrue: true, explanation: 'Retention wins over deletion and the longest period wins.' },
    { text: 'DSPM for AI requires Microsoft Purview Audit to be enabled to show Copilot interactions.', isTrue: true, explanation: 'Audit is on by default for new tenants.' },
    { text: 'DLP for the Copilot location can prevent sensitive prompts from being sent to Bing web search.', isTrue: true, explanation: 'The action "Prevent Copilot from processing content > Performing web searches" does this.' },
    { text: 'DLP alerts remain visible indefinitely regardless of audit retention.', isTrue: false, explanation: 'Alert visibility follows the audit log retention policy.' },
  ],
  resources: [
    { label: 'Learn about Data Loss Prevention for Microsoft 365 Copilot and Copilot Chat', url: 'https://learn.microsoft.com/en-us/purview/dlp-microsoft365-copilot-location-learn-about' },
    { label: 'Learn about sensitivity labels', url: 'https://learn.microsoft.com/en-us/purview/sensitivity-labels' },
    { label: 'Learn about retention for Copilot and AI apps', url: 'https://learn.microsoft.com/en-us/purview/retention-policies-copilot' },
    { label: 'Data Security Posture Management for AI', url: 'https://learn.microsoft.com/en-us/purview/dspm-for-ai' },
  ],
};

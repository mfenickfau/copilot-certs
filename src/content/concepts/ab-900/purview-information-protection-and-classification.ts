import type { Concept } from '../../types';

export const purviewInformationProtectionAndClassification: Concept = {
  id: 'purview-information-protection-and-classification',
  title: 'Microsoft Purview: Information Protection, Sensitivity Labels and Classification',
  summary:
    'A map of the Microsoft Purview solutions an admin must recognise, what sensitivity labels do (and why Copilot cares about the EXTRACT right), how classification finds sensitive data with sensitive information types and trainable classifiers, and how Data explorer and activity explorer show what is labelled and what people do with it.',
  certs: ['ab-900', 'ab-730'],
  domains: ['ab-900-2', 'ab-730-1'],
  outcomes: ['ab-900-2-1-1', 'ab-900-2-1-2', 'ab-900-2-1-3', 'ab-900-2-3-2', 'ab-900-2-3-6', 'ab-730-1-2-3'],
  tags: ['purview', 'sensitivity-labels', 'information-protection', 'classification', 'data-explorer', 'activity-explorer'],
  difficulty: 'intermediate',
  diagram: 'copilot-data-protection',
  sections: [
    {
      heading: 'The Purview family in one page',
      body: `**Microsoft Purview** (purview.microsoft.com) is the data security, governance and compliance suite for Microsoft 365, and the exam expects you to match each solution to the problem it solves:

| Solution | Question it answers |
|---|---|
| **Information Protection** | What is this data and how do we protect it? Sensitivity labels, encryption, content marking, auto-labelling. |
| **Data Loss Prevention (DLP)** | How do we stop sensitive data leaving or being used wrongly? Policies that warn, block or audit across Exchange, SharePoint, OneDrive, Teams, devices and Copilot. |
| **Insider Risk Management** | Which users are behaving riskily (data theft by leavers, data leaks, risky AI usage)? Pseudonymised alerts and cases. |
| **Communication Compliance** | Are messages (mail, Teams, Copilot prompts and responses) violating conduct or regulatory policies? |
| **Data Security Posture Management (DSPM) for AI** | How is AI being used, what sensitive data reaches it, and where is oversharing? One-click policies, reports and data risk assessments. |
| **Data Lifecycle Management** | What do we keep and what do we delete, and for how long? Retention policies and labels. |

Supporting solutions include **Audit**, **eDiscovery**, **Compliance Manager** and **Records Management**. Licensing splits them: Microsoft 365 E3 brings manual labelling, core DLP, standard audit and retention; **E5** adds automatic labelling, Insider Risk Management, Communication Compliance, Audit Premium and DSPM for AI assessments. Roles are assigned through Purview **role groups** (Compliance Administrator, Information Protection Admin, and so on) rather than only Entra roles.

Every one of these applies to Copilot: labels gate what Copilot can use, DLP can stop prompts or files being processed, IRM and Communication Compliance watch interactions, retention and eDiscovery cover prompts and responses, and DSPM for AI ties them together.`,
    },
    {
      heading: 'Sensitivity labels: use cases and behaviour',
      body: `A **sensitivity label** is a persistent, clear-text tag written into a file or email's metadata that travels with the content and can enforce protection. Labels are created in Purview, organised in a taxonomy such as *Public, General, Confidential, Highly Confidential* (with sublabels), and published to users through **label policies** that can make a label mandatory or set a default.

Use cases you should recognise:

- **Classification only**: a visual marker and reporting data with no enforcement, often the first step.
- **Content marking**: headers, footers and watermarks.
- **Encryption** with usage rights: who can open, edit, print, copy or forward. Encryption follows the file off the tenant.
- **Container labels** on Teams, Microsoft 365 groups and SharePoint sites: privacy, guest access, external sharing level, unmanaged device access and default library labels.
- **Auto-labelling**: client-side recommendations or automatic application when sensitive information types are detected, and service-side auto-labelling policies for data at rest in SharePoint, OneDrive and Exchange (E5).
- **Default labels** for document libraries and extending SharePoint permissions to downloaded files.
- Labels for Power BI, meetings and Loop.

For Copilot the rule is simple and heavily tested: Copilot honours labels. If a label encrypts content, Copilot can only use it when the user has both the **VIEW** and **EXTRACT** usage rights. A response built from labelled sources **inherits the most restrictive label**, and a document Copilot creates from labelled content carries that label. DLP can additionally prevent Copilot from processing items with specific labels. Sensitivity labels must be **enabled for SharePoint and OneDrive** so encrypted files stored there are indexed and protected properly.`,
    },
    {
      heading: 'Classification: finding the sensitive data',
      body: `Protection depends on knowing what the data is. Purview **classifiers** (Purview portal > Information Protection, DLP or DSPM > Classifiers) identify sensitive content so that labels, DLP, IRM and retention can act on it:

- **Sensitive information types (SITs)**: pattern-based detections (regular expressions, keywords, checksums) for credit card numbers, national IDs, bank accounts, passport numbers and hundreds more; you can create custom SITs for internal identifiers such as project codes.
- **Named entities**: SITs for people's names, addresses and medical terms.
- **Exact data match (EDM)**: matches exact values from your own uploaded table, such as real customer numbers, with very few false positives.
- **Trainable classifiers**: machine-learning models that recognise *kinds* of documents (contracts, source code, resumes, harassment, threats) from examples rather than patterns; Microsoft supplies pre-trained ones and you can train custom ones.
- **Document fingerprinting**: recognises variations of a template such as a form.
- **Credentials** SITs, **OCR** for text in images, and **on-demand classification** to scan existing files at rest that were never classified.

Classification results feed everything else: a DLP rule fires when a SIT is matched, an auto-labelling policy applies *Confidential* when ten or more customer numbers appear, and DSPM for AI reports which SITs appeared in prompts. The exam distinguishes SITs (patterns) from trainable classifiers (examples), and EDM (exact values) from the other two. When a question says "the organisation's own list of account numbers with minimal false positives", choose EDM; when it says "recognise contracts regardless of wording", choose a trainable classifier.`,
    },
    {
      heading: 'Data explorer and activity explorer',
      body: `Two explorers under *Information Protection > Explorers* let you see classification in action.

**Data explorer** (the renamed content explorer) shows a current **snapshot of items** that carry a sensitivity label, a retention label or a matched sensitive information type, grouped by classifier and by location (Exchange, SharePoint, OneDrive, Teams). Use it to answer "where is credit card data stored?" or "how many files are labelled Highly Confidential in the Finance site?". Because it can reveal file contents, access is deliberately restricted: the **Data Explorer List viewer** role group sees items and locations, and **Data Explorer Content viewer** is additionally required to open the content. Membership in Compliance Administrator alone is not enough. Encrypted documents cannot be previewed.

**Activity explorer** shows a **historical view of activities** on labelled or sensitive content for the last 30 days, drawn from the unified audit log: label applied, changed or removed; file copied to USB, printed or uploaded to the cloud; DLP rule matched; files shared externally. About 50 filters (date, activity, location, label, user, device, DLP policy) and predefined **filter sets** (Endpoint DLP activities, Egress activities, DLP policies that detected activities) speed up triage. Data arrives on the audit-log schedule, typically 60 to 90 minutes after the event, so an empty view right after enabling a policy is normal.

Exam angle: *what is labelled and where* is Data explorer; *what users did with it* is activity explorer. DSPM for AI has its own activity explorer focused on AI interactions, where prompt and response text can be viewed with the right permissions.`,
    },
  ],
  examples: [
    {
      title: 'Choosing the right Purview solution',
      description:
        'A CISO lists three worries: payroll files are being summarised by Copilot for people who should not see them, an employee resigning next week has started downloading customer lists, and someone is using Copilot Chat to write abusive messages. The admin maps them: a sensitivity label with encryption plus a DLP policy for the Copilot location; an Insider Risk Management "Data theft by departing users" policy; and a Communication Compliance policy covering Copilot prompts and responses.',
      takeaway: 'Each Purview solution answers a different question; match the symptom to the solution before configuring anything.',
    },
    {
      title: 'The label that did not stop Copilot (a realistic mistake)',
      description:
        'An admin applies a "Highly Confidential" label with content marking only to the M&A library and is surprised that Copilot still summarises the documents for anyone with site access. Marking is not protection. The fix is to configure encryption on the label so only the deal team has VIEW and EXTRACT rights, or to add a DLP rule that prevents Copilot from processing items with that label, and to fix the broad site permissions.',
      takeaway: 'Labels only restrict Copilot when they encrypt (and the user lacks EXTRACT) or when DLP references them; markings alone change nothing.',
    },
    {
      title: 'Finding where card data lives',
      description:
        'Audit asks how many files containing credit card numbers exist outside the Payments site. A member of the Data Explorer List viewer role group opens Data explorer, selects the Credit Card Number SIT, and browses by SharePoint location to produce the count without opening any file. Activity explorer then shows that two of those files were recently shared externally, which becomes a DLP policy requirement.',
      takeaway: 'Data explorer answers where sensitive data is; activity explorer answers what happened to it.',
    },
  ],
  keyPoints: [
    'Purview solutions: Information Protection (labels), DLP, Insider Risk Management, Communication Compliance, DSPM for AI, Data Lifecycle Management, plus Audit, eDiscovery and Compliance Manager; E5 unlocks auto-labelling, IRM, Communication Compliance and advanced AI posture features.',
    'Sensitivity labels are persistent metadata that can mark, encrypt and govern containers; label policies publish them and can set defaults or make labelling mandatory.',
    'Copilot honours labels: encrypted content requires VIEW and EXTRACT rights, responses inherit the most restrictive label, and DLP can block Copilot from processing labelled items.',
    'Classifiers: SITs match patterns, EDM matches exact uploaded values, trainable classifiers recognise document types from examples; fingerprinting, OCR and on-demand classification extend coverage.',
    'Data explorer is a snapshot of labelled or sensitive items by location, gated by Data Explorer List viewer and Content viewer role groups.',
    'Activity explorer is a 30-day history of label, DLP and egress activity from the audit log, with filters and filter sets.',
    'Enable sensitivity labels for SharePoint and OneDrive so encrypted Office files are processed and protected in those services.',
  ],
  flashcards: [
    { front: 'Which Purview solution detects risky behaviour such as data theft by departing users?', back: 'Microsoft Purview Insider Risk Management.' },
    { front: 'Which Purview solution reviews Copilot prompts and responses for harassment or regulatory violations?', back: 'Microsoft Purview Communication Compliance.' },
    { front: 'Which Purview solution provides one-click policies, AI usage reports and data risk assessments?', back: 'Data Security Posture Management (DSPM) for AI.' },
    { front: 'What two usage rights must a user hold for Copilot to use an encrypted labelled file?', back: 'VIEW and EXTRACT.' },
    { front: 'What label does a Copilot response inherit when it draws on several labelled files?', back: 'The most restrictive (highest priority) label among them.' },
    { front: 'What is a container label?', back: 'A sensitivity label applied to a team, Microsoft 365 group or SharePoint site to control privacy, guest access, external sharing and device access.' },
    { front: 'SIT vs trainable classifier?', back: 'SITs match patterns such as card numbers; trainable classifiers recognise document types from training examples.' },
    { front: 'When should you use exact data match?', back: 'When you need to match your own specific values (for example real customer IDs) with minimal false positives.' },
    { front: 'Which role groups are needed to view item contents in Data explorer?', back: 'Data Explorer List viewer plus Data Explorer Content viewer.' },
    { front: 'How far back does activity explorer report?', back: 'Up to 30 days, sourced from the unified audit log.' },
  ],
  quiz: [
    {
      question: 'Contoso wants Copilot to be unable to summarise board documents for anyone outside the executive team, even if those users have access to the SharePoint site. Which configuration achieves this MOST directly?',
      options: [
        'Apply a sensitivity label with a footer watermark to the documents.',
        'Apply a sensitivity label that encrypts the documents and grants VIEW and EXTRACT rights only to the executive group.',
        'Create a retention label of seven years for the documents.',
        'Archive the SharePoint site.',
      ],
      correct: [1],
      explanation:
        'Encryption with restricted usage rights stops Copilot returning content to users without EXTRACT. Watermarks do not restrict access, retention governs deletion, and archiving removes the site from use entirely.',
    },
    {
      question: 'You must detect documents that are employment contracts regardless of their wording or template. Which classifier type should you use?',
      options: ['A built-in sensitive information type', 'Exact data match', 'A trainable classifier', 'Document fingerprinting'],
      correct: [2],
      explanation:
        'Trainable classifiers learn document types from examples. SITs and EDM match patterns or values, and fingerprinting only recognises variations of a specific template.',
    },
    {
      question: 'An information protection analyst needs to list every SharePoint location that contains files matching the Credit Card Number sensitive information type. Which tool should they use?',
      options: ['Activity explorer', 'Data explorer', 'Compliance Manager', 'Entra audit logs'],
      correct: [1],
      explanation:
        'Data explorer is the snapshot of items by classifier and location. Activity explorer shows actions over time, Compliance Manager tracks regulatory controls, and Entra logs record directory changes.',
    },
    {
      question: 'Which TWO capabilities belong to Microsoft Purview Information Protection sensitivity labels? (Select two)',
      options: [
        'Encrypting a document so only specified users can open it',
        'Deleting content automatically after five years',
        'Controlling guest access and external sharing on a labelled team or site',
        'Correlating security alerts into incidents',
      ],
      correct: [0, 2],
      explanation:
        'Encryption and container settings are label features. Automatic deletion is Data Lifecycle Management (retention), and incident correlation is Defender XDR.',
    },
    {
      question: 'A compliance administrator is a member of the Compliance Administrator role group but cannot open file contents in Data explorer. What should be done?',
      options: [
        'Add them to the Data Explorer Content viewer role group.',
        'Make them a Global Administrator.',
        'Assign the SharePoint Administrator role.',
        'Enable Audit (Premium).',
      ],
      correct: [0],
      explanation:
        'Content viewing in Data explorer is gated by the dedicated Content viewer role group regardless of other roles. Global Administrator violates least privilege and does not grant this, SharePoint roles are unrelated, and audit licensing does not change explorer permissions.',
    },
    {
      question: 'A new DLP policy was enabled 20 minutes ago but activity explorer shows no matches, although users report being blocked. What is the MOST likely explanation?',
      options: [
        'The policy failed and must be recreated.',
        'Activity explorer data comes from the audit log and typically appears 60 to 90 minutes after the activity.',
        'Activity explorer only shows sensitivity label events, never DLP events.',
        'The users are not licensed for Purview.',
      ],
      correct: [1],
      explanation:
        'Activity explorer is not real time. It does show DLP events, the policy is clearly working because users are blocked, and licensing would not produce this symptom.',
    },
  ],
  statements: [
    { text: 'A sensitivity label with content marking only will prevent Copilot from summarising the labelled document.', isTrue: false, explanation: 'Only encryption (without EXTRACT rights) or a DLP policy referencing the label restricts Copilot.' },
    { text: 'Copilot responses inherit the most restrictive sensitivity label of the content they reference.', isTrue: true, explanation: 'Label inheritance protects generated output.' },
    { text: 'Exact data match uses regular expressions to find patterns such as card numbers.', isTrue: false, explanation: 'EDM matches exact values from an uploaded table; pattern matching is what sensitive information types do.' },
    { text: 'Data explorer shows a current snapshot of items with labels or sensitive information types.', isTrue: true, explanation: 'It answers "what is where", not "what happened".' },
    { text: 'Automatic (service-side) auto-labelling policies require Microsoft 365 E5 or equivalent licensing.', isTrue: true, explanation: 'E3 provides manual labelling; automatic labelling is an E5 capability.' },
    { text: 'Communication Compliance is the Purview solution that applies encryption to files.', isTrue: false, explanation: 'Encryption comes from Information Protection sensitivity labels; Communication Compliance reviews messages.' },
    { text: 'Container labels can control whether a team allows guest members.', isTrue: true, explanation: 'Container labels set privacy, guest access, external sharing and unmanaged device access.' },
  ],
  resources: [
    { label: 'Learn about sensitivity labels (Microsoft Purview)', url: 'https://learn.microsoft.com/en-us/purview/sensitivity-labels' },
    { label: 'Microsoft Purview data security and compliance protections for generative AI apps', url: 'https://learn.microsoft.com/en-us/purview/ai-microsoft-purview' },
    { label: 'Get started with Data explorer', url: 'https://learn.microsoft.com/en-us/purview/data-classification-data-explorer' },
    { label: 'Get started with activity explorer', url: 'https://learn.microsoft.com/en-us/purview/data-classification-activity-explorer' },
  ],
};

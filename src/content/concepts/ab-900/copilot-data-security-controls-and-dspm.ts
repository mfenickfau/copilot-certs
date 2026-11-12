import type { Concept } from '../../types';

export const copilotDataSecurityControlsAndDspm: Concept = {
  id: 'copilot-data-security-controls-and-dspm',
  title: 'Securing Copilot: Data Access, Microsoft Graph, Layered Controls and DSPM for AI',
  summary:
    'The administrator view of how Copilot reaches data through Microsoft Graph and the semantic index, which Microsoft 365, Purview and Defender controls shape and restrict that access, how Microsoft\'s responsible AI principles show up as product safeguards, and how DSPM for AI discovers and manages AI activity.',
  certs: ['ab-900', 'ab-731'],
  domains: ['ab-900-2', 'ab-731-2', 'ab-731-3'],
  outcomes: ['ab-900-2-2-1', 'ab-900-2-2-2', 'ab-900-2-2-3', 'ab-900-2-2-4', 'ab-900-2-3-7', 'ab-731-2-1-6', 'ab-731-3-1-4'],
  tags: ['copilot', 'microsoft-graph', 'semantic-index', 'dspm-for-ai', 'responsible-ai', 'purview', 'defender', 'data-security'],
  difficulty: 'intermediate',
  diagram: 'copilot-data-protection',
  sections: [
    {
      heading: 'How Copilot accesses data, from the admin side',
      body: `Microsoft 365 Copilot is an orchestration engine between three components: the large language model, your organisation's content in **Microsoft Graph**, and the Microsoft 365 apps. When a user prompts, the orchestrator performs **grounding**: it queries Graph for relevant mail, chats, meetings, files and people, optionally adds the open document and web results, sends the enriched prompt to the LLM inside the Microsoft 365 service boundary, applies responsible-AI and compliance post-processing, and returns a cited answer.

What an administrator must know about that path:

- **Every Graph call runs as the signed-in user.** Copilot only returns content the user already has at least view permission to. It never elevates, never crosses tenants, and never bypasses sharing settings.
- **The semantic index** extends Graph search with meaning-based retrieval over the user's accessible content. It is permission-trimmed the same way, and it is why oversharing surfaces so fast after rollout.
- **Prompts, responses and grounding data stay in the tenant**, are stored in the user's mailbox for compliance, and are **not used to train foundation models**. This is the enterprise data protection (EDP) commitment that also covers Copilot Chat for unlicensed users signed in with a work account.
- **Web search** is a separate grounding source governed by an admin policy; a prompt (or part of it) may be sent to Bing as a search query when enabled.
- **Agents and connectors** can extend grounding beyond Microsoft 365, and each carries its own privacy terms that admins review before approval.

Because access is inherited, the administrator's main lever on *what Copilot can see* is not a Copilot setting at all: it is permissions, labels and site governance.`,
    },
    {
      heading: 'How Microsoft Graph shapes responses',
      body: `**Microsoft Graph** is the unified API and data layer over Microsoft 365: Exchange, SharePoint, OneDrive, Teams, Entra ID, Planner and more, plus whatever **Copilot connectors** ingest from external systems such as ServiceNow, Confluence or file shares. Copilot's **Work IQ** understanding of people, content and workflows is built on Graph signals, so the shape of Graph directly influences answers:

- **Breadth of grounding**: a user with rich mail, Teams and SharePoint activity gets grounded, specific answers; a new hire with little Graph footprint gets generic ones. Copilot connectors add external knowledge for everyone who has permission to the indexed items.
- **Freshness and relevance**: Graph relationships (who you work with, what you recently edited) drive ranking. Stale, duplicate or abandoned content lowers quality, which is why Microsoft recommends site lifecycle management and retention clean-up before rollout.
- **Permission trimming**: Graph enforces the source permissions, including those granted to guests and through shared channels. Broad groups such as *Everyone except external users* mean broad grounding.
- **Signals Copilot cannot use**: content excluded by **Restricted Content Discovery**, items a user cannot EXTRACT because of an encrypting label, S/MIME mail, password-protected files not currently open, and anything a DLP policy prevents Copilot processing.

Admin consequences: (1) connectors are configured and permissioned in the Microsoft 365 admin center and show up as citations; (2) Graph-based **Copilot connectors** and **agents** can be enabled or blocked per user or group; (3) the Copilot readiness report uses Graph activity (Teams, Outlook, Office documents) to suggest which users would benefit most from a licence. When a question asks why two users get different answers to the same prompt, the answer is almost always Graph: different permissions or a different working context.`,
    },
    {
      heading: 'Layered controls across Microsoft 365, Purview and Defender',
      body: `Microsoft organises Copilot protection as layers. The exam frames this as the **Copilot Control System** (documented as *Copilot controls*) security and governance pillar, split into **foundational** controls (Microsoft 365 admin center, SharePoint Advanced Management and Purview with E3) and **optimized** controls (Purview and Defender for Cloud Apps with E5).

**Microsoft 365 and SharePoint layer**: permissions hygiene; **SharePoint Advanced Management** data access governance reports, site access reviews, **restricted access control** and **restricted content discovery**; site lifecycle policies; Conditional Access requiring compliant devices for Copilot; Copilot settings that turn features such as web search, image generation or specific agents on or off.

**Purview layer**: **sensitivity labels** (Copilot needs EXTRACT; responses inherit labels; auto-labelling at E5); **DLP** for the Copilot location to block sensitive prompts, labelled files or web search; **Audit** of every interaction; **retention** for the Copilot experiences location; **eDiscovery** including holds; **Insider Risk Management** Risky AI usage and **adaptive protection** that can bar high-risk users from sensitive content through Copilot; **Communication Compliance** for inappropriate prompts; **DSPM for AI** to see all of it in one place.

**Defender layer**: **Defender for Cloud Apps** discovers unsanctioned generative-AI SaaS and can block or monitor it; **Defender XDR** receives risky AI usage signals and shows an **AI agent inventory** and posture; **Defender for Office 365** protects against the phishing mail that Copilot might otherwise summarise as trusted; built-in Copilot protections block **prompt injection** (including cross-prompt injection from documents), harmful content and protected material.

The order of operations Microsoft recommends: reduce exposure first (fix oversharing, apply labels, restrict risky sites), then harden with enforceable defaults (DLP, Conditional Access, retention), then monitor (DSPM, IRM, audit).`,
    },
    {
      heading: 'Responsible AI principles and DSPM for AI',
      body: `Microsoft's **six responsible AI principles** are **fairness**, **reliability and safety**, **privacy and security**, **inclusiveness**, **transparency** and **accountability**. In Copilot they appear as visible controls: citations and "AI-generated" labels (transparency); prompt-injection, harmful-content and protected-material filters (reliability and safety); the permission model, EDP and no-training commitment (privacy and security); accessibility and multi-language support (inclusiveness); audit, admin controls and the Customer Copyright Commitment (accountability). Exam questions ask you to map a feature or practice, such as human review before acting on output, to the right principle.

**Data Security Posture Management (DSPM) for AI** (*Purview portal > Solutions > DSPM for AI*; the classic version is being superseded by the broader DSPM, which keeps the same AI capabilities) is the administrator's control tower for AI activity across **Copilot experiences and agents**, **Enterprise AI apps** (Entra-registered apps, Microsoft Foundry, ChatGPT Enterprise) and **Other AI apps** detected in the browser (ChatGPT, Gemini, DeepSeek). Its pages:

- **Overview**: prerequisites (turn on Audit; browser extension and device onboarding for third-party sites) and **recommendations** with **one-click policies** for sensitive data in prompts (DLP), labelled items (DLP), risky AI usage (IRM), unethical behaviour in Copilot (Communication Compliance) and AI regulations (Compliance Manager).
- **Reports**: sensitive interactions per AI app, top SITs, unprotected files referenced by Copilot.
- **Policies**: status of AI-related policies from every Purview solution.
- **Apps and agents**: which AI apps and agents are used, what sensitive data they touched and how policies protect them.
- **Activity explorer**: AI interaction, sensitive info type and AI website visit events, with prompt and response text and web queries for authorised roles.
- **Data risk assessments**: a default weekly assessment of the top 100 SharePoint sites plus custom assessments, with Identify, Protect (DLP by label, Restricted Content Discovery, auto-labelling, retention) and Monitor (site access review) tabs to fix oversharing.

A Compliance Administrator can activate the one-click policies; allow about 24 hours for data to populate.`,
    },
  ],
  examples: [
    {
      title: 'Two users, one prompt, different answers',
      description:
        'A regional manager and a new analyst both ask Copilot Chat for "our Q3 pipeline risks". The manager gets a precise answer citing a CRM-connected Copilot connector and a leadership Teams channel; the analyst gets a vague summary from a public intranet page. Nothing is misconfigured: the manager has permission to the connector items and channel, the analyst does not. The admin explains the behaviour instead of "fixing" it, and uses it to justify a permissions review of the intranet page.',
      takeaway: 'Microsoft Graph permission trimming and each user\'s working context determine the grounding, and therefore the answer.',
    },
    {
      title: 'Restricting instead of governing (a realistic mistake)',
      description:
        'After an oversharing scare, an admin turns off Copilot for the whole company and enables Restricted SharePoint Search on five sites, assuming this secures the data. Users with existing access still open the files directly, the oversharing is unchanged, and the business loses the tool. The correct sequence is to run DSPM for AI data risk assessments and SharePoint DAG reports, apply Restricted Content Discovery to the riskiest sites as a temporary measure, fix permissions and labels, add a DLP policy for labelled items, and then re-enable Copilot.',
      takeaway: 'Discovery restrictions are temporary and do not change permissions; the durable controls are permissions, labels and DLP.',
    },
    {
      title: 'Standing up DSPM for AI in an afternoon',
      description:
        'A compliance administrator opens DSPM for AI, confirms Audit is on, activates the one-click policies for sensitive data in AI prompts, labelled-item protection and risky AI usage, and waits a day. The Reports page then shows that most sensitive interactions involve a single HR site, the default data risk assessment lists it as shared with everyone, and the Protect tab creates a DLP policy for its label and starts a site access review in one pass.',
      language: 'text',
      code: `Purview portal > Solutions > DSPM for AI
  Overview > Get started
    [x] Turn on Microsoft Purview Audit
    [x] Install Purview browser extension (third-party AI sites)
  Recommendations
    Protect sensitive data referenced in Copilot ........ Create policies
    Protect items with sensitivity labels from Copilot ... Select labels -> Create DLP policy
    Detect risky interactions in AI apps ................ Create IRM policy
  Data risk assessments > Default assessment > HR-Benefits site
    Protect > Restrict access by label | Restrict all items (RCD) | Auto-label | Retention
    Monitor > Start a SharePoint site access review`,
      takeaway: 'DSPM for AI centralises discovery, one-click policies and oversharing remediation for Copilot.',
    },
  ],
  keyPoints: [
    'Copilot grounds prompts through Microsoft Graph and the semantic index, runs every retrieval as the signed-in user, and keeps prompts, responses and grounding data inside the tenant without training foundation models.',
    'Graph breadth, freshness and permissions shape answers; connectors extend grounding, and excluded content (RCD, encrypted without EXTRACT, DLP-blocked) is never used.',
    'Layered controls: Microsoft 365 and SharePoint Advanced Management (permissions, RAC, RCD, lifecycle, Conditional Access), Purview (labels, DLP, audit, retention, eDiscovery, IRM, Communication Compliance), Defender (Cloud Apps, XDR AI inventory, Office 365, built-in prompt-injection and harmful-content filters).',
    'Foundational controls come with E3 plus SharePoint Advanced Management; optimized controls (auto-labelling, IRM, adaptive protection, Communication Compliance, DSPM assessments) need E5.',
    'Responsible AI principles: fairness, reliability and safety, privacy and security, inclusiveness, transparency, accountability, each visible in Copilot safeguards.',
    'DSPM for AI provides recommendations with one-click policies, reports, policy status, an apps-and-agents view, an AI activity explorer and data risk assessments across Copilot, enterprise AI apps and other AI apps.',
    'Sequence: reduce exposure, harden with enforceable defaults, then monitor; never treat disabling Copilot as the data-protection plan.',
  ],
  flashcards: [
    { front: 'Whose permissions does Copilot use when querying Microsoft Graph?', back: 'The signed-in user\'s; Copilot never elevates or crosses tenants.' },
    { front: 'What is the semantic index?', back: 'A permission-trimmed, meaning-based index over Microsoft Graph content that improves Copilot retrieval.' },
    { front: 'Are Copilot prompts used to train foundation models?', back: 'No. Prompts, responses and Graph data stay within the tenant under enterprise data protection.' },
    { front: 'Name three kinds of content Copilot cannot use even if a user can open them.', back: 'Items on sites with Restricted Content Discovery, encrypted items where the user lacks EXTRACT, and files or prompts blocked by a Copilot DLP policy (also S/MIME mail).' },
    { front: 'What do Copilot connectors do to Graph?', back: 'Ingest external content (ServiceNow, Confluence, file shares) so it is indexed, permission-trimmed and available as grounding.' },
    { front: 'Which Defender product discovers unsanctioned generative-AI SaaS apps?', back: 'Microsoft Defender for Cloud Apps.' },
    { front: 'List Microsoft\'s six responsible AI principles.', back: 'Fairness, reliability and safety, privacy and security, inclusiveness, transparency, accountability.' },
    { front: 'Which principle do citations and AI-generated content labels support?', back: 'Transparency.' },
    { front: 'What is the first prerequisite DSPM for AI checks?', back: 'That Microsoft Purview Audit is turned on.' },
    { front: 'How often does the default DSPM for AI data risk assessment run and on what scope?', back: 'Weekly, on the top 100 SharePoint sites by usage.' },
    { front: 'Which DSPM for AI tab shows prompts, responses and web queries?', back: 'Activity explorer (for roles permitted to view interaction content).' },
  ],
  quiz: [
    {
      question: 'Two employees ask Copilot the same question about a supplier contract. One receives a detailed answer with a citation; the other is told no relevant content was found. What is the MOST likely cause?',
      options: [
        'The second employee\'s Copilot licence has not finished provisioning.',
        'The second employee lacks permission to the SharePoint location, so Microsoft Graph returns nothing for them.',
        'Copilot caches answers per user for 24 hours.',
        'The contract exceeds the file size Copilot can summarise.',
      ],
      correct: [1],
      explanation:
        'Grounding is permission-trimmed through Graph. Licence provisioning would block Copilot entirely, there is no per-user answer cache, and size limits would affect both users.',
    },
    {
      question: 'Contoso wants to prevent Copilot from using documents labelled Highly Confidential in its responses, without changing who can open those documents. Which control should you configure?',
      options: [
        'A Teams meeting policy',
        'A DLP policy for the Microsoft Copilot, Copilot Chat and Cowork location with a rule for the Highly Confidential label',
        'A retention policy of one year',
        'Restricted SharePoint Search',
      ],
      correct: [1],
      explanation:
        'The Copilot DLP location can prevent processing of labelled items without altering permissions. Meeting policies and retention are unrelated, and Restricted SharePoint Search is a site-level, temporary allow list rather than a label-based control.',
    },
    {
      question: 'Which TWO are built-in protections that Microsoft 365 Copilot applies to every interaction regardless of licence tier? (Select two)',
      options: [
        'Blocking prompt injection (jailbreak) attempts',
        'Automatically applying a sensitivity label to every unlabelled file in the tenant',
        'Detecting protected (copyrighted) material in responses',
        'Deleting prompts after 30 days',
      ],
      correct: [0, 2],
      explanation:
        'Prompt-injection blocking and protected material detection are built in. Auto-labelling is an E5 Purview capability you configure, and prompt retention is governed by your retention policies, not a fixed 30 days.',
    },
    {
      question: 'A compliance administrator wants a single dashboard showing which AI apps employees use, what sensitive data reaches them, and recommended policies to fix oversharing. Which solution should they open?',
      options: ['Microsoft Purview Compliance Manager', 'Data Security Posture Management (DSPM) for AI', 'Microsoft Entra Identity Secure Score', 'Teams admin center usage reports'],
      correct: [1],
      explanation:
        'DSPM for AI provides AI usage reports, one-click policies and data risk assessments. Compliance Manager tracks regulatory controls, Identity Secure Score covers identity posture, and Teams reports are usage metrics.',
    },
    {
      question: 'An organisation adds "AI-generated content must be reviewed by a human before it is sent to customers" to its usage policy. Which responsible AI principle does this practice MOST directly support?',
      options: ['Inclusiveness', 'Accountability', 'Fairness', 'Privacy and security'],
      correct: [1],
      explanation:
        'Human oversight and ownership of outcomes is accountability. Inclusiveness is about accessibility to all people, fairness about equitable treatment, and privacy and security about data protection.',
    },
    {
      question: 'Which action in a DSPM for AI data risk assessment temporarily removes an entire high-risk SharePoint site from Copilot and organisation-wide search without changing permissions?',
      options: ['Restrict access by label', 'Restrict all items (Restricted Content Discovery)', 'Create an auto-labelling policy', 'Create a retention policy'],
      correct: [1],
      explanation:
        'Restricted Content Discovery excludes a site from discovery experiences while permissions stay the same. Label-based restriction depends on labels, auto-labelling classifies, and retention manages deletion.',
    },
  ],
  statements: [
    { text: 'Copilot can retrieve content from Microsoft Graph that the signed-in user is not permitted to open.', isTrue: false, explanation: 'All retrieval is permission-trimmed to the user.' },
    { text: 'Copilot connectors extend Microsoft Graph with external content that becomes available as grounding.', isTrue: true, explanation: 'Connector items are indexed and permission-trimmed like native content.' },
    { text: 'Microsoft Defender for Cloud Apps can discover and block unsanctioned generative-AI applications.', isTrue: true, explanation: 'Its app catalog categorises Generative AI apps and supports governance actions.' },
    { text: 'Transparency, accountability and scalability are three of Microsoft\'s responsible AI principles.', isTrue: false, explanation: 'Scalability is not one; the six are fairness, reliability and safety, privacy and security, inclusiveness, transparency and accountability.' },
    { text: 'DSPM for AI can report on third-party AI sites such as ChatGPT only after the Purview browser extension is installed and devices are onboarded.', isTrue: true, explanation: 'These are listed prerequisites for the Other AI apps category.' },
    { text: 'Optimized Copilot controls such as adaptive protection and automatic labelling are included with Microsoft 365 E3.', isTrue: false, explanation: 'They require Microsoft 365 E5-level Purview licensing; E3 covers the foundational controls.' },
    { text: 'The default DSPM for AI data risk assessment must be manually scheduled each week.', isTrue: false, explanation: 'It runs automatically every week on the top 100 sites; custom assessments are run on demand.' },
  ],
  resources: [
    { label: 'Data, privacy, and security for Microsoft 365 Copilot', url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy' },
    { label: 'Copilot controls: security and governance', url: 'https://learn.microsoft.com/en-us/copilot/implement/copilot-controls-security-governance' },
    { label: 'Data Security Posture Management for AI', url: 'https://learn.microsoft.com/en-us/purview/dspm-for-ai' },
    { label: 'Microsoft 365 Copilot AI security', url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-ai-security' },
  ],
};

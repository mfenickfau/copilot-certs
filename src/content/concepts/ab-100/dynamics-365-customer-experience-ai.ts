import type { Concept } from '../../types';

export const dynamics365CustomerExperienceAi: Concept = {
  id: 'dynamics-365-customer-experience-ai',
  title: 'AI in Dynamics 365 Sales, Customer Service and Contact Center',
  summary:
    'Designing and orchestrating Copilot and agents across the Dynamics 365 customer experience and service apps: business terms (glossary and synonyms), customising Copilot through Copilot Studio, connectors and knowledge for Copilot in Sales, agents for Dynamics 365 Contact Center channels, autonomous service agents, and configuring the Sales agent and Service Agent in Microsoft 365 Copilot.',
  certs: ['ab-100'],
  domains: ['ab-100-2'],
  outcomes: ['ab-100-2-1-1', 'ab-100-2-1-2', 'ab-100-2-1-3', 'ab-100-2-1-4', 'ab-100-2-3-2', 'ab-100-2-3-4'],
  tags: ['dynamics-365', 'sales', 'customer-service', 'contact-center', 'copilot-for-sales', 'copilot-for-service', 'glossary', 'autonomous-agents'],
  difficulty: 'advanced',
  sections: [
    {
      heading: 'Business terms: glossary and synonyms',
      body: `Sellers and service representatives do not speak in schema names. They ask Copilot for "pipeline velocity" or "hot deals", while the data lives in columns such as estimatedvalue or a custom field called custom revenue. **Business terms** bridge that gap and are an explicit AB-100 design item.

In **Dynamics 365 Sales**, Copilot in Dynamics 365 Sales is itself a Copilot Studio agent. Open it in Copilot Studio (select the Sales environment, **Agents > Copilot in Dynamics 365 Sales**), then under Knowledge open **SalesSpecificQnA**. The **Glossary** section maps a business term and its description to the meaning in your tables ("churn risk account: an account with no closed opportunity in 12 months"); the **Synonyms** section adds alternative names for columns ("opportunity revenue" as a synonym for the custom revenue column). Publish to apply. Customisation requires the Copilot Studio Author role assigned in the Power Platform admin center.

In **Dynamics 365 Customer Service and Contact Center**, the same idea appears as the service **vocabulary**: glossary terms and synonyms that the Customer Service MCP tools can manage (save a glossary term, save a synonym, manage service vocabulary), so Copilot interprets "escalated ticket" or "VIP" consistently in case summaries and chat answers.

Design guidance for the exam:
- Start the glossary from real utterances captured in Copilot usage data and fallback logs, not from a data dictionary.
- Give each term one owner (a business analyst, not IT) and review it when forms or columns change.
- Prefer synonyms for column aliases and glossary entries for concepts that imply logic or filters.
- Ship terms in a **solution** with the agent so dev, test and production stay aligned.
- Terms improve natural-language chat; they do not change security. Sellers still only see records their security roles allow.`,
    },
    {
      heading: 'Customising Copilot in Sales and Service, and designing its connectors',
      body: `**Copilot in Dynamics 365 Sales** can be customised in three places. In the **Sales Hub app settings (Copilot)** admins turn Copilot on, control access by security role, choose the fields used for record summaries and recent changes, enable email assist and configure **knowledge sources**: specific **SharePoint locations** for content recommendations and document answers (Word, Excel, PowerPoint and PDF; results respect the user's SharePoint permissions, and if no folders are configured Copilot searches all folders the user can access). In **Copilot Studio** makers add or edit topics with the organisation's data, knowledge and actions, edit the **SalesSparks** topic to customise the prompt guide, and maintain glossary and synonyms; custom topics consume Copilot Credits. Through the **Sales MCP server** and Work IQ, Copilot's Sales tools (record summary, recent changes, lead, account and opportunity catch-ups) become callable from other agents and apps, including Microsoft 365 Copilot and Copilot Cowork.

"Connectors for Copilot in Dynamics 365 Sales" therefore has two meanings an architect must separate. *Knowledge connectors* bring content in: SharePoint locations, Dataverse tables and Copilot connectors for indexed external content. *Agent connections* let AI agents reach CRM data: the **Sales agent in Microsoft 365 Copilot** connects to Dynamics 365 Sales directly in the same environment, while Salesforce needs a server-to-server connection (an external client app and integration user created from the Sales agent admin settings, Connectors tab). Up to ten **connected agents** (declarative agents only) can enrich the Sales agent, but citations are not preserved across the hop, so copy tools and knowledge into the parent when citations matter.

**Copilot in Customer Service** is managed in two admin centres. The **Power Platform admin center** enables AI-powered Copilot features for the environment, allows **data movement across regions** where Copilot is not available locally, and controls data sharing with Microsoft. The **Copilot Service admin center** (the unified admin app for the Customer Service suite) is where you opt in, choose the **Copilot side pane or Copilot immersive (Copilot Hub)** experience, assign features through **experience profiles**, configure prompts, translation and email settings, and manage **Agents within Copilot** such as the Customer Support agent and Admin Management agent, including their tools and knowledge. Organisation-level prompts can be published to all representatives, while saved personal prompts stay with the user.`,
    },
    {
      heading: 'Agents for Dynamics 365 Contact Center channels',
      body: `**Dynamics 365 Contact Center** (standalone, or embedded with Customer Service) provides omnichannel engagement: voice, live chat, SMS, social and messaging channels, unified routing, representative workspace and analytics. Copilot Studio agents integrate as the self-service front door and as co-workers for representatives.

Design patterns:
- **IVR and voice agents.** Author the agent in Copilot Studio, choose classic or generative orchestration, select **NLU or NLU+** (NLU+ processes within Dynamics 365), add speech and DTMF capture, SSML, custom audio, barge-in, constrained grammars for account numbers, and **sensitive variable masking**. Get a phone number through Azure Communication Services and attach the agent to a voice workstream. Design **fallback actions for the IVR agent** and transfer-to-representative paths with context variables so the representative sees what the customer already said.
- **Chat and messaging agents.** The same Copilot Studio agent can serve chat, SMS and social channels; hand off to a human through the engagement hub with the conversation transcript and variables.
- **Knowledge.** Integrate Dynamics 365 knowledge articles with the Copilot Studio agent (Search Dynamics 365 knowledge articles action or a Power Automate template), and keep the knowledge base healthy with the **Customer Knowledge Management Agent**.
- **Autonomous service agents.** The **Customer Intent Agent** discovers intents from past cases and conversations and recommends knowledge; the **Case Management Agent** (Customer Service only) creates, updates, resolves and closes cases by rules; the **Customer Knowledge Management Agent** drafts articles after case closure; the **Quality Evaluation Agent** scores interactions for compliance and brand alignment. The **Agent hub** and **rollout manager** in Copilot Service admin center let you activate these in phases with scheduled rollout plans.
- **Customer Conversation harness (preview).** Microsoft's newer path builds customer-facing voice and chat agents with sub-agents and human escalation, authored from Copilot Studio or the Contact Center Intelligence portal (only the portal connects the agent to a live contact centre).

Architectural rules: route by intent to the right queue, measure containment and transfer rates, keep PCI and PII out of transcripts with masking, and make every representative-facing suggestion traceable to a source.`,
    },
    {
      heading: 'Orchestrating the Sales agent and Service Agent in Microsoft 365 Copilot',
      body: `Microsoft 365 Copilot ships role agents for sellers and service teams; AB-100 expects you to orchestrate their configuration end to end.

**Sales agent (Microsoft 365 Copilot for Sales).** It brings CRM insights into Outlook and Teams: email drafting with CRM context, saving emails and Teams meeting recaps to CRM, lead research and outreach, account summaries, and sales skills in Copilot Cowork. Configuration steps: a Microsoft 365 admin installs the Sales agent; CRM admins (System Administrator or System Customizer for Dynamics 365 Sales) configure admin settings, including how Outlook emails and events and AI meeting notes are saved to CRM; the agent connects to Dynamics 365 Sales directly or to Salesforce via a server-to-server connection; users need Sales Manager or Salesperson roles (or custom roles with the documented privileges) and connect their CRM account; connected agents can be added from the Microsoft 365 admin center. Sellers also get **Sales Chat** and the Sales agent surfaced from Dynamics 365 Sales itself. Licensing is specific, so check Product Terms rather than assuming it is included.

**Service Agent (Microsoft 365 Copilot for Service).** A Microsoft 365 Copilot agent that lets representatives find, summarise and update customer service information from Dynamics 365 Customer Service and connected knowledge sources, in Microsoft 365 Copilot, in Copilot Service workspace and in any Copilot-enabled app. Administrators enable it, representatives choose it from the agent list in the Copilot pane, and the agent uses the active case as context. The data source selected under Sources determines which environment's records are accessible.

Orchestration order that exam scenarios reward: licences and roles first, then Power Platform admin center environment settings (Copilot features, region data movement), then product admin configuration (Copilot Service admin center or Sales Hub settings), then Copilot Studio customisation (topics, glossary, knowledge), then Microsoft 365 admin center publishing and agent registry governance, then rollout plans and adoption measurement. Doing Copilot Studio customisation before the environment is enabled, or publishing before roles are assigned, produces the "it works for me but not for the users" scenario.`,
    },
  ],
  examples: [
    {
      title: 'Sellers who speak in nicknames',
      description:
        'A manufacturer\'s sellers ask Copilot in Dynamics 365 Sales about "whale accounts" and "the Q4 push" and get poor answers. The architect adds glossary entries (whale account: account with annual revenue above 5 million) and synonyms mapping "deal size" to the custom revenue column under SalesSpecificQnA, ships them in the Sales customisation solution, and assigns the sales operations lead as owner.',
      takeaway: 'Business terms belong in the glossary and synonyms of the Copilot in Dynamics 365 Sales agent, owned by the business and shipped in a solution.',
    },
    {
      title: 'SharePoint content the sellers cannot see (a realistic mistake)',
      description:
        'Content recommendations in Copilot for Sales return nothing for most sellers after the team configured a single SharePoint location in Sales Hub app settings. The folder belongs to the product marketing site, which only marketing can access. The fix is to grant read access to the sales security group (or move approved collateral to a shared library) because Copilot respects SharePoint permissions; configuring the location does not grant access.',
      takeaway: 'Knowledge configuration never bypasses SharePoint permissions; fix access before blaming Copilot.',
    },
    {
      title: 'Phased rollout of autonomous service agents',
      description:
        'A telecom wants Case Management Agent to auto-create cases from email and the Customer Intent Agent to suggest knowledge. Using the Agent hub\'s rollout manager in Copilot Service admin center, the architect creates a plan that activates Customer Intent Agent for one line of business first, schedules Case Management Agent creation rules for the following month, and keeps case closure rules off until the Quality Evaluation Agent shows acceptable accuracy.',
      takeaway: 'Use rollout plans to phase autonomous agents by capability and business unit, with measured gates.',
    },
    {
      title: 'Voice agent handoff with context',
      description:
        'A bank\'s IVR agent built in Copilot Studio authenticates callers with DTMF, masks the account number as a sensitive variable, resolves balance enquiries itself, and on "speak to someone" transfers to a Contact Center voice queue with intent and verified-customer variables attached so the representative does not re-authenticate. Fallback actions route unrecognised intents to a menu after two attempts.',
      takeaway: 'Design Contact Center agents around containment, masked data and context-rich transfers.',
    },
  ],
  keyPoints: [
    'Business terms for Copilot in Dynamics 365 Sales are configured as Glossary and Synonyms under the SalesSpecificQnA knowledge of the Copilot in Dynamics 365 Sales agent in Copilot Studio; Customer Service exposes vocabulary (glossary terms and synonyms) through MCP tools.',
    'Copilot in Sales is customised in Sales Hub app settings (access, summary fields, email assist, SharePoint knowledge locations) and in Copilot Studio (topics, SalesSparks prompt guide, glossary); custom topics consume Copilot Credits.',
    'SharePoint knowledge for Copilot in Sales supports Word, Excel, PowerPoint and PDF and respects user permissions; the Sales MCP server exposes Sales Copilot tools to other agents.',
    'The Sales agent in Microsoft 365 Copilot connects directly to Dynamics 365 Sales or via a server-to-server connection to Salesforce; up to ten declarative connected agents can be added, without preserved citations.',
    'Customer Service Copilot is enabled per environment in the Power Platform admin center (including cross-region data movement) and configured in Copilot Service admin center (opt-in, side pane or Copilot immersive, experience profiles, prompts, Agents within Copilot).',
    'Contact Center agents from Copilot Studio serve voice (NLU or NLU+, DTMF, SSML, masking, fallback actions, transfer) and chat channels; autonomous service agents include Customer Intent, Case Management, Customer Knowledge Management and Quality Evaluation agents, rolled out via the Agent hub rollout manager.',
    'Service Agent is a Microsoft 365 Copilot agent grounded in Customer Service cases and knowledge, usable in Copilot, Copilot Service workspace and other Copilot-enabled apps, with the environment chosen under Sources.',
    'Orchestrate in order: licences and roles, environment settings, product admin configuration, Copilot Studio customisation, Microsoft 365 publishing and governance, then phased rollout.',
  ],
  flashcards: [
    { front: 'Where do you add glossary terms and synonyms for Copilot in Dynamics 365 Sales?', back: 'In Copilot Studio, open the Copilot in Dynamics 365 Sales agent, Knowledge > SalesSpecificQnA, then the Glossary and Synonyms sections; publish afterwards.' },
    { front: 'Glossary versus synonym in Dynamics 365 Sales Copilot?', back: 'A glossary entry defines a business term and its meaning; a synonym adds an alternative name for a specific table column.' },
    { front: 'Which role is needed to customise Copilot in Dynamics 365 Sales in Copilot Studio?', back: 'Copilot Studio Author, assigned in the Power Platform admin center.' },
    { front: 'Which file types do Copilot in Sales SharePoint content recommendations support?', back: 'Word, Excel, PowerPoint and PDF, respecting the user\'s SharePoint permissions.' },
    { front: 'How does the Microsoft 365 Sales agent connect to Salesforce?', back: 'Through a server-to-server connection that creates an external client app and an integration user, enabled from the Sales agent admin settings Connectors tab.' },
    { front: 'Which two admin centres manage Copilot in Customer Service and what does each do?', back: 'Power Platform admin center enables AI features per environment and cross-region data movement; Copilot Service admin center handles opt-in, experiences, experience profiles, prompts and Agents within Copilot.' },
    { front: 'Name the autonomous service agents in Customer Service and Contact Center.', back: 'Customer Intent Agent, Case Management Agent (Customer Service only), Customer Knowledge Management Agent and Quality Evaluation Agent.' },
    { front: 'What is the rollout manager?', back: 'A wizard in the Agent hub of Copilot Service admin center that creates phased, schedulable rollout plans for autonomous agents.' },
    { front: 'NLU versus NLU+ for Contact Center voice agents?', back: 'Both enhance intent interpretation with generative orchestration; NLU processes within Copilot Studio, NLU+ processes within Dynamics 365.' },
    { front: 'What does the Service Agent in Microsoft 365 Copilot do?', back: 'Finds, summarises and updates customer service information from Dynamics 365 Customer Service and connected knowledge, usable in Copilot and Copilot Service workspace with the active case as context.' },
  ],
  quiz: [
    {
      question:
        'Sellers ask Copilot in Dynamics 365 Sales about "deal size" but the value is stored in a custom column named custom revenue, and Copilot returns no data. What should the architect configure?',
      options: [
        'A Power Platform DLP policy for the Dataverse connector',
        'A synonym mapping "deal size" to the custom revenue column under SalesSpecificQnA in Copilot Studio',
        'A new security role granting access to the column',
        'A SharePoint knowledge location containing the revenue report',
      ],
      correct: [1],
      explanation:
        'Column aliases are synonyms in the Copilot in Dynamics 365 Sales agent\'s knowledge. DLP governs connectors, security roles would only matter if access were missing, and SharePoint content does not map terms to columns.',
    },
    {
      question:
        'After configuring a single SharePoint location for Copilot content recommendations in Sales Hub, most sellers receive no recommendations. What is the MOST likely cause?',
      options: [
        'Copilot content recommendations require a Microsoft 365 Copilot licence for each seller',
        'The sellers lack SharePoint permissions to the configured folder',
        'The folder contains PDF files, which are unsupported',
        'Content recommendations require generative orchestration',
      ],
      correct: [1],
      explanation:
        'Results respect SharePoint permissions. PDFs are supported, orchestration mode is a Copilot Studio concept unrelated to this feature, and this capability is part of Copilot in Dynamics 365 Sales rather than requiring per-seller Microsoft 365 Copilot licences.',
    },
    {
      question:
        'A company uses Salesforce as its CRM and wants the Sales agent in Microsoft 365 Copilot to research leads in the background. What is required?',
      options: [
        'Migrate the CRM to Dynamics 365 Sales first',
        'Set up a server-to-server connection to Salesforce from the Sales agent admin settings, which creates an external client app and integration user',
        'Add Salesforce as a SharePoint knowledge location',
        'Publish a Copilot Studio agent to the Salesforce website',
      ],
      correct: [1],
      explanation:
        'Background agents need a server-to-server connection to Salesforce. Migration is not required, SharePoint is unrelated, and publishing to a website does not connect CRM data.',
    },
    {
      question:
        'Representatives in a region where Copilot in Customer Service is not available by default report that Copilot features are missing even though they were opted in. Which setting should the architect check?',
      options: [
        'Experience profiles in Copilot Service admin center',
        'Allow data movement across regions in the Power Platform admin center',
        'The Copilot Studio Author role',
        'Teams app permission policies',
      ],
      correct: [1],
      explanation:
        'Regional availability depends on allowing cross-region data movement in the Power Platform admin center. Experience profiles assign features to users but cannot enable an unavailable region, and the other options are unrelated.',
    },
    {
      question:
        'Which TWO autonomous agents can be activated through a rollout plan in the Copilot Service admin center Agent hub? (Select two)',
      options: ['Customer Intent Agent', 'Case Management Agent', 'Researcher', 'Supplier Communications Agent'],
      correct: [0, 1],
      explanation:
        'Customer Intent, Case Management, Customer Knowledge Management and Quality Evaluation agents are rolled out through the rollout manager. Researcher is a Microsoft 365 Copilot agent and Supplier Communications is a finance and operations agent deployed via the agent deployment wizard.',
    },
    {
      question:
        'A contact centre IVR agent must capture 16-digit card numbers without storing them in transcripts and transfer complex calls to representatives with the collected context. Which design elements are required?',
      options: [
        'Generative answers over a public website and a Teams channel',
        'DTMF capture with constrained grammars, sensitive variable masking, and transfer to a Contact Center voice queue with context variables',
        'A SharePoint agent and an Outlook connector',
        'Deep reasoning and Computer Use',
      ],
      correct: [1],
      explanation:
        'Voice capture, masking and context-rich transfer are the Contact Center voice design features. The other options do not address telephony, masking or handoff.',
    },
  ],
  statements: [
    { text: 'Glossary terms for Copilot in Dynamics 365 Sales are configured in the Sales Hub app settings.', isTrue: false, explanation: 'They are configured in Copilot Studio under the SalesSpecificQnA knowledge of the Copilot in Dynamics 365 Sales agent; Sales Hub settings cover access, summary fields and SharePoint locations.' },
    { text: 'Copilot in Dynamics 365 Sales only returns SharePoint content the user is permitted to access.', isTrue: true, explanation: 'Results are permission-trimmed; if no folders are configured it searches all folders the user can access.' },
    { text: 'Citations are preserved when a connected agent returns a response to the Microsoft 365 Sales agent.', isTrue: false, explanation: 'Responses return as text without clickable citations; copy tools and knowledge into the parent to keep citations.' },
    { text: 'Copilot Service admin center is the unified administration app for the Customer Service suite, including Copilot and agent settings.', isTrue: true, explanation: 'It replaces the older admin apps and adapts when Contact Center is provisioned.' },
    { text: 'Case Management Agent is available in both Dynamics 365 Customer Service and standalone Contact Center.', isTrue: false, explanation: 'Case Management Agent is available in Customer Service only.' },
    { text: 'NLU+ for Contact Center voice agents processes data within Dynamics 365 rather than within Copilot Studio.', isTrue: true, explanation: 'That is the stated difference between NLU and NLU+.' },
    { text: 'Service Agent in Microsoft 365 Copilot can update cases, not just summarise them.', isTrue: true, explanation: 'It supports actions such as adding notes, updating status and creating child cases.' },
  ],
  resources: [
    { label: 'Customize Copilot in Dynamics 365 Sales (topics, prompt guide, glossary)', url: 'https://learn.microsoft.com/en-us/dynamics365/sales/extend-copilot-chat' },
    { label: 'Manage Copilot features in Customer Service', url: 'https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-copilot-features' },
    { label: 'Overview of autonomous service agents (Contact Center and Customer Service)', url: 'https://learn.microsoft.com/en-us/dynamics365/contact-center/administer/autonomous-agents-overview' },
    { label: 'Sales agent in Microsoft 365 Copilot: introduction', url: 'https://learn.microsoft.com/en-us/microsoft-sales-copilot/introduction' },
  ],
};

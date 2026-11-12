import type { Concept } from '../../types';

export const copilotSearchCoworkConnectorsAndAiProviders: Concept = {
  id: 'copilot-search-cowork-connectors-and-ai-providers',
  title: 'Copilot Search, Cowork, Copilot Connectors and Third-Party AI Providers',
  summary:
    'Administering the newer Copilot surfaces: Microsoft 365 Copilot Search and its admin experience, Copilot Cowork access through spending policies, models, plugins and browser use, deploying Copilot connectors from the admin center, and governing third-party AI providers that act as Microsoft subprocessors or independent processors.',
  certs: ['ab-650', 'ab-620'],
  domains: ['ab-650-3', 'ab-620-2'],
  outcomes: ['ab-650-3-1-4', 'ab-650-3-1-7', 'ab-650-3-1-8', 'ab-650-3-1-9', 'ab-620-2-1-1'],
  tags: ['copilot-search', 'cowork', 'copilot-connectors', 'ai-providers', 'subprocessor', 'anthropic', 'spending-policy', 'plugins'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Microsoft 365 Copilot Search',
      body: `**Microsoft 365 Copilot Search** is the AI-powered universal search module in the Microsoft 365 Copilot app (web, desktop and mobile). It understands **natural language** ("where is the spreadsheet that breaks down marketing ROI by region?") as well as keywords, searches Microsoft Graph and **third-party data through Copilot connectors**, and can return a **Copilot Answer** at the top of results powered by Copilot Chat, then hands off to chat for deeper work. It requires an eligible **Microsoft 365 Copilot licence**; unlicensed users get classic **Microsoft Search** in the same place. There is **nothing to set up**: licensed users see the Search tab automatically.

The admin experience lives in **Microsoft 365 admin center > Copilot > Search** and reuses the Microsoft Search configuration:

- **Acronyms** and **bookmarks** curated for Microsoft Search appear in Copilot Search without extra work; acronyms can be Published, Draft or Excluded and imported in bulk from CSV.
- **Connectors** (over 100 in the gallery plus custom and ISV connectors) are managed from the same place.
- **Usage and performance** metrics and result customisation (filters, result types) are available to **Search admins** and **Search editors**.
- **Access to files and sites** follows SharePoint permissions, **restricted content discovery** and **restricted access control**; Restricted SharePoint Search (being retired) also narrows results.
- The optional **Microsoft 365 Copilot extension** (Edge or Chrome) enriches results with activity from approved third-party sites such as ServiceNow, Jira and Confluence.

Copilot Search follows the same data protection, privacy and EU Data Boundary commitments as Copilot. Exam contrast: *Copilot Search* finds things fast (query-based, Graph plus connectors); *Copilot Chat* generates and reasons (conversational, Graph plus connectors plus web).`,
    },
    {
      heading: 'Managing Microsoft 365 Copilot Cowork',
      body: `**Copilot Cowork** is an *agentic system* that performs multi-step work (research, drafting, editing Office files, OneNote, event-driven tasks, browser tasks) on the user's behalf. It is usage-based, billed in **Copilot Credits**, and users need a Microsoft 365 Copilot licence. Administration happens in the Microsoft 365 admin center:

- **Access** is granted by a **spending policy** (Copilot > Cost management > Configuration) whose scope includes the user and which selects Cowork under *Select agents and services*. This is the only access control at general availability: the Cowork entry under Agents > All agents no longer governs access, and a tiny credit limit does **not** block anyone. To remove a user, remove them from every policy that selects Cowork. When a user is in several policies the precedence (highest per-user limit, then largest policy limit, then newest) decides limits, not access.
- **Discovery setting** for usage-based AI experiences decides whether users who are not covered can see Cowork and **request access**; admins approve requests on the Credit requests page or redirect them via request policies.
- **Models**: Cowork ships with several models (GPT, Claude, Grok) and an **Auto** mode; admins can disable model families (for example Anthropic) under Copilot > Settings > AI providers, and Auto then picks from what remains. Model settings are tenant-wide availability controls, not access controls; EU Data Boundary tenants are limited to GPT models.
- **Plugins** (skills plus connectors, packaged as Microsoft 365 apps) are deployed from **Agents > Tools** or All agents to all users or specific groups, show as "Managed by your organization", and can be blocked; user-uploaded plugin sharing can be restricted. Information Barriers tenants cannot upload embedded knowledge.
- **Browser use** runs in Edge on the user's device under the user's sign-ins, so Conditional Access and web policies apply; **network endpoints** for Cowork must be allowed.
- **Security and compliance**: DLP for the Copilot, Copilot Chat and Cowork location, Purview audit of Cowork interactions, and the **Cowork usage report**. Users can type **/cost** to see credits consumed by a task.`,
    },
    {
      heading: 'Copilot connectors',
      body: `**Copilot connectors** (formerly Microsoft Graph connectors) bring external content into Copilot, Copilot Search, Microsoft Search and agents. Two models:

| | Synced connector | Federated connector (MCP-based) |
|---|---|---|
| Data movement | Content indexed into Microsoft Graph with semantic indexing | None; fetched at query time from an MCP server |
| Best for | Knowledge bases, document stores, LOB systems | Dynamic or regulated data that must stay in the source |
| Authentication | Entra app registration | OAuth 2.0 or service-specific |
| Citations | Preview of the indexed item | Link to the live source |

Deploy from **Microsoft 365 admin center > Copilot > Connectors > Gallery** as an **AI Administrator**: choose the source (ServiceNow, Salesforce, Confluence, Azure DevOps, file shares, websites and more), name it, enter the URL and **authentication**, optionally pilot to a subset of users, and create. Defaults handle schema and sync; **Custom setup** exposes three tabs: **Users** (access permissions: only users with access in the source via ACL mapping to Entra identities, or everyone; identity mapping formula), **Content** (property labels such as title and url, searchable/queryable/retrievable/refinable attributes, aliases) and **Sync** (full and incremental crawl schedules; incremental crawls do not update permissions). Add a **description** so Copilot knows when to use the source.

Governance: enable or block connectors, review access permissions, delegate connector management to **AI Administrators** through Entra roles and Graph consent policies, monitor connection health and item counts, and watch index quota. Connectors are available in commercial, GCC, GCC High and DoD. Connector content respects the source ACLs when mapped, so a user only sees ServiceNow articles they could see in ServiceNow. Agents built in Copilot Studio can also use connector content as knowledge.`,
    },
    {
      heading: 'Third-party AI providers',
      body: `Microsoft 365 Copilot experiences can use models from providers other than Microsoft-hosted Azure OpenAI. Microsoft classifies them in two ways and the admin controls differ:

- **AI providers operating as Microsoft subprocessors** (for example **Anthropic Claude** models in Copilot, Researcher, Copilot in Microsoft 365 apps, Copilot Studio and Cowork, and **OpenAI** models hosted outside Azure): they process data on Microsoft's behalf under the **Microsoft DPA, Product Terms and Enterprise Data Protection**, and the Customer Copyright Commitment applies. Claude is **on by default** in most commercial regions but **off by default in the EU, EFTA and UK** because it is excluded from the EU Data Boundary; it is unavailable in GCC High, DoD and sovereign clouds (a separate setting exists for non-federal GCC). Models marked "with Data Retention" or preview models require separate opt-in. Setting: **Copilot > Settings > View all > AI providers operating as Microsoft subprocessors**.
- **AI providers operating as independent processors** (for example **SpaceXAI/Grok** and **Mistral** models): data is processed under the **provider's own terms and DPA**, outside Microsoft's agreements, data residency and audit commitments. They are **off until a Global Administrator** opts in, accepts the provider terms, and picks who can use them. Setting: **Copilot > Settings > Data access > AI providers operating as independent processors**. Copilot Studio adds a Power Platform admin center switch to allow external LLMs.

For both kinds, access can be restricted to **users or security groups** (up to 999 assignments per provider), enforced at the **provider** level across the Microsoft 365 admin center, Power Platform admin center and Copilot Studio; unassigned users lose features that depend on that provider. Model changes that need admin action are announced in **Message center**. Exam framing: "data must remain under Microsoft's DPA" rules out independent processors; "disable Claude for the EU subsidiary" is the subprocessor setting scoped by group; "legal has not approved xAI terms" means leave the independent-processor setting off.`,
    },
  ],
  examples: [
    {
      title: 'Granting Cowork to a pilot group correctly',
      description:
        'Fabrikam wants 25 analysts to use Cowork with a 3,000-credit monthly cap each. The Billing Administrator runs Get started in Copilot > Cost management to activate usage-based billing, then adds an identity-based spending policy scoped to the Analysts security group that selects only Cowork, sets the per-user and policy limits with alerts at 80%, and turns Auto-apply new services off so future services are reviewed. No other policy selects Cowork, so no one else gains access.',
      takeaway: 'Access to Cowork is the intersection of policy scope and the Cowork service selection; limits and discovery are secondary.',
    },
    {
      title: 'Disabling Claude in the EU subsidiary (a realistic mistake)',
      description:
        'A German subsidiary complains that Claude models appear in Cowork and Researcher, contradicting their EU Data Boundary commitment. The admin had set "AI providers operating as Microsoft subprocessors" for Anthropic to All users tenant-wide while enabling it for US staff. Because Claude is excluded from the EU Data Boundary, the fix is to scope the Anthropic setting to a security group containing only non-EU users (the default for EU tenants is No users). Cowork users in Germany keep working because Auto falls back to GPT models.',
      takeaway: 'Subprocessor model access can be scoped by group; EU/EFTA/UK tenants default to off for Claude because of the EU Data Boundary.',
    },
    {
      title: 'Deploying a ServiceNow knowledge connector with source permissions',
      description:
        'IT wants Copilot and Copilot Search to answer from ServiceNow knowledge articles, but only articles each user can already read. The AI Administrator opens Copilot > Connectors > Gallery, selects ServiceNow Knowledge, enters the instance URL and OAuth credentials, uses Custom setup to keep "Only users with access to this data source" with the default email-to-UPN identity mapping, keeps the default full plus incremental sync, pilots to the IT group, and adds a description explaining the content covers IT how-to articles.',
      language: 'json',
      code: `{
  "connector": "ServiceNow Knowledge",
  "connectionName": "IT Knowledge Base",
  "dataSourceUrl": "https://contoso.service-now.com",
  "auth": "OAuth 2.0",
  "users": { "accessPermissions": "OnlyUsersWithAccess", "identityMapping": "email -> userPrincipalName" },
  "sync": { "fullCrawl": "weekly", "incrementalCrawl": "every 15 minutes" },
  "description": "ServiceNow IT how-to and troubleshooting articles for employees"
}`,
      takeaway: 'Keep source ACLs enforced with identity mapping; incremental crawls do not refresh permissions, so schedule full crawls.',
    },
    {
      title: 'Curating acronyms once for both search experiences',
      description:
        'New hires keep asking Copilot what "TPR" means and get generic answers. The Search admin adds TPR (Third-Party Risk) with a description and source URL under Copilot > Search > Acronyms in the Published state. Both Microsoft Search for unlicensed users and Copilot Search for licensed users now return the organization\'s definition.',
      takeaway: 'Bookmarks and acronyms are shared between Microsoft Search and Copilot Search; curate them once.',
    },
  ],
  keyPoints: [
    'Copilot Search needs a Microsoft 365 Copilot licence and no setup; it searches Graph plus connectors with natural language and reuses Microsoft Search acronyms, bookmarks and connectors; unlicensed users get Microsoft Search.',
    'Cowork access is granted solely by spending policies that select Cowork (Copilot > Cost management); credit limits and the discovery setting do not block access, and the Cowork agent entry no longer controls it.',
    'Cowork models (GPT, Claude, Grok, Auto) are tenant-wide availability settings under AI providers; plugins are deployed from Agents > Tools; browser use runs in Edge under the user\'s identity.',
    'Copilot connectors are synced (indexed into Graph, semantic indexing) or federated (MCP, query-time); deploy from Copilot > Connectors as AI Administrator with Users, Content and Sync custom settings.',
    'Connector access permissions can honour source ACLs through identity mapping; incremental crawls do not update permissions.',
    'AI subprocessors (Anthropic, OpenAI) operate under Microsoft\'s DPA and Product Terms; Claude is on by default except in EU/EFTA/UK and unavailable in GCC High, DoD and sovereign clouds.',
    'Independent processors (SpaceXAI, Mistral) use their own terms, are off until a Global Administrator opts in, and sit outside Microsoft data residency and audit commitments.',
    'Provider access can be scoped to users and security groups (up to 999 assignments) and is enforced across Copilot, Copilot Studio and Power Platform.',
  ],
  flashcards: [
    { front: 'Who can use Microsoft 365 Copilot Search?', back: 'Users with an eligible Microsoft 365 Copilot licence; others see Microsoft Search in the same module.' },
    { front: 'Where is the Copilot Search admin experience?', back: 'Microsoft 365 admin center > Copilot > Search (acronyms, bookmarks, connectors, usage).' },
    { front: 'How does Copilot Search differ from Copilot Chat in data sources?', back: 'Search uses Microsoft Graph and connectors; Chat adds the web.' },
    { front: 'What grants a user access to Copilot Cowork?', back: 'Being in scope of a spending policy that selects Cowork under Copilot > Cost management.' },
    { front: 'Does a 1-credit limit prevent a user from using Cowork?', back: 'No. Limits cap spend asynchronously; access comes from policy scope.' },
    { front: 'Where are Cowork plugins deployed?', back: 'Microsoft 365 admin center > Agents > Tools (or All agents), to all users or specific groups.' },
    { front: 'What is the difference between synced and federated Copilot connectors?', back: 'Synced connectors index content into Microsoft Graph; federated connectors fetch at query time over MCP without indexing.' },
    { front: 'Which role deploys Copilot connectors in the admin center?', back: 'AI Administrator.' },
    { front: 'Do incremental connector crawls update permissions?', back: 'No; run full crawls to refresh ACLs.' },
    { front: 'What is an AI subprocessor?', back: 'A third-party provider (such as Anthropic or OpenAI) processing data on Microsoft\'s behalf under Microsoft\'s DPA and Product Terms.' },
    { front: 'What is an AI independent processor?', back: 'A provider (such as SpaceXAI or Mistral) processing data under its own terms, outside Microsoft\'s DPA; off until a Global Administrator opts in.' },
    { front: 'Why are Claude models off by default for EU tenants?', back: 'They are excluded from the EU Data Boundary and in-country processing commitments.' },
    { front: 'How many user and group assignments can an AI provider have?', back: 'Up to 999 combined assignments per provider, enforced at the provider level.' },
  ],
  quiz: [
    {
      question:
        'Contoso\'s legal team has approved Anthropic models under Microsoft\'s Data Protection Addendum but has NOT approved any provider whose own terms would govern data. Which setting must remain disabled?',
      options: [
        'AI providers operating as Microsoft subprocessors',
        'AI providers operating as independent processors',
        'Web search for Copilot',
        'Copilot Frontier',
      ],
      correct: [1],
      explanation:
        'Independent processors (such as SpaceXAI) process data under their own terms outside Microsoft\'s DPA. Subprocessors are covered by Microsoft\'s terms, and web search and Frontier are unrelated to model providers.',
    },
    {
      question:
        'A user in the Marketing group reports that Cowork is not visible, although the tenant has a spending policy for the Finance group that selects Cowork. Marketing users should NOT be able to use Cowork. What is the correct state?',
      options: [
        'This is expected; only users in a spending policy that selects Cowork have access.',
        'The admin must lower the Finance per-user limit to 1 credit.',
        'The admin must block the Cowork agent under Agents > All agents.',
        'The Marketing user needs the AI Reader role.',
      ],
      correct: [0],
      explanation:
        'Access is scoped by spending policies; Marketing is correctly excluded. Lowering limits does not control access, the agent entry no longer governs Cowork, and admin roles are irrelevant to end-user access.',
    },
    {
      question:
        'You must make ServiceNow knowledge articles available to Copilot while ensuring users only see articles they can read in ServiceNow. Which connector configuration meets the requirement?',
      options: [
        'Set access permissions to Everyone in the organization.',
        'Set access permissions to Only users with access to the data source and map identities to Entra users.',
        'Use a federated connector with no authentication.',
        'Index the articles into a SharePoint library.',
      ],
      correct: [1],
      explanation:
        'Honouring source ACLs requires the "only users with access" option with identity mapping. Everyone exposes all articles, unauthenticated federation is not a supported model, and copying to SharePoint loses the source permissions.',
    },
    {
      question: 'Which TWO statements about Microsoft 365 Copilot Search are correct? (Select two)',
      options: [
        'It requires no additional setup for users who hold a Microsoft 365 Copilot licence.',
        'Acronyms and bookmarks curated for Microsoft Search also appear in Copilot Search.',
        'It bypasses SharePoint permissions to return all tenant content.',
        'It is available only to Global Administrators.',
      ],
      correct: [0, 1],
      explanation:
        'Copilot Search appears automatically for licensed users and reuses Microsoft Search curation. It respects permissions, restricted content discovery and restricted access control, and it is an end-user feature.',
    },
    {
      question:
        'Cowork users in the UK subsidiary must not use Anthropic models, but US users may. Which configuration is the MOST appropriate?',
      options: [
        'Scope the Anthropic subprocessor setting to a security group that excludes UK users.',
        'Create separate spending policies with different credit limits for UK and US.',
        'Disable Cowork for UK users by blocking the Cowork agent.',
        'Turn off web search for UK users.',
      ],
      correct: [0],
      explanation:
        'Provider access is assigned per user or security group. Spending policies control access and credits, not models; the agent entry does not control Cowork; web search is unrelated to model choice.',
    },
    {
      question:
        'Regulatory data in a line-of-business system must never be copied into Microsoft Graph, but Copilot should still answer questions from it. Which connector model should you choose?',
      options: ['Synced connector', 'Federated (MCP-based) connector', 'SharePoint migration', 'Exchange mail contact'],
      correct: [1],
      explanation:
        'Federated connectors retrieve content at query time without indexing it into Graph. Synced connectors and migrations copy the data, and mail contacts are unrelated.',
    },
  ],
  statements: [
    { text: 'Copilot Search uses the web as a data source by default.', isTrue: false, explanation: 'Copilot Search uses Microsoft Graph and connectors; Copilot Chat adds web grounding (a Copilot Answer may reflect Chat grounding).' },
    { text: 'Admins must enable Copilot Search before licensed users can see it.', isTrue: false, explanation: 'It appears automatically for users with an eligible Copilot licence.' },
    { text: 'A spending policy is an access control for Cowork, not only a budget.', isTrue: true, explanation: 'Any policy that selects Cowork grants access to users in its scope.' },
    { text: 'Turning off the Anthropic model family prevents users from using Cowork.', isTrue: false, explanation: 'Model settings affect availability; Auto chooses from remaining models and access is unchanged.' },
    { text: 'Synced Copilot connectors support semantic indexing in Microsoft Graph.', isTrue: true, explanation: 'Federated connectors do not, because nothing is indexed.' },
    { text: 'Independent AI processors are governed by Microsoft\'s Data Protection Addendum.', isTrue: false, explanation: 'They operate under their own terms and DPA, outside Microsoft\'s commitments.' },
    { text: 'Claude models are available to customers in GCC High and DoD.', isTrue: false, explanation: 'They are not available in GCC High, DoD or sovereign clouds; a separate setting covers non-federal GCC.' },
    { text: 'Copilot connectors are supported in GCC, GCC High and DoD environments.', isTrue: true, explanation: 'Connectors are available in commercial and US Government clouds.' },
  ],
  resources: [
    { label: 'Overview of Microsoft 365 Copilot Search', url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/copilot-search-overview' },
    { label: 'Manage Copilot Cowork for your organization', url: 'https://learn.microsoft.com/en-us/copilot/cowork/cowork-admin-governance' },
    { label: 'Deploy connectors in the Microsoft 365 admin center', url: 'https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/deployment-overview' },
    { label: 'Understanding AI functionality and models in Microsoft Online Services', url: 'https://learn.microsoft.com/en-us/copilot/plan/ai-models-overview' },
  ],
};

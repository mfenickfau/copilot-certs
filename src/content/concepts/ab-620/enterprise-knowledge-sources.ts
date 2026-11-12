import type { Concept } from '../../types';

export const enterpriseKnowledgeSources: Concept = {
  id: 'enterprise-knowledge-sources',
  title: 'Enterprise Knowledge: Copilot Connectors, Power Platform Connectors and Azure AI Search',
  summary:
    'How to ground an agent in systems outside Microsoft 365: Copilot connectors that index external content into Microsoft Graph, Power Platform connectors that serve real-time knowledge without copying data, and Azure AI Search vector indexes you build yourself, plus the agent settings that govern grounding, citations and moderation.',
  certs: ['ab-620', 'ab-100'],
  domains: ['ab-620-2', 'ab-100-1'],
  outcomes: ['ab-620-2-1-1', 'ab-620-2-1-2', 'ab-620-2-1-3', 'ab-100-1-2-6'],
  tags: ['copilot-studio', 'knowledge', 'copilot-connectors', 'graph-connectors', 'power-platform-connectors', 'azure-ai-search', 'rag'],
  difficulty: 'advanced',
  diagram: 'rag-pipeline',
  sections: [
    {
      heading: 'How knowledge is searched',
      body: `Knowledge sources ground responses: the agent retrieves relevant passages, the model answers from them and cites them. Where the retrieval runs depends on the source type:

| Source | Where retrieval happens | Identity |
|---|---|---|
| Public websites | Bing, restricted to the listed domains | None |
| Uploaded documents | Dataverse file storage | None |
| SharePoint, OneDrive | Microsoft Graph search (semantic index with tenant graph grounding) | User's Entra ID |
| Dataverse tables | Dataverse retrieval | User's Entra ID |
| **Copilot connectors** | Microsoft Graph index of external content | User's Entra ID, source ACLs honoured |
| **Power Platform real-time connectors (preview)** | Live query against the system at run time | User's connection |
| **Azure AI Search** | Your vector index in Azure | Connection you configure |

In **generative orchestration** the agent searches knowledge proactively; above 25 knowledge sources an internal model pre-filters by source **descriptions**, so write them well. Custom data and Bing Custom Search are not available at agent level in generative mode; put them in a generative answers node. In **classic orchestration**, knowledge is a fallback through the Conversational boosting topic, with per-type limits (four SharePoint URLs, four websites, two Dataverse sources).

Agent-level **Generative AI settings** that steer grounding: **Allow ungrounded responses** (off blocks any answer that used no knowledge or tool, and requires an in-text citation to count as grounded), **Use information from the web** (Grounding with Bing Search), **content moderation** (default High) and **Tenant graph grounding with semantic search** (needs Authenticate with Microsoft and a Microsoft 365 Copilot licence in the tenant; improves SharePoint and connector retrieval and raises file size support to 200 MB). Admins limit which **knowledge source types** makers may use from the Power Platform admin center, with endpoint filtering for SharePoint and website URLs.`,
    },
    {
      heading: 'Copilot connectors: index into Microsoft Graph',
      body: `**Copilot connectors** (formerly Microsoft Graph connectors) copy and semantically index content from non-Microsoft systems (ServiceNow knowledge and tickets, Jira, Confluence, Salesforce, SAP, Azure DevOps, file shares, custom sources through the Graph connector API) into **Microsoft Graph**. Once indexed, the content is searchable by Microsoft Search, Microsoft 365 Copilot and any Copilot Studio agent, with **source access control lists respected** and **citations** returned.

Setup is split between roles:

1. A **Microsoft 365 admin** configures the connector in the **Microsoft 365 admin center**: choose a prebuilt or custom connector, map the schema, apply semantic labels, let the crawl complete.
2. The **maker** opens the agent, selects **Add knowledge**, picks the Copilot connector (under **Advanced** if it is not featured), selects the connection and adds it. For best results, have a Microsoft 365 Copilot licence in the tenant and turn on tenant graph grounding.
3. When publishing to channels, the agent must use authentication that can carry the **\`ExternalItem.Read.All\`** delegated scope (configured under manual authentication).

Choose Copilot connectors when you need broad, searchable knowledge across large document bodies, semantic ranking, citations, and reuse in Microsoft Search and Microsoft 365 Copilot. Latency is low because retrieval is served from the Graph index. Licensing for consumption is covered by Microsoft 365 and Copilot licences; an indexing quota applies to the number of items.`,
    },
    {
      heading: 'Power Platform connectors as real-time knowledge',
      body: `**Power Platform connectors** are API proxies. Copilot Studio uses them in three ways: as **tools** (read, write, trigger actions), as **actions in agent flows**, and, in preview, as **real-time knowledge**. For real-time knowledge, Copilot Studio indexes only **metadata** (table and column names); every question runs a live query against the source under the **user's connection**, so source permissions apply and **no data is copied**.

Supported real-time knowledge connectors include Salesforce, ServiceNow, Azure SQL, Azure AI Search, SharePoint, Dataverse, Dynamics 365, Snowflake, Databricks, Zendesk, Confluence Cloud, Oracle Database, SAP OData and Google Sheets. You add one from **Add knowledge > Advanced**, sign in, pick the tables, name and describe the source, and (for ServiceNow and Zendesk) add **synonyms and glossary** definitions. The status shows **In progress** while metadata is indexed and **Ready** when usable. Governance is the same **data policy** that governs the connector as a tool.

Decision guide the exam expects you to reproduce:

- **Up-to-the-minute facts or transactions** ("status of ticket 1234", "create a case"), or **data that must not be replicated**: Power Platform connector (real-time knowledge or tool).
- **Large knowledge corpora** that benefit from semantic indexing and citations across Microsoft 365: Copilot connector.
- Often both: index the ServiceNow knowledge base with the Copilot connector and use the ServiceNow Power Platform connector as a tool to create or update tickets.`,
    },
    {
      heading: 'Azure AI Search as a knowledge source',
      body: `**Azure AI Search** is the choice when you own the retrieval pipeline: documents chunked and embedded with **integrated vectorization**, a **vector index** (optionally with **semantic ranker**), custom fields, and possibly a **private endpoint** behind a virtual network. Copilot Studio connects to **one vector index per knowledge source** and uses the same embedding model at query time, so you do not write query-vectorisation code.

Set-up steps that appear in exam items:

1. Create the search service, prepare data and use **Import and vectorize data** to build the index; enable semantic ranker if desired.
2. In Copilot Studio, **Add knowledge > Featured > Azure AI Search > Create new connection**. Authentication types: **Access key**, **client certificate**, **service principal (Entra application)** or **Microsoft Entra ID integrated**. Add it as a proper data connection; do not hand-type an endpoint and key elsewhere, because a faulty connection record is environment-wide and hard to remove.
3. Enter the endpoint URL and key (or Entra details), select the vector index, add to the agent, wait for **Ready**.
4. For **citations**, include a field with the document's URL; Copilot Studio uses \`metadata_storage_path\` if present, otherwise any field that contains a full URL. Users need permission to the cited locations.
5. For network isolation, configure a **private endpoint** on the search service and **Virtual Network support** on the Power Platform environment.

Azure AI Search also appears in the **generative answers node** through **Azure OpenAI on your data** (Foundry builds the index and the Copilot Studio connection) and as a real-time connector. Pick Azure AI Search when you need custom chunking, hybrid search, your own embeddings, non-Microsoft storage, or network-isolated retrieval; pick SharePoint or Copilot connectors when Graph indexing is enough.`,
    },
  ],
  examples: [
    {
      title: 'ServiceNow twice: index and act',
      description:
        'A service desk agent must answer how-to questions from 20,000 ServiceNow knowledge articles and let users check and create incidents. The architect asks the Microsoft 365 admin to configure the ServiceNow Knowledge Copilot connector (indexed into Graph with ACLs, cited answers), then adds the ServiceNow Power Platform connector as two tools (Get incident, Create incident) with end-user credentials. Knowledge comes from the index; transactions go live.',
      takeaway: 'Copilot connectors for searchable knowledge, Power Platform connectors for live data and actions; the same system can use both.',
    },
    {
      title: 'The connector knowledge that nobody could see (a realistic mistake)',
      description:
        'A maker adds a Copilot connector knowledge source, tests successfully in Copilot Studio, publishes to a custom website with manual Entra authentication, and users get no answers from the connector. The app registration lacks the ExternalItem.Read.All delegated scope, so Graph refuses the external items query. Adding the scope to the manual authentication configuration (and granting consent) fixes it.',
      code: `Settings > Security > Authentication > Authenticate manually (Microsoft Entra ID V2)
  Scopes: openid profile User.Read Files.Read.All Sites.Read.All ExternalItem.Read.All
  Scope list delimiter: " " (space)`,
      language: 'text',
      takeaway: 'Copilot connector knowledge needs the ExternalItem.Read.All scope when the agent is published with manual authentication.',
    },
    {
      title: 'Vector search over a regulated document store',
      description:
        'A bank keeps policy PDFs in Azure Blob Storage inside a private network and may not copy them into Microsoft 365. The team builds an Azure AI Search index with integrated vectorization and semantic ranker, exposes it through a private endpoint, enables Virtual Network support on the Power Platform environment, and adds the index to the agent with service principal authentication. The index includes metadata_storage_path so answers carry citations users can open.',
      code: `# Index fields that make Copilot Studio citations work
{
  "name": "policies-index",
  "fields": [
    { "name": "chunk_id", "type": "Edm.String", "key": true },
    { "name": "chunk", "type": "Edm.String", "searchable": true },
    { "name": "title", "type": "Edm.String", "searchable": true },
    { "name": "metadata_storage_path", "type": "Edm.String", "filterable": true },
    { "name": "text_vector", "type": "Collection(Edm.Single)", "dimensions": 1536,
      "vectorSearchProfile": "default-profile" }
  ],
  "semantic": { "configurations": [ { "name": "default-semantic", "prioritizedFields": {
      "titleField": { "fieldName": "title" }, "prioritizedContentFields": [ { "fieldName": "chunk" } ] } } ] }
}`,
      language: 'json',
      takeaway: 'Azure AI Search gives you control over chunking, vectors, ranking and network isolation; include a URL field so citations resolve.',
    },
    {
      title: 'Live SAP data without replication',
      description:
        'Procurement wants answers about current stock levels held in SAP, and the data owner forbids copying it. The maker adds the SAP OData connector as real-time knowledge (Add knowledge > Advanced), selects the material and stock tables, and describes the source. Each question runs against SAP under the user\'s connection, so users only see plants they are authorised for.',
      takeaway: 'Real-time connector knowledge indexes only metadata and queries live under the user\'s identity, satisfying no-replication requirements.',
    },
  ],
  keyPoints: [
    'Knowledge retrieval runs in different places by source type: Bing for websites, Dataverse for uploads, Microsoft Graph for SharePoint and Copilot connectors, the live system for real-time connectors, your index for Azure AI Search.',
    'Copilot connectors (formerly Graph connectors) are configured by a Microsoft 365 admin in the Microsoft 365 admin center; they index external content into Graph with ACLs and citations, and agents need ExternalItem.Read.All when published with manual authentication.',
    'Power Platform real-time knowledge connectors (preview) index only metadata and query the system live under the user\'s connection; supported sources include Salesforce, ServiceNow, SAP OData, Snowflake, Databricks, Azure SQL and Oracle.',
    'Decision rule: Copilot connectors for large searchable corpora with semantic ranking; Power Platform connectors for live facts, transactions and no-replication requirements; use both when needed.',
    'Azure AI Search knowledge uses one vector index per source with integrated vectorization and optional semantic ranker; authentication can be access key, certificate, service principal or Entra integrated; VNet private endpoints are supported.',
    'Citations from Azure AI Search come from metadata_storage_path or any full-URL field; users need access to the cited location.',
    'Generative AI settings govern grounding: Allow ungrounded responses, web search, moderation and tenant graph grounding (requires Authenticate with Microsoft and a Microsoft 365 Copilot licence in the tenant).',
    'Generative orchestration pre-filters by source description above 25 sources; custom data and Bing Custom Search require a generative answers node.',
  ],
  flashcards: [
    { front: 'What is the former name of Copilot connectors?', back: 'Microsoft Graph connectors. They index external content into Microsoft Graph.' },
    { front: 'Who configures a Copilot connector and where?', back: 'A Microsoft 365 admin in the Microsoft 365 admin center (schema, semantic labels, crawl); the maker then adds it via Add knowledge.' },
    { front: 'Which Graph scope is required when publishing an agent that uses Copilot connector knowledge with manual authentication?', back: 'ExternalItem.Read.All (delegated).' },
    { front: 'How do Power Platform real-time knowledge connectors avoid data movement?', back: 'Copilot Studio indexes only metadata (table and column names) and runs each query live against the source under the user\'s connection.' },
    { front: 'Name four systems supported as real-time knowledge connectors.', back: 'Any of Salesforce, ServiceNow, Azure SQL, Azure AI Search, SharePoint, Dataverse, Dynamics 365, Snowflake, Databricks, Zendesk, Confluence Cloud, Oracle Database, SAP OData, Google Sheets.' },
    { front: 'How many vector indexes can one Azure AI Search knowledge source use?', back: 'One.' },
    { front: 'Which Azure AI Search field does Copilot Studio use for citations?', back: 'metadata_storage_path if present; otherwise any field containing a complete URL.' },
    { front: 'What does turning off Allow ungrounded responses do?', back: 'Blocks any response generated in a turn that used no knowledge source or tool; a grounded answer must carry an in-text citation.' },
    { front: 'What is required to enable Tenant graph grounding with semantic search?', back: 'Authenticate with Microsoft and at least one Microsoft 365 Copilot licence in the tenant; it improves SharePoint and connector retrieval.' },
    { front: 'When should you choose Azure AI Search over SharePoint knowledge?', back: 'When you need custom chunking and embeddings, hybrid or semantic ranking, non-Microsoft storage, or network-isolated retrieval via private endpoints.' },
  ],
  quiz: [
    {
      question:
        'Contoso wants an agent to answer questions from 50,000 Confluence pages with citations, and the same content should also be discoverable in Microsoft 365 Copilot. Which knowledge approach is MOST appropriate?',
      options: [
        'Add the Confluence Power Platform connector as real-time knowledge',
        'Have a Microsoft 365 admin configure the Confluence Copilot connector and add it as a knowledge source',
        'Upload the pages as documents to the agent',
        'Build a public website knowledge source pointing at the Confluence URL',
      ],
      correct: [1],
      explanation:
        'Copilot connectors index external content into Microsoft Graph with semantic ranking and citations, and the index is reused by Microsoft 365 Copilot. Real-time connectors suit live data rather than large corpora, uploads do not scale or stay current, and Confluence is not a public website.',
    },
    {
      question:
        'A data owner states that SAP stock data must never be copied outside SAP, yet the agent must answer "how many units of X are in plant 2?" with current values. What should you use?',
      options: [
        'The SAP Copilot connector',
        'Azure AI Search with a nightly export',
        'The SAP OData Power Platform connector as real-time knowledge',
        'Uploaded Excel extracts refreshed weekly',
      ],
      correct: [2],
      explanation:
        'Real-time connector knowledge indexes only metadata and queries SAP live under the user\'s connection, so no data is replicated and values are current. The other options all copy data out of SAP.',
    },
    {
      question:
        'Answers from an Azure AI Search knowledge source contain no citations. The index has a field named documentUrl with full URLs. What is the MOST likely fix?',
      options: [
        'Rename the field to metadata_storage_path or ensure the URL field contains complete URLs that Copilot Studio can detect',
        'Switch the connection authentication from access key to Entra ID',
        'Enable semantic ranker on the index',
        'Add a second vector index to the knowledge source',
      ],
      correct: [0],
      explanation:
        'Copilot Studio uses metadata_storage_path or a field containing a full URL for citations; verifying the URL field is the fix. Authentication type and semantic ranker do not control citations, and only one index per source is allowed.',
    },
    {
      question:
        'Which TWO statements about knowledge in Copilot Studio are correct? (Select two)',
      options: [
        'Tenant graph grounding with semantic search requires the agent to use Authenticate with Microsoft',
        'Copilot connectors ignore the source system\'s permissions so all users see all content',
        'Agents using Copilot connector knowledge published with manual authentication need the ExternalItem.Read.All scope',
        'Real-time knowledge connectors copy the full table contents into Dataverse',
      ],
      correct: [0, 2],
      explanation:
        'Tenant graph grounding depends on Authenticate with Microsoft, and the ExternalItem.Read.All scope is required for connector knowledge under manual authentication. Copilot connectors honour source ACLs, and real-time connectors index only metadata.',
    },
    {
      question:
        'A bank\'s policy documents sit in Azure Blob Storage reachable only inside a virtual network, and the agent must retrieve them without exposing the storage publicly. Which design should you recommend?',
      options: [
        'A public website knowledge source with endpoint filtering',
        'An Azure AI Search vector index exposed through a private endpoint, with Virtual Network support enabled on the Power Platform environment',
        'A SharePoint knowledge source with the files copied to a team site',
        'A Dataverse knowledge source populated by a scheduled flow',
      ],
      correct: [1],
      explanation:
        'Azure AI Search supports private endpoints and Copilot Studio supports VNet-isolated indexes. A public website source cannot reach private storage, and copying files to SharePoint or Dataverse violates the isolation requirement.',
    },
  ],
  statements: [
    { text: 'Copilot connectors respect the source system\'s access control lists when grounding answers.', isTrue: true, explanation: 'Users only see content they are permitted to see in the source.' },
    { text: 'Power Platform real-time knowledge connectors index the full data of the selected tables.', isTrue: false, explanation: 'Only metadata such as table and column names is indexed; data is queried live.' },
    { text: 'A Copilot Studio Azure AI Search knowledge source can reference several vector indexes.', isTrue: false, explanation: 'Only one vector index can be added per knowledge source.' },
    { text: 'Makers add Copilot connectors from Add knowledge, but the connector itself must be configured by a Microsoft 365 admin first.', isTrue: true, explanation: 'Connector setup, schema and semantic labels are done in the Microsoft 365 admin center.' },
    { text: 'Generative orchestration can use custom data tables as an agent-level knowledge source.', isTrue: false, explanation: 'Custom data and Bing Custom Search must be used inside a generative answers node.' },
    { text: 'With more than 25 knowledge sources, generative orchestration uses source descriptions to pre-filter which sources to search.', isTrue: true, explanation: 'Uploaded files are not counted toward the 25.' },
    { text: 'Admins can restrict which knowledge source types makers may add through the Power Platform admin center.', isTrue: true, explanation: 'The Knowledge sources for agents setting and endpoint filtering provide this control.' },
  ],
  resources: [
    { label: 'Add Copilot connectors as a knowledge source', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-connectors' },
    { label: 'Copilot connectors versus Power Platform connectors as knowledge sources', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-graph-vs-power-platform-connectors' },
    { label: 'Add Power Platform connectors as knowledge (preview)', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-real-time-connectors' },
    { label: 'Add Azure AI Search as a knowledge source', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-azure-ai-search' },
  ],
};

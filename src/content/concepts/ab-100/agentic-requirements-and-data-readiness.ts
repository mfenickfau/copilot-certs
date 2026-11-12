import type { Concept } from '../../types';

export const agenticRequirementsAndDataReadiness: Concept = {
  id: 'agentic-requirements-and-data-readiness',
  title: 'Agentic Requirements Analysis and Data Readiness for Grounding',
  summary:
    'How an architect decides where agents belong in a business process (automation, analytics or decisions), audits the data that will ground them for accuracy, relevance, timeliness, cleanliness and availability, and organises that data so Copilot, Copilot Studio, Foundry and third-party AI systems can all consume it.',
  certs: ['ab-100', 'ab-731'],
  domains: ['ab-100-1', 'ab-100-2', 'ab-731-1'],
  outcomes: ['ab-100-1-1-1', 'ab-100-1-1-2', 'ab-100-1-1-3', 'ab-100-2-1-8', 'ab-100-2-1-11', 'ab-731-1-2-3', 'ab-731-1-2-5'],
  tags: ['requirements', 'grounding', 'data-quality', 'rag', 'dataverse', 'foundry-tools', 'discovery'],
  difficulty: 'advanced',
  diagram: 'rag-pipeline',
  sections: [
    {
      heading: 'Where agents belong: automation, analytics or decisions',
      body: `Discovery for an agentic solution starts with the business problem, not the technology. The Cloud Adoption Framework (CAF) AI scenario recommends you look for *outcome gaps* first (repeated manual effort, slow approvals, missed targets), turn each into a short use-case statement ("help service representatives answer from internal documents so resolution time drops"), and then classify it. Three classifications matter for the exam:

- **Task automation.** Repetitive, rule-bound work with a clear trigger and completion state: creating a case from an email, reconciling an account, chasing a supplier for a delivery date. These suit **autonomous agents** with event triggers and deterministic **agent flows**, with a human approval step wherever an action is irreversible.
- **Data analytics.** Questions over structured or unstructured data: "which opportunities slipped this quarter and why?" These suit **prompt-and-response agents** grounded in Dataverse, Fabric or SharePoint, the Analyst agent in Microsoft 365 Copilot, or Copilot Studio knowledge over Dataverse tables and finance and operations virtual entities.
- **Decision-making.** Judgement calls with consequences: approving a credit limit, prioritising a lead. Here the architect's job is to decide **how much autonomy is acceptable**. Generative AI is non-deterministic, so decisions that must be repeatable and auditable often belong with traditional (deterministic) AI models or business rules, with generative AI used to explain, summarise and recommend rather than to decide.

A useful heuristic from CAF: lean towards generative AI when the inputs are unstructured and some variation is acceptable; lean towards non-generative AI or deterministic flows when the same input must always give the same result. Most real solutions combine both: an agent interprets a request, a prediction model scores it, a flow records the outcome.`,
    },
    {
      heading: 'Reviewing data for grounding: the five checks',
      body: `An agent is only as good as what it is grounded in. Before you promise a value case, review every candidate knowledge source against five properties the study guide names explicitly:

| Property | Question to ask | Typical finding |
|---|---|---|
| **Accuracy** | Is the content correct today? Who owns it? | Policy PDFs with superseded versions still live in a library |
| **Relevance** | Does the source actually answer the questions users will ask? | A 400-page HR handbook when 90% of questions are about leave |
| **Timeliness** | How often does it change, and how is the index refreshed? | Price lists updated nightly but indexed weekly |
| **Cleanliness** | Duplicates, scanned images without text, inconsistent field values, PII that should not be exposed | Dataverse accounts with three spellings of the same city |
| **Availability** | Can the agent reach it with the right identity, in the right region, within quota? | Data in an on-premises SQL server with no gateway, or in a tenant geo the agent cannot use |

Two design consequences follow. First, **retrieval-augmented generation (RAG) is only as good as retrieval**: chunking, metadata and permissions decide what the model sees, so fix the source rather than the prompt. Second, grounding runs with an identity. In Copilot Studio, SharePoint, Dataverse and Copilot connector knowledge sources use the *agent user's* Microsoft Entra ID authentication, so a user only receives content they could already open. That protects you, but it also means an "I couldn't find that" answer is often a permissions problem, not a model problem.

The exam expects you to recognise when a request is really a data project in disguise: if the knowledge source fails two or more checks, the first deliverable is a data remediation plan, not an agent.`,
    },
    {
      heading: 'Organising business data so other AI systems can use it',
      body: `Architects are asked to make solution data available not just to one agent but to **other AI systems**: Microsoft 365 Copilot, custom Foundry agents, partner agents over A2A, even non-Microsoft assistants. The patterns to know:

- **Dataverse as the system of record for business apps.** Dynamics 365 Sales, Customer Service and other model-driven apps already live there; finance and operations data can be exposed as **virtual entities** (the \`mserp_\` tables) or synchronised with dual-write. Any Copilot Studio agent, Microsoft 365 Copilot declarative agent or Power Apps MCP client can then use the same tables.
- **Copilot connectors (formerly Microsoft Graph connectors)** index external content into Microsoft Graph so Copilot, Copilot Studio agents and Agent Builder agents can ground on it with citations and semantic search. Use them for broad, searchable knowledge that benefits from reuse across Microsoft 365.
- **Power Platform connectors** call APIs in real time for reads, writes and triggers with no data copy. Use them for current facts and transactions, and as *tools* rather than as an index.
- **Azure AI Search** gives you a controllable vector and hybrid index for Foundry agents and for Copilot Studio generative answers when you need custom chunking, security trimming by field or hybrid ranking.
- **MCP servers** expose tools and resources as a protocol-level contract: Dynamics 365 Sales, Customer Service and the Dynamics 365 ERP MCP server already publish tools that any MCP-capable agent can call, so the same business logic serves Copilot Studio, Foundry and Visual Studio Code.
- **Microsoft Fabric / OneLake** for analytical data, surfaced to agents through Fabric data agents.

The organising principle is *one governed source, many consumers*. Copying data into each agent's own store multiplies refresh problems, permission drift and residency risk.`,
    },
    {
      heading: 'Designing data processing: Foundry Tools and the grounding pipeline',
      body: `Raw business data is rarely ready for a model. **Foundry Tools** (the Azure AI services family, now branded under Microsoft Foundry) provide the processing stages an architect proposes for a requirement:

- **Document Intelligence**: extract fields and tables from invoices, contracts, forms and receipts before they are indexed or used as prompt inputs.
- **Content Understanding**: analyse mixed media (documents, audio, video, images) into structured output.
- **Language**: conversational language understanding (CLU) for intents and entities, PII detection and redaction, summarisation, key-phrase extraction. CLU can also act as the external recogniser for a Copilot Studio agent.
- **Speech**: speech-to-text and text-to-speech for voice channels and call transcripts.
- **Vision / Custom Vision**: image classification and object detection, for example damaged-goods photos in a returns process.
- **Translator** for multilingual content, **Azure AI Search** for the index itself, and **Content Safety** to screen inputs and outputs.

A typical grounding pipeline runs: ingest, classify and redact sensitive data, extract structure, chunk and enrich with metadata (owner, effective date, sensitivity label), embed and index, then serve through a retrieval layer that enforces the caller's permissions. In Copilot Studio, uploaded files follow a managed version of this pipeline automatically (Dataverse stores the file, chunks it, creates vector embeddings and semantic indexes). In Foundry you design it yourself and can tune chunk size, metadata filters and hybrid ranking.

Exam angle: when a requirement says "unstructured PDFs with tables that must be queried precisely", the intended answer is usually Document Intelligence feeding a structured store, not simply uploading PDFs as knowledge. When it says "redact customer identifiers before grounding", look for the Language PII capability, not a DLP policy (DLP governs connectors, it does not transform text).`,
    },
  ],
  examples: [
    {
      title: 'Classifying a claims back-office process',
      description:
        'An insurer wants "AI for claims". Discovery finds three distinct needs: handlers re-key data from emailed claim forms (task automation), team leads ask weekly for trends in claim types (analytics), and assessors decide pay-outs (decision-making). The architect proposes an autonomous agent with Document Intelligence to extract form fields and create the claim record with human approval above a threshold, an Analyst-style prompt-and-response agent over Dataverse for trends, and keeps the pay-out decision with a deterministic rules engine while the agent drafts the justification for the assessor.',
      takeaway: 'One business ask usually hides several use-case classes; match each to the right level of autonomy.',
    },
    {
      title: 'The stale-policy knowledge source (a realistic mistake)',
      description:
        'A retailer builds an HR agent grounded on a SharePoint library and ships it in two weeks. Within a month the agent cites a parental-leave policy that changed a year ago: the library held both versions and nobody owned retirement of old documents. The team first tries to fix it with a prompt ("always use the newest document"), which the model cannot reliably honour. The fix is a data fix: archive superseded files, add an "effective date" column and a single owner, scope the knowledge source to the current-policy folder, and add a validation test that asks the agent five known-answer policy questions after each content change.',
      takeaway: 'Grounding failures are data-quality failures; remediate the source and add regression tests rather than patching prompts.',
    },
    {
      title: 'Making ERP data available to every agent',
      description:
        'A manufacturer wants the warehouse Copilot in Dynamics 365 Supply Chain Management, a Copilot Studio supplier agent and a Foundry demand-planning agent to all see on-hand inventory. Instead of three extracts, the architect enables the finance and operations virtual entities (mserp_inventoryonhandaientity) in the linked Dataverse environment, adds them as a Dataverse knowledge source to the Copilot for finance and operations apps agent and the supplier agent, and exposes write operations through the Dynamics 365 ERP MCP server for the Foundry agent.',
      takeaway: 'Publish business data once through Dataverse, connectors or MCP, then let each agent consume it with the right identity.',
    },
    {
      title: 'Choosing the processing tool',
      description:
        'A bank must let relationship managers ask questions about scanned loan agreements. Simply uploading the scans as knowledge produces vague answers because the tables inside are images. The design adds Document Intelligence to extract parties, amounts and covenants into Dataverse, Language PII detection to redact account numbers in free-text clauses, and indexes the cleaned text with metadata so the agent can cite the clause and the extracted fields.',
      takeaway: 'Propose Foundry Tools for the specific transformation a requirement needs: extraction, redaction, speech or vision.',
    },
  ],
  keyPoints: [
    'Classify every use case as task automation, data analytics or decision-making before choosing a platform; the class drives how much autonomy is safe.',
    'Generative AI suits unstructured inputs where variation is acceptable; deterministic models and flows suit repeatable, auditable outcomes. Most solutions combine them.',
    'Review grounding data for accuracy, relevance, timeliness, cleanliness and availability; failing checks means a data remediation plan comes before the agent.',
    'Knowledge sources in Copilot Studio (SharePoint, Dataverse, Copilot connectors) are read with the agent user\'s Entra ID, so permissions, not the model, decide what is retrievable.',
    'Organise data for reuse: Dataverse and virtual entities for business records, Copilot connectors for indexed knowledge, Power Platform connectors for real-time transactions, Azure AI Search for custom indexes, MCP servers for shared tools.',
    'Copilot connectors copy and semantically index content into Microsoft Graph; Power Platform connectors call APIs live with no data movement. Pick by whether you need search or transactions.',
    'Foundry Tools (Document Intelligence, Content Understanding, Language, Speech, Vision, Translator, Azure AI Search, Content Safety) are the processing stages you propose for extraction, redaction, transcription and indexing.',
  ],
  flashcards: [
    { front: 'What three use-case classes does AB-100 expect you to assess agents against?', back: 'Task automation, data analytics and decision-making.' },
    { front: 'Name the five data properties to review before using a source for grounding.', back: 'Accuracy, relevance, timeliness, cleanliness and availability.' },
    { front: 'When does CAF recommend generative AI over non-generative AI?', back: 'When inputs are unstructured and some variation in output is acceptable; use deterministic (non-generative) AI when the same input must produce the same result.' },
    { front: 'Whose identity does a Copilot Studio agent use to read SharePoint or Dataverse knowledge?', back: 'The agent user\'s Microsoft Entra ID, so users only receive content they can already access.' },
    { front: 'Copilot connector versus Power Platform connector as knowledge: what is the core difference?', back: 'Copilot connectors index content into Microsoft Graph for semantic search and citations; Power Platform connectors call APIs in real time with no data copy and are best for transactions and current facts.' },
    { front: 'How is finance and operations data made available to Copilot Studio agents?', back: 'Through finance and operations virtual entities (mserp_ tables) or dual-write into the linked Dataverse environment, added as a Dataverse knowledge source; write actions via the Dynamics 365 ERP MCP server.' },
    { front: 'Which Foundry Tool extracts fields and tables from invoices and contracts?', back: 'Document Intelligence (Content Understanding for mixed media).' },
    { front: 'Which Foundry Tool capability redacts personal data in text before grounding?', back: 'Azure AI Language PII detection and redaction.' },
    { front: 'What happens to files uploaded as knowledge in Copilot Studio?', back: 'Dataverse stores them, chunks them, builds vector embeddings and semantic indexes used for retrieval.' },
    { front: 'An agent answers "I couldn\'t find that" for one user but not another. Most likely cause?', back: 'The first user lacks permission to the underlying content; knowledge is security-trimmed to the asking user.' },
  ],
  quiz: [
    {
      question:
        'A logistics company wants an agent to approve or reject carrier invoices up to 50,000 euros with no human review, and expects identical decisions for identical invoices. Which design is MOST appropriate?',
      options: [
        'A generative orchestration agent with instructions describing the approval policy',
        'A deterministic rules or prediction model that makes the decision, with a generative agent that explains the outcome and drafts the response',
        'A prompt-and-response agent grounded on the invoice archive',
        'A Computer Use tool that reads each invoice on screen and clicks approve',
      ],
      correct: [1],
      explanation:
        'Repeatable, auditable decisions belong with deterministic logic; generative AI adds value by explaining and drafting. Instructions alone cannot guarantee identical outputs, a Q&A agent does not decide, and Computer Use is for systems without an API, not for policy decisions.',
    },
    {
      question:
        'During discovery you find the proposed knowledge source is a SharePoint library containing current and superseded contracts, with no owner and no effective dates. What should you recommend FIRST?',
      options: [
        'Add instructions telling the agent to prefer the newest document',
        'Remediate the source: archive superseded files, add effective-date metadata and an owner, then scope the knowledge source',
        'Switch the knowledge source to a public website',
        'Increase the number of citations the agent returns',
      ],
      correct: [1],
      explanation:
        'The source fails the accuracy and cleanliness checks; fix the data. Prompt instructions cannot reliably arbitrate versions, a public website is irrelevant, and more citations surface more stale content.',
    },
    {
      question:
        'Which TWO approaches make Dynamics 365 Supply Chain Management inventory data available to a Copilot Studio agent as knowledge? (Select two)',
      options: [
        'Enable finance and operations virtual entities and add them as a Dataverse knowledge source',
        'Synchronise the data to Dataverse with dual-write and add the table as a knowledge source',
        'Export the data to a public website and add it as a website knowledge source',
        'Add the Lifecycle Services project as a knowledge source',
      ],
      correct: [0, 1],
      explanation:
        'Virtual entities (mserp_ tables) and dual-write both expose finance and operations data in Dataverse, which Copilot Studio can ground on. Publishing to a public website breaks security, and Lifecycle Services is an operations portal, not a knowledge source.',
    },
    {
      question:
        'A relationship manager needs to ask questions about covenants in scanned loan agreements, and the current agent gives vague answers because the key figures sit in tables inside images. Which Foundry Tool should you propose?',
      options: ['Azure AI Content Safety', 'Document Intelligence', 'Speech', 'Translator'],
      correct: [1],
      explanation:
        'Document Intelligence extracts fields and tables from scanned documents so they can be indexed or stored structurally. Content Safety screens harmful content, Speech handles audio, Translator handles language conversion.',
    },
    {
      question:
        'You need agents in Copilot Studio to read live order status from an external order-management API without copying data into Microsoft 365, and the same system\'s product manuals to be searchable with citations across Copilot experiences. What should you use?',
      options: [
        'A Copilot connector for both requirements',
        'A Power Platform connector for both requirements',
        'A Power Platform connector for order status and a Copilot connector for the manuals',
        'Upload the manuals as files and hard-code order status in topics',
      ],
      correct: [2],
      explanation:
        'Power Platform connectors give real-time API access with no data movement; Copilot connectors index content into Microsoft Graph for semantic search and reuse. Using one connector type for both ignores the different needs, and hard-coding status is not viable.',
    },
    {
      question:
        'Compliance requires that customer identifiers never reach the language model when an agent summarises support emails. Which control addresses this requirement?',
      options: [
        'A Power Platform DLP policy classifying the Outlook connector as Business',
        'Azure AI Language PII detection and redaction in the processing pipeline before grounding',
        'A sensitivity label on the mailbox',
        'Enabling generative orchestration',
      ],
      correct: [1],
      explanation:
        'Only PII redaction transforms the text. DLP governs which connectors can be combined, labels classify and protect content but do not strip identifiers from prompts, and orchestration mode is unrelated.',
    },
  ],
  statements: [
    { text: 'Generative AI is the preferred choice whenever the same input must always produce the same output.', isTrue: false, explanation: 'Generative AI is non-deterministic; repeatable outcomes suit deterministic models, rules or flows.' },
    { text: 'Copilot Studio knowledge sources such as SharePoint and Dataverse return only content the asking user is permitted to see.', isTrue: true, explanation: 'They authenticate with the agent user\'s Microsoft Entra ID.' },
    { text: 'Copilot connectors call external APIs in real time without copying data.', isTrue: false, explanation: 'That describes Power Platform connectors; Copilot connectors index content into Microsoft Graph.' },
    { text: 'Finance and operations virtual entities appear in Dataverse with an mserp_ prefix and can be added as Copilot Studio knowledge.', isTrue: true, explanation: 'They expose live finance and operations data as Dataverse tables.' },
    { text: 'If a knowledge source fails the timeliness and cleanliness checks, the correct first step is to tune the agent\'s prompt.', isTrue: false, explanation: 'Fix the data source first; prompts cannot repair stale or dirty data.' },
    { text: 'Document Intelligence and Content Understanding are Foundry Tools used to turn documents and media into structured data.', isTrue: true, explanation: 'They are the extraction stages of a grounding pipeline.' },
    { text: 'Files uploaded to Copilot Studio as knowledge are stored and vector-indexed in Dataverse.', isTrue: true, explanation: 'Dataverse ingests the raw files and creates embeddings and semantic indexes.' },
  ],
  resources: [
    { label: 'Cloud Adoption Framework: AI adoption plan and use-case identification', url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/ai/plan' },
    { label: 'Knowledge sources in Copilot Studio', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio' },
    { label: 'Chat with finance and operations data (virtual entities as knowledge)', url: 'https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/copilot/chat-with-fno-data' },
    { label: 'What are Foundry Tools (Azure AI services)?', url: 'https://learn.microsoft.com/en-us/azure/ai-services/what-are-ai-services' },
  ],
};

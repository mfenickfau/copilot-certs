import type { Concept } from '../../types';

export const choosingFoundryModelsAndServices: Concept = {
  id: 'choosing-foundry-models-and-services',
  title: 'Choosing Models, Foundry Services and Agent Building Blocks',
  summary:
    'How to pick the right model class (LLM, small model, reasoning, multimodal, embeddings or a Foundry Tool) for a task, which Foundry service handles generation, grounding, vector search, agent workflows and multimodal processing, how to choose a retrieval and indexing method, and which memory, tool and knowledge services an agent should use.',
  certs: ['ai-103', 'ai-901'],
  domains: ['ai-103-1', 'ai-901-1'],
  outcomes: ['ai-103-1-1-1', 'ai-103-1-1-2', 'ai-103-1-1-3', 'ai-103-1-1-4', 'ai-901-1-2-2'],
  tags: ['foundry', 'model-catalog', 'model-selection', 'foundry-tools', 'ai-search', 'agents', 'architecture', 'intermediate'],
  difficulty: 'intermediate',
  diagram: 'foundry-agent-stack',
  sections: [
    {
      heading: 'Picking a model class for the task',
      body: `Microsoft Foundry exposes one catalog (**Foundry Models**) with more than 10,000 models in two categories: **models sold directly by Azure** (OpenAI GPT and o-series, Microsoft Phi, DeepSeek, Llama, Grok, Mistral and others, hosted under Microsoft terms with Microsoft support and fungible provisioned throughput) and **models from partners and community** (Anthropic Claude, Cohere, Hugging Face and more, supported by their providers). The exam expects you to match a model *class* to a task before you pick a specific name:

| Need | Reach for | Why |
|---|---|---|
| Open-ended generation, complex instructions, tool calling | Large language model (GPT-5 family, GPT-4.1, Claude) | Best general reasoning and tool use |
| Low cost, low latency, on-device or high volume, narrow task | Small language model (Phi family, GPT-5-mini / nano, GPT-4.1-mini) | Cheaper per token, faster, good enough for classification and extraction |
| Multi-step planning, maths, code review | Reasoning model (o-series, GPT-5 with \`reasoning_effort\`) | Spends "thinking" tokens before answering |
| Images, audio or video *as input* | Multimodal model (GPT-4o / GPT-5 vision, gpt-realtime for audio) | Accepts mixed content in one request |
| Images or video *as output* | GPT-image series, Sora 2 | Dedicated generation models |
| Semantic similarity, vector search | Embedding model (text-embedding-3-small / large) | Turns text into vectors |
| Code generation and repair | Code-tuned model or Codex | Trained for programming |
| Deterministic, pretrained perception (OCR, speech, translation, PII, layout) | **Foundry Tools** (Azure Vision, Speech, Language, Translator, Document Intelligence, Content Understanding) | Purpose-built, cheaper and more predictable than prompting an LLM |

Two Foundry features change the calculus. **Model router** is deployed like a model but routes each prompt to the most suitable underlying model (Balanced, Cost or Quality mode, optional model subset), so you do not have to hand-pick per request. **Instant access models (preview)** let you call supported models by name with no deployment at all, which is ideal for prototyping. The distractor pattern: an item describes a bounded task (extract invoice totals, detect sentiment, transcribe a call) and offers a frontier LLM; the better answer is usually the matching Foundry Tool or a small model.`,
    },
    {
      heading: 'Which Foundry service does what',
      body: `Foundry is a platform of cooperating services, and items test whether you can name the right one for a job.

- **Foundry Models + deployments**: generation, embeddings, image and video generation, audio. Consumed through the OpenAI-compatible **Responses API** (recommended) or Chat Completions on the project or resource endpoint.
- **Foundry Agent Service**: managed runtime for **prompt agents** (declarative: model + instructions + tools, Foundry hosts it), **voice-based prompt agents**, and **hosted agents** (your own container built with Microsoft Agent Framework, LangGraph, Semantic Kernel or custom code, run by Foundry with a managed endpoint, identity and scaling). Use it for agent workflows and conversation state.
- **Azure AI Search**: indexing plus keyword, vector, hybrid and semantic-ranked retrieval. It also powers **Foundry IQ**, the managed knowledge-base layer that uses **agentic retrieval** (query planning, parallel subqueries, semantic reranking, permission-aware results with citations).
- **Toolbox**: a curated set of tools (MCP servers, OpenAPI, web search, AI Search, file search, code interpreter, A2A, skills) exposed through a single MCP-compatible endpoint with central auth, versioning, guardrails and tool search.
- **Memory (preview)**: managed long-term memory stores (user profile, chat summary and procedural memories) attached to agents through the memory search tool.
- **Foundry Tools** (formerly Azure AI services): Content Understanding, Document Intelligence, Vision, Speech, Language, Translator, Content Safety, exposed as REST/SDKs and, increasingly, as MCP tools for agents.
- **Guardrails and controls**, **Evaluation**, **Observability** (tracing in Application Insights, monitoring dashboard) and **Foundry Control Plane** (fleet governance) cut across everything.

For multimodal *processing* of files (documents, images, audio, video) at scale, the answer is **Content Understanding**; for a multimodal *conversation* (ask a question about a photo), the answer is a multimodal chat model.`,
    },
    {
      heading: 'Choosing a retrieval and indexing method',
      body: `Grounding quality depends on how content is indexed and queried. The decision ladder on the exam:

1. **A handful of user-supplied files, per conversation** → the agent **file search** tool with a vector store. Zero infrastructure.
2. **Curated organisational content, reused by many agents, permission-aware** → **Foundry IQ knowledge base** on Azure AI Search with indexed knowledge sources (Blob, OneLake, SharePoint, Azure SQL, uploaded files) and remote sources (web, MCP server, Fabric data agent, Work IQ).
3. **Full control over schema, scoring profiles, filters, facets and custom skills** → build the Azure AI Search index yourself (indexer + skillset + index) and query it from code or through the AI Search agent tool.

Within an index, pick the query type by content and question shape:

- **Keyword (BM25)**: exact terms, product codes, names, filters.
- **Vector (HNSW or exhaustive KNN)**: meaning-based matches, paraphrases, cross-lingual.
- **Hybrid**: both in one request merged with Reciprocal Rank Fusion (RRF). Microsoft's benchmarks show hybrid plus **semantic ranker** (L2 reranking with Bing-derived models) gives the best relevance for RAG, so "hybrid + semantic" is the default correct answer.
- **Agentic retrieval**: decomposes a complex, multi-part or conversational question into parallel subqueries, reranks and merges. Choose it when questions are compound or depend on chat history; accept extra latency and token-based billing.

Indexing choices: **integrated vectorization** (Text Split or Content Understanding skill for chunking + Azure OpenAI Embedding skill + a vectorizer on the index) when you want the indexer to chunk and embed automatically; **push (SDK) indexing** when your app owns the pipeline; **Document Layout** or **Content Understanding** skills when you need structure-aware (semantic) chunking with Markdown, tables and figure descriptions. Reduce vector cost with scalar or binary quantization and narrower types.`,
    },
    {
      heading: 'Memory, tools and knowledge for agents, and the exam angle',
      body: `Agent design items ask you to separate three kinds of context:

| Kind | Service | When |
|---|---|---|
| Knowledge (curated, shared) | Foundry IQ knowledge base, AI Search tool, SharePoint tool, file search | The answer lives in documents |
| Memory (per user, learned over time) | Foundry Memory (preview) via the memory search tool, scoped with \`{{$userId}}\` for per-user isolation | Preferences, prior sessions, how-to routines |
| Conversation state (this session) | Responses API **conversations** (server side) or your own store; standard setup can bring your own Cosmos DB | Multi-turn context |
| Actions | Function tools (your code), OpenAPI tools, MCP servers (including the 1,000+ managed MCP connectors), Azure Functions, A2A to other agents, browser automation, computer use, code interpreter | The agent must *do* something |

Microsoft's own guidance in the memory docs: use **memory** for user-specific context learned over time, a **Foundry IQ knowledge base** to ground on organisational content, and **file search** for documents a user supplies during an interaction.

Typical exam framings:
- "Lowest cost for a high-volume classification task" → small model or Foundry Tool, not a frontier LLM.
- "Answer questions over 20 TB of SharePoint and Blob content for several agents with user permissions enforced" → Foundry IQ knowledge base, not file search.
- "Agent must call an internal REST API described by a Swagger file" → OpenAPI tool; "must call a third-party system that already exposes MCP" → MCP tool, preferably through a Toolbox.
- "Remember a customer's dietary preferences across sessions" → Memory, not a longer system prompt.
- "Process 50,000 scanned PDFs, images and call recordings into structured JSON and Markdown" → Content Understanding analyzers, not GPT-4o prompts.`,
    },
  ],
  examples: [
    {
      title: 'Routing a mixed workload to the right model',
      description:
        'A retailer builds a support assistant. Intent classification of every incoming message runs on gpt-5-mini (cheap, fast), long multi-step refund investigations run on a reasoning model, product-photo questions go to a vision-capable GPT-5 deployment, and embeddings for the FAQ index come from text-embedding-3-small. Rather than hard-coding the choice for free-form chat, the team deploys model router in Balanced mode.',
      language: 'python',
      code: `from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

project = AIProjectClient(
    endpoint="https://contoso.services.ai.azure.com/api/projects/support",
    credential=DefaultAzureCredential(),
)
openai = project.get_openai_client()

# Cheap, bounded task: a small model
intent = openai.responses.create(
    model="gpt-5-mini",
    input="Classify as refund|shipping|other: 'Where is my parcel?'",
).output_text

# Free-form chat: let model router pick the underlying model per request
answer = openai.responses.create(
    model="model-router",          # a deployment of the model router
    input="Explain our 30-day return policy for opened electronics.",
).output_text`,
      takeaway: 'Match the model class to the task shape; use small models for bounded work and model router when you do not want to decide per request.',
    },
    {
      title: 'Choosing the retrieval layer for a knowledge agent',
      description:
        'Legal wants an agent that answers from 1.2 million contracts in Blob Storage and a SharePoint site, honouring SharePoint permissions, and shared by three different agents. File search cannot scale or enforce ACLs, so the team creates a Foundry IQ knowledge base with a Blob knowledge source and a SharePoint knowledge source, then connects it to each agent through its MCP endpoint.',
      language: 'python',
      code: `from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import PromptAgentDefinition, MCPTool
from azure.identity import DefaultAzureCredential

project = AIProjectClient(endpoint=PROJECT_ENDPOINT, credential=DefaultAzureCredential())
kb_mcp = ("https://legal-search.search.windows.net/knowledgebases/contracts-kb/mcp"
          "?api-version=2026-08-01-preview")

agent = project.agents.create_version(
    agent_name="contracts-agent",
    definition=PromptAgentDefinition(
        model="gpt-5",
        instructions="Always use the knowledge base tool and cite sources.",
        tools=[MCPTool(
            server_label="contracts-kb",
            server_url=kb_mcp,
            allowed_tools=["knowledge_base_retrieve"],
            project_connection_id=KB_CONNECTION_ID,
        )],
    ),
)`,
      takeaway: 'Shared, permission-aware, large-scale grounding points to a Foundry IQ knowledge base on Azure AI Search, not to per-agent file search.',
    },
    {
      title: 'The expensive mistake: prompting an LLM for perception work',
      description:
        'A team sends every scanned invoice page to GPT-5 as an image and asks for JSON. Costs balloon, totals are occasionally hallucinated, and there are no confidence scores for the review queue. The fix is to use the Content Understanding prebuilt-invoice analyzer (or Document Intelligence prebuilt-invoice for deterministic extraction), which returns typed fields with confidence and source grounding, and to reserve the LLM for the reasoning step over the extracted fields.',
      language: 'python',
      code: `# Before (fragile, expensive): image -> LLM -> free-text JSON
# After: Foundry Tool does perception, LLM does reasoning
from azure.ai.contentunderstanding import ContentUnderstandingClient
from azure.ai.contentunderstanding.models import AnalysisInput

cu = ContentUnderstandingClient(endpoint=FOUNDRY_ENDPOINT, credential=DefaultAzureCredential())
poller = cu.begin_analyze(analyzer_id="prebuilt-invoice",
                          inputs=[AnalysisInput(url=invoice_url)])
fields = poller.result().contents[0].fields          # typed, with confidence
total = fields["InvoiceTotal"]

# Only now hand the structured values to a model for policy reasoning
verdict = openai.responses.create(
    model="gpt-5-mini",
    input=f"Invoice total {total}. Does it exceed the PO limit of 5000? Answer yes/no.",
).output_text`,
      takeaway: 'Use Foundry Tools for deterministic extraction with confidence scores, and spend LLM tokens only on reasoning.',
    },
  ],
  keyPoints: [
    'Foundry Models has two catalog categories: models sold directly by Azure (Microsoft support, fungible PTU) and models from partners and community (provider support).',
    'Match model class to task: LLM for open reasoning and tools, small model for cheap bounded tasks, reasoning model for multi-step logic, multimodal for image/audio input, embeddings for vectors, Foundry Tools for OCR, speech, translation, PII and layout.',
    'Model router routes each prompt to the best underlying model (Balanced, Cost, Quality); instant access models (preview) need no deployment.',
    'Foundry Agent Service runs prompt agents (declarative), voice-based prompt agents and hosted agents (your container); Toolbox centralises tools behind one MCP endpoint.',
    'Retrieval ladder: file search for a few user files, Foundry IQ knowledge base for shared permission-aware organisational content, a hand-built Azure AI Search index for full control.',
    'Hybrid search (BM25 + vector merged by RRF) plus semantic ranker is the default best relevance for RAG; agentic retrieval adds query planning and parallel subqueries for compound questions.',
    'Use Memory for per-user context learned over time, knowledge bases for curated content, and Responses API conversations for session state.',
    'Content Understanding is the choice for multimodal file processing (documents, images, audio, video) into structured JSON or Markdown.',
  ],
  flashcards: [
    { front: 'What are the two categories of models in the Foundry model catalog?', back: 'Models sold directly by Azure (Microsoft-hosted, Microsoft support) and models from partners and community (provider-supported, e.g. Claude, Hugging Face).' },
    { front: 'When should you prefer a small language model such as Phi or gpt-5-mini?', back: 'High-volume, latency- or cost-sensitive, narrow tasks such as classification, extraction or routing where frontier reasoning is not needed.' },
    { front: 'What does model router do?', back: 'A deployable trained model that routes each prompt to the most suitable underlying model using Balanced, Cost or Quality mode, optionally restricted to a model subset.' },
    { front: 'Which Foundry service provides the managed knowledge-base layer with agentic retrieval?', back: 'Foundry IQ, built on Azure AI Search knowledge bases and knowledge sources.' },
    { front: 'Name the three agent types in Foundry Agent Service.', back: 'Prompt agents (declarative), voice-based prompt agents, and hosted agents (your own containerised code).' },
    { front: 'What is a Toolbox?', back: 'A curated, versioned set of tools exposed through one MCP-compatible endpoint with centralised authentication, governance, guardrails and tool search.' },
    { front: 'Which query type merges keyword and vector results, and with which algorithm?', back: 'Hybrid search, merged with Reciprocal Rank Fusion (RRF); add semantic ranker for L2 reranking.' },
    { front: 'File search vs Foundry IQ knowledge base vs Memory: what is each for?', back: 'File search: documents a user supplies in an interaction. Knowledge base: curated organisational content shared by agents. Memory: user-specific context learned across sessions.' },
    { front: 'What are instant access models?', back: 'Preview models you can call by name with no deployment, drawing from a global quota pool; good for prototyping.' },
    { front: 'A workload must turn PDFs, images, audio and video into structured JSON. Which service?', back: 'Azure Content Understanding in Foundry Tools (analyzers), not a chat model prompt.' },
  ],
  quiz: [
    {
      question:
        'Contoso processes 2 million short customer reviews per day and needs a positive/negative/neutral label with an aspect breakdown at the lowest cost. Which approach is MOST appropriate?',
      options: [
        'Call a GPT-5 deployment with a few-shot prompt for every review.',
        'Use Azure Language sentiment analysis with opinion mining (a Foundry Tool).',
        'Deploy a reasoning model with reasoning_effort set to high.',
        'Fine-tune an embedding model to output sentiment labels.',
      ],
      correct: [1],
      explanation:
        'Sentiment with aspect (opinion) mining is a pretrained, deterministic Foundry Tool capability that is cheaper and more predictable than a frontier LLM. Reasoning models add cost and latency for no benefit, and embedding models produce vectors, not labels.',
    },
    {
      question:
        'An agent must answer questions over contracts stored in Blob Storage and a SharePoint site. Three other agents will reuse the same knowledge, and SharePoint permissions must be enforced for the signed-in user. What should you recommend?',
      options: [
        'Upload the contracts to a vector store and attach the file search tool to each agent.',
        'Create a Foundry IQ knowledge base with Blob and SharePoint knowledge sources and connect it to the agents.',
        'Store the contracts in a Foundry memory store scoped per user.',
        'Paste the contract text into each agent\'s instructions.',
      ],
      correct: [1],
      explanation:
        'A Foundry IQ knowledge base is shared across agents, scales to large corpora and enforces ACLs and sensitivity labels at query time. File search is per-agent and not permission-aware at this scale, memory is for learned user context, and instructions cannot hold millions of documents.',
    },
    {
      question: 'Which TWO statements about choosing a retrieval method in Azure AI Search are correct? (Select two)',
      options: [
        'Hybrid search runs full-text and vector queries in parallel and merges them with Reciprocal Rank Fusion.',
        'Vector search is the best choice for exact product codes and part numbers.',
        'Agentic retrieval decomposes complex questions into parallel subqueries and semantically reranks the results.',
        'Semantic ranker replaces the need for an embedding model.',
      ],
      correct: [0, 2],
      explanation:
        'Hybrid search uses RRF to merge BM25 and vector results, and agentic retrieval plans and runs subqueries in parallel with reranking. Exact codes favour keyword search, and semantic ranker is a reranking layer over BM25 or RRF results, not a substitute for embeddings.',
    },
    {
      question:
        'A travel agent must remember that a returning customer prefers aisle seats and vegetarian meals across future sessions and devices. Which capability should you use?',
      options: [
        'Foundry Memory (preview) with the memory search tool scoped per user.',
        'A Foundry IQ knowledge base containing customer profiles.',
        'A longer system prompt listing known preferences.',
        'The code interpreter tool.',
      ],
      correct: [0],
      explanation:
        'Memory is designed for user-specific context learned over time, isolated per user by scope. Knowledge bases ground on curated organisational content, system prompts cannot learn per user, and code interpreter runs Python.',
    },
    {
      question:
        'You need an agent to call an internal pricing service that already publishes an OpenAPI 3.0 specification with operationIds. What is the LEAST-effort integration?',
      options: [
        'Write a custom function tool that wraps each endpoint.',
        'Add the specification as an OpenAPI tool with a project connection for authentication.',
        'Rebuild the service as an MCP server.',
        'Index the API documentation in Azure AI Search.',
      ],
      correct: [1],
      explanation:
        'The OpenAPI tool consumes the spec directly with anonymous, API key or managed identity auth. Function tools and MCP servers require new code, and indexing documentation lets the agent read about the API, not call it.',
    },
    {
      question: 'Which deployment choice lets you start sending prompts to a supported model without creating a deployment at all?',
      options: ['Global Provisioned', 'Instant access models (preview)', 'Data Zone Batch', 'Developer tier'],
      correct: [1],
      explanation:
        'Instant access models are called by name with no deployment and draw on a global quota pool. The other options are all deployment types that must be created first.',
    },
  ],
  statements: [
    { text: 'Models from partners and community in the Foundry catalog are supported by Microsoft under Microsoft Product Terms.', isTrue: false, explanation: 'Partner and community models are supported by their providers; models sold directly by Azure carry Microsoft support.' },
    { text: 'Model router can be deployed like any other model and chooses an underlying model per request.', isTrue: true, explanation: 'It is a trained routing model with Balanced, Cost and Quality modes and optional model subsets.' },
    { text: 'Hybrid search in Azure AI Search merges keyword and vector results using Reciprocal Rank Fusion.', isTrue: true, explanation: 'BM25 and vector rankings are fused with RRF, and semantic ranker can rerank the result.' },
    { text: 'The file search tool is the recommended way to ground several agents on millions of permission-controlled SharePoint documents.', isTrue: false, explanation: 'That scenario calls for a Foundry IQ knowledge base; file search suits a handful of user-supplied files.' },
    { text: 'A Toolbox exposes a curated set of tools through a single MCP-compatible endpoint that non-Foundry agents can also use.', isTrue: true, explanation: 'Toolboxes are Foundry-homed but usable by any MCP-compatible client, including LangGraph or custom agents.' },
    { text: 'Content Understanding is the right service when you need a model to chat about a single photo a user just uploaded.', isTrue: false, explanation: 'A multimodal chat model handles conversational questions about an image; Content Understanding is for repeatable, schema-driven extraction from files.' },
    { text: 'Hosted agents in Foundry Agent Service run your own containerised code with a managed endpoint and identity.', isTrue: true, explanation: 'Hosted agents bring your framework (Agent Framework, LangGraph, custom) while Foundry supplies endpoint, identity, scaling and observability.' },
  ],
  resources: [
    { label: 'Overview of Microsoft Foundry Models', url: 'https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-models-overview' },
    { label: 'What is Foundry IQ?', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-foundry-iq' },
    { label: 'Hybrid search in Azure AI Search', url: 'https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview' },
    { label: 'What is Toolbox in Foundry?', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview' },
  ],
};

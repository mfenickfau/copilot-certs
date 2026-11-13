import type { Concept } from '../../types';

export const multiAgentRagAndKnowledge: Concept = {
  id: 'multi-agent-rag-and-knowledge',
  title: 'Multi-Agent RAG and Knowledge Integration: Chunking, Embeddings, Retrieval Precision and MCP Sources',
  summary:
    'Designing knowledge access for a fleet of agents: agentic retrieval with Foundry IQ knowledge bases and Azure AI Search, chunking and embedding choices that drive retrieval quality, hybrid search and semantic reranking for precision, permission-aware retrieval, and exposing knowledge to many agents through MCP so retrieval is shared rather than re-implemented per agent.',
  certs: ['ai-500', 'ai-300'],
  domains: ['ai-500-2', 'ai-300-5'],
  outcomes: ['ai-500-2-2-3', 'ai-500-2-2-4', 'ai-300-5-1-1', 'ai-300-5-1-3'],
  tags: ['rag', 'foundry-iq', 'azure-ai-search', 'agentic-retrieval', 'chunking', 'embeddings', 'hybrid-search', 'mcp', 'knowledge'],
  difficulty: 'advanced',
  diagram: 'rag-pipeline',
  sections: [
    {
      heading: 'From classic RAG to agentic retrieval',
      body: `Classic RAG is retrieve, augment, generate with one query against one index. In a multi-agent system that is rarely enough: questions arrive with multiple asks, depend on conversation history, and span several sources. **Agentic retrieval** in Azure AI Search, which powers **Foundry IQ**, upgrades the pipeline:

1. **Query planning**: at *low* or *medium* retrieval reasoning effort an LLM rewrites the question plus chat history into focused subqueries (at *minimal* effort this step is skipped and the query goes straight to the sources).
2. **Parallel execution**: subqueries run simultaneously as keyword, vector or hybrid searches across *knowledge sources* (indexed sources such as Blob Storage, ADLS Gen2, OneLake; remote sources such as SharePoint via the Copilot Retrieval API; public web).
3. **Semantic reranking** of each subquery's results (L2 reranker) to promote the most relevant passages.
4. **Result synthesis**: merged, extractive grounding with citations, an optional activity log, and optional **answer synthesis** by an LLM.

A **knowledge base** is the top-level resource: it lists knowledge sources and retrieval parameters, and many agents can share one knowledge base. Foundry agents connect to it over **MCP**, so knowledge becomes a tool call rather than custom code, and Agent Framework or LangGraph agents can call the same REST or SDK surface. Agentic retrieval costs more latency than a single query, so reserve the higher reasoning effort for complex or multi-turn questions and use minimal effort for simple lookups.`,
    },
    {
      heading: 'Chunking and embedding quality',
      body: `Retrieval precision is decided mostly before any query runs, at indexing time.

**Chunking.** Chunks must fit the embedding model's input limit (for example 8,191 tokens for text-embedding-3-small) and should represent one idea. Options in Azure AI Search: fixed-size chunks with overlap (Text Split skill; start around 512 tokens with roughly 25% overlap, then tune), variable-size chunks on sentence or heading boundaries, **semantic chunking** with the Azure Content Understanding skill (markdown output that preserves structure), and custom combinations such as prepending the document title to every chunk so mid-document chunks keep context. Knowledge sources for Blob, ADLS Gen2 and OneLake generate the full indexer, skillset and index for you (integrated vectorization), and scheduled indexer runs keep content fresh. Highly structured data needs less overlap; narrative text benefits from more.

**Embeddings.** Choose one embedding model per index and keep it identical for indexing and querying; changing the model means re-embedding. Larger-dimension models (text-embedding-3-large) raise recall ceilings at higher storage and cost; compression (scalar or binary quantization) and dimension truncation trade a little quality for much less storage. Store the fields citations need (title, URL, page) alongside the vector so answers can cite. Multilingual corpora can share one embedding space, which hybrid search then complements with language analyzers on the text fields.

**Evaluate before you ship.** Use ground-truth question and chunk pairs to measure retrieval (Document Retrieval and Retrieval evaluators in Foundry), then groundedness and relevance on generated answers. Adjust chunk size and overlap and compare, because the optimum differs per corpus and per model.`,
    },
    {
      heading: 'Retrieval precision: hybrid, reranking, filters, permissions',
      body: `Several levers raise precision at query time:

- **Hybrid search** runs BM25 full-text and vector (HNSW or exhaustive KNN) queries in parallel and merges them with Reciprocal Rank Fusion. Keywords win on product codes, names, dates and jargon; vectors win on paraphrase. Benchmarks show hybrid plus semantic ranker gives the best relevance, which is why the Foundry Azure AI Search tool defaults to \`vector_semantic_hybrid\`.
- **Semantic ranker** reranks the top results with a cross-encoder; set vector \`k\` to around 50 to feed it well, then return a small \`top_k\` (default 5) to the agent.
- **Filters and metadata**: tenant, department, document type, date range. Prefer post-filtering when using the semantic ranker, and test both. Filters are also your defence against vector-only recall returning the right-looking but wrong document.
- **Permission-aware retrieval**: index ACL metadata and pass the user's token in \`x-ms-query-source-authorization\` so Azure AI Search filters at query time; remote SharePoint sources enforce permissions directly through the Copilot Retrieval API; Foundry IQ synchronises ACLs and honours Purview sensitivity labels. Agents therefore only see what the asking user may see.
- **Oversampling and exhaustive search** on vector queries recover recall lost to approximate nearest-neighbour indexes when the corpus is small or precision is critical.
- **Thresholds**: tune similarity thresholds and reranker score cut-offs so that low-confidence results are dropped rather than passed to the model, and tell the agent to say "not found" when grounding is empty.`,
    },
    {
      heading: 'Knowledge integration for many agents',
      body: `In a multi-agent solution, knowledge access should be a shared service with consistent security, not a per-agent re-implementation:

- **One knowledge base, many agents.** Foundry IQ knowledge bases are referenced by prompt agents, hosted agents, Agent Framework agents and Copilot Studio agents alike. Routing a question to the right source happens inside the knowledge base (source selection during query planning), so orchestrators do not need "which index" logic.
- **MCP-available sources.** Beyond Foundry IQ, enterprise knowledge increasingly arrives as MCP servers: Microsoft Learn, Fabric IQ data agents, Work IQ for Microsoft 365, partner systems, and your own MCP server in front of a knowledge API. Put them in a **toolbox** with **tool search** so an agent facing dozens of knowledge tools sees only the relevant ones, and apply guardrails at the tool-response intervention point because retrieved text is a prime channel for indirect prompt injection.
- **Division of labour.** A common pattern is a *retriever* or *research* agent that owns search strategy (decides effort, sources, filters) and returns cited grounding, while *writer* and *reviewer* agents consume it. Agent Framework offers \`TextSearchProvider\` (search before each run or on demand as a tool) and \`create_vector_search_tool()\` for vector stores, plus Azure AI Search and Foundry context providers.
- **Memory versus knowledge versus files.** Use memory for user-specific learned context, a knowledge base for curated organisational content, and the file search tool for documents a user uploads during a conversation. Mixing them up is a frequent design error.
- **Observe retrieval.** Trace spans for the retrieval tool show subqueries, hits and latency; retrieval and groundedness evaluators run on sampled production traffic catch quality regressions when the corpus changes.`,
    },
  ],
  examples: [
    {
      title: 'Designing a shared knowledge base for a policy and HR agent team',
      description:
        'Three agents (benefits, leave, payroll) each built their own AI Search index with different chunking, and users got inconsistent answers. The redesign created one Foundry IQ knowledge base with three knowledge sources (SharePoint HR site as a remote source with query-time permission enforcement, a Blob container of policy PDFs with integrated chunking and vectorization, and a public benefits-provider site), set reasoning effort to low, and connected all three agents to it over MCP. Citations now come from the same curated sources, and ACLs are enforced for every agent.',
      takeaway: 'Centralise retrieval in a knowledge base shared by all agents so quality, permissions and citations are consistent.',
    },
    {
      title: 'Attaching an Azure AI Search index to a prompt agent with hybrid semantic retrieval',
      description:
        'A prompt agent grounds answers in an existing index. The connection uses the project managed identity (required for private networking), the query type is vector semantic hybrid, and top_k is kept small so the model receives only the best passages.',
      language: 'python',
      code: `from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import (
    AzureAISearchTool, AzureAISearchToolResource, AISearchIndexResource,
    AzureAISearchQueryType, PromptAgentDefinition,
)

with AIProjectClient(endpoint=PROJECT_ENDPOINT, credential=DefaultAzureCredential()) as project:
    conn_id = project.connections.get("hr-search-conn").id      # managed-identity connection
    search_tool = AzureAISearchTool(azure_ai_search=AzureAISearchToolResource(indexes=[
        AISearchIndexResource(
            project_connection_id=conn_id,
            index_name="hr-policies-v3",                          # one embedding model per index
            query_type=AzureAISearchQueryType.VECTOR_SEMANTIC_HYBRID,
            top_k=5,
            filter="department eq 'HR' and tenant eq 'contoso'",  # metadata filter on every query
        )]))
    agent = project.agents.create_version(
        agent_name="hr-policy-agent",
        definition=PromptAgentDefinition(
            model="gpt-4.1-mini",
            instructions="Answer only from retrieved sources and cite them. If nothing is retrieved, say so.",
            tools=[search_tool],
        ),
    )`,
      takeaway: 'Hybrid plus semantic ranking, small top_k and metadata filters are the query-time levers for precision; identity-based connections keep it secure.',
    },
    {
      title: 'Chunks too large, embeddings mixed (a realistic mistake)',
      description:
        'An engineering wiki was indexed as whole pages (some over 10,000 tokens) with an embedding model that silently truncated input, and the query path used a different embedding model after an upgrade. Retrieval returned pages whose relevant paragraph lay past the truncation point, and similarity scores were meaningless because the spaces did not match. Fixes: re-chunk to about 512 tokens with 25% overlap on heading boundaries (semantic chunking), prepend the page title to each chunk, re-embed everything with one model, and add a Document Retrieval evaluation with 50 labelled questions to catch regressions on the next change.',
      takeaway: 'Chunk to the embedding model\'s limit and to one idea per chunk, never mix embedding models between indexing and querying, and measure retrieval with ground truth.',
    },
    {
      title: 'A research agent that owns retrieval for the team',
      description:
        'In an Agent Framework workflow, a researcher agent uses a search tool exposed on demand so it can decide when and what to search, returns cited grounding, and a writer agent consumes only that grounding. Tool-response guardrails screen retrieved text for indirect attacks before it reaches the writer.',
      language: 'python',
      code: `from agent_framework import Agent, MCPStreamableHTTPTool
from agent_framework.foundry import FoundryChatClient
from agent_framework.orchestrations import SequentialBuilder

client = FoundryChatClient()
knowledge = MCPStreamableHTTPTool(            # Foundry IQ knowledge base or toolbox endpoint
    name="contoso-knowledge",
    url=KNOWLEDGE_MCP_URL,
    headers={"Authorization": f"Bearer {token}"},
)
researcher = Agent(client=client, name="Researcher", tools=[knowledge],
    instructions="Plan searches, retrieve from contoso-knowledge, return bullet facts with [n] citations only.")
writer = Agent(client=client, name="Writer",
    instructions="Write the answer using ONLY the researcher's cited facts. Keep the citations.")
workflow = SequentialBuilder(participants=[researcher, writer],
                             chain_only_agent_responses=True).build()`,
      takeaway: 'Separate retrieval strategy from writing, pass only cited grounding downstream, and screen retrieved content as untrusted input.',
    },
  ],
  keyPoints: [
    'Agentic retrieval (Foundry IQ on Azure AI Search) plans subqueries from the question and chat history, runs them in parallel across knowledge sources, semantically reranks, and returns cited grounding; reasoning effort (minimal, low, medium) trades latency for coverage.',
    'A knowledge base (knowledge sources plus retrieval parameters) is shared by many agents and reached over MCP, so routing to sources is a retrieval concern, not orchestration code.',
    'Chunk to the embedding model limit and to one idea per chunk (start near 512 tokens with ~25% overlap, use semantic or heading-based splitting, prepend titles); keep one embedding model per index for indexing and querying.',
    'Hybrid search (BM25 plus vector merged by RRF) with semantic ranker is the default for precision; set vector k around 50 for the ranker and return a small top_k.',
    'Metadata filters, oversampling, thresholds and permission-aware retrieval (x-ms-query-source-authorization, ACL sync, sensitivity labels) prevent wrong-document and over-exposure errors.',
    'Expose knowledge to agents as MCP sources in a toolbox with tool search, and guard tool responses against indirect prompt injection.',
    'Use memory for user-learned context, knowledge bases for curated organisational content and file search for in-conversation uploads.',
    'Measure retrieval with Document Retrieval and Retrieval evaluators on labelled data, then groundedness and relevance on answers, and keep evaluating in production.',
  ],
  flashcards: [
    { front: 'What are the four stages of agentic retrieval in Azure AI Search?', back: 'Query planning (LLM subqueries from question and history), parallel query execution across knowledge sources, semantic reranking, result synthesis with citations and optional answer synthesis.' },
    { front: 'What does the retrieval reasoning effort setting control?', back: 'Whether an LLM plans subqueries: minimal skips planning; low (default) and medium use the LLM for planning and source selection.' },
    { front: 'Recommended starting chunk size and overlap for RAG in Azure AI Search?', back: 'About 512 tokens (roughly 2,000 characters) with 25% overlap (about 128 tokens), then tune per corpus.' },
    { front: 'Why must the same embedding model be used for indexing and querying?', back: 'Vectors from different models live in different spaces; similarity scores become meaningless and recall collapses.' },
    { front: 'How does hybrid search merge keyword and vector results?', back: 'Reciprocal Rank Fusion (RRF) combines BM25 and vector (HNSW or eKNN) rankings into one result set.' },
    { front: 'What is the default query type of the Foundry Azure AI Search tool?', back: 'vector_semantic_hybrid, with top_k defaulting to 5.' },
    { front: 'How is permission-aware retrieval enforced at query time?', back: 'Index ACL metadata and pass the user token in x-ms-query-source-authorization; remote SharePoint sources enforce permissions via the Copilot Retrieval API; Foundry IQ syncs ACLs and honours sensitivity labels.' },
    { front: 'How do Foundry agents connect to a Foundry IQ knowledge base?', back: 'Through an MCP tool connection; the knowledge base orchestrates retrieval and returns cited grounding.' },
    { front: 'Memory, knowledge base or file search: which for curated organisational content?', back: 'A Foundry IQ knowledge base; memory is for user-specific learned context and file search for in-conversation documents.' },
    { front: 'Which Foundry evaluators measure retrieval quality specifically?', back: 'Retrieval and Document Retrieval (needs ground truth), followed by Groundedness and Relevance for the generated answer.' },
  ],
  quiz: [
    {
      question:
        'Users ask a travel-policy agent compound questions such as "What is the per-diem for Berlin, and does it change if the trip is over 30 days?" over multi-turn conversations. Single-query vector search misses one part of each question. Which change BEST improves coverage?',
      options: [
        'Increase top_k from 5 to 50.',
        'Use agentic retrieval through a Foundry IQ knowledge base so the question and history are decomposed into parallel subqueries that are semantically reranked.',
        'Switch the index to keyword-only search.',
        'Fine-tune the model on the travel policy.',
      ],
      correct: [1],
      explanation:
        'Agentic retrieval plans focused subqueries from the full conversation and runs them in parallel. A larger top_k floods the model, keyword-only loses paraphrase recall, and fine-tuning does not add fresh retrieval.',
    },
    {
      question:
        'Retrieval for product codes such as "SKU-88213" returns semantically similar but wrong products. Which TWO changes directly address this? (Select two)',
      options: [
        'Use hybrid search so BM25 keyword matching participates alongside vectors.',
        'Add a metadata filter or exact-match lookup on the SKU field.',
        'Increase chunk overlap to 50%.',
        'Switch to a larger embedding model only.',
      ],
      correct: [0, 1],
      explanation:
        'Exact identifiers are a keyword and filter problem; vectors alone are fuzzy. Overlap and a bigger embedding model do not make similarity exact.',
    },
    {
      question:
        'After upgrading the embedding deployment used at query time, retrieval quality collapsed although the index was unchanged. What is the MOST likely cause?',
      options: [
        'The semantic ranker was disabled.',
        'Queries are now embedded with a different model than the one used to index, so vector spaces do not match; re-embed the index with the new model or revert the query model.',
        'top_k is too high.',
        'The chunk size is too small.',
      ],
      correct: [1],
      explanation:
        'Mismatched embedding models between indexing and querying destroy similarity. The other options affect quality marginally, not catastrophically.',
    },
    {
      question:
        'An HR agent must never reveal documents the asking employee cannot open in SharePoint. Which design meets this requirement?',
      options: [
        'Index all SharePoint content and rely on the agent\'s instructions to avoid sensitive content.',
        'Use a knowledge source with query-time permission enforcement (ACL metadata plus the user\'s token in x-ms-query-source-authorization, or a remote SharePoint source enforcing permissions directly).',
        'Grant the project managed identity Sites.Read.All and filter in the prompt.',
        'Disable citations so users cannot see document names.',
      ],
      correct: [1],
      explanation:
        'Permissions must be enforced by retrieval at query time under the user\'s identity. Instruction-based or prompt-based filtering is not a security control, and hiding citations does not prevent exposure.',
    },
    {
      question:
        'Twelve agents each need access to Microsoft Learn, an internal API knowledge MCP server, and Fabric IQ. Tool selection accuracy is degrading as tools accumulate. What should you do?',
      options: [
        'Attach every MCP server directly to each agent and increase the context window.',
        'Create a Foundry toolbox containing the MCP knowledge sources, enable tool search, and point all agents at the toolbox endpoint.',
        'Merge all sources into one vector index.',
        'Give each agent a longer system prompt listing all tools.',
      ],
      correct: [1],
      explanation:
        'A toolbox centralises the sources and tool search exposes only relevant tools per step, keeping cost flat and selection accurate. Flattening heterogeneous sources into one index or lengthening prompts does not solve selection.',
    },
    {
      question: 'Which component should hold a user\'s stated preference that answers should always quote the German policy version?',
      options: ['The Foundry IQ knowledge base', 'A Foundry memory store scoped to the user', 'The file search vector store', 'The AI Search semantic configuration'],
      correct: [1],
      explanation:
        'User-specific learned context is memory. Knowledge bases hold curated content, file search holds uploaded documents, and semantic configuration tunes ranking.',
    },
  ],
  statements: [
    { text: 'Multiple agents, including Agent Framework and Copilot Studio agents, can share one Foundry IQ knowledge base.', isTrue: true, explanation: 'Knowledge bases are reusable resources exposed over MCP and REST.' },
    { text: 'At minimal retrieval reasoning effort, the knowledge base still uses an LLM to plan subqueries.', isTrue: false, explanation: 'Minimal effort skips LLM query planning and sends the query directly to knowledge sources.' },
    { text: 'Hybrid search in Azure AI Search merges full-text and vector results using Reciprocal Rank Fusion.', isTrue: true, explanation: 'Both queries run in parallel and RRF produces one ranked result set.' },
    { text: 'Prepending the document title to each chunk is a legitimate technique to preserve context for mid-document chunks.', isTrue: true, explanation: 'It is listed among custom chunking combinations.' },
    { text: 'The file search tool is the recommended place for curated, organisation-wide knowledge shared by many agents.', isTrue: false, explanation: 'File search is for user-provided documents during an interaction; curated organisational content belongs in a knowledge base.' },
    { text: 'Retrieved content from a knowledge source should be screened as untrusted input before an agent acts on it.', isTrue: true, explanation: 'Retrieved documents are a common channel for indirect prompt injection; use tool-response guardrails.' },
    { text: 'Using a larger embedding model always removes the need for chunking.', isTrue: false, explanation: 'Chunking is still needed for input limits and for representing one idea per vector.' },
  ],
  resources: [
    { label: 'What is Foundry IQ?', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-foundry-iq' },
    { label: 'Agentic retrieval in Azure AI Search', url: 'https://learn.microsoft.com/en-us/azure/search/search-agentic-retrieval-concept' },
    { label: 'Chunk large documents for RAG and vector search', url: 'https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents' },
    { label: 'Hybrid search using vectors and full-text search', url: 'https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview' },
  ],
};

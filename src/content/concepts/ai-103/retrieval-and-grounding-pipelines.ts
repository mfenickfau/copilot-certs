import type { Concept } from '../../types';

export const retrievalAndGroundingPipelines: Concept = {
  id: 'retrieval-and-grounding-pipelines',
  title: 'Retrieval and Grounding Pipelines with Azure AI Search and Foundry IQ',
  summary:
    'Ingesting and indexing documents, images, audio and video with indexers, data sources and skillsets; configuring keyword, vector, hybrid and semantic search for grounding; enriching content with built-in and custom skills (OCR, image analysis, entity recognition, Document Layout, Content Understanding, GenAI Prompt, embeddings); building RAG ingestion flows with chunking, OCR and integrated vectorization; and connecting retrieval directly to workflows and agents through knowledge bases, the Azure AI Search tool and MCP.',
  certs: ['ai-103'],
  domains: ['ai-103-5'],
  outcomes: ['ai-103-5-1-1', 'ai-103-5-1-2', 'ai-103-5-1-3', 'ai-103-5-1-4', 'ai-103-5-1-5'],
  tags: ['ai-search', 'indexers', 'skillsets', 'integrated-vectorization', 'hybrid-search', 'semantic-ranker', 'knowledge-sources', 'foundry-iq', 'rag', 'python', 'intermediate'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Ingesting and indexing documents, images, audio and video',
      body: `Azure AI Search ingests content two ways. **Push** indexing: your code (or a Logic Apps or Fabric pipeline) chunks, enriches and uploads JSON documents with \`SearchClient.upload_documents\`. **Pull** indexing: an **indexer** crawls a **data source** (Azure Blob Storage, Data Lake Storage, OneLake, Azure SQL, Cosmos DB, SharePoint Online, Azure Tables, Files) on a schedule, cracks documents (PDF, Office, HTML, JSON, CSV, Markdown, images), runs an optional **skillset**, maps fields and writes to the **index**. Indexers track changes for incremental runs, support \`imageAction\` to extract embedded images for OCR or image analysis, and report status, errors and warnings per run.

Modality by modality:
- **Documents**: text extraction is built in; add **Document Layout** (Document Intelligence Layout, Markdown with headings and tables) or **Azure Content Understanding** skills for structure-aware chunking and figure descriptions; OCR for scanned pages.
- **Images**: **OCR** skill for text, **Image Analysis** skill for tags and captions, **Azure Vision multimodal embeddings** skill (preview) to vectorize images for image or text queries, or the **GenAI Prompt** skill to *verbalize* an image with a chat model into searchable text; **knowledge store** projections save normalized images to Blob.
- **Audio and video**: preprocess with **Content Understanding** (\`prebuilt-audioSearch\`, \`prebuilt-videoSearch\` → transcripts, segments, key frames, Markdown), **Azure Speech batch transcription** or **Video Indexer**, then index the text and metadata (timestamps, speakers) so retrieval can cite a moment in the media. Store media URLs in the index, not the media itself.

Index design for grounding: an \`id\`, chunk \`content\`, \`content_vector\` (HNSW, dimensions matching the embedding model, optional scalar or binary **quantization**), \`title\`, \`url\`/\`source\`, page or timestamp metadata, filterable security fields (ACLs, group ids) and a **semantic configuration** naming title, content and keyword fields. **Vectorizers** on the index let queries embed text at query time. Use **index projections** to write one search document per chunk (one-to-many) from a parent document.`,
    },
    {
      heading: 'Configuring semantic, hybrid and vector search for grounding',
      body: `Query configuration determines grounding quality:

- **Full-text (BM25)**: \`search_text\` with analyzers, synonym maps, scoring profiles, filters and facets; precise for terms and identifiers.
- **Vector**: \`vector_queries=[VectorizedQuery(vector=..., k_nearest_neighbors=50, fields="content_vector", exhaustive=False)]\` or \`VectorizableTextQuery(text=...)\` when a vectorizer is configured; HNSW is approximate and fast, exhaustive KNN exact; \`oversampling\` improves recall with compressed vectors; \`vectorFilterMode\` chooses pre- or post-filtering.
- **Hybrid**: both in one request, fused with RRF; set \`top\` for the final count and larger k on the vector side.
- **Semantic ranker**: \`query_type="semantic"\` plus \`semantic_configuration_name\`; reranks the top 50 with Microsoft language models, returns **captions**, highlights and optional **answers**; **query rewrite** (preview) expands the query with paraphrases. Billed by usage with a free monthly allowance.
- **Agentic retrieval**: create **knowledge sources** (search index, blob, OneLake, SharePoint, Azure SQL, file upload, or remote: web, MCP server, Fabric data agent, Work IQ) and a **knowledge base** with retrieval reasoning effort (minimal: no LLM planning, low or medium: LLM query planning), optional **answer synthesis** (preview) and an Azure OpenAI model. Call \`retrieve\` with the conversation messages; get merged grounding content, references with citations and an activity log. GA REST \`2026-04-01\` covers minimal extractive retrieval; preview \`2026-08-01-preview\` adds planning, synthesis and multi-turn messages. Billing is token based (search tokens plus Azure OpenAI tokens for planning).

Relevance tuning: hybrid plus semantic is the default; add scoring profiles for freshness or boosts, filters for tenant and security trimming, and evaluate with Retrieval and Document Retrieval evaluators. Pick k and top to fill the context budget with the fewest, best chunks.`,
    },
    {
      heading: 'Enrichment with built-in and custom skills',
      body: `A **skillset** is a chain of skills over the enrichment tree (\`/document\`, \`/document/pages/*\`, \`/document/normalized_images/*\`). Categories:

- **Built-in skills billed through an attached Foundry resource** (processing by the service): **OCR**, **Image Analysis**, **Entity Recognition**, **Entity Linking**, **Key Phrase Extraction**, **Language Detection**, **PII Detection** (with masking), **Sentiment**, **Text Translation**, **Custom Entity Lookup**, **Azure Vision multimodal embeddings** (preview).
- **Built-in skills that call your own Azure-hosted model or resource**: **Azure OpenAI Embedding** (text-embedding-3-small/large/ada-002), **Azure Content Understanding** (semantic chunking, figure descriptions, layout), **GenAI Prompt** (any chat completion model for summaries, classification, image verbalization), **Document Layout** (Document Intelligence Layout).
- **Custom skills**: **Web API** skill calling your Azure Function or container (custom NER, domain classifiers, external OCR), and **AML** skill calling a Foundry or Azure Machine Learning model.
- **Utility skills** (free, internal): **Text Split** (pages or sentences, with overlap), Merge, Shaper, Conditional, Text Translation helpers.

**Integrated vectorization** = chunking skill (Text Split, Content Understanding or document parsing mode) + embedding skill + index projections + a matching **vectorizer** on the index. Enable the **enrichment cache** to avoid re-running paid skills when only the index schema changes; use **knowledge store** projections to send enriched output to tables and blobs for analytics. Mapping: \`outputFieldMappings\` connect skill outputs to index fields; **field mappings** rename source fields. Keyless billing (managed identity) relaxes the same-region requirement for Foundry-billed skills.`,
    },
    {
      heading: 'RAG ingestion flow with OCR, and connecting retrieval to agents',
      body: `A reference **RAG ingestion flow**: Blob data source → indexer with \`imageAction: generateNormalizedImages\` and \`dataToExtract: contentAndMetadata\` → skillset: OCR on images (merge text back with Merge skill) or Content Understanding/Document Layout for structure, Text Split for chunks with overlap, optional PII Detection to mask, Azure OpenAI Embedding per chunk → index projections writing chunk documents with parent id, title, page, URL and vector → vectorizer on the index → scheduled incremental runs with monitoring. Foundry IQ **indexed knowledge sources** generate this entire pipeline automatically from a blob container, OneLake lakehouse, SharePoint site, Azure SQL table or uploaded files, including chunking, embeddings, metadata and permission sync (ACLs, Purview labels).

**Connecting retrieval to workflows and agents**:
- **Foundry IQ knowledge base → agent**: expose the knowledge base's MCP endpoint (\`/knowledgebases/{kb}/mcp\`) through a RemoteTool project connection and attach \`MCPTool(allowed_tools=["knowledge_base_retrieve"])\` to a prompt agent, or bind it through a Toolbox for several agents and frameworks; Copilot Studio agents can also connect.
- **Azure AI Search tool** on a prompt agent or Toolbox for a specific index with a chosen query type (simple, semantic, vector, vector simple hybrid, vector semantic hybrid).
- **Code**: \`SearchClient\` or the knowledge base retrieval client inside a function tool, an Agent Framework tool, or a workflow step; Logic Apps and Azure Functions for event-driven re-indexing.
- **Classic alternative**: the file search tool with vector stores for small, per-agent document sets.

Security and operations: managed identity for the search service to reach data sources and Foundry resources; **Search Index Data Reader** for query identities; document-level security filters or permission-aware knowledge sources; private endpoints and shared private links for outbound connections; monitor indexer runs, index size and query latency; re-embed after changing the embedding model.

Exam framings: "scanned PDFs with handwriting must become searchable chunks" → indexer with OCR (or Content Understanding skill) + Text Split + embedding; "charts inside PDFs must be searchable" → Content Understanding skill figure descriptions or GenAI Prompt verbalization; "search across SharePoint and Blob with user permissions for several agents" → Foundry IQ knowledge base with indexed knowledge sources; "answers must quote the exact passage" → semantic captions or agentic retrieval references; "video archive Q&A" → Content Understanding video analyzer output indexed with timestamps.`,
    },
  ],
  examples: [
    {
      title: 'Integrated vectorization skillset with OCR for scanned PDFs',
      description:
        'An indexer pulls scanned contracts from Blob Storage, extracts embedded images, runs OCR, merges the text, splits it into overlapping chunks, embeds each chunk with Azure OpenAI and projects one search document per chunk.',
      language: 'json',
      code: `{
  "name": "contracts-skillset",
  "cognitiveServicesAccount": { "@odata.type": "#Microsoft.Azure.Search.AIServicesByIdentity",
                                "subdomainUrl": "https://contoso-foundry.cognitiveservices.azure.com" },
  "skills": [
    { "@odata.type": "#Microsoft.Skills.Vision.OcrSkill", "context": "/document/normalized_images/*",
      "inputs": [{ "name": "image", "source": "/document/normalized_images/*" }],
      "outputs": [{ "name": "text", "targetName": "ocrText" }] },
    { "@odata.type": "#Microsoft.Skills.Text.MergeSkill", "context": "/document",
      "inputs": [{ "name": "text", "source": "/document/content" },
                 { "name": "itemsToInsert", "source": "/document/normalized_images/*/ocrText" },
                 { "name": "offsets", "source": "/document/normalized_images/*/contentOffset" }],
      "outputs": [{ "name": "mergedText", "targetName": "mergedText" }] },
    { "@odata.type": "#Microsoft.Skills.Text.SplitSkill", "context": "/document", "textSplitMode": "pages",
      "maximumPageLength": 2000, "pageOverlapLength": 200,
      "inputs": [{ "name": "text", "source": "/document/mergedText" }],
      "outputs": [{ "name": "textItems", "targetName": "chunks" }] },
    { "@odata.type": "#Microsoft.Skills.Text.AzureOpenAIEmbeddingSkill", "context": "/document/chunks/*",
      "resourceUri": "https://contoso-foundry.openai.azure.com", "deploymentId": "text-embedding-3-small",
      "modelName": "text-embedding-3-small", "dimensions": 1536,
      "inputs": [{ "name": "text", "source": "/document/chunks/*" }],
      "outputs": [{ "name": "embedding", "targetName": "vector" }] } ],
  "indexProjections": { "selectors": [{ "targetIndexName": "contracts-chunks", "parentKeyFieldName": "parent_id",
      "sourceContext": "/document/chunks/*", "mappings": [{ "name": "content", "source": "/document/chunks/*" },
      { "name": "content_vector", "source": "/document/chunks/*/vector" } ] }], "parameters": { "projectionMode": "skipIndexingParentDocuments" } } }`,
      takeaway: 'OCR, merge, split and embed skills plus index projections turn scanned documents into chunk-level vector documents with no custom code; the indexer imageAction setting feeds the OCR skill.',
    },
    {
      title: 'Knowledge base with two knowledge sources, connected to an agent',
      description:
        'A knowledge base combines an existing product index and a blob container of manuals; agentic retrieval plans subqueries across both. The agent reaches it through MCP, and a Python client can call retrieve directly from a workflow.',
      language: 'python',
      code: `from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (SearchIndexKnowledgeSource,
    SearchIndexKnowledgeSourceParameters, AzureBlobKnowledgeSource, AzureBlobKnowledgeSourceParameters,
    KnowledgeBase, KnowledgeSourceReference, KnowledgeBaseAzureOpenAIModel, AzureOpenAIVectorizerParameters)
from azure.search.documents.knowledgebases import KnowledgeBaseRetrievalClient
from azure.search.documents.knowledgebases.models import (KnowledgeBaseRetrievalRequest,
    KnowledgeBaseMessage, KnowledgeBaseMessageTextContent)

idx = SearchIndexClient(endpoint=SEARCH_ENDPOINT, credential=cred)
idx.create_or_update_knowledge_source(SearchIndexKnowledgeSource(name="products-ks",
    search_index_parameters=SearchIndexKnowledgeSourceParameters(search_index_name="products")))
idx.create_or_update_knowledge_source(AzureBlobKnowledgeSource(name="manuals-ks",
    azure_blob_parameters=AzureBlobKnowledgeSourceParameters(connection_string=BLOB_RESOURCE_ID,
        container_name="manuals", embedding_model=..., chat_completion_model=...)))   # auto pipeline
idx.create_or_update_knowledge_base(KnowledgeBase(name="support-kb",
    knowledge_sources=[KnowledgeSourceReference(name="products-ks"), KnowledgeSourceReference(name="manuals-ks")],
    models=[KnowledgeBaseAzureOpenAIModel(azure_open_ai_parameters=AzureOpenAIVectorizerParameters(
        resource_url=AOAI_ENDPOINT, deployment_name="gpt-5-mini", model_name="gpt-5-mini"))]))

kb = KnowledgeBaseRetrievalClient(endpoint=SEARCH_ENDPOINT, knowledge_base_name="support-kb", credential=cred)
result = kb.retrieve(KnowledgeBaseRetrievalRequest(messages=[KnowledgeBaseMessage(role="user",
    content=[KnowledgeBaseMessageTextContent(text="Which models support fast charging and how do I enable it?")])]))
grounding = result.response[0].content[0].text          # merged, cited content for the LLM
# Agent side: MCPTool(server_url=f"{SEARCH_ENDPOINT}/knowledgebases/support-kb/mcp?api-version=...",
#                     allowed_tools=["knowledge_base_retrieve"], project_connection_id=KB_CONNECTION)`,
      takeaway: 'Knowledge sources define content (indexed or remote), the knowledge base orchestrates agentic retrieval, and agents consume it through MCP while code calls retrieve directly.',
    },
    {
      title: 'The chunking and embedding-model mistake',
      description:
        'A team indexed whole 80-page PDFs as single documents with no chunking, then later switched the embedding model but only re-embedded new documents. Results were vague and ranking became erratic because vectors from two models were mixed. The fix introduced Text Split (or the Content Understanding skill for semantic chunks), index projections, a vectorizer matching the single embedding model, and a full indexer reset.',
      language: 'python',
      code: `from azure.search.documents.indexes import SearchIndexerClient
from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizableTextQuery

indexer_client = SearchIndexerClient(endpoint=SEARCH_ENDPOINT, credential=cred)
indexer_client.reset_indexer("contracts-indexer")       # reprocess every document after the schema/model change
indexer_client.run_indexer("contracts-indexer")

# Query after fix: chunk-level hybrid + semantic, vectorizer embeds the query with the SAME model
search = SearchClient(endpoint=SEARCH_ENDPOINT, index_name="contracts-chunks", credential=cred)
hits = search.search(search_text="termination notice period",
    vector_queries=[VectorizableTextQuery(text="termination notice period", k_nearest_neighbors=50,
                                          fields="content_vector")],
    query_type="semantic", semantic_configuration_name="default",
    query_caption="extractive", select=["title", "content", "parent_id"], top=5)
for h in hits:
    print(h["title"], h["@search.reranker_score"], h["@search.captions"][0].text)`,
      takeaway: 'Chunk before embedding, keep one embedding model per vector field (with a matching vectorizer), and reset the indexer after changing either.',
    },
  ],
  keyPoints: [
    'Ingest by push (SearchClient.upload_documents) or pull (data source + indexer + skillset + index); indexers crawl Blob, ADLS, OneLake, SQL, Cosmos DB, SharePoint and more with change tracking and imageAction for embedded images.',
    'Audio and video become searchable by indexing transcripts and segment metadata produced by Content Understanding, batch transcription or Video Indexer; images via OCR, image analysis, multimodal embeddings or GenAI Prompt verbalization.',
    'Index design for grounding: chunk content, HNSW vector field matching the embedding model, title and URL, page or timestamp metadata, security fields, semantic configuration, vectorizer and one-to-many index projections.',
    'Query modes: BM25 keyword, vector (HNSW or exhaustive, VectorizedQuery or VectorizableTextQuery), hybrid fused with RRF, semantic ranker (query_type semantic, captions, answers, query rewrite) and agentic retrieval through knowledge bases.',
    'Knowledge sources are indexed (search index, blob, OneLake, SharePoint, Azure SQL, file) or remote (web, MCP server, Fabric data agent, Fabric ontology, remote SharePoint, Work IQ); a knowledge base orchestrates subqueries, reranking, merging and citations with retrieval reasoning effort minimal, low or medium.',
    'Skills: Foundry-billed built-ins (OCR, Image Analysis, Entity Recognition, Key Phrases, PII, Sentiment, Translation, multimodal embeddings), your-resource built-ins (Azure OpenAI Embedding, Content Understanding, GenAI Prompt, Document Layout), custom Web API and AML skills, and utility skills such as Text Split.',
    'Integrated vectorization = chunking skill + embedding skill + index projections + matching vectorizer; use the enrichment cache and knowledge store projections; reset the indexer after schema or embedding model changes.',
    'Connect retrieval to agents through the Foundry IQ knowledge base MCP endpoint (knowledge_base_retrieve), the Azure AI Search tool with a query type, Toolboxes, or code in function tools and workflow steps; secure with managed identity, Search Index Data Reader and permission-aware sources.',
  ],
  flashcards: [
    { front: 'What are the four objects in an indexer-based (pull) pipeline?', back: 'Data source, indexer, skillset (optional) and index; knowledge sources in Foundry IQ generate all four automatically.' },
    { front: 'Which indexer setting extracts embedded images so OCR or image analysis skills can run?', back: 'imageAction (for example generateNormalizedImages) together with dataToExtract contentAndMetadata.' },
    { front: 'Which skill pairs let the indexer chunk and embed automatically (integrated vectorization)?', back: 'Text Split (or Azure Content Understanding / document parsing mode) for chunking plus Azure OpenAI Embedding for vectors, with index projections and a vectorizer on the index.' },
    { front: 'What does a vectorizer on the index enable?', back: 'Text-to-vector conversion at query time (VectorizableTextQuery) using the same embedding model as the content vectors.' },
    { front: 'Which query parameters turn on semantic ranking?', back: 'query_type="semantic" with semantic_configuration_name; optionally query_caption and query_answer.' },
    { front: 'Indexed vs remote knowledge sources?', back: 'Indexed sources are ingested into a search index on your service (blob, OneLake, SharePoint indexed, Azure SQL, file, existing index); remote sources are queried live at retrieval time (web, MCP server, Fabric data agent, Fabric ontology, remote SharePoint, Work IQ) and return no citation URLs.' },
    { front: 'What does retrieval reasoning effort control in a knowledge base?', back: 'Whether an LLM plans subqueries: minimal skips planning (GA, extractive), low and medium use the model for query planning (preview).' },
    { front: 'Which skill describes charts and figures inside documents during indexing?', back: 'The Azure Content Understanding skill (figure descriptions, semantic chunking) or the GenAI Prompt skill for image verbalization.' },
    { front: 'How does a Foundry prompt agent call a knowledge base?', back: 'Through an MCPTool pointing at the knowledge base MCP endpoint with allowed_tools=["knowledge_base_retrieve"] and a RemoteTool project connection.' },
    { front: 'What must you do after switching the embedding model used by an index?', back: 'Re-embed all content (reset and rerun the indexer) and update the vectorizer, because vectors from different models are not comparable.' },
    { front: 'Which role lets an application identity run queries against an index?', back: 'Search Index Data Reader (Search Index Data Contributor for writes).' },
  ],
  quiz: [
    {
      question:
        'A legal firm has 400,000 scanned PDFs (many handwritten annotations) in Blob Storage and wants chunk-level vector search with minimal code. Which configuration is MOST appropriate?',
      options: [
        'Push each PDF as a single document with SearchClient.upload_documents.',
        'A Blob indexer with imageAction generateNormalizedImages, an OCR (or Content Understanding) skill, Text Split, Azure OpenAI Embedding and index projections, plus a vectorizer on the index.',
        'A Foundry memory store per PDF.',
        'A GenAI Prompt skill that summarises each PDF into one field without chunking.',
      ],
      correct: [1],
      explanation:
        'Integrated vectorization with OCR handles scanned content and chunking inside the indexer. Pushing whole PDFs skips OCR and chunking, memory is for agent context, and a single summary loses retrievable detail.',
    },
    {
      question: 'Which TWO statements about semantic ranker are correct? (Select two)',
      options: [
        'It reranks the top results of a BM25 or RRF result set using Microsoft language models.',
        'It replaces the need for vector fields in the index.',
        'It can return extractive captions and answers in the response.',
        'It is free with unlimited usage on all tiers.',
      ],
      correct: [0, 2],
      explanation:
        'Semantic ranker is an L2 reranker that also returns captions and answers. It complements rather than replaces vectors and is a billed feature with a free monthly allowance.',
    },
    {
      question:
        'Several Foundry agents must answer questions across a SharePoint site and a OneLake lakehouse while honouring each user\'s permissions, and the retrieval should decompose complex questions into subqueries. What should you build?',
      options: [
        'One Azure AI Search index per agent with the file search tool.',
        'A Foundry IQ knowledge base with indexed SharePoint and OneLake knowledge sources, connected to the agents through its MCP endpoint.',
        'A Translator document translation job.',
        'A Content Safety block list.',
      ],
      correct: [1],
      explanation:
        'Knowledge bases provide agentic retrieval with permission sync across multiple knowledge sources and are shared by agents via MCP. The other options do not provide retrieval at all or are per agent.',
    },
    {
      question: 'Charts embedded in financial PDFs are never returned for questions about the numbers they show. Which skill addresses this during indexing?',
      options: [
        'Key Phrase Extraction skill.',
        'Azure Content Understanding skill with figure descriptions (or the GenAI Prompt skill to verbalize images).',
        'Language Detection skill.',
        'Text Split skill with a smaller page size.',
      ],
      correct: [1],
      explanation:
        'Figure descriptions or image verbalization convert chart content into searchable text. Key phrases, language detection and smaller chunks do not capture visual data.',
    },
    {
      question: 'A workflow step (not an agent) must fetch grounding passages with citations from a knowledge base before calling a model. What should the code use?',
      options: [
        'KnowledgeBaseRetrievalClient.retrieve with the conversation messages.',
        'The images/generations endpoint.',
        'SearchIndexerClient.run_indexer.',
        'The Content Safety text:analyze API.',
      ],
      correct: [0],
      explanation:
        'The knowledge base retrieval client returns merged grounding content, references and an activity log for direct use in code. The other APIs generate images, run indexers or moderate text.',
    },
  ],
  statements: [
    { text: 'Indexers can extract images embedded in PDFs and Office files for OCR and image analysis.', isTrue: true, explanation: 'Set imageAction on the indexer; up to 1,000 images per document are normalised and passed to skills.' },
    { text: 'Remote knowledge sources such as the web or an MCP server are ingested into a search index before query time.', isTrue: false, explanation: 'Remote sources are queried live through the platform\'s APIs and are never ingested; they return no citation URLs.' },
    { text: 'The Azure OpenAI Embedding skill requires the Azure OpenAI resource to be in the same region as the search service.', isTrue: false, explanation: 'This skill has no region requirement; the same-region rule applies to key-billed Foundry Tools skills such as OCR and is relaxed with keyless billing.' },
    { text: 'Hybrid queries can apply filters, facets and scoring profiles alongside the vector query.', isTrue: true, explanation: 'Vector fields coexist with text and numeric fields, so existing query features apply to hybrid requests.' },
    { text: 'Agentic retrieval is billed per query at a uniform cost like the classic pipeline.', isTrue: false, explanation: 'Agentic retrieval is token based: search tokens on Azure AI Search plus Azure OpenAI tokens for planning and synthesis.' },
    { text: 'Index projections let one source document produce many chunk-level search documents linked by a parent key.', isTrue: true, explanation: 'This one-to-many pattern underpins integrated vectorization.' },
    { text: 'The enrichment cache avoids re-running billable skills when only the index definition changes.', isTrue: true, explanation: 'Cached enrichment output is reused so only changed steps rerun, saving skill charges.' },
  ],
  resources: [
    { label: 'Agentic retrieval in Azure AI Search', url: 'https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview' },
    { label: 'What is a knowledge source?', url: 'https://learn.microsoft.com/en-us/azure/search/agentic-knowledge-source-overview' },
    { label: 'Integrated vector embedding in Azure AI Search', url: 'https://learn.microsoft.com/en-us/azure/search/vector-search-integrated-vectorization' },
    { label: 'Skills for extra processing during indexing', url: 'https://learn.microsoft.com/en-us/azure/search/cognitive-search-predefined-skills' },
  ],
};

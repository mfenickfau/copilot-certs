import type { Concept } from '../../types';

export const ragOptimizationHybridSearch: Concept = {
  id: 'rag-optimization-hybrid-search',
  title: 'Optimising RAG: Chunking, Embeddings, Hybrid Search and Retrieval Evaluation',
  summary:
    'The retrieval half of a generative AI system and how to tune it: chunk size and overlap, similarity thresholds and k, choosing and adapting embedding models, combining vector and keyword search with Reciprocal Rank Fusion and semantic ranking in Azure AI Search, and proving improvements with retrieval metrics and A/B comparisons.',
  certs: ['ai-300', 'ai-103', 'ai-500'],
  domains: ['ai-300-5', 'ai-103-5', 'ai-500-2'],
  outcomes: ['ai-300-5-1-1', 'ai-300-5-1-2', 'ai-300-5-1-3', 'ai-300-5-1-4', 'ai-103-5-1-2', 'ai-500-2-2-3'],
  tags: ['rag', 'chunking', 'embeddings', 'hybrid-search', 'rrf', 'semantic-ranker', 'azure-ai-search', 'retrieval-evaluation'],
  difficulty: 'advanced',
  diagram: 'rag-pipeline',
  sections: [
    {
      heading: 'Chunking and retrieval parameters',
      body: `Retrieval quality is decided before any model runs. Documents are **chunked** because embedding and chat models have input limits (for example 8,191 tokens for \`text-embedding-3-small\`) and because a chunk that covers one idea embeds more precisely than a page covering ten.

Tuning knobs and their trade-offs:

- **Chunk size**: Microsoft's starting point is about **512 tokens with 25 percent overlap** (roughly 2,000 characters, 128 tokens of overlap). Smaller chunks raise precision and lower cost per prompt but lose context; larger chunks preserve context but dilute the embedding and bloat the prompt. Pick one size that works for both your embedding model and your chat model.
- **Chunking strategy**: fixed size (Text Split skill \`pages\` mode with \`maximumPageLength\` and \`pageOverlapLength\`), sentence or paragraph boundaries, structure-aware splitting on headings (Markdown, HTML), or **semantic chunking** via Azure Content Understanding. Prepend the document title or section heading to each chunk so a middle-of-document chunk still carries its context.
- **k (top results)** and **similarity threshold**: retrieve enough candidates (k of 50 is recommended as input to the semantic ranker), then keep only the top few for the prompt. A minimum similarity score cuts irrelevant chunks on out-of-domain questions, which is the usual fix for "the model answers confidently from unrelated passages". Too high a threshold returns nothing on paraphrased questions.
- **Filters**: metadata filters (tenant, language, date) applied **pre-filter** or **post-filter** (\`vectorFilterMode\`); pre-filtering with **HNSW** may need \`oversampling\` so enough candidates survive the filter.
- **Index algorithm**: HNSW (approximate, fast) versus exhaustive KNN (exact, slower); test exhaustive on a sample to measure HNSW recall loss.

Every one of these changes the retrieved set, so each is a variant to measure, not a setting to guess.`,
    },
    {
      heading: 'Selecting and adapting embedding models',
      body: `An **embedding model** maps text to a vector; retrieval quality depends on how well distances in that space match human relevance for *your* domain. Selection criteria:

- **Domain and language coverage**: multilingual corpora need multilingual embeddings; code, legal or biomedical text benefits from models trained on similar material.
- **Dimensions and cost**: \`text-embedding-3-large\` scores higher on benchmarks than \`text-embedding-3-small\` but stores a larger vector; both support a \`dimensions\` parameter (Matryoshka truncation) so you can trade a little quality for a smaller index. Smaller vectors mean cheaper storage, faster queries and lower memory on the search service.
- **Consistency**: the **same model and dimensions** must embed documents and queries; changing the model means re-embedding the whole index, so version the embedding model like any dependency and plan a re-index rollout.
- **Evidence**: build a small labelled set of query-to-relevant-chunk pairs from your corpus and compare models on recall at k and NDCG before committing.

**Fine-tuning embeddings** is for domains where off-the-shelf models misjudge similarity (internal product codes, specialised jargon). It trains on pairs or triplets (query, positive chunk, hard negative) with contrastive loss so domain-relevant pairs move closer. Open embedding models (for example from the Foundry catalog or Hugging Face) can be fine-tuned and hosted on **managed compute** or Azure ML; Azure OpenAI embedding models are not fine-tunable, so the hosted alternative there is to improve chunking, add **metadata and hybrid search**, or use a **reranker**. Whatever path you take, the fine-tuned model becomes an index dependency: re-embed, re-evaluate, then switch.`,
    },
    {
      heading: 'Hybrid search: vectors plus keywords plus semantic ranking',
      body: `**Hybrid search** in Azure AI Search sends **one request** containing both a full-text query (\`search\`) and one or more \`vectorQueries\`, runs **BM25** keyword ranking and vector similarity (HNSW or exhaustive KNN) in parallel, and merges the two ranked lists with **Reciprocal Rank Fusion (RRF)**. Vector search finds conceptually similar text with no shared words; keyword search gives precision on exact terms (product codes, names, dates, acronyms) that embeddings blur. Benchmarks show hybrid plus **semantic ranker** gives the best relevance for grounding.

\`\`\`json
POST https://{service}.search.windows.net/indexes/policies/docs/search?api-version=2026-04-01
{
  "search": "return policy for opened electronics",
  "vectorQueries": [{ "kind": "text", "text": "return policy for opened electronics", "k": 50, "fields": "contentVector" }],
  "select": "title, chunk, sourcePage",
  "filter": "tenant eq 'contoso' and language eq 'en'",
  "vectorFilterMode": "preFilter",
  "queryType": "semantic",
  "semanticConfiguration": "policies-semantic",
  "top": 5
}
\`\`\`

Key points: \`kind: text\` uses an **integrated vectorizer** so the service embeds the query for you (otherwise send \`kind: vector\` with the embedding); multiple vector fields can be queried together, including multilingual ones; set **k to 50** when semantic ranking is on; do not add \`orderby\` because explicit sorting overrides relevance; **scoring profiles** can boost freshness or a field. The **semantic ranker** reranks the fused top 50 with a language model, returning \`@search.rerankerScore\` (0 to 4) that you can threshold more reliably than raw similarity, plus captions and answers. Integrated vectorization (indexer skillset with Text Split and an embedding skill) keeps chunking and embedding declarative inside the index pipeline; Foundry IQ and agentic retrieval build on the same index.`,
    },
    {
      heading: 'Evaluating and improving RAG with metrics and A/B tests',
      body: `Separate **process evaluation** (did we retrieve the right chunks?) from **system evaluation** (was the final answer good?), because fixes differ.

Retrieval metrics:

- **Document Retrieval evaluator** (needs labelled relevance judgments, qrels): **NDCG**, **XDCG**, **fidelity**, **max relevance** and **holes** (retrieved items without a label). Use it to tune k, chunk size, hybrid versus vector-only and ranker settings, because it is deterministic and cheap.
- **Retrieval evaluator** (LLM judge, no labels): scores how relevant the retrieved context is to the query on a 1 to 5 scale.
- **Groundedness**, **Relevance** and **Response Completeness** then measure the generated answer.

**A/B testing a RAG change** means holding everything else constant: same question set, same chat model and prompt, same evaluators and judge. Run variant A (current index settings) and variant B (new chunking or hybrid query) as two evaluation runs, compare retrieval metrics first, then answer metrics, then token usage and latency (larger chunks and higher k cost tokens on every request). In production, an online A/B test routes a share of traffic to the new retrieval configuration behind a flag and compares continuous evaluation scores and user feedback (thumbs up or down, deflection rate) over the same period; keep the sample large enough and the period long enough to be meaningful.

Diagnosis map for the exam: low retrieval scores with good groundedness means the index or query is the problem (chunking, hybrid, filters, embedding model); good retrieval but low groundedness means the prompt or model is ignoring context; high relevance but low completeness means k or chunk size is too small; confident wrong answers on off-topic questions mean a missing similarity or reranker threshold and a "say you do not know" instruction.`,
    },
  ],
  examples: [
    {
      title: 'Integrated vectorization with tuned chunking',
      description:
        'A support knowledge base is indexed with an indexer skillset. The Text Split skill produces 512-token pages with 128-token overlap and the embedding skill vectorises each chunk with text-embedding-3-large at 1024 dimensions to halve index size. Titles are mapped onto every chunk so context survives splitting.',
      language: 'json',
      code: `{
  "skills": [
    { "@odata.type": "#Microsoft.Skills.Text.SplitSkill", "textSplitMode": "pages", "unit": "azureOpenAITokens",
      "maximumPageLength": 512, "pageOverlapLength": 128,
      "inputs": [{ "name": "text", "source": "/document/content" }], "outputs": [{ "name": "textItems", "targetName": "pages" }] },
    { "@odata.type": "#Microsoft.Skills.Text.AzureOpenAIEmbeddingSkill", "context": "/document/pages/*",
      "resourceUri": "https://fdry-prod.openai.azure.com", "deploymentId": "text-embedding-3-large", "modelName": "text-embedding-3-large", "dimensions": 1024,
      "inputs": [{ "name": "text", "source": "/document/pages/*" }], "outputs": [{ "name": "embedding", "targetName": "contentVector" }] }
  ],
  "indexProjections": { "selectors": [{ "targetIndexName": "policies", "parentKeyFieldName": "parentId", "sourceContext": "/document/pages/*",
    "mappings": [{ "name": "chunk", "source": "/document/pages/*" }, { "name": "contentVector", "source": "/document/pages/*/contentVector" }, { "name": "title", "source": "/document/title" }] }] }
}`,
      takeaway: 'Make chunk size, overlap, embedding model and dimensions explicit index settings so they are versioned and testable.',
    },
    {
      title: 'A/B comparison of vector-only versus hybrid with semantic ranker',
      description:
        'The team labels 150 questions with the chunk IDs that answer them. They run the same questions against the index with vector-only, hybrid, and hybrid plus semantic ranker, and evaluate with the Document Retrieval evaluator. Hybrid plus ranker lifts NDCG from 0.61 to 0.78 and removes most product-code misses; token cost is unchanged because top 5 is kept constant.',
      language: 'python',
      code: `import json
rows = []
for q in questions:                                      # same set for every variant
    for variant, params in {"vector": vector_only, "hybrid": hybrid, "hybrid_semantic": hybrid_semantic}.items():
        hits = search(q.text, **params, top=5)
        rows.append({"variant": variant, "query": q.text,
                     "retrieved_documents": [{"document_id": h["id"], "relevance_score": h.get("@search.rerankerScore", h["@search.score"])} for h in hits],
                     "retrieval_ground_truth": [{"document_id": d, "query_relevance_label": 3} for d in q.relevant_ids]})
for variant in ("vector", "hybrid", "hybrid_semantic"):
    with open(f"out/{variant}.jsonl", "w") as f:
        for r in rows:
            if r["variant"] == variant: f.write(json.dumps(r) + "\\n")
# then one evaluation run per file with evaluator_name builtin.document_retrieval (no judge model required)`,
      takeaway: 'Label a small question set once and you can compare retrieval configurations deterministically and cheaply.',
    },
    {
      title: 'Bigger chunks made answers worse (a realistic mistake and the fix)',
      description:
        'To "give the model more context" an engineer raised chunk size from 512 to 4,000 tokens and k from 5 to 10. Groundedness dropped, latency doubled and cost tripled: each prompt carried 40,000 tokens of mostly irrelevant text and the model latched onto wrong passages. The fix reverted to 512-token chunks with overlap, kept k at 50 for the ranker but passed only the top 4 reranked chunks with rerankerScore above 1.5, and added "answer only from the provided passages" to the prompt. Both retrieval and groundedness metrics recovered, verified by the same evaluation run.',
      language: 'text',
      code: `Variant        chunk  k->prompt  rerank threshold  NDCG   groundedness pass  avg prompt tokens  p50 latency
A (baseline)   512    50->5      none              0.74   0.88               3,100              1.9 s
B (big chunks) 4000   10->10     none              0.70   0.71               41,000             4.2 s
C (fixed)      512    50->4      >= 1.5            0.77   0.93               2,600              1.7 s`,
      takeaway: 'More context is not better context; measure retrieval and answer quality together with tokens and latency before changing chunking.',
    },
  ],
  keyPoints: [
    'Start chunking at about 512 tokens with 25 percent overlap; smaller chunks increase precision and reduce prompt tokens, larger chunks preserve context; carry titles or headings into each chunk.',
    'Tune k (retrieve about 50 for the semantic ranker, pass only a few to the prompt), similarity or reranker thresholds for out-of-domain questions, and pre- or post-filtering with oversampling for HNSW.',
    'Choose embedding models by domain, language, dimensions and cost; documents and queries must use the same model and dimensions, and changing models means re-embedding the index.',
    'Fine-tune open embedding models with contrastive pairs when domain similarity is poor and host them on managed compute; Azure OpenAI embeddings cannot be fine-tuned, so improve chunking, hybrid search and reranking instead.',
    'Hybrid search = one request with search plus vectorQueries, BM25 and vector results fused with Reciprocal Rank Fusion; keyword precision for codes and names, vector recall for meaning.',
    'Semantic ranker reranks the fused top 50 with a language model and returns a rerankerScore (0 to 4) that is a more reliable threshold than raw similarity; avoid orderby in hybrid queries.',
    'Evaluate retrieval separately (Document Retrieval with NDCG/XDCG/fidelity/holes using labels, or the Retrieval LLM judge) from answers (groundedness, relevance, completeness).',
    'A/B test one retrieval change at a time on the same question set, model, prompt and evaluators; compare quality, tokens and latency, then confirm online with continuous evaluation and user feedback.',
  ],
  flashcards: [
    { front: 'What chunk size and overlap does Microsoft recommend as a starting point?', back: 'About 512 tokens (roughly 2,000 characters) with 25 percent overlap (128 tokens).' },
    { front: 'Why set k to 50 when using the semantic ranker?', back: 'The ranker reranks up to 50 candidates; a larger fused candidate set gives it more to work with before you keep the top few.' },
    { front: 'Which Text Split skill parameters control fixed-size chunking?', back: 'textSplitMode (pages or sentences), maximumPageLength and pageOverlapLength (overlap must be less than half the page length).' },
    { front: 'What algorithm merges keyword and vector results in Azure AI Search hybrid queries?', back: 'Reciprocal Rank Fusion (RRF).' },
    { front: 'Which ranking function does full-text search use in Azure AI Search?', back: 'BM25.' },
    { front: 'What does the semantic ranker return that you can threshold?', back: '@search.rerankerScore, a 0 to 4 relevance score (plus optional captions and answers).' },
    { front: 'What must stay identical between indexing and querying for vector search to work?', back: 'The embedding model and its dimensions.' },
    { front: 'Which evaluator measures retrieval quality without labels, and which needs labels?', back: 'Retrieval (LLM judge) needs no labels; Document Retrieval needs relevance labels (qrels) and reports NDCG, XDCG, fidelity, max relevance and holes.' },
    { front: 'Can Azure OpenAI embedding models be fine-tuned?', back: 'No. Fine-tune open embedding models on managed compute instead, or improve chunking, hybrid search and reranking.' },
    { front: 'Why should a hybrid query avoid orderby?', back: 'An explicit sort order overrides the relevance ranking produced by RRF and the semantic ranker.' },
    { front: 'Low retrieval scores but high groundedness points to which layer?', back: 'The index or query (chunking, hybrid configuration, filters, embedding model), not the prompt or model.' },
  ],
  quiz: [
    {
      question:
        'Users searching for part numbers such as "XR-4471B" get irrelevant results from a vector-only RAG index. Which change most directly fixes this?',
      options: [
        'Increase chunk size to 2,000 tokens',
        'Switch to hybrid search so BM25 keyword matching is fused with the vector results',
        'Raise k from 5 to 50 and pass all 50 chunks to the model',
        'Change the chat model to a larger one',
      ],
      correct: [1],
      explanation:
        'Exact identifiers are where keyword search beats embeddings; hybrid search adds that precision. Bigger chunks and more chunks add noise and cost, and the chat model cannot fix bad retrieval.',
    },
    {
      question:
        'An assistant answers confidently from unrelated passages when users ask about topics not in the knowledge base. Which TWO changes address this? (Select two)',
      options: [
        'Apply a minimum reranker or similarity score threshold before adding chunks to the prompt',
        'Instruct the model to answer only from provided passages and say when the answer is not present',
        'Disable the semantic ranker to reduce latency',
        'Increase pageOverlapLength to 50 percent',
      ],
      correct: [0, 1],
      explanation:
        'A relevance threshold removes weak chunks and the instruction stops the model from improvising. Disabling the ranker removes the best threshold signal, and more overlap does not filter irrelevant content.',
    },
    {
      question:
        'You want to compare two chunking strategies objectively and cheaply before changing the production index. You have 150 questions labelled with the chunk IDs that answer them. Which evaluator should you use?',
      options: [
        'Fluency',
        'Document Retrieval, comparing NDCG and holes across the two variants',
        'Coherence',
        'Protected Material',
      ],
      correct: [1],
      explanation:
        'Document Retrieval uses the labels to compute deterministic retrieval metrics without a judge model. Fluency and coherence judge answer text, and Protected Material is a safety evaluator.',
    },
    {
      question:
        'A team switches the embedding deployment from text-embedding-3-small to text-embedding-3-large for queries only, keeping the existing index. Retrieval quality collapses. Why?',
      options: [
        'The semantic ranker requires text-embedding-3-small',
        'Documents and queries must be embedded with the same model and dimensions; the index must be re-embedded',
        'Hybrid search is incompatible with large embedding models',
        'The index needs a new BM25 configuration',
      ],
      correct: [1],
      explanation:
        'Vectors from different models live in different spaces, so distances are meaningless. Changing the embedding model requires re-indexing. The other options are unrelated.',
    },
    {
      question:
        'A RAG change improved offline groundedness by 4 points. Before promoting it, what is the most appropriate validation step?',
      options: [
        'Deploy to all users immediately because offline metrics improved',
        'Route a share of production traffic to the new configuration behind a flag and compare continuous evaluation scores, token usage and user feedback with the baseline over the same period',
        'Ask the product owner to try five questions in the playground',
        'Increase chunk size further to maximise the gain',
      ],
      correct: [1],
      explanation:
        'An online A/B test confirms offline gains hold on real traffic and surfaces cost and latency effects. Immediate rollout and anecdotal checks skip that evidence, and changing chunk size again confounds the result.',
    },
  ],
  statements: [
    { text: 'Hybrid search in Azure AI Search runs keyword and vector queries in parallel within a single request and merges results with RRF.', isTrue: true, explanation: 'That is the definition of a hybrid query.' },
    { text: 'Larger chunks always improve answer quality because the model receives more context.', isTrue: false, explanation: 'Oversized chunks dilute embeddings, add irrelevant text and raise cost and latency.' },
    { text: 'The semantic ranker reranks results after RRF fusion and returns a rerankerScore between 0 and 4.', isTrue: true, explanation: 'It is an optional reranking stage over the fused top candidates.' },
    { text: 'You can change the embedding model for queries without re-embedding the indexed documents.', isTrue: false, explanation: 'Documents and queries must share the embedding model and dimensions.' },
    { text: 'The Document Retrieval evaluator requires a judge model deployment.', isTrue: false, explanation: 'It is deterministic and needs relevance labels, not a judge model.' },
    { text: 'Pre-filtering with HNSW may need oversampling so enough candidates remain after the filter.', isTrue: true, explanation: 'Filters shrink the candidate set, so oversampling maintains recall.' },
  ],
  resources: [
    { label: 'Chunk large documents for RAG and vector search in Azure AI Search', url: 'https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents' },
    { label: 'Hybrid search using vectors and full-text search in Azure AI Search', url: 'https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview' },
    { label: 'Generate embeddings with Azure OpenAI', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/embeddings' },
    { label: 'Retrieval-Augmented Generation (RAG) evaluators', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/evaluation-evaluators/rag-evaluators' },
  ],
};

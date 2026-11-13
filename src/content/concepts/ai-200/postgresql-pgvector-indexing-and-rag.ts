import type { Concept } from '../../types';

export const postgresqlPgvectorIndexingAndRag: Concept = {
  id: 'postgresql-pgvector-indexing-and-rag',
  title: 'pgvector on Azure PostgreSQL: Vector Indexes, Sizing and RAG with Metadata Filters',
  summary:
    'Run vector similarity search in Azure Database for PostgreSQL with pgvector and DiskANN: choose between exact scans, IVFFlat, HNSW and pg_diskann indexes, tune their parameters and the server memory that index builds need, size compute and storage for vector workloads, and implement filtered RAG retrieval with the azure_ai extension or client-side embeddings.',
  certs: ['ai-200'],
  domains: ['ai-200-2'],
  outcomes: ['ai-200-2-2-3', 'ai-200-2-2-4', 'ai-200-2-2-5'],
  tags: ['postgresql', 'pgvector', 'hnsw', 'ivfflat', 'diskann', 'rag', 'embeddings', 'azure_ai'],
  difficulty: 'advanced',
  diagram: 'rag-pipeline',
  sections: [
    {
      heading: 'Vectors, operators and exact search',
      body: `pgvector adds the \`vector(n)\` column type and three distance operators: \`<->\` (Euclidean/L2), \`<=>\` (cosine distance) and \`<#>\` (negative inner product). A similarity query is simply \`SELECT id, content FROM chunks ORDER BY embedding <=> $1 LIMIT 5\`. With no vector index PostgreSQL performs an **exact** (brute-force) scan: 100 percent recall, but cost grows linearly with rows. Below a few hundred thousand rows, exact search inside a tight metadata filter is often fast enough, and \`max_parallel_workers_per_gather\` lets the planner use parallel sequential scans.

Match the **distance operator to the model**: Azure OpenAI embeddings are normalised, so cosine (\`<=>\`) and inner product give the same ranking; pick one and build the index with the matching operator class (\`vector_cosine_ops\`, \`vector_l2_ops\`, \`vector_ip_ops\`). An index built for L2 is ignored by a cosine query.

Generating embeddings can happen in the application (call Azure OpenAI, insert the vector) or **inside the database** with the \`azure_ai\` extension: \`azure_ai.set_setting('azure_openai.endpoint', ...)\`, \`azure_ai.set_setting('azure_openai.subscription_key', ...)\`, then \`azure_openai.create_embeddings('text-embedding-3-small', content)\` returns a vector you can store directly, including batch and retry parameters. Both \`azure_ai\` and \`vector\` must be allow-listed in \`azure.extensions\` and created per database. The in-database route keeps the pipeline in SQL (\`UPDATE chunks SET embedding = azure_openai.create_embeddings(...) WHERE embedding IS NULL\`), which is convenient for backfills; the application route gives you control over batching, cost and failure handling.`,
    },
    {
      heading: 'Approximate indexes: IVFFlat, HNSW and DiskANN',
      body: `Approximate nearest neighbour (ANN) indexes trade a little recall for large speed-ups. pgvector's indexes support up to **2,000 dimensions** (\`halfvec\` extends that); pg_diskann v0.6+ supports up to 16,000.

**IVFFlat** clusters vectors into \`lists\` with k-means and searches the \`probes\` nearest lists. Fast to build and memory-light, but it needs data present at build time (a training step) and has the weakest speed/recall curve. Starting points: \`lists = rows/1000\` (up to 1M rows) or \`sqrt(rows)\` beyond; \`probes = lists/10\` or \`sqrt(lists)\`. \`SET ivfflat.probes = 10\` per session or \`SET LOCAL\` per transaction; probes equal to lists is an exact search.

**HNSW** builds a multi-layer graph: slower, memory-hungry builds but the best query speed/recall trade-off and no training step (works on an empty table). Build parameters \`m\` (edges per node, default 16) and \`ef_construction\` (candidate list during build, default 64); query parameter \`hnsw.ef_search\` (default 40; raise for recall). Build time is dominated by **\`maintenance_work_mem\`**: if the graph does not fit, the build spills and slows drastically, so raise it (and \`max_parallel_maintenance_workers\`) for the duration of \`CREATE INDEX\`.

**DiskANN** (\`CREATE EXTENSION pg_diskann CASCADE; CREATE INDEX ... USING diskann (embedding vector_cosine_ops)\`) is Microsoft's graph index designed for SSD-resident data: high recall and QPS at very large scale, fast builds, and **product quantization** (PQ, preview) to shrink memory for more than a million rows. Query-time knobs are \`diskann.l_value_is\` (search list size) and, with PQ, a two-step pattern: fetch the top 50 approximate candidates then re-rank by exact distance on the full vectors.

Reducing pgvector compute overhead comes down to: filter first so fewer distances are computed, use an ANN index sized for the data, use \`halfvec\` or PQ to cut memory, keep \`LIMIT\` small, and avoid computing the distance twice by selecting it once with an alias.`,
    },
    {
      heading: 'Sizing compute, memory and storage',
      body: `Vector workloads are **memory-bound**: queries are fast when the index (and the hot part of the table) fits in \`shared_buffers\` plus the OS cache, and slow once they page from disk. Flexible server offers three tiers: **Burstable** (credit-based, not for production vector search), **General Purpose** (about 4 GiB per vCore) and **Memory Optimized** (about 6.75 to 9.5 GiB per vCore). For HNSW over millions of 1536-dimension vectors, Memory Optimized is the usual choice; estimate roughly \`rows * dimensions * 4 bytes\` for float32 vectors plus index overhead, and keep that under the memory you can give the page cache. Compute can be scaled up or down in seconds (brief restart), so size for the index build, then right-size for steady state.

Storage decouples from compute. **Premium SSD** has fixed size/IOPS steps; **Premium SSD v2** lets you set capacity, IOPS and throughput independently (1 GiB increments, up to 64 TiB) and is generally cheaper for high-IOPS patterns such as index builds and bulk embedding loads. Storage can grow (optionally with **autogrow**) but cannot be shrunk. The service includes baseline throughput (125 MB/s up to 399 GiB, 500 MB/s above 400 GiB) at no extra cost.

Operational tips: build large indexes with \`maintenance_work_mem\` raised to several GB, in a maintenance window, and \`CREATE INDEX CONCURRENTLY\` on busy tables; monitor cache hit ratio and read IOPS, since rising IOPS with flat QPS means the index no longer fits in memory; use **read replicas** to separate retrieval traffic from ingestion; and keep embedding dimensions as low as the model allows (text-embedding-3 models accept a \`dimensions\` parameter) because every dimension costs memory and compute in every comparison.`,
    },
    {
      heading: 'RAG retrieval with metadata filters, and the exam angle',
      body: `A production RAG query is rarely "nearest five vectors in the table". It is "nearest five vectors **among the chunks this user may see, in this language, from documents updated this year**". In SQL that is a WHERE clause on typed columns or JSONB plus an ORDER BY on distance:

\`SELECT c.id, c.content, d.source_url, c.embedding <=> $1 AS distance FROM chunks c JOIN documents d ON d.id = c.document_id WHERE c.tenant_id = $2 AND c.metadata @> '{"lang":"en"}' AND d.deleted = false ORDER BY c.embedding <=> $1 LIMIT 5\`

Filter interaction is the subtle part. HNSW and IVFFlat compute the top candidates **before** applying the filter (post-filtering), so a selective filter can leave fewer than \`LIMIT\` results; raise \`hnsw.ef_search\` or \`ivfflat.probes\`, or add **partial indexes** per tenant or category so the index itself only contains matching rows. pgvector 0.8+ added iterative scans (\`hnsw.iterative_scan\`) that keep searching until the limit is met, and DiskANN supports filtered search natively. Hybrid retrieval combines vector distance with full-text rank (\`ts_rank\`) or BM25-style scoring, then re-ranks in the application.

Exam-style cues:
- *"Lowest latency at tens of millions of rows."* **DiskANN** (or HNSW on Memory Optimized compute).
- *"Index creation extremely slow."* Raise **maintenance_work_mem** (and parallel maintenance workers).
- *"Recall dropped after adding a WHERE filter."* Post-filtering; increase ef_search/probes or use partial indexes.
- *"Embed inside the database."* **azure_ai** extension, \`azure_openai.create_embeddings\`.
- *"Index refused: more than 2000 dimensions."* Use \`halfvec\`, reduce model dimensions, or pg_diskann.
- *"Which compute tier for vector search in production?"* Memory Optimized (never Burstable).
- *"Cheapest storage that lets you dial IOPS up for a bulk load."* **Premium SSD v2**.`,
    },
  ],
  examples: [
    {
      title: 'Build an HNSW index without spilling, then query with a filter',
      description:
        'A team loads 3 million chunks with 1536-dimension embeddings. They raise maintenance memory for the build, create a cosine HNSW index, and run a tenant-scoped retrieval with a wider search list to compensate for post-filtering.',
      language: 'text',
      code: `-- session-level for the build only (server must have the RAM)
SET maintenance_work_mem = '8GB';
SET max_parallel_maintenance_workers = 4;
CREATE INDEX CONCURRENTLY chunks_embedding_hnsw
  ON chunks USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 128);

-- retrieval: filter + ANN, widen the candidate list for recall
SET LOCAL hnsw.ef_search = 100;
SELECT id, content, metadata->>'source' AS source,
       embedding <=> $1 AS distance
FROM chunks
WHERE tenant_id = $2 AND metadata @> '{"lang":"en"}'
ORDER BY embedding <=> $1
LIMIT 5;`,
      takeaway: 'Index operator class must match the query operator, maintenance_work_mem governs build time, and ef_search is your recall dial when filters shrink the candidate set.',
    },
    {
      title: 'In-database embeddings with azure_ai and a DiskANN index',
      description:
        'For a backfill the team lets PostgreSQL call Azure OpenAI directly, then indexes with pg_diskann for a dataset that will grow past 10 million rows.',
      language: 'text',
      code: `CREATE EXTENSION IF NOT EXISTS azure_ai;
CREATE EXTENSION IF NOT EXISTS pg_diskann CASCADE;   -- also creates vector

SELECT azure_ai.set_setting('azure_openai.endpoint', 'https://contoso-oai.openai.azure.com');
SELECT azure_ai.set_setting('azure_openai.subscription_key', '<key from Key Vault>');

UPDATE chunks
SET embedding = azure_openai.create_embeddings('text-embedding-3-small', content,
                                               max_attempts => 3, retry_delay_ms => 2000)
WHERE embedding IS NULL;

CREATE INDEX chunks_embedding_diskann
  ON chunks USING diskann (embedding vector_cosine_ops);

SELECT id, content FROM chunks
WHERE tenant_id = $1
ORDER BY embedding <=> azure_openai.create_embeddings('text-embedding-3-small', $2)::vector
LIMIT 5;`,
      takeaway: 'azure_ai keeps embedding generation in SQL; pg_diskann gives a scalable ANN index with built-in filter support.',
    },
    {
      title: 'The IVFFlat index that returned garbage (a realistic mistake)',
      description:
        'A developer creates an IVFFlat index on an empty chunks table during schema migration, then loads two million rows. Queries are fast but recall is terrible: the k-means centroids were trained on no data, so the lists are meaningless. IVFFlat must be built after the data is loaded (and rebuilt when the distribution changes), whereas HNSW and DiskANN can be created up front. The fix was REINDEX after the load, and ultimately a switch to HNSW with lists/probes tuning no longer needed.',
      language: 'text',
      code: `-- wrong order: index trained on an empty table
CREATE INDEX chunks_ivf ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 1000);
COPY chunks FROM '/data/chunks.csv' CSV;         -- 2M rows arrive afterwards

-- fix: rebuild after load so centroids reflect the data
REINDEX INDEX chunks_ivf;
SET ivfflat.probes = 32;                        -- ~sqrt(lists) for >1M rows

-- or avoid the training dependency entirely
DROP INDEX chunks_ivf;
CREATE INDEX chunks_hnsw ON chunks USING hnsw (embedding vector_cosine_ops);`,
      takeaway: 'IVFFlat has a training step and must be built on representative data; HNSW and DiskANN do not.',
    },
  ],
  keyPoints: [
    'Operators: <-> L2, <=> cosine, <#> negative inner product; the index operator class (vector_cosine_ops etc.) must match the query operator.',
    'No index means exact search with perfect recall; IVFFlat, HNSW and DiskANN are approximate indexes that trade recall for speed.',
    'IVFFlat: lists and probes, needs data at build time; HNSW: m, ef_construction and hnsw.ef_search, no training, memory-heavy build; DiskANN: pg_diskann, scales to very large sets, PQ for memory.',
    'Raise maintenance_work_mem (and max_parallel_maintenance_workers) before building large vector indexes; pgvector indexes cap at 2,000 dimensions.',
    'Vector search is memory-bound: Memory Optimized compute for production, never Burstable; estimate rows x dims x 4 bytes plus index overhead.',
    'Premium SSD v2 lets you set IOPS and throughput independently; storage can grow (autogrow) but not shrink.',
    'RAG retrieval filters on tenant, permissions and metadata in WHERE and orders by distance with a small LIMIT; post-filtering can starve results, so raise ef_search/probes or use partial indexes.',
    'The azure_ai extension (azure_openai.create_embeddings) generates embeddings inside SQL after set_setting for endpoint and key.',
  ],
  flashcards: [
    { front: 'Which pgvector operator computes cosine distance?', back: '<=> (L2 is <->, negative inner product is <#>).' },
    { front: 'Which operator class do you use when creating an index for cosine queries?', back: 'vector_cosine_ops.' },
    { front: 'Which vector index type requires data to be present when it is built?', back: 'IVFFlat (k-means training step); HNSW and DiskANN can be built on an empty table.' },
    { front: 'Which parameters tune HNSW at build time and query time?', back: 'Build: m and ef_construction; query: hnsw.ef_search.' },
    { front: 'Which parameter tunes IVFFlat at query time and what happens when it equals lists?', back: 'ivfflat.probes; when probes = lists the search is exact and the index is not used.' },
    { front: 'Which server setting most affects HNSW index build time?', back: 'maintenance_work_mem (plus max_parallel_maintenance_workers).' },
    { front: 'Maximum dimensions for pgvector HNSW/IVFFlat indexes?', back: '2,000 (halfvec and pg_diskann v0.6+ allow more; DiskANN up to 16,000).' },
    { front: 'Which extension provides the DiskANN index and how is it created?', back: 'pg_diskann; CREATE EXTENSION pg_diskann CASCADE; CREATE INDEX ... USING diskann (embedding vector_cosine_ops).' },
    { front: 'Which compute tier suits production vector search?', back: 'Memory Optimized (high memory per vCore); Burstable is not recommended for production.' },
    { front: 'Which storage type lets you adjust IOPS and throughput independently of capacity?', back: 'Premium SSD v2.' },
    { front: 'Which SQL function from azure_ai creates embeddings with Azure OpenAI?', back: 'azure_openai.create_embeddings(deployment_name, input, ...).' },
    { front: 'Why can a WHERE filter reduce the number of results from an HNSW query below LIMIT?', back: 'The index returns top candidates before the filter is applied (post-filtering); raise ef_search or use partial indexes.' },
  ],
  quiz: [
    {
      question:
        'Creating an HNSW index on 5 million 1536-dimension embeddings in Azure Database for PostgreSQL has been running for hours. Which change is MOST likely to speed up the build?',
      options: [
        'Increase maintenance_work_mem so the graph fits in memory during the build',
        'Switch the index to vector_l2_ops',
        'Enable PgBouncer on the server',
        'Lower hnsw.ef_search to 10',
      ],
      correct: [0],
      explanation:
        'HNSW builds slow dramatically when the graph spills beyond maintenance_work_mem. The operator class changes semantics not speed, PgBouncer affects connections, and ef_search is a query-time parameter.',
    },
    {
      question:
        'A RAG query filters chunks by tenant_id and returns only two rows even though LIMIT 5 is specified and many matching rows exist. The table has an HNSW index. What is the cause and fix?',
      options: [
        'The index returns candidates before the filter is applied; increase hnsw.ef_search or create a partial index per tenant',
        'The vector column has the wrong dimension; recreate it as vector(2000)',
        'PgBouncer is in transaction mode; switch to session mode',
        'The query uses <=> but the model needs <#>; change the operator',
      ],
      correct: [0],
      explanation:
        'Post-filtering after an approximate search can starve results. Dimension mismatches error out rather than reduce rows, pooling mode does not affect results, and the operator choice would change ranking, not row count.',
    },
    {
      question:
        'You must pick a compute tier and storage for a production semantic search service holding tens of millions of vectors with strict latency targets and periodic bulk re-embedding. Which TWO choices are appropriate? (Select two)',
      options: [
        'Memory Optimized compute so the index stays in memory',
        'Burstable compute to minimise cost',
        'Premium SSD v2 storage so IOPS can be raised during bulk loads',
        'A Basic Azure Container Registry to store the embeddings',
      ],
      correct: [0, 2],
      explanation:
        'Vector search is memory-bound and benefits from independent IOPS scaling. Burstable throttles under sustained load, and a container registry is not a datastore.',
    },
    {
      question:
        'A developer wants to generate embeddings for existing rows without writing application code, using Azure OpenAI from within PostgreSQL. Which approach is correct?',
      options: [
        'Enable the azure_ai extension, set the azure_openai endpoint and key, and call azure_openai.create_embeddings in an UPDATE',
        'Enable pg_diskann and call diskann.embed on each row',
        'Create an HNSW index; it generates embeddings automatically',
        'Use the Cosmos DB change feed to populate the column',
      ],
      correct: [0],
      explanation:
        'azure_ai exposes Azure OpenAI embedding calls as SQL functions. pg_diskann only indexes existing vectors, indexes never create data, and the Cosmos DB change feed is unrelated to PostgreSQL.',
    },
    {
      question:
        'CREATE INDEX fails with "column cannot have more than 2000 dimensions for hnsw index" on a vector(3072) column. Which option allows indexing without changing the embedding model deployment?',
      options: [
        'Store the embeddings as halfvec(3072) and index that, or use pg_diskann which supports higher dimensions',
        'Increase maintenance_work_mem',
        'Switch to IVFFlat, which has no dimension limit',
        'Enable PgBouncer',
      ],
      correct: [0],
      explanation:
        'pgvector\'s HNSW and IVFFlat both cap at 2,000 dimensions; halfvec or DiskANN lift that. Memory and pooling settings do not change the limit.',
    },
  ],
  statements: [
    { text: 'Without a vector index, pgvector performs an exact search with 100 percent recall.', isTrue: true, explanation: 'Brute-force distance computation over all rows is exact but scales linearly.' },
    { text: 'An HNSW index can be created on an empty table and populated as rows arrive.', isTrue: true, explanation: 'HNSW has no training step, unlike IVFFlat.' },
    { text: 'Setting ivfflat.probes equal to the number of lists makes the search approximate but faster.', isTrue: false, explanation: 'Probes equal to lists is an exact search over all lists; the planner stops using the index.' },
    { text: 'The Burstable compute tier is recommended for production vector search workloads.', isTrue: false, explanation: 'Burstable uses CPU credits and degrades under sustained load; use General Purpose or Memory Optimized.' },
    { text: 'Premium SSD v2 allows capacity, IOPS and throughput to be tuned independently.', isTrue: true, explanation: 'That flexibility is its main advantage over Premium SSD.' },
    { text: 'Storage on Azure Database for PostgreSQL flexible server can be shrunk after it has been increased.', isTrue: false, explanation: 'Storage can only grow.' },
    { text: 'The pg_diskann extension depends on the vector extension and can be installed with CASCADE.', isTrue: true, explanation: 'CREATE EXTENSION pg_diskann CASCADE creates vector automatically.' },
    { text: 'The azure_ai extension must be allow-listed in azure.extensions before it can be created.', isTrue: true, explanation: 'Like all extensions on flexible server, it must be allow-listed first.' },
  ],
  resources: [
    { label: 'Optimize performance when using pgvector', url: 'https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/how-to-optimize-performance-pgvector' },
    { label: 'Enable and use DiskANN (pg_diskann) in Azure Database for PostgreSQL', url: 'https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/how-to-use-pgdiskann' },
    { label: 'Compute options in Azure Database for PostgreSQL flexible server', url: 'https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-compute' },
    { label: 'Generate embeddings with Azure OpenAI from the azure_ai extension', url: 'https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/generative-ai-azure-openai' },
  ],
};

import type { Concept } from '../../types';

export const cosmosDbVectorSearchAndChangeFeed: Concept = {
  id: 'cosmos-db-vector-search-and-change-feed',
  title: 'Azure Cosmos DB: Vector Search for RAG and the Change Feed',
  summary:
    'Turn Cosmos DB for NoSQL into a vector store: enable vector search, define a vector embedding policy and a vector index (flat, quantizedFlat or DiskANN), query with VectorDistance, then keep embeddings and downstream systems in sync by processing inserts and updates through the change feed processor or pull model.',
  certs: ['ai-200'],
  domains: ['ai-200-2'],
  outcomes: ['ai-200-2-1-3', 'ai-200-2-1-4'],
  tags: ['cosmos-db', 'vector-search', 'diskann', 'embeddings', 'rag', 'change-feed'],
  difficulty: 'advanced',
  diagram: 'rag-pipeline',
  sections: [
    {
      heading: 'Setting up a container for vectors',
      body: `Vector search in Cosmos DB for NoSQL stores embeddings **inside the JSON item** next to the data they describe, so one query can filter on metadata, apply the partition key and rank by similarity. Setup has three parts, and all of them are container-creation-time decisions (you cannot add a vector policy to an existing container):

1. **Enable the capability** on the account: \`az cosmosdb update --capabilities EnableNoSQLVectorSearch\` (one-time, account level).
2. **Vector embedding policy** on the container: for each vector path (\`/embedding\`) declare \`dataType\` (float32 is the usual model output; float16, int8 and uint8 shrink storage), \`dimensions\` (default 1536; must match the embedding model, for example 1536 for text-embedding-ada-002 or 3072 for text-embedding-3-large), and \`distanceFunction\` (\`cosine\`, \`dotproduct\` or \`euclidean\`; use what the embedding model recommends).
3. **Vector index** in the indexing policy's \`vectorIndexes\`, plus **exclude the vector path** (\`/embedding/*\`) from the regular included paths. Forgetting the exclusion makes every insert index thousands of floats as scalars, inflating RU cost and latency.

Three index types:

| Type | How it searches | Max dimensions | Use when |
|---|---|---|---|
| **flat** | Brute force, 100% recall | 505 | Small sets, exact results required |
| **quantizedFlat** | Brute force on compressed vectors | 4096 | Up to roughly 50,000 vectors in the search scope, or heavily filtered searches |
| **diskANN** | Approximate nearest neighbour (Microsoft Research DiskANN) | 4096 | More than roughly 50,000 vectors; lowest latency and RU cost at scale |

quantizedFlat and diskANN need at least 1,000 vectors before the quantiser is trained; below that a full scan runs. DiskANN is approximate, so results can differ slightly between runs; raise \`searchListSizeMultiplier\` in the query for higher recall at higher cost.`,
    },
    {
      heading: 'Querying with VectorDistance and the RAG loop',
      body: `The query engine exposes **VectorDistance(path, queryVector[, bruteForce, options])**. Pass the query embedding as a parameter and use the function both in the projection (to return the score) and in ORDER BY (to rank):

\`SELECT TOP @k c.id, c.title, c.chunk, VectorDistance(c.embedding, @q) AS score FROM c WHERE c.tenantId = @tenant AND c.lang = 'en' ORDER BY VectorDistance(c.embedding, @q)\`

Rules of thumb: always use **TOP** or **OFFSET/LIMIT** (unbounded vector queries are expensive); put the **partition key** and metadata filters in WHERE so the index narrows candidates first (the \`filterPriority\` option tunes how aggressively filters apply); set the third argument to \`true\` only when you want to force brute force; the options object can override \`distanceFunction\` or \`dataType\` for a specific query. Larger scores mean more similar for cosine and dot product when the engine orders by similarity; lower distance means closer for euclidean.

A retrieval-augmented generation (RAG) back end then looks like: (1) chunk documents and call an embedding model (Azure OpenAI \`text-embedding-3-*\` in Microsoft Foundry); (2) upsert items containing text, metadata and the embedding; (3) at question time embed the question, run the VectorDistance query with the user's tenant and permission filters; (4) pass the top chunks to the chat model as grounding; (5) cite item ids back to the user. Hybrid search (vector plus full-text) and the Foundry agent knowledge tools build on the same container. Because the vector lives with the document, you avoid a second datastore to keep in sync, which is the main architectural argument for Cosmos DB over a separate vector index when the operational data is already there.`,
    },
    {
      heading: 'Change feed: reacting to inserts and updates',
      body: `The **change feed** is a persistent, ordered (per partition key) log of changes to items in a container, which you read to trigger downstream work: generate or refresh embeddings when a document changes, maintain a materialised view, replicate to a search index or cache, or publish events. Two modes exist:

- **Latest version mode** (default, GA): emits the latest state of each created or updated item. Deletes are **not** captured, so the convention is a soft-delete flag plus TTL. Available from the beginning of the container's history.
- **All versions and deletes mode**: emits every intermediate change and delete operations with operation-type metadata. Requires **continuous backup** on the account, only covers the retention window, and in the change feed processor is supported for .NET and Java (preview in the processor; .NET SDK 3.60+).

Two ways to consume it:

1. **Change feed processor** (.NET and Java): a hosted library with four parts, the **monitored container**, a **lease container** (state and coordination across workers), a **compute instance** (unique \`WithInstanceName\`), and a **delegate** that receives batches. Add more instances with the same processor name and the leases are rebalanced automatically, so it scales out by running more hosts. Checkpointing is automatic after the delegate succeeds; an unhandled exception in the delegate retries the batch, so make handlers idempotent.
2. **Pull model** (all SDKs including Python and Node.js): \`container.query_items_change_feed(...)\` returns pages and a **continuation token** you persist yourself; iterate per **FeedRange** to parallelise. An HTTP 304 / empty page means "no new changes yet, keep polling", not "end of feed".

**Azure Functions Cosmos DB trigger** wraps the processor with its own lease container, which is the lowest-effort hosting option for "run code when items change".`,
    },
    {
      heading: 'The exam angle',
      body: `Expect design questions that distinguish index types and change feed modes:

- *"Exact nearest neighbours required, embeddings have 1536 dimensions."* **quantizedFlat** (flat is limited to 505 dimensions); flat only when dimensions are 505 or fewer.
- *"Millions of vectors, lowest latency and RU cost, slight approximation acceptable."* **diskANN**.
- *"Inserts became expensive after adding embeddings."* The vector path was not added to **excludedPaths**.
- *"Vector queries return no indexed results on a new container with 300 items."* quantizedFlat/diskANN need 1,000 vectors; a full scan is used meanwhile (expected).
- *"Different results on repeated identical queries."* Normal for diskANN; raise searchListSizeMultiplier if recall matters.
- *"Re-embed documents whenever they change, scaling across several workers."* Change feed processor with a lease container, more instances for scale.
- *"Also react to deletes."* All versions and deletes mode (needs continuous backup), or soft-delete + TTL in latest version mode.
- *"Python service must read changes."* Pull model (\`query_items_change_feed\`) and persist continuation tokens; the processor library is .NET/Java only.

Distractors: storing embeddings in a separate blob and searching client-side, adding a vector policy to an existing container (not supported), expecting latest version mode to deliver deletes, and sharing one lease container between two unrelated processors without distinct processor names.`,
    },
  ],
  examples: [
    {
      title: 'Create a vector-enabled container and run a filtered similarity query',
      description:
        'A knowledge-base service creates a container partitioned by tenant with a DiskANN index on 1536-dimension embeddings, excludes the vector path from scalar indexing, and retrieves the top five chunks for a tenant.',
      language: 'python',
      code: `vector_policy = {"vectorEmbeddings": [{
    "path": "/embedding", "dataType": "float32",
    "dimensions": 1536, "distanceFunction": "cosine"}]}
indexing_policy = {
    "includedPaths": [{"path": "/*"}],
    "excludedPaths": [{"path": "/_etag/?"}, {"path": "/embedding/*"}],
    "vectorIndexes": [{"path": "/embedding", "type": "diskANN"}]}
container = db.create_container_if_not_exists(
    id="chunks", partition_key=PartitionKey(path="/tenantId"),
    indexing_policy=indexing_policy, vector_embedding_policy=vector_policy)

def top_chunks(tenant_id, query_embedding, k=5):
    return list(container.query_items(
        query="SELECT TOP @k c.id, c.text, c.source, "
              "VectorDistance(c.embedding, @q) AS score FROM c "
              "WHERE c.tenantId = @t ORDER BY VectorDistance(c.embedding, @q)",
        parameters=[{"name": "@k", "value": k}, {"name": "@q", "value": query_embedding},
                    {"name": "@t", "value": tenant_id}],
        partition_key=tenant_id))`,
      takeaway: 'Policy, index and exclusion are set at container creation; the query combines partition key, metadata filter, TOP and VectorDistance in ORDER BY.',
    },
    {
      title: 'Change feed processor that refreshes embeddings (.NET)',
      description:
        'When a document is created or updated in the documents container, a worker regenerates its embedding and upserts it into the chunks container. Multiple worker instances share the lease container and split the partition key ranges.',
      language: 'csharp',
      code: `Container monitored = client.GetContainer("kb", "documents");
Container leases    = client.GetContainer("kb", "leases");

ChangeFeedProcessor processor = monitored
    .GetChangeFeedProcessorBuilder<Doc>("embed-refresh", HandleChangesAsync)
    .WithInstanceName(Environment.MachineName)   // unique per host
    .WithLeaseContainer(leases)
    .WithStartTime(DateTime.MinValue.ToUniversalTime())
    .Build();
await processor.StartAsync();

async Task HandleChangesAsync(ChangeFeedProcessorContext ctx,
    IReadOnlyCollection<Doc> changes, CancellationToken ct)
{
    foreach (var doc in changes)                 // idempotent: upsert by id
    {
        float[] vector = await embeddings.EmbedAsync(doc.Text, ct);
        await chunks.UpsertItemAsync(new Chunk(doc.Id, doc.TenantId, doc.Text, vector),
                                     new PartitionKey(doc.TenantId), cancellationToken: ct);
    }
}`,
      takeaway: 'Processor name + lease container + unique instance name = scalable, checkpointed processing; handlers must be idempotent because batches are retried on failure.',
    },
    {
      title: 'The deletes that never arrived (a realistic mistake)',
      description:
        'A team syncs Cosmos DB documents into a search index via the change feed in latest version mode. Documents deleted by users keep appearing in search results because latest version mode does not emit deletes. Two valid fixes: switch to all versions and deletes mode (requires continuous backup on the account), or stop hard-deleting and instead set deleted: true with a ttl so the change feed sees an update and the item expires later. The team chose soft delete and had the sync remove items whose deleted flag is true.',
      language: 'python',
      code: `# soft delete: the change feed sees this as an update
doc = container.read_item(item=doc_id, partition_key=tenant_id)
doc["deleted"] = True
doc["ttl"] = 7 * 24 * 3600          # Cosmos DB removes it after 7 days
container.replace_item(item=doc_id, body=doc)

# pull-model consumer (Python) persists the continuation token itself
pager = container.query_items_change_feed(
    continuation=load_token(), partition_key=tenant_id).by_page()
for page in pager:
    for change in page:
        if change.get("deleted"): search.remove(change["id"])
        else: search.upsert(change)
    save_token(container.client_connection.last_response_headers["etag"])`,
      takeaway: 'Latest version mode never reports deletes; use soft delete + TTL, or all versions and deletes mode with continuous backup.',
    },
  ],
  keyPoints: [
    'Enable EnableNoSQLVectorSearch on the account; the vector embedding policy (path, dataType, dimensions, distanceFunction) is set when the container is created.',
    'Index types: flat (exact, max 505 dims), quantizedFlat (brute force on compressed vectors, max 4096, good up to about 50k vectors), diskANN (approximate, best beyond 50k).',
    'Exclude the vector path (/embedding/*) from the regular index or inserts become slow and expensive.',
    'Query with VectorDistance in both SELECT and ORDER BY, always with TOP and ideally partition key and metadata filters.',
    'quantizedFlat and diskANN need at least 1,000 vectors before they are used; diskANN results may vary slightly between runs.',
    'Change feed latest version mode: inserts and updates only, no deletes (use soft delete + TTL); all versions and deletes mode needs continuous backup.',
    'Change feed processor (.NET/Java): monitored container, lease container, unique instance name, delegate; scale by adding instances; handlers must be idempotent.',
    'Python and Node.js use the pull model (query_items_change_feed) and persist continuation tokens; Azure Functions Cosmos DB trigger hosts the processor for you.',
  ],
  flashcards: [
    { front: 'What account capability enables vector search in Cosmos DB for NoSQL?', back: 'EnableNoSQLVectorSearch (az cosmosdb update --capabilities EnableNoSQLVectorSearch).' },
    { front: 'Which four things does a vector embedding policy define per path?', back: 'path, dataType (float32/float16/int8/uint8), dimensions, distanceFunction (cosine, dotproduct, euclidean).' },
    { front: 'Maximum dimensions for a flat vector index?', back: '505.' },
    { front: 'When is quantizedFlat recommended over diskANN?', back: 'When the search scope is roughly 50,000 vectors or fewer, or heavily filtered; diskANN for larger sets.' },
    { front: 'Why exclude the vector path from includedPaths?', back: 'Otherwise every float is indexed as a scalar, raising insert RU cost and latency.' },
    { front: 'Which system function ranks items by similarity?', back: 'VectorDistance(path, queryVector) used in ORDER BY (and SELECT for the score).' },
    { front: 'Does latest version change feed mode report deletes?', back: 'No. Use a soft-delete flag with TTL, or all versions and deletes mode.' },
    { front: 'What is required to use all versions and deletes change feed mode?', back: 'Continuous backup enabled on the account; only changes within the retention period are readable.' },
    { front: 'Name the four components of the change feed processor.', back: 'Monitored container, lease container, compute instance (unique instance name), delegate.' },
    { front: 'How do you scale out a change feed processor?', back: 'Run more instances with the same processor name and lease container; leases are rebalanced automatically.' },
    { front: 'Which SDKs must use the pull model instead of the processor library?', back: 'Python and Node.js (the processor is .NET and Java).' },
  ],
  quiz: [
    {
      question:
        'You are creating a Cosmos DB for NoSQL container to store 1536-dimension embeddings for about 20,000 product descriptions. Exact nearest-neighbour results are required. Which vector index type should you choose?',
      options: [
        'flat',
        'quantizedFlat',
        'diskANN',
        'A composite index on /embedding',
      ],
      correct: [1],
      explanation:
        'flat is exact but limited to 505 dimensions; quantizedFlat is brute force (near-exact) and supports up to 4096 dimensions, fitting a 20,000-vector set. diskANN is approximate, and composite indexes are not vector indexes.',
    },
    {
      question:
        'After adding an embedding property to items, insert latency and RU charges rose sharply even though a diskANN vector index was defined. What is the MOST likely cause?',
      options: [
        'The vector path was not added to excludedPaths in the indexing policy',
        'The account consistency level is Session',
        'The embedding dimensions exceed 4096',
        'The container has fewer than 1,000 items',
      ],
      correct: [0],
      explanation:
        'Without the exclusion the regular index processes every vector element as a scalar on each write. Consistency does not affect write indexing cost, dimensions over 4096 would fail policy validation, and fewer than 1,000 vectors affects search accuracy, not insert cost.',
    },
    {
      question:
        'A Python microservice must react to new and updated documents in a Cosmos DB container and persist its own progress so it can resume after a restart. Which approach should you use?',
      options: [
        'The change feed pull model with query_items_change_feed and stored continuation tokens',
        'The change feed processor library with a lease container',
        'A timer that runs SELECT * FROM c every minute and compares results',
        'Enable continuous backup and read the backup files',
      ],
      correct: [0],
      explanation:
        'The processor library is available for .NET and Java; Python uses the pull model and persists continuation tokens. Polling with full scans is expensive and misses ordering; backups are not a change stream.',
    },
    {
      question:
        'A search index synchronised from the Cosmos DB change feed in latest version mode still shows documents that users deleted. Which TWO solutions are valid? (Select two)',
      options: [
        'Switch the consumer to all versions and deletes mode after enabling continuous backup on the account',
        'Replace hard deletes with a soft-delete flag plus TTL and have the consumer remove flagged items',
        'Increase the lease container throughput',
        'Set indexingMode to none on the monitored container',
      ],
      correct: [0, 1],
      explanation:
        'Latest version mode never emits deletes, so either use the mode that does (requires continuous backup) or soft-delete so the feed sees an update. Lease throughput and indexing mode do not change what the feed captures.',
    },
    {
      question:
        'A change feed processor built with the .NET SDK runs on one Container Apps replica and cannot keep up. What is the simplest way to increase throughput?',
      options: [
        'Run additional replicas with the same processor name and lease container but a unique instance name each',
        'Create a second lease container and a second processor with the same name',
        'Switch the monitored container to Strong consistency',
        'Change the processor to all versions and deletes mode',
      ],
      correct: [0],
      explanation:
        'The processor rebalances partition key range leases across instances automatically. A separate lease container would process everything twice, consistency does not affect feed throughput, and the mode changes what is captured, not speed.',
    },
    {
      question:
        'Identical vector queries against an unchanged container with a diskANN index occasionally return a slightly different ordering. What should you conclude?',
      options: [
        'This is expected for an approximate index; increase searchListSizeMultiplier if higher recall is needed',
        'The vector embedding policy has the wrong distanceFunction',
        'The container has lost data and must be restored',
        'The query must include enable_cross_partition_query=True',
      ],
      correct: [0],
      explanation:
        'diskANN is approximate and each replica builds its index independently, so small variations are normal. A wrong distance function would give consistently poor results, not variation; data loss and cross-partition settings are unrelated.',
    },
  ],
  statements: [
    { text: 'A vector embedding policy can be added to an existing Cosmos DB container.', isTrue: false, explanation: 'Vector policies are specified at container creation; existing containers are not supported.' },
    { text: 'The flat vector index supports up to 4096 dimensions.', isTrue: false, explanation: 'flat is limited to 505 dimensions; quantizedFlat and diskANN support 4096.' },
    { text: 'quantizedFlat and diskANN indexes require at least 1,000 vectors before they are used; below that a full scan runs.', isTrue: true, explanation: 'The quantiser needs enough data to train.' },
    { text: 'VectorDistance can be used in ORDER BY to rank results by similarity.', isTrue: true, explanation: 'Use it in both SELECT (score) and ORDER BY (ranking), typically with TOP.' },
    { text: 'The change feed in latest version mode includes delete operations.', isTrue: false, explanation: 'Deletes are not captured; use soft delete with TTL or all versions and deletes mode.' },
    { text: 'The change feed processor stores its progress in a lease container.', isTrue: true, explanation: 'Leases record per-range checkpoints and coordinate multiple instances.' },
    { text: 'Azure Functions can consume the Cosmos DB change feed through a trigger that manages leases for you.', isTrue: true, explanation: 'The Cosmos DB trigger is built on the change feed processor.' },
  ],
  resources: [
    { label: 'Vector search in Azure Cosmos DB for NoSQL', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/vector-search' },
    { label: 'Change feed processor in Azure Cosmos DB', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/change-feed-processor' },
    { label: 'Change feed modes in Azure Cosmos DB', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/change-feed-modes' },
  ],
};

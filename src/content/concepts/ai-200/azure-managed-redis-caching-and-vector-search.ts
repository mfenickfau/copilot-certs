import type { Concept } from '../../types';

export const azureManagedRedisCachingAndVectorSearch: Concept = {
  id: 'azure-managed-redis-caching-and-vector-search',
  title: 'Azure Managed Redis: Caching, Expiration, Invalidation and Vector Search',
  summary:
    'Use Azure Managed Redis as the low-latency layer of an AI back end: choose a tier, connect with Microsoft Entra ID, implement cache-aside with TTLs and explicit invalidation, and enable the RediSearch module to index embeddings (FLAT or HNSW) for similarity search and semantic caching of LLM responses.',
  certs: ['ai-200'],
  domains: ['ai-200-2'],
  outcomes: ['ai-200-2-3-1', 'ai-200-2-3-2'],
  tags: ['redis', 'azure-managed-redis', 'caching', 'ttl', 'redisearch', 'vector-search', 'semantic-cache'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'What Azure Managed Redis is and how to connect',
      body: `**Azure Managed Redis** is Microsoft's managed in-memory data store built on Redis Enterprise. It replaces the Basic/Standard/Premium tiers of Azure Cache for Redis for new work (migration guidance exists). Four tiers differ by memory-to-vCPU ratio: **Memory Optimized** (8:1, cheapest per GB, dev/test and memory-heavy caches), **Balanced** (4:1, general workloads), **Compute Optimized** (2:1, maximum throughput) and **Flash Optimized** (keeps cold data on NVMe for large datasets at lower cost). Modules such as **RediSearch**, RedisJSON, RedisTimeSeries and RedisBloom must be chosen **at creation**; you cannot add a module later. Clustering policy also matters: RediSearch requires the **Enterprise** or **Non-clustered** policy, not OSS cluster mode.

Connections use TLS on port **10000** by default. Authentication is **Microsoft Entra ID** by default (access keys can be enabled but are the weaker option). In Python you use \`redis-py\` with the \`redis-entraid\` credential provider so tokens are acquired and refreshed from \`DefaultAzureCredential\`; in .NET, StackExchange.Redis with the \`Microsoft.Azure.StackExchangeRedis\` extension. Grant the identity a data access policy (for example *Data Contributor*) on the cache.

Client best practices carry over from any Redis deployment: one shared, long-lived connection or pool per process; reconnect with backoff; set client timeouts generously enough for the largest value you store; prefer many small values over a few huge ones (large values delay every pipelined command behind them); and avoid \`KEYS\` in production in favour of \`SCAN\`. Each SKU has a maximum number of client connections, so connection-per-request designs break at scale. Use **active geo-replication** for multi-region reads and failover, and **data persistence** if you need to survive a restart with warm data.`,
    },
    {
      heading: 'Caching patterns: TTL, expiration and invalidation',
      body: `The core pattern is **cache-aside**: look in Redis first (\`GET key\`); on a miss, read the source of truth (Cosmos DB, PostgreSQL, an API), then \`SET key value EX seconds\` so the next caller hits. Everything else is about how entries leave the cache:

- **Expiration (TTL)**: \`SET ... EX 300\` or \`EXPIRE key 300\` makes Redis delete the key automatically. Pick TTLs by how stale the data may be: seconds for live inventory, hours for product descriptions, days for immutable embeddings. Add **jitter** (300 plus a random 0 to 30 seconds) so thousands of keys do not expire at once and stampede the database.
- **Explicit invalidation**: when the source changes, \`DEL key\` (or \`UNLINK\`) the affected entries, or overwrite them (write-through). Drive this from the same event that changed the data: a Cosmos DB change feed handler, a Service Bus message, or an Event Grid event. Group related keys with a predictable naming scheme (\`product:{id}\`, \`tenant:{t}:prompt:{hash}\`) so invalidation can target them; for broad invalidation prefer versioned key prefixes (\`v2:product:...\`) over scanning and deleting.
- **Eviction**: when memory fills, the \`maxmemory-policy\` decides which keys go; the defaults evict keys with a TTL first (\`volatile-lru\`), so keys you never expire can crowd out everything else. Watch the *used memory* and *evicted keys* metrics.

For LLM back ends specific entries are worth caching: expensive embeddings keyed by a hash of the input text, tool results, rate-limit counters (\`INCR\` with \`EXPIRE\`), conversation state (hashes or JSON with a sliding TTL refreshed on each turn) and session data. Use atomic operations (\`SETNX\` or \`SET ... NX EX\`) for locks and idempotency keys so parallel workers do not duplicate work.`,
    },
    {
      heading: 'Vector indexing and semantic caching with RediSearch',
      body: `With the **RediSearch** module, Redis becomes a vector database. You store each item as a **hash** or **JSON** document containing the embedding as packed float32 bytes plus metadata (document id, tenant, category, timestamp), and create an index:

\`FT.CREATE idx:chunks ON HASH PREFIX 1 chunk: SCHEMA tenant TAG text TEXT embedding VECTOR HNSW 6 TYPE FLOAT32 DIM 1536 DISTANCE_METRIC COSINE\`

Two vector index algorithms: **FLAT** (exact brute force; small sets or when every result must be exact) and **HNSW** (approximate; large sets where latency matters; tuned with \`M\`, \`EF_CONSTRUCTION\`, \`EF_RUNTIME\`). The schema's **dimension and distance metric must match the embedding model**, and a single index should only ever hold vectors from one model.

Querying is a KNN search, optionally **hybrid** with a filter so the TAG/NUMERIC predicates narrow candidates first: \`FT.SEARCH idx:chunks "(@tenant:{contoso})=>[KNN 5 @embedding $vec AS score]" PARAMS 2 vec <bytes> SORTBY score DIALECT 2\`. In Python, redis-py's search module (\`Query\`, \`VectorField\`, \`TagField\`) or the **RedisVL** library wraps this.

The flagship AI use is the **semantic cache**: embed each incoming prompt, search the cache index for a stored prompt within a cosine-distance threshold, and return the cached LLM response on a hit instead of calling the model, cutting cost and latency; on a miss call the model and store prompt, embedding, response and metadata with a **TTL**. RedisVL's \`SemanticCache\` implements this (distance threshold, TTL, metadata filters), and Azure API Management offers the same idea as a gateway policy backed by Managed Redis. Semantic caching is an application pattern, not a managed feature you switch on. When to choose Redis over Azure AI Search or PostgreSQL for vectors: when you need sub-millisecond lookups next to session state and cache, not enterprise document indexing with relevance tuning.`,
    },
    {
      heading: 'The exam angle',
      body: `Typical scenario items:

- *"Vector search queries fail with unknown command FT.CREATE."* The cache was created **without the RediSearch module**; modules cannot be added later, so recreate the instance with RediSearch (and Enterprise or Non-clustered policy).
- *"Thousands of cached entries expire at the same moment and the database spikes."* Add **TTL jitter**.
- *"Product prices change; cached values must update immediately."* Explicit **invalidation** (DEL or overwrite) triggered by the change event, not a shorter TTL.
- *"Reduce Azure OpenAI spend for repeated, similar questions."* **Semantic cache** on Managed Redis (RedisVL or APIM policy) with an embedding distance threshold and TTL.
- *"Connect without access keys."* Entra ID with redis-entraid / StackExchange.Redis extension and a data access policy for the managed identity.
- *"Largest dataset at lowest cost, tolerant of slower cold reads."* **Flash Optimized** tier.
- *"Memory-heavy cache, modest throughput, lowest price per GB."* **Memory Optimized** tier.
- *"Exact nearest neighbours over a few thousand vectors."* **FLAT** index; **HNSW** for large sets.

Distractors: using Azure Cache for Redis Basic for new RAG workloads (no modules, legacy), adding RediSearch after creation (not possible), relying on \`KEYS pattern\` for invalidation at scale (blocks the server; use versioned prefixes), treating eviction as a substitute for TTLs, and mixing embeddings from two models in one index.`,
    },
  ],
  examples: [
    {
      title: 'Cache-aside with jittered TTL and event-driven invalidation',
      description:
        'A product API caches catalogue entries from PostgreSQL for roughly five minutes, with jitter to avoid synchronized expiry, and a Service Bus handler deletes the key the moment a product changes.',
      language: 'python',
      code: `import json, random, redis
from azure.identity import DefaultAzureCredential
from redis_entraid.cred_provider import create_from_default_azure_credential

r = redis.Redis(host="contoso-cache.westeurope.redis.azure.net", port=10000,
                ssl=True, decode_responses=True,
                credential_provider=create_from_default_azure_credential(
                    ("https://redis.azure.com/.default",)))

def get_product(pid: str) -> dict:
    key = f"v1:product:{pid}"
    if (hit := r.get(key)):
        return json.loads(hit)
    product = db.fetch_product(pid)                      # source of truth
    r.set(key, json.dumps(product), ex=300 + random.randint(0, 30))
    return product

def on_product_changed(event: dict):                     # Service Bus handler
    r.delete(f"v1:product:{event['productId']}")         # explicit invalidation`,
      takeaway: 'Cache-aside plus TTL handles the general case; jitter prevents stampedes; explicit DEL driven by the change event keeps hot data correct immediately.',
    },
    {
      title: 'Semantic cache for an LLM endpoint with RedisVL',
      description:
        'Before calling Azure OpenAI, the chat service checks whether a semantically similar prompt was answered recently. Hits skip the model; misses are stored with a one-hour TTL and tenant metadata.',
      language: 'python',
      code: `from redisvl.extensions.cache.llm import SemanticCache
from redisvl.utils.vectorize import AzureOpenAITextVectorizer

vectorizer = AzureOpenAITextVectorizer(model="text-embedding-3-small",
    api_config={"azure_endpoint": AOAI_ENDPOINT, "api_key": AOAI_KEY})
cache = SemanticCache(name="llmcache", redis_url=REDIS_URL,
                      vectorizer=vectorizer, distance_threshold=0.1, ttl=3600)

def answer(prompt: str, tenant: str) -> str:
    hits = cache.check(prompt=prompt, filter_expression=f"@tenant:{{{tenant}}}")
    if hits:
        return hits[0]["response"]                       # no model call
    response = chat_model.complete(prompt)
    cache.store(prompt=prompt, response=response, metadata={"tenant": tenant})
    return response`,
      takeaway: 'The cache index stores prompt embeddings; a cosine-distance threshold decides hits; TTL and metadata filters keep answers fresh and tenant-scoped.',
    },
    {
      title: 'The cache that could not search (a realistic mistake)',
      description:
        'A team provisions a Balanced B5 Azure Managed Redis instance for a RAG prototype, writes embeddings into hashes, and FT.CREATE fails with "unknown command". They had not selected the RediSearch module at creation, and modules cannot be added afterwards. They recreate the instance with RediSearch enabled and the Enterprise clustering policy, then build the index. The lesson spreads: module choice and clustering policy are provisioning-time decisions.',
      language: 'bash',
      code: `az redisenterprise create -g rg-ai --cluster-name contoso-vec \\
  --location westeurope --sku Balanced_B5 \\
  --clustering-policy EnterpriseCluster \\
  --modules name=RediSearch

# then, from redis-cli / redis-py:
# FT.CREATE idx:chunks ON HASH PREFIX 1 chunk: SCHEMA tenant TAG \\
#   embedding VECTOR HNSW 6 TYPE FLOAT32 DIM 1536 DISTANCE_METRIC COSINE`,
      takeaway: 'Enable RediSearch (and a compatible clustering policy) when you create the instance; there is no retrofit.',
    },
  ],
  keyPoints: [
    'Azure Managed Redis tiers: Memory Optimized (8:1), Balanced (4:1), Compute Optimized (2:1), Flash Optimized (NVMe for large cold datasets).',
    'Modules such as RediSearch and the clustering policy are chosen at creation and cannot be changed later; RediSearch needs Enterprise or Non-clustered policy.',
    'Connect over TLS (port 10000) with Microsoft Entra ID via redis-entraid or the StackExchange.Redis Entra extension; reuse one connection or pool.',
    'Cache-aside: GET, on miss read the source and SET with EX; add TTL jitter to avoid expiry stampedes.',
    'Invalidate explicitly (DEL/UNLINK or overwrite) from the event that changed the data; use versioned key prefixes instead of KEYS scans for bulk invalidation.',
    'Eviction (maxmemory-policy) is a safety valve, not a substitute for TTLs; monitor used memory and evicted keys.',
    'Vector index: FT.CREATE with VECTOR FLAT (exact) or HNSW (approximate), TYPE FLOAT32, DIM matching the model, DISTANCE_METRIC COSINE; KNN queries can be combined with TAG/NUMERIC filters.',
    'Semantic cache = embed prompt, KNN search within a distance threshold, return cached response or call the model and store with TTL (RedisVL SemanticCache or APIM policy).',
  ],
  flashcards: [
    { front: 'Which Azure Managed Redis tier has the highest memory-to-vCPU ratio?', back: 'Memory Optimized (8:1).' },
    { front: 'Which tier moves cold data to NVMe storage for large datasets?', back: 'Flash Optimized.' },
    { front: 'Can you add the RediSearch module to an existing Azure Managed Redis instance?', back: 'No. Modules are selected at creation only.' },
    { front: 'Which clustering policies support RediSearch?', back: 'Enterprise (EnterpriseCluster) and Non-clustered (NoCluster); OSS cluster mode does not.' },
    { front: 'Default port and authentication for Azure Managed Redis?', back: 'TLS on port 10000; Microsoft Entra ID authentication is enabled by default.' },
    { front: 'Describe the cache-aside pattern.', back: 'GET from Redis; on a miss read the source of truth, SET the value with a TTL, return it.' },
    { front: 'Why add jitter to TTLs?', back: 'So many keys do not expire simultaneously and stampede the backing store.' },
    { front: 'How do you invalidate cached data when the source changes?', back: 'DEL/UNLINK the key or overwrite it, triggered by the change event; use versioned key prefixes for bulk invalidation.' },
    { front: 'Which two vector index algorithms does RediSearch offer?', back: 'FLAT (exact brute force) and HNSW (approximate nearest neighbour).' },
    { front: 'What must match between the vector index schema and the embedding model?', back: 'The dimension (DIM) and the distance metric; one model per index.' },
    { front: 'What is a semantic cache?', back: 'A cache keyed by prompt embedding: similar prompts within a distance threshold reuse a stored LLM response instead of calling the model.' },
  ],
  quiz: [
    {
      question:
        'A team wants to reduce Azure OpenAI costs for a support chatbot that receives many near-duplicate questions. Which approach using Azure Managed Redis is MOST appropriate?',
      options: [
        'Implement a semantic cache: embed each prompt, search a RediSearch vector index within a distance threshold, and return the cached response on a hit',
        'Cache responses keyed by the exact prompt string with a one-day TTL',
        'Store conversation history in Redis hashes',
        'Enable active geo-replication',
      ],
      correct: [0],
      explanation:
        'Semantic caching matches similar, not identical, prompts. Exact-key caching misses paraphrases, storing history does not avoid model calls, and geo-replication addresses availability.',
    },
    {
      question:
        'FT.CREATE returns "unknown command" on an Azure Managed Redis instance created last week. What should you do?',
      options: [
        'Create a new instance with the RediSearch module selected and a supported clustering policy, then migrate',
        'Run MODULE LOAD redisearch on the existing instance',
        'Upgrade the instance to the Compute Optimized tier',
        'Switch authentication from Entra ID to access keys',
      ],
      correct: [0],
      explanation:
        'Modules cannot be added after creation and MODULE LOAD is not available on the managed service. Tier and authentication changes do not add modules.',
    },
    {
      question:
        'Every five minutes the backing PostgreSQL database shows a CPU spike that coincides with thousands of cache misses. Cached entries all have a 300 second TTL set at startup. What should you change?',
      options: [
        'Add random jitter to each key\'s TTL so expirations spread out',
        'Remove TTLs and rely on the maxmemory eviction policy',
        'Switch to the Flash Optimized tier',
        'Use KEYS * to delete entries gradually',
      ],
      correct: [0],
      explanation:
        'Synchronized expiry causes stampedes; jitter staggers them. Eviction is not a freshness mechanism, tier changes do not alter expiry timing, and KEYS blocks the server.',
    },
    {
      question:
        'Which TWO statements about vector search in Azure Managed Redis are correct? (Select two)',
      options: [
        'The FLAT index performs exact brute-force search and suits smaller datasets',
        'The HNSW index is approximate and suits large datasets where latency matters',
        'A single index can safely mix embeddings from models with different dimensions',
        'Vector search works with the OSS clustering policy',
      ],
      correct: [0, 1],
      explanation:
        'FLAT is exact; HNSW is approximate. The schema has one fixed DIM and metric, so mixing models breaks it, and RediSearch requires the Enterprise or Non-clustered policy.',
    },
    {
      question:
        'An API running on Azure Container Apps must connect to Azure Managed Redis without storing access keys. What should you implement?',
      options: [
        'Microsoft Entra ID authentication with the app\'s managed identity granted a data access policy, using the redis-entraid credential provider',
        'Store the primary access key in an environment variable',
        'Disable TLS and connect on port 6379',
        'Use a shared access signature generated monthly',
      ],
      correct: [0],
      explanation:
        'Entra ID is the default and keyless option. Keys in environment variables are what you are avoiding, TLS cannot be dropped, and SAS tokens are not a Redis concept.',
    },
    {
      question:
        'Prices in a catalogue change several times a day and users must never see a stale price, but most reads should still be served from cache. What is the BEST design?',
      options: [
        'Cache-aside with a long TTL plus explicit DEL of the product key whenever a price-change event is processed',
        'Cache-aside with a one second TTL',
        'No caching for products',
        'Cache prices only in the browser',
      ],
      correct: [0],
      explanation:
        'Event-driven invalidation gives immediacy while keeping the hit rate high. A one-second TTL destroys the hit rate, no caching misses the requirement, and browser caching cannot be invalidated centrally.',
    },
  ],
  statements: [
    { text: 'Azure Managed Redis is built on Redis Enterprise and is Microsoft\'s recommended Redis offering for new workloads.', isTrue: true, explanation: 'It supersedes the Basic, Standard and Premium tiers of Azure Cache for Redis, with migration guidance.' },
    { text: 'You can enable the RediSearch module on an Azure Managed Redis instance after it has been created.', isTrue: false, explanation: 'Modules must be chosen at provisioning time.' },
    { text: 'Microsoft Entra ID authentication is enabled by default on new Azure Managed Redis instances.', isTrue: true, explanation: 'Access keys are optional and less secure.' },
    { text: 'Setting a TTL with SET key value EX 300 causes Redis to delete the key automatically after five minutes.', isTrue: true, explanation: 'EX sets expiry in seconds.' },
    { text: 'Using KEYS with a pattern is the recommended way to invalidate many cache entries in production.', isTrue: false, explanation: 'KEYS blocks the server; use versioned prefixes or SCAN-based approaches.' },
    { text: 'Semantic caching is a managed feature you enable with a single Azure Managed Redis setting.', isTrue: false, explanation: 'It is an application or gateway pattern built on RediSearch vector search (for example RedisVL or an APIM policy).' },
    { text: 'The dimension declared in a RediSearch vector field must match the embedding model\'s output size.', isTrue: true, explanation: 'Query vectors with a different dimension are rejected.' },
  ],
  resources: [
    { label: 'What is Azure Managed Redis?', url: 'https://learn.microsoft.com/en-us/azure/redis/overview' },
    { label: 'Vector embeddings and vector search in Azure Managed Redis', url: 'https://learn.microsoft.com/en-us/azure/redis/overview-vector-similarity' },
    { label: 'Tutorial: Use Azure Managed Redis as a semantic cache', url: 'https://learn.microsoft.com/en-us/azure/redis/tutorial-semantic-cache' },
    { label: 'Best practices for development with Azure Managed Redis', url: 'https://learn.microsoft.com/en-us/azure/redis/best-practices-development' },
  ],
};

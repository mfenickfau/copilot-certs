import type { Concept } from '../../types';

export const cosmosDbSdkQueriesAndPerformance: Concept = {
  id: 'cosmos-db-sdk-queries-and-performance',
  title: 'Azure Cosmos DB for NoSQL: SDK Access, Queries, Indexing and Consistency',
  summary:
    'Connect to Azure Cosmos DB for NoSQL with the SDK and Microsoft Entra credentials, write parameterised queries that respect partition keys, read the request-unit charge, and tune cost with indexing policies (included/excluded paths, composite indexes) and the five consistency levels.',
  certs: ['ai-200'],
  domains: ['ai-200-2'],
  outcomes: ['ai-200-2-1-1', 'ai-200-2-1-2'],
  tags: ['cosmos-db', 'nosql', 'request-units', 'indexing-policy', 'consistency-levels', 'python-sdk'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Connecting and querying with the SDK',
      body: `The object model is account → database → container → item. In Python (\`pip install azure-cosmos azure-identity\`) you create one **CosmosClient** per application and reuse it: \`CosmosClient(url=endpoint, credential=DefaultAzureCredential())\`. Passwordless access needs the identity to hold a Cosmos DB **data-plane** role (Cosmos DB Built-in Data Contributor or Reader, assigned with \`az cosmosdb sql role assignment create\`); the Azure RBAC "Contributor" role manages the account but cannot read items. Keys still work (\`credential=key\`) but are the less secure option.

From the client, \`get_database_client("db")\` and \`get_container_client("items")\` return lightweight proxies. CRUD is \`create_item\`, \`upsert_item\`, \`read_item(item=id, partition_key=pk)\`, \`replace_item\`, \`delete_item\`. A **point read** (id plus partition key) is the cheapest operation, about 1 RU for a 1 KB item.

Queries use the NoSQL SQL dialect through \`container.query_items(query, parameters=[...], partition_key=pk)\`. Always parameterise (\`@category\`) rather than string-concatenate. Supplying \`partition_key\` scopes the query to one logical partition; omitting it requires \`enable_cross_partition_query=True\` and fans out to every physical partition, which costs more RUs and latency. Results are paged: iterate the returned iterable, or use \`by_page()\` with a continuation token to build pagination into an API. \`max_item_count\` caps page size.

The .NET equivalent is \`GetItemQueryIterator<T>(QueryDefinition.WithParameter(...))\` with \`ReadNextAsync()\`. In every SDK the response exposes the **request charge** (\`x-ms-request-charge\` header; \`container.client_connection.last_response_headers\` in Python, \`FeedResponse.RequestCharge\` in .NET), which is how you measure a query's cost before tuning it.`,
    },
    {
      heading: 'Request units and what drives them',
      body: `Cosmos DB bills every operation in **request units (RUs)**, a blend of CPU, IOPS and memory. You provision RU/s (manual or autoscale) per container or database, or use serverless and pay per RU consumed. If a workload exceeds provisioned throughput, requests are throttled with **HTTP 429** and an \`x-ms-retry-after-ms\` header; SDKs retry automatically up to a configured count, but sustained 429s mean you need more RU/s or a cheaper query.

Levers that reduce RU consumption, from most to least impactful:

1. **Partition key design.** Queries that include the partition key in the filter touch one partition. A hot or low-cardinality key (\`/country\`) concentrates writes and hits the 20 GB logical partition limit; a high-cardinality key with even access (\`/tenantId\`, \`/deviceId\`) spreads load.
2. **Point reads over queries.** \`read_item\` is cheaper than \`SELECT * FROM c WHERE c.id = @id\`.
3. **Project only needed properties** and avoid \`SELECT *\` on large documents; avoid \`ORDER BY\` on unindexed paths and \`DISTINCT\`/\`JOIN\` fan-outs where possible.
4. **Indexing policy** (next section) so writes do not index properties you never filter on and reads can use composite indexes.
5. **Consistency level**: strong and bounded staleness reads cost twice the RUs of session/consistent prefix/eventual.
6. **Item size**: RU cost scales with document size; keep large blobs (and raw embeddings you never query) elsewhere or excluded from the index.

Use the portal's Query Stats or the SDK request charge to compare before and after. Watch the normalized RU consumption metric per partition key range to spot hot partitions.`,
    },
    {
      heading: 'Indexing policies',
      body: `By default Cosmos DB indexes **every property of every item** with range indexes for strings and numbers, so queries work out of the box but every write pays to index every path. The indexing policy is a JSON document on the container:

- \`indexingMode\`: \`consistent\` (index updated synchronously with writes; the default) or \`none\` (no index; the container is a key-value store accessed by point reads; also useful during bulk loads, switching back to consistent afterwards). Lazy mode is legacy and not available for new containers.
- \`includedPaths\` and \`excludedPaths\`: path patterns such as \`/category/?\` (one scalar) or \`/metadata/*\` (everything beneath). The root \`/*\` must appear in one of the two lists. The more precise path wins when they overlap, so the common pattern is include \`/*\` and exclude large or unqueried subtrees. \`id\` and \`_ts\` are always indexed in consistent mode; \`_etag\` is excluded by default.
- \`compositeIndexes\`: required for \`ORDER BY\` on **two or more properties** and helpful for filters combined with an ORDER BY on a different property. Order and direction (ascending/descending) in the composite index must match the query.
- \`spatialIndexes\`: for GeoJSON functions; none are created by default.
- **Vector indexes** (flat, quantizedFlat, diskANN) go in \`vectorIndexes\`, and the vector path should be excluded from the regular index.

Changing the policy triggers an online **index transformation** that consumes RUs in the background; queries keep working but may return incomplete results for newly included paths until it completes. Excluding write-heavy, never-queried paths (telemetry payloads, raw text) is the cheapest way to cut write RU cost.`,
    },
    {
      heading: 'Consistency levels and the exam angle',
      body: `Cosmos DB offers five well-defined consistency levels, strongest to weakest: **Strong**, **Bounded Staleness**, **Session** (the default and most widely used), **Consistent Prefix**, **Eventual**. The account sets the default (\`az cosmosdb create --default-consistency-level Session\`), and a client or request can **relax** it (\`consistency_level="Eventual"\` on the client or per request). The classic rule is that you can only override to a weaker level; newer .NET and Java SDKs add a ReadConsistencyStrategy that can also go stronger per read.

Trade-offs to remember:

- **Strong** gives linearizable reads everywhere at the price of higher write latency across regions; in multi-region accounts the write waits for all regions.
- **Bounded Staleness** bounds lag by K versions or T time; meant for single-region-write accounts with multiple regions.
- **Session** guarantees read-your-writes and monotonic reads within one session (session token), with latency and cost like eventual. Share the session token across processes if a different client must read a write immediately.
- **Consistent Prefix** never shows out-of-order writes; **Eventual** offers lowest latency with no ordering guarantee.
- **RU cost**: strong and bounded staleness read from two replicas, so reads cost **2x** and read throughput per RU is half.

Exam patterns: *"a user does not see the item they just created"* while running with eventual consistency → use Session (or pass the session token). *"Reduce read RU cost; the app tolerates slightly stale data"* → relax to Session or Eventual. *"Queries throttled with 429 after adding a dashboard"* → check cross-partition queries and provisioned RU/s. *"ORDER BY c.category, c.price fails"* → add a composite index. *"Writes are expensive on a logging container nobody queries"* → exclude paths or set indexing mode to none.`,
    },
  ],
  examples: [
    {
      title: 'Passwordless client, parameterised in-partition query and RU charge',
      description:
        'A product catalogue API queries items by category inside a single tenant partition, logs the RU charge for each call, and uses a reusable client with DefaultAzureCredential.',
      language: 'python',
      code: `from azure.cosmos import CosmosClient
from azure.identity import DefaultAzureCredential

client = CosmosClient("https://contoso-cosmos.documents.azure.com:443/",
                      credential=DefaultAzureCredential())
container = client.get_database_client("shop").get_container_client("products")

def products_in_category(tenant_id: str, category: str, max_price: float):
    items = list(container.query_items(
        query="SELECT c.id, c.name, c.price FROM c "
              "WHERE c.category = @cat AND c.price <= @max ORDER BY c.price",
        parameters=[{"name": "@cat", "value": category},
                    {"name": "@max", "value": max_price}],
        partition_key=tenant_id,          # single-partition query
        max_item_count=50,
    ))
    ru = container.client_connection.last_response_headers["x-ms-request-charge"]
    print(f"query cost {ru} RU")
    return items`,
      takeaway: 'One client per process, parameters instead of string building, a partition key on every query you can, and the request charge header to measure cost.',
    },
    {
      title: 'Trimming the indexing policy for a chat-history container',
      description:
        'A conversation store writes large message bodies and embeddings but only ever filters on userId, conversationId and timestamp, and sorts by conversationId then timestamp. The team excludes the heavy paths and adds a composite index.',
      language: 'json',
      code: `{
  "indexingMode": "consistent",
  "automatic": true,
  "includedPaths": [ { "path": "/userId/?" }, { "path": "/conversationId/?" }, { "path": "/ts/?" } ],
  "excludedPaths": [ { "path": "/*" }, { "path": "/content/*" }, { "path": "/embedding/*" } ],
  "compositeIndexes": [
    [ { "path": "/conversationId", "order": "ascending" },
      { "path": "/ts", "order": "descending" } ]
  ]
}`,
      takeaway: 'Index only what you filter or sort on; a composite index is mandatory for ORDER BY across two properties and must match order and direction.',
    },
    {
      title: 'The dashboard that throttled production (a realistic mistake)',
      description:
        'An analyst adds an internal dashboard that runs SELECT * FROM c WHERE c.status = "open" every few seconds against an orders container partitioned by /customerId. Within minutes the public API starts receiving 429 errors. The query is cross-partition, unbounded and returns full documents, so it burns most of the provisioned RU/s. The fix: project only needed fields, add a partition key or time filter, page with max_item_count and continuation tokens, consider a materialised view fed by the change feed, and move analytics to a separate container or the analytical store.',
      language: 'python',
      code: `# before: cross-partition, SELECT *, every few seconds -> 429s for everyone
# after: scoped, projected, paged
pager = container.query_items(
    query="SELECT c.id, c.customerId, c.total FROM c "
          "WHERE c.status = 'open' AND c.ts >= @since",
    parameters=[{"name": "@since", "value": since_iso}],
    enable_cross_partition_query=True,   # still fan-out, so page it
    max_item_count=100,
).by_page()
first_page = list(next(pager))`,
      takeaway: 'Unbounded cross-partition SELECT * queries compete for the same RU/s as your API; scope, project and page them, or serve analytics from a different store.',
    },
  ],
  keyPoints: [
    'Create one CosmosClient per process; use DefaultAzureCredential plus a Cosmos DB built-in data-plane role rather than account keys.',
    'Point reads (id + partition key) are the cheapest operation; parameterised single-partition queries come next; cross-partition queries fan out and cost more.',
    'Every response carries x-ms-request-charge; use it to measure RU cost, and treat 429 as a signal to scale RU/s or cheapen queries.',
    'Default indexing indexes every path; exclude large or unqueried paths to cut write RUs, and add composite indexes for multi-property ORDER BY.',
    'The root path /* must be in includedPaths or excludedPaths; the more precise path wins.',
    'Five consistency levels: Strong, Bounded Staleness, Session (default), Consistent Prefix, Eventual; clients can relax the account default per request.',
    'Strong and bounded staleness reads cost 2x RUs because they read from two replicas.',
    'Session consistency gives read-your-writes within a session via the session token.',
  ],
  flashcards: [
    { front: 'Which Python class is the entry point to Cosmos DB for NoSQL, and how many should an app create?', back: 'CosmosClient; create one per process and reuse it.' },
    { front: 'Which role lets a managed identity read and write items (not just manage the account)?', back: 'A Cosmos DB built-in data-plane role such as Cosmos DB Built-in Data Contributor, assigned with az cosmosdb sql role assignment create.' },
    { front: 'What is the cheapest way to fetch a single item?', back: 'A point read with read_item(item=id, partition_key=pk), about 1 RU per 1 KB.' },
    { front: 'What must you set to run a query without specifying a partition key in the Python SDK?', back: 'enable_cross_partition_query=True (and expect higher RU cost).' },
    { front: 'Which response header reports the RU cost of an operation?', back: 'x-ms-request-charge.' },
    { front: 'What HTTP status indicates RU throttling?', back: '429 Too Many Requests, with x-ms-retry-after-ms.' },
    { front: 'When is a composite index required?', back: 'For ORDER BY on two or more properties (and it must match property order and sort direction).' },
    { front: 'How do you stop a large never-queried property from being indexed?', back: 'Add its path (for example /content/*) to excludedPaths.' },
    { front: 'List the five Cosmos DB consistency levels, strongest first.', back: 'Strong, Bounded Staleness, Session, Consistent Prefix, Eventual.' },
    { front: 'Which consistency levels double read RU cost?', back: 'Strong and Bounded Staleness (two-replica reads).' },
    { front: 'What does Session consistency guarantee?', back: 'Read-your-writes and monotonic reads within a session (tracked by a session token).' },
  ],
  quiz: [
    {
      question:
        'A Python API running on Azure Container Apps must read and write items in Azure Cosmos DB for NoSQL without storing account keys. Which TWO steps are required? (Select two)',
      options: [
        'Create the CosmosClient with credential=DefaultAzureCredential()',
        'Assign the Cosmos DB Built-in Data Contributor role to the app\'s managed identity on the account',
        'Assign the Azure RBAC Contributor role to the managed identity on the account',
        'Set the account consistency level to Strong',
      ],
      correct: [0, 1],
      explanation:
        'Passwordless access uses DefaultAzureCredential plus a Cosmos DB data-plane role. Azure RBAC Contributor is control-plane only and cannot read items; consistency level is unrelated to authentication.',
    },
    {
      question:
        'Users report that immediately after saving a profile, a second request sometimes returns the old profile. The client overrides the account default and reads with Eventual consistency. What is the MOST appropriate fix with minimal cost impact?',
      options: [
        'Change the account default to Strong consistency',
        'Read with Session consistency so the session token guarantees read-your-writes',
        'Add a composite index on the profile container',
        'Increase provisioned RU/s on the container',
      ],
      correct: [1],
      explanation:
        'Session consistency provides read-your-writes within a session at eventual-like cost. Strong doubles read cost and raises latency, indexes do not affect staleness, and RU/s is a throughput control.',
    },
    {
      question:
        'A query SELECT * FROM c WHERE c.tenantId = @t ORDER BY c.category ASC, c.createdAt DESC fails with an error about requiring a composite index. What should you add to the indexing policy?',
      options: [
        'A composite index on /category ascending and /createdAt descending',
        'An included path for /category/* and /createdAt/*',
        'A spatial index on /createdAt',
        'Set indexingMode to none',
      ],
      correct: [0],
      explanation:
        'ORDER BY on multiple properties requires a composite index matching the properties, order and directions. Included paths alone do not support multi-property sorts, spatial indexes are for GeoJSON, and indexing mode none disables querying by those paths.',
    },
    {
      question:
        'A container stores telemetry documents with a large payload property that is never filtered or sorted. Writes are consuming more RUs than expected. What is the MOST cost-effective change?',
      options: [
        'Add /payload/* to excludedPaths in the indexing policy',
        'Switch the account to Bounded Staleness consistency',
        'Enable autoscale on the container',
        'Change the partition key to /payload',
      ],
      correct: [0],
      explanation:
        'Excluding the unqueried path removes its indexing cost from every write. Consistency affects reads, autoscale changes billing not per-write cost, and partitioning on a large payload would be a poor key.',
    },
    {
      question:
        'An API began returning HTTP 429 from Cosmos DB after a reporting job started running SELECT * queries across all partitions every few seconds. Which action addresses the root cause?',
      options: [
        'Rewrite the report to filter by partition key or time, project needed fields and page results, or serve it from a separate store',
        'Set enable_cross_partition_query=False on the API\'s queries',
        'Change the API to Strong consistency so reads are prioritised',
        'Disable automatic indexing on the container',
      ],
      correct: [0],
      explanation:
        '429s mean the shared RU/s budget is exhausted by expensive fan-out queries; cheapen or isolate them. Disabling cross-partition on the API would make its queries fail, Strong consistency costs more RUs, and disabling indexing would make the report even more expensive.',
    },
  ],
  statements: [
    { text: 'By default, Azure Cosmos DB indexes every property of every item in a container.', isTrue: true, explanation: 'The default policy includes /* with range indexes on strings and numbers.' },
    { text: 'A query that omits the partition key is served from a single physical partition.', isTrue: false, explanation: 'Without a partition key the query fans out to all physical partitions (cross-partition query).' },
    { text: 'Session is the default consistency level for new Cosmos DB accounts.', isTrue: true, explanation: 'Session is the default and the most widely used level.' },
    { text: 'Reads under Strong consistency cost the same RUs as reads under Eventual consistency.', isTrue: false, explanation: 'Strong and Bounded Staleness reads use two replicas and cost twice as many RUs.' },
    { text: 'A client can override the account default consistency with a weaker level per request.', isTrue: true, explanation: 'The classic override relaxes consistency at the client or request level.' },
    { text: 'The id and _ts properties must be listed explicitly in includedPaths to be indexed.', isTrue: false, explanation: 'They are always indexed when indexingMode is consistent.' },
    { text: 'Changing an indexing policy triggers an online index transformation that consumes RUs in the background.', isTrue: true, explanation: 'The container stays available while the index is rebuilt.' },
  ],
  resources: [
    { label: 'Quickstart: Azure Cosmos DB for NoSQL with Python', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/quickstart-python' },
    { label: 'Indexing policies in Azure Cosmos DB', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/index-policy' },
    { label: 'Consistency levels in Azure Cosmos DB', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/consistency-levels' },
  ],
};

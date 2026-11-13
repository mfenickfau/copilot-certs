import type { Concept } from '../../types';

export const postgresqlConnectionsSchemaAndPooling: Concept = {
  id: 'postgresql-connections-schema-and-pooling',
  title: 'Azure Database for PostgreSQL: Connecting, Schema Design and Connection Optimisation',
  summary:
    'Connect to Azure Database for PostgreSQL flexible server from Python and .NET with TLS and Microsoft Entra tokens, design tables and data types for AI workloads (including the vector type and JSONB metadata), choose B-tree, GIN and partial indexes, and keep latency low with the built-in PgBouncer and client-side pooling.',
  certs: ['ai-200'],
  domains: ['ai-200-2'],
  outcomes: ['ai-200-2-2-1', 'ai-200-2-2-2', 'ai-200-2-2-6'],
  tags: ['postgresql', 'flexible-server', 'psycopg', 'npgsql', 'pgbouncer', 'schema-design', 'entra-id'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Connecting with SDKs and Microsoft Entra ID',
      body: `Azure Database for PostgreSQL **flexible server** is standard PostgreSQL, so you use ordinary drivers: **psycopg** (v3) or asyncpg in Python, **Npgsql** in .NET, node-postgres in Node. The connection string targets \`<server>.postgres.database.azure.com\` on port **5432** and must use TLS (\`sslmode=require\`); the server rejects unencrypted connections by default.

Two authentication models exist. **PostgreSQL authentication** uses roles and passwords stored in the server, which you then have to rotate yourself. **Microsoft Entra authentication** (the recommended, passwordless path) requires an Entra admin configured on the server; your app then requests a token for the scope \`https://ossrdbms-aad.database.windows.net/.default\` with \`DefaultAzureCredential\` and passes it as the password, with the Entra principal's name (user, group or the managed identity's name) as the user. Tokens expire (roughly an hour), so fetch a fresh one when opening connections rather than caching it forever; Npgsql supports a password provider callback for this.

Keep secrets out of code: read host, database and user from configuration (App Configuration or environment variables) and, if you must use a password, from Key Vault. Network options are public access with firewall rules, or **private access** (VNet integration) and private endpoints; \`FATAL: no pg_hba.conf entry\` or connection timeouts usually mean a firewall or VNet rule, not a credential problem.

Query execution follows the driver's conventions: parameterised statements (\`cur.execute("SELECT ... WHERE id = %s", (id,))\`), explicit transactions, and \`fetchall()\`/\`fetchone()\`. Use \`EXPLAIN (ANALYZE, BUFFERS)\` to see whether an index was used before guessing.`,
    },
    {
      heading: 'Schema design and data types for AI data',
      body: `Model the data you will filter and join on as **typed columns**, and keep genuinely flexible attributes in **JSONB**. A typical RAG schema is a \`documents\` table (id, tenant_id, title, source_url, updated_at) and a \`chunks\` table (id, document_id FK, chunk_index, content TEXT, metadata JSONB, embedding **vector(1536)**). Choices that matter:

- **Identifiers**: \`bigint generated always as identity\` or \`uuid\`; avoid \`serial\` in new schemas.
- **Text**: \`text\` for content; \`varchar(n)\` adds no performance benefit in PostgreSQL.
- **Time**: \`timestamptz\`, not \`timestamp\`, so tenancy across regions does not mangle offsets.
- **Vectors**: the pgvector extension's \`vector(n)\` type (fixed dimension, matched to the embedding model); \`halfvec(n)\` halves storage with small precision loss. Enable with \`CREATE EXTENSION vector;\` after allow-listing it in the server parameter \`azure.extensions\`.
- **Metadata**: \`jsonb\` (binary, indexable) rather than \`json\`; index with **GIN** when you filter on arbitrary keys (\`metadata @> '{"lang":"en"}'\`).
- **Numeric**: \`numeric\` for money, \`double precision\` for scores.

Indexes should follow queries: **B-tree** (default) for equality and range filters and for foreign keys you join on (\`document_id\`, \`tenant_id\`); **composite** B-tree indexes with the most selective, most-filtered column first; **partial indexes** (\`WHERE deleted = false\`) to keep hot indexes small; **GIN** for JSONB and full-text (\`tsvector\`) search; and a vector index (HNSW, IVFFlat or DiskANN, covered in the pgvector concept) for similarity. Every index costs write throughput and storage, so do not index what you never filter on, and use \`pg_stat_user_indexes\` to find unused ones. Partition very large chunk tables by tenant or time when retention or per-tenant deletion is needed.`,
    },
    {
      heading: 'Connection optimisation: PgBouncer and pooling',
      body: `PostgreSQL forks a backend process per connection, so a serverless or autoscaled fleet that opens a connection per request will exhaust \`max_connections\`, waste memory and spend most of its time in TLS handshakes. Flexible server addresses this with a **built-in PgBouncer**: set the server parameter \`pgbouncer.enabled = true\` (no restart needed) and connect to the **same host name on port 6432**. PgBouncer multiplexes up to about 10,000 client connections onto a small pool of server connections. It is not available on the **Burstable** tier, and in zone-redundant HA it moves with the primary so your connection string does not change on failover. PgBouncer also supports Entra authentication.

Pool modes: **transaction** pooling (recommended for most apps; a server connection is assigned only for the duration of a transaction) versus **session** pooling (compatible with session state such as \`SET\`, advisory locks and LISTEN, but pools far less effectively). Protocol-level prepared statements work in transaction mode only when \`pgbouncer.max_prepared_statements\` is set above 0. Tune \`pgbouncer.default_pool_size\` and \`pgbouncer.max_client_conn\`, and enable \`metrics.pgbouncer_diagnostics\` to monitor.

Application side, still use a **client pool** (psycopg_pool, Npgsql's built-in pooling, SQLAlchemy's pool) sized to a handful of connections per instance, with sensible timeouts and retry on transient errors (SQLSTATE 57P01, 08006). Keep transactions short, batch inserts (\`executemany\`/\`COPY\`) when loading embeddings, and place compute in the same region as the server. For read-heavy AI workloads, offload reporting to **read replicas**. Monitor \`active connections\`, \`failed connections\` and CPU in Azure Monitor; connection storms show as spikes in connections with flat throughput.`,
    },
    {
      heading: 'The exam angle',
      body: `Items tend to pair a symptom with the Azure-specific control:

- *"Hundreds of Azure Functions instances exhaust connections."* Enable built-in PgBouncer and connect on **port 6432** (transaction pooling), and use a small client pool.
- *"Functions cannot store database passwords."* Entra authentication with a managed identity; request a token for \`https://ossrdbms-aad.database.windows.net/.default\` and use it as the password.
- *"Connection refused only from the new App Service."* Firewall rule or private access configuration, not credentials.
- *"Filter chunks by arbitrary JSON attributes quickly."* JSONB column with a **GIN** index.
- *"Store 1536-dimension embeddings."* \`vector(1536)\` from the pgvector (\`vector\`) extension, allow-listed in \`azure.extensions\`.
- *"PgBouncer option missing in the portal."* The server is on the **Burstable** tier; upgrade to General Purpose or Memory Optimized.
- *"Queries slow despite an index."* Check \`EXPLAIN ANALYZE\`; a function on the column or a type mismatch prevents index use; add a composite or partial index matching the WHERE clause.

Distractors: enabling PgBouncer by installing it on a VM (unnecessary; it is built in), using \`sslmode=disable\` to fix a connection error, choosing \`json\` over \`jsonb\`, and reaching for read replicas when the problem is connection count rather than read load.`,
    },
  ],
  examples: [
    {
      title: 'Passwordless connection through PgBouncer with a client pool',
      description:
        'An API hosted on Azure Container Apps connects to flexible server using its managed identity, through the built-in PgBouncer on port 6432, with a small psycopg pool that refreshes the Entra token whenever it opens a connection.',
      language: 'python',
      code: `import os
from azure.identity import DefaultAzureCredential
from psycopg_pool import ConnectionPool

cred = DefaultAzureCredential()
SCOPE = "https://ossrdbms-aad.database.windows.net/.default"

def conninfo() -> str:
    token = cred.get_token(SCOPE).token          # fresh token per new connection
    return (f"host={os.environ['PGHOST']} port=6432 dbname=kb "
            f"user={os.environ['PGUSER']} password={token} sslmode=require")

pool = ConnectionPool(conninfo=conninfo(), min_size=1, max_size=5,
                      reconnect_failed=lambda p: print("pool reconnect failed"))

def chunks_for(doc_id: int):
    with pool.connection() as conn, conn.cursor() as cur:
        cur.execute("SELECT id, content FROM chunks WHERE document_id = %s "
                    "ORDER BY chunk_index", (doc_id,))
        return cur.fetchall()`,
      takeaway: 'Entra token as the password, port 6432 for PgBouncer, and a bounded client pool: three changes that remove secrets and connection storms at once.',
    },
    {
      title: 'A schema for tenant-scoped RAG chunks',
      description:
        'Typed columns for everything you filter on, JSONB for flexible attributes, a composite B-tree for the hot lookup path, a GIN index for metadata filters and a partial index that ignores soft-deleted rows.',
      language: 'text',
      code: `CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id   uuid        NOT NULL,
  title       text        NOT NULL,
  source_url  text,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  deleted     boolean     NOT NULL DEFAULT false
);

CREATE TABLE chunks (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  document_id  bigint NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  tenant_id    uuid   NOT NULL,
  chunk_index  int    NOT NULL,
  content      text   NOT NULL,
  metadata     jsonb  NOT NULL DEFAULT '{}',
  embedding    vector(1536)
);

CREATE INDEX chunks_doc_idx     ON chunks (document_id, chunk_index);
CREATE INDEX chunks_tenant_idx  ON chunks (tenant_id);
CREATE INDEX chunks_meta_gin    ON chunks USING gin (metadata jsonb_path_ops);
CREATE INDEX documents_live_idx ON documents (tenant_id, updated_at) WHERE deleted = false;`,
      takeaway: 'Type what you filter on, keep JSONB for the long tail, and let each index map to a real query shape.',
    },
    {
      title: 'The connection storm from Flex Consumption (a realistic mistake)',
      description:
        'A team moves an embedding-ingest function to the Flex Consumption plan. Under load it scales to hundreds of instances, each opening its own connection on port 5432, and the server starts refusing connections with "too many clients already" while CPU is low. The fix is twofold: enable pgbouncer.enabled on the server and switch the connection string to port 6432 (transaction pooling), and cap the per-instance pool at one or two connections. The Burstable dev server did not offer PgBouncer, which is why nobody noticed in testing.',
      language: 'bash',
      code: `# enable the built-in PgBouncer (no restart required)
az postgres flexible-server parameter set -g rg-ai -s pg-kb \\
  --name pgbouncer.enabled --value true
az postgres flexible-server parameter set -g rg-ai -s pg-kb \\
  --name pgbouncer.default_pool_size --value 50

# point the app at PgBouncer
az functionapp config appsettings set -g rg-ai -n ingest-fn \\
  --settings PGPORT=6432 PGPOOL_MAX=2`,
      takeaway: 'Connection count, not CPU, is the first thing elastic compute exhausts; PgBouncer on 6432 plus a tiny client pool is the Azure-native answer.',
    },
  ],
  keyPoints: [
    'Connect with standard drivers (psycopg, Npgsql) to <server>.postgres.database.azure.com:5432 with sslmode=require.',
    'Prefer Microsoft Entra authentication: DefaultAzureCredential token for https://ossrdbms-aad.database.windows.net/.default used as the password.',
    'Connection failures from new hosts are usually firewall or private-access configuration, never fixed by disabling TLS.',
    'Use typed columns for filters and joins, jsonb (not json) with GIN indexes for flexible metadata, timestamptz for time, vector(n) for embeddings.',
    'Index to match queries: composite B-tree with the most selective column first, partial indexes for hot subsets, GIN for JSONB and full-text.',
    'Built-in PgBouncer: set pgbouncer.enabled=true, connect on port 6432, transaction pooling recommended; not available on the Burstable tier.',
    'Still use a small client-side pool per instance, short transactions, batched inserts and same-region compute.',
    'Read replicas offload read load; PgBouncer solves connection count. Diagnose with EXPLAIN ANALYZE and Azure Monitor connection metrics.',
  ],
  flashcards: [
    { front: 'Which port does the built-in PgBouncer listen on in Azure Database for PostgreSQL flexible server?', back: '6432 (PostgreSQL itself is on 5432), same host name.' },
    { front: 'Which server parameter enables PgBouncer, and does it need a restart?', back: 'pgbouncer.enabled = true; no restart is required.' },
    { front: 'Which compute tier does not support the built-in PgBouncer?', back: 'Burstable.' },
    { front: 'Which token scope does an app request for Entra authentication to PostgreSQL?', back: 'https://ossrdbms-aad.database.windows.net/.default' },
    { front: 'Which sslmode should Azure PostgreSQL connections use?', back: 'require (or stricter); TLS is enforced by default.' },
    { front: 'Recommended PgBouncer pool mode for most applications?', back: 'Transaction pooling.' },
    { front: 'Which index type suits filters on arbitrary keys inside a JSONB column?', back: 'GIN (for example USING gin (metadata jsonb_path_ops)).' },
    { front: 'How do you enable the pgvector extension on flexible server?', back: 'Allow-list "vector" in the azure.extensions server parameter, then CREATE EXTENSION vector; per database.' },
    { front: 'jsonb or json for metadata you will filter on?', back: 'jsonb: binary storage, indexable, faster to query.' },
    { front: 'What is a partial index and when is it useful?', back: 'An index with a WHERE clause (for example WHERE deleted = false) that stays small by covering only the hot subset of rows.' },
  ],
  quiz: [
    {
      question:
        'An Azure Functions app on the Flex Consumption plan scales to hundreds of instances and Azure Database for PostgreSQL flexible server starts rejecting connections with "too many clients already" while CPU remains low. What should you do FIRST?',
      options: [
        'Enable the built-in PgBouncer and connect on port 6432 with a small per-instance client pool',
        'Scale the server to a larger vCore size',
        'Create a read replica and send writes to it',
        'Disable TLS to reduce connection overhead',
      ],
      correct: [0],
      explanation:
        'The bottleneck is connection count, which PgBouncer multiplexes. Scaling vCores raises max_connections but does not fix the storm, replicas cannot accept writes, and disabling TLS is neither allowed by default nor relevant.',
    },
    {
      question:
        'A containerized API must connect to Azure Database for PostgreSQL without storing a password. Which TWO actions are required? (Select two)',
      options: [
        'Configure a Microsoft Entra administrator on the server and create a database role for the app\'s managed identity',
        'Acquire a token for https://ossrdbms-aad.database.windows.net/.default and pass it as the connection password',
        'Store the PostgreSQL admin password in an environment variable',
        'Set sslmode=disable in the connection string',
      ],
      correct: [0, 1],
      explanation:
        'Entra authentication needs the server configured for Entra and a matching principal, and the app uses a token as the password. Storing the admin password defeats the goal, and TLS cannot be disabled.',
    },
    {
      question:
        'Chunks of documents carry a flexible set of attributes (language, department, sensitivity) that users filter on in any combination. How should you store and index them?',
      options: [
        'A jsonb column with a GIN index',
        'A json column with a B-tree index',
        'A text column containing serialized JSON, searched with LIKE',
        'One table per attribute combination',
      ],
      correct: [0],
      explanation:
        'jsonb is binary and indexable, and GIN supports containment queries over arbitrary keys. json is not indexable in the same way, LIKE on text scans every row, and exploding tables is unmaintainable.',
    },
    {
      question:
        'The PgBouncer settings do not appear in the server parameters of a development flexible server. What is the MOST likely reason?',
      options: [
        'The server uses the Burstable compute tier',
        'The server has Microsoft Entra authentication enabled',
        'The server has zone-redundant high availability enabled',
        'The server runs PostgreSQL 16',
      ],
      correct: [0],
      explanation:
        'PgBouncer is not supported on Burstable. Entra auth, HA and PostgreSQL version do not hide the feature; in HA, PgBouncer runs on the primary.',
    },
    {
      question:
        'A query filtering chunks by tenant_id and ordering by updated_at for non-deleted documents is slow despite a B-tree index on updated_at. Which change is MOST likely to help?',
      options: [
        'Create a composite partial index on (tenant_id, updated_at) WHERE deleted = false',
        'Change updated_at from timestamptz to text',
        'Enable PgBouncer in session mode',
        'Replace jsonb metadata with json',
      ],
      correct: [0],
      explanation:
        'An index matching the filter columns and predicate lets PostgreSQL seek directly to the tenant\'s live rows in sorted order. Changing types to text loses ordering semantics, PgBouncer affects connections not query plans, and json is slower than jsonb.',
    },
  ],
  statements: [
    { text: 'Azure Database for PostgreSQL flexible server requires TLS for client connections by default.', isTrue: true, explanation: 'Use sslmode=require or stricter; unencrypted connections are rejected unless explicitly allowed.' },
    { text: 'The built-in PgBouncer in flexible server is available on every compute tier, including Burstable.', isTrue: false, explanation: 'PgBouncer is not supported on the Burstable tier.' },
    { text: 'With PgBouncer enabled, applications connect to the same host name but on port 6432.', isTrue: true, explanation: 'PostgreSQL stays on 5432; PgBouncer listens on 6432.' },
    { text: 'Microsoft Entra tokens used as PostgreSQL passwords never expire.', isTrue: false, explanation: 'Tokens are short-lived (about an hour); fetch a new one when opening connections.' },
    { text: 'Session pooling in PgBouncer offers better connection reuse than transaction pooling.', isTrue: false, explanation: 'Transaction pooling reuses server connections far more aggressively and is recommended for most applications.' },
    { text: 'A GIN index is the appropriate index type for containment queries on a jsonb column.', isTrue: true, explanation: 'GIN indexes support the @> and ? operators on jsonb.' },
    { text: 'The pgvector extension must be allow-listed in the azure.extensions server parameter before CREATE EXTENSION vector succeeds.', isTrue: true, explanation: 'Flexible server requires extensions to be allow-listed at the server level first.' },
  ],
  resources: [
    { label: 'Connect to Azure Database for PostgreSQL with Python', url: 'https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/connect-python' },
    { label: 'PgBouncer in Azure Database for PostgreSQL flexible server', url: 'https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-pgbouncer' },
    { label: 'Enable and use pgvector in Azure Database for PostgreSQL', url: 'https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/how-to-use-pgvector' },
  ],
};

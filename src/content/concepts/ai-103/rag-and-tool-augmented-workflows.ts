import type { Concept } from '../../types';

export const ragAndToolAugmentedWorkflows: Concept = {
  id: 'rag-and-tool-augmented-workflows',
  title: 'RAG in an Application, Tool-Augmented Flows and Multistep Reasoning Pipelines',
  summary:
    'Implementing retrieval-augmented generation end to end (chunk, embed, index, retrieve with hybrid plus semantic ranking, ground the prompt, cite), designing workflows that mix model calls with tools and deterministic code, building multistep reasoning pipelines (plan, act, reflect), and orchestrating several models, flows and rules engines so the cheapest reliable component handles each step.',
  certs: ['ai-103'],
  domains: ['ai-103-2'],
  outcomes: ['ai-103-2-1-2', 'ai-103-2-1-3', 'ai-103-2-3-4'],
  tags: ['rag', 'ai-search', 'hybrid-search', 'semantic-ranker', 'function-calling', 'workflows', 'orchestration', 'model-router', 'python', 'intermediate'],
  difficulty: 'intermediate',
  diagram: 'rag-pipeline',
  sections: [
    {
      heading: 'RAG, step by step, in application code',
      body: `Retrieval-augmented generation keeps the model's knowledge current and private without fine-tuning: retrieve relevant chunks from your data at query time and put them in the prompt. The application-level pipeline has five stages, and the exam tests the choices at each.

1. **Ingest and chunk.** Convert files to text or Markdown (Document Intelligence Layout, Content Understanding \`prebuilt-documentSearch\`), split into chunks that fit the embedding model and keep semantic boundaries (Text Split skill with overlap, or semantic chunking by headings and paragraphs), carry metadata (title, URL, page, ACLs) with each chunk.
2. **Embed and index.** Generate vectors with an embedding model (\`text-embedding-3-small\`/\`large\`) and store chunk text + vector + metadata in an Azure AI Search index with an HNSW vector field, a semantic configuration and filterable fields. **Integrated vectorization** does this inside the indexer; otherwise push documents with \`SearchClient.upload_documents\`.
3. **Retrieve.** Embed the user question (or let a **vectorizer** on the index do it with \`VectorizableTextQuery\`), run a **hybrid** query (\`search_text\` plus \`vector_queries\`) with \`query_type="semantic"\` and a semantic configuration, apply security filters (\`filter="group_ids/any(g: g eq '...')"\`), and take the top 3 to 10 chunks. For compound questions, call a **knowledge base** (agentic retrieval) instead.
4. **Ground the prompt.** Put the chunks in the context with source ids, and instruct the model to answer only from them and to cite \`[doc1]\`. Trim to the context budget; prefer fewer, better chunks (semantic reranker helps).
5. **Generate and verify.** Call the model with low temperature, return citations the UI can resolve, and measure with **Groundedness**, **Relevance** and **Retrieval** evaluators.

Common failure modes: chunks too large (diluted vectors), missing metadata (no citations, no security trimming), vector-only search (misses exact codes), and no groundedness check (confident hallucinations). The managed alternatives, file search for a few files and Foundry IQ for enterprise knowledge, implement the same stages for you.`,
    },
    {
      heading: 'Designing tool-augmented flows',
      body: `A tool-augmented flow lets the model decide *when* to call deterministic capabilities. With the Responses API you pass tool definitions (JSON Schema function tools with \`strict: true\`, or hosted tools such as web search, file search, code interpreter, MCP), the model emits \`function_call\` items, your code executes them and returns \`function_call_output\` items, and the loop continues until the model produces a final message. Design rules that items probe:

- **Tool descriptions are prompts**: name, description and parameter descriptions decide whether the model picks the right tool; keep tools few and distinct, or use **Toolbox tool search** when you have hundreds.
- **Control the loop**: cap iterations, validate arguments (schemas with \`additionalProperties: false\`), time out, and make tools idempotent so retries are safe.
- **tool_choice**: \`auto\` (default), \`required\` (must call something), \`none\`, or force a specific function when the flow is deterministic.
- **Parallel tool calls** reduce latency when calls are independent; sequential chains when one depends on another.
- **Approvals** for consequential actions (MCP \`require_approval\`, Agent Framework \`approval_mode\`), and **guardrails** at tool call and tool response intervention points.
- **Separate planning from execution**: the model plans, code executes, the model summarises. This is the core of **agentic loops** and of **workflows** in Foundry (sequential, group chat, human-in-the-loop templates, retiring in favour of Agent Framework workflows) or Agent Framework's programmatic orchestrations (sequential, concurrent, handoff, group chat, magentic).

Whether to use a single prompt, a tool-augmented flow or a full agent depends on how much the control flow must adapt at runtime: fixed steps favour code and workflows; open-ended requests favour an agent with tools.`,
    },
    {
      heading: 'Multistep reasoning pipelines',
      body: `Multistep pipelines decompose a hard task into stages that each model call can do well. Patterns worth recognising by name:

- **Prompt chaining**: output of step one is the input of step two (extract facts, then draft, then format). Easy to test and cache per stage.
- **Plan and execute**: a planner model (often a reasoning model) writes a plan; cheaper models or tools execute each step; the planner revises. The Responses API multi-agent orchestration (preview) automates this with a root agent and subagents.
- **Decompose and aggregate / map-reduce**: split a long document into sections, summarise each with a small model in parallel, then merge with one call. Agentic retrieval applies the same idea to queries.
- **Reflection and self-critique**: a generator produces a draft; a critic (same or different model, or an evaluator such as Groundedness) scores it against a rubric; the generator revises. Stop after N rounds or when the score passes a threshold.
- **Verification steps**: deterministic checks (schema validation, unit tests for generated code with code interpreter, regex for policy numbers) between model steps; **chain-of-thought** evaluation uses a model to check the reasoning trace, not only the answer.
- **Routers / classifiers first**: a small model classifies intent, then the pipeline branches to the right chain, index or rules engine.

Make every stage observable: trace spans per step (OpenTelemetry), log intermediate outputs, and evaluate each stage as well as the whole (Intent Resolution, Tool Call Accuracy, Task Adherence, Groundedness). Cost grows with steps and tokens, so cache stable prefixes, reuse embeddings, and use Batch deployments for offline stages.`,
    },
    {
      heading: 'Orchestrating multiple models, flows and rules engines',
      body: `Production systems rarely use one model. The exam expects you to justify a **hybrid architecture**:

| Component | Use it for | Why |
|---|---|---|
| Rules engine / deterministic code | Eligibility rules, limits, compliance checks, pricing | Explainable, auditable, free, exact |
| Small model | Classification, routing, extraction, summarising chunks | Cheap and fast |
| Large or reasoning model | Planning, synthesis, ambiguous language, complex tool use | Quality where it matters |
| **Model router** | Mixed free-form traffic | Picks the model per prompt by quality, cost or balance |
| Foundry Tools | OCR, speech, translation, PII, document layout | Deterministic perception with confidence scores |
| Retrieval (search, knowledge base) | Facts and policy text | Keeps answers grounded and current |

Orchestration glue options: your own code with the Responses API; **Microsoft Agent Framework** (model-agnostic, with built-in orchestrations, middleware and tracing; hostable as a Foundry hosted agent); **Foundry workflows** in the portal for declarative sequential, group-chat and human-in-the-loop flows; **Azure Functions, Durable Functions and Logic Apps** for event-driven and long-running steps; **routines** for triggering agents on schedules or events; **Azure API Management** as an AI gateway in front of all models for limits and logging.

Design heuristics: put the rules engine *around* the LLM (pre-filter what it may see, post-validate what it may return) so a bad generation cannot violate a hard rule; let the LLM explain or draft, never decide eligibility alone; version prompts and route a percentage of traffic to a new model for A/B evaluation; fall back to a smaller model or a cached answer under 429s. Typical item: "a loan decision must be fully explainable and the explanation friendly" → rules engine decides, model writes the explanation grounded in the rule outcome.`,
    },
  ],
  examples: [
    {
      title: 'Hybrid retrieval with semantic ranking, then grounded generation',
      description:
        'A policy assistant retrieves the five best chunks with a hybrid query (keyword + vector via the index vectorizer) reranked by semantic ranker, filters by the user\'s groups for security trimming, then asks the model to answer with citations.',
      language: 'python',
      code: `from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizableTextQuery

search = SearchClient(endpoint=SEARCH_ENDPOINT, index_name="policies", credential=cred)
results = search.search(
    search_text=question,                                   # BM25 side
    vector_queries=[VectorizableTextQuery(text=question, k_nearest_neighbors=50,
                                          fields="content_vector")],   # vector side
    query_type="semantic", semantic_configuration_name="default",      # L2 rerank
    filter=f"group_ids/any(g: g eq '{user_group}')",                   # security trimming
    select=["id", "title", "content", "url"], top=5,
)
chunks = list(results)
context = "\\n\\n".join(f"[doc{i+1}] {c['title']}: {c['content']}" for i, c in enumerate(chunks))

answer = openai.responses.create(
    model="gpt-5-mini", temperature=0.1,
    instructions=("Answer ONLY from the sources. Cite as [docN]. "
                  "If the sources do not contain the answer, say you don't know."),
    input=f"Sources:\\n{context}\\n\\nQuestion: {question}",
)
citations = [chunks[int(n)-1]["url"] for n in re.findall(r"\\[doc(\\d+)\\]", answer.output_text)]`,
      takeaway: 'Hybrid plus semantic ranker, security filters and explicit citation instructions are the core of a trustworthy application RAG loop.',
    },
    {
      title: 'A tool-augmented flow with the Responses API',
      description:
        'An order assistant can look up order status and request a refund. The model decides which function to call; the app executes it, returns the output and lets the model finish. Refunds above a threshold are routed to a rules check before execution.',
      language: 'python',
      code: `tools = [{"type": "function", "name": "get_order", "strict": True,
          "parameters": {"type": "object", "properties": {"order_id": {"type": "string"}},
                         "required": ["order_id"], "additionalProperties": False}},
         {"type": "function", "name": "refund", "strict": True,
          "parameters": {"type": "object", "properties": {"order_id": {"type": "string"},
                         "amount": {"type": "number"}}, "required": ["order_id", "amount"],
                         "additionalProperties": False}}]
r = openai.responses.create(model="gpt-5-mini", tools=tools, input=user_message,
                            instructions="Help with orders. Look up before refunding.")
for _ in range(5):                                          # bounded agentic loop
    calls = [i for i in r.output if i.type == "function_call"]
    if not calls:
        break
    outputs = []
    for call in calls:
        args = json.loads(call.arguments)
        if call.name == "refund" and not rules.refund_allowed(**args):   # deterministic gate
            result = {"error": "needs human approval"}
        else:
            result = TOOL_IMPL[call.name](**args)
        outputs.append({"type": "function_call_output", "call_id": call.call_id,
                        "output": json.dumps(result)})
    r = openai.responses.create(model="gpt-5-mini", tools=tools,
                                previous_response_id=r.id, input=outputs)
print(r.output_text)`,
      takeaway: 'The model proposes tool calls, your code executes them behind deterministic rules, and a bounded loop returns results until the model answers.',
    },
    {
      title: 'The vector-only RAG mistake',
      description:
        'A parts-catalogue bot used pure vector search. Queries for exact SKUs like "HX-2231-B" returned similar-looking but wrong parts, and legal clauses with specific section numbers were missed. Switching to hybrid search restored exact matching while keeping semantic recall; adding the semantic ranker and a reflection step that checks each answer\'s citations against the retrieved chunks reduced ungrounded answers further.',
      language: 'python',
      code: `# Reflection / self-critique pass using the Groundedness evaluator as the critic
from azure.ai.evaluation import GroundednessEvaluator, AzureOpenAIModelConfiguration

judge = GroundednessEvaluator(AzureOpenAIModelConfiguration(
    azure_endpoint=AOAI_ENDPOINT, azure_deployment="gpt-5-mini"))

draft = generate(question, chunks)                      # first attempt
score = judge(query=question, context=context, response=draft)
if score["groundedness"] < 4:                           # 1-5 scale, threshold chosen by team
    draft = openai.responses.create(model="gpt-5-mini",
        input=f"Sources:\\n{context}\\n\\nDraft:\\n{draft}\\n\\nCritique: {score['groundedness_reason']}\\n"
              "Rewrite the draft so every claim is supported by the sources.").output_text`,
      takeaway: 'Use hybrid search for exact identifiers and add a critic step (an evaluator or a second model) so ungrounded drafts are revised before users see them.',
    },
  ],
  keyPoints: [
    'Application RAG has five stages: chunk with metadata, embed and index (HNSW vector field, semantic configuration), hybrid retrieve with semantic reranking and security filters, ground the prompt with cited chunks, generate and verify.',
    'Use VectorizableTextQuery so the index vectorizer embeds the query; combine search_text and vector_queries with query_type="semantic" for hybrid plus reranking.',
    'Function tools are JSON Schema definitions with strict mode; the model returns function_call items, your code returns function_call_output, and the loop must be bounded and validated.',
    'Separate planning from execution: models plan and summarise, deterministic code and tools act, approvals gate consequential actions.',
    'Multistep patterns: prompt chaining, plan-and-execute, map-reduce, reflection/self-critique with a critic or evaluator, verification steps and router-first branching.',
    'Hybrid architectures put rules engines around the LLM: rules decide eligibility and limits, small models classify and extract, large or reasoning models plan and synthesise, model router handles mixed traffic.',
    'Orchestration glue: Responses API code, Microsoft Agent Framework orchestrations, Foundry workflows (retiring for Agent Framework), Azure Functions and Logic Apps, routines, an API Management AI gateway.',
    'Evaluate each stage and the whole with Groundedness, Relevance, Retrieval, Intent Resolution, Tool Call Accuracy and Task Adherence, and trace every step.',
  ],
  flashcards: [
    { front: 'What are the five stages of an application RAG pipeline?', back: 'Ingest and chunk, embed and index, retrieve (hybrid + semantic rerank + filters), ground the prompt with citations, generate and verify.' },
    { front: 'Which Azure AI Search query class lets the index vectorize the query text for you?', back: 'VectorizableTextQuery, which uses the vectorizer defined on the vector field.' },
    { front: 'How do you implement security trimming in a RAG query?', back: 'Store ACL or group ids on each chunk and apply an OData filter such as group_ids/any(g: g eq "...") per user; Foundry IQ does this automatically for supported sources.' },
    { front: 'What does strict: true on a function tool do?', back: 'Forces the model to produce arguments that exactly match the JSON Schema (requires additionalProperties false and all properties required).' },
    { front: 'What does tool_choice="required" mean?', back: 'The model must call at least one tool rather than answering directly.' },
    { front: 'Describe the reflection (self-critique) pattern.', back: 'Generate a draft, have a critic (second model call or evaluator) score it against a rubric, revise, and stop when the score passes or after N rounds.' },
    { front: 'In a hybrid LLM plus rules-engine design, what should the rules engine own?', back: 'Hard decisions: eligibility, limits, compliance and pricing, applied before and after the model so generations cannot violate them.' },
    { front: 'Which Foundry feature routes free-form prompts to different models automatically?', back: 'Model router, deployed like a model with Balanced, Cost or Quality routing modes.' },
    { front: 'Which orchestration framework does Microsoft recommend instead of Foundry portal workflows for new multi-agent code?', back: 'Microsoft Agent Framework (sequential, concurrent, handoff, group chat and magentic orchestrations), hostable as a Foundry hosted agent.' },
    { front: 'Name three evaluators that assess a RAG answer.', back: 'Groundedness (supported by context), Relevance (answers the query) and Retrieval or Document Retrieval (quality of retrieved chunks).' },
  ],
  quiz: [
    {
      question:
        'A RAG assistant returns wrong items when users ask for exact part numbers but works well for descriptive questions. What change is MOST likely to fix the part-number queries while keeping descriptive quality?',
      options: [
        'Increase the embedding dimensions.',
        'Switch from vector-only search to hybrid search (keyword plus vector) with semantic ranking.',
        'Raise the model temperature.',
        'Replace the index with a Foundry memory store.',
      ],
      correct: [1],
      explanation:
        'Keyword (BM25) matching handles exact identifiers; hybrid search merges it with vector recall. Embedding size and temperature do not restore exact matching, and memory is for user context.',
    },
    {
      question:
        'A loan-servicing assistant must never approve a repayment holiday that violates policy limits, but should explain decisions in friendly language. Which design is MOST appropriate?',
      options: [
        'Let a reasoning model read the policy and decide, then answer.',
        'A rules engine evaluates eligibility deterministically; the model only generates the explanation grounded in the rule outcome.',
        'Fine-tune a small model on past approvals.',
        'Use model router in Quality mode for every request.',
      ],
      correct: [1],
      explanation:
        'Hard rules belong in deterministic code for auditability; the LLM adds language. Letting a model decide, fine-tuning on history or routing do not guarantee compliance with limits.',
    },
    {
      question: 'Which TWO practices make a function-calling loop safe in production? (Select two)',
      options: [
        'Bound the number of iterations and validate arguments against a strict schema.',
        'Allow the model to execute tools directly without application code.',
        'Make tool implementations idempotent and gate consequential actions behind approvals or rules.',
        'Describe all tools with the same generic description to avoid bias.',
      ],
      correct: [0, 2],
      explanation:
        'Bounded loops, schema validation, idempotency and approval gates prevent runaway or harmful behaviour. Models never execute code themselves in this pattern, and distinct descriptions are essential for correct tool selection.',
    },
    {
      question:
        'You need to summarise 3,000-page regulatory filings. A single call exceeds the context window and quality drops on long inputs. Which pattern should you apply?',
      options: [
        'Decompose and aggregate: summarise sections in parallel with a small model, then merge the summaries with one final call.',
        'Set max_output_tokens to the maximum.',
        'Use JSON mode.',
        'Increase top_p.',
      ],
      correct: [0],
      explanation:
        'Map-reduce style decomposition fits long inputs within context and parallelises cheaply. Output caps, JSON mode and sampling do not solve input length.',
    },
    {
      question: 'Which component should perform a groundedness check inside a reflection loop before an answer is shown to users?',
      options: [
        'The Azure AI Search indexer.',
        'A critic step using the Groundedness evaluator or a second model call comparing the draft with the retrieved context.',
        'The content filter blocking level.',
        'Prompt caching.',
      ],
      correct: [1],
      explanation:
        'A critic evaluates the draft against sources and triggers revision. Indexers ingest data, content filters detect harms rather than hallucinations, and caching is a cost feature.',
    },
  ],
  statements: [
    { text: 'Hybrid search in Azure AI Search runs the keyword and vector queries in parallel and merges them with RRF.', isTrue: true, explanation: 'This is the documented hybrid behaviour; semantic ranker can then rerank the fused list.' },
    { text: 'JSON mode guarantees that function-call arguments match your schema.', isTrue: false, explanation: 'Schema conformance comes from strict function definitions or structured outputs, not JSON mode.' },
    { text: 'In a tool-augmented flow with the Responses API, the application executes the function and returns a function_call_output item.', isTrue: true, explanation: 'The model only proposes calls; your code runs them and feeds results back.' },
    { text: 'Foundry portal workflows are the recommended foundation for new multi-agent orchestration code.', isTrue: false, explanation: 'Workflows are retiring on 1 December 2026; Microsoft recommends Microsoft Agent Framework for new development.' },
    { text: 'Putting the rules engine before and after the model keeps hard constraints enforceable even when the model errs.', isTrue: true, explanation: 'Pre-filtering inputs and post-validating outputs with deterministic code is the standard hybrid pattern.' },
    { text: 'Chunk size has little effect on retrieval quality as long as the embedding model accepts the text.', isTrue: false, explanation: 'Oversized chunks dilute vectors and waste context; semantic, metadata-rich chunks retrieve better.' },
    { text: 'Agentic retrieval decomposes a complex question into subqueries that run in parallel.', isTrue: true, explanation: 'That is the core of the agentic retrieval pipeline behind Foundry IQ knowledge bases.' },
  ],
  resources: [
    { label: 'Retrieval-augmented generation in Azure AI Search', url: 'https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview' },
    { label: 'Create a hybrid query', url: 'https://learn.microsoft.com/en-us/azure/search/hybrid-search-how-to-query' },
    { label: 'Multi-agent orchestration with the Responses API', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/responses-multi-agent' },
    { label: 'Microsoft Agent Framework overview', url: 'https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview' },
  ],
};

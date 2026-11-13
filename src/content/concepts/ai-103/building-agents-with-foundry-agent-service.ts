import type { Concept } from '../../types';

export const buildingAgentsWithFoundryAgentService: Concept = {
  id: 'building-agents-with-foundry-agent-service',
  title: 'Building Agents with Foundry Agent Service: Roles, Tools, Retrieval and Memory',
  summary:
    'How to define an agent (role, goals, instructions, model, tool schemas and conversation-tracking approach), create prompt agents with the Azure AI Projects SDK or ephemeral agents with the Responses API and Agent Framework, give agents retrieval (file search, Azure AI Search, Foundry IQ), function calling and long-term memory, and integrate tools such as OpenAPI, MCP servers, Azure Functions, web search, code interpreter, Content Understanding and Foundry Tools.',
  certs: ['ai-103', 'ai-901'],
  domains: ['ai-103-2', 'ai-901-2'],
  outcomes: ['ai-103-2-2-1', 'ai-103-2-2-2', 'ai-103-2-2-3', 'ai-901-2-1-5'],
  tags: ['agents', 'foundry-agent-service', 'prompt-agent', 'responses-api', 'conversations', 'function-calling', 'mcp', 'file-search', 'memory', 'python', 'intermediate'],
  difficulty: 'intermediate',
  diagram: 'agentic-loop',
  sections: [
    {
      heading: 'Defining the agent: role, goals, tools and conversation tracking',
      body: `An agent in Foundry Agent Service is **model + instructions + tools**, run by a managed loop: receive input, let the model reason, execute tool calls, feed results back, return the answer, persist the conversation. Designing one well means writing four things down before code:

1. **Role and goals** (the instructions): who the agent is, what outcome it owns, what it must not do, when to ask for clarification, when to hand off, output format and tone. Keep safety rules and grounding rules ("answer only from retrieved sources, cite them") in the instructions; use **structured inputs** (\`{{variableName}}\` placeholders) for per-request values such as customer tier so user data never rewrites instructions.
2. **Tool schemas**: each tool needs a precise name, a one-sentence description that says *when* to use it, and JSON Schema parameters with descriptions and \`strict\` validation. Few, distinct tools beat many overlapping ones; put large tool sets in a **Toolbox** with tool search.
3. **Conversation-tracking approach**: the **Responses API conversations** object stores turns server-side (\`openai.conversations.create()\`, then \`responses.create(conversation=conv.id, ...)\`), or chain with \`previous_response_id\`, or keep state in your own store (hosted agents can use a durable state store and standard setup can store conversations in your Cosmos DB). Decide what is per session (conversation), per user (memory) and per organisation (knowledge).
4. **Agent type**: a **prompt agent** (saved, versioned, hosted by Foundry; referenced as \`name:version\`), an **ephemeral agent** (definition lives in your code and is sent on every Responses call; no resource to manage, but no Copilot harness or optimizer), a **voice-based prompt agent**, or a **hosted agent** (your container, for custom frameworks and protocols).

The classic Agents API (threads, messages, runs, \`create_agent\`) is deprecated and retires in March 2027; the mapping is thread → conversation, message → item, run → response, assistant → agent version.`,
    },
    {
      heading: 'Creating and calling a prompt agent',
      body: `With **azure-ai-projects 2.x**:

\`\`\`python
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import PromptAgentDefinition, FunctionTool, FileSearchTool
project = AIProjectClient(endpoint=PROJECT_ENDPOINT, credential=DefaultAzureCredential())

agent = project.agents.create_version(
    agent_name="support-agent",
    definition=PromptAgentDefinition(
        model="gpt-5-mini",
        instructions="You resolve order issues. Look orders up before answering.",
        tools=[get_order_tool, FileSearchTool(vector_store_ids=[vs.id])],
    ),
)
openai = project.get_openai_client(agent_name="support-agent")   # bound to the agent
conv = openai.conversations.create()
r = openai.responses.create(conversation=conv.id, input="Where is order 1234?")
\`\`\`

Each \`create_version\` call creates a new immutable version; the stable endpoint serves the **active version**. When the response contains a \`function_call\` item, your application executes the function and sends a \`function_call_output\` back in the same conversation; hosted tools (file search, web search, code interpreter, MCP, image generation, SharePoint, Fabric) run inside the service. Permissions: the developer needs **Foundry User** on the project; the agent gets an **Entra agent identity** that you grant roles on resources it touches; apps that only call the agent get **Foundry Agent Consumer**.

The **ephemeral** pattern uses Microsoft Agent Framework: \`Agent(client=FoundryChatClient(project_endpoint=..., model=..., credential=...), instructions=..., tools=[get_weather])\` with \`@tool\` decorated functions (\`approval_mode="always_require"\` for human approval). The same code can later be packaged as a hosted agent with \`ResponsesHostServer\` and \`azd ai agent\` commands. Test in the **agents playground**, inspect **traces**, run **evaluations**, then **publish** to Microsoft 365 Copilot and Teams or expose the endpoint (optionally as an A2A endpoint).`,
    },
    {
      heading: 'Retrieval, function calling and memory in one agent',
      body: `Grounded, capable, personal agents combine three integrations.

**Retrieval**
- **File search**: \`openai.vector_stores.create()\`, \`vector_stores.files.upload_and_poll(...)\`, then \`FileSearchTool(vector_store_ids=[...])\`. Best for a bounded set of documents; the service chunks, embeds and searches.
- **Azure AI Search tool**: \`AzureAISearchTool(azure_ai_search=AzureAISearchToolResource(project_connection_id=conn.id, index_name=..., query_type=AzureAISearchQueryType.SIMPLE|SEMANTIC|VECTOR|VECTOR_SIMPLE_HYBRID|VECTOR_SEMANTIC_HYBRID))\` over your own index, resolved through a project connection (managed identity required for private networks).
- **Foundry IQ knowledge base**: connect through MCP (\`MCPTool(server_url=".../knowledgebases/<kb>/mcp?api-version=...", allowed_tools=["knowledge_base_retrieve"], project_connection_id=...)\`) for agentic, permission-aware retrieval across many sources.
- **SharePoint**, **Fabric data agent**, **Work IQ** and **web search / Grounding with Bing** tools cover live organisational and public data.

**Function calling**: \`FunctionTool(name, description, parameters, strict=True)\` for prompt agents; the model emits the call, you execute. For deterministic back ends use **OpenAPI tools** (spec with operationIds, auth via connection: anonymous, API key or project managed identity) or **Azure Functions** tools (queue-triggered), and **MCP tools** for anything that already speaks MCP, including the 1,000+ managed connectors and the Foundry Tools MCP servers (Azure Speech, Azure Language). **Code interpreter** runs Python in a sandbox for maths, charts and file transformations.

**Conversation memory**: short-term context is the conversation; long-term, cross-session memory is **Foundry Memory (preview)**: create a store with \`project.beta.memory_stores.create(name, chat_model, embedding_model)\` and attach \`MemorySearchPreviewTool(memory_store_name=..., scope="{{$userId}}")\` so each user's memories stay isolated. The service extracts user-profile, chat-summary and procedural memories, consolidates them and retrieves relevant ones per turn; direct remember/forget commands and item CRUD exist for compliance. Use file search for documents the user brings, a knowledge base for organisational content, memory for what the agent learns about a user.`,
    },
    {
      heading: 'Integrating tools well, and the exam angle',
      body: `Tool integration checklist that recurs in scenario items:

- **Pick the integration by what already exists**: REST with OpenAPI spec → OpenAPI tool; MCP server → MCP tool (via Toolbox when shared); custom Python logic → function tool (prompt agent) or \`@tool\` (Agent Framework); event-driven back ends → Azure Functions tool; another agent → A2A tool; documents → file search or knowledge base; live web → web search; data analysis → code interpreter; multimodal file understanding → Content Understanding (prebuilt-documentSearch, prebuilt-videoSearch) ahead of retrieval or as an MCP/function tool; speech or language perception → Foundry Tools MCP servers.
- **Authentication**: connections hold credentials; prefer project managed identity or the agent identity; use **user delegation** when the downstream service must apply the signed-in user's permissions (SharePoint, Graph).
- **Governance**: \`allowed_tools\` (empty list = all), \`require_approval\`, guardrails at tool call and tool response, Toolbox versioning, AI gateway for MCP.
- **Reliability**: idempotent tools, retries, timeouts, structured inputs for runtime configuration (vector store ids, MCP headers), and tracing so you can see every call.
- **Regions and tiers**: some tools (MCP, browser automation) require specific regions or the Agent Service Enterprise tier; the Azure AI Search tool over a private network needs managed-identity auth on the connection.

Typical framings: "agent must answer from 50 PDFs uploaded by the user this session" → file search; "must query the sales index with semantic ranking" → Azure AI Search tool with VECTOR_SEMANTIC_HYBRID; "remember a traveller's preferences across devices" → Memory with per-user scope; "call the internal CRM that has a Swagger file" → OpenAPI tool with managed identity connection; "run statistics on an uploaded CSV and chart it" → code interpreter; "consume the same curated tools in a LangGraph agent and a Foundry agent" → Toolbox.`,
    },
  ],
  examples: [
    {
      title: 'Prompt agent with function calling and a conversation',
      description:
        'An order-support agent gets a strict function tool. The app handles the function_call item, runs the lookup, posts the output back into the same conversation, and the agent completes the answer.',
      language: 'python',
      code: `from azure.ai.projects.models import PromptAgentDefinition, FunctionTool
from openai.types.responses.response_input_param import FunctionCallOutput

order_tool = FunctionTool(
    name="get_order", description="Look up the status of an order by its id.", strict=True,
    parameters={"type": "object", "properties": {"order_id": {"type": "string"}},
                "required": ["order_id"], "additionalProperties": False})

project.agents.create_version(agent_name="order-agent", definition=PromptAgentDefinition(
    model="gpt-5-mini", instructions="Resolve order questions. Always look the order up first.",
    tools=[order_tool]))
openai = project.get_openai_client(agent_name="order-agent")
conv = openai.conversations.create()

r = openai.responses.create(conversation=conv.id, input="Where is order A-1234?")
calls = [i for i in r.output if i.type == "function_call"]
if calls:
    outputs = [FunctionCallOutput(type="function_call_output", call_id=c.call_id,
               output=json.dumps(lookup_order(**json.loads(c.arguments)))) for c in calls]
    r = openai.responses.create(conversation=conv.id, input=outputs)
print(r.output_text)`,
      takeaway: 'The service runs the agent loop and conversation; your code only executes function tools and returns their outputs in the same conversation.',
    },
    {
      title: 'Retrieval plus memory: file search and a per-user memory store',
      description:
        'A benefits assistant answers from uploaded HR policies with file search and remembers each employee\'s stated preferences across sessions with a memory store scoped to the user id.',
      language: 'python',
      code: `from azure.ai.projects.models import (PromptAgentDefinition, FileSearchTool,
                                      MemorySearchPreviewTool)

# Documents the organisation supplies -> vector store + file search
vs = openai.vector_stores.create(name="hr-policies")
openai.vector_stores.files.upload_and_poll(vector_store_id=vs.id, file=open("benefits.pdf", "rb"))

# What the agent learns about each user -> memory store, isolated per user
store = project.beta.memory_stores.create(
    name="hr-memory", chat_model="gpt-5-mini", embedding_model="text-embedding-3-small")

project.agents.create_version(agent_name="hr-agent", definition=PromptAgentDefinition(
    model="gpt-5-mini",
    instructions="Answer benefits questions from the policy files; personalise using memory.",
    tools=[FileSearchTool(vector_store_ids=[vs.id]),
           MemorySearchPreviewTool(memory_store_name=store.name, scope="{{$userId}}")]))`,
      takeaway: 'Separate the three context stores: file search for documents, memory for user-specific facts across sessions, the conversation for the current session.',
    },
    {
      title: 'The over-broad MCP tool (a realistic mistake)',
      description:
        'A developer attaches a company MCP server with allowed_tools=[] believing it disables tools. It actually exposes all 40 tools, including delete operations, and the agent deletes a record while "cleaning up". The fix restricts allowed_tools to the read operations, requires approval for anything else, and routes the server through a Toolbox so other agents inherit the same policy.',
      language: 'python',
      code: `from azure.ai.projects.models import MCPTool

# Wrong: empty list means ALL tools are allowed
# tool = MCPTool(server_label="crm", server_url=CRM_MCP, allowed_tools=[])

# Right: explicit allow-list and approval for writes
tool = MCPTool(
    server_label="crm",
    server_url=CRM_MCP,
    allowed_tools=["search_accounts", "get_account", "update_account_notes"],
    require_approval="always",            # or {"never": {"tool_names": ["search_accounts"]}}
    project_connection_id=CRM_CONNECTION_NAME,
)`,
      takeaway: 'Treat tool access as an allow-list with approvals for writes; an empty allowed_tools list is the opposite of locked down.',
    },
  ],
  keyPoints: [
    'An agent is model + instructions + tools run by a managed loop; define role and goals, tool schemas, conversation-tracking approach and agent type before coding.',
    'Prompt agents are saved, immutable versions (name:version) created with project.agents.create_version(PromptAgentDefinition(...)); ephemeral agents send their definition on each Responses call; hosted agents run your container.',
    'Conversations are server-side state: openai.conversations.create() then responses.create(conversation=...); previous_response_id chains turns without a conversation object.',
    'Function tools return function_call items that your code executes and answers with function_call_output in the same conversation; hosted tools run inside the service.',
    'Retrieval options: file search (vector stores), Azure AI Search tool with query types up to VECTOR_SEMANTIC_HYBRID via a project connection, Foundry IQ knowledge base through MCP, SharePoint, Fabric, Work IQ and web search.',
    'Memory (preview): create a memory store with chat and embedding models and attach MemorySearchPreviewTool scoped to {{$userId}} for per-user long-term memory.',
    'Integrate by what exists: OpenAPI spec → OpenAPI tool, MCP server → MCP tool (via Toolbox when shared), custom code → function tool, events → Azure Functions, other agents → A2A, analysis → code interpreter.',
    'Govern tools with allowed_tools (empty = all), require_approval, connections with managed or agent identity, user delegation for per-user permissions, and tracing.',
  ],
  flashcards: [
    { front: 'What three parts define a prompt agent in Foundry Agent Service?', back: 'A model deployment, instructions (role, goals, boundaries, format) and tools (plus optional skills, toolboxes and structured inputs).' },
    { front: 'How does the new Agents API map the classic thread, message, run and assistant concepts?', back: 'Thread → conversation, message → item, run → response, assistant → agent version.' },
    { front: 'Which SDK call creates or updates a prompt agent?', back: 'project.agents.create_version(agent_name=..., definition=PromptAgentDefinition(model=..., instructions=..., tools=[...])), producing a new immutable version.' },
    { front: 'How do you bind an OpenAI client to a specific agent?', back: 'project.get_openai_client(agent_name="...") then call responses.create with a conversation id.' },
    { front: 'What is an ephemeral agent?', back: 'An agent whose definition lives in application code and is sent with each Responses API call (for example Agent Framework FoundryChatClient); no saved resource, so no Copilot harness or optimizer.' },
    { front: 'Which Azure AI Search tool query type combines vectors, keywords and semantic reranking?', back: 'AzureAISearchQueryType.VECTOR_SEMANTIC_HYBRID.' },
    { front: 'Which tool gives a prompt agent long-term, per-user memory?', back: 'MemorySearchPreviewTool attached to a memory store, with scope set to {{$userId}} for per-user isolation.' },
    { front: 'Which tool should you use for an internal REST service with a Swagger/OpenAPI definition?', back: 'The OpenAPI tool with a project connection (anonymous, API key or project managed identity).' },
    { front: 'What does require_approval="always" on an MCPTool cause?', back: 'The agent emits mcp_approval_request items that a human must answer with mcp_approval_response in the same conversation before the tool runs.' },
    { front: 'Which tool executes Python in a sandbox for data analysis and charts?', back: 'Code interpreter (CodeInterpreterTool with an auto container and optional file ids).' },
    { front: 'When is the classic Agents API (threads, runs) retired?', back: 'March 31, 2027; migrate to the new Foundry Agent Service and Responses API.' },
  ],
  quiz: [
    {
      question:
        'A customer-service agent must answer from 30 product manuals that the company maintains, call an internal shipping API described by an OpenAPI 3.1 file, and remember each customer\'s preferred contact channel across sessions. Which combination of tools fits?',
      options: [
        'Code interpreter, web search and a longer system prompt.',
        'File search over a vector store of the manuals, an OpenAPI tool for shipping, and the memory search tool scoped per user.',
        'Azure AI Search tool, Azure Functions tool and structured inputs.',
        'Grounding with Bing, an MCP tool and conversations only.',
      ],
      correct: [1],
      explanation:
        'File search fits a bounded document set, the OpenAPI tool consumes the API spec directly, and memory provides cross-session user context. The other options either lack memory or use tools for the wrong job.',
    },
    {
      question: 'Which TWO statements about conversations in the Responses API are correct? (Select two)',
      options: [
        'A conversation stores turns server-side so the client does not resend history.',
        'The client must replay all previous messages on every call.',
        'previous_response_id can chain turns without creating a conversation object.',
        'Conversations are only available for hosted agents.',
      ],
      correct: [0, 2],
      explanation:
        'Conversations and previous_response_id both avoid replaying history and work for prompt and ephemeral agents alike. Replaying history is the pattern the Responses API replaces.',
    },
    {
      question:
        'An agent must search a product index with semantic reranking and the index lives behind a private endpoint. What should you configure?',
      options: [
        'The file search tool with the index exported to PDF.',
        'The Azure AI Search tool with a project connection using managed identity and query type VECTOR_SEMANTIC_HYBRID.',
        'The web search tool with a domain filter.',
        'Code interpreter calling the search REST API with an admin key.',
      ],
      correct: [1],
      explanation:
        'The AI Search tool targets your index and supports semantic hybrid queries; private networking requires managed-identity authentication on the connection. The other options bypass the index or embed secrets.',
    },
    {
      question: 'A developer sets allowed_tools=[] on an MCP tool to disable all operations during testing. What actually happens?',
      options: [
        'No tools are exposed.',
        'All tools exposed by the MCP server become available to the agent.',
        'Only read-only tools are exposed.',
        'The agent creation fails validation.',
      ],
      correct: [1],
      explanation:
        'An empty allowed_tools list means no restriction; to limit access, list the tool names explicitly.',
    },
    {
      question: 'Which agent type should a team choose when it needs to run its own LangGraph orchestration code with custom middleware but wants Foundry to provide the endpoint, identity and scaling?',
      options: ['Prompt agent', 'Voice-based prompt agent', 'Hosted agent', 'Ephemeral agent via the Azure OpenAI endpoint'],
      correct: [2],
      explanation:
        'Hosted agents run your container and framework with a managed endpoint and identity. Prompt agents are declarative, voice agents are for speech, and the ephemeral pattern runs in your own process without a Foundry endpoint.',
    },
  ],
  statements: [
    { text: 'Saving a change to a prompt agent overwrites the existing version in place.', isTrue: false, explanation: 'Each save creates a new immutable version; the stable endpoint serves the active version.' },
    { text: 'Hosted tools such as file search and code interpreter execute inside Foundry Agent Service without client-side handling.', isTrue: true, explanation: 'Only function tools require the application to execute code and return outputs.' },
    { text: 'The memory search tool scope {{$userId}} isolates memories per end user automatically.', isTrue: true, explanation: 'The system resolves the end user identity at runtime so memories are partitioned per user.' },
    { text: 'The classic Agents API with threads, messages and runs is the recommended API for new Foundry agents.', isTrue: false, explanation: 'It is deprecated and retires in March 2027; use the new Agent Service and Responses API.' },
    { text: 'An OpenAPI tool requires every operation in the specification to have an operationId.', isTrue: true, explanation: 'operationIds are required and may contain only letters, hyphens and underscores.' },
    { text: 'Foundry IQ knowledge bases are attached to prompt agents through an MCP tool that exposes knowledge_base_retrieve.', isTrue: true, explanation: 'The knowledge base MCP endpoint is referenced through a RemoteTool project connection.' },
    { text: 'Ephemeral agents built with Agent Framework can use the prompt-agent optimizer and the Copilot harness.', isTrue: false, explanation: 'Those features require a saved, versioned prompt agent.' },
  ],
  resources: [
    { label: 'Foundry Agent Service overview', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/overview' },
    { label: 'What are prompt agents?', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/prompt-agents' },
    { label: 'Quickstart: Build agents using the Responses API', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/responses-api' },
    { label: 'Memory in Foundry Agent Service (preview)', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory' },
  ],
};

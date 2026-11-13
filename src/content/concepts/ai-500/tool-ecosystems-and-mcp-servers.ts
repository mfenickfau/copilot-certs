import type { Concept } from '../../types';

export const toolEcosystemsAndMcpServers: Concept = {
  id: 'tool-ecosystems-and-mcp-servers',
  title: 'Tool Ecosystems: Function Calling, MCP Servers, Error Handling and Result Validation',
  summary:
    'Building the tool layer of a multi-agent system: function calling with strict schemas, specified versus dynamic tool use (tool_choice, progressive exposure, tool search), designing and hosting MCP servers and clients on Azure Functions, Logic Apps and API Management, resilient error handling and fallbacks, and validating tool results before an agent acts on them.',
  certs: ['ai-500'],
  domains: ['ai-500-2'],
  outcomes: ['ai-500-2-3-1', 'ai-500-2-3-2', 'ai-500-2-3-3', 'ai-500-2-3-4'],
  tags: ['function-calling', 'mcp', 'azure-functions', 'logic-apps', 'api-management', 'toolbox', 'error-handling', 'validation', 'agent-framework'],
  difficulty: 'advanced',
  diagram: 'tool-use-sequence',
  sections: [
    {
      heading: 'Function calling: specified, dynamic and progressive tool use',
      body: `A tool is a name, a description and a JSON-schema parameter block. The model never executes anything; it emits a *tool call* and your runtime executes it and returns the output. In Foundry prompt agents you define \`FunctionTool\` entries (set \`strict=True\` so arguments must match the schema exactly; the Copilot harness rejects strict), process \`function_call\` items from the Responses API, and submit \`function_call_output\` items in the same conversation before the run expires (ten minutes). In Agent Framework a Python function decorated with \`@tool\` becomes a tool whose docstring and annotations generate the schema, and the framework runs the call loop for you.

How much freedom the model has is a design decision:

- **Specified tool use**: \`tool_choice="required"\` forces a tool call (or a specific tool as the first call); \`"none"\` forbids tools for a turn. Use it for deterministic steps such as "always look up the order before answering".
- **Dynamic tool use**: \`tool_choice="auto"\` lets the model decide from the tools it can see. Keep that set small and well described; selection accuracy degrades with dozens of overlapping tools.
- **Progressive exposure**: Agent Framework's \`ctx.add_tools()\` / \`remove_tools()\` from inside a tool or function middleware lets a "loader" tool unlock more tools mid-run, or gate \`update_record\` until \`get_record\` has run. Foundry **tool search** does the equivalent at the toolbox level with two meta-tools, \`tool_search\` and \`call_tool\`, so a toolbox can hold hundreds of tools without flooding the context.
- **Approval**: approval-required tools (\`approval_mode="always_require"\`, MCP \`require_approval="always"\`) pause for a human before execution.

Write tool descriptions as decision rules the model can apply ("Use for order status by order_id; do not use for refunds"), return concise structured results, and never put secrets in tool definitions or arguments.`,
    },
    {
      heading: 'Designing and hosting MCP servers and clients on Azure',
      body: `MCP gives every agent runtime the same way to discover and call tools, so wrapping internal systems as MCP servers is the standard integration investment. Azure offers three hosting routes:

| Host | How | Best for |
|---|---|---|
| **Azure Functions** | \`azd init --template remote-mcp-functions-python\`; tools are functions exposed at \`/runtime/webhooks/mcp\`; auth via function keys (\`x-functions-key\`, maps to key-based in Foundry), Entra built-in auth (use project managed identity), or custom OAuth | Custom servers over internal APIs; scale to zero; identity-based access and VNet integration |
| **Azure Logic Apps (Standard)** | Expose workflows and 1,400+ connectors as an MCP server | Business-system tools (SAP, Salesforce, ServiceNow) without writing connector code |
| **Azure API Management** | Export an existing REST API as an MCP server, or front an existing MCP server with gateway policies | Reusing APIs you already govern; adding rate limits, IP filtering, correlation IDs, token quotas and OAuth; registering in Azure API Center for a private tool catalog |

**Clients.** Foundry prompt agents consume servers with the \`MCPTool\` definition (\`server_label\`, \`server_url\`, \`require_approval\`, \`project_connection_id\` for auth, optional \`allowed_tools\`), ideally through a toolbox. Agent Framework uses \`MCPStreamableHTTPTool\` for remote servers and \`MCPStdioTool\` for local processes, or \`client.get_mcp_tool()\` for Foundry-hosted execution; any Agent Framework agent can itself be exposed as an MCP server. Private servers must sit on a dedicated MCP subnet (Container Apps with internal ingress) in a network-isolated project.

**Security baseline for your own server.** Require authentication, keep secrets in Key Vault, scope downstream permissions to what the exposed tools need, log every tool call, validate inputs server-side, and publish only the tools you intend to expose. Treat third-party servers as untrusted: verify the publisher, prefer first-party hosting over proxies, and review what data your prompts send them.`,
    },
    {
      heading: 'Error handling and fallback design',
      body: `Tools fail in predictable ways: timeouts, 429 throttling, 5xx errors, schema drift, auth expiry, empty results and partial data. A resilient design handles each at the right layer:

- **Transport layer**: retries with exponential backoff and jitter for 429 and 5xx (honour \`Retry-After\`), circuit breakers for repeatedly failing endpoints, and per-call timeouts shorter than the agent run limit. An API Management gateway can centralise retry and load-balancing policies across tool backends.
- **Middleware layer**: Agent Framework **function middleware** wraps every tool call, so one component can catch exceptions, translate them into a safe, model-readable result (\`context.result = "Service unavailable, tell the user to retry later"\`), record metrics and enforce authorization. This keeps raw stack traces out of the model's context and the user's view.
- **Agent layer**: instructions define behaviour on failure ("if a tool returns no results, say what happened and ask a follow-up question"), and fallbacks are explicit: a secondary data source, a cached value with a staleness notice, or escalation to a human via request_info.
- **Workflow layer**: executors catch failures and route to a remediation branch or dead-letter output; checkpoints let a run resume after the dependency recovers instead of restarting; durable task primitives on hosted agents reclaim abandoned work.
- **Guardrail layer**: a blocked tool call or tool response (content safety) halts the agent until new user input; design the UX for that.

Make failure visible: tool-call spans carry status, and the Tool Call Success evaluator and Insights' Tool call failures category reveal patterns such as a tool that fails for one tenant only. Never let an agent silently invent a result when a tool fails; that is the worst fallback.`,
    },
    {
      heading: 'Validating tool results before acting on them',
      body: `Tool outputs are untrusted input, exactly like user text. Validate them before they reach the model or trigger the next action:

1. **Schema validation**: parse results against an expected schema (Pydantic or JSON Schema), allow only known fields, reject unexpected operations. A tool that returns free text should be wrapped to return structure.
2. **Semantic and range checks**: amounts within plausible bounds, dates in range, IDs matching the request, counts consistent with pagination. Cross-check critical values against a second source when the action is consequential.
3. **Injection screening**: scan tool responses for embedded instructions. Foundry's **tool response** intervention point can run indirect-attack and other controls on supported tools; Agent Framework's FIDES labels tool output as untrusted and blocks sensitive tools while untrusted content is in scope; spotlighting marks the content as data for the model.
4. **Provenance and freshness**: carry source, timestamp and confidence through to the response so the writer agent can cite and the UI can disclose staleness.
5. **Act-gating**: require approval before consequential actions that depend on tool data, and compare the proposed action with user intent (Task Adherence) to catch misaligned tool calls such as *change_data_plan* when the user asked for usage.

Quality checks also belong in evaluation: Tool Input Accuracy (correct parameters), Tool Output Utilization (the agent actually used the result correctly) and Tool Call Success (no technical failures) are process evaluators that run offline and on sampled production traffic. Validation code at runtime plus evaluators in the pipeline is the expected answer when the exam asks how to "implement tool result validation and quality checks".`,
    },
  ],
  examples: [
    {
      title: 'Exposing an internal API as an MCP server on Azure Functions and consuming it from Foundry',
      description:
        'A warehouse inventory API is wrapped as a remote MCP server on Azure Functions (scale to zero, Entra authentication), registered in Azure API Center, and connected to a prompt agent through a toolbox with approval required for write tools.',
      language: 'bash',
      code: `# Scaffold and deploy the MCP server (Python) with the Azure Developer CLI
azd init --template remote-mcp-functions-python -e inventory-mcp
func start                       # local test at http://localhost:7071/runtime/webhooks/mcp
azd up                           # deploys Function App; endpoint: https://<app>.azurewebsites.net/runtime/webhooks/mcp

# Register the connection in the Foundry project (Entra auth via project managed identity)
azd ai project set "https://<account>.services.ai.azure.com/api/projects/<project>"
azd ai connection create inventory-mcp \\
  --kind remote-tool \\
  --target https://<app>.azurewebsites.net/runtime/webhooks/mcp \\
  --auth-type project-managed-identity --no-prompt`,
      takeaway: 'Functions give a serverless MCP host with identity-based auth; connections keep credentials out of agents and toolboxes make the server reusable.',
    },
    {
      title: 'Function middleware that turns tool failures into safe, structured results',
      description:
        'In Agent Framework, one middleware wraps every tool call: it retries transient errors with backoff, validates the result against a schema, and replaces failures with a model-readable message instead of a stack trace.',
      language: 'python',
      code: `import asyncio, json
from collections.abc import Awaitable, Callable
from pydantic import BaseModel, ValidationError
from agent_framework import FunctionInvocationContext

class StockResult(BaseModel):
    sku: str
    on_hand: int          # Pydantic enforces type; add validators for ranges

async def resilient_tools(ctx: FunctionInvocationContext, call_next: Callable[[], Awaitable[None]]) -> None:
    for attempt in range(3):
        try:
            await call_next()
            StockResult.model_validate(json.loads(ctx.result))        # schema check before the model sees it
            return
        except TimeoutError:
            await asyncio.sleep(0.5 * 2 ** attempt)                   # backoff on transient failure
        except (ValidationError, json.JSONDecodeError):
            ctx.result = json.dumps({"error": "invalid_tool_output", "tool": ctx.function.name})
            return
    ctx.result = json.dumps({"error": "unavailable", "hint": "Tell the user to retry later."})

# agent = Agent(client=client, tools=[get_stock], middleware=[resilient_tools])`,
      takeaway: 'Centralise retries, schema validation and safe error translation in middleware so every tool gets the same resilience.',
    },
    {
      title: 'The agent that invented a shipping date (a realistic mistake)',
      description:
        'A logistics agent\'s tracking tool began returning HTTP 500 after a vendor change. The raw exception text was passed to the model, which apologised and then produced a plausible-looking delivery date. Customers were told wrong dates for two days. Fixes: middleware converted failures into an explicit error object, instructions required the agent to state that tracking was unavailable and offer escalation, a fallback queried the carrier\'s secondary API, and an alert on the Tool Call Success evaluator now fires when the failure rate exceeds 5%.',
      takeaway: 'Never let a failed tool become a hallucinated answer: structured errors, explicit failure behaviour, a real fallback and a failure-rate alert.',
    },
    {
      title: 'Validating a tool result before a consequential action',
      description:
        'Before issuing a refund based on a lookup, the workflow validates the tool result against the request and policy: same order id, amount within the order total, and the result free of injected instructions, then routes to approval.',
      language: 'python',
      code: `from agent_framework import Executor, WorkflowContext, handler

class ValidateRefund(Executor):
    @handler
    async def check(self, data: dict, ctx: WorkflowContext[dict, str]) -> None:
        order, request = data["order_lookup"], data["request"]
        problems = []
        if order.get("order_id") != request["order_id"]:
            problems.append("order id mismatch")
        if not 0 < request["amount"] <= order.get("total", 0):
            problems.append("amount outside order total")
        if "ignore previous" in json.dumps(order).lower():          # crude injection tripwire
            problems.append("suspicious content in tool output")
        if problems:
            await ctx.yield_output("needs_human: " + "; ".join(problems))
        else:
            await ctx.send_message({**request, "validated": True})   # continue to approval executor`,
      takeaway: 'Check identity, range and content of tool results against the request before any side effect; route doubts to a human.',
    },
  ],
  keyPoints: [
    'Models emit tool calls; your runtime executes them. Use strict JSON schemas, concise action-oriented descriptions and structured outputs; submit function_call_output before the run expires.',
    'Control freedom with tool_choice (auto, required, none), progressive exposure (add_tools/remove_tools, loader and gating patterns) and Foundry tool search (tool_search and call_tool meta-tools).',
    'Host MCP servers on Azure Functions (custom, serverless, identity-based auth), Logic Apps Standard (connectors as tools) or API Management (export REST as MCP, govern existing servers); register in API Center for a private catalog.',
    'Consume MCP with the Foundry MCPTool (server_label, server_url, require_approval, project_connection_id), ideally via a toolbox, or with Agent Framework MCPStreamableHTTPTool/MCPStdioTool.',
    'Handle errors per layer: transport retries and circuit breakers, function middleware that translates exceptions, instruction-level failure behaviour, workflow remediation branches and checkpoints.',
    'Fallbacks must be explicit (secondary source, cached value with staleness notice, human escalation); a failed tool must never become an invented answer.',
    'Validate tool results as untrusted input: schema, range and identity checks, injection screening (tool-response guardrails, FIDES, spotlighting), provenance, and approval before consequential actions.',
    'Measure tool quality with Tool Input Accuracy, Tool Output Utilization and Tool Call Success evaluators offline and on production samples.',
  ],
  flashcards: [
    { front: 'What are the three tool_choice settings and when is each used?', back: 'auto (model decides), required (model must call a tool, deterministic steps), none (no tools this turn).' },
    { front: 'What is progressive tool exposure in Agent Framework?', back: 'Adding or removing tools at runtime from inside a tool or function middleware (ctx.add_tools / remove_tools) so the model sees only tools it is ready to use; the set resets on each new run.' },
    { front: 'Which two meta-tools does Foundry tool search expose?', back: 'tool_search (describe the needed capability, get matching tools via BM25) and call_tool (invoke a discovered tool by name).' },
    { front: 'Name three Azure services for hosting or governing MCP servers.', back: 'Azure Functions (custom servers), Azure Logic Apps Standard (connectors as tools), Azure API Management (export REST as MCP, gateway policies).' },
    { front: 'How does an Azure Functions MCP server\'s function-key auth map to Foundry?', back: 'x-functions-key corresponds to key-based authentication stored in a project connection; Entra built-in auth maps to project managed identity.' },
    { front: 'Which Agent Framework classes connect to remote and local MCP servers?', back: 'MCPStreamableHTTPTool (remote HTTP/SSE) and MCPStdioTool (local process); client.get_mcp_tool() for Foundry-hosted execution.' },
    { front: 'Where should centralised retry, exception translation and authorization for tool calls live in Agent Framework?', back: 'In function (tool-call) middleware that wraps every invocation and can override context.result.' },
    { front: 'What is the worst fallback when a tool fails?', back: 'Letting the model fabricate a plausible answer; instead return a structured error and define explicit failure behaviour and escalation.' },
    { front: 'Which Foundry evaluators assess tool quality?', back: 'Tool Call Accuracy, Tool Selection, Tool Input Accuracy, Tool Output Utilization and Tool Call Success (plus the composite Tool Use Quality).' },
    { front: 'How long does a Foundry agent run wait for function outputs before expiring?', back: 'Runs expire 10 minutes after creation; submit tool outputs before then.' },
    { front: 'Where must a private MCP server run in a network-isolated Foundry project?', back: 'On a dedicated MCP subnet, for example Azure Container Apps with internal-only ingress, reached by agents over the private network.' },
  ],
  quiz: [
    {
      question:
        'A procurement agent must always retrieve the supplier record before answering any supplier question. Which setting enforces this most directly?',
      options: [
        'Set tool_choice to required for the lookup step.',
        'Add "please look up first" to the instructions.',
        'Increase the model temperature.',
        'Set tool_choice to none.',
      ],
      correct: [0],
      explanation:
        'tool_choice=required (or forcing the specific tool first) guarantees a tool call. Instructions are probabilistic, temperature is unrelated, and none forbids tools.',
    },
    {
      question:
        'Your organisation wants ServiceNow, SAP and Salesforce operations available to agents as MCP tools with the least custom code, while platform engineers add rate limits and auditing centrally. Which combination is MOST appropriate?',
      options: [
        'Write a custom Python MCP server for each system on AKS.',
        'Expose the systems through Azure Logic Apps Standard as an MCP server and govern it behind an Azure API Management AI gateway.',
        'Embed each vendor SDK directly in every agent\'s code.',
        'Create one prompt agent per system and chain them with group chat.',
      ],
      correct: [1],
      explanation:
        'Logic Apps connectors become MCP tools without connector code, and API Management applies rate limits and logging centrally. Custom servers on AKS and embedded SDKs maximise code and duplication; agents per system do not address tool exposure.',
    },
    {
      question: 'Which TWO are appropriate places to implement resilience for tool failures? (Select two)',
      options: [
        'Function middleware that retries transient errors and replaces exceptions with structured, model-readable errors.',
        'The model\'s sampling parameters.',
        'A workflow remediation branch that routes failed steps to a fallback source or human escalation.',
        'Removing error text from logs so users do not see it.',
      ],
      correct: [0, 2],
      explanation:
        'Middleware and workflow branches are designed for cross-cutting error handling and fallbacks. Sampling settings do not handle errors, and hiding logs removes observability.',
    },
    {
      question:
        'An agent\'s billing tool started returning a different JSON shape after a vendor update; the agent began reporting wrong totals without any error. What should you have implemented to catch this?',
      options: [
        'Schema validation of tool results (for example with Pydantic) in middleware, failing closed with a structured error when the shape changes.',
        'A longer system prompt describing the expected shape.',
        'Caching of the previous day\'s results.',
        'A higher top_k on retrieval.',
      ],
      correct: [0],
      explanation:
        'Runtime schema validation detects contract drift deterministically. Prompts cannot verify structure, caching masks the problem, and top_k is unrelated.',
    },
    {
      question:
        'A toolbox has grown to 140 tools and agents increasingly select the wrong one while token costs climb. What is the recommended fix?',
      options: [
        'Split into 140 separate agents.',
        'Enable tool search on the toolbox so agents discover relevant tools on demand through tool_search and call_tool.',
        'Raise the model\'s context window.',
        'Set tool_choice to required.',
      ],
      correct: [1],
      explanation:
        'Tool search hides tools by default and surfaces only matches, keeping context small and selection accurate. More agents or context adds cost without fixing selection, and required forces calls without improving choice.',
    },
    {
      question:
        'An MCP server for an internal HR API will run on Azure Functions. Security asks for no shared secrets and per-agent auditability. Which configuration should you choose?',
      options: [
        'Function keys shared through a project connection.',
        'Microsoft Entra built-in authentication on the Function App with agents authenticating via identity (managed identity or agent identity) configured on the connection.',
        'Anonymous access with IP filtering only.',
        'A PAT embedded in each agent\'s instructions.',
      ],
      correct: [1],
      explanation:
        'Entra authentication removes shared secrets and gives per-identity audit. Keys are shared secrets, anonymous access is insecure, and secrets in prompts are a critical anti-pattern.',
    },
  ],
  statements: [
    { text: 'In function calling, the model executes the function itself and returns the result.', isTrue: false, explanation: 'The model emits a tool call; your application or the hosted runtime executes it and returns the output.' },
    { text: 'Foundry tool search uses BM25 ranking over tool names, descriptions and parameters to return the best matching tools for a query.', isTrue: true, explanation: 'tool_search returns up to 10 matches (default 5) and call_tool invokes them.' },
    { text: 'Azure API Management can expose an existing REST API as an MCP server without rewriting the API.', isTrue: true, explanation: 'This is part of the AI gateway capabilities, alongside governing existing MCP servers.' },
    { text: 'Tool outputs can be trusted without validation because they come from systems you control.', isTrue: false, explanation: 'Tool outputs are untrusted input; validate schema, ranges and content, and screen for injected instructions.' },
    { text: 'Agent Framework function middleware can replace a failing tool\'s result with a safe message before the model sees it.', isTrue: true, explanation: 'Setting context.result in the middleware overrides the function result.' },
    { text: 'The Copilot harness for prompt agents supports strict function schemas (strict: true).', isTrue: false, explanation: 'The harness rejects strict: true; omit strict or set it to false for harness agents.' },
    { text: 'Tool Call Success is a Foundry evaluator that detects technical failures in tool execution.', isTrue: true, explanation: 'It is a process evaluator complementing Tool Input Accuracy and Tool Output Utilization.' },
  ],
  resources: [
    { label: 'Use function calling with Microsoft Foundry agents', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/function-calling' },
    { label: 'Build and register an MCP server (Azure Functions, API Center, Foundry)', url: 'https://learn.microsoft.com/en-us/azure/foundry/mcp/build-your-own-mcp-server' },
    { label: 'Expose and govern MCP servers in Azure API Management', url: 'https://learn.microsoft.com/en-us/azure/api-management/mcp-server-overview' },
    { label: 'Tool best practices for Foundry Agent Service', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/tool-best-practice' },
  ],
};

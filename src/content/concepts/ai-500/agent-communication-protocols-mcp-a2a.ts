import type { Concept } from '../../types';

export const agentCommunicationProtocolsMcpA2a: Concept = {
  id: 'agent-communication-protocols-mcp-a2a',
  title: 'Agent Communication Protocols: MCP, A2A and Integration Components',
  summary:
    'Choosing the right protocol for each link in a multi-agent system: MCP for agent-to-tool and agent-to-knowledge access, Agent2Agent (A2A) for agent-to-agent delegation across runtimes, the Responses and Invocations protocols at the Foundry hosted-agent boundary, and the integration components (toolboxes, connections, gateways, agent cards) that make those links secure and governable in production.',
  certs: ['ai-500'],
  domains: ['ai-500-1', 'ai-500-2'],
  outcomes: ['ai-500-1-1-5', 'ai-500-1-2-1', 'ai-500-2-4-5'],
  tags: ['mcp', 'a2a', 'protocols', 'foundry-agent-service', 'toolbox', 'agent-framework', 'integration'],
  difficulty: 'advanced',
  diagram: 'mcp-architecture',
  sections: [
    {
      heading: 'One protocol per kind of link',
      body: `A production multi-agent system has four kinds of links, and the exam expects you to name the right protocol for each:

| Link | Protocol | Typical implementation |
|---|---|---|
| Agent to tool or data source | **Model Context Protocol (MCP)** | Remote MCP servers (Streamable HTTP), Foundry Toolbox endpoint, Azure Functions or API Management exposing APIs as MCP |
| Agent to another agent (peer or remote) | **Agent2Agent (A2A)** | Foundry A2A tool calling an agent card; Agent Framework \`A2AAgent\`; Foundry agents exposing incoming A2A |
| Client or orchestrator to a Foundry agent | **Responses protocol** (OpenAI-compatible) or **Invocations** (custom JSON, webhooks) | Hosted agents expose one or more; Teams or Microsoft 365 channels bridge Responses to the Activity protocol |
| Inside one framework process | In-process calls | Agent Framework workflows, agents-as-tools, sub-workflows |

MCP standardises *tools, resources and prompts* that a model can use; it is deliberately tool-shaped (name, JSON-schema parameters, result). A2A standardises *agent discovery and task delegation*: a remote agent publishes an **agent card** (description, skills, supported protocol bindings such as JSON-RPC or HTTP+JSON) at a well-known URI, and callers send tasks, stream updates over Server-Sent Events, and poll long-running tasks via continuation tokens. The practical rule: wrap *capabilities* as MCP tools, wrap *autonomous collaborators that keep their own state and reasoning* as A2A agents. Many systems use both: an orchestrator calls a remote A2A specialist, and that specialist calls MCP tools.`,
    },
    {
      heading: 'Integration components in Foundry Agent Service',
      body: `Foundry packages the plumbing you would otherwise build:

- **Toolboxes** curate tools once (web search, file search, code interpreter, MCP servers, OpenAPI, A2A connections) and expose them through a single MCP-compatible endpoint with centralised authentication, guardrails, versioning and **tool search**. Any MCP-capable runtime, including Agent Framework and LangGraph, can consume a toolbox, so it is the recommended way to route agent-to-tool and agent-to-knowledge traffic in a fleet. Promoting a new toolbox version updates every consuming agent without redeploying them.
- **Project connections** hold the credentials and target for an MCP or A2A endpoint (\`--kind remote-tool\`), so agent code never sees secrets. Authentication is a property of the connection: key-based, project managed identity, agent identity, user delegation (\`UserEntraToken\`, \`AgentOnBehalfOfUser\`) or OAuth identity passthrough.
- **AI Gateway (Azure API Management)** sits in front of MCP tools and models to enforce rate limits, IP filtering, correlation IDs and token quotas, and can export REST APIs as MCP servers or import A2A agent APIs.
- **Knowledge routing** uses Foundry IQ knowledge bases, which an agent reaches over MCP; the knowledge base plans subqueries, runs them in parallel across sources and returns cited grounding, so knowledge-source routing is a retrieval concern rather than orchestration code.

The old classic *Connected Agents* tool is not available in the new Foundry Agent Service; agent-to-agent composition now uses the A2A tool, Agent Framework workflows, or agents-as-tools.`,
    },
    {
      heading: 'Integrating existing agents securely with A2A and MCP',
      body: `Bringing an existing agent into a multi-agent solution means wrapping it behind a protocol, trusting it appropriately and authenticating it correctly.

**Exposing a Foundry agent over A2A.** Enable incoming A2A on a prompt agent by patching its endpoint with \`protocol_configuration\` containing both \`responses\` and \`a2a\`, and publish an **agent card** with a description and skills. The base path is \`.../agents/{agent}/endpoint/protocols/a2a\`. Callers need the **Foundry Agent Consumer** role (least privilege for invoking, not managing) or higher on the target project. Current Foundry A2A targets support protocol 1.0 (JSON-RPC), text modality only, and no streaming.

**Calling a remote A2A agent.** Create an A2A project connection, then add an \`A2ATool\` (or an A2A toolbox tool) to the calling agent. Pick the authentication behaviour deliberately: the calling agent's own identity for app-only calls, \`UserEntraToken\` or \`AgentOnBehalfOfUser\` to preserve the end user's context, OAuth passthrough when each user must sign in to the remote provider. In Agent Framework, \`A2AAgent(url=...)\` or \`A2AAgent(agent_card=...)\` wraps the remote agent as an ordinary agent you can place in a workflow.

**Trust boundaries.** Treat anything returned by a remote agent or MCP server as untrusted data: it can carry indirect prompt-injection payloads. Verify you trust the publisher and endpoint, prefer first-party hosted servers over proxies, log what you send, and apply tool-response guardrails (indirect attack detection) at the Foundry intervention point. For user-scoped data, never fall back to an application identity when delegated access fails; that silently widens access.`,
    },
    {
      heading: 'Choosing the hosted-agent boundary protocol',
      body: `When your own code is the agent, Foundry hosted agents let you choose how callers reach it:

- **Responses**: for conversational agents. The platform manages conversation history, streaming events, session lifecycle and background mode, and any OpenAI-compatible SDK can be the client. Publishing to Teams or Microsoft 365 automatically bridges Responses to the Activity protocol.
- **Invocations**: for webhooks and non-conversational processing where the external system dictates the payload (GitHub, Stripe, Jira events; classification jobs). Arbitrary JSON in, arbitrary JSON out; your container owns conversation state. Guardrails need explicit moderation settings to know where the text lives.
- **Invocations (WebSocket)**: custom streaming such as AG-UI or voice pipelines; content moderation is not available on this protocol.

Agent Framework supplies protocol adapters (\`ResponsesHostServer\`, \`InvocationsHostServer\`), and \`langchain-azure-ai[hosting]\` does the same for LangGraph, so framework choice does not change the protocol decision. In a layered design the exam expects: clients and channels speak Responses or Invocations to the orchestrator; the orchestrator delegates to peers over A2A or in-process workflow edges; every agent reaches tools and knowledge over MCP, ideally through a toolbox behind an AI gateway.`,
    },
  ],
  examples: [
    {
      title: 'Exposing an existing Foundry agent as an A2A endpoint',
      description:
        'A compliance team already runs a "policy-lookup" prompt agent. Rather than rebuild it inside a new procurement orchestrator, they enable incoming A2A and publish an agent card so the orchestrator (and any A2A-capable runtime) can discover and call it.',
      language: 'python',
      code: `from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import (
    A2AProtocolConfiguration, AgentCard, AgentCardSkill, AgentEndpointConfig,
    ProtocolConfiguration, ResponsesProtocolConfiguration,
)

project = AIProjectClient(endpoint=PROJECT_ENDPOINT, credential=DefaultAzureCredential())

project.agents.update_details(
    agent_name="policy-lookup",
    agent_endpoint=AgentEndpointConfig(
        protocol_configuration=ProtocolConfiguration(
            responses=ResponsesProtocolConfiguration(),
            a2a=A2AProtocolConfiguration(),      # incoming A2A requires Responses too
        ),
    ),
    agent_card=AgentCard(
        version="1.0",
        description="Answers questions about Contoso procurement policy.",
        skills=[AgentCardSkill(id="policy-qa", name="Policy Q&A",
                               description="Cites the governing policy clause.")],
    ),
)
# Callers need Foundry Agent Consumer (or higher) on this project.`,
      takeaway: 'Incoming A2A = Responses plus A2A protocol configuration plus an agent card; authorise callers with the least-privilege Foundry Agent Consumer role.',
    },
    {
      title: 'Consuming a remote A2A specialist from an Agent Framework workflow',
      description:
        'The procurement orchestrator built with Agent Framework wraps the remote policy agent as an A2AAgent and places it in a sequential workflow after an intake agent, so the remote agent is just another participant.',
      language: 'python',
      code: `import httpx
from a2a.client import A2ACardResolver
from agent_framework.a2a import A2AAgent
from agent_framework.orchestrations import SequentialBuilder

async def build_workflow(intake_agent):
    async with httpx.AsyncClient(timeout=60.0) as http:
        resolver = A2ACardResolver(httpx_client=http, base_url="https://policy.contoso.example")
        card = await resolver.get_agent_card()        # /.well-known discovery
    policy_agent = A2AAgent(agent_card=card)          # negotiates transport from the card
    # intake -> remote policy specialist; the remote agent keeps its own reasoning and state
    return SequentialBuilder(participants=[intake_agent, policy_agent]).build()`,
      takeaway: 'A2AAgent turns any A2A endpoint into a first-class participant; discovery via agent card avoids hard-coding capabilities.',
    },
    {
      title: 'Using MCP where A2A was intended (a realistic mistake)',
      description:
        'A team wrapped a long-running "contract-review agent" as a single MCP tool called review_contract. Calls timed out, there was no way to stream progress or ask the reviewer follow-up questions, and the tool result was pasted verbatim into the caller\'s context, including an injected instruction hidden in a contract. The fix: expose the reviewer over A2A (task lifecycle, streaming, continuation tokens for long tasks), keep genuinely tool-shaped capabilities (clause extraction) as MCP tools, and add a tool-response guardrail for indirect attacks.',
      takeaway: 'MCP is for stateless, tool-shaped capabilities; A2A is for autonomous collaborators with task lifecycles. Treat both results as untrusted input.',
    },
    {
      title: 'Centralising tool access through a toolbox',
      description:
        'Six agents each configured their own GitHub MCP connection with a shared personal access token stored in code. Security flagged the duplicated secret. The platform team created a Foundry toolbox containing the GitHub MCP server with a project connection using OAuth identity passthrough, enabled tool search, and pointed all six agents at the toolbox endpoint. Rotating credentials and adding tools now happens in one place without redeploying agents.',
      takeaway: 'Toolboxes centralise authentication, governance and versioning for MCP and A2A tools behind one endpoint.',
    },
  ],
  keyPoints: [
    'MCP standardises agent-to-tool and agent-to-knowledge access; A2A standardises agent-to-agent discovery (agent card) and task delegation across runtimes.',
    'Foundry hosted agents expose Responses (conversational, platform-managed history) or Invocations (custom JSON, webhooks); Teams and Microsoft 365 bridge Responses to Activity.',
    'Foundry Toolboxes expose curated tools, MCP servers, OpenAPI and A2A connections through one MCP-compatible endpoint with central auth, guardrails, versioning and tool search.',
    'Authentication lives on project connections (key, project managed identity, agent identity, UserEntraToken/AgentOnBehalfOfUser, OAuth passthrough), never in agent code.',
    'To expose a Foundry agent over A2A: configure both responses and a2a protocols, publish an agent card, and grant callers Foundry Agent Consumer.',
    'Classic Connected Agents is not available in the new Agent Service; use the A2A tool, Agent Framework workflows or agents-as-tools.',
    'Results from remote agents and MCP servers are untrusted; apply tool-response guardrails and never fall back to app-only identity when delegation fails.',
    'An AI gateway (API Management) adds rate limits, IP filtering, correlation IDs and token quotas in front of MCP tools and models.',
  ],
  flashcards: [
    { front: 'Which protocol is designed for agent-to-tool access?', back: 'Model Context Protocol (MCP): tools, resources and prompts with JSON-schema parameters.' },
    { front: 'Which protocol is designed for agent-to-agent delegation across runtimes?', back: 'Agent2Agent (A2A): agent cards for discovery, tasks with streaming and continuation tokens for long-running work.' },
    { front: 'What is an A2A agent card?', back: 'A published description of an agent (description, version, skills, supported protocol bindings) typically served at a well-known URI so callers can discover and call it.' },
    { front: 'What must be configured to enable incoming A2A on a Foundry prompt agent?', back: 'The agent endpoint protocol_configuration with both responses and a2a, plus an agent card; callers need Foundry Agent Consumer or higher.' },
    { front: 'What replaced the classic Connected Agents tool?', back: 'The A2A tool (including Foundry agents exposed as A2A endpoints), Agent Framework workflows, and agents-as-tools.' },
    { front: 'What is a Foundry Toolbox?', back: 'A curated, versioned set of tools (MCP servers, OpenAPI, search, code interpreter, A2A) exposed through one MCP-compatible endpoint with centralised authentication, guardrails and tool search.' },
    { front: 'When should a hosted agent use the Invocations protocol instead of Responses?', back: 'When an external system dictates the payload (webhooks) or the work is non-conversational structured processing; Responses is for OpenAI-compatible chat with platform-managed history.' },
    { front: 'Which Agent Framework class wraps a remote A2A endpoint as an agent?', back: 'A2AAgent (agent_framework.a2a), created from a URL or an AgentCard.' },
    { front: 'Where does authentication for an MCP or A2A tool live in Foundry?', back: 'On the project connection (auth type such as custom-keys, project-managed-identity, agentic-identity, oauth2, user-entra-token), not in agent code.' },
    { front: 'What role does an AI gateway play for MCP tools?', back: 'A governed entry point in API Management enforcing rate limits, IP filtering, correlation IDs, header hygiene and token quotas without changing servers or agents.' },
  ],
  quiz: [
    {
      question:
        'Contoso has an existing claims-assessment agent built with LangGraph and hosted outside Foundry. A new Foundry orchestrator must delegate complex claims to it, receive streamed progress, and poll long-running assessments. Which integration approach is MOST appropriate?',
      options: [
        'Wrap the LangGraph agent as a single MCP tool and call it from the orchestrator.',
        'Expose the LangGraph agent over A2A with an agent card and add it to the orchestrator as an A2A tool.',
        'Copy the LangGraph prompt into a new Foundry prompt agent.',
        'Call the LangGraph HTTP endpoint directly with an API key hard-coded in the orchestrator.',
      ],
      correct: [1],
      explanation:
        'A2A is designed for agent-to-agent delegation with task lifecycle, streaming and continuation tokens. MCP is tool-shaped and lacks task semantics, copying the prompt discards the existing implementation, and hard-coded keys violate the connection-based secret model.',
    },
    {
      question: 'Which TWO statements about Foundry Toolboxes are correct? (Select two)',
      options: [
        'A toolbox exposes its tools through a single MCP-compatible endpoint that non-Foundry runtimes such as LangGraph can consume.',
        'Toolbox authentication must be implemented inside each consuming agent\'s code.',
        'Promoting a new default toolbox version updates consuming agents without redeploying them.',
        'A toolbox can contain only Microsoft first-party tools.',
      ],
      correct: [0, 2],
      explanation:
        'Toolboxes are MCP-compatible and runtime-agnostic, and versioning lets you promote a version centrally. Authentication is configured on connections, not in agent code, and toolboxes can include third-party MCP servers, OpenAPI tools and A2A connections.',
    },
    {
      question:
        'A hosted agent must receive GitHub webhook events whose payload format is fixed by GitHub, classify them and write results to a queue. Which protocol should the hosted agent expose?',
      options: ['Responses', 'Invocations', 'Activity', 'A2A'],
      correct: [1],
      explanation:
        'Invocations accepts arbitrary JSON defined by the external system and suits non-conversational processing. Responses is OpenAI-compatible chat, Activity is the Teams/M365 channel bridge, and A2A is for agent-to-agent delegation.',
    },
    {
      question:
        'An orchestrator calls a remote A2A agent that reads the signed-in user\'s SharePoint files. Users must see only their own documents. Which connection authentication behaviour should you choose?',
      options: [
        'Key-based authentication with a shared service account PAT.',
        'The calling agent\'s own identity.',
        'Microsoft Entra client user delegation (UserEntraToken or AgentOnBehalfOfUser where supported).',
        'Unauthenticated access, relying on the remote agent to filter.',
      ],
      correct: [2],
      explanation:
        'User delegation preserves the end user\'s context so the downstream service enforces per-user permissions. Shared keys and the agent identity give every user the same access, and unauthenticated access is insecure.',
    },
    {
      question:
        'You want to add rate limiting, IP allowlisting and correlation IDs to all MCP tool calls made by agents in a project without modifying the MCP servers. What should you use?',
      options: [
        'An Azure API Management AI gateway connected to the Foundry resource.',
        'A content-safety guardrail at the tool-call intervention point.',
        'Application Insights sampling rules.',
        'The Foundry memory store API.',
      ],
      correct: [0],
      explanation:
        'The AI gateway routes MCP traffic through API Management policies. Guardrails detect harmful content, Application Insights is telemetry, and memory stores are unrelated.',
    },
    {
      question: 'A team migrating from the classic Agents API asks how to make one Foundry prompt agent call another in the new Agent Service. Which answer is correct?',
      options: [
        'Use the Connected Agents tool exactly as before.',
        'Enable incoming A2A on the target agent and call it with the A2A tool, or orchestrate with Agent Framework workflows.',
        'Share the same conversation ID between the two agents.',
        'Deploy both agents to the same container.',
      ],
      correct: [1],
      explanation:
        'Connected Agents is not available in the new service; the documented replacements are the A2A tool (with incoming A2A enabled on the target) and workflows. Shared conversation IDs and co-location are not agent-to-agent mechanisms.',
    },
  ],
  statements: [
    { text: 'MCP is the protocol Foundry uses for agent-to-tool integration, and a Foundry Toolbox is exposed as an MCP-compatible endpoint.', isTrue: true, explanation: 'Toolboxes bundle tools behind a single MCP endpoint consumable by any MCP client.' },
    { text: 'A2A agent discovery can use an agent card published at a well-known URI.', isTrue: true, explanation: 'Agent Framework\'s A2ACardResolver and Foundry both support well-known agent card discovery.' },
    { text: 'The classic Connected Agents tool remains the recommended way to chain agents in the new Foundry Agent Service.', isTrue: false, explanation: 'It is not available in the new service; use A2A, workflows or agents-as-tools.' },
    { text: 'Incoming A2A on a Foundry prompt agent requires the Responses protocol to be enabled as well.', isTrue: true, explanation: 'Incoming A2A builds on the Responses protocol; both are set in protocol_configuration.' },
    { text: 'Content returned by a remote MCP server can be trusted because it was produced by a tool rather than a user.', isTrue: false, explanation: 'Tool and agent responses can carry indirect prompt injection; treat them as untrusted and apply tool-response guardrails.' },
    { text: 'The Invocations WebSocket protocol on hosted agents supports Foundry content-safety moderation.', isTrue: false, explanation: 'Content safety moderation is not available on the Invocations WebSocket protocol.' },
    { text: 'Foundry Agent Consumer is the least-privilege built-in role for callers that only need to invoke an agent endpoint.', isTrue: true, explanation: 'It grants interaction without agent-management permissions.' },
  ],
  resources: [
    { label: 'Connect to an A2A agent endpoint from Foundry Agent Service', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/agent-to-agent' },
    { label: 'Enable incoming A2A on a Foundry agent', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/enable-agent-to-agent-endpoint' },
    { label: 'What is Toolbox in Foundry?', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview' },
    { label: 'Agent Framework: A2A agent service integration', url: 'https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/agent-services/a2a' },
  ],
};

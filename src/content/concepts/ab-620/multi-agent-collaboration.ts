import type { Concept } from '../../types';

export const multiAgentCollaboration: Concept = {
  id: 'multi-agent-collaboration',
  title: 'Multi-Agent Solutions: Child Agents, Connected Agents, Foundry, Fabric and A2A',
  summary:
    'When and how to split work across agents in Copilot Studio: child agents inside one agent, connected Copilot Studio agents in the same environment, and external agents reached through Microsoft Foundry, Microsoft Fabric data agents, the Agent2Agent (A2A) protocol and the Microsoft 365 Agents SDK, plus the design trade-offs the exam tests.',
  certs: ['ab-620', 'ab-100'],
  domains: ['ab-620-2', 'ab-100-1'],
  outcomes: ['ab-620-2-3-1', 'ab-620-2-3-2', 'ab-620-2-3-3', 'ab-620-2-3-4', 'ab-620-2-3-5', 'ab-100-1-2-3'],
  tags: ['copilot-studio', 'multi-agent', 'child-agents', 'connected-agents', 'foundry', 'fabric', 'a2a', 'orchestration'],
  difficulty: 'advanced',
  diagram: 'coordinator-subagents',
  sections: [
    {
      heading: 'Designing a multi-agent solution',
      body: `The main agent's orchestrator treats other agents like tools: it chooses a **child agent** or **connected agent** from its **description**, hands it a natural-language task (and, optionally, typed inputs and the conversation history), and receives a summary (and optional typed outputs). Microsoft's guidance is to avoid multi-agent designs until you need them, and it gives concrete triggers.

Use **child agents** (lightweight agents inside your agent) when you have a single use case, one team owns everything, you want to group instructions, knowledge and tools logically, and you do not need separate settings, authentication, deployment, publication or reuse across agents. Each child agent has its own orchestration and its own set of up to 128 tools, which is how you scale past the recommended 25 to 30 tools per orchestrator.

Split into **connected agents** when tool selection degrades because the main agent has too many similar choices (roughly **30 to 40 actions** across tools, topics and agents is the rule of thumb), when **different teams** own different agents, when agents must be **published independently** on their own channels, need **their own model or settings**, need **independent ALM**, or must be **reused** by several main agents.

Costs of splitting: extra **latency** from the second orchestration hop, and a larger **testing, management and governance** surface. Constraints: an agent that itself has connected agents cannot be connected to another main agent; **citations** may not survive the hand-back; child and connected agents inherit the main agent's **general knowledge** setting; and you can mix child and connected agents freely. You can **redirect** to a child or connected agent from a topic (the topic resumes afterwards) and reference agents in the main instructions with \`/\`.`,
    },
    {
      heading: 'Child agents and connected Copilot Studio agents',
      body: `**Child agent** (Agents page > Add > New child agent): name, **description** or an explicit trigger under **When will this be used?** (a message is received, a custom client event, an activity, the conversation changes, it is invoked, it is redirected to, the user is inactive, a plan completes, an AI-generated response is about to be sent), **instructions** that can reference tools, variables and Power Fx with \`/\`, plus knowledge and tools only this child can use. You can define typed **inputs** (with prompting, reprompt and validation settings) and **outputs**, and choose the parent's **After running** behaviour (Don't respond, Write with generative AI, Send specific response, Send an adaptive card). Restrict a tool to the child by clearing the tool's dynamic-use option so the main orchestrator does not confuse "Check account balance" the agent with "Get account balance" the tool.

**Connected Copilot Studio agent** (Agents page > Add > select an agent in your environment): the other agent must be in the **same environment**, **published**, have **Let other agents connect to and use this one** turned on in its Settings, and be owned by or shared with the maker. You edit the **description locally** (it does not sync from the source agent), and you can clear **Pass conversation history to this agent** to send only the explicit task. Changes in the connected agent reach the main agent only after the connected agent is **published** again; depending on authentication you may also need to share the connected agent with the main agent's users.

Publishing works in the other direction too: an agent can be exposed to other clients **as an MCP server or over A2A** (preview), so a Copilot Studio agent can be the specialist that a Foundry or third-party orchestrator calls.`,
    },
    {
      heading: 'External agents: Foundry, Fabric, A2A and Agents SDK',
      body: `Under **Connect to an external agent** you have four options (all preview except A2A):

- **Microsoft Foundry agent**: create a connection with the **Foundry project endpoint URL**, enter a name, description and the **Agent Id**. Only agents created in the **new Foundry portal** connect. The Foundry agent must have the **Activity protocol endpoint** enabled (new agents expose only Responses and A2A by default); you enable it programmatically through the REST API or Python SDK, and until you do, calls fail with an HTTP 400 "endpoint does not support activity" error.
- **Microsoft Fabric data agent**: pick a Fabric connection and one of the data agents you can access, then refine the description. Limitations: no **Redirect** from a topic, cannot be referenced explicitly in instructions, does not work when the main agent is deployed to **Microsoft 365 Copilot**, and is not supported by agent evaluation.
- **A2A agent**: the **Agent2Agent protocol** is an open standard for delegating tasks between agents with multi-turn support and rich metadata, as opposed to a plain HTTP call. Enter the agent's **endpoint URL** (not the agent card URL); if the agent publishes an **agent card** at the standard \`/.well-known\` location, Copilot Studio fills in the name and description. Authentication: None, API key (header or query) or OAuth 2.0 (client ID, secret, authorization, token and refresh URLs). Use A2A for agents built on other frameworks and hosted outside Copilot Studio; use MCP for tools and resources, connectors or HTTP for plain APIs, and the Activity protocol for Agents SDK agents.
- **Microsoft 365 Agents SDK agent**: custom-code agents connected over the **Activity protocol**.

For every external agent Microsoft states that **you are responsible** for data flows between agents, quality and security of the external agent, permissions and approvals, and observability and human oversight.`,
    },
    {
      heading: 'Patterns and the exam angle',
      body: `Typical architectures:

1. **Hub and spokes inside one agent**: an IT agent with child agents for password resets, hardware requests and software licences, each with its own tools; one team, one deployment.
2. **Federated departmental agents**: HR, Finance and IT each publish their own agent; an employee concierge connects to all three and routes by description; each department keeps its own ALM and model choice.
3. **Specialist outside Copilot Studio**: a Foundry agent with custom code and evaluation pipelines handles contract analysis; a Fabric data agent answers analytical questions over lakehouse data; a partner's A2A agent quotes shipping.

Exam cues: "same team, single deployment, group tools logically" means **child agent**; "different teams, separate publishing, reuse" means **connected agent**; "agent built in Foundry" means **Foundry agent connection with the Activity endpoint enabled**; "natural-language questions over Fabric lakehouse data" means **Fabric data agent** (and remember its Microsoft 365 Copilot limitation); "agent built on another framework hosted elsewhere" means **A2A**; "the connected agent's new description is not showing" means descriptions are **local**; "the main agent passes irrelevant history" means clear **Pass conversation history**.

Distractors: connecting an agent that already has connected agents as a spoke (not allowed), expecting a Fabric data agent to be reachable from a topic Redirect node, choosing MCP when the requirement is delegating a multi-turn task rather than calling a tool, or using A2A for an Agents SDK agent that speaks the Activity protocol.`,
    },
  ],
  examples: [
    {
      title: 'Splitting an overloaded IT agent',
      description:
        'An IT helpdesk agent has 45 tools and increasingly calls the wrong one. The team first tightens descriptions, then regroups tools into three child agents (Access, Devices, Software), each with 10 to 15 tools and focused instructions. Tool selection accuracy recovers because the main orchestrator now picks between three well-described agents, and each child picks among its own tools. Nothing needs separate publishing, so child agents suffice.',
      takeaway: 'Child agents are the first remedy for tool-selection degradation when one team owns the whole solution.',
    },
    {
      title: 'The Foundry agent that returned HTTP 400 (a realistic mistake)',
      description:
        'A developer connects a newly created Foundry agent using the project endpoint and Agent Id. The first test call fails: "endpoint does not support activity". New Foundry agents expose only the Responses and A2A endpoints; the Activity protocol endpoint must be enabled through the REST API or Python SDK (the portal still shows only Responses and A2A afterwards, which is expected). After enabling it, the connection works.',
      code: `# Enable the Activity protocol on an existing Foundry agent (azure-ai-projects, preview)
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import (
    A2AProtocolConfiguration, ActivityProtocolConfiguration, AgentEndpointConfig,
    EntraAuthorizationScheme, ProtocolConfiguration, ResponsesProtocolConfiguration,
)
from azure.identity import DefaultAzureCredential

project_client = AIProjectClient(
    endpoint="https://{account}.services.ai.azure.com/api/projects/{project}",
    credential=DefaultAzureCredential(),
)
with project_client:
    endpoint_config = AgentEndpointConfig(
        protocol_configuration=ProtocolConfiguration(
            responses=ResponsesProtocolConfiguration(),
            activity=ActivityProtocolConfiguration(),   # required by Copilot Studio
            a2a=A2AProtocolConfiguration(),
        ),
        authorization_schemes=[EntraAuthorizationScheme()],
    )
    project_client.agents.update_details(agent_name="contract-analyst", agent_endpoint=endpoint_config)`,
      language: 'python',
      takeaway: 'Copilot Studio talks to Foundry agents over the Activity protocol, which must be enabled programmatically on the Foundry side.',
    },
    {
      title: 'Connecting a partner agent over A2A',
      description:
        'A retailer connects a logistics partner\'s agent that implements A2A. The developer enters the endpoint URL; Copilot Studio reads the agent card at /.well-known/agent-card.json and fills in the name and description. Authentication is OAuth 2.0 with the partner\'s client credentials. The main agent now delegates "where is order 4471?" as a task and receives a multi-turn-capable response rather than calling individual REST operations.',
      code: `// Example agent card fetched from https://agents.northwind-logistics.com/.well-known/agent-card.json
{
  "name": "Northwind Shipment Agent",
  "description": "Tracks, quotes and reschedules shipments for Northwind Logistics customers.",
  "url": "https://agents.northwind-logistics.com/a2a",
  "version": "1.2.0",
  "capabilities": { "streaming": true, "pushNotifications": false },
  "skills": [
    { "id": "track", "name": "Track shipment", "description": "Current location and ETA by tracking number" },
    { "id": "quote", "name": "Quote shipment", "description": "Price and transit time for a route and weight" }
  ],
  "securitySchemes": { "oauth2": { "type": "oauth2" } }
}`,
      language: 'json',
      takeaway: 'A2A delegates tasks between agents with a standard contract; the agent card advertises what the agent can do and how to authenticate.',
    },
    {
      title: 'Fabric data agent in a Teams-only sales assistant',
      description:
        'A sales assistant needs to answer "what were our top five products in EMEA last quarter?" from a Fabric lakehouse. The team connects the Fabric data agent and refines its description. They publish only to Teams, because the Fabric data agent does not function when the main agent is deployed to Microsoft 365 Copilot, and they handle analytics questions through orchestration rather than a topic Redirect node, which Fabric data agents do not support.',
      takeaway: 'Fabric data agents bring analytical answers over Fabric data, with channel and redirect limitations you must design around.',
    },
  ],
  keyPoints: [
    'Orchestrators select child and connected agents by description; descriptions are edited locally for connected agents and do not sync from the source.',
    'Child agents: single use case, one team, logical grouping of tools, instructions and knowledge, no separate publishing or reuse; each has its own orchestration and tool budget.',
    'Connected agents: when selection degrades (roughly 30 to 40 choices), different owning teams, independent publishing, settings, model, ALM or reuse; costs are latency and governance surface.',
    'Connected Copilot Studio agents must be in the same environment, published, allow connections in Settings, and be owned by or shared with the maker; an agent with connected agents cannot itself be a spoke.',
    'Foundry agents connect via project endpoint and Agent Id, only from the new Foundry portal, and need the Activity protocol endpoint enabled programmatically.',
    'Fabric data agents (preview) cannot be redirected to from topics, referenced in instructions, used when the main agent is in Microsoft 365 Copilot, or evaluated by agent evaluation.',
    'A2A connects agents on other frameworks via an endpoint URL, with the agent card auto-filling metadata, and None, API key or OAuth 2.0 authentication; Agents SDK agents use the Activity protocol.',
    'Copilot Studio agents can themselves be published as MCP servers or A2A agents for other clients; you remain responsible for data flows, quality, permissions and oversight of external agents.',
  ],
  flashcards: [
    { front: 'When should you prefer a child agent over a connected agent?', back: 'Single use case, one owning team, logical grouping of tools and knowledge, no need for separate publishing, settings, ALM or reuse across agents.' },
    { front: 'What rule of thumb signals that an agent should be split into connected agents?', back: 'Tool selection degrades at roughly 30 to 40 actions (tools, topics, agents) or earlier with similar descriptions.' },
    { front: 'What must be true of a Copilot Studio agent before another agent can connect to it?', back: 'Same environment, published, "Let other agents connect to and use this one" enabled, and owned by or shared with the maker.' },
    { front: 'Why does a Foundry agent connection fail with HTTP 400 "endpoint does not support activity"?', back: 'The Activity protocol endpoint is not enabled; new Foundry agents expose only Responses and A2A until you enable Activity via REST API or Python SDK.' },
    { front: 'Which URL do you enter when connecting an A2A agent?', back: 'The agent\'s communication endpoint URL, not the agent card URL; Copilot Studio reads the card from the .well-known location automatically.' },
    { front: 'Name three limitations of Fabric data agents in Copilot Studio.', back: 'No Redirect from a topic, cannot be referenced in instructions, do not work when the main agent is deployed to Microsoft 365 Copilot (and not supported by agent evaluation).' },
    { front: 'What does clearing "Pass conversation history to this agent" do?', back: 'Sends only the explicit task to the connected agent instead of the conversation history.' },
    { front: 'Can an agent that has connected agents be used as a connected agent for another main agent?', back: 'No. Only agents without connected agents can be spokes, and those can serve multiple main agents.' },
    { front: 'How do Agents SDK agents connect to Copilot Studio?', back: 'Over the Activity protocol, as a connected external agent.' },
    { front: 'What are two costs of a multi-agent design?', back: 'Added latency from extra orchestration hops and a larger testing, management and governance surface.' },
  ],
  quiz: [
    {
      question:
        'A single team owns an HR agent that has grown to 40 tools and now frequently selects the wrong one. The agent is published only to Teams and no other agent needs its functionality. What should you do FIRST after reviewing descriptions?',
      options: [
        'Split the tools into several child agents within the HR agent',
        'Publish three separate HR agents and connect them to a new main agent',
        'Build a Foundry agent to replace it',
        'Reduce the number of knowledge sources',
      ],
      correct: [0],
      explanation:
        'Child agents group tools under their own orchestration without separate publishing, matching a single-team, single-deployment scenario. Connected agents add governance and latency unnecessarily, Foundry is not indicated, and knowledge sources do not affect tool selection among tools.',
    },
    {
      question:
        'Finance and IT each maintain their own Copilot Studio agent with separate release cycles. You must build an employee concierge agent that routes questions to them. Which requirement must each departmental agent meet?',
      options: [
        'It must use classic orchestration',
        'It must be published, in the same environment, and have Let other agents connect to and use this one turned on',
        'It must be converted to a child agent of the concierge',
        'It must use Authenticate manually',
      ],
      correct: [1],
      explanation:
        'Connected Copilot Studio agents require same environment, publication and the connection setting. Orchestration mode and authentication type are not prerequisites, and converting to child agents would remove the departments\' independent ALM.',
    },
    {
      question:
        'You connect a Foundry agent using the project endpoint and Agent Id. Test calls return HTTP 400 stating the endpoint does not support activity. What should you do?',
      options: [
        'Recreate the Foundry agent in the previous Foundry portal',
        'Enable the Activity protocol endpoint on the Foundry agent using the REST API or Python SDK',
        'Switch the connection to A2A authentication',
        'Turn off Pass conversation history to this agent',
      ],
      correct: [1],
      explanation:
        'Copilot Studio requires the Activity protocol endpoint, which is enabled programmatically. Agents from the previous portal cannot connect at all, A2A is a different connection type, and conversation history settings do not affect protocol support.',
    },
    {
      question:
        'Which TWO statements about Fabric data agents in Copilot Studio are correct? (Select two)',
      options: [
        'They can be invoked by generative orchestration based on their description',
        'They can be redirected to from a topic using the Redirect node',
        'They do not function when the main agent is deployed to Microsoft 365 Copilot',
        'They are fully supported by agent evaluation test sets',
      ],
      correct: [0, 2],
      explanation:
        'Fabric data agents are selected by description like other connected agents, and they do not work in Microsoft 365 Copilot deployments. Redirect from topics and agent evaluation are both unsupported for Fabric data agents.',
    },
    {
      question:
        'A partner provides an agent built on an open-source framework and hosted in their cloud. Your agent must delegate multi-turn tasks to it rather than call individual endpoints. Which integration should you use?',
      options: [
        'A REST API tool created from the partner\'s OpenAPI file',
        'An A2A agent connection using the partner agent\'s endpoint URL',
        'A Send HTTP request node in a topic',
        'A Copilot connector',
      ],
      correct: [1],
      explanation:
        'A2A is designed for delegating tasks between agents across frameworks with multi-turn support. REST API tools and HTTP nodes call operations rather than delegate tasks, and Copilot connectors index knowledge.',
    },
  ],
  statements: [
    { text: 'Child agents can be published independently on their own channels.', isTrue: false, explanation: 'Child agents exist only inside the main agent; connected agents are the independently published option.' },
    { text: 'A connected agent\'s description is maintained locally in the main agent and does not sync automatically.', isTrue: true, explanation: 'You must update the local description manually.' },
    { text: 'Multi-agent designs reduce latency because work is parallelised across agents.', isTrue: false, explanation: 'Microsoft notes that extra orchestration hops increase latency.' },
    { text: 'A Copilot Studio agent can be exposed to other clients as an MCP server or over A2A.', isTrue: true, explanation: 'Publishing as MCP or A2A is available (preview) alongside traditional channels.' },
    { text: 'Only Foundry agents created in the new Foundry portal can be connected to Copilot Studio.', isTrue: true, explanation: 'Agents from the previous portal return a 404 version-not-found error.' },
    { text: 'Each child agent shares the main agent\'s 128-tool limit.', isTrue: false, explanation: 'Each child agent has its own orchestration and its own set of up to 128 tools.' },
    { text: 'When connecting an A2A agent you must enter the agent card URL.', isTrue: false, explanation: 'You enter the communication endpoint URL; the card is read automatically from the .well-known location.' },
  ],
  resources: [
    { label: 'Add other agents overview', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents' },
    { label: 'Connect to a Microsoft Foundry agent (preview)', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-foundry-agent' },
    { label: 'Connect an agent available over the Agent2Agent (A2A) protocol', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-agent-to-agent' },
    { label: 'Connect to a Microsoft Fabric Data agent (preview)', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-fabric-data-agent' },
  ],
};

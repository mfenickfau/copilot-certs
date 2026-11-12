import type { Concept } from '../../types';

export const multiAgentArchitecture: Concept = {
  id: 'multi-agent-architecture',
  title: 'Multi-Agent Architecture Across Copilot, Copilot Studio and Foundry',
  summary:
    'How to design agent types (prompt-and-response, task, autonomous) and compose them into multi-agent solutions that span Microsoft 365 Copilot, Copilot Studio and Microsoft Foundry, using child agents, connected agents, A2A and MCP, while respecting each platform\'s rules, quotas and constraints.',
  certs: ['ab-100', 'ab-620'],
  domains: ['ab-100-1', 'ab-100-2', 'ab-620-2'],
  outcomes: ['ab-100-1-2-3', 'ab-100-1-2-5', 'ab-100-2-1-5', 'ab-100-2-1-6', 'ab-100-2-1-7', 'ab-620-2-3-1', 'ab-620-2-3-5'],
  tags: ['multi-agent', 'orchestration', 'a2a', 'mcp', 'autonomous-agents', 'task-agents', 'connected-agents', 'foundry'],
  difficulty: 'advanced',
  diagram: 'coordinator-subagents',
  sections: [
    {
      heading: 'Three agent types and when each fits',
      body: `AB-100 names three agent types to design. They differ in *who starts the work* and *how far the agent goes on its own*.

- **Prompt-and-response agents** are conversational. A person asks, the agent grounds, reasons and answers, possibly calling a tool or two. Most declarative agents in Microsoft 365 Copilot, SharePoint agents and classic Copilot Studio Q&A agents are this type. Design focus: knowledge quality, instructions, citations, fallback and escalation.
- **Task agents** complete a focused, bounded assignment delegated by a parent agent or a person: research one question, analyse one document, review one draft, or run one sub-process. In Copilot Studio agents powered by the Microsoft Copilot harness, task agents are spun up from the parent's instructions or a skill rather than published separately; in Foundry they are typically sub-agents in a coordinator pattern. Design focus: a clear scope, enough context, an expected result shape, and a parent that assesses and combines results. Delegation adds coordination cost, so small jobs should be done directly.
- **Autonomous agents** start from an **event trigger** (a new SharePoint item, an incoming email, a Dataverse record change, a schedule, a finance and operations business event) and work towards a goal without a human in the loop for each step. Copilot Studio requires generative orchestration for triggers; the trigger connection authenticates as the maker, so the agent can only see events the maker can see. Design focus: tight instructions, deterministic agent flows for the steps that must not vary, human approval for irreversible actions, run history and monitoring, and an **Entra agent identity** so the agent's actions are attributable.

Dynamics 365 ships examples of each: Sales Research Agent (prompt-and-response), Sales Qualification Agent and Case Management Agent (autonomous), and the Supplier Communications and Account Reconciliation agents in finance and operations (autonomous with human review).`,
    },
    {
      heading: 'Composing a multi-agent solution',
      body: `Multi-agent design is justified when one agent's ability to pick the right tool degrades, when different teams own different capabilities, or when agents must be published and reused independently. Microsoft's rule of thumb: once a Copilot Studio agent has more than roughly **30 to 40 choices** (tools, topics, other agents) or several similarly described tools, precision drops and splitting helps. Always improve descriptions first, then split.

Composition options in Copilot Studio:
- **Child agents**: lightweight sub-agents inside one agent, owned by one team, grouping instructions, tools and knowledge for a single use case. No separate publishing, authentication or ALM.
- **Connected agents**: separately built agents the main agent delegates to. These can be other Copilot Studio agents in the same environment, **Microsoft Foundry agents**, **Fabric data agents**, agents built with the **Microsoft 365 Agents SDK**, and any agent exposing the **Agent2Agent (A2A)** protocol. Each connected agent keeps its own configuration, authentication and lifecycle. Admins can restrict cross-environment connection with the connected-agent access control in the Power Platform admin center.
- **Microsoft 365 Copilot** declarative agents can also connect to other agents, and Copilot Studio agents can be exposed as **MCP servers or A2A agents** so external orchestrators call them.

Patterns you should be able to draw: **coordinator and sub-agents** (one orchestrator routes to specialists and merges results), **sequential handoff** (intake, enrichment, fulfilment), **parallel fan-out** for independent research, and **human-in-the-loop gates** before consequential actions. Keep shared state explicit (a Dataverse record, a case, a work item) rather than relying on conversation memory across agents, and give every agent an identity (Entra Agent ID) so cross-agent calls are authorised and auditable.

Spanning platforms is normal: a Microsoft 365 Copilot declarative agent handles the employee conversation, delegates to a Copilot Studio agent that owns connectors and approval flows, which in turn calls a Foundry agent running a custom model and a Fabric data agent for analytics.`,
    },
    {
      heading: 'Protocols: A2A for delegation, MCP for tools',
      body: `Two open standards appear throughout the AB-100 audience profile, and the exam expects you to pick the right one.

**Model Context Protocol (MCP)** connects an agent to *tools and resources*. An MCP server publishes tool names, descriptions, inputs and outputs; Copilot Studio reflects changes dynamically, so new tools appear without re-authoring. Use MCP when the thing on the other side is a capability (create a record, look up stock, send an email). Dynamics 365 Sales, Customer Service and the Dynamics 365 ERP MCP server, Power Apps MCP server and Foundry Toolboxes all expose tools this way. MCP requires generative orchestration and is governed by Power Platform data policies like any connector.

**Agent2Agent (A2A)** connects an agent to *another agent*. It supports multi-turn interactions, rich contextual metadata and predictable response formats, and is interoperable across frameworks. Use A2A when the counterpart has its own reasoning and workflows (an agent built in another framework, hosted outside Copilot Studio) and you want to delegate a task rather than call an API. An A2A agent advertises an agent card at a well-known URL that Copilot Studio reads to populate name and description.

Alternatives for comparison: a **custom connector or HTTP tool** for plain APIs; the **Activity Protocol** for agents built with the Microsoft 365 Agents SDK. The architect's checklist for any cross-agent call: identity and consent (whose token is presented), data residency of the remote agent, timeouts and retries, and how the remote agent's answer is validated before being acted on, because content returned from another agent is untrusted input and a prompt-injection vector.`,
    },
    {
      heading: 'Solution rules and constraints by platform',
      body: `Defining **rules and constraints** before build avoids expensive rework. The ones that recur in exam scenarios:

**Copilot Studio.** Capabilities differ by **harness**: the standard harness supports topics, prompt tools, Azure AI Search knowledge, custom entities, SharePoint, WhatsApp and Dynamics 365 Contact Center channels; the Microsoft Copilot harness replaces topics with skills, workflows and hooks, adds memory and native code interpreter, but (at the time of writing) does not support Azure AI Search, Contact Center or custom authentication; the Customer Conversation harness is for customer-facing voice and chat. Generative orchestration is required for MCP, Computer Use, triggers and deep reasoning. Knowledge limits apply (for example 25 websites and 25 SharePoint URLs per agent in generative mode). Deep reasoning and some models are only available in certain regions and may process data cross-geo; experimental models are not for production. Billing is in Copilot Credits pooled at tenant level and allocated per environment. Data policies, channel controls and knowledge-source rules set in the Power Platform admin center override maker choices.

**Microsoft Foundry.** Models vary by region and deployment type (Global Standard, Data Zone Standard, regional) which decides where data is processed; quotas are per deployment in tokens per minute; RBAC roles (Foundry Account Owner, Foundry Owner, project roles) gate who can deploy models and create agents; guardrails (content filters, Prompt Shields, network egress controls for hosted agents) apply to Foundry Agent Service agents; Agent Service publishes agents to Teams, Microsoft 365 Copilot and the Entra agent registry.

**Foundry Tools.** Pricing tiers cap transactions per second; some services have regional availability and language coverage limits; retired services (Language Understanding, QnA Maker, Anomaly Detector) must not be used for new work.

Write these as explicit design constraints in the solution architecture, then design tests that prove each one is respected.`,
    },
  ],
  examples: [
    {
      title: 'Splitting an overloaded HR agent',
      description:
        'A single Copilot Studio HR agent has grown to 55 tools covering payroll, leave, onboarding and learning, and increasingly picks the wrong tool. After tightening descriptions, the architect splits it into a coordinator with four connected agents, each owned by the respective HR team with its own solution and connections, and keeps one child agent for the shared "who is my HR partner" lookup used by all four.',
      takeaway: 'Split when tool selection degrades (around 30 to 40 choices) or ownership differs; use child agents for shared, lightweight pieces and connected agents for independently owned ones.',
    },
    {
      title: 'A cross-platform order-exception solution',
      description:
        'A distributor designs an autonomous Copilot Studio agent triggered by a Dynamics 365 Supply Chain Management business event when a confirmed purchase order changes. It calls the Dynamics 365 ERP MCP server for order data, delegates demand-impact analysis to a Foundry agent (connected agent) that runs a custom forecasting model, and posts a recommendation to the planner in Teams, who approves the change through an agent flow. Employees ask follow-up questions through a declarative agent in Microsoft 365 Copilot that connects to the same Copilot Studio agent.',
      takeaway: 'Autonomous trigger, MCP for tools, a Foundry connected agent for custom models and a human approval gate is the canonical multi-platform pattern.',
    },
    {
      title: 'Trusting a connected agent\'s output (a realistic mistake)',
      description:
        'A procurement agent delegates supplier research to an external A2A agent and pipes the returned text straight into an email to the supplier. A manipulated web page read by the remote agent includes hidden instructions, which end up in the email. The fix: treat connected-agent responses as untrusted input, run them through content safety checks, constrain the email to a template populated from structured fields, and require human review for external communications.',
      takeaway: 'Content from other agents is untrusted data; validate and constrain it before acting, especially before anything leaves the organisation.',
    },
    {
      title: 'Constraint discovered late',
      description:
        'A team builds a customer service agent on the Microsoft Copilot harness, then learns the client needs Azure AI Search as knowledge and a Dynamics 365 Contact Center voice channel, neither supported on that harness. They rebuild on the standard harness. Had the solution rules been captured during planning, the harness choice would have been obvious.',
      takeaway: 'Record harness, channel, knowledge, region and model constraints as explicit rules during planning.',
    },
  ],
  keyPoints: [
    'Prompt-and-response agents answer people; task agents complete bounded delegated assignments; autonomous agents start from event triggers and pursue goals with approval gates.',
    'Copilot Studio event triggers require generative orchestration and authenticate with the maker\'s connection; autonomous agents should carry an Entra agent identity.',
    'Use child agents for lightweight sub-agents owned by one team; use connected agents (Copilot Studio, Foundry, Fabric data agents, Agents SDK, A2A) when agents need separate ownership, publishing or reuse.',
    'Split an agent when it has roughly 30 to 40 or more tools, topics and agents, or similarly described tools, after first improving descriptions.',
    'MCP connects agents to tools and resources; A2A connects agents to other agents with multi-turn, metadata-rich delegation; HTTP connectors suit plain APIs.',
    'Treat output from connected or external agents as untrusted input; validate it before acting.',
    'Copilot Studio capabilities vary by harness (standard, Microsoft Copilot, Customer Conversation); Foundry constraints include regional model availability, deployment types, quotas and RBAC; Foundry Tools have TPS-based tiers and retired services.',
    'A multi-platform solution typically pairs a Microsoft 365 Copilot declarative agent for the conversation, a Copilot Studio agent for connectors and flows, and Foundry agents for custom models.',
  ],
  flashcards: [
    { front: 'What distinguishes an autonomous agent from a prompt-and-response agent?', back: 'An autonomous agent is started by an event trigger and works towards a goal without a user prompting each step; a prompt-and-response agent answers a person\'s request.' },
    { front: 'What is a task agent?', back: 'A helper agent that completes a focused, bounded assignment delegated by a parent agent, which then assesses and combines the result.' },
    { front: 'Copilot Studio rule of thumb for when to split an agent into connected agents?', back: 'When it has more than about 30 to 40 choices of tools, topics and agents, or tool selection degrades because descriptions are similar.' },
    { front: 'Child agent versus connected agent?', back: 'Child agents live inside one agent with shared settings and no separate publishing; connected agents are independent agents with their own configuration, authentication and lifecycle.' },
    { front: 'Which external agent types can a Copilot Studio agent connect to?', back: 'Other Copilot Studio agents in the environment, Microsoft Foundry agents, Fabric data agents, Microsoft 365 Agents SDK agents and agents exposing the A2A protocol.' },
    { front: 'MCP versus A2A in one sentence each.', back: 'MCP exposes tools and resources for an agent to call; A2A lets an agent delegate tasks to another agent with multi-turn, structured communication.' },
    { front: 'What does an A2A agent publish so Copilot Studio can discover its name and description?', back: 'An agent card at the standard .well-known URL.' },
    { front: 'Which Copilot Studio features need generative orchestration turned on?', back: 'Event triggers, MCP tools, Computer Use and deep reasoning.' },
    { front: 'Whose credentials authenticate an event trigger in Copilot Studio?', back: 'The agent maker\'s (author authentication), so the agent can only react to events the maker can access.' },
    { front: 'Name two capabilities available on the Copilot Studio standard harness but not on the Microsoft Copilot harness.', back: 'Azure AI Search as knowledge and the Dynamics 365 Contact Center channel (also custom entities, prompt tools, SharePoint and WhatsApp channels).' },
  ],
  quiz: [
    {
      question:
        'A procurement agent must start automatically when a purchase order changes in Dynamics 365 Supply Chain Management, gather supplier data, and ask a planner to approve a revised delivery date. Which agent type and configuration is MOST appropriate?',
      options: [
        'A prompt-and-response agent that planners ask about orders',
        'An autonomous agent with an event trigger, generative orchestration and a human approval step in an agent flow',
        'A classic orchestration agent with trigger phrases for order changes',
        'A SharePoint agent scoped to the procurement site',
      ],
      correct: [1],
      explanation:
        'Event-driven work with a goal is an autonomous agent; triggers need generative orchestration, and approval protects the consequential action. Trigger phrases only respond to typed input, and Q&A or SharePoint agents do not act on events.',
    },
    {
      question:
        'A Copilot Studio agent with 48 tools from four departments increasingly calls the wrong tool. Descriptions have already been rewritten. What should the architect do NEXT?',
      options: [
        'Switch to classic orchestration so topics trigger on phrases',
        'Split the agent into a coordinator with connected agents per department',
        'Add deep reasoning to the agent',
        'Move all tools into one agent flow',
      ],
      correct: [1],
      explanation:
        'Microsoft guidance: when tool selection degrades past roughly 30 to 40 choices and descriptions are already good, split into connected agents, especially when ownership differs. Classic orchestration removes tool selection entirely, deep reasoning does not fix choice overload, and one flow is not a design.',
    },
    {
      question:
        'You need a Copilot Studio agent to delegate a multi-turn task to an agent built on a non-Microsoft framework that has its own reasoning. Which integration should you use?',
      options: ['A custom connector calling the agent\'s REST endpoint', 'An MCP server', 'An Agent2Agent (A2A) connected agent', 'A Power Automate HTTP action'],
      correct: [2],
      explanation:
        'A2A is designed for agent-to-agent delegation with multi-turn, metadata-rich exchanges. Connectors and HTTP actions are single-call API integrations, and MCP exposes tools, not agents.',
    },
    {
      question:
        'Which TWO statements about child agents in Copilot Studio are correct? (Select two)',
      options: [
        'They are suitable when a single team owns the whole solution and the sub-agent need not be published separately',
        'They have their own authentication and ALM lifecycle independent of the parent',
        'They logically group tools, instructions and knowledge inside a larger agent',
        'They can only be created from Foundry',
      ],
      correct: [0, 2],
      explanation:
        'Child agents are lightweight groupings inside one agent for single-team ownership without separate publishing. Separate authentication and lifecycle describe connected agents, and child agents are a Copilot Studio feature.',
    },
    {
      question:
        'A design calls for a Copilot Studio agent that uses Azure AI Search as knowledge and is deployed as a voice agent in Dynamics 365 Contact Center. Which harness should the architect specify?',
      options: ['Microsoft Copilot harness', 'Standard harness', 'Either harness, since capabilities are identical', 'GitHub Copilot harness'],
      correct: [1],
      explanation:
        'Azure AI Search knowledge and the Contact Center channel are supported on the standard harness but not on the Microsoft Copilot harness; harness capabilities differ, and the GitHub harness targets developer scenarios.',
    },
    {
      question:
        'An autonomous agent emails suppliers using text returned by an external research agent. Security review flags prompt-injection risk. What is the BEST mitigation?',
      options: [
        'Ask the external agent to promise not to include instructions',
        'Treat the returned content as untrusted, screen it with content safety, populate a fixed email template from structured fields and require human review before sending',
        'Switch the connection from A2A to HTTP',
        'Disable logging so injected text is not stored',
      ],
      correct: [1],
      explanation:
        'Untrusted content must be validated and constrained before action, with a human gate for external communication. Promises are not controls, the transport protocol does not change the risk, and disabling logs removes evidence rather than risk.',
    },
  ],
  statements: [
    { text: 'Task agents replace the need for a parent agent to assess and combine results.', isTrue: false, explanation: 'The parent must still describe the assignment, assess the result and combine it; delegation adds coordination work.' },
    { text: 'Copilot Studio event triggers can only be configured for agents using generative orchestration.', isTrue: true, explanation: 'Triggers, MCP, Computer Use and deep reasoning require generative orchestration.' },
    { text: 'Connected agents in Copilot Studio can include agents hosted in Microsoft Foundry and Fabric data agents.', isTrue: true, explanation: 'Both are supported connected agent types (some in preview).' },
    { text: 'A2A is primarily a protocol for exposing database tables to an agent.', isTrue: false, explanation: 'A2A is for agent-to-agent delegation; tools and resources are exposed through MCP or connectors.' },
    { text: 'Content returned by a connected agent can be acted on without validation because it comes from a trusted platform.', isTrue: false, explanation: 'Other agents\' output is untrusted input and a prompt-injection vector.' },
    { text: 'Deep reasoning in Copilot Studio is available in every region with full data residency commitments.', isTrue: false, explanation: 'It is region-limited and in preview without residency commitments.' },
    { text: 'Admins can restrict whether Copilot Studio agents connect to agents in other environments.', isTrue: true, explanation: 'Connected agent access controls exist in the Power Platform admin center.' },
  ],
  resources: [
    { label: 'Add other agents to your agent (child and connected agents)', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents' },
    { label: 'Connect to an agent over the Agent2Agent (A2A) protocol', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-agent-to-agent' },
    { label: 'Extend your agent with Model Context Protocol', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp' },
    { label: 'What is Microsoft Foundry Agent Service?', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/overview' },
  ],
};

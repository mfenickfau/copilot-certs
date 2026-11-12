import type { Concept } from '../../types';

export const mcpAndComputerUse: Concept = {
  id: 'mcp-and-computer-use',
  title: 'MCP Servers and Computer Use as Agent Tools',
  summary:
    'Two tool types for systems that do not fit a connector: Model Context Protocol servers, which publish tools and resources the agent discovers dynamically over Streamable HTTP with none, API key or OAuth 2.0 authentication; and computer use, which drives websites and Windows apps through a vision model on a hosted browser, Cloud PC pool or your own machine, with human supervision and detailed run logs.',
  certs: ['ab-620', 'ab-100'],
  domains: ['ab-620-2', 'ab-100-2'],
  outcomes: ['ab-620-2-2-1', 'ab-620-2-2-2', 'ab-100-2-2-4', 'ab-100-2-2-5'],
  tags: ['copilot-studio', 'mcp', 'model-context-protocol', 'computer-use', 'tools', 'oauth', 'human-supervision'],
  difficulty: 'advanced',
  diagram: 'mcp-architecture',
  sections: [
    {
      heading: 'What MCP adds to an agent',
      body: `**Model Context Protocol (MCP)** is an open protocol in which a **server** publishes **tools** (functions a model may call), **resources** (file-like data such as API responses) and **prompts** (templates). Copilot Studio supports MCP **tools and resources**; a resource is usable only if the server returns it as the **output of a tool**. The key difference from a connector or REST API tool is **dynamic discovery**: the server supplies each tool's name, description, inputs and outputs, and when the server adds, changes or removes tools, the agent reflects it without redeployment. One MCP server can expose many tools, and it can be shared by many agents and by non-Microsoft clients.

Constraints to remember:

- **Generative orchestration must be on**; MCP tools are selected by the orchestrator from the server description and tool descriptions.
- Only the **Streamable HTTP** transport is supported; SSE was deprecated and support ended after August 2025.
- MCP connectivity rides on **Power Platform connectors**, so **data policies** that govern connectors also govern MCP servers, and connections are managed like any other.
- When you connect to a third-party server you are responsible for the tools and data it exposes.
- Microsoft publishes built-in MCP server connectors (Dataverse, SharePoint, Outlook Mail and Calendar, Teams, Word, OneDrive, Windows 365 for agents, Fabric IQ ontology, MCP Management) and the **Copilot Studio MCP** server lets VS Code and GitHub Copilot CLI drive Copilot Studio itself. Servers can be registered through **Agent 365** (BYO MCP) and surfaced to Copilot Studio after approval, and your own connector can be **certified** for cross-tenant use.`,
    },
    {
      heading: 'Connecting an MCP server',
      body: `Two routes exist. The recommended **MCP onboarding wizard** (Tools > Add a tool > New tool > Model Context Protocol) asks for **server name**, **server description** (the orchestrator uses it to decide when to call the server), **server URL** and an **authentication type**:

- **None**.
- **API key**: sent as a **header** or **query** parameter whose name you supply; the user of the agent provides the key value when creating the connection.
- **OAuth 2.0** in three flavours: **Dynamic discovery** (the server supports Dynamic Client Registration plus the discovery endpoint, so nothing else is needed), **Dynamic** (DCR without discovery: supply the authorization URL and token URL template), or **Manual** (client ID, client secret, authorization URL, token URL template, refresh URL, optional scopes). For Dynamic and Manual, Copilot Studio shows a **callback (redirect) URL** that you must register with the identity provider.

After **Create**, pick or create a **connection** and **Add to agent**. The second route is a **custom connector** in Power Apps built from an **OpenAPI 2.0 YAML schema** that describes the MCP endpoint and marks it with \`x-ms-agentic-protocol: mcp-streamable-1.0\`; use it when you need connector-level policies or an existing connector pipeline.

Once added, the MCP server appears on the Tools page with **Tools** and **Resources** sections instead of Inputs and Completion. **Allow all** is on by default; turn it off to enable individual tools, in which case tools the server adds later start disabled. **Publish** after changing the selection. Troubleshooting usually comes down to the transport (Streamable only), authentication callback registration, generative orchestration being off, or a data policy blocking the connector.`,
    },
    {
      heading: 'Computer use: automating a UI when there is no API',
      body: `**Computer use** is a tool that lets an agent operate a **Windows machine** with a virtual mouse and keyboard, driven by a **Computer-Using Agent (CUA)** model that combines vision and reasoning. You describe the task in natural language, and because the model reads the screen it tolerates UI changes. It requires **generative orchestration** and works best for **autonomous** agents running in the background; in conversational use it streams reasoning and screenshots into the chat and each user needs machine credentials if end-user credentials are selected.

Configuration (Tools > Add a tool > New tool > Computer use):

- **Name, description, model** and **instructions** (full URLs, exact app names, explicit actions such as "select Submit, no confirmation needed", step-by-step lists). **Inputs** inject per-run values.
- **Machine**: the **hosted browser (preview)** powered by Windows 365 for agents for quick, non-production web automation (Microsoft-managed, not Entra joined, may be throttled); a **Cloud PC pool (preview)** that autoscales, is Entra joined and Intune enrolled and can reach organisational resources; or **bring your own machine** registered through **Power Automate for desktop** (version 2.61 or later, machine runtime app, **Enable for computer use** in the machine settings). Runs targeting a busy machine are queued.
- **Credentials to use**: **maker-provided** (default; suitable for autonomous agents; anyone using a shared agent acts with the maker's access) or **end user**.
- **Stored credentials** for site and app sign-ins, kept in Power Platform internal storage or **Azure Key Vault**, scoped by login domain (wildcards allowed) or desktop app process name.
- **Access control** allow list of websites and apps (it stops actions on, not navigation to, unlisted targets) and **Enforce HTTPS**.
- **Human supervision**: reviewers who receive Outlook requests (and inline review cards) when the model needs confirmation or more information; without any reviewer the run fails when it pauses. Only the tool's maker receives requests by default, and the mechanism is probabilistic, not a guaranteed safety gate.

Microsoft's security guidance: dedicated, isolated machines; least-privilege accounts; browser and app allow lists enforced with Intune or application control; and awareness of **prompt injection** through on-screen content.`,
    },
    {
      heading: 'Monitoring and the exam angle',
      body: `Test computer use from the tool page (**Test** shows the reasoning log and a live preview; **Stop testing** halts it). After publishing, every run appears under the agent's **Activity** page with an **Activity map** and a **Transcript** that includes per-step reasoning and **screenshots**. With **Store logs in Dataverse** on (the default when an admin enables Computer use in the Power Platform admin center), selecting a computer use action opens a side panel with **session replay**, action coordinates and timestamps, a summary (duration, actions, screenshots, escalations, machine) and inline human review. Admins set **verbosity** (All data, Data without screenshots, Minimal), **log retention** (default seven days) and can **send audit logs to Microsoft Purview** under the activity \`CUAOperation\`. Logs consume Dataverse database, log and file capacity.

Exam cues:

- "The vendor already exposes tools over MCP" or "tools change frequently and the agent should pick them up automatically": **MCP server**.
- "MCP server uses SSE": not supported; needs Streamable HTTP.
- "Connect with the least configuration to a server that supports DCR and discovery": OAuth 2.0 **Dynamic discovery**.
- "Limit the agent to three of the server's twelve tools": turn off **Allow all** and enable the three.
- "Legacy desktop app, no API, nightly data entry": **computer use** on a dedicated machine, maker credentials, event or scheduled trigger.
- "Who approves when the computer use agent is unsure": **human supervision** reviewers.
- "Auditors need the screenshots from last week's runs": Dataverse logs with retention raised and Purview audit on.

Distractors: a REST API tool for a system that only has a UI, computer use for a system with a connector, treating human supervision as a guarantee, or expecting MCP to work with classic orchestration.`,
    },
  ],
  examples: [
    {
      title: 'Connecting a partner MCP server with OAuth 2.0',
      description:
        'A logistics partner exposes shipment tools over MCP with Streamable HTTP and supports Dynamic Client Registration with discovery. The developer uses the onboarding wizard, enters the server URL and a description ("Tracks, reschedules and quotes shipments with Northwind Logistics"), selects OAuth 2.0 > Dynamic discovery, creates a connection and adds the server. On the Tools page they turn off Allow all and enable only trackShipment and quoteShipment, then publish.',
      code: `Server name:        Northwind Logistics MCP
Server description: Tracks, reschedules and quotes shipments with Northwind Logistics.
Server URL:         https://mcp.northwind-logistics.com/mcp        (Streamable HTTP)
Authentication:     OAuth 2.0 -> Dynamic discovery (DCR + /.well-known discovery)
Tools:  Allow all = Off
        [x] trackShipment   [x] quoteShipment   [ ] rescheduleShipment   [ ] cancelShipment`,
      language: 'text',
      takeaway: 'Dynamic discovery is the least-configuration OAuth option; disable Allow all to expose only the tools your agent should have.',
    },
    {
      title: 'The MCP connector defined as a custom connector',
      description:
        'A team must put their MCP server behind an existing custom connector pipeline for policy reasons. They create the connector from an OpenAPI 2.0 YAML schema that marks the endpoint as MCP Streamable, as shown in the Microsoft example, and import it from Power Apps.',
      code: `swagger: '2.0'
info:
  title: Contoso MCP
  description: MCP server exposing Contoso inventory tools (Streamable HTTP)
  version: 1.0.0
host: mcp.contoso.com
basePath: /
schemes:
  - https
paths:
  /mcp:
    post:
      summary: Contoso inventory MCP server
      x-ms-agentic-protocol: mcp-streamable-1.0
      operationId: InvokeMCP
      responses:
        '200':
          description: Success
securityDefinitions:
  api_key:
    type: apiKey
    in: header
    name: x-api-key
security:
  - api_key: []`,
      language: 'yaml',
      takeaway: 'The x-ms-agentic-protocol: mcp-streamable-1.0 extension is what tells Power Platform the operation is an MCP Streamable endpoint.',
    },
    {
      title: 'The SSE server that would not connect (a realistic mistake)',
      description:
        'A developer points the wizard at an older in-house MCP server and gets connection failures. The server only implements the SSE transport. Copilot Studio stopped supporting SSE after August 2025 and requires Streamable HTTP. Upgrading the server SDK to Streamable fixes the connection; checking that generative orchestration is on and that no data policy blocks the new connector completes the troubleshooting.',
      takeaway: 'MCP integration requires the Streamable transport, generative orchestration and an unblocked connector.',
    },
    {
      title: 'Nightly invoice entry into a legacy desktop app',
      description:
        'Finance keys invoices into a 20-year-old Windows application with no API. The team registers a dedicated VM through Power Automate for desktop, enables it for computer use, and creates a computer use tool with step-by-step instructions, Inputs for the invoice fields, maker-provided credentials, stored desktop app credentials in Key Vault, an access control list containing only the app and the invoice portal, and two finance reviewers for human supervision. A scheduled agent flow triggers the agent nightly; auditors review screenshots in the Dataverse logs with retention set to 90 days.',
      takeaway: 'Computer use fills the gap where no API or connector exists; isolate the machine, scope access and keep humans reachable.',
    },
  ],
  keyPoints: [
    'MCP servers publish tools, resources and prompts; Copilot Studio uses tools and resources (resources only when returned by a tool) and discovers changes dynamically.',
    'MCP requires generative orchestration and the Streamable HTTP transport (SSE unsupported after August 2025); connectivity uses Power Platform connectors so data policies apply.',
    'The onboarding wizard takes name, description, URL and authentication: None, API key (header or query) or OAuth 2.0 (Dynamic discovery, Dynamic, Manual with a callback URL to register).',
    'Alternative route: a custom connector from an OpenAPI 2.0 YAML schema with x-ms-agentic-protocol: mcp-streamable-1.0; turn off Allow all to select individual tools and publish.',
    'Computer use drives Windows UIs through a CUA model; it needs generative orchestration, natural-language instructions with full URLs and app names, and works best for autonomous agents.',
    'Machines: hosted browser (preview, non-production), Cloud PC pool (preview, Entra joined, autoscaling) or bring-your-own machine via Power Automate for desktop with Enable for computer use.',
    'Security settings: maker or end-user credentials, stored credentials in internal storage or Key Vault, access control allow lists, Enforce HTTPS, human supervision reviewers (required or runs fail when the model pauses).',
    'Monitoring: Activity page with activity map, transcript and screenshots; Dataverse logs with verbosity and retention settings and optional Purview audit (CUAOperation).',
  ],
  flashcards: [
    { front: 'Which MCP primitives does Copilot Studio support?', back: 'Tools and resources (resources must be returned as a tool output); prompts are not yet supported.' },
    { front: 'Which MCP transport does Copilot Studio support?', back: 'Streamable HTTP only; SSE support ended after August 2025.' },
    { front: 'What are the three OAuth 2.0 configuration types in the MCP onboarding wizard?', back: 'Dynamic discovery (DCR with discovery), Dynamic (DCR, manual endpoints) and Manual (client ID, secret, URLs, scopes).' },
    { front: 'Which OpenAPI extension marks an operation as an MCP Streamable endpoint in a custom connector?', back: 'x-ms-agentic-protocol: mcp-streamable-1.0' },
    { front: 'How do you restrict an agent to a subset of an MCP server\'s tools?', back: 'Turn off Allow all on the server\'s tool page, enable the wanted tools, save and publish.' },
    { front: 'Which orchestration mode is required for MCP and computer use?', back: 'Generative orchestration.' },
    { front: 'What are the three places a computer use tool can run?', back: 'Hosted browser (preview), Cloud PC pool (preview, Windows 365 for agents), or a bring-your-own Windows machine registered with Power Automate for desktop.' },
    { front: 'What happens if a computer use tool has no human supervision reviewers and the model needs confirmation?', back: 'The run fails, because the request has nowhere to go; configure at least one reviewer.' },
    { front: 'Where can computer use screenshots and session replays be reviewed?', back: 'In the agent\'s Activity page: the activity map side panel when logs are stored in Dataverse, and the transcript view.' },
    { front: 'Which Purview activity records computer use runs when audit logging is enabled?', back: 'CUAOperation.' },
  ],
  quiz: [
    {
      question:
        'A SaaS vendor exposes its functionality through an MCP server that supports OAuth 2.0 Dynamic Client Registration with discovery. You need to add it to an agent with the least configuration. What should you do?',
      options: [
        'Create a custom connector from an OpenAPI 3.0 file describing each tool',
        'Use the MCP onboarding wizard with OAuth 2.0 set to Dynamic discovery',
        'Use the MCP onboarding wizard with OAuth 2.0 set to Manual and enter the client secret',
        'Add each tool as a REST API tool',
      ],
      correct: [1],
      explanation:
        'Dynamic discovery needs only the server URL because the client discovers endpoints and registers itself. Manual configuration and custom connectors require far more input, and REST API tools would lose dynamic discovery of MCP tools.',
    },
    {
      question:
        'An MCP server exposes twelve tools but your agent should only be able to call two of them. What should you do?',
      options: [
        'Ask the server owner to remove the other ten tools',
        'Turn off Allow all on the MCP server tool page, enable the two tools, save and publish',
        'Add the two tools as custom connector actions instead',
        'Set the tool to Ask the end user before running',
      ],
      correct: [1],
      explanation:
        'Individual tool toggles become available when Allow all is off, and newly added server tools then stay disabled. The other options either depend on third parties, discard MCP benefits, or merely add a confirmation prompt.',
    },
    {
      question:
        'An existing MCP server uses the SSE transport. The onboarding wizard fails to connect. What is the correct resolution?',
      options: [
        'Switch the agent to classic orchestration',
        'Update the server to the Streamable HTTP transport',
        'Change authentication to API key',
        'Register the callback URL with the identity provider',
      ],
      correct: [1],
      explanation:
        'Copilot Studio supports only Streamable HTTP for MCP. Classic orchestration disables MCP entirely, and authentication or callback changes do not address the transport mismatch.',
    },
    {
      question:
        'Which TWO statements about computer use are correct? (Select two)',
      options: [
        'Computer use requires generative orchestration',
        'The hosted browser is recommended for production automation of internal desktop apps',
        'Removing all human supervision reviewers makes the agent fully autonomous and prevents pauses',
        'A bring-your-own machine must have Power Automate for desktop installed and be enabled for computer use',
      ],
      correct: [0, 3],
      explanation:
        'Computer use is only available with generative orchestration, and BYO machines are registered through Power Automate for desktop with Enable for computer use. The hosted browser is for quick, non-production web scenarios, and removing reviewers causes runs to fail when the model pauses.',
    },
    {
      question:
        'Auditors need to review the screenshots of computer use runs from the past 60 days. The default configuration only retains them for seven days. What should an administrator do?',
      options: [
        'Enable Enforce HTTPS on the tool',
        'In the Power Platform admin center, keep Store logs in Dataverse on with verbosity All data and raise the log retention time',
        'Switch the tool to end-user credentials so each user keeps their own logs',
        'Add the auditors as human supervision reviewers',
      ],
      correct: [1],
      explanation:
        'Advanced computer use logging in Dataverse controls verbosity and retention (default 7 days); raising retention keeps screenshots available. HTTPS enforcement, credential mode and reviewer assignment do not affect log retention.',
    },
  ],
  statements: [
    { text: 'Copilot Studio reflects tools added to or removed from an MCP server without the maker redeploying the agent.', isTrue: true, explanation: 'Dynamic discovery is a core MCP benefit; with Allow all off, new tools start disabled.' },
    { text: 'MCP servers in Copilot Studio are exempt from Power Platform data policies.', isTrue: false, explanation: 'MCP connectivity relies on connectors, so connector data policies apply.' },
    { text: 'An MCP resource can be used by the agent only if the server returns it as the output of a tool.', isTrue: true, explanation: 'This is a documented requirement for resources.' },
    { text: 'The Cloud PC pool option is Entra joined and Intune enrolled, allowing access to organisational resources.', isTrue: true, explanation: 'Unlike the hosted browser, which is Microsoft-managed and not joined to your tenant.' },
    { text: 'Access control on a computer use tool prevents the model from opening unlisted websites.', isTrue: false, explanation: 'It prevents actions on unlisted sites and apps; the model can still navigate to them but cannot interact.' },
    { text: 'Maker-provided credentials are the default for computer use tools.', isTrue: true, explanation: 'This suits autonomous agents but means shared-agent users act with the maker\'s access.' },
    { text: 'Human supervision guarantees the computer use agent always pauses before risky actions.', isTrue: false, explanation: 'It is probabilistic model behaviour and not a fail-safe.' },
  ],
  resources: [
    { label: 'Extend your agent with Model Context Protocol', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp' },
    { label: 'Connect your agent to an existing MCP server', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-add-existing-server-to-agent' },
    { label: 'Automate web and desktop apps with computer use', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/computer-use' },
    { label: 'Monitor computer use', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/monitor-computer-use' },
  ],
};

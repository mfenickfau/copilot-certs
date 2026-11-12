import type { Concept } from '../../types';

export const connectorAndRestApiTools: Concept = {
  id: 'connector-and-rest-api-tools',
  title: 'Tools from Connectors, Custom Connectors and REST APIs',
  summary:
    'How agents act on external systems: prebuilt and custom Power Platform connectors as tools, the REST API tool built from an OpenAPI specification, authentication choices (none, API key, OAuth 2.0, On-Behalf-Of), tool details, inputs and completion settings, and the governance that applies to all of them.',
  certs: ['ab-620', 'ab-100'],
  domains: ['ab-620-2', 'ab-100-2'],
  outcomes: ['ab-620-2-2-3', 'ab-620-2-2-4', 'ab-100-2-2-3'],
  tags: ['copilot-studio', 'tools', 'connectors', 'custom-connector', 'rest-api', 'openapi', 'oauth', 'on-behalf-of'],
  difficulty: 'advanced',
  diagram: 'copilot-extensibility-options',
  sections: [
    {
      heading: 'The tool model and how the orchestrator uses it',
      body: `A **tool** is a capability the agent can invoke: connector action, custom connector action, REST API operation, agent flow, prompt, MCP server or computer use. Under **generative orchestration** the agent picks tools from their **name and description**, the conversation context, the user's intent, available inputs and outputs, and prior tool use; under classic orchestration tools run only when a topic calls them. Up to **128 tools** per agent are supported, with **25 to 30** recommended for accuracy; child agents each manage their own set.

Every tool's configuration page has three sections:

- **Details**: name, description, **Allow agent to decide dynamically when to use the tool** (clear it to make the tool topic-only), **Ask the end user before running** (a confirmation card), **Authentication** (End user or Maker-provided credentials) and a user-facing description shown when consent is needed.
- **Inputs**: each parameter is **Dynamically filled with AI** by default (extracted from context or asked for with a generated question); **Customize** sets display name, entity type, retry logic and validation; **Custom value** pins a literal, variable or Power Fx formula so the user is never asked.
- **Completion**: Don't respond (output folded into the agent's reply), Write the response with generative AI, Send specific response, or Send an adaptive card; plus which outputs are exposed to the agent and other tools.

Tools are added from the agent's **Tools** page (**Add a tool**: Agent flow, Prompt, Model Context Protocol, Computer use, and under See all: REST API, Custom connector, Connector) or from a topic node. Tools created once on the environment-wide **Tools** page can be shared across agents. If a tool type is greyed out, a **data policy** blocks it; the information icon explains which policy.`,
    },
    {
      heading: 'Prebuilt and custom Power Platform connectors',
      body: `**Connectors** wrap APIs so Copilot Studio, Power Automate, Power Apps and Logic Apps can call them with managed connections. **Standard** connectors (SharePoint, Outlook, Dataverse) are included in all Copilot Studio plans; **premium** connectors are available in selected plans; **custom connectors** cover any API you define.

Adding a prebuilt connector tool: **Tools > Add a tool > Connector**, pick the service, pick the action, create or select a **connection**, then **Add and configure**. By default the tool uses **user credentials**: when the orchestrator first calls it, the user sees a **connection card**, selects Connect, completes consent in a pop-up, and the tool retries automatically; Copilot Studio stores no credentials and re-prompts when tokens expire. User authentication for tools is supported on the custom website, Teams (with Teams SSO configured), SharePoint and Omnichannel live chat, but not on the demo website, Azure Bot Service channels, Facebook or the mobile app. Switch to **Maker-provided credentials** for shared, low-risk resources; the agent must be on an authenticated channel, and sharing the agent then lets every user act with the maker's access.

**Custom connectors** are created in **Power Apps** (**Add a tool > New tool > Custom connector**) from an **OpenAPI definition**, a Postman collection, or from scratch, with their own authentication model (none, API key, basic, OAuth 2.0, Entra ID). The connector must be **shared** (view permission) with the organisation or the agent's users for the agent to call it, and it should live in the **same solution** as the agent so ALM moves it together; import custom connectors **before** the connection references and agent.

For a custom API that must act **as the user** without a second sign-in, configure **On-Behalf-Of (OBO)** authentication: register the API (expose a scope such as \`employee.read\`), register the connector app with **delegated** permissions to that scope (or to Microsoft Graph), grant admin consent, authorise the Azure API Connections service principal, and configure the connector's Entra ID authentication. At run time the agent asks the user once for permission and then calls the API with an OBO token.`,
    },
    {
      heading: 'The REST API tool',
      body: `The **REST API** tool (preview) is the no-connector route: upload an **OpenAPI specification**, describe it, choose authentication, select operations, and Copilot Studio generates the tools (and, behind the scenes, a connector in a solution). Requirements and steps:

1. **Specification**: a JSON file in **OpenAPI v2** format; a v3 file is translated to v2 automatically. The spec's descriptions seed the tool descriptions.
2. **Description and solution**: rewrite the API description so the orchestrator knows when to use it (verbs, synonyms, data it covers). Pick a **solution**; leaving it blank creates one with the action name and default publisher.
3. **Authentication**: **None**, **API key** (parameter label, name, and location in header or query; the user supplies the key at run time) or **OAuth 2.0** (client ID, client secret, authorization URL, token URL, refresh URL, scopes, plus whether only your Microsoft 365 organisation or any organisation may use the endpoints, and which client app may call them).
4. **Select tools**: pick only the endpoint-and-method combinations you want exposed (for example expose GET and PATCH on tickets but not DELETE), give each a name and a specific description, and complete every input and output description; blanks block progress.
5. **Review and publish**, then **Create connection** and add each generated tool to the agent.

Compare with the **Send HTTP request** node: the node is a fixed step inside one topic with no connection management; the REST API tool is orchestrator-selectable, governed by data policies and reusable. Compare with a **custom connector**: a custom connector gives you full control (policies, triggers, custom code) and can be certified; the REST API wizard is faster for read-mostly integrations. MCP is the alternative when the system already publishes an MCP server.`,
    },
    {
      heading: 'Governance and the exam angle',
      body: `All three mechanisms are **connectors underneath**, so **Power Platform data policies** govern them: a policy can block a connector, put it in a business or non-business group, or restrict endpoints, and the maker sees blocked tools disabled. The **automatic security scan** flags risky combinations such as maker-provided credentials on a tool that returns personal data. Admins can **bypass connector consent cards** for trusted agents, and **connector dependency insights** show which agents use which connectors before deployment.

Exam cues:

- "Expose an internal API to the agent with the least effort, read and update only": **REST API tool** from the OpenAPI spec, selecting only those operations.
- "The API must be reused in Power Automate and Power Apps too, with custom policies": **custom connector**.
- "Users should not be prompted to sign in again to a custom API they already consented to": **OBO** on the custom connector.
- "A shared mailbox is used for all notifications": **Maker-provided credentials** on that tool.
- "Only show data each user is entitled to": **End user credentials**.
- "The tool is greyed out in Add a tool": **data policy**.
- "The agent keeps calling the wrong tool": fix **descriptions**, reduce tool count or split into **child agents**.

Distractors: uploading an OpenAPI v3 YAML file and expecting it to be stored as v3 (it is converted to v2 JSON), choosing the HTTP node for orchestrator-selected calls, using Authenticate with Microsoft on the agent and assuming it covers third-party API authentication, or deleting a tool when disabling it would do.`,
    },
  ],
  examples: [
    {
      title: 'Exposing a ticketing API with the REST API tool',
      description:
        'Fabrikam has an internal ticket service with an OpenAPI v3 definition. The developer exports it as JSON, uploads it through Tools > Add a tool > New tool > REST API, rewrites the description, selects OAuth 2.0 with the Entra app registration details, and exposes only getTicket and updateTicket (not deleteTicket). Each tool gets a precise description and completed parameter descriptions before publishing.',
      code: `{
  "swagger": "2.0",
  "info": { "title": "Fabrikam Tickets", "version": "1.0",
    "description": "Get, find, display and update existing support tickets by ticket number for Fabrikam employees." },
  "host": "tickets.fabrikam.com", "basePath": "/api", "schemes": ["https"],
  "securityDefinitions": { "oauth2": { "type": "oauth2", "flow": "accessCode",
    "authorizationUrl": "https://login.microsoftonline.com/<tenant>/oauth2/v2.0/authorize",
    "tokenUrl": "https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token",
    "scopes": { "api://fabrikam-tickets/Tickets.ReadWrite": "Read and update tickets" } } },
  "paths": {
    "/tickets/{id}": {
      "get":   { "operationId": "getTicket", "summary": "Get a ticket by number",
                 "parameters": [ { "name": "id", "in": "path", "required": true, "type": "string",
                                   "description": "The ticket number, e.g. INC-1042" } ],
                 "responses": { "200": { "description": "Ticket", "schema": { "$ref": "#/definitions/Ticket" } } } },
      "patch": { "operationId": "updateTicket", "summary": "Update status or notes on a ticket",
                 "parameters": [ { "name": "id", "in": "path", "required": true, "type": "string" },
                                 { "name": "body", "in": "body", "schema": { "$ref": "#/definitions/TicketUpdate" } } ],
                 "responses": { "200": { "description": "Updated ticket" } } }
    }
  },
  "definitions": {
    "Ticket": { "type": "object", "properties": { "id": { "type": "string" }, "status": { "type": "string" },
                "summary": { "type": "string" } } },
    "TicketUpdate": { "type": "object", "properties": { "status": { "type": "string" }, "note": { "type": "string" } } }
  }
}`,
      language: 'json',
      takeaway: 'The REST API tool wants an OpenAPI v2 JSON spec with good descriptions; expose only the operations users should be able to run.',
    },
    {
      title: 'The connector that worked only for the maker (a realistic mistake)',
      description:
        'A maker adds a custom connector tool, tests it successfully, and publishes. Colleagues get "connector not found" errors. The custom connector was never shared: for an agent to use it, the connector needs view (and for admins, share) permission for the organisation or the users. After sharing the connector in Power Apps and adding it to the agent\'s solution, the tool works for everyone with their own connection.',
      takeaway: 'Custom connectors must be shared with the agent\'s users and travel in the same solution as the agent.',
    },
    {
      title: 'Choosing credentials per tool',
      description:
        'An HR agent has three tools: "Get my payslip" (custom connector to the payroll API), "Send a message to the HR shared mailbox" (Outlook connector) and "Look up office addresses" (SharePoint list). The developer sets end-user credentials on the payslip tool so each person sees only their own data, maker-provided credentials on the shared mailbox tool because the mailbox is shared and the content is low risk, and maker-provided credentials on the public addresses list. The security scan passes without warnings.',
      takeaway: 'Credential mode is a per-tool decision driven by data sensitivity: user credentials for personal data, maker credentials for shared, low-risk resources.',
    },
    {
      title: 'OBO for a custom HR API',
      description:
        'Users complained about signing in twice: once to Teams and again to the custom HR connector. The developer registers the HR API in Entra with an employee.read scope, creates a connector app registration with delegated permission to that scope, grants admin consent, authorises the Azure API Connections service principal, and configures the custom connector for Entra ID OBO. Now the agent asks once for permission and calls the API as the user silently.',
      takeaway: 'OBO authentication with delegated permissions gives a single consent and token exchange on behalf of the signed-in user.',
    },
  ],
  keyPoints: [
    'Tools (connector actions, custom connectors, REST API operations, flows, prompts, MCP, computer use) are selected by the orchestrator from name and description; up to 128 per agent, 25 to 30 recommended.',
    'Tool configuration has Details (dynamic use, confirmation, authentication), Inputs (dynamic AI fill, customise, custom value) and Completion (don\'t respond, generative, specific, adaptive card).',
    'Prebuilt connectors are standard or premium; by default tools use end-user credentials with a connection card at first use; maker-provided credentials suit shared low-risk resources.',
    'User authentication for tools is supported on custom website, Teams (with SSO), SharePoint and Omnichannel live chat, not on demo website, Facebook, mobile app or Azure Bot Service channels.',
    'Custom connectors are built in Power Apps from an OpenAPI definition, must be shared with users and kept in the agent\'s solution (import connectors before connection references); OBO with delegated permissions lets them act as the user.',
    'The REST API tool takes an OpenAPI v2 JSON spec (v3 is converted), a description, None/API key/OAuth 2.0 authentication, a solution, and a selection of operations with completed descriptions.',
    'HTTP node versus REST API tool: fixed topic step with no connection management versus orchestrator-selectable, governed, reusable tool.',
    'All tool types are connectors underneath and governed by Power Platform data policies; blocked tools appear disabled in Add a tool.',
  ],
  flashcards: [
    { front: 'What OpenAPI version must a REST API tool specification be in?', back: 'OpenAPI v2 (Swagger 2.0) JSON; a v3 specification is translated to v2 automatically.' },
    { front: 'Which three authentication choices does the REST API tool wizard offer?', back: 'None, API key (header or query parameter) and OAuth 2.0.' },
    { front: 'What happens the first time an orchestrator calls a tool that uses end-user credentials?', back: 'The user sees a connection card, selects Connect, completes consent in a pop-up, and the tool retries automatically.' },
    { front: 'Where are custom connectors created from Copilot Studio?', back: 'Tools > Add a tool > New tool > Custom connector opens Power Apps, where you import an OpenAPI definition or build from scratch.' },
    { front: 'What is On-Behalf-Of (OBO) authentication used for?', back: 'Letting a custom connector call an API as the signed-in user with delegated permissions after a single consent, avoiding repeated sign-ins.' },
    { front: 'How do you stop the orchestrator from calling a tool unless a topic invokes it?', back: 'Clear Allow agent to decide dynamically when to use the tool in the tool Details.' },
    { front: 'How many tools can an agent have with generative orchestration, and how many are recommended?', back: 'Up to 128; 25 to 30 recommended for best results.' },
    { front: 'Why might a tool type appear disabled in the Add a tool pane?', back: 'A Power Platform data policy blocks it; the information icon explains which policy.' },
    { front: 'Which channels support user authentication for tools?', back: 'Custom website, Microsoft Teams (with SSO), SharePoint and Omnichannel live chat.' },
    { front: 'In which order should custom connectors and the agent solution be imported into a new environment?', back: 'Custom connectors first, then the connection references with the agent solution.' },
  ],
  quiz: [
    {
      question:
        'You need the agent to retrieve and update tickets in an internal system that publishes an OpenAPI v3 definition. Users must not be able to delete tickets. Which approach requires the LEAST effort?',
      options: [
        'Add a Send HTTP request node for each operation in every topic',
        'Use Tools > Add a tool > New tool > REST API, upload the spec, and select only the get and update operations',
        'Write a Power Automate flow for each operation and expose the flows as tools',
        'Build an MCP server that wraps the API',
      ],
      correct: [1],
      explanation:
        'The REST API tool wizard generates tools from the spec (converting v3 to v2) and lets you expose only chosen operations. HTTP nodes are per-topic and not orchestrator-selectable, flows add unnecessary layers, and building an MCP server is far more work.',
    },
    {
      question:
        'A custom connector tool works when the maker tests it but fails for other users with a permissions error. What should you do FIRST?',
      options: [
        'Switch the tool to maker-provided credentials',
        'Share the custom connector with the organisation or the agent\'s users in Power Apps',
        'Change the agent to No authentication',
        'Re-upload the OpenAPI file as v3',
      ],
      correct: [1],
      explanation:
        'Custom connectors need view (and share) permissions for the users of the agent. Maker credentials would make everyone act as the maker, No authentication prevents user-credential tools entirely, and the OpenAPI version is unrelated.',
    },
    {
      question:
        'Users already signed in to Teams are prompted to sign in again whenever the agent calls a custom connector to an internal Entra-protected API. You need a single consent and silent calls as the user. What should you configure?',
      options: [
        'API key authentication on the connector',
        'Maker-provided credentials on the tool',
        'On-Behalf-Of authentication on the custom connector with delegated permissions to the API scope',
        'Ask the end user before running on the tool',
      ],
      correct: [2],
      explanation:
        'OBO authentication exchanges the user\'s token for an API token after one consent. API keys are not user identities, maker credentials remove per-user access, and the confirmation prompt is unrelated to sign-in.',
    },
    {
      question:
        'Which TWO statements about tool configuration are correct? (Select two)',
      options: [
        'Setting an input\'s Fill using to Custom value means the agent never asks the user for it',
        'Tools can only be deleted from the environment-wide Tools page',
        'Clearing Allow agent to decide dynamically makes a tool usable only when a topic calls it',
        'Maker-provided credentials are the default for all new connector tools',
      ],
      correct: [0, 2],
      explanation:
        'Custom value overrides dynamic filling, and clearing dynamic use restricts a tool to explicit topic calls. Tools are deleted from the agent\'s Tools page (not the environment page), and end-user credentials are the default.',
    },
    {
      question:
        'Compliance requires that no agent in the environment can use the Twitter connector, and makers should see why it is unavailable. What should an administrator do?',
      options: [
        'Ask each maker to remove the connector from their tools',
        'Create a Power Platform data policy that blocks the connector for the environment',
        'Turn off generative orchestration in the environment',
        'Set all agents to Authenticate manually',
      ],
      correct: [1],
      explanation:
        'Data policies block connectors centrally and the Add a tool pane shows the blocked tool as disabled with an explanation. Per-maker requests are not enforceable, orchestration mode and authentication do not restrict connectors.',
    },
  ],
  statements: [
    { text: 'The REST API tool stores an uploaded OpenAPI v3 specification as v3.', isTrue: false, explanation: 'It is translated to OpenAPI v2 because of how Power Platform processes specifications.' },
    { text: 'By default a connector tool uses the credentials of the end user interacting with the agent.', isTrue: true, explanation: 'Maker-provided credentials must be chosen explicitly.' },
    { text: 'Copilot Studio stores users\' connector credentials for reuse.', isTrue: false, explanation: 'It stores no credentials; it uses connections and re-prompts when a token expires or is revoked.' },
    { text: 'The demo website channel supports user authentication for tools.', isTrue: false, explanation: 'Supported channels are custom website, Teams, SharePoint and Omnichannel live chat.' },
    { text: 'A custom connector must have view and share permissions for the organisation for the agent to use it.', isTrue: true, explanation: 'This is stated in the add tools documentation.' },
    { text: 'Microsoft recommends keeping an agent to about 25 to 30 tools even though 128 are supported.', isTrue: true, explanation: 'Too many or similar tools degrade selection accuracy.' },
    { text: 'Data policies cannot affect REST API tools because they are not connectors.', isTrue: false, explanation: 'REST API tools are created as connectors in a solution and are governed by data policies.' },
  ],
  resources: [
    { label: 'Use Power Platform connectors as tools in Copilot Studio agents', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-connectors' },
    { label: 'Extend your agent with tools from a REST API (preview)', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api' },
    { label: 'Configure OBO authentication for custom connectors', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-custom-connector-on-behalf-of' },
    { label: 'Configure user authentication for tools', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-enduser-authentication' },
  ],
};

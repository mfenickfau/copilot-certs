import type { Concept } from '../../types';

export const zeroTrustSecurityForAgents: Concept = {
  id: 'zero-trust-security-for-agents',
  title: 'Zero Trust Security for Multi-Agent Solutions: Identity, Access, Secrets and Red Teaming',
  summary:
    'How to secure a fleet of agents the Zero Trust way: per-agent Microsoft Entra agent identities and blueprints, the three authorization boundaries in Foundry Agent Service, least-privilege RBAC and network isolation, authentication flows (agent identity, on-behalf-of user delegation, OAuth passthrough, API keys), Key Vault for secrets and rotation, and shift-left testing with the AI Red Teaming Agent.',
  certs: ['ai-500'],
  domains: ['ai-500-1', 'ai-500-4'],
  outcomes: ['ai-500-1-1-4', 'ai-500-1-2-2', 'ai-500-4-1-1', 'ai-500-4-1-2', 'ai-500-4-1-3', 'ai-500-4-1-4'],
  tags: ['zero-trust', 'entra-agent-id', 'rbac', 'on-behalf-of', 'key-vault', 'private-link', 'red-teaming', 'security'],
  difficulty: 'advanced',
  sections: [
    {
      heading: 'Three boundaries, no implicit trust',
      body: `Zero Trust for agents means verifying explicitly at every hop, granting least privilege per identity, and assuming breach of any single component. Foundry Agent Service makes the hops concrete with **three independent authorization boundaries**, and permissions never carry across them:

1. **Developer or administrator to Foundry resources** (control plane and management): who may create, configure or delete projects, agents, connections. Governed by Azure RBAC with Foundry roles: **Foundry User** (create and run agents), **Foundry Project Manager** (plus connections and role assignments), **Foundry Account Owner** (account-level control plane, no data plane), **Foundry Owner** (control and data plane, no role assignments).
2. **Caller to agent endpoint** (runtime): who may invoke an agent. The default **AzureRbac** scheme requires the \`endpoints/interact/action\` permission; **Foundry Agent Consumer** is the least-privilege built-in role and can be assigned at *agent scope* so a caller reaches one agent, not the project. The preview **AgentBlueprint** scheme lets a caller present a token for the agent's blueprint instead of holding Foundry RBAC at all. Teams and Microsoft 365 use the Bot Service schemes. API keys are not supported for agent endpoints.
3. **Agent to downstream tool or resource**: each tool connection chooses whose identity reaches the tool (agent identity, project managed identity, the signed-in user, a stored key, or none), and the downstream service makes its own authorization decision.

Per-agent identity scoping is what prevents **lateral movement**: if one agent is compromised through prompt injection, its own identity has only the roles it needs on its own resources, so it cannot read the HR agent's data or call the finance agent's tools. The shared project managed identity is the anti-pattern here; it is retained for legacy agents only.`,
    },
    {
      heading: 'Entra agent identities, blueprints and token exchange',
      body: `Foundry provisions a **Microsoft Entra agent identity** (a special service principal) for each agent under an **agent identity blueprint** that models the agent and acts as the parent and governing template. The blueprint carries a federated identity credential trusted only when the Foundry resource provider acts in your tenant; no client secret or certificate exists for your code to leak, and the project, agent code and project managed identity never hold the credential.

A new agent identity starts with **no permissions**. You grant exactly what it needs on each downstream resource (for example, Storage Blob Data Reader on one container), which is the compliance control mapping regulators ask for: a clear inventory of agents, their owners, and their effective access, surfaced through Entra and Foundry Control Plane.

At runtime, for a service-managed tool call using agent identity, Foundry performs a multistep OAuth 2.0 token exchange: blueprint authentication, impersonation of the agent identity, token acquisition for the downstream audience, and the call. Inside a hosted agent, your code obtains these tokens through the ordinary Azure Identity SDK (\`DefaultAzureCredential\` or \`ManagedIdentityCredential\` against the hosted-agent token service); you cannot select an arbitrary identity, only the agent's own, which again blocks lateral movement.

Conditional Access can govern these flows, and the Foundry MCP Server's own service principal can be targeted by Conditional Access policies so only approved users or workload identities may run management tools.`,
    },
    {
      heading: 'Authentication flows: picking the right one per tool',
      body: `The exam distinguishes four flows and expects you to choose by one question: *does the downstream service need to know which user is asking?*

| Flow | Identity presented downstream | Use when |
|---|---|---|
| **Agent identity** (or project managed identity) | The agent as an Entra principal | Autonomous or shared access; audit per agent; Azure services supporting Entra |
| **On-behalf-of user delegation** (\`UserEntraToken\` compatibility path, \`AgentOnBehalfOfUser\` in preview) | The signed-in user, with Foundry or the agent as the actor | Downstream must apply the user's permissions (Graph, SharePoint, Fabric, Foundry IQ); honours sensitivity labels |
| **OAuth 2.0 identity passthrough** | The user who completed an OAuth consent to the remote provider | Third-party SaaS and MCP servers (GitHub, partner tools) where each user signs in |
| **API key or custom header** | The principal behind the stored key | Legacy services without Entra or OAuth; shared access only; store in a project connection |

User impersonation in your own hosted code uses the classic **on-behalf-of (OBO)** pattern: a trusted backend validates the user token, exchanges it for a downstream token as a confidential client, calls Foundry with its own workload token in \`Authorization\`, forwards the delegated token in an \`x-client-*\` header, and passes the user's object id in \`x-ms-user-identity\` so Foundry isolates the conversation per user. That last header requires the custom data action \`Microsoft.CognitiveServices/accounts/AIServices/agents/endpoints/UserIdentityImpersonation/action\`, which no built-in role includes. Two rules the docs stress: the OBO exchange changes the token audience but never the user represented, and you must not fall back to application permissions when delegated access fails.`,
    },
    {
      heading: 'Network boundaries, secrets and shift-left red teaming',
      body: `**Network.** Default Foundry is fully public. Choose an egress model first: public egress (optionally with a private endpoint so only your network can call the endpoint), **bring-your-own virtual network** (agents injected into a delegated subnet, private endpoints to Storage, AI Search, Cosmos DB, Key Vault), or a **Microsoft-managed virtual network** when you cannot manage IP space. Set public network access to Disabled or Selected networks, and for private MCP servers host them in Container Apps with internal-only ingress on a dedicated MCP subnet. Hosted agents can additionally carry **network egress controls** inside their guardrail (RAI) policy, allowing only listed destinations.

**Secrets.** Connect your own Azure Key Vault so connection secrets live in your subscription; assign the Foundry resource's managed identity Key Vault Secrets Officer, use RBAC rather than access policies, enable purge protection, and rotate keys on a schedule. Prefer Entra authentication so there is no secret at all; where keys are unavoidable (third-party MCP servers), store them in project connections, restrict who can read the project, and never place keys in prompts, code or traces. Customer-managed keys cover encryption at rest.

**Shift left.** Security testing starts before deployment. The **AI Red Teaming Agent** uses Microsoft's open-source PyRIT to simulate adversarial users across risk categories (hate, violence, self-harm, sexual content, prohibited actions, sensitive data leakage), applies attack strategies that transform prompts to evade alignment, scores each attack-response pair with the risk and safety evaluators, and reports **Attack Success Rate (ASR)**. Run it locally during prototyping, in the cloud against Foundry agents before each release, and on a schedule after deployment from the agent's Monitor settings. Pair it with Defender for Cloud posture recommendations and Purview DSPM for AI, both surfaced in Foundry Control Plane.`,
    },
  ],
  examples: [
    {
      title: 'Scoping identities for an HR and finance agent pair',
      description:
        'A Zero Trust review found both agents used the project managed identity with Contributor on the resource group. Redesign: each agent gets its own Entra agent identity; the HR agent gets Storage Blob Data Reader on the hr-docs container only and user delegation for SharePoint; the finance agent gets a Cosmos DB data role on one database; callers get Foundry Agent Consumer at agent scope. A compromised HR agent now cannot reach finance data, and audit logs attribute every call to a specific agent.',
      takeaway: 'Per-agent identities with resource-scoped roles are the Zero Trust control that stops lateral movement and enables attribution.',
    },
    {
      title: 'Hosted agent acquiring a downstream token with its own identity',
      description:
        'Inside a hosted agent container, the Azure Identity SDK obtains tokens from the hosted-agent token service for the agent identity only. The code never sees a secret and cannot pick another identity.',
      language: 'python',
      code: `from azure.core.exceptions import ClientAuthenticationError
from azure.identity import DefaultAzureCredential  # chain includes ManagedIdentityCredential
from azure.storage.blob import BlobServiceClient

def read_policy_doc(account_url: str) -> bytes:
    credential = DefaultAzureCredential()         # resolves to the agent identity in Foundry
    try:
        credential.get_token("https://storage.azure.com/.default")
    except ClientAuthenticationError:
        raise RuntimeError("Agent identity has no token; check role assignments")
    client = BlobServiceClient(account_url, credential=credential)
    # Works only if the agent identity holds Storage Blob Data Reader on this container.
    return client.get_blob_client("hr-docs", "leave-policy.md").download_blob().readall()`,
      takeaway: 'Grant the agent identity the narrowest downstream role; token acquisition is keyless and identity-bound.',
    },
    {
      title: 'Falling back to app permissions when OBO failed (a realistic mistake)',
      description:
        'A backend implemented on-behalf-of for Microsoft Graph. When a user had not consented (AADSTS65001), the code caught the error and retried with the application\'s own Graph permissions "so the demo would not break". Every unconsented user could now read any mailbox the app could. The fix: surface the consent failure to the user, never substitute application identity for delegated access, and keep x-ms-user-identity tied to the validated user from the OBO exchange.',
      language: 'python',
      code: `import httpx

def call_agent_for_user(foundry_token: str, graph_token_for_user: str, user_oid: str, text: str):
    # Three headers, three different purposes. Never derive user_oid from client-supplied data.
    headers = {
        "Authorization": f"Bearer {foundry_token}",            # backend -> Foundry (not forwarded)
        "x-client-graph-access-token": graph_token_for_user,   # delegated token forwarded to agent code
        "x-ms-user-identity": user_oid,                         # per-user conversation isolation
    }
    return httpx.post(AGENT_RESPONSES_URL, headers=headers, json={"input": text}, timeout=60)

# WRONG (removed): on consent failure, do NOT retry with app-only Graph permissions.`,
      takeaway: 'Delegated access failures are consent problems to surface, not a reason to widen access with application permissions.',
    },
    {
      title: 'Scheduling red teaming as a release gate',
      description:
        'Before promoting a customer-facing agent, the team runs a cloud red-team evaluation against the agent with prohibited-actions and sensitive-data-leakage evaluators, fails the pipeline if Attack Success Rate exceeds their threshold, and enables weekly scheduled scans from the Monitor tab after launch. Findings feed guardrail controls and instruction fixes, and the ASR trend becomes a tracked metric.',
      language: 'python',
      code: `from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

project = AIProjectClient(endpoint=ENDPOINT, credential=DefaultAzureCredential())
client = project.get_openai_client()

red_team = client.evals.create(
    name="Pre-release red team",
    data_source_config={"type": "azure_ai_source", "scenario": "red_team"},
    testing_criteria=[
        {"type": "azure_ai_evaluator", "name": "Prohibited Actions",
         "evaluator_name": "builtin.prohibited_actions"},
        {"type": "azure_ai_evaluator", "name": "Sensitive Data Leakage",
         "evaluator_name": "builtin.sensitive_data_leakage"},
    ],
)
# A run then targets the Foundry agent by name; the pipeline gates on attack success rate.`,
      takeaway: 'Shift left: automated adversarial scans with ASR thresholds before release, scheduled scans after.',
    },
  ],
  keyPoints: [
    'Foundry has three independent authorization boundaries (management, caller-to-endpoint, agent-to-tool); permission at one never implies permission at another.',
    'Each agent gets its own Entra agent identity under a blueprint, starts with zero permissions, and is granted resource-scoped roles; this stops lateral movement and enables per-agent audit.',
    'Foundry Agent Consumer is the least-privilege role for invoking an agent and can be assigned at agent scope; API keys are not accepted on agent endpoints.',
    'Choose the auth flow by whether the downstream service must apply the user\'s permissions: agent identity for autonomous access, user delegation (UserEntraToken/AgentOnBehalfOfUser) or OAuth passthrough for user-scoped data, keys only for legacy services.',
    'Own-code OBO forwards the delegated token in an x-client-* header and the user object id in x-ms-user-identity, which requires the UserIdentityImpersonation data action; never fall back to app permissions.',
    'Network isolation: pick the egress model (public, BYO VNet, managed VNet), disable public access, use private endpoints, host private MCP servers on a dedicated subnet, and add egress controls to hosted-agent guardrails.',
    'Connect your own Key Vault for connection secrets, use RBAC and rotation, prefer Entra over keys, and keep secrets out of prompts, code and traces.',
    'The AI Red Teaming Agent (PyRIT-based) simulates attacks, scores them with safety evaluators and reports Attack Success Rate; run it pre-release and on a schedule.',
  ],
  flashcards: [
    { front: 'Name the three authorization boundaries in Foundry Agent Service.', back: 'Developer/admin to Foundry resources; caller to agent endpoint; agent to downstream tool or resource.' },
    { front: 'What is an agent identity blueprint?', back: 'The Entra object that models an agent and is the parent/governing template for its agent identities; it holds a federated identity credential so no client secret is needed.' },
    { front: 'What permissions does a newly created agent identity have?', back: 'None; you grant resource-scoped roles explicitly.' },
    { front: 'Which built-in role lets a principal call an agent endpoint without managing agents?', back: 'Foundry Agent Consumer, assignable at project or agent scope.' },
    { front: 'Which header carries the end user\'s object id to Foundry for per-user isolation, and what permission does it need?', back: 'x-ms-user-identity; the caller needs the Microsoft.CognitiveServices/accounts/AIServices/agents/endpoints/UserIdentityImpersonation/action data action.' },
    { front: 'When should you use OAuth identity passthrough rather than Entra user delegation?', back: 'When each user must sign in to a third-party provider (e.g., a partner MCP server or GitHub) that is not Entra-protected.' },
    { front: 'What does an OBO token exchange change and not change?', back: 'It changes the token audience (middle tier to downstream API) but never which user is represented.' },
    { front: 'Which Key Vault role does Foundry\'s managed identity need for a BYO Key Vault connection?', back: 'Key Vault Secrets Officer (minimum), assigned via RBAC.' },
    { front: 'What metric does the AI Red Teaming Agent report?', back: 'Attack Success Rate (ASR): successful attacks divided by total attacks, per risk category and strategy.' },
    { front: 'What open-source framework powers the AI Red Teaming Agent?', back: 'PyRIT (Python Risk Identification Tool).' },
    { front: 'Which Foundry networking option gives full isolation when your IP address space overlaps or you cannot manage IP ranges?', back: 'Managed virtual network.' },
  ],
  quiz: [
    {
      question:
        'A compromised research agent in your project was manipulated into reading the finance agent\'s Cosmos DB container. Both agents use the project managed identity with Contributor on the resource group. Which change MOST directly prevents this lateral movement?',
      options: [
        'Add a content-safety guardrail to the research agent\'s output.',
        'Give each agent its own Entra agent identity and grant resource-scoped data roles only on the resources that agent needs.',
        'Rotate the project managed identity\'s credentials monthly.',
        'Move both agents to a managed virtual network.',
      ],
      correct: [1],
      explanation:
        'Per-agent identities with least-privilege roles remove the shared, over-broad access that enabled lateral movement. Output guardrails do not restrict data access, managed identities have no rotatable credential, and network isolation does not change RBAC.',
    },
    {
      question:
        'A web app lets employees ask an agent about their own SharePoint documents. The agent must return only documents the employee can access. Which authentication design is correct?',
      options: [
        'Configure the SharePoint tool connection with the project managed identity granted Sites.Read.All.',
        'Configure the tool connection for Microsoft Entra client user delegation so the downstream call carries the user\'s context.',
        'Store a service account API key in the connection.',
        'Use unauthenticated access and filter results in the prompt.',
      ],
      correct: [1],
      explanation:
        'User delegation lets SharePoint enforce the user\'s permissions and sensitivity labels. Application-level access returns everything the app can see, keys are shared identities, and prompt filtering is not a security control.',
    },
    {
      question: 'Which TWO statements about calling a Foundry agent endpoint are true? (Select two)',
      options: [
        'API keys can be used to authenticate to an agent endpoint.',
        'Foundry Agent Consumer can be assigned at the scope of a single agent.',
        'A principal with permission to manage an agent is automatically authorized to invoke it at runtime.',
        'The AzureRbac scheme requires the caller to hold the endpoints/interact data action at project or agent scope.',
      ],
      correct: [1, 3],
      explanation:
        'Agent-scope assignments and the interact action are how AzureRbac works. API keys are not supported for agent endpoints, and permissions do not carry across the management and runtime boundaries.',
    },
    {
      question:
        'Your backend performs on-behalf-of for Microsoft Graph before calling a hosted agent. A user has not consented and the exchange fails with AADSTS65001. What should the backend do?',
      options: [
        'Retry the Graph call using the application\'s own Graph permissions.',
        'Surface the consent requirement to the user and do not call Graph for them until consent is granted.',
        'Use another user\'s cached delegated token for the same tenant.',
        'Send the original user token to the agent in the Authorization header.',
      ],
      correct: [1],
      explanation:
        'Falling back to application permissions silently widens access; reusing other users\' tokens is a breach; the Authorization header carries the backend\'s Foundry token and is not forwarded. Consent failures must be surfaced.',
    },
    {
      question:
        'Compliance requires that no agent traffic to Storage, AI Search or Cosmos DB traverses the public internet, and the network team must control IP ranges and peering. Which Foundry networking option should you specify?',
      options: [
        'Public egress with a private endpoint for inbound.',
        'Bring-your-own virtual network with private endpoints to the data resources.',
        'Default public networking with IP allowlisting.',
        'Managed virtual network.',
      ],
      correct: [1],
      explanation:
        'BYO VNet isolates egress while you control IP ranges and routing. Public egress options do not isolate outbound traffic, and the managed VNet is for when you cannot manage IP space.',
    },
    {
      question: 'Which action BEST embodies shift-left security for a new customer-facing agent?',
      options: [
        'Enable Defender for Cloud alerts after the agent is in production.',
        'Run AI Red Teaming Agent scans with prohibited-actions and sensitive-data-leakage evaluators in the release pipeline and gate on Attack Success Rate.',
        'Ask the support team to report jailbreaks when customers complain.',
        'Increase the content filter blocking level to High in production.',
      ],
      correct: [1],
      explanation:
        'Shift-left means finding vulnerabilities before deployment with automated adversarial testing. Post-production alerts and complaint-driven discovery are reactive, and raising filter levels is a mitigation rather than a test.',
    },
  ],
  statements: [
    { text: 'In Foundry, a principal that can create and configure an agent is automatically allowed to call that agent at runtime.', isTrue: false, explanation: 'Permissions do not carry across the management and endpoint boundaries; runtime access needs the interact action (for example, Foundry Agent Consumer).' },
    { text: 'A Foundry agent identity blueprint uses a federated identity credential rather than a client secret or certificate.', isTrue: true, explanation: 'The credential trusts the Foundry resource provider acting in your tenant; code never holds a secret.' },
    { text: 'On-behalf-of token exchange changes the user represented by the token.', isTrue: false, explanation: 'OBO changes the audience, not the user identity.' },
    { text: 'Key-based authentication to a third-party MCP server should store the key in a project connection rather than in agent code.', isTrue: true, explanation: 'Connections centralise secrets and keep agent code secret-free; access to the project should be restricted.' },
    { text: 'The AI Red Teaming Agent measures Attack Success Rate using PyRIT attack strategies and Foundry risk and safety evaluators.', isTrue: true, explanation: 'Scanning, evaluating and reporting are its three functions.' },
    { text: 'Adding a private endpoint to a Foundry resource with public egress isolates the agents\' outbound traffic to data sources.', isTrue: false, explanation: 'A private endpoint secures only the inbound path; egress isolation requires a BYO or managed virtual network.' },
    { text: 'Passing x-ms-user-identity to Foundry requires a custom data action that no built-in role includes.', isTrue: true, explanation: 'An administrator must grant the UserIdentityImpersonation action to the calling workload identity.' },
  ],
  resources: [
    { label: 'Identity and access overview for Foundry Agent Service', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/identity-access-overview' },
    { label: 'Agent identity concepts in Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-identity' },
    { label: 'Forward application-acquired user tokens (on-behalf-of) to hosted-agent code', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/use-on-behalf-of-flow' },
    { label: 'AI Red Teaming Agent', url: 'https://learn.microsoft.com/en-us/azure/foundry/concepts/ai-red-teaming-agent' },
  ],
};

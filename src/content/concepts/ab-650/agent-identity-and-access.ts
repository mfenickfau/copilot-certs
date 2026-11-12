import type { Concept } from '../../types';

export const agentIdentityAndAccess: Concept = {
  id: 'agent-identity-and-access',
  title: 'Agent Identities: Entra Agent ID, Lifecycle, Access Packages and Conditional Access',
  summary:
    'How Microsoft Entra Agent ID gives AI agents first-class identities (blueprints, agent identities, agent user accounts), who is accountable for them (owners, sponsors, managers), how lifecycle workflows and inactivity policies retire them, and how access packages and Conditional Access for agents enforce least privilege.',
  certs: ['ab-650'],
  domains: ['ab-650-3'],
  outcomes: ['ab-650-3-2-1', 'ab-650-3-2-2', 'ab-650-3-2-3'],
  tags: ['entra-agent-id', 'agent-identity', 'agent-blueprint', 'sponsors', 'lifecycle-workflows', 'access-packages', 'conditional-access', 'agent-365'],
  difficulty: 'advanced',
  sections: [
    {
      heading: 'What Entra Agent ID adds to the directory',
      body: `**Microsoft Entra Agent ID** extends Entra ID to AI agents so they are neither over-privileged service principals nor fake human users. It introduces four object types:

- **Agent identity blueprint**: the parent definition (a template) created by a developer or platform, with an **agent identity blueprint principal** in each tenant where it is used, similar to a multitenant app and its service principal. Blueprints can define **inheritable permissions** so child identities receive a base set of delegated scopes without consent prompts (up to 10 resource apps, 40 scopes each; high-privilege scopes blocked).
- **Agent identity**: the individual agent's account, created from a blueprint, often dynamically and at scale (an agent may live minutes or be created thousands of times). It can hold Graph permissions, Azure RBAC roles, allowed Entra roles, app roles and group memberships.
- **Agent user account**: an optional Entra *user* paired one-to-one with an agent identity for scenarios that need a user-like presence (a mailbox, Teams membership, SharePoint access) while remaining distinguishable from humans.

Agents authenticate with standard protocols (OAuth 2.0, MCP, A2A) in three **access patterns**: **on-behalf-of (delegated)** for a signed-in user, **application-only (autonomous)** with the agent identity, and **agent-user** with the paired account. Microsoft Copilot Studio, Microsoft Foundry, Agent Builder and the Agents Toolkit create agent identities automatically; third-party agents (AWS Bedrock, n8n, custom code) integrate through the Entra Auth SDK sidecar or workload identity federation. Admins see everything in **Entra ID > Agents** (Agent identities, Agent blueprints), with sign-in and audit logs per agent, and in the Microsoft 365 admin center **agent registry**, which Agent 365 and Agent ID are converging. Roles: **Agent ID Administrator** or Cloud Application Administrator manage identities; **Agent ID Developer** creates blueprints; owners manage their own agents. Agent ID itself is available to all Entra customers; the security features (Conditional Access, ID Protection, governance for agents) require **Microsoft Agent 365** (included in Microsoft 365 E7, or an add-on paired with Entra P1 or Microsoft 365 E3).`,
    },
    {
      heading: 'Owners, sponsors and managers: accountability and lifecycle',
      body: `Agent ID separates technical control from business accountability:

| Relationship | Who | Can do | Notes |
|---|---|---|---|
| **Owner** | Users (including guests) or service principals; not groups | Edit configuration and credentials, add owners and sponsors, disable, delete, **re-enable, restore and hard-delete** | Optional; typically developers or IT |
| **Sponsor** | Human users accountable for the agent's purpose | Approve access, perform access reviews, decide retention, disable and delete | **At least one sponsor is required** per agent identity and blueprint; cannot re-enable or restore |
| **Manager** | The user the agent reports to in the org hierarchy | Request access packages for the agent | Mirrors the people-manager model |

Lifecycle controls keep agents from lingering:

- **Lifecycle Workflows** (Entra ID Governance) include mover and leaver tasks for agents: **Send email to manager about sponsorship changes**, **Send email to cosponsors about sponsor changes**, and **Transfer agent identity sponsorships to manager**, so an agent never loses its accountable human when the sponsor leaves. Configure under **ID Governance > Lifecycle workflows** as a Lifecycle Workflows Administrator.
- The **Agent ID default inactivity policy** (ID Governance > Lifecycle workflows > Lifecycle policies > Agent ID), free for every tenant, notifies sponsors and owners after **60 days** of inactivity, **disables at 90 days** and **deletes at 455 days**; scope is All Agent IDs or All except selected (for seasonal agents), with fallback notification recipients. Custom lifecycle policies with different rules require licensing, and custom policies take precedence over the default.
- **Access reviews** recertify agent memberships and assignments; **deletion** is soft (restorable by owners or admins) before hard delete.

In the Microsoft 365 admin center the equivalent people-centric actions are **Assign a new owner**, **Add owner**, **Remove owner** on registry entries, the **Agents without owners** tile, and the agent management rule that **reassigns ownerless Agent Builder agents to the previous owner's manager**. Exam language: "ensure every agent keeps an accountable person when staff leave" is a **sponsor lifecycle workflow**; "clean up abandoned agents" is the **inactivity policy** or the ownerless-agent rule.`,
    },
    {
      heading: 'Securing agent access with access packages',
      body: `Instead of granting Graph permissions ad hoc, use **Microsoft Entra entitlement management access packages** to make agent access **intentional, auditable and time-bound**, and to standardise a fleet of agents with the same needs (for example twenty customer-support agents).

Build it as an Identity Governance Administrator (Global Administrator when the package includes API permissions or directory roles, which also marks the catalog as **privileged**):

1. **Catalog** holding the resources.
2. **Access package** with **resource roles** limited to **security group memberships, Entra directory roles allowed for agents, and OAuth API permissions** (application or delegated). Application roles, SAP roles and SharePoint Online site roles are **not** supported for agent identities, so create a new package rather than reusing a human one.
3. **Policy**: *Who can get access* = **For users, service principals, and agent identities in your directory**, scope **All agents** (plus a separate policy for *All service principals* if some agents still use service principals); approval stages (1 to 3) with approvers such as the sponsor or manager; **expiration** and extension rules; optional access reviews.
4. Assign directly, or let sponsors and managers request on the agent's behalf.

Resource-ownership validation ensures only the owner of an API can add its permissions to a package. Access packages are one of the **custom policies** that Agent 365 **policy templates** can bundle, and the service description lists "access packages for agents to define scope of agent permissions" as an Agent 365 capability. Microsoft 365 admin center note: the **AI Administrator can create and apply access packages** in templates but cannot author Conditional Access or custom security attribute policies. Distractors: Privileged Identity Management governs *human* role activation; app registrations with broad application permissions are exactly the pattern access packages replace.`,
    },
    {
      heading: 'Conditional Access and ID Protection for agents',
      body: `**Conditional Access for agents** extends the policy engine to agent tokens. Each token has a **subject** (the user in delegated flows, the agent identity in app-only flows, the agent's user account in agent-user flows) and an **audience** (the resource: SharePoint, Graph, an MCP server, a custom API). Because policies target the subject, you create **separate policies for each access pattern** an agent uses:

- **On-behalf-of agents**: target **Users and groups** as usual; the user's policies (MFA, compliant device) apply when the user authorises the agent to act for them. You can also require **MFA before a user consents** to an agent reading their mail.
- **Autonomous agents**: target **Agents** in assignments (select agent identities or a blueprint; at least one agent identity is required to save, and a policy scoped to all agents is auto-selected in Microsoft 365 admin center templates). Controls: **block** high-risk agents, restrict to trusted **locations**, or block access to specific resources.
- **Agent user accounts**: target the agent's user account like a user, with network controls from Global Secure Access.

**Microsoft Entra ID Protection for agents** scores agent risk (unfamiliar resources, abnormal sign-in volume, anomalous behaviour) and surfaces **Risky agents**; a Conditional Access policy can **block high-risk agent identities**, and the **AI agents** template category provides three ready policies: block high-risk agent identities, configure autonomous agent access, configure on-behalf-of agent access. **Continuous Access Evaluation** applies where the resource supports it. Network-level controls via **Secure Web and AI Gateway** filter traffic from Copilot Studio agents and agents on user devices.

Licensing: Conditional Access for agents and ID Protection for agents require **Microsoft 365 E7** or **Agent 365 with Entra P1 / Microsoft 365 E3**. Microsoft's default Agent 365 policy template turns on **Identity Protection**, **network visibility** and **lifecycle management** for every activated agent. Exam framing: "an autonomous agent must only run from the corporate network" is a Conditional Access policy targeting the **agent identity** with a **named location** condition; "block an agent that ID Protection flags as high risk" is the risk-based agent policy; "require MFA when staff connect an agent to their mailbox" targets the **users**, not the agent.`,
    },
  ],
  examples: [
    {
      title: 'Agent keeps running after its sponsor leaves (a realistic mistake)',
      description:
        'A supply-chain forecasting agent was created with a single sponsor who later left Contoso. Months later it is still reading Dynamics data with nobody accountable, and an access review has no one to answer. The fix is twofold: assign a new sponsor (and a second one) in Entra ID > Agents, and add the "Transfer agent identity sponsorships to manager" task to the leaver lifecycle workflow so future departures move sponsorship automatically. The admin also enables the default inactivity policy so unused agents are disabled after 90 days.',
      takeaway: 'Sponsors are mandatory accountability; lifecycle workflows and the inactivity policy keep that accountability from lapsing.',
    },
    {
      title: 'Access package for a fleet of support agents',
      description:
        'Twelve customer-support agents built in Copilot Studio each need Sites.Read.All on a specific SharePoint knowledge base group and membership of the Support-Agents security group. Rather than granting permissions one by one, the Identity Governance Administrator creates a catalog, an access package with the group membership and the Graph delegated permission, and a policy for "users, service principals and agent identities" scoped to All agents with one-stage approval by the agents\' sponsor and a 180-day expiry. Each new agent is assigned the package and its access expires unless renewed.',
      takeaway: 'Access packages make agent permissions standardised, approved and time-bound; they support groups, roles and API permissions but not app or SharePoint roles.',
    },
    {
      title: 'Conditional Access for an autonomous agent',
      description:
        'A nightly reconciliation agent runs with its own agent identity and must only reach Microsoft Graph from the corporate egress IP range. The Conditional Access Administrator creates a policy from the "Configure policy for autonomous agent access" template, targets the agent identity under Agents, sets the target resource to Microsoft Graph, excludes the trusted named location and blocks access. A second policy from the AI agents template blocks any agent identity with high risk.',
      language: 'json',
      code: `{
  "displayName": "CA - Reconciliation agent - block outside corp network",
  "state": "enabledForReportingButNotEnforced",
  "conditions": {
    "agents": { "includeAgentIdentities": ["<reconciliation-agent-identity-id>"] },
    "applications": { "includeApplications": ["00000003-0000-0000-c000-000000000000"] },
    "locations": { "includeLocations": ["All"], "excludeLocations": ["<CorpNet-named-location-id>"] }
  },
  "grantControls": { "operator": "OR", "builtInControls": ["block"] }
}`,
      takeaway: 'Policies for autonomous agents target the agent identity as the token subject; start in report-only like any other Conditional Access policy.',
    },
    {
      title: 'Choosing the right token subject',
      description:
        'A manager asks why the new Conditional Access policy for the HR assistant agent did not require MFA when employees connected it to their mailboxes. The policy targeted the agent identity, but the mailbox connection is a delegated (on-behalf-of) flow whose token subject is the user. The admin adds a policy targeting the HR users with the "require MFA" grant for the user action, leaving the agent-identity policy to govern the agent\'s autonomous calls.',
      takeaway: 'A policy that targets an agent identity does not apply to delegated access, and vice versa; create one per access pattern.',
    },
  ],
  keyPoints: [
    'Entra Agent ID object types: agent identity blueprint (and principal), agent identity, and optional agent user account; access patterns are on-behalf-of, application-only and agent-user.',
    'Owners are technical administrators (users or service principals, not groups) who can re-enable and restore; at least one sponsor (a human accountable for purpose and lifecycle) is required; managers can request access packages for agents.',
    'Lifecycle Workflows add mover and leaver tasks that notify or transfer agent sponsorships; the free default inactivity policy notifies at 60 days, disables at 90 and deletes at 455 days of inactivity.',
    'Access packages for agents can include security group membership, allowed Entra roles and OAuth API permissions (not app, SAP or SharePoint roles), with a policy for users, service principals and agent identities scoped to All agents, approvals and expiry.',
    'Conditional Access for agents targets the token subject: users for delegated flows, agent identities or blueprints for autonomous flows, agent user accounts for agent-user flows; create separate policies per pattern.',
    'ID Protection for agents detects risky agents; the AI agents template category offers policies to block high-risk agents and configure autonomous and on-behalf-of access.',
    'Agent ID is available to all Entra tenants, but Conditional Access, ID Protection and governance for agents require Microsoft 365 E7 or Agent 365 with Entra P1 / Microsoft 365 E3.',
    'AI Administrator can apply access packages in templates but cannot create Conditional Access policies; Conditional Access Administrator and Identity Governance Administrator do that.',
  ],
  flashcards: [
    { front: 'What is an agent identity blueprint?', back: 'The parent template from which individual agent identities are created, with a blueprint principal per tenant and optional inheritable permissions.' },
    { front: 'What is an agent user account?', back: 'A special Entra user paired one-to-one with an agent identity so the agent can act like a user (mailbox, Teams) while staying distinguishable from humans.' },
    { front: 'Name the three agent access patterns and their Conditional Access targets.', back: 'On-behalf-of (target users and groups), application-only or autonomous (target agent identities or blueprints), agent-user (target the agent\'s user account).' },
    { front: 'Is a sponsor required for an agent identity?', back: 'Yes, at least one sponsor per agent identity and blueprint; owners are optional.' },
    { front: 'Which relationship can re-enable a disabled agent identity?', back: 'Owners (and administrators). Sponsors can disable and delete but not re-enable or restore.' },
    { front: 'Which lifecycle workflow task keeps agents accountable when a sponsor leaves?', back: 'Transfer agent identity sponsorships to manager (a mover/leaver task), plus the notification tasks to managers and cosponsors.' },
    { front: 'What are the stages of the Agent ID default inactivity policy?', back: 'Notify sponsors and owners at 60 days, disable at 90 days, delete at 455 days.' },
    { front: 'Which resource roles can an agent access package contain?', back: 'Security group memberships, Entra directory roles allowed for agents, and OAuth API permissions; not application, SAP or SharePoint site roles.' },
    { front: 'Which option in the access package policy includes agents?', back: '"For users, service principals, and agent identities in your directory" with the scope All agents.' },
    { front: 'Which Conditional Access template category covers agents?', back: 'AI agents: block high-risk agent identities, configure autonomous agent access, configure on-behalf-of agent access.' },
    { front: 'What licensing enables Conditional Access and ID Protection for agents?', back: 'Microsoft 365 E7, or Microsoft Agent 365 paired with Entra P1 or Microsoft 365 E3.' },
    { front: 'Which roles manage agent identities and create blueprints?', back: 'Agent ID Administrator (or Cloud Application Administrator) manages; Agent ID Developer creates blueprints.' },
  ],
  quiz: [
    {
      question:
        'Contoso must guarantee that every AI agent has an accountable business owner even after staff changes. Which TWO actions address this? (Select two)',
      options: [
        'Assign at least one sponsor to each agent identity.',
        'Add the "Transfer agent identity sponsorships to manager" task to the leaver lifecycle workflow.',
        'Grant each agent the Global Reader role.',
        'Create a Conditional Access policy that blocks agents without owners.',
      ],
      correct: [0, 1],
      explanation:
        'Sponsors provide accountability and the lifecycle workflow preserves it when sponsors leave. Roles do not create accountability, and Conditional Access cannot evaluate ownership.',
    },
    {
      question:
        'An autonomous agent with its own agent identity must be blocked from calling Microsoft Graph from outside the corporate network. Which Conditional Access assignment should the policy use?',
      options: [
        'Users and groups: All users',
        'Agents: the agent identity (or its blueprint)',
        'Users and groups: the agent\'s sponsor',
        'Directory roles: Agent ID Administrator',
      ],
      correct: [1],
      explanation:
        'In application-only flows the token subject is the agent identity, so the policy must target agents. Targeting users or roles would not apply to the agent\'s own token.',
    },
    {
      question:
        'Twenty support agents need the same Graph delegated permission and group membership, with sponsor approval and automatic expiry after six months. Which mechanism is MOST appropriate?',
      options: [
        'Grant the permissions directly on each agent identity.',
        'Create an access package for agent identities with the group and API permission, an approval policy and a 180-day expiry.',
        'Use Privileged Identity Management eligible assignments for each agent.',
        'Add the agents to a restricted management administrative unit.',
      ],
      correct: [1],
      explanation:
        'Access packages standardise, approve and time-bound agent access. Direct grants are not governed, PIM governs human role activation, and AUs scope admin roles rather than agent permissions.',
    },
    {
      question:
        'A forecasting agent has not run for four months and nobody responded to notifications. With the default inactivity policy enabled, what is its state?',
      options: ['Active', 'Disabled', 'Permanently deleted', 'Converted to a service principal'],
      correct: [1],
      explanation:
        'The default policy notifies at 60 days and disables at 90 days; deletion happens only at 455 days. There is no conversion to a service principal.',
    },
    {
      question:
        'Employees connect an HR assistant agent to their own mailboxes. Security wants MFA enforced at the moment of that connection. Which policy target is correct?',
      options: [
        'The agent identity, because the agent reads mail.',
        'The users (and groups) who authorise the agent, because the delegated token\'s subject is the user.',
        'The agent identity blueprint principal.',
        'The Exchange Online service principal.',
      ],
      correct: [1],
      explanation:
        'On-behalf-of access produces a user token, so user-targeted policies apply. Policies on agent identities or blueprints govern autonomous access, and service principals are not the subject here.',
    },
    {
      question:
        'An AI Administrator tries to add a Conditional Access policy to a custom Agent 365 policy template and finds no policies available. What is the cause?',
      options: [
        'Conditional Access policies must first be created in Entra by a Conditional Access Administrator and target at least one agent identity.',
        'Templates cannot contain Entra policies.',
        'The tenant lacks a SharePoint Advanced Management licence.',
        'The AI Administrator must enable web search first.',
      ],
      correct: [0],
      explanation:
        'Templates reference existing Entra policies; AI Administrator cannot author Conditional Access, and only policies scoped to at least one agent identity appear. SAM and web search are unrelated.',
    },
  ],
  statements: [
    { text: 'Groups can be assigned as owners of an agent identity.', isTrue: false, explanation: 'Owners must be users (including guests) or service principals.' },
    { text: 'Sponsors can restore a soft-deleted agent identity.', isTrue: false, explanation: 'Only owners or administrators can re-enable or restore.' },
    { text: 'The Agent ID default inactivity policy requires no additional licence.', isTrue: true, explanation: 'It is provided to all tenants; custom lifecycle policies need licensing.' },
    { text: 'An access package for agents can include SharePoint Online site roles.', isTrue: false, explanation: 'Supported resource roles are groups, allowed directory roles and API permissions.' },
    { text: 'A Conditional Access policy targeting an agent identity also applies to the agent\'s paired user account.', isTrue: false, explanation: 'Each token subject needs its own policy.' },
    { text: 'ID Protection for agents can feed a Conditional Access policy that blocks high-risk agent identities.', isTrue: true, explanation: 'This is one of the AI agents template policies.' },
    { text: 'Copilot Studio and Microsoft Foundry can create agent identities automatically.', isTrue: true, explanation: 'Foundry provisions blueprints and identities per project and published agent; Copilot Studio can auto-assign agent identities.' },
    { text: 'Extending Conditional Access to agents requires Microsoft Agent 365 or Microsoft 365 E7.', isTrue: true, explanation: 'Agent 365 pairs with Entra P1 or Microsoft 365 E3; E7 includes it.' },
  ],
  resources: [
    { label: 'What is Microsoft Entra Agent ID?', url: 'https://learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id' },
    { label: 'Owners, sponsors, and managers for agent identities', url: 'https://learn.microsoft.com/en-us/entra/agent-id/agent-owners-sponsors-managers' },
    { label: 'Access packages for agent identities', url: 'https://learn.microsoft.com/en-us/entra/agent-id/agent-access-packages' },
    { label: 'Conditional Access for agents', url: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/agent-id' },
  ],
};

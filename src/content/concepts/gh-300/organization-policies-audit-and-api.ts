import type { Concept } from '../../types';

export const organizationPoliciesAuditAndApi: Concept = {
  id: 'organization-policies-audit-and-api',
  title: 'Organization Policies, Audit Logs and the Copilot REST API',
  summary:
    'How organisation and enterprise owners decide which Copilot features, agents and models their developers get, how policies combine, which audit-log events to search for, and how to manage seats and read usage with the REST API.',
  certs: ['gh-300'],
  domains: ['gh-300-2'],
  outcomes: ['gh-300-2-4-1', 'gh-300-2-4-2', 'gh-300-2-4-3'],
  tags: ['policies', 'organization', 'enterprise', 'audit-log', 'rest-api', 'seats', 'copilot-business', 'governance'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Where policies live and how they combine',
      body: `Copilot Business and Enterprise exist so that an organisation, not each developer, decides how Copilot behaves. Policies are set at **Settings > Copilot > Policies** (and **Models**) for an organisation, or under the **AI controls** tab for an enterprise. A policy controls whether a feature, agent or model is available to users who receive their seat from that organisation or enterprise, and sometimes how it behaves.

Policies you should recognise include: Copilot in the IDE and its chat; **Copilot in the cloud** (chat and agent sessions on GitHub.com, Mobile and sandboxes); **Copilot CLI**; **Copilot code review**; **MCP servers in Copilot** (disabled by default) and *restrict MCP access to registry servers*; **suggestions matching public code** (Allowed or Blocked); **Copilot can search the web** (Bing); **editor preview features**; **Copilot usage metrics**; **Copilot Memory**; **store local sessions in the cloud**; third-party coding agents; and model enablement. Not every policy applies to every surface; the *Supported surfaces for policies* reference lists which.

Combination rules the exam loves:

- In an enterprise, policies are set at the enterprise level first: **enabled everywhere**, **disabled everywhere**, or **let organisations decide**. An organisation cannot override an explicit enterprise choice.
- A user with seats from several organisations in the same enterprise usually gets the **least restrictive** setting; a user with licences from different enterprises usually gets the **most restrictive**.
- Joining a Business or Enterprise plan cancels a personal plan, so personal settings never conflict with organisation policy. Individuals on Business or Enterprise cannot set their own public-code preference; it is inherited.
- A few policies are **repository-scoped and apply to everyone**, even people with personal licences: for example *Block Copilot cloud agent in all repositories* and *Block Copilot code review in all enterprise repositories* at enterprise level, or the organisation's cloud-agent *Repository access* control (all, none or selected repositories).
- Two "default availability" policies decide whether unconfigured GA features and models default to enabled or disabled.

Governance advice from GitHub: limit who can change policies (organisation owners; enterprise owners or the *Manage enterprise AI controls* role), and watch the audit log for policy drift.`,
    },
    {
      heading: 'Enabling features across IDEs and GitHub.com',
      body: `A typical rollout decision is "enable X for developers, but keep Y off until legal signs off". Mapping features to the setting that controls them:

| Goal | Where |
|---|---|
| Let members chat and delegate work on GitHub.com and Mobile, and start cloud sandboxes from local clients | Organisation policy **Copilot in the cloud** (enabled by default once the plan is active) |
| Decide which repositories the cloud agent may work in | Settings > Copilot > **Cloud** > Repository access; also *Allow automations* and the agent **firewall** |
| Let members request Copilot code review and generate PR summaries | Policy **Copilot code review**; for automatic reviews add a branch **ruleset**; to let members *without* a licence use review, enable *AI credits paid usage* and the sub-policy for unlicensed members |
| Allow MCP in IDEs, CLI and the cloud agent | Policy **MCP servers in Copilot** (and optionally restrict to a registry) |
| Give developers next edit suggestions and other previews | Policy **Editor preview features** |
| Allow or block code that matches public code | Policy **Suggestions matching public code** |
| Choose which models beyond the default are available | **Models** page (code review ignores this page and uses its own model mix) |
| Enable adoption dashboards | Policy **Copilot usage metrics** |
| Collect in-product feedback and opt in to previews | Options shown when *Copilot in GitHub.com* is enabled |

Enterprises can also push **enterprise-managed settings** to IDEs (plugin marketplaces, MCP servers, telemetry, whether users may bypass permission checks) and set an MCP allow-list or private registry. Where developers can choose an environment, cloud sandboxes are the default; assigning an issue to Copilot still runs on GitHub Actions.`,
    },
    {
      heading: 'Audit log events',
      body: `The organisation and enterprise **audit logs** record who changed what. For Copilot they capture **plan and policy changes** and **licence events**, plus **agent activity** on the GitHub website. They do **not** capture client session data such as the prompts a developer types in the IDE or CLI; organisations that need that build their own telemetry, for example with Copilot CLI hooks or OpenTelemetry in supported IDEs.

Search patterns to remember:

- \`action:copilot\` lists every Copilot-related event.
- Specific events follow the \`copilot.*\` prefix, for example \`copilot.cfb_seat_assignment_created\` (a seat assigned to a user), \`copilot.cfb_seat_added\`, seat cancellations and reactivations, and \`copilot.content_exclusion_changed\` (content exclusion rules edited; the event shows the resulting \`excluded_paths\`).
- \`actor:Copilot\` returns **agentic events**: actions performed by Copilot as an actor (such as \`pull_request.create\`), with fields \`actor_is_agent: true\`, the \`agent_session_id\` that links back to the session log, and \`user\`, the person who initiated the agent.
- Content-exclusion pages link straight to the relevant audit entries ("last changed by ... at ...").

Retention is **180 days**; stream the audit log to a SIEM for longer history and alerting. Enterprise owners and users with the *Read enterprise audit logs* role can view it; the enterprise log is under *Settings > Audit log*.`,
    },
    {
      heading: 'Managing subscriptions with the REST API',
      body: `Organisation owners can script seat management with the **Copilot user management** REST API (public preview). Tokens need \`manage_billing:copilot\` or \`read:org\` for reads and \`manage_billing:copilot\` or \`admin:org\` for writes; fine-grained tokens need the "GitHub Copilot Business" or "Administration" organisation permission. Key endpoints:

\`\`\`bash
# Plan details and seat breakdown (total, added, pending cancellation, active/inactive this cycle)
GET /orgs/{org}/copilot/billing

# Every assigned seat, with last_activity_at and last_activity_editor
GET /orgs/{org}/copilot/billing/seats

# A specific member's seat
GET /orgs/{org}/members/{username}/copilot

# Assign seats to teams or users (the org must have a public-code policy configured)
POST /orgs/{org}/copilot/billing/selected_teams   { "selected_teams": ["platform"] }
POST /orgs/{org}/copilot/billing/selected_users   { "selected_usernames": ["octocat"] }

# Remove seats (effective at the end of the billing cycle)
DELETE /orgs/{org}/copilot/billing/selected_teams
DELETE /orgs/{org}/copilot/billing/selected_users
\`\`\`

The billing response also echoes policy state (\`seat_management_setting\`, \`ide_chat\`, \`platform_chat\`, \`cli\`, \`public_code_suggestions\`, \`plan_type\`). \`last_activity_at\` is retained for 90 days, updates within about 24 hours, and requires IDE telemetry to be enabled, which is why it drives "revoke seats inactive for 90 days" automations and why a user who insists they are active may need to check their telemetry setting.

Two related APIs are **not** seat management but often appear as distractors: the **Copilot usage metrics** endpoints and NDJSON exports (adoption, acceptance, lines of code, pull request lifecycle) and the **content exclusion** endpoints. Seat counts come from the user management API; activity measures come from metrics.`,
    },
  ],
  examples: [
    {
      title: 'A phased enterprise rollout',
      description:
        'An enterprise enables Copilot in the IDE everywhere, sets "Copilot in the cloud" and "MCP servers in Copilot" to "Let organisations decide", blocks suggestions matching public code, and leaves "Editor preview features" disabled. The platform organisation enables the cloud agent for selected repositories only and adds an organisation ruleset that automatically requests Copilot code review. A finance organisation keeps the cloud agent off. Because the enterprise chose "Let organisations decide", both choices are valid; had the enterprise chosen "Disabled everywhere", the platform organisation could not have enabled it.',
      takeaway: 'Enterprise choices bound organisation choices; "Let organisations decide" is what gives organisations room to differ.',
    },
    {
      title: 'Reclaiming inactive seats with the API',
      description:
        'A licensing administrator lists seats and removes anyone whose last_activity_at is older than 90 days or null, then confirms the change in the audit log. Seats are removed at the end of the billing cycle, so the script also records pending_cancellation_date.',
      language: 'bash',
      code: `curl -L -H "Accept: application/vnd.github+json" \\
  -H "Authorization: Bearer $TOKEN" \\
  https://api.github.com/orgs/contoso/copilot/billing/seats?per_page=100 \\
  | jq -r '.seats[] | select(.last_activity_at == null) | .assignee.login' \\
  | jq -R -s -c 'split("\\n") | map(select(length>0)) | {selected_usernames: .}' \\
  | curl -L -X DELETE -H "Authorization: Bearer $TOKEN" \\
      -H "Accept: application/vnd.github+json" \\
      https://api.github.com/orgs/contoso/copilot/billing/selected_users -d @-`,
      takeaway: 'The user management API exposes last_activity_at per seat and bulk add or remove endpoints; removals take effect at the end of the billing cycle.',
    },
    {
      title: 'Searching the audit log after a surprise policy change',
      description:
        'Developers suddenly see code references appearing in VS Code. The security lead searches the organisation audit log with action:copilot and finds the suggestions-matching-public-code policy was switched from Blocked to Allowed the previous evening, with the actor and timestamp. A separate search for actor:Copilot shows the cloud agent\'s pull requests created that week, each with an agent_session_id to trace.',
      takeaway: 'action:copilot finds policy and licence changes; actor:Copilot finds what agents did; neither contains IDE prompts.',
    },
    {
      title: 'Blaming the extension for a policy (a realistic mistake)',
      description:
        'A developer on a Business seat files a bug because MCP servers configured in VS Code never appear. Support finds the organisation never enabled the "MCP servers in Copilot" policy, which is disabled by default. Nothing in the IDE could have fixed it. The organisation owner enables the policy; the developer\'s configuration starts working within minutes.',
      takeaway: 'When an organisation-licensed developer is missing a feature, check policies before troubleshooting the client.',
    },
  ],
  keyPoints: [
    'Organisation policies live under Settings > Copilot > Policies (and Models); enterprise policies live under the AI controls tab and can be enabled everywhere, disabled everywhere, or left to organisations.',
    'Organisations cannot override an explicit enterprise policy; a user with multiple seats in one enterprise usually gets the least restrictive setting, across enterprises the most restrictive.',
    'Key policies: Copilot in the cloud, Copilot CLI, Copilot code review, MCP servers in Copilot (off by default), suggestions matching public code, web search, editor preview features, usage metrics, model enablement.',
    'Some controls are repository-scoped and apply to everyone: cloud-agent repository access, blocking the cloud agent or code review across the enterprise, the agent firewall.',
    'Audit logs record plan, policy and licence changes and agent activity (actor:Copilot, agent_session_id); they do not contain IDE or CLI prompts; retention is 180 days, so stream to a SIEM.',
    'Search with action:copilot; notable events include copilot.cfb_seat_assignment_created and copilot.content_exclusion_changed.',
    'The Copilot user management REST API (GET /orgs/{org}/copilot/billing, /billing/seats, POST and DELETE /billing/selected_users or selected_teams) manages seats; last_activity_at needs IDE telemetry and is kept for 90 days.',
    'Usage metrics APIs and dashboards measure adoption; they are separate from seat management.',
  ],
  flashcards: [
    { front: 'Where does an organisation owner configure Copilot policies?', back: 'Organisation Settings > Copilot > Policies (feature policies) and Models (model availability).' },
    { front: 'What are the three enterprise-level policy options?', back: 'Enabled everywhere, disabled everywhere, or let organisations decide.' },
    { front: 'A user receives Copilot seats from two organisations in the same enterprise with different settings for a policy. Which usually applies?', back: 'The least restrictive setting (with some exceptions); across different enterprises the most restrictive usually applies.' },
    { front: 'Is the "MCP servers in Copilot" policy enabled by default?', back: 'No, it is disabled by default for Business and Enterprise seats.' },
    { front: 'Which audit-log search shows all Copilot-related events?', back: 'action:copilot' },
    { front: 'Which audit-log search shows actions performed by Copilot agents?', back: 'actor:Copilot (events carry actor_is_agent: true and an agent_session_id).' },
    { front: 'Which audit-log event records a change to content exclusions?', back: 'copilot.content_exclusion_changed' },
    { front: 'Does the audit log include the prompts developers type in the IDE?', back: 'No. It records settings, licence and agent events; client session data requires a custom solution such as CLI hooks.' },
    { front: 'How long does the audit log retain events?', back: '180 days; stream to a SIEM for longer retention.' },
    { front: 'Which REST endpoint lists all Copilot seat assignments for an organisation?', back: 'GET /orgs/{org}/copilot/billing/seats' },
    { front: 'Which endpoints assign Copilot seats to users or teams?', back: 'POST /orgs/{org}/copilot/billing/selected_users and POST /orgs/{org}/copilot/billing/selected_teams.' },
    { front: 'Why might last_activity_at be stale for an active user?', back: 'Updates can take 24 hours and require IDE telemetry to be enabled; the value is retained for 90 days.' },
  ],
  quiz: [
    {
      question:
        'An enterprise owner sets the Copilot code review policy to "Disabled everywhere". An organisation owner within the enterprise wants to enable it for one team. What is the result?',
      options: [
        'The organisation owner can enable it because organisation settings take precedence',
        'The organisation owner cannot override the enterprise setting; the enterprise must choose "Let organisations decide" or "Enabled everywhere"',
        'Developers can enable it individually in their personal settings',
        'Code review becomes available only through the REST API',
      ],
      correct: [1],
      explanation:
        'Explicit enterprise choices cannot be overridden at organisation level. Personal settings are irrelevant for organisation-licensed users, and the API does not bypass policy.',
    },
    {
      question:
        'A security team needs a record of which user changed the content exclusion rules last week. Where should they look?',
      options: [
        'The Copilot usage metrics dashboard',
        'The organisation audit log, filtering for copilot.content_exclusion_changed',
        'The developer\'s VS Code output logs',
        'The REST endpoint GET /orgs/{org}/copilot/billing',
      ],
      correct: [1],
      explanation:
        'Content exclusion changes are audit-log events; the exclusion settings page even links to them. Metrics show adoption, client logs are local, and the billing endpoint returns seat and policy state, not history.',
    },
    {
      question:
        'A licensing administrator wants to automatically remove Copilot seats from members who have not used Copilot for 90 days. Which TWO facts are relevant? (Select two)',
      options: [
        'GET /orgs/{org}/copilot/billing/seats returns last_activity_at for each assignee',
        'last_activity_at depends on IDE telemetry being enabled and can lag by up to 24 hours',
        'Seats can only be removed from the organisation settings page, not via the API',
        'The usage metrics API is the only source of per-seat activity',
      ],
      correct: [0, 1],
      explanation:
        'The seats endpoint exposes per-user activity timestamps, and their caveats matter for fairness. DELETE endpoints exist for selected_users and selected_teams, and seat activity comes from the user management API rather than usage metrics.',
    },
    {
      question: 'Which statement about Copilot audit logs is correct?',
      options: [
        'They include every prompt a developer sends from the IDE',
        'They record plan, policy and licence changes and agent activity on GitHub.com, retained for 180 days',
        'They are only available on Copilot Pro+',
        'They can only be viewed through the REST API',
      ],
      correct: [1],
      explanation:
        'Audit logs cover settings, licences and agent events, not client prompts, and are a Business and Enterprise feature viewable in the UI, via API or streamed to a SIEM.',
    },
    {
      question:
        'Developers on a Copilot Business seat report that agent mode works in VS Code but they cannot start agent sessions on GitHub.com. Which setting should the organisation owner check FIRST?',
      options: [
        'The "Copilot in the cloud" policy and the cloud agent repository access control',
        'The "Editor preview features" policy',
        'The suggestions-matching-public-code policy',
        'The developers\' personal Copilot Free settings',
      ],
      correct: [0],
      explanation:
        'Copilot in the cloud governs chat and agent sessions on GitHub.com, and repository access can block the agent per repository. Preview features and the public-code policy do not control the cloud agent, and Business members do not have personal Free settings.',
    },
    {
      question:
        'Which token scope allows an OAuth app to assign Copilot Business seats through the REST API?',
      options: ['read:org only', 'manage_billing:copilot or admin:org', 'repo', 'workflow'],
      correct: [1],
      explanation:
        'Write operations on seats need manage_billing:copilot or admin:org (reads accept read:org). The repo and workflow scopes concern repositories and Actions.',
    },
  ],
  statements: [
    { text: 'An organisation can enable a Copilot feature that the enterprise has explicitly disabled everywhere.', isTrue: false, explanation: 'Organisations cannot override explicit enterprise policy choices.' },
    { text: 'The audit log retains Copilot events for 180 days.', isTrue: true, explanation: 'GitHub recommends streaming to a SIEM for longer history.' },
    { text: 'The actor:Copilot filter returns events generated by Copilot agents, including an agent_session_id.', isTrue: true, explanation: 'Agentic audit events include actor_is_agent, agent_session_id and the initiating user.' },
    { text: 'Individual members of a Copilot Business organisation can choose their own public-code matching preference.', isTrue: false, explanation: 'The setting is inherited from the organisation or enterprise for organisation-licensed users.' },
    { text: 'Removing a seat through the REST API takes effect at the end of the current billing cycle.', isTrue: true, explanation: 'Seat removals are pending until the cycle ends, which the API reports as pending_cancellation_date.' },
    { text: 'The "Models" policy page also controls which models Copilot code review uses.', isTrue: false, explanation: 'The Models page controls Copilot Chat; code review uses its own tuned model mix and may use models not enabled there.' },
    { text: 'Blocking the Copilot cloud agent across all enterprise repositories also affects users with personal Copilot licences.', isTrue: true, explanation: 'A few repository-scoped policies apply to everyone working in those repositories, regardless of where their licence comes from.' },
  ],
  resources: [
    { label: 'GitHub Copilot policies for enterprises and organizations', url: 'https://docs.github.com/en/copilot/concepts/enterprise/policies' },
    { label: 'Managing policies and features for GitHub Copilot in your organization', url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies' },
    { label: 'Reviewing audit logs for GitHub Copilot', url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/review-audit-logs' },
    { label: 'REST API endpoints for Copilot user management', url: 'https://docs.github.com/en/rest/copilot/copilot-user-management' },
  ],
};

import type { Concept } from '../../types';

export const licensingAndAiCostMonitoring: Concept = {
  id: 'licensing-and-ai-cost-monitoring',
  title: 'Licensing, Copilot Credits and Monitoring AI Usage and Costs',
  summary:
    'How Microsoft 365, Copilot, Agent 365 and Copilot Studio licences are assigned and tracked (direct, group-based, pay-as-you-go, Copilot Credits and spending policies), and how to read the Copilot readiness and usage reports, Copilot Analytics, Cost management and Service health through the Copilot Control System.',
  certs: ['ab-650', 'ab-900'],
  domains: ['ab-650-1', 'ab-650-3', 'ab-900-3'],
  outcomes: [
    'ab-650-1-1-4',
    'ab-650-1-1-5',
    'ab-650-3-4-1',
    'ab-650-3-4-2',
    'ab-650-3-4-3',
    'ab-650-3-4-4',
    'ab-900-3-1-2',
    'ab-900-3-2-1',
  ],
  tags: ['licensing', 'group-based-licensing', 'pay-as-you-go', 'copilot-credits', 'cost-management', 'usage-reports', 'copilot-control-system', 'copilot-analytics'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Assigning and monitoring Microsoft 365 licences',
      body: `Licences are assigned in the Microsoft 365 admin center under **Billing > Licenses** (per product) or on a user's **Licenses and apps** tab. A user needs a **usage location** before a licence can be assigned. The roles that can assign licences are **License Administrator**, **User Administrator** and **Groups Administrator** (for group-based licensing).

**Group-based licensing** assigns a product to a security, mail-enabled security or Microsoft 365 group; members inherit it and lose it when they leave. Rules to remember:

- Nested groups are **not** supported; only first-level members are licensed.
- Users without a usage location inherit the tenant location.
- Errors (for example, not enough licences or conflicting service plans) are recorded on the user and shown under **Billing > Licenses > product > Errors & issues**; fix the cause and select **Reprocess**.
- To move a user between licensed groups without losing access, **add to the new group first**, confirm the licence, then remove from the old group.
- PowerShell: *Set-MgGroupLicense* and *Set-MgUserLicense* in Microsoft Graph PowerShell (the old MSOnline cmdlets are retired).

**Pay-as-you-go** is consumption billing against an Azure subscription for services such as Microsoft 365 Backup, extra SharePoint and OneDrive storage and High Volume Email. You create a **billing policy** (subscription, resource group, region, optional **budget** with alert percentages and recipients) under **Billing > Pay-as-you-go**, then connect it to a service. Budget alerts can take up to 24 hours. The Copilot equivalents are described below.`,
    },
    {
      heading: 'Licences for Copilot, Agent 365 and Copilot Studio',
      body: `**Microsoft 365 Copilot** is a per-user add-on that requires an eligible prerequisite licence (Microsoft 365 E3/E5/F1/F3, Business Basic/Standard/Premium, Office 365 E1/E3/E5, Exchange, SharePoint, Teams and others). **Microsoft 365 E7** includes E5, Microsoft 365 Copilot, Microsoft Agent 365 and the Microsoft Entra Suite in one licence. **Copilot Business** is the SMB add-on for up to 300 users. Everyone with an eligible Microsoft 365 subscription gets **Microsoft 365 Copilot Chat** (web-grounded) at no extra cost; work-grounded Copilot and agents need the licence. Microsoft is renaming Microsoft 365 Copilot to **Microsoft Copilot** (the app now lives at copilot.cloud.microsoft), so expect either name.

Copilot Chat agents, SharePoint agents and the Copilot Retrieval API can also run on **Copilot pay-as-you-go**: a billing policy connected to the Copilot service under **Copilot > Billing & usage**, letting unlicensed users consume metered agents.

**Microsoft Agent 365** is licensed per user, as a stand-alone add-on to E5, A5 or Business Premium or included in E7; at least one Agent 365 licence enables the Agent 365 features in the tenant, and E5 is the recommended base. **Copilot Studio** is licensed with per-tenant message capacity packs or pay-as-you-go messages; capacity is managed in the Power Platform admin center, and Copilot Studio costs can optionally be surfaced in the Microsoft 365 admin center cost dashboard.

The **Microsoft 365 Copilot readiness report** (Reports > Usage > Microsoft 365 Copilot > Readiness) shows prerequisite licences, users on an eligible update channel (Current or Monthly Enterprise), assigned and available licences, and flags the top 25% of unlicensed users as **Suggested candidates**. You can assign licences directly from the report. The **Copilot service plan diagnostic tool** checks a single user's eligibility.`,
    },
    {
      heading: 'Copilot Credits, spending policies and cost management',
      body: `Newer experiences such as **Copilot Cowork**, advanced work in SharePoint and OneDrive, the Work IQ API, Copilot Managed Runtime and Teams Phone Agent are **usage-based**, metered in **Copilot Credits**. Credits can come from pay-as-you-go, the **Copilot Credit Pre-purchase Plan (P3)** or **prepaid capacity packs**. Everything is governed in **Copilot > Cost management** in the Microsoft 365 admin center:

- **Get started** activates the **default spending policy** (billing method, optional monthly policy limit, optional per-user limit, alert recipients). Global Administrator or Billing Administrator can do this.
- **Identity-based spending policies** scope users or security groups to selected services with monthly limits and alerts. **Auto-apply new services** is on by default; turn it off if new services must be reviewed first. Microsoft recommends at least 2,000 credits per user per month.
- **Resource-based policies** govern Copilot Studio environments and agents.
- A spending policy is an **access control**, not just a budget: a user in any policy that selects Cowork can use Cowork, even with a 1-credit limit. To remove access, remove the user from every policy that includes the service.
- The **discovery setting** controls whether unlicensed or uncovered users can *see* and request the experience.
- **Credit requests** from users land under View requests; **request policies** can redirect them to an internal portal such as ServiceNow.

The **Overview** tab (refreshed every four hours) shows total credits used, pay-as-you-go versus prepaid, active users, and policies or users near their limits; the **Consumption** tab breaks usage down by group, user, agent and service. Users can type **/cost** in Cowork to see their own consumption. Pay-as-you-go Copilot Chat costs appear under **Billing > Cost management** and in Azure Cost Management with the *m365copilotchat* tag. AI Administrator and License Administrator can edit policy limits but not create policies; reader roles can view dashboards only.`,
    },
    {
      heading: 'Copilot Control System: usage, adoption and health reporting',
      body: `Microsoft describes its governance framework for Copilot and agents as the **Copilot Control System** (documented as *Copilot controls*), with three pillars: **security and governance** (Purview, SharePoint Advanced Management, Defender), **management controls** (licensing and metering, agent lifecycle, customization in the admin centers) and **measurement and reporting** (Copilot Analytics). The exam's monitoring outcomes map to the third pillar plus Service health.

**Operational reports** in the Microsoft 365 admin center (Reports > Usage > Microsoft 365 Copilot > **Usage** tab) show enabled users, active users, active-user rate, prompts submitted to Copilot Chat, **adoption by app** (Teams, Outlook, Word, Excel, PowerPoint, Loop, OneNote, Copilot Chat work versus web) in summary or trend views over 7, 28, 90 or 180 days, plus top agents. Data arrives within about 48 hours. User names are hidden by default and can be shown through the reports privacy setting. Related reports cover **Copilot Chat usage**, **Cowork usage** and the **Agent overview** (Agents > Overview: active users, sessions, assisted hours, ownerless agents). **AI Administrator** can read these reports; **Reports Reader** reads usage reports generally.

**Strategic reports** come from the **Copilot Dashboard** in Viva Insights (Readiness, Adoption, Impact and Learning tabs, sentiment from Pulse and Glint surveys, industry benchmarks) and customizable Power BI templates in the **Advanced Insights analyst workbench**; the AI Administrator enables the dashboard and delegates access. **Copilot Studio Analytics** covers individual agents, and **Purview audit** covers every interaction.

For **service health**, Microsoft 365 Copilot and agent services appear in **Health > Service health** alongside Exchange and Teams, with the same incident and advisory model and email notifications; the Copilot node in the admin center links to the relevant settings and reports. Message center announces Copilot feature changes and model updates that need admin action.`,
    },
  ],
  examples: [
    {
      title: 'Group-based licensing with Microsoft Graph PowerShell',
      description:
        'Contoso wants every member of the "Sales-Copilot" security group to receive Microsoft 365 Copilot automatically. The admin finds the SKU and assigns it to the group with Set-MgGroupLicense, then checks for assignment errors. New hires added to the group inherit the licence without a ticket.',
      language: 'powershell',
      code: `Connect-MgGraph -Scopes "Group.ReadWrite.All","Organization.Read.All"
$sku   = Get-MgSubscribedSku | Where-Object SkuPartNumber -eq "Microsoft_365_Copilot"
$group = Get-MgGroup -Filter "displayName eq 'Sales-Copilot'"

Set-MgGroupLicense -GroupId $group.Id \`
  -AddLicenses @(@{ SkuId = $sku.SkuId }) -RemoveLicenses @()

# Users that failed to receive the licence (e.g. no usage location, no seats)
Get-MgGroupMemberWithLicenseError -GroupId $group.Id | Select-Object Id, DisplayName`,
      takeaway: 'Group-based licensing scales assignment; monitor Errors & issues (or the license-error members) and reprocess after fixing the cause.',
    },
    {
      title: 'The 1-credit "restriction" that granted everyone Cowork (a realistic mistake)',
      description:
        'An admin creates a pilot spending policy for a 50-person security group with 5,000 credits per user, then adds an "All users" policy with a 1-credit limit "so nobody else can really use Cowork". Within a day, hundreds of employees are using Cowork. Because any policy that selects Cowork grants access regardless of the limit, the tenant-wide policy opened Cowork to everyone. The fix is to remove Cowork from the All-users policy (or delete it) so only the pilot group is in scope.',
      takeaway: 'Spending policies are access grants; control who can use a usage-based experience with policy scope, never with a tiny credit limit.',
    },
    {
      title: 'Prioritising Copilot licences with the readiness report',
      description:
        'Fabrikam bought 300 Copilot licences for 2,000 staff. The admin opens Reports > Usage > Microsoft 365 Copilot > Readiness, exports the user table, filters to "Suggested candidate for Copilot = Yes" and "Uses eligible update channel = Yes", and assigns licences to that list first. Users still on Semi-Annual Enterprise Channel are moved to Monthly Enterprise Channel before assignment so in-app Copilot appears.',
      takeaway: 'The readiness report combines licence eligibility, update-channel readiness and app usage to drive a data-driven rollout.',
    },
    {
      title: 'Explaining a flat adoption curve',
      description:
        'Six weeks after rollout the Copilot usage report shows 900 enabled users but only a 35% active-user rate, with Teams adoption high and Excel near zero. The admin shares the Copilot Dashboard Adoption tab with department leads, launches targeted Excel training, and watches the trend view over the next 28 days. Audit and Purview were not needed; this is a measurement question, not a security one.',
      takeaway: 'Use the admin center usage report for operational numbers and the Copilot Dashboard for adoption and impact insights by app and group.',
    },
  ],
  keyPoints: [
    'Group-based licensing: no nested groups, set usage location, add to the destination group before removing from the source, and reprocess after fixing errors.',
    'Microsoft 365 Copilot is a per-user add-on on top of an eligible base licence; Microsoft 365 E7 bundles E5, Copilot, Agent 365 and the Entra Suite; Copilot Chat is included for eligible Microsoft 365 users.',
    'Agent 365 is licensed per user (add-on or in E7) and needs at least one licence to enable its features; Copilot Studio uses message capacity managed in the Power Platform admin center.',
    'Pay-as-you-go uses billing policies tied to an Azure subscription with budgets and alerts; Copilot Credits are governed by spending policies under Copilot > Cost management.',
    'A spending policy that selects a service grants access to every user in its scope regardless of the limit; discovery settings only control visibility and requests.',
    'The readiness report flags suggested candidates and update-channel readiness; the usage report shows enabled versus active users and adoption by app over 7 to 180 days.',
    'The Copilot Control System pillars are security and governance, management controls, and measurement and reporting (Copilot Analytics: admin center reports, Copilot Dashboard, Copilot Studio analytics, Purview audit).',
    'Copilot and agent services appear in Health > Service health with the standard incident, advisory and email-notification model.',
  ],
  flashcards: [
    { front: 'Which roles can assign licences in the Microsoft 365 admin center?', back: 'License Administrator, User Administrator and Groups Administrator (for group-based licensing).' },
    { front: 'Does group-based licensing support nested groups?', back: 'No. Only users who are direct members of the licensed group receive the licence.' },
    { front: 'What is the safe order when moving a user between two licensed groups?', back: 'Add the user to the destination group, confirm the licence applied, then remove them from the source group.' },
    { front: 'What does Microsoft 365 E7 include?', back: 'Microsoft 365 E5 plus Microsoft 365 Copilot, Microsoft Agent 365 and the Microsoft Entra Suite.' },
    { front: 'What are Copilot Credits?', back: 'The common billing unit for usage-based Copilot experiences such as Cowork, Work IQ API and Copilot Managed Runtime, funded by pay-as-you-go, the P3 pre-purchase plan or prepaid capacity packs.' },
    { front: 'Where are spending policies configured?', back: 'Microsoft 365 admin center > Copilot > Cost management > Configuration.' },
    { front: 'A user is in a Cowork spending policy with a 1-credit limit. Can they use Cowork?', back: 'Yes. Any policy that selects Cowork grants access; the limit only caps spending and is enforced asynchronously.' },
    { front: 'Which roles can create spending policies?', back: 'Global Administrator and Billing Administrator. AI Administrator and License Administrator can edit limits and alerts but not create policies.' },
    { front: 'What does "Suggested candidate for Copilot" mean in the readiness report?', back: 'The top 25% of unlicensed users by usage of Microsoft 365 apps where Copilot adds value, refreshed weekly.' },
    { front: 'Which timeframes does the Copilot usage report support?', back: 'Last 7, 28, 90 or 180 days.' },
    { front: 'Name the three pillars of the Copilot Control System (Copilot controls).', back: 'Security and governance; management controls; measurement and reporting.' },
    { front: 'Where do you get strategic adoption and impact insights for Copilot?', back: 'The Copilot Dashboard in Viva Insights (Copilot Analytics), enabled by the AI Administrator.' },
    { front: 'Which Microsoft 365 services are eligible for pay-as-you-go billing in the Billing node?', back: 'Microsoft 365 Backup, SharePoint and OneDrive storage, and High Volume Email (Copilot services are managed under the Copilot node).' },
  ],
  quiz: [
    {
      question:
        'Contoso assigns Microsoft 365 E5 through a security group named E5-Users. A new regional group named EMEA-Staff is nested inside E5-Users. Users in EMEA-Staff report they have no licence. What is the cause?',
      options: [
        'Group-based licensing requires a Microsoft 365 group rather than a security group.',
        'Group-based licensing does not support nested groups; only direct members are licensed.',
        'The EMEA users lack the Reports Reader role.',
        'Licences must be reprocessed every 30 days.',
      ],
      correct: [1],
      explanation:
        'Nested groups are not supported for group-based licensing. Security groups are supported, roles are irrelevant to licence inheritance, and reprocessing is only needed to retry after an error.',
    },
    {
      question:
        'You need to move 400 users from a group that assigns Office 365 E3 to a group that assigns Microsoft 365 E5 without any interruption to their mailbox access. What should you do FIRST?',
      options: [
        'Remove the users from the E3 group.',
        'Add the users to the E5 group and confirm the licence is applied.',
        'Set each user\'s usage location to the tenant location.',
        'Run Reprocess on the E3 product.',
      ],
      correct: [1],
      explanation:
        'Adding users to the destination group first avoids a gap in service while group-based licensing processes. Removing first causes temporary loss of access; usage location and reprocessing are not the blocking issue.',
    },
    {
      question:
        'Your organization wants only the 30 members of the Finance-Pilot security group to use Copilot Cowork, with a monthly cap. Which configuration meets the requirement?',
      options: [
        'Create a spending policy scoped to Finance-Pilot that selects Cowork, and ensure no other policy in the tenant selects Cowork.',
        'Create an All users spending policy that selects Cowork with a 1-credit limit and a second policy for Finance-Pilot with a higher limit.',
        'Turn off the discovery setting for usage-based AI experiences.',
        'Block the Cowork agent entry under Agents > All agents for everyone except Finance-Pilot.',
      ],
      correct: [0],
      explanation:
        'Access to Cowork is granted by policy scope. A tenant-wide policy with a tiny limit still grants everyone access, the discovery setting only controls visibility, and the Cowork agent entry no longer controls access at general availability.',
    },
    {
      question: 'Which TWO statements about Microsoft 365 Copilot licensing are correct? (Select two)',
      options: [
        'Microsoft 365 Copilot requires an eligible prerequisite licence such as Microsoft 365 E3 or Business Standard.',
        'Microsoft 365 Copilot Chat requires a Microsoft 365 Copilot add-on licence for every user.',
        'Microsoft 365 E7 includes Microsoft 365 Copilot and Microsoft Agent 365.',
        'Microsoft Agent 365 licences are assigned per tenant rather than per user.',
      ],
      correct: [0, 2],
      explanation:
        'Copilot is an add-on on top of an eligible base licence, and E7 bundles Copilot and Agent 365. Copilot Chat is included for eligible Microsoft 365 users without the add-on, and Agent 365 is licensed per user.',
    },
    {
      question:
        'Leadership asks which departments are using Copilot in Excel the least and whether Copilot is changing how long people spend in meetings. Which tool provides this analysis?',
      options: [
        'Microsoft Purview audit log search',
        'The Copilot Dashboard in Viva Insights',
        'Health > Service health',
        'Microsoft Entra sign-in logs',
      ],
      correct: [1],
      explanation:
        'The Copilot Dashboard (Copilot Analytics) provides adoption by app and group and productivity-impact metrics such as meeting time. Audit logs record interactions for compliance, Service health reports incidents, and sign-in logs show authentication.',
    },
    {
      question:
        'A Reports Reader needs to see Copilot Credit consumption by agent for last month but must not be able to change spending limits. Which role assignment is the MOST appropriate?',
      options: ['Billing Administrator', 'Global Administrator', 'AI Reader', 'License Administrator'],
      correct: [2],
      explanation:
        'AI Reader (like Global Reader) gives read-only access to the cost management dashboards. Billing Administrator and Global Administrator can change billing methods and policies, and License Administrator can edit limits.',
    },
  ],
  statements: [
    { text: 'Group-based licensing assigns licences to users in nested groups.', isTrue: false, explanation: 'Nested groups are not supported; only first-level members are licensed.' },
    { text: 'A user must have a usage location before a licence can be assigned directly.', isTrue: true, explanation: 'Group-based licensing falls back to the tenant location for users without one.' },
    { text: 'Microsoft 365 Copilot Chat is available to eligible Microsoft 365 users without the Copilot add-on licence.', isTrue: true, explanation: 'Work-grounded Copilot in apps and agents need the licence; Chat is included.' },
    { text: 'Lowering a user\'s Copilot Credit limit to one credit prevents them from using Cowork.', isTrue: false, explanation: 'Access is determined by policy scope; limits are spending safeguards enforced asynchronously.' },
    { text: 'The Copilot readiness report highlights users on an eligible Microsoft 365 Apps update channel.', isTrue: true, explanation: 'Current Channel and Monthly Enterprise Channel are eligible.' },
    { text: 'The Copilot usage report can show daily trends over the last 180 days.', isTrue: true, explanation: 'Filters support 7, 28, 90 and 180 days with summary and trend views.' },
    { text: 'Copilot Studio message capacity is purchased and monitored in the Microsoft Purview portal.', isTrue: false, explanation: 'Capacity is managed in the Power Platform admin center (optionally surfaced in the Microsoft 365 admin center cost dashboard).' },
    { text: 'Microsoft 365 Backup can be billed through a pay-as-you-go billing policy with budget alerts.', isTrue: true, explanation: 'Billing policies under Billing > Pay-as-you-go support budgets and alert recipients.' },
  ],
  resources: [
    { label: 'Assign licenses to a group in the Microsoft 365 admin center', url: 'https://learn.microsoft.com/en-us/entra/identity/users/licensing-groups-assign' },
    { label: 'License options for Microsoft 365 Copilot', url: 'https://learn.microsoft.com/en-us/copilot/plan/copilot-license-options' },
    { label: 'Usage-based billing and cost management for Copilot Credits', url: 'https://learn.microsoft.com/en-us/copilot/plan/usage-based-billing-overview-copilot-credits' },
    { label: 'Microsoft 365 Copilot usage report', url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/microsoft-365-copilot-usage' },
  ],
};

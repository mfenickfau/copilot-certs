import type { Concept } from '../../types';

export const copilotLicensingBillingAndUsageReporting: Concept = {
  id: 'copilot-licensing-billing-and-usage-reporting',
  title: 'Administering Copilot: Licences, Pay-as-you-go Billing, Feature Settings, Prompts and Usage Reporting',
  summary:
    'The everyday Copilot administration tasks in the Microsoft 365 admin center: assigning licences and reading the readiness report, running pay-as-you-go and Copilot Credit billing policies, turning individual Copilot features on or off, managing organisational and scheduled prompts, and measuring adoption with the usage report and Copilot Analytics.',
  certs: ['ab-900', 'ab-730'],
  domains: ['ab-900-3', 'ab-730-2'],
  outcomes: ['ab-900-3-2-1', 'ab-900-3-2-2', 'ab-900-3-2-3', 'ab-900-3-2-4', 'ab-900-3-1-3', 'ab-730-2-1-4'],
  tags: ['copilot-administration', 'licensing', 'pay-as-you-go', 'copilot-credits', 'copilot-settings', 'prompts', 'copilot-analytics', 'usage-reports'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Assigning Copilot licences and reading readiness',
      body: `Copilot licensing follows the normal Microsoft 365 licence mechanics. After purchase, assign the **Microsoft 365 Copilot** licence from *Users > Active users* for individuals, from *Billing > Licenses* for a product (up to 20 users or groups at a time) or, for scale, through **group-based licensing**. You need the License Administrator or User Administrator role, users need a usage location and an eligible base licence, and their Microsoft 365 Apps should be on the **Current Channel** or **Monthly Enterprise Channel** so Copilot features arrive. The **Copilot service plan diagnostic tool** checks whether a specific account meets the requirements.

The **Microsoft Copilot readiness report** (*Reports > Usage > Microsoft Copilot > Readiness*) helps you decide who gets a licence: it shows total prerequisite licences, users on an eligible update channel, assigned and available Copilot licences, and a per-user table with Teams meetings, Teams chat, Outlook and Office document activity over the last 30 days. The **Suggested candidate for Copilot** column flags the top 25 per cent of unlicensed users by Microsoft 365 activity, and recommended action cards link straight to licence assignment. Data has up to 72 hours latency, and by default user names are hidden in usage reports unless an admin enables user-level detail.

A related control under *Copilot > Settings > Data access* is **Recommendations for Microsoft Copilot licensing**, which decides whether the readiness report may generate licence recommendations from activity data. Setup also includes **Microsoft Copilot self-service purchases** (allow trials and purchases, trials only, or prevent), because business users can otherwise buy their own licences that admins then have to take over.`,
    },
    {
      heading: 'Monitoring and managing pay-as-you-go billing policies',
      body: `Consumption billing is managed in two places in the Microsoft 365 admin center, and the exam expects you to know both.

***Copilot > Billing & usage*** governs the **pay-as-you-go** service for **Copilot Chat** metered agents, **SharePoint agents** and the Copilot Retrieval API. Roles: Global Administrator, Billing Administrator or **AI Administrator**; Global Reader can view. The process is two steps: **add a billing policy**, then **connect it to a service**.

1. *Billing policies > Add a billing policy*: name it, pick (or create in-place) an **Azure subscription** and **resource group** in the same tenant, add the **users or groups** it covers, and optionally set a **budget** with email alerts at percentage milestones. You can have up to 50 policies, which lets you charge different departments to different subscriptions.
2. *Pay-as-you-go services*: select Copilot Chat or SharePoint agents and attach the policy. Only one policy can be connected at a time per service; disconnect an "all users" policy before connecting a user-specific one. Disconnecting removes access to the metered agents (allow up to two hours).

Monitoring: *Billing > Cost Management* shows a service-family view of charges (updated daily, up to 24 hours behind), and the Azure portal's Cost Management gives line-item detail with tags such as *m365copilotchat*. **Budgets alert; they never enforce.** If the Power Platform admin center also has a pay-as-you-go policy, both can coexist and you are charged once, but Microsoft recommends consolidating in the Microsoft 365 admin center.

***Copilot > Cost management*** governs **Copilot Credits** for usage-based-billing experiences (Cowork, Code, autonomous agents, Work IQ API). Here admins create **spending policies** for users, environments or agents, set policy-level and user-level **spending limits**, choose the billing method (pay-as-you-go, prepaid capacity packs or a Credit pre-purchase plan), turn **auto-apply to new services** on or off, review **credit requests** from users, and analyse consumption by policy, user, group, agent or service.`,
    },
    {
      heading: 'Which Copilot features can be enabled or disabled',
      body: `*Microsoft 365 admin center > Copilot > Settings* is the hub, grouped into **User access**, **Data access**, **Copilot actions** and **Other settings**. Some settings are changed in place; others are shortcuts to the service that owns them.

**User access**: Copilot Frontier (who can try preview features), **Microsoft Copilot in admin centers** (the Admin agent), **self-service purchases**, **Pin Copilot Chat** in app navigation, pinning the Copilot app to the Windows taskbar, and the link to **pay-as-you-go billing**.

**Data access**: **Agents** (which agents users may install or use), **AI providers** operating as independent processors or Microsoft subprocessors (for example Anthropic and OpenAI models), Copilot in Power Platform and Dynamics 365 (shortcut to the Power Platform admin center), **Data security and compliance** (shortcut to Purview), People Skills, licensing recommendations, and **Web search** for Copilot and Copilot Chat, which is actually set through the *Allow web search in Copilot* **Cloud Policy** in the Microsoft 365 Apps admin center and can be scoped to groups.

**Copilot actions**: **image generation** on or off, **screen and camera sharing** (Vision), **Copilot in Teams meetings** (shortcut to Teams meeting policies, where transcription must be allowed), and **advanced package uploads**.

**Other settings**: a custom dictionary for Teams and submitting **Copilot diagnostics logs** on behalf of users.

Outside this page: **Copilot Pages and Notebooks** are governed by Cloud Policy settings; **Copilot Chat** itself can be blocked for specific users or groups through **Integrated apps** (with a company policy URL shown to blocked users), and Copilot in Edge through Edge policies; **harmful content protection** settings tune Copilot Chat; the **Copilot key** on Windows is managed with Intune or Group Policy. The exam distinguishes settings you flip in the Copilot node from ones that live in Cloud Policy, Teams, Purview or Power Platform.`,
    },
    {
      heading: 'Managing prompts and measuring usage',
      body: `**Prompts.** Users save, like and share prompts in **Copilot Prompt Gallery** (stored inside the tenant boundary; shared prompts belong to a team) and can **schedule** prompts from the Work tab of Copilot Chat; scheduled tasks stay within the Microsoft 365 compliance boundary, with up to 10 active and 50 total per user, and legacy Power Automate-based schedules retire at the end of 2026. Users delete their own prompts and schedules.

Administrators manage **organisational prompts** at *Copilot > Prompts* (AI Administrator or Search Editor): create, edit, **pin** up to four to appear as suggestions in Copilot Chat, **import** up to 100 per CSV file (1,000 published per tenant), **export** all prompts for backup, and **delete** (permanent, so export first). Analytics show active users and submissions per prompt for 7, 14 or 28 days. Admins can also export the prompts users saved, liked or shared in Prompt Gallery for compliance.

**Usage and adoption.** Four sources make up Copilot measurement, which the Copilot Control System calls the **measurement and reporting** pillar:

- **Microsoft 365 admin center usage report** (*Reports > Usage > Microsoft Copilot > Usage*): enabled users, active users and active-user rate over 7 to 180 days, adoption by app, prompts submitted, Copilot Chat work versus web, and top agents, about 48 hours behind.
- **Copilot Analytics** powered by **Viva Insights**: the **Copilot Dashboard** (readiness, adoption, impact, sentiment, benchmarks; no Viva licence required but at least one Copilot licence, with group-level insights from 50 licences) and the **Advanced Insights Analyst workbench** with Power BI templates to tie Copilot usage to business metrics and ROI.
- **Purview audit logs** for compliance-grade interaction records.
- **Copilot Studio analytics** and the **Power Platform admin center** for agent performance and consumption.

Use the usage report to reclaim idle licences, the Copilot Dashboard to brief leadership, and organisational prompts to lift adoption where it lags.`,
    },
  ],
  examples: [
    {
      title: 'Choosing who gets the first 500 licences',
      description:
        'Contoso buys 500 Copilot licences for 4,000 staff. The AI Administrator opens the readiness report, filters to users on an eligible update channel, sorts by Suggested candidate for Copilot, and exports the CSV. HR adds those users to a security group, which is assigned the licence on Billing > Licenses. Eight weeks later the usage report shows a 71 per cent active-user rate; the 90 users who never used Copilot are moved out of the group and their licences reassigned.',
      takeaway: 'Readiness report to pick candidates, group-based licensing to assign, usage report to reclaim idle licences.',
    },
    {
      title: 'The budget that did not stop spending (a realistic mistake)',
      description:
        'An admin creates a pay-as-you-go billing policy for Copilot Chat agents with a monthly budget and assumes agents will switch off at the limit. Usage doubles after a viral internal agent and the Azure invoice is far above budget. Budgets only send emails at thresholds. The fix is to scope the policy to a smaller security group, set a tighter alert and, for Copilot Credit experiences, use spending limits in Cost management, which can cap users and policies.',
      language: 'text',
      code: `Copilot > Billing & usage > Billing policies > PAYG-CopilotChat
  Budget ............. notifications at 50% / 80% / 100%   (NOT a hard stop)
  Users/groups ....... change "All users" -> SG-Pilot-Agents

Copilot > Cost management > Spending policies (Copilot Credits)
  Policy-level limit .. 50,000 credits / month   (enforced)
  User-level limit .... 500 credits / month`,
      takeaway: 'Pay-as-you-go budgets alert only; Copilot Credit spending policies are where enforced limits live.',
    },
    {
      title: 'Turning off one feature, not Copilot',
      description:
        'Legal objects to Copilot-generated images in customer decks. Instead of removing licences, the admin goes to Copilot > Settings > Copilot actions and turns off Copilot image generation. Separately, marketing wants Copilot Chat to use the web for market data, so the admin confirms the Allow web search in Copilot Cloud Policy is enabled for the marketing group only.',
      takeaway: 'Individual capabilities (image generation, web search, Vision, meetings) are toggled in Copilot settings or Cloud Policy; licences stay in place.',
    },
  ],
  keyPoints: [
    'Assign Copilot licences via Active users, Billing > Licenses or group-based licensing; check base licence, usage location and Current or Monthly Enterprise Channel; the readiness report suggests candidates.',
    'Pay-as-you-go (Copilot Chat metered agents, SharePoint agents) is set up in Copilot > Billing & usage: create a billing policy with Azure subscription, users and optional budget, then connect it to the service; up to 50 policies; budgets notify but do not enforce.',
    'Copilot Credits for usage-based billing (Cowork, Code, autonomous agents) are governed by spending policies and limits in Copilot > Cost management; costs are also visible in Billing > Cost Management and the Azure portal.',
    'Copilot > Settings groups controls into User access, Data access, Copilot actions and Other settings; web search, Pages and Notebooks use Cloud Policy, Teams meeting Copilot uses meeting policies, and Copilot Chat can be blocked per group via Integrated apps.',
    'Users save, share and schedule prompts in Copilot Prompt Gallery and Copilot Chat; admins publish organisational prompts under Copilot > Prompts (pin four, import 100 per file, 1,000 per tenant, deletion is permanent).',
    'Usage sources: admin center usage report (enabled vs active users, adoption by app, prompts, top agents), Copilot Analytics in Viva Insights (Copilot Dashboard and Analyst workbench), Purview audit, Copilot Studio and Power Platform analytics.',
    'Roles: AI Administrator for Copilot settings, prompts and reports; Billing or AI Administrator for pay-as-you-go; License or User Administrator for licences.',
  ],
  flashcards: [
    { front: 'Where is the Microsoft Copilot readiness report?', back: 'Microsoft 365 admin center > Reports > Usage > Microsoft Copilot > Readiness tab.' },
    { front: 'What does the Suggested candidate for Copilot column mean?', back: 'The top 25 per cent of unlicensed users by Microsoft 365 app activity over the prior month.' },
    { front: 'Two steps to set up pay-as-you-go for Copilot Chat agents?', back: 'Add a billing policy (Azure subscription, resource group, users, optional budget), then connect it to the Copilot Chat service under Pay-as-you-go services.' },
    { front: 'Which roles can manage pay-as-you-go billing policies?', back: 'Global Administrator, Billing Administrator and AI Administrator (Global Reader is read-only).' },
    { front: 'Where are enforced spending limits for Copilot Credits configured?', back: 'Copilot > Cost management spending policies (policy-level and user-level limits).' },
    { front: 'How is web search for Copilot turned on or off?', back: 'Through the Allow web search in Copilot Cloud Policy in the Microsoft 365 Apps admin center (linked from Copilot settings), scoped to groups if needed.' },
    { front: 'How can an admin block Copilot Chat for a specific group?', back: 'Through Integrated apps in the Microsoft 365 admin center, optionally providing a company policy URL shown to blocked users.' },
    { front: 'Who can manage organisational prompts and how many can be pinned?', back: 'AI Administrator or Search Editor; up to four pinned prompts.' },
    { front: 'How many scheduled tasks can a user have in Copilot?', back: 'Up to 10 active and 50 total.' },
    { front: 'What metrics does the Copilot usage report show?', back: 'Enabled users, active users, active-user rate, adoption by app, prompts submitted, Copilot Chat work vs web, top agents, over 7 to 180 days.' },
    { front: 'Do you need a Viva Insights licence to open the Copilot Dashboard?', back: 'No; a Microsoft 365 subscription with at least one Copilot licence suffices, with richer group-level insights from 50 licences.' },
  ],
  quiz: [
    {
      question: 'Contoso wants unlicensed users in the Sales department to use metered agents in Copilot Chat, with Sales charged to its own Azure subscription. What should the administrator do FIRST?',
      options: [
        'Assign Copilot licences to Sales.',
        'Create a billing policy in Copilot > Billing & usage that references the Sales Azure subscription and the Sales security group.',
        'Enable web search for Copilot.',
        'Create an organisational prompt for Sales.',
      ],
      correct: [1],
      explanation:
        'Pay-as-you-go starts with a billing policy, which is then connected to the Copilot Chat service. Licences are the alternative fixed-cost model, and web search and prompts do not enable metered agents.',
    },
    {
      question: 'Leadership asks how many licensed users actually used Copilot in the last 90 days and in which apps. Which report answers this with the least effort?',
      options: [
        'The Microsoft Copilot usage report in the Microsoft 365 admin center',
        'A Content search in Purview eDiscovery',
        'Entra sign-in logs filtered to the Copilot app',
        'The Microsoft Copilot readiness report',
      ],
      correct: [0],
      explanation:
        'The usage report shows enabled versus active users and adoption by app over 7 to 180 days. eDiscovery returns content, sign-in logs show authentication, and readiness measures eligibility rather than usage.',
    },
    {
      question: 'Which TWO Copilot capabilities can be turned off directly in Microsoft 365 admin center > Copilot > Settings? (Select two)',
      options: [
        'Copilot image generation',
        'Screen and camera sharing (Vision)',
        'Transcription in Teams meetings',
        'Sensitivity label encryption',
      ],
      correct: [0, 1],
      explanation:
        'Image generation and Vision are Copilot actions settings. Meeting transcription is a Teams meeting policy (linked, not set here) and label encryption is configured in Purview.',
    },
    {
      question: 'An administrator wants Copilot Chat suggestions to show four approved prompts to every user and to publish 300 department prompts efficiently. What should they do?',
      options: [
        'Ask each user to save the prompts in Copilot Prompt Gallery.',
        'Use Copilot > Prompts to import the prompts from CSV files (up to 100 per file) and pin four of them.',
        'Create a Teams messaging policy containing the prompts.',
        'Schedule the prompts with Power Automate.',
      ],
      correct: [1],
      explanation:
        'Organisational prompts support bulk import and up to four pinned suggestions. User-saved prompts are personal, messaging policies do not hold prompts, and scheduling runs prompts rather than publishing them.',
    },
    {
      question: 'A department lead reports that Copilot Credit spending for Cowork is growing quickly and must be capped for junior staff. Where should the administrator act?',
      options: [
        'Copilot > Billing & usage > Billing policies budget',
        'Copilot > Cost management spending policies with a user-level limit',
        'Billing > Licenses',
        'Reports > Usage',
      ],
      correct: [1],
      explanation:
        'Copilot Credit experiences such as Cowork are governed by spending policies with enforced limits. Pay-as-you-go budgets only notify, licences do not cap credits, and reports are read-only.',
    },
    {
      question: 'Which admin role is the least privileged that can both view Copilot usage reports and manage organisational prompts?',
      options: ['Global Administrator', 'AI Administrator', 'Billing Administrator', 'SharePoint Administrator'],
      correct: [1],
      explanation:
        'AI Administrator covers Copilot settings, reports and prompts. Global Administrator is over-privileged, Billing Administrator handles pay-as-you-go but not prompts, and SharePoint Administrator is unrelated.',
    },
  ],
  statements: [
    { text: 'The Copilot readiness report can suggest which unlicensed users would benefit most from a licence.', isTrue: true, explanation: 'The Suggested candidate for Copilot column ranks the top 25 per cent of unlicensed users by activity.' },
    { text: 'A pay-as-you-go billing policy becomes effective as soon as it is created, without connecting it to a service.', isTrue: false, explanation: 'Creating the policy defines the billing infrastructure; it must be connected to Copilot Chat or SharePoint agents to take effect.' },
    { text: 'Pay-as-you-go budgets enforce a hard spending cap.', isTrue: false, explanation: 'They send notifications at thresholds only; Copilot Credit spending policies provide enforced limits.' },
    { text: 'Web search in Copilot is controlled through a Cloud Policy setting rather than a toggle inside Purview.', isTrue: true, explanation: 'The Allow web search in Copilot Cloud Policy in the Microsoft 365 Apps admin center governs it.' },
    { text: 'Deleting an organisational prompt is permanent.', isTrue: true, explanation: 'Microsoft recommends exporting prompts before deletion.' },
    { text: 'The Copilot Dashboard in Viva Insights requires every viewer to hold a paid Viva Insights licence.', isTrue: false, explanation: 'It is available with a Microsoft 365 subscription and at least one Copilot licence; Viva licences add features.' },
    { text: 'Copilot Chat can be blocked for a subset of users through Integrated apps in the Microsoft 365 admin center.', isTrue: true, explanation: 'The block can be scoped to users or groups and can display a company policy URL.' },
  ],
  resources: [
    { label: 'Set up Microsoft Copilot pay-as-you-go services', url: 'https://learn.microsoft.com/en-us/copilot/implement/setup-pay-as-you-go' },
    { label: 'Configure Microsoft Copilot settings in the Microsoft 365 admin center', url: 'https://learn.microsoft.com/en-us/copilot/implement/configure-copilot-admin-center' },
    { label: 'Manage organizational prompts', url: 'https://learn.microsoft.com/en-us/copilot/manage/organizational-prompts' },
    { label: 'Microsoft Copilot reports and insights', url: 'https://learn.microsoft.com/en-us/copilot/manage/copilot-admin-reports' },
  ],
};

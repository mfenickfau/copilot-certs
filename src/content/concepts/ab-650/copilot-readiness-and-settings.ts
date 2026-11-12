import type { Concept } from '../../types';

export const copilotReadinessAndSettings: Concept = {
  id: 'copilot-readiness-and-settings',
  title: 'Copilot Tenant Readiness, Settings and User Experiences',
  summary:
    'Assessing whether a tenant is ready for Microsoft 365 Copilot (licences, update channels, network, app requirements, in-app experiences), then configuring the Copilot settings page in the Microsoft 365 admin center: web search, self-service purchases, Copilot in admin centers and the Admin agent, release preferences and Frontier, the AI disclaimer, image and video generation, pinning, sharing, feedback and other user-experience controls.',
  certs: ['ab-650'],
  domains: ['ab-650-3'],
  outcomes: ['ab-650-3-1-1', 'ab-650-3-1-3', 'ab-650-3-1-5', 'ab-650-3-1-6'],
  tags: ['copilot-settings', 'tenant-readiness', 'web-search', 'self-service-purchase', 'frontier', 'release-preferences', 'ai-disclaimer', 'image-generation', 'copilot-chat', 'admin-agent'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Assessing tenant readiness',
      body: `Readiness has technical and data dimensions. The technical checklist:

- **Licences**: an eligible base licence plus the Microsoft 365 Copilot add-on (or Microsoft 365 E7). The **Copilot readiness report** (Reports > Usage > Microsoft 365 Copilot > Readiness) shows prerequisite licences, eligible update channels, assigned and available licences, suggested candidates and recommended actions. The **service plan diagnostic tool** verifies one user.
- **Identity and mailbox**: a Microsoft Entra work or school account; an Exchange Online primary mailbox for mail, calendar and meeting experiences (Copilot is not available in group mailboxes).
- **Apps**: Microsoft 365 Apps on **Current Channel or Monthly Enterprise Channel** (Semi-Annual lags), the Office Feature Updates task running, **privacy settings for connected experiences** enabled, OneDrive provisioned for file-based features, Teams and Outlook new or supported versions. **In-app experiences** (Copilot in Word, Excel, PowerPoint, Outlook, Teams, OneNote, Loop) appear only when these conditions are met; a licensed user on an old channel sees no Copilot button.
- **Network**: allow the Microsoft 365 and Copilot endpoints, especially *.cloud.microsoft (do not block copilot.cloud.microsoft to stop personal accounts; use **tenant restrictions v2** instead), and verify that proxies, Conditional Access and app control do not block the Copilot app. The connectivity test tool and **network connectivity insights** help.
- **Admin roles**: **AI Administrator** for Copilot configuration; Office Apps Administrator for Cloud Policy settings.

The data dimension is covered by the **Copilot Optimization Assessment**, the **secure and governed foundation blueprint**, SharePoint Advanced Management and Purview DSPM for AI. Adoption readiness uses the **Microsoft Adoption** Success Kit, the **Copilot onboarding** guided experience (with your AI usage policy link, tracked in Viva Learning) and the welcome email templates. "Assess readiness" questions usually want the readiness report or the diagnostic tool first, not licence purchases.`,
    },
    {
      heading: 'The Copilot settings page: user access and data access',
      body: `Most tenant controls sit in **Microsoft 365 admin center > Copilot > Settings**, grouped into **User access**, **Data access**, **Copilot actions** and **Other settings**, with **View all** for the rest. Some entries configure in place; others link to the Teams admin center, Microsoft 365 Apps admin center (Cloud Policy), Purview or Power Platform.

**User access**
- **Microsoft 365 Copilot self-service purchases**: allow trials and purchases, allow trials only, or **prevent** self-service purchases (users then request through the admin). Pair with the general self-service purchase setting (*MSCommerce* PowerShell, *AllowSelfServicePurchase*).
- **Copilot in admin centers** (the **Microsoft 365 Admin agent**): lets eligible admins use Copilot inside the admin centers and Copilot Chat for tasks such as listing unlicensed users or assigning a licence; every write action needs explicit confirmation and respects the admin's Entra roles. No extra licence is required.
- **Copilot pay-as-you-go billing** for Copilot Chat agents, **Copilot Frontier** (preview features: No access, All users, or Specific users and groups), **Pin Copilot Chat** in the Microsoft 365 app navigation, and **Pin the Microsoft 365 Copilot app to the Windows taskbar**.

**Data access**
- **Web search for Copilot and Copilot Chat**: implemented as the **Allow web search in Copilot** Cloud Policy in the Microsoft 365 Apps admin center (so it needs Office Apps Administrator); the setting link takes you there. When on, Copilot sends short generated queries, never whole prompts or documents, to Bing; users keep a Web content toggle. Turning it off reduces freshness and affects Researcher, Analyst and Cowork grounding. Purview DSPM for AI and audit log the exact queries, and DLP can block web search for sensitive prompts.
- **Agents**, **AI providers operating as independent processors** and **as Microsoft subprocessors**, **Recommendations for Copilot licensing**, **People Skills**, **Azure DevOps data**, and the **Data security and compliance** shortcuts to Purview.`,
    },
    {
      heading: 'Copilot actions, release preferences, disclaimer and content controls',
      body: `**Copilot actions** holds the generative controls: **Copilot image generation** (allow or prevent image creation experiences, including the Create and Designer-backed features; video creation follows the same action-level controls where available), **Screen and camera sharing** (Vision), **Copilot in Teams meetings** (link to the Teams meeting policy), and **Advanced package uploads** (who can upload advanced agent and plugin packages).

**Release preferences** combine two mechanisms. **Standard release** and **Deferred release** (about 30 days later) are set under Org settings > Organization profile > Release preferences for the whole organization or selected users; Targeted release is being retired in January 2027. **Frontier** is opt-in early access to pre-GA Copilot and Microsoft 365 features, set in Copilot settings (**No access** by default), and since March 2026 new Frontier agents are visible only to Frontier-enrolled users. A unified release preferences experience is rolling out in November 2026. Roles: AI Administrator, Security Administrator or Office Apps Administrator can enrol users in Frontier.

The **Copilot AI disclaimer** (Copilot > Settings > View all > Copilot AI disclaimer; AI Administrator) shows "AI-generated content may be inaccurate" in Word, Excel, PowerPoint, Outlook, OneNote and the Copilot app, in Standard or Bold font, with an optional link to your internal AI policy; enabling it creates a tenant-level Cloud Policy named Copilot AI Disclaimer. It does not appear in SharePoint, OneDrive, Whiteboard or Forms.

Content safety: core protections (prompt injection defence, copyright, biosecurity, image filters) are always on. The **Adjust responsible AI protections** Cloud Policy lets a security group of investigators toggle **harmful content protection** off per conversation for text only. **Copilot sharing** (Copilot > Settings > Copilot sharing) controls whether users can share sessions and responses by link; recipients still need permission to the referenced content. **Watermarks** for AI-generated content, **Copilot Pages and Notebooks** Cloud Policies, **organizational prompts**, **scheduled prompts**, the **Copilot custom dictionary** and **Copilot diagnostics logs** round out the user experience controls.`,
    },
    {
      heading: 'Managing Copilot user experiences and the exam angle',
      body: `"Manage Copilot user experiences" is about shaping what licensed and unlicensed users see:

- **Copilot Chat** is available to all eligible Microsoft 365 users (web-grounded) and becomes work-grounded with a licence; manage access through the Copilot app's availability (an integrated app you can deploy or block), **Pin Copilot Chat**, Edge policies (*HubsSidebarEnabled*, *EdgeEntraCopilotPageContext*), the Copilot key remap and tenant restrictions for personal accounts.
- **In-app experiences**: Cloud Policy settings in the Microsoft 365 Apps admin center can turn Copilot off per app, control Pages and Notebooks, and set connected-experience privacy. Copilot in Teams meetings follows the meeting policy.
- **Agents**: the Agent and plugin access, User access and Sharing settings decide which agents appear in the Agent Store (covered in the agent concepts).
- **Personalisation and memory**, **Copilot Library**, People Skills and organizational prompts tailor the experience; **Copilot onboarding** and the prompt gallery drive adoption.

Exam patterns: "prevent users from buying Copilot trials with credit cards" is the **self-service purchases** setting; "block Copilot from using Bing" is the **web search Cloud Policy**; "show a disclaimer linking to our AI policy" is the **AI disclaimer**; "let only the innovation team try pre-release Copilot features" is **Frontier** scoped to a group; "allow admins to use natural language in the admin center" is **Copilot in admin centers**; "stop image generation" is the **Copilot image generation** action setting; "users see no Copilot in Word despite a licence" is an **update channel or connected-experiences privacy** problem. Distractors: Conditional Access, DLP and sensitivity labels solve access and data problems, not experience toggles; Power Platform admin center settings govern Copilot Studio and Dynamics Copilots, not Microsoft 365 Copilot.`,
    },
  ],
  examples: [
    {
      title: 'Licensed users see no Copilot button in Word (a realistic mistake)',
      description:
        'After assigning 200 Copilot licences, a third of users report that Word and Excel show no Copilot. The readiness report shows those users are not on an eligible update channel: their devices run Semi-Annual Enterprise Channel. Separately, a Cloud Policy disabled "connected experiences that analyze content" for the Legal group. The admin moves devices to Monthly Enterprise Channel and corrects the privacy policy; Copilot appears after the next update.',
      takeaway: 'In-app Copilot depends on an eligible update channel and connected-experience privacy settings, not just the licence.',
    },
    {
      title: 'Turning off web grounding for a regulated department with Cloud Policy',
      description:
        'A bank\'s compliance team must not have Copilot send any query to Bing, while the rest of the company keeps web search. From Copilot > Settings the admin follows the web search link to the Microsoft 365 Apps admin center, creates a Cloud Policy configuration "Allow web search in Copilot" set to Disabled, and scopes it to the Compliance security group. Everyone else inherits the default (enabled). Purview DSPM for AI confirms no web queries from that group afterwards.',
      takeaway: 'Web search is a Cloud Policy (Office Apps Administrator), so it can be scoped per group rather than tenant-wide.',
    },
    {
      title: 'Locking down purchases and previews during a controlled pilot',
      description:
        'During a 90-day pilot the CFO wants no surprise spend and no preview features outside the pilot group. The AI Administrator sets Microsoft 365 Copilot self-service purchases to "Prevent", sets Copilot Frontier to "Specific users and groups" with the Pilot group, and disables the self-service purchase capability tenant-wide for Copilot with PowerShell.',
      language: 'powershell',
      code: `Install-Module MSCommerce -Scope CurrentUser
Connect-MSCommerce
Get-MSCommerceProductPolicies -PolicyId AllowSelfServicePurchase | Where-Object ProductName -like "*Copilot*"
Update-MSCommerceProductPolicy -PolicyId AllowSelfServicePurchase -ProductId <CopilotProductId> -Enabled $false`,
      takeaway: 'Self-service purchase controls live in Copilot settings and the MSCommerce module; Frontier scopes previews to a group.',
    },
    {
      title: 'Meeting a regulator\'s transparency requirement',
      description:
        'An auditor requires that staff are reminded AI output may be inaccurate and can find the acceptable-use policy from within Office apps. The admin enables the Copilot AI disclaimer with Bold font and the intranet URL of the AI policy. Users see the disclaimer in Word, Excel, PowerPoint, Outlook, OneNote and the Copilot app; the auditor is told it does not appear in SharePoint, OneDrive, Whiteboard or Forms.',
      takeaway: 'The AI disclaimer is a one-switch tenant policy with an optional policy link; know the supported app list.',
    },
  ],
  keyPoints: [
    'Readiness: eligible base licence plus Copilot add-on, Entra account, Exchange Online mailbox, Microsoft 365 Apps on Current or Monthly Enterprise Channel, connected-experience privacy on, OneDrive, and network allow-listing of *.cloud.microsoft and Copilot endpoints; use the readiness report and service plan diagnostic tool.',
    'Copilot > Settings in the Microsoft 365 admin center is grouped into User access, Data access, Copilot actions and Other settings; AI Administrator configures, Global Reader views, and some settings link out to Cloud Policy, Teams or Purview.',
    'Web search is the "Allow web search in Copilot" Cloud Policy (Office Apps Administrator) and can be scoped per group; only short generated queries go to Bing, and DLP can block web search for sensitive prompts.',
    'Self-service purchases: allow trials and purchases, trials only, or prevent; Copilot in admin centers enables the Microsoft 365 Admin agent, which respects Entra roles and confirms every write.',
    'Release preferences: Standard or Deferred release in Org settings; Frontier (No access, All users, Specific users and groups) gives pre-GA Copilot features; Targeted release retires in January 2027.',
    'The Copilot AI disclaimer (View all > Copilot AI disclaimer) shows in Word, Excel, PowerPoint, Outlook, OneNote and the Copilot app with an optional policy link; not in SharePoint, OneDrive, Whiteboard or Forms.',
    'Copilot actions control image generation, screen and camera sharing (Vision), Teams meetings and advanced package uploads; Copilot sharing, harmful-content adjustment, watermarks and Pages/Notebooks policies shape user experiences.',
  ],
  flashcards: [
    { front: 'Which Microsoft 365 Apps update channels are eligible for Copilot?', back: 'Current Channel and Monthly Enterprise Channel.' },
    { front: 'Which domain must be allowed for the Copilot app and Copilot Chat?', back: '*.cloud.microsoft (the app URL is copilot.cloud.microsoft); block personal accounts with tenant restrictions, not by blocking the domain.' },
    { front: 'Where is the web search setting for Copilot actually configured?', back: 'As the "Allow web search in Copilot" Cloud Policy in the Microsoft 365 Apps admin center (linked from Copilot > Settings).' },
    { front: 'What does Copilot send to Bing when web search is on?', back: 'Short generated search queries derived from the prompt, never the full prompt, documents or user identity.' },
    { front: 'What are the three options for Microsoft 365 Copilot self-service purchases?', back: 'Allow trials and purchases, allow trials only, prevent self-service purchases.' },
    { front: 'What does "Copilot in admin centers" enable?', back: 'The Microsoft 365 Admin agent for eligible admins in the admin centers and Copilot Chat; actions respect Entra roles and require confirmation.' },
    { front: 'What are the Frontier access options?', back: 'No access (default), All users, Specific users and groups.' },
    { front: 'Where are Standard and Deferred release preferences set?', back: 'Settings > Org settings > Organization profile > Release preferences (a unified experience is rolling out).' },
    { front: 'In which apps does the Copilot AI disclaimer appear?', back: 'Word, Excel, PowerPoint, Outlook, OneNote and the Microsoft 365 Copilot app; not SharePoint, OneDrive, Whiteboard or Forms.' },
    { front: 'Where do you stop Copilot image generation?', back: 'Copilot > Settings > Copilot actions > Copilot image generation.' },
    { front: 'Which role is the least privileged for Copilot settings?', back: 'AI Administrator (Global Reader for read-only; Office Apps Administrator for Cloud Policy settings).' },
    { front: 'Which Cloud Policy lets investigators disable harmful content protection in Copilot Chat?', back: 'Adjust responsible AI protections for Microsoft 365 Copilot, scoped to a security group; text responses only.' },
  ],
  quiz: [
    {
      question:
        'Contoso assigned Microsoft 365 Copilot licences to 500 users. Users on devices running Semi-Annual Enterprise Channel report no Copilot in Word. What should you do FIRST?',
      options: [
        'Reassign the licences.',
        'Move the devices to Current Channel or Monthly Enterprise Channel.',
        'Enable web search for Copilot.',
        'Create a Conditional Access policy for Office 365.',
      ],
      correct: [1],
      explanation:
        'In-app Copilot requires an eligible update channel. Licences are already assigned, web search affects grounding not availability, and Conditional Access does not surface the Copilot button.',
    },
    {
      question:
        'Finance wants to prevent employees from buying Microsoft 365 Copilot trials with corporate credit cards, while still allowing IT to purchase licences centrally. Which setting should you change?',
      options: [
        'Copilot > Settings > User access > Microsoft 365 Copilot self-service purchases > Prevent self-service purchases',
        'Copilot > Settings > Data access > Web search',
        'Org settings > Release preferences > Deferred release',
        'Copilot > Settings > Copilot actions > Copilot image generation',
      ],
      correct: [0],
      explanation:
        'The self-service purchases setting blocks user-initiated trials and purchases; IT can still buy through Billing. The other settings control grounding, release cadence and image creation.',
    },
    {
      question: 'Which TWO statements about web search in Microsoft 365 Copilot are correct? (Select two)',
      options: [
        'The control is implemented as a Cloud Policy in the Microsoft 365 Apps admin center and can be scoped to groups.',
        'When enabled, Copilot sends the user\'s full prompt and attached documents to Bing.',
        'Purview DSPM for AI can show the exact web search queries Copilot generated.',
        'Web search is required for Copilot to read SharePoint documents.',
      ],
      correct: [0, 2],
      explanation:
        'Web search is a scoped Cloud Policy, and DSPM for AI activity explorer shows the generated queries. Only short generated queries go to Bing, and SharePoint grounding uses Microsoft Graph, not the web.',
    },
    {
      question:
        'Only the 40 members of the Innovation group should receive pre-release Copilot agents and features. What should you configure?',
      options: [
        'Set Copilot Frontier to Specific users and groups and select the Innovation group.',
        'Assign the Innovation group to Deferred release.',
        'Enable Copilot in admin centers for the Innovation group.',
        'Create a spending policy for the Innovation group.',
      ],
      correct: [0],
      explanation:
        'Frontier controls pre-GA access and can be scoped to groups. Deferred release delays GA features, Copilot in admin centers is for admins, and spending policies govern Copilot Credits.',
    },
    {
      question:
        'A regulator requires that AI-generated content in Office apps carries a notice that it may be inaccurate, with a link to the corporate AI policy. Which action meets the requirement with the LEAST effort?',
      options: [
        'Turn on the Copilot AI disclaimer in Copilot settings and add the policy URL.',
        'Apply a sensitivity label with a footer to all documents.',
        'Create an organizational prompt that asks users to be careful.',
        'Enable watermarks for AI-generated images.',
      ],
      correct: [0],
      explanation:
        'The AI disclaimer is purpose-built for this, including the tooltip link. Labels and prompts do not display an AI accuracy notice, and watermarks apply to images only.',
    },
    {
      question:
        'An administrator wants to ask "which users have no Copilot licence?" in natural language inside the Microsoft 365 admin center and act on the answer. What must be true?',
      options: [
        'Copilot in admin centers is enabled, and the admin holds a role that permits the action.',
        'The admin has a Copilot Studio licence.',
        'Web search is enabled tenant-wide.',
        'The admin is enrolled in Deferred release.',
      ],
      correct: [0],
      explanation:
        'The Microsoft 365 Admin agent needs the Copilot in admin centers setting and honours Entra RBAC; no Copilot or Copilot Studio licence is required. Web search and release preferences are unrelated.',
    },
  ],
  statements: [
    { text: 'The Copilot readiness report can assign licences directly to suggested candidates.', isTrue: true, explanation: 'It supports licence assignment and shows update-channel readiness.' },
    { text: 'Blocking copilot.cloud.microsoft is the recommended way to stop personal Microsoft account sign-ins.', isTrue: false, explanation: 'Use tenant restrictions v2; blocking the domain breaks the work experience.' },
    { text: 'The AI disclaimer appears in SharePoint and OneDrive.', isTrue: false, explanation: 'It appears in Word, Excel, PowerPoint, Outlook, OneNote and the Copilot app only.' },
    { text: 'Copilot Frontier defaults to No access.', isTrue: true, explanation: 'Admins choose All users or Specific users and groups to enrol.' },
    { text: 'The Microsoft 365 Admin agent can change tenant settings without admin confirmation.', isTrue: false, explanation: 'Every write or execute action requires explicit confirmation and respects the admin\'s roles.' },
    { text: 'Turning off web search affects Researcher, Analyst and Cowork grounding.', isTrue: true, explanation: 'Web search is recommended for these experiences although not a prerequisite.' },
    { text: 'Core responsible AI protections such as prompt injection defence can be disabled by policy.', isTrue: false, explanation: 'Only harmful content protection for text can be adjusted by a scoped policy; core protections always apply.' },
    { text: 'Copilot sharing settings let recipients access files referenced in a shared session.', isTrue: false, explanation: 'Sharing a session never grants access to the underlying content; existing permissions apply.' },
  ],
  resources: [
    { label: 'Configure Microsoft 365 Copilot settings in the Microsoft 365 admin center', url: 'https://learn.microsoft.com/en-us/copilot/implement/configure-copilot-admin-center' },
    { label: 'Data, privacy, and security for web search in Microsoft 365 Copilot', url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/manage-public-web-access' },
    { label: 'Get started with the Microsoft Frontier program', url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/manage/get-started-frontier' },
    { label: 'Turn on AI disclaimers in Microsoft 365 Copilot', url: 'https://learn.microsoft.com/en-us/copilot/implement/microsoft-365-ai-disclaimers' },
  ],
};

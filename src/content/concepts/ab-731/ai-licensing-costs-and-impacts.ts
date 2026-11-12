import type { Concept } from '../../types';

export const aiLicensingCostsAndImpacts: Concept = {
  id: 'ai-licensing-costs-and-impacts',
  title: 'Licensing, Subscription Models and the Data, Security, Privacy and Cost Impacts of Adoption',
  summary:
    'The commercial models a leader must plan around: Copilot Chat included with Microsoft 365, the Microsoft 365 Copilot add-on licence (and E7 and Business variants), Copilot Credits with pay-as-you-go, pre-purchase and prepaid packs for agents and Cowork, and Foundry Tools pay-as-you-go versus commitment tiers and provisioned reservations, together with the data, security, privacy and cost impacts that adoption brings.',
  certs: ['ab-731', 'ab-900'],
  domains: ['ab-731-3', 'ab-900-3'],
  outcomes: ['ab-731-3-2-4', 'ab-731-3-2-5', 'ab-731-3-2-6', 'ab-900-3-1-2'],
  tags: ['licensing', 'copilot-credits', 'pay-as-you-go', 'commitment-tier', 'cost-management', 'privacy', 'data-impact'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Copilot licence types: included, monthly add-on, and pay-as-you-go',
      body: `There are three commercial routes to Copilot capability, and the exam tests that you can match a need to a route.

**Included with Microsoft 365.** **Copilot Chat** is available to users with eligible Microsoft 365 licences at no additional cost. It is web-grounded, protected by Enterprise Data Protection, and includes declarative agents grounded in instructions and public web content. Users without the add-on also get standard (non-priority) access to Copilot in Word, Excel, PowerPoint and OneNote, subject to fair-use limits and capacity.

**Per-user add-on licence (monthly or annual).** The **Microsoft 365 Copilot** licence is a per-user subscription, available as an add-on to a long list of eligible plans (Microsoft 365 E3 and E5, Office 365 E1 to E5, F1 and F3, Business Basic to Premium, Teams, Exchange and SharePoint plans and others) and **included in Microsoft 365 E7**. It unlocks work grounding through Microsoft Graph and Work IQ, priority access in the apps, Copilot Analytics, SharePoint Advanced Management, agent capabilities in Copilot Studio when used in Copilot, Teams or SharePoint, and eligibility for usage-based features. **Microsoft Copilot Business** provides the same capabilities to organisations of up to 300 users on eligible Business plans, on an annual commitment. Government (GCC, GCC High, DoD) and education (faculty, staff and students aged 13 and older) variants exist.

**Pay-as-you-go and usage-based billing.** Agents that use work data for users without the add-on, **Copilot Cowork** and **Copilot Code** (which also require the add-on), the Work IQ API, Copilot Studio agents and agent flows, and advanced work in SharePoint and OneDrive are metered in **Copilot Credits**. Credits can be bought three ways: a **pay-as-you-go meter** billed monthly through an Azure subscription for actual use with no upfront commitment; a **Copilot Credit Pre-purchase Plan (P3)**, a one-year prepaid pool usable across eligible Microsoft products at a discount; and **prepaid capacity packs** (the standalone Copilot Studio subscription) enforced monthly with unused credits not carrying over. Employee-facing agent use by add-on licence holders running with their own identity is generally not charged separately.

Administrators govern all of this from **Copilot > Cost management** in the Microsoft 365 admin center: identity- and resource-based spending policies, per-user and per-policy limits, alerts, credit requests, and consumption reports by user, group, agent and service; Copilot Studio environments are governed in the Power Platform admin center with opt-in to Microsoft 365 spending policies.`,
    },
    {
      heading: 'Foundry and Foundry Tools subscription models',
      body: `Azure-side AI is billed by consumption, with options to trade flexibility for discounts and predictability:

- **Pay-as-you-go (Standard).** Foundry Tools such as Vision, Speech, Language, Translator and Document Intelligence bill per transaction (per thousand images, per audio hour, per text record) on pricing tiers that set throughput limits and features; many have a **free tier (F0)** for trials. Foundry models bill **per token** for input and output on Standard, Global Standard and Data Zone Standard deployments. This suits variable, unpredictable or early-stage workloads.
- **Commitment tiers.** For several Foundry Tools (Speech to text, Text to speech, Translator, Language features such as sentiment, key phrases and NER, Vision OCR, Document Intelligence custom and invoice models) you can commit to a monthly volume for a fixed fee at a discounted rate, with overage billed above the quota. Commitment tiers are purchased per single-service resource (not on a multi-service Foundry resource), run on calendar months with pro-rated first-month billing, auto-renew unless cancelled, are non-refundable, and have separate yearly plans for **disconnected containers** running on premises. They suit steady, forecastable volumes.
- **Provisioned throughput and reservations.** For models, **provisioned throughput units (PTUs)** reserve dedicated capacity billed hourly regardless of tokens, with one-month or one-year **Azure reservations** discounting the hourly rate. This suits predictable, latency-sensitive production traffic. **Batch** deployments offer discounted tokens for asynchronous bulk work.
- **Azure spending controls.** Budgets, cost alerts, quotas and Azure Policy let finance and platform teams cap and monitor spend across projects.

The leadership decision pattern is the same as for any cloud service: start pay-as-you-go to learn the real usage profile, then convert steady volume to commitments or reservations once the forecast is reliable, and keep spiky or experimental work on consumption. Converting too early locks in a wrong estimate; converting too late pays list price for predictable load.`,
    },
    {
      heading: 'Data, security and privacy impacts of adoption',
      body: `Introducing AI changes the organisation's data, security and privacy posture even when nothing about the AI itself is insecure. Leaders should plan for:

- **Data impacts.** Copilot makes everything a user can access discoverable, so **oversharing** and stale or duplicate content surface immediately; grounding quality depends on curation; agents and connectors create new copies and indexes of data (Graph connector indexes, Azure AI Search indexes, Dataverse) that need ownership, retention and classification. Pre-rollout data readiness (permissions review, sensitivity labels, DLP for AI, archiving) is the mitigation, and SharePoint Advanced Management is included with the Copilot add-on for this reason.
- **Security impacts.** New attack surface in prompt injection and agent actions; new identities (agents) to govern; new admin roles and settings (Copilot Control System, spending policies, agent publishing) that need least-privilege assignment; shadow AI from unsanctioned tools. Mitigations are covered in the secure AI concept: content safety, least-privilege agents, Entra Agent ID, Conditional Access, tenant restrictions, Purview DSPM for AI and the Security Dashboard for AI.
- **Privacy impacts.** Interactions are logged and discoverable, which supports compliance but also means employee prompts are records subject to retention, eDiscovery and potentially access requests; personal data may appear in prompts and outputs; AI-generated summaries of meetings and chats raise expectations about consent and transparency. Enterprise Data Protection confirms prompts and responses are not used to train foundation models and stay within Microsoft's contractual commitments; the EU Data Boundary applies to EU traffic; and admins can decide whether web queries are sent and whether features such as image generation are enabled. Privacy impact assessments and updates to employee privacy notices are standard adoption tasks.

The exam pairs these with licence facts: for example, a scenario about frontline staff using the free Copilot Chat still requires the organisation to think about web-grounding policy and acceptable use, because EDP protects the data but does not decide what employees may paste.`,
    },
    {
      heading: 'Cost impacts and how to control them',
      body: `AI cost arrives in several streams, and surprises usually come from the metered ones:

- **Fixed per-user licences** are predictable; the planning question is who truly needs work grounding and priority access versus who is well served by the included Copilot Chat.
- **Metered Copilot Credits** scale with agent design and traffic. In Copilot Studio, costs differ by feature: a classic authored answer costs less than a generative answer, grounding in the tenant graph costs more again, agent flow actions are billed per bundle, and reasoning-model orchestration bills per thousand tokens, so long instructions, large knowledge retrievals and long conversations consume many credits. The agent usage estimator helps forecast, and admins can set monthly limits per agent.
- **Azure consumption** for Foundry models and tools, driven by tokens, transactions, model tier and deployment type.
- **Hidden costs**: data readiness, training, change management, governance reviews, evaluation and monitoring, and the engineering time for anything custom.

Controls a leader should expect to see in place before scaling:

1. **Right-size licences by persona**, using Copilot Dashboard usage to reassign under-used seats.
2. **Spending policies and limits** in the Microsoft 365 admin center for Copilot Credits, with alerts and a request process; environment and agent limits in the Power Platform admin center; budgets and alerts in Azure.
3. **Design for cost**: retrieval instead of long prompts, model routing, batch for bulk, caching, and pricing-aware agent design (classic answers for fixed content).
4. **Choose the billing model to the usage profile**: pay-as-you-go while learning, pre-purchase plans or commitment tiers and reservations for steady volume.
5. **Tie spend to value**: every scenario has an owner, a baseline and an outcome metric, so expansion decisions are evidence-based.

Exam cues: "no upfront commitment, pay for actual use" is pay-as-you-go; "steady forecastable volume, discounted rate" is a commitment tier or reservation; "included with existing Microsoft 365 licences" is Copilot Chat; "work data grounding across apps" is the add-on licence; "cap what an agent can spend" is a spending policy or monthly limit.`,
    },
  ],
  examples: [
    {
      title: 'Right-sizing by persona',
      description:
        'A manufacturer planned to buy the Copilot add-on for all 8,000 staff. Working through personas, it found 5,500 frontline workers whose needs (procedure summaries, translation, drafting short notes) were met by the included Copilot Chat on mobile, 2,000 knowledge workers who needed Graph-grounded Copilot across the apps, and 500 who would use metered agents and Cowork. It licensed the 2,000, enabled pay-as-you-go agents under spending policies for the 500, and used Copilot Dashboard data after two quarters to add or reassign seats.',
      takeaway: 'Match the licence route to the persona\'s grounding needs and manage the metered tier with spending policies.',
    },
    {
      title: 'The agent that burned its credits in a week (a realistic mistake)',
      description:
        'An operations team published a Copilot Studio agent for 3,000 unlicensed warehouse staff that answered every question with generative answers grounded in the tenant graph and used a reasoning model with a long instruction block. Credit consumption exhausted the month\'s prepaid pack in nine days and the agent was throttled. The redesign used classic authored answers for the twenty most common questions, limited tenant graph grounding to the questions that needed it, switched to a standard model, trimmed the instructions, and set a monthly credit limit and alert for the agent.',
      takeaway: 'Agent design decisions are billing decisions; use the estimator, prefer cheaper features where they suffice, and set limits.',
    },
    {
      title: 'When a commitment tier pays off',
      description:
        'A contact centre transcribes 40,000 hours of calls a month with the Speech service and has done so steadily for six months on pay-as-you-go. Finance converts the Speech resource to a monthly commitment tier matching the forecast volume, accepting overage pricing for peaks, and keeps a new, experimental Language sentiment workload on pay-as-you-go until its volume is understood.',
      takeaway: 'Commit steady, well-understood volume; keep variable or new workloads on consumption.',
    },
    {
      title: 'Privacy impact of meeting recaps',
      description:
        'A European firm enabled Copilot meeting recaps and received questions from its works council about recording, retention and who could read AI summaries. The adoption team ran a privacy impact assessment, updated the employee privacy notice, configured retention for Copilot interactions, confirmed EU Data Boundary processing, documented that prompts are not used for model training, and gave teams guidance on announcing recap use in meetings.',
      takeaway: 'Adoption changes the privacy posture; assess it, document it and communicate it as part of the rollout.',
    },
  ],
  keyPoints: [
    'Copilot Chat is included with eligible Microsoft 365 licences (web-grounded, Enterprise Data Protection); the Microsoft 365 Copilot add-on licence adds Graph and Work IQ grounding, priority access and Copilot Analytics, and is included in Microsoft 365 E7; Microsoft Copilot Business serves up to 300 users.',
    'Agents using work data, Cowork, Code, the Work IQ API and Copilot Studio usage are metered in Copilot Credits, bought via pay-as-you-go meters, a one-year Pre-purchase Plan (P3) or prepaid capacity packs; licensed users\' own-identity agent use is generally not charged separately.',
    'Admins govern usage-based billing in Copilot > Cost management in the Microsoft 365 admin center with spending policies, limits, alerts and consumption reports; Copilot Studio environments are managed in the Power Platform admin center.',
    'Foundry Tools bill pay-as-you-go per transaction with free tiers for trials; commitment tiers give discounted fixed monthly volumes for selected services on single-service resources, with overage and separate yearly disconnected-container plans.',
    'Foundry models bill per token on Standard deployments, hourly per PTU on provisioned deployments (discounted by one-month or one-year reservations), and at discounted token rates for Batch.',
    'Adoption impacts data (oversharing, curation, new indexes), security (prompt injection, agent identities, new admin roles, shadow AI) and privacy (logged interactions, personal data in prompts, meeting recaps, residency), each needing planned mitigation.',
    'Control cost by right-sizing licences per persona, setting spending policies and agent limits, designing agents and prompts for cost, matching the billing model to the usage profile and tying every scenario to a measured outcome.',
  ],
  flashcards: [
    { front: 'Which Copilot experience is included with eligible Microsoft 365 licences at no extra cost?', back: 'Copilot Chat (web-grounded, with Enterprise Data Protection and web-grounded declarative agents).' },
    { front: 'What does the Microsoft 365 Copilot add-on licence unlock?', back: 'Work grounding via Microsoft Graph and Work IQ, priority access in the apps, Copilot Analytics, SharePoint Advanced Management, agent capabilities in Copilot and eligibility for usage-based features such as Cowork.' },
    { front: 'Which Microsoft 365 suite includes Copilot without an add-on, and what is the SMB option?', back: 'Microsoft 365 E7 includes Copilot; Microsoft Copilot Business serves organisations of up to 300 users on eligible Business plans.' },
    { front: 'What are Copilot Credits?', back: 'The common usage currency for metered Copilot capabilities such as work-data agents for unlicensed users, Cowork, Code, the Work IQ API and Copilot Studio agents.' },
    { front: 'Name three ways to buy Copilot Credits.', back: 'Pay-as-you-go meter via an Azure subscription, the one-year Copilot Credit Pre-purchase Plan (P3), and prepaid capacity packs.' },
    { front: 'Where do admins set spending policies and limits for usage-based Copilot billing?', back: 'Copilot > Cost management in the Microsoft 365 admin center (Copilot Studio environments also in the Power Platform admin center).' },
    { front: 'What is a Foundry Tools commitment tier?', back: 'A discounted fixed monthly fee for a committed volume of a specific service (for example Speech, Translator, Language, Vision OCR, Document Intelligence), with overage billed above quota, on a single-service resource.' },
    { front: 'When should a workload move from pay-as-you-go to a commitment tier or reservation?', back: 'When its volume is steady and forecastable; keep variable or experimental workloads on consumption.' },
    { front: 'What privacy impacts does Copilot adoption bring?', back: 'Interactions become logged, retained and discoverable records; personal data may appear in prompts and outputs; meeting recaps raise consent and transparency expectations; residency must be confirmed.' },
    { front: 'Name four cost controls for AI adoption.', back: 'Right-size licences by persona, set spending policies and agent limits, design agents and prompts for cost (retrieval, routing, classic answers), and choose the billing model that matches the usage profile.' },
  ],
  quiz: [
    {
      question:
        'A company wants 3,000 frontline employees to have secure, web-grounded AI chat with enterprise data protection at no additional licence cost, and 400 analysts to have Copilot grounded in their mail, files and meetings across the Office apps. What should you recommend?',
      options: [
        'Microsoft 365 Copilot add-on licences for all 3,400 users',
        'Copilot Chat (included) for the frontline employees and Microsoft 365 Copilot add-on licences for the 400 analysts',
        'Copilot Chat for everyone, since it grounds in Microsoft Graph',
        'Copilot Studio prepaid capacity packs for all users',
      ],
      correct: [1],
      explanation:
        'Copilot Chat meets the frontline need at no added cost; the add-on supplies work grounding for the analysts. Licensing everyone wastes money, Chat does not ground in Graph automatically, and capacity packs fund agents, not personal Copilot.',
    },
    {
      question: 'Which TWO statements about Copilot Credits are correct? (Select two)',
      options: [
        'They can be purchased through a pay-as-you-go meter billed monthly to an Azure subscription for actual usage',
        'They can be purchased as a one-year Copilot Credit Pre-purchase Plan (P3)',
        'They are required for a licensed user to open Copilot in Word',
        'Unused prepaid pack credits roll over indefinitely',
      ],
      correct: [0, 1],
      explanation:
        'Pay-as-you-go and the P3 pre-purchase plan are two of the purchase routes (prepaid packs are the third). Copilot in Word is covered by the add-on licence, and prepaid capacity is enforced monthly with no carry-over.',
    },
    {
      question:
        'A contact centre has transcribed a steady 40,000 hours of calls a month with the Speech service for six months on pay-as-you-go. A new sentiment-analysis pilot has unknown volume. What is the MOST cost-effective billing approach?',
      options: [
        'Keep both on pay-as-you-go indefinitely',
        'Move both to commitment tiers immediately',
        'Move the steady Speech workload to a commitment tier and keep the new sentiment pilot on pay-as-you-go until its volume is understood',
        'Buy a provisioned throughput reservation for the Speech service',
      ],
      correct: [2],
      explanation:
        'Commit forecastable volume and keep unknown volume on consumption. Committing the pilot risks locking in a wrong estimate, staying on consumption pays list price for steady load, and PTUs apply to model deployments rather than the Speech service.',
    },
    {
      question:
        'A Copilot Studio agent for unlicensed staff exhausted its monthly prepaid credits in nine days. Which combination of changes BEST reduces consumption while keeping the agent useful?',
      options: [
        'Use classic authored answers for the most common questions, limit tenant graph grounding to questions that need it, trim long instructions and set a monthly credit limit with alerts',
        'Switch every answer to a reasoning model for better quality',
        'Add more knowledge sources so answers are richer',
        'Remove the agent\'s identity so usage is not tracked',
      ],
      correct: [0],
      explanation:
        'Cheaper features where they suffice, less grounding and shorter prompts cut credits, and limits prevent overruns. Reasoning models and more knowledge increase consumption, and removing identity is neither possible nor a cost control.',
    },
    {
      question: 'After enabling Copilot, employees ask whether their prompts are retained and who can see them. Which statement is accurate?',
      options: [
        'Prompts are not stored anywhere and cannot be reviewed',
        'Copilot interactions are logged and subject to the organisation\'s retention, eDiscovery and audit controls, and are protected by Enterprise Data Protection rather than used to train foundation models',
        'Prompts are sent to the model vendor to improve future models',
        'Only prompts containing sensitivity labels are retained',
      ],
      correct: [1],
      explanation:
        'Interactions are compliance records under Purview controls, within Enterprise Data Protection. They are not used for model training, and retention does not depend on labels.',
    },
    {
      question: 'A finance director wants to prevent any team\'s Copilot Studio agents or Cowork usage from exceeding an agreed monthly budget. Where should this be configured?',
      options: [
        'In each user\'s Outlook settings',
        'Through spending policies and limits in Copilot > Cost management in the Microsoft 365 admin center (and Power Platform admin center for Copilot Studio environments)',
        'By applying a sensitivity label to the agent',
        'By disabling web search in Copilot Chat',
      ],
      correct: [1],
      explanation:
        'Spending policies, limits and alerts live in the admin center cost-management experience. Outlook settings, sensitivity labels and web-search policy do not control credit spend.',
    },
  ],
  statements: [
    { text: 'Copilot Chat is included with eligible Microsoft 365 licences at no additional cost.', isTrue: true, explanation: 'It is the web-grounded baseline experience with Enterprise Data Protection.' },
    { text: 'The Microsoft 365 Copilot add-on licence is required for any employee to use Copilot Chat.', isTrue: false, explanation: 'Copilot Chat is included; the add-on adds work grounding, priority access and more.' },
    { text: 'Copilot Credits can be bought through a pay-as-you-go meter, a one-year pre-purchase plan or prepaid capacity packs.', isTrue: true, explanation: 'These are the three purchase routes for usage-based Copilot billing.' },
    { text: 'Foundry Tools commitment tiers can be applied to a multi-service Foundry resource.', isTrue: false, explanation: 'Commitment tiers require a single-service resource such as a Speech or Translator resource.' },
    { text: 'Provisioned throughput for Foundry models is billed per PTU per hour regardless of tokens consumed.', isTrue: true, explanation: 'Reservations discount the hourly rate for one-month or one-year commitments.' },
    { text: 'Because Enterprise Data Protection applies, organisations do not need an acceptable-use policy for Copilot Chat.', isTrue: false, explanation: 'EDP protects data contractually and technically but does not decide what employees may paste or how they verify outputs.' },
    { text: 'Many Foundry Tools offer a free tier for evaluation.', isTrue: true, explanation: 'The F0 SKU lets teams trial services before paying.' },
  ],
  resources: [
    { label: 'License options for Microsoft Copilot', url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-licensing' },
    { label: 'Usage-based billing and Copilot Credits overview', url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/usage-based-billing-overview-copilot-credits' },
    { label: 'Copilot Studio licensing and Copilot Credits', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing' },
    { label: 'Purchase commitment tier pricing (Foundry Tools)', url: 'https://learn.microsoft.com/en-us/azure/ai-services/commitment-tier' },
  ],
};

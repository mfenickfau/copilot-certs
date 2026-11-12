import type { Concept } from '../../types';

export const adoptionTeamChampionsAndBarriers: Concept = {
  id: 'adoption-team-champions-and-barriers',
  title: 'Planning AI Adoption: The Adoption Team, Champions and Common Barriers',
  summary:
    'How to organise an AI adoption programme that produces real usage: the roles and responsibilities of the adoption team, the barriers that stall rollouts (trust, skills, data readiness, unclear use cases, fear, governance friction) and how to clear them, how to run an AI champions programme, and how to measure adoption and impact so leaders can steer.',
  certs: ['ab-731', 'ab-100'],
  domains: ['ab-731-3', 'ab-100-1'],
  outcomes: ['ab-731-3-2-1', 'ab-731-3-2-2', 'ab-731-3-2-3', 'ab-100-1-2-12'],
  tags: ['adoption', 'change-management', 'champions', 'barriers', 'copilot-dashboard', 'training'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'Adoption is a change programme, not a licence assignment',
      body: `Assigning Copilot licences and sending a welcome email produces a spike of curiosity and then a slump. Sustained adoption comes from treating AI as organisational change: people need a reason, a skill, a safe environment and reinforcement. Microsoft's enablement guidance for Copilot lays out a sequence that is the skeleton of an adoption plan:

1. **Get ready**: run the Copilot Optimization Assessment for data governance and security maturity, fix oversharing, and get the data foundation in order.
2. **Choose licences** by persona and scenario.
3. **Prepare apps and network.**
4. **Set up and assign** licences and policies.
5. **Welcome, onboard and gather feedback**: use the in-product Copilot onboarding experience, link the AI usage policy, share scenario libraries and prompt galleries, and open feedback channels.

The **Microsoft Adoption** site adds the Success Kit, Launch Day kit, Interactive Scenario Library (example outcomes and success measures by industry and role) and QuickStart training. Behind the checklists are the classic change levers: a compelling **why** from leadership, **role-specific scenarios** so each person sees what AI does for their job, **training** that is short and repeated, **champions** who help peers, and **measurement** that shows progress and informs the next wave.

Plan in **waves**: a pilot with engaged volunteers across functions, then expansion by persona with lessons applied, then broad rollout. Each wave has defined scenarios, success measures, training and feedback loops. The exam rewards answers that begin with readiness and people, not with technology.`,
    },
    {
      heading: 'The adoption team: who does what',
      body: `An **adoption team** turns the plan into action. Microsoft's guidance and its adoption resources describe a set of roles; the names vary, the responsibilities do not:

- **Executive sponsor**: owns the why, removes blockers, models usage visibly, and ties the programme to business goals. Sponsorship is the single strongest predictor of adoption.
- **Adoption or programme lead**: runs the plan, waves, communications, training calendar and measurement; reports to the sponsor and to the AI council.
- **Business scenario owners** from each function: identify and prioritise use cases, define success measures for their process, and validate value.
- **IT and security**: licences, tenant readiness, data governance, policies, support paths.
- **Change management and communications**: messaging, launch events, learning content, feedback loops.
- **Learning and development**: training paths, prompt skills, role-based curricula, onboarding completion tracking (for example through Viva Learning reporting).
- **Champions network**: peer experts inside the business (next section).
- **HR and legal**: role impact, policy, acceptable use.

The adoption team is distinct from, but reports into, the AI council or Center of Excellence: the council sets strategy and guardrails; the adoption team delivers usage and gathers evidence. In the Cloud Adoption Framework's AI Center of Excellence model, "develop AI skills", "lead pilot projects" and "measure and report outcomes" are explicit responsibilities that the adoption team fulfils.

A frequent exam framing: a rollout has licences assigned but low usage; what role or action is missing? Usually it is an executive sponsor who visibly uses Copilot and role-specific scenarios with owners, not another technical setting.`,
    },
    {
      heading: 'Common barriers and how to clear them',
      body: `Adoption programmes meet a predictable set of barriers. Leaders are expected to recognise each and pick the matching remedy:

| Barrier | What it looks like | Remedy |
|---|---|---|
| **Lack of trust** (accuracy, privacy, job fear) | "It makes things up", "where does my data go", "it will replace us" | Transparency on data protection (EDP, no training on tenant data), citation and verification training, leadership messaging about augmentation and role evolution |
| **Skills gap** | People try once, get a poor result, stop | Prompt training, prompt galleries and libraries, champions, in-product onboarding, scenario-based learning |
| **Unclear use cases** | "What am I supposed to use it for?" | Role-based scenario libraries, business scenario owners, day-in-the-life demos |
| **Data readiness** | Oversharing incidents, stale or missing content, poor answers | Data foundation work before rollout: permissions, labels, DLP, curation |
| **Governance friction** | Every use case needs weeks of approval | Risk-tiered governance, a clear usage policy, fast intake |
| **Leadership silence** | Sponsor approved budget but never uses or mentions it | Visible executive usage, regular storytelling of wins |
| **Change fatigue and time** | "No time to learn another tool" | Embed in existing workflows and meetings, start with high-frequency tasks, micro-learning |
| **Cost uncertainty** | Finance blocks expansion without evidence | Baselines, pilot measurement, Copilot Dashboard data, clear ROI criteria |
| **Technical readiness** | App versions, network, licences misassigned | Readiness checklists and the setup guide |

Two cross-cutting points. First, **trust and skills** are usually the biggest barriers, and both are people problems solved by communication and enablement, not by configuration. Second, barriers differ by persona: frontline staff worry about time and devices, knowledge workers about accuracy, managers about team impact, and executives about risk; a single message to "all staff" misses most of them.`,
    },
    {
      heading: 'The AI champions programme and measuring adoption',
      body: `**Champions** are enthusiastic employees embedded in business teams who help colleagues adopt AI. They are not IT support; they are peers who show what works in the context of their own job. An effective programme has:

- **Selection**: volunteers across functions, locations and seniority, with manager support and a modest time allocation.
- **Enablement**: early access, deeper training, a direct line to the adoption team and product news, and a community (a Teams channel, regular calls) where they share prompts and wins.
- **Responsibilities**: run show-and-tell sessions, collect and curate prompts and scenarios, surface blockers and feedback, pilot new features and agents, and tell success stories.
- **Recognition**: visible acknowledgement from leadership, badges or titles, career development credit.
- **Measurement**: champion coverage per team, sessions run, prompts contributed, and adoption metrics in teams with champions versus without.

Champions compound: they scale training, make trust local ("Priya in our team uses it for this"), and feed the adoption team with ground truth.

**Measuring adoption and impact** closes the loop. Microsoft provides the **Microsoft Copilot Dashboard** (part of Copilot Analytics, powered by Viva Insights) with readiness, adoption (active users, usage by app and feature), impact (time estimates, business-outcome reports) and sentiment data, plus usage reports in the Microsoft 365 admin center and Copilot Studio analytics for agents. Pair these with the process metrics each scenario owner defined (cycle time, cases closed, proposals per week) and with periodic surveys. Report in the sponsor's language: outcomes and money, with usage as the leading indicator.

Exam cues: "peer-led", "show what works in each team", "scale training" point to a champions programme; "prove value to the CFO" points to Copilot Dashboard data plus process baselines; "assigned licences, low usage" points to sponsorship, scenarios and training rather than a technical fix.`,
    },
  ],
  examples: [
    {
      title: 'Licences assigned, nobody using them (a realistic mistake)',
      description:
        'A professional-services firm assigned 1,500 Copilot licences, sent one email and declared the project done. After three months the Copilot Dashboard showed a quarter of licences active and most usage was occasional chat. The post-mortem found no executive had used Copilot in public, no team had defined what to use it for, and the only training was a recorded webinar. The relaunch named a sponsor who opened every town hall with a Copilot story, appointed scenario owners in each practice, ran short role-based clinics, and recruited forty champions. Active usage tripled within two waves.',
      takeaway: 'Licences do not create adoption; sponsorship, role-specific scenarios, training and champions do.',
    },
    {
      title: 'Trust barrier in a regulated firm',
      description:
        'Analysts at an insurer refused to use Copilot because they believed prompts trained the public model and that answers could not be trusted. The adoption team published a plain-language explainer of Enterprise Data Protection, ran a session on checking citations with real examples of good and bad answers, and had the compliance officer co-present. Usage in the analyst group doubled in six weeks.',
      takeaway: 'Diagnose the specific trust barrier and answer it directly with facts and verification skills.',
    },
    {
      title: 'Champions as the training engine',
      description:
        'A retailer with 300 stores could not train every store manager centrally. It recruited one champion per region, gave them early access and a monthly call with the adoption lead, and asked each to run a 20-minute "how I use Copilot for weekly scheduling and supplier emails" session for their stores. Champions contributed prompts to a shared library, and regions with active champions showed markedly higher usage on the Copilot Dashboard than those without.',
      takeaway: 'A champions network scales enablement and makes adoption local and credible.',
    },
    {
      title: 'Measuring what the sponsor cares about',
      description:
        'The adoption lead at a bank reported weekly active users; the COO was unmoved. She switched to pairing usage with the metrics scenario owners had baselined: loan-document preparation time down a third, meeting-summary completion up, and a survey showing analysts saved hours a week. The COO funded the next wave.',
      takeaway: 'Usage is the leading indicator; business outcomes and money are the language of sponsors.',
    },
  ],
  keyPoints: [
    'Adoption is organisational change: readiness, sponsorship, role-specific scenarios, training, champions and measurement, delivered in waves from pilot to broad rollout.',
    'Microsoft\'s enablement sequence: get ready (Optimization Assessment, data foundation), choose licences, prepare apps and network, set up and assign, then welcome, onboard and gather feedback using the Adoption site kits.',
    'The adoption team includes an executive sponsor, an adoption lead, business scenario owners, IT and security, change and communications, learning and development, champions, and HR and legal; it delivers usage under the AI council\'s strategy.',
    'Common barriers: lack of trust, skills gap, unclear use cases, data readiness, governance friction, leadership silence, change fatigue, cost uncertainty and technical readiness, each with a matching remedy.',
    'Trust and skills are the largest barriers and are solved by communication and enablement, not configuration; messages must be tailored by persona.',
    'A champions programme selects cross-functional volunteers, enables them with early access and a community, gives them clear responsibilities, recognises them and measures their effect.',
    'Measure with the Microsoft Copilot Dashboard (readiness, adoption, impact, sentiment) plus scenario-level process metrics and surveys, reported as outcomes with usage as the leading indicator.',
  ],
  flashcards: [
    { front: 'What is the first step in Microsoft\'s Copilot enablement sequence?', back: 'Get the organisation ready: run the Copilot Optimization Assessment, fix data governance and oversharing, and use the Microsoft Adoption site resources.' },
    { front: 'Which role is the strongest predictor of successful AI adoption?', back: 'A visible executive sponsor who owns the why, removes blockers and models usage.' },
    { front: 'What does a business scenario owner do?', back: 'Identifies and prioritises use cases for their function, defines success measures for the process and validates the value delivered.' },
    { front: 'How does the adoption team relate to the AI council?', back: 'The council sets strategy and guardrails; the adoption team delivers usage, training, champions and evidence, and reports into the council.' },
    { front: 'Name five common barriers to AI adoption.', back: 'Lack of trust, skills gap, unclear use cases, data readiness problems, governance friction (also leadership silence, change fatigue, cost uncertainty, technical readiness).' },
    { front: 'How do you address the trust barrier that "prompts train the public model"?', back: 'Explain Enterprise Data Protection plainly: prompts and responses stay in the tenant and are not used to train foundation models; pair with verification training.' },
    { front: 'What is an AI champion?', back: 'A peer embedded in a business team who shows colleagues how AI helps in their job, shares prompts and scenarios, surfaces feedback and tells success stories.' },
    { front: 'What should a champions programme provide to champions?', back: 'Early access, deeper training, a community and direct line to the adoption team, clear responsibilities, recognition and time allocation.' },
    { front: 'What does the Microsoft Copilot Dashboard report?', back: 'Readiness, adoption (active users, usage by app and feature), impact (time estimates and business-outcome reports) and sentiment.' },
    { front: 'What is the Interactive Scenario Library?', back: 'A Microsoft Adoption resource with example Copilot scenarios, outcomes and success measures by industry and role.' },
  ],
  quiz: [
    {
      question:
        'Three months after assigning 2,000 Copilot licences, the Copilot Dashboard shows low active usage. No executives have mentioned Copilot and no team has defined use cases. What is the MOST appropriate action?',
      options: [
        'Enable web search for Copilot Chat',
        'Secure a visible executive sponsor, appoint business scenario owners to define role-specific use cases and run role-based training with champions',
        'Reassign the licences to a different department',
        'Switch users to Copilot Chat (Basic) to reduce cost',
      ],
      correct: [1],
      explanation:
        'Low usage with silent leadership and no scenarios is a change-management gap. Web search is unrelated, reassigning licences repeats the mistake, and downgrading abandons the value rather than realising it.',
    },
    {
      question: 'Which TWO are typical responsibilities of an AI champion? (Select two)',
      options: [
        'Running peer show-and-tell sessions on how they use Copilot in their role',
        'Collecting and sharing effective prompts and surfacing blockers to the adoption team',
        'Approving Copilot licence purchases for the company',
        'Configuring Purview DLP policies for AI interactions',
      ],
      correct: [0, 1],
      explanation:
        'Champions are peer enablers who demonstrate, share and feed back. Licence purchasing is a sponsor or procurement function, and DLP configuration belongs to IT and security.',
    },
    {
      question: 'Analysts refuse to use Copilot because they believe their prompts are used to train public models. Which barrier is this, and what is the BEST remedy?',
      options: [
        'A technical readiness barrier; upgrade the Office apps',
        'A trust barrier; explain Enterprise Data Protection in plain language and train on verifying citations, with compliance co-presenting',
        'A cost barrier; buy more licences',
        'A governance barrier; require an impact assessment for every prompt',
      ],
      correct: [1],
      explanation:
        'Misunderstanding of data handling is a trust barrier solved by clear facts and verification skills. App upgrades, more licences and heavier governance do not address the belief.',
    },
    {
      question: 'A CFO will not fund Copilot expansion without evidence of value. Which approach is MOST likely to succeed?',
      options: [
        'Report total prompts submitted per month',
        'Pair Copilot Dashboard adoption and impact data with the process metrics scenario owners baselined before the pilot, expressed as time and money',
        'Share testimonials from the vendor\'s website',
        'Promise that productivity will improve by an industry-average percentage',
      ],
      correct: [1],
      explanation:
        'Sponsors respond to outcomes tied to baselines and real usage data. Prompt counts, vendor testimonials and generic percentages are not evidence from this organisation.',
    },
    {
      question: 'Which sequence reflects Microsoft\'s recommended order for enabling Copilot in an organisation?',
      options: [
        'Assign licences, then assess data readiness, then choose licences',
        'Get the organisation and data ready, choose licences, prepare apps and network, set up and assign, then onboard users and gather feedback',
        'Send a welcome email, then fix oversharing after incidents occur',
        'Build custom agents first, then assign Copilot licences',
      ],
      correct: [1],
      explanation:
        'Readiness and data foundation come first, then licensing and technical preparation, then assignment and onboarding. The other sequences invert readiness and rollout or start with building.',
    },
    {
      question: 'Store managers in 300 locations cannot attend central training. Which approach scales enablement MOST effectively?',
      options: [
        'Recruit regional champions with early access who run short peer sessions and contribute prompts to a shared library',
        'Require every manager to travel to head office for a one-day course',
        'Disable Copilot in stores until training is complete',
        'Send a 60-page manual by email',
      ],
      correct: [0],
      explanation:
        'A champions network scales peer-led, role-relevant training. Central travel is impractical, disabling the tool delays value, and a long manual is rarely read.',
    },
  ],
  statements: [
    { text: 'Assigning licences and sending a welcome email is usually sufficient to achieve sustained Copilot adoption.', isTrue: false, explanation: 'Adoption needs sponsorship, scenarios, training, champions and measurement; licences alone produce a spike and a slump.' },
    { text: 'Microsoft recommends assessing data governance and security readiness before deploying Copilot.', isTrue: true, explanation: 'The Copilot Optimization Assessment and data-foundation work are step one of the enablement guidance.' },
    { text: 'AI champions are IT support staff who resolve technical tickets about Copilot.', isTrue: false, explanation: 'Champions are peers in business teams who show colleagues what works and share prompts and feedback.' },
    { text: 'Trust and skills gaps are among the most common barriers to AI adoption.', isTrue: true, explanation: 'Both are people problems addressed by communication and enablement.' },
    { text: 'The Microsoft Copilot Dashboard provides adoption, impact and sentiment data for licensed Copilot usage.', isTrue: true, explanation: 'It is part of Copilot Analytics, powered by Viva Insights.' },
    { text: 'A single all-staff message is the most effective way to address adoption barriers across personas.', isTrue: false, explanation: 'Barriers differ by persona; messaging and training should be tailored.' },
    { text: 'Business scenario owners define success measures for the processes AI will change.', isTrue: true, explanation: 'Owners in each function identify use cases and the metrics that prove value.' },
  ],
  resources: [
    { label: 'Enable and adopt Microsoft Copilot in your organization', url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-enablement-resources' },
    { label: 'Build an AI Center of Excellence (Cloud Adoption Framework)', url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/ai/center-of-excellence' },
    { label: 'Microsoft Copilot Dashboard (Viva Insights)', url: 'https://learn.microsoft.com/en-us/viva/insights/org-team-insights/copilot-dashboard' },
  ],
};

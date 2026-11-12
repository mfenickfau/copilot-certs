import type { Concept } from '../../types';

export const aiStrategyCoeAndValueCase: Concept = {
  id: 'ai-strategy-coe-and-value-case',
  title: 'AI Strategy, Center of Excellence and the Value Case',
  summary:
    'The planning backbone of AB-100: running the Cloud Adoption Framework AI adoption process, defining an agentic-first build strategy, standing up an AI Center of Excellence, and proving value with ROI and total-cost-of-ownership analysis plus a disciplined build, buy or extend decision.',
  certs: ['ab-100', 'ab-731'],
  domains: ['ab-100-1', 'ab-731-2', 'ab-731-3'],
  outcomes: ['ab-100-1-2-1', 'ab-100-1-2-2', 'ab-100-1-2-12', 'ab-100-1-3-1', 'ab-100-1-3-2', 'ab-100-1-3-3', 'ab-731-2-1-10', 'ab-731-3-1-3'],
  tags: ['cloud-adoption-framework', 'strategy', 'center-of-excellence', 'roi', 'tco', 'build-buy-extend', 'licensing'],
  difficulty: 'advanced',
  sections: [
    {
      heading: 'The CAF AI adoption process',
      body: `Microsoft's **Cloud Adoption Framework (CAF) AI scenario** gives architects a repeatable path from idea to production. Expect exam questions that ask which step a given activity belongs to, or what should happen *first*.

1. **AI Strategy.** Executive leadership defines the business outcomes AI must support, documents decision rights in an AI charter, decides what to centralise (policy, responsible AI standards) and how broadly to give the workforce approved AI access. The **Microsoft AI decision tree** maps use cases to solutions: Microsoft 365 Copilot and in-product or role-based Copilots to enhance individual efficiency; extensibility tools, Copilot Studio, Foundry, Fabric or Azure Machine Learning to automate business functionality. The rule: pick the option that meets the need with the **least operational responsibility**.
2. **AI Plan.** Identify use cases from business problems, classify them (individual work versus business automation; generative versus non-generative), assess AI maturity and skills with the skills-and-data-readiness framework, acquire skills, access resources and prioritise a proof of concept.
3. **AI Ready.** Prepare landing zones, networking, identity and the data foundation; decide where SaaS (Copilot Studio) and PaaS (Foundry) workloads sit relative to Azure landing zones.
4. **AI Govern, Secure, Manage.** Establish risk assessment aligned with the NIST AI Risk Management Framework, responsible AI policies, security baselines and operational monitoring.

CAF stresses that data strategy follows use cases: you do not need a whole new data platform before adoption, you need the specific data each approved capability requires, accessible and governed. The exam distractor is usually a step done out of order, such as buying Foundry capacity before any use case has been classified, or writing security policy after agents are already in production.`,
    },
    {
      heading: 'Designing the strategy for AI and agents in business solutions',
      body: `An **agentic-first strategy** describes how the organisation will build, not just what. The architect's strategy document typically fixes:

- **Platform tiers.** Microsoft 365 Copilot and prebuilt agents for horizontal productivity; Copilot Studio (SaaS, Copilot Credits) for low-code business agents and extending Copilot; Microsoft Foundry (PaaS, consumption billing) for custom models, hosted agents and code-first orchestration; Dynamics 365 and Power Platform in-product AI for process-embedded intelligence. Greater customisation means more skills and more operational ownership.
- **Operating model.** Centralised at the start of the AI journey to consolidate expertise and foundations, moving to an advisory model as business units mature. Environment strategy mirrors this: a Default environment locked down with environment routing, managed environments per business unit, and ring-deployment environments for dev, test and production.
- **Reuse rules.** Shared knowledge sources, a prompt library, reusable child agents and connectors, published MCP servers, and standard templates from the Copilot Agent Kit library so teams do not re-solve the same problem.
- **Third-party AI.** How non-Microsoft agents and assistants are discovered, governed and connected (Agent 365 connected platforms, Entra Agent ID for identities, Purview DSPM for AI for data risk).
- **Success metrics.** Adoption, time saved, resolution rate, cost per interaction, risk indicators, tied back to the charter's business outcomes.

Power Platform's **adoption maturity model** (strategy and experience, business strategy, governance and security, technology and data, organisation and culture) is a handy way to assess where a client is and what the roadmap must address first.`,
    },
    {
      heading: 'Elements of the Microsoft AI Center of Excellence',
      body: `CAF describes an **AI Center of Excellence (AI CoE)** as the internal team that prevents fragmented or ungoverned adoption. The exam tests both its *composition* and its *responsibilities*.

**Build the team.** Secure executive sponsorship (budget, authority, access to C-level decision makers, a steering committee with monthly reviews); appoint a dedicated AI CoE leader as single point of contact; assemble a multidisciplinary team (business leaders who own use cases and data, senior data scientists, machine learning engineers, AI governance experts, AI security specialists, AI operations); decide placement, usually inside an existing Cloud Center of Excellence rather than as an isolated unit; and define the operating model (centralised early, advisory as maturity grows).

**Responsibilities.**
- *Define AI strategy*: identify opportunities with business leaders, apply the AI decision tree, write responsible AI policies.
- *Develop AI skills*: assess skills, build learning pathways, create hands-on experimentation space.
- *Lead pilot projects*: prioritise by business impact and feasibility, run proofs of concept, feed lessons back.
- *Define and enforce AI standards*: governance, architecture patterns, security baselines, naming and ALM standards.
- *Manage AI operations and continuous improvement*: monitoring, cost governance (for example Copilot Credit allocation), model lifecycle, feedback loops.

Related constructs you may see in options: an **AI council** (the cross-functional oversight body, often the steering committee), an **AI champions programme** (business-unit advocates who drive adoption), and the **adoption team** (change management). The CoE is the technical and standards owner; the council governs; champions evangelise. Distractors mix these up.`,
    },
    {
      heading: 'ROI, TCO and build, buy or extend',
      body: `A value case answers whether an AI solution is worth it and which sourcing route is cheapest over its life.

**Selecting ROI criteria.** Benefits: hours saved multiplied by loaded cost, deflected contacts, faster cycle times, revenue uplift (conversion, upsell), error and rework reduction, risk avoided. Costs (TCO): licences (Microsoft 365 Copilot per user; Copilot Studio Copilot Credits via prepaid packs or pay-as-you-go; Dynamics 365 agent consumption; Foundry model and tool consumption), implementation and integration, data remediation, change management and training, run costs (monitoring, evaluation, retraining), governance overhead, and the cost of hallucination or error incidents. A credible analysis states assumptions, uses a baseline measured before the pilot, and separates one-off from recurring costs.

**Creating the analysis.** Define the process scope and current baseline metrics, model the target state per use-case class, estimate consumption with the **Copilot Studio agent usage estimator** (agent type, traffic, orchestration, knowledge, tools), compute payback and three-year net value, then add sensitivity ranges because adoption and deflection rates are uncertain. Important licensing nuance: employee-facing Copilot Studio agents used by **Microsoft 365 Copilot-licensed users under their own identity are covered by that licence**, whereas customer-facing or unauthenticated agents consume Copilot Credits.

**Build, buy or extend.** *Buy* (prebuilt): Microsoft or partner agents such as Researcher, Analyst, Sales Qualification Agent, Case Management Agent; lowest effort, least differentiation. *Extend*: declarative agents, Copilot Studio customisation of Dynamics 365 Copilot, adding knowledge and tools to Microsoft 365 Copilot; moderate effort, inherits Microsoft's security and UI. *Build*: custom engine agents or Foundry agents with custom models; highest control and cost. Microsoft's guidance is to start with the least operational responsibility that meets the requirement, and to build only when a differentiating capability, a data or compliance constraint, or a model requirement cannot be met otherwise.`,
    },
  ],
  examples: [
    {
      title: 'Sequencing a bank\'s AI programme with CAF',
      description:
        'A bank\'s innovation team has already provisioned a Foundry project and started fine-tuning a model for complaint classification, while the executive team has no agreed AI outcomes and legal has not published usage policy. The architect pauses the fine-tuning, runs the CAF Strategy step (charter, decision rights, workforce access policy), classifies the complaint use case as business automation suited to non-generative classification plus a generative drafting agent, and only then confirms the Foundry work as a prioritised proof of concept inside an AI Ready landing zone.',
      takeaway: 'CAF order matters: strategy and governance decisions precede platform investment, otherwise pilots cannot be approved for production.',
    },
    {
      title: 'Standing up an AI CoE inside an existing CCoE',
      description:
        'A global manufacturer with a mature Cloud Center of Excellence considers a separate AI team. Following CAF guidance, it instead adds an AI CoE leader, a governance specialist and two ML engineers to the CCoE, forms an AI council of business and IT leaders that meets monthly with the sponsor, and launches an AI champions programme in each plant. The CoE publishes responsible AI policy, a prompt library and ALM standards, and runs the first three pilots itself before moving to an advisory model.',
      takeaway: 'The CoE owns standards and pilots; the council governs; champions drive adoption. Build on existing teams rather than in isolation.',
    },
    {
      title: 'The ROI model that forgot run costs (a realistic mistake)',
      description:
        'A consultancy presents a service-desk agent with a 9-month payback based on deflected tickets. The CFO asks about Copilot Credits for 40,000 external users, knowledge refresh effort, evaluation and monitoring staffing and the cost of a wrong answer to a customer. Re-run with the agent usage estimator and a 10% error-handling allowance, payback moves to 20 months and the recommendation changes to a phased rollout starting with employee-facing use (covered by existing Microsoft 365 Copilot licences) before external channels.',
      takeaway: 'TCO must include consumption, data upkeep, evaluation and the cost of errors; licensing scope changes the answer.',
    },
    {
      title: 'Build, buy or extend for lead qualification',
      description:
        'A software vendor wants an agent that researches inbound leads and sends outreach. Option A: build it in Foundry with a custom model. Option B: use the prebuilt Dynamics 365 Sales Qualification Agent and configure selection criteria, email instructions and knowledge sources. Option C: extend Copilot with a declarative agent. Because the requirement matches the prebuilt agent\'s capabilities and the differentiation lies in the data, not the model, the architect recommends buy (Option B) and reserves build for a later proprietary propensity model.',
      takeaway: 'Buy when a prebuilt agent covers the requirement; extend when you need your knowledge and actions inside Copilot; build only for genuine differentiation.',
    },
  ],
  keyPoints: [
    'CAF AI adoption runs Strategy, Plan, Ready, then Govern/Secure/Manage; choose the solution with the least operational responsibility that meets the need.',
    'The Microsoft AI decision tree separates enhancing individual efficiency (Microsoft 365 Copilot, role and in-product Copilots) from automating business functionality (Copilot Studio, Foundry, Fabric, Azure ML).',
    'An agentic-first strategy fixes platform tiers, operating model, environment strategy, reuse rules, third-party AI governance and success metrics.',
    'The AI CoE needs executive sponsorship, a dedicated leader, a multidisciplinary team, placement within the existing CCoE where possible, and a centralised-then-advisory operating model.',
    'CoE responsibilities: define strategy, develop skills, lead pilots, define and enforce standards, manage operations and continuous improvement.',
    'ROI criteria pair benefits (time saved, deflection, revenue, error reduction) with full TCO (licences and credits, implementation, data remediation, change management, run and governance costs, error costs).',
    'Copilot Studio agents used by Microsoft 365 Copilot-licensed employees under their own identity are covered by that licence; external or unauthenticated use consumes Copilot Credits.',
    'Build, buy or extend: start with prebuilt agents, extend Copilot or Dynamics 365 when you need your own knowledge and actions, build custom only for differentiation or hard constraints.',
  ],
  flashcards: [
    { front: 'List the CAF AI adoption steps in order.', back: 'AI Strategy, AI Plan, AI Ready, then AI Govern, Secure and Manage.' },
    { front: 'What principle does CAF give for choosing between Copilot Studio, Foundry and Azure infrastructure?', back: 'Choose the option that meets requirements with the least operational responsibility; more customisation means more skills and ownership.' },
    { front: 'Which CAF step classifies use cases as individual work versus business automation and assesses skills?', back: 'AI Plan.' },
    { front: 'Name four roles CAF recommends on an AI CoE team.', back: 'Business leaders, senior data scientists, machine learning engineers, AI governance experts, AI security specialists, AI operations professionals (any four).' },
    { front: 'Where should an AI CoE usually sit organisationally?', back: 'Inside an existing Cloud Center of Excellence, building on current teams; standalone only if existing teams cannot support AI or critical risks exist.' },
    { front: 'How should the CoE operating model change over time?', back: 'Centralised early to consolidate expertise, then advisory as adoption matures.' },
    { front: 'What tool estimates Copilot Studio consumption for an ROI model?', back: 'The Microsoft Copilot Studio agent usage estimator (agent type, traffic, orchestration, knowledge, tools).' },
    { front: 'When is employee use of a Copilot Studio agent not billed in Copilot Credits?', back: 'When the user holds a Microsoft 365 Copilot licence and the agent runs under that authenticated user\'s identity.' },
    { front: 'Define build, buy and extend in the Microsoft AI context.', back: 'Buy: prebuilt Microsoft or partner agents. Extend: add knowledge and actions to Microsoft 365 Copilot or Dynamics 365 Copilot (declarative agents, Copilot Studio). Build: custom engine or Foundry agents and custom models.' },
    { front: 'What is the difference between an AI council and an AI CoE?', back: 'The council is the cross-functional oversight and decision body; the CoE is the expert team that defines standards, runs pilots and operates AI.' },
  ],
  quiz: [
    {
      question:
        'An organisation has provisioned Microsoft Foundry capacity and started three agent prototypes, but has no documented business outcomes, no responsible AI policy and no agreed success metrics. According to the Cloud Adoption Framework, what should the architect do FIRST?',
      options: [
        'Move the prototypes into an Azure landing zone',
        'Complete the AI Strategy step: define outcomes, decision rights and an AI charter with executive leadership',
        'Set up Application Insights monitoring for the prototypes',
        'Purchase additional Copilot Studio Copilot Credits',
      ],
      correct: [1],
      explanation:
        'CAF starts with strategy (outcomes, charter, governance decisions). Landing zones belong to AI Ready, monitoring to Manage, and buying capacity before use cases are classified is the mistake the framework warns against.',
    },
    {
      question:
        'A retailer with a mature Cloud Center of Excellence wants to create an AI Center of Excellence. Which approach aligns with Microsoft guidance?',
      options: [
        'Create a standalone AI team reporting to marketing to move quickly',
        'Integrate AI expertise and practices into the existing Cloud Center of Excellence with a dedicated AI CoE leader and executive sponsor',
        'Outsource the CoE entirely to a partner',
        'Assign CoE duties to each business unit independently',
      ],
      correct: [1],
      explanation:
        'CAF recommends building on the existing CCoE, with a dedicated leader and sponsorship. Standalone teams are for cases where existing teams cannot support AI; fragmentation across business units is what the CoE exists to prevent.',
    },
    {
      question:
        'Which TWO items must be included in the total cost of ownership for a customer-facing Copilot Studio agent? (Select two)',
      options: [
        'Copilot Credits consumed by unauthenticated interactions',
        'Ongoing knowledge-source maintenance and evaluation effort',
        'Microsoft 365 Copilot licences for every external customer',
        'Azure Virtual Machine costs for hosting the Copilot Studio runtime',
      ],
      correct: [0, 1],
      explanation:
        'External use consumes Copilot Credits, and run costs such as knowledge upkeep and evaluation are real TCO. Customers do not need Microsoft 365 Copilot licences, and Copilot Studio is SaaS with no customer-managed VMs.',
    },
    {
      question:
        'A company needs an agent that qualifies inbound leads, researches them and sends outreach emails from Dynamics 365 Sales. A prebuilt agent meets the functional requirement. Which sourcing decision is MOST appropriate?',
      options: [
        'Build a custom engine agent in Foundry for maximum control',
        'Buy: configure the prebuilt Sales Qualification Agent',
        'Extend Microsoft 365 Copilot with a declarative agent that calls the Sales API',
        'Build a Copilot Studio agent from scratch with custom topics',
      ],
      correct: [1],
      explanation:
        'When a prebuilt agent covers the requirement, buy delivers fastest with least operational responsibility. Building or extending adds cost without differentiation.',
    },
    {
      question:
        'Who, according to CAF, is responsible for identifying relevant use cases and available data and evaluating a model\'s business effectiveness inside the AI CoE?',
      options: ['Business leaders on the CoE', 'The AI security specialist', 'The executive sponsor alone', 'The AI operations engineer'],
      correct: [0],
      explanation:
        'CAF assigns use-case identification, data availability and effectiveness evaluation to business leaders, while technical experts handle data management and model design. Sponsors fund and authorise; security and operations have other remits.',
    },
    {
      question:
        'An ROI model for an internal HR agent assumes every interaction will be billed in Copilot Credits, making the case negative. All users already hold Microsoft 365 Copilot licences and the agent will authenticate them with Entra ID. What is the correct adjustment?',
      options: [
        'Keep the model; Copilot Credits apply to all Copilot Studio agents',
        'Treat the employee-facing, authenticated usage as covered by the Microsoft 365 Copilot licence rather than billed credits',
        'Replace the agent with a Foundry hosted agent to avoid credits',
        'Remove authentication so the agent becomes free',
      ],
      correct: [1],
      explanation:
        'Employee-facing Copilot Studio agents used under a Microsoft 365 Copilot-licensed user\'s identity are included in that licence (subject to fair use). Foundry has its own consumption costs, and removing authentication would actually make interactions billable and insecure.',
    },
  ],
  statements: [
    { text: 'CAF recommends preparing the landing zone (AI Ready) before defining the AI strategy.', isTrue: false, explanation: 'Strategy comes first, then Plan, then Ready.' },
    { text: 'The Microsoft AI decision tree points individual-productivity use cases to Microsoft 365 Copilot and business-automation use cases to Copilot Studio or Foundry.', isTrue: true, explanation: 'It separates enhancing individual efficiency from automating business functionality.' },
    { text: 'An AI CoE should normally start in an advisory role and centralise later.', isTrue: false, explanation: 'CAF recommends centralising early and moving to advisory as maturity grows.' },
    { text: 'Executive sponsorship is a prerequisite for an effective AI CoE.', isTrue: true, explanation: 'Without it the CoE cannot enforce standards or secure budget.' },
    { text: 'Total cost of ownership for an agent includes data remediation, change management and ongoing evaluation, not just licences.', isTrue: true, explanation: 'Run and governance costs are part of TCO.' },
    { text: 'Extending Microsoft 365 Copilot with a declarative agent is an example of the build option.', isTrue: false, explanation: 'It is the extend option; build means custom engine agents or custom models.' },
    { text: 'The Copilot Studio agent usage estimator helps forecast Copilot Credit consumption for a value case.', isTrue: true, explanation: 'It models agent type, traffic, orchestration, knowledge and tools.' },
  ],
  resources: [
    { label: 'Cloud Adoption Framework: AI adoption overview and decision tree', url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/ai/' },
    { label: 'Build an AI Center of Excellence', url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/ai/center-of-excellence' },
    { label: 'Copilot Studio billing rates and Copilot Credits', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management' },
    { label: 'Compare declarative and custom engine agents (build, buy, extend)', url: 'https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agents-overview' },
  ],
};

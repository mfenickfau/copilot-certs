import type { Concept } from '../../types';

export const responsibleAiGovernanceAndAiCouncil: Concept = {
  id: 'responsible-ai-governance-and-ai-council',
  title: 'Responsible AI, Governance Principles and the AI Council',
  summary:
    'Why responsible AI is a leadership obligation rather than a compliance checkbox, Microsoft\'s six responsible AI principles and how to check a solution against them, how to establish governance principles and policies for AI use, and how to stand up an AI council or Center of Excellence that gives strategy, oversight and cross-functional alignment.',
  certs: ['ab-731', 'ab-900', 'ab-620', 'ab-100'],
  domains: ['ab-731-3', 'ab-900-2', 'ab-620-1', 'ab-100-3'],
  outcomes: ['ab-731-3-1-1', 'ab-731-3-1-2', 'ab-731-3-1-3', 'ab-731-3-1-4', 'ab-900-2-2-4', 'ab-620-1-1-4', 'ab-100-3-4-5'],
  tags: ['responsible-ai', 'governance', 'ai-council', 'center-of-excellence', 'fairness', 'transparency', 'accountability'],
  difficulty: 'foundations',
  diagram: 'responsible-ai-principles',
  sections: [
    {
      heading: 'Why responsible AI matters to the business',
      body: `Responsible AI is the practice of designing, deploying and operating AI so that it is trustworthy: it treats people fairly, works reliably and safely, protects privacy and security, includes everyone, explains itself, and has humans answerable for it. For a leader it matters for four hard-edged reasons:

- **Trust drives adoption.** Employees will not use, and customers will not accept, AI they believe is biased, leaky or unaccountable. Adoption programmes stall on trust before they stall on features.
- **Regulation is arriving.** Laws such as the EU AI Act, sector rules in finance and health, and privacy regimes impose obligations on how AI is risk-assessed, documented and overseen. Responsible AI practices are how an organisation demonstrates compliance.
- **Harm is expensive.** A discriminatory hiring summary, a fabricated figure in a filing, a leaked record or an agent acting outside its mandate creates legal, financial and reputational cost that dwarfs the savings.
- **Microsoft's platform assumes it.** Content filtering, prompt defenses, groundedness checks, transparency notes and the Responsible AI Standard are built into Copilot and Foundry, but the organisation still owns how it uses them.

The exam frames responsible AI as something a leader **establishes and ensures**, not something the vendor supplies. Expect questions about who owns oversight, which principle a scenario violates, and what a governance body should do first.`,
    },
    {
      heading: 'The six principles and how to check a solution against them',
      body: `Microsoft's six responsible AI principles are the vocabulary the exam uses. For each, know what it means and what "ensuring" it looks like in practice:

| Principle | Meaning | How a leader ensures it |
|---|---|---|
| **Fairness** | AI treats all people equitably; outcomes do not favour or disadvantage groups | Representative data, fairness testing across groups, review of consequential decisions |
| **Reliability and safety** | AI performs consistently as intended, including in unexpected conditions, and fails safely | Evaluation sets, pilots, monitoring, fallbacks and human escalation, content safety |
| **Privacy and security** | Personal and business data is protected and used only as intended | Permissions, labels, DLP, Enterprise Data Protection, residency, least privilege, agent identities |
| **Inclusiveness** | AI empowers everyone, including people with disabilities and different languages or contexts | Accessibility, multilingual support, diverse user testing |
| **Transparency** | People understand that AI is involved, what it can and cannot do, and how outputs were produced | Disclosure, citations, transparency notes, documentation of limitations, explainable decisions |
| **Accountability** | Humans remain answerable for AI systems and their outcomes | Named owners, review boards, audit trails, impact assessments, escalation paths |

A practical **responsible AI review** for any new solution asks: Who could be harmed and how? Is the data representative? How is quality measured before and after launch? What does the user see about AI involvement? What happens when it is wrong, and who is accountable? Where is the human in the loop for consequential decisions? These questions map one-to-one onto the principles.

In Microsoft products, the principles show up as product features: content filters and prompt shields (reliability and safety), Purview controls (privacy and security), citations and the AI disclaimer (transparency), the Copilot Control System and audit logs (accountability), and the Responsible AI dashboard in Azure Machine Learning for fairness and error analysis of custom models.`,
    },
    {
      heading: 'Establishing governance principles and policies',
      body: `Governance turns principles into decisions people can follow. Microsoft's Cloud Adoption Framework guidance for governing AI recommends that organisations:

1. **Assess AI risks** for each use case: integration risks, data risks, model risks, and the consequences of error, scaled by how consequential the decision is.
2. **Define policies** in named areas: selecting and onboarding models; using third-party AI tools and data (including shadow AI); maintaining and monitoring models; regulatory compliance; user conduct (what employees may and may not put into AI, how they verify outputs); and AI integration or replacement of existing processes.
3. **Enforce policies** through platform controls rather than memos: Copilot Control System settings, Purview DLP for AI, Entra Conditional Access, Azure Policy and Foundry content filters, Power Platform environment and connector policies, spending limits.
4. **Monitor** usage, risk and cost continuously, with regular risk evaluation, independent review, and consistent reporting to leadership.

A good **AI usage policy** for employees is short and specific: approved tools and accounts (work sign-in only), prohibited inputs (customer secrets into unapproved tools), verification duties (check citations, human review for external or consequential outputs), disclosure expectations, and how to report a problem. Microsoft's Copilot onboarding experience can link to it so every user sees it.

Governance should be **proportionate**: a drafting assistant for internal memos needs light controls; an agent that approves refunds needs an impact assessment, named owner, audit trail and human checkpoint. Over-governing low-risk use is one of the most common barriers to adoption, so the governance body's job includes saying "yes, with these guardrails" quickly.`,
    },
    {
      heading: 'The AI council: strategy, oversight and cross-functional alignment',
      body: `An **AI council** (Microsoft's Cloud Adoption Framework calls the fuller form an **AI Center of Excellence**) is the cross-functional body that owns AI strategy and governance. Its purpose is to prevent fragmented, ungoverned adoption while accelerating valuable use. Establishing one involves:

- **Executive sponsorship.** A senior sponsor provides budget, authority and credibility, and the council reports to the executive team on a regular cadence.
- **A named leader** who is the single point of accountability for AI strategy and implementation.
- **Cross-functional membership.** Business unit leaders (who know the processes and own the use cases), IT and security, data and privacy, legal and compliance, HR and change management, and technical AI experts. Diversity of function is the point: no single team can see all the risks or all the value.
- **Clear responsibilities.** Define the AI strategy and prioritise use cases against business goals; set responsible AI and governance policies and standards; run an intake and prioritisation process for proposals; sponsor pilots that prove value; develop skills and reusable assets; measure and report adoption and impact; and, optionally, operate shared AI services.
- **Placement and operating model.** Build on existing bodies (a Cloud Center of Excellence, a data governance board) rather than creating a silo. Early in the journey the council is **centralised** to set foundations; as adoption matures it shifts to an **advisory** model that sets guardrails and lets product teams deliver, to avoid becoming a bottleneck.

The council is also where **cross-functional alignment** happens: finance agrees on how value is measured, legal on what disclosures are required, HR on how roles change, security on which controls are non-negotiable, and business leaders on which processes go first. Without it, each department buys its own tools, duplicates work, and leaves gaps that regulators and attackers find.

Exam scenarios typically describe fragmented adoption (three departments, three tools, no shared policy) and ask for the first step: establish an executive-sponsored, cross-functional AI council with a charter and intake process. Distractors propose a single technical fix (a DLP policy, a licence change) that does not address ownership.`,
    },
  ],
  examples: [
    {
      title: 'Three departments, three chatbots, no owner (a realistic mistake)',
      description:
        'Marketing bought an external AI writing tool, customer service built a Copilot Studio agent, and finance was piloting a Foundry model, each with different data rules and no shared policy. An auditor asked who was accountable for AI decisions and nobody could answer. The CIO proposed a DLP policy; the CFO proposed cancelling two of the three. The fix that worked was an executive-sponsored AI council with representatives from each function, a one-page AI usage policy, an intake process for new use cases, and an inventory of all AI in use, after which the tools were rationalised deliberately.',
      takeaway: 'Fragmented adoption is an ownership problem first; a cross-functional AI council with sponsorship and a charter is the structural fix.',
    },
    {
      title: 'The hiring assistant and fairness',
      description:
        'A recruiting team wants an AI to rank CVs. The AI council\'s responsible AI review asks who could be harmed: candidates from under-represented groups if the training examples reflect past hiring. The council approves a narrower scope (summarising CVs against stated criteria, no ranking), requires fairness testing on anonymised historical data, mandates disclosure to candidates, and keeps a recruiter accountable for every shortlist decision.',
      takeaway: 'Fairness, transparency and accountability are ensured by scoping, testing, disclosure and a named human owner, not by trusting the model.',
    },
    {
      title: 'Proportionate governance unlocks adoption',
      description:
        'A council initially required a full impact assessment for every Copilot use case, and adoption stalled. It introduced a tiered model: low-risk internal productivity needs only the usage policy and training; medium-risk agents need an owner, knowledge-source review and monitoring; high-risk decisions affecting customers or employees need an impact assessment, human checkpoint and audit trail. Approvals for low-risk use dropped from weeks to days.',
      takeaway: 'Governance must be proportionate to risk; over-governing low-risk use is itself a barrier to value.',
    },
    {
      title: 'Transparency in customer service',
      description:
        'A utility deploys a service agent on its website. The council requires that the agent identify itself as AI, cite the policy document behind each answer, offer a human hand-off at any point, and log interactions for audit. Complaints about "being misled by a bot" that had hit a competitor never materialise, and the logs later help resolve a billing dispute.',
      takeaway: 'Transparency and accountability features (disclosure, citations, escalation, logs) protect customers and the organisation at once.',
    },
  ],
  keyPoints: [
    'Responsible AI matters because trust drives adoption, regulation demands it, harm is expensive and the platform assumes the organisation owns how it uses the controls.',
    'Microsoft\'s six principles: fairness, reliability and safety, privacy and security, inclusiveness, transparency, accountability.',
    'Ensure the principles with representative data and fairness testing, evaluation and monitoring with fallbacks, permissions and DLP, accessibility, disclosure and citations, and named owners with audit trails.',
    'Governance follows assess risks, define policies (models, third-party tools, monitoring, compliance, user conduct, integration), enforce through platform controls, and monitor with reporting and independent review.',
    'An AI usage policy for employees is short and specific: approved tools, prohibited inputs, verification duties, disclosure and reporting.',
    'An AI council or Center of Excellence needs executive sponsorship, a named leader, cross-functional members and clear responsibilities for strategy, policy, intake, pilots, skills and measurement.',
    'Start centralised to set foundations, then move to an advisory model; keep governance proportionate so low-risk use is approved quickly.',
  ],
  flashcards: [
    { front: 'List Microsoft\'s six responsible AI principles.', back: 'Fairness, reliability and safety, privacy and security, inclusiveness, transparency, accountability.' },
    { front: 'What does the fairness principle require in practice?', back: 'Representative data, testing outcomes across groups, and human review of consequential decisions so no group is favoured or disadvantaged.' },
    { front: 'What does transparency look like in a deployed AI solution?', back: 'Disclosure that AI is involved, citations or explanations for outputs, documentation of capabilities and limitations.' },
    { front: 'How is accountability ensured for AI systems?', back: 'Named human owners, review boards, audit trails, impact assessments and escalation paths; humans remain answerable for outcomes.' },
    { front: 'Name four policy areas in Microsoft\'s AI governance guidance.', back: 'Selecting and onboarding models; third-party tools and data; maintaining and monitoring models; regulatory compliance (also user conduct and AI integration or replacement).' },
    { front: 'What should an employee AI usage policy contain?', back: 'Approved tools and accounts, prohibited inputs, verification duties, disclosure expectations and how to report problems.' },
    { front: 'What is an AI council or AI Center of Excellence?', back: 'An executive-sponsored, cross-functional body that owns AI strategy, governance policy, use-case intake, pilots, skills and measurement to prevent fragmented adoption.' },
    { front: 'Who should sit on an AI council?', back: 'Business unit leaders, IT and security, data and privacy, legal and compliance, HR and change management, and technical AI experts, under an executive sponsor and a named leader.' },
    { front: 'How should an AI council evolve as adoption matures?', back: 'From centralised control that sets foundations to an advisory model that sets guardrails and lets product teams deliver.' },
    { front: 'Why should AI governance be proportionate?', back: 'Over-governing low-risk use blocks adoption and value; controls should scale with the consequence of the decision the AI influences.' },
  ],
  quiz: [
    {
      question:
        'Marketing, finance and customer service have each adopted different AI tools with no shared policy, and an auditor asks who is accountable for AI decisions. What should leadership do FIRST?',
      options: [
        'Configure a Purview DLP policy for AI interactions',
        'Establish an executive-sponsored, cross-functional AI council with a charter, usage policy and intake process',
        'Cancel two of the three tools to simplify',
        'Purchase Microsoft 365 Copilot licences for all staff',
      ],
      correct: [1],
      explanation:
        'The gap is ownership and alignment, which a council addresses. DLP is one control the council would mandate, cancelling tools without a strategy is arbitrary, and buying licences does not create accountability.',
    },
    {
      question:
        'A recruiting AI consistently scores candidates from one demographic lower. Which responsible AI principle is MOST directly at stake, and what ensures it?',
      options: [
        'Transparency, ensured by publishing the model name',
        'Fairness, ensured by representative data, testing outcomes across groups and human review of decisions',
        'Inclusiveness, ensured by adding a screen reader',
        'Reliability, ensured by increasing the model size',
      ],
      correct: [1],
      explanation:
        'Unequal outcomes across groups is a fairness failure addressed by data, testing and review. Publishing a model name does not fix outcomes, accessibility is a different principle, and model size does not address bias.',
    },
    {
      question: 'Which TWO are responsibilities Microsoft\'s guidance assigns to an AI Center of Excellence or council? (Select two)',
      options: [
        'Define the AI strategy and prioritise use cases against business goals',
        'Create an intake and prioritisation process for AI project requests',
        'Write all production code for every AI solution in the organisation',
        'Approve each employee\'s individual Copilot prompts before they are sent',
      ],
      correct: [0, 1],
      explanation:
        'Strategy and intake are core council responsibilities. The council sets standards and guardrails; it does not build every solution or review individual prompts, which would make it a bottleneck.',
    },
    {
      question: 'A customer-service agent on a public website answers billing questions. Which set of features BEST satisfies the transparency and accountability principles?',
      options: [
        'Hide that the assistant is AI so customers trust it more',
        'Identify the agent as AI, cite the policy document behind each answer, offer a human hand-off and log interactions for audit',
        'Use the largest available model',
        'Disable logging to protect customer privacy',
      ],
      correct: [1],
      explanation:
        'Disclosure, citations, escalation and audit logs implement transparency and accountability. Hiding AI involvement violates transparency, model size is unrelated, and disabling logs removes accountability (privacy is handled by retention and access controls, not by not logging).',
    },
    {
      question: 'Adoption of low-risk Copilot use cases has stalled because every request requires a full impact assessment. What should the AI council change?',
      options: [
        'Remove all governance requirements',
        'Introduce a risk-tiered model where low-risk productivity use needs only the usage policy and training, while high-risk decisions keep full assessments and human checkpoints',
        'Require impact assessments for personal use of Copilot too',
        'Outsource all AI approvals to the vendor',
      ],
      correct: [1],
      explanation:
        'Proportionate, tiered governance keeps controls where risk is while unblocking low-risk value. Removing governance or outsourcing it abandons accountability, and extending assessments makes the problem worse.',
    },
    {
      question: 'Which action enforces an AI governance policy rather than merely documenting it?',
      options: [
        'Emailing the policy to all staff',
        'Configuring Copilot Control System settings, Purview DLP for AI and spending limits that implement the policy',
        'Adding the policy to the intranet',
        'Asking managers to remind their teams quarterly',
      ],
      correct: [1],
      explanation:
        'Microsoft\'s guidance is to enforce policies through platform controls. Emails, intranet pages and reminders communicate policy but do not enforce it.',
    },
  ],
  statements: [
    { text: 'Microsoft\'s responsible AI principles include fairness, reliability and safety, privacy and security, inclusiveness, transparency and accountability.', isTrue: true, explanation: 'These six principles are the standard vocabulary across Microsoft exams.' },
    { text: 'Because Microsoft builds responsible AI controls into Copilot, customers have no responsible AI obligations of their own.', isTrue: false, explanation: 'The platform supplies controls; the organisation owns how it uses AI, its data, its decisions and its accountability.' },
    { text: 'An AI council should include business, IT, security, legal, privacy and HR representatives, not only technical experts.', isTrue: true, explanation: 'Cross-functional membership is how the council sees all the risks and all the value.' },
    { text: 'The best governance applies the same heavyweight approval process to every AI use case regardless of risk.', isTrue: false, explanation: 'Governance should be proportionate; uniform heavy process blocks low-risk value.' },
    { text: 'Transparency means users know AI is involved and can see how outputs were produced, for example through citations.', isTrue: true, explanation: 'Disclosure and explainability are the practical forms of transparency.' },
    { text: 'As AI adoption matures, Microsoft recommends the AI Center of Excellence become more centralised and control all delivery.', isTrue: false, explanation: 'The recommendation is the reverse: move from centralised control to an advisory model that sets guardrails.' },
    { text: 'Policies are enforced most effectively through platform controls such as DLP, Conditional Access and admin settings.', isTrue: true, explanation: 'Controls make policy real; documents alone do not.' },
  ],
  resources: [
    { label: 'What is Responsible AI? (Azure Machine Learning)', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/concept-responsible-ai' },
    { label: 'Govern AI (Cloud Adoption Framework)', url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/ai/govern' },
    { label: 'Build an AI Center of Excellence (Cloud Adoption Framework)', url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/ai/center-of-excellence' },
    { label: 'Embrace responsible AI principles and practices (Microsoft Learn module)', url: 'https://learn.microsoft.com/en-us/training/modules/embrace-responsible-ai-principles-practices/' },
  ],
};

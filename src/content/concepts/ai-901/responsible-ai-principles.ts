import type { Concept } from '../../types';

export const responsibleAiPrinciples: Concept = {
  id: 'responsible-ai-principles',
  title: 'The Six Principles of Responsible AI',
  summary:
    'Microsoft builds and governs AI against six principles: fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability. Learn what each one means in practice, which Foundry controls support it, and how the exam disguises a principle inside a scenario.',
  certs: ['ai-901', 'ab-900', 'ab-731'],
  domains: ['ai-901-1', 'ab-900-2', 'ab-731-3'],
  outcomes: [
    'ai-901-1-1-1',
    'ai-901-1-1-2',
    'ai-901-1-1-3',
    'ai-901-1-1-4',
    'ai-901-1-1-5',
    'ai-901-1-1-6',
    'ab-900-2-2-4',
    'ab-731-3-1-4',
  ],
  tags: ['responsible-ai', 'fairness', 'transparency', 'accountability', 'content-safety', 'foundations'],
  difficulty: 'foundations',
  diagram: 'responsible-ai-principles',
  sections: [
    {
      heading: 'Why the principles exist, and how Microsoft applies them',
      body: `An AI system is the sum of hundreds of design decisions: what data to train on, what the model is allowed to say, who can see its outputs, and who is answerable when it is wrong. **Responsible AI** is the discipline of making those decisions deliberately so that the system is safe, trustworthy and beneficial. Microsoft formalised its approach in the **Responsible AI Standard**, an internal policy framework built on six principles:

1. **Fairness**
2. **Reliability and safety**
3. **Privacy and security**
4. **Inclusiveness**
5. **Transparency**
6. **Accountability**

In Microsoft Foundry the Standard shows up as a repeating pattern: **discover** risks (red-teaming, adversarial testing, evaluations), **protect** against them (content filters, guardrails, prompt shields), and **govern** the system in production (tracing, monitoring, Defender alerts, approval workflows). You do not need to memorise the product list for AI-901, but you must be able to look at a scenario and name the principle in play. The six principles overlap on purpose: a model that leaks medical records is a privacy failure *and* a safety failure. When a question offers two defensible answers, pick the principle the scenario emphasises most directly, which is usually signalled by a keyword such as "treat equally", "unexpected input", "personal data", "accessible", "explain" or "who is responsible".`,
    },
    {
      heading: 'Fairness, reliability and safety, privacy and security',
      body: `**Fairness** means the system treats all people equitably and does not advantage or disadvantage similar groups differently. The classic exam setting is a model that scores loan applications, ranks job candidates or recommends medical treatment. Fairness considerations include: checking whether training data under-represents a group, measuring outcomes across sensitive attributes (gender, age, ethnicity, disability), and avoiding proxies that encode bias (a postcode standing in for ethnicity). Fairness is not "treat everyone identically regardless of context"; it is "do not let irrelevant characteristics change the outcome".

**Reliability and safety** means the system performs consistently as designed, handles unexpected conditions gracefully and resists harmful manipulation. Considerations: test across the full range of real-world inputs rather than only the happy path; define what the system should do when confidence is low (refuse, escalate to a human, ask for clarification); monitor for drift after release; and in generative systems, filter harmful output and defend against jailbreak and prompt-injection attacks. An autonomous vehicle, a medical triage bot and a chatbot that confidently invents a refund policy are all reliability-and-safety scenarios.

**Privacy and security** means personal and business data is protected throughout the lifecycle: collection, training, inference and logging. Considerations: collect only data you need, obtain consent, anonymise or detect and redact PII, encrypt in transit and at rest, apply role-based access, and never let prompts or outputs leak data to people who should not see it. In Foundry, Microsoft Entra ID authentication, managed identities (rather than keys in code), network isolation and the rule that your prompts are not used to train the foundation models all serve this principle.`,
    },
    {
      heading: 'Inclusiveness, transparency, accountability',
      body: `**Inclusiveness** means AI should empower everyone and engage people of all abilities, backgrounds and languages. Considerations: accessibility (alt text, captions, voice interfaces, screen-reader friendly outputs), language coverage, cultural context, and designing with, not just for, under-served communities. A speech system that only recognises one accent, or an image-generation tool that never depicts people with disabilities, fails inclusiveness. Note the difference from fairness: fairness is about *equal outcomes for similar cases*; inclusiveness is about *who can use the system at all*.

**Transparency** means people understand how the system works, what it can and cannot do, and when they are interacting with AI. Two parts matter: **interpretability** (why did the model make this decision: feature importance, explanations, citations in a RAG answer) and **disclosure** (telling users that content is AI-generated, publishing a transparency note, documenting limitations in a model card). A bank that cannot explain why a customer was refused credit, or a chatbot that pretends to be a human agent, fails transparency. Foundry supports this with model cards in the model catalog, content credentials on generated images, and tracing that shows which tools and sources an agent used.

**Accountability** means people, not algorithms, are answerable for the system. Considerations: a named owner for each AI system, governance and review processes before deployment, the ability for humans to override or appeal decisions, audit logs, and meeting legal and regulatory standards. If the question asks "who is responsible when the agent makes a bad decision?" or describes an oversight board, approval workflow or audit trail, the answer is accountability.`,
    },
    {
      heading: 'The exam angle',
      body: `AI-901 does not ask you to recite the list. It describes a situation and asks which principle is being honoured or violated, or which consideration you should address first. Patterns to recognise:

| Scenario clue | Principle |
|---|---|
| Model recommends different treatments for identical symptoms depending on ethnicity | Fairness |
| Chatbot gives a confident wrong answer; robot behaves unpredictably on unseen input | Reliability and safety |
| Training data contains customer records that were never consented for AI use | Privacy and security |
| Voice assistant cannot understand speakers with a speech impairment | Inclusiveness |
| Users do not know the summary was AI-generated; loan decision cannot be explained | Transparency |
| Nobody owns the model; no appeals process; no audit trail | Accountability |

Watch for distractors that are *product features* rather than principles (a content filter is a control that supports reliability and safety; it is not itself a principle) and for distractors that name a plausible but secondary principle. Also expect the reverse question: "Which action best supports transparency?" where the correct answer is something like "publish the limitations of the model and tell users when they are talking to AI", not "encrypt the data" (privacy) or "add a human approval step" (accountability).`,
    },
  ],
  examples: [
    {
      title: 'The hiring model that learned the past',
      description:
        'A recruiter trains a model on ten years of hiring decisions to rank CVs. Because the historical data favoured one university and one gender, the model does the same, and candidates from other backgrounds are consistently ranked lower for identical qualifications. Nothing in the code mentions gender; the bias arrived through the data. The fix is to evaluate outcomes across groups, remove or de-weight proxy features and, if needed, rebalance the training set.',
      takeaway: 'Fairness problems usually come from data and proxies, not from explicit rules, so you have to measure outcomes per group to find them.',
    },
    {
      title: 'Shipping without a low-confidence path (a realistic mistake)',
      description:
        'A team deploys a document-classification agent that routes incoming invoices. It was tested only on clean PDFs. In production it receives photographed receipts, rotated scans and emails with no attachment, and silently routes them to the wrong queue. The team assumed "it works in the playground" meant "it is reliable". The fix is to test the full range of realistic inputs, return a confidence score, send low-confidence items to a human review queue and monitor error rates after release.',
      takeaway: 'Reliability and safety means defining what happens on unexpected input, not just confirming the happy path works.',
    },
    {
      title: 'Explaining a credit decision',
      description:
        'A bank uses a model to approve or decline credit. Regulators ask how a specific decision was made. The team adds model interpretability (which features drove this prediction), a plain-language explanation for the customer, a disclosure that an automated system was involved, and an appeals route to a human. Interpretability and disclosure serve transparency; the appeals route and named owner serve accountability.',
      takeaway: 'Transparency is about understanding and disclosure; accountability is about who answers for the outcome. Scenarios often need both.',
    },
    {
      title: 'Leaving keys in the notebook',
      description:
        'A developer pastes a Foundry resource key into a shared notebook and commits it to the team repository so colleagues can "just run it". Anyone with repository access can now call the model and read any data the app retrieves. The fix is to authenticate with Microsoft Entra ID (DefaultAzureCredential and a managed identity in Azure) or at minimum keep keys in Azure Key Vault and environment variables, and to rotate the exposed key.',
      language: 'python',
      code: `# Wrong: a key in source control exposes the resource to everyone with repo access
client = AIProjectClient(endpoint=ENDPOINT, credential=AzureKeyCredential("3f9c...REAL-KEY"))

# Right: identity-based auth, no secret in code
from azure.identity import DefaultAzureCredential
client = AIProjectClient(endpoint=ENDPOINT, credential=DefaultAzureCredential())`,
      takeaway: 'Privacy and security covers how the solution itself is secured, not only how training data is handled.',
    },
  ],
  keyPoints: [
    'The six principles are fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability.',
    'Fairness: similar cases get similar outcomes; watch for biased training data and proxy features.',
    'Reliability and safety: consistent behaviour, graceful handling of unexpected input, resistance to manipulation, monitoring after release.',
    'Privacy and security: consent, minimisation, PII detection, encryption, identity-based access, prompts not used to train foundation models.',
    'Inclusiveness: accessibility and language coverage so everyone can use the system, not only equal outcomes for those who can.',
    'Transparency: interpretability (why this decision) plus disclosure (this is AI, these are its limits); accountability: named humans, oversight, audit and appeal.',
    'Microsoft operationalises the principles as discover, protect and govern; in Foundry that means evaluations, content filters and guardrails, and tracing and monitoring.',
    'Exam questions hide the principle in a scenario; match the keyword (treat equally, unexpected input, personal data, accessible, explain, who is responsible).',
  ],
  flashcards: [
    { front: 'List Microsoft\'s six responsible AI principles.', back: 'Fairness; reliability and safety; privacy and security; inclusiveness; transparency; accountability.' },
    { front: 'A model recommends different loan terms to applicants with identical finances but different ethnicities. Which principle is violated?', back: 'Fairness.' },
    { front: 'What is the difference between fairness and inclusiveness?', back: 'Fairness: similar cases receive similar outcomes without bias. Inclusiveness: the system is usable by and empowers people of all abilities, languages and backgrounds.' },
    { front: 'Which principle covers a chatbot that answers confidently but incorrectly, or a system that behaves unpredictably on unseen input?', back: 'Reliability and safety.' },
    { front: 'Name two parts of transparency.', back: 'Interpretability (explaining how and why the system produced a result) and disclosure (telling people they are interacting with AI and what its limitations are).' },
    { front: 'Which principle is about humans being answerable for an AI system, with oversight, audit trails and appeals?', back: 'Accountability.' },
    { front: 'How does Microsoft operationalise responsible AI in Foundry?', back: 'A discover, protect, govern pattern: evaluations and red-teaming to find risks, content filters and guardrails to protect, tracing and monitoring to govern.' },
    { front: 'Is a content filter a responsible AI principle?', back: 'No. It is a control that supports the reliability and safety principle.' },
    { front: 'Which principle does authenticating with Microsoft Entra ID instead of embedding API keys serve?', back: 'Privacy and security.' },
    { front: 'A voice assistant cannot understand users with a speech impairment. Which principle?', back: 'Inclusiveness.' },
  ],
  quiz: [
    {
      question:
        'A hospital deploys a model that suggests treatment plans. Analysis shows patients with identical symptoms receive different recommendations depending on their ethnicity. Which responsible AI principle is MOST directly violated?',
      options: ['Transparency', 'Fairness', 'Accountability', 'Privacy and security'],
      correct: [1],
      explanation:
        'Treating similar cases differently based on an irrelevant characteristic is a fairness failure. Transparency concerns explainability and disclosure, accountability concerns ownership and oversight, and privacy concerns data protection.',
    },
    {
      question:
        'A customer-service chatbot occasionally invents refund policies that do not exist and states them confidently. The team wants to address this before launch. Which principle should guide their work?',
      options: ['Inclusiveness', 'Reliability and safety', 'Accountability', 'Fairness'],
      correct: [1],
      explanation:
        'Fabricated, confident answers are a reliability and safety problem: the system is not behaving as designed. Grounding, evaluation and a low-confidence fallback are the typical mitigations. The other principles do not address output correctness.',
    },
    {
      question:
        'Which TWO actions BEST support the transparency principle for a generative AI application? (Select two)',
      options: [
        'Tell users clearly when content was generated by AI and document the system\'s limitations.',
        'Encrypt all stored prompts and responses at rest.',
        'Include citations so users can see which sources grounded an answer.',
        'Assign a named business owner who approves each release.',
      ],
      correct: [0, 2],
      explanation:
        'Disclosure and citations help people understand what the system did and how. Encryption serves privacy and security; a named approving owner serves accountability.',
    },
    {
      question:
        'An organisation discovers that nobody can say who approved the deployment of an AI pricing model, there is no audit log of its decisions and customers have no way to challenge a price. Which principle is lacking?',
      options: ['Accountability', 'Inclusiveness', 'Reliability and safety', 'Transparency'],
      correct: [0],
      explanation:
        'Ownership, oversight, auditability and appeal routes are the hallmarks of accountability. Transparency would be the closest distractor but it concerns explaining how decisions are made, not who is answerable for them.',
    },
    {
      question:
        'A team is building an image-captioning feature for a public website. Which consideration MOST directly relates to the inclusiveness principle?',
      options: [
        'Ensuring the captions work as alt text for screen-reader users and cover multiple languages.',
        'Ensuring the model does not retain uploaded images after processing.',
        'Ensuring the captions carry a label stating they were generated by AI.',
        'Ensuring the same image produces the same caption each time.',
      ],
      correct: [0],
      explanation:
        'Accessibility and language coverage make the feature usable by everyone, which is inclusiveness. Not retaining images is privacy, labelling is transparency, and consistency is reliability.',
    },
    {
      question:
        'A developer wants a model to make exactly the same decision for two applicants whose only difference is their postcode, after noticing postcode correlates strongly with ethnicity in the training data. Which principle is the developer applying?',
      options: ['Privacy and security', 'Fairness', 'Transparency', 'Reliability and safety'],
      correct: [1],
      explanation:
        'Removing a proxy feature so that an irrelevant protected characteristic cannot influence the outcome is a fairness mitigation. It does not concern data protection, explanation or robustness to unexpected inputs.',
    },
  ],
  statements: [
    { text: 'Microsoft\'s responsible AI principles are fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability.', isTrue: true, explanation: 'These six principles underpin the Microsoft Responsible AI Standard.' },
    { text: 'Fairness means an AI system must give every user exactly the same output regardless of their input.', isTrue: false, explanation: 'Fairness means similar cases get similar outcomes and irrelevant characteristics do not change the result; different inputs can legitimately produce different outputs.' },
    { text: 'Content filters and prompt shields in Foundry are controls that support the reliability and safety principle.', isTrue: true, explanation: 'They block harmful output and resist manipulation; they are controls, not principles in themselves.' },
    { text: 'Transparency is satisfied as long as the model\'s source code is published.', isTrue: false, explanation: 'Transparency means people can understand the system\'s behaviour and limitations and know when AI is involved; code alone does not explain decisions to users.' },
    { text: 'Accountability requires that humans remain answerable for an AI system, with oversight, audit and the ability to appeal decisions.', isTrue: true, explanation: 'Accountability puts people, not algorithms, in charge of outcomes.' },
    { text: 'Inclusiveness is only about supporting many spoken languages.', isTrue: false, explanation: 'Inclusiveness covers accessibility for people of all abilities and backgrounds, of which language is one dimension.' },
    { text: 'Using Microsoft Entra ID authentication instead of API keys in code supports the privacy and security principle.', isTrue: true, explanation: 'Identity-based access reduces the risk of leaked credentials and unauthorised data access.' },
  ],
  resources: [
    { label: 'What is Responsible AI? (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/concept-responsible-ai' },
    { label: 'Responsible AI for Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-use-of-ai-overview' },
    { label: 'Embrace responsible AI principles and practices (training module)', url: 'https://learn.microsoft.com/en-us/training/modules/embrace-responsible-ai-principles-practices/' },
    { label: 'Study guide for Exam AI-901', url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-901' },
  ],
};

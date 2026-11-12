import type { Concept } from '../../types';

export const foundryToolsForBusinessLeaders: Concept = {
  id: 'foundry-tools-for-business-leaders',
  title: 'Microsoft Foundry and Foundry Tools: Capabilities, Model Choice and Business Fit',
  summary:
    'What Microsoft Foundry and Foundry Tools (formerly Azure AI services) offer a business: the model catalog, Foundry Agent Service, Azure AI Search, Azure Vision, Speech, Language, Document Intelligence and Content Safety; how to match a model to a business need; where these tools fit against Copilot; and the scalability and security benefits of building on Azure.',
  certs: ['ab-731', 'ai-901'],
  domains: ['ab-731-2', 'ai-901-1'],
  outcomes: ['ab-731-2-2-1', 'ab-731-2-2-2', 'ab-731-2-2-3', 'ab-731-2-2-4', 'ai-901-1-3-1', 'ai-901-1-2-2'],
  tags: ['microsoft-foundry', 'foundry-tools', 'azure-ai-search', 'azure-vision', 'model-catalog', 'agent-service'],
  difficulty: 'intermediate',
  diagram: 'foundry-agent-stack',
  sections: [
    {
      heading: 'What Microsoft Foundry is',
      body: `**Microsoft Foundry** (formerly Azure AI Foundry) is Microsoft's platform for building, running and governing AI applications and agents on Azure. Where Microsoft 365 Copilot is a finished product and Copilot Studio is a low-code builder inside the Microsoft 365 boundary, Foundry is where an organisation builds its **own** AI solutions: a customer-facing assistant, a document-processing pipeline, an industry-specific agent, a product feature.

Foundry unifies three things under one Azure resource with shared identity, networking and policy:

- **Models.** A catalog of more than ten thousand models from Microsoft, OpenAI, Anthropic, Meta, Mistral and others, deployed as serverless APIs or on managed compute, with deployment types (Global, Data Zone, regional; Standard, Provisioned, Batch) that trade cost against residency and predictability. A **model router** can send each request to the most suitable model.
- **Agents.** **Foundry Agent Service** hosts agents that pair a model with instructions and tools. *Prompt agents* are declarative (configure instructions, model and tools; Foundry hosts and runs them); *hosted agents* run your own code or framework (Microsoft Agent Framework, Semantic Kernel, LangGraph) with managed scaling, identity and observability. Voice-based agents support spoken experiences.
- **Tools and knowledge.** Built-in tools, memory and retrieval (including Azure AI Search), connectors and MCP servers extend what agents can do.

Around them sits the **enterprise platform**: observability (tracing, evaluations, monitoring dashboards), governance and security (Entra identity, role-based access control, content filters, network isolation, Azure Policy), and a single management plane. For a leader, Foundry is the answer when the question is "we need to build something Copilot and Copilot Studio cannot be configured to do, and we accept owning it."`,
    },
    {
      heading: 'Foundry Tools: the prebuilt AI services',
      body: `**Foundry Tools** is the current name for the family formerly called Azure AI services (and before that Cognitive Services): prebuilt, API-accessible AI capabilities you call without training anything, with optional customisation on your own data. The exam names three explicitly and expects you to map business processes to the set:

| Tool | What it does | Typical business process |
|---|---|---|
| **Azure Vision** (Vision in Foundry Tools) | Image analysis, optical character recognition for printed and handwritten text, Face detection and recognition, Custom Vision for your own image categories | Reading meter photos, inspecting products for defects, digital asset management, identity verification |
| **Azure AI Search** | Enterprise search with keyword, vector and hybrid retrieval, security trimming and indexing pipelines; the standard retrieval layer for RAG | Grounding assistants on documents, knowledge-base search, product catalog search |
| **Document Intelligence** | Extracts fields, tables and text from invoices, receipts, IDs, contracts and custom forms | Accounts-payable automation, onboarding, claims intake |
| **Speech** | Speech to text, text to speech, translation, speaker recognition | Call-centre transcription, voice assistants, accessibility |
| **Language** | Sentiment, key phrases, entity recognition, summarisation, question answering, conversational language understanding | Review analysis, ticket routing, compliance monitoring |
| **Translator** | Text translation across more than 100 languages | Multilingual support and content |
| **Content Understanding** | Multimodal extraction and comprehension across documents, images, audio and video | Media and meeting analysis |
| **Content Safety** | Detects harmful content and prompt-injection attempts (prompt shields) | Protecting any generative AI app |
| **Azure Machine Learning** | Train, deploy and manage custom machine learning models | Forecasting, scoring, anomaly detection |

Many tools offer a free tier for trials, run as containers on premises when data cannot leave a site, and are billed per transaction with commitment tiers available for several of them. The pattern for leaders: before building a generative solution, check whether a prebuilt Foundry Tool already solves the sub-problem (reading the document, transcribing the call, finding the right passage) more cheaply and reliably than a language model would.`,
    },
    {
      heading: 'Matching a model to a business need',
      body: `Choosing a model is a business decision about quality, cost, speed, modality and control. A leader does not need to know model names, but should know the dimensions and the trade-offs:

- **Task and modality.** Text generation and chat for drafting and Q&A; **reasoning** models for multi-step analysis, planning and complex decisions; **multimodal** models for images, audio or video input; **image generation** models for creative content; **embedding** models to power vector search in RAG; speech and vision services for perception tasks.
- **Size and cost.** Frontier models deliver the best quality at the highest per-token price and latency; **small language models** such as Phi are cheaper and faster for narrow, high-volume tasks and can run on devices or at the edge. Routing simple requests to small models and hard ones to large models is the main cost lever.
- **Customisation.** Prompting and grounding first; **fine-tuning** when you need consistent style or format at scale or want a small model to match a large one on a narrow task; custom ML when the problem is prediction from structured data.
- **Governance and provenance.** Models sold directly by Azure come with Microsoft's terms, SLAs and content filtering; open-weight models give flexibility and portability but shift responsibility for evaluation and safety; industry-specific models may suit regulated domains.
- **Deployment constraints.** Residency (Data Zone or regional), latency and throughput guarantees (provisioned), or cost for bulk asynchronous work (batch).

A good matching process is: define the task and quality bar, shortlist models by capability, evaluate them on your own test set in Foundry's evaluation tooling, then pick the cheapest that passes and set up monitoring. Foundry's model leaderboards and benchmarks help shortlist; your own evaluation decides.

Exam cue words: "lowest cost at very high volume for a simple classification" (small model), "complex multi-step financial analysis" (reasoning model), "describe the contents of uploaded photos" (multimodal or Vision), "must run on factory devices offline" (small model or container), "our own brand voice in every output" (fine-tuning).`,
    },
    {
      heading: 'Business fit, scalability and security benefits',
      body: `**When Foundry is the right layer.** Use Microsoft 365 Copilot for employee productivity over Microsoft 365 data. Use Copilot Studio when business users can build the agent and it lives inside Microsoft's orchestration. Use Foundry and Foundry Tools when you need: your own choice of model; custom orchestration and code; an external audience or embedding in your product; processing of images, speech or documents at scale; custom machine learning; or integration into existing Azure applications and data. Common patterns include a customer-facing assistant grounded on product documentation (Azure AI Search plus a chat model), an intelligent document pipeline (Document Intelligence plus Language), a call-centre analytics stack (Speech plus Language), and industry agents built on Foundry Agent Service.

**Scalability.** Foundry runs on Azure's global infrastructure: serverless model endpoints scale with demand, provisioned throughput reserves capacity for predictable load, batch processing handles bulk work cheaply, and Global deployments route to available regions. You pay for what you use and can move between models as better ones appear without rebuilding the application.

**Security and compliance.** Entra identity and role-based access control, managed identities for agents, private networking, customer-managed keys, content filtering by default, and Azure's compliance portfolio (ISO, SOC, FedRAMP, HIPAA BAA and more) apply to every project. Prompts and responses sent to Foundry models are not used to train the models, and data residency is controlled through deployment type and region. Observability (tracing, evaluation and monitoring) gives the evidence that governance teams need.

**Responsibility.** The flip side of flexibility is ownership: your team evaluates, secures, monitors and pays for what it builds. That is why the build-buy-extend ladder puts Foundry last and why an AI Center of Excellence usually sets standards for which models and patterns teams may use.`,
    },
  ],
  examples: [
    {
      title: 'Accounts payable without a language model',
      description:
        'A finance shared-services centre receives 60,000 supplier invoices a month in a dozen layouts. The first proposal is a generative AI assistant to "read" them. The AI Center of Excellence instead recommends Document Intelligence to extract vendor, amount, date and line items with confidence scores, routed to a human only when confidence is low, and Language to classify disputes from the email text. Cost per invoice is a fraction of an LLM approach and accuracy is higher.',
      takeaway: 'Prebuilt Foundry Tools often beat generative models on cost and reliability for perception and extraction tasks.',
    },
    {
      title: 'The frontier model on the vending-machine problem (a realistic mistake)',
      description:
        'A retailer builds a Foundry app that classifies 2 million customer reviews a month into five categories and starts with the most capable reasoning model. Quality is excellent and the bill is startling. Evaluation on a test set shows a small language model reaches the same accuracy on this narrow task. Switching to the small model, with the frontier model reserved for the few ambiguous reviews via a model router, cuts cost by an order of magnitude.',
      takeaway: 'Match the model to the task\'s difficulty and volume; evaluate on your own data and route, rather than defaulting to the largest model.',
    },
    {
      title: 'Grounded customer assistant on the website',
      description:
        'A software company wants a support assistant on its public site that answers from 5,000 help articles with citations and hands off to a human when unsure. Internal Copilot cannot serve the public. The team indexes the articles in Azure AI Search with hybrid retrieval, builds a prompt agent in Foundry Agent Service with content filters and prompt shields, evaluates groundedness on real tickets, and deploys with a Data Zone deployment to meet residency rules.',
      takeaway: 'External audience plus own content plus citations is the archetypal Foundry pattern: Azure AI Search for retrieval, Agent Service for orchestration, content safety for protection.',
    },
    {
      title: 'Vision on the factory floor',
      description:
        'A manufacturer photographs every finished unit and wants defects flagged before shipping. Custom Vision in Azure Vision is trained on labelled images of good and defective units, deployed as a container on the plant\'s edge servers so inspection continues when the internet is down, and the results feed a Power BI quality dashboard.',
      takeaway: 'Azure Vision handles perception tasks, customisable on your images and deployable on premises when connectivity or data rules require.',
    },
  ],
  keyPoints: [
    'Microsoft Foundry is the platform for building your own AI apps and agents on Azure: model catalog, Foundry Agent Service (prompt and hosted agents), tools and knowledge, with observability, governance and one management plane.',
    'Foundry Tools (formerly Azure AI services) are prebuilt APIs: Azure Vision (image analysis, OCR, Face, Custom Vision), Azure AI Search, Document Intelligence, Speech, Language, Translator, Content Understanding, Content Safety, plus Azure Machine Learning for custom ML.',
    'Azure AI Search is the standard retrieval layer for RAG with keyword, vector and hybrid search and security trimming.',
    'Match models by task and modality, size and cost, customisation need, governance and deployment constraints; evaluate on your own test set and pick the cheapest model that passes, using a router where volume justifies it.',
    'Use Copilot for employee productivity, Copilot Studio for low-code agents inside Microsoft 365, and Foundry when you need own models, custom orchestration, external audiences, perception at scale or custom ML.',
    'Scalability comes from serverless endpoints, provisioned throughput, batch processing and global infrastructure; security from Entra RBAC, managed identities, private networking, content filtering and Azure compliance certifications.',
    'Flexibility brings ownership: teams building on Foundry evaluate, secure, monitor and pay for their solutions, which is why Foundry sits last on the buy, extend, build ladder.',
  ],
  flashcards: [
    { front: 'What is Microsoft Foundry?', back: 'Microsoft\'s Azure platform (formerly Azure AI Foundry) for building, running and governing AI apps and agents: model catalog, Foundry Agent Service, tools, observability and governance under one resource.' },
    { front: 'What were Foundry Tools previously called?', back: 'Azure AI services (and earlier Cognitive Services): prebuilt AI APIs such as Vision, Speech, Language, Document Intelligence, Translator, Content Safety and Azure AI Search.' },
    { front: 'What does Azure Vision in Foundry Tools do?', back: 'Image analysis, optical character recognition for printed and handwritten text, Face detection and recognition, and Custom Vision for your own image categories.' },
    { front: 'What role does Azure AI Search play in generative AI solutions?', back: 'The retrieval layer for RAG: indexes content with keyword, vector and hybrid search and security trimming so models answer from permitted, relevant passages.' },
    { front: 'What is Foundry Agent Service?', back: 'The Foundry capability that hosts agents: declarative prompt agents (model plus instructions plus tools, Foundry-hosted) and hosted agents running your own code or framework.' },
    { front: 'When is a small language model the right match?', back: 'Narrow, high-volume or latency- and cost-sensitive tasks, or on-device and edge scenarios, where it meets the quality bar on your evaluation set.' },
    { front: 'When is a reasoning model the right match?', back: 'Complex, multi-step analysis, planning and decision tasks where deeper reasoning justifies higher cost and latency.' },
    { front: 'Which Foundry Tool extracts fields from invoices and forms?', back: 'Document Intelligence.' },
    { front: 'Name three security features Foundry provides to every project.', back: 'Entra identity with role-based access control, content filtering by default, private networking (also managed identities, customer-managed keys and Azure compliance certifications).' },
    { front: 'How does Foundry support scalability?', back: 'Serverless endpoints that scale with demand, provisioned throughput for predictable load, batch processing for bulk work and global deployments across Azure regions.' },
  ],
  quiz: [
    {
      question:
        'A logistics company receives 50,000 scanned delivery notes a month in varied layouts and needs the consignment number, date and signature status extracted into its ERP. Which Foundry Tool is the MOST appropriate starting point?',
      options: [
        'Azure AI Search',
        'Document Intelligence',
        'Speech',
        'Translator',
      ],
      correct: [1],
      explanation:
        'Document Intelligence extracts fields from documents and forms. Azure AI Search indexes content for retrieval, Speech handles audio, and Translator converts languages.',
    },
    {
      question:
        'A software vendor wants a support assistant on its public website that answers from thousands of help articles with citations. Internal Microsoft 365 Copilot cannot serve external customers. Which TWO components form the core of the solution? (Select two)',
      options: [
        'Azure AI Search to index and retrieve relevant help articles with hybrid search',
        'Foundry Agent Service to host the agent with a chat model, instructions and content safety',
        'Copilot in Excel to analyse the help articles',
        'The Researcher agent in Copilot Chat',
      ],
      correct: [0, 1],
      explanation:
        'Retrieval over the articles plus a hosted, protected agent is the pattern. Copilot in Excel and Researcher are employee-facing Microsoft 365 experiences and cannot serve a public website.',
    },
    {
      question:
        'A retailer classifies two million short customer reviews a month into five categories. Evaluation shows a small language model matches a frontier model\'s accuracy on this task. Which choice BEST balances quality and cost?',
      options: [
        'Use the frontier model for every review to be safe',
        'Use the small model, routing only ambiguous reviews to the frontier model',
        'Fine-tune the frontier model on the reviews',
        'Use a speech-to-text model',
      ],
      correct: [1],
      explanation:
        'When a small model passes the quality bar, it is the economical choice, with a router sending hard cases to a larger model. Using the frontier model everywhere wastes money, fine-tuning it adds cost without need, and speech-to-text is irrelevant to text classification.',
    },
    {
      question: 'A manufacturer needs defect detection from photos on factory edge servers that must keep working during internet outages. Which approach fits?',
      options: [
        'Custom Vision in Azure Vision, trained on labelled images and deployed as an on-premises container',
        'Microsoft 365 Copilot in PowerPoint',
        'A cloud-only reasoning model called for every image',
        'Azure AI Search over the image files',
      ],
      correct: [0],
      explanation:
        'Custom Vision learns your categories and Foundry Tools containers run on premises. Copilot in PowerPoint is a productivity tool, a cloud-only model fails offline, and search does not classify defects.',
    },
    {
      question: 'Which statement BEST describes when a business should build on Microsoft Foundry rather than use Microsoft 365 Copilot or Copilot Studio?',
      options: [
        'Whenever employees need help drafting documents in Word',
        'When the solution needs its own choice of model, custom orchestration, an external audience, perception at scale or custom machine learning, and the organisation accepts owning it',
        'Whenever a Copilot licence is too expensive',
        'When business users want to build an agent without code inside Teams',
      ],
      correct: [1],
      explanation:
        'Foundry is for building your own solutions with the responsibilities that follow. Word drafting is Copilot, licence price alone is not a reason to build, and no-code agents in Teams are Copilot Studio.',
    },
    {
      question: 'A CIO asks what security and scalability benefits Foundry brings compared with a start-up\'s standalone AI API. Which answer is MOST accurate?',
      options: [
        'Foundry has no content filtering, so teams must build their own',
        'Foundry provides Entra identity and role-based access, content filtering by default, private networking, Azure compliance certifications, and elastic serverless, provisioned and batch capacity',
        'Foundry models are trained on customer prompts to improve over time',
        'Foundry can only be deployed in a single region',
      ],
      correct: [1],
      explanation:
        'Those are the platform benefits. Content filtering is on by default, customer prompts are not used to train the models, and Foundry supports global, data-zone and regional deployments.',
    },
  ],
  statements: [
    { text: 'Microsoft Foundry was formerly known as Azure AI Foundry.', isTrue: true, explanation: 'The platform was renamed; it remains the Azure platform for building AI apps and agents.' },
    { text: 'Foundry Tools require you to train a model before you can use them.', isTrue: false, explanation: 'They are prebuilt APIs usable out of the box, with optional customisation on your own data.' },
    { text: 'Azure AI Search supports vector and hybrid retrieval and is commonly used as the retrieval layer for RAG.', isTrue: true, explanation: 'Keyword plus vector search with security trimming makes it the standard grounding layer.' },
    { text: 'The largest available model is always the best choice for a production workload.', isTrue: false, explanation: 'Model choice balances quality, cost, latency and modality; a smaller model that passes evaluation is often the better business decision.' },
    { text: 'Azure Vision in Foundry Tools can extract printed and handwritten text from images.', isTrue: true, explanation: 'Optical character recognition is one of its core capabilities.' },
    { text: 'Prompts and responses sent to models in Microsoft Foundry are used to train those models.', isTrue: false, explanation: 'Customer data is not used to train the foundation models.' },
    { text: 'Building on Foundry means the organisation takes on responsibility for evaluating, securing and monitoring its solution.', isTrue: true, explanation: 'Flexibility comes with ownership, which is why Foundry sits last on the buy, extend, build ladder.' },
  ],
  resources: [
    { label: 'What is Microsoft Foundry?', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/what-is-foundry' },
    { label: 'What are Foundry Tools?', url: 'https://learn.microsoft.com/en-us/azure/ai-services/what-are-ai-services' },
    { label: 'What is Azure Vision?', url: 'https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview' },
    { label: 'What is Azure AI Search?', url: 'https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search' },
  ],
};

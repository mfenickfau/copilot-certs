import type { Concept } from '../../types';

export const aiWorkloadsAndScenarios: Concept = {
  id: 'ai-workloads-and-scenarios',
  title: 'AI Workloads: Matching a Business Scenario to the Right Capability',
  summary:
    'The map of common AI workloads the exam expects you to recognise on sight: generative AI, agentic AI, text analysis, speech, computer vision and information extraction. For each one, the telltale scenario, the Foundry capability that delivers it, and the neighbouring workload the distractors will name instead.',
  certs: ['ai-901'],
  domains: ['ai-901-1'],
  outcomes: ['ai-901-1-3-1', 'ai-901-1-2-2'],
  tags: ['ai-workloads', 'generative-ai', 'agents', 'nlp', 'speech', 'computer-vision', 'information-extraction', 'foundations'],
  difficulty: 'foundations',
  diagram: 'agentic-loop',
  sections: [
    {
      heading: 'The six workloads and what they look like in practice',
      body: `A **workload** is a category of problem that AI solves. AI-901 groups them into six, and every scenario question is really asking "which workload is this, and which Foundry capability serves it?"

| Workload | You see this in the scenario | Foundry capability |
|---|---|---|
| **Generative AI** | Create or transform content: draft, summarise, translate, rewrite, answer questions in natural language, write code, generate an image | Foundry Models (GPT, Claude, Llama, Phi, gpt-image), prompts, grounding (RAG) |
| **Agentic AI** | Pursue a goal over several steps, decide which tools to call, act on systems, hold a multi-turn conversation with memory | Foundry Agent Service: prompt agents, hosted agents, tools (file search, code interpreter, web search, MCP, functions) |
| **Text analysis** | Understand text you already have: sentiment, key phrases, named entities, language, PII, summarisation, classification | Azure Language in Foundry Tools, or a language model with a well-designed prompt |
| **Speech** | Audio in or out: transcribe, caption, dictate, read aloud, translate spoken language, voice assistant | Azure Speech in Foundry Tools (speech to text, text to speech, translation), gpt-realtime and gpt-audio multimodal models, Voice Live |
| **Computer vision** | Understand or create images and video: describe a photo, detect objects, read text in an image, moderate images, generate graphics | Vision-enabled multimodal models, Azure Vision in Foundry Tools (OCR, Face, Image Analysis), image-generation models |
| **Information extraction** | Turn unstructured files into structured fields: invoices, forms, contracts, ID cards, call recordings, video footage | Azure Content Understanding in Foundry Tools (prebuilt and custom analyzers for documents, images, audio, video) |

**Foundry Tools** is the current name for what used to be called Azure AI Services: the prebuilt, task-specific services (Language, Speech, Vision, Content Understanding, Translator, Content Safety) that sit beside the general-purpose models in a Foundry resource.`,
    },
    {
      heading: 'Generative versus agentic: the distinction the exam loves',
      body: `Generative AI and agentic AI both use language models, so the exam tests whether you can tell them apart.

A **generative** workload is a single request and response: the user (or your code) sends a prompt, the model returns content, the interaction is complete. The model may be grounded with your documents through retrieval-augmented generation (RAG) and may run inside a chat with history, but it does not decide to *do* anything beyond answering.

An **agentic** workload adds autonomy. An **agent** is a model paired with **instructions** and **tools**, operating in a loop: observe the request and conversation, reason about what is needed, choose and call a tool (search a knowledge base, run code, call an API, query a database), observe the result, and repeat until the goal is met or it needs human input. Signals in a scenario: "books the meeting", "checks three systems and reconciles the figures", "decides which department to route to", "takes action on behalf of the user", "multi-step", "uses tools". Variations include single agents, **multi-agent** systems where a coordinator delegates to specialists, and **voice agents** that converse in real time.

The practical trade-off: agents are more capable and more autonomous, which means they need more governance (tool permissions, approval steps, tracing, evaluation) than a plain generative call. When a scenario only needs a summary or a draft, the plain generative approach is the correct, simpler answer. When it needs the system to act across tools, it is agentic.`,
    },
    {
      heading: 'Prebuilt tool or general-purpose model?',
      body: `Many scenarios can be solved two ways: a prebuilt Foundry Tool or a prompt to a multimodal model. Knowing when to prefer each is itself an exam skill.

Prefer the **prebuilt Foundry Tool** when you need: a predictable, structured output with confidence scores (Content Understanding fields, Language entity categories); coordinates or layout (OCR bounding boxes, document tables); scale and price efficiency for a narrow task (sentiment on ten million reviews); specialised accuracy (speaker diarization, pronunciation assessment, custom speech models for jargon); or a feature only the tool offers (PII redaction categories, text-to-speech neural voices, face detection).

Prefer a **general-purpose or multimodal model** when the task is open-ended or conversational (describe this image in the user's own words, answer follow-up questions about a chart), when the output format is free text, when you want one model to handle text plus image plus audio in a single turn, or when you are prototyping and do not yet know the schema.

In practice the two combine: Content Understanding produces clean markdown and fields from a scanned contract, and an agent reasons over that markdown; Speech transcribes a call, and a language model summarises it. The exam's "MOST appropriate" wording usually rewards the component purpose-built for the described need rather than the most powerful component available.`,
    },
    {
      heading: 'The exam angle',
      body: `Workload-identification questions are among the most frequent items on AI-901. Practise translating verbs into workloads:

- "Generate product descriptions from specifications" → generative AI.
- "Automatically reorder stock after checking inventory, supplier lead times and budget" → agentic AI.
- "Determine whether customer reviews are positive or negative" → text analysis (sentiment).
- "Provide live captions for a webinar" → speech (speech to text).
- "Read the text on photographed street signs" → computer vision (OCR), or a multimodal model for conversational description.
- "Extract the total, date and vendor from thousands of scanned receipts" → information extraction (Content Understanding).
- "Identify the people, organisations and dates mentioned in news articles" → text analysis (named entity recognition).
- "Create an illustration for a blog post" → generative AI (image generation).

The distractors name adjacent workloads: speech for a text-only sentiment task, Content Understanding for a free-form chat, an agent for a one-shot summary. Two more traps: *Azure Machine Learning* (training your own predictive models) is not the answer for any of these prebuilt or generative scenarios, and *Azure AI Search* is a retrieval component for grounding rather than a workload of its own. When a question says "with the least development effort", the prebuilt Foundry Tool or the portal experience is usually the intended answer.`,
    },
  ],
  examples: [
    {
      title: 'One customer-service process, four workloads',
      description:
        'A telecom wants to improve its support line. Calls are transcribed live (speech), the transcript is analysed for sentiment and key phrases to flag angry customers (text analysis), an agent looks up the account, checks outage data and proposes a credit (agentic AI), and a summary email is drafted for the customer (generative AI). Recognising that the process decomposes into separate workloads, each with its own Foundry capability, is exactly what the exam rewards.',
      takeaway: 'Real solutions chain workloads; identify each step\'s workload rather than labelling the whole thing "AI".',
    },
    {
      title: 'Choosing an agent when a prompt would do (a realistic mistake)',
      description:
        'A team is asked to summarise weekly sales reports into three bullet points. They build a Foundry agent with web search and code interpreter tools, then struggle with unpredictable tool calls and cost. The task is a single transformation of provided text: a generative call with a clear system prompt is simpler, cheaper and more consistent. Agents earn their complexity only when the task needs multiple steps, tools or decisions.',
      takeaway: 'If the job is "transform this content once", it is a generative workload; reach for an agent only when autonomy and tools are needed.',
    },
    {
      title: 'Picking the extraction tool for receipts',
      description:
        'An expenses team receives photographed receipts and needs vendor, date, total and tax as structured fields with confidence scores for audit. A multimodal model can describe a receipt, but it returns free text with no confidence or grounding coordinates. Content Understanding\'s prebuilt receipt analyzer returns typed fields, confidence and the source location on the image, which is what a finance audit requires.',
      takeaway: 'When the scenario asks for structured fields and confidence scores from documents, the workload is information extraction and the tool is Content Understanding.',
    },
  ],
  keyPoints: [
    'Six workloads: generative AI, agentic AI, text analysis, speech, computer vision, information extraction.',
    'Generative = one request produces content; agentic = a model with instructions and tools loops through reasoning, tool calls and observations to achieve a goal.',
    'Text analysis covers sentiment, key phrases, entities, language detection, PII and summarisation; speech covers speech to text, text to speech and translation.',
    'Computer vision covers describing, detecting, reading (OCR) and generating images; information extraction turns documents, images, audio and video into structured fields.',
    'Foundry Tools (formerly Azure AI Services) are the prebuilt task services: Language, Speech, Vision, Content Understanding, Translator, Content Safety.',
    'Prefer a prebuilt tool for structured output, confidence scores, coordinates and scale; prefer a multimodal model for open-ended, conversational or mixed-modality tasks.',
    'Distractors name adjacent workloads or heavier solutions; "least effort" usually means the prebuilt tool or portal experience.',
  ],
  flashcards: [
    { front: 'Name the six AI workloads covered by AI-901.', back: 'Generative AI, agentic AI, text analysis, speech, computer vision, information extraction.' },
    { front: 'What distinguishes an agentic workload from a generative one?', back: 'An agent pursues a goal over multiple steps, choosing and calling tools and acting on results; a generative call returns content for a single request.' },
    { front: 'Which workload is "determine whether product reviews are positive or negative"?', back: 'Text analysis (sentiment analysis), typically Azure Language in Foundry Tools.' },
    { front: 'Which workload is "extract vendor, date and total from scanned invoices"?', back: 'Information extraction, using Azure Content Understanding in Foundry Tools.' },
    { front: 'Which workload is "provide live captions for a meeting"?', back: 'Speech (speech to text), using Azure Speech in Foundry Tools.' },
    { front: 'What is Foundry Tools?', back: 'The current name for the prebuilt task services formerly called Azure AI Services: Language, Speech, Vision, Content Understanding, Translator, Content Safety and others.' },
    { front: 'When should you prefer a prebuilt Foundry Tool over a multimodal model?', back: 'When you need structured output, confidence scores, coordinates or layout, scale at low cost, or a specialised feature such as diarization or neural voices.' },
    { front: 'What three things make up an agent?', back: 'A model, instructions, and tools (plus optionally knowledge sources and memory).' },
    { front: 'Which workload is "generate an illustration for a blog post"?', back: 'Generative AI (image generation with a gpt-image series model).' },
  ],
  quiz: [
    {
      question:
        'A retailer wants a system that, when stock runs low, checks supplier lead times, compares prices across three supplier APIs and places an order within budget without human involvement. Which AI workload does this describe?',
      options: ['Text analysis', 'Agentic AI', 'Information extraction', 'Speech'],
      correct: [1],
      explanation:
        'Multi-step goal pursuit with tool calls and actions is agentic AI. Text analysis understands existing text, information extraction structures documents, and speech handles audio.',
    },
    {
      question:
        'A news organisation wants to identify the people, organisations and locations mentioned in thousands of articles each day. Which capability is MOST appropriate?',
      options: ['Azure Speech speech to text', 'Named entity recognition in Azure Language', 'An image-generation model', 'Azure Content Understanding video analyzer'],
      correct: [1],
      explanation:
        'Recognising entities in text is text analysis, served by Azure Language. Speech handles audio, image generation creates pictures, and the video analyzer processes video files.',
    },
    {
      question:
        'An accounts-payable team needs to extract invoice number, due date and line items from scanned PDFs as structured fields with confidence scores. Which workload and capability fit BEST?',
      options: [
        'Generative AI with a chat model and a free-text prompt',
        'Information extraction with Azure Content Understanding',
        'Speech with Azure Speech batch transcription',
        'Computer vision with an image-generation model',
      ],
      correct: [1],
      explanation:
        'Structured fields with confidence from documents is information extraction, which Content Understanding is built for. A chat prompt gives free text without confidence, and speech or image generation do not apply.',
    },
    {
      question: 'Which TWO scenarios are examples of the generative AI workload? (Select two)',
      options: [
        'Drafting a customer email from bullet points',
        'Transcribing a recorded lecture into text',
        'Creating a product image from a text description',
        'Detecting whether a photo contains a safety helmet',
      ],
      correct: [0, 2],
      explanation:
        'Drafting text and creating images produce new content, which is generative. Transcription is speech, and detecting a helmet is computer vision (object detection).',
    },
    {
      question:
        'A team needs to summarise each incoming support ticket into one sentence. Which approach has the LEAST complexity while meeting the need?',
      options: [
        'Build a multi-agent system with web search and code interpreter tools',
        'Send each ticket to a deployed language model with a clear system prompt',
        'Train a custom speech model',
        'Create a custom Content Understanding video analyzer',
      ],
      correct: [1],
      explanation:
        'A single generative call is the simplest fit for a one-shot transformation. Agents add unnecessary autonomy and cost, and speech or video tools do not apply to text tickets.',
    },
    {
      question:
        'A company wants to provide real-time captions and a translated transcript for an all-hands webinar. Which Foundry capability should they use?',
      options: ['Azure Speech in Foundry Tools', 'Azure Content Understanding document analyzer', 'An embedding model', 'Azure Language key phrase extraction'],
      correct: [0],
      explanation:
        'Live captions and spoken translation are speech workloads handled by Azure Speech. Document analyzers process files, embeddings support search, and key phrases analyse text you already have.',
    },
  ],
  statements: [
    { text: 'An agent is a model combined with instructions and tools that can take multiple steps to achieve a goal.', isTrue: true, explanation: 'This is the working definition of agentic AI in Foundry.' },
    { text: 'Summarising a single document with one prompt is an example of agentic AI.', isTrue: false, explanation: 'A single request-response transformation is generative AI; agentic AI involves autonomy, multiple steps and tools.' },
    { text: 'Foundry Tools is the current name for the prebuilt services formerly known as Azure AI Services.', isTrue: true, explanation: 'Language, Speech, Vision, Content Understanding and others are Foundry Tools.' },
    { text: 'Sentiment analysis belongs to the speech workload.', isTrue: false, explanation: 'Sentiment analysis is text analysis; speech concerns converting between audio and text.' },
    { text: 'Content Understanding can extract structured information from documents, images, audio and video.', isTrue: true, explanation: 'It is the multimodal information-extraction service in Foundry Tools.' },
    { text: 'A multimodal model always returns structured fields with confidence scores when shown a document.', isTrue: false, explanation: 'Multimodal models return free text unless prompted for a schema and do not provide grounded confidence scores; Content Understanding does.' },
    { text: 'Azure Machine Learning is the primary service for running prebuilt text analysis in AI-901 scenarios.', isTrue: false, explanation: 'Azure Machine Learning trains custom predictive models; prebuilt text analysis comes from Azure Language in Foundry Tools or a language model.' },
  ],
  resources: [
    { label: 'What is Microsoft Foundry?', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/what-is-foundry' },
    { label: 'What is Microsoft Foundry Agent Service?', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/agents/overview' },
    { label: 'What is Azure Content Understanding in Foundry Tools?', url: 'https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview' },
    { label: 'Study guide for Exam AI-901', url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-901' },
  ],
};

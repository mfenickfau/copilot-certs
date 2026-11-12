import type { Concept } from '../../types';

export const contentUnderstanding: Concept = {
  id: 'content-understanding',
  title: 'Information Extraction with Azure Content Understanding',
  summary:
    'How Azure Content Understanding in Foundry Tools turns documents, images, audio and video into markdown and structured fields through analyzers: the prebuilt analyzers to know, how custom analyzers define a field schema, the asynchronous analyze-then-poll API pattern, and when to choose it over OCR, Speech or a multimodal model.',
  certs: ['ai-901', 'ai-103'],
  domains: ['ai-901-1', 'ai-901-2', 'ai-103-5', 'ai-103-3'],
  outcomes: [
    'ai-901-1-3-5',
    'ai-901-2-4-1',
    'ai-901-2-4-2',
    'ai-901-2-4-3',
    'ai-901-2-4-4',
    'ai-103-5-2-3',
    'ai-103-3-2-5',
  ],
  tags: ['content-understanding', 'information-extraction', 'document-intelligence', 'analyzers', 'ocr', 'multimodal', 'python', 'intermediate'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Techniques for extracting information from text, images, audio and video',
      body: `**Information extraction** turns unstructured content into structured data a process can use. Each modality has its own underlying techniques, and the exam wants you to name them:

- **Text and documents**: **OCR** reads printed and handwritten characters; **layout analysis** recovers paragraphs, headings, tables, selection marks, barcodes and figures; **field extraction** maps content to named fields (InvoiceTotal, DueDate); **classification** decides what kind of document it is so it can be routed; **entity recognition** pulls people, dates and amounts from free text.
- **Images**: OCR for text in photos, **captioning and description**, **object and visual-feature detection**, and schema-based field extraction (for example reading a chart into data points).
- **Audio**: **transcription** (speech to text) with **speaker diarization** and timestamps, then **summarisation**, **sentiment** and **topic extraction** over the transcript.
- **Video**: **keyframe extraction**, **scene or shot segmentation**, transcript of the audio track, **OCR on frames**, and per-segment descriptions.

Historically these needed several services (Document Intelligence, Vision, Speech, Language). **Azure Content Understanding in Foundry Tools** unifies them: one service, one API, one output shape for every modality. It uses generative models under the hood to produce **markdown** content (good for RAG and agents) and **fields** you define (good for automation), with **confidence scores** and **grounding** (where in the source each value came from) so human review can be targeted at low-confidence values only.`,
    },
    {
      heading: 'Analyzers: prebuilt and custom',
      body: `The central concept is the **analyzer**. An analyzer defines how content is processed: the content-extraction settings, the **field schema**, and the model deployments it uses. Once created it behaves identically for every input, which is what makes outputs predictable.

**Prebuilt analyzers** need no configuration:
- Content extraction: \`prebuilt-read\` (OCR and basic text), \`prebuilt-layout\` (text plus structure, tables, figures, annotations), \`prebuilt-digitalParse\` (born-digital files).
- RAG analyzers: \`prebuilt-documentSearch\` (markdown with figure descriptions, summary and chunking), \`prebuilt-imageSearch\` (image description), \`prebuilt-audioSearch\` (transcript, speaker labels, summary), \`prebuilt-videoSearch\` (keyframes, transcript, segment summaries).
- Domain analyzers: invoices, receipts, purchase orders, US tax forms, ID documents, contracts, bank statements, mortgage documents, pay stubs, call-centre recordings and more.
- Base analyzers: \`prebuilt-document\`, \`prebuilt-image\`, \`prebuilt-audio\`, \`prebuilt-video\`, which you inherit from to build your own.

**Custom analyzers** start from a base analyzer and add a **field schema**: each field has a name, a type (string, number, date, boolean, array, object) and a **generation method**: **extract** (copy the value as it appears, with grounding and confidence), **classify** (pick from fixed categories) or **generate** (produce a value such as a summary or an inferred label). You can add a few labelled examples to improve accuracy, enable **segmentation** to split a file into logical parts (several documents in one PDF, scenes in a video) and run **classification** first to route each part to the right analyzer. **Content Understanding Studio** is the full authoring experience (all prebuilt analyzers, custom analyzers, labelling, GA and preview APIs); the **Content Understanding playground** in the Foundry portal offers a subset for quick testing.`,
    },
    {
      heading: 'Building a lightweight extraction app',
      body: `Content Understanding uses an **asynchronous** API pattern because files take time:

1. **POST** to \`{endpoint}/contentunderstanding/analyzers/{analyzerId}:analyze?api-version=2025-11-01\` with either a JSON body listing input URLs or the binary file itself. Authenticate with an Entra ID bearer token (preferred) or the \`Ocp-Apim-Subscription-Key\` header.
2. The service replies **202 Accepted** with an **Operation-Location** header.
3. **GET** that URL every second or two until \`status\` is \`Succeeded\` (or \`Failed\`).
4. Read \`result.contents[]\`: each has \`markdown\` (the full content as text), \`fields\` (your schema, each with \`type\`, a typed value such as \`valueNumber\` or \`valueString\`, \`confidence\`, \`spans\` and \`source\` for grounding) and, for audio and video, transcript phrases, speakers and segments.

The same flow works for a PDF, a JPEG, a WAV or an MP4; only the analyzer changes. In Python you can use \`requests\` directly or the \`azure-ai-contentunderstanding\` client library, which wraps the polling in a \`begin_analyze\` long-running operation. Before the first call, the resource needs **default model deployments** configured (a standard, a mini and an embedding model), which Content Understanding Studio can auto-deploy for you. The GA API version is **2025-11-01**; newer preview versions add features such as agentic document understanding and signature detection.`,
    },
    {
      heading: 'Choosing Content Understanding over the alternatives, and the exam angle',
      body: `Choose **Content Understanding** when the scenario asks for structured fields with confidence and grounding from documents, forms, images, recordings or video; when one pipeline must handle several modalities; when you need clean markdown for RAG ingestion; or when you need to classify and route mixed document batches. Choose **Azure Vision OCR/Read** when you only need raw text with coordinates and nothing else. Choose **Azure Speech** for live or streaming transcription (Content Understanding works on files). Choose a **multimodal chat model** for ad-hoc, conversational questions about one file. Choose **Azure Language** when the input is already text and you need standard NLP outputs.

Exam patterns: "extract total, vendor and line items from invoices with the least effort" (prebuilt-invoice); "a PDF contains several document types that must be routed" (classification plus segmentation); "analyse call recordings for topics and sentiment" (prebuilt-audioSearch or the call-centre analyzer); "produce chapter summaries of training videos" (prebuilt-videoSearch); "ingest scanned manuals into a RAG index preserving tables and describing diagrams" (prebuilt-documentSearch); "define our own fields with examples" (a custom analyzer with a field schema); "which header carries the result URL after the POST?" (Operation-Location); "why is the result not ready right away?" (asynchronous operation, poll until Succeeded). Distractors are the single-modality services and the claim that a chat model gives confidence scores and grounding, which it does not.`,
    },
  ],
  examples: [
    {
      title: 'Analyze an invoice with the prebuilt analyzer (REST from Python)',
      description:
        'The complete asynchronous pattern: submit the file URL to prebuilt-invoice, follow Operation-Location, poll until Succeeded, then read a typed field and its confidence.',
      language: 'python',
      code: `import os, time, requests
from azure.identity import DefaultAzureCredential

endpoint = os.environ["FOUNDRY_ENDPOINT"]           # https://<resource>.services.ai.azure.com
token = DefaultAzureCredential().get_token("https://cognitiveservices.azure.com/.default").token
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

r = requests.post(f"{endpoint}/contentunderstanding/analyzers/prebuilt-invoice:analyze"
                  "?api-version=2025-11-01",
                  headers=headers, json={"inputs": [{"url": "https://contoso.example/inv-100.pdf"}]})
r.raise_for_status()                                # 202 Accepted
op = r.headers["Operation-Location"]

while True:
    res = requests.get(op, headers=headers).json()
    if res["status"] in ("Succeeded", "Failed"):
        break
    time.sleep(1.5)

content = res["result"]["contents"][0]
print(content["markdown"][:200])                    # full text as markdown
total = content["fields"]["AmountDue"]["valueObject"]["Amount"]
print(total["valueNumber"], total["confidence"])    # e.g. 610 0.77 -> route <0.8 to review`,
      takeaway: 'POST analyze, read Operation-Location, poll to Succeeded, then use markdown and typed fields with confidence.',
    },
    {
      title: 'Designing a custom analyzer for safety-inspection photos',
      description:
        'A utility company photographs substations and wants, for each image, whether a warning sign is visible (classify: yes/no), the equipment ID printed on the panel (extract: string) and a one-line condition summary (generate: string). They create a custom analyzer based on prebuilt-image with those three fields and add five labelled example images. Every photo now returns the same three fields with confidence, which a workflow checks before filing the inspection.',
      language: 'json',
      code: `{
  "analyzerId": "substation-inspection",
  "baseAnalyzerId": "prebuilt-image",
  "fieldSchema": {
    "fields": {
      "WarningSignVisible": { "type": "string", "method": "classify", "enum": ["yes", "no"] },
      "EquipmentId":        { "type": "string", "method": "extract" },
      "ConditionSummary":   { "type": "string", "method": "generate",
                              "description": "One sentence on visible wear or damage" }
    }
  }
}`,
      takeaway: 'A custom analyzer = a base analyzer plus a field schema whose fields use extract, classify or generate.',
    },
    {
      title: 'Treating the 202 as the answer (a realistic mistake)',
      description:
        'A developer posts a video to prebuilt-videoSearch, parses the POST response body for the transcript and finds nothing. The POST only acknowledges the job (202 Accepted); the results arrive at the Operation-Location URL once status is Succeeded, which for a long video can take a while. Adding the polling loop (or using the SDK\'s begin_analyze long-running operation) fixes it.',
      takeaway: 'Content Understanding is asynchronous: the POST returns a job, not the result.',
    },
  ],
  keyPoints: [
    'Extraction techniques: OCR, layout analysis, field extraction and classification for documents; description, detection and OCR for images; transcription, diarization and summarisation for audio; keyframes, segmentation and transcripts for video.',
    'Azure Content Understanding in Foundry Tools unifies all four modalities into one API producing markdown plus schema-defined fields with confidence scores and grounding.',
    'An analyzer defines processing: prebuilt (read, layout, documentSearch, imageSearch, audioSearch, videoSearch, invoice and other domain analyzers) or custom (base analyzer plus a field schema).',
    'Custom field methods: extract (verbatim with grounding), classify (fixed categories), generate (new values such as summaries); segmentation and classification route mixed content.',
    'API pattern: POST analyzers/{id}:analyze (202 + Operation-Location) then GET until status Succeeded; GA api-version 2025-11-01; results in result.contents[].markdown and .fields.',
    'Authoring: Content Understanding Studio for full capability, the Foundry portal playground for quick tests; default model deployments must be configured first.',
    'Choose it for structured, confidence-scored extraction across modalities and RAG ingestion; choose OCR for raw text only, Speech for live audio, a chat model for ad-hoc questions, Language for text already in hand.',
  ],
  flashcards: [
    { front: 'What is an analyzer in Content Understanding?', back: 'The configuration that defines how content is processed: extraction settings, field schema and model deployments. Prebuilt analyzers are ready-made; custom analyzers add your own schema to a base analyzer.' },
    { front: 'Name the four base analyzers.', back: 'prebuilt-document, prebuilt-image, prebuilt-audio, prebuilt-video.' },
    { front: 'Which prebuilt analyzer produces markdown with figure descriptions and chunking for RAG ingestion of documents?', back: 'prebuilt-documentSearch.' },
    { front: 'Which prebuilt analyzer transcribes a recording with speaker labels and a summary?', back: 'prebuilt-audioSearch.' },
    { front: 'Which prebuilt analyzer segments a video and describes each segment?', back: 'prebuilt-videoSearch.' },
    { front: 'What are the three field generation methods in a custom analyzer?', back: 'Extract (value as it appears, grounded), classify (choose from fixed categories), generate (produce new content such as a summary).' },
    { front: 'What does the POST analyze call return?', back: '202 Accepted with an Operation-Location header; you poll that URL until status is Succeeded.' },
    { front: 'What two main outputs does each analysed content item contain?', back: 'markdown (the full content as text) and fields (your schema with typed values, confidence and grounding spans/source).' },
    { front: 'What must be configured on the Foundry resource before using Content Understanding?', back: 'Default model deployments (a standard, a mini and an embedding model), which Content Understanding Studio can auto-deploy.' },
    { front: 'Content Understanding vs Azure Speech for audio?', back: 'Content Understanding processes audio files and returns transcript plus fields and summary; Azure Speech handles real-time and streaming transcription and synthesis.' },
    { front: 'What is the GA API version for Content Understanding?', back: '2025-11-01.' },
  ],
  quiz: [
    {
      question:
        'An accounts team receives invoices as PDFs and photos and needs vendor, invoice number, due date and total with confidence scores, with the least development effort. What should they use?',
      options: [
        'The prebuilt-invoice analyzer in Azure Content Understanding',
        'Azure Vision Read OCR followed by regular expressions',
        'A chat model prompted to describe each invoice',
        'Azure Speech batch transcription',
      ],
      correct: [0],
      explanation:
        'The prebuilt invoice analyzer returns typed fields with confidence out of the box. OCR plus regex is brittle and effortful, a chat description lacks confidence and grounding, and Speech is for audio.',
    },
    {
      question:
        'A developer POSTs a video file to the prebuilt-videoSearch analyzer and receives HTTP 202 with an empty body. What should the developer do next?',
      options: [
        'Resend the request with a larger timeout.',
        'Poll the URL in the Operation-Location header until the status is Succeeded.',
        'Switch to the prebuilt-read analyzer.',
        'Convert the video to WAV and retry.',
      ],
      correct: [1],
      explanation:
        'Analysis is asynchronous; 202 means accepted and the results are retrieved from Operation-Location. Resending, changing analyzer or converting formats do not retrieve the result.',
    },
    {
      question:
        'A legal team wants to define its own fields (parties, effective date, governing law) for contracts and improve accuracy with a few labelled examples. What should they create?',
      options: ['A custom analyzer based on prebuilt-document with a field schema', 'A prebuilt-imageSearch analyzer', 'An Azure Speech custom voice', 'An embedding model deployment'],
      correct: [0],
      explanation:
        'Custom analyzers add a field schema and labelled examples to a base analyzer. Image search describes images, custom voice is TTS, and embeddings support search rather than field extraction.',
    },
    {
      question: 'Which TWO outputs does Content Understanding provide for an analysed document? (Select two)',
      options: [
        'A markdown representation of the content',
        'Schema-defined fields with confidence scores and grounding',
        'A synthesised audio narration of the document',
        'A fine-tuned model trained on the document',
      ],
      correct: [0, 1],
      explanation:
        'Markdown and grounded, scored fields are the core outputs. The service does not synthesise speech or fine-tune models.',
    },
    {
      question:
        'A call centre wants topics, sentiment and a summary for each recorded call, processed from stored audio files. Which analyzer is MOST appropriate?',
      options: ['prebuilt-layout', 'prebuilt-audioSearch (or the call-centre analyzer)', 'prebuilt-videoSearch', 'prebuilt-digitalParse'],
      correct: [1],
      explanation:
        'The audio analyzers transcribe, label speakers and summarise recordings. Layout and digitalParse handle documents, and videoSearch targets video.',
    },
    {
      question:
        'A team is ingesting scanned manuals into a RAG index and wants tables preserved and diagrams described in text. Which analyzer should they use?',
      options: ['prebuilt-documentSearch', 'prebuilt-read', 'prebuilt-audio', 'A gpt-image model'],
      correct: [0],
      explanation:
        'prebuilt-documentSearch produces markdown with layout, figure descriptions and chunking for retrieval. prebuilt-read gives basic OCR only, prebuilt-audio is for sound, and gpt-image generates pictures.',
    },
  ],
  statements: [
    { text: 'Azure Content Understanding can process documents, images, audio and video through one API.', isTrue: true, explanation: 'It unifies multimodal extraction in Foundry Tools.' },
    { text: 'The POST analyze request returns the full extraction result synchronously.', isTrue: false, explanation: 'It returns 202 Accepted with an Operation-Location header to poll.' },
    { text: 'Custom analyzers must be derived from one of the four base analyzers.', isTrue: true, explanation: 'prebuilt-document, -image, -audio or -video via baseAnalyzerId.' },
    { text: 'The "generate" field method copies a value exactly as it appears in the source.', isTrue: false, explanation: 'Extract copies verbatim with grounding; generate produces new content such as a summary.' },
    { text: 'Extracted field values include confidence scores and grounding to their location in the source.', isTrue: true, explanation: 'This enables targeted human review of low-confidence values.' },
    { text: 'Content Understanding is the recommended service for live, streaming speech transcription.', isTrue: false, explanation: 'It processes files; Azure Speech handles real-time transcription.' },
    { text: 'prebuilt-documentSearch produces markdown with figure descriptions suitable for RAG ingestion.', isTrue: true, explanation: 'It is the recommended analyzer for document ingestion in RAG workflows.' },
  ],
  resources: [
    { label: 'What is Azure Content Understanding in Foundry Tools?', url: 'https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview' },
    { label: 'Quickstart: Use the Content Understanding REST API', url: 'https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/quickstart/use-rest-api' },
    { label: 'Prebuilt analyzers in Content Understanding', url: 'https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/prebuilt-analyzers' },
    { label: 'Content Understanding Python client library', url: 'https://learn.microsoft.com/en-us/python/api/overview/azure/ai-contentunderstanding-readme' },
  ],
};

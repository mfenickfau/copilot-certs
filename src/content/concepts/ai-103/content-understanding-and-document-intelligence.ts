import type { Concept } from '../../types';

export const contentUnderstandingAndDocumentIntelligence: Concept = {
  id: 'content-understanding-and-document-intelligence',
  title: 'Content Understanding and Document Intelligence: Documents, Images and Video into Structured Output',
  summary:
    'Extracting information with multimodal pipelines that combine OCR, layout analysis and field extraction (Document Intelligence prebuilt and custom models, Content Understanding analyzers), producing clean grounded Markdown and JSON for agents and RAG, implementing custom analyzers with field schemas (extract, classify, generate), configuring single-task versus pro/agentic analysis modes, extracting visual characteristics from images, and analysing video segments with transcripts, key frames and custom fields.',
  certs: ['ai-103', 'ai-901'],
  domains: ['ai-103-3', 'ai-103-5', 'ai-901-2'],
  outcomes: ['ai-103-3-2-5', 'ai-103-3-2-6', 'ai-103-3-2-7', 'ai-103-5-2-1', 'ai-103-5-2-2', 'ai-103-5-2-3', 'ai-901-2-4-1', 'ai-901-2-4-3'],
  tags: ['content-understanding', 'document-intelligence', 'ocr', 'layout', 'field-extraction', 'analyzers', 'markdown', 'video-analysis', 'rag', 'python', 'intermediate'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Two complementary Foundry Tools for documents',
      body: `**Azure Document Intelligence in Foundry Tools** (v4.0 GA, API \`2024-11-30\`; SDK \`azure-ai-documentintelligence\`, \`DocumentIntelligenceClient.begin_analyze_document(model_id, AnalyzeDocumentRequest(url_source=...))\`) provides specialised, deterministic models: **Read** (printed and handwritten text, 300+ languages), **Layout** (text, tables, selection marks, paragraphs, section hierarchy, figures; \`output_content_format="markdown"\` for RAG), **prebuilt** models (invoice, receipt, ID document, contract, bank statement, pay stub, US tax forms, health insurance card and more) that return typed fields with confidence, and **custom** models (template or neural, trained on labelled samples) plus custom classification. It is the right tool for structured, high-volume, latency-sensitive documents with common templates, and it continues unchanged for existing production workloads.

**Azure Content Understanding in Foundry Tools** (GA API \`2025-11-01\`, preview \`2026-06-01-preview\`; SDK \`azure-ai-contentunderstanding\`) is the generative, multimodal superset: one **analyzer** concept across **documents, images, audio and video**, zero-shot **field extraction** from a schema (no labelling needed), **confidence scores and source grounding**, **classification and segmentation** in the same call, Markdown output designed for LLMs, and prebuilt analyzers for RAG (\`prebuilt-documentSearch\`, \`prebuilt-imageSearch\`, \`prebuilt-audioSearch\`, \`prebuilt-videoSearch\`), content extraction (\`prebuilt-read\`, \`prebuilt-layout\`, \`prebuilt-digitalParse\`) and domains (\`prebuilt-invoice\`, \`prebuilt-receipt\`, \`prebuilt-idDocument\`, \`prebuilt-procurement\`, \`prebuilt-tax.us\`...). It needs **model deployments** in your Foundry resource (for example gpt-4.1 / gpt-4.1-mini and text-embedding-3-large, mapped as resource defaults) and Entra ID auth.

Microsoft's decision guide: Document Intelligence for structured templates where consistency, low latency and proven accuracy matter; Content Understanding for unstructured, variable, multimodal content, inferred fields and reasoning; build-your-own with raw LLM prompts only when you need total control and accept writing OCR, grounding and confidence yourself.`,
    },
    {
      heading: 'Multimodal extraction pipelines: OCR, layout, fields, grounded Markdown',
      body: `A document pipeline on the exam has recognisable stages, and Content Understanding performs them inside one analyzer:

1. **Content extraction**: OCR for scanned pages (\`enableOcr\`), layout elements (paragraphs, sections, tables, selection marks, barcodes, formulas as LaTeX), figures with optional **figure descriptions** and **figure analysis** (charts turned into tables, diagrams into Mermaid) via \`enableFigureDescription\` / \`enableFigureAnalysis\`; for audio and video, transcription with diarization and key frames.
2. **Segmentation / classification** (\`contentCategories\`, \`enableSegment\`): classify a file as a whole, or split a multi-document file (loan pack: application, pay slip, statement) and route each segment to the right analyzer; include an \`other\` category.
3. **Field extraction** against a \`fieldSchema\`: each field has a type and a *generation method*: **extract** (verbatim values from the document, documents only), **classify** (one of predefined categories), **generate** (free values such as summaries, scene descriptions, sentiment).
4. **Contextualization**: normalisation, **confidence scores** (0 to 1) and **source grounding** (where in the content each value came from) with \`estimateFieldSourceAndConfidence\`, so straight-through processing can auto-accept high-confidence fields and route the rest to review.
5. **Output**: \`result.contents[0].markdown\` (GitHub-flavoured Markdown with headings, tables, selection marks as ☒/☐, formulas, barcodes and figure links) and \`result.contents[0].fields\` (typed JSON).

That Markdown is the "clean, grounded representation" agents and RAG want: semantically coherent sections for chunking, tables preserved, figure text captured, page and polygon metadata for citations. Azure AI Search's **Content Understanding skill** calls the same service for semantic chunking and image descriptions during indexing, and the **Document Layout skill** does the equivalent with Document Intelligence Layout for existing pipelines. Guardrails on the Foundry model deployments also apply to field generation: flagged content can produce warnings or empty fields while extracted source content is still returned.`,
    },
    {
      heading: 'Implementing analyzers: prebuilt, custom, standard and agentic modes',
      body: `An **analyzer** is a JSON configuration: \`analyzerId\`, \`description\` (the model reads it as context, so make it specific), \`baseAnalyzerId\` (\`prebuilt-document\`, \`prebuilt-image\`, \`prebuilt-audio\`, \`prebuilt-video\`), \`models\` (completion and embedding model *names*, mapped to deployments at resource level), \`config\` (OCR, figures, segmentation, locales, \`returnDetails\`) and \`fieldSchema\`. Create it with \`PUT /contentunderstanding/analyzers/{id}\` or the SDK, then run \`POST /analyzers/{id}:analyze\` (SDK \`begin_analyze(analyzer_id=..., inputs=[AnalysisInput(url=...)])\`), poll the long-running operation, and read the result. Custom analyzers can be improved with labelled training examples; **analyzer templates** in Foundry and Content Understanding Studio give starting points (invoices, call-centre analytics, media tagging).

Modes the exam names:
- **Single-task / standard mode**: one analyzer, one modality, straightforward extraction from a single input; fastest and cheapest. Use a prebuilt analyzer when it fits, a custom schema otherwise.
- **Pro (multi-document reasoning) mode**: analyse several related inputs together and reason across them with reference knowledge (for example reconcile an invoice against its contract, check a mortgage pack for completeness). In the current API this capability is delivered as **agentic mode** (\`"config": {"workflow": "agentic"}\`, preview API) for documents: multistep reasoning, calculations, validation against rules in field descriptions, visual analysis of complex tables, and structured results; higher cost and latency, so reserve it for cases standard extraction cannot answer.
- **Synchronous operations** (preview) for Read and Layout when an interactive app needs an immediate answer.

Field design tips: name fields as business terms, write descriptions as instructions ("total after tax in the document currency"), prefer extract for values that appear verbatim, generate for summaries, classify for routing; set \`estimateFieldSourceAndConfidence\` when you need review workflows; and keep the base analyzer aligned to the modality.`,
    },
    {
      heading: 'Images and video with Content Understanding, and the exam angle',
      body: `**Images**: an image analyzer (\`baseAnalyzerId: prebuilt-image\`) extracts *visual characteristics* into fields: chart type and values from business charts, defects on a production line (classify: scratch, crack, none), shelf inventory counts, brand presence, scene attributes. \`prebuilt-imageSearch\` produces a RAG-ready description. Microsoft notes image analyzers are not optimised for text-heavy images; use a document analyzer for those.

**Video**: \`prebuilt-videoSearch\` (and the base \`prebuilt-video\`) returns Markdown per segment with a WebVTT **transcript** (diarized, multilingual when locale is auto), **key frames**, **shot detection** (\`cameraShotTimesMs\` with \`returnDetails\`), and natural-language segment descriptions; custom video analyzers add fields per segment (brand logos, ad category, sentiment, chapter title) and **segmentation** by your own categories (split a broadcast into news stories; separate ads from gameplay). Output drops straight into a vector store for RAG on video; Content Understanding supports the full Azure Speech language set for transcription. Compare with **Azure AI Video Indexer** for media-library indexing at scale and with a multimodal chat model for ad-hoc questions about a short clip.

**Audio**: \`prebuilt-audioSearch\` and custom audio analyzers give transcripts with speaker roles, summaries, sentiment and topics for call analytics.

Exam framings: "turn scanned contracts into Markdown with tables preserved for RAG" → Content Understanding \`prebuilt-documentSearch\` (or Document Intelligence Layout with markdown output); "extract invoice fields with confidence and route low-confidence ones to review" → \`prebuilt-invoice\` with field confidence and grounding; "a loan file contains several document types" → classification with segmentation then per-category analyzers; "check that an invoice total matches the contract rate card" → agentic (pro) mode; "chapterise lecture videos and extract topics" → custom video analyzer with segmentation; "count products on shelf photos" → image analyzer with generate/extract fields; "existing Form Recognizer pipeline in production" → keep Document Intelligence, no migration required.`,
    },
  ],
  examples: [
    {
      title: 'Grounded Markdown and invoice fields with the Content Understanding SDK',
      description:
        'A back office turns incoming PDFs into Markdown for an agent and, for invoices, extracts typed fields with confidence so anything under 0.8 goes to a reviewer.',
      language: 'python',
      code: `from azure.ai.contentunderstanding import ContentUnderstandingClient
from azure.ai.contentunderstanding.models import AnalysisInput
from azure.identity import DefaultAzureCredential

cu = ContentUnderstandingClient(endpoint="https://contoso.services.ai.azure.com/",
                                credential=DefaultAzureCredential())

# 1. RAG-ready Markdown (sections, tables, figure descriptions)
md = cu.begin_analyze(analyzer_id="prebuilt-documentSearch",
                      inputs=[AnalysisInput(url=pdf_url)]).result()
markdown = md.contents[0].markdown          # feed to chunking / vector index

# 2. Typed fields with confidence and grounding for straight-through processing
inv = cu.begin_analyze(analyzer_id="prebuilt-invoice",
                       inputs=[AnalysisInput(url=pdf_url)]).result()
fields = inv.contents[0].fields
total = fields["InvoiceTotal"]
if (total.confidence or 0) < 0.8:
    send_to_review(pdf_url, field="InvoiceTotal", source=total.source)   # page + polygon
else:
    post_to_erp(total.value)`,
      takeaway: 'One service yields both the LLM-friendly Markdown representation and typed, confidence-scored fields with source grounding for automation.',
    },
    {
      title: 'A custom video analyzer that segments a broadcast and tags brands',
      description:
        'A media company needs each news broadcast split into stories with a title, topics and any visible sponsor logos, ready for a search index.',
      language: 'json',
      code: `{
  "analyzerId": "newsBroadcastAnalyzer",
  "description": "Segment TV news broadcasts into individual stories and tag sponsors.",
  "baseAnalyzerId": "prebuilt-video",
  "models": { "completion": "gpt-4.1" },
  "config": {
    "returnDetails": true,
    "locales": ["en-GB", "es-ES"],
    "enableSegment": true,
    "contentCategories": {
      "story": { "description": "A single news story with one topic" },
      "advert": { "description": "A commercial break" },
      "other": { "description": "Anything else" }
    }
  },
  "fieldSchema": {
    "fields": {
      "title":    { "type": "string", "method": "generate", "description": "Headline for the segment" },
      "topics":   { "type": "array", "method": "generate", "items": { "type": "string" } },
      "sponsors": { "type": "array", "method": "generate",
                    "items": { "type": "string" }, "description": "Brand logos visible on screen" },
      "tone":     { "type": "string", "method": "classify", "enum": ["neutral", "positive", "negative"] }
    }
  }
}`,
      takeaway: 'Video analyzers combine segmentation categories with per-segment generated and classified fields, producing searchable, structured output with transcripts and key frames.',
    },
    {
      title: 'The overkill mode mistake and its fix',
      description:
        'A team configured every receipt through an agentic-mode analyzer "to be safe". Latency tripled and cost rose sharply for simple receipts. They moved receipts to prebuilt-receipt (standard, single-task), kept agentic mode only for the reconciliation step that compares supplier invoices with contract rate cards, and added classification up front to route documents.',
      language: 'json',
      code: `// Only for the reconciliation analyzer (preview API 2026-06-01-preview)
{
  "analyzerId": "invoiceContractReconciliation",
  "description": "Validate each invoice line against the rate card in the attached contract and flag deviations.",
  "baseAnalyzerId": "prebuilt-document",
  "models": { "completion": "gpt-5.2" },
  "config": { "workflow": "agentic" },
  "fieldSchema": {
    "fields": {
      "deviations": { "type": "array", "method": "generate",
        "items": { "type": "object", "properties": {
          "lineItem": { "type": "string" }, "invoicedRate": { "type": "number" },
          "contractRate": { "type": "number" }, "explanation": { "type": "string" } } } },
      "totalsMatch": { "type": "boolean", "method": "generate",
        "description": "True only if the sum of line items equals the stated invoice total" }
    }
  }
}
// Receipts: POST /analyzers/prebuilt-receipt:analyze (standard mode, no custom analyzer)`,
      takeaway: 'Use standard single-task analyzers by default and reserve agentic (pro) mode for cross-document reasoning, calculation and validation.',
    },
  ],
  keyPoints: [
    'Document Intelligence v4.0 (2024-11-30) offers Read, Layout (Markdown output), prebuilt models with typed fields and custom template or neural models; it stays the choice for structured templates, low latency and existing pipelines.',
    'Content Understanding is the multimodal, generative analyzer service (documents, images, audio, video) with zero-shot field extraction, confidence scores, source grounding, classification and segmentation; GA API 2025-11-01, preview 2026-06-01-preview.',
    'Pipeline stages: content extraction (OCR, layout, figures, transcripts), segmentation and classification, field extraction with extract/classify/generate methods, contextualization (confidence, grounding), Markdown plus JSON output.',
    'Analyzers are JSON configurations: analyzerId, description, baseAnalyzerId (prebuilt-document/image/audio/video), models (completion and embedding names), config, fieldSchema; run them with begin_analyze and poll.',
    'prebuilt-documentSearch, imageSearch, audioSearch and videoSearch produce RAG-ready Markdown; domain analyzers such as prebuilt-invoice and prebuilt-procurement return typed fields.',
    'Standard (single-task) mode is the default; agentic/pro mode (config.workflow agentic, preview) adds multistep reasoning, calculation and validation across related documents at higher cost and latency.',
    'Image analyzers extract visual characteristics (charts, defects, shelf counts, brands); video analyzers return segment-level Markdown with WebVTT transcripts, key frames, shot times and custom fields.',
    'Content Understanding requires Foundry model deployments mapped as resource defaults and Entra ID; guardrails on those deployments can suppress field values while returning extracted content with warnings.',
  ],
  flashcards: [
    { front: 'Which Document Intelligence model returns text, tables, selection marks and section structure, optionally as Markdown?', back: 'The Layout model (prebuilt-layout) with output_content_format="markdown".' },
    { front: 'What is the current GA API version of Content Understanding?', back: '2025-11-01 (preview features use 2026-06-01-preview).' },
    { front: 'Name the three field generation methods in a Content Understanding field schema.', back: 'Extract (verbatim values, documents only), classify (predefined categories) and generate (free-form values such as summaries).' },
    { front: 'Which setting enables confidence scores and source grounding for document fields?', back: 'estimateFieldSourceAndConfidence in the analyzer configuration.' },
    { front: 'Which prebuilt analyzer produces RAG-ready Markdown for documents?', back: 'prebuilt-documentSearch (video, audio and image have prebuilt-videoSearch, prebuilt-audioSearch and prebuilt-imageSearch).' },
    { front: 'How do you classify and split a file containing several document types in one call?', back: 'Define contentCategories (including other) and set enableSegment on the analyzer, optionally routing each category to another analyzer.' },
    { front: 'What does agentic mode add over standard document analysis?', back: 'Multistep reasoning across a document or related documents, calculations, validation against field descriptions, visual analysis and structured results; set config.workflow to agentic (preview).' },
    { front: 'What does the prebuilt video analyzer output per segment?', back: 'Markdown with a WebVTT transcript (diarized), key frame thumbnails, a description, and optionally shot times and custom fields.' },
    { front: 'Which Azure AI Search skills integrate these services during indexing?', back: 'The Azure Content Understanding skill (semantic chunking, image descriptions) and the Document Layout skill (Document Intelligence Layout, Markdown sections).' },
    { front: 'What must exist in the Foundry resource before Content Understanding prebuilt analyzers work?', back: 'Deployments of the required completion and embedding models (for example gpt-4.1, gpt-4.1-mini, text-embedding-3-large) mapped as the resource\'s default model deployments.' },
    { front: 'Do existing Document Intelligence production workloads need to migrate to Content Understanding?', back: 'No; APIs, SDKs and billing are unchanged. Content Understanding targets new multimodal, unstructured or reasoning-heavy workloads.' },
  ],
  quiz: [
    {
      question:
        'An insurer receives loan packs as single PDFs containing an application form, pay slips and bank statements. Each type must be extracted with its own schema. Which Content Understanding feature should you configure FIRST?',
      options: [
        'Agentic mode on a single invoice analyzer.',
        'Classification with segmentation (contentCategories and enableSegment) that routes each segment to the matching analyzer.',
        'prebuilt-imageSearch on each page.',
        'A larger completion model deployment.',
      ],
      correct: [1],
      explanation:
        'Classify-segment-analyze splits the pack by document type and routes segments to the right extraction analyzers. Agentic mode is for reasoning, imageSearch is for images, and model size does not split documents.',
    },
    {
      question: 'Which TWO outputs make Content Understanding results directly usable by agents and RAG pipelines? (Select two)',
      options: [
        'GitHub-flavoured Markdown that preserves sections, tables, selection marks and figure descriptions.',
        'Raw pixel arrays of every page.',
        'Typed JSON fields with confidence scores and source grounding.',
        'A compiled binary index.',
      ],
      correct: [0, 2],
      explanation:
        'Markdown feeds chunking and grounding; typed fields with confidence support automation and review. Pixel arrays and binary indexes are not Content Understanding outputs.',
    },
    {
      question:
        'Finance must verify that each supplier invoice line matches the agreed rate in the related contract and explain discrepancies. Standard extraction cannot do this. Which option fits?',
      options: [
        'Document Intelligence prebuilt-invoice.',
        'A Content Understanding document analyzer with config.workflow set to agentic (pro mode) and fields describing the validation.',
        'Azure Vision Read.',
        'prebuilt-videoSearch.',
      ],
      correct: [1],
      explanation:
        'Agentic mode reasons across related documents, performs calculations and validates against field descriptions. prebuilt-invoice extracts but does not reconcile, Read is OCR, and videoSearch is for video.',
    },
    {
      question:
        'A company has a stable, high-volume stream of identical tax forms and needs the lowest latency and proven accuracy. Which service should you recommend?',
      options: [
        'Document Intelligence prebuilt or custom models.',
        'A GPT-5 vision prompt per page.',
        'Content Understanding agentic mode.',
        'Azure AI Video Indexer.',
      ],
      correct: [0],
      explanation:
        'Document Intelligence is purpose-built for structured templates with consistency and low latency. LLM prompts and agentic mode are slower and costlier, and Video Indexer targets media.',
    },
    {
      question: 'A training department wants lecture recordings split into chapters with topic lists and a searchable transcript. What should you build?',
      options: [
        'An image analyzer with prebuilt-image.',
        'A custom video analyzer based on prebuilt-video with segmentation categories and generated fields, producing per-segment Markdown with WebVTT transcripts.',
        'A Document Intelligence custom neural model.',
        'A Translator document translation job.',
      ],
      correct: [1],
      explanation:
        'Video analyzers segment content and extract fields per segment with transcripts and key frames. Image analyzers, document models and translation do not process video structure.',
    },
  ],
  statements: [
    { text: 'Content Understanding field extraction requires labelled training data before it can extract a new schema.', isTrue: false, explanation: 'Field extraction is zero-shot from the schema; labelled examples optionally improve custom analyzers.' },
    { text: 'The extract generation method is supported for documents only.', isTrue: true, explanation: 'Extract returns verbatim values from document content; images, audio and video use classify and generate.' },
    { text: 'Content Understanding analyzers reference model deployment names directly in the models property.', isTrue: false, explanation: 'They reference model names, which the service maps to the deployments configured as resource defaults.' },
    { text: 'Document Intelligence v3.0 reaches end of support on 30 March 2029, and v4.0 is the current GA version.', isTrue: true, explanation: 'Microsoft recommends v4.0 (2024-11-30) for all new development.' },
    { text: 'In Content Understanding Markdown, selection marks are rendered as ☒ and ☐ and formulas as LaTeX.', isTrue: true, explanation: 'This preserves form state and maths for downstream reasoning.' },
    { text: 'Content Understanding image analyzers are the recommended way to extract dense printed text from scanned pages.', isTrue: false, explanation: 'Use a document analyzer (or Document Intelligence Read/Layout) for text-centric content; image analyzers target visual characteristics.' },
    { text: 'Agentic mode in Content Understanding is available in the GA 2025-11-01 API.', isTrue: false, explanation: 'Agentic mode requires the 2026-06-01-preview API version.' },
    { text: 'Content Understanding and the agents feature require Microsoft Entra ID authentication in Foundry.', isTrue: true, explanation: 'API keys are not accepted for these areas.' },
  ],
  resources: [
    { label: 'What is Azure Content Understanding in Foundry Tools?', url: 'https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview' },
    { label: 'What is a Content Understanding analyzer?', url: 'https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/analyzer-reference' },
    { label: 'Content Understanding video solutions', url: 'https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/video/overview' },
    { label: 'What is Azure Document Intelligence in Foundry Tools?', url: 'https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/overview' },
  ],
};

import type { Concept } from '../../types';

export const multimodalImageUnderstanding: Concept = {
  id: 'multimodal-image-understanding',
  title: 'Multimodal Image Understanding: Vision Chat, Captions, Visual Q&A, Alt Text and Object Detection',
  summary:
    'Analysing visual context with multimodal chat models (image inputs in the Responses and Chat Completions APIs, detail levels, multiple images), producing concise or detailed captions for one or many images with Azure Vision Image Analysis 4.0 (Caption, Dense Captions) or an LLM, building question answering grounded in visual evidence, generating accessibility-aligned alt text and extended descriptions, and identifying objects, components and regions with Image Analysis objects, people, OCR, smart crops and custom models.',
  certs: ['ai-103', 'ai-901'],
  domains: ['ai-103-3', 'ai-901-2'],
  outcomes: ['ai-103-3-2-1', 'ai-103-3-2-2', 'ai-103-3-2-3', 'ai-103-3-2-4', 'ai-103-3-2-8', 'ai-901-2-3-1'],
  tags: ['vision', 'multimodal', 'gpt-vision', 'image-analysis', 'captions', 'dense-captions', 'alt-text', 'accessibility', 'object-detection', 'ocr', 'python', 'intermediate'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Analysing visual context with multimodal models',
      body: `Vision-enabled chat models (GPT-5 family, GPT-4.1, GPT-4o and many partner models flagged with image input in the catalog) accept images alongside text. In the **Responses API** an image is an \`input_image\` content part with an \`image_url\` (public URL, SAS URL, or a \`data:image/jpeg;base64,...\` data URL) and an optional \`detail\` of \`low\`, \`high\` or \`auto\`; in **Chat Completions** it is an \`image_url\` part. \`low\` sends a downscaled image for a fixed, small token cost (good for classification and simple captions); \`high\` tiles the image at higher resolution for reading small text, fine components or dense scenes, at more tokens and latency. You can send **several images in one message** ("compare these two dashboards", "which of these five photos shows damage"), and because the Responses API keeps context (\`previous_response_id\` or a conversation), follow-up questions about the same image need no re-upload.

What multimodal models are good at: open-ended description, reasoning about relationships ("is the ladder placed safely?"), reading charts and handwriting, comparing images, extracting structured facts into JSON (combine with structured outputs), and answering follow-ups. What they are not: deterministic bounding boxes, pixel-accurate counts, or guaranteed OCR of every character. For those, pair the model with **Azure Vision Image Analysis 4.0** or **Content Understanding**, and use the model to interpret the results.

Practical rules: keep images under the size limits (around 20 MB per image for the OpenAI models), compress before base64 encoding, specify the output you want (length, format, language), and grant the Azure OpenAI resource's managed identity **Storage Blob Data Reader** when referencing blob SAS URLs. Vision inputs pass through content filters, and prompt injection through text in images must be screened (OCR plus Prompt Shields).`,
    },
    {
      heading: 'Captions, dense captions and multi-image captioning',
      body: `**Azure Vision Image Analysis 4.0** (the \`azure-ai-vision-imageanalysis\` SDK, \`ImageAnalysisClient\`) returns deterministic captions: \`VisualFeatures.CAPTION\` gives one sentence for the whole image with a confidence score, \`VisualFeatures.DENSE_CAPTIONS\` gives up to ten region captions with bounding boxes. Both are English-only, available in specific regions, and support \`gender_neutral_caption=True\` to replace "man/woman" with "person". Add \`TAGS\` for keyword lists, \`OBJECTS\`, \`PEOPLE\`, \`READ\` (OCR) and \`SMART_CROPS\` in the same call. Note Microsoft has announced Image Analysis 4.0 retires in September 2028, so new designs increasingly use **Content Understanding image analyzers** (\`prebuilt-imageSearch\` for RAG-ready descriptions, or custom analyzers with a field schema) or a multimodal chat model.

Choosing the caption generator:
- **Concise, consistent, cheap, batch**: Image Analysis Caption (one sentence, confidence) or Content Understanding with a short \`description\` field.
- **Detailed or styled captions**: a multimodal chat model with explicit instructions ("two sentences, mention colours and setting, no speculation"), optionally seeded with the Image Analysis caption and tags for grounding.
- **Many images**: Image Analysis is called per image (parallelise); a chat model can caption several images in one request and even write a comparative caption, but token cost grows per image, so use \`detail: low\` for thumbnails.
- **Region-level captions**: Dense Captions (bounding boxes) or Content Understanding image field extraction.

For production captioning pipelines, store caption, confidence, language, model version and a review flag; low-confidence captions go to human review.`,
    },
    {
      heading: 'Visual question answering grounded in evidence, and accessible alt text',
      body: `**Grounded visual Q&A** means the answer must come from what is visible, with the evidence exposed. Patterns:

1. **Direct VQA**: send the image(s) and the question to a multimodal model with instructions to answer only from the image and to say when something is not visible; ask for the *region* or *element* that supports the answer.
2. **Tool-grounded VQA**: first run Image Analysis (objects with bounding boxes, OCR lines with polygons, dense captions) or a Content Understanding analyzer, then give the model both the image and the structured detections so it can cite them ("the label at the bottom-left reads 2.5 kg"). Structured outputs make the evidence machine-checkable.
3. **RAG over images**: index images by caption, OCR text and multimodal embeddings (Azure Vision multimodal embeddings skill or image verbalization with the GenAI Prompt skill in Azure AI Search), retrieve candidates, then let the model answer with citations to the retrieved images.
4. **Verification**: for high-stakes answers (safety inspections, medical imaging) require confidence thresholds, human review and evaluators such as Groundedness applied to the detections as context.

**Alt text and extended descriptions aligned to accessibility guidance** (WCAG 1.1.1 non-text content):
- *Alt text*: short (roughly under 125 characters), conveys the purpose of the image in context, no "image of", no redundant text already in the page; decorative images get empty alt. Instruct the model with these rules and pass page context ("this image appears in a recipe for bread").
- *Extended descriptions*: for charts, diagrams and complex images, a longer description that conveys data and structure (trends, axis labels, key values) placed near the image or linked; use Image Analysis READ to capture labels exactly and the model to explain.
- Prefer **gender-neutral**, non-speculative wording; do not infer identity, emotion or intent; describe text verbatim when it matters.
- Generate in the user's language; captions from Image Analysis are English-only, so use a model or Translator for other languages.
- Keep a human review path and never present AI alt text as authoritative for legal or safety-critical content.`,
    },
    {
      heading: 'Identifying objects, components and regions',
      body: `When the task is *where* rather than *what*, use detection features:

- **Image Analysis 4.0 OBJECTS**: detects common objects with bounding boxes and tags; **PEOPLE** returns person boxes with confidence; **READ** returns text blocks, lines and words with bounding polygons and confidence (printed and handwritten); **SMART_CROPS** proposes crops for given aspect ratios; **TAGS** lists detected concepts. Results come as \`result.objects.list\`, \`result.read.blocks\`, \`result.people.list\`, each with \`bounding_box\` and confidence.
- **Custom models**: when you need your own components (a specific PCB connector, a store's products), train an Image Analysis **custom object detection or classification** model from a few dozen labelled images (model customization), or use **Azure Custom Vision**; for schema-driven extraction without labelling, define a Content Understanding **image analyzer** with fields such as \`defectType\` (classify) or \`visibleBrands\` (generate) and optional grounding.
- **Video**: Content Understanding video analyzers segment video and extract fields per segment with key frames; Azure AI Video Indexer provides faces, labels, OCR, scenes and topics at scale.
- **Multimodal model as a detector**: GPT-class models can describe approximate locations ("top-left") and count small numbers of items, but boxes are not reliable; use them to interpret detections, resolve ambiguities and decide, not to measure.

Exam framings: "return bounding boxes for people in CCTV frames" → Image Analysis PEOPLE (or custom detection), not a chat model; "detect your proprietary part types" → custom model or Content Understanding field schema; "explain why a scene is unsafe" → multimodal model, possibly grounded with detections; "caption 1 million product images cheaply and consistently" → Image Analysis Caption or Content Understanding batch, not GPT-5 with detail high; "WCAG-compliant alt text in Spanish" → multimodal model with alt-text rules and context, or Image Analysis caption plus Translator.`,
    },
  ],
  examples: [
    {
      title: 'Visual Q&A grounded in detections',
      description:
        'A warehouse safety app answers "is this aisle safe?" The pipeline runs Image Analysis for objects and OCR, then asks a multimodal model to answer using only the image and the detections, returning JSON with the supporting evidence.',
      language: 'python',
      code: `from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures

vision = ImageAnalysisClient(endpoint=VISION_ENDPOINT, credential=DefaultAzureCredential())
det = vision.analyze(image_data=photo, visual_features=[VisualFeatures.OBJECTS, VisualFeatures.READ,
                                                       VisualFeatures.DENSE_CAPTIONS])
objects = [{"name": o.tags[0].name, "box": o.bounding_box.__dict__} for o in det.objects.list]
text = [l.text for b in det.read.blocks for l in b.lines]

r = openai.responses.create(
    model="gpt-5",
    instructions=("Answer ONLY from the image and the detections. Return JSON "
                  "{safe: bool, hazards: [{description, evidence}]}. Say 'not visible' when unsure."),
    input=[{"role": "user", "content": [
        {"type": "input_text", "text": f"Detections: {objects}\\nText in image: {text}\\nIs this aisle safe?"},
        {"type": "input_image", "image_url": f"data:image/jpeg;base64,{b64(photo)}", "detail": "high"}]}],
    text={"format": {"type": "json_object"}},
)
print(r.output_text)`,
      takeaway: 'Combine deterministic detections (boxes, OCR) with a multimodal model that must cite them, so visual answers stay grounded and checkable.',
    },
    {
      title: 'Accessibility-aligned alt text with an extended description',
      description:
        'A CMS generates alt text for uploaded images. Image Analysis supplies a gender-neutral caption and OCR; the model then writes alt text under 125 characters that reflects page context and an extended description for charts, following WCAG-style rules.',
      language: 'python',
      code: `cap = vision.analyze_from_url(image_url=url,
        visual_features=[VisualFeatures.CAPTION, VisualFeatures.READ, VisualFeatures.TAGS],
        gender_neutral_caption=True)
seed = cap.caption.text if cap.caption else ""
labels = " ".join(l.text for b in cap.read.blocks for l in b.lines)

alt = openai.responses.create(
    model="gpt-5-mini",
    instructions=("Write accessibility alt text: under 125 characters, convey purpose in context, "
                  "no 'image of', no speculation about identity or emotion, person-neutral wording, "
                  "quote visible text exactly. If the image is a chart or diagram also return an "
                  "extended description with axes, trend and key values. Output JSON {alt, extended}."),
    input=[{"role": "user", "content": [
        {"type": "input_text", "text": f"Page context: {page_context}\\nSeed caption: {seed}\\nText: {labels}"},
        {"type": "input_image", "image_url": url, "detail": "low"}]}],
    text={"format": {"type": "json_object"}},
)`,
      takeaway: 'Encode the accessibility rules in the instructions, pass page context and OCR, use gender-neutral seeds, and keep a human review path for complex images.',
    },
    {
      title: 'The wrong tool for detection (a realistic mistake)',
      description:
        'A team asked GPT-4o for bounding boxes of forklifts in 50,000 camera frames per day. Boxes were inconsistent and the bill was large. Switching to Image Analysis OBJECTS (and a custom object detection model for the company\'s own equipment) gave deterministic boxes at a fraction of the cost; the LLM is now called only on frames where a forklift and a person overlap, to describe the risk.',
      language: 'python',
      code: `result = vision.analyze(image_data=frame, visual_features=[VisualFeatures.OBJECTS, VisualFeatures.PEOPLE])
forklifts = [o.bounding_box for o in result.objects.list if o.tags[0].name == "forklift"]
people = [p.bounding_box for p in result.people.list if p.confidence > 0.6]

def overlaps(a, b):
    return a.x < b.x + b.width and b.x < a.x + a.width and a.y < b.y + b.height and b.y < a.y + a.height

if any(overlaps(f, p) for f in forklifts for p in people):
    risk = openai.responses.create(model="gpt-5-mini",
        input=[{"role": "user", "content": [
            {"type": "input_text", "text": "A person and a forklift overlap. Describe the risk in one sentence."},
            {"type": "input_image", "image_url": f"data:image/jpeg;base64,{b64(frame)}", "detail": "low"}]}])
    alert(risk.output_text)`,
      takeaway: 'Use Image Analysis or a custom model for deterministic localisation at scale, and reserve the multimodal model for interpreting the flagged cases.',
    },
  ],
  keyPoints: [
    'Multimodal chat models take input_image parts (URL or base64 data URL) with detail low, high or auto; several images can share one message, and conversations keep visual context for follow-ups.',
    'Image Analysis 4.0 (ImageAnalysisClient) returns Caption, Dense Captions (up to 10 regions with boxes), Tags, Objects, People, Read (OCR) and Smart Crops; captions are English-only and support gender-neutral wording.',
    'Choose Image Analysis or Content Understanding for concise, consistent, cheap captions at scale; use a multimodal model for detailed, styled, multilingual or comparative captions.',
    'Grounded visual Q&A instructs the model to answer only from the image and supplied detections, returns evidence, and uses structured outputs and human review for high stakes.',
    'Accessibility alt text: short, purpose-driven, context-aware, no "image of", no speculation, verbatim visible text, gender-neutral; complex images get an extended description.',
    'Objects, people and text with bounding boxes come from Image Analysis; proprietary components need a custom object detection model or a Content Understanding image field schema; multimodal models are not reliable detectors.',
    'Image Analysis 4.0 is scheduled to retire in September 2028, so Content Understanding image analyzers and multimodal models are the forward path for new designs.',
    'Screen text inside images with OCR plus Prompt Shields and apply content filters; grant Storage Blob Data Reader to the resource identity for blob SAS references.',
  ],
  flashcards: [
    { front: 'What are the three values of the image detail parameter and when do you use low?', back: 'low, high and auto; low sends a downscaled image at a fixed small token cost for classification and simple captions.' },
    { front: 'Which Image Analysis 4.0 feature returns up to ten region-level captions with bounding boxes?', back: 'Dense Captions (VisualFeatures.DENSE_CAPTIONS).' },
    { front: 'How do you request captions that avoid gendered terms?', back: 'Set gender_neutral_caption=True (gender-neutral-caption=true in REST), which replaces man/woman/boy/girl with person.' },
    { front: 'Which Image Analysis features localise objects, people and text?', back: 'Objects (boxes with tags), People (boxes with confidence) and Read (OCR blocks, lines and words with polygons).' },
    { front: 'What should alt text generated for WCAG compliance avoid?', back: 'Starting with "image of", speculation about identity or emotion, redundancy with on-page text, and excessive length (aim under about 125 characters); decorative images get empty alt.' },
    { front: 'When should an extended image description be produced?', back: 'For charts, diagrams and complex images whose data or structure cannot be conveyed in short alt text.' },
    { front: 'Why not rely on a GPT-class model for bounding boxes?', back: 'Multimodal chat models describe approximate locations but are not deterministic detectors; use Image Analysis or a custom detection model.' },
    { front: 'How do you detect a company\'s proprietary components in images?', back: 'Train an Image Analysis custom object detection or classification model (or Custom Vision), or define a Content Understanding image analyzer with a field schema.' },
    { front: 'How do multimodal models answer follow-up questions about an image without re-sending it?', back: 'Through Responses API context: previous_response_id or a conversation keeps the earlier image input.' },
    { front: 'In which language are Image Analysis 4.0 captions available?', back: 'English only; use a multimodal model or Translator for other languages.' },
  ],
  quiz: [
    {
      question:
        'An e-commerce company must caption two million product images consistently and cheaply, in one short sentence each, with a confidence score for review routing. Which service fits BEST?',
      options: [
        'GPT-5 with detail set to high for every image.',
        'Azure Vision Image Analysis 4.0 Caption (or a Content Understanding image analyzer) run per image in parallel.',
        'Sora 2 with n_variants.',
        'Azure AI Search semantic ranker.',
      ],
      correct: [1],
      explanation:
        'Image Analysis Caption is deterministic, cheap and returns confidence; Content Understanding offers a schema-driven alternative. A frontier model with high detail is costly and inconsistent at this scale, Sora generates video, and semantic ranker is a search feature.',
    },
    {
      question: 'Which TWO practices align generated alt text with accessibility guidelines? (Select two)',
      options: [
        'Begin every alt text with "Image of".',
        'Keep alt text short and convey the image\'s purpose in the page context.',
        'Infer the subject\'s emotions to make descriptions richer.',
        'Provide an extended description for charts and diagrams that conveys data and trends.',
      ],
      correct: [1, 3],
      explanation:
        'Concise, purpose-driven alt text plus extended descriptions for complex images follow WCAG guidance. "Image of" is redundant for screen readers and inferring emotions is speculation.',
    },
    {
      question:
        'A safety inspection app must answer questions about a photo and show which part of the image supports the answer, with low tolerance for guessing. Which design is MOST appropriate?',
      options: [
        'Ask a multimodal model with detail low and accept the answer.',
        'Run Image Analysis for objects and OCR, then prompt the multimodal model to answer only from the image and the detections, returning the supporting evidence in structured JSON.',
        'Use the Translator service.',
        'Index the photo in Azure AI Search and run a keyword query.',
      ],
      correct: [1],
      explanation:
        'Grounding the model in detections and requiring evidence yields checkable answers. Low-detail guessing lacks evidence, Translator is unrelated, and keyword search cannot answer visual questions.',
    },
    {
      question: 'Which Image Analysis visual feature should you request to get the coordinates of text printed on a product label?',
      options: ['CAPTION', 'TAGS', 'READ', 'SMART_CROPS'],
      correct: [2],
      explanation:
        'Read performs OCR and returns lines and words with bounding polygons. Caption and Tags describe content, and Smart Crops proposes crop regions.',
    },
    {
      question: 'A manufacturer needs to detect three proprietary connector types on circuit boards that no general model recognises. What should you do?',
      options: [
        'Use VisualFeatures.OBJECTS, which detects all objects.',
        'Train a custom object detection model (Image Analysis model customization or Custom Vision) with labelled images, or define a Content Understanding image analyzer schema for the connector types.',
        'Ask GPT-5 to return bounding boxes.',
        'Use Dense Captions.',
      ],
      correct: [1],
      explanation:
        'Proprietary classes require customization or a schema-driven analyzer. Built-in object detection covers common objects only, chat models are unreliable detectors, and dense captions describe regions rather than classify custom parts.',
    },
  ],
  statements: [
    { text: 'A single Responses API message can contain several input_image parts for comparison tasks.', isTrue: true, explanation: 'Multiple images per message are supported; token cost grows with each image and detail level.' },
    { text: 'Image Analysis 4.0 Dense Captions are available in every Azure region.', isTrue: false, explanation: 'Caption and Dense Captions are limited to specific regions and are English-only.' },
    { text: 'Setting detail to high reduces token usage for image inputs.', isTrue: false, explanation: 'High detail tiles the image at higher resolution and uses more tokens; low is the economical option.' },
    { text: 'Decorative images should receive empty alt text rather than a generated description.', isTrue: true, explanation: 'Accessibility guidance marks purely decorative images with empty alt so screen readers skip them.' },
    { text: 'Image Analysis People detection returns bounding boxes with confidence scores.', isTrue: true, explanation: 'VisualFeatures.PEOPLE returns person boxes and confidence values.' },
    { text: 'Content Understanding image analyzers are optimised for extracting dense printed text from documents.', isTrue: false, explanation: 'Microsoft advises using document analyzers when the task is primarily text extraction; image analyzers target visual characteristics.' },
    { text: 'Text embedded in an uploaded image should be treated as untrusted input and screened for prompt injection.', isTrue: true, explanation: 'OCR the text and run Prompt Shields on it; images can carry hidden instructions.' },
  ],
  resources: [
    { label: 'Vision-enabled chat models', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/gpt-with-vision' },
    { label: 'Image captions (Image Analysis 4.0)', url: 'https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/concept-describe-images-40' },
    { label: 'Call the Image Analysis 4.0 Analyze API', url: 'https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/how-to/call-analyze-image-40' },
    { label: 'Content Understanding image solutions', url: 'https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/image/overview' },
  ],
};

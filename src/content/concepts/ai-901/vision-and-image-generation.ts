import type { Concept } from '../../types';

export const visionAndImageGeneration: Concept = {
  id: 'vision-and-image-generation',
  title: 'Computer Vision and Image Generation with Foundry',
  summary:
    'What computer vision models can do (describe, tag, detect, read, moderate), what image-generation models can do (create and edit from text and reference images), how to interpret an image inside a prompt to a vision-enabled model, how to generate images with the gpt-image series, and how to build a small vision app.',
  certs: ['ai-901', 'ai-103'],
  domains: ['ai-901-1', 'ai-901-2', 'ai-103-3'],
  outcomes: ['ai-901-1-3-4', 'ai-901-2-3-1', 'ai-901-2-3-2', 'ai-901-2-3-3', 'ai-103-3-2-1', 'ai-103-3-1-1'],
  tags: ['computer-vision', 'multimodal', 'image-generation', 'gpt-image', 'ocr', 'azure-vision', 'python', 'intermediate'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'What computer vision and image-generation models do',
      body: `**Computer vision** is the workload of extracting meaning from images and video. The capabilities the exam names:

- **Image classification**: assign a label to the whole image (defective / not defective).
- **Object detection**: find and locate multiple objects with **bounding boxes** (three helmets, one forklift, at these coordinates).
- **Captioning and tagging**: a sentence describing the image, plus keywords.
- **Optical character recognition (OCR)**: read printed and handwritten text, returning the text and its position.
- **Face detection and analysis**: locate faces and attributes (gated and governed by responsible-AI policies; facial recognition requires approval).
- **Semantic segmentation**: classify every pixel (used in medical imaging and autonomous driving).
- **Content moderation**: detect unsafe imagery.
- **Video analysis**: frames, scenes, transcripts and events over time.

Two product families serve these in Foundry. **Vision-enabled multimodal models** (GPT-4o, GPT-4.1, GPT-5 and o-series, Claude and others) take an image inside a chat prompt and answer in natural language: describe, compare, answer questions, extract fields, write alt text. **Azure Vision in Foundry Tools** provides purpose-built APIs: **Image Analysis** (captions, tags, objects, people, smart crops; version 4.0 is deprecated and retiring in 2028, with Content Understanding and multimodal models as the recommended successors), **OCR / Read** (text with bounding boxes) and **Face**. Content Understanding's image analyzers cover structured extraction from images.

**Image-generation models** create new images from a text prompt and optionally reference images. In Foundry the current family is the **gpt-image** series (gpt-image-1, gpt-image-1-mini, gpt-image-1.5, gpt-image-2 and later), with FLUX models also available; **DALL-E 3 was retired in March 2026**. Capabilities include text-to-image, **inpainting** (edit a masked region with a prompt), **variations** of a reference image, transparent backgrounds, quality tiers (low, medium, high) and multiple sizes. Generated images are returned as base64 PNG or JPEG and carry **content credentials** (C2PA provenance metadata). **Sora** models in Foundry generate video.`,
    },
    {
      heading: 'Interpreting visual input in a prompt',
      body: `To make a vision-enabled model look at an image, you send a user message whose content is an **array of parts**: a text part with your question and an **image part** containing either a public URL or a **base64 data URL** (\`data:image/png;base64,...\`). In Chat Completions the part is \`{"type": "image_url", "image_url": {"url": ...}}\`; in the Responses API it is \`{"type": "input_image", "image_url": ...}\`. You can include several images in one message ("compare these two photos") and ask follow-up questions in later turns.

Guidance that matters in practice and on the exam:
- Deploy a **vision-capable** model (gpt-4o, gpt-4.1, gpt-5 and others); a text-only deployment will reject or ignore the image part.
- Write a task-specific **system message**: "You are an insurance assessor; describe damage factually, do not estimate cost."
- Set a detail level where supported (low for cheap thumbnails, high for fine print) and remember images cost tokens.
- Ask for **structured output** (JSON fields) when the result feeds code.
- Content filters still run on image inputs and outputs, and text embedded in images can carry **prompt injection**, so treat it as data, not instructions.
- Choose the multimodal route for open-ended questions about an image; choose OCR/Read when you need the exact text with coordinates; choose Content Understanding when you need schema-based fields with confidence from many images.

In the Foundry portal you can do all of this in the **chat playground**: select a vision-capable deployment, use the attachment button to upload an image, type "Describe this image" and send. The playground's Code tab exports the exact request.`,
    },
    {
      heading: 'Creating visual outputs with generative models',
      body: `Deploy a gpt-image series model (some versions require a limited-access registration), then either use the **Images playground** in the portal (prompt, size, quality, number of images, inpainting with a brush, side-by-side model comparison) or call the API. The Python call with the OpenAI client is \`client.images.generate(model=<deployment>, prompt=..., size="1024x1024", quality="high", n=1)\`; the response contains \`data[0].b64_json\`, which you decode and write to a file. Editing uses \`client.images.edit(...)\` with an image and a mask. Newer models also support image generation as a **tool inside the Responses API**, so an agent can produce an image mid-conversation.

Prompting an image model is different from prompting a chat model: describe the subject, style, composition, lighting and any text that must appear; say what to avoid; and iterate. Reference images steer style or preserve a product's look. Responsible-AI considerations apply with extra force: content filters block harmful or copyrighted-style requests, generated images embed content credentials so they can be identified as AI-made, and realistic depictions of real people are restricted.`,
    },
    {
      heading: 'The exam angle',
      body: `Capability items: "count and locate safety helmets" (object detection with bounding boxes), "read serial numbers from photos" (OCR / Read, or a multimodal model if free text suffices), "generate a one-line description for alt text" (captioning or a multimodal model), "classify X-rays as normal or abnormal" (image classification, possibly a custom model), "produce marketing visuals from a brief" (image generation with a gpt-image model), "edit only the background of a product photo" (inpainting with a mask).

Code items: an image_url or input_image content part means vision input; images.generate with b64_json means image generation; a text-only deployment name in a vision call is the bug; forgetting to base64-decode the result is another.

Architecture items: "answer customers' questions about photos they upload" (vision-enabled chat model); "extract the same ten fields from thousands of photographed forms with confidence scores" (Content Understanding image or document analyzer); "exact text positions on a scanned page" (OCR / Read). Distractors: Azure Speech, Azure Language, or an embedding model for a visual task; DALL-E 3 as the recommended generator (retired); claiming generated images carry no provenance metadata (they include content credentials).`,
    },
  ],
  examples: [
    {
      title: 'Describe damage in an uploaded photo with a vision-enabled model',
      description:
        'An insurance app sends a claimant\'s photo to a vision-capable deployment with a focused system message and asks for a factual description as JSON so it can be stored with the claim.',
      language: 'python',
      code: `import base64
img_b64 = base64.b64encode(open("damage.jpg", "rb").read()).decode()

openai = project.get_openai_client()           # from AIProjectClient
completion = openai.chat.completions.create(
    model="gpt-4.1",                           # a vision-capable deployment
    messages=[
        {"role": "system", "content": "You are an insurance assessor. Describe visible damage factually. "
                                      "Return JSON with keys: parts_damaged (list), severity (low|medium|high)."},
        {"role": "user", "content": [
            {"type": "text", "text": "Assess this vehicle photo."},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}},
        ]},
    ],
    max_tokens=400,
)
print(completion.choices[0].message.content)`,
      takeaway: 'Vision input is a content part (image_url or input_image) alongside text; a task-specific system message and a JSON request make the output usable.',
    },
    {
      title: 'Generate a product illustration with gpt-image',
      description:
        'A marketing team needs quick concept art. The app calls images.generate on a gpt-image deployment, decodes the base64 result and saves a PNG. Size, quality and n are the main knobs.',
      language: 'python',
      code: `import base64
result = openai.images.generate(
    model="gpt-image-1",                 # your gpt-image series deployment name
    prompt="A minimalist product shot of wireless earbuds on a pale blue background, soft studio lighting",
    size="1024x1024",
    quality="high",
    n=1,
)
png = base64.b64decode(result.data[0].b64_json)   # gpt-image models return base64, not URLs
open("earbuds.png", "wb").write(png)`,
      takeaway: 'images.generate returns base64 image data for gpt-image models; decode and save it.',
    },
    {
      title: 'Sending a photo to a text-only deployment (a realistic mistake)',
      description:
        'A developer wires up the vision code above but points model= at a deployment of a text-only small language model. The call fails or the model answers as if no image were attached. Checking Models + endpoints shows the deployment is not vision-capable; switching to a gpt-4.1 or gpt-4o deployment fixes it. The second common slip is pasting raw bytes instead of a base64 data URL.',
      takeaway: 'Image input requires a vision-capable model deployment and a URL or base64 data URL, not raw bytes.',
    },
  ],
  keyPoints: [
    'Vision capabilities: classification, object detection (bounding boxes), captioning and tagging, OCR, face detection, segmentation, moderation, video analysis.',
    'Two routes: vision-enabled multimodal models for open-ended questions about images; Azure Vision (OCR/Read, Image Analysis, Face) and Content Understanding for structured, purpose-built extraction.',
    'Vision input = a user message with text plus an image part (image_url in Chat Completions, input_image in Responses) using a URL or base64 data URL; the deployment must be vision-capable.',
    'Image generation uses the gpt-image series (DALL-E 3 retired March 2026): text-to-image, inpainting, variations, quality and size options, base64 output, content credentials.',
    'Python: images.generate(model=deployment, prompt, size, quality, n) -> data[0].b64_json; chat.completions.create with content parts for vision.',
    'Portal: chat playground with image upload for vision; Images playground for generation and editing; Code tab exports both.',
    'Responsible AI: content filters on image input and output, prompt injection via text in images, provenance metadata on generated images, restrictions on real people.',
  ],
  flashcards: [
    { front: 'What is the difference between image classification and object detection?', back: 'Classification labels the whole image; detection finds multiple objects and returns bounding boxes for each.' },
    { front: 'Which capability reads printed or handwritten text from an image?', back: 'Optical character recognition (OCR), such as Azure Vision Read, or a multimodal model for free-text reading.' },
    { front: 'How do you include an image in a Chat Completions prompt?', back: 'As a content part {"type": "image_url", "image_url": {"url": <URL or base64 data URL>}} alongside a text part in the user message.' },
    { front: 'What is the Responses API equivalent of the image_url part?', back: 'An input_image content part.' },
    { front: 'Which models generate images in Foundry today?', back: 'The gpt-image series (gpt-image-1, -1-mini, -1.5, -2 and later) and FLUX models; DALL-E 3 was retired in March 2026.' },
    { front: 'What is inpainting?', back: 'Editing a masked region of an existing image according to a prompt while leaving the rest unchanged.' },
    { front: 'In what form do gpt-image models return images?', back: 'Base64-encoded data (b64_json) rather than URLs; decode and save.' },
    { front: 'What are content credentials on generated images?', back: 'C2PA provenance metadata embedded so the image can be identified as AI-generated.' },
    { front: 'Which Python call generates an image with the OpenAI client?', back: 'client.images.generate(model=<deployment>, prompt=..., size=..., quality=..., n=...).' },
    { front: 'When should you choose Content Understanding over a multimodal chat model for images?', back: 'When you need the same structured fields with confidence scores extracted from many images.' },
    { front: 'Why can text inside an uploaded image be a security concern?', back: 'It can contain prompt-injection instructions; treat image text as data, not commands.' },
  ],
  quiz: [
    {
      question:
        'A warehouse wants to count forklifts and people in CCTV frames and know where each is located. Which computer vision capability is required?',
      options: ['Image classification', 'Object detection', 'Optical character recognition', 'Image generation'],
      correct: [1],
      explanation:
        'Locating and counting multiple objects requires object detection with bounding boxes. Classification labels the whole frame, OCR reads text, and generation creates images.',
    },
    {
      question:
        'You want customers to upload a photo of an appliance and ask free-form questions about it in a chat. Which approach is MOST appropriate?',
      options: [
        'Deploy a vision-capable model such as gpt-4.1 and send the image as a content part in the prompt',
        'Deploy an embedding model and send the image bytes as input',
        'Use Azure Speech to describe the image',
        'Use a gpt-image model to generate a description',
      ],
      correct: [0],
      explanation:
        'Conversational questions about an image need a vision-enabled chat model. Embedding models return vectors, Speech handles audio, and image models generate pictures rather than answer questions.',
    },
    {
      question:
        'A marketing team wants to replace only the background of an existing product photo while keeping the product unchanged. Which image-generation feature should they use?',
      options: ['Variations', 'Inpainting with a mask', 'Text-to-image with a new prompt', 'Image classification'],
      correct: [1],
      explanation:
        'Inpainting edits a masked region and preserves the rest. Variations change the whole image, text-to-image creates a new one, and classification does not edit.',
    },
    {
      question: 'Which TWO statements about image generation in Microsoft Foundry are correct? (Select two)',
      options: [
        'gpt-image series models return generated images as base64 data.',
        'DALL-E 3 is the recommended model for new image-generation deployments.',
        'Generated images include content credentials that identify them as AI-generated.',
        'Image generation is only available through the REST API and not in the portal.',
      ],
      correct: [0, 2],
      explanation:
        'gpt-image models return b64_json and embed provenance metadata. DALL-E 3 was retired in March 2026, and the Images playground supports generation in the portal.',
    },
    {
      question:
        'A developer sends an image_url content part to a deployment and the model responds as if no image were provided. What is the MOST likely cause?',
      options: [
        'The deployment is a text-only model that does not support vision input.',
        'The temperature is set too low.',
        'Images must be sent through the Speech SDK.',
        'The system message is too short.',
      ],
      correct: [0],
      explanation:
        'Only vision-capable deployments process image parts. Temperature controls randomness, the Speech SDK is for audio, and system message length does not enable vision.',
    },
    {
      question:
        'A finance team needs to extract the same eight fields from thousands of photographed expense forms with confidence scores for audit. Which option fits BEST?',
      options: [
        'Ask a chat model to describe each photo in free text',
        'Use Azure Content Understanding with an analyzer defining the eight fields',
        'Generate a cleaner version of each form with gpt-image',
        'Use Azure Speech batch transcription',
      ],
      correct: [1],
      explanation:
        'Schema-based extraction with confidence from many images is Content Understanding\'s purpose. Free text lacks confidence scores, image generation does not extract, and Speech handles audio.',
    },
  ],
  statements: [
    { text: 'Object detection returns bounding boxes for each detected object.', isTrue: true, explanation: 'Location is what distinguishes detection from classification.' },
    { text: 'Any deployed chat model can analyse images if you include an image_url content part.', isTrue: false, explanation: 'Only vision-capable models such as gpt-4o, gpt-4.1, gpt-5 or Claude process image input.' },
    { text: 'gpt-image series models return generated images as base64-encoded data.', isTrue: true, explanation: 'Decode b64_json and write it to a file.' },
    { text: 'DALL-E 3 is available for new deployments in Foundry.', isTrue: false, explanation: 'dall-e-3 was retired on 4 March 2026; use a gpt-image series model.' },
    { text: 'Text embedded in an uploaded image could contain prompt-injection instructions.', isTrue: true, explanation: 'Treat image text as data and keep instructions in the system message.' },
    { text: 'Inpainting generates an entirely new image unrelated to the input.', isTrue: false, explanation: 'Inpainting edits only a masked region of an existing image.' },
    { text: 'The Foundry chat playground lets you upload an image and ask a vision-capable model to describe it.', isTrue: true, explanation: 'Use the attachment button, then send a prompt such as "Describe this image".' },
  ],
  resources: [
    { label: 'Use vision-enabled chat models', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/gpt-with-vision' },
    { label: 'Azure OpenAI image generation models (gpt-image series)', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/dall-e' },
    { label: 'What is Azure Vision in Foundry Tools?', url: 'https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview' },
    { label: 'Content credentials for generated images', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/content-credentials' },
  ],
};

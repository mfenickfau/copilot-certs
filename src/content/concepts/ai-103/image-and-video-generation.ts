import type { Concept } from '../../types';

export const imageAndVideoGeneration: Concept = {
  id: 'image-and-video-generation',
  title: 'Generating and Editing Images and Video with GPT-image and Sora 2',
  summary:
    'Generating images from prompts and reference images with the GPT-image model family, editing with masks (inpainting), input fidelity and prompt-driven modifications, generating video from text, images and existing clips with Sora 2 (jobs API, inpaint items, remix), editing generated video, and choosing the generation and editing controls the platform exposes: size, quality, format, background, n, variants, duration and built-in safety.',
  certs: ['ai-103', 'ai-901'],
  domains: ['ai-103-3', 'ai-901-2'],
  outcomes: ['ai-103-3-1-1', 'ai-103-3-1-2', 'ai-103-3-1-3', 'ai-103-3-1-4', 'ai-103-3-1-5', 'ai-901-2-3-2'],
  tags: ['image-generation', 'gpt-image', 'inpainting', 'sora', 'video-generation', 'responses-api', 'content-credentials', 'python', 'intermediate'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Image generation from text and reference media',
      body: `Azure OpenAI image generation now means the **GPT-image** family (DALL-E 3 retired in March 2026). Current members: **GPT-Image-2.5-Sunburst** (most capable, best editing precision) and **GPT-Image-2.5-Flare** (fastest everyday generation), both generally available with custom WIDTHxHEIGHT sizes up to 4K; **GPT-Image-2** (high resolution, broad aspect ratios); and the limited-access **GPT-Image-1.5**, **GPT-Image-1** and **GPT-Image-1-Mini** (1024x1024, 1024x1536, 1536x1024). All accept **text plus image inputs** and return images as base64 (no URL option on the gpt-image series).

Two API surfaces:
- The **Images API**: \`POST {endpoint}/openai/deployments/{deployment}/images/generations?api-version=2025-04-01-preview\` (or the v1 \`images/generations\` route) with \`prompt\`, \`n\` (1 to 10), \`size\`, \`quality\` (low, medium, high; newer models add xhigh, max, auto), \`output_format\` (png, jpeg, webp), \`output_compression\`, and \`background\` (auto or transparent, PNG only). Reference images go to the **edits** endpoint as multipart \`image\` files.
- The **Responses API image generation tool**: \`tools=[{"type": "image_generation"}]\` lets a chat model orchestrate generation inside a conversation, including iterative refinement ("make the sky darker") because the model carries context. In Foundry Agent Service the equivalent **image generation tool (preview)** needs a gpt-image-1 deployment in the same project as the orchestrator model.

Prompting controls: describe subject, style, composition, lighting and text to render; the gpt-image models follow instructions and render text far better than DALL-E did. **Prompt transformation** (the service rewriting your prompt for safety and detail) can occur; the response may include the revised prompt. Generated images carry **Content Credentials (C2PA)** and invisible watermarks for provenance, and input and output pass through content filtering with abuse monitoring.`,
    },
    {
      heading: 'Editing images: inpainting, masks and prompt-driven modification',
      body: `The **edits** endpoint (\`.../images/edits\`) takes one or more input images plus a prompt, and optionally a **mask**:

- **Mask-based inpainting**: the mask is a PNG the same size as the image whose *fully transparent pixels (alpha 0)* mark the region to regenerate; everything opaque is preserved. Use it to replace a product on a shelf, remove an object, or extend a background without touching the rest.
- **Prompt-driven edits without a mask**: "turn this sketch into a photorealistic render", "change the season to winter". The model decides what to change; add \`input_fidelity: "high"\` to keep style and especially faces faithful to the inputs (supported on gpt-image-1 and later), which is the control for subtle edits that must not alter unrelated areas.
- **Multiple reference images**: pass several images (for example a product shot plus a background) and describe how to combine them; useful for brand-consistent compositions.
- **Variations**: older gpt-image-1 flows support variations with mask plus prompt; newer models fold this into edits.

Operational controls: \`n\` for alternatives, \`size\` to match the target aspect ratio, \`quality\` to trade speed and cost for fidelity (low for drafts and thumbnails, high or xhigh for finals), \`output_format\` and compression for web delivery, and \`background: transparent\` for cut-outs. Responses from the Images API arrive as \`b64_json\`; decode and persist them yourself. Edits are subject to the same filters; attempts to edit real people's faces or copyrighted characters may be refused, and the Sora 2 and gpt-image RAI protections block IP and photorealistic-person misuse.`,
    },
    {
      heading: 'Video generation and editing with Sora 2',
      body: `**Sora 2 (preview)** generates realistic video with synchronised audio from **text**, **image + text**, or **video + text**. It uses the Azure OpenAI **v1 API** with \`api-version=preview\` and an **asynchronous jobs** flow:

1. \`POST {endpoint}/openai/v1/video/generations/jobs\` with \`model\` (deployment name), \`prompt\`, \`width\`, \`height\`, \`n_seconds\` and optionally \`n_variants\` (1 to 4 variations).
2. Poll \`GET .../video/generations/jobs/{job_id}\` until status is succeeded.
3. Download \`GET .../video/generations/{generation_id}/content/video\`.

**Reference media** goes through **inpaint_items** in a multipart request: each item names a file (\`"type": "image"\` or \`"video"\`), a \`frame_index\` (where the image or clip appears, default 0 = start) and optional \`crop_bounds\` (left, top, right, bottom fractions) to select the region used. Image → video animates a still (a product photo comes to life); video → video extends or modifies existing footage ("add fireworks to this clip").

**Editing generated videos**: Sora 2 adds **remix**, which applies targeted adjustments to an existing generated video (change the weather, swap a colour, extend a scene) instead of regenerating from scratch, preserving continuity. Combine remix with variants to explore options, then trim or stitch outside the service with standard tooling. Controls to know: resolution (e.g. 480x480 drafts to 1920x1080 finals), duration in seconds (billing is per second of output), variants, and the built-in **Responsible AI** protections: Sora 2 blocks IP-protected and photorealistic content of real people, applies input and output moderation, and generated video is watermarked and provenance-signed.

The Foundry **Video playground** (preview) provides a no-code surface; production code uses REST with keyless \`DefaultAzureCredential\` tokens for the \`https://ai.azure.com/.default\` scope or (less preferred) an API key.`,
    },
    {
      heading: 'Selecting controls and the exam angle',
      body: `Items ask you to pick the *control* that solves a described problem:

| Requirement | Control |
|---|---|
| Replace only the sofa in a room photo | Edits with a mask whose transparent region covers the sofa |
| Subtle change to a portrait without altering the face | \`input_fidelity: "high"\` on edits |
| Sticker-style asset with no background | \`background: "transparent"\` with PNG output |
| Social banner at 1536x864 | custom \`size\` on GPT-Image-2.x |
| Dozens of cheap concept thumbnails | \`quality: "low"\`, \`n\` up to 10, GPT-Image-1-Mini or Flare |
| Final campaign hero image | GPT-Image-2.5-Sunburst with high/xhigh quality |
| Refine an image over several conversational turns | Responses API image_generation tool |
| Agent that produces images on demand | Agent Service image generation tool (gpt-image-1 + orchestrator model in the same project) |
| Animate a product photo | Sora 2 image + text with inpaint_items |
| Add effects to existing footage | Sora 2 video + text |
| Tweak a generated clip without regenerating | Sora 2 remix |
| Several takes of one prompt | \`n_variants\` |
| Prove an asset was AI-generated by your pipeline | Content Credentials (C2PA) and Content Provenance Detection |

Distractors to recognise: DALL-E 3 (retired), expecting URLs from gpt-image models (base64 only), masks with white or black pixels (the mask uses transparency), synchronous video calls (jobs are asynchronous), and disabling filters to generate protected IP (not possible; built-in protections apply). Limited-access models (gpt-image-1, 1.5, mini) require an approved application before deployment; the GA 2.x models do not.`,
    },
  ],
  examples: [
    {
      title: 'Generate, then inpaint with a mask',
      description:
        'A retailer generates a lifestyle image of a kitchen and then replaces only the kettle with the new model using a transparent-region mask, keeping everything else identical.',
      language: 'python',
      code: `import base64, os, requests
from azure.identity import DefaultAzureCredential

token = DefaultAzureCredential().get_token("https://ai.azure.com/.default").token
headers = {"Authorization": f"Bearer {token}"}
base = f"{os.environ['AZURE_OPENAI_ENDPOINT']}openai/deployments/gpt-image-2-5-sunburst/images"
params = {"api-version": "2025-04-01-preview"}

gen = requests.post(f"{base}/generations", headers=headers, params=params, json={
    "prompt": "Bright Scandinavian kitchen, morning light, a kettle on the counter",
    "n": 1, "size": "1536x1024", "quality": "high", "output_format": "png"}).json()
open("kitchen.png", "wb").write(base64.b64decode(gen["data"][0]["b64_json"]))

# mask.png: same size; fully transparent pixels mark the kettle region to regenerate
edit = requests.post(f"{base}/edits", headers=headers, params=params,
    data={"prompt": "Replace the kettle with a matte black Contoso K200 kettle", "n": 1,
          "size": "1536x1024", "quality": "high", "input_fidelity": "high"},
    files={"image": ("kitchen.png", open("kitchen.png", "rb"), "image/png"),
           "mask": ("mask.png", open("mask.png", "rb"), "image/png")}).json()
open("kitchen-k200.png", "wb").write(base64.b64decode(edit["data"][0]["b64_json"]))`,
      takeaway: 'Generation and edits share one deployment; a transparency mask scopes inpainting and input_fidelity protects everything outside the edit.',
    },
    {
      title: 'Animate a product photo with Sora 2 and poll the job',
      description:
        'Marketing wants a 10-second clip that starts from an existing product photo. The job is created with an inpaint item at frame 0, polled until it succeeds, then downloaded.',
      language: 'python',
      code: `import json, time, requests

create = f"{endpoint}/openai/v1/video/generations/jobs?api-version=preview"
data = {"prompt": "The sneaker rotates slowly on a white turntable, studio lighting",
        "width": "1280", "height": "720", "n_seconds": "10", "n_variants": "2",
        "model": SORA_DEPLOYMENT,
        "inpaint_items": json.dumps([{"frame_index": 0, "type": "image", "file_name": "shoe.jpg",
            "crop_bounds": {"left_fraction": 0.05, "top_fraction": 0.05,
                            "right_fraction": 0.95, "bottom_fraction": 0.95}}])}
with open("shoe.jpg", "rb") as f:
    job = requests.post(create, headers=auth_headers, data=data,
                        files=[("files", ("shoe.jpg", f, "image/jpeg"))]).json()

status_url = f"{endpoint}/openai/v1/video/generations/jobs/{job['id']}?api-version=preview"
while (job := requests.get(status_url, headers=auth_headers).json())["status"] not in ("succeeded", "failed"):
    time.sleep(5)
for gen in job["generations"]:
    video = requests.get(f"{endpoint}/openai/v1/video/generations/{gen['id']}/content/video?api-version=preview",
                         headers=auth_headers).content
    open(f"{gen['id']}.mp4", "wb").write(video)`,
      takeaway: 'Video generation is an asynchronous job: create with prompt, dimensions, duration and optional inpaint items, poll, then download each variant.',
    },
    {
      title: 'The retired-model and URL mistake',
      description:
        'A team\'s code still targets a dall-e-3 deployment and reads data[0].url. After March 2026 the deployment stopped working, and once they redeployed gpt-image they got KeyError on url because gpt-image models return base64 only. The fix updates the deployment name, reads b64_json, and moves iterative refinement to the Responses API image_generation tool so designers can ask for changes conversationally.',
      language: 'python',
      code: `# Conversational generation and refinement with the Responses API tool
r1 = openai.responses.create(
    model="gpt-5",
    input="Create a flat-style icon of a paper plane, teal on white.",
    tools=[{"type": "image_generation", "quality": "medium", "size": "1024x1024"}],
)
img = next(o for o in r1.output if o.type == "image_generation_call")
open("plane-v1.png", "wb").write(base64.b64decode(img.result))     # base64, never a URL

r2 = openai.responses.create(
    model="gpt-5", previous_response_id=r1.id,
    input="Make the plane orange and add a dotted flight path.",
    tools=[{"type": "image_generation"}],
)`,
      takeaway: 'Target gpt-image deployments, decode b64_json, and use the Responses image_generation tool when users refine images over several turns.',
    },
  ],
  keyPoints: [
    'DALL-E 3 retired in March 2026; use the GPT-image family (2.5 Sunburst and Flare GA, GPT-Image-2, limited-access 1.5, 1 and 1-Mini), which accept text plus image inputs and return base64 only.',
    'Images API controls: prompt, n (1 to 10), size (fixed or custom up to 4K on 2.x), quality (low to max/auto), output_format, output_compression, background transparent (PNG).',
    'Edits endpoint: input images plus prompt; a mask\'s fully transparent pixels define the inpainting region; input_fidelity high preserves faces and unrelated areas.',
    'The Responses API image_generation tool and the Agent Service image generation tool (gpt-image-1 plus an orchestrator model in the same project) enable conversational, iterative generation.',
    'Sora 2 (preview) generates video with audio from text, image + text or video + text through asynchronous jobs: create, poll, download; reference media uses inpaint_items with frame_index and crop_bounds.',
    'Sora 2 remix edits an existing generated video with targeted changes; n_variants produces alternatives; billing is per second of video.',
    'Built-in Responsible AI: input and output moderation, abuse monitoring, blocks on IP and photorealistic people in Sora 2, and C2PA Content Credentials plus invisible watermarks on outputs.',
    'Limited-access image models need approval before deployment; the Video playground is a no-code surface, and keyless auth uses the https://ai.azure.com/.default scope.',
  ],
  flashcards: [
    { front: 'Which image generation model family replaced DALL-E 3 in Azure OpenAI?', back: 'The GPT-image series (GPT-Image-2.5-Sunburst, 2.5-Flare, GPT-Image-2, and limited-access 1.5, 1 and 1-Mini).' },
    { front: 'In what format do gpt-image models return images?', back: 'Base64 (b64_json) only; there is no URL option.' },
    { front: 'How does a mask define the region to inpaint?', back: 'Fully transparent pixels (alpha 0) in a PNG the same size as the image mark the area to regenerate; opaque pixels are preserved.' },
    { front: 'Which edits parameter keeps faces and unrelated details faithful to the input image?', back: 'input_fidelity set to "high".' },
    { front: 'Which parameter produces a cut-out with no background?', back: 'background: "transparent" with PNG output.' },
    { front: 'How do you generate images inside a multi-turn conversation with a chat model?', back: 'Use the Responses API with tools=[{"type": "image_generation"}] and chain turns with previous_response_id.' },
    { front: 'What are the three input modes for Sora 2?', back: 'Text only, image + text (animate or use as a starting frame) and video + text (extend or modify footage).' },
    { front: 'How is reference media attached to a Sora 2 job?', back: 'As multipart files referenced by inpaint_items entries with type, file_name, frame_index and optional crop_bounds.' },
    { front: 'What is Sora 2 remix?', back: 'Making targeted adjustments to an existing generated video instead of regenerating it from scratch.' },
    { front: 'How is Sora 2 video generation billed and what are its RAI restrictions?', back: 'Per second of generated video; it blocks IP-protected and photorealistic content, with input and output moderation and abuse monitoring.' },
  ],
  quiz: [
    {
      question:
        'A furniture retailer wants to swap only the lamp in an existing room photo while keeping every other pixel unchanged. Which approach should you use?',
      options: [
        'Generate a new image with a very detailed prompt describing the room.',
        'Call the edits endpoint with the photo and a mask whose transparent region covers the lamp, plus a prompt describing the new lamp.',
        'Use Sora 2 remix on the photo.',
        'Increase quality to xhigh on a generation call.',
      ],
      correct: [1],
      explanation:
        'Mask-based inpainting regenerates only the transparent region. A fresh generation cannot preserve the original pixels, remix is for video, and quality does not scope edits.',
    },
    {
      question: 'Which TWO statements about GPT-image models in Azure OpenAI are correct? (Select two)',
      options: [
        'They return images as base64 strings rather than URLs.',
        'DALL-E 3 remains the recommended model for new deployments.',
        'GPT-Image-2.5 models support custom WIDTHxHEIGHT sizes with edges that are multiples of 16 pixels.',
        'Masks are defined by white pixels marking the editable area.',
      ],
      correct: [0, 2],
      explanation:
        'gpt-image outputs are base64 only and 2.5 models accept custom dimensions. DALL-E 3 was retired in March 2026, and masks use transparency, not colour.',
    },
    {
      question:
        'Marketing needs a 10-second clip that begins with an existing product photo and adds motion and sound. Which configuration is correct?',
      options: [
        'A synchronous call to the images/generations endpoint with n_seconds=10.',
        'A Sora 2 video generation job with the photo attached as an inpaint item at frame_index 0, polled until succeeded.',
        'The Responses API image_generation tool with a video prompt.',
        'An Azure Vision video analysis request.',
      ],
      correct: [1],
      explanation:
        'Sora 2 jobs accept image + text input through inpaint_items and run asynchronously. The images endpoint and image_generation tool produce stills, and Vision analyses video rather than generating it.',
    },
    {
      question: 'A designer wants to iterate on a generated illustration by saying "make the background darker" and "add a second character" in successive messages. What is the MOST appropriate approach?',
      options: [
        'Re-run images/generations with the full prompt each time.',
        'Use the Responses API image_generation tool and chain turns with previous_response_id so the model keeps context.',
        'Use Sora 2 n_variants.',
        'Lower the quality parameter to speed up iterations.',
      ],
      correct: [1],
      explanation:
        'The Responses API tool carries conversational context for iterative refinement. Re-running generations loses continuity, n_variants applies to video, and quality does not add memory.',
    },
    {
      question: 'A generated clip is good except for the weather; the team wants rain instead of sun without losing the scene\'s continuity. Which Sora 2 capability fits?',
      options: ['n_variants', 'Remix', 'crop_bounds', 'quality: low'],
      correct: [1],
      explanation:
        'Remix applies targeted adjustments to an existing generated video. Variants produce new takes, crop_bounds selects an input region, and quality is an image parameter.',
    },
  ],
  statements: [
    { text: 'GPT-image deployments can return image URLs when you set response_format to url.', isTrue: false, explanation: 'The gpt-image series returns base64 only.' },
    { text: 'The edits endpoint can accept multiple reference images together with a prompt.', isTrue: true, explanation: 'Text plus image inputs are supported, enabling compositions from several references.' },
    { text: 'Sora 2 video generation is a synchronous API call that returns the MP4 in the response body.', isTrue: false, explanation: 'It is an asynchronous jobs API: create the job, poll for status, then download the content.' },
    { text: 'Sora 2 can generate audio in the output video.', isTrue: true, explanation: 'Audio generation is supported, similar to the consumer Sora app.' },
    { text: 'Content filtering can be disabled to let Sora 2 generate footage of a real celebrity.', isTrue: false, explanation: 'Sora 2 blocks photorealistic people and IP-protected content; these protections are built in.' },
    { text: 'Generated images from Foundry models include Content Credentials based on the C2PA standard.', isTrue: true, explanation: 'Microsoft attaches signed provenance manifests and invisible watermarks to supported generated media.' },
    { text: 'GPT-Image-1 can be deployed by anyone without an access application.', isTrue: false, explanation: 'GPT-Image-1, 1.5 and 1-Mini are limited-access preview models; the GA 2.5 models do not require an application.' },
  ],
  resources: [
    { label: 'Azure OpenAI image generation models', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/dall-e' },
    { label: 'Video generation with Sora 2 (preview)', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/video-generation' },
    { label: 'Use the image generation tool in Foundry Agent Service', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/image-generation' },
    { label: 'Content provenance for Foundry models', url: 'https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/content-safety/provenance-disclosure' },
  ],
};

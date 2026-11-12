import type { Concept } from '../../types';

export const reliablePromptsAndCheckpoints: Concept = {
  id: 'reliable-prompts-and-checkpoints',
  title: 'Writing Prompts and Instructions That Produce Reliable Outputs, and Reverting with Checkpoints',
  summary:
    'A business-friendly method for prompts that behave the same way every time: specify the information the response must contain (tone, coherence, creativity), define the data and input variables, fix the structure and length, and know how to roll back with checkpoints when an agent goes the wrong way.',
  certs: ['gh-700', 'gh-300'],
  domains: ['gh-700-2', 'gh-300-4'],
  outcomes: ['gh-700-2-2-1', 'gh-700-2-2-2', 'gh-700-2-2-3', 'gh-700-2-2-4', 'gh-300-4-1-4'],
  tags: ['prompt-engineering', 'instructions', 'structured-output', 'checkpoints', 'rewind'],
  difficulty: 'intermediate',
  diagram: 'structured-output-flow',
  sections: [
    {
      heading: 'Define what the response must contain',
      body: `Reliable prompts state the **qualities** of the answer, not just the topic. GitHub's prompt guidance is to start general, then get specific, putting the most important requirements first, because the model weights the start and end of a prompt most heavily. For business output that means spelling out:

- **Sentiment and tone**: "neutral and factual", "encouraging but honest about risks", "formal for an executive audience". If you need the model to classify sentiment, say what scale to use (positive / neutral / negative).
- **Coherence**: "one argument per paragraph", "keep terminology consistent with the glossary in /docs/terms.md", "do not contradict the source documents".
- **Creativity**: say whether you want conservative, source-bound output ("use only the provided feedback; do not invent examples") or divergent thinking ("propose five unconventional options, then rank them"). Lower creativity and a clear stopping condition reduce hallucination and scope drift.
- **Audience and purpose**: who reads it and what decision it supports.

State rules directly ("Return the result as a table") rather than as meta-instructions ("Remember to always use tables"), avoid ambiguous references such as "this", and give **examples** of the output you want. Guidance that applies every time belongs in **custom instructions**; task-specific procedures belong in a **skill** or **prompt file** so the prompt itself stays short.`,
    },
    {
      heading: 'Define the data to act on and the input variables',
      body: `Most unreliable results come from the model guessing *which* data you meant. Make the inputs explicit:

- **Point at the source**: attach files with \`@\` (GitHub.com, Copilot app) or \`@path\` (CLI), reference issues and pull requests with \`#number\`, or name the repository, branch and folder. For project work in the Copilot app, add material to the project **Library** and say "use only the documents in the library".
- **Scope the range**: "issues closed in the last 14 days", "rows where Region = EMEA", "pull requests labelled customer-impact".
- **Name input variables** so the same prompt can be reused: in a prompt file or skill write placeholders such as \`{{quarter}}\` or \`REGION\` and explain each; in agentic workflows declare \`workflow_dispatch\` inputs and reference them in the Markdown body; in dynamic workflows pass inputs with \`--args\`.
- **Define the output data contract** when another step will consume the result: field names, units, date format, what to do when data is missing ("write N/A, never estimate").
- **Say what to ignore**: "disregard comments from bots" or "exclude draft pull requests".

For cloud agent tasks, GitHub's advice is to select the repository and base branch, then describe the objective, acceptance criteria and relevant files, attaching screenshots when visual context matters. Break complex requests into smaller tasks and iterate; a prompt that produces a wrong first draft is cheaper to fix than a vague prompt that produces a confident wrong answer.`,
    },
    {
      heading: 'Specify the structure of the response',
      body: `Structure is what makes output reusable in reports, spreadsheets and downstream automations. Specify:

- **Format**: a Markdown table with named columns, a numbered list, JSON with a given schema, or a document following a template file you attach.
- **Length**: "maximum 150 words", "no more than five bullets", "one sentence per item". Length limits also cap tokens.
- **Order and sections**: "Summary, Risks, Decisions needed, Next steps, in that order".
- **Required elements**: citations or links to the issues used, an explicit confidence statement, owners for every action.
- **Stopping condition**: what "done" looks like, so an agent does not continue beyond the goal. Without one, agents add extra commits or refactor unrelated work.

Agentic workflows and dynamic workflows can require agents to return results in a specified format so later steps can parse them, and Copilot will ask an agent to correct the format if needed. Automations that change issues attach a **rationale and confidence level** automatically; you can additionally ask the agent to "suggest rather than apply" changes so they wait for your review. When the output will be read by executives, add "lead with the recommendation, then the evidence".`,
    },
    {
      heading: 'Revert changes by using checkpoints',
      body: `Checkpoints let you undo an agent's work without losing the whole session. In **Copilot CLI** every user turn is a **rewind point**:

- When Copilot is idle and the input box is empty, press **Esc twice**, or type \`/undo\` (alias \`/rewind\`), to open the rewind picker listing recent turns with how many lines each changed.
- Choose **Conversation only** (roll back the chat, keep files) or **Conversation + files** (also restore the files Copilot changed in that turn and later turns). Copilot shows a per-file preview first and skips any file you edited yourself afterwards.
- The rewind is applied to the state *before* Copilot started the selected prompt, and the prompt is placed back in the input so you can edit and resubmit.
- Rewinding **cannot be undone**; use \`/fork\` first if you want to keep a copy. It is unavailable for remote-backed sessions or while work is in progress, and files over 10 MB or turns changing more than 500 files are not captured. \`/session checkpoints\` lists them.

Elsewhere: **dynamic workflows** can pause at a checkpoint so you review results and resume later; **Copilot cloud agent** does not rewind individual turns, so you stop the session, start a new task, or push commits that revert the change; and because every agent change lands on a branch, **Git** (\`git revert\`, closing the pull request) is the universal fallback. Cancelling (\`Ctrl+C\`, or Esc twice while working) stops new work but does not undo completed changes; that is what rewind is for.`,
    },
  ],
  examples: [
    {
      title: 'A customer-feedback summary that comes out the same every week',
      description:
        'A product manager stores this prompt as a skill so the Monday summary is consistent. It fixes the data (library documents only), the qualities (neutral, no invented examples), the structure (table plus three questions) and the length.',
      language: 'markdown',
      code: `Using only the feedback documents in this project's library from the last 7 days:
1. Group the feedback by theme. For each theme give: Theme | Count | Representative quote | Severity (Low/Medium/High).
2. Keep the table to at most 8 rows and quotes to one sentence.
3. Below the table, list exactly three questions we should investigate.
Tone: neutral and factual. Do not invent examples or extrapolate beyond the documents.
Stop when the table and three questions are complete.`,
      takeaway: 'Qualities, data scope, structure, length and a stopping condition together make a prompt reproducible.',
    },
    {
      title: 'Vague prompt, confident nonsense (a realistic mistake)',
      description:
        'An analyst asks Copilot Chat, "Summarise the issues and tell me what\'s important." Copilot picks an arbitrary set of issues, writes 800 words and invents priorities. The fix is to attach the project or filter ("open issues labelled customer-impact updated in the last 30 days"), define importance ("rank by number of linked support tickets"), set the structure ("a five-row table") and the length ("under 200 words").',
      takeaway: 'Ambiguity about data and criteria is the main cause of unreliable output; define both before asking for a format.',
    },
    {
      title: 'Rolling back a bad turn in Copilot CLI',
      description:
        'An operations lead asks Copilot CLI to "tidy the runbook folder" and it renames twenty files, breaking links. Instead of fixing links by hand, she presses Esc twice, selects the "tidy the runbook folder" rewind point, chooses Conversation + files, reviews the per-file preview and confirms. The files are restored, the prompt reappears in the input box, and she resubmits it with "do not rename files; only fix headings".',
      language: 'text',
      code: `Esc Esc            -> rewind picker (Copilot idle, input empty)
/undo or /rewind   -> same picker
Conversation only  | Conversation + files (skips files you edited after the turn)
Verify:  ! git status`,
      takeaway: 'Rewind to the turn before the mistake, restore files, and re-run with a tighter prompt.',
    },
  ],
  keyPoints: [
    'State the qualities of the answer: tone or sentiment, coherence rules, how creative versus source-bound to be, and the audience.',
    'Put the most important requirements first, give examples, avoid ambiguous references, and state rules directly rather than as reminders.',
    'Define the data explicitly: attach or reference sources (@ mentions, #numbers, library files), scope the range, name input variables for reuse, and say what to ignore.',
    'Specify structure and length: table columns, JSON schema, section order, maximum words or bullets, required citations, and a stopping condition.',
    'In Copilot CLI, Esc twice or /undo (/rewind) opens the rewind picker; choose Conversation only or Conversation + files; rewinds cannot be undone, so /fork first if unsure.',
    'Rewind restores only files Copilot changed and skips files you edited afterwards; it is unavailable for remote-backed sessions or while work is in progress.',
    'Cloud agent sessions cannot rewind turns: stop the session or revert through Git and the pull request; dynamic workflows can pause at checkpoints and resume.',
  ],
  flashcards: [
    { front: 'Where in a prompt does the model give the most weight?', back: 'The beginning and the end, so put the most important requirements first (and restate the key constraint last if needed).' },
    { front: 'How do you reduce invented content in a summary prompt?', back: 'Scope the data ("use only the attached documents"), lower creativity ("do not extrapolate"), require citations, and set a stopping condition.' },
    { front: 'Give three ways to define the data an agent should act on.', back: 'Attach or reference sources (@file, #issue, library), scope a range or filter (dates, labels, regions), and state what to ignore (bots, drafts).' },
    { front: 'What is an input variable in a reusable prompt or workflow?', back: 'A named placeholder (for example {{quarter}} in a skill, or a workflow_dispatch input) that is filled in at run time so the same instructions work for different inputs.' },
    { front: 'Why specify a maximum length?', back: 'It makes output predictable for its audience and caps tokens, reducing cost.' },
    { front: 'What is a stopping condition and why does it matter for agents?', back: 'A description of what "done" looks like; without it agents may keep adding commits or expanding scope.' },
    { front: 'How do you open the rewind picker in Copilot CLI?', back: 'Press Esc twice while Copilot is idle with an empty input box, or type /undo (alias /rewind).' },
    { front: 'What is the difference between "Conversation only" and "Conversation + files"?', back: 'Conversation only removes later turns but leaves files; Conversation + files also restores files Copilot changed (skipping files you edited yourself).' },
    { front: 'Can a rewind in Copilot CLI be undone?', back: 'No. Later history is permanently removed; use /fork first to keep a copy.' },
    { front: 'Can you rewind a Copilot cloud agent session turn by turn?', back: 'No. You can stop or archive the session and start a new task; revert code through Git and the pull request.' },
  ],
  quiz: [
    {
      question:
        'A product manager wants a weekly stakeholder update that is always neutral in tone, never speculates beyond the linked issues, and fits on one screen. Which prompt element is MISSING from "Write this week\'s update from issues labelled release-2026-q1"?',
      options: [
        'A model name',
        'Explicit qualities (neutral tone, no speculation) and a structure with a length limit',
        'A request to run in Autopilot mode',
        'An MCP server for the issue tracker',
      ],
      correct: [1],
      explanation:
        'The data is defined, but tone, creativity bounds and structure/length are not. Model choice, session mode and MCP do not make the content requirements explicit.',
    },
    {
      question:
        'An analyst wants the same vendor-report prompt to work for any region and quarter without rewriting it. What should she do?',
      options: [
        'Ask Copilot to remember the region each time',
        'Store the prompt as a skill or prompt file with named placeholders for region and quarter and explain each',
        'Create a separate repository for each region',
        'Increase the model\'s reasoning level',
      ],
      correct: [1],
      explanation:
        'Named input variables in a reusable skill or prompt file make the prompt parameterised. Memory is not a substitute for explicit inputs, separate repositories add overhead, and reasoning level does not define inputs.',
    },
    {
      question:
        'In Copilot CLI, an agent turn renamed dozens of files. You want to restore the files and the conversation to the state before that turn, but keep a copy of the current session in case you need it. Which sequence is correct?',
      options: [
        'Press Ctrl+C, then git push',
        'Run /fork, then /undo and choose Conversation + files for the turn before the renames',
        'Run /clear to start a new session; files are restored automatically',
        'Run /compact to summarise the mistake, then continue',
      ],
      correct: [1],
      explanation:
        '/fork keeps a copy because rewinds cannot be undone; /undo (or Esc twice) with Conversation + files restores the files. Ctrl+C only cancels in-progress work, /clear does not restore files, and /compact only shrinks context.',
    },
    {
      question:
        'Which TWO statements about the Copilot CLI rewind feature are correct? (Select two)',
      options: [
        'Files you edited yourself after the turn are left untouched during a restore',
        'Rewind is available while Copilot is still working on a task',
        'Rewind is unavailable for remote-backed sessions',
        'Rewinding can be reversed with /redo',
      ],
      correct: [0, 2],
      explanation:
        'Restores skip files whose contents no longer match what Copilot wrote, and remote-backed sessions do not support rewind. Rewind requires an idle session and cannot be undone; there is no /redo.',
    },
    {
      question:
        'A business analyst needs an agent\'s output to be loaded into a spreadsheet by a later automation step. Which instruction MOST improves reliability?',
      options: [
        '"Be creative with the layout so it looks good"',
        '"Return a table with exactly these columns: Vendor, Region, Spend (USD, integer), Contract end (YYYY-MM-DD); write N/A for missing values"',
        '"Summarise as you see fit"',
        '"Use the most capable model available"',
      ],
      correct: [1],
      explanation:
        'A fixed data contract (columns, units, formats, missing-value rule) is what downstream steps can parse. Creativity and open-ended summaries are the opposite of reliable structure, and model choice does not define the format.',
    },
  ],
  statements: [
    { text: 'The model gives extra weight to instructions at the beginning and end of a prompt.', isTrue: true, explanation: 'GitHub\'s prompt engineering guidance recommends putting the most important requirements first.' },
    { text: 'Writing "Remember to always return a table" is more reliable than "Return the result as a table".', isTrue: false, explanation: 'State rules directly rather than as meta-instructions.' },
    { text: 'A stopping condition tells the agent what "done" looks like and helps prevent scope drift.', isTrue: true, explanation: 'Without one, agents may add extra commits or refactor unrelated code.' },
    { text: 'Pressing Esc twice while Copilot CLI is actively working opens the rewind picker.', isTrue: false, explanation: 'While working, a double Esc cancels the operation; the rewind picker opens only when Copilot is idle and the input is empty.' },
    { text: 'Copilot cloud agent lets you rewind individual turns of a session.', isTrue: false, explanation: 'Cloud agent sessions can be stopped or archived and new tasks started, but turns cannot be rewound.' },
    { text: 'Dynamic workflows can pause at a checkpoint so you can review results before resuming.', isTrue: true, explanation: 'Pausing and resuming runs, with saved results reused, is a documented dynamic workflow capability.' },
  ],
  resources: [
    { label: 'Prompt engineering for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering' },
    { label: 'Canceling operations and rolling back changes in GitHub Copilot CLI', url: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/roll-back-changes' },
    { label: 'Custom instructions for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/custom-instructions' },
  ],
};

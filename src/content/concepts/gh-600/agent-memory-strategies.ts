import type { Concept } from '../../types';

export const agentMemoryStrategies: Concept = {
  id: 'agent-memory-strategies',
  title: 'Agent Memory: Short-Term Context, Long-Term Memory and External Stores',
  summary:
    'How to choose between the context window (short-term), Copilot Memory and instruction files (long-term) and external stores such as the repository, issues and MCP-connected systems; how to scope memory to the task; how compaction, large-output handling, pruning and reset rules keep context useful; and how to refine memory usage when evaluation shows the agent forgetting or over-remembering.',
  certs: ['gh-600'],
  domains: ['gh-600-3', 'gh-600-4'],
  outcomes: ['gh-600-3-1-1', 'gh-600-3-1-2', 'gh-600-3-1-3', 'gh-600-4-3-2'],
  tags: ['memory', 'context-window', 'copilot-memory', 'compaction', 'custom-instructions', 'pruning'],
  difficulty: 'intermediate',
  diagram: 'context-window',
  sections: [
    {
      heading: 'Three kinds of memory and what each is for',
      body: `An agent has no memory beyond what you give it. The exam separates three stores:

| Kind | On GitHub | Lifetime | Best for |
|---|---|---|---|
| **Short-term (working) memory** | The context window of the current session: system instructions, tool definitions, your messages, the agent's responses, tool calls and results | One session (or until compaction summarises it) | The task in hand, intermediate results, the plan being executed |
| **Long-term memory** | **Copilot Memory** (repository-level facts shared with collaborators; user-level preferences that follow you), plus instruction files (\`.github/copilot-instructions.md\`, path-specific instructions, \`AGENTS.md\`, organisation instructions) and custom agent profiles | Across sessions and surfaces | Conventions, architectural decisions, build and test commands, how you like to work |
| **External memory** | The repository itself (code, docs, plans committed to a branch), issues and pull requests, session logs, Copilot Spaces, data behind MCP servers and connectors | Governed by the owning system | Facts too large or too authoritative for a prompt, durable task state, shared knowledge across agents |

Choosing between them follows a simple rule: put a fact where its *scope* and *lifetime* match. "This repository uses Vitest" is a repository-level fact: every collaborator and every agent benefits, and it stays true until the code changes. "Explain before you apply" is a user-level preference. "Step 3 of this plan is done" is task state and belongs in a durable artifact on the branch or in the pull request, not in anyone's memory. The current failing test output is short-term and should fall out of context once it is resolved.

Copilot Memory is created by Copilot itself as a by-product of work, with citations to supporting code; you can also ask it to remember something, but storage is not guaranteed, so for instructions you need followed every time use custom instructions instead.`,
    },
    {
      heading: 'Scoping memory to task-relevant information',
      body: `More memory is not better memory. Every token in context competes with the task, and stale or irrelevant facts cause confident mistakes. Scoping techniques on GitHub:

- **Path-specific instructions** (\`.github/instructions/NAME.instructions.md\` with an \`applyTo\` glob) load conventions only for the files they concern, instead of overloading the repository-wide file.
- **Custom agents** carry role-specific prompts (up to 30,000 characters) and tool lists, so a test-writer never sees deployment guidance. In Copilot CLI, repository instructions are included for the session agent but not for custom subagents by default.
- **Subagents** run in their own context window and return only a result, which keeps research output, long file dumps and exploratory dead ends out of the main conversation.
- **Copilot Memory scoping** is built in: repository-level facts apply only to operations on that repository (not pooled across an organisation, not copied to forks), and Copilot checks a fact's citations against the current branch before relying on it. User-level preferences apply across your repositories. Only the root agent in Copilot CLI can store or vote on memories; subagents can use them.
- **Session context selection** on GitHub.com: attach the specific repository, branch, file, issue or Space rather than "all repositories".
- **Large tool outputs**: Copilot CLI saves outputs above 20 KiB to a temporary file and gives the model a preview plus the path (\`COPILOT_LARGE_OUTPUT_THRESHOLD_BYTES\` adjusts this), and you can ask the agent to truncate or summarise noisy command output.

The exam tests the judgment: if an agent keeps applying a convention from another module, the fix is path-scoped instructions or a narrower custom agent, not a longer global instruction.`,
    },
    {
      heading: 'Expiration, pruning and reset rules',
      body: `Memory needs lifecycle rules just like data:

- **Compaction** handles the short-term store. In Copilot CLI, when a conversation reaches roughly 80% of the context window the CLI compacts in the background: it snapshots the conversation, asks the model for a structured summary (goals, what was done, key technical details, important files, next steps), and replaces the history with the summary plus the original instructions and the current plan or to-do state. You can trigger it with \`/compact\` before a new phase of work and check usage with \`/context\`. Compaction is available in the CLI, the Copilot app, the cloud agent and most IDEs. What it does not preserve is exact wording and fine detail, so anything that must survive verbatim should be written to a file first.
- **Reset** means a fresh session. Start one when the task changes, when compaction has happened several times, or when the agent is confused by earlier dead ends. Durable state should already be in artifacts, so a reset costs little.
- **Pruning long-term memory**: repository-level facts can be viewed and deleted in repository settings by users with write access; user-level preferences can be reviewed and deleted by the user, and exported or deleted by organisation or enterprise owners in bulk. Copilot reinforces or reconciles memories rather than duplicating them, and judges whether a cited fact still holds on the current branch. Instruction files are pruned like code: review them in pull requests and delete rules that no longer apply.
- **Policy-driven expiry and opt-out**: the *Copilot Memory* policy (enterprise: let organisations decide, enabled everywhere, disabled everywhere; organisation: enabled/disabled) controls user-level preferences; repository-level facts have separate repository access controls; individuals can opt out, and \`/memory off\` disables both types for the CLI client. Memory is only created when the applicable settings allow it.
- **Session data retention**: GitHub Actions-based cloud sessions retain chat data for 28 days; cloud sandbox sessions retain it for the life of the account; local sessions live under \`~/.copilot/session-state/\` and can be deleted or archived.`,
    },
    {
      heading: 'Refining memory usage from evaluation results',
      body: `When evaluation (see the evaluation concepts) shows memory-related failure modes, tune the store rather than the prompt:

| Symptom | Likely cause | Refinement |
|---|---|---|
| Agent "forgets" a decision mid-session | Compaction summarised it away, or the session ran long | Write decisions to a plan file on the branch; \`/compact\` at phase boundaries; split work into sessions |
| Agent applies an outdated convention | Stale repository fact or instruction | Delete the memory in repository settings; update or remove the instruction; rely on citations against the current branch |
| Agent follows one person's habits in a shared repository | A user-level preference leaked into expectations | Move genuinely shared rules into repository instructions; keep preferences personal |
| Agent behaviour differs across surfaces | Memory type unsupported or disabled on one surface; instructions file unsupported there | Check support tables for instruction types; use repository-level facts and instructions that all surfaces read |
| Context fills with tool noise | Large outputs, verbose tests | Lower the large-output threshold, ask for summaries, delegate research to a subagent |
| Important rule ignored intermittently | Stored as a memory (not guaranteed) rather than an instruction | Promote it to a custom instruction or hook |

The exam angle: "refine memory usage" means choosing the right store and lifecycle. A memory that must be reliable becomes an instruction or hook; a fact that must be shared becomes a repository-level fact or an instructions file; state that must survive becomes an artifact; everything else is allowed to expire.`,
    },
  ],
  examples: [
    {
      title: 'Choosing the right store for three facts',
      description:
        'A team reviewing a cloud agent session notices three things worth keeping: the repository uses uv for Python dependencies, the tech lead wants explanations before edits, and migration 0042 has already been applied in the agent\'s branch. They put each in the store that matches its scope and lifetime.',
      language: 'markdown',
      code: `1. "This repository uses uv; run \`uv run pytest\`."
   -> Repository-level instruction (.github/copilot-instructions.md) so every
      surface follows it every time. Copilot may also store it as a
      repository-level fact with a citation.

2. "Explain your changes before applying them."
   -> User-level preference: prompt Copilot "Remember that across all my
      projects you should explain changes before applying them."

3. "Migration 0042 applied; next is the model change in orders/models.py."
   -> Task state: docs/plans/ISSUE-88.md on the branch, updated by the agent,
      plus a checklist in the PR description. Not a memory.`,
      takeaway: 'Match each fact to the store whose scope and lifetime fit; instructions for must-follow rules, memory for learned facts, artifacts for state.',
    },
    {
      title: 'Path-scoped instructions instead of one overloaded file',
      description:
        'The repository-wide instructions had grown to cover frontend, backend and infrastructure rules, and the agent kept applying React conventions to Terraform. The team splits the rules into path-specific files so only relevant guidance loads for each task.',
      language: 'markdown',
      code: `# .github/instructions/terraform.instructions.md
---
applyTo: "infra/**/*.tf"
---
- Run \`terraform fmt\` and \`terraform validate\` before finishing.
- Never change \`backend\` blocks or state configuration.
- Tag every resource with \`owner\` and \`cost-center\`.

# .github/instructions/frontend.instructions.md
---
applyTo: "web/src/**/*.{ts,tsx}"
---
- Components are function components with hooks; no class components.
- Tests use Vitest and Testing Library; colocate as *.test.tsx.`,
      takeaway: 'Scope long-term memory to the files it concerns so the context window carries only what the task needs.',
    },
    {
      title: 'The "remember this" mistake and the fix',
      description:
        'A developer asks Copilot to "remember to never touch the generated OpenAPI client" and assumes the rule is now enforced. Weeks later the cloud agent edits api/generated/client.go. Memories are stored at the model\'s discretion and are not guaranteed to be used. The fix is to promote the rule to a repository instruction ("Do not edit files under api/generated/; change openapi.yaml") and, because the boundary matters, to add a preToolUse hook that denies edits under that path.',
      takeaway: 'Copilot Memory is a learning aid, not an enforcement mechanism; rules that must hold become instructions or hooks.',
    },
  ],
  keyPoints: [
    'Short-term memory is the context window (instructions, tool schemas, messages, tool results); long-term memory is Copilot Memory plus instruction files and agent profiles; external memory is the repository, issues/PRs, Spaces and MCP-connected systems.',
    'Copilot Memory has two types: repository-level facts (shared, cited to code, scoped to that repository) and user-level preferences (personal, cross-repository); both are governed by policies and can be deleted.',
    'Storing a memory is not guaranteed and neither is its use; rules that must always apply belong in custom instructions or hooks.',
    'Scope memory with path-specific instructions (applyTo), role-specific custom agents, subagents with their own context, precise session context and large-output handling.',
    'Compaction summarises conversation history (CLI at roughly 80% of the window; /compact on demand; /context to inspect) and does not preserve exact wording, so persist important decisions to files first.',
    'Prune long-term memory in repository settings (facts) and user settings (preferences); administrators can export or delete user preferences; /memory off disables memory for the CLI client.',
    'Refine memory usage from evaluation: promote unreliable memories to instructions, delete stale facts, move shared rules out of personal preferences, split long sessions.',
  ],
  flashcards: [
    { front: 'What fills an agent\'s context window?', back: 'System instructions and tool definitions, your messages, the agent\'s responses, and every tool call with its result.' },
    { front: 'What are the two types of Copilot Memory?', back: 'Repository-level facts (shared with collaborators, cited to code, scoped to the repository) and user-level preferences (personal, follow you across repositories).' },
    { front: 'Is a memory you ask Copilot to store guaranteed to be used later?', back: 'No. The model decides whether to store and when to use it; use custom instructions for rules that must apply consistently.' },
    { front: 'Which CLI command shows context usage and which compacts it?', back: '/context shows usage by category; /compact triggers compaction (automatic at about 80% in the CLI).' },
    { front: 'What does compaction NOT preserve?', back: 'Exact wording and fine detail of earlier messages; it keeps a structured summary, original instructions and the current plan or to-do state.' },
    { front: 'How do you make instructions apply only to certain files?', back: 'Path-specific instructions in .github/instructions/NAME.instructions.md with an applyTo glob.' },
    { front: 'Are repository-level facts copied when a repository is forked?', back: 'No. They are not pooled across an organisation either; user-level preferences can still apply in the fork.' },
    { front: 'Who can delete repository-level facts?', back: 'Users with write access to the repository (with user-level preferences enabled for their account), via repository settings.' },
    { front: 'Which agent in Copilot CLI can store memories?', back: 'Only the root agent; subagents can use memories but cannot change the memory store.' },
    { front: 'How large can a tool output be before Copilot CLI saves it to a file instead of context?', back: '20 KiB by default; adjust with COPILOT_LARGE_OUTPUT_THRESHOLD_BYTES.' },
  ],
  quiz: [
    {
      question:
        'A rule says "never edit files under api/generated/". A developer asked Copilot to remember it, yet the cloud agent later edited a generated file. What is the MOST appropriate fix?',
      options: [
        'Ask Copilot to remember the rule again with stronger wording.',
        'Add the rule to .github/copilot-instructions.md and enforce the boundary with a preToolUse hook.',
        'Disable Copilot Memory for the organisation.',
        'Increase the context window by choosing a larger model.',
      ],
      correct: [1],
      explanation:
        'Memories are not guaranteed to be stored or applied; instructions plus a hook make the rule reliable and enforced. Disabling memory and changing models do not address the gap.',
    },
    {
      question:
        'The agent keeps applying React conventions when editing Terraform files because the repository-wide instructions file covers everything. Which change scopes memory correctly?',
      options: [
        'Move the Terraform rules into a path-specific .github/instructions/terraform.instructions.md with applyTo: "infra/**/*.tf".',
        'Duplicate all rules into AGENTS.md as well.',
        'Store the Terraform rules as a user-level preference.',
        'Ask the agent to ignore irrelevant rules.',
      ],
      correct: [0],
      explanation:
        'Path-specific instructions load only for matching files. Duplication adds noise, user preferences are personal rather than shared, and asking the agent to ignore rules is unreliable.',
    },
    {
      question:
        'Which TWO statements about Copilot Memory are correct? (Select two)',
      options: [
        'Repository-level facts apply only to operations on that repository and carry citations to supporting code.',
        'User-level preferences follow the user across repositories.',
        'Repository-level facts are automatically pooled across all repositories in an organisation.',
        'Subagents in Copilot CLI can write new memories.',
      ],
      correct: [0, 1],
      explanation:
        'Facts are repository-scoped and cited; preferences are personal and cross-repository. Facts are not pooled across an organisation, and only the root agent stores memories.',
    },
    {
      question:
        'During a two-hour Copilot CLI session the agent forgets a design decision made early on. What happened and what should you do next time?',
      options: [
        'The model was downgraded; switch models.',
        'Compaction summarised the history; write decisions to a plan file on the branch and use /compact at phase boundaries or split the work into sessions.',
        'Memory was disabled by policy; enable it.',
        'The firewall blocked the memory service; add it to the allowlist.',
      ],
      correct: [1],
      explanation:
        'Long sessions are compacted and fine detail is lost; durable artifacts preserve decisions. Model choice, memory policy and the firewall do not explain lost in-session detail.',
    },
    {
      question:
        'A compliance team wants to review and bulk-delete the personal memories Copilot has stored for members of an organisation. Who can do this and where?',
      options: [
        'Only each individual user, in their personal settings.',
        'Organisation or enterprise owners can export or delete members\' user-level preferences in bulk or per user.',
        'Repository administrators, in repository settings.',
        'Nobody; memories cannot be deleted.',
      ],
      correct: [1],
      explanation:
        'On Business and Enterprise plans user-level preferences are owned by the billing entity and administrators can export or delete them. Repository settings manage repository-level facts, and individuals can delete their own preferences too.',
    },
  ],
  statements: [
    { text: 'The context window holds tool definitions as well as the conversation.', isTrue: true, explanation: 'System instructions and tool schemas occupy a fixed portion of the window.' },
    { text: 'Copilot Memory guarantees that a stored rule is applied in every future session.', isTrue: false, explanation: 'Storage and use are at the model\'s discretion; use custom instructions for consistency.' },
    { text: 'Compaction in Copilot CLI starts automatically at around 80% of the context window.', isTrue: true, explanation: 'A buffer of about 20% is kept so tool calls can continue during compaction.' },
    { text: 'Forking a repository copies its stored repository-level facts to the fork.', isTrue: false, explanation: 'Facts are not copied to forks or pooled across an organisation.' },
    { text: 'Only the root agent in Copilot CLI can store or vote on memories.', isTrue: true, explanation: 'Subagents can use relevant memories but cannot change the store.' },
    { text: 'The Copilot Memory policy at the enterprise level controls repository-level facts.', isTrue: false, explanation: 'The policy governs user-level preferences; repository-level facts have separate repository access controls.' },
    { text: 'GitHub Actions-based cloud sessions retain chat data for 28 days.', isTrue: true, explanation: 'Cloud sandbox sessions retain data for the life of the account.' },
  ],
  resources: [
    { label: 'About GitHub Copilot Memory', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/copilot-memory' },
    { label: 'Managing context for GitHub Copilot (context window and compaction)', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/context-management' },
    { label: 'Manually creating memories for GitHub Copilot', url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/copilot-memory/create-memories' },
    { label: 'Managing Copilot Memory for an enterprise, organization, or repository', url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/copilot-memory/manage-as-administrator' },
  ],
};

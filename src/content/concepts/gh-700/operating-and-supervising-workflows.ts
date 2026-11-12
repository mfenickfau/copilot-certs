import type { Concept } from '../../types';

export const operatingAndSupervisingWorkflows: Concept = {
  id: 'operating-and-supervising-workflows',
  title: 'Operating Agentic Workflows: Approvals, Steering, Failure Recovery, Stopping and Monitoring',
  summary:
    'The day-to-day human-in-the-loop job: responding to approvals, rejections and revision requests, steering a workflow while it runs, resolving failures, stopping runs cleanly, and then supervising: checking outputs against requirements and monitoring runs, usage and quality over time.',
  certs: ['gh-700', 'gh-600'],
  domains: ['gh-700-4', 'gh-600-4'],
  outcomes: ['gh-700-4-2-1', 'gh-700-4-2-2', 'gh-700-4-2-3', 'gh-700-4-2-4', 'gh-700-4-3-1', 'gh-700-4-3-2', 'gh-700-4-3-3', 'gh-600-4-2-1'],
  tags: ['approvals', 'steering', 'session-logs', 'monitoring', 'failures', 'stop-session'],
  difficulty: 'intermediate',
  diagram: 'eval-loop',
  sections: [
    {
      heading: 'Responding to requests: approvals, rejections and revisions',
      body: `Agentic workflows pause for people in predictable places; your job is to answer quickly and consistently.

- **Approvals panel on an issue.** Changes held by the automation level, or that the agent was told to suggest, appear with the proposed change, its **rationale** and **confidence**. **Accept** applies it immediately, **Decline** dismisses it, and **Accept all** / **Decline all** handle the batch. Find waiting items with \`is:issue is:open has:suggestions\`.
- **Plans.** In Plan mode, review the plan, ask for revisions in plain language until it matches your requirements, then **Accept plan** (optionally continuing in Autopilot).
- **Permission requests.** In the CLI or app a dialog asks before a tool runs; approve, approve for the session, or press **Esc** to deny. The Copilot app's project Overview collects these under **Needs input**.
- **Pull requests.** Review a Copilot pull request like any contribution: read the diff, check the session log link in the commits, click **Approve and run workflows** only if you are comfortable with the changes (watch for edits under \`.github/workflows\`), then approve, request changes, or comment \`@copilot\` with revision instructions. Remember your approval does not count toward required approvals if you requested the work.
- **Proposed improvements.** Automations may propose changes to their own prompt, triggers or tools; apply or dismiss them from the automation's page.
- **Clarifying questions** from a running session: answer in the prompt box; unanswered questions stall the work.

Give feedback as you go with thumbs up or down on Copilot pull requests and comments; it improves quality and leaves a record of why something was rejected.`,
    },
    {
      heading: 'Interacting with a workflow while it runs',
      body: `You do not have to wait for an agent to finish before correcting it. **Steering** sends a follow-up prompt into an active session: on GitHub, open the session from the Agents tab or github.com/copilot and type below the log ("Use the existing ErrorHandler utility instead of custom try-catch blocks"); Copilot applies the input after its current tool call. Each steering message consumes AI credits, and steering is not available for third-party coding agents. The same session can be steered from the Copilot app, GitHub Mobile or the CLI when it runs in a cloud sandbox, and from the project Overview's **Steer this session** box in the app.

In Copilot CLI you can queue prompts while the agent works, cycle modes with \`Shift+Tab\`, refocus Autopilot with \`/autopilot NEW OBJECTIVE\` (\`/goal\`), and watch the sessions sidebar for **!** (permission needed) and **?** (question) markers. For dynamic workflows, \`/workflows\` (or the Workflows button in the app) shows phases, progress, subagents and AI credit use, and lets you **pause** a run and later **resume** it, reusing saved results.

Steering is for course corrections; if the original prompt was wrong in substance, it is usually cheaper to stop the session and start again with a better prompt.`,
    },
    {
      heading: 'Resolving failures and stopping a running workflow',
      body: `**Diagnose first.** Open the **session log**: it shows reasoning, tool calls and errors. For agentic workflows the Actions run log plus \`gh aw logs\` (recent runs with duration, tokens, estimated cost) and \`gh aw audit RUN-ID\` (one run in detail) are the equivalents. Common causes map to fixes:

| Symptom | Likely cause | Fix |
|---|---|---|
| Agent could not perform an action | Missing tool, permission or safe output | Grant the specific tool or safe output; check Agents secrets and MCP server availability |
| Run stopped early | Per-run credit, turn or time limit reached | Review the partial output; raise the limit deliberately or narrow the scope |
| Wrong or inconsistent output | Vague prompt, missing data, wrong model | Tighten criteria and structure; attach sources; adjust model or reasoning |
| Workflow failed at compile or check | Lock file out of date, frontmatter error | \`gh aw compile\`, commit both files, re-run checks |
| Pull request checks failing | Agent code broke CI | \`/pr-fix-checks\` in the app, comment \`@copilot\` with the failure, or enable **Agent Merge: Watch and fix** |
| Repeated corrections across sessions | Missing repository knowledge | Run \`/chronicle improve\` and update custom instructions |

**Stopping.** On GitHub, click **Stop session** in the session log viewer; this ends the GitHub Actions run and preserves any commits already pushed; archive the stopped session afterwards. In Copilot CLI, **Esc twice** (or **Ctrl+C**) cancels the current operation; Ctrl+C also clears queued prompts, and a second Ctrl+C exits the session. In the Copilot app use the session controls, and for dynamic workflows cancel or pause from \`/workflows\`. For agentic workflows, cancel the run in the **Actions** tab and, if needed, disable the workflow; for automations, **Disable** to pause future runs. Stopping never undoes completed changes: use rewind (CLI), revert commits, or close the pull request.`,
    },
    {
      heading: 'Ensuring requirements are met and reviewing outputs',
      body: `Supervision starts before the first run. Write down the **requirements**: the deliverable, its structure, the decision criteria, the boundaries and the success measure. Then **test on a small scope**: use **Run now** on an automation against one issue, run a dynamic workflow on two or three files, or trigger an agentic workflow manually before enabling its schedule. Compare the result with the requirements, check actual AI credit usage, and only then widen the scope and set limits based on evidence.

Review outputs with the same rigour as a colleague's work:

- **Pull requests**: read the diff and the description (which names any custom agent used), confirm tests or checks ran, and look for scope creep. Copilot cloud agent already ran CodeQL, dependency and secret scanning and got a Copilot code review, but you remain responsible.
- **Issues and comments**: check that suggested changes carry sensible rationale and confidence; declines are signals to refine criteria.
- **Reports**: verify a sample of claims against the cited issues or pull requests; agents can hallucinate plausible but wrong facts.
- **Format compliance**: does the output follow the required structure so downstream steps can use it?

Record outcomes where the team can see them: a project status update, a comment on the tracking issue, or the automation's revision history. Use \`/rubber-duck\` or \`/review\` for an independent critique when the stakes are high.`,
    },
    {
      heading: 'Monitoring workflow runs over time',
      body: `Monitoring answers three questions: *is it running, is it right, and what does it cost?*

- **Where runs appear.** The repository **Agents tab** lists all cloud agent sessions (shared, with status, token usage and session length); github.com/copilot shows your sessions; the **Automations** pane shows each automation's runs, AI credits consumed and revision history; agentic workflows appear as runs in the **Actions** tab and in \`gh aw logs\`; dynamic workflows in \`/workflows\`.
- **Traceability.** Agent commits are signed, co-authored and link to session logs; audit log events are available to administrators; issue timelines record agent and automation changes.
- **Cost.** Copilot settings show your AI credit usage this cycle; organisation and personal billing pages show usage by model and SKU; budget alerts fire at 75%, 90% and 100%; \`/chronicle cost-tips\` and \`/usage\` give session-level views. Compare spend against the value of the time saved.
- **Quality trends.** Track accepted versus declined suggestions, how often humans had to steer, failed runs and their causes, and review **proposed improvements**. Ask Copilot about your history ("show sessions where the agent needed correction") and run \`/chronicle improve\` to turn friction into instructions.
- **Health.** Keep an eye on disabled or repeatedly failing automations, expiring secrets, MCP servers reporting unavailable, and lock files out of date.

Set a cadence: a quick daily glance at Needs input and failed runs, and a weekly review of outputs, cost and criteria with the process owner.`,
    },
  ],
  examples: [
    {
      title: 'A morning routine for the person who owns triage',
      description:
        'A support operations analyst opens the Agents tab to check overnight automation runs (two succeeded, one stopped at its per-run credit limit). She searches is:issue is:open has:suggestions, accepts eleven label suggestions, declines two with a note, and reads the session log of the stopped run to find that a very long issue body consumed the budget. She raises that automation\'s per-run limit from 60 to 90 credits and adds "summarise issues longer than 2,000 words before classifying" to the prompt, recording both changes in the revision history.',
      takeaway: 'Daily supervision is approvals plus a look at failed or stopped runs, with fixes applied to the prompt or limits rather than by hand each time.',
    },
    {
      title: 'Steering instead of restarting',
      description:
        'A program manager watches a cloud agent session drafting a quarterly report and sees it pulling data from an archived repository. Rather than stopping, she types a steering prompt: "Ignore the archive repository; use only repositories tagged active." Copilot applies it after the current tool call and continues. When the report arrives she verifies three cited figures against the source issues before sharing it.',
      takeaway: 'Steer for course corrections while the run continues; verify a sample of claims before trusting the output.',
    },
    {
      title: 'Approving workflows without reading the diff (a realistic mistake)',
      description:
        'An analyst clicks Approve and run workflows on an agent pull request to get the checks green quickly. The pull request included an edit to a file under .github/workflows that granted broader permissions, and the workflow ran with access to secrets. GitHub\'s guidance is to inspect the changes first and be especially alert to workflow file edits. The fix is to revert the workflow change, review the session log to understand why the agent made it, and tighten the agent\'s instructions and tools so workflow files are out of scope.',
      takeaway: 'Approve and run workflows is a security decision; read the diff, particularly anything under .github/workflows, before clicking.',
    },
  ],
  keyPoints: [
    'Respond to held changes in the issue approvals panel (Accept, Decline, Accept all, Decline all), accept or revise plans in Plan mode, answer permission prompts (Esc denies), and review Copilot pull requests including Approve and run workflows.',
    'Steer a running session with a follow-up prompt from GitHub, the app, mobile or CLI; it applies after the current tool call, consumes credits, and is unavailable for third-party agents.',
    'Diagnose failures with session logs, Actions logs, gh aw logs and gh aw audit; fix the cause (tools, limits, prompt, model, lock file) rather than patching output by hand.',
    'Stop with Stop session on GitHub (ends the Actions run, keeps pushed commits), Esc twice or Ctrl+C in the CLI, cancel in the Actions tab for agentic workflows, Disable for automations; stopping does not undo completed changes.',
    'Ensure requirements by writing them down first, testing on a small scope with Run now, checking real credit usage, then widening scope with limits.',
    'Review outputs like a colleague\'s work: diff and description, checks, rationale and confidence, sampled fact-checks, format compliance; give thumbs up or down feedback.',
    'Monitor runs in the Agents tab, Automations pane, Actions tab and /workflows; track cost via Copilot settings, billing pages and budget alerts; track quality via accepted versus declined suggestions, steering frequency and proposed improvements.',
  ],
  flashcards: [
    { front: 'Where do an agent\'s held issue changes wait, and what actions can you take?', back: 'In the approvals panel on the issue: Accept, Decline, Accept all or Decline all; each shows the proposed change, rationale and confidence.' },
    { front: 'How do you redirect a running Copilot cloud agent session without stopping it?', back: 'Type a follow-up (steering) prompt below the session log; Copilot applies it after its current tool call. Each message consumes AI credits.' },
    { front: 'What does Stop session do on GitHub?', back: 'Ends the GitHub Actions run and preserves any commits already pushed; the stopped session can then be archived.' },
    { front: 'How do you cancel an in-progress operation in Copilot CLI?', back: 'Press Esc twice (first press shows a reminder) or Ctrl+C once; a second Ctrl+C within two seconds exits the session.' },
    { front: 'Which CLI commands inspect agentic workflow runs and cost?', back: 'gh aw logs for recent runs (duration, tokens, estimated AI credits) and gh aw audit RUN-ID for one run in detail.' },
    { front: 'What should you check before clicking Approve and run workflows?', back: 'The proposed changes, especially any edits under .github/workflows, because workflows can be privileged and access secrets.' },
    { front: 'Does your approval count toward required reviews on a pull request you asked Copilot to create?', back: 'No. Another reviewer must approve it.' },
    { front: 'How should you validate a new automation before trusting it?', back: 'Test it with Run now on a small, real scope, compare output with the written requirements, check actual AI credit usage, then set limits and widen scope.' },
    { front: 'Where can you see every cloud agent session in a repository and its token usage?', back: 'The Agents tab (All sessions); clicking a session opens the log with progress, token usage and session length.' },
    { front: 'Which command turns recurring friction in your sessions into better instructions?', back: '/chronicle improve, which analyses sessions for the current repository and proposes updates to .github/copilot-instructions.md.' },
  ],
  quiz: [
    {
      question:
        'A program manager notices a running cloud agent session is summarising the wrong quarter\'s data. The session is otherwise on track. What is the MOST efficient action?',
      options: [
        'Stop the session, archive it and start over',
        'Type a steering prompt telling the agent to use Q3 data; it applies after the current tool call',
        'Wait for the session to finish and edit the report by hand',
        'Lower the repository automation level',
      ],
      correct: [1],
      explanation:
        'Steering redirects an active session without losing its work. Restarting wastes credits, hand-editing hides the problem, and automation level governs issue suggestions, not report content.',
    },
    {
      question:
        'An overnight triage automation stopped partway through its run. The Automations pane shows it reached its per-run AI credit limit. What should the owner do FIRST?',
      options: [
        'Delete the automation and recreate it as personal',
        'Open the session log to understand what consumed the budget, then adjust the prompt scope or the per-run limit deliberately',
        'Set the limit to zero to prevent further waste',
        'Switch the trigger to weekly',
      ],
      correct: [1],
      explanation:
        'Diagnose from the session log, then fix the cause (scope or limit). Recreating the automation loses history, a zero limit is below the minimum and blocks runs, and changing the schedule does not address the per-run cost.',
    },
    {
      question:
        'Which TWO actions correctly stop agentic work in progress? (Select two)',
      options: [
        'Clicking Stop session in the session log viewer on GitHub, which ends the Actions run and keeps pushed commits',
        'Pressing Esc twice in Copilot CLI while the agent is working',
        'Deleting the repository wiki',
        'Running /chronicle reindex',
      ],
      correct: [0, 1],
      explanation:
        'Stop session and a double Esc (or Ctrl+C) are documented stop mechanisms. Wiki deletion and reindexing the session store have nothing to do with running work.',
    },
    {
      question:
        'A business analyst receives a pull request from Copilot cloud agent with failing checks and a change to a file under .github/workflows. What should she do?',
      options: [
        'Click Approve and run workflows immediately so the checks can rerun',
        'Inspect the diff, especially the workflow file change, before deciding whether to run workflows; ask @copilot or use /pr-fix-checks to address the failures',
        'Merge the pull request and fix checks later on main',
        'Approve the pull request herself to satisfy the required review',
      ],
      correct: [1],
      explanation:
        'GitHub advises inspecting changes, with particular care for workflow files, before allowing workflows to run; failures can be delegated back to Copilot. Merging with failing checks and self-approval violate review controls, and her approval would not count if she requested the work.',
    },
    {
      question:
        'A PMO wants to know whether a weekly status workflow is worth its cost and whether its quality is improving. Which combination of signals is MOST appropriate to monitor?',
      options: [
        'The number of stars on the repository',
        'AI credits per run from gh aw logs or the Automations pane, accepted versus declined suggestions, how often humans steer or correct, and failed-run causes',
        'The length of the Markdown instructions file',
        'The number of branches in the repository',
      ],
      correct: [1],
      explanation:
        'Cost per run and quality indicators (accept rate, steering frequency, failures) directly measure value and improvement. Stars, instruction length and branch counts are unrelated.',
    },
  ],
  statements: [
    { text: 'Accepting a suggestion in the approvals panel applies the change to the issue immediately.', isTrue: true, explanation: 'Declined suggestions are dismissed without changing the issue.' },
    { text: 'Steering a Copilot cloud agent session is free of AI credit charges.', isTrue: false, explanation: 'Each steering message consumes AI credits.' },
    { text: 'Stopping a cloud agent session deletes the commits it already pushed.', isTrue: false, explanation: 'Stop session ends the Actions run and preserves pushed commits.' },
    { text: 'gh aw audit RUN-ID shows token usage and estimated inference cost for a single agentic workflow run.', isTrue: true, explanation: 'gh aw logs gives the overview across runs; audit inspects one run.' },
    { text: 'Copilot cloud agent sessions started by an automation are visible to everyone with read access to the repository.', isTrue: true, explanation: 'This transparency is one of the documented safety properties of automations.' },
    { text: 'If Copilot cloud agent ran CodeQL and code review on its pull request, no further human review is needed.', isTrue: false, explanation: 'GitHub states you remain responsible and that Copilot pull requests deserve the same review as any contribution.' },
  ],
  resources: [
    { label: 'Managing agent sessions (monitor, steer, stop, archive)', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents' },
    { label: 'Review output from Copilot', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output' },
    { label: 'Managing rationale, confidence, and approvals for issues', url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/manage-rationale-confidence-approvals' },
    { label: 'Monitoring your GitHub AI Credits usage', url: 'https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/monitor-ai-usage' },
  ],
};

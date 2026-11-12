import type { Concept } from '../../types';

export const branchesPullRequestsAndWikis: Concept = {
  id: 'branches-pull-requests-and-wikis',
  title: 'Branch Strategies, Pull Requests and Wikis for Tracking Work',
  summary:
    'GitHub flow and branch policies explained for non-developers, then the mechanics the exam tests: creating, assigning and linking pull requests, connecting them to issues and project items, and capturing durable knowledge in repository wikis.',
  certs: ['gh-700'],
  domains: ['gh-700-1'],
  outcomes: ['gh-700-1-1-7', 'gh-700-1-3-1', 'gh-700-1-3-2', 'gh-700-1-3-3', 'gh-700-1-3-4', 'gh-700-1-3-5'],
  tags: ['github-flow', 'branches', 'rulesets', 'pull-requests', 'linking', 'wikis'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'Recommending a branch strategy',
      body: `**GitHub flow** is the lightweight, branch-based workflow GitHub recommends for everyone, including non-developers writing policy, documentation or roadmaps. The steps: create a short, descriptively named branch (for example \`update-refund-policy\`), make and commit changes on it, open a pull request to ask for review, address comments, merge, and delete the branch. The default branch stays stable because nothing lands on it without a pull request.

Practices worth recommending in a business context:

- **One branch per set of related changes.** Unrelated edits on one branch slow review and make rollback painful.
- **Descriptive branch and commit names** so collaborators can see work in progress at a glance.
- **Draft pull requests** when you want early feedback before the change is complete.
- **Delete branches after merge** to stop people building on stale work.

Agents follow the same model. Copilot cloud agent can only push to a dedicated \`copilot/\` branch (or the branch of a pull request it was mentioned on), opens a draft pull request, and cannot mark it ready, approve it or merge it. That is why a branch-based strategy is the natural control point for agentic work: every change becomes a reviewable pull request.`,
    },
    {
      heading: 'Branch policies: protection rules and rulesets',
      body: `Policies turn a strategy into enforcement. **Branch protection rules** and **rulesets** both protect branches; GitHub recommends rulesets because several can apply at once, their status can be toggled without deleting them, and anyone with read access can see which rules apply. When rules overlap, the **most restrictive version wins**.

Typical rules to recommend:

- Require a pull request with a set number of **approving reviews** (optionally from code owners) before merging.
- Require **status checks** to pass and **conversation resolution**.
- Require **signed commits** and a **linear history**; block **force pushes** and branch deletion.
- Restrict who can push to matching branches, and use **push rulesets** to block files by path, extension or size (useful for keeping data exports out of a repository).
- Use fnmatch patterns such as \`releases/**/*\` to target families of branches.

Two agent-specific details appear on the exam. The person who asked Copilot to create a pull request cannot count as its approver, and when a pull request is authored by Copilot's own identity (for example from a shared automation) an **additional approval** is required if the repository already requires one. Administrators can turn that extra requirement off in rulesets but not in branch protection rules.`,
    },
    {
      heading: 'Creating, assigning and linking pull requests',
      body: `**Creating.** On GitHub, switch to your branch and click **Compare & pull request**, choose the **base** branch (where changes go) and the **compare** branch (where they came from), add a title and description, then create either a ready-for-review or a **draft** pull request. Anyone with read access can open one; the GitHub CLI equivalent is \`gh pr create\`. Copilot Chat can also do it when you ask (for example \`/task\` on GitHub.com), and Copilot cloud agent opens pull requests for assigned issues.

**Assigning.** Assignees say who is responsible; reviewers say who must approve. Issues and pull requests accept up to **10 assignees**, chosen from the sidebar or in bulk from the list view. You can assign Copilot itself to an issue to have it produce a pull request. Repositories can auto-request reviewers; you can also @mention people or request a review manually.

**Linking.** Link a pull request to the issue it addresses so stakeholders see work is in progress and the issue closes automatically on merge. Two methods:

- **Keywords** in the pull request description or a commit message: \`close\`, \`closes\`, \`closed\`, \`fix\`, \`fixes\`, \`fixed\`, \`resolve\`, \`resolves\`, \`resolved\` followed by \`#123\` (or \`owner/repo#123\` for another repository). Keywords only work when the pull request targets the **default branch**.
- **Manually** from the **Development** section of the pull request or issue sidebar, up to ten issues per pull request.

**Linking project items.** Add the pull request to a project from the **Projects** sidebar, paste its URL into the project, use \`gh pr create --project\`, or let a project **auto-add workflow** pull in items that match a filter. Status then syncs both ways between the project and the item.`,
    },
    {
      heading: 'Creating and updating wikis',
      body: `Every repository includes a **wiki** for long-form documentation that does not belong in a README: how a process works, design principles, onboarding guides, decision logs produced by agentic workflows. Key facts:

- Write in **Markdown** or other supported markups; the file extension decides the renderer. Markdown supports diagrams and maths.
- Edit **directly on GitHub** (Wiki tab > New Page or Edit, with an edit message that becomes the commit message) or **locally**: every wiki is itself a Git repository at \`https://github.com/OWNER/REPO.wiki.git\`. Only changes on the wiki's default branch go live.
- **Access** follows the repository: a private repository's wiki is visible only to people with repository access. By default only people with **write** access can edit, though a public repository can allow everyone on GitHub to contribute.
- Wikis are available in public repositories on Free plans and in public and private repositories on paid plans.
- Limits and discoverability: a soft limit of about 5,000 files, and search engines only index wikis on repositories with 500 or more stars that block public editing. If you need indexed, searchable public docs, use **GitHub Pages** instead.

Exam framing: pick the wiki for internal, evolving documentation alongside the code; pick a README for the short "what is this" summary; pick Discussions for open-ended conversation.`,
    },
  ],
  examples: [
    {
      title: 'A policy team adopts GitHub flow for the employee handbook',
      description:
        'HR stores its handbook in a repository. Each change starts on a branch such as parental-leave-2026, is opened as a draft pull request for legal review, is linked with "Closes #42" to the tracking issue, and merges only after one approval and a link-check status check pass under a ruleset. The branch is deleted after merge. Nobody edits the default branch directly, and the issue closes itself when the change lands.',
      takeaway: 'GitHub flow plus a ruleset gives non-developers reviewable, auditable changes without ceremony.',
    },
    {
      title: 'The pull request that never closed its issue (a realistic mistake)',
      description:
        'A project manager writes "Fixes #118" in a pull request that targets the release/q3 branch. After merging, issue #118 stays open and no link appears. Closing keywords are only interpreted when the pull request targets the default branch. The fix is either to link the issue manually from the Development sidebar, or to merge to the default branch first and let the keyword do its work.',
      language: 'text',
      code: `Pull request base: release/q3        -> "Fixes #118" ignored, no link created
Pull request base: main (default)    -> "Fixes #118" links and closes on merge
Any base branch                      -> Development sidebar > link issue #118 manually`,
      takeaway: 'Closing keywords need the default branch; manual linking works anywhere in the same repository.',
    },
    {
      title: 'Choosing a wiki over a shared drive for runbooks',
      description:
        'An operations analyst keeps incident runbooks in a shared drive that nobody updates. Moving them to the repository wiki means every edit has an author and a message, the content sits next to the automations that reference it, and an agentic workflow can be instructed to propose updates when related code changes. Because the repository is private, only team members can read the wiki.',
      takeaway: 'Wikis give long-form documentation version history and the same access model as the repository.',
    },
  ],
  keyPoints: [
    'GitHub flow: branch, change, pull request, review, merge, delete; it suits non-developers as well as engineers.',
    'Rulesets are the modern way to enforce reviews, status checks, signed commits and linear history; several can layer, and the most restrictive rule wins.',
    'Copilot cloud agent only pushes to its copilot/ branch, opens draft pull requests, and cannot approve or merge them; Copilot-authored pull requests may need an extra approval.',
    'Create a pull request with Compare & pull request (base = where changes go, compare = your branch), optionally as a draft; up to 10 assignees per item.',
    'Closing keywords (closes, fixes, resolves and their variants) link and auto-close issues only when the pull request targets the default branch; the Development sidebar links manually.',
    'Link pull requests to project items via the Projects sidebar, by pasting the URL, with gh pr create --project, or with an auto-add workflow.',
    'Wikis are per-repository Git repositories for long-form docs; write access edits by default, visibility follows the repository, and search engines only index wikis on 500+ star repositories.',
  ],
  flashcards: [
    { front: 'List the steps of GitHub flow.', back: 'Create a branch, make changes (commit and push), create a pull request, address review comments, merge, delete the branch.' },
    { front: 'Why does GitHub recommend rulesets over branch protection rules?', back: 'Multiple rulesets can apply at once, enforcement can be toggled without deletion, read-access users can see the rules, and rulesets can control commit metadata.' },
    { front: 'When two rulesets set different required review counts on the same branch, which applies?', back: 'The most restrictive version (the higher number).' },
    { front: 'Which branch can Copilot cloud agent push to?', back: 'Only its dedicated copilot/ branch, or the branch of a pull request where it was @mentioned.' },
    { front: 'Which closing keywords link a pull request to an issue?', back: 'close, closes, closed, fix, fixes, fixed, resolve, resolves, resolved, followed by #NUMBER (or OWNER/REPO#NUMBER).' },
    { front: 'Why might "Fixes #10" in a pull request description not close the issue?', back: 'Keywords are only interpreted when the pull request targets the repository\'s default branch.' },
    { front: 'How many assignees can an issue or pull request have?', back: 'Up to 10.' },
    { front: 'How many issues can you manually link to one pull request from the sidebar?', back: 'Up to ten, and manual links from the PR sidebar must be in the same repository.' },
    { front: 'Who can edit a repository wiki by default?', back: 'People with write access to the repository (public repositories can optionally allow everyone on GitHub).' },
    { front: 'What is the Git clone URL of a wiki?', back: 'https://github.com/OWNER/REPO.wiki.git; only the wiki\'s default branch is published.' },
  ],
  quiz: [
    {
      question:
        'A program manager wants to ensure no change reaches the main branch of the operations-playbook repository without one approving review and a passing link-check, and she wants everyone with read access to be able to see the rules. What should she recommend?',
      options: [
        'A single branch protection rule, because rulesets are only for enterprise plans',
        'A ruleset targeting main that requires one approving review and the status check',
        'A CODEOWNERS file only',
        'A push ruleset that restricts file extensions',
      ],
      correct: [1],
      explanation:
        'Rulesets enforce review and status-check requirements and are visible to anyone with read access. Branch protection rules work but are less visible and only one applies at a time; CODEOWNERS alone enforces nothing; push rulesets govern file content, not reviews.',
    },
    {
      question:
        'An analyst opens a pull request against the default branch and writes "Resolves #77, resolves #78" in the description. What happens when the pull request merges?',
      options: [
        'Only issue #77 is closed; keywords apply to the first reference only',
        'Both issues are linked and closed automatically',
        'Nothing happens until the issues are linked from the Development sidebar',
        'The issues are closed but the pull request is not shown as linked',
      ],
      correct: [1],
      explanation:
        'Using the full keyword syntax for each issue links and closes both when the pull request targets the default branch. The "closed but not linked" behaviour applies to keywords in commit messages, not pull request descriptions.',
    },
    {
      question:
        'Which TWO statements about Copilot cloud agent and branches are correct? (Select two)',
      options: [
        'Copilot cloud agent pushes directly to the default branch so changes are visible immediately',
        'Copilot cloud agent creates a copilot/ branch and opens a draft pull request for human review',
        'The person who asked Copilot to create a pull request cannot count as its required approver',
        'Copilot cloud agent can mark its pull request as ready for review and merge it once checks pass',
      ],
      correct: [1, 2],
      explanation:
        'The agent is limited to its own branch and a draft PR, and the requester cannot approve it. It never pushes to the default branch and cannot mark ready, approve or merge.',
    },
    {
      question:
        'A team wants to keep long-form onboarding documentation next to a private repository, editable by team members with a visible edit history, and not indexed by search engines. Which option fits best?',
      options: [
        'The repository README',
        'GitHub Pages',
        'The repository wiki',
        'A pinned GitHub Discussion',
      ],
      correct: [2],
      explanation:
        'A private repository\'s wiki is visible only to people with repository access, has Git history, and is edited by write-access users. READMEs are for short summaries, Pages is for public indexed sites, and Discussions are conversations rather than maintained documents.',
    },
    {
      question:
        'A project manager wants a newly created pull request to appear in the team\'s project board without anyone adding it by hand. What is the LEAST manual approach?',
      options: [
        'Paste the pull request URL into the project each time',
        'Configure the project\'s auto-add built-in workflow with a filter for the repository',
        'Ask the author to add a "project" label',
        'Link the pull request to an issue with a closing keyword',
      ],
      correct: [1],
      explanation:
        'The auto-add workflow adds matching items automatically. Pasting URLs is manual, labels do not add items to projects by themselves, and issue linking does not place the pull request in a project.',
    },
  ],
  statements: [
    { text: 'GitHub flow is intended only for software developers.', isTrue: false, explanation: 'GitHub uses it for site policy, documentation and roadmaps and recommends it for everyone.' },
    { text: 'When rulesets and a branch protection rule target the same branch, all rules are aggregated and the most restrictive applies.', isTrue: true, explanation: 'Rules layer rather than override each other.' },
    { text: 'A pull request can be opened between two commits on the same branch.', isTrue: false, explanation: 'Pull requests can only be opened between two different branches.' },
    { text: 'Using a closing keyword in a commit message closes the issue on merge but does not list the pull request as linked.', isTrue: true, explanation: 'Only keywords in the pull request description (or manual links) create the linked pull request relationship.' },
    { text: 'Every wiki is itself a Git repository that can be cloned and edited locally.', isTrue: true, explanation: 'Clone https://github.com/OWNER/REPO.wiki.git; pushes to the default branch go live.' },
    { text: 'Search engines index all public wikis automatically.', isTrue: false, explanation: 'Only wikis on repositories with 500 or more stars that prevent public editing are indexed; use GitHub Pages for indexed docs.' },
  ],
  resources: [
    { label: 'GitHub flow', url: 'https://docs.github.com/en/get-started/using-github/github-flow' },
    { label: 'About rulesets', url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets' },
    { label: 'Linking a pull request to an issue', url: 'https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue' },
    { label: 'About wikis', url: 'https://docs.github.com/en/communities/documenting-your-project-with-wikis/about-wikis' },
  ],
};

import type { Concept } from '../../types';

export const branchingStrategiesAndPullRequestPolicies: Concept = {
  id: 'branching-strategies-and-pull-request-policies',
  title: 'Branching Strategies, Branch Policies and Protection Rules for Humans and Copilot',
  summary:
    'Choosing between trunk-based development, feature branches, release branches, Git flow, GitHub flow and Git worktrees, then enforcing the pull request workflow with Azure Repos branch policies and GitHub branch protection rules and rulesets, including the extra rules you need when GitHub Copilot is a contributor and a reviewer.',
  certs: ['az-401', 'gh-700'],
  domains: ['az-401-2', 'gh-700-1'],
  outcomes: ['az-401-2-1-1', 'az-401-2-1-2', 'az-401-2-1-3', 'az-401-2-1-4', 'gh-700-1-1-7'],
  tags: ['branching', 'trunk-based', 'git-flow', 'github-flow', 'branch-policies', 'branch-protection', 'rulesets', 'copilot-code-review'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Choosing a branching strategy',
      body: `A branching strategy decides how long code lives away from the main line and how it gets back. The exam names six and expects you to match each to a situation:

| Strategy | Shape | Best for | Cost |
|---|---|---|---|
| **Trunk-based** | Everyone commits to main (directly or via very short-lived branches, hours to a day); releases cut from main, often behind feature flags | Continuous delivery, strong CI, agents that open many small PRs | Requires feature flags and fast, reliable pipelines |
| **Feature branch** | One branch per feature, merged by PR when done | Most teams; the default in Azure Repos guidance | Long-lived branches drift and create merge pain |
| **Release branch** | Branch per release (release/2.4) stabilised in parallel with main; hotfixes land on the release branch and are cherry-picked to main | Products with supported versions, regulated release cadences | Duplicate fixes, more backports |
| **Git flow** | develop + feature + release + hotfix + main | Versioned products with scheduled releases | Heavy ceremony, slow feedback, discouraged for CD |
| **GitHub flow** | main is always deployable; branch, PR, review, deploy, merge | Web services, GitHub-native teams | Needs good automated tests and fast deploys |
| **Git worktree** | Not a strategy but a tool: multiple working directories from one clone, each on its own branch | Working on a hotfix while a feature build runs; running several Copilot agent sessions in parallel locally | Easy to forget which worktree you are in |

Microsoft's guidance for Azure Repos is feature branches with a naming convention (\`users/alice/feature-x\`, \`feature/\`, \`bugfix/\`, \`hotfix/\`), pull requests for every merge, and release branches only when you truly support multiple versions. For agentic development, trunk-based or GitHub flow wins: agents produce many small, independently testable PRs, and short-lived branches keep their context fresh. Copilot cloud agent branches are created from the base you choose and are deleted when the PR merges, which fits that model.`,
    },
    {
      heading: 'Pull request workflows with Azure Repos branch policies',
      body: `In Azure Repos, **branch policies** are set per branch (or with wildcards such as \`release/*\`) under Repos > Branches > Branch policies. Once any policy is on, the branch can only change through a pull request. The policy types you must know:

- **Require a minimum number of reviewers** (with options: allow requestors to approve their own changes, prohibit the most recent pusher from approving, reset votes when the source branch changes).
- **Check for linked work items** for traceability.
- **Check for comment resolution** so review threads are closed before completion.
- **Limit merge types**: basic merge (no fast-forward), squash, rebase and fast-forward, rebase with merge commit.
- **Build validation**: a pipeline must succeed (this is how PR triggers work for Azure Repos; the \`pr:\` YAML keyword applies to GitHub and Bitbucket repos, not Azure Repos).
- **Status checks** published by external services such as a security scanner or the GitHub Copilot code review for Azure Repos preview.
- **Automatically included reviewers** for specific paths, optionally required, which is the Azure Repos equivalent of CODEOWNERS.

Merging restrictions come from these policies plus permissions: \`Bypass policies when completing pull requests\`, \`Bypass policies when pushing\` and \`Force push\` are explicit permissions (deny them except for a break-glass group), and policies can be set at the project level for all repositories. Use \`az repos policy\` commands or the REST API to script policies so every new repository gets the same gate.`,
    },
    {
      heading: 'GitHub branch protection rules and rulesets',
      body: `GitHub has two mechanisms. **Branch protection rules** (classic) apply to a branch name pattern and offer: require a pull request before merging with a number of approvals and optional **code owner** review, dismiss stale approvals, require review from the most recent push, **require status checks** (and branches to be up to date), require conversation resolution, require signed commits, require linear history, require merge queue, require deployments to succeed, lock branch, restrict who can push, and allow or block force pushes and deletions. "Do not allow bypassing" makes the rule apply to admins too.

**Rulesets** are the newer, layered model: a named list of rules targeting branches or tags (fnmatch patterns such as \`releases/**/*\`), with a **bypass list** of roles, teams or GitHub Apps, evaluation (dry run) mode, and the ability to define them at the **organization level** across many repositories (Team and Enterprise plans) and at the enterprise level. Rulesets add rules you cannot get from classic protection, such as metadata restrictions on commit messages and branch names, **push rulesets** that block files by path, extension or size across the fork network, and **required workflows**. Up to 75 rulesets per repository. When several rulesets target the same branch, the most restrictive combination applies, which is why rulesets are the recommended way to standardise merge restrictions across an organization.

Exam distinctions: branch protection is per repository and per pattern; rulesets can span repositories and have bypass lists; push rulesets act on pushes rather than merges; "Restrict who can push" limits authors, "Require pull request" limits the path.`,
    },
    {
      heading: 'Policies and protection rules for GitHub Copilot',
      body: `When Copilot writes and reviews code, your rules need three adjustments.

**Copilot as an author.** The Copilot cloud agent pushes to a branch it creates and opens a pull request authored by Copilot (the requester is co-author; commits are signed and link to the session log). Your protection must make sure the review is real: require at least one approval and remember **the requester's approval does not count** toward required approvals on a Copilot PR, so another human must approve. Keep **require status checks** on, and keep the default that **Actions workflows need "Approve and run workflows"** on Copilot pushes so CI secrets are not exposed to unreviewed code. Rulesets with a bypass list should never include the Copilot app. If you want the agent limited to certain base branches, control it at task creation (base branch selection) and with rulesets that restrict creating or updating branches outside allowed patterns.

**Copilot as a reviewer.** **Copilot code review** can be requested manually or run **automatically through repository or organization rulesets**, with a configurable effort level (Lite, Balanced, Max). It leaves review comments and suggested changes, and in GitHub its review does not count as a required human approval; treat it as a status signal that improves review quality, not as the approver. Instructions in \`.github/copilot-instructions.md\` and path-scoped instruction files shape what it checks. For Azure Repos, Copilot code review is in public preview and surfaces as a reviewer on the PR, which you can combine with the usual minimum-reviewer policy.

**Copilot as a committer of generated code.** Push protection and secret scanning apply equally to Copilot pushes; CODEOWNERS routes its PRs to owners; required workflows and code scanning results gates (require code scanning results in rulesets) run on its branches. The principle to remember: the controls are the same ones you use for humans, applied without exception to the agent.`,
    },
  ],
  examples: [
    {
      title: 'Scripting Azure Repos branch policies for every new repository',
      description:
        'Contoso creates repositories through a platform pipeline. To make sure main is never unprotected, the pipeline applies the same policies with the Azure DevOps CLI: two reviewers, no self-approval, votes reset on new pushes, and build validation with the CI pipeline.',
      language: 'bash',
      code: `# Minimum reviewers on main, requester cannot count their own vote
az repos policy approver-count create --blocking true --enabled true \\
  --branch main --repository-id "$REPO_ID" --minimum-approver-count 2 \\
  --creator-vote-counts false --allow-downvotes false --reset-on-source-push true

# Build validation: CI pipeline must pass before completion
az repos policy build create --blocking true --enabled true --branch main \\
  --repository-id "$REPO_ID" --build-definition-id "$CI_PIPELINE_ID" \\
  --queue-on-source-update-only true --manual-queue-only false \\
  --display-name "CI" --valid-duration 720

# Traceability
az repos policy work-item-linking create --blocking true --enabled true \\
  --branch main --repository-id "$REPO_ID"`,
      takeaway: 'Policies as code make the merge gate consistent; build validation is how Azure Repos implements PR triggers.',
    },
    {
      title: 'A ruleset that works for humans and for Copilot',
      description:
        'A GitHub organization standardises main-branch rules with an organization ruleset targeting the default branch of every repository: pull request required with one approval, code owner review, dismiss stale reviews, required status checks for build and CodeQL, Copilot code review requested automatically, no force pushes, and a bypass list that contains only the release-managers team. Copilot PRs still need a second human because the requester’s approval does not count.',
      language: 'text',
      code: `Ruleset: protect-default-branch (organization, enforced)
Target: default branch of all repositories
Rules:
  - Require a pull request before merging: 1 approval, require code owner review,
    dismiss stale approvals, require approval of the most recent push
  - Require status checks to pass: build, CodeQL
  - Automatically request Copilot code review (effort: Balanced)
  - Require conversation resolution; require linear history
  - Block force pushes; restrict deletions
Bypass list: @contoso/release-managers (pull requests only)`,
      takeaway: 'One organization ruleset enforces the merge path everywhere; treat Copilot review as a quality check and keep human approval as the gate.',
    },
    {
      title: 'The long-lived release branch that never came home (a realistic mistake)',
      description:
        'A team adopts release branches but forgets the second half of the pattern: hotfixes are committed to release/3.1 and deployed, but never cherry-picked to main. Release 3.2 ships without the fixes and the incident recurs. The fix is a hotfix policy: fix on the release branch, open a PR to main with the cherry-pick in the same change (an agentic workflow can open that PR automatically when a hotfix merges), and add a build validation on release/* that runs the same tests as main.',
      takeaway: 'Release branches require a backport discipline; automate the cherry-pick PR so fixes always return to the trunk.',
    },
    {
      title: 'Parallel agent sessions with Git worktrees',
      description:
        'A developer wants a local Copilot agent session fixing a bug while she continues work on a feature without stashing. She adds a worktree for the bugfix branch so each branch has its own directory and build output.',
      language: 'bash',
      code: `git worktree add ../checkout-bugfix -b bugfix/AB-7712 origin/main
cd ../checkout-bugfix && copilot      # agent works here
# meanwhile the feature branch stays checked out in the original directory
git worktree list
git worktree remove ../checkout-bugfix  # after the PR merges`,
      takeaway: 'Worktrees give each branch its own working directory from one clone, which is ideal for concurrent human and agent work.',
    },
  ],
  keyPoints: [
    'Trunk-based development and GitHub flow suit continuous delivery and agent-generated small PRs; Git flow and release branches suit versioned products and add backport overhead.',
    'Git worktree is a tool for multiple working directories from one clone, useful for hotfixes and parallel agent sessions, not a branching strategy by itself.',
    'Azure Repos branch policies: minimum reviewers, linked work items, comment resolution, limit merge types, build validation, status checks, automatically included reviewers; any policy forces changes through a PR.',
    'For Azure Repos, PR validation is a build validation policy; the pr: YAML trigger applies to GitHub and Bitbucket repositories.',
    'GitHub branch protection rules apply per pattern; rulesets layer across repositories and organizations with bypass lists, evaluation mode, push rulesets and required workflows.',
    'Merging restrictions are policies plus permissions: deny Bypass policies and Force push except to a break-glass group; in GitHub use Do not allow bypassing or an empty bypass list.',
    'Copilot cloud agent PRs need a human approval other than the requester, status checks still apply, and Actions runs wait for Approve and run workflows by default.',
    'Copilot code review can be auto-requested through rulesets and shaped by custom instructions, but it does not replace a required human approval.',
  ],
  flashcards: [
    { front: 'Which branching strategy keeps main always deployable with short-lived branches and PRs?', back: 'GitHub flow (and trunk-based development, which keeps branches even shorter or commits directly to main behind flags).' },
    { front: 'In Azure Repos, how do you make a pipeline run and pass before a PR can complete?', back: 'Add a Build validation branch policy that references the pipeline.' },
    { front: 'What does the Azure Repos policy "Automatically included reviewers" correspond to in GitHub?', back: 'CODEOWNERS with required code owner review.' },
    { front: 'Name the four merge types a Limit merge types policy can allow.', back: 'Basic merge (no fast-forward), squash merge, rebase and fast-forward, rebase with merge commit.' },
    { front: 'What can rulesets do that classic branch protection cannot?', back: 'Apply across many repositories (organization or enterprise level), define bypass lists, run in evaluation mode, restrict metadata, and block pushes by path, extension or size (push rulesets).' },
    { front: 'Does the requester’s approval count toward required approvals on a Copilot cloud agent PR?', back: 'No; another reviewer must approve.' },
    { front: 'Which permissions let a user circumvent Azure Repos branch policies?', back: 'Bypass policies when completing pull requests, Bypass policies when pushing (and Force push to rewrite history).' },
    { front: 'How can Copilot code review be made to run on every PR in an organization?', back: 'Through a repository or organization ruleset that automatically requests a Copilot review (effort levels Lite, Balanced, Max).' },
    { front: 'What is a Git worktree?', back: 'An additional working directory attached to the same repository, each checked out to a different branch.' },
    { front: 'How many rulesets can a repository have?', back: 'Up to 75 per repository, plus up to 75 organization-wide rulesets.' },
  ],
  quiz: [
    {
      question:
        'A team deploying a web service several times a day with strong automated tests asks which branching strategy to adopt so that Copilot cloud agent PRs integrate quickly. Which is MOST appropriate?',
      options: ['Git flow with develop and release branches', 'Trunk-based development with short-lived branches and feature flags', 'Long-lived release branches per customer', 'A single shared feature branch per sprint'],
      correct: [1],
      explanation:
        'Trunk-based development minimises integration delay and suits many small PRs. Git flow and release branches add ceremony and backports, and a shared sprint branch recreates long-lived divergence.',
    },
    {
      question:
        'In Azure Repos you want pull requests to main to trigger the CI pipeline and block completion until it passes. You add pr: triggers to the YAML but nothing runs. What should you do?',
      options: [
        'Add a Build validation branch policy on main that references the pipeline.',
        'Change the trigger to batch: true.',
        'Grant the pipeline Bypass policies when pushing.',
        'Enable auditing for the organization.',
      ],
      correct: [0],
      explanation:
        'Azure Repos implements PR triggers through the build validation policy; the pr: keyword is for GitHub and Bitbucket repositories. batch controls CI batching, bypass permissions weaken policy, and auditing is unrelated.',
    },
    {
      question:
        'An organization on GitHub Enterprise Cloud needs the same merge restrictions on the default branch of 300 repositories, with release managers allowed to bypass in emergencies. What should you use?',
      options: [
        'A classic branch protection rule in each repository',
        'An organization ruleset targeting default branches with release managers in the bypass list',
        'CODEOWNERS files in each repository',
        'A push ruleset blocking large files',
      ],
      correct: [1],
      explanation:
        'Organization rulesets apply across repositories and support bypass lists. Classic rules are per repository, CODEOWNERS routes reviews rather than restricting merges, and push rulesets address file content rather than merge gates.',
    },
    {
      question:
        'Which TWO controls should remain in place specifically because the Copilot cloud agent authors pull requests in your repository? (Select two)',
      options: [
        'Require at least one approval from a reviewer other than the requester',
        'Keep the default that Actions workflows need "Approve and run workflows" on Copilot pushes',
        'Add the Copilot app to the ruleset bypass list so its PRs merge faster',
        'Disable push protection on Copilot branches',
      ],
      correct: [0, 1],
      explanation:
        'Human approval and gated workflow runs are the safeguards for agent-authored code. Adding Copilot to a bypass list or disabling push protection removes protection exactly where it is needed.',
    },
    {
      question:
        'A developer must work on an urgent hotfix while a long-running build occupies her current branch’s working directory, without stashing or re-cloning. Which Git feature should she use?',
      options: ['git stash', 'git worktree add', 'git cherry-pick', 'git rebase --onto'],
      correct: [1],
      explanation:
        'A worktree gives the hotfix branch its own directory alongside the existing one. Stash interrupts the current work, cherry-pick moves commits, and rebase rewrites history.',
    },
    {
      question:
        'Your GitHub ruleset requires one approval. Copilot code review has approved a pull request authored by a developer, but the merge button is still blocked. Why?',
      options: [
        'Copilot code review feedback does not count as a required human approval.',
        'The developer must re-request the review.',
        'Rulesets cannot be combined with Copilot code review.',
        'The PR must be converted to a draft first.',
      ],
      correct: [0],
      explanation:
        'Copilot review is a quality signal, not an approving reviewer for protection purposes. Re-requesting, draft status and ruleset compatibility are not the issue.',
    },
  ],
  statements: [
    { text: 'Once any branch policy is enabled on an Azure Repos branch, changes to that branch must go through a pull request.', isTrue: true, explanation: 'Policies force the PR path unless a user has Bypass policies permissions.' },
    { text: 'Git flow is the branching model Microsoft recommends for continuous delivery.', isTrue: false, explanation: 'Git flow adds long-lived develop and release branches; trunk-based development or GitHub flow suits continuous delivery.' },
    { text: 'GitHub rulesets can be evaluated in a dry-run mode before they are enforced.', isTrue: true, explanation: 'Evaluation mode lets you see what would have been blocked.' },
    { text: 'The pr: trigger keyword in YAML enables pull request validation for Azure Repos Git repositories.', isTrue: false, explanation: 'Azure Repos uses the build validation branch policy; pr: applies to GitHub and Bitbucket repos.' },
    { text: 'Push rulesets can block pushes containing files above a size limit across a repository’s fork network.', isTrue: true, explanation: 'Push rulesets restrict by path, extension, path length and size, including forks.' },
    { text: 'A Git worktree is a separate clone of the repository.', isTrue: false, explanation: 'Worktrees share one repository (one .git) with multiple working directories.' },
    { text: 'Copilot cloud agent commits are signed and link back to the session log.', isTrue: true, explanation: 'Commits appear as Verified and each message includes a link to the session.' },
  ],
  resources: [
    { label: 'Adopt a Git branching strategy (Azure Repos)', url: 'https://learn.microsoft.com/en-us/azure/devops/repos/git/git-branching-guidance' },
    { label: 'Branch policies and settings (Azure Repos)', url: 'https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies' },
    { label: 'About protected branches (GitHub)', url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches' },
    { label: 'About rulesets (GitHub)', url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets' },
  ],
};

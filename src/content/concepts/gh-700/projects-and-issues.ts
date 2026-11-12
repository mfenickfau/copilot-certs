import type { Concept } from '../../types';

export const projectsAndIssues: Concept = {
  id: 'projects-and-issues',
  title: 'Planning and Managing Work with GitHub Projects and Issues',
  summary:
    'Creating projects from templates, shaping views with layouts, custom fields and built-in automations, controlling who can see a project, managing issues end to end, and choosing the right GitHub collaboration surface for each conversation.',
  certs: ['gh-700'],
  domains: ['gh-700-1'],
  outcomes: ['gh-700-1-2-1', 'gh-700-1-2-2', 'gh-700-1-2-3', 'gh-700-1-2-4', 'gh-700-1-2-5'],
  tags: ['projects', 'issues', 'templates', 'custom-fields', 'automation', 'collaboration'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'Creating a project and selecting a template',
      body: `A **project** is an adaptable table, board and roadmap that stays in sync with the issues and pull requests you add. Projects exist at **organisation** level (tracking items from any of the organisation's repositories) or **user** level (your own repositories). To create one: Organisation or profile > **Projects** > **New project**, then choose how to start:

- **Start from scratch** with a blank **Table**, **Roadmap** or **Board**.
- **Use a template**: GitHub's built-in templates, templates your organisation has created, or up to six **recommended templates** an organisation owner has curated to appear first.

Choosing a template is about what gets copied. A template brings its **views, custom fields, draft issues (with field values), configured workflows (except auto-add workflows) and insights**. Pick the template whose fields and views match your process (for example an iteration-based team backlog versus a date-driven roadmap) rather than the one with the most features; you can add fields later, up to 50 per project. Any project admin can mark a project as a template, and anyone with write access can **copy** a project as a template.

After creation, add a description and a Markdown **README** so the purpose and conventions of the board travel with it, and optionally import existing items from a repository, which makes that repository the project's default.`,
    },
    {
      heading: 'Views, columns, custom fields and built-in automation',
      body: `Each saved **view** has its own layout and configuration, so one project can serve several audiences:

- **Table** is a spreadsheet: show or hide fields, reorder columns, **group**, **sort**, **slice** (a side panel of one field's values) and show **field sums** for number fields.
- **Board** spreads items across columns driven by a single-select or iteration field (usually Status); dragging an item changes its value.
- **Roadmap** places items on a timeline using date or iteration fields, with markers for milestones and iterations.

**Custom fields** add metadata the built-in issue data lacks: **text**, **number**, **date**, **single select** (for priority or size) and **iteration** (sprints with optional breaks). Text and number fields can carry default values for new items and are usable in filters such as \`priority:High\` or \`effort:>=5\`.

**Built-in automations** (project menu > **Workflows**) update Status on events: set Todo when an item is added, set Done when an issue is closed or a pull request is merged (these two are on by default), close an issue when Status changes, **auto-archive** items matching criteria, and **auto-add** items from a repository that match a filter. Changes made by workflows are attributed to \`@github-project-automation\`. For logic beyond these, use the GraphQL API or GitHub Actions. Insights charts are built from the same items and filters.`,
    },
    {
      heading: 'Configuring access to projects',
      body: `Project access is layered on top of repository access: you can only see an item if you can see its repository, so adding someone to a project never leaks private issues. Within the project (menu > **Settings** > **Manage access**):

- For **organisation projects**, set a **base role** for every member: **No access** (only owners and named collaborators), **Read**, **Write** or **Admin**. Organisation owners are always admins. Then invite **teams**, **individual members** or **outside collaborators** with Read, Write or Admin. Someone must already be a member or an outside collaborator on at least one repository to be invited. Granting a team Read or better also lists the project on the team's page.
- For **user projects**, invite individual collaborators with Read, Write or Admin.
- **Visibility** is separate: a project can be private or public to everyone on the internet.
- An organisation-level default base permission can be configured for new projects.

Roles map to exam phrases: "view the board" = Read; "move cards and edit fields" = Write; "add collaborators or change settings" = Admin. Keep base role at Read or No access for sensitive portfolios and grant Write to the delivery team only.`,
    },
    {
      heading: 'Managing issues: create, assign, link, tag',
      body: `**Issues** track bugs, ideas, tasks and feedback. You can create them from a repository, from a comment in an issue or pull request, from a line of code, from a URL query, from a project (draft issues convert later), or via GitHub Mobile, the CLI and APIs. Issue **templates and forms** steer people toward complete reports.

Managing them well means using the metadata deliberately:

- **Assign** up to 10 people to show ownership; you can also assign **Copilot** (or an agent app) so it works the issue and opens a pull request for review.
- **Link** related work: type \`#\` to reference another issue, use **sub-issues** to break work into a hierarchy, define **dependencies** (blocked by / blocking), attach **artifacts** such as plans and research, and link pull requests or branches from the **Development** sidebar.
- **Tag** with **labels** (free-form categorisation such as \`bug\`, \`customer-request\`), **issue types** (organisation-wide classification), and **milestones** for dates or releases.
- Add the issue to one or more **projects**; field changes sync both ways.

Automations and agentic workflows can do the same things with a **rationale and confidence level** attached, and low-confidence changes wait in an approvals panel on the issue. Search \`is:issue is:open has:suggestions\` to find issues awaiting your decision.`,
    },
    {
      heading: 'Using the platform for collaboration',
      body: `GitHub offers several conversation surfaces; the exam expects you to match each to its purpose:

| Need | Surface |
|---|---|
| Track a specific task, bug or piece of feedback with a clear owner | **Issue** |
| Propose and review a specific change | **Pull request** (comments on lines, suggestions, reviews) |
| Open-ended ideas, questions, announcements, polls, community knowledge | **Discussions** (repository or organisation level, categories, mark answers, pin, convert from issue) |
| Plan and visualise work across issues and pull requests | **Project** (status updates: On track, At risk) |
| Long-form documentation | **Wiki** |

Collaboration habits: @mention people to draw attention, use **saved replies** for repeated comments, **subscribe** to issues for notifications, share **project status updates** for stakeholders, and convert an issue to a discussion when the conversation outgrows a task. Copilot helps you keep up: from any page, ask Copilot to "Summarize https://github.com/org/repo/discussions/4" or "What are the acceptance criteria for this issue?" without re-reading the whole thread.`,
    },
  ],
  examples: [
    {
      title: 'A PMO creates a portfolio project from an organisation template',
      description:
        'The PMO lead picks the organisation\'s recommended "Quarterly initiatives" template, which brings a roadmap view driven by Target date, a Priority single-select field and a board grouped by Status. She sets the base role to Read so every employee can see progress, invites the delivery team with Write, and turns on the auto-add workflow for the two initiative repositories so new issues appear without manual effort.',
      takeaway: 'Templates copy views, fields, workflows (except auto-add) and insights; access is configured separately with base role plus invitations.',
    },
    {
      title: 'The contractor who could not see any cards (a realistic mistake)',
      description:
        'A project admin grants an outside contractor Write access to the project, yet the contractor sees an empty board. The items come from a private repository the contractor has no access to. Project permissions never override repository permissions, so the fix is to grant the contractor access to that repository (or move their work to a repository they can see), not to raise the project role to Admin.',
      takeaway: 'Project access controls the board; repository access controls which items are visible on it.',
    },
    {
      title: 'Triage with issues, labels and a confidence gate',
      description:
        'A support operations analyst configures a nightly triage automation to set issue type, labels and priority. The repository automation level is left at Cautious, so only high-confidence changes apply directly, and the rest wait in the approvals panel. Each morning she searches is:issue is:open has:suggestions, accepts or declines the pending suggestions, and the project board updates automatically through the synced fields.',
      language: 'text',
      code: `Search: is:issue is:open has:suggestions label:customer-request
Approvals panel on each issue: Accept | Decline | Accept all | Decline all`,
      takeaway: 'Issue metadata is what agents and people both act on; confidence thresholds decide what needs a human click.',
    },
  ],
  keyPoints: [
    'Projects are organisation- or user-level and start from a blank Table, Board or Roadmap, or from a built-in, organisation or recommended template.',
    'Templates copy views, custom fields, draft issues, workflows (except auto-add) and insights; up to six templates can be recommended.',
    'Views offer table, board and roadmap layouts with grouping, sorting, slicing and field sums; custom fields include text, number, date, single select and iteration (50 fields max).',
    'Built-in workflows set Status on events; "closed → Done" and "merged → Done" are enabled by default; auto-add and auto-archive are available.',
    'Access: base role (No access, Read, Write, Admin) for organisation members plus team/individual invitations; repository permissions still decide which items a person can see.',
    'Issues support up to 10 assignees (including Copilot), labels, issue types, milestones, sub-issues, dependencies, artifacts and links to pull requests and projects.',
    'Issues for tasks with owners, pull requests for proposed changes, Discussions for open-ended conversation; convert an issue to a discussion when needed.',
  ],
  flashcards: [
    { front: 'Which project layouts can you start a blank project with?', back: 'Table, Roadmap or Board.' },
    { front: 'What does a project template copy to a new project?', back: 'Views, custom fields, draft issues with field values, configured workflows (except auto-add workflows) and insights.' },
    { front: 'How many templates can an organisation owner recommend?', back: 'Up to six, shown first in the Create project dialog.' },
    { front: 'Name the five custom field types in Projects.', back: 'Text, number, date, single select and iteration.' },
    { front: 'Which two built-in project workflows are enabled by default?', back: 'Set Status to Done when an issue or pull request is closed, and when a pull request is merged.' },
    { front: 'What are the base role options for an organisation project?', back: 'No access, Read, Write, Admin (organisation owners are always admins).' },
    { front: 'Can a project collaborator see items from a repository they cannot access?', back: 'No. To view an item, the person needs permission on the item\'s repository.' },
    { front: 'Which search qualifier finds issues with agent suggestions waiting for review?', back: 'has:suggestions, for example is:issue is:open has:suggestions.' },
    { front: 'When should a conversation move from an issue to a discussion?', back: 'When it becomes open-ended, has no clear owner or actionable outcome; you can convert the issue to a discussion.' },
    { front: 'How are changes made by built-in project workflows attributed?', back: 'To @github-project-automation in the item timeline.' },
  ],
  quiz: [
    {
      question:
        'A program manager creates a new organisation project from a template that includes an auto-add workflow for the "platform" repository. After creation, new issues in that repository are not appearing. Why?',
      options: [
        'Templates never copy workflows of any kind',
        'Auto-add workflows are the one workflow type that templates do not copy; she must configure it on the new project',
        'The project is at user level and cannot track organisation repositories',
        'Auto-add only works for pull requests, not issues',
      ],
      correct: [1],
      explanation:
        'Templates copy views, fields, draft issues, insights and workflows except auto-add workflows. Other workflows are copied, the project is organisation-level, and auto-add handles both issues and pull requests.',
    },
    {
      question:
        'Stakeholders across the company should be able to view a portfolio project, but only the delivery team may edit it. Which configuration achieves this with the least administrative effort?',
      options: [
        'Base role Write for the organisation and remove Write from everyone who is not on the team',
        'Base role Read for the organisation and invite the delivery team with Write',
        'Base role No access and invite every stakeholder individually with Read',
        'Make the project public on the internet',
      ],
      correct: [1],
      explanation:
        'Base role Read gives every member visibility in one setting, and a single team invitation grants Write. Removing Write per person or inviting every stakeholder is high effort, and public visibility exposes the project beyond the company.',
    },
    {
      question:
        'Which TWO actions can you perform on a GitHub issue to clarify responsibility and relationships? (Select two)',
      options: [
        'Assign up to 10 people, including Copilot, as assignees',
        'Create sub-issues to break the work into a hierarchy',
        'Merge the issue into the default branch',
        'Set a required status check on the issue',
      ],
      correct: [0, 1],
      explanation:
        'Assignees and sub-issues are issue features. Merging and status checks belong to pull requests and branches, not issues.',
    },
    {
      question:
        'A team wants a roadmap view that places items on a timeline by sprint and a board view grouped by priority in the same project. What must they configure?',
      options: [
        'Two separate projects, because each project has one layout',
        'One project with an iteration field for sprints and a single-select Priority field, and two saved views with different layouts',
        'A GitHub Actions workflow to generate the roadmap',
        'Labels named after sprints, because roadmaps read labels',
      ],
      correct: [1],
      explanation:
        'Each saved view has its own layout; roadmaps use date or iteration fields and boards use single-select or iteration fields for columns. Labels do not drive roadmap placement and no Actions workflow is needed.',
    },
    {
      question:
        'A community member opens an issue titled "Ideas for next year\'s roadmap" that quickly becomes a wide-ranging conversation with no actionable task. What is the MOST appropriate action?',
      options: [
        'Close the issue as not planned',
        'Convert the issue to a discussion so the conversation continues in the right place',
        'Assign the issue to Copilot to resolve it',
        'Add the issue to every project so all teams see it',
      ],
      correct: [1],
      explanation:
        'Open-ended conversations belong in Discussions, and GitHub lets you convert an issue directly. Closing loses the conversation, Copilot cannot "resolve" an idea thread, and spreading it across projects adds noise.',
    },
  ],
  statements: [
    { text: 'A project can be created at organisation level or user level.', isTrue: true, explanation: 'Organisation projects track items across the organisation\'s repositories; user projects track your own.' },
    { text: 'A project may contain up to 50 fields, including built-in and custom fields.', isTrue: true, explanation: 'This is the documented field limit per project.' },
    { text: 'Granting someone Admin on a project lets them view issues from private repositories they otherwise cannot access.', isTrue: false, explanation: 'Project roles never override repository permissions.' },
    { text: 'The built-in workflow that sets Status to Done when a pull request is merged is enabled by default.', isTrue: true, explanation: 'It and the "closed → Done" workflow are on when a project initialises.' },
    { text: 'You cannot group a table view by labels.', isTrue: true, explanation: 'Grouping by title, labels, reviewers or linked pull requests is not supported.' },
    { text: 'GitHub Discussions are best used for tracking specific bugs with a clear owner.', isTrue: false, explanation: 'That is what issues are for; Discussions suit open-ended conversation, questions and announcements.' },
  ],
  resources: [
    { label: 'About Projects', url: 'https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects' },
    { label: 'Managing access to your projects', url: 'https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-your-project/managing-access-to-your-projects' },
    { label: 'Using the built-in automations', url: 'https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations' },
    { label: 'Communicating on GitHub', url: 'https://docs.github.com/en/get-started/using-github/communicating-on-github' },
  ],
};

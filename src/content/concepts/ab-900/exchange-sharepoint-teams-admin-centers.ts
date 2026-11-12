import type { Concept } from '../../types';

export const exchangeSharepointTeamsAdminCenters: Concept = {
  id: 'exchange-sharepoint-teams-admin-centers',
  title: 'Workload Admin Centers: Exchange, SharePoint and Teams Objects',
  summary:
    'Which objects you configure in the Exchange, SharePoint and Teams admin centers (mailboxes, groups, sites, libraries, teams, channels, policies), how SharePoint site permissions really work, and why the answer to "where do I change this?" depends on the object, not the admin.',
  certs: ['ab-900'],
  domains: ['ab-900-1'],
  outcomes: ['ab-900-1-1-3', 'ab-900-1-1-4', 'ab-900-1-1-5', 'ab-900-1-1-6'],
  tags: ['exchange-admin-center', 'sharepoint-admin-center', 'teams-admin-center', 'permissions', 'mailboxes', 'fundamentals'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'Exchange admin center: recipients and groups',
      body: `The **Exchange admin center (EAC)** manages everything mail-related in Exchange Online. Its core object is the **recipient**, any mail-enabled object that can receive a message:

- **User mailbox**: one person's mail, calendar, contacts and tasks. Needs an Exchange licence.
- **Shared mailbox**: a mailbox several people open (info@, support@). No licence is needed below the storage limit, and access is granted with *Full Access* and *Send As* or *Send on Behalf* permissions.
- **Resource mailboxes**: **room** (a meeting location) and **equipment** (a projector or pool car) that can be booked in meeting requests.
- **Mail contact** (external person in the address book) and **mail user** (external address but with an account you can assign permissions to).

Groups in the EAC are the mail side of the group story: **distribution groups**, **mail-enabled security groups**, **dynamic distribution groups** (membership computed from recipient filters at send time) and **Microsoft 365 groups**. The EAC is also where you handle **mail flow rules**, accepted domains, connectors, migrations and mailbox features such as litigation hold and archive.

The exam angle: if the question is about a mailbox, a shared or resource mailbox, who can send as a group, or a distribution list, the object lives in the EAC. Deciding the *type* of group that can carry permissions is covered under security objects; the EAC simply manages the mail-enabled ones.`,
    },
    {
      heading: 'SharePoint admin center: sites, and what happens below them',
      body: `The **SharePoint admin center** operates at the level of **sites**. The **Active sites** page lists every site collection: group-connected **team sites** (each backed by a Microsoft 365 group and often a team), **communication sites** (broadcast content, not group-connected), **channel sites** (private and shared Teams channels get their own site) and **hub sites** that join related sites with shared navigation. From here an admin creates sites, sets storage limits, changes sharing settings, adds or removes site admins, associates hubs, applies sensitivity labels, and configures restricted access or restricted content discovery.

Tenant-wide behaviour sits under **Policies**: **Sharing** (the external sharing level from *Anyone* down to *Only people in your organization*, default link type, expiry of Anyone links) and **Access control** (unmanaged devices, idle session sign-out, network location, site-level access restriction). **Reports** holds data access governance. **Settings** covers site creation, storage and the default time zone.

**Libraries and folders are not administered from the admin center.** They are managed inside the site by its owners: create a document library, set a default sensitivity label on the library, enable versioning, break permission inheritance on a folder. An admin who needs to fix a library adds themselves as a site admin and goes to the site. When a question asks where to configure a document library, the answer is the site itself, not the SharePoint admin center.`,
    },
    {
      heading: 'SharePoint roles and permissions',
      body: `Every site carries three default **SharePoint groups**, each mapped to a **permission level**:

| SharePoint group | Permission level | Can |
|---|---|---|
| Owners | Full Control | Everything, including managing permissions |
| Members | Edit | Add, edit and delete lists, libraries and items |
| Visitors | Read | View and download |

Other built-in levels exist (Design, Contribute, Limited Access), but these three cover almost every scenario. **Site admins** (set in the admin center) sit above site owners and are the right place for IT's break-glass access.

How you *manage* membership depends on the site type:

- **Group-connected team sites and Teams**: manage people through the Microsoft 365 group or the team. Group owners become site owners, members become site members. Private and shared channel sites can only be managed in Teams.
- **Communication sites**: add users, security groups or Microsoft 365 groups directly to Owners, Members or Visitors.

**Inheritance** is the key mechanism: libraries inherit from the site and files from the library until someone assigns unique permissions or shares an item. Sharing a single file silently breaks inheritance for that file and hands out *Limited Access* up the tree. Sharing links (*Anyone*, *People in your organization*, *Specific people*) are the main way permissions sprawl, which is why oversharing work later in this exam always comes back to sites and links.`,
    },
    {
      heading: 'Teams admin center: teams, channels and policies',
      body: `The **Teams admin center** (admin.teams.microsoft.com, Teams Administrator role) manages three kinds of object.

**Teams** (Teams > Manage teams): every team is a Microsoft 365 group. The grid shows channel counts, owners, guests, privacy (public or private), sensitivity label and expiry. From here an admin creates a team, edits membership, **archives** (read-only), restores a deleted team within 30 days, renews an expiring team and fixes **ownerless teams**.

**Channels**: **standard** channels share the team's site; **private** channels (subset of the team) and **shared** channels (people outside the team or outside the organisation) each get their own SharePoint site, which is why their permissions are managed in Teams, not SharePoint.

**Policies** are where behaviour is controlled, each with an org-wide default (*Global*) plus custom policies assigned to users or groups:

- **Teams policies**: who can create private and shared channels, invite external users to shared channels.
- **Meeting policies**: recording, **transcription** (Copilot in meetings needs transcription or the "without transcript" setting), who can bypass the lobby, Copilot in meetings.
- **Messaging policies**: delete or edit messages, read receipts, chat with external users.
- **App permission and setup policies**: which apps (including agents) users can install and which are pinned.

Changes to policies can take up to 24 hours. When a question is about *what users can do in Teams*, think policy; when it is about *who belongs to a team*, think Microsoft 365 group membership.`,
    },
  ],
  examples: [
    {
      title: 'A support@ address that five people need to read',
      description:
        'The service desk asks for support@contoso.com to be visible to five agents. The admin creates a shared mailbox in the Exchange admin center, adds the five agents with Full Access and Send As, and does not buy a licence for it. A user mailbox with a shared password would have cost a licence and broken the audit trail.',
      takeaway: 'Shared mailboxes are the EAC object for team addresses; they need no licence and keep individual accountability.',
    },
    {
      title: 'Managing a team site from the wrong place (a realistic mistake)',
      description:
        'A SharePoint admin adds a contractor directly to the Members group of a Teams-connected site so they can edit documents. The contractor can open the site but not the team, Planner or the group mailbox, and the team owners cannot see why. The correct action was to add the contractor to the team (the Microsoft 365 group) so every connected service lines up.',
      takeaway: 'For group-connected sites, manage permissions through the Microsoft 365 group or Teams, not through SharePoint groups.',
    },
    {
      title: 'Copilot in meetings is "not available"',
      description:
        'Managers report that Copilot cannot be used during Teams meetings. The admin checks the Teams admin center meeting policy: transcription is turned off for the organisation. Copilot in meetings relies on the transcript, so the fix is a meeting policy change, not a Copilot licence or a SharePoint setting.',
      language: 'text',
      code: `Teams admin center
  Meetings > Meeting policies > Global (Org-wide default)
    Recording & transcription
      Transcription ............ On
      Copilot .................. On (or "On only with retained transcript")
  Save  (allow up to 24 hours to apply)`,
      takeaway: 'Copilot meeting behaviour is governed by Teams meeting policies, which is a Teams admin center object.',
    },
  ],
  keyPoints: [
    'Exchange admin center objects: user, shared, room and equipment mailboxes; mail contacts and mail users; distribution, mail-enabled security, dynamic distribution and Microsoft 365 groups; mail flow rules.',
    'Shared mailboxes need no licence and are accessed with Full Access and Send As or Send on Behalf permissions.',
    'The SharePoint admin center manages sites (Active sites), tenant sharing and access control policies and reports; libraries and folders are configured inside the site by site owners.',
    'Default SharePoint groups map to permission levels: Owners = Full Control, Members = Edit, Visitors = Read; site admins sit above owners.',
    'Group-connected team sites and channel sites are permissioned through the Microsoft 365 group or team; communication sites use SharePoint groups directly.',
    'Permissions inherit from site to library to item until unique permissions or a sharing link break inheritance.',
    'The Teams admin center manages teams (Microsoft 365 groups), channels (standard, private, shared) and policies (teams, meeting, messaging, app) with a Global default plus custom assignments.',
  ],
  flashcards: [
    { front: 'Which mailbox type is used for a conference room?', back: 'A room mailbox, a type of resource mailbox managed in the Exchange admin center.' },
    { front: 'Does a shared mailbox require a licence?', back: 'No, as long as it stays within the shared mailbox storage limit and does not need features such as archive or litigation hold.' },
    { front: 'How is dynamic distribution group membership determined?', back: 'By recipient filters evaluated in Exchange each time a message is sent.' },
    { front: 'Which page in the SharePoint admin center lists all site collections?', back: 'Sites > Active sites.' },
    { front: 'Where do you create a document library?', back: 'Inside the SharePoint site itself (site owner action), not in the SharePoint admin center.' },
    { front: 'Default permission level of the SharePoint Members group?', back: 'Edit.' },
    { front: 'How should permissions be managed for a private channel site?', back: 'Only through Teams; SharePoint shows them read-only.' },
    { front: 'What is a Teams policy with the name Global?', back: 'The org-wide default policy that applies to everyone who has no custom policy assigned.' },
    { front: 'Which Teams admin center policy controls whether users can create private or shared channels?', back: 'Teams policies (Teams > Teams policies).' },
    { front: 'What happens to a team when it is archived?', back: 'It becomes read-only in Teams but is retained; it can be unarchived later.' },
  ],
  quiz: [
    {
      question: 'Contoso needs a mailbox for a training room so staff can book it in Outlook meeting requests. Which object should the administrator create in the Exchange admin center?',
      options: ['A shared mailbox', 'A room mailbox', 'A mail contact', 'A distribution group'],
      correct: [1],
      explanation:
        'Room mailboxes are resource mailboxes designed for booking locations. Shared mailboxes are for teams reading the same mail, mail contacts represent external people, and distribution groups broadcast email.',
    },
    {
      question: 'A site owner asks you to enable versioning and a default sensitivity label on a document library in a communication site. Where is this configured?',
      options: [
        'SharePoint admin center > Active sites > the site > Settings',
        'In the document library settings inside the site',
        'Microsoft 365 admin center > Settings > Org settings',
        'Teams admin center > Teams policies',
      ],
      correct: [1],
      explanation:
        'Library and folder settings are managed within the site by owners. The SharePoint admin center works at the site level, Org settings are tenant-wide, and Teams policies control Teams behaviour.',
    },
    {
      question: 'Users in a Teams-connected site need to add and edit documents but must not manage permissions. Which SharePoint permission level, held by which default group, provides this?',
      options: ['Full Control held by Owners', 'Edit held by Members', 'Read held by Visitors', 'Design held by Members'],
      correct: [1],
      explanation:
        'Members have Edit, which allows adding, editing and deleting content without managing permissions. Owners have Full Control, Visitors only Read, and Design is not assigned to a default group.',
    },
    {
      question: 'Which TWO objects are managed in the Microsoft Teams admin center? (Select two)',
      options: [
        'Meeting policies that control transcription and Copilot in meetings',
        'Room mailboxes',
        'Teams, including archiving and restoring deleted teams',
        'Document library versioning settings',
      ],
      correct: [0, 2],
      explanation:
        'Meeting policies and team lifecycle are Teams admin center tasks. Room mailboxes belong to the Exchange admin center and library settings to the SharePoint site.',
    },
    {
      question: 'A contractor was added directly to the SharePoint Members group of a group-connected team site. They can open the site but not the team or Planner. What should the administrator do to fix this with the LEAST ongoing effort?',
      options: [
        'Add the contractor to the Microsoft 365 group (the team) and remove the direct SharePoint permission.',
        'Grant the contractor Full Control on the site.',
        'Create a separate communication site for the contractor.',
        'Assign the contractor the SharePoint Administrator role.',
      ],
      correct: [0],
      explanation:
        'Group-connected sites should be permissioned through the Microsoft 365 group so every connected service aligns. Full Control and admin roles over-privilege, and a new site does not solve access to the team.',
    },
    {
      question: 'Which setting determines whether users across the organisation can share SharePoint content with people outside the company?',
      options: [
        'The External sharing level under Policies > Sharing in the SharePoint admin center',
        'The Visitors group on each site',
        'The Teams messaging policy',
        'The Exchange accepted domains list',
      ],
      correct: [0],
      explanation:
        'External sharing is a tenant (and per-site) policy in the SharePoint admin center. Visitors groups grant internal read access, messaging policies control chat, and accepted domains are about mail routing.',
    },
  ],
  statements: [
    { text: 'Room and equipment mailboxes are managed in the Exchange admin center.', isTrue: true, explanation: 'They are resource mailbox recipient types.' },
    { text: 'A document library is created and configured from the SharePoint admin center.', isTrue: false, explanation: 'Libraries and folders are configured inside the site by site owners; the admin center manages sites.' },
    { text: 'By default the SharePoint Owners group has Full Control.', isTrue: true, explanation: 'Owners = Full Control, Members = Edit, Visitors = Read.' },
    { text: 'Permissions on a private channel site can be edited directly in SharePoint.', isTrue: false, explanation: 'Channel site permissions are managed only in Teams and appear read-only in SharePoint.' },
    { text: 'Every team in Microsoft Teams is backed by a Microsoft 365 group.', isTrue: true, explanation: 'Teams uses the group for membership and the connected SharePoint site, mailbox and Planner.' },
    { text: 'Changes to a Teams policy always apply instantly.', isTrue: false, explanation: 'Policy changes can take up to 24 hours to take effect.' },
    { text: 'Sharing a single file with a colleague can break permission inheritance on that file.', isTrue: true, explanation: 'SharePoint stops inheritance on the item and grants Limited Access to parent containers.' },
  ],
  resources: [
    { label: 'Recipients in Exchange Online', url: 'https://learn.microsoft.com/en-us/exchange/recipients-in-exchange-online/recipients-in-exchange-online' },
    { label: 'Manage sites in the SharePoint admin center', url: 'https://learn.microsoft.com/en-us/sharepoint/manage-sites-in-new-admin-center' },
    { label: 'Sharing and permissions in the SharePoint modern experience', url: 'https://learn.microsoft.com/en-us/sharepoint/modern-experience-sharing-permissions' },
    { label: 'Manage teams in the Microsoft Teams admin center', url: 'https://learn.microsoft.com/en-us/microsoftteams/manage-teams-in-modern-portal' },
  ],
};

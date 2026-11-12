import type { Concept } from '../../types';

export const exchangeAndTeamsWorkloads: Concept = {
  id: 'exchange-and-teams-workloads',
  title: 'Managing Mailboxes, Teams and Copilot in Teams Meetings',
  summary:
    'Day-two administration of Exchange Online and Microsoft Teams: creating user and shared mailboxes with the right delegation, managing teams, channels, owners and members in the Teams admin center and PowerShell, and configuring the Copilot and transcription meeting policies that decide whether Copilot works in meetings.',
  certs: ['ab-650'],
  domains: ['ab-650-1'],
  outcomes: ['ab-650-1-2-1', 'ab-650-1-2-2', 'ab-650-1-2-3'],
  tags: ['exchange-online', 'shared-mailbox', 'microsoft-teams', 'teams-admin-center', 'meeting-policy', 'transcription', 'copilot-in-teams', 'powershell'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Mailboxes and shared mailboxes',
      body: `A **user mailbox** is created when a licensed user with an Exchange Online service plan is added (Microsoft 365 admin center > Users > Active users, or *New-MgUser* plus a licence). Mailbox properties, aliases, forwarding, litigation hold, and archive are managed in the **Exchange admin center (EAC)** under **Recipients > Mailboxes**, or with Exchange Online PowerShell (*Get-Mailbox*, *Set-Mailbox*, *Set-CASMailbox*).

A **shared mailbox** (info@, support@) lets a group monitor and send from a common address. Create it in the Microsoft 365 admin center (**Teams & groups > Shared mailboxes**) or the EAC (**Recipients > Mailboxes > Add a shared mailbox**). Facts the exam leans on:

- Shared mailboxes **do not need a licence** up to 50 GB; add an Exchange Online Plan 2 licence for 100 GB, an archive or litigation hold.
- Creating one also creates a disabled-sign-in user account with a system password; keep sign-in blocked.
- Delegation uses **Full Access** (open the mailbox and work with items), **Send As** (mail appears from the shared mailbox) and **Send on Behalf** (shows "on behalf of"). Both Full Access and Send As are normally granted for a working shared mailbox.
- Convert a departed user's mailbox to shared with *Set-Mailbox -Type Shared* to retain mail without a licence (remove the licence only after conversion).
- Hybrid organizations create and manage shared mailboxes from on-premises Exchange.

Other recipient types to recognise: **room and equipment mailboxes** (resource booking policies), **distribution groups** and **mail-enabled security groups**, **dynamic distribution groups**, and **mail contacts** for external people in the address book. Microsoft 365 Copilot requires the user's **primary mailbox in Exchange Online** for mailbox-grounded experiences and is not available in group mailboxes.`,
    },
    {
      heading: 'Teams, channels, owners and members',
      body: `A **team** is a Microsoft 365 group plus a SharePoint site, a group mailbox and Teams-specific settings. Admins manage teams in the **Teams admin center > Teams > Manage teams** (Teams Administrator or Global Administrator; Teams Reader can view). The grid shows standard, private and shared channel counts, members, owners, guests, privacy, status (active, archived, expiring), sensitivity label and the group ID. From here you can **add** a team (name, description, public or private, sensitivity), **edit** settings, open the profile to manage **members, owners and channels**, **archive**, or **delete** (restorable for 30 days through the deleted Microsoft 365 group).

Channel types:

- **Standard**: visible to all team members.
- **Private**: subset of members; has its own SharePoint site collection.
- **Shared**: members from other teams or external organizations (needs B2B direct connect in cross-tenant access settings); also a separate site collection.

Governance controls you should recognise: **team creation restrictions** via the Microsoft Entra group setting *GroupCreationAllowedGroupId*, **group expiration policies**, **naming policies**, **sensitivity labels** on teams (privacy, guest access, unmanaged-device access), and the **ownerless group** policy that emails members to take ownership. Every team should have at least two owners; a user's departure can leave a team ownerless, and admins fix this from Manage teams.

PowerShell (MicrosoftTeams module): *New-Team*, *Add-TeamUser -Role Owner*, *New-TeamChannel -MembershipType Private*, *Get-Team | Where-Object Archived*. Microsoft Graph PowerShell equivalents exist under *New-MgTeam*.`,
    },
    {
      heading: 'Copilot in Teams meetings and transcription',
      body: `Copilot in Teams meetings works for participants with a Microsoft 365 Copilot licence, summarising discussion, telling who said what and suggesting follow-ups, in meetings and events of up to 1,000 attendees. It is unavailable in end-to-end encrypted meetings. Two admin settings decide how it behaves, both in **Teams admin center > Meetings > Meeting policies > Recording & transcription**, or in PowerShell via *Set-CsTeamsMeetingPolicy*:

**Copilot** (-Copilot parameter) sets the organizer's default and whether they can change it:

| Admin center value | PowerShell | Effect |
|---|---|---|
| On | Enabled | Default *Only during the meeting*; organizer can switch to *During and after* or *Off* |
| On with saved transcript required | EnabledWithTranscript (default) | *During and after the meeting* enforced; organizers cannot change it |
| On with transcript saved by default | EnabledWithTranscriptDefaultOn | Default *During and after*; organizer may choose *Only during* or *Off* |
| Off | Disabled | Default *Off*; organizers can still turn it on |

**Transcription** (-AllowTranscription) decides whether a saved transcript can exist. With *During and after the meeting*, Copilot only works once someone starts transcription; if transcription is off in policy, licensed users cannot use Copilot unless another participant with permission transcribes. *Only during the meeting* uses temporary speech-to-text data that is not stored after the meeting, so it works even when transcription is off. When an organizer sets Copilot to **Off**, recording and transcription are disabled too.

Retention policies may keep Copilot prompts and responses even when nothing is recorded. Policies are assigned to users or groups, and Copilot settings can be baked into **meeting templates**. The Microsoft 365 admin center Copilot settings page links to this Teams admin center location. A **Copilot custom dictionary** improves recognition of organization-specific terms in transcripts.`,
    },
    {
      heading: 'The exam angle',
      body: `Expect operational scenarios with one correct admin surface:

- "Users must reply from support@contoso.com so it appears to come from the mailbox" means **Send As**; "it should show *on behalf of*" means **Send on Behalf**; "open the mailbox in Outlook" means **Full Access**.
- "Retain a leaver's mail without a licence" means **convert to shared mailbox**, not delete and restore.
- "Compliance requires a saved transcript whenever Copilot is used in meetings" means the Copilot policy **On with saved transcript required** (*EnabledWithTranscript*).
- "Legal does not want transcripts stored but wants Copilot usable live" means **On** (*Enabled*) with organizers choosing *Only during the meeting*, or transcription turned off while Copilot stays on.
- "Users with Copilot licences see no Copilot button in meetings" usually traces back to transcription being off in the meeting policy plus the *During and after* setting, an E2EE meeting, or the organizer setting Copilot to Off.
- "A team's only owner left" is remediated from Teams admin center > Manage teams (or the ownerless group policy), not by recreating the team.
- Private channel content lives in its **own SharePoint site**, so eDiscovery, retention and Copilot grounding treat it separately from the team site.

Distractors to recognise: Exchange mail flow rules do not grant mailbox permissions; Conditional Access does not control Copilot in meetings; sensitivity labels control team privacy and guest access but not transcription.`,
    },
  ],
  examples: [
    {
      title: 'Creating a shared mailbox with delegation in Exchange Online PowerShell',
      description:
        'The Sales department needs sales@contoso.com. The admin creates the shared mailbox and grants the mail-enabled security group SalesTeam both Full Access (open it) and Send As (reply as the mailbox), then blocks sign-in on the underlying account.',
      language: 'powershell',
      code: `Connect-ExchangeOnline

New-Mailbox -Shared -Name "Sales" -DisplayName "Sales" -Alias Sales -PrimarySmtpAddress sales@contoso.com

Add-MailboxPermission -Identity Sales -User SalesTeam -AccessRights FullAccess -InheritanceType All
Add-RecipientPermission -Identity Sales -Trustee SalesTeam -AccessRights SendAs -Confirm:$false

# Optional: show the mailbox in delegates' Outlook automatically (default) and block sign-in
Set-Mailbox Sales -MessageCopyForSentAsEnabled $true
Connect-MgGraph -Scopes "User.ReadWrite.All"
Update-MgUser -UserId sales@contoso.com -AccountEnabled:$false`,
      takeaway: 'Full Access plus Send As is the standard pairing for a working shared mailbox; keep the shared account blocked from sign-in.',
    },
    {
      title: 'Licensed users cannot see Copilot in meetings (a realistic mistake)',
      description:
        'After a Copilot rollout, finance users with licences report that the Copilot button is greyed out in their weekly meeting. The admin finds the Finance meeting policy has transcription turned off while Copilot is set to "On with saved transcript required" (the default). Because that setting enforces "During and after the meeting", Copilot needs a transcript that the policy forbids. The fix is either to allow transcription for that policy or to change Copilot to "On" so organizers can use the "Only during the meeting" mode with temporary speech-to-text.',
      takeaway: 'The Copilot and transcription meeting policies interact; "During and after" requires transcription to be possible.',
    },
    {
      title: 'Enforcing transcripts for regulated meetings with PowerShell',
      description:
        'A bank requires that any meeting where Copilot is used must keep a transcript for compliance. The admin creates a dedicated meeting policy with transcription allowed and Copilot enforced with transcript, then assigns it to the Trading group.',
      language: 'powershell',
      code: `Connect-MicrosoftTeams

New-CsTeamsMeetingPolicy -Identity "Regulated-Copilot" -AllowTranscription $true -Copilot EnabledWithTranscript

# Assign to a group (rank decides precedence when a user is in several groups)
New-CsGroupPolicyAssignment -GroupId <TradingGroupObjectId> -PolicyType TeamsMeetingPolicy -PolicyName "Regulated-Copilot" -Rank 1`,
      takeaway: 'EnabledWithTranscript enforces "During and after the meeting" so organizers cannot run Copilot without a saved transcript.',
    },
    {
      title: 'Fixing an ownerless team',
      description:
        'The Project Falcon team\'s single owner left the company and HR hard-deleted the account. Members cannot add new colleagues. The Teams Administrator opens Teams admin center > Teams > Manage teams, filters on Owners = 0, opens the team profile, and promotes two members to owner. The admin then configures the Microsoft 365 group ownerless policy so future cases notify active members automatically.',
      takeaway: 'Ownerless teams are fixed from Manage teams; the ownerless group policy prevents repeats.',
    },
  ],
  keyPoints: [
    'Shared mailboxes need no licence up to 50 GB; add an Exchange Online Plan 2 licence for 100 GB, archive or litigation hold. Keep the underlying account sign-in blocked.',
    'Full Access opens the mailbox, Send As sends as the mailbox, Send on Behalf shows "on behalf of"; convert leavers\' mailboxes to shared to retain mail without a licence.',
    'Teams admin center > Manage teams shows channels, owners, members, guests, privacy, status and sensitivity; add, edit, archive, delete and fix ownerless teams there or with the MicrosoftTeams PowerShell module.',
    'Standard channels share the team site; private and shared channels each get their own SharePoint site collection, which matters for permissions, retention and Copilot grounding.',
    'The Teams meeting policy Copilot setting has four values: Enabled, EnabledWithTranscript (default, enforces During and after), EnabledWithTranscriptDefaultOn and Disabled.',
    '"During and after the meeting" needs transcription; "Only during the meeting" uses temporary speech-to-text and works without saved transcripts. Organizer Off also disables recording and transcription.',
    'Copilot in meetings needs a Microsoft 365 Copilot licence per participant, is unavailable in end-to-end encrypted meetings, and Copilot prompts may still be retained by Purview retention policies.',
  ],
  flashcards: [
    { front: 'How large can an unlicensed shared mailbox be?', back: '50 GB. An Exchange Online Plan 2 licence raises it to 100 GB and enables archive and litigation hold.' },
    { front: 'Which two permissions are normally granted for a working shared mailbox?', back: 'Full Access (open the mailbox) and Send As (send as the mailbox).' },
    { front: 'How do you keep a departed employee\'s mail without paying for a licence?', back: 'Convert the mailbox to a shared mailbox (Set-Mailbox -Type Shared), then remove the licence.' },
    { front: 'Where does private channel content live?', back: 'In its own SharePoint site collection, separate from the team site.' },
    { front: 'Which roles have full management rights in the Teams admin center?', back: 'Teams Administrator and Global Administrator; Teams Reader is read-only.' },
    { front: 'What is the default value of the Copilot meeting policy setting?', back: 'EnabledWithTranscript ("On with saved transcript required"): During and after the meeting is enforced.' },
    { front: 'Which Copilot meeting mode works without a saved transcript?', back: '"Only during the meeting", which uses temporary speech-to-text data that is not stored.' },
    { front: 'What happens when an organizer sets Copilot to Off for a meeting?', back: 'Recording and transcription are also turned off for that meeting.' },
    { front: 'Which PowerShell cmdlet and parameter configure Copilot in Teams meetings?', back: 'Set-CsTeamsMeetingPolicy -Copilot (Enabled, EnabledWithTranscript, EnabledWithTranscriptDefaultOn, Disabled).' },
    { front: 'Can Copilot be used in end-to-end encrypted Teams meetings?', back: 'No.' },
    { front: 'Which Entra group setting restricts who can create teams?', back: 'GroupCreationAllowedGroupId in the group settings template (Group.Unified).' },
  ],
  quiz: [
    {
      question:
        'Contoso needs a mailbox at helpdesk@contoso.com that ten analysts can open in Outlook and reply from so that replies appear to come from helpdesk@contoso.com, not from the analyst. No extra licences should be purchased. What should you do?',
      options: [
        'Create a Microsoft 365 group named Helpdesk and add the analysts as members.',
        'Create a shared mailbox and grant the analysts Full Access and Send As permissions.',
        'Create a user mailbox and share the password with the analysts.',
        'Create a distribution group and grant Send on Behalf permissions.',
      ],
      correct: [1],
      explanation:
        'A shared mailbox (free up to 50 GB) with Full Access and Send As meets both requirements. A Microsoft 365 group does not give the "sent from" behaviour, sharing passwords violates security practice, and Send on Behalf shows the analyst\'s name.',
    },
    {
      question:
        'An employee leaves Contoso. Their manager must keep access to the former employee\'s email for a year, and the company does not want to keep paying for the licence. What should you do FIRST?',
      options: [
        'Delete the user account and restore it when needed.',
        'Convert the mailbox to a shared mailbox and grant the manager Full Access, then remove the licence.',
        'Remove the licence immediately so the mailbox becomes inactive.',
        'Export the mailbox to a PST file and delete the account.',
      ],
      correct: [1],
      explanation:
        'Converting to a shared mailbox retains the mail without a licence (under 50 GB). Removing the licence first risks losing the mailbox after the grace period, deletion and restore is disruptive, and PST exports are not a managed access method.',
    },
    {
      question:
        'Compliance requires that whenever Copilot is used in a Teams meeting organized by anyone in the Legal department, a transcript is saved. Which Copilot meeting policy value should you assign to the Legal group?',
      options: ['Enabled', 'EnabledWithTranscript', 'EnabledWithTranscriptDefaultOn', 'Disabled'],
      correct: [1],
      explanation:
        'EnabledWithTranscript enforces "During and after the meeting" and organizers cannot change it. Enabled defaults to "Only during" and EnabledWithTranscriptDefaultOn lets organizers switch to "Only during" or Off; Disabled defaults to Off.',
    },
    {
      question: 'Which TWO statements about channels in Microsoft Teams are correct? (Select two)',
      options: [
        'A private channel stores its files in a separate SharePoint site collection.',
        'A shared channel can include members from another Microsoft Entra organization when B2B direct connect is configured.',
        'A standard channel can restrict access to a subset of team members.',
        'Archiving a team permanently deletes its channels after 30 days.',
      ],
      correct: [0, 1],
      explanation:
        'Private and shared channels have their own site collections, and shared channels support external participants through B2B direct connect. Standard channels are visible to all members, and archiving preserves content read-only; deletion is what triggers the 30-day recovery window.',
    },
    {
      question:
        'Licensed users report that Copilot is unavailable in meetings created by the Finance team. The Finance meeting policy has transcription turned off and Copilot set to the default. Which change with the LEAST impact on compliance posture restores Copilot during meetings?',
      options: [
        'Set the Copilot policy to Enabled so organizers can use the Only during the meeting mode.',
        'Assign every Finance user the Teams Administrator role.',
        'Enable end-to-end encryption for Finance meetings.',
        'Create a Conditional Access policy that grants access to Teams.',
      ],
      correct: [0],
      explanation:
        'Enabled defaults to "Only during the meeting", which uses temporary speech-to-text and does not need a saved transcript, so transcription can stay off. Admin roles and Conditional Access do not affect Copilot availability, and E2EE disables Copilot entirely.',
    },
    {
      question: 'You need to create 40 teams from a CSV file, each with two owners. Which tool is MOST appropriate?',
      options: [
        'The Microsoft Teams PowerShell module (New-Team and Add-TeamUser).',
        'The Exchange admin center bulk import wizard.',
        'Microsoft 365 Backup.',
        'The Teams admin center Add team button repeated 40 times.',
      ],
      correct: [0],
      explanation:
        'Bulk team creation is a PowerShell task. The EAC manages recipients, Backup is for recovery, and manual creation does not meet the least-effort framing.',
    },
  ],
  statements: [
    { text: 'A shared mailbox under 50 GB does not require a licence.', isTrue: true, explanation: 'A licence is needed only for more storage, an archive or litigation hold.' },
    { text: 'Send on Behalf permission makes messages appear to come directly from the shared mailbox.', isTrue: false, explanation: 'Send on Behalf shows "user on behalf of mailbox"; Send As hides the sender.' },
    { text: 'Private channels share the team\'s SharePoint site.', isTrue: false, explanation: 'Each private channel has its own site collection.' },
    { text: 'The default Copilot meeting policy enforces a saved transcript when Copilot is used.', isTrue: true, explanation: 'EnabledWithTranscript is the default and enforces "During and after the meeting".' },
    { text: 'Copilot in Teams meetings is available in end-to-end encrypted meetings.', isTrue: false, explanation: 'It is not available in E2EE meetings.' },
    { text: 'When an organizer turns Copilot off for a meeting, recording and transcription are also disabled.', isTrue: true, explanation: 'The Off meeting option disables all three.' },
    { text: 'Only Teams Administrators and Global Administrators can create or archive teams from the Teams admin center.', isTrue: true, explanation: 'Teams Reader has read-only access.' },
    { text: 'Deleted teams cannot be recovered.', isTrue: false, explanation: 'The underlying Microsoft 365 group can be restored within 30 days.' },
  ],
  resources: [
    { label: 'Create a shared mailbox in Exchange Online', url: 'https://learn.microsoft.com/en-us/exchange/collaboration-exo/shared-mailboxes' },
    { label: 'Manage teams in the Microsoft Teams admin center', url: 'https://learn.microsoft.com/en-us/microsoftteams/manage-teams-in-modern-portal' },
    { label: 'Manage Microsoft 365 Copilot in Teams meetings and events', url: 'https://learn.microsoft.com/en-us/microsoftteams/copilot-teams-transcription' },
  ],
};

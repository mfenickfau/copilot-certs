import type { Concept } from '../../types';

export const entraIdentitiesAndGroups: Concept = {
  id: 'entra-identities-and-groups',
  title: 'Users, Guests, Groups, Contacts and Bulk Management with Graph PowerShell',
  summary:
    'Creating and managing Microsoft 365 users, guest users and external collaboration settings, the group types (Microsoft 365, security, mail-enabled security, distribution, dynamic), mail contacts, and bulk operations with CSV templates and Microsoft Graph PowerShell.',
  certs: ['ab-650'],
  domains: ['ab-650-2'],
  outcomes: ['ab-650-2-1-1', 'ab-650-2-1-2', 'ab-650-2-1-3', 'ab-650-2-1-6', 'ab-650-2-1-7'],
  tags: ['microsoft-entra', 'users', 'guest-users', 'groups', 'microsoft-365-groups', 'contacts', 'bulk-management', 'graph-powershell'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Creating and managing users',
      body: `Users are created in the **Microsoft 365 admin center (Users > Active users > Add a user)** or the **Microsoft Entra admin center (Entra ID > Users > New user)**. A Microsoft 365 user needs a display name, a **user principal name (UPN)** on a verified domain, a password (or auto-generated one with "require change at next sign-in"), a **usage location** (required before licence assignment), and optionally licences, roles, and profile properties such as department and manager. Identity sources are **cloud-only**, **synchronised from on-premises Active Directory** through Microsoft Entra Connect or cloud sync (many properties then become read-only in the cloud), or **external** (guests).

Routine tasks and where they live:

- **Reset password**, **block sign-in**, **revoke sessions** (sign out everywhere), and **delete** on the user's page. Deleted users sit in the recycle bin for **30 days** and can be restored with all licences and group memberships.
- **Licences and apps** tab for direct licence assignment and service-plan toggles.
- **Manager** and other attributes drive dynamic group rules, lifecycle workflows and the Copilot organizational graph.
- **Bulk operations** from Active users: add users (CSV), delete, restore, reset passwords, assign licences, and export.

Microsoft Graph PowerShell: *New-MgUser* (needs *PasswordProfile* and *UsageLocation*), *Update-MgUser*, *Remove-MgUser*, *Restore-MgDirectoryDeletedItem*, and *Set-MgUserLicense*. Minimum roles: **User Administrator** for creating and managing non-admin users; **Privileged Authentication Administrator** to reset passwords of admins; **License Administrator** for licences.`,
    },
    {
      heading: 'Guest users and external collaboration',
      body: `A **guest** is an external identity (another Entra tenant, Microsoft account, Google, email one-time passcode or SAML/WS-Fed federation) invited for **B2B collaboration**. Guests have *UserType = Guest*, appear in the directory with #EXT# in the UPN, and by default have **limited** directory permissions.

The controls layer up:

1. **External collaboration settings** (Entra admin center > External Identities > External collaboration settings): *guest user access* level (same as members, limited, or restricted to own objects), *who can invite guests* (everyone including guests, members and admins, only admins and Guest Inviters, or no one), *guest self-service sign-up*, and **allow or deny lists of domains** (collaboration restrictions).
2. **Cross-tenant access settings**: inbound and outbound trust per partner tenant for B2B collaboration and **B2B direct connect** (shared channels), including trusting the partner's MFA and device compliance claims.
3. **Microsoft 365 group and Teams guest access** switches (Microsoft 365 admin center > Org settings > Microsoft 365 Groups; Teams admin center > Guest access), **SharePoint external sharing** levels, and **sensitivity labels** on containers that can block guests.
4. **Access reviews** (Entra ID Governance) to recertify guests, and **Conditional Access** targeting the *Guest or external users* assignment.

Guest users consume no licence for most Microsoft 365 collaboration, but Copilot licences cannot be assigned to guests, and Copilot acting for a member never sees guest-restricted content the member cannot see. Exam framing: "allow only partners from fabrikam.com to be invited" is a **domain allow list**; "finance can collaborate in shared channels with Fabrikam" is **B2B direct connect** in cross-tenant access settings; "guests should not enumerate the directory" is **guest user access restricted**.`,
    },
    {
      heading: 'Groups: types, membership and management',
      body: `Choosing the right group type is a classic exam skill:

| Type | Purpose | Email | Notes |
|---|---|---|---|
| **Microsoft 365 group** | Collaboration: Teams, SharePoint site, shared mailbox and calendar, Planner | Yes | Owners and members; can be public or private; sensitivity labels; expiration policy; can assign licences |
| **Security group** | Grant access to resources, apply policies, assign licences | No | Can have assigned or dynamic membership; nested groups allowed for access but not for licensing |
| **Mail-enabled security group** | Access control plus email distribution | Yes | Created in the Exchange admin center or Microsoft 365 admin center; cannot be dynamic |
| **Distribution group** | Email only | Yes | Exchange object; owners manage membership; dynamic distribution groups evaluate Exchange attributes at send time |
| **Dynamic membership group** | Membership by rule (user.department -eq "Sales") | Depends | Requires Entra ID P1; works for security and Microsoft 365 groups |

Create and manage them in **Microsoft 365 admin center > Teams & groups > Active teams & groups**, the Entra admin center, the EAC (distribution and mail-enabled security groups), or PowerShell (*New-MgGroup*, *New-DistributionGroup*). Governance settings include **who can create Microsoft 365 groups** (restrict to a security group), **naming policy**, **expiration**, **ownerless group** notifications, and **guest access**. Deleted Microsoft 365 groups can be restored within **30 days** together with their team and site.

Groups also matter for AI governance: Copilot and Agent 365 spending policies, AI-provider access and Frontier enrolment are scoped by **security groups**, and group-based licensing cannot see nested groups.`,
    },
    {
      heading: 'Contacts and bulk management',
      body: `**Mail contacts** represent people outside the organization who should appear in the address book, such as a supplier or outsourced helpdesk, and have an external email address. **Mail users** are similar but have sign-in credentials in the tenant. Create contacts in the **Exchange admin center > Recipients > Contacts > Add a mail contact** (display name, alias, external email), the Microsoft 365 admin center (**Users > Contacts**), or with *New-MailContact*. Contacts can be hidden from the address list, used as members of distribution groups, and populated in bulk from CSV with *Import-Csv | ForEach-Object { New-MailContact ... }*.

**Bulk management** options, from least to most flexible:

- **Microsoft 365 admin center bulk actions**: upload a CSV to add users (download the template, keep headers, required columns display name, UPN and initial password), bulk-assign licences, bulk-delete.
- **Entra admin center bulk operations**: Users > **Bulk create**, **Bulk invite** (guests), **Bulk delete**, **Download users**; results arrive as a bulk operation result CSV.
- **Microsoft Graph PowerShell SDK**: *Connect-MgGraph -Scopes* with the least-privileged scopes (for example *User.ReadWrite.All*, *Group.ReadWrite.All*), then pipe *Import-Csv* into *New-MgUser*, *New-MgGroupMember* or *Set-MgUserLicense*. Use *Find-MgGraphCommand* to discover required permissions and *-WhatIf* to test. The SDK offers v1.0 and beta modules and supports app-only authentication for unattended scripts. **MSOnline and AzureAD modules are retired**, so exam answers that mention *Set-MsolUser* or *New-AzureADUser* are distractors.
- **Exchange Online PowerShell** for recipient-specific bulk tasks (*Set-Mailbox*, *Add-DistributionGroupMember*).

Remember that bulk CSV imports validate first and report row-level errors; whitespace before the UPN or a password that fails the policy are the usual causes.`,
    },
  ],
  examples: [
    {
      title: 'Bulk-creating users and adding them to a group with Graph PowerShell',
      description:
        'HR provides a CSV of 120 new hires with UPN, display name, department and country. The admin creates each user with a temporary password, sets the usage location so licensing works, and adds them to the department\'s security group that carries the Microsoft 365 licence.',
      language: 'powershell',
      code: `Connect-MgGraph -Scopes "User.ReadWrite.All","Group.ReadWrite.All"

$group = Get-MgGroup -Filter "displayName eq 'All-Staff-E5'"
Import-Csv .\\newhires.csv | ForEach-Object {
  $user = New-MgUser -DisplayName $_.DisplayName -UserPrincipalName $_.UPN \`
    -MailNickname ($_.UPN.Split('@')[0]) -Department $_.Department -UsageLocation $_.Country \`
    -AccountEnabled:$true -PasswordProfile @{ Password = $_.TempPassword; ForceChangePasswordNextSignIn = $true }
  New-MgGroupMember -GroupId $group.Id -DirectoryObjectId $user.Id
}`,
      takeaway: 'Set UsageLocation at creation and let group-based licensing do the rest; use Graph PowerShell, not the retired MSOnline module.',
    },
    {
      title: 'Restricting guest invitations to approved partner domains',
      description:
        'Contoso works with Fabrikam and Northwind but has found guests from personal Gmail accounts in several teams. The admin opens Entra ID > External Identities > External collaboration settings, sets guest invite settings to "Member users and users assigned to specific admin roles can invite", and adds a collaboration restriction allowing invitations only to fabrikam.com and northwindtraders.com. An access review is created to recertify existing guests quarterly.',
      takeaway: 'Domain allow lists and invite restrictions prevent new sprawl; access reviews clean up existing guests.',
    },
    {
      title: 'Picking the wrong group type for licensing (a realistic mistake)',
      description:
        'An admin creates a distribution group named Copilot-Pilot in the Exchange admin center and tries to assign Microsoft 365 Copilot licences to it, but the group does not appear in the licence assignment picker. Distribution groups cannot be used for group-based licensing. The fix is to create a security group (or Microsoft 365 group), add the pilot users, and assign the licence to that group; the distribution list can remain for email.',
      takeaway: 'Group-based licensing requires a security, mail-enabled security or Microsoft 365 group, never a plain distribution group.',
    },
    {
      title: 'Adding an external vendor to the address book',
      description:
        'The facilities team wants the outsourced cleaning company\'s dispatcher selectable in Outlook and included in the Facilities distribution list, without creating an account. The admin creates a mail contact in the EAC (Recipients > Contacts) with the external address and adds it to the distribution group. No licence or guest account is involved.',
      language: 'powershell',
      code: `Connect-ExchangeOnline
New-MailContact -Name "CleanCo Dispatch" -ExternalEmailAddress dispatch@cleanco.example
Add-DistributionGroupMember -Identity "Facilities" -Member "CleanCo Dispatch"`,
      takeaway: 'Mail contacts are address-book entries for external people; guests are for collaboration that needs sign-in.',
    },
  ],
  keyPoints: [
    'Users need a UPN on a verified domain and a usage location before licensing; deleted users and Microsoft 365 groups can be restored within 30 days.',
    'User Administrator manages non-admin users; Privileged Authentication Administrator resets admin passwords; License Administrator assigns licences.',
    'Guest controls: external collaboration settings (access level, who can invite, domain allow/deny lists), cross-tenant access settings (B2B collaboration and direct connect), workload guest switches, sensitivity labels and access reviews.',
    'Microsoft 365 groups are for collaboration (Teams, SharePoint, mailbox); security groups for access, policies and licensing; mail-enabled security groups add email; distribution groups are email only; dynamic membership needs Entra ID P1.',
    'Group-based licensing and most AI scoping (spending policies, AI providers, Frontier) use security groups; distribution groups and nested groups do not work for licensing.',
    'Mail contacts are address-book objects for external people with no sign-in; create them in the EAC or with New-MailContact.',
    'Bulk management: admin center CSV templates, Entra bulk create/invite/delete, and Microsoft Graph PowerShell (Connect-MgGraph with least-privilege scopes, Import-Csv pipelines); MSOnline and AzureAD modules are retired.',
  ],
  flashcards: [
    { front: 'What must be set on a user before a licence can be assigned directly?', back: 'A usage location.' },
    { front: 'How long can a deleted user or Microsoft 365 group be restored?', back: '30 days.' },
    { front: 'Which role is the minimum to create and manage non-admin users?', back: 'User Administrator.' },
    { front: 'Where do you restrict which domains guests can be invited from?', back: 'Entra ID > External Identities > External collaboration settings > Collaboration restrictions (allow or deny list).' },
    { front: 'What enables shared channels with another organization?', back: 'B2B direct connect, configured in cross-tenant access settings for the partner tenant (inbound and outbound).' },
    { front: 'Which group type provides a Teams team, SharePoint site and shared mailbox?', back: 'A Microsoft 365 group.' },
    { front: 'Which licence do dynamic membership groups require?', back: 'Microsoft Entra ID P1 for each member of a dynamic group.' },
    { front: 'Can a distribution group be used for group-based licensing?', back: 'No. Use a security, mail-enabled security or Microsoft 365 group.' },
    { front: 'What is a mail contact?', back: 'A mail-enabled directory object with an external email address, used to show external people in the address book without a sign-in account.' },
    { front: 'Which columns are required in the Entra bulk-create CSV?', back: 'Name [displayName], User name [userPrincipalName] and Initial password [passwordProfile].' },
    { front: 'Which cmdlet shows the permissions needed for a Graph PowerShell command?', back: 'Find-MgGraphCommand -Command <cmdlet> | Select -ExpandProperty Permissions' },
    { front: 'Which PowerShell modules are retired and should not appear in a correct answer?', back: 'MSOnline (Msol cmdlets) and AzureAD; use Microsoft Graph PowerShell instead.' },
  ],
  quiz: [
    {
      question:
        'You must ensure that only members of the Legal department can invite guest users, and that invitations are only possible to users at fabrikam.com. Which TWO configurations are required? (Select two)',
      options: [
        'In External collaboration settings, allow invitations only to the fabrikam.com domain.',
        'Set guest invite settings so only users assigned to specific admin roles can invite, and assign the Guest Inviter role to the Legal group.',
        'Enable B2B direct connect for fabrikam.com in cross-tenant access settings.',
        'Create a dynamic distribution group for Legal.',
      ],
      correct: [0, 1],
      explanation:
        'The domain allow list limits where guests can come from, and restricting invitations to admin roles plus the Guest Inviter role limits who can invite. B2B direct connect is for shared channels, and a distribution group has no effect on invitations.',
    },
    {
      question:
        'A project team needs a shared calendar, a Teams team and a SharePoint site, and new members should receive a Microsoft 365 Copilot licence automatically. Which single object meets all requirements?',
      options: ['A distribution group', 'A mail-enabled security group', 'A Microsoft 365 group', 'A dynamic security group'],
      correct: [2],
      explanation:
        'A Microsoft 365 group provides the collaboration workloads and supports group-based licensing. Distribution groups cannot carry licences, and security groups do not create a team or site.',
    },
    {
      question:
        'An admin runs a bulk user import from the Microsoft 365 admin center. Twelve rows fail with an error about the user name. Which is the MOST likely cause?',
      options: [
        'The CSV contains leading whitespace before the UPN values.',
        'The admin lacks the Reports Reader role.',
        'The users were not assigned a Copilot licence.',
        'The CSV did not include a department column.',
      ],
      correct: [0],
      explanation:
        'Whitespace before UPNs is a documented cause of import failure. Reports Reader is unrelated, licences are optional at import time, and department is not a required column.',
    },
    {
      question:
        'You need to add an external auditor\'s email address to the Finance distribution list so staff can select it from the address book. The auditor must not be able to sign in. What should you create?',
      options: ['A guest user', 'A mail contact', 'A shared mailbox', 'A mail-enabled security group'],
      correct: [1],
      explanation:
        'A mail contact is an address-book entry with an external address and no credentials. A guest can sign in, a shared mailbox is an internal mailbox, and a security group is a container rather than a person.',
    },
    {
      question:
        'A script must disable 300 accounts listed in a CSV. Which approach aligns with Microsoft\'s current guidance?',
      options: [
        'Use Set-MsolUser -BlockCredential $true from the MSOnline module.',
        'Use Update-MgUser -AccountEnabled:$false from Microsoft Graph PowerShell.',
        'Use Set-AzureADUser -AccountEnabled $false.',
        'Delete the accounts and restore them later.',
      ],
      correct: [1],
      explanation:
        'Microsoft Graph PowerShell is the supported module; MSOnline and AzureAD are retired. Deleting accounts is not the same as blocking sign-in.',
    },
    {
      question:
        'Guests in your tenant can see the membership of all groups and enumerate users. Security wants guests to see only their own profile information. Which setting should you change?',
      options: [
        'Guest user access in External collaboration settings to "restricted to properties and memberships of their own directory objects"',
        'Teams guest access to Off',
        'SharePoint external sharing to "Only people in your organization"',
        'The Microsoft 365 group expiration policy',
      ],
      correct: [0],
      explanation:
        'The guest user access level controls directory visibility. Teams and SharePoint settings control collaboration, not directory enumeration, and expiration policies concern group lifecycle.',
    },
  ],
  statements: [
    { text: 'A deleted Microsoft 365 group and its team can be restored within 30 days.', isTrue: true, explanation: 'Restoration brings back the group, team, site and mailbox.' },
    { text: 'Group-based licensing supports distribution groups.', isTrue: false, explanation: 'Only security, mail-enabled security and Microsoft 365 groups are supported.' },
    { text: 'Dynamic membership groups require a Microsoft Entra ID P1 licence.', isTrue: true, explanation: 'Each member of a dynamic group needs P1.' },
    { text: 'Guest users have the same directory permissions as members by default.', isTrue: false, explanation: 'The default is limited access; admins can widen or restrict it.' },
    { text: 'Cross-tenant access settings control B2B direct connect for shared channels.', isTrue: true, explanation: 'Inbound and outbound settings per partner tenant enable direct connect.' },
    { text: 'A mail contact can sign in to Microsoft 365 with a password.', isTrue: false, explanation: 'Mail contacts have no credentials; mail users and guests do.' },
    { text: 'Microsoft Graph PowerShell supports both delegated and app-only authentication.', isTrue: true, explanation: 'App-only is used for unattended scripts.' },
    { text: 'The AzureAD PowerShell module is the recommended tool for bulk user management.', isTrue: false, explanation: 'AzureAD and MSOnline are retired; Microsoft Graph PowerShell replaces them.' },
  ],
  resources: [
    { label: 'Configure external collaboration settings for B2B', url: 'https://learn.microsoft.com/en-us/entra/external-id/external-collaboration-settings-configure' },
    { label: 'Create a group in the Microsoft 365 admin center', url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/create-groups/create-groups' },
    { label: 'Bulk create users in Microsoft Entra ID', url: 'https://learn.microsoft.com/en-us/entra/identity/users/users-bulk-add' },
    { label: 'Get started with the Microsoft Graph PowerShell SDK', url: 'https://learn.microsoft.com/en-us/powershell/microsoftgraph/get-started' },
  ],
};

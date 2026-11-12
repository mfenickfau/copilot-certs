import type { Concept } from '../../types';

export const rolesPimAndAdministrativeUnits: Concept = {
  id: 'roles-pim-and-administrative-units',
  title: 'Admin Roles, Privileged Identity Management and Administrative Units',
  summary:
    'Least-privilege administration for Microsoft 365 and AI services: choosing the right built-in Entra role (including AI Administrator and Agent ID roles), making assignments eligible and time-bound with Privileged Identity Management, and scoping roles to parts of the organization with administrative units.',
  certs: ['ab-650'],
  domains: ['ab-650-2'],
  outcomes: ['ab-650-2-1-4', 'ab-650-2-1-5'],
  tags: ['entra-roles', 'least-privilege', 'pim', 'privileged-identity-management', 'administrative-units', 'ai-administrator', 'rbac'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Choosing the least-privileged role',
      body: `Microsoft 365 administration uses **Microsoft Entra built-in roles**, assigned in the Microsoft 365 admin center (**Roles > Role assignments**) or the Entra admin center (**Roles & administrators**). Microsoft's guidance is to keep **Global Administrator** for emergencies (two to four accounts, with break-glass accounts excluded from Conditional Access) and give everyone else a workload role. Roles that recur on AB-650:

| Task | Least-privileged role |
|---|---|
| Create users, reset non-admin passwords | **User Administrator** |
| Reset admin passwords, manage auth methods for admins | **Privileged Authentication Administrator** |
| Assign licences | **License Administrator** |
| Manage groups | **Groups Administrator** |
| Add or verify domains | **Domain Name Administrator** |
| View Service health, open support tickets | **Service Support Administrator** (Helpdesk Administrator can view) |
| Read usage reports | **Reports Reader** |
| Configure Conditional Access | **Conditional Access Administrator** |
| Manage authentication methods policy, SSPR, password protection | **Authentication Policy Administrator** |
| Manage Exchange, SharePoint, Teams | **Exchange / SharePoint / Teams Administrator** |
| Defender portal and Purview security settings | **Security Administrator** (read: Security Reader) |
| Purview compliance solutions | **Compliance Administrator** (Purview role groups add granularity) |
| Copilot settings, agents, Copilot connectors, Copilot reports, Cost management limits | **AI Administrator** (read: **AI Reader**) |
| Agent identities and blueprints in Entra | **Agent ID Administrator**, **Agent ID Developer** |
| Lifecycle workflows for agents and users | **Lifecycle Workflows Administrator** |
| Attack simulation campaigns | **Attack Simulation Administrator**, **Attack Payload Author** |

**Global Reader** gives read-only visibility across admin centers for auditors. Workload-specific products add their own RBAC: Exchange role groups, Defender XDR unified RBAC and Purview role groups, which the Entra roles map into. Several AI tasks still need a highly privileged role: AI Administrator cannot create Conditional Access policies or access-package policies for agents, and connecting an MCP gateway or an independent AI provider requires Global Administrator.`,
    },
    {
      heading: 'Privileged Identity Management',
      body: `**Microsoft Entra Privileged Identity Management (PIM)** (Entra ID P2 or Entra ID Governance) replaces standing admin rights with **just-in-time**, **time-bound** access. Vocabulary matters:

- **Eligible** assignment: the user must **activate** the role (MFA, justification, optional approval, optional ticket number) for a limited duration (default maximum 8 hours per role setting). **Active** assignment: rights apply immediately. Both can be **permanent** or **time-bound** with start and end dates.
- **Role settings** per role: activation maximum duration, require MFA or an authentication context, require justification, require approval and approvers, notifications, and whether permanent active assignments are allowed.
- **PIM for Groups** makes membership or ownership of a role-assignable or security group eligible, which is how you make Exchange role groups, Purview role groups or Copilot pilot groups just-in-time.
- **Access reviews** recertify who still needs eligibility; **audit history** and **alerts** (too many Global Administrators, roles assigned outside PIM, stale eligible assignments) support governance. PIM prevents removing the last active Global Administrator and Privileged Role Administrator.

Only **Privileged Role Administrator** or Global Administrator manages PIM assignments for Entra roles; Security Administrator, Security Reader and Global Reader can view them. PIM also governs **Azure resource roles** (relevant for the Azure subscription behind pay-as-you-go billing). Exam scenarios: "admins must request approval and justify Exchange Administrator for no more than four hours" means an **eligible** assignment with role settings requiring approval and a 4-hour maximum; "contractor needs Teams Administrator until 30 June" means a **time-bound active** (or eligible) assignment with an end date.`,
    },
    {
      heading: 'Administrative units',
      body: `**Administrative units (AUs)** restrict a role assignment to a subset of **users, groups or devices** instead of the whole tenant. Typical patterns: regional help desks (**Helpdesk Administrator** scoped to the EMEA AU can reset passwords only for EMEA users), a subsidiary's IT team (User Administrator for its own staff), or a school within a university.

How they work:

- Create the AU (Entra ID > Roles & admins > Admin units), add members manually, in bulk from CSV, or with a **dynamic membership rule** for users or devices (dynamic AUs need Entra ID P1 per member).
- Assign a role **with the AU as the scope** (Roles and administrators inside the AU). A role assigned at tenant scope is not restricted.
- Adding a **group** to an AU scopes management of the group object (name, membership) but **not** the properties or authentication methods of its members; add the users themselves for that.
- AUs **cannot be nested**, a user can be in many AUs, and **restricted management AUs** block tenant-level admins (other than those explicitly assigned) from modifying the members, which protects executives or break-glass accounts.
- Licensing: creating AUs is free; each AU-scoped administrator needs **Entra ID P1**.

Microsoft 365 workloads honour AUs selectively: user, group, device and authentication tasks in the Microsoft 365 and Entra admin centers, Exchange recipient management, Intune scope tags (a separate mechanism), and Purview DLP and other solutions support AU-restricted admins (an "unrestricted administrator" is needed for tenant-wide policies such as the DSPM for AI one-click policies). Distractor check: AUs do not scope **Conditional Access**, **Global Administrator**, or Azure RBAC.`,
    },
    {
      heading: 'The exam angle',
      body: `Role questions are almost always "which role, with the fewest permissions" or "what is the first action". Patterns:

- A request to view Copilot usage reports and Cost management dashboards but not change anything points to **AI Reader** (or Reports Reader for usage reports alone), never Global Reader when a narrower role fits.
- "Approve agent publish requests and manage agent settings without Global Administrator" is **AI Administrator**.
- "Help desk should reset passwords only for the Paris office" is **Helpdesk Administrator scoped to a Paris administrative unit**, not a custom role or a Conditional Access policy.
- "Reduce the number of permanent Global Administrators and require MFA and justification on activation" is **PIM eligible assignments** with role settings, usually paired with an **access review**.
- "An admin reports they are no longer Exchange Administrator at 17:00" is a PIM activation expiring; the fix is re-activation or longer maximum duration, not re-adding them permanently.
- "Prevent other admins from modifying the CEO's account" is a **restricted management administrative unit**.
- Role assignments to **groups** require the group to be **role-assignable** (created with *isAssignableToRole*), which is also what PIM for Groups uses.

Watch for distractors that solve a different problem: Conditional Access controls sign-in, not admin scope; Purview role groups cover compliance solutions, not Entra directory tasks; Exchange role groups do not grant Microsoft 365 admin center access.`,
    },
  ],
  examples: [
    {
      title: 'Regional help desk scoped with an administrative unit',
      description:
        'Contoso\'s Brazil help desk must reset passwords for Brazilian staff only. The admin creates a dynamic administrative unit with the rule user.country -eq "BR", then assigns Helpdesk Administrator to the help desk group with the AU as scope. Help desk staff see only Brazilian users when they search in the admin center.',
      language: 'powershell',
      code: `Connect-MgGraph -Scopes "AdministrativeUnit.ReadWrite.All","RoleManagement.ReadWrite.Directory"

$au = New-MgDirectoryAdministrativeUnit -DisplayName "Brazil" -MembershipType Dynamic \`
  -MembershipRule '(user.country -eq "BR")' -MembershipRuleProcessingState On

$roleDef = Get-MgRoleManagementDirectoryRoleDefinition -Filter "displayName eq 'Helpdesk Administrator'"
New-MgRoleManagementDirectoryRoleAssignment -PrincipalId "<BrazilHelpdeskGroupId>" \`
  -RoleDefinitionId $roleDef.Id -DirectoryScopeId "/administrativeUnits/$($au.Id)"`,
      takeaway: 'An AU-scoped role assignment limits an admin to the AU members; the group must be role-assignable to receive the role.',
    },
    {
      title: 'Just-in-time Exchange Administrator with approval',
      description:
        'Auditors flag seven permanent Exchange Administrators. The admin converts them to eligible assignments in PIM, sets the Exchange Administrator role settings to require MFA, justification and approval by the messaging lead, with a maximum activation of four hours, and schedules a quarterly access review of eligible members.',
      takeaway: 'Eligible plus role settings turns standing privilege into audited, time-bound activation.',
    },
    {
      title: 'Scoping a group instead of its members (a realistic mistake)',
      description:
        'An admin adds the "EMEA Users" security group to the EMEA administrative unit and assigns User Administrator to the regional team scoped to that AU. The team can rename the group and change its membership but cannot reset passwords for the members, because adding a group only scopes the group object. The fix is to add the users themselves to the AU, for example with a dynamic membership rule on the users\' country attribute.',
      takeaway: 'AU membership of a group does not cascade to its members; add users directly or use a dynamic user rule.',
    },
    {
      title: 'Choosing AI Administrator over Global Administrator',
      description:
        'The Copilot program manager asks for Global Administrator so she can approve agent requests, enable the AI disclaimer and view Copilot usage. The security team assigns AI Administrator instead, which covers Copilot settings, agent management in the Microsoft 365 admin center, Copilot connectors and Copilot reports. When she later needs a Conditional Access policy for agents, a Conditional Access Administrator creates it, because AI Administrator cannot.',
      takeaway: 'AI Administrator is the least-privileged role for Copilot and agent administration; identity policy still belongs to identity roles.',
    },
  ],
  keyPoints: [
    'Keep Global Administrator for emergencies; use workload roles such as User, License, Groups, Exchange, SharePoint, Teams, Security, Compliance and AI Administrator, with Global Reader or AI Reader for read-only access.',
    'AI Administrator manages Copilot settings, agents, connectors and reports but cannot create Conditional Access or access-package policies; some AI tasks (gateways, independent AI providers) still require Global Administrator.',
    'PIM (Entra ID P2 / ID Governance) provides eligible versus active and permanent versus time-bound assignments, activation with MFA, justification and approval, PIM for Groups, alerts and access reviews.',
    'Only Privileged Role Administrator or Global Administrator can manage PIM assignments for Entra roles.',
    'Administrative units scope a role to specific users, groups or devices; they cannot be nested, support dynamic membership (P1), and restricted management AUs protect sensitive accounts from tenant-level admins.',
    'Adding a group to an AU scopes only the group object, not its members; AU-scoped administrators each need Entra ID P1.',
    'Role assignment to a group requires a role-assignable group; Conditional Access, Global Administrator and Azure RBAC are not scoped by AUs.',
  ],
  flashcards: [
    { front: 'Which role manages Copilot settings, agents and Copilot reports with the fewest permissions?', back: 'AI Administrator (AI Reader for read-only).' },
    { front: 'Which role is needed to configure the authentication methods policy and SSPR?', back: 'Authentication Policy Administrator.' },
    { front: 'What is the difference between an eligible and an active PIM assignment?', back: 'Eligible requires activation (MFA, justification, approval) for a limited time; active grants the role immediately.' },
    { front: 'Which licence does PIM require?', back: 'Microsoft Entra ID P2 (or Microsoft Entra ID Governance).' },
    { front: 'Who can manage PIM assignments for Microsoft Entra roles?', back: 'Privileged Role Administrator or Global Administrator.' },
    { front: 'What does PIM for Groups do?', back: 'Makes membership or ownership of a group eligible and time-bound, which is how workload role groups and pilot groups get just-in-time access.' },
    { front: 'Can administrative units be nested?', back: 'No.' },
    { front: 'What happens when you add a group to an administrative unit?', back: 'The group object comes into scope (name, membership), but its members\' user properties and auth methods do not.' },
    { front: 'What is a restricted management administrative unit?', back: 'An AU whose members can only be modified by admins explicitly assigned at that AU scope, protecting sensitive accounts from tenant-level admins.' },
    { front: 'Which licence is needed for AU-scoped administrators?', back: 'Microsoft Entra ID P1 for each scoped administrator; members need only Free unless dynamic rules are used.' },
    { front: 'Does an administrative unit scope Conditional Access policies?', back: 'No. AUs scope directory role assignments, not Conditional Access or Azure RBAC.' },
  ],
  quiz: [
    {
      question:
        'Your organization has nine permanent Global Administrators. Security requires that admin rights be granted only when needed, with MFA, a business justification and approval, for no more than four hours. What should you implement?',
      options: [
        'Conditional Access policies requiring MFA for admins.',
        'Privileged Identity Management eligible assignments with role settings for approval, justification and a 4-hour maximum activation.',
        'Administrative units for each administrator.',
        'Microsoft Purview Insider Risk Management.',
      ],
      correct: [1],
      explanation:
        'PIM eligible assignments with role settings deliver just-in-time, approved, time-bound activation. Conditional Access adds MFA but not time limits or approval; AUs scope roles rather than time; Insider Risk Management detects risky activity.',
    },
    {
      question:
        'The Madrid help desk must be able to reset passwords only for employees based in Spain. Which solution uses the LEAST privilege?',
      options: [
        'Assign Helpdesk Administrator at tenant scope to the Madrid team.',
        'Create an administrative unit containing Spanish users and assign Helpdesk Administrator scoped to that AU.',
        'Assign User Administrator at tenant scope and ask the team to only touch Spanish accounts.',
        'Create a Conditional Access policy that blocks the help desk from non-Spanish users.',
      ],
      correct: [1],
      explanation:
        'An AU-scoped Helpdesk Administrator assignment limits the team to the AU members. Tenant-scoped roles are over-privileged, and Conditional Access does not scope administrative actions.',
    },
    {
      question: 'Which TWO statements about administrative units are correct? (Select two)',
      options: [
        'Administrative units can contain users, groups and devices.',
        'Administrative units can be nested to model regional hierarchies.',
        'A role assignment scoped to an AU applies only to the AU\'s members.',
        'Adding a group to an AU automatically scopes its members\' passwords and authentication methods.',
      ],
      correct: [0, 2],
      explanation:
        'AUs hold users, groups and devices and restrict scoped role assignments to those members. Nesting is not supported, and group membership in an AU does not cascade to the group\'s members.',
    },
    {
      question:
        'A Copilot program manager needs to approve agent publish requests, configure the AI disclaimer and view Copilot usage reports. She must not be able to manage Exchange or Entra identity settings. Which role should you assign?',
      options: ['Global Administrator', 'AI Administrator', 'Teams Administrator', 'Security Administrator'],
      correct: [1],
      explanation:
        'AI Administrator covers Copilot settings, agent management and Copilot reports without broader tenant rights. Global Administrator is over-privileged; Teams and Security Administrator do not cover agent governance.',
    },
    {
      question:
        'An administrator with an eligible Exchange Administrator assignment activated the role at 09:00 and lost access at 13:00 while still working on a migration. What is the MOST appropriate response?',
      options: [
        'Convert the assignment to permanent active.',
        'Re-activate the role (or extend the maximum activation duration in the role settings if four hours is routinely insufficient).',
        'Assign Global Administrator to avoid future interruptions.',
        'Add the administrator to a restricted management administrative unit.',
      ],
      correct: [1],
      explanation:
        'The role expired at the configured maximum activation. Re-activation or adjusting role settings preserves just-in-time access. Permanent or global assignments undo the least-privilege design, and AUs do not affect activation duration.',
    },
    {
      question:
        'You need to protect the accounts of five executives so that tenant-level User Administrators cannot modify them, while a small security team can. What should you configure?',
      options: [
        'A restricted management administrative unit containing the executives, with the security team assigned roles at that AU scope.',
        'A sensitivity label on the executives\' mailboxes.',
        'PIM eligible User Administrator assignments for all help desk staff.',
        'A dynamic security group for the executives.',
      ],
      correct: [0],
      explanation:
        'Restricted management AUs block tenant-scoped admins from editing members unless explicitly assigned at the AU. Labels, PIM and dynamic groups do not restrict who can modify user objects.',
    },
  ],
  statements: [
    { text: 'AI Administrator can create Conditional Access policies for agents.', isTrue: false, explanation: 'Conditional Access requires Conditional Access Administrator or a higher privileged role.' },
    { text: 'PIM can require approval before an eligible role is activated.', isTrue: true, explanation: 'Role settings support approval by designated approvers, MFA and justification.' },
    { text: 'Privileged Identity Management is included with Microsoft Entra ID P1.', isTrue: false, explanation: 'PIM requires Entra ID P2 or Microsoft Entra ID Governance.' },
    { text: 'Administrative units cannot be nested.', isTrue: true, explanation: 'A user can belong to several AUs, but AUs do not contain other AUs.' },
    { text: 'Creating administrative units requires a Microsoft Entra ID P1 licence.', isTrue: false, explanation: 'Creation is free; AU-scoped administrators and dynamic AU members need P1.' },
    { text: 'Global Reader provides read-only access across Microsoft 365 admin centers.', isTrue: true, explanation: 'It is the read-only counterpart of Global Administrator.' },
    { text: 'PIM prevents removal of the last active Global Administrator assignment.', isTrue: true, explanation: 'This safeguard also covers Privileged Role Administrator.' },
    { text: 'A role can be assigned to any security group.', isTrue: false, explanation: 'Only role-assignable groups can receive directory roles.' },
  ],
  resources: [
    { label: 'Administrative units in Microsoft Entra ID', url: 'https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/administrative-units' },
    { label: 'What is Microsoft Entra Privileged Identity Management?', url: 'https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure' },
    { label: 'Agent management roles and permissions in the Microsoft 365 admin center', url: 'https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-roles-perms' },
  ],
};

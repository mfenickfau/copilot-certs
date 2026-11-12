import type { Concept } from '../../types';

export const licensingUsersGroupsAndOrgSettings: Concept = {
  id: 'licensing-users-groups-and-org-settings',
  title: 'Licences, Users, Groups and Organisation Settings in the Microsoft 365 Admin Center',
  summary:
    'How a licence turns into features a user can actually open, how to assign licences to users and groups, which group type to pick for which job, and where domains and org-wide settings live in the Microsoft 365 admin center.',
  certs: ['ab-900'],
  domains: ['ab-900-1'],
  outcomes: ['ab-900-1-1-1', 'ab-900-1-1-2', 'ab-900-1-3-4'],
  tags: ['microsoft-365-admin-center', 'licensing', 'groups', 'domains', 'org-settings', 'fundamentals'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'A licence is a bundle of service plans',
      body: `Everything a user can do in Microsoft 365 starts with a **licence** (Microsoft also says *user subscription licence*). A product such as Microsoft 365 E3, Business Premium or the Microsoft 365 Copilot add-on is a bundle of **service plans**: Exchange Online, SharePoint, Teams, Microsoft 365 Apps, Purview features and so on. When you assign the licence, each service plan is provisioned for that user. If a plan is missing or switched off, the feature simply is not there: the user sees no Copilot button, cannot sign in to Teams, or gets "you don't have a licence" in Outlook.

Three consequences matter for an administrator:

- **Prerequisites.** Add-ons depend on a base licence. Microsoft 365 Copilot requires an eligible plan (for example Microsoft 365 E3/E5, Business Basic/Standard/Premium, Office 365 E1/E3/E5, F1/F3) and is included in Microsoft 365 E7. Assigning Copilot to a user with no qualifying base licence does not give them the apps Copilot runs in.
- **Service plans can be toggled.** On the licence details you can turn individual apps and services on or off, which is how you give someone Exchange but not Teams, or hide a feature during a pilot.
- **Usage location is required.** A user needs a usage location before a licence can be assigned, because some services are not available in every country.

Removing a licence removes access to the features and, after a grace period, the data those services hold. Deleting a user frees the licence immediately.`,
    },
    {
      heading: 'Assigning licences to users and groups',
      body: `You assign licences in the Microsoft 365 admin center in two places. **Users > Active users** is the place when you are thinking about a person: open the user, choose *Licenses and apps*, tick the products. **Billing > Licenses** is the place when you are thinking about a product: pick the product, select *Assign licenses*, add up to 20 users or groups at a time, and optionally switch apps and services on or off. You need at least the **License Administrator** or **User Administrator** role.

**Group-based licensing** assigns a licence to a security group, mail-enabled security group or Microsoft 365 group; every member inherits it and loses it when they leave the group. It is the right answer whenever the question says "least administrative effort", "new hires automatically", or "hundreds of users". Two gotchas appear on exams:

- Nested groups are not supported; only first-level members get the licence.
- Errors (not enough licences, missing usage location, conflicting service plans) are recorded on the user and surfaced later on the product page, where you can *Reprocess* them.

To move a user between licensed groups without interruption, add them to the new group first, confirm the licence applied, then remove them from the old group. A user can hold the same licence directly and through a group; removing the direct assignment then does nothing until they leave the group too.`,
    },
    {
      heading: 'Users and groups as security objects',
      body: `The identities you secure and grant access to are **users** and **groups**, stored in Microsoft Entra ID and managed from either the Microsoft 365 admin center or the Microsoft Entra admin center.

Users are **members** (your employees) or **guests** (external identities invited to collaborate). Admin roles such as Global Administrator, User Administrator or SharePoint Administrator are assigned to users, ideally as few as possible and always protected by MFA.

Groups come in several types, and exams love asking which one fits:

| Group type | Mail-enabled | Dynamic membership | Use it for |
|---|---|---|---|
| Security group | No | Yes | Granting access to resources (SharePoint sites, apps, licences, policies) |
| Mail-enabled security group | Yes | No | Access control *and* a mail address |
| Microsoft 365 group | Yes | Yes | Collaboration: a team, a SharePoint team site, Planner, shared mailbox and calendar |
| Distribution group | Yes | No (dynamic distribution groups exist, built in Exchange) | Broadcasting email to a fixed list |

Rules of thumb: permissions and licences go to **security groups**; a working team that needs Teams and files is a **Microsoft 365 group**; "everyone in Building A gets this newsletter" is a **distribution group**. **Dynamic membership** (rules on attributes such as department or country) keeps membership current without anyone editing it and is available for security and Microsoft 365 groups.`,
    },
    {
      heading: 'Domains and organisation settings',
      body: `Every tenant starts with an *onmicrosoft.com* domain. Adding a **custom domain** (Settings > Domains > Add domain) requires proving ownership, normally by adding a TXT record at your registrar, then adding the DNS records Microsoft 365 needs (MX for mail, CNAME for Autodiscover, TXT for SPF, and records for Teams and Intune). Registrars that support **Domain Connect** do this automatically. You must hold the **Domain Name Administrator** role (or Global Administrator), and you should add users before switching the MX record so mail keeps flowing. A domain can be set as the **default** so new users get it in their sign-in name.

**Settings > Org settings** holds tenant-wide switches grouped into three tabs:

- **Services**: per-service toggles such as Microsoft 365 Copilot, Copilot Chat, Microsoft Forms, Bookings, Viva, Teams and self-service trials.
- **Security & privacy**: password expiration policy, idle session sign-out, sharing (whether users can add guests), privacy profile.
- **Organization profile**: name, address, release preferences, custom themes and help desk information.

The exam angle: when a question asks where to turn an entire service on or off for the tenant, or to add a domain, the answer is the Microsoft 365 admin center, not the Entra admin center and not the individual workload centre. When it asks about identity protection, Conditional Access or roles in depth, the answer moves to Microsoft Entra.`,
    },
  ],
  examples: [
    {
      title: 'Copilot assigned but the button never appears',
      description:
        'An admin assigns a Microsoft 365 Copilot licence to a contractor who only has an Exchange Online Plan 1 licence and no Microsoft 365 Apps. The contractor reports that Word has no Copilot pane. Nothing is broken: Copilot in Word needs Microsoft 365 Apps, which the contractor is not licensed for. Copilot Chat on the web still works because it is part of the add-on.',
      takeaway: 'A licence only exposes features inside the services the user already holds; check prerequisite plans before you blame the add-on.',
    },
    {
      title: 'Automating licences for a new department (least administrative effort)',
      description:
        'Contoso opens a 300-person support centre. Instead of assigning licences one by one, the admin creates a dynamic security group with the rule department equals "Support", then assigns Microsoft 365 E3 and Copilot to the group on the Billing > Licenses page. New hires get both licences as soon as HR sets their department; leavers lose them automatically.',
      language: 'text',
      code: `Microsoft 365 admin center
  Billing > Licenses > Microsoft 365 E3 > Assign licenses
    Search: "SG-Support-Dynamic"  -> Assign
  Billing > Licenses > Microsoft 365 Copilot > Assign licenses
    Search: "SG-Support-Dynamic"  -> Assign

Entra admin center (group rule)
  (user.department -eq "Support") -and (user.accountEnabled -eq true)`,
      takeaway: 'Group-based licensing plus dynamic membership is the standard answer for scale and automation.',
    },
    {
      title: 'The wrong group type (a realistic mistake)',
      description:
        'A site owner wants the finance team to have access to a SharePoint communication site and creates a distribution group so they "can also email them". The group cannot be used to grant SharePoint permissions because a distribution group is not a security principal. The fix is a mail-enabled security group, or a security group plus a separate distribution list.',
      takeaway: 'Distribution groups deliver mail; only security groups, mail-enabled security groups and Microsoft 365 groups can carry permissions.',
    },
  ],
  keyPoints: [
    'A licence is a bundle of service plans; features appear only for users who hold the plan, and add-ons such as Copilot need an eligible base licence (included in Microsoft 365 E7).',
    'Assign licences from Users > Active users (per person) or Billing > Licenses (per product); License Administrator or User Administrator is the least-privileged role.',
    'Group-based licensing inherits licences through security, mail-enabled security or Microsoft 365 groups; nested groups are not supported and errors surface on the product page.',
    'Security groups carry permissions; Microsoft 365 groups power collaboration (Teams, team sites); distribution groups only broadcast email.',
    'Dynamic membership keeps security and Microsoft 365 groups current from user attributes.',
    'Custom domains are added under Settings > Domains with a TXT verification record and DNS records; this needs the Domain Name Administrator role.',
    'Settings > Org settings has Services, Security & privacy and Organization profile tabs for tenant-wide switches, including the Copilot service toggles.',
  ],
  flashcards: [
    { front: 'What is a service plan?', back: 'One component service inside a licence (for example Exchange Online or Microsoft 365 Apps). It can be turned on or off per user or group.' },
    { front: 'Where in the Microsoft 365 admin center do you assign a licence to a group?', back: 'Billing > Licenses > select the product > Assign licenses, then search for the group.' },
    { front: 'Least-privileged role to assign licences?', back: 'License Administrator (User Administrator also works).' },
    { front: 'Does group-based licensing support nested groups?', back: 'No. Only direct (first-level) members receive the licence.' },
    { front: 'Which group type can carry permissions and has an email address?', back: 'A mail-enabled security group (Microsoft 365 groups can also hold SharePoint permissions).' },
    { front: 'Which group type is created for a team in Microsoft Teams?', back: 'A Microsoft 365 group; it also owns the team site, mailbox, calendar and Planner.' },
    { front: 'Which role is required to add a custom domain?', back: 'Domain Name Administrator (or Global Administrator).' },
    { front: 'How do you prove you own a domain?', back: 'Add the TXT (or MX) verification record Microsoft provides at your registrar, or let Domain Connect do it automatically.' },
    { front: 'Which Org settings tab holds the password expiration policy?', back: 'Security & privacy.' },
    { front: 'What must be set on a user before a licence can be assigned?', back: 'A usage location.' },
  ],
  quiz: [
    {
      question:
        'Contoso hires 250 sales staff a month. The administrator must ensure every new sales hire receives a Microsoft 365 E3 and a Microsoft 365 Copilot licence with the least administrative effort. What should the administrator do?',
      options: [
        'Assign both licences to each user from Users > Active users as they join.',
        'Assign both licences to a dynamic security group whose rule matches the Sales department.',
        'Create a distribution group for Sales and assign the licences to it.',
        'Add the licences to the default domain settings so all users inherit them.',
      ],
      correct: [1],
      explanation:
        'Group-based licensing with a dynamic security group automates assignment and removal. Per-user assignment does not scale, distribution groups cannot be licensed, and domains carry no licence settings.',
    },
    {
      question: 'A user holds a Microsoft 365 Copilot licence but no Microsoft 365 Apps licence. Which statement is correct?',
      options: [
        'Copilot appears in Word and Excel because the Copilot licence includes the desktop apps.',
        'Copilot Chat is available, but Copilot in Word and Excel is not, because those apps require their own service plan.',
        'The Copilot licence is automatically rejected by the admin center.',
        'Copilot works only after the user is made a Global Reader.',
      ],
      correct: [1],
      explanation:
        'Copilot surfaces inside services the user is licensed for. Without Microsoft 365 Apps there is no Word or Excel Copilot. The admin center does not reject the assignment, and admin roles have nothing to do with feature access.',
    },
    {
      question: 'You need to grant a set of users read access to a SharePoint site AND let colleagues email that set of users with a single address. Which object should you create?',
      options: ['A distribution group', 'A mail-enabled security group', 'A dynamic distribution group', 'A shared mailbox'],
      correct: [1],
      explanation:
        'A mail-enabled security group is a security principal with an email address. Distribution groups and dynamic distribution groups cannot hold permissions, and a shared mailbox is a mailbox, not a group.',
    },
    {
      question: 'Which TWO actions are performed under Settings in the Microsoft 365 admin center rather than in a workload admin center? (Select two)',
      options: [
        'Adding and verifying a custom domain',
        'Creating a Conditional Access policy',
        'Turning the Microsoft 365 Copilot service on or off for the organisation under Org settings',
        'Creating a sensitivity label',
      ],
      correct: [0, 2],
      explanation:
        'Domains and Org settings > Services both live in the Microsoft 365 admin center. Conditional Access is configured in the Microsoft Entra admin center and sensitivity labels in the Microsoft Purview portal.',
    },
    {
      question: 'Several members of a licensed group show no licence. The admin wants to find and retry the failed assignments. Where should the admin look?',
      options: [
        'Billing > Licenses > the product > Errors, then Reprocess',
        'Settings > Domains > DNS records',
        'Users > Guest users',
        'Reports > Usage > Microsoft Copilot readiness',
      ],
      correct: [0],
      explanation:
        'Group-based licensing errors are recorded on the product page, where you can reprocess them. Domains, guest users and readiness reports are unrelated.',
    },
    {
      question: 'An administrator wants to add the domain contoso.com but the Add domain option is greyed out. What is the MOST likely cause?',
      options: [
        'The tenant already has an onmicrosoft.com domain.',
        'The administrator lacks the Domain Name Administrator (or Global Administrator) role.',
        'The domain has no MX record yet.',
        'Group-based licensing is not configured.',
      ],
      correct: [1],
      explanation:
        'Adding domains is a tenant-wide change restricted to Domain Name Administrators and Global Administrators. Every tenant has an onmicrosoft.com domain, MX records are added after verification, and licensing is irrelevant.',
    },
  ],
  statements: [
    { text: 'A Microsoft 365 Copilot licence can be assigned to any user regardless of their base licence and all Copilot features will work.', isTrue: false, explanation: 'Copilot needs an eligible base licence; features appear only in services the user is licensed for.' },
    { text: 'Group-based licensing removes a licence automatically when a user leaves the group.', isTrue: true, explanation: 'Membership drives assignment and removal.' },
    { text: 'A distribution group can be granted permissions on a SharePoint site.', isTrue: false, explanation: 'Distribution groups are not security principals; use a security group, mail-enabled security group or Microsoft 365 group.' },
    { text: 'Microsoft 365 groups support dynamic membership based on user attributes.', isTrue: true, explanation: 'Both security groups and Microsoft 365 groups can use dynamic membership rules in Entra ID.' },
    { text: 'Verifying a custom domain is normally done by adding a TXT record at the registrar.', isTrue: true, explanation: 'Microsoft provides a TXT (or MX) record to prove ownership; Domain Connect can automate it.' },
    { text: 'Individual service plans inside a licence cannot be disabled; the whole product is all or nothing.', isTrue: false, explanation: 'You can turn apps and services on or off per user or group.' },
    { text: 'Org settings in the Microsoft 365 admin center is where you create Conditional Access policies.', isTrue: false, explanation: 'Conditional Access is configured in the Microsoft Entra admin center.' },
  ],
  resources: [
    { label: 'Assign or unassign licenses for users in the Microsoft 365 admin center', url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/manage/assign-licenses-to-users' },
    { label: 'Assign licenses to users by group membership (group-based licensing)', url: 'https://learn.microsoft.com/en-us/entra/identity/users/licensing-groups-assign' },
    { label: 'Compare groups in the Microsoft 365 admin center', url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/create-groups/compare-groups' },
    { label: 'Add a domain to Microsoft 365', url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/setup/add-domain' },
  ],
};

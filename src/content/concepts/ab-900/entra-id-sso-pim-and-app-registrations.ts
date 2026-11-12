import type { Concept } from '../../types';

export const entraIdSsoPimAndAppRegistrations: Concept = {
  id: 'entra-id-sso-pim-and-app-registrations',
  title: 'Microsoft Entra ID: SSO, Privileged Identity Management and Applications',
  summary:
    'What Microsoft Entra ID is and what it manages, why single sign-on improves both security and user experience, how Privileged Identity Management turns standing admin rights into just-in-time access, and the difference between an app registration and an enterprise application.',
  certs: ['ab-900'],
  domains: ['ab-900-1'],
  outcomes: ['ab-900-1-3-1', 'ab-900-1-3-3', 'ab-900-1-3-8', 'ab-900-1-3-9'],
  tags: ['entra-id', 'sso', 'pim', 'app-registrations', 'enterprise-applications', 'identity', 'fundamentals'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'What Microsoft Entra ID is',
      body: `**Microsoft Entra ID** is Microsoft's cloud identity and access management service and the foundation of every Microsoft 365 tenant: a tenant *is* an Entra directory. It authenticates users, enforces policy and protects users, devices, apps and resources. Everything in this exam that says "who" (users, groups, guests, admin roles, devices, service principals, agents) is an Entra object.

Capabilities you should be able to name:

- **Identities**: users (members and guests), groups, devices and workload identities such as service principals and managed identities, plus **Agent IDs** for AI agents.
- **Authentication**: MFA, passwordless methods, self-service password reset, authentication method policies.
- **Access control**: Conditional Access, role-based access control with built-in and custom admin roles, administrative units for scoping.
- **Protection**: **Entra ID Protection** detects risky users and sign-ins; **Identity Secure Score** rates posture.
- **Governance**: **Privileged Identity Management**, access reviews, entitlement management and lifecycle workflows (Entra ID Governance).
- **Applications**: app registrations, enterprise applications, single sign-on, Application Proxy for on-premises apps.
- **Monitoring**: sign-in, audit and provisioning logs.

Licensing matters in scenario questions. Entra ID Free covers the basics; **P1** (in Microsoft 365 E3) adds Conditional Access, group-based licensing and dynamic groups; **P2** (in Microsoft 365 E5) adds ID Protection risk policies and PIM. Microsoft 365 E7 includes the full Entra Suite. The admin surface is the **Microsoft Entra admin center** (entra.microsoft.com); the Microsoft 365 admin center exposes a subset for user, group and licence tasks.`,
    },
    {
      heading: 'Single sign-on: purpose and benefits',
      body: `**Single sign-on (SSO)** lets a user authenticate once with their work account and then open every assigned application without signing in again. Entra ID acts as the **identity provider**: the app redirects the user to Entra, Entra verifies the credentials (and any MFA or Conditional Access requirement), then issues a token the app trusts.

Benefits the exam expects you to articulate:

- **Security**: one strong credential instead of dozens of weak app passwords; MFA, Conditional Access and risk detection apply to every connected app; disabling the account cuts off all apps at once.
- **User experience**: fewer prompts, fewer password resets, one place (My Apps) to find applications.
- **Administration**: access is managed centrally through user and group assignment; the help desk sees fewer password tickets.

Entra supports several SSO types. **Federation-based SSO** with **SAML 2.0** or **OpenID Connect (OAuth 2.0)** is the richest and what the Entra app gallery offers for thousands of SaaS apps. **Password-based SSO** has Entra store and replay a username and password for apps that cannot federate. **Linked SSO** just adds a tile to My Apps during migrations. For on-premises web apps, **Application Proxy** publishes them so they can also use Entra SSO.

A typical scenario: staff keep separate passwords for a SaaS HR system and the help desk is swamped. The answer is to add the app from the Entra gallery as an enterprise application, configure SAML or OIDC SSO, and assign the right groups. Copilot and agents also benefit, because every connected system shares the same identity and policy.`,
    },
    {
      heading: 'Privileged Identity Management',
      body: `**Privileged Identity Management (PIM)** is the Entra ID Governance feature (requires Entra ID P2 or Governance licensing) that applies least privilege to *administrators*. Instead of permanent, always-on role assignments, PIM makes admins **eligible** for a role and requires them to **activate** it when they need it.

Key features:

- **Just-in-time, time-bound access**: activations last for a configured number of hours; assignments can have start and end dates.
- **Activation requirements**: MFA, a business justification, a ticket number and optionally **approval** by a designated approver.
- **Notifications and alerts** when privileged roles are activated or when too many permanent Global Administrators exist.
- **Access reviews** so role holders are periodically re-certified and stale assignments removed.
- **Audit history** of every activation, downloadable for auditors.
- Protection against removing the last active Global Administrator or Privileged Role Administrator.

PIM covers Entra roles, Azure resource roles and **PIM for Groups** (just-in-time membership of a group that in turn grants access). Only Privileged Role Administrators and Global Administrators manage Entra role assignments in PIM.

Exam angle: whenever a scenario says admins have standing Global Administrator rights, or asks how to reduce the risk of a compromised admin account while still letting admins do their jobs, the answer is PIM with eligible assignments, MFA on activation and approval for the most sensitive roles. PIM supports the Zero Trust principle of least privilege and the guidance to keep Global Administrators to the minimum.`,
    },
    {
      heading: 'App registrations versus enterprise applications',
      body: `Two blades in the Entra admin center confuse new administrators because they describe the same application from different angles.

An **app registration** creates the **application object**: the global definition of an app in its *home* tenant. Developers use it to obtain an application (client) ID, add client secrets or certificates, set redirect URIs, define the API permissions the app will request (delegated or application), and expose its own scopes. If your organisation *builds* the app, you work here.

An **enterprise application** is the **service principal**: the local instance of an app inside *your* tenant. It controls how the app behaves for your users: who is **assigned**, whether assignment is required, **SSO** configuration, **consent** that has been granted, provisioning of accounts into the app, and whether Conditional Access targets it. Apps you add from the gallery, Microsoft's own first-party services and third-party apps that users consented to appear only here. If you *use* an app someone else built, you work here.

Relationship: registering an app in your tenant automatically creates both an application object and a service principal. A multi-tenant app has one application object (in the vendor's tenant) and a service principal in every customer tenant that uses it. **Managed identities** are a special service principal for Azure resources, with no credentials to manage.

Governance questions hinge on **consent**: who may grant an app permission to read mail or files? The *User consent settings* decide whether users can consent to low-impact permissions, and admin consent workflow routes risky requests to admins. Reviewing enterprise applications for excessive permissions is a standard least-privilege task, and Identity Secure Score recommends not allowing users to consent to unreliable apps.`,
    },
  ],
  examples: [
    {
      title: 'Onboarding a SaaS app with SSO',
      description:
        'Contoso adopts a third-party expense system. Rather than letting staff create separate passwords, the identity admin adds the app from the Entra gallery as an enterprise application, configures SAML SSO, requires user assignment, and assigns the Finance and Sales groups. Conditional Access now requires MFA for the app, and leavers lose access the moment their account is disabled.',
      takeaway: 'Gallery apps are enterprise applications; SSO plus group assignment gives both convenience and central control.',
    },
    {
      title: 'Standing Global Administrators (a realistic mistake)',
      description:
        'A review finds eleven permanent Global Administrators, several unused for months. One account is phished and the attacker has full tenant control immediately. The remediation is to make most of them eligible in PIM for narrower roles (User Administrator, Exchange Administrator, AI Administrator), require MFA and approval for Global Administrator activation, and schedule access reviews.',
      language: 'text',
      code: `Entra admin center
  Identity governance > Privileged Identity Management > Microsoft Entra roles
    Roles > Global Administrator > Settings
      Activation maximum duration ...... 4 hours
      On activation, require .......... Microsoft Entra MFA
      Require justification ........... Yes
      Require approval to activate .... Yes (approvers: Security team)
    Assignments > Add assignments
      Assignment type ................. Eligible (not Active)`,
      takeaway: 'PIM converts permanent privilege into time-bound, approved, audited activations.',
    },
    {
      title: 'Which blade?',
      description:
        'A developer asks where to add a client secret for the internal reporting API, and a compliance officer asks who in the tenant has consented to a third-party note-taking app that reads mail. The developer needs App registrations (the application object the team owns). The compliance officer needs Enterprise applications (the service principal in the tenant, with its permissions and consent).',
      takeaway: 'Build it: App registrations. Use and govern it: Enterprise applications.',
    },
  ],
  keyPoints: [
    'Microsoft Entra ID is the cloud identity service behind every Microsoft 365 tenant: identities, authentication, Conditional Access, roles, ID Protection, governance, applications and logs.',
    'Entra ID P1 (in E3) brings Conditional Access and dynamic groups; P2 (in E5) adds ID Protection risk policies and PIM; E7 includes the Entra Suite.',
    'SSO lets users authenticate once with Entra as identity provider; federation uses SAML or OpenID Connect, with password-based and linked SSO for legacy apps.',
    'SSO benefits: one strong, policy-protected credential, fewer resets, central assignment and instant revocation.',
    'PIM provides eligible rather than permanent role assignments with time-bound activation, MFA, justification, approval, alerts, access reviews and audit history.',
    'App registration = application object in the home tenant (developer view); enterprise application = service principal in your tenant (assignment, SSO, consent).',
    'Consent settings and reviews of enterprise application permissions are least-privilege controls for apps.',
  ],
  flashcards: [
    { front: 'What is a Microsoft 365 tenant in identity terms?', back: 'An instance of Microsoft Entra ID (a directory).' },
    { front: 'Which Entra licence tier adds Conditional Access and dynamic groups?', back: 'Entra ID P1 (included in Microsoft 365 E3).' },
    { front: 'Which Entra licence tier is required for PIM and ID Protection risk policies?', back: 'Entra ID P2 (in Microsoft 365 E5) or Entra ID Governance.' },
    { front: 'Two federation protocols used for Entra SSO?', back: 'SAML 2.0 and OpenID Connect (built on OAuth 2.0).' },
    { front: 'What is password-based SSO?', back: 'Entra securely stores and replays a username and password for apps that cannot use federation.' },
    { front: 'In PIM, what is the difference between eligible and active assignments?', back: 'Eligible users must activate the role (possibly with MFA, justification and approval) before using it; active users hold the privileges continuously.' },
    { front: 'Who can manage Entra role assignments in PIM?', back: 'Privileged Role Administrators and Global Administrators.' },
    { front: 'What object does an app registration create?', back: 'An application object (and, in the home tenant, a matching service principal).' },
    { front: 'Where do you assign users and configure SSO for a gallery app?', back: 'Enterprise applications (the service principal).' },
    { front: 'What is a service principal?', back: 'The local representation of an application in a tenant, used to grant it permissions and control access; managed identities are a type of service principal.' },
  ],
  quiz: [
    {
      question: 'Contoso has eight permanent Global Administrators. Security wants administrators to keep doing their jobs but to hold privileges only when needed, with MFA and approval. What should you implement?',
      options: [
        'Conditional Access named locations',
        'Privileged Identity Management with eligible role assignments',
        'Group-based licensing for administrators',
        'Password-based single sign-on',
      ],
      correct: [1],
      explanation:
        'PIM provides just-in-time, approved, MFA-protected activation of roles. Named locations control where sign-ins come from, licensing is unrelated, and SSO does not change privilege.',
    },
    {
      question: 'A developer needs to add a client secret and request Microsoft Graph API permissions for an internal line-of-business app. Where should they go in the Microsoft Entra admin center?',
      options: ['Enterprise applications', 'App registrations', 'Conditional Access', 'Identity Secure Score'],
      correct: [1],
      explanation:
        'Secrets, redirect URIs and requested API permissions belong to the application object in App registrations. Enterprise applications govern the service principal (assignment, SSO, consent).',
    },
    {
      question: 'Users complain about maintaining separate passwords for a cloud HR application, and the help desk receives many reset requests. What is the MOST appropriate action?',
      options: [
        'Enable password-based SSO so Entra stores each user\'s HR password.',
        'Add the HR app from the Entra gallery as an enterprise application and configure SAML or OpenID Connect SSO.',
        'Create a mail-enabled security group for HR users.',
        'Ask users to reuse their Microsoft 365 password in the HR app.',
      ],
      correct: [1],
      explanation:
        'Federated SSO removes the separate credential and brings the app under Entra policies. Password-based SSO is a fallback for apps that cannot federate, groups do not address sign-in, and password reuse is insecure.',
    },
    {
      question: 'Which TWO are benefits of Privileged Identity Management? (Select two)',
      options: [
        'Time-bound activation of privileged roles',
        'Automatic DNS record creation for custom domains',
        'Audit history of who activated which role and when',
        'Blocking phishing links in email',
      ],
      correct: [0, 2],
      explanation:
        'PIM provides time-bound activation and a full audit trail. DNS records are a domain setup task and link protection is Defender for Office 365.',
    },
    {
      question: 'A compliance officer wants to know which third-party apps users have consented to and what permissions those apps hold in the tenant. Where should they look?',
      options: ['App registrations', 'Enterprise applications', 'Settings > Domains', 'Teams admin center > Manage apps'],
      correct: [1],
      explanation:
        'Consented third-party apps exist in the tenant as service principals under Enterprise applications, where permissions and consent are visible. App registrations list only apps your tenant registered.',
    },
  ],
  statements: [
    { text: 'Every Microsoft 365 tenant is automatically a Microsoft Entra ID tenant.', isTrue: true, explanation: 'Entra ID is the identity foundation of Microsoft 365.' },
    { text: 'Privileged Identity Management is included with Microsoft Entra ID Free.', isTrue: false, explanation: 'PIM requires Entra ID P2 or Entra ID Governance licensing.' },
    { text: 'SAML 2.0 and OpenID Connect are federation protocols supported for single sign-on in Entra ID.', isTrue: true, explanation: 'They are the standard protocols for gallery and custom apps.' },
    { text: 'An eligible PIM assignment grants continuous privileges without any action by the user.', isTrue: false, explanation: 'Eligible users must activate the role; active assignments are the continuous ones.' },
    { text: 'Registering an application in your tenant creates both an application object and a service principal.', isTrue: true, explanation: 'The portal creates both automatically in the home tenant.' },
    { text: 'Gallery SaaS apps you add for SSO appear under App registrations.', isTrue: false, explanation: 'They appear under Enterprise applications because you receive a service principal, not the application object.' },
    { text: 'Disabling a user account in Entra ID removes their access to all SSO-connected applications.', isTrue: true, explanation: 'Central identity means one revocation point.' },
  ],
  resources: [
    { label: 'What is Microsoft Entra?', url: 'https://learn.microsoft.com/en-us/entra/fundamentals/whatis' },
    { label: 'What is single sign-on in Microsoft Entra ID?', url: 'https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/what-is-single-sign-on' },
    { label: 'What is Microsoft Entra Privileged Identity Management?', url: 'https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure' },
    { label: 'Application and service principal objects in Microsoft Entra ID', url: 'https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals' },
  ],
};

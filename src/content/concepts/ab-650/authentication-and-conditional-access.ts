import type { Concept } from '../../types';

export const authenticationAndConditionalAccess: Concept = {
  id: 'authentication-and-conditional-access',
  title: 'Authentication Methods, Password Protection, SSPR and Conditional Access',
  summary:
    'How sign-in is secured in Microsoft Entra: the Authentication methods policy and authentication strengths, Password Protection banned-password lists, self-service password reset, troubleshooting sign-in failures with the sign-in logs, and Conditional Access policies that combine MFA, device, location and ID Protection risk signals.',
  certs: ['ab-650'],
  domains: ['ab-650-2'],
  outcomes: ['ab-650-2-2-1', 'ab-650-2-2-2', 'ab-650-2-2-3', 'ab-650-2-2-4', 'ab-650-2-2-5'],
  tags: ['authentication-methods', 'mfa', 'passwordless', 'password-protection', 'sspr', 'conditional-access', 'id-protection', 'sign-in-logs'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Authentication methods and strengths',
      body: `The **Authentication methods policy** (Entra ID > Authentication methods > Policies, managed by the **Authentication Policy Administrator**) is the single place to enable methods for all users or specific groups: **Microsoft Authenticator** (push with number matching, passwordless phone sign-in), **passkeys (FIDO2)**, **Windows Hello for Business**, **certificate-based authentication**, **Temporary Access Pass** (time-limited code for onboarding or recovery), **SMS**, **voice**, **email OTP** (SSPR only), **security questions** (SSPR only), **hardware OATH tokens** and **software OATH**. The legacy per-user MFA and SSPR method settings were deprecated; since September 2025 methods can only be managed in the Authentication methods policy, so exam answers should point there.

Each method can carry settings: Authenticator can show the sign-in location and app name to defeat MFA fatigue; passkeys can be restricted to specific AAGUIDs; TAP has lifetime and one-time-use controls.

**Authentication strengths** group methods into tiers (built-in **MFA strength**, **Passwordless MFA strength**, **Phishing-resistant MFA strength**: passkeys, Windows Hello for Business, certificate-based auth) that Conditional Access can require. The exam framing "administrators must use phishing-resistant MFA" means a Conditional Access policy with the phishing-resistant authentication strength, not just "require MFA". **Security defaults** are the free baseline (MFA for everyone, legacy auth blocked) and must be turned off before Conditional Access is used. **Registration campaigns** nudge users to move from SMS to Authenticator; the combined **security info registration** experience lets users register MFA and SSPR methods once.`,
    },
    {
      heading: 'Password Protection and self-service password reset',
      body: `**Microsoft Entra Password Protection** blocks weak passwords at change or reset time. The **global banned password list** is maintained by Microsoft, applied to every tenant automatically and cannot be disabled. The **custom banned password list** (up to 1,000 terms) adds organization-specific base terms such as brand, product and location names; the algorithm already blocks common variants and substitutions, so add *Contoso* rather than *Contoso!1*. Settings live under **Entra ID > Authentication methods > Password protection**, with **smart lockout** threshold and duration. For on-premises Active Directory, deploy the **Password Protection proxy and DC agent** and run first in **Audit** mode, then **Enforced**. Password protection does not apply to existing passwords until they change.

**Self-service password reset (SSPR)** lets users reset or unlock without the help desk. Configure **Entra ID > Password reset**: scope **None, Selected (a group) or All**, the **number of methods required (1 or 2)**, which methods, **registration enforcement** and reconfirmation period (default 180 days), **notifications** to users and admins, and **help desk link**. For hybrid identities, enable **password writeback** in Microsoft Entra Connect so cloud resets flow to Active Directory; without it, synchronised users are told to contact their admin. Admin accounts always use a stricter **two-gate** policy and are not covered by the end-user SSPR scope. **Windows login screen** reset is enabled by Intune or Group Policy. The portal is https://aka.ms/sspr, and the admin center shows registration and usage reports under Authentication methods > Activity.`,
    },
    {
      heading: 'Investigating and resolving authentication issues',
      body: `Start every authentication investigation in the **Sign-in logs** (Entra ID > Monitoring & health > Sign-in logs; **Reports Reader** can view). Four log types exist: **interactive user**, **non-interactive user**, **service principal** and **managed identity**, plus new **agent** sign-in logs for Entra Agent ID. Each entry shows the **status**, the **sign-in error code**, the **Conditional Access** tab with each policy's result (Success, Failure, Not applied, Report-only) and the grant control that failed, the **authentication details** (method, MFA result), device and location, and **risk** information from ID Protection. Common error patterns:

- **AADSTS50076 / 50079**: MFA required or registration needed; the user has not completed security info registration, or a new policy now requires MFA.
- **AADSTS53003**: blocked by Conditional Access; open the policy tab to see which policy and condition matched (location, device compliance, platform).
- **AADSTS50053**: account locked by smart lockout or flagged for risk; check **Risky users** and unlock or remediate.
- **AADSTS50057 / 50034**: account disabled or not found; verify UPN and licence state.
- **Password changed but still rejected on-premises** points to missing password writeback or a Password Protection policy block.

Tools that help: the **What If** tool in Conditional Access to predict which policies apply to a user, app, location and device; **Report-only** mode to test policies before enforcement; **Diagnose and solve problems** in the Entra admin center; **ID Protection** reports (**Risky users**, **Risky sign-ins**, **Risk detections**) with the ability to confirm compromised or dismiss risk; the **authentication methods activity report**; and **Audit logs** for configuration changes. Resolution actions include resetting the password, revoking sessions, excluding the user from a policy temporarily, issuing a **Temporary Access Pass**, or confirming the user's device is compliant in Intune.`,
    },
    {
      heading: 'Conditional Access with ID Protection and MFA',
      body: `**Conditional Access** evaluates **if-then** policies when a token is issued: **assignments** (users and groups, including guests, directory roles and now **agents**), **target resources** (cloud apps, user actions such as registering security info, authentication context), **conditions** (sign-in risk, user risk, insider risk, device platform, location/named locations, client apps, filter for devices, authentication flows) and **access controls** (**grant**: require MFA, authentication strength, compliant device, Entra hybrid joined device, approved client app or app protection policy, password change, terms of use; **block**; **session**: sign-in frequency, persistent browser, app-enforced restrictions, Continuous Access Evaluation). Policy state is **On**, **Off** or **Report-only**. Requires **Entra ID P1**; risk-based conditions require **P2** with **Microsoft Entra ID Protection**.

**ID Protection** detects sign-in risk (anonymous IP, atypical travel, password spray, token anomalies) and user risk (leaked credentials). Rather than the legacy risk policies, Microsoft recommends two Conditional Access policies: **require MFA for medium or high sign-in risk**, and **require a secure password change for high user risk**. Completing the control auto-remediates the risk.

**Templates** (Create new policy from templates) cover **Secure foundation** (MFA for admins, block legacy authentication, MFA for all users, MFA for Azure management, secure security info registration), **Zero Trust**, **Remote work**, **Protect administrator** (phishing-resistant MFA for admins) and **AI agents** (block high-risk agent identities, policies for autonomous and on-behalf-of agent access). Always exclude **break-glass accounts**, deploy in **Report-only** first, and remember Conditional Access applies to Copilot the same as to other Microsoft 365 apps: a compliant-device requirement on Office 365 also governs Copilot Chat, and SharePoint sites can require an **authentication context** through sensitivity labels or SharePoint Advanced Management.`,
    },
  ],
  examples: [
    {
      title: 'Phishing-resistant MFA for admins, tested first',
      description:
        'A compliance review requires all privileged roles to sign in with phishing-resistant MFA. The admin creates a Conditional Access policy from the "Require phishing-resistant multifactor authentication for administrators" template targeting directory roles, grants with the Phishing-resistant MFA authentication strength, excludes the two break-glass accounts, and runs it in Report-only for a week. The sign-in log Report-only tab shows which admins would be blocked because they only have Authenticator push; those admins are issued passkeys before the policy is switched on.',
      takeaway: 'Use authentication strengths for phishing-resistant requirements, templates for speed, and Report-only to find gaps before enforcement.',
    },
    {
      title: 'Blocking brand-name passwords and auditing on-premises first',
      description:
        'Help desk tickets show passwords like "Contoso2026!" being accepted by on-premises AD. The admin adds Contoso, Northwind and the HQ city to the custom banned password list (base terms only, not variants), deploys the Password Protection proxy and DC agents, leaves the on-premises mode at Audit for two weeks to size the impact from the event logs, then switches to Enforced.',
      language: 'powershell',
      code: `# Check what the DC agents would have blocked while in Audit mode (run on a DC)
Get-AzureADPasswordProtectionSummaryReport -Forest
# Event IDs 10024/10025 (would be blocked) vs 10016/10017 (blocked when enforced)`,
      takeaway: 'Password Protection evaluates base terms and variants; audit mode shows impact before enforcement.',
    },
    {
      title: 'SSPR works in the cloud but not for synced users (a realistic mistake)',
      description:
        'An admin enables SSPR for all users with two methods required. Cloud-only accounts reset fine, but hybrid users are told to contact their administrator. The admin had not enabled password writeback in Microsoft Entra Connect, so the cloud cannot update Active Directory. Enabling writeback (and the Password Reset "Write back passwords to your on-premises directory" setting) fixes it. Admin accounts still cannot use the end-user SSPR scope because they fall under the two-gate admin policy.',
      takeaway: 'Hybrid SSPR needs password writeback; admin SSPR is governed separately.',
    },
    {
      title: 'Reading a Conditional Access failure in the sign-in logs',
      description:
        'A contractor cannot open Copilot Chat and sees "You cannot access this right now". In the sign-in logs the entry shows error 53003 and the Conditional Access tab lists the "Require compliant device for Office 365" policy as Failure with the grant control "Require device to be marked as compliant" unmet. The contractor\'s personal laptop is not enrolled in Intune. The fix is enrolment (or an approved exclusion), not disabling the policy or reassigning the Copilot licence.',
      takeaway: 'The Conditional Access tab in the sign-in entry names the exact policy and control that blocked access.',
    },
  ],
  keyPoints: [
    'Manage methods in the Authentication methods policy (Authentication Policy Administrator); legacy MFA and SSPR method settings are retired. Authentication strengths let Conditional Access require passwordless or phishing-resistant MFA.',
    'Password Protection applies the global banned list automatically and lets you add up to 1,000 custom base terms; on-premises enforcement needs the proxy and DC agent with Audit then Enforced modes.',
    'SSPR scope is None, Selected or All with one or two methods required; hybrid users need password writeback; admins always follow the stricter two-gate policy.',
    'Troubleshoot with the sign-in logs (status, error code, Conditional Access tab, authentication details), What If, Report-only, ID Protection risk reports and Temporary Access Pass.',
    'Conditional Access = assignments + target resources + conditions, then grant, block or session controls; requires Entra ID P1, risk conditions need P2 with ID Protection.',
    'Recommended risk policies: MFA for medium/high sign-in risk and secure password change for high user risk, built as Conditional Access policies.',
    'Templates (Secure foundation, Zero Trust, Remote work, Protect administrator, AI agents) accelerate deployment; exclude break-glass accounts and start in Report-only.',
    'Conditional Access governs Copilot and agents like any other Microsoft 365 app, and SharePoint sites can require an authentication context.',
  ],
  flashcards: [
    { front: 'Where are authentication methods enabled for users or groups?', back: 'Entra ID > Authentication methods > Policies (the Authentication methods policy).' },
    { front: 'Which role manages the Authentication methods policy and SSPR?', back: 'Authentication Policy Administrator.' },
    { front: 'Name three phishing-resistant authentication methods.', back: 'Passkeys (FIDO2), Windows Hello for Business, and certificate-based authentication.' },
    { front: 'What is a Temporary Access Pass?', back: 'A time-limited, optionally one-time passcode that lets a user sign in and register passwordless methods or recover access.' },
    { front: 'Can the global banned password list be disabled?', back: 'No. It applies to all tenants automatically.' },
    { front: 'What is the limit of the custom banned password list?', back: '1,000 terms; add base terms because variants are blocked automatically.' },
    { front: 'What is required for hybrid users to reset passwords with SSPR?', back: 'Password writeback enabled in Microsoft Entra Connect (or cloud sync).' },
    { front: 'How many methods can SSPR require?', back: 'One or two, chosen by the admin; admins always need two gates.' },
    { front: 'Which sign-in log tab shows why a Conditional Access policy blocked a user?', back: 'The Conditional Access tab, which lists each policy result and the unmet grant control.' },
    { front: 'Which Conditional Access policy state lets you test without enforcing?', back: 'Report-only.' },
    { front: 'Which licence enables risk-based Conditional Access conditions?', back: 'Microsoft Entra ID P2 (Microsoft Entra ID Protection).' },
    { front: 'What are the two recommended risk-based Conditional Access policies?', back: 'Require MFA for medium or high sign-in risk, and require a secure password change for high user risk.' },
    { front: 'Must security defaults be disabled to use Conditional Access?', back: 'Yes. Security defaults and Conditional Access cannot be used together.' },
  ],
  quiz: [
    {
      question:
        'Contoso requires that members of privileged directory roles authenticate only with passkeys, Windows Hello for Business or certificates. Which Conditional Access grant control meets the requirement?',
      options: [
        'Require multifactor authentication',
        'Require authentication strength: Phishing-resistant MFA',
        'Require device to be marked as compliant',
        'Require approved client app',
      ],
      correct: [1],
      explanation:
        'Only an authentication strength can restrict which MFA methods satisfy the policy. Plain MFA accepts SMS and Authenticator push; device compliance and approved client app address device and app posture, not the method.',
    },
    {
      question:
        'Users keep choosing passwords such as Fabrikam2026! and FabrikamHQ. You need to block these with the least ongoing maintenance. What should you do?',
      options: [
        'Add every observed variant to the custom banned password list.',
        'Add the base terms Fabrikam and HQ to the custom banned password list.',
        'Enable security defaults.',
        'Increase the password expiration frequency in Org settings.',
      ],
      correct: [1],
      explanation:
        'Password Protection blocks variants and common substitutions of banned base terms, so listing base terms is sufficient and scalable. Security defaults do not add banned terms, and expiration does not improve password quality.',
    },
    {
      question:
        'Synchronised users report that SSPR tells them to contact their administrator, while cloud-only users can reset passwords. What should you configure?',
      options: [
        'Set SSPR scope to All.',
        'Enable password writeback in Microsoft Entra Connect.',
        'Add the users to an administrative unit.',
        'Enable Password Protection for on-premises Active Directory.',
      ],
      correct: [1],
      explanation:
        'Hybrid passwords are mastered on-premises, so writeback is required for cloud resets to apply. Scope, AUs and on-premises Password Protection do not enable the reset path.',
    },
    {
      question: 'Which TWO sources should you check FIRST when a user reports "You cannot access this right now" while opening Copilot Chat? (Select two)',
      options: [
        'The user\'s sign-in log entry, Conditional Access tab.',
        'ID Protection Risky users and Risky sign-ins reports.',
        'The Microsoft 365 Copilot usage report.',
        'The SharePoint data access governance report.',
      ],
      correct: [0, 1],
      explanation:
        'The sign-in entry reveals the blocking policy and control, and risk reports explain risk-based blocks. Usage and oversharing reports are unrelated to an access-denied sign-in.',
    },
    {
      question:
        'You want to require MFA whenever Microsoft Entra ID Protection detects a medium or high sign-in risk, with the risk automatically remediated when the user completes MFA. Which configuration should you use?',
      options: [
        'A Conditional Access policy with the sign-in risk condition set to Medium and High and the grant control Require multifactor authentication.',
        'A Conditional Access policy that blocks all sign-ins from named locations outside the country.',
        'Security defaults.',
        'An SSPR policy requiring two methods.',
      ],
      correct: [0],
      explanation:
        'Risk-based Conditional Access with the sign-in risk condition is Microsoft\'s recommended approach, and successful MFA remediates the sign-in risk. Location blocks, security defaults and SSPR do not react to risk signals.',
    },
    {
      question:
        'A new Conditional Access policy must not disrupt users while you validate it. Which policy state should you choose?',
      options: ['On', 'Off', 'Report-only', 'Delete the policy after testing'],
      correct: [2],
      explanation:
        'Report-only evaluates the policy and logs the result without enforcing it, and the What If tool can complement it. On enforces immediately, Off records nothing.',
    },
  ],
  statements: [
    { text: 'The global banned password list can be turned off for a tenant.', isTrue: false, explanation: 'It is applied automatically to every tenant and cannot be disabled.' },
    { text: 'Authentication methods can still be managed in the legacy per-user MFA and SSPR policies.', isTrue: false, explanation: 'Since September 2025 methods are managed only in the Authentication methods policy.' },
    { text: 'A Temporary Access Pass can be used to onboard a user to passwordless authentication.', isTrue: true, explanation: 'TAP is a time-limited credential that satisfies strong authentication for registration.' },
    { text: 'Administrators are subject to a stricter two-gate SSPR policy regardless of the end-user setting.', isTrue: true, explanation: 'Admin reset policies always require two methods.' },
    { text: 'Conditional Access requires Microsoft Entra ID P2 for all policies.', isTrue: false, explanation: 'P1 covers Conditional Access; P2 is needed for risk-based conditions through ID Protection.' },
    { text: 'The sign-in logs include separate entries for non-interactive sign-ins and service principals.', isTrue: true, explanation: 'There are interactive, non-interactive, service principal, managed identity and agent logs.' },
    { text: 'Conditional Access templates include policies for AI agents.', isTrue: true, explanation: 'Templates cover blocking high-risk agent identities and configuring autonomous and on-behalf-of agent access.' },
    { text: 'A Conditional Access policy that requires a compliant device for Office 365 does not affect Copilot Chat.', isTrue: false, explanation: 'Copilot experiences are covered by policies that target Office 365 or all resources.' },
  ],
  resources: [
    { label: 'Manage authentication methods for Microsoft Entra ID', url: 'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-methods-manage' },
    { label: 'Eliminate bad passwords using Microsoft Entra Password Protection', url: 'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-password-ban-bad' },
    { label: 'How self-service password reset works', url: 'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-sspr-howitworks' },
    { label: 'What is Conditional Access?', url: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview' },
  ],
};

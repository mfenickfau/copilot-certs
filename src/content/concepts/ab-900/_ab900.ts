import type { Concept } from '../../types';
import { licensingUsersGroupsAndOrgSettings } from './licensing-users-groups-and-org-settings';
import { exchangeSharepointTeamsAdminCenters } from './exchange-sharepoint-teams-admin-centers';
import { zeroTrustAndThreatProtection } from './zero-trust-and-threat-protection';
import { entraIdSsoPimAndAppRegistrations } from './entra-id-sso-pim-and-app-registrations';
import { conditionalAccessAndSignInTroubleshooting } from './conditional-access-and-sign-in-troubleshooting';
import { purviewInformationProtectionAndClassification } from './purview-information-protection-and-classification';
import { retentionEdiscoveryAndComplianceManager } from './retention-ediscovery-and-compliance-manager';
import { dlpInsiderRiskAndCommunicationCompliance } from './dlp-insider-risk-and-communication-compliance';
import { copilotDataSecurityControlsAndDspm } from './copilot-data-security-controls-and-dspm';
import { sharepointOversharingAndAdvancedManagement } from './sharepoint-oversharing-and-advanced-management';
import { copilotAndAgentCapabilities } from './copilot-and-agent-capabilities';
import { copilotLicensingBillingAndUsageReporting } from './copilot-licensing-billing-and-usage-reporting';
import { agentLifecycleAndGovernance } from './agent-lifecycle-and-governance';

/**
 * Exam AB-900: Microsoft 365 Copilot and Agent Administration Fundamentals.
 * Ordered by functional group: core services and objects, data protection and
 * governance, then administrative tasks for Copilot and agents.
 */
export const ab900Concepts: Concept[] = [
  licensingUsersGroupsAndOrgSettings,
  exchangeSharepointTeamsAdminCenters,
  zeroTrustAndThreatProtection,
  entraIdSsoPimAndAppRegistrations,
  conditionalAccessAndSignInTroubleshooting,
  purviewInformationProtectionAndClassification,
  retentionEdiscoveryAndComplianceManager,
  dlpInsiderRiskAndCommunicationCompliance,
  copilotDataSecurityControlsAndDspm,
  sharepointOversharingAndAdvancedManagement,
  copilotAndAgentCapabilities,
  copilotLicensingBillingAndUsageReporting,
  agentLifecycleAndGovernance,
];

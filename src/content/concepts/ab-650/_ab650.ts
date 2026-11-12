import type { Concept } from '../../types';
import { tenantConfigurationAndHealth } from './tenant-configuration-and-health';
import { licensingAndAiCostMonitoring } from './licensing-and-ai-cost-monitoring';
import { exchangeAndTeamsWorkloads } from './exchange-and-teams-workloads';
import { sharepointOnedriveForCopilot } from './sharepoint-onedrive-for-copilot';
import { entraIdentitiesAndGroups } from './entra-identities-and-groups';
import { rolesPimAndAdministrativeUnits } from './roles-pim-and-administrative-units';
import { authenticationAndConditionalAccess } from './authentication-and-conditional-access';
import { defenderForOffice365 } from './defender-for-office-365';
import { purviewDataProtection } from './purview-data-protection';
import { copilotReadinessAndSettings } from './copilot-readiness-and-settings';
import { copilotSearchCoworkConnectorsAndAiProviders } from './copilot-search-cowork-connectors-and-ai-providers';
import { agentIdentityAndAccess } from './agent-identity-and-access';
import { agentRegistryAndSettings } from './agent-registry-and-settings';
import { agent365SecurityAndGovernance } from './agent-365-security-and-governance';

/**
 * AB-650: Administering Microsoft 365 and AI Services.
 * Ordered to follow the study guide: tenant and workloads, govern and secure, AI services.
 */
export const ab650Concepts: Concept[] = [
  tenantConfigurationAndHealth,
  licensingAndAiCostMonitoring,
  exchangeAndTeamsWorkloads,
  sharepointOnedriveForCopilot,
  entraIdentitiesAndGroups,
  rolesPimAndAdministrativeUnits,
  authenticationAndConditionalAccess,
  defenderForOffice365,
  purviewDataProtection,
  copilotReadinessAndSettings,
  copilotSearchCoworkConnectorsAndAiProviders,
  agentIdentityAndAccess,
  agentRegistryAndSettings,
  agent365SecurityAndGovernance,
];

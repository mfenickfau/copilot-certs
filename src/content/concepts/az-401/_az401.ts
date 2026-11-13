import type { Concept } from '../../types';
import { flowOfWorkBoardsAndDevopsMetrics } from './flow-of-work-boards-and-devops-metrics';
import { documentationMcpServersAndIntegrations } from './documentation-mcp-servers-and-integrations';
import { agenticDevelopmentRulesAndAgenticWorkflows } from './agentic-development-rules-and-agentic-workflows';
import { branchingStrategiesAndPullRequestPolicies } from './branching-strategies-and-pull-request-policies';
import { repositoryConfigurationMigrationAndRecovery } from './repository-configuration-migration-and-recovery';
import { packageManagementVersioningAndRetention } from './package-management-versioning-and-retention';
import { testingStrategyQualityGatesAndCoverage } from './testing-strategy-quality-gates-and-coverage';
import { pipelinePlatformRunnersAndOptimization } from './pipeline-platform-runners-and-optimization';
import { yamlPipelinesTriggersTemplatesAndEnvironments } from './yaml-pipelines-triggers-templates-and-environments';
import { deploymentStrategiesAndResiliency } from './deployment-strategies-and-resiliency';
import { infrastructureAsCodeAndConfigurationManagement } from './infrastructure-as-code-and-configuration-management';
import { identitiesSecretlessAuthenticationAndAccess } from './identities-secretless-authentication-and-access';
import { secretsKeyVaultAndLeakPrevention } from './secrets-key-vault-and-leak-prevention';
import { securityScanningAndDefenderForDevops } from './security-scanning-and-defender-for-devops';
import { platformMonitoringPipelineHealthAndAlerts } from './platform-monitoring-pipeline-health-and-alerts';
import { aiAgentsForMonitoringSreAgentAndKql } from './ai-agents-for-monitoring-sre-agent-and-kql';

/**
 * Exam AZ-401: Designing and Implementing Microsoft Agentic DevOps Solutions (beta).
 * Ordered to follow the study guide: processes and communications, source control,
 * build and release pipelines (the largest group), security and compliance, and
 * instrumentation.
 */
export const az401Concepts: Concept[] = [
  flowOfWorkBoardsAndDevopsMetrics,
  documentationMcpServersAndIntegrations,
  agenticDevelopmentRulesAndAgenticWorkflows,
  branchingStrategiesAndPullRequestPolicies,
  repositoryConfigurationMigrationAndRecovery,
  packageManagementVersioningAndRetention,
  testingStrategyQualityGatesAndCoverage,
  pipelinePlatformRunnersAndOptimization,
  yamlPipelinesTriggersTemplatesAndEnvironments,
  deploymentStrategiesAndResiliency,
  infrastructureAsCodeAndConfigurationManagement,
  identitiesSecretlessAuthenticationAndAccess,
  secretsKeyVaultAndLeakPrevention,
  securityScanningAndDefenderForDevops,
  platformMonitoringPipelineHealthAndAlerts,
  aiAgentsForMonitoringSreAgentAndKql,
];

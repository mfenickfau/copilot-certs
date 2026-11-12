import type { Concept } from '../../types';
import { agenticRequirementsAndDataReadiness } from './agentic-requirements-and-data-readiness';
import { aiStrategyCoeAndValueCase } from './ai-strategy-coe-and-value-case';
import { extendCopilotOrBuildAgents } from './extend-copilot-or-build-agents';
import { multiAgentArchitecture } from './multi-agent-architecture';
import { modelStrategyAndPromptEngineering } from './model-strategy-and-prompt-engineering';
import { copilotStudioAgentDesign } from './copilot-studio-agent-design';
import { copilotStudioExtensibility } from './copilot-studio-extensibility';
import { dynamics365CustomerExperienceAi } from './dynamics-365-customer-experience-ai';
import { dynamics365FinanceSupplyChainAi } from './dynamics-365-finance-supply-chain-ai';
import { powerPlatformAiAndWellArchitected } from './power-platform-ai-and-well-architected';
import { monitoringAndTuningAgents } from './monitoring-and-tuning-agents';
import { testingAgenticSolutions } from './testing-agentic-solutions';
import { almForAgenticSolutions } from './alm-for-agentic-solutions';
import { agentSecurityAndThreatMitigation } from './agent-security-and-threat-mitigation';
import { governanceResponsibleAiAndCompliance } from './governance-responsible-ai-and-compliance';

/**
 * Exam AB-100: Agentic AI Business Solutions Architect.
 * Ordered to follow the exam's three functional groups: plan, design, deploy.
 */
export const ab100Concepts: Concept[] = [
  // Plan AI-powered business solutions
  agenticRequirementsAndDataReadiness,
  aiStrategyCoeAndValueCase,
  extendCopilotOrBuildAgents,
  multiAgentArchitecture,
  modelStrategyAndPromptEngineering,
  // Design AI-powered business solutions
  copilotStudioAgentDesign,
  copilotStudioExtensibility,
  dynamics365CustomerExperienceAi,
  dynamics365FinanceSupplyChainAi,
  powerPlatformAiAndWellArchitected,
  // Deploy AI-powered business solutions
  monitoringAndTuningAgents,
  testingAgenticSolutions,
  almForAgenticSolutions,
  agentSecurityAndThreatMitigation,
  governanceResponsibleAiAndCompliance,
];

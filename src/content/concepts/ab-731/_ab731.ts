import type { Concept } from '../../types';
import { generativeAiAndMachineLearningForLeaders } from './generative-ai-and-machine-learning-for-leaders';
import { genaiCostRoiAndRisks } from './genai-cost-roi-and-risks';
import { promptingGroundingAndRag } from './prompting-grounding-and-rag';
import { secureAiSystems } from './secure-ai-systems';
import { copilotExperiencesAndUseCases } from './copilot-experiences-and-use-cases';
import { copilotStudioGraphAndExtensibility } from './copilot-studio-graph-and-extensibility';
import { foundryToolsForBusinessLeaders } from './foundry-tools-for-business-leaders';
import { responsibleAiGovernanceAndAiCouncil } from './responsible-ai-governance-and-ai-council';
import { adoptionTeamChampionsAndBarriers } from './adoption-team-champions-and-barriers';
import { aiLicensingCostsAndImpacts } from './ai-licensing-costs-and-impacts';

/**
 * Exam AB-731: Microsoft Certified: AI Transformation Leader.
 * Ordered to follow the three functional groups of the study guide.
 */
export const ab731Concepts: Concept[] = [
  // Group 1: business value of generative AI
  generativeAiAndMachineLearningForLeaders,
  genaiCostRoiAndRisks,
  promptingGroundingAndRag,
  secureAiSystems,
  // Group 2: Microsoft AI apps and services
  copilotExperiencesAndUseCases,
  copilotStudioGraphAndExtensibility,
  foundryToolsForBusinessLeaders,
  // Group 3: implementation and adoption strategy
  responsibleAiGovernanceAndAiCouncil,
  adoptionTeamChampionsAndBarriers,
  aiLicensingCostsAndImpacts,
];

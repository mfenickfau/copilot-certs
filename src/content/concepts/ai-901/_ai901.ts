import type { Concept } from '../../types';
import { responsibleAiPrinciples } from './responsible-ai-principles';
import { generativeAiModels } from './generative-ai-models';
import { modelDeploymentAndParameters } from './model-deployment-and-parameters';
import { aiWorkloadsAndScenarios } from './ai-workloads-and-scenarios';
import { promptsAndChatClients } from './prompts-and-chat-clients';
import { foundryAgents } from './foundry-agents';
import { textAnalysisWithAzureLanguage } from './text-analysis-with-azure-language';
import { speechWithFoundry } from './speech-with-foundry';
import { visionAndImageGeneration } from './vision-and-image-generation';
import { contentUnderstanding } from './content-understanding';

/**
 * Exam AI-901: Microsoft Azure AI Fundamentals.
 * Ordered to follow the study guide: AI concepts and capabilities first,
 * then implementing solutions with Microsoft Foundry.
 */
export const ai901Concepts: Concept[] = [
  responsibleAiPrinciples,
  generativeAiModels,
  modelDeploymentAndParameters,
  aiWorkloadsAndScenarios,
  promptsAndChatClients,
  foundryAgents,
  textAnalysisWithAzureLanguage,
  speechWithFoundry,
  visionAndImageGeneration,
  contentUnderstanding,
];

import type { Concept } from '../../types';
import { responsibleAiForDevelopers } from './responsible-ai-for-developers';
import { copilotPlansAndIdeSetup } from './copilot-plans-and-ide-setup';
import { copilotCli } from './copilot-cli';
import { agentModeEditsAndMcp } from './agent-mode-edits-and-mcp';
import { codeReviewSpacesAndChatCustomization } from './code-review-spaces-and-chat-customization';
import { organizationPoliciesAuditAndApi } from './organization-policies-audit-and-api';
import { dataFlowAndSuggestionLifecycle } from './data-flow-and-suggestion-lifecycle';
import { promptEngineeringFundamentals } from './prompt-engineering-fundamentals';
import { contextCraftingAndChatHistory } from './context-crafting-and-chat-history';
import { developerProductivityUseCases } from './developer-productivity-use-cases';
import { testingAndSecurityWithCopilot } from './testing-and-security-with-copilot';
import { contentExclusionsAndSafeguards } from './content-exclusions-and-safeguards';

/**
 * Exam GH-300: GitHub Copilot. Twelve concepts covering all six functional
 * groups (responsible use; features across plans and surfaces; data and
 * architecture; prompt engineering and context; productivity; privacy and
 * safeguards).
 */
export const gh300Concepts: Concept[] = [
  responsibleAiForDevelopers,
  copilotPlansAndIdeSetup,
  copilotCli,
  agentModeEditsAndMcp,
  codeReviewSpacesAndChatCustomization,
  organizationPoliciesAuditAndApi,
  dataFlowAndSuggestionLifecycle,
  promptEngineeringFundamentals,
  contextCraftingAndChatHistory,
  developerProductivityUseCases,
  testingAndSecurityWithCopilot,
  contentExclusionsAndSafeguards,
];

import type { Concept } from '../../types';
import { howCopilotWorks } from './how-copilot-works';
import { copilotExperiencesAcrossApps } from './copilot-experiences-across-apps';
import { responsibleAiAndVerification } from './responsible-ai-and-verification';
import { writingEffectivePrompts } from './writing-effective-prompts';
import { promptLibraryAndReuse } from './prompt-library-and-reuse';
import { managingChats } from './managing-chats';
import { draftingAndAnalysingContent } from './drafting-and-analysing-content';
import { copilotInExcelAndPowerpoint } from './copilot-in-excel-and-powerpoint';
import { meetingsAndCollaborationWithCopilot } from './meetings-and-collaboration-with-copilot';
import { prebuiltAgentsResearcherAnalyst } from './prebuilt-agents-researcher-analyst';
import { copilotCoworkBusinessTasks } from './copilot-cowork-business-tasks';

/**
 * Exam AB-730: Microsoft Certified: AI Business Professional.
 * Ordered to follow the study guide's functional groups.
 */
export const ab730Concepts: Concept[] = [
  howCopilotWorks,
  copilotExperiencesAcrossApps,
  responsibleAiAndVerification,
  writingEffectivePrompts,
  promptLibraryAndReuse,
  managingChats,
  draftingAndAnalysingContent,
  copilotInExcelAndPowerpoint,
  meetingsAndCollaborationWithCopilot,
  prebuiltAgentsResearcherAnalyst,
  copilotCoworkBusinessTasks,
];

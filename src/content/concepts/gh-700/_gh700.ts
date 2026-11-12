import type { Concept } from '../../types';
import { governanceCostAndResponsibleAi } from './governance-cost-and-responsible-ai';
import { modelsInstructionsSkillsAndMcp } from './models-instructions-skills-and-mcp';
import { branchesPullRequestsAndWikis } from './branches-pull-requests-and-wikis';
import { projectsAndIssues } from './projects-and-issues';
import { copilotChatSessionsAndCommands } from './copilot-chat-sessions-and-commands';
import { reliablePromptsAndCheckpoints } from './reliable-prompts-and-checkpoints';
import { customAgents } from './custom-agents';
import { designingAgenticWorkflows } from './designing-agentic-workflows';
import { buildingAgenticWorkflowFiles } from './building-agentic-workflow-files';
import { copilotAutomations } from './copilot-automations';
import { skillsAndMcpInWorkflows } from './skills-and-mcp-in-workflows';
import { humanReviewAndEscalation } from './human-review-and-escalation';
import { operatingAndSupervisingWorkflows } from './operating-and-supervising-workflows';

/**
 * GH-700: Enhancing Operational Efficiency with Agentic AI
 * (GitHub Certified: Agentic AI Business Professional, beta).
 * Ordered by functional group: platform features, Copilot productivity,
 * designing and implementing agentic workflows, human-in-the-loop tasks.
 */
export const gh700Concepts: Concept[] = [
  governanceCostAndResponsibleAi,
  modelsInstructionsSkillsAndMcp,
  branchesPullRequestsAndWikis,
  projectsAndIssues,
  copilotChatSessionsAndCommands,
  reliablePromptsAndCheckpoints,
  customAgents,
  designingAgenticWorkflows,
  buildingAgenticWorkflowFiles,
  copilotAutomations,
  skillsAndMcpInWorkflows,
  humanReviewAndEscalation,
  operatingAndSupervisingWorkflows,
];

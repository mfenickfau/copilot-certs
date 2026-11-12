import type { Concept } from '../types';
import { howCopilotWorks } from './ab-730/how-copilot-works';
import { ai901Concepts } from './ai-901/_ai901';

/**
 * Registry of every concept. Content groups are added here as they land.
 */
export const allConcepts: Concept[] = [howCopilotWorks, ...ai901Concepts];

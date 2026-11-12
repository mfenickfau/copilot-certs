import type { Concept } from '../types';
import { howCopilotWorks } from './ab-730/how-copilot-works';
import { ai901Concepts } from './ai-901/_ai901';
import { ab731Concepts } from './ab-731/_ab731';

/**
 * Registry of every concept. Content groups are added here as they land.
 */
export const allConcepts: Concept[] = [howCopilotWorks, ...ai901Concepts, ...ab731Concepts];

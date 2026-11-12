import type { Concept } from '../types';
import { ab730Concepts } from './ab-730/_ab730';
import { ai901Concepts } from './ai-901/_ai901';
import { ab731Concepts } from './ab-731/_ab731';

/**
 * Registry of every concept. Content groups are added here as they land.
 */
export const allConcepts: Concept[] = [...ab730Concepts, ...ai901Concepts, ...ab731Concepts];

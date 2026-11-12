import type { Concept } from '../types';
import { ab730Concepts } from './ab-730/_ab730';
import { ai901Concepts } from './ai-901/_ai901';
import { ab731Concepts } from './ab-731/_ab731';

import { ab620Concepts } from './ab-620/_ab620';
import { gh700Concepts } from './gh-700/_gh700';
import { ab900Concepts } from './ab-900/_ab900';
import { gh300Concepts } from './gh-300/_gh300';
/**
 * Registry of every concept. Content groups are added here as they land.
 */
export const allConcepts: Concept[] = [...ab730Concepts, ...ai901Concepts, ...ab731Concepts, ...ab620Concepts, ...gh700Concepts, ...ab900Concepts, ...gh300Concepts];

import type { Concept } from '../types';
import { ab730Concepts } from './ab-730/_ab730';
import { ai901Concepts } from './ai-901/_ai901';
import { ab731Concepts } from './ab-731/_ab731';

import { ab620Concepts } from './ab-620/_ab620';
import { gh700Concepts } from './gh-700/_gh700';
import { ab900Concepts } from './ab-900/_ab900';
import { gh300Concepts } from './gh-300/_gh300';
import { gh600Concepts } from './gh-600/_gh600';
import { ab650Concepts } from './ab-650/_ab650';
import { ab100Concepts } from './ab-100/_ab100';
import { ai200Concepts } from './ai-200/_ai200';
import { ai300Concepts } from './ai-300/_ai300';
/**
 * Registry of every concept. Content groups are added here as they land.
 */
export const allConcepts: Concept[] = [...ab730Concepts, ...ai901Concepts, ...ab731Concepts, ...ab620Concepts, ...gh700Concepts, ...ab900Concepts, ...gh300Concepts, ...gh600Concepts, ...ab650Concepts, ...ab100Concepts, ...ai200Concepts, ...ai300Concepts];

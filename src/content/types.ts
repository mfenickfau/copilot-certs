/**
 * Content schema for Copilot Cert Academy.
 *
 * The backbone of the site is the official "skills measured" outline of each
 * Microsoft exam: functional groups (weighted), skills, and the individual
 * learning outcomes Microsoft lists under each skill. Every concept declares
 * which outcomes it teaches, so the site can show outcome-level coverage.
 */

export type CertId =
  | 'ab-730'
  | 'ab-900'
  | 'ab-731'
  | 'ab-620'
  | 'ab-650'
  | 'ab-100'
  | 'ai-901'
  | 'ai-103'
  | 'ai-200'
  | 'ai-300'
  | 'ai-500'
  | 'az-401'
  | 'gh-300'
  | 'gh-600'
  | 'gh-700';

export type Track = 'Microsoft 365 Copilot & Agents' | 'Azure AI & Foundry' | 'GitHub Copilot & Agentic AI';

export interface Outcome {
  /** Stable id, e.g. "ab-730-1-2-3" (exam-group-skill-index, 1-based). */
  id: string;
  text: string;
}

export interface Skill {
  /** Stable id, e.g. "ab-730-1-2". */
  id: string;
  name: string;
  outcomes: Outcome[];
}

export interface Domain {
  /** Stable id, e.g. "ab-730-1". Microsoft calls these functional groups. */
  id: string;
  number: number;
  name: string;
  /** Midpoint of Microsoft's published range, used for exam-simulation weighting. */
  weight: number;
  weightLow: number;
  weightHigh: number;
  skills: Skill[];
}

export interface Certification {
  id: CertId;
  code: string;
  /** Exam title as printed on the study guide. */
  examTitle: string;
  /** Certification name, e.g. "Microsoft Certified: AI Business Professional". */
  name: string;
  shortName: string;
  track: Track;
  level: 'Fundamentals' | 'Associate' | 'Expert' | 'Professional';
  beta?: boolean;
  tagline: string;
  description: string;
  audience: string;
  /** "Skills measured as of" date from the study guide, when printed. */
  skillsAsOf?: string;
  studyGuideUrl: string;
  certificationUrl: string;
  /** Default count for exam simulation. Microsoft exams typically have 40–60 items. */
  simulationItems: number;
  minutes: number;
  passingScore: number;
  domains: Domain[];
}

export interface Section {
  heading: string;
  /** Markdown. */
  body: string;
}

export interface Example {
  title: string;
  description: string;
  code?: string;
  language?: 'python' | 'typescript' | 'csharp' | 'json' | 'bash' | 'powershell' | 'yaml' | 'markdown' | 'text';
  takeaway: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number[];
  explanation: string;
}

export interface Statement {
  text: string;
  isTrue: boolean;
  explanation: string;
}

export interface Resource {
  label: string;
  url: string;
}

export interface Concept {
  id: string;
  title: string;
  summary: string;
  certs: CertId[];
  /** Domain (functional group) ids this concept supports, e.g. ["ab-730-1"]. */
  domains: string[];
  /** Official learning-outcome ids this concept teaches, e.g. ["ab-730-1-1-2"]. */
  outcomes: string[];
  tags: string[];
  difficulty: 'foundations' | 'intermediate' | 'advanced';
  diagram?: string;
  sections: Section[];
  examples: Example[];
  keyPoints: string[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  statements: Statement[];
  resources: Resource[];
}

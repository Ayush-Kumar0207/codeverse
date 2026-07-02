/**
 * Core Typings for the CodeVerse Encyclopedia
 */

export interface CodeImplementation {
  language: string; 
  code: string;
}

export interface AlgorithmDryRunStep {
  title: string;
  state: string;
  explanation: string;
  variables?: Record<string, string>;
}

export interface AlgorithmStoryDryRun {
  sampleInput: string;
  sampleOutput: string;
  steps: AlgorithmDryRunStep[];
  closingInsight: string;
}

export interface AlgorithmApproach {
  name: string;
  description: string;
  timeComplexity: string;
  timeComplexityExplanation?: string;
  spaceComplexity: string;
  spaceComplexityExplanation?: string;
  implementations: CodeImplementation[];
  storyDryRun?: AlgorithmStoryDryRun;
}

export interface AlgorithmEntry {
  id: string;
  title: string;
  topic: string; // E.g., 'Basic Basics - Things to Know', 'Arrays - Easy'
  category: string; // Deprecated, merged into topic, kept for backwards compatibility
  frequencyLevel: "Very High" | "High" | "Medium" | "Niche" | "Variable";
  difficulty: "Easy" | "Medium" | "Hard";
  overview: string;
  leetcodeLink?: string;
  useCases: string[];
  approaches: AlgorithmApproach[];
  visualizerCode?: string;
}

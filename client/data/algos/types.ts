/**
 * Core Typings for the CodeVerse Encyclopedia
 */

export interface CodeImplementation {
  language: string; 
  code: string;
}

export interface AlgorithmApproach {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  implementations: CodeImplementation[];
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

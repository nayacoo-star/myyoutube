export interface ScriptData {
  originalTranscript: string;
  newTopic: string;
  structureAnalysis?: string;
  tone?: string;
}

export interface AnalysisResult {
  structureAnalysis: string;
  suggestedTopics: string[];
}

export enum AppStep {
  INPUT = 'INPUT',
  ANALYSIS_SUCCESS = 'ANALYSIS_SUCCESS',
  GENERATED = 'GENERATED'
}

export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR'
}
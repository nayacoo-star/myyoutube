import React, { useState } from 'react';
import { ScriptInput } from './components/ScriptInput';
import { ScriptOutput } from './components/ScriptOutput';
import { TopicSelection } from './components/TopicSelection';
import { Button } from './components/Button';
import { analyzeTranscript, generateRemixedScript } from './services/geminiService';
import { LoadingState, AppStep, AnalysisResult } from './types';
import { Wand2, Youtube, ArrowRight, Search } from 'lucide-react';

export default function App() {
  const [originalScript, setOriginalScript] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [appStep, setAppStep] = useState<AppStep>(AppStep.INPUT);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [resultScript, setResultScript] = useState('');

  // Step 1: Analyze Transcript
  const handleAnalyze = async () => {
    if (!originalScript.trim()) return;

    setLoadingState(LoadingState.ANALYZING);
    try {
      const result = await analyzeTranscript(originalScript);
      setAnalysisResult(result);
      setAppStep(AppStep.ANALYSIS_SUCCESS);
      setLoadingState(LoadingState.IDLE);
      // Pre-select the first topic if available
      if (result.suggestedTopics.length > 0) {
        setNewTopic(result.suggestedTopics[0]);
      }
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
    }
  };

  // Step 2: Generate Final Script
  const handleGenerateScript = async () => {
    if (!originalScript || !newTopic || !analysisResult) return;

    setLoadingState(LoadingState.GENERATING);
    try {
      const script = await generateRemixedScript({
        originalTranscript: originalScript,
        newTopic: newTopic,
        structureAnalysis: analysisResult.structureAnalysis
      });
      setResultScript(script);
      setAppStep(AppStep.GENERATED);
      setLoadingState(LoadingState.IDLE);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleReset = () => {
    setAppStep(AppStep.INPUT);
    setAnalysisResult(null);
    setNewTopic('');
    setResultScript('');
    setLoadingState(LoadingState.IDLE);
  };

  const isInputValid = originalScript.length > 50;

  return (
    <div className="min-h-screen bg-black selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-lg">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              TubeScript <span className="font-light text-indigo-400">Remixer</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:block text-xs text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full">
                Powered by Gemini 2.5
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          
          {/* Left Column: Interaction Area */}
          <div className="flex flex-col gap-6 h-full overflow-y-auto pb-10 lg:pb-0 pr-1 custom-scroll">
            
            {/* Input Section */}
            <div className={`flex-grow flex flex-col transition-all duration-500 ${appStep === AppStep.INPUT ? 'min-h-[400px]' : 'h-[200px] flex-grow-0'}`}>
              <ScriptInput 
                value={originalScript} 
                onChange={setOriginalScript} 
                disabled={appStep !== AppStep.INPUT}
              />
            </div>

            {/* Action Section: Dynamic based on step */}
            <div className="space-y-4">
              
              {/* Step 1 Button: Show only in INPUT state */}
              {appStep === AppStep.INPUT && (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                   <Button 
                    onClick={handleAnalyze}
                    disabled={!isInputValid}
                    isLoading={loadingState === LoadingState.ANALYZING}
                    className="w-full h-12 text-base shadow-indigo-900/20"
                    icon={<Search className="w-5 h-5" />}
                  >
                    {loadingState === LoadingState.ANALYZING ? '대본 분석 중...' : '구조 분석 및 주제 추천받기'}
                  </Button>
                  {!isInputValid && (
                    <p className="text-center text-xs text-zinc-600 mt-2">
                      분석을 시작하려면 대본을 입력해주세요 (최소 50자).
                    </p>
                  )}
                </div>
              )}

              {/* Step 2 Area: Analysis Result & Topic Selection */}
              {(appStep === AppStep.ANALYSIS_SUCCESS || appStep === AppStep.GENERATED) && analysisResult && (
                <TopicSelection 
                  analysis={analysisResult}
                  selectedTopic={newTopic}
                  onTopicChange={setNewTopic}
                  onGenerate={handleGenerateScript}
                  isGenerating={loadingState === LoadingState.GENERATING}
                  onReset={handleReset}
                />
              )}
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="h-full min-h-[500px] lg:min-h-0">
             {/* Mobile only divider */}
            <div className="lg:hidden flex items-center justify-center py-4 text-zinc-700">
               <ArrowRight className="w-6 h-6 rotate-90" />
            </div>

            <ScriptOutput 
              content={resultScript} 
              loadingState={loadingState} 
              onRetry={appStep === AppStep.INPUT ? handleAnalyze : handleGenerateScript}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
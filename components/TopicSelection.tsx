import React from 'react';
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { AnalysisResult } from '../types';

interface TopicSelectionProps {
  analysis: AnalysisResult;
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onReset: () => void;
}

export const TopicSelection: React.FC<TopicSelectionProps> = ({
  analysis,
  selectedTopic,
  onTopicChange,
  onGenerate,
  isGenerating,
  onReset
}) => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
      
      {/* Analysis Summary */}
      <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-200 flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4" />
          구조 분석 결과
        </h3>
        <p className="text-xs text-indigo-100/80 leading-relaxed">
          {analysis.structureAnalysis}
        </p>
      </div>

      {/* Suggested Topics */}
      <div>
        <label className="text-xs font-medium text-zinc-400 mb-2 block">
          AI 추천 주제 (클릭하여 선택)
        </label>
        <div className="flex flex-wrap gap-2">
          {analysis.suggestedTopics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => onTopicChange(topic)}
              className={`text-left text-xs px-3 py-2 rounded-lg border transition-all duration-200 ${
                selectedTopic === topic
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-900/20"
                  : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
          주제 직접 입력
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={selectedTopic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="원하는 주제를 직접 입력할 수도 있습니다."
            className="flex-grow bg-black/40 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 flex gap-3">
        <Button 
          variant="secondary" 
          onClick={onReset}
          className="flex-shrink-0"
        >
          처음으로
        </Button>
        <Button 
          onClick={onGenerate}
          disabled={!selectedTopic || isGenerating}
          isLoading={isGenerating}
          className="flex-grow w-full text-base shadow-indigo-900/20"
          icon={<ArrowRight className="w-5 h-5" />}
        >
          {isGenerating ? '대본 작성 중...' : '이 주제로 대본 생성'}
        </Button>
      </div>
    </div>
  );
};
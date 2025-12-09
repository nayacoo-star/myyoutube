import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { LoadingState } from '../types';
import { Button } from './Button';

interface ScriptOutputProps {
  content: string;
  loadingState: LoadingState;
  onRetry: () => void;
}

export const ScriptOutput: React.FC<ScriptOutputProps> = ({ content, loadingState, onRetry }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loadingState === LoadingState.IDLE) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20 p-8 text-center">
        <Sparkles className="w-12 h-12 mb-4 text-zinc-700" />
        <h3 className="text-lg font-medium text-zinc-300 mb-2">대본 리믹스 대기 중</h3>
        <p className="max-w-xs text-sm">왼쪽에 대본을 붙여넣고 분석을 시작하면, 새로운 주제의 스크립트가 이곳에 생성됩니다.</p>
      </div>
    );
  }

  if (loadingState === LoadingState.ANALYZING) {
    return (
      <div className="h-full flex flex-col items-center justify-center border border-zinc-800 rounded-xl bg-zinc-900/20 p-8">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
        </div>
        <h3 className="text-lg font-medium text-white mb-2 animate-pulse">구조 분석 중...</h3>
        <p className="text-zinc-400 text-sm">훅, 리텐션 전략, 스토리텔링 구조를 파악하고 있습니다.</p>
      </div>
    );
  }

  if (loadingState === LoadingState.GENERATING) {
    return (
      <div className="h-full flex flex-col items-center justify-center border border-zinc-800 rounded-xl bg-zinc-900/20 p-8">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-violet-500/30 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-t-4 border-violet-500 rounded-full animate-spin"></div>
        </div>
        <h3 className="text-lg font-medium text-white mb-2 animate-pulse">새 대본 작성 중...</h3>
        <p className="text-zinc-400 text-sm">분석된 구조에 맞춰 새로운 주제를 입히고 있습니다.</p>
      </div>
    );
  }

  if (loadingState === LoadingState.ERROR) {
    return (
      <div className="h-full flex flex-col items-center justify-center border border-red-900/30 rounded-xl bg-red-900/10 p-8 text-center">
        <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-medium text-red-200 mb-2">오류 발생</h3>
        <p className="text-red-400 text-sm mb-6 max-w-xs">작업 중 문제가 발생했습니다. 입력 내용을 확인하고 다시 시도해주세요.</p>
        <Button onClick={onRetry} variant="secondary" icon={<RefreshCw className="w-4 h-4"/>}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-medium text-zinc-200">생성된 대본</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopy}
          className={copied ? "text-green-400" : ""}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span className="ml-2 text-xs">{copied ? '복사됨' : '복사하기'}</span>
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto p-6 bg-zinc-950/50 custom-markdown">
        <div className="prose prose-invert prose-zinc max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
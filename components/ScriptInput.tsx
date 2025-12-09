import React from 'react';
import { FileText, ClipboardPaste } from 'lucide-react';

interface ScriptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ScriptInput: React.FC<ScriptInputProps> = ({ value, onChange, disabled }) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          원본 대본 (레퍼런스 영상)
        </label>
        {!disabled && (
          <button 
            onClick={handlePaste}
            className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ClipboardPaste className="w-3 h-3" />
            붙여넣기
          </button>
        )}
      </div>
      <div className="relative flex-grow group">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="성공한 유튜브 영상의 대본을 여기에 붙여넣으세요..."
          className="w-full h-full min-h-[300px] bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 placeholder-zinc-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="absolute bottom-3 right-3 text-xs text-zinc-600 pointer-events-none bg-zinc-900/80 px-2 py-1 rounded">
          {value.length} 자
        </div>
      </div>
    </div>
  );
};
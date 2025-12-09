import React, { useState, useEffect } from 'react';
import { Key, Check, X, Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

const API_KEY_STORAGE_KEY = 'gemini_api_key';

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    // Load saved API key from localStorage
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) {
      setSavedKey(stored);
      onApiKeySet(stored);
    } else {
      setIsEditing(true);
    }
  }, [onApiKeySet]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
      setSavedKey(apiKey.trim());
      onApiKeySet(apiKey.trim());
      setIsEditing(false);
      setApiKey('');
    }
  };

  const handleRemove = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setSavedKey(null);
    setIsEditing(true);
    onApiKeySet('');
  };

  const handleEdit = () => {
    setApiKey(savedKey || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setApiKey('');
    setIsEditing(false);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '••••••••';
    return `${key.substring(0, 4)}••••••••${key.substring(key.length - 4)}`;
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Key className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-zinc-300">Gemini API Key</h3>
      </div>

      {!isEditing && savedKey ? (
        <div className="space-y-3">
          <div className="bg-zinc-800/50 rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm text-zinc-400 font-mono">
                {maskApiKey(savedKey)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                수정
              </button>
              <button
                onClick={handleRemove}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
          <p className="text-xs text-zinc-600">
            API 키가 저장되었습니다. 브라우저에 안전하게 보관됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza..."
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2.5 pr-10 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-mono"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && apiKey.trim()) {
                  handleSave();
                }
              }}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400 transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1 h-9 text-sm"
            >
              <Check className="w-4 h-4 mr-1" />
              저장하기
            </Button>
            {savedKey && (
              <Button
                onClick={handleCancel}
                className="h-9 px-4 text-sm bg-zinc-800 hover:bg-zinc-700"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-zinc-600">
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                Google AI Studio
              </a>
              에서 무료로 API 키를 발급받을 수 있습니다.
            </p>
            <p className="text-xs text-zinc-600">
              입력한 API 키는 브라우저 로컬 스토리지에만 저장되며, 서버로 전송되지 않습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

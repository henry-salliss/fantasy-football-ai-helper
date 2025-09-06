import React, { useState } from 'react';
import { Key, Brain, AlertCircle, CheckCircle } from 'lucide-react';
import { realAiService } from '../services/realAiService';

interface AIConfigProps {
  onApiKeySet?: () => void;
}

export const AIConfig: React.FC<AIConfigProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      // Set the API key
      realAiService.setApiKey(apiKey.trim());
      
      // Test the API key with a simple request
      const testTeam = {
        id: 'test',
        name: 'Test Team',
        starting11: [],
        bench: [],
        formation: '3-4-3',
        totalCost: 0
      };

      // This will test if the API key works
      await realAiService.analyzeTeam(testTeam);
      
      setIsValid(true);
      onApiKeySet?.();
    } catch (error) {
      setIsValid(false);
      let errorMessage = 'Invalid API key';
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'API key is valid but you may not have access to GPT models. Please check your OpenAI account billing and model access.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Invalid API key. Please check your key and try again.';
        } else if (error.message.includes('quota') || error.message.includes('429')) {
          errorMessage = 'API quota exceeded. You need to add billing information to your OpenAI account. New accounts often have no free credits.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearApiKey = () => {
    setApiKey('');
    setIsValid(null);
    setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <Brain className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">AI Analysis Configuration</h3>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-4">
          To get intelligent AI analysis of your team, you'll need an OpenAI API key. 
          This allows the AI to analyze player form, fixtures, injuries, and provide personalized recommendations.
        </p>

        <div className="space-y-3">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              OpenAI API Key
            </label>
            <div className="flex gap-2">
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isValidating}
              />
              <button
                onClick={handleSetApiKey}
                disabled={isValidating || !apiKey.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isValidating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Testing...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    Set Key
                  </>
                )}
              </button>
            </div>
          </div>

          {isValid === true && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">API key is valid! AI analysis is now available.</span>
            </div>
          )}

          {isValid === false && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Invalid API key. Please check and try again.</span>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
              {error.includes('quota') && (
                <div className="mt-2">
                  <a 
                    href="https://platform.openai.com/account/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    → Add billing information to OpenAI account
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="font-medium text-blue-900 mb-2">How to get an OpenAI API key:</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a></li>
          <li>Sign up or log in to your account</li>
          <li>Go to API Keys section</li>
          <li>Create a new secret key</li>
          <li>Copy the key (starts with "sk-") and paste it above</li>
        </ol>
        <p className="text-xs text-blue-700 mt-2">
          Note: API usage costs money, but analysis requests are typically very cheap (a few cents per analysis).
        </p>
        <div className="mt-3 p-3 bg-blue-100 rounded-md">
          <h5 className="font-medium text-blue-900 text-sm mb-1">Model Access Requirements:</h5>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• GPT-3.5-turbo: Available to all users (recommended)</li>
            <li>• GPT-4: Requires paid account with model access</li>
            <li>• The app will automatically try the best available model</li>
          </ul>
        </div>
        <div className="mt-3 p-3 bg-yellow-100 rounded-md">
          <h5 className="font-medium text-yellow-900 text-sm mb-1">⚠️ Billing Information Required:</h5>
          <ul className="text-xs text-yellow-800 space-y-1">
            <li>• New OpenAI accounts often have no free credits</li>
            <li>• You need to add a payment method to use the API</li>
            <li>• Analysis requests cost ~$0.01-0.05 each (very cheap)</li>
            <li>• Visit <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Billing</a> to add payment info</li>
          </ul>
        </div>
      </div>

      {isValid && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleClearApiKey}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear API key
          </button>
        </div>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import { Prompt } from './types';
import PromptList from './components/PromptList';
import GenerationView from './components/GenerationView';
import { promptsData } from './data/prompts';

const App: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const handlePromptSelect = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
  };

  const handleBack = () => {
    setSelectedPrompt(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            CineStyle India: AI Portrait Generator
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Transform your photos with iconic Bollywood, festive, and royal styles.
          </p>
        </header>

        {selectedPrompt ? (
          <GenerationView prompt={selectedPrompt} onBack={handleBack} />
        ) : (
          <PromptList prompts={promptsData} onPromptSelect={handlePromptSelect} />
        )}

        <footer className="text-center mt-12 text-sm text-gray-500">
            <p>Powered by Gemini. Select a style, upload your photos, and see the magic.</p>
        </footer>
      </div>
    </main>
  );
};

export default App;
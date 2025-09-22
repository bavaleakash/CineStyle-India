import React, { useState } from 'react';
import { Prompt, PromptCategory } from '../types';
import PromptCard from './PromptCard';

interface PromptListProps {
  prompts: PromptCategory[];
  onPromptSelect: (prompt: Prompt) => void;
}

const PromptList: React.FC<PromptListProps> = ({ prompts, onPromptSelect }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const handleToggleCategory = (categoryTitle: string) => {
    setOpenCategory(prevOpenCategory =>
      prevOpenCategory === categoryTitle ? null : categoryTitle
    );
  };

  return (
    <div className="space-y-4">
      {prompts.map((category) => {
        const isOpen = openCategory === category.title;
        // Create a stable ID for ARIA attributes
        const categoryId = category.title.replace(/\s+/g, '-').toLowerCase();
        
        return (
          <div key={category.title} className="bg-white rounded-lg shadow-sm border border-gray-200 transition-shadow hover:shadow-md">
            <h2 id={`category-header-${categoryId}`} className="m-0">
              <button
                onClick={() => handleToggleCategory(category.title)}
                className="w-full flex justify-between items-center p-4 text-left text-xl font-bold text-gray-800 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-t-lg"
                aria-expanded={isOpen}
                aria-controls={`category-panel-${categoryId}`}
              >
                <span>{category.title}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 transform transition-transform duration-300 text-gray-500 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </h2>
            {isOpen && (
              <section
                id={`category-panel-${categoryId}`}
                aria-labelledby={`category-header-${categoryId}`}
                className="p-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {category.prompts.map((prompt) => (
                    <PromptCard key={prompt.id} prompt={prompt} onSelect={() => onPromptSelect(prompt)} />
                  ))}
                </div>
              </section>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PromptList;

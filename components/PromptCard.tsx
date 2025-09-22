import React from 'react';
import { Prompt } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  onSelect: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      aria-label={`Select style: ${prompt.title}`}
    >
      <div className="relative">
        <img
          src={prompt.sampleImageUrl}
          alt={`Sample for "${prompt.title}"`}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors duration-300">
            {prompt.title}
        </h3>
      </div>
    </button>
  );
};

export default PromptCard;
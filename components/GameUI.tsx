
import React from 'react';
import { GameState } from '../types';

interface GameUIProps {
  gameState: GameState;
  score: number;
  highScore: number;
  onRestart: () => void;
}

const RestartIcon: React.FC = () => (
    <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5 2V2C13.4249 2 8.5 6.92487 8.5 13V13C8.5 19.0751 13.4249 24 19.5 24H20.5" stroke="currentColor" strokeWidth="3"/>
        <path d="M15 13L9 19L3 13" stroke="currentColor" strokeWidth="3"/>
    </svg>
);


const GameUI: React.FC<GameUIProps> = ({ gameState, score, highScore, onRestart }) => {
  const formatScore = (s: number) => s.toString().padStart(5, '0');

  return (
    <div className="absolute top-2 right-2 text-gray-700 dark:text-gray-300 text-lg tracking-widest select-none">
      <span>HI {formatScore(highScore)}</span>
      <span className="ml-4">{formatScore(score)}</span>

      {gameState === GameState.Waiting && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          PRESS SPACE TO START
        </div>
      )}

      {gameState === GameState.GameOver && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">G A M E   O V E R</h2>
            <button onClick={onRestart} className="mt-4 p-2 text-gray-700 dark:text-gray-300">
                <RestartIcon />
            </button>
        </div>
      )}
    </div>
  );
};

export default GameUI;

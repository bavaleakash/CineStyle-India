
import React, { useState, useEffect } from 'react';
import { GameState } from '../types';
import * as C from '../constants';

interface DinoProps {
  y: number;
  gameState: GameState;
}

const DinoCrashed: React.FC = () => (
  <svg viewBox="0 0 44 47" width={C.DINO_WIDTH} height={C.DINO_HEIGHT} fill="currentColor">
    <path d="M22 26.364v3.545h3.545v3.546H22v3.545h-3.545v-3.545h-3.546v-3.546h3.546v-3.545h-3.545V22.82h3.545v-3.546h3.546v-3.545h3.545v3.545h3.545V22.82h3.546v3.545H29.09v3.546h-3.545v3.545h-3.546zm-7.09-7.091v-3.545h3.545V12.18h-3.545V8.637h-3.546V5.09h3.546V1.546h7.09V0h3.546v1.546h3.545v7.09h3.546v3.545h3.545v3.546h-3.545v3.545H29.09v-3.545h-3.545v3.545h-3.546v-3.545h-3.545v3.545h-3.545v-3.545h-3.546zM0 47h44v-3.545H0V47z"></path>
  </svg>
);

const DinoRun1: React.FC = () => (
    <svg viewBox="0 0 44 47" width={C.DINO_WIDTH} height={C.DINO_HEIGHT} fill="currentColor">
    <path d="M22 26.364v3.545h-3.545v3.546h-3.546v-3.546H11.364v-3.545H7.818v7.091h3.546v3.545h3.545V47h3.545v-3.545h3.546v3.545h3.545v-3.545h3.545v-3.546h3.546v-3.545H29.09v-3.545H22zm-7.09-7.091v-3.545h3.545V12.18h-3.545V8.637h-3.546V5.09h3.546V1.546h7.09V0h3.546v1.546h3.545v7.09h3.546v3.545h3.545v3.546h-3.545v3.545H29.09v-3.545h-3.545v3.545h-3.546v-3.545h-3.545v3.545h-3.545v-3.545h-3.546z"></path>
  </svg>
);

const DinoRun2: React.FC = () => (
    <svg viewBox="0 0 44 47" width={C.DINO_WIDTH} height={C.DINO_HEIGHT} fill="currentColor">
    <path d="M22 26.364v3.545h-3.545v3.546H22v3.545h3.545v3.546h3.546v-3.546h3.545V33.455h3.545v-7.091h-3.545v-3.545h-3.546v-3.545h-3.545v3.545h-3.545v3.546H7.818v3.545h3.546v3.545h3.545v-3.545h3.545zm-7.09-7.091v-3.545h3.545V12.18h-3.545V8.637h-3.546V5.09h3.546V1.546h7.09V0h3.546v1.546h3.545v7.09h3.546v3.545h3.545v3.546h-3.545v3.545H29.09v-3.545h-3.545v3.545h-3.546v-3.545h-3.545v3.545h-3.545v-3.545h-3.546zM0 47h3.545v-3.545h3.546V47h3.545v-3.545h3.545V47h3.545v-3.545H14.91v-3.545H11.364v-3.546H7.818v3.546H4.273v3.545H0v-3.545z"></path>
  </svg>
);

const Dino: React.FC<DinoProps> = ({ y, gameState }) => {
  const [runFrame, setRunFrame] = useState(1);

  useEffect(() => {
    if (gameState !== GameState.Running) return;

    const timer = setInterval(() => {
      setRunFrame(prev => (prev === 1 ? 2 : 1));
    }, C.DINO_RUN_FRAME_DELAY);

    return () => clearInterval(timer);
  }, [gameState]);

  const renderDinoSprite = () => {
    if (gameState === GameState.GameOver) {
      return <DinoCrashed />;
    }
    if (runFrame === 1) {
      return <DinoRun1 />;
    }
    return <DinoRun2 />;
  };

  return (
    <div
      className="absolute text-gray-700 dark:text-gray-300"
      style={{
        width: C.DINO_WIDTH,
        height: C.DINO_HEIGHT,
        left: `${C.DINO_LEFT_POS}px`,
        bottom: `${y + C.GROUND_HEIGHT}px`,
        transition: 'bottom 0.05s linear'
      }}
    >
      {renderDinoSprite()}
    </div>
  );
};

export default Dino;

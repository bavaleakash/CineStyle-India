
import React, { useEffect, useState } from 'react';
import * as C from '../constants';

interface GroundProps {
  gameSpeed: number;
}

const Ground: React.FC<GroundProps> = ({ gameSpeed }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime: number | null = null;
    
    const animate = (time: number) => {
      if (lastTime === null) {
        lastTime = time;
      }
      const deltaTime = time - lastTime;
      lastTime = time;

      if (gameSpeed > 0) {
        setOffset(prevOffset => (prevOffset + gameSpeed * deltaTime) % (C.GAME_WIDTH * 2));
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameSpeed]);

  const groundSvg = `
    <svg width="2400" height="12" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="groundPattern" patternUnits="userSpaceOnUse" width="600" height="12">
          <path d="M0 10h15v2H0v-2zm30 0h15v2H30v-2zm60 0h15v2H90v-2zm30 0h15v2h-15v-2zm60 0h15v2h-15v-2zm30 0h15v2h-15v-2zm60 0h15v2h-15v-2zm30 0h15v2h-15v-2zm60 0h15v2h-15v-2zm30 0h15v2h-15v-2zm60 0h15v2h-15v-2zm30 0h15v2h-15v-2zm60 0h15v2h-15v-2z M0 0h600v1H0V0z" fill-rule="evenodd" fill="currentColor"/>
        </pattern>
      </defs>
      <rect fill="url(#groundPattern)" width="2400" height="12"/>
    </svg>
  `;
  const groundDataUrl = `data:image/svg+xml;base64,${btoa(groundSvg)}`;

  return (
    <div
      className="absolute bottom-0 left-0 w-full text-gray-700 dark:text-gray-300"
      style={{
        height: `${C.GROUND_HEIGHT}px`,
        backgroundImage: `url('${groundDataUrl}')`,
        backgroundRepeat: 'repeat-x',
        backgroundPosition: `-${offset}px 0`,
        width: `${C.GAME_WIDTH * 4}px`, // Make it wider to avoid seams
      }}
    />
  );
};

export default Ground;

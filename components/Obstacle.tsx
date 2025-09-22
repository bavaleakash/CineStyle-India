
import React from 'react';
import { Obstacle } from '../types';
import * as C from '../constants';

interface ObstacleProps {
  obstacle: Obstacle;
}

const CactusSmall: React.FC = () => (
    <svg viewBox="0 0 17 35" width={C.CACTUS_SMALL_WIDTH} height={C.CACTUS_SMALL_HEIGHT} fill="currentColor">
        <path d="M13.455 35v-3.545h-3.546V27.91h-3.545v-3.546h3.545v-3.545H6.364v3.545H2.818v-3.545H0V17.273h2.818V13.727h3.546V10.18h3.545V0h3.545v21.09h-3.545v3.546h3.545v6.818h3.546V35h-3.546z"></path>
    </svg>
);

const CactusLarge: React.FC = () => (
    <svg viewBox="0 0 25 50" width={C.CACTUS_LARGE_WIDTH} height={C.CACTUS_LARGE_HEIGHT} fill="currentColor">
        <path d="M25 50V39.273h-3.545v-3.546h-3.546V32.18h3.546v-3.545h3.545v-3.546h3.545V21.545h-3.545v-3.545h-3.545V14.455h3.545V10.91h-3.545V7.364h-3.546V0h-3.545v21.545h-3.545v3.546h-3.546v-3.546H4.273V10.91H0v3.545h4.273v3.545h3.545v3.546h3.546v3.545h-3.546v3.546h3.546v18.09h-3.546v-3.545h-3.545v3.545H4.273V50H25z"></path>
    </svg>
);

const CactusGroup: React.FC = () => (
    <svg viewBox="0 0 51 50" width={C.CACTUS_GROUP_WIDTH} height={C.CACTUS_GROUP_HEIGHT} fill="currentColor">
        <path d="M51 50V39.273h-3.545v-3.546h-3.546V32.18h3.546v-3.545h3.545v-3.546h3.545V21.545h-3.545v-3.545h-3.545V14.455h3.545V10.91h-3.545V7.364h-3.546V0H33.41v21.545h-3.546v3.546h-3.545v-3.546h-3.546V10.91H19.227v3.545h3.545v3.545h3.546v3.546h3.545v3.545h-3.545v3.546h3.545v18.09h-3.545v-3.545h-3.546v3.545h-3.545V50h7.09v-3.545h-3.545v-3.546h-3.545v-3.545h3.545v-3.545H15.682v-3.546h-3.546V17.82h3.546V14.273h-3.546V10.727H8.59V7.182h3.545V0H8.59v28.41H5.045v3.545h3.545v14.455h-3.545v-3.545H1.5v3.545H0V50h51z"></path>
    </svg>
);

const ObstacleComponent: React.FC<ObstacleProps> = ({ obstacle }) => {
  const renderObstacleType = () => {
    switch (obstacle.type) {
      case 'cactus-small':
        return <CactusSmall />;
      case 'cactus-large':
        return <CactusLarge />;
      case 'cactus-group':
        return <CactusGroup />;
      default:
        return null;
    }
  };

  return (
    <div
      className="absolute text-gray-700 dark:text-gray-300"
      style={{
        width: obstacle.width,
        height: obstacle.height,
        left: `${obstacle.x}px`,
        bottom: `${C.GROUND_HEIGHT}px`,
      }}
    >
      {renderObstacleType()}
    </div>
  );
};

export default ObstacleComponent;

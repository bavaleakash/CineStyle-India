export interface Prompt {
  id: string;
  title: string;
  text: string;
  sampleImageUrl: string;
}

export interface PromptCategory {
  title: string;
  prompts: Prompt[];
}

// Fix: Define and export the GameState enum used in Dino.tsx and GameUI.tsx.
export enum GameState {
  Waiting,
  Running,
  GameOver,
}

// Fix: Define and export ObstacleType and the Obstacle interface used in Obstacle.tsx.
export type ObstacleType = 'cactus-small' | 'cactus-large' | 'cactus-group';

export interface Obstacle {
  x: number;
  width: number;
  height: number;
  type: ObstacleType;
}
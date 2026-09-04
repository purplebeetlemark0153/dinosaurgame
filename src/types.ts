export type GameStage =
  | 'MAIN_MENU'
  | 'STAGE_1_INTRO'
  | 'STAGE_1_PLAY'
  | 'STAGE_2_INTRO'
  | 'STAGE_2_PLAY'
  | 'STAGE_3_INTRO'
  | 'STAGE_3_PLAY'
  | 'STAGE_4_INTRO'
  | 'STAGE_4_PLAY'
  | 'EPILOGUE';

export type Stage2Character = 'archaeopteryx' | 'pteranodon'; // 始祖鳥 vs 無齒翼龍
export type Stage3Character = 'elasmosaurus' | 'mosasaurus';  // 薄板龍 vs 滄龍

export interface ScoreItem {
  id: string;
  x: number;
  y: number;
  type: string;
  points: number;
  size: number;
  vx?: number;
  vy?: number;
  duration?: number;
  spawnTime?: number;
  icon?: string;
  label?: string;
}

export interface PlayerStats {
  score: number;
  aiScore: number;
  timeLeft: number;
  health: number; // for stage 1 body temp (0 to 100)
  targetCount: number; // for stage 4 compsognathus caught (target >= 7)
}

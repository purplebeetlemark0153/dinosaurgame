import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stage2Character } from '../types';
import { ArchaeopteryxAvatar, PteranodonAvatar } from './DinosaurAvatars';
import { DragonflyAvatar, BeetleAvatar, LizardAvatar } from './PreyAvatars';
import { GameOverModal } from './GameOverModal';
import { sound } from '../utils/audio';
import { Timer, Trophy, Bot, User } from 'lucide-react';

interface Stage2GameProps {
  playerCharacter: Stage2Character;
  onStagePass: () => void;
  onRestartAll?: () => void;
  onHome: () => void;
}

interface SkyPrey {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'dragonfly' | 'beetle' | 'lizard';
  points: number;
  name: string;
  emoji: string;
}

export const Stage2Game: React.FC<Stage2GameProps> = ({ playerCharacter, onStagePass, onRestartAll, onHome }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const aiCharacter: Stage2Character = playerCharacter === 'archaeopteryx' ? 'pteranodon' : 'archaeopteryx';

  // State
  const [playerPos, setPlayerPos] = useState({ x: 30, y: 50 });
  const [aiPos, setAiPos] = useState({ x: 70, y: 50 });
  const playerPosRef = useRef({ x: 30, y: 50 });
  const aiPosRef = useRef({ x: 70, y: 50 });
  const preysRef = useRef<SkyPrey[]>([]);

  const [playerFacingLeft, setPlayerFacingLeft] = useState(false);
  const [aiFacingLeft, setAiFacingLeft] = useState(true);

  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [preys, setPreys] = useState<SkyPrey[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const scoresRef = useRef({ player: 0, ai: 0 });
  scoresRef.current = { player: playerScore, ai: aiScore };
  preysRef.current = preys;

  // Floating text feedback
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number; isPlayer: boolean }[]>([]);

  const addFloatingText = (text: string, x: number, y: number, isPlayer: boolean) => {
    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id, text, x, y, isPlayer }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 800);
  };

  // Check collision helper
  const checkEatCollision = useCallback((pos: { x: number; y: number }, isPlayer: boolean) => {
    const hitRadius = 10.5; // Generous aerial hitbox
    setPreys((currentPreys) => {
      let ate = false;
      const remaining: SkyPrey[] = [];

      currentPreys.forEach((prey) => {
        const dx = Math.abs(prey.x - pos.x);
        const dy = Math.abs(prey.y - pos.y);
        const dist = Math.hypot(dx, dy);

        if (!ate && dist < hitRadius) {
          ate = true;
          if (isPlayer) {
            sound.playEat();
            setPlayerScore((s) => s + prey.points);
            addFloatingText(`+${prey.points}`, prey.x, prey.y, true);
          } else {
            setAiScore((s) => s + prey.points);
            addFloatingText(`+${prey.points}`, prey.x, prey.y, false);
          }
        } else {
          remaining.push(prey);
        }
      });

      return remaining;
    });
  }, []);

  // Reset
  const resetGame = useCallback(() => {
    setPlayerPos({ x: 30, y: 50 });
    setAiPos({ x: 70, y: 50 });
    playerPosRef.current = { x: 30, y: 50 };
    aiPosRef.current = { x: 70, y: 50 };
    setPlayerScore(0);
    setAiScore(0);
    scoresRef.current = { player: 0, ai: 0 };
    setTimeLeft(30);
    setPreys([]);
    preysRef.current = [];
    setIsGameOver(false);
  }, []);

  // Update Player Position
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (isGameOver || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 5), 95);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 5), 95);

    if (x < playerPosRef.current.x) setPlayerFacingLeft(true);
    else if (x > playerPosRef.current.x) setPlayerFacingLeft(false);

    playerPosRef.current = { x, y };
    setPlayerPos({ x, y });

    // Immediate reactive collision check on pointer movement
    checkEatCollision({ x, y }, true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Spawn Sky Prey
  useEffect(() => {
    if (isGameOver) return;

    const spawnInterval = setInterval(() => {
      if (preysRef.current.length >= 8) return;

      const rand = Math.random();
      let type: 'dragonfly' | 'beetle' | 'lizard' = 'dragonfly';
      let points = 10;
      let name = '古巨蜻蜓';
      let emoji = '🦟';

      if (rand > 0.7) {
        type = 'lizard';
        points = 30;
        name = '滑翔蜥蜴';
        emoji = '🦎';
      } else if (rand > 0.4) {
        type = 'beetle';
        points = 20;
        name = '遠古甲蟲';
        emoji = '🪲';
      }

      const newPrey: SkyPrey = {
        id: Date.now() + Math.random(),
        x: Math.random() > 0.5 ? 5 : 95,
        y: Math.floor(Math.random() * 70) + 15,
        vx: (Math.random() * 0.8 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() * 0.6 - 0.3),
        type,
        points,
        name,
        emoji,
      };

      setPreys((prev) => [...prev, newPrey]);
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [isGameOver]);

  // Main Loop (Timer, Prey Movement, AI Logic, Collisions)
  useEffect(() => {
    if (isGameOver) return;

    const gameTimer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(gameTimer);
          // Check winner using current scoresRef
          if (scoresRef.current.player > scoresRef.current.ai) {
            sound.playWin();
            onStagePass();
          } else {
            sound.playFail();
            setIsGameOver(true);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(gameTimer);
  }, [isGameOver, onStagePass]);

  // Fast movement & AI physics tick (every 45ms) - Stable loop that won't restart on pointer events
  useEffect(() => {
    if (isGameOver) return;

    const physicsLoop = setInterval(() => {
      // 1. Move Preys
      setPreys((prev) =>
        prev.map((p) => {
          let nextX = p.x + p.vx;
          let nextY = p.y + p.vy;
          let nextVx = p.vx;
          let nextVy = p.vy;

          if (nextX <= 3 || nextX >= 97) nextVx *= -1;
          if (nextY <= 10 || nextY >= 90) nextVy *= -1;

          return { ...p, x: nextX, y: nextY, vx: nextVx, vy: nextVy };
        })
      );

      // 2. AI Competitor Logic
      const currentPreys = preysRef.current;
      const currentAi = aiPosRef.current;

      if (currentPreys.length > 0) {
        let closestPrey: SkyPrey | null = null;
        let minDist = 99999;
        currentPreys.forEach((p) => {
          const dist = Math.hypot(p.x - currentAi.x, p.y - currentAi.y);
          if (dist < minDist) {
            minDist = dist;
            closestPrey = p;
          }
        });

        if (closestPrey) {
          const target = closestPrey as SkyPrey;
          const speed = 1.1; // AI speed
          const dx = target.x - currentAi.x;
          const dy = target.y - currentAi.y;
          const angle = Math.atan2(dy, dx);

          const newX = currentAi.x + Math.cos(angle) * speed;
          const newY = currentAi.y + Math.sin(angle) * speed;

          if (newX < currentAi.x) setAiFacingLeft(true);
          else if (newX > currentAi.x) setAiFacingLeft(false);

          aiPosRef.current = { x: newX, y: newY };
          setAiPos({ x: newX, y: newY });
        }
      }

      // 3. Collision Checks for Player and AI against moving prey
      const pPos = playerPosRef.current;
      const aPos = aiPosRef.current;
      const hitRadius = 10.5;

      setPreys((latestPreys) => {
        const remaining: SkyPrey[] = [];

        latestPreys.forEach((prey) => {
          const playerDist = Math.hypot(prey.x - pPos.x, prey.y - pPos.y);
          const aiDist = Math.hypot(prey.x - aPos.x, prey.y - aPos.y);

          if (playerDist < hitRadius) {
            sound.playEat();
            setPlayerScore((s) => s + prey.points);
            addFloatingText(`+${prey.points}`, prey.x, prey.y, true);
          } else if (aiDist < hitRadius) {
            setAiScore((s) => s + prey.points);
            addFloatingText(`+${prey.points}`, prey.x, prey.y, false);
          } else {
            remaining.push(prey);
          }
        });

        return remaining;
      });
    }, 45);

    return () => clearInterval(physicsLoop);
  }, [isGameOver]);

  const renderDinoAvatar = (char: Stage2Character) => {
    if (char === 'archaeopteryx') return <ArchaeopteryxAvatar />;
    return <PteranodonAvatar />;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      className="relative w-full h-full min-h-[580px] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-sky-400 via-sky-500 to-indigo-950 select-none cursor-crosshair touch-none"
    >
      {/* Sky Clouds and Distant Mesozoic Peaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sky SVG Clouds & Atmosphere */}
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="cloudGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="peakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#312E81" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Distant Mountain Peaks */}
          <polygon points="120,600 240,460 360,600" fill="url(#peakGrad)" />
          <polygon points="320,600 480,420 640,600" fill="url(#peakGrad)" />
          <polygon points="600,600 780,450 960,600" fill="url(#peakGrad)" />

          {/* Cloud Formation 1: Upper Left Cumulus */}
          <g transform="translate(60, 40)" opacity="0.9">
            <path d="M 20 60 Q 30 20 70 30 Q 100 10 140 30 Q 180 20 200 60 Q 210 90 170 95 L 30 95 Q 0 90 20 60 Z" fill="url(#cloudGrad1)" />
          </g>

          {/* Cloud Formation 2: Upper Right Large Cloud */}
          <g transform="translate(650, 70)" opacity="0.85">
            <path d="M 30 70 Q 50 20 100 35 Q 140 10 190 30 Q 240 15 270 65 Q 290 100 230 110 L 40 110 Q 0 105 30 70 Z" fill="url(#cloudGrad1)" />
          </g>

          {/* Cloud Formation 3: Center Mid-Sky Drifting Cloud */}
          <g transform="translate(360, 180)" opacity="0.6">
            <path d="M 20 50 Q 40 15 80 25 Q 110 5 150 25 Q 180 20 200 50 Q 210 75 160 80 L 30 80 Q 0 75 20 50 Z" fill="url(#cloudGrad2)" />
          </g>

          {/* Cloud Formation 4: Lower Left Cirrus Stream */}
          <g transform="translate(10, 320)" opacity="0.5">
            <ellipse cx="120" cy="40" rx="110" ry="25" fill="url(#cloudGrad2)" />
            <ellipse cx="180" cy="35" rx="80" ry="20" fill="url(#cloudGrad2)" />
          </g>

          {/* Cloud Formation 5: Lower Right Fluffy Cloud */}
          <g transform="translate(720, 360)" opacity="0.65">
            <path d="M 30 50 Q 50 15 90 25 Q 130 10 170 30 Q 200 25 220 55 Q 230 85 180 90 L 40 90 Q 0 85 30 50 Z" fill="url(#cloudGrad1)" />
          </g>
        </svg>

        {/* Sunlight Ray Overlays */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-amber-200/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top HUD: Time & Scores */}
      <div className="w-full p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 z-20 bg-[#FAF3E0]/95 backdrop-blur-md border-b-2 border-[#D9B99B] text-[#4A3728] shadow-sm">
        {/* Player Score */}
        <div className="flex items-center gap-2 bg-[#8B9A46]/20 border-2 border-[#6E7B36] px-3.5 py-1 rounded-full shadow-sm">
          <User className="w-4 h-4 text-[#6E7B36]" />
          <span className="text-xs font-black text-[#6E7B36]">
            玩家 ({playerCharacter === 'archaeopteryx' ? '始祖鳥' : '無齒翼龍'}):
          </span>
          <span className="text-lg font-black text-[#E67E22] font-mono">{playerScore}</span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 bg-white border-2 border-[#E67E22] px-4 py-1 rounded-full shadow-sm">
          <Timer className="w-4 h-4 text-[#E67E22] animate-spin" />
          <span className="text-base font-black text-[#E67E22] font-mono">{timeLeft}s</span>
        </div>

        {/* AI Score */}
        <div className="flex items-center gap-2 bg-[#D9B99B]/30 border-2 border-[#9B7E6F] px-3.5 py-1 rounded-full shadow-sm">
          <Bot className="w-4 h-4 text-[#9B7E6F]" />
          <span className="text-xs font-bold text-[#5D4E42]">
            對手 ({aiCharacter === 'archaeopteryx' ? '始祖鳥' : '無齒翼龍'}):
          </span>
          <span className="text-lg font-black text-[#5D4E42] font-mono">{aiScore}</span>
        </div>
      </div>

      {/* Game Sky Field */}
      <div className="relative flex-1 w-full h-full">
        {/* Controls Hint */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[#5D4E42] font-medium text-[11px] pointer-events-none bg-white/90 px-3.5 py-1 rounded-full border-2 border-[#D9B99B] shadow-sm">
          滑動在空中掠食，時間結束前分數必須超越對手！
        </div>

        {/* Airborne Preys (Vector SVG with high-contrast glowing pod) */}
        {preys.map((prey) => (
          <div
            key={prey.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
            style={{
              left: `${prey.x}%`,
              top: `${prey.y}%`,
            }}
          >
            <div className="relative bg-white/30 backdrop-blur-md border-2 border-white/60 p-2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)] flex items-center justify-center animate-pulse">
              {prey.type === 'dragonfly' ? (
                <DragonflyAvatar className="w-8 h-8" />
              ) : prey.type === 'beetle' ? (
                <BeetleAvatar className="w-8 h-8" />
              ) : (
                <LizardAvatar className="w-8 h-8" />
              )}
              <span className="absolute -bottom-3 text-[9px] font-black bg-stone-900/90 text-amber-300 px-1.5 py-0.2 rounded-full border border-amber-400 shadow">
                +{prey.points}
              </span>
            </div>
          </div>
        ))}

        {/* Floating Scores */}
        {floatingTexts.map((item) => (
          <div
            key={item.id}
            className={`absolute font-black text-base pointer-events-none animate-bounce -translate-x-1/2 -translate-y-full ${
              item.isPlayer ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]' : 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.9)]'
            }`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.text}
          </div>
        ))}

        {/* Player Avatar (Enlarged for impressive aerial presence) */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75 z-10"
          style={{
            left: `${playerPos.x}%`,
            top: `${playerPos.y}%`,
            transform: `translate(-50%, -50%) ${playerFacingLeft ? 'scaleX(-1)' : 'scaleX(1)'}`,
          }}
        >
          <div className="w-32 h-24 sm:w-40 sm:h-30 filter drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]">
            {renderDinoAvatar(playerCharacter)}
          </div>
          <div className="text-center text-[10px] font-bold text-emerald-300 bg-black/60 px-1.5 py-0.5 rounded-full -mt-2">
            玩家
          </div>
        </div>

        {/* AI Avatar (Enlarged) */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75 z-10"
          style={{
            left: `${aiPos.x}%`,
            top: `${aiPos.y}%`,
            transform: `translate(-50%, -50%) ${aiFacingLeft ? 'scaleX(-1)' : 'scaleX(1)'}`,
          }}
        >
          <div className="w-32 h-24 sm:w-40 sm:h-30 filter drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]">
            {renderDinoAvatar(aiCharacter)}
          </div>
          <div className="text-center text-[10px] font-bold text-rose-300 bg-black/60 px-1.5 py-0.5 rounded-full -mt-2">
            電腦對手
          </div>
        </div>
      </div>

      {/* Game Over Modal if Player Lost */}
      {isGameOver && (
        <GameOverModal
          reason="starve"
          stageNumber={2}
          message={`30秒倒數結束！你的分數 (${playerScore}分) 未能超越對手 (${aiScore}分)，因為捕食不足餓死失敗了！`}
          onRetry={resetGame}
          onRestartAll={onRestartAll}
          onHome={onHome}
        />
      )}
    </div>
  );
};

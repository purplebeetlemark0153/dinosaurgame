import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TRexAvatar, CompsognathusAvatar } from './DinosaurAvatars';
import { GameOverModal } from './GameOverModal';
import { sound } from '../utils/audio';
import { Timer, Sparkles, Target } from 'lucide-react';

interface Stage4GameProps {
  onStagePass: () => void;
  onRestartAll?: () => void;
  onHome: () => void;
}

interface CompyItem {
  id: number;
  x: number;
  y: number;
  spawnLocation: 'bush' | 'rock' | 'edge';
  spawnTime: number;
  duration: number; // how long it stays visible before darting away
  facingLeft: boolean;
}

interface BushOrRock {
  id: number;
  x: number;
  y: number;
  type: 'bush' | 'rock';
  size: number;
}

export const Stage4Game: React.FC<Stage4GameProps> = ({ onStagePass, onRestartAll, onHome }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scenery items (雜草叢與石堆)
  const [scenery] = useState<BushOrRock[]>([
    { id: 1, x: 18, y: 30, type: 'bush', size: 28 },
    { id: 2, x: 80, y: 25, type: 'rock', size: 30 },
    { id: 3, x: 30, y: 70, type: 'rock', size: 34 },
    { id: 4, x: 75, y: 75, type: 'bush', size: 32 },
    { id: 5, x: 50, y: 45, type: 'bush', size: 26 },
    { id: 6, x: 10, y: 80, type: 'bush', size: 24 },
    { id: 7, x: 90, y: 50, type: 'rock', size: 28 },
  ]);

  // Player state
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const playerPosRef = useRef({ x: 50, y: 50 });
  const targetPosRef = useRef({ x: 50, y: 50 });
  const compysRef = useRef<CompyItem[]>([]);
  const [facingLeft, setFacingLeft] = useState(false);
  const [isBiting, setIsBiting] = useState(false);

  // Game state
  const [caughtCount, setCaughtCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [compys, setCompys] = useState<CompyItem[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const caughtCountRef = useRef(0);
  caughtCountRef.current = caughtCount;
  compysRef.current = compys;
  const caughtIdsRef = useRef<Set<number>>(new Set());

  // Floating text feedback
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  const addFloatingText = (text: string, x: number, y: number) => {
    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id, text, x, y }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 850);
  };

  // Helper to trigger bite and catch (guaranteed single count per catch)
  const attemptCatch = useCallback((pos: { x: number; y: number }) => {
    const biteRadius = 13.5; // Predator bite radius
    const currentCompys = compysRef.current;

    // Find the first uncaught Compy within bite radius
    const targetCompy = currentCompys.find((compy) => {
      if (caughtIdsRef.current.has(compy.id)) return false;
      const dx = Math.abs(compy.x - pos.x);
      const dy = Math.abs(compy.y - pos.y);
      return Math.hypot(dx, dy) < biteRadius;
    });

    if (targetCompy) {
      // Mark as caught so it can NEVER be caught a second time
      caughtIdsRef.current.add(targetCompy.id);

      // Remove from active compys list
      setCompys((prev) => prev.filter((c) => c.id !== targetCompy.id));

      // Visual and audio effects
      sound.playTRexCatch();
      setIsBiting(true);
      setTimeout(() => setIsBiting(false), 250);

      // Increment count exactly once
      setCaughtCount((c) => {
        const newCount = c + 1;
        caughtCountRef.current = newCount;
        addFloatingText(`捕獲美頜龍! (${newCount}/20)`, targetCompy.x, targetCompy.y);
        if (newCount >= 20) {
          sound.playWin();
          onStagePass();
        }
        return newCount;
      });
    }
  }, [onStagePass]);

  const resetGame = useCallback(() => {
    setPlayerPos({ x: 50, y: 50 });
    setTargetPos({ x: 50, y: 50 });
    playerPosRef.current = { x: 50, y: 50 };
    targetPosRef.current = { x: 50, y: 50 };
    setCaughtCount(0);
    caughtCountRef.current = 0;
    caughtIdsRef.current.clear();
    setTimeLeft(30);
    setCompys([]);
    compysRef.current = [];
    setIsGameOver(false);
  }, []);

  // Update T-Rex Target Position
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (isGameOver || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 8), 92);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 10), 90);

    targetPosRef.current = { x, y };
    setTargetPos({ x, y });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // T-Rex Weight & Smooth Hunting Movement (霸王龍移動速度再慢一點點，展現龐大頂級掠食者的厚重追擊感)
  useEffect(() => {
    if (isGameOver) return;

    const moveLoop = setInterval(() => {
      const target = targetPosRef.current;
      const prev = playerPosRef.current;
      const dx = target.x - prev.x;
      const dy = target.y - prev.y;

      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return;

      if (dx < -0.4) setFacingLeft(true);
      else if (dx > 0.4) setFacingLeft(false);

      // Heavy predator inertia factor ~0.105 for slower, authoritative deliberate movement
      const nextPos = {
        x: prev.x + dx * 0.105,
        y: prev.y + dy * 0.105,
      };

      playerPosRef.current = nextPos;
      setPlayerPos(nextPos);

      // Check collision on movement step
      attemptCatch(nextPos);
    }, 35);

    return () => clearInterval(moveLoop);
  }, [isGameOver, attemptCatch]);

  // Spawn Compsognathus with even lower frequency (間隔拉長至 1200ms)
  useEffect(() => {
    if (isGameOver) return;

    const spawnInterval = setInterval(() => {
      if (compysRef.current.length >= 4) return;

      // Spawn near a fern bush, rock pile, or screen edge
      const rand = Math.random();
      let spawnX = 50;
      let spawnY = 50;
      let locType: 'bush' | 'rock' | 'edge' = 'bush';

      if (rand < 0.45) {
        // Spawn near a fern bush
        const bushes = scenery.filter((s) => s.type === 'bush');
        const chosen = bushes[Math.floor(Math.random() * bushes.length)];
        spawnX = chosen.x + (Math.random() * 14 - 7);
        spawnY = chosen.y + (Math.random() * 14 - 7);
        locType = 'bush';
      } else if (rand < 0.8) {
        // Spawn near a rock pile
        const rocks = scenery.filter((s) => s.type === 'rock');
        const chosen = rocks[Math.floor(Math.random() * rocks.length)];
        spawnX = chosen.x + (Math.random() * 14 - 7);
        spawnY = chosen.y + (Math.random() * 14 - 7);
        locType = 'rock';
      } else {
        // Spawn along screen edges
        locType = 'edge';
        if (Math.random() > 0.5) {
          spawnX = Math.random() > 0.5 ? 8 : 92;
          spawnY = Math.floor(Math.random() * 70) + 15;
        } else {
          spawnX = Math.floor(Math.random() * 80) + 10;
          spawnY = Math.random() > 0.5 ? 12 : 88;
        }
      }

      const newCompy: CompyItem = {
        id: Date.now() + Math.random(),
        x: Math.min(Math.max(spawnX, 6), 94),
        y: Math.min(Math.max(spawnY, 12), 88),
        spawnLocation: locType,
        spawnTime: Date.now(),
        duration: Math.floor(Math.random() * 800) + 2100, // stays 2.1s - 2.9s
        facingLeft: Math.random() > 0.5,
      };

      setCompys((prev) => [...prev, newCompy]);
    }, 850); // Balanced spawn frequency so catching 20 is achievable in 30s

    return () => clearInterval(spawnInterval);
  }, [isGameOver, scenery]);

  // Game Timer (30s) & Win / Fail check (Goal: 20 Compsognathus)
  useEffect(() => {
    if (isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          // Goal check: >= 20 compsognathus caught as requested!
          if (caughtCountRef.current >= 20) {
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

    return () => clearInterval(timer);
  }, [isGameOver, onStagePass]);

  // Main Loop (Compy Despawn & Collision Detection)
  useEffect(() => {
    if (isGameOver) return;

    const gameLoop = setInterval(() => {
      const now = Date.now();
      // Remove expired compys
      setCompys((prev) => prev.filter((compy) => now - compy.spawnTime < compy.duration));

      const pPos = playerPosRef.current;
      attemptCatch(pPos);
    }, 50);

    return () => clearInterval(gameLoop);
  }, [isGameOver, attemptCatch]);

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      className="relative w-full h-full min-h-[580px] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#2E1A14] via-[#45281F] to-[#1E110C] select-none cursor-crosshair touch-none"
    >
      {/* Prehistoric Earthy Mud Ground Terrain (泥土地質感與恐龍足跡) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg viewBox="0 0 1000 700" preserveAspectRatio="none" className="w-full h-full opacity-90">
          <defs>
            <radialGradient id="mudPuddle1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#140B07" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#2A170E" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#45281F" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="mudPuddle2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#100805" stopOpacity="0.95" />
              <stop offset="65%" stopColor="#22130C" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#45281F" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="horizonGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7C2D12" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#451A03" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1E110C" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="fernBgGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#14532D" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Distant volcanic glow at the horizon */}
          <rect x="0" y="0" width="1000" height="240" fill="url(#horizonGlow)" />

          {/* Distant Cretaceous ridges */}
          <path d="M 0 180 Q 250 120 500 160 T 1000 130 L 1000 280 L 0 280 Z" fill="#241209" opacity="0.8" />
          <path d="M 0 220 Q 300 170 650 210 T 1000 180 L 1000 320 L 0 320 Z" fill="#1C0E07" opacity="0.9" />

          {/* Mud Puddles and Soil Depressions */}
          <ellipse cx="220" cy="260" rx="140" ry="70" fill="url(#mudPuddle1)" />
          <ellipse cx="750" cy="450" rx="180" ry="85" fill="url(#mudPuddle2)" />
          <ellipse cx="440" cy="580" rx="130" ry="60" fill="url(#mudPuddle1)" />
          <ellipse cx="820" cy="240" rx="110" ry="50" fill="url(#mudPuddle2)" />
          <ellipse cx="140" cy="520" rx="100" ry="50" fill="url(#mudPuddle1)" />

          {/* Prehistoric Earth Ground Cracks (大地乾裂紋) */}
          <path d="M 120 320 L 180 360 L 210 330 L 270 380 L 310 370" stroke="#0D0604" strokeWidth="3.5" fill="none" opacity="0.75" />
          <path d="M 180 360 L 170 410 L 200 430" stroke="#0D0604" strokeWidth="2.5" fill="none" opacity="0.65" />
          <path d="M 720 180 L 760 220 L 810 210 L 860 260" stroke="#0D0604" strokeWidth="3" fill="none" opacity="0.75" />
          <path d="M 480 430 L 520 480 L 500 520 L 560 550" stroke="#0D0604" strokeWidth="3.2" fill="none" opacity="0.75" />
          <path d="M 520 480 L 560 470 L 590 500" stroke="#0D0604" strokeWidth="2" fill="none" opacity="0.65" />

          {/* Large Fossil Dinosaur Footprints in Mud (深印的霸王龍巨型足印) */}
          <g transform="translate(240, 380) rotate(-20) scale(0.95)" opacity="0.7" fill="#0A0503">
            <polygon points="26,12 33,0 40,12 35,38 27,38" />
            <polygon points="16,18 7,10 20,28" />
            <polygon points="50,18 59,10 46,28" />
          </g>
          <g transform="translate(680, 320) rotate(15) scale(1.1)" opacity="0.7" fill="#0A0503">
            <polygon points="26,12 33,0 40,12 35,38 27,38" />
            <polygon points="16,18 7,10 20,28" />
            <polygon points="50,18 59,10 46,28" />
          </g>
          <g transform="translate(480, 200) rotate(-10) scale(0.8)" opacity="0.6" fill="#0A0503">
            <polygon points="26,12 33,0 40,12 35,38 27,38" />
            <polygon points="16,18 7,10 20,28" />
            <polygon points="50,18 59,10 46,28" />
          </g>
          <g transform="translate(360, 560) rotate(25) scale(1.0)" opacity="0.65" fill="#0A0503">
            <polygon points="26,12 33,0 40,12 35,38 27,38" />
            <polygon points="16,18 7,10 20,28" />
            <polygon points="50,18 59,10 46,28" />
          </g>

          {/* Distant ancient giant ferns silhouette on left & right */}
          <path d="M 0 300 Q 80 260 140 310 Q 70 320 0 350 Z" fill="url(#fernBgGrad)" />
          <path d="M 0 340 Q 90 310 160 360 Q 80 370 0 400 Z" fill="url(#fernBgGrad)" />
          <path d="M 1000 280 Q 920 240 860 290 Q 930 300 1000 330 Z" fill="url(#fernBgGrad)" />
          <path d="M 1000 330 Q 910 290 840 340 Q 920 350 1000 380 Z" fill="url(#fernBgGrad)" />
        </svg>
      </div>

      {/* Top HUD */}
      <div className="w-full p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 z-20 bg-[#FAF3E0]/95 backdrop-blur-md border-b-2 border-[#D9B99B] text-[#4A3728] shadow-sm">
        {/* Caught Target Count */}
        <div className="flex items-center gap-2 bg-[#8B9A46]/20 border-2 border-[#6E7B36] px-3.5 py-1 rounded-full shadow-sm">
          <Target className="w-4 h-4 text-[#6E7B36]" />
          <span className="text-xs font-black text-[#6E7B36]">美頜龍捕獲數：</span>
          <span className={`text-lg font-black font-mono ${caughtCount >= 20 ? 'text-[#E67E22] animate-pulse' : 'text-[#4A3728]'}`}>
            {caughtCount} / 20 隻
          </span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 bg-white border-2 border-[#E67E22] px-4 py-1 rounded-full shadow-sm">
          <Timer className="w-4 h-4 text-[#E67E22] animate-spin" />
          <span className="text-base font-black text-[#E67E22] font-mono">{timeLeft}s</span>
        </div>

        {/* Goal Indicator */}
        <div className="bg-white/85 border-2 border-[#D9B99B] px-3.5 py-1 rounded-full text-xs font-bold text-[#5D4E42] shadow-sm">
          目標：30秒內抓滿 20 隻
        </div>
      </div>

      {/* Game Hunting Field */}
      <div className="relative flex-1 w-full h-full">
        {/* Hint banner */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[#5D4E42] font-medium text-[11px] pointer-events-none bg-white/90 px-3.5 py-1 rounded-full border-2 border-[#D9B99B] shadow-sm">
          泥土地中伏擊！霸王龍請迅速捕捉在蕨類草叢與石堆間穿梭的美頜龍！
        </div>

        {/* Static Scenery: Prehistoric Fern Bushes (蕨類植物草叢) & Rock Piles (石堆) */}
        {scenery.map((item) => (
          <div
            key={item.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.type === 'bush' ? (
              // Mesozoic Prehistoric Fern Fronds Bush (蕨類植物草叢)
              <div className="relative flex items-center justify-center opacity-95 drop-shadow-lg">
                <svg viewBox="0 0 120 90" className="w-22 h-18 sm:w-26 sm:h-22">
                  <defs>
                    <linearGradient id="fernGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#14532D" />
                      <stop offset="100%" stopColor="#22C55E" />
                    </linearGradient>
                    <linearGradient id="fernGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#166534" />
                      <stop offset="100%" stopColor="#4ADE80" />
                    </linearGradient>
                  </defs>

                  {/* Left Fern Frond with pinnate leaflets */}
                  <path d="M 60 85 Q 35 60 15 35 Q 28 45 42 62 Q 52 75 60 85 Z" fill="url(#fernGrad1)" />
                  <path d="M 28 50 Q 15 45 8 40 Q 20 48 32 55 Z" fill="#22C55E" />
                  <path d="M 38 60 Q 25 58 18 52 Q 30 60 42 66 Z" fill="#15803D" />

                  {/* Center Main Arching Fern Frond */}
                  <path d="M 60 85 Q 60 40 50 10 Q 70 35 68 65 Q 65 78 60 85 Z" fill="url(#fernGrad2)" />
                  <path d="M 54 28 Q 42 22 35 18 Q 48 26 56 32 Z" fill="#4ADE80" />
                  <path d="M 62 30 Q 75 24 82 20 Q 70 28 60 35 Z" fill="#22C55E" />
                  <path d="M 56 45 Q 40 40 30 36 Q 46 44 58 50 Z" fill="#166534" />
                  <path d="M 64 48 Q 80 44 90 40 Q 74 48 62 55 Z" fill="#15803D" />

                  {/* Right Arching Fern Frond */}
                  <path d="M 60 85 Q 85 60 105 35 Q 92 45 78 62 Q 68 75 60 85 Z" fill="url(#fernGrad1)" />
                  <path d="M 92 50 Q 105 45 112 40 Q 100 48 88 55 Z" fill="#22C55E" />
                  <path d="M 82 60 Q 95 58 102 52 Q 90 60 78 66 Z" fill="#15803D" />

                  {/* Low spreading fern foliage */}
                  <path d="M 60 85 Q 30 75 10 70 Q 35 80 60 85 Z" fill="#14532D" />
                  <path d="M 60 85 Q 90 75 110 70 Q 85 80 60 85 Z" fill="#14532D" />
                </svg>
              </div>
            ) : (
              // Rugged Prehistoric Muddy Rock Pile
              <div className="relative flex items-center justify-center opacity-90 drop-shadow-lg">
                <svg viewBox="0 0 100 70" className="w-20 h-14 sm:w-24 sm:h-16">
                  <polygon points="10,65 35,20 60,65" fill="#57534E" stroke="#292524" strokeWidth="2" />
                  <polygon points="45,65 70,10 95,65" fill="#78716C" stroke="#292524" strokeWidth="2" />
                  <polygon points="25,65 50,35 75,65" fill="#44403C" stroke="#1C1917" strokeWidth="2" />
                </svg>
              </div>
            )}
          </div>
        ))}

        {/* Compsognathus (美頜龍) Spawning & Flashing in/out */}
        {compys.map((compy) => (
          <div
            key={compy.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-15 transition-transform animate-pulse"
            style={{
              left: `${compy.x}%`,
              top: `${compy.y}%`,
              transform: `translate(-50%, -50%) ${compy.facingLeft ? 'scaleX(-1)' : 'scaleX(1)'}`,
            }}
          >
            <div className="relative">
              {/* Alert flash ring */}
              <div className="absolute -top-3 -right-2 text-xs font-black text-amber-300 animate-bounce bg-black/60 px-1 rounded-full border border-amber-400">
                ⚡快抓!
              </div>
              <div className="w-16 h-12 sm:w-20 sm:h-14 filter drop-shadow-[0_0_12px_rgba(74,222,128,1)] bg-emerald-950/40 rounded-full p-1 border border-emerald-400/50">
                <CompsognathusAvatar />
              </div>
            </div>
          </div>
        ))}

        {/* Floating Feedback Text */}
        {floatingTexts.map((item) => (
          <div
            key={item.id}
            className="absolute font-black text-base text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)] pointer-events-none animate-bounce -translate-x-1/2 -translate-y-full z-30"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.text}
          </div>
        ))}

        {/* Player: T-Rex (霸王龍) */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-25 transition-all duration-75"
          style={{
            left: `${playerPos.x}%`,
            top: `${playerPos.y}%`,
            transform: `translate(-50%, -50%) ${facingLeft ? 'scaleX(-1)' : 'scaleX(1)'}`,
          }}
        >
          <div className="w-32 h-26 sm:w-36 sm:h-30 filter drop-shadow-[0_0_15px_rgba(217,119,6,0.85)]">
            <TRexAvatar isBiting={isBiting} />
          </div>
          <div className="text-center text-[10px] font-bold text-amber-300 bg-black/60 px-1.5 py-0.5 rounded-full -mt-2">
            霸王龍 (T-Rex)
          </div>
        </div>
      </div>

      {/* Game Over Modal if Player Lost */}
      {isGameOver && (
        <GameOverModal
          reason="starve"
          stageNumber={4}
          message={`30秒時間到！你僅捕捉到 ${caughtCount} 隻美頜龍（目標需 20 隻），因掠食不足霸王龍餓死失敗了！`}
          onRetry={resetGame}
          onRestartAll={onRestartAll}
          onHome={onHome}
        />
      )}
    </div>
  );
};

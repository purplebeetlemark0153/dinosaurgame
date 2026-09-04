import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stage3Character } from '../types';
import { ElasmosaurusAvatar, MosasaurusAvatar } from './DinosaurAvatars';
import { CoelacanthAvatar, AmmoniteAvatar, SquidAvatar } from './PreyAvatars';
import { GameOverModal } from './GameOverModal';
import { sound } from '../utils/audio';
import { Timer, Bot, User, Waves } from 'lucide-react';

interface Stage3GameProps {
  playerCharacter: Stage3Character;
  onStagePass: () => void;
  onRestartAll?: () => void;
  onHome: () => void;
}

interface MarinePrey {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'fish' | 'ammonite' | 'squid' | 'trilobite';
  points: number;
  name: string;
  emoji: string;
}

export const Stage3Game: React.FC<Stage3GameProps> = ({ playerCharacter, onStagePass, onRestartAll, onHome }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const aiCharacter: Stage3Character = playerCharacter === 'elasmosaurus' ? 'mosasaurus' : 'elasmosaurus';

  // Stats definition based on prompt requirements:
  // Elasmosaurus (薄板龍): significantly larger contact radius with extra long neck (hitbox ~ 16.0%), slower movement speed (inertia factor 0.085)
  // Mosasaurus (滄龍): smaller contact radius (hitbox ~ 10.0%), faster movement speed (inertia factor 0.17)
  const playerIsElasmo = playerCharacter === 'elasmosaurus';
  const playerHitbox = playerIsElasmo ? 16.0 : 10.0;
  const playerInertia = playerIsElasmo ? 0.085 : 0.17; // Water pressure drag delay

  const aiIsElasmo = aiCharacter === 'elasmosaurus';
  const aiHitbox = aiIsElasmo ? 16.0 : 10.0;
  const aiSpeed = aiIsElasmo ? 0.8 : 1.35;

  // State
  const [targetPos, setTargetPos] = useState({ x: 30, y: 50 });
  const [playerPos, setPlayerPos] = useState({ x: 30, y: 50 });
  const [aiPos, setAiPos] = useState({ x: 70, y: 50 });
  const targetPosRef = useRef({ x: 30, y: 50 });
  const playerPosRef = useRef({ x: 30, y: 50 });
  const aiPosRef = useRef({ x: 70, y: 50 });
  const preysRef = useRef<MarinePrey[]>([]);

  const [playerFacingLeft, setPlayerFacingLeft] = useState(false);
  const [aiFacingLeft, setAiFacingLeft] = useState(true);

  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [preys, setPreys] = useState<MarinePrey[]>([]);
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

  const resetGame = useCallback(() => {
    setPlayerPos({ x: 30, y: 50 });
    setTargetPos({ x: 30, y: 50 });
    setAiPos({ x: 70, y: 50 });
    targetPosRef.current = { x: 30, y: 50 };
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

  // Pointer move updates targetPos; actual position glides with water resistance
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (isGameOver || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 5), 95);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 5), 95);
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

  // Spawn Marine Prey
  useEffect(() => {
    if (isGameOver) return;

    const spawnInterval = setInterval(() => {
      if (preysRef.current.length >= 8) return;

      const rand = Math.random();
      let type: 'fish' | 'ammonite' | 'squid' | 'trilobite' = 'fish';
      let points = 10;
      let name = '遠古腔棘魚';
      let emoji = '🐟';

      if (rand > 0.75) {
        type = 'squid';
        points = 30;
        name = '遠古箭石墨魚';
        emoji = '🦑';
      } else if (rand > 0.5) {
        type = 'ammonite';
        points = 20;
        name = '螺旋菊石';
        emoji = '🐚';
      } else if (rand > 0.3) {
        type = 'trilobite';
        points = 15;
        name = '深海三葉蟲';
        emoji = '🦐';
      }

      const newPrey: MarinePrey = {
        id: Date.now() + Math.random(),
        x: Math.random() > 0.5 ? 5 : 95,
        y: Math.floor(Math.random() * 70) + 15,
        vx: (Math.random() * 0.5 + 0.2) * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() * 0.4 - 0.2),
        type,
        points,
        name,
        emoji,
      };

      setPreys((prev) => [...prev, newPrey]);
    }, 850);

    return () => clearInterval(spawnInterval);
  }, [isGameOver]);

  // Game Countdown Timer (30s)
  useEffect(() => {
    if (isGameOver) return;

    const gameTimer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(gameTimer);
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

  // Underwater Physics & Drag Loop (every 40ms) - continuous stable tick
  useEffect(() => {
    if (isGameOver) return;

    const physicsLoop = setInterval(() => {
      // 1. Water Resistance / Inertial Glide towards targetPosRef
      const target = targetPosRef.current;
      const currentPos = playerPosRef.current;
      const dx = target.x - currentPos.x;
      const dy = target.y - currentPos.y;
      const newX = currentPos.x + dx * playerInertia;
      const newY = currentPos.y + dy * playerInertia;

      if (dx < -0.4) setPlayerFacingLeft(true);
      else if (dx > 0.4) setPlayerFacingLeft(false);

      playerPosRef.current = { x: newX, y: newY };
      setPlayerPos({ x: newX, y: newY });

      // 2. Move Marine Prey
      setPreys((prev) =>
        prev.map((p) => {
          let nextX = p.x + p.vx;
          let nextY = p.y + p.vy;
          let nextVx = p.vx;
          let nextVy = p.vy;

          if (nextX <= 4 || nextX >= 96) nextVx *= -1;
          if (nextY <= 12 || nextY >= 88) nextVy *= -1;

          return { ...p, x: nextX, y: nextY, vx: nextVx, vy: nextVy };
        })
      );

      // 3. AI Oceanic Competitor Logic
      const currentPreys = preysRef.current;
      const currentAi = aiPosRef.current;

      if (currentPreys.length > 0) {
        let closestPrey: MarinePrey | null = null;
        let minDist = 99999;
        currentPreys.forEach((p) => {
          const dist = Math.hypot(p.x - currentAi.x, p.y - currentAi.y);
          if (dist < minDist) {
            minDist = dist;
            closestPrey = p;
          }
        });

        if (closestPrey) {
          const targetPrey = closestPrey as MarinePrey;
          const aiDx = targetPrey.x - currentAi.x;
          const aiDy = targetPrey.y - currentAi.y;
          const angle = Math.atan2(aiDy, aiDx);

          const newAiX = currentAi.x + Math.cos(angle) * aiSpeed;
          const newAiY = currentAi.y + Math.sin(angle) * aiSpeed;

          if (newAiX < currentAi.x) setAiFacingLeft(true);
          else if (newAiX > currentAi.x) setAiFacingLeft(false);

          aiPosRef.current = { x: newAiX, y: newAiY };
          setAiPos({ x: newAiX, y: newAiY });
        }
      }

      // 4. Collision Detection using respective hitboxes
      const pPos = playerPosRef.current;
      const aPos = aiPosRef.current;

      setPreys((latestPreys) => {
        const remaining: MarinePrey[] = [];

        latestPreys.forEach((prey) => {
          const playerDist = Math.hypot(prey.x - pPos.x, prey.y - pPos.y);
          const aiDist = Math.hypot(prey.x - aPos.x, prey.y - aPos.y);

          if (playerDist < playerHitbox) {
            sound.playWaterSplash();
            setPlayerScore((s) => s + prey.points);
            addFloatingText(`+${prey.points}`, prey.x, prey.y, true);
          } else if (aiDist < aiHitbox) {
            setAiScore((s) => s + prey.points);
            addFloatingText(`+${prey.points}`, prey.x, prey.y, false);
          } else {
            remaining.push(prey);
          }
        });

        return remaining;
      });
    }, 40);

    return () => clearInterval(physicsLoop);
  }, [isGameOver, playerInertia, playerHitbox, aiHitbox, aiSpeed]);

  const renderDinoAvatar = (char: Stage3Character) => {
    if (char === 'elasmosaurus') return <ElasmosaurusAvatar />;
    return <MosasaurusAvatar />;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      className="relative w-full h-full min-h-[580px] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-cyan-900 via-teal-950 to-blue-950 select-none cursor-crosshair touch-none"
    >
      {/* Ocean Underwater Ambient Waves & Rising Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Underwater light rays */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent" />

        {/* Ambient rising bubble streams */}
        <div className="absolute bottom-[-20px] left-[10%] w-4 h-4 rounded-full border border-cyan-300/60 bg-cyan-200/20 animate-bounce" style={{ animationDuration: '3.5s' }} />
        <div className="absolute bottom-[-10px] left-[22%] w-6 h-6 rounded-full border border-cyan-200/70 bg-cyan-100/30 animate-pulse" style={{ animationDuration: '2.8s' }} />
        <div className="absolute bottom-[-15px] left-[45%] w-3 h-3 rounded-full border border-cyan-300/50 bg-cyan-200/20 animate-bounce" style={{ animationDuration: '4.2s' }} />
        <div className="absolute bottom-[-20px] left-[68%] w-5 h-5 rounded-full border border-cyan-200/60 bg-cyan-200/30 animate-pulse" style={{ animationDuration: '3.1s' }} />
        <div className="absolute bottom-[-12px] left-[85%] w-4 h-4 rounded-full border border-cyan-300/70 bg-cyan-100/25 animate-bounce" style={{ animationDuration: '2.5s' }} />

        {/* Floating Bubble Clusters */}
        <div className="absolute top-1/4 left-8 text-cyan-200 text-xl animate-pulse">🫧</div>
        <div className="absolute top-1/2 right-14 text-cyan-200 text-lg animate-bounce">🫧</div>
        <div className="absolute top-2/3 left-1/3 text-cyan-300 text-2xl animate-pulse">🫧</div>
        <div className="absolute bottom-12 right-1/4 text-cyan-200 text-sm animate-bounce">🫧</div>
      </div>

      {/* Top HUD: Time & Scores */}
      <div className="w-full p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 z-20 bg-[#FAF3E0]/95 backdrop-blur-md border-b-2 border-[#D9B99B] text-[#4A3728] shadow-sm">
        {/* Player Score */}
        <div className="flex items-center gap-2 bg-[#8B9A46]/20 border-2 border-[#6E7B36] px-3.5 py-1 rounded-full shadow-sm">
          <User className="w-4 h-4 text-[#6E7B36]" />
          <span className="text-xs font-black text-[#6E7B36]">
            玩家 ({playerCharacter === 'elasmosaurus' ? '薄板龍' : '滄龍'}):
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
            對手 ({aiCharacter === 'elasmosaurus' ? '薄板龍' : '滄龍'}):
          </span>
          <span className="text-lg font-black text-[#5D4E42] font-mono">{aiScore}</span>
        </div>
      </div>

      {/* Ocean Play Area */}
      <div className="relative flex-1 w-full h-full">
        {/* Characteristics Water Resistance Badge */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[#4A3728] text-[11px] font-medium pointer-events-none bg-white/90 px-3.5 py-1 rounded-full border-2 border-[#D9B99B] flex items-center gap-1.5 shadow-sm">
          <Waves className="w-3.5 h-3.5 text-[#395B64] animate-pulse" />
          <span>深海水壓阻力特性：{playerIsElasmo ? '薄板龍體型龐大、範圍廣' : '滄龍身軀精悍、游動迅捷'}</span>
        </div>

        {/* Marine Preys (Vector SVG with high-contrast glowing pod) */}
        {preys.map((prey) => (
          <div
            key={prey.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
            style={{
              left: `${prey.x}%`,
              top: `${prey.y}%`,
            }}
          >
            <div className="relative bg-teal-950/70 backdrop-blur-md border-2 border-cyan-300 p-2 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)] flex items-center justify-center animate-pulse">
              {prey.type === 'coelacanth' || prey.type === 'fish' ? (
                <CoelacanthAvatar className="w-9 h-7" />
              ) : prey.type === 'ammonite' ? (
                <AmmoniteAvatar className="w-8 h-7" />
              ) : (
                <SquidAvatar className="w-8 h-7" />
              )}
              <span className="absolute -bottom-3 text-[9px] font-black bg-stone-900/95 text-cyan-300 px-1.5 py-0.2 rounded-full border border-cyan-400 shadow">
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
              item.isPlayer ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]' : 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.9)]'
            }`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.text}
          </div>
        ))}

        {/* Player Avatar */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
          style={{
            left: `${playerPos.x}%`,
            top: `${playerPos.y}%`,
            transform: `translate(-50%, -50%) ${playerFacingLeft ? 'scaleX(-1)' : 'scaleX(1)'}`,
          }}
        >
          <div className={playerIsElasmo ? "w-32 h-22 sm:w-36 sm:h-24 filter drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]" : "w-24 h-16 sm:w-28 sm:h-18 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]"}>
            {renderDinoAvatar(playerCharacter)}
          </div>
          <div className="text-center text-[10px] font-bold text-cyan-300 bg-black/60 px-1.5 py-0.5 rounded-full -mt-2">
            玩家 ({playerCharacter === 'elasmosaurus' ? '薄板龍' : '滄龍'})
          </div>
        </div>

        {/* AI Avatar */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
          style={{
            left: `${aiPos.x}%`,
            top: `${aiPos.y}%`,
            transform: `translate(-50%, -50%) ${aiFacingLeft ? 'scaleX(-1)' : 'scaleX(1)'}`,
          }}
        >
          <div className={aiIsElasmo ? "w-32 h-22 sm:w-36 sm:h-24 filter drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" : "w-24 h-16 sm:w-28 sm:h-18 filter drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]"}>
            {renderDinoAvatar(aiCharacter)}
          </div>
          <div className="text-center text-[10px] font-bold text-rose-300 bg-black/60 px-1.5 py-0.5 rounded-full -mt-2">
            電腦對手 ({aiCharacter === 'elasmosaurus' ? '薄板龍' : '滄龍'})
          </div>
        </div>
      </div>

      {/* Game Over Modal if Player Lost */}
      {isGameOver && (
        <GameOverModal
          reason="starve"
          stageNumber={3}
          message={`深海競爭結束！你的分數 (${playerScore}分) 未能超越對手 (${aiScore}分)，在水壓與食物匱乏中餓死失敗了！`}
          onRetry={resetGame}
          onRestartAll={onRestartAll}
          onHome={onHome}
        />
      )}
    </div>
  );
};

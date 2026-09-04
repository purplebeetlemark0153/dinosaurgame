import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MicroraptorAvatar } from './DinosaurAvatars';
import { GameOverModal } from './GameOverModal';
import { sound } from '../utils/audio';
import { Flame, Snowflake, Timer, Sparkles } from 'lucide-react';

interface Stage1GameProps {
  onStagePass: () => void;
  onRestartAll?: () => void;
  onHome: () => void;
}

interface FeatherItem {
  id: number;
  x: number;
  y: number;
  type: 'warm' | 'golden';
  value: number;
  opacity: number;
  lifetime: number; // in ms
  createdAt: number;
}

export const Stage1Game: React.FC<Stage1GameProps> = ({ onStagePass, onRestartAll, onHome }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Game State: 30 seconds fixed countdown
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 }); // percentage
  const [temperature, setTemperature] = useState(75); // 0 to 100 (starts at 75%)
  const [timeLeft, setTimeLeft] = useState(30.0); // Exactly 30.0 seconds fixed countdown
  const [feathers, setFeathers] = useState<FeatherItem[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [collectedCount, setCollectedCount] = useState(0);
  const [gliding, setGliding] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);

  // Position and state refs to decouple timer/loop from state updates
  const playerPosRef = useRef({ x: 50, y: 50 });
  const startTimeRef = useRef<number>(Date.now());
  const isGameOverRef = useRef<boolean>(false);
  isGameOverRef.current = isGameOver;

  // Floating score text feedback
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  // Sound and particles
  const addFloatingText = (text: string, x: number, y: number) => {
    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id, text, x, y }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 900);
  };

  // Reset Game
  const resetGame = useCallback(() => {
    playerPosRef.current = { x: 50, y: 50 };
    setPlayerPos({ x: 50, y: 50 });
    setTemperature(75);
    setTimeLeft(30.0);
    startTimeRef.current = Date.now();
    isGameOverRef.current = false;
    setFeathers([]);
    setIsGameOver(false);
    setCollectedCount(0);
  }, []);

  // Update Player Position from Pointer / Touch
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (isGameOver || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 5), 95);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 5), 95);

    if (x < playerPosRef.current.x - 0.2) setFacingLeft(true);
    else if (x > playerPosRef.current.x + 0.2) setFacingLeft(false);

    playerPosRef.current = { x, y };
    setPlayerPos({ x, y });
    setGliding(true);
  };

  // Touch Move / Mouse Move Listeners
  const onMouseMove = (e: React.MouseEvent) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Initialize start time on mount
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  // Spawn Feathers that flash and disappear
  useEffect(() => {
    if (isGameOver) return;

    const spawnInterval = setInterval(() => {
      if (feathers.length >= 8) return;

      const isGolden = Math.random() > 0.8;
      const newFeather: FeatherItem = {
        id: Date.now() + Math.random(),
        x: Math.floor(Math.random() * 82) + 9,
        y: Math.floor(Math.random() * 70) + 16,
        type: isGolden ? 'golden' : 'warm',
        value: isGolden ? 7 : 4,
        opacity: 1,
        lifetime: isGolden ? 2200 : 1800,
        createdAt: Date.now(),
      };

      setFeathers((prev) => [...prev, newFeather]);
    }, 500);

    return () => clearInterval(spawnInterval);
  }, [feathers.length, isGameOver]);

  // Independent Main Game Loop (Fixed 30s Countdown, Temperature Decay, Collision Check, Feather expiration)
  useEffect(() => {
    if (isGameOver) return;

    const gameLoop = setInterval(() => {
      if (isGameOverRef.current) return;
      const now = Date.now();

      // 1. Independent & Fixed 30s Countdown using real-time delta
      const elapsed = (now - startTimeRef.current) / 1000;
      const remaining = Math.max(0, +(30.0 - elapsed).toFixed(1));
      setTimeLeft(remaining);

      // Win condition: Player successfully survived the full 30 seconds!
      if (remaining <= 0) {
        sound.playWin();
        clearInterval(gameLoop);
        onStagePass();
        return;
      }

      // 2. Clean expired feathers
      setFeathers((prev) => prev.filter((f) => now - f.createdAt < f.lifetime));

      // 3. Higher Temperature / Stamina Consumption (~15.6% per second; 0.78 per 50ms)
      setTemperature((prevTemp) => {
        const dropRate = 0.78;
        const newTemp = prevTemp - dropRate;
        if (newTemp <= 0) {
          // Freeze death failure before 30 seconds
          sound.playFail();
          setIsGameOver(true);
          isGameOverRef.current = true;
          return 0;
        }
        return newTemp;
      });

      // 4. Check Collision with Feathers using current playerPosRef (zero timer interference)
      const currentPos = playerPosRef.current;
      setFeathers((prevFeathers) => {
        const uncollected: FeatherItem[] = [];
        prevFeathers.forEach((feather) => {
          const dx = Math.abs(feather.x - currentPos.x);
          const dy = Math.abs(feather.y - currentPos.y);
          // Collision distance threshold (in percentage)
          if (dx < 7.5 && dy < 7.5) {
            // Collected! Replenish stamina/temperature
            sound.playFeatherCollect();
            setTemperature((t) => Math.min(100, t + feather.value));
            setCollectedCount((c) => c + 1);
            addFloatingText(`+${feather.value}% 體溫`, feather.x, feather.y);
          } else {
            uncollected.push(feather);
          }
        });
        return uncollected;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [isGameOver, onStagePass]);

  // Gliding decay
  useEffect(() => {
    const t = setTimeout(() => setGliding(false), 200);
    return () => clearTimeout(t);
  }, [playerPos]);

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      className="relative w-full h-full min-h-[580px] flex flex-col justify-between overflow-hidden bg-[#241A14] select-none cursor-crosshair touch-none"
    >
      {/* Prehistoric Primeval Ground Landscape with Abundant Ancient Ferns (恐龍時代蕨類地面背景) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Jurassic Forest Sky & Volcanic Haze */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C2818] via-[#2F291E] to-[#1E1712]" />

        {/* Scalable SVG Prehistoric Ground & Lush Ancient Fern Flora */}
        <svg
          viewBox="0 0 1000 650"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        >
          <defs>
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A3728" />
              <stop offset="40%" stopColor="#382A1E" />
              <stop offset="100%" stopColor="#1C140E" />
            </linearGradient>
            <linearGradient id="fernLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B9A46" />
              <stop offset="50%" stopColor="#5B702B" />
              <stop offset="100%" stopColor="#2E3B13" />
            </linearGradient>
            <linearGradient id="fernAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A3B18A" />
              <stop offset="70%" stopColor="#4F6D3A" />
              <stop offset="100%" stopColor="#24381C" />
            </linearGradient>
            <linearGradient id="cycadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#738B3C" />
              <stop offset="100%" stopColor="#1E2F13" />
            </linearGradient>
          </defs>

          {/* Distant Misty Mountain & Giant Prehistoric Conifers */}
          <polygon points="50,420 220,280 390,420" fill="#2F3E22" opacity="0.4" />
          <polygon points="350,440 540,260 730,440" fill="#28381E" opacity="0.45" />
          <polygon points="680,430 850,290 1020,430" fill="#223018" opacity="0.4" />

          {/* Ancient Primeval Earth & Rocky Terrain Ridges */}
          <path
            d="M 0 450 Q 200 410 450 440 T 800 420 T 1000 450 L 1000 650 L 0 650 Z"
            fill="url(#groundGrad)"
          />
          <path
            d="M 0 510 Q 300 470 600 520 T 1000 490 L 1000 650 L 0 650 Z"
            fill="#2B1F17"
            opacity="0.9"
          />

          {/* Mossy Prehistoric Rocks & Boulders */}
          <ellipse cx="280" cy="560" rx="90" ry="40" fill="#3D4A2D" />
          <ellipse cx="285" cy="555" rx="75" ry="30" fill="#4E5D39" />
          <ellipse cx="720" cy="580" rx="110" ry="45" fill="#382A1E" />
          <ellipse cx="725" cy="572" rx="95" ry="35" fill="#4F5E39" />

          {/* Large Left Tree-Fern (巨型古桫欏蕨類) */}
          <g id="left-tree-fern">
            {/* Trunk */}
            <path d="M 90 650 Q 105 500 120 370 Q 135 500 150 650 Z" fill="#2E2016" stroke="#1A120C" strokeWidth="3" />
            {/* Trunk fibrous textures */}
            <line x1="102" y1="620" x2="138" y2="615" stroke="#4A3728" strokeWidth="3" />
            <line x1="108" y1="560" x2="134" y2="555" stroke="#4A3728" strokeWidth="3" />
            <line x1="114" y1="490" x2="132" y2="486" stroke="#4A3728" strokeWidth="3" />
            <line x1="118" y1="420" x2="128" y2="416" stroke="#4A3728" strokeWidth="2.5" />

            {/* Arching Pinnate Fern Fronds (舒展的遠古羽狀蕨葉) */}
            {/* Frond 1 (Arching Left) */}
            <path d="M 120 370 Q 30 330 -40 380" fill="none" stroke="#2D3E14" strokeWidth="4" />
            <path d="M 120 370 Q 40 330 -30 380 Q 20 360 120 370 Z" fill="url(#fernLeafGrad)" />
            {/* Pinnules (小羽片) */}
            <path d="M 100 360 Q 85 320 70 335 Q 90 350 100 360 Z" fill="url(#fernAccentGrad)" />
            <path d="M 75 350 Q 55 315 40 330 Q 65 342 75 350 Z" fill="url(#fernAccentGrad)" />
            <path d="M 45 355 Q 25 325 10 340 Q 35 350 45 355 Z" fill="url(#fernAccentGrad)" />
            <path d="M 15 365 Q -5 340 -20 355 Q 5 365 15 365 Z" fill="url(#fernAccentGrad)" />

            {/* Frond 2 (Arching Right into screen) */}
            <path d="M 120 370 Q 220 310 310 360" fill="none" stroke="#2D3E14" strokeWidth="4" />
            <path d="M 120 370 Q 210 310 300 360 Q 220 345 120 370 Z" fill="url(#fernLeafGrad)" />
            <path d="M 140 360 Q 165 320 180 335 Q 160 350 140 360 Z" fill="url(#fernAccentGrad)" />
            <path d="M 175 348 Q 205 315 220 330 Q 195 342 175 348 Z" fill="url(#fernAccentGrad)" />
            <path d="M 215 345 Q 245 320 260 335 Q 235 345 215 345 Z" fill="url(#fernAccentGrad)" />
            <path d="M 255 350 Q 285 330 300 345 Q 275 355 255 350 Z" fill="url(#fernAccentGrad)" />

            {/* Frond 3 (High upward arch) */}
            <path d="M 120 370 Q 110 240 70 200" fill="none" stroke="#2D3E14" strokeWidth="3.5" />
            <path d="M 120 370 Q 115 240 75 200 Q 100 270 120 370 Z" fill="url(#fernLeafGrad)" />

            {/* Fiddlehead (Fern Crozier / 拳卷幼葉芽) */}
            <path d="M 120 370 Q 125 330 135 325 Q 145 320 140 335 Q 135 345 130 338" fill="none" stroke="#8B9A46" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          {/* Right Primeval Tree-Fern (右側古蕨林) */}
          <g id="right-tree-fern">
            {/* Trunk */}
            <path d="M 850 650 Q 870 510 885 390 Q 900 510 920 650 Z" fill="#2E2016" stroke="#1A120C" strokeWidth="3" />
            <line x1="860" y1="610" x2="905" y2="605" stroke="#4A3728" strokeWidth="3" />
            <line x1="868" y1="530" x2="900" y2="526" stroke="#4A3728" strokeWidth="3" />

            {/* Frond Leftward */}
            <path d="M 885 390 Q 770 330 680 390" fill="none" stroke="#2D3E14" strokeWidth="4" />
            <path d="M 885 390 Q 780 330 690 390 Q 770 370 885 390 Z" fill="url(#fernLeafGrad)" />
            <path d="M 860 378 Q 830 335 815 350 Q 840 368 860 378 Z" fill="url(#fernAccentGrad)" />
            <path d="M 820 365 Q 790 330 775 345 Q 800 360 820 365 Z" fill="url(#fernAccentGrad)" />
            <path d="M 770 365 Q 740 335 725 350 Q 750 365 770 365 Z" fill="url(#fernAccentGrad)" />

            {/* Frond Rightward */}
            <path d="M 885 390 Q 980 330 1060 375" fill="none" stroke="#2D3E14" strokeWidth="4" />
            <path d="M 885 390 Q 975 335 1050 375 Q 965 370 885 390 Z" fill="url(#fernLeafGrad)" />
          </g>

          {/* Foreground Ground Ferns & Cycads (地面茂密叢生的小型蕨類、蘇鐵) */}
          {/* Ground Fern Cluster 1 (Left-Center) */}
          <g transform="translate(180, 480)">
            <path d="M 0 80 Q -30 20 -80 30 Q -30 40 0 80 Z" fill="url(#cycadGrad)" />
            <path d="M 0 80 Q -10 0 -40 -10 Q -5 20 0 80 Z" fill="url(#fernLeafGrad)" />
            <path d="M 0 80 Q 20 -10 50 10 Q 25 35 0 80 Z" fill="url(#cycadGrad)" />
            <path d="M 0 80 Q 40 20 90 40 Q 40 50 0 80 Z" fill="url(#fernAccentGrad)" />
          </g>

          {/* Ground Fern Cluster 2 (Center-Right) */}
          <g transform="translate(540, 500)">
            <path d="M 0 70 Q -40 10 -90 20 Q -40 35 0 70 Z" fill="url(#fernLeafGrad)" />
            <path d="M 0 70 Q -20 -15 -50 -25 Q -10 10 0 70 Z" fill="url(#fernAccentGrad)" />
            <path d="M 0 70 Q 15 -20 45 -10 Q 20 20 0 70 Z" fill="url(#cycadGrad)" />
            <path d="M 0 70 Q 50 15 100 30 Q 50 45 0 70 Z" fill="url(#fernLeafGrad)" />
          </g>

          {/* Prehistoric Spores and Floating Ambient Light */}
          <circle cx="210" cy="220" r="3" fill="#FEF08A" opacity="0.6" />
          <circle cx="480" cy="180" r="4" fill="#FEF08A" opacity="0.5" />
          <circle cx="630" cy="250" r="2.5" fill="#FEF08A" opacity="0.7" />
          <circle cx="370" cy="340" r="3" fill="#A7F3D0" opacity="0.6" />
          <circle cx="790" cy="210" r="3.5" fill="#FEF08A" opacity="0.5" />
        </svg>

        {/* Cold Winter Drift Effect on Prehistoric Ground */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />
      </div>

      {/* Top HUD: Temperature Bar & Fixed 30s Survival Timer */}
      <div className="w-full p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-20 bg-[#FAF3E0]/95 backdrop-blur-md border-b-2 border-[#D9B99B] text-[#4A3728] shadow-sm">
        {/* Body Temperature / Health Bar */}
        <div className="w-full sm:w-1/2 flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#6E7B36] shrink-0">
            {temperature > 30 ? (
              <Flame className="w-4 h-4 text-[#E67E22] animate-pulse" />
            ) : (
              <Snowflake className="w-4 h-4 text-[#395B64] animate-spin" />
            )}
            <span>小盜龍體溫：</span>
          </div>

          <div className="relative flex-1 h-5 bg-[#E8DCC4] rounded-full border-2 border-[#D9B99B] overflow-hidden p-0.5 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-100 ${
                temperature > 50
                  ? 'bg-gradient-to-r from-[#8B9A46] to-[#E67E22]'
                  : temperature > 25
                  ? 'bg-gradient-to-r from-[#E67E22] to-amber-500'
                  : 'bg-gradient-to-r from-red-600 to-rose-400 animate-pulse'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, temperature))}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#4A3728] drop-shadow-sm">
              {Math.round(temperature)}%
            </span>
          </div>
        </div>

        {/* Fixed 30s Survival Countdown Timer */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
          <div className="bg-[#8B9A46]/20 border-2 border-[#6E7B36] px-3.5 py-1 rounded-full text-[#6E7B36] flex items-center gap-1.5 shadow-sm">
            <Timer className="w-3.5 h-3.5 text-[#E67E22] animate-spin" />
            <span>剩餘生存時間：<span className="font-mono text-sm font-black text-[#E67E22]">{timeLeft.toFixed(1)}s</span></span>
          </div>
          <div className="bg-white/90 border-2 border-[#D9B99B] px-3 py-1 rounded-full text-[#5D4E42] text-[11px] shadow-sm font-bold">
            🪶 收集數: {collectedCount}
          </div>
        </div>
      </div>

      {/* Game Field (Feathers & Player) */}
      <div className="relative flex-1 w-full h-full">
        {/* Touch/Mouse drag hint */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[#4A3728] font-bold text-[11px] pointer-events-none bg-white/90 px-3.5 py-1 rounded-full border-2 border-[#D9B99B] shadow-md flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#E67E22]" />
          <span>在恐龍蕨類地面滑動小盜龍，收集羽毛維持體溫撐過 30 秒！</span>
        </div>

        {/* Feathers that flash and disappear */}
        {feathers.map((feather) => {
          const isGolden = feather.type === 'golden';
          return (
            <div
              key={feather.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform animate-pulse"
              style={{
                left: `${feather.x}%`,
                top: `${feather.y}%`,
              }}
            >
              <div
                className={`relative p-2 rounded-full flex items-center justify-center transition-all ${
                  isGolden
                    ? 'bg-amber-500/40 border-2 border-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.9)]'
                    : 'bg-sky-500/30 border-2 border-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.8)]'
                }`}
              >
                {/* SVG Feather Icon */}
                <svg viewBox="0 0 32 32" className="w-8 h-8 drop-shadow-md">
                  <path
                    d="M 28 4 C 18 6 8 16 4 28 C 16 26 26 16 28 4 Z"
                    fill={isGolden ? '#FBBF24' : '#60A5FA'}
                    stroke={isGolden ? '#B45309' : '#1D4ED8'}
                    strokeWidth="1.5"
                  />
                  <line
                    x1="28"
                    y1="4"
                    x2="4"
                    y2="28"
                    stroke={isGolden ? '#FFFBEB' : '#EFF6FF'}
                    strokeWidth="1.5"
                  />
                </svg>
                {/* Value Badge */}
                <span className="absolute -top-1 -right-1 text-[9px] font-black px-1 rounded-full bg-[#E67E22] text-white shadow">
                  +{feather.value}%
                </span>
              </div>
            </div>
          );
        })}

        {/* Floating feedback texts */}
        {floatingTexts.map((item) => (
          <div
            key={item.id}
            className="absolute text-amber-300 font-extrabold text-sm pointer-events-none drop-shadow-md animate-bounce -translate-x-1/2 -translate-y-full"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.text}
          </div>
        ))}

        {/* Player: Microraptor (小盜龍) */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75 z-10"
          style={{
            left: `${playerPos.x}%`,
            top: `${playerPos.y}%`,
            transform: `translate(-50%, -50%) ${facingLeft ? 'scaleX(-1)' : 'scaleX(1)'}`,
          }}
        >
          <div className="w-28 h-24 sm:w-32 sm:h-28">
            <MicroraptorAvatar isGliding={gliding} />
          </div>
        </div>
      </div>

      {/* Game Over Modal if temperature hits 0 */}
      {isGameOver && (
        <GameOverModal
          reason="freeze"
          stageNumber={1}
          message="小盜龍體溫歸零被凍僵了！體力消耗迅速，請更敏捷地收集閃現的羽毛以撐過 30 秒！"
          onRetry={resetGame}
          onRestartAll={onRestartAll}
          onHome={onHome}
        />
      )}
    </div>
  );
};

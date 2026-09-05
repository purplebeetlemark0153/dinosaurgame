import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ModernBirdAvatar } from './DinosaurAvatars';
import { sound } from '../utils/audio';
import { RotateCcw, Home, Sparkles, Feather, Bird, Flame } from 'lucide-react';

interface EndingCutsceneProps {
  onRestart: () => void;
  onHome: () => void;
  onSelectStage: (stage: 1 | 2 | 3 | 4) => void;
}

type EndingPhase = 'VICTORY' | 'METEOR_APPROACH' | 'EXPLOSION' | 'RUINS' | 'FEATHER_MORPH' | 'FINAL_REVELATION';

export const EndingCutscene: React.FC<EndingCutsceneProps> = ({
  onRestart,
  onHome,
  onSelectStage,
}) => {
  const [phase, setPhase] = useState<EndingPhase>('VICTORY');

  // Trigger celebration confetti on initial victory phase
  useEffect(() => {
    sound.playWin();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Automatically transition to meteor approach after 3.2 seconds
    const timer1 = setTimeout(() => {
      setPhase('METEOR_APPROACH');
    }, 3200);

    return () => clearTimeout(timer1);
  }, []);

  // Sequence progression
  useEffect(() => {
    if (phase === 'METEOR_APPROACH') {
      const timer = setTimeout(() => {
        sound.playMeteorExplosion();
        setPhase('EXPLOSION');
      }, 2500);
      return () => clearTimeout(timer);
    }

    if (phase === 'EXPLOSION') {
      const timer = setTimeout(() => {
        setPhase('RUINS');
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (phase === 'RUINS') {
      const timer = setTimeout(() => {
        sound.playFeatherCollect();
        setPhase('FEATHER_MORPH');
      }, 2800);
      return () => clearTimeout(timer);
    }

    if (phase === 'FEATHER_MORPH') {
      const timer = setTimeout(() => {
        sound.playBirdChirp();
        setPhase('FINAL_REVELATION');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <div className="relative w-full h-full min-h-[640px] flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden bg-black text-white select-none">
      <AnimatePresence mode="wait">
        {/* PHASE 0: Initial Celebration Screen (恭喜過關) */}
        {phase === 'VICTORY' && (
          <motion.div
            key="victory"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="my-auto max-w-xl text-center bg-[#FAF3E0] border-2 border-b-8 border-[#D9B99B] rounded-[32px] sm:rounded-[40px] p-8 shadow-2xl z-20 flex flex-col items-center text-[#4A3728]"
          >
            <div className="w-20 h-20 rounded-full bg-[#8B9A46]/20 border-2 border-[#6E7B36] flex items-center justify-center text-4xl mb-4 animate-bounce">
              🏆
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#6E7B36] mb-2">
              🎉 恭喜全部通關！
            </h2>
            <p className="text-[#5D4E42] text-base sm:text-lg mb-6 leading-relaxed font-medium">
              太厲害了！你成功經歷了小盜龍羽毛保暖、天空滑翔爭霸、深海巨獸掠食，以及霸王龍對美頜龍的終極追捕！
            </p>
            <div className="text-xs text-[#E67E22] animate-pulse font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#E67E22]" /> 遠古時代的命運即將揭曉...
            </div>
          </motion.div>
        )}

        {/* PHASE 1: Meteor Approaching (隕石逼近) */}
        {phase === 'METEOR_APPROACH' && (
          <motion.div
            key="meteor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-red-950 via-stone-900 to-black flex flex-col items-center justify-between p-6 z-30"
          >
            <div className="text-center pt-8 z-30">
              <span className="px-4 py-1 rounded-full bg-red-600/30 border border-red-500 text-red-300 font-bold text-xs uppercase tracking-wider animate-pulse flex items-center gap-1.5 mx-auto w-fit">
                <Flame className="w-4 h-4 text-red-400" /> 天降浩劫 · 白堊紀末期大滅絕
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-red-400 mt-2 drop-shadow-lg">
                然而……命運不可逆轉的巨變降臨了！
              </h3>
            </div>

            {/* Giant Flaming Meteor streaking down */}
            <motion.div
              initial={{ x: 250, y: -200, scale: 0.4 }}
              animate={{ x: -150, y: 350, scale: 2.2 }}
              transition={{ duration: 2.5, ease: 'easeIn' }}
              className="absolute pointer-events-none z-20"
            >
              {/* Fiery Meteor Body & Trail */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-300 via-orange-500 to-red-600 blur-[2px] shadow-[0_0_60px_#ef4444]" />
                <div className="absolute top-4 -right-48 w-64 h-24 bg-gradient-to-r from-orange-500 to-transparent -rotate-35 blur-md" />
              </div>
            </motion.div>

            {/* Earth Silhouette below */}
            <div className="w-full h-32 bg-stone-950 border-t border-red-900/50 flex items-center justify-center text-xs text-stone-500">
              🌍 恐龍稱霸了 1.6 億年的繁盛大地……
            </div>
          </motion.div>
        )}

        {/* PHASE 2: Huge Screen Explosion (隕石毀滅了一切) */}
        {phase === 'EXPLOSION' && (
          <motion.div
            key="explosion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-40 flex items-center justify-center animate-pulse"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 0.95, 1.08, 1], rotate: [0, -2, 2, -1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-full h-full bg-gradient-to-b from-orange-500 via-red-600 to-amber-900 flex flex-col items-center justify-center text-center p-6"
            >
              <h2 className="text-4xl sm:text-6xl font-black text-yellow-200 drop-shadow-[0_0_25px_rgba(254,240,138,0.9)]">
                💥 毀滅性的撞擊！
              </h2>
              <p className="text-stone-100 text-lg mt-4 font-bold max-w-lg">
                即使玩家全力過關，恐龍統治的時代依然在巨變中走向了終結……
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 3: Scorched Ruins (廢墟餘燼) */}
        {phase === 'RUINS' && (
          <motion.div
            key="ruins"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-950 flex flex-col items-center justify-center p-6 z-30"
          >
            <div className="max-w-lg text-center">
              <p className="text-stone-400 text-base sm:text-lg italic font-serif leading-relaxed">
                天空被厚厚的塵埃籠罩，巨獸們的身影漸漸消失在廢墟之中……
              </p>
              <div className="my-6 text-stone-600 text-2xl animate-pulse">
                🌫️ 🌋 🌫️
              </div>
              <p className="text-amber-400/80 text-sm">
                然而……在死寂與廢墟的正中央……
              </p>
            </div>
          </motion.div>
        )}

        {/* PHASE 4: Feather Slowly Morphing into Bird (廢墟中羽毛出現並變成鳥的輪廓) */}
        {phase === 'FEATHER_MORPH' && (
          <motion.div
            key="feather_morph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-stone-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-6 z-30"
          >
            <div className="text-center mb-6">
              <span className="text-xs text-amber-300 uppercase tracking-widest font-mono">
                ✨ 生命的奇蹟演化 · The Miracle of Evolution
              </span>
            </div>

            {/* Glowing Feather transitioning to Bird */}
            <motion.div
              initial={{ y: -60, opacity: 0, rotate: -25 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 2.0, ease: 'easeOut' }}
              className="relative flex flex-col items-center justify-center my-6 z-40"
            >
              {/* Radiant Dedicated Feather (Glowing SVG Feather) */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex items-center justify-center"
              >
                {/* Radiant Halo & Starlight Aura */}
                <div className="absolute -inset-10 rounded-full bg-amber-400/20 blur-2xl animate-pulse" />
                <div className="absolute -inset-4 rounded-full bg-yellow-300/30 blur-xl" />

                {/* Highly Detailed Authentic Glowing Avian Evolution Feather SVG */}
                <svg
                  viewBox="0 0 130 165"
                  className="w-36 h-48 sm:w-48 sm:h-64 filter drop-shadow-[0_0_35px_rgba(251,191,36,0.95)] overflow-visible"
                >
                  <defs>
                    <linearGradient id="featherVaneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFDF5" />
                      <stop offset="25%" stopColor="#FEF08A" />
                      <stop offset="55%" stopColor="#FBBF24" />
                      <stop offset="85%" stopColor="#D97706" />
                      <stop offset="100%" stopColor="#92400E" />
                    </linearGradient>
                    <linearGradient id="featherShaftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="45%" stopColor="#FEF3C7" />
                      <stop offset="80%" stopColor="#FDE68A" />
                      <stop offset="100%" stopColor="#CA8A04" />
                    </linearGradient>
                    <linearGradient id="calamusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FEF9C3" stopOpacity="0.95" />
                      <stop offset="60%" stopColor="#FDE047" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#CA8A04" stopOpacity="0.5" />
                    </linearGradient>
                    <radialGradient id="featherAmbientGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Core Ambient Radiance */}
                  <ellipse cx="62" cy="78" rx="55" ry="68" fill="url(#featherAmbientGlow)" />

                  {/* Basal Down Feather Filaments (羽毛基部膨鬆柔軟的下羽絨絲 - 絕非樹葉特徵) */}
                  <g opacity="0.9">
                    {/* Left Down Barbs */}
                    <path d="M 50 134 C 38 136, 26 142, 16 150" stroke="#FFFBEB" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    <path d="M 50 130 C 34 130, 20 136, 12 144" stroke="#FEF08A" strokeWidth="1.1" fill="none" strokeLinecap="round" />
                    <path d="M 49 125 C 32 122, 18 127, 14 135" stroke="#FDE68A" strokeWidth="1.1" fill="none" strokeLinecap="round" />
                    <path d="M 48 120 C 34 116, 22 118, 16 124" stroke="#FBBF24" strokeWidth="1.0" fill="none" strokeLinecap="round" />
                    <path d="M 49 128 C 38 131, 28 138, 22 147" stroke="#FEF9C3" strokeWidth="0.9" fill="none" strokeLinecap="round" />

                    {/* Right Down Barbs */}
                    <path d="M 53 134 C 66 137, 80 142, 92 150" stroke="#FFFBEB" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    <path d="M 53 129 C 70 130, 86 136, 96 144" stroke="#FEF08A" strokeWidth="1.1" fill="none" strokeLinecap="round" />
                    <path d="M 52 124 C 72 123, 88 127, 98 135" stroke="#FDE68A" strokeWidth="1.1" fill="none" strokeLinecap="round" />
                    <path d="M 51 119 C 68 116, 82 118, 90 124" stroke="#FBBF24" strokeWidth="1.0" fill="none" strokeLinecap="round" />
                    <path d="M 52 128 C 66 131, 78 138, 86 147" stroke="#FEF9C3" strokeWidth="0.9" fill="none" strokeLinecap="round" />
                  </g>

                  {/* Left Vane (Outer / Leading Edge: Narrower aerodynamic flight vane with distinct natural feather splits) */}
                  <path
                    d="M 76 12
                       C 70 20, 62 27, 54 36
                       C 52 33, 53 40, 47 50
                       C 44 47, 46 55, 41 68
                       C 38 65, 40 74, 37 86
                       C 34 83, 36 94, 35 106
                       C 34 112, 40 117, 49 120
                       L 50 122 Z"
                    fill="url(#featherVaneGrad)"
                    stroke="#FEF08A"
                    strokeWidth="1.0"
                  />

                  {/* Right Vane (Inner / Trailing Edge: Broader, graceful aerodynamic vane with feathery contour notches) */}
                  <path
                    d="M 76 12
                       C 86 21, 98 33, 106 46
                       C 101 44, 106 54, 112 66
                       C 107 64, 111 75, 115 88
                       C 110 86, 112 98, 107 108
                       C 98 117, 85 121, 68 121
                       C 58 120, 52 120, 52 120 Z"
                    fill="url(#featherVaneGrad)"
                    stroke="#FEF08A"
                    strokeWidth="1.0"
                  />

                  {/* Natural Feather Barb Fissures / Splits (羽裂羽隙陰影) */}
                  <path d="M 54 36 L 62 30" stroke="#78350F" strokeWidth="1.2" opacity="0.65" />
                  <path d="M 47 50 L 56 42" stroke="#78350F" strokeWidth="1.2" opacity="0.65" />
                  <path d="M 41 68 L 51 58" stroke="#78350F" strokeWidth="1.2" opacity="0.65" />
                  <path d="M 37 86 L 48 76" stroke="#78350F" strokeWidth="1.2" opacity="0.65" />

                  <path d="M 106 46 L 90 38" stroke="#78350F" strokeWidth="1.3" opacity="0.65" />
                  <path d="M 112 66 L 94 56" stroke="#78350F" strokeWidth="1.3" opacity="0.65" />
                  <path d="M 115 88 L 95 76" stroke="#78350F" strokeWidth="1.3" opacity="0.65" />
                  <path d="M 107 108 L 88 98" stroke="#78350F" strokeWidth="1.3" opacity="0.65" />

                  {/* Fine Barbule Micro-Striations (密集的斜向微細羽枝條紋) */}
                  <g stroke="#FFFBEB" strokeWidth="0.8" opacity="0.75" fill="none">
                    {/* Left Vane Barbules */}
                    <path d="M 72 18 C 66 23, 60 28, 55 34" />
                    <path d="M 66 26 C 58 32, 52 38, 48 45" />
                    <path d="M 60 36 C 52 44, 46 52, 43 60" />
                    <path d="M 55 48 C 48 58, 43 68, 40 76" />
                    <path d="M 51 62 C 45 74, 40 84, 38 94" />
                    <path d="M 49 78 C 44 88, 40 98, 37 106" />
                    <path d="M 48 94 C 44 102, 41 110, 42 116" />

                    {/* Right Vane Barbules */}
                    <path d="M 74 18 C 82 24, 90 31, 98 38" />
                    <path d="M 70 28 C 80 36, 92 46, 102 54" />
                    <path d="M 64 38 C 76 48, 90 60, 104 70" />
                    <path d="M 59 50 C 73 62, 88 76, 106 86" />
                    <path d="M 55 64 C 70 78, 86 92, 106 102" />
                    <path d="M 52 80 C 66 94, 82 106, 98 114" />
                    <path d="M 51 96 C 64 106, 78 114, 88 119" />
                    <path d="M 51 108 C 60 114, 70 118, 78 120" />
                  </g>

                  {/* Feathery Edge Wisps (羽毛外緣微細突出的羽絲針尖) */}
                  <g stroke="#FEF08A" strokeWidth="0.9" opacity="0.9" fill="none">
                    <path d="M 54 36 L 52 38" />
                    <path d="M 47 50 L 44 53" />
                    <path d="M 41 68 L 38 71" />
                    <path d="M 37 86 L 34 89" />
                    <path d="M 106 46 L 109 48" />
                    <path d="M 112 66 L 115 69" />
                    <path d="M 115 88 L 118 91" />
                  </g>

                  {/* Translucent Calamus / Quill Barrel (羽軸筆管 / 翮 - 中空半透明羽毛根部) */}
                  <path
                    d="M 53 134 C 54 142, 55 152, 54 160 C 52 160, 50 156, 49 148 C 48 142, 49 135, 51 134 Z"
                    fill="url(#calamusGrad)"
                    stroke="#D97706"
                    strokeWidth="1.2"
                  />
                  <path d="M 52 136 L 52 156" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.8" />

                  {/* Central Curved Rachis / Feather Shaft (曲線優雅的羽軸) */}
                  <path
                    d="M 50 134
                       C 47 105, 48 70, 60 40
                       C 65 28, 70 18, 76 12
                       C 75 14, 70 24, 63 38
                       C 51 68, 50 102, 53 134 Z"
                    fill="url(#featherShaftGrad)"
                    stroke="#B45309"
                    strokeWidth="1.4"
                  />

                  {/* Specular Highlight along Central Rachis */}
                  <path
                    d="M 51 130 C 49 104, 50 72, 61 42 C 65 30, 71 20, 75 14"
                    stroke="#FFFFFF"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.95"
                  />

                  {/* Floating Micro Shimmer Sparkles around Feather */}
                  <circle cx="20" cy="40" r="2.5" fill="#FFF" className="animate-ping" />
                  <circle cx="112" cy="50" r="2" fill="#FDE047" className="animate-pulse" />
                  <circle cx="15" cy="110" r="2" fill="#FDE047" className="animate-pulse" />
                  <circle cx="115" cy="115" r="2.5" fill="#FFF" className="animate-ping" />
                  <circle cx="76" cy="10" r="2.5" fill="#FFF" className="animate-ping" />
                </svg>
              </motion.div>

              <div className="mt-4 text-center text-amber-200 font-bold text-sm tracking-wide bg-stone-900/90 px-5 py-2 rounded-full border border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                🪶 一根羽毛在廢墟中央飄落，逐漸綻放出新的生命輪廓……
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 5: FINAL REVELATION (鳥類輪廓與深刻寓意) */}
        {phase === 'FINAL_REVELATION' && (
          <motion.div
            key="revelation"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl bg-[#FAF3E0] border-2 border-b-8 border-[#D9B99B] rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl z-20 my-auto text-center flex flex-col items-center text-[#4A3728]"
          >
            {/* Morphing Soaring Bird Avatar */}
            <motion.div
              initial={{ scale: 0.7, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="mb-2"
            >
              <ModernBirdAvatar className="w-32 h-28 sm:w-40 sm:h-32" />
            </motion.div>

            {/* Ending Title */}
            <div className="inline-block px-3.5 py-1 bg-[#8B9A46]/20 text-[#6E7B36] text-xs font-black rounded-full mb-3 tracking-widest border border-[#6E7B36]/30 uppercase">
              演化的真相 · The Secret of Dinosaurs
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#6E7B36] mb-3">
              恐龍從未真正離去！
            </h2>

            {/* The Touching Story Narrative from prompt */}
            <div className="p-5 bg-white/90 rounded-2xl border-2 border-[#D9B99B] text-[#5D4E42] text-sm sm:text-base leading-relaxed text-justify sm:text-center space-y-3 shadow-inner font-medium">
              <p>
                雖然大滅絕終結了陸地巨獸的時代，但少數披著羽毛的小型恐龍，依靠著羽毛的保暖與滑翔飛行，奇蹟般地在浩劫中存活了下來！
              </p>
              <p className="text-[#4A3728] font-bold">
                牠們經歷漫長歲月演化成了今天的<span className="text-[#E67E22] font-black text-lg underline decoration-[#E67E22]/60">「鳥類」</span>——此時此刻，牠們依然翱翔在藍天中，生活在你我的身邊！
              </p>
            </div>

            {/* Stage Replay Quick Select */}
            <div className="w-full my-4 pt-3 border-t-2 border-[#D9B99B]">
              <div className="text-xs text-[#9B7E6F] mb-2 font-bold tracking-wider">重溫指定關卡：</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => onSelectStage(1)}
                  className="p-2.5 bg-white hover:bg-stone-50 rounded-2xl border-2 border-[#D9B99B] text-[#5D4E42] font-bold cursor-pointer transition active:scale-95 shadow-sm"
                >
                  第1關：小盜龍
                </button>
                <button
                  onClick={() => onSelectStage(2)}
                  className="p-2.5 bg-white hover:bg-stone-50 rounded-2xl border-2 border-[#D9B99B] text-[#5D4E42] font-bold cursor-pointer transition active:scale-95 shadow-sm"
                >
                  第2關：天空競速
                </button>
                <button
                  onClick={() => onSelectStage(3)}
                  className="p-2.5 bg-white hover:bg-stone-50 rounded-2xl border-2 border-[#D9B99B] text-[#5D4E42] font-bold cursor-pointer transition active:scale-95 shadow-sm"
                >
                  第3關：深海王者
                </button>
                <button
                  onClick={() => onSelectStage(4)}
                  className="p-2.5 bg-white hover:bg-stone-50 rounded-2xl border-2 border-[#D9B99B] text-[#5D4E42] font-bold cursor-pointer transition active:scale-95 shadow-sm"
                >
                  第4關：霸王龍
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-3 mt-2">
              <button
                id="restart-game-btn"
                onClick={() => {
                  sound.playWin();
                  onRestart();
                }}
                className="flex-1 py-4 px-6 bg-[#E67E22] hover:bg-[#D35400] text-white font-black text-base rounded-full flex items-center justify-center gap-2 shadow-lg cursor-pointer transition active:scale-95 shadow-orange-950/20"
              >
                <RotateCcw className="w-5 h-5" />
                <span>重新玩一次全遊戲</span>
              </button>

              <button
                id="final-home-btn"
                onClick={() => {
                  sound.playEat();
                  onHome();
                }}
                className="py-4 px-6 bg-white hover:bg-stone-50 text-[#4A3728] font-bold rounded-full flex items-center justify-center gap-2 border-2 border-[#D9B99B] cursor-pointer transition active:scale-95 shadow-sm"
              >
                <Home className="w-5 h-5 text-[#6E7B36]" />
                <span>回首頁</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

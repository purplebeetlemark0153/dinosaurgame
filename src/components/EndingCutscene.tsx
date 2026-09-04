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
              initial={{ y: -80, opacity: 0, rotate: -20 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 2.2, ease: 'easeOut' }}
              className="relative flex flex-col items-center justify-center my-6"
            >
              {/* Radiant Feather */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <Feather className="w-24 h-24 sm:w-32 sm:h-32 text-amber-300 drop-shadow-[0_0_30px_rgba(251,191,36,0.9)] animate-pulse" />
              </motion.div>

              <div className="mt-4 text-center text-amber-200 font-bold text-sm tracking-wide bg-stone-900/80 px-4 py-1.5 rounded-full border border-amber-400/40">
                一根羽毛在廢墟中央飄落，逐漸綻放出新的生命輪廓……
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

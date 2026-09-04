import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CuteMainDino } from './DinosaurAvatars';
import { Play, Sparkles, Volume2, VolumeX, Film } from 'lucide-react';
import { sound } from '../utils/audio';

interface MainMenuProps {
  onStartGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, isMuted, onToggleMute }) => {
  // Cute dinosaur walking back and forth
  const [dinoPos, setDinoPos] = useState(15);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDinoPos((prev) => {
        if (prev >= 80) {
          setDirection(-1);
          return prev - 0.4;
        } else if (prev <= 12) {
          setDirection(1);
          return prev + 0.4;
        }
        return prev + direction * 0.4;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [direction]);

  const handleStart = () => {
    sound.playWin();
    onStartGame();
  };

  return (
    <div className="relative w-full h-full min-h-[640px] flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden bg-[#FAF3E0] text-[#4A3728] select-none font-sans">
      {/* Fossil Background Texture */}
      <div className="absolute inset-0 fossil-texture opacity-40 pointer-events-none" />

      {/* Decorative Natural Ambient Glows */}
      <div className="absolute -top-16 -left-20 w-56 h-56 bg-[#A3B18A] rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-64 h-64 bg-[#D9B99B] rounded-full blur-3xl opacity-30 pointer-events-none" />

      {/* Top Header Navigation */}
      <nav className="w-full max-w-5xl flex justify-between items-center z-10 pt-2 px-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8B9A46] rounded-full flex items-center justify-center border-4 border-[#6E7B36] shadow-md">
            <span className="text-xl sm:text-2xl">🦕</span>
          </div>
          <div>
            <span className="text-lg sm:text-2xl font-black tracking-tight uppercase text-[#6E7B36] drop-shadow-sm block leading-none">
              Dino Discovery
            </span>
            <span className="text-[11px] font-bold text-[#9B7E6F] tracking-widest uppercase">
              立體影片巡禮遊戲
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="sound-toggle-btn"
            onClick={onToggleMute}
            className="px-3.5 py-1.5 rounded-full border-2 border-[#D9B99B] bg-white/80 hover:bg-white text-xs font-bold text-[#4A3728] transition shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            title={isMuted ? "開啟音效" : "靜音"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-600" />
                <span>SOUND: OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#6E7B36]" />
                <span>SOUND: ON</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Walking Dinosaur Animation Lane Running between "DINO DISCOVERY" and the central card */}
      <div className="w-full max-w-2xl relative h-24 sm:h-28 z-10 my-1 px-6 flex items-end">
        <div
          className="absolute bottom-1 transition-transform duration-75 origin-bottom"
          style={{
            left: `${dinoPos}%`,
            transform: `translateX(-50%) scaleX(${direction})`,
          }}
        >
          <CuteMainDino className="w-22 h-20 sm:w-26 sm:h-24" isWalking={true} />
        </div>

        {/* Prehistoric Earth Footprints & Foliage along the running strip */}
        <div className="w-full flex items-center justify-between pb-1 border-b-2 border-dashed border-[#D9B99B]/60 text-[#8B9A46] text-lg select-none pointer-events-none">
          <span className="opacity-80">🌿</span>
          <span className="text-[#9B7E6F] text-[11px] opacity-50 tracking-[0.3em] font-mono">
            🐾 🐾 🐾 🐾 🐾 🐾 🐾 🐾
          </span>
          <span className="opacity-80">🌱</span>
        </div>
      </div>

      {/* Central Interactive Content - Natural Tones Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white/85 backdrop-blur-sm p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-2xl border-b-8 border-2 border-[#D9B99B] z-10 text-center flex flex-col items-center my-auto relative"
      >
        {/* Game Title */}
        <div className="mb-3">
          <div className="inline-block px-3.5 py-1 bg-[#8B9A46]/20 text-[#6E7B36] text-xs font-black rounded-full mb-1 tracking-widest border border-[#6E7B36]/30 uppercase">
            The Great Dinosaur
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#6E7B36] tracking-tight">
            立體影片《恐龍的秘密》
          </h1>
          <div className="text-lg sm:text-xl font-serif italic text-[#9B7E6F] font-semibold mt-0.5">
            The Great Dinosaur
          </div>
        </div>

        {/* Required Prompt Text in Quotation Style */}
        <div className="my-2 p-4 sm:p-5 bg-[#FAF3E0]/90 rounded-2xl border-2 border-[#D9B99B] text-[#5D4E42] shadow-inner text-base sm:text-lg leading-relaxed font-medium text-justify sm:text-center">
          喜歡恐龍嗎？了解恐龍嗎？想更認識恐龍嗎？<br className="hidden sm:inline" />
          那就請來收看立體影片<span className="text-[#E67E22] font-black">《恐龍的秘密 The great dinosaur》</span>，並且玩玩這款小遊戲吧！
        </div>

        {/* Enter Game Button */}
        <motion.button
          id="enter-game-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="mt-3 px-10 sm:px-14 py-3.5 sm:py-4 bg-[#E67E22] hover:bg-[#D35400] text-white font-black text-xl rounded-full shadow-lg flex items-center gap-3 transition-all cursor-pointer shadow-orange-950/20"
        >
          <span>進入遊戲</span>
          <Play className="w-6 h-6 fill-white" />
        </motion.button>
      </motion.div>

      {/* Level Badges Grid Preview */}
      <div className="w-full max-w-3xl z-10 mb-4">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 px-4 sm:px-8">
          <div className="flex flex-col items-center opacity-90 transition hover:opacity-100">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#D9B99B] border-4 border-white shadow-md flex items-center justify-center mb-1.5">
              <span className="text-xl sm:text-2xl">🪶</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#5D4E42] tracking-wider">LV 1: 禦寒</span>
          </div>

          <div className="flex flex-col items-center opacity-85 transition hover:opacity-100">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#A5C9CA] border-4 border-white shadow-md flex items-center justify-center mb-1.5">
              <span className="text-xl sm:text-2xl">☁️</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#5D4E42] tracking-wider">LV 2: 空戰</span>
          </div>

          <div className="flex flex-col items-center opacity-85 transition hover:opacity-100">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#395B64] border-4 border-white shadow-md flex items-center justify-center mb-1.5 text-white">
              <span className="text-xl sm:text-2xl">🌊</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#5D4E42] tracking-wider">LV 3: 海域</span>
          </div>

          <div className="flex flex-col items-center opacity-85 transition hover:opacity-100">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#A27B5C] border-4 border-white shadow-md flex items-center justify-center mb-1.5 text-white">
              <span className="text-xl sm:text-2xl">🦖</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#5D4E42] tracking-wider">LV 4: 霸主</span>
          </div>
        </div>
      </div>

      {/* Bottom Ground Accent Bar */}
      <div className="w-full h-3 bg-[#6E7B36] z-10" />
    </div>
  );
};

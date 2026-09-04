import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, RefreshCw, Home, Snowflake, Skull } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameOverModalProps {
  reason: 'freeze' | 'starve';
  stageNumber: number;
  message?: string;
  onRetry: () => void;
  onRestartAll?: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  reason,
  stageNumber,
  message,
  onRetry,
  onRestartAll,
  onHome
}) => {
  const isFreeze = reason === 'freeze';

  return (
    <div className="absolute inset-0 bg-black/65 backdrop-blur-md z-40 flex items-center justify-center p-4 select-none font-sans">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md bg-[#FAF3E0] border-2 border-b-8 border-[#D9B99B] rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 text-center text-[#4A3728] shadow-2xl flex flex-col items-center"
      >
        {/* Icon */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
          isFreeze ? 'bg-[#A5C9CA]/40 text-[#395B64] border-2 border-[#A5C9CA]' : 'bg-[#E67E22]/20 text-[#E67E22] border-2 border-[#E67E22]'
        }`}>
          {isFreeze ? <Snowflake className="w-10 h-10 animate-spin" /> : <Skull className="w-10 h-10 animate-bounce" />}
        </div>

        {/* Failure Title as per prompt */}
        <h3 className="text-2xl sm:text-3xl font-black mb-2 text-[#4A3728]">
          {isFreeze ? '❄️ 凍死失敗！' : '🍖 餓死失敗！'}
        </h3>

        <p className="text-[#5D4E42] text-sm sm:text-base mb-6 leading-relaxed font-medium">
          {message || (isFreeze
            ? '小盜龍體溫過低凍僵了！需要更迅速地收集羽毛保暖圖示維持體力！'
            : `在第 ${stageNumber} 關中食物不足被競爭對手超越了，快再試一次吧！`)}
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 sm:gap-3">
          <div className="flex flex-col sm:flex-row gap-2.5 w-full">
            <button
              id="retry-stage-btn"
              onClick={() => {
                sound.playEat();
                onRetry();
              }}
              className="flex-1 py-3 px-4 bg-[#E67E22] hover:bg-[#D35400] text-white font-black rounded-full flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-md shadow-orange-950/20 text-sm sm:text-base"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>本關重來</span>
            </button>

            <button
              id="restart-all-btn"
              onClick={() => {
                sound.playEat();
                if (onRestartAll) onRestartAll();
                else onHome();
              }}
              className="flex-1 py-3 px-4 bg-[#6E7B36] hover:bg-[#586429] text-white font-black rounded-full flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-md text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>重新開始</span>
            </button>
          </div>

          <button
            id="back-home-btn"
            onClick={() => {
              sound.playEat();
              onHome();
            }}
            className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 text-[#4A3728] font-bold rounded-full flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer border-2 border-[#D9B99B] shadow-sm text-sm"
          >
            <Home className="w-4 h-4 text-[#6E7B36]" />
            <span>返回主選單</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

import React from 'react';
import { Volume2, VolumeX, Home, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderNavProps {
  currentStageNumber?: number;
  stageName?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onHome: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentStageNumber,
  stageName,
  isMuted,
  onToggleMute,
  onHome,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 py-2.5 bg-[#FAF3E0]/95 backdrop-blur-md border-b-2 border-[#D9B99B] text-[#4A3728] z-20 shrink-0 shadow-sm">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sound.playEat();
            onHome();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 hover:bg-white border-2 border-[#D9B99B] text-xs font-bold text-[#4A3728] transition cursor-pointer shadow-sm active:scale-95"
          title="回首頁"
        >
          <Home className="w-3.5 h-3.5 text-[#6E7B36]" />
          <span className="hidden sm:inline">主畫面</span>
        </button>

        {currentStageNumber && (
          <div className="flex items-center gap-1.5 px-3.5 py-1 bg-[#8B9A46]/15 border-2 border-[#6E7B36]/50 rounded-full text-xs font-bold text-[#6E7B36]">
            <Sparkles className="w-3.5 h-3.5 text-[#E67E22]" />
            <span>關卡 {currentStageNumber}：{stageName}</span>
          </div>
        )}
      </div>

      {/* Level Progress Dots */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 bg-[#E8DCC4]/70 px-3 py-1 rounded-full border border-[#D9B99B] text-xs text-[#5D4E42] font-mono font-bold">
          <span className={currentStageNumber === 1 ? 'text-[#E67E22] font-black underline' : ''}>1:禦寒</span> ·
          <span className={currentStageNumber === 2 ? 'text-[#E67E22] font-black underline' : ''}>2:空戰</span> ·
          <span className={currentStageNumber === 3 ? 'text-[#E67E22] font-black underline' : ''}>3:海域</span> ·
          <span className={currentStageNumber === 4 ? 'text-[#E67E22] font-black underline' : ''}>4:霸主</span>
        </div>

        <button
          id="global-sound-toggle-btn"
          onClick={onToggleMute}
          className="p-2 rounded-full bg-white/85 hover:bg-white border-2 border-[#D9B99B] text-[#4A3728] transition cursor-pointer active:scale-95 shadow-sm"
          title={isMuted ? "開啟音效" : "靜音"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4 text-[#6E7B36]" />}
        </button>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Stage2Character, Stage3Character } from '../types';
import {
  MicroraptorAvatar,
  PteranodonAvatar,
  ArchaeopteryxAvatar,
  ElasmosaurusAvatar,
  MosasaurusAvatar,
  TRexAvatar,
  CompsognathusAvatar
} from './DinosaurAvatars';
import { Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface StageIntroModalProps {
  stageNumber: 1 | 2 | 3 | 4;
  onEnterStage: (selectedChar?: string) => void;
}

export const StageIntroModal: React.FC<StageIntroModalProps> = ({ stageNumber, onEnterStage }) => {
  const [stage2Char, setStage2Char] = useState<Stage2Character>('archaeopteryx');
  const [stage3Char, setStage3Char] = useState<Stage3Character>('elasmosaurus');

  const handleEnter = () => {
    sound.playEat();
    if (stageNumber === 2) {
      onEnterStage(stage2Char);
    } else if (stageNumber === 3) {
      onEnterStage(stage3Char);
    } else {
      onEnterStage();
    }
  };

  const getStageContent = () => {
    switch (stageNumber) {
      case 1:
        return {
          badge: '第一關：羽毛的奧秘',
          title: '小盜龍羽毛保暖大作戰',
          text: '我們總以為恐龍都是綠色的鱗片跟粗糙的皮膚，但深藏在地底下的化石告訴我們，其實很多恐龍全身都長滿了羽毛，小盜龍就是其中之一，牠依靠羽毛來保暖，所以請大家幫助牠收集羽毛來撐過寒冷的日子吧！',
          goalText: '操作小盜龍滑動收集閃現的「羽毛保暖圖示」維持體溫。體溫會隨寒冬持續下降，存活超過 30 秒即可過關！',
          avatar: <div className="w-28 h-24 mx-auto"><MicroraptorAvatar isGliding={true} /></div>,
        };
      case 2:
        return {
          badge: '第二關：羽毛與天空的征服',
          title: '天空滑翔掠食爭奪戰',
          text: '漸漸地，恐龍們發現羽毛居然可以抓住空氣，接著始祖鳥運用了翅膀上的爪子，一步一步爬上樹幹，並開始在樹枝之間滑翔；此時，無齒翼龍則成為了天空中的霸主！',
          goalText: '選擇你的空中霸主（始祖鳥或無齒翼龍），另一隻將由電腦操縱。在 30 秒內競速捕捉空中獵物，分數高於電腦即可過關！',
          avatar: (
            <div className="flex items-center justify-center gap-4">
              <div className="w-24 h-20"><ArchaeopteryxAvatar /></div>
              <div className="text-[#E67E22] font-black text-xl">VS</div>
              <div className="w-24 h-20"><PteranodonAvatar /></div>
            </div>
          ),
        };
      case 3:
        return {
          badge: '第三關：遠古深海的王者',
          title: '海洋巨獸深海掠食戰',
          text: '當有些恐龍正在研究怎麼飛上天空的時候，水下世界也出現了高手，薄板龍用四支巨大的鰭狀肢，在水流中飛翔，而滄龍則成為了水中的霸主！',
          goalText: '選擇薄板龍（體型大但移動較慢）或滄龍（體型小但動作敏捷）。海中有水壓阻力，30 秒內掠食海產分數高於電腦即可過關！',
          avatar: (
            <div className="flex items-center justify-center gap-4">
              <div className="w-24 h-20"><ElasmosaurusAvatar /></div>
              <div className="text-[#395B64] font-black text-xl">VS</div>
              <div className="w-24 h-20"><MosasaurusAvatar /></div>
            </div>
          ),
        };
      case 4:
        return {
          badge: '第四關：陸地霸權與生存對決',
          title: '霸王龍伏擊美頜龍',
          text: '聊到恐龍，我們絕對不能錯過鼎鼎大名的霸王龍(T-Rex)，體型巨大凶暴的霸王龍，以及嬌小迅捷，速度快如閃電的美頜龍，到底誰比較能存活呢！',
          goalText: '操縱巨大的霸王龍在泥土地的蕨類草叢與石堆中搜尋閃現的美頜龍。30 秒內成功捕捉至少 20 隻美頜龍即可過關！',
          avatar: (
            <div className="flex items-center justify-center gap-3">
              <div className="w-28 h-24"><TRexAvatar /></div>
              <div className="w-16 h-14"><CompsognathusAvatar /></div>
            </div>
          ),
        };
    }
  };

  const content = getStageContent();

  return (
    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md z-30 font-sans">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-[#FAF3E0] border-2 border-b-8 border-[#D9B99B] rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl flex flex-col text-[#4A3728] max-h-[90vh] overflow-y-auto"
      >
        {/* Header Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#8B9A46]/20 text-[#6E7B36] border border-[#6E7B36]/40">
            {content.badge}
          </span>
          <span className="text-xs text-[#9B7E6F] font-bold">關卡 {stageNumber} / 4</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#6E7B36] mb-3 tracking-tight text-center">
          {content.title}
        </h2>

        {/* Avatar Display */}
        <div className="my-2 p-3 bg-white/80 rounded-2xl border-2 border-[#D9B99B] shadow-sm">
          {content.avatar}
        </div>

        {/* Required Story Narrative */}
        <div className="my-3 p-4 sm:p-5 bg-white/90 rounded-2xl border-2 border-[#D9B99B] shadow-inner">
          <p className="text-sm sm:text-base leading-relaxed text-[#5D4E42] font-medium text-justify">
            {content.text}
          </p>
        </div>

        {/* Character Selection for Stage 2 & Stage 3 */}
        {stageNumber === 2 && (
          <div className="my-3 p-3 bg-[#E8DCC4]/60 rounded-2xl border-2 border-[#D9B99B]">
            <div className="text-xs text-[#6E7B36] font-black mb-2 text-center">👉 請選擇你想操作的角色（電腦操縱另一隻）：</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStage2Char('archaeopteryx')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition cursor-pointer ${
                  stage2Char === 'archaeopteryx'
                    ? 'bg-white border-[#6E7B36] shadow-md ring-2 ring-[#6E7B36]/40'
                    : 'bg-white/60 border-[#D9B99B] opacity-75 hover:opacity-100'
                }`}
              >
                <div className="w-16 h-12"><ArchaeopteryxAvatar /></div>
                <span className="font-bold text-sm text-[#6E7B36] flex items-center gap-1">
                  始祖鳥 {stage2Char === 'archaeopteryx' && <CheckCircle2 className="w-4 h-4 text-[#6E7B36]" />}
                </span>
                <span className="text-[11px] text-[#9B7E6F]">靈巧滑翔、利爪樹棲</span>
              </button>

              <button
                type="button"
                onClick={() => setStage2Char('pteranodon')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition cursor-pointer ${
                  stage2Char === 'pteranodon'
                    ? 'bg-white border-[#E67E22] shadow-md ring-2 ring-[#E67E22]/40'
                    : 'bg-white/60 border-[#D9B99B] opacity-75 hover:opacity-100'
                }`}
              >
                <div className="w-16 h-12"><PteranodonAvatar /></div>
                <span className="font-bold text-sm text-[#E67E22] flex items-center gap-1">
                  無齒翼龍 {stage2Char === 'pteranodon' && <CheckCircle2 className="w-4 h-4 text-[#E67E22]" />}
                </span>
                <span className="text-[11px] text-[#9B7E6F]">翼展寬廣、天空霸主</span>
              </button>
            </div>
          </div>
        )}

        {stageNumber === 3 && (
          <div className="my-3 p-3 bg-[#E8DCC4]/60 rounded-2xl border-2 border-[#D9B99B]">
            <div className="text-xs text-[#395B64] font-black mb-2 text-center">👉 請選擇你想操作的角色（兩者有不同的體型與水阻特性）：</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStage3Char('elasmosaurus')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition cursor-pointer ${
                  stage3Char === 'elasmosaurus'
                    ? 'bg-white border-[#395B64] shadow-md ring-2 ring-[#395B64]/40'
                    : 'bg-white/60 border-[#D9B99B] opacity-75 hover:opacity-100'
                }`}
              >
                <div className="w-20 h-12"><ElasmosaurusAvatar /></div>
                <span className="font-bold text-sm text-[#395B64] flex items-center gap-1">
                  薄板龍 {stage3Char === 'elasmosaurus' && <CheckCircle2 className="w-4 h-4 text-[#395B64]" />}
                </span>
                <span className="text-[11px] text-[#9B7E6F]">長頸巨大、判定範圍大、較慢</span>
              </button>

              <button
                type="button"
                onClick={() => setStage3Char('mosasaurus')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition cursor-pointer ${
                  stage3Char === 'mosasaurus'
                    ? 'bg-white border-[#A5C9CA] shadow-md ring-2 ring-[#A5C9CA]'
                    : 'bg-white/60 border-[#D9B99B] opacity-75 hover:opacity-100'
                }`}
              >
                <div className="w-18 h-12"><MosasaurusAvatar /></div>
                <span className="font-bold text-sm text-[#395B64] flex items-center gap-1">
                  滄龍 {stage3Char === 'mosasaurus' && <CheckCircle2 className="w-4 h-4 text-[#395B64]" />}
                </span>
                <span className="text-[11px] text-[#9B7E6F]">體型小巧、迅猛敏捷、水流飛快</span>
              </button>
            </div>
          </div>
        )}

        {/* Goal Tips */}
        <div className="p-3 bg-white/80 rounded-2xl border-2 border-[#D9B99B] text-xs text-[#5D4E42] flex items-start gap-2 my-2 shadow-sm font-medium">
          <Sparkles className="w-4 h-4 text-[#E67E22] shrink-0 mt-0.5" />
          <span>{content.goalText}</span>
        </div>

        {/* Enter Stage Button */}
        <motion.button
          id={`enter-stage-${stageNumber}-btn`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleEnter}
          className="mt-4 w-full py-4 bg-[#E67E22] hover:bg-[#D35400] text-white font-black text-lg sm:text-xl rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
        >
          <span>進入關卡</span>
          <Play className="w-5 h-5 fill-white" />
        </motion.button>
      </motion.div>
    </div>
  );
};

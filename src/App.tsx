import React, { useState } from 'react';
import { GameStage, Stage2Character, Stage3Character } from './types';
import { MainMenu } from './components/MainMenu';
import { StageIntroModal } from './components/StageIntroModal';
import { Stage1Game } from './components/Stage1Game';
import { Stage2Game } from './components/Stage2Game';
import { Stage3Game } from './components/Stage3Game';
import { Stage4Game } from './components/Stage4Game';
import { EndingCutscene } from './components/EndingCutscene';
import { HeaderNav } from './components/HeaderNav';
import { sound } from './utils/audio';

export default function App() {
  const [stage, setStage] = useState<GameStage>('MAIN_MENU');
  const [stage2Char, setStage2Char] = useState<Stage2Character>('archaeopteryx');
  const [stage3Char, setStage3Char] = useState<Stage3Character>('elasmosaurus');
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted((prev) => {
      sound.enabled = prev;
      return !prev;
    });
  };

  const getStageMetadata = (): { num?: number; name?: string } => {
    switch (stage) {
      case 'STAGE_1_INTRO':
      case 'STAGE_1_PLAY':
        return { num: 1, name: '小盜龍羽毛保暖' };
      case 'STAGE_2_INTRO':
      case 'STAGE_2_PLAY':
        return { num: 2, name: '始祖鳥與翼龍天空爭霸' };
      case 'STAGE_3_INTRO':
      case 'STAGE_3_PLAY':
        return { num: 3, name: '薄板龍與滄龍海洋掠食' };
      case 'STAGE_4_INTRO':
      case 'STAGE_4_PLAY':
        return { num: 4, name: '霸王龍伏擊美頜龍' };
      default:
        return {};
    }
  };

  const { num: currentStageNumber, name: stageName } = getStageMetadata();

  return (
    <div className="w-full h-screen max-h-screen flex flex-col bg-[#FAF3E0] font-sans text-[#4A3728] overflow-hidden select-none relative">
      {/* Top Header Navigation (Shown in all stages except Main Menu & Epilogue) */}
      {stage !== 'MAIN_MENU' && stage !== 'EPILOGUE' && (
        <HeaderNav
          currentStageNumber={currentStageNumber}
          stageName={stageName}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onHome={() => setStage('MAIN_MENU')}
        />
      )}

      {/* Main Game Container */}
      <main className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
        {/* 1. Main Menu (整體主進場畫面) */}
        {stage === 'MAIN_MENU' && (
          <MainMenu
            onStartGame={() => setStage('STAGE_1_INTRO')}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
        )}

        {/* 2. Stage 1 Intro Screen */}
        {stage === 'STAGE_1_INTRO' && (
          <StageIntroModal
            stageNumber={1}
            onEnterStage={() => setStage('STAGE_1_PLAY')}
          />
        )}

        {/* 3. Stage 1 Game: Microraptor Feather Gathering */}
        {stage === 'STAGE_1_PLAY' && (
          <Stage1Game
            onStagePass={() => setStage('STAGE_2_INTRO')}
            onRestartAll={() => setStage('STAGE_1_INTRO')}
            onHome={() => setStage('MAIN_MENU')}
          />
        )}

        {/* 4. Stage 2 Intro Screen */}
        {stage === 'STAGE_2_INTRO' && (
          <StageIntroModal
            stageNumber={2}
            onEnterStage={(char) => {
              if (char) setStage2Char(char as Stage2Character);
              setStage2Play();
            }}
          />
        )}

        {/* 5. Stage 2 Game: Sky Gliding Duel */}
        {stage === 'STAGE_2_PLAY' && (
          <Stage2Game
            playerCharacter={stage2Char}
            onStagePass={() => setStage('STAGE_3_INTRO')}
            onRestartAll={() => setStage('STAGE_1_INTRO')}
            onHome={() => setStage('MAIN_MENU')}
          />
        )}

        {/* 6. Stage 3 Intro Screen */}
        {stage === 'STAGE_3_INTRO' && (
          <StageIntroModal
            stageNumber={3}
            onEnterStage={(char) => {
              if (char) setStage3Char(char as Stage3Character);
              setStage3Play();
            }}
          />
        )}

        {/* 7. Stage 3 Game: Underwater Ocean Duel */}
        {stage === 'STAGE_3_PLAY' && (
          <Stage3Game
            playerCharacter={stage3Char}
            onStagePass={() => setStage('STAGE_4_INTRO')}
            onRestartAll={() => setStage('STAGE_1_INTRO')}
            onHome={() => setStage('MAIN_MENU')}
          />
        )}

        {/* 8. Stage 4 Intro Screen */}
        {stage === 'STAGE_4_INTRO' && (
          <StageIntroModal
            stageNumber={4}
            onEnterStage={() => setStage('STAGE_4_PLAY')}
          />
        )}

        {/* 9. Stage 4 Game: T-Rex Hunting Compsognathus */}
        {stage === 'STAGE_4_PLAY' && (
          <Stage4Game
            onStagePass={() => setStage('EPILOGUE')}
            onRestartAll={() => setStage('STAGE_1_INTRO')}
            onHome={() => setStage('MAIN_MENU')}
          />
        )}

        {/* 10. Epilogue & Meteor Destruction / Feather Morph Ending */}
        {stage === 'EPILOGUE' && (
          <EndingCutscene
            onRestart={() => setStage('STAGE_1_INTRO')}
            onHome={() => setStage('MAIN_MENU')}
            onSelectStage={(selected) => {
              if (selected === 1) setStage('STAGE_1_INTRO');
              if (selected === 2) setStage('STAGE_2_INTRO');
              if (selected === 3) setStage('STAGE_3_INTRO');
              if (selected === 4) setStage('STAGE_4_INTRO');
            }}
          />
        )}
      </main>
    </div>
  );

  function setStage2Play() {
    setStage('STAGE_2_PLAY');
  }

  function setStage3Play() {
    setStage('STAGE_3_PLAY');
  }
}

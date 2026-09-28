import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import "@fontsource-variable/inter";
import { Scene } from "./Scene";
import {
  HookScene,
  RecordingScene,
  AnalyzingScene,
  ResumeScene,
  ChatQAScene,
  ContextScene,
  OutroScene,
} from "./scenes";
import { colors } from "./theme";

const Q1 = {
  question: "Could the new antihypertensive be causing these headaches?",
  answer:
    "Possible. The medication change lines up with when the headaches started, and there's no other new trigger in sleep or screen habits reported today.",
};

const Q2 = {
  question: "Any allergy history I should factor in before adjusting the dose?",
  answer:
    "Yes — documented penicillin/amoxicillin allergy. Not relevant to antihypertensives, but flag it before prescribing anything new.",
};

export const BragVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.background }}>
      <Sequence from={0} durationInFrames={45}>
        <Scene durationInFrames={45} fadeFrames={10}>
          <HookScene />
        </Scene>
      </Sequence>

      <Sequence from={45} durationInFrames={120}>
        <Scene durationInFrames={120}>
          <RecordingScene linesShown={2} />
        </Scene>
      </Sequence>

      <Sequence from={165} durationInFrames={60}>
        <Scene durationInFrames={60}>
          <AnalyzingScene />
        </Scene>
      </Sequence>

      <Sequence from={225} durationInFrames={60}>
        <Scene durationInFrames={60}>
          <ResumeScene />
        </Scene>
      </Sequence>

      <Sequence from={285} durationInFrames={120}>
        <Scene durationInFrames={120}>
          <RecordingScene linesShown={4} instantCount={2} />
        </Scene>
      </Sequence>

      <Sequence from={405} durationInFrames={90}>
        <Scene durationInFrames={90}>
          <ChatQAScene question={Q1.question} answer={Q1.answer} questionAt={0} typingAt={12} answerAt={38} />
        </Scene>
      </Sequence>

      <Sequence from={495} durationInFrames={90}>
        <Scene durationInFrames={90}>
          <ChatQAScene
            question={Q2.question}
            answer={Q2.answer}
            questionAt={0}
            typingAt={12}
            answerAt={38}
            priorQuestion={Q1.question}
            priorAnswer={Q1.answer}
          />
        </Scene>
      </Sequence>

      <Sequence from={585} durationInFrames={75}>
        <Scene durationInFrames={75}>
          <ContextScene />
        </Scene>
      </Sequence>

      <Sequence from={660} durationInFrames={90}>
        <Scene durationInFrames={90} fadeFrames={15}>
          <OutroScene />
        </Scene>
      </Sequence>
    </AbsoluteFill>
  );
};

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

// envoltorio compartido: fade in/out suave al entrar/salir de cada escena,
// para no cortar en seco (evita el "doble expuesto" al superponer escenas).
export const Scene: React.FC<{
  durationInFrames: number;
  fadeFrames?: number;
  children: React.ReactNode;
}> = ({ durationInFrames, fadeFrames = 12, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <div style={{ width: "100%", height: "100%", opacity }}>{children}</div>
  );
};

export function typedSubstring(text: string, frame: number, startFrame: number, charsPerFrame: number) {
  const elapsed = Math.max(0, frame - startFrame);
  const count = Math.floor(elapsed * charsPerFrame);
  return text.slice(0, Math.min(text.length, count));
}

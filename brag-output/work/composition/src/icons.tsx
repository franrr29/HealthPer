import React from "react";

// iconos minimos inline (mismo trazo que lucide-react, que es lo que usa el
// producto real) para no depender de la resolucion de paquetes de iconos
// dentro del bundler de Remotion.
const base = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const MicIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color ?? base.stroke}>
    <rect x="9" y="2" width="6" height="11" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
);

export const PauseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color ?? base.stroke}>
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

export const SparklesIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color ?? base.stroke}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </svg>
);

export const MessageIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color ?? base.stroke}>
    <path d="M12 3a9 3 0 0 0 0 6h.5a9 3 0 0 0 -.5-6z" />
    <path d="M21 12c0 4.4-4 8-9 8-1.1 0-2.2-.2-3.1-.5L3 21l1.6-4.1C3.6 15.7 3 13.9 3 12c0-4.4 4-8 9-8s9 3.6 9 8Z" />
  </svg>
);

export const BotIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color ?? base.stroke}>
    <rect x="4" y="8" width="16" height="12" rx="3" />
    <path d="M12 8V4" />
    <circle cx="12" cy="3" r="1" fill={color ?? base.stroke} />
    <circle cx="9" cy="14" r="1.2" fill={color ?? base.stroke} />
    <circle cx="15" cy="14" r="1.2" fill={color ?? base.stroke} />
    <path d="M2 14h2M20 14h2" />
  </svg>
);

export const BrainIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color ?? base.stroke}>
    <path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3" />
    <path d="M15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3" />
    <path d="M9 3v18M15 3v18" />
  </svg>
);

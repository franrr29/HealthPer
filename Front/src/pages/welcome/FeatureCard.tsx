import React from "react";

interface FeatureCardProps {
  step: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  alt: string;
  title: string;
  description: string;
  isLast?: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  step,
  icon: Icon,
  image,
  alt,
  title,
  description,
  isLast = false,
}) => {
  return (
    <div className="group relative flex flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:gap-10">
      {/* marcador liquid glass, arriba de la card en mobile, a la izquierda en desktop + linea conectora */}
      <div className="flex shrink-0 flex-col items-center">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/30 shadow-[0_8px_20px_rgba(47,59,53,0.35)] backdrop-blur-md transition-all duration-300 group-hover:border-[#E9DEC8]/70 group-hover:bg-[#E9DEC8]/90">
          {/* brillo superior, efecto liquid glass */}
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/80 via-white/10 to-transparent" aria-hidden="true" />
          <Icon className="relative h-5 w-5 text-[#4C5F54] transition-colors duration-300 group-hover:text-[#2F3B35]" />
        </div>
        {!isLast && (
          <div className="mt-2 hidden w-px flex-1 bg-gradient-to-b from-white/30 to-white/10 sm:block" aria-hidden="true" />
        )}
      </div>

      {/* contenido: una sola card unificada, texto e imagen juntos, centrada en mobile */}
      <div className={isLast ? "w-full max-w-md sm:max-w-none sm:flex-1" : "w-full max-w-md pb-8 sm:max-w-none sm:flex-1 sm:pb-10"}>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-5 sm:items-stretch">
            <div className="flex flex-col justify-center p-6 sm:col-span-2 sm:p-8">
              <span className="font-mono text-sm font-semibold tracking-wide text-[#5E7367]">
                {step}
              </span>
              <h3 className="mt-2 font-feature text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#535B4F]">
                {description}
              </p>
            </div>

            <div className="sm:col-span-3">
              <img
                src={image}
                alt={alt}
                className="aspect-[16/10] h-full w-full object-cover sm:aspect-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

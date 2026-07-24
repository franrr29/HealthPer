import React from "react";

interface FeatureCardProps {
  step: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  alt: string;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  step,
  icon: Icon,
  image,
  alt,
  title,
  description,
}) => {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-300/80 bg-slate-100 shadow-[8px_8px_18px_#cbd5e1,-8px_-8px_18px_#ffffff] transition-all duration-300 hover:-translate-y-1 hover:border-slate-400/80 hover:shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff]">
      
      {/* frame de la imagen */}
      <div className="relative aspect-[3/2] overflow-hidden border-b border-slate-300/60 bg-slate-200">
        <img
          src={image}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      {/* contenido textual y cabecera de paso */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          {/* indicador de pipeline (paso + icono) */}
          <div className="flex items-center justify-between pb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
              Step {step}
            </span>
            
            {/* contenedor de icono neumorfico rehundido con borde */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300/60 bg-slate-100 shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff] transition-transform duration-300 group-hover:scale-105">
              <Icon className="h-5 w-5 text-blue-500" />
            </div>
          </div>

          {/* jerarquia tipografica */}
          <h3 className="mt-1 text-lg font-bold text-slate-800 sm:text-xl">
            {title}
          </h3>

          <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
            {description}
          </p>
        </div>

        {/* tag funcional inferior */}
        <div className="mt-6 flex items-center gap-2 pt-2 text-xs font-semibold text-slate-400">
          <span>Pipeline Stage {step}</span>
        </div>
      </div>
    </div>
  );
};
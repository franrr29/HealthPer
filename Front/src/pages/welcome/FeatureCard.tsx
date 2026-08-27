interface FeatureCardProps {
  step: string;
  image: string;
  alt: string;
  title: string;
  description: string;
}

export function FeatureCard({ step, image, alt, title, description }: FeatureCardProps) {
  const reversed = Number(step) % 2 === 0;

  return (
    <div className="border-t border-white/10 py-12 first:border-t-0 sm:py-16">
      <div className="grid gap-8 sm:grid-cols-12 sm:items-center sm:gap-16">
        <div className={`sm:col-span-5 ${reversed ? "sm:order-2" : ""}`}>
          <span className="font-feature text-6xl font-black leading-none text-white/10 sm:text-7xl">
            {step}
          </span>
          <h3 className="-mt-4 font-feature text-2xl font-bold text-white sm:text-3xl">
            {title}
          </h3>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400 sm:text-base">
            {description}
          </p>
        </div>

        <div className={`sm:col-span-7 ${reversed ? "sm:order-1" : ""}`}>
          <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/40">
            <img
              src={image}
              alt={alt}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

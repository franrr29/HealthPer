import { STACK_ITEMS } from "./welcomeData";

export function MarqueeSection() {
  return (
    <section className="overflow-hidden border-b border-bp-divider py-7">
      <div className="iw-marquee flex gap-14 whitespace-nowrap font-display text-xl font-semibold uppercase tracking-[0.06em] text-bp-text/65">
        {[0, 1].map((rep) => (
          <span key={rep} className="flex gap-14">
            {STACK_ITEMS.map((item) => (
              <span key={item}>◆ {item}</span>
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}

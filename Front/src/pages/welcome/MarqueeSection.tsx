import { STACK_ITEMS } from "./welcomeData";

export function MarqueeSection() {
  return (
    <section className="overflow-hidden border-y border-hp-hair bg-hp-paper-2 py-7">
      <div className="hp-marquee flex gap-14 whitespace-nowrap text-xl font-semibold uppercase tracking-[0.06em] text-hp-ink-2">
        {[0, 1].map((rep) => (
          <span key={rep} className="flex gap-14">
            {STACK_ITEMS.map((item) => (
              <span key={item} className="text-hp-clinic">
                ◆ <span className="text-hp-ink-2">{item}</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}

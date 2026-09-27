import { MarqueeSection } from "./MarqueeSection";
import { WorkflowSection } from "./WorkflowSection";
import { StackSection } from "./StackSection";
import { ProductSection } from "./ProductSection";
import { MetricsSection } from "./MetricsSection";
import { DecisionsSection } from "./DecisionsSection";
import { CtaCloseSection } from "./CtaCloseSection";

export function WelcomeSections() {
  return (
    <>
      <MarqueeSection />
      <WorkflowSection />
      <StackSection />
      <ProductSection />
      <MetricsSection />
      <DecisionsSection />
      <CtaCloseSection />
    </>
  );
}

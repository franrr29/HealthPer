import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

interface Props {
  words: string[];
  interval?: number;
}

export function RotatingText({ words, interval = 1800 }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
<span className="inline-block text-blue-700 overflow-hidden align-bottom whitespace-nowrap" style={{ height: "1.15em" }}>      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
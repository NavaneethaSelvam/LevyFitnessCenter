import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

type StatCounterProps = {
  value: number;
  suffix?: string;
  label: string;
};

export default function StatCounter({ value, suffix = "", label }: StatCounterProps) {
  const count = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState("00");

  useMotionValueEvent(count, "change", (current) => {
    setDisplayValue(Math.round(current).toString().padStart(2, "0"));
  });

  useEffect(() => {
    if (reduceMotion) {
      count.set(value);
      return;
    }

    const controls = animate(count, value, { duration: 1.4, ease: "easeOut" });
    return controls.stop;
  }, [count, reduceMotion, value]);

  return (
    <div className="stat-counter">
      <motion.span className="stat-counter__value">
        {displayValue}
        {suffix}
      </motion.span>
      <span className="stat-counter__label">{label}</span>
    </div>
  );
}

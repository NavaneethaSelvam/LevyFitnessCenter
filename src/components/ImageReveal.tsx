import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

type ImageRevealProps = {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
};

export default function ImageReveal({
  src,
  alt,
  className = "",
  eager = false,
}: ImageRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`image-reveal ${className}`.trim()}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 620px) 100vw, 55vw"
        priority={eager}
      />
    </motion.div>
  );
}

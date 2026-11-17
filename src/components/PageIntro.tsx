import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  imageSrc: string;
  imageAlt: string;
  videoSrc?: string;
  index?: string;
};

export default function PageIntro({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  videoSrc,
  index,
}: PageIntroProps) {
  const reduceMotion = useReducedMotion();
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 621px)");
    const updatePlayback = () => {
      setPlayVideo(desktop.matches && !reduceMotion);
    };
    updatePlayback();
    desktop.addEventListener("change", updatePlayback);

    return () => desktop.removeEventListener("change", updatePlayback);
  }, [reduceMotion]);

  return (
    <motion.section
      className={`page-intro content-width${videoSrc ? " page-intro--video" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="page-intro__body">
        <p className="eyebrow">
          <ArrowDown size={14} aria-hidden="true" />
          {eyebrow}
        </p>
        <h1>{title}</h1>
        <p className="page-intro__description">{description}</p>
      </div>
      <motion.div
        className="page-intro__media"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 900px) 48vw, 46vw"
        />
        {videoSrc && (
          <video
            className="page-intro__video"
            autoPlay={playVideo}
            muted
            loop
            playsInline
            preload={playVideo ? "metadata" : "none"}
            poster={imageSrc}
            aria-hidden="true"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </motion.div>
      {index && <span className="page-intro__index">{index} / 07</span>}
    </motion.section>
  );
}

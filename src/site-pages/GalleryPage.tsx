"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import ActionLink from "../components/ActionLink";
import PageIntro from "../components/PageIntro";
import PageMeta from "../components/PageMeta";
import Reveal from "../components/Reveal";
import { galleryItems } from "../data/site";

const filters = ["All", "Spaces", "Training", "Equipment"];
type GalleryItem = (typeof galleryItems)[number];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const visibleImages =
    activeFilter === "All"
      ? galleryItems
      : galleryItems.filter((image) => image.category === activeFilter);

  useEffect(() => {
    if (!selectedImage) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
      if (event.key === "Tab") {
        event.preventDefault();
        closeButton.current?.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      previousFocus?.focus();
    };
  }, [selectedImage]);

  return (
    <>
      <PageMeta
        title="Gallery"
        description="Explore the Levy Fitness Center spaces, equipment, and training imagery."
      />
      <PageIntro
        eyebrow="Inside Levy"
        title={
          <>
            A space to
            <br />
            <em>find your focus.</em>
          </>
        }
        description="A visual look at the Levy image library: training, equipment, and the details of the space."
        imageSrc="/images/gym/gallery-hero.jpg"
        imageAlt="Athlete lifting a barbell in a dimly lit gym"
        videoSrc="/videos/gym-neon-workout.mp4"
        index="06"
      />

      <section className="gallery-page content-width">
        <Reveal className="gallery-toolbar">
          <p>Scenes from the training floor</p>
          <div className="gallery-filters" role="group" aria-label="Filter gallery">
            {filters.map((filter) => (
              <button
                className={`gallery-filter${activeFilter === filter ? " gallery-filter--active" : ""}`}
                key={filter}
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="gallery-grid">
          {visibleImages.map((item, index) => (
            <Reveal
              className={`gallery-card gallery-card--${index % 3 + 1}`}
              delay={(index % 3) * 0.06}
              duration={0.6}
              key={item.image}
            >
              <button
                type="button"
                className="gallery-card__button"
                onClick={() => setSelectedImage(item)}
                aria-label={`View image: ${item.title}`}
              >
                <Image src={item.image} alt={item.alt} fill sizes="(max-width: 620px) 50vw, 33vw" />
                <span className="gallery-card__overlay">
                  <span>
                    <small>{item.category}</small>
                    <strong>{item.title}</strong>
                  </span>
                  <span className="gallery-card__open">
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="gallery-note content-width">
        <div>
          <span className="eyebrow">Image library</span>
          <p>
            These visuals are drawn from the existing Levy project assets.
            Replace or expand them with approved, current facility photography
            when available.
          </p>
        </div>
        <ActionLink to="/contact" variant="text">
          Ask us a question
        </ActionLink>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedImage(null);
            }}
          >
            <motion.div
              className="lightbox__panel"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: reduceMotion ? 0 : 0.24 }}
            >
              <button
                className="lightbox__close"
                type="button"
                onClick={() => setSelectedImage(null)}
                aria-label="Close image preview"
                ref={closeButton}
              >
                <X size={20} aria-hidden="true" />
              </button>
              <Image
                src={selectedImage.image}
                alt={selectedImage.alt}
                width={1600}
                height={1100}
                sizes="(max-width: 900px) 100vw, 1000px"
              />
              <div className="lightbox__caption">
                <div>
                  <span className="eyebrow">{selectedImage.category}</span>
                  <h2 id="lightbox-title">{selectedImage.title}</h2>
                </div>
                <span>{String(galleryItems.indexOf(selectedImage) + 1).padStart(2, "0")} / 06</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

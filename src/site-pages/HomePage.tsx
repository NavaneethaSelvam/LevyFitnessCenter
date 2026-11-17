"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CirclePlay,
  MoveUpRight,
} from "lucide-react";
import Link from "next/link";
import ActionLink from "../components/ActionLink";
import ImageReveal from "../components/ImageReveal";
import PageMeta from "../components/PageMeta";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import StatCounter from "../components/StatCounter";
import {
  homeGalleryItems,
  homeProgramImages,
  programs,
} from "../data/site";

const reasons = [
  {
    number: "01",
    title: "Progress over pressure",
    copy: "Build a routine around where you are now, then move forward one considered session at a time.",
  },
  {
    number: "02",
    title: "A space to focus",
    copy: "Step away from the noise and give your training the room, attention, and energy it deserves.",
  },
  {
    number: "03",
    title: "Your pace, your path",
    copy: "Explore a range of training directions and find the one that feels right for your goals.",
  },
];

function HomeHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="home-hero">
      <motion.div
        className="home-hero__media"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.035 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <picture className="home-hero__poster">
          <img
            src="/images/gym/hero-male-athlete.jpg"
            alt=""
            fetchPriority="high"
          />
        </picture>
      </motion.div>
      <div className="home-hero__shade" />
      <div className="home-hero__content content-width">
        <motion.p
          className="eyebrow home-hero__eyebrow"
          initial={reduceMotion ? false : { opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.1 }}
        >
          Levy Fitness Center <span className="eyebrow__dash" /> Train with intent
        </motion.p>
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.18 }}
        >
          STRONGER
          <br />
          <span>STARTS</span> HERE.
        </motion.h1>
        <motion.div
          className="home-hero__bottom"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.38 }}
        >
          <p>
            A focused space to build strength, find your rhythm, and make
            movement part of your life.
          </p>
          <div className="button-row">
            <ActionLink to="/programs">Explore programs</ActionLink>
            <ActionLink to="/about" variant="outline">
              Discover Levy
            </ActionLink>
          </div>
        </motion.div>
      </div>
      <div className="home-hero__side-label" aria-hidden="true">
        <span>Move with purpose</span>
        <span className="home-hero__side-line" />
        <span>01 — 07</span>
      </div>
      <a className="home-hero__scroll" href="#intro">
        <span>Scroll to explore</span>
        <ArrowDown size={15} aria-hidden="true" />
      </a>
    </section>
  );
}

function MembershipBanner() {
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
    <section className="membership-banner">
      <div className="membership-banner__image" aria-hidden="true">
        <Image
          src="/images/home/membership-callout.jpg"
          alt=""
          fill
          sizes="100vw"
        />
        <video
          className="membership-banner__video"
          autoPlay={playVideo}
          muted
          loop
          playsInline
          preload={playVideo ? "metadata" : "none"}
          poster="/images/home/membership-callout.jpg"
          aria-hidden="true"
        >
          <source src="/videos/hero-gym.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="membership-banner__shade" />
      <Reveal className="membership-banner__content content-width">
        <p className="eyebrow">Your next chapter starts here</p>
        <h2>
          Make room
          <br />
          <em>for progress.</em>
        </h2>
        <p>
          Explore membership plans from 1 to 12 months and contact Levy to
          confirm availability.
        </p>
        <ActionLink to="/membership">Explore membership</ActionLink>
      </Reveal>
      <span className="membership-banner__index" aria-hidden="true">
        LFC / 06
      </span>
      <span className="membership-banner__play" aria-hidden="true">
        <CirclePlay size={18} strokeWidth={1.4} />
        <span>Strength in motion</span>
      </span>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <PageMeta
        title="Train for what's next"
        description="Find your focus at Levy Fitness Center. Explore strength, personal training, cardio, and more."
      />
      <HomeHero />

      <div className="ticker" aria-label="Train with purpose. Progress at your pace.">
        <div className="ticker__track" aria-hidden="true">
          {Array.from({ length: 4 }, (_, index) => (
            <span className="ticker__item" key={index}>
              Train with purpose <i /> Progress at your pace <i /> Built around
              you <i />
            </span>
          ))}
        </div>
      </div>

      <section className="section intro-section content-width" id="intro">
        <Reveal className="intro-section__visual">
          <ImageReveal
            className="image-reveal--intro"
            src="/images/home/intro-training-floor.jpg"
            alt="Open view across a gym training floor"
          />
          <span className="image-index">LFC / 01</span>
          <div className="intro-section__stamp" aria-hidden="true">
            <span>Make</span>
            <span>space</span>
            <span>for you.</span>
          </div>
        </Reveal>
        <Reveal className="intro-section__copy" delay={0.1}>
          <p className="eyebrow">
            <ArrowDown size={14} aria-hidden="true" />
            More than a workout
          </p>
          <h2>
            Find your
            <br />
            <em>strong.</em>
          </h2>
          <p className="large-copy">
            Training is personal. Levy is a place to tune out the noise, move
            with purpose, and keep showing up for yourself.
          </p>
          <p className="body-copy">
            From a first session to a new personal best, the best progress is
            the kind you can make your own. Start with a direction, stay curious,
            and let consistency do its work.
          </p>
          <ActionLink to="/about" variant="text">
            Get to know Levy
          </ActionLink>
        </Reveal>
      </section>

      <section className="section programs-section">
        <div className="content-width">
          <Reveal className="section-heading-row">
            <SectionHeading
              eyebrow="Choose your direction"
              title={
                <>
                  Find the work
                  <br />
                  <em>that moves you.</em>
                </>
              }
              copy="Different goals call for different ways to train. Find a starting point and make it your own."
            />
            <ActionLink to="/programs" variant="outline">
              All programs
            </ActionLink>
          </Reveal>
          <div className="program-grid program-grid--home">
            {programs.slice(0, 3).map((program, index) => (
              <Reveal
                className="program-card-wrap"
                delay={index * 0.08}
                duration={0.6}
                key={program.number}
              >
                <Link
                  className="program-card"
                  href="/programs"
                  aria-label={`Explore ${program.title}`}
                >
                  <div className="program-card__image">
                    <Image
                      src={homeProgramImages[program.number]}
                      alt=""
                      fill
                      sizes="(max-width: 620px) 100vw, (max-width: 820px) 50vw, 33vw"
                    />
                    <span className="program-card__number">{program.number}</span>
                    <span className="program-card__arrow">
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="program-card__body">
                    <p className="eyebrow">{program.category}</p>
                    <h3>{program.title}</h3>
                    <p>{program.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section reasons-section">
        <div className="content-width reasons-layout">
          <Reveal className="reasons-layout__copy">
            <SectionHeading
              eyebrow="The Levy mindset"
              title={
                <>
                  No shortcuts.
                  <br />
                  <em>Just good work.</em>
                </>
              }
              copy="A better routine begins with the right environment and a reason to return."
            />
            <div className="reason-list">
              {reasons.map((reason) => (
                <article className="reason-item" key={reason.number}>
                  <span>{reason.number}</span>
                  <div>
                    <h3>{reason.title}</h3>
                    <p>{reason.copy}</p>
                  </div>
                  <MoveUpRight size={17} aria-hidden="true" />
                </article>
              ))}
            </div>
            <ActionLink to="/about" variant="text">
              Our philosophy
            </ActionLink>
          </Reveal>
          <Reveal className="reasons-layout__visual" delay={0.12}>
            <ImageReveal
              className="image-reveal--portrait"
              src="/images/home/equipment-detail.jpg"
              alt="Close detail of strength-training equipment"
            />
            <div className="image-caption">
              <span>01 / Stay present</span>
              <span>Every rep is a reset.</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="stat-band">
        <div className="content-width">
          <Reveal className="stat-band__intro">
            <p className="eyebrow">A framework for your next chapter</p>
            <p>
              A few ways into the work. The rest is yours to shape.
            </p>
          </Reveal>
          <div className="stat-band__grid">
            <StatCounter value={6} label="training pathways" />
            <StatCounter value={3} label="editable plan frameworks" />
            <StatCounter value={7} label="pages to explore" />
          </div>
          <p className="stat-band__note">
            Website framework counts only; confirm actual services and plans
            with Levy Fitness Center before publishing.
          </p>
        </div>
      </section>

      <section className="section coach-section">
        <div className="content-width coach-layout">
          <Reveal className="coach-layout__visual">
            <ImageReveal
              className="image-reveal--coach"
              src="/images/home/coaching-session.jpg"
              alt="A coach supporting an athlete during a strength exercise"
            />
            <span className="image-index">COACHING / 01</span>
          </Reveal>
          <Reveal className="coach-layout__copy" delay={0.1}>
            <SectionHeading
              eyebrow="Better with guidance"
              title={
                <>
                  A little focus
                  <br />
                  <em>goes a long way.</em>
                </>
              }
              copy="Find a training approach that fits. Personal coaching information and trainer profiles will be confirmed by the Levy team."
            />
            <div className="coach-note">
              <span className="coach-note__marker">LFC</span>
              <p>
                Meet the people behind the practice once verified coach
                profiles are available.
              </p>
            </div>
            <ActionLink to="/trainers" variant="text">
              Explore trainer profiles
            </ActionLink>
          </Reveal>
        </div>
      </section>

      <section className="section gallery-preview">
        <div className="content-width">
          <Reveal className="section-heading-row">
            <SectionHeading
              eyebrow="Inside Levy"
              title={
                <>
                  A closer
                  <br />
                  <em>look around.</em>
                </>
              }
              copy="A few details from the training floor and the spaces between sets."
            />
            <ActionLink to="/gallery" variant="outline">
              View the gallery
            </ActionLink>
          </Reveal>
          <div className="gallery-preview__grid">
            {homeGalleryItems.map((item, index) => (
              <Reveal
                className={`gallery-preview__item gallery-preview__item--${index + 1}`}
                delay={index * 0.08}
                duration={0.6}
                key={item.image}
              >
                <Link href="/gallery" aria-label={`Open gallery: ${item.title}`}>
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 620px) 100vw, 40vw"
                  />
                  <span>{item.title}</span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MembershipBanner />

      <section className="section testimonial-section">
        <div className="content-width testimonial-layout">
          <Reveal className="testimonial-layout__label">
            <p className="eyebrow">Member voices</p>
            <span>Stories worth sharing.</span>
          </Reveal>
          <Reveal className="testimonial-layout__quote" delay={0.1}>
            <span className="quote-mark" aria-hidden="true">
              “
            </span>
            <blockquote>
              The best progress is the one that feels like yours.
            </blockquote>
            <p>
              Member testimonials will be added here after Levy Fitness Center
              provides approved stories and permissions.
            </p>
            <span className="testimonial-layout__byline">Member story / pending approval</span>
          </Reveal>
        </div>
      </section>

      <section className="contact-strip">
        <div className="content-width contact-strip__inner">
          <div>
            <p className="eyebrow">Make your move</p>
            <h2>Have a question?</h2>
            <p>Talk through your goals, or find out when membership details are ready.</p>
          </div>
          <div className="button-row">
            <ActionLink to="/contact">Contact Levy</ActionLink>
            <Link className="text-link" href="/membership">
              Membership details <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

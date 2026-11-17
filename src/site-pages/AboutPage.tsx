"use client";

import { ArrowDownRight, Compass, Target, Waves } from "lucide-react";
import Image from "next/image";
import ActionLink from "../components/ActionLink";
import ImageReveal from "../components/ImageReveal";
import PageIntro from "../components/PageIntro";
import PageMeta from "../components/PageMeta";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

const principles = [
  {
    icon: Target,
    title: "Progress is personal",
    copy: "Your starting point is yours. Focus on good movement, repeatable effort, and the next step that makes sense for you.",
  },
  {
    icon: Compass,
    title: "Direction over noise",
    copy: "Choose a goal, build a routine, and give yourself room to learn as you go. There is no single path to feeling stronger.",
  },
  {
    icon: Waves,
    title: "Consistency creates change",
    copy: "Small sessions add up. A steady practice can become part of the way you live, not another short-lived challenge.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageMeta
        title="About us"
        description="Discover Levy Fitness Center's approach to focused, personal, sustainable training."
      />
      <PageIntro
        eyebrow="The Levy point of view"
        title={
          <>
            Built for the
            <br />
            <em>work that matters.</em>
          </>
        }
        description="A fitness center should make it easier to focus, feel supported, and return to the work. That is the standard behind the Levy experience."
        imageSrc="/images/gym/about-gym-interior.jpg"
        imageAlt="Modern gym interior with strength and cardio equipment"
        index="02"
      />

      <section className="about-lead content-width">
        <Reveal className="about-lead__visual">
          <ImageReveal
            className="image-reveal--wide"
            src="/images/about/training-floor.jpg"
            alt="Strength and cardio equipment across a gym training floor"
            eager
          />
          <span className="image-index">THE SPACE / 01</span>
        </Reveal>
        <Reveal className="about-lead__copy" delay={0.1}>
          <p className="eyebrow">A place to come back to</p>
          <h2>
            Make training
            <br />
            <em>your own.</em>
          </h2>
          <p className="large-copy">
            Levy Fitness Center is a name for a simple idea: show up with
            intention, move at your own pace, and leave a little stronger than
            you arrived.
          </p>
          <p className="body-copy">
            Whether you are finding your feet or refining a familiar practice,
            there is value in having a space dedicated to your progress. The
            details of the Levy offer can be shaped around the people who train
            here.
          </p>
          <ActionLink to="/programs" variant="text">
            Find a training direction
          </ActionLink>
        </Reveal>
      </section>

      <section className="section mission-section">
        <div className="content-width">
          <Reveal className="section-heading-row">
            <SectionHeading
              eyebrow="Mission / vision"
              title={
                <>
                  A stronger
                  <br />
                  <em>everyday.</em>
                </>
              }
              copy="An invitation to make movement a practice you can return to."
            />
            <span className="mission-section__index">LFC — EST. / TO BE CONFIRMED</span>
          </Reveal>
          <div className="mission-grid">
            <Reveal className="mission-card" duration={0.6}>
              <span className="mission-card__number">01 / MISSION</span>
              <h3>Make space for progress.</h3>
              <p>
                Create a welcoming, focused training environment where people
                can explore movement, build confidence, and work toward goals
                that are meaningful to them.
              </p>
            </Reveal>
            <Reveal
              className="mission-card mission-card--lime"
              delay={0.08}
              duration={0.6}
            >
              <span className="mission-card__number">02 / VISION</span>
              <h3>Make strength part of life.</h3>
              <p>
                Shape a fitness culture where consistency, care, and personal
                progress matter more than comparison or quick fixes.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section philosophy-section content-width">
        <Reveal className="philosophy-section__intro">
          <SectionHeading
            eyebrow="Our philosophy"
            title={
              <>
                Less noise.
                <br />
                <em>More intention.</em>
              </>
            }
          />
        </Reveal>
        <div className="principle-list">
          {principles.map(({ icon: Icon, title, copy }, index) => (
            <Reveal className="principle-row" delay={index * 0.06} key={title}>
              <span className="principle-row__icon">
                <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="principle-row__number">0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
              <ArrowDownRight size={17} aria-hidden="true" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section facilities-section">
        <div className="content-width facilities-layout">
          <Reveal className="facilities-layout__copy">
            <SectionHeading
              eyebrow="The training environment"
              title={
                <>
                  Room to
                  <br />
                  <em>get focused.</em>
                </>
              }
              copy="The current Levy image library highlights three parts of the experience: a strength floor, cardio equipment, and space to move."
            />
            <div className="facility-notes">
              <div>
                <span>01</span>
                <p>Strength and resistance training</p>
              </div>
              <div>
                <span>02</span>
                <p>Cardio equipment and conditioning</p>
              </div>
              <div>
                <span>03</span>
                <p>Group movement and functional work</p>
              </div>
            </div>
            <p className="small-note">
              Opening hours, amenities, and facility availability should be
              confirmed by the Levy team before publication.
            </p>
          </Reveal>
          <Reveal className="facilities-layout__image" delay={0.1}>
            <ImageReveal
              className="image-reveal--facilities"
              src="/images/about/strength-space.jpg"
              alt="Strength equipment arranged in a gym"
            />
            <span className="image-index">DETAIL / 02</span>
          </Reveal>
        </div>
      </section>

      <section className="about-atmosphere">
        <div className="about-atmosphere__image">
          <Image
            src="/images/about/training-atmosphere.jpg"
            alt="Athletes taking a quiet moment between gym sessions"
            fill
            sizes="100vw"
          />
        </div>
        <div className="about-atmosphere__shade" />
        <Reveal className="about-atmosphere__copy content-width">
          <p className="eyebrow">The atmosphere</p>
          <blockquote>
            Come in with a goal.
            <br />
            Leave with momentum.
          </blockquote>
          <span>LEVY / TRAIN WITH INTENT</span>
        </Reveal>
      </section>

      <section className="contact-strip">
        <div className="content-width contact-strip__inner">
          <div>
            <p className="eyebrow">Start where you are</p>
            <h2>Make your next move.</h2>
            <p>Tell us what you are working toward and we’ll help you find a starting point.</p>
          </div>
          <ActionLink to="/contact">Talk to Levy</ActionLink>
        </div>
      </section>
    </>
  );
}

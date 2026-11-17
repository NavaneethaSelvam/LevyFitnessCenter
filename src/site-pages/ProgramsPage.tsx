"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ActionLink from "../components/ActionLink";
import PageIntro from "../components/PageIntro";
import PageMeta from "../components/PageMeta";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { programs } from "../data/site";

export default function ProgramsPage() {
  return (
    <>
      <PageMeta
        title="Programs"
        description="Explore strength, personal training, weight management, muscle building, cardio, and functional fitness directions."
      />
      <PageIntro
        eyebrow="Find your focus"
        title={
          <>
            Choose a path.
            <br />
            <em>Make it yours.</em>
          </>
        }
        description="Different goals, different starting points. Explore the training directions below and ask the Levy team about current availability and coaching."
        imageSrc="/images/gym/programs-hero-athlete.jpg"
        imageAlt="Athlete preparing for a strength workout in a gym"
        videoSrc="/videos/strength-training.mp4"
        index="03"
      />

      <section className="programs-page content-width">
        <Reveal className="programs-page__note">
          <span className="programs-page__note-mark">LFC</span>
          <p>
            Program descriptions are an editorial starting point. Session
            formats, schedules, and availability should be confirmed directly
            with Levy Fitness Center.
          </p>
        </Reveal>
        <div className="program-grid program-grid--full">
          {programs.map((program, index) => (
            <Reveal
              className="program-card-wrap"
              delay={(index % 3) * 0.06}
              duration={0.6}
              key={program.number}
            >
              <Link
                className="program-card program-card--large"
                href={`/contact?topic=${encodeURIComponent(program.title)}`}
                aria-label={`Ask about ${program.title}`}
              >
                <div className="program-card__image">
                  <Image
                    src={program.image}
                    alt=""
                    fill
                    sizes="(max-width: 620px) 100vw, (max-width: 820px) 50vw, 33vw"
                  />
                  <span className="program-card__number">{program.number}</span>
                  <span className="program-card__arrow">
                    <ArrowUpRight size={19} aria-hidden="true" />
                  </span>
                </div>
                <div className="program-card__body">
                  <p className="eyebrow">{program.category}</p>
                  <h2>{program.title}</h2>
                  <p>{program.description}</p>
                  <span className="program-card__link">
                    Ask about this program <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section program-principles">
        <div className="content-width program-principles__layout">
          <Reveal>
            <SectionHeading
              eyebrow="A better starting point"
              title={
                <>
                  Start with
                  <br />
                  <em>what matters.</em>
                </>
              }
              copy="Your goals, experience, and time all shape the right approach."
            />
          </Reveal>
          <Reveal className="program-principles__steps" delay={0.08}>
            <div>
              <span>01</span>
              <h3>Choose a direction</h3>
              <p>Pick a focus that feels relevant to you right now.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Ask the right questions</h3>
              <p>Confirm current services, coaching formats, and schedules.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Build a repeatable routine</h3>
              <p>Progress comes from showing up in a way you can sustain.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="contact-strip">
        <div className="content-width contact-strip__inner">
          <div>
            <p className="eyebrow">Need a little direction?</p>
            <h2>Let’s find your starting point.</h2>
            <p>Ask about a program or share the goal you have in mind.</p>
          </div>
          <ActionLink to="/contact?topic=Training%20programs">
            Make an enquiry
          </ActionLink>
        </div>
      </section>
    </>
  );
}

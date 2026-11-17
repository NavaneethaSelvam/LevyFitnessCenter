"use client";

import Image from "next/image";
import ActionLink from "../components/ActionLink";
import PageIntro from "../components/PageIntro";
import PageMeta from "../components/PageMeta";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { trainerPlaceholders } from "../data/site";

export default function TrainersPage() {
  return (
    <>
      <PageMeta
        title="Trainers"
        description="Meet the Levy Fitness Center coaching team. Profiles and qualifications will be added when confirmed."
      />
      <PageIntro
        eyebrow="The people behind the practice"
        title={
          <>
            Good coaching
            <br />
            <em>starts with listening.</em>
          </>
        }
        description="Explore sample coaching specializations and experience levels. Replace these examples with verified Levy trainer profiles before publishing."
        imageSrc="/images/gym/trainer-male-portrait.jpg"
        imageAlt="Fitness professional in a contemporary gym"
        index="05"
      />

      <section className="trainers-page content-width">
        <Reveal className="placeholder-banner">
          <span className="placeholder-banner__mark">LFC</span>
          <p>
            <strong>Sample profiles:</strong> these example specializations
            and experience levels are for layout only. Confirm all coach
            details and approved portraits with Levy before publishing.
          </p>
        </Reveal>
        <div className="trainer-grid">
          {trainerPlaceholders.map((trainer, index) => (
            <Reveal
              className="trainer-card"
              delay={index * 0.08}
              duration={0.6}
              key={trainer.image}
            >
              <div className="trainer-card__image">
                <Image
                  src={trainer.image}
                  alt={trainer.alt}
                  fill
                  sizes="(max-width: 620px) 100vw, 33vw"
                />
                <span>SAMPLE COACH / {String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="trainer-card__details">
                <p className="eyebrow">Sample coach profile</p>
                <h2>{trainer.title}</h2>
                <dl>
                  <div>
                    <dt>Specialization</dt>
                    <dd>{trainer.specialization}</dd>
                  </div>
                  <div>
                    <dt>Experience</dt>
                    <dd>{trainer.experience}</dd>
                  </div>
                </dl>
                <p className="trainer-card__note">
                  Example only — verify coach details before publishing.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section trainer-approach">
        <div className="content-width trainer-approach__layout">
          <Reveal>
            <SectionHeading
              eyebrow="A thoughtful approach"
              title={
                <>
                  Training is a
                  <br />
                  <em>conversation.</em>
                </>
              }
              copy="A useful coaching relationship begins with understanding your experience, priorities, and the kind of support you want."
            />
          </Reveal>
          <Reveal className="trainer-approach__steps" delay={0.08}>
            <div>
              <span>01</span>
              <p>Share what you want to work toward.</p>
            </div>
            <div>
              <span>02</span>
              <p>Discuss coaching options and availability.</p>
            </div>
            <div>
              <span>03</span>
              <p>Confirm the right next step with the Levy team.</p>
            </div>
            <ActionLink to="/contact?topic=Personal%20training" variant="text">
              Ask about coaching
            </ActionLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}

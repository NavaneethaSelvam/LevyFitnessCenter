"use client";

import Image from "next/image";
import ActionLink from "../components/ActionLink";
import ContactForm from "../components/ContactForm";
import PageIntro from "../components/PageIntro";
import PageMeta from "../components/PageMeta";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { membershipPlans } from "../data/site";

const comparisonRows = [
  {
    label: "Membership duration",
    values: membershipPlans.map((plan) => plan.duration),
  },
  {
    label: "Membership price",
    values: membershipPlans.map((plan) => plan.price),
  },
  {
    label: "Registration fee",
    values: membershipPlans.map(() => "₹500 for new members"),
  },
];

export default function MembershipPage() {
  return (
    <>
      <PageMeta
        title="Membership"
        description="Explore confirmed 1, 3, 6, 9, and 12 month membership prices from Levy Fitness Center."
      />
      <PageIntro
        eyebrow="Membership"
        title={
          <>
            Find your way
            <br />
            <em>into the work.</em>
          </>
        }
        description="Choose a membership duration and explore the Levy Fitness Center training floor. A ₹500 registration fee applies to new members."
        imageSrc="/images/membership/levy-membership-card.svg"
        imageAlt="Levy Fitness Center gym membership card in black and neon lime"
        index="04"
      />

      <section className="membership-benefits content-width">
        <Reveal className="membership-benefits__visual">
          <Image
            src="/images/membership/membership-lifestyle.jpg"
            alt="Athlete training with battle ropes in a gym"
            fill
            sizes="(max-width: 620px) 100vw, 55vw"
          />
          <span className="image-index">YOUR SPACE / LFC</span>
        </Reveal>
        <Reveal className="membership-benefits__copy" delay={0.1}>
          <p className="eyebrow">Membership, made personal</p>
          <h2>
            Make space
            <br />
            <em>for progress.</em>
          </h2>
          <p>
            Find a place for focused training and steady progress. Choose a
            membership duration that works for your routine.
          </p>
          <ul className="plain-list">
            <li>Choose from five membership durations</li>
            <li>Compare confirmed membership prices</li>
            <li>Ask Levy to confirm current availability</li>
          </ul>
          <ActionLink to="/contact?topic=Membership" variant="text">
            Ask about membership
          </ActionLink>
        </Reveal>
      </section>

      <section className="membership-page content-width">
        <Reveal className="section-heading-row membership-page__heading">
          <SectionHeading
            eyebrow="Membership rates"
            title={
              <>
                Choose your
                <br />
                <em>plan.</em>
              </>
            }
            copy="Choose a duration that fits your routine. A ₹500 registration fee applies to new members."
          />
        </Reveal>

        <div className="membership-card-grid">
          {membershipPlans.map((plan, index) => (
            <Reveal
              className={`membership-card${plan.featured ? " membership-card--featured" : ""}`}
              delay={index * 0.07}
              duration={0.6}
              key={plan.number}
            >
              {plan.featured && (
                <span className="membership-card__badge">Popular</span>
              )}
              <div className="membership-card__brand" aria-hidden="true">
                <Image
                  src="/images/branding/levy-mark.svg"
                  alt=""
                  width={26}
                  height={22}
                />
                <span>Levy Fitness Center</span>
              </div>
              <span className="membership-card__type">Gym member</span>
              <span className="membership-card__duration">{plan.duration}</span>
              <h2 className="membership-card__price">{plan.price}</h2>
              <p className="membership-card__fee">
                {plan.registrationNote || "\u00a0"}
              </p>
              <ActionLink
                to={`/contact?topic=Membership&plan=${encodeURIComponent(`${plan.duration} - ${plan.price}`)}`}
                variant={plan.featured ? "lime" : "outline"}
                className="membership-card__action"
              >
                Ask about this plan
              </ActionLink>
            </Reveal>
          ))}
        </div>
        <p className="membership-page__note">
          Registration fee of ₹500 applies to new members only.
        </p>
      </section>

      <section className="section comparison-section">
        <div className="content-width">
          <Reveal className="section-heading-row">
            <SectionHeading
              eyebrow="Membership details"
              title={
                <>
                  Plan terms
                  <br />
                  <em>at a glance.</em>
                </>
              }
              copy="A ₹500 registration fee applies to new members only."
            />
            <span className="comparison-section__key">
              <i /> Confirm availability with Levy
            </span>
          </Reveal>
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th scope="col">Plan detail</th>
                  {membershipPlans.map((plan) => (
                    <th scope="col" key={plan.number}>
                      {plan.duration}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.values.map((value, index) => (
                      <td key={membershipPlans[index].number}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section membership-enquiry">
        <div className="content-width membership-enquiry__layout">
          <Reveal>
            <SectionHeading
              eyebrow="Membership enquiry"
              title={
                <>
                  Tell us what
                  <br />
                  <em>you’re looking for.</em>
                </>
              }
              copy="Choose a plan and send your enquiry to the Levy Fitness Center team."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <ContactForm defaultTopic="Membership" compact />
          </Reveal>
        </div>
      </section>
    </>
  );
}

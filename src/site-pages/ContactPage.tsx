"use client";

import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import ContactForm from "../components/ContactForm";
import PageIntro from "../components/PageIntro";
import PageMeta from "../components/PageMeta";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { business, phoneHref, whatsappHref } from "../config/business";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const topic = searchParams?.get("topic") ?? "";
  const plan = searchParams?.get("plan") ?? "";
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(business.address)}&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`;

  return (
    <>
      <PageMeta
        title="Contact us"
        description="Contact Levy Fitness Center with questions about programs, membership, and training."
      />
      <PageIntro
        eyebrow="Let’s talk"
        title={
          <>
            Your next step
            <br />
            <em>starts with a hello.</em>
          </>
        }
        description={`Visit us at ${business.address} or call ${business.phone} to ask about training and membership.`}
        imageSrc="/images/gym/contact-gym-interior.jpg"
        imageAlt="Strength equipment arranged inside a fitness center"
        index="07"
      />

      <section className="contact-page content-width">
        <div className="contact-details">
          <Reveal>
            <SectionHeading
              eyebrow="Contact Levy"
              title={
                <>
                  Tell us what
                  <br />
                  <em>you have in mind.</em>
                </>
              }
              copy={`Call or WhatsApp ${business.phone}, or visit us at ${business.address}.`}
            />
          </Reveal>
          <Reveal className="contact-detail-list" delay={0.06}>
            <div className="contact-detail">
              <span className="contact-detail__icon">
                <Phone size={18} aria-hidden="true" />
              </span>
              <div>
                <span className="eyebrow">Phone</span>
                <a href={phoneHref}>{business.phone}</a>
              </div>
              <a className="contact-detail__action" href={phoneHref} aria-label="Call Levy Fitness">
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
            <div className="contact-detail">
              <span className="contact-detail__icon">
                <MessageCircle size={18} aria-hidden="true" />
              </span>
              <div>
                <span className="eyebrow">WhatsApp</span>
                <a href={whatsappHref} target="_blank" rel="noreferrer">
                  Message Levy Fitness
                </a>
              </div>
              <a
                className="contact-detail__action"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Message Levy Fitness on WhatsApp"
              >
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
            <div className="contact-detail">
              <span className="contact-detail__icon">
                <MapPin size={18} aria-hidden="true" />
              </span>
              <div>
                <span className="eyebrow">Address</span>
                <a href={mapLink} target="_blank" rel="noreferrer">
                  {business.address}
                </a>
              </div>
              <a
                className="contact-detail__action"
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                aria-label="Open Levy Fitness Center directions"
              >
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
            {business.email && (
              <div className="contact-detail">
                <span className="contact-detail__icon">
                  <Mail size={18} aria-hidden="true" />
                </span>
                <div>
                  <span className="eyebrow">Email</span>
                  <a href={`mailto:${business.email}`}>{business.email}</a>
                </div>
              </div>
            )}
            <div className="contact-detail">
              <span className="contact-detail__icon">
                <Clock3 size={18} aria-hidden="true" />
              </span>
              <div>
                <span className="eyebrow">Sample opening hours</span>
                <span>Daily, 5:00 AM – 10:00 PM · Call to confirm</span>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal className="contact-form-panel" delay={0.1}>
          <div className="contact-form-panel__heading">
            <p className="eyebrow">Enquiry form</p>
            <h2>Start a conversation.</h2>
            <p>Use your contact details and the team can follow up about your enquiry.</p>
          </div>
          <ContactForm defaultTopic={topic} defaultPlan={plan} />
        </Reveal>
      </section>

      <section className="section location-section">
        <div className="content-width">
          <Reveal className="section-heading-row">
            <SectionHeading
              eyebrow="Find Levy"
              title={
                <>
                  The way
                  <br />
                  <em>to the gym.</em>
                </>
              }
              copy={business.address}
            />
            <a className="button button--outline" href={mapLink} target="_blank" rel="noreferrer">
              Open directions <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </Reveal>
          <Reveal className="map-panel" delay={0.08}>
            <iframe
              title="Map showing Levy Fitness Center location"
              src={mapUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}

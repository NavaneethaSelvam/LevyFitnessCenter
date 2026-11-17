import { ArrowUpRight, Camera, MapPin } from "lucide-react";
import Link from "next/link";
import { business, instagramHref, phoneHref, whatsappHref } from "../config/business";
import { navigation } from "../data/site";
import Brand from "./Brand";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top content-width">
        <div className="site-footer__brand">
          <Brand />
          <p>Move with purpose. Build what lasts.</p>
        </div>
        <div className="site-footer__nav">
          <p className="eyebrow">Explore</p>
          {navigation.slice(1, 6).map((item) => (
            <Link key={item.to} href={item.to}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="site-footer__contact">
          <p className="eyebrow">Get in touch</p>
          {business.email && <a href={`mailto:${business.email}`}>{business.email}</a>}
          {phoneHref ? (
            <a href={phoneHref}>{business.phone}</a>
          ) : null}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
            target="_blank"
            rel="noreferrer"
          >
            <MapPin size={13} aria-hidden="true" />
            {business.address}
          </a>
          {whatsappHref && (
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}
          <Link href="/contact">Contact Levy Fitness <ArrowUpRight size={13} aria-hidden="true" /></Link>
        </div>
      </div>
      <div className="site-footer__bottom content-width">
        <span>© {new Date().getFullYear()} Levy Fitness Center</span>
        <span>Train for what’s next.</span>
        {instagramHref ? (
          <a
            href={instagramHref}
            target="_blank"
            rel="noreferrer"
            className="site-footer__social"
          >
            <Camera size={15} aria-hidden="true" />
            <span>Instagram</span>
          </a>
        ) : null}
      </div>
    </footer>
  );
}

"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { membershipPlans } from "../data/site";
import {
  submitEnquiry,
  type EnquiryDraft,
} from "../lib/forms";

const topicOptions = [
  "Membership",
  "Training programs",
  "Personal training enquiry",
  "Free trial enquiry",
  "General enquiry",
];

const trainingOptions = [
  "Strength training",
  "Personal training",
  "Weight management",
  "Muscle building",
  "Cardio fitness",
  "Functional training",
  "Not sure yet",
];

type ContactFormProps = {
  defaultTopic?: string;
  defaultPlan?: string;
  compact?: boolean;
};

export default function ContactForm({
  defaultTopic = "",
  defaultPlan = "",
  compact = false,
}: ContactFormProps) {
  const [topic, setTopic] = useState(defaultTopic);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestRef = useRef<{ signature: string; id: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (isSubmitting || !form.reportValidity()) return;

    const values = new FormData(form);
    const common = {
      name: String(values.get("name") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      phone: String(values.get("phone") ?? "").trim(),
    };

    let submission: EnquiryDraft;
    if (topic === "Membership") {
      submission = {
        ...common,
        operation: "membership",
        plan: String(values.get("plan") ?? "").trim(),
        message: String(values.get("message") ?? "").trim(),
      };
    } else if (topic === "Free trial enquiry" || topic === "Trial booking") {
      submission = {
        ...common,
        operation: "trial",
        preferredDate: String(values.get("preferredDate") ?? ""),
        preferredTime: String(values.get("preferredTime") ?? ""),
        trainingInterest: String(values.get("trainingInterest") ?? "").trim(),
      };
    } else {
      submission = {
        ...common,
        operation: "contact",
        subject: topic,
        message: String(values.get("message") ?? "").trim(),
      };
    }

    const signature = JSON.stringify(submission);
    const submissionId =
      requestRef.current?.signature === signature
        ? requestRef.current.id
        : window.crypto.randomUUID();
    requestRef.current = { signature, id: submissionId };

    setIsSubmitting(true);
    setStatus("");
    setStatusType("");

    try {
      const result = await submitEnquiry({
        ...submission,
        submissionId,
      });
      const emailDeliveryFailed =
        result.emailDelivery?.adminNotification === false ||
        result.emailDelivery?.customerAcknowledgement === false;
      setStatus(
        emailDeliveryFailed
          ? "Your enquiry was received, but one or more email notifications could not be confirmed. The Levy team has your details."
          : result.duplicate
            ? "This enquiry was already received. The Levy team will follow up."
            : "Thank you. Your enquiry was received. The Levy team will follow up.",
      );
      setStatusType("success");
      form.reset();
      setTopic(defaultTopic);
      requestRef.current = null;
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Your enquiry could not be sent. Please try again.",
      );
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isMembership = topic === "Membership";
  const isTrial = topic === "Free trial enquiry" || topic === "Trial booking";

  return (
    <form
      className={`contact-form${compact ? " contact-form--compact" : ""}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="form-grid">
        <label className="form-field">
          <span>Your name</span>
          <input autoComplete="name" name="name" maxLength={100} required />
        </label>
        <label className="form-field">
          <span>Email address</span>
          <input
            autoComplete="email"
            name="email"
            type="email"
            maxLength={254}
            required
          />
        </label>
      </div>
      <div className="form-grid">
        <label className="form-field">
          <span>Phone number</span>
          <input
            autoComplete="tel"
            name="phone"
            type="tel"
            minLength={7}
            maxLength={30}
            required
          />
        </label>
        <label className="form-field">
          <span>Subject</span>
          <select
            name="subject"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            required
          >
            <option value="" disabled>
              Choose a topic
            </option>
            {defaultTopic && !topicOptions.includes(defaultTopic) && (
              <option value={defaultTopic}>{defaultTopic}</option>
            )}
            {topicOptions.map((option) => (
              <option value={option} key={option}>
                {option === "General enquiry" ? "Something else" : option}
              </option>
            ))}
          </select>
        </label>
      </div>
      {isMembership && (
        <label className="form-field">
          <span>Membership plan</span>
          <select name="plan" defaultValue={defaultPlan} required>
            <option value="" disabled>
              Choose a membership duration
            </option>
            {membershipPlans.map((plan) => {
              const value = `${plan.duration} - ${plan.price}`;
              return (
                <option key={plan.number} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </label>
      )}
      {isTrial && (
        <>
          <div className="form-grid">
            <label className="form-field">
              <span>Preferred date</span>
              <input name="preferredDate" type="date" required />
            </label>
            <label className="form-field">
              <span>Preferred time</span>
              <input name="preferredTime" type="time" required />
            </label>
          </div>
          <label className="form-field">
            <span>Training interest</span>
            <select name="trainingInterest" defaultValue="" required>
              <option value="" disabled>
                Choose a training interest
              </option>
              {trainingOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </>
      )}
      {!isTrial && (
        <label className="form-field">
          <span>Your message</span>
          <textarea name="message" rows={compact ? 3 : 4} maxLength={5000} required />
        </label>
      )}
      <div className="contact-form__submit">
        <button
          className="button button--lime"
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send enquiry"}
          {!isSubmitting && <ArrowUpRight size={16} aria-hidden="true" />}
        </button>
        <p className="form-note">
          Submissions require the Google Apps Script service to be configured.
        </p>
      </div>
      <p
        className={`form-status${statusType ? ` form-status--${statusType}` : ""}`}
        role="status"
        aria-live="polite"
      >
        {status}
      </p>
    </form>
  );
}

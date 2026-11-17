import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_384;
const MAX_TEXT_LENGTH = 5_000;

type ValidatedSubmission = {
  operation: "contact" | "membership" | "trial";
  submissionId: string;
  name: string;
  email: string;
  phone: string;
  [key: string]: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getText(
  input: Record<string, unknown>,
  key: string,
  maxLength = 200,
): string | null {
  const value = input[key];
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) return null;
  return normalized;
}

function isValidDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function validateSubmission(
  input: unknown,
):
  | { success: true; submission: ValidatedSubmission }
  | { success: false; error: string } {
  if (!isRecord(input)) {
    return { success: false, error: "The submitted form data is invalid." };
  }

  const operation = input.operation;
  if (
    operation !== "contact" &&
    operation !== "membership" &&
    operation !== "trial"
  ) {
    return { success: false, error: "Choose a valid enquiry type." };
  }

  const submissionId = getText(input, "submissionId", 80);
  const name = getText(input, "name", 100);
  const email = getText(input, "email", 254);
  const phone = getText(input, "phone", 30);
  const phoneDigits = phone?.replace(/\D/g, "").length ?? 0;
  if (
    !submissionId ||
    !/^[A-Za-z0-9-]{20,80}$/.test(submissionId) ||
    !name ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    (name && /[\u0000-\u001f\u007f]/.test(name)) ||
    !phone ||
    !/^[+()\d\s.-]{7,30}$/.test(phone) ||
    phoneDigits < 7 ||
    phoneDigits > 15
  ) {
    return {
      success: false,
      error: "Enter a valid name, email address, and phone number.",
    };
  }

  const submission: ValidatedSubmission = {
    operation,
    submissionId,
    name,
    email,
    phone,
  };

  if (operation === "contact") {
    const subject = getText(input, "subject", 120);
    const message = getText(input, "message", MAX_TEXT_LENGTH);
    if (!subject || !message) {
      return {
        success: false,
        error: "Add a subject and message before sending.",
      };
    }
    submission.subject = subject;
    submission.message = message;
  } else if (operation === "membership") {
    const plan = getText(input, "plan", 120);
    const message = getText(input, "message", MAX_TEXT_LENGTH);
    if (!plan || !message) {
      return {
        success: false,
        error: "Choose a membership plan and add a message.",
      };
    }
    submission.plan = plan;
    submission.message = message;
  } else {
    const preferredDate = getText(input, "preferredDate", 10);
    const preferredTime = getText(input, "preferredTime", 5);
    const trainingInterest = getText(input, "trainingInterest", 120);
    if (
      !preferredDate ||
      !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) ||
      !isValidDate(preferredDate) ||
      !preferredTime ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(preferredTime) ||
      !trainingInterest
    ) {
      return {
        success: false,
        error: "Choose a valid preferred date, time, and training interest.",
      };
    }
    submission.preferredDate = preferredDate;
    submission.preferredTime = preferredTime;
    submission.trainingInterest = trainingInterest;
  }

  return { success: true, submission };
}

function responseError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return responseError("The submitted form is too large.", 413);
  }

  let body: unknown;
  try {
    const bodyText = await request.text();
    if (new TextEncoder().encode(bodyText).byteLength > MAX_BODY_BYTES) {
      return responseError("The submitted form is too large.", 413);
    }
    body = JSON.parse(bodyText);
  } catch {
    return responseError("The submitted form data is not valid JSON.", 400);
  }

  const validation = validateSubmission(body);
  if (!validation.success) {
    return responseError(validation.error, 400);
  }

  const deploymentUrl = process.env.GOOGLE_APPS_SCRIPT_URL?.trim();
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SHARED_SECRET?.trim();
  if (!deploymentUrl || !sharedSecret) {
    return responseError(
      "Online form submissions are not configured yet. Please call Levy Fitness Center.",
      503,
    );
  }

  let endpoint: URL;
  try {
    endpoint = new URL(deploymentUrl);
  } catch {
    return responseError("The enquiry service URL is invalid.", 503);
  }

  if (
    endpoint.protocol !== "https:" ||
    endpoint.hostname !== "script.google.com" ||
    !/^\/macros\/s\/[^/]+\/exec\/?$/.test(endpoint.pathname)
  ) {
    return responseError("The enquiry service URL is invalid.", 503);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validation.submission,
        apiKey: sharedSecret,
      }),
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    });
    const responseText = await upstream.text();

    let result: unknown;
    try {
      result = JSON.parse(responseText);
    } catch {
      return responseError(
        "The enquiry service returned an invalid response. Check its deployment settings.",
        502,
      );
    }

    if (
      !upstream.ok ||
      !isRecord(result) ||
      result.success !== true
    ) {
      const message =
        isRecord(result) && typeof result.error === "string"
          ? result.error
          : "The enquiry service could not save your details. Please try again.";
      return responseError(message, 502);
    }

    const emailDelivery =
      isRecord(result) && isRecord(result.emailDelivery) &&
      typeof result.emailDelivery.adminNotification === "boolean" &&
      typeof result.emailDelivery.customerAcknowledgement === "boolean"
        ? {
            adminNotification: result.emailDelivery.adminNotification,
            customerAcknowledgement: result.emailDelivery.customerAcknowledgement,
          }
        : undefined;

    return NextResponse.json({
      success: true,
      duplicate: result.duplicate === true,
      ...(emailDelivery ? { emailDelivery } : {}),
    });
  } catch {
    return responseError(
      controller.signal.aborted
        ? "The enquiry service timed out. Please try again."
        : "The enquiry service could not be reached. Please try again.",
      controller.signal.aborted ? 504 : 502,
    );
  } finally {
    clearTimeout(timeout);
  }
}

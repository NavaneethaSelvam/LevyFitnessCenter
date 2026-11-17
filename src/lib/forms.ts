type EnquiryBase = {
  submissionId: string;
  name: string;
  email: string;
  phone: string;
};

export type EnquirySubmission =
  | (EnquiryBase & {
      operation: "contact";
      subject: string;
      message: string;
    })
  | (EnquiryBase & {
      operation: "membership";
      plan: string;
      message: string;
    })
  | (EnquiryBase & {
      operation: "trial";
      preferredDate: string;
      preferredTime: string;
      trainingInterest: string;
    });

export type EnquiryDraft<T = EnquirySubmission> = T extends EnquirySubmission
  ? Omit<T, "submissionId">
  : never;

type EnquiryResponse = {
  success: true;
  duplicate?: boolean;
  emailDelivery?: {
    adminNotification?: boolean;
    customerAcknowledgement?: boolean;
  };
};

export async function submitEnquiry(
  submission: EnquirySubmission,
): Promise<EnquiryResponse> {
  const response = await fetch("/api/forms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error("The enquiry service returned an unreadable response.");
  }

  if (
    !response.ok ||
    typeof result !== "object" ||
    result === null ||
    !("success" in result) ||
    result.success !== true
  ) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "error" in result &&
      typeof result.error === "string"
        ? result.error
        : "Your enquiry could not be sent. Please try again.";
    throw new Error(message);
  }

  return {
    success: true,
    duplicate:
      "duplicate" in result && result.duplicate === true,
    emailDelivery:
      "emailDelivery" in result &&
      typeof result.emailDelivery === "object" &&
      result.emailDelivery !== null &&
      "adminNotification" in result.emailDelivery &&
      "customerAcknowledgement" in result.emailDelivery
        ? {
            adminNotification:
              typeof result.emailDelivery.adminNotification === "boolean"
                ? result.emailDelivery.adminNotification
                : undefined,
            customerAcknowledgement:
              typeof result.emailDelivery.customerAcknowledgement === "boolean"
                ? result.emailDelivery.customerAcknowledgement
                : undefined,
          }
        : undefined,
  };
}

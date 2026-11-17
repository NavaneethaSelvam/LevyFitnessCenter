const ENQUIRY_SHEET_NAME = "Enquiries";
const ENQUIRY_HEADERS = [
  "Enquiry ID",
  "Customer Name",
  "Email",
  "Phone",
  "Enquiry Type",
  "Message",
  "Submission Date",
  "Status",
  "Admin Reply",
  "Email Delivery Status",
  "Admin Notification Status",
  "Customer Acknowledgement Status",
  "Details",
  "Reply History",
  "Reply Delivery Status",
  "Last Sent Reply Hash",
];
const EMAIL_STATUS_COLUMN = 10;
const ADMIN_EMAIL_STATUS_COLUMN = 11;
const CUSTOMER_EMAIL_STATUS_COLUMN = 12;
const ADMIN_REPLY_COLUMN = 9;
const REPLY_HISTORY_COLUMN = 14;
const REPLY_STATUS_COLUMN = 15;
const LAST_REPLY_HASH_COLUMN = 16;

function doGet() {
  const properties = PropertiesService.getScriptProperties();
  const adminEmail = properties.getProperty("ADMIN_EMAIL");
  return jsonResponse_({
    success: true,
    service: "Levy Fitness Center Enquiries",
    configured: Boolean(
      properties.getProperty("SPREADSHEET_ID") &&
        properties.getProperty("API_SHARED_SECRET") &&
        isValidEmail_(adminEmail || ""),
    ),
  });
}

function doPost(event) {
  try {
    const request = parseRequest_(event);
    const properties = PropertiesService.getScriptProperties();
    const expectedKey = properties.getProperty("API_SHARED_SECRET");
    const spreadsheetId = properties.getProperty("SPREADSHEET_ID");
    const adminEmail = properties.getProperty("ADMIN_EMAIL");

    if (!expectedKey || !spreadsheetId || !adminEmail) {
      throw new Error("SERVICE_NOT_CONFIGURED");
    }
    if (typeof request.apiKey !== "string" || request.apiKey !== expectedKey) {
      throw new Error("UNAUTHORIZED");
    }
    if (!isValidEmail_(adminEmail)) {
      throw new Error("ADMIN_EMAIL_INVALID");
    }

    const submission = validateSubmission_(request);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      const sheet = getOrCreateEnquirySheet_(spreadsheet);
      const existingRow = findSubmissionRow_(sheet, submission.submissionId);
      if (existingRow) {
        return submissionResponse_(sheet, existingRow, true);
      }

      const row = sheet.getLastRow() + 1;
      sheet.getRange(row, 1, 1, ENQUIRY_HEADERS.length)
        .setValues([buildRow_(submission)]);

      sendEnquiryEmails_(sheet, row, submission, adminEmail);
      return submissionResponse_(sheet, row, false);
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    const code = error && error.message ? String(error.message) : "";
    console.error("Enquiry service request failed (" + code + ").");
    const messages = {
      INVALID_REQUEST: "The submitted form data is invalid.",
      INVALID_OPERATION: "Choose a valid enquiry type.",
      INVALID_NAME: "Enter a valid name.",
      INVALID_EMAIL: "Enter a valid email address.",
      INVALID_PHONE: "Enter a valid phone number.",
      INVALID_SUBJECT: "Enter a valid subject.",
      INVALID_PLAN: "Choose a valid membership plan.",
      INVALID_MESSAGE: "Enter a valid message.",
      INVALID_DATE: "Choose a valid preferred date.",
      INVALID_TIME: "Choose a valid preferred time.",
      INVALID_TRAINING_INTEREST: "Choose a valid training interest.",
      INVALID_SUBMISSION_ID: "The submission could not be verified.",
      UNAUTHORIZED: "The enquiry service authorization failed.",
      SERVICE_NOT_CONFIGURED: "The enquiry service has not been configured.",
      ADMIN_EMAIL_INVALID: "The admin notification address is invalid.",
      SHEET_HEADERS_INVALID: "The Enquiries sheet headers need to be restored.",
    };
    const message =
      messages[code] || "The enquiry could not be saved. Please try again later.";
    return jsonResponse_({ success: false, error: message, code: code || "ERROR" });
  }
}

function initializeSheets() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty("SPREADSHEET_ID");
  if (!spreadsheetId) {
    throw new Error("Set the SPREADSHEET_ID script property before initialization.");
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = getOrCreateEnquirySheet_(spreadsheet);
  const hasReplyTrigger = ScriptApp.getProjectTriggers().some(function (trigger) {
    return trigger.getHandlerFunction() === "handleEnquirySheetEdit";
  });
  if (!hasReplyTrigger) {
    ScriptApp.newTrigger("handleEnquirySheetEdit")
      .forSpreadsheet(spreadsheet)
      .onEdit()
      .create();
  }
  sheet.hideColumns(LAST_REPLY_HASH_COLUMN);
}

function handleEnquirySheetEdit(event) {
  if (!event || !event.range) {
    return;
  }
  const sheet = event.range.getSheet();
  const firstColumn = event.range.getColumn();
  const lastColumn = firstColumn + event.range.getNumColumns() - 1;
  if (
    sheet.getName() !== ENQUIRY_SHEET_NAME ||
    ADMIN_REPLY_COLUMN < firstColumn ||
    ADMIN_REPLY_COLUMN > lastColumn ||
    event.range.getRow() === 1
  ) {
    return;
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const firstRow = Math.max(2, event.range.getRow());
    const lastRow = event.range.getRow() + event.range.getNumRows() - 1;
    for (let row = firstRow; row <= lastRow; row += 1) {
      sendAdminReply_(sheet, row);
    }
  } finally {
    lock.releaseLock();
  }
}

function retryFailedReplies() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty("SPREADSHEET_ID");
  const adminEmail = properties.getProperty("ADMIN_EMAIL");
  if (!spreadsheetId || !isValidEmail_(adminEmail || "")) {
    throw new Error("Set SPREADSHEET_ID and a valid ADMIN_EMAIL before retrying replies.");
  }

  const sheet = SpreadsheetApp.openById(spreadsheetId)
    .getSheetByName(ENQUIRY_SHEET_NAME);
  if (!sheet) {
    throw new Error("Run initializeSheets before retrying replies.");
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    for (let row = 2; row <= sheet.getLastRow(); row += 1) {
      if (sheet.getRange(row, REPLY_STATUS_COLUMN).getValue() === "failed") {
        sendAdminReply_(sheet, row);
      }
    }
  } finally {
    lock.releaseLock();
  }
}

function retryFailedEnquiryEmails() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty("SPREADSHEET_ID");
  const adminEmail = properties.getProperty("ADMIN_EMAIL");
  if (!spreadsheetId || !isValidEmail_(adminEmail || "")) {
    throw new Error("Set SPREADSHEET_ID and a valid ADMIN_EMAIL before retrying emails.");
  }

  const sheet = SpreadsheetApp.openById(spreadsheetId)
    .getSheetByName(ENQUIRY_SHEET_NAME);
  if (!sheet) {
    throw new Error("Run initializeSheets before retrying emails.");
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    for (let row = 2; row <= sheet.getLastRow(); row += 1) {
      retryFailedEnquiryEmailsForRow_(sheet, row, adminEmail);
    }
  } finally {
    lock.releaseLock();
  }
}

function parseRequest_(event) {
  if (!event || !event.postData || typeof event.postData.contents !== "string") {
    throw new Error("INVALID_REQUEST");
  }
  if (event.postData.contents.length > 20000) {
    throw new Error("INVALID_REQUEST");
  }

  try {
    const request = JSON.parse(event.postData.contents);
    if (!request || typeof request !== "object" || Array.isArray(request)) {
      throw new Error("INVALID_REQUEST");
    }
    return request;
  } catch (error) {
    throw new Error("INVALID_REQUEST");
  }
}

function validateSubmission_(request) {
  const operation = request.operation;
  if (operation !== "contact" && operation !== "membership" && operation !== "trial") {
    throw new Error("INVALID_OPERATION");
  }

  const submissionId = requiredText_(
    request.submissionId,
    80,
    "INVALID_SUBMISSION_ID",
  );
  if (!/^[A-Za-z0-9-]{20,80}$/.test(submissionId)) {
    throw new Error("INVALID_SUBMISSION_ID");
  }

  const submission = {
    operation: operation,
    submissionId: submissionId,
    name: requiredText_(request.name, 100, "INVALID_NAME"),
    email: requiredText_(request.email, 254, "INVALID_EMAIL").toLowerCase(),
    phone: requiredText_(request.phone, 30, "INVALID_PHONE"),
  };
  if (/[\u0000-\u001f\u007f]/.test(submission.name)) {
    throw new Error("INVALID_NAME");
  }
  if (!isValidEmail_(submission.email)) {
    throw new Error("INVALID_EMAIL");
  }
  const phoneDigits = submission.phone.replace(/\D/g, "").length;
  if (
    !/^[+()\d\s.-]{7,30}$/.test(submission.phone) ||
    phoneDigits < 7 ||
    phoneDigits > 15
  ) {
    throw new Error("INVALID_PHONE");
  }

  if (operation === "contact") {
    submission.enquiryType = requiredText_(
      request.subject,
      120,
      "INVALID_SUBJECT",
    );
    submission.message = requiredText_(request.message, 5000, "INVALID_MESSAGE");
    submission.details = "";
  } else if (operation === "membership") {
    submission.enquiryType = "Membership";
    submission.details = "Selected plan: " +
      requiredText_(request.plan, 120, "INVALID_PLAN");
    submission.message = requiredText_(request.message, 5000, "INVALID_MESSAGE");
  } else {
    submission.enquiryType = "Free trial enquiry";
    submission.message = "Free trial booking request";
    submission.preferredDate = requiredText_(
      request.preferredDate,
      10,
      "INVALID_DATE",
    );
    submission.preferredTime = requiredText_(
      request.preferredTime,
      5,
      "INVALID_TIME",
    );
    submission.trainingInterest = requiredText_(
      request.trainingInterest,
      120,
      "INVALID_TRAINING_INTEREST",
    );
    if (!isValidDate_(submission.preferredDate)) {
      throw new Error("INVALID_DATE");
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(submission.preferredTime)) {
      throw new Error("INVALID_TIME");
    }
    submission.details =
      "Preferred date: " + submission.preferredDate +
      "\nPreferred time: " + submission.preferredTime +
      "\nTraining interest: " + submission.trainingInterest;
  }

  return submission;
}

function requiredText_(value, maxLength, errorCode) {
  if (typeof value !== "string") {
    throw new Error(errorCode || "INVALID_REQUEST");
  }
  const text = value.trim();
  if (!text || text.length > maxLength || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) {
    throw new Error(errorCode || "INVALID_REQUEST");
  }
  return text;
}

function isValidEmail_(value) {
  return typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidDate_(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(value + "T00:00:00Z");
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function getOrCreateEnquirySheet_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(ENQUIRY_SHEET_NAME) ||
    spreadsheet.insertSheet(ENQUIRY_SHEET_NAME);
  const lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.getRange(1, 1, 1, ENQUIRY_HEADERS.length).setValues([ENQUIRY_HEADERS]);
    sheet.setFrozenRows(1);
    return sheet;
  }

  const existingHeaders = sheet
    .getRange(1, 1, 1, ENQUIRY_HEADERS.length)
    .getDisplayValues()[0];
  const isEmpty = existingHeaders.every(function (header) {
    return !header;
  });
  if (isEmpty && lastRow === 1) {
    sheet.getRange(1, 1, 1, ENQUIRY_HEADERS.length).setValues([ENQUIRY_HEADERS]);
    sheet.setFrozenRows(1);
    return sheet;
  }

  const headersMatch = ENQUIRY_HEADERS.every(function (header, index) {
    return existingHeaders[index] === header;
  });
  if (!headersMatch) {
    throw new Error("SHEET_HEADERS_INVALID");
  }
  return sheet;
}

function findSubmissionRow_(sheet, submissionId) {
  if (sheet.getLastRow() < 2) {
    return 0;
  }
  const match = sheet
    .getRange(2, 1, sheet.getLastRow() - 1, 1)
    .createTextFinder(submissionId)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function buildRow_(submission) {
  return [
    submission.submissionId,
    submission.name,
    submission.email,
    submission.phone,
    submission.enquiryType,
    submission.message,
    new Date(),
    "New",
    "",
    "Admin notification: pending; Customer acknowledgement: pending",
    "pending",
    "pending",
    submission.details,
    "",
    "",
    "",
  ].map(safeSheetValue_);
}

function sendEnquiryEmails_(sheet, row, submission, adminEmail) {
  sheet.getRange(row, ADMIN_EMAIL_STATUS_COLUMN).setValue(
    sendAdminNotification_(submission, adminEmail) ? "sent" : "failed",
  );
  sheet.getRange(row, CUSTOMER_EMAIL_STATUS_COLUMN).setValue(
    sendCustomerAcknowledgement_(submission, adminEmail) ? "sent" : "failed",
  );
  updateEmailDeliverySummary_(sheet, row);
}

function retryFailedEnquiryEmailsForRow_(sheet, row, adminEmail) {
  const values = sheet.getRange(row, 1, 1, ENQUIRY_HEADERS.length).getValues()[0];
  const submission = {
    submissionId: String(values[0]),
    name: String(values[1]),
    email: String(values[2]),
    phone: String(values[3]),
    enquiryType: String(values[4]),
    message: String(values[5]),
    details: String(values[12] || ""),
  };

  if (values[ADMIN_EMAIL_STATUS_COLUMN - 1] === "failed") {
    sheet.getRange(row, ADMIN_EMAIL_STATUS_COLUMN).setValue(
      sendAdminNotification_(submission, adminEmail) ? "sent" : "failed",
    );
  }
  if (values[CUSTOMER_EMAIL_STATUS_COLUMN - 1] === "failed") {
    sheet.getRange(row, CUSTOMER_EMAIL_STATUS_COLUMN).setValue(
      sendCustomerAcknowledgement_(submission, adminEmail) ? "sent" : "failed",
    );
  }
  updateEmailDeliverySummary_(sheet, row);
}

function sendAdminNotification_(submission, adminEmail) {
  return trySendEmail_(
    "Admin notification",
    {
      to: adminEmail,
      replyTo: submission.email,
      subject: "New " + submission.enquiryType + " — Levy Fitness Center",
      body: [
        "A new enquiry was submitted on the Levy Fitness Center website.",
        "",
        "Enquiry ID: " + submission.submissionId,
        "Name: " + submission.name,
        "Email: " + submission.email,
        "Phone: " + submission.phone,
        "Enquiry type: " + submission.enquiryType,
        "Message: " + submission.message,
        submission.details ? "\n" + submission.details : "",
        "",
        "To reply, enter your response in the Admin Reply column for this enquiry in the Enquiries sheet.",
      ].join("\n"),
      name: "Levy Fitness Center",
    },
  );
}

function sendCustomerAcknowledgement_(submission, adminEmail) {
  return trySendEmail_(
    "Customer acknowledgement",
    {
      to: submission.email,
      replyTo: adminEmail,
      subject: "We received your enquiry — Levy Fitness Center",
      body: [
        "Hello " + submission.name + ",",
        "",
        "Thank you for contacting Levy Fitness Center. We have received your " +
          submission.enquiryType.toLowerCase() + " and our team will follow up.",
        "",
        "Enquiry ID: " + submission.submissionId,
        "",
        "Your submitted details:",
        submission.message,
        submission.details ? "\n" + submission.details : "",
        "",
        "Levy Fitness Center",
      ].join("\n"),
      name: "Levy Fitness Center",
    },
  );
}

function trySendEmail_(label, message) {
  try {
    MailApp.sendEmail(message);
    return true;
  } catch (error) {
    console.error(label + " email failed: " + errorMessage_(error));
    return false;
  }
}

function updateEmailDeliverySummary_(sheet, row) {
  const adminStatus = sheet.getRange(row, ADMIN_EMAIL_STATUS_COLUMN).getValue();
  const customerStatus = sheet.getRange(row, CUSTOMER_EMAIL_STATUS_COLUMN).getValue();
  sheet.getRange(row, EMAIL_STATUS_COLUMN).setValue(
    "Admin notification: " + adminStatus +
      "; Customer acknowledgement: " + customerStatus,
  );
}

function sendAdminReply_(sheet, row) {
  if (row < 2 || row > sheet.getLastRow()) {
    return;
  }
  const values = sheet.getRange(row, 1, 1, ENQUIRY_HEADERS.length).getValues()[0];
  const reply = typeof values[ADMIN_REPLY_COLUMN - 1] === "string"
    ? values[ADMIN_REPLY_COLUMN - 1].trim()
    : "";
  if (!reply || !isValidEmail_(String(values[2] || ""))) {
    return;
  }

  const replyHash = hashReply_(reply);
  if (replyHash === values[LAST_REPLY_HASH_COLUMN - 1]) {
    return;
  }

  const customerName = String(values[1] || "there");
  try {
    MailApp.sendEmail({
      to: String(values[2]),
      replyTo: PropertiesService.getScriptProperties().getProperty("ADMIN_EMAIL"),
      subject: "A reply from Levy Fitness Center",
      body: [
        "Hello " + customerName + ",",
        "",
        reply,
        "",
        "Levy Fitness Center",
        "Enquiry ID: " + values[0],
      ].join("\n"),
      name: "Levy Fitness Center",
    });

    const history = String(values[REPLY_HISTORY_COLUMN - 1] || "");
    const historyEntry = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd HH:mm:ss",
    ) + " — " + reply;
    sheet.getRange(row, REPLY_HISTORY_COLUMN)
      .setValue(history ? history + "\n\n" + historyEntry : historyEntry);
    sheet.getRange(row, REPLY_STATUS_COLUMN).setValue("sent");
    sheet.getRange(row, LAST_REPLY_HASH_COLUMN).setValue(replyHash);
    sheet.getRange(row, 8).setValue("Replied");
  } catch (error) {
    console.error("Admin reply email failed: " + errorMessage_(error));
    sheet.getRange(row, REPLY_STATUS_COLUMN).setValue("failed");
  }
}

function hashReply_(reply) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    reply,
    Utilities.Charset.UTF_8,
  );
  return digest.map(function (byte) {
    return ("0" + (byte & 255).toString(16)).slice(-2);
  }).join("");
}

function submissionResponse_(sheet, row, duplicate) {
  return jsonResponse_({
    success: true,
    duplicate: duplicate,
    emailDelivery: {
      adminNotification:
        sheet.getRange(row, ADMIN_EMAIL_STATUS_COLUMN).getValue() === "sent",
      customerAcknowledgement:
        sheet.getRange(row, CUSTOMER_EMAIL_STATUS_COLUMN).getValue() === "sent",
    },
  });
}

function safeSheetValue_(value) {
  if (typeof value !== "string") {
    return value;
  }
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function errorMessage_(error) {
  return error && error.message ? String(error.message).slice(0, 200) : "Unknown error";
}

function jsonResponse_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

const SHEET_CONFIG = {
  contact: {
    sheetName: "Contact Enquiries",
    headers: [
      "Submitted At",
      "Name",
      "Email",
      "Phone",
      "Subject",
      "Message",
      "Submission ID",
    ],
  },
  membership: {
    sheetName: "Membership Enquiries",
    headers: [
      "Submitted At",
      "Name",
      "Email",
      "Phone",
      "Selected Membership Plan",
      "Message",
      "Submission ID",
    ],
  },
  trial: {
    sheetName: "Trial Bookings",
    headers: [
      "Submitted At",
      "Name",
      "Email",
      "Phone",
      "Preferred Date",
      "Preferred Time",
      "Training Interest",
      "Submission ID",
    ],
  },
};

const DUPLICATE_TTL_SECONDS = 21600;

function doGet() {
  return jsonResponse_({ success: true, service: "Levy Fitness Center Enquiries" });
}

function doPost(event) {
  try {
    const request = parseRequest_(event);
    const properties = PropertiesService.getScriptProperties();
    const expectedKey = properties.getProperty("API_SHARED_SECRET");
    const spreadsheetId = properties.getProperty("SPREADSHEET_ID");

    if (!expectedKey || !spreadsheetId) {
      throw new Error("SERVICE_NOT_CONFIGURED");
    }
    if (typeof request.apiKey !== "string" || request.apiKey !== expectedKey) {
      throw new Error("UNAUTHORIZED");
    }

    const submission = validateSubmission_(request);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const cache = CacheService.getScriptCache();
      const cacheKey = submission.operation + ":" + submission.submissionId;
      if (cache.get(cacheKey)) {
        return jsonResponse_({
          success: true,
          duplicate: true,
          operation: submission.operation,
        });
      }

      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      const config = SHEET_CONFIG[submission.operation];
      const sheet = getOrCreateSheet_(spreadsheet, config);
      sheet.appendRow(buildRow_(submission));
      cache.put(cacheKey, "saved", DUPLICATE_TTL_SECONDS);

      return jsonResponse_({
        success: true,
        duplicate: false,
        operation: submission.operation,
      });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    const code = error && error.message ? String(error.message) : "";
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
      SHEET_HEADERS_INVALID: "The target sheet headers need to be restored.",
    };
    const message =
      messages[code] || "The enquiry could not be saved. Please try again later.";
    return jsonResponse_({ success: false, error: message, code: code || "ERROR" });
  }
}

function initializeSheets() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!spreadsheetId) {
    throw new Error("Set the SPREADSHEET_ID script property before initialization.");
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  Object.keys(SHEET_CONFIG).forEach(function (operation) {
    getOrCreateSheet_(spreadsheet, SHEET_CONFIG[operation]);
  });
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
  if (!Object.prototype.hasOwnProperty.call(SHEET_CONFIG, operation)) {
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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)) {
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
    submission.subject = requiredText_(request.subject, 120, "INVALID_SUBJECT");
    submission.message = requiredText_(request.message, 5000, "INVALID_MESSAGE");
  } else if (operation === "membership") {
    submission.plan = requiredText_(request.plan, 120, "INVALID_PLAN");
    submission.message = requiredText_(request.message, 5000, "INVALID_MESSAGE");
  } else {
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
  }

  return submission;
}

function requiredText_(value, maxLength, errorCode) {
  if (typeof value !== "string") {
    throw new Error(errorCode || "INVALID_REQUEST");
  }
  const text = value.trim();
  if (!text || text.length > maxLength) {
    throw new Error(errorCode || "INVALID_REQUEST");
  }
  return text;
}

function isValidDate_(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(value + "T00:00:00Z");
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function getOrCreateSheet_(spreadsheet, config) {
  const sheet = spreadsheet.getSheetByName(config.sheetName) ||
    spreadsheet.insertSheet(config.sheetName);
  const lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
    sheet.setFrozenRows(1);
    return sheet;
  }

  const existingHeaders = sheet
    .getRange(1, 1, 1, config.headers.length)
    .getDisplayValues()[0];
  const isEmpty = existingHeaders.every(function (header) {
    return !header;
  });
  if (isEmpty && lastRow === 1) {
    sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
    sheet.setFrozenRows(1);
    return sheet;
  }

  const headersMatch = config.headers.every(function (header, index) {
    return existingHeaders[index] === header;
  });
  if (!headersMatch) {
    throw new Error("SHEET_HEADERS_INVALID");
  }
  return sheet;
}

function buildRow_(submission) {
  const values = [new Date(), submission.name, submission.email, submission.phone];
  if (submission.operation === "contact") {
    values.push(submission.subject, submission.message);
  } else if (submission.operation === "membership") {
    values.push(submission.plan, submission.message);
  } else {
    values.push(
      submission.preferredDate,
      submission.preferredTime,
      submission.trainingInterest,
    );
  }
  values.push(submission.submissionId);
  return values.map(safeSheetValue_);
}

function safeSheetValue_(value) {
  if (typeof value !== "string") {
    return value;
  }
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function jsonResponse_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

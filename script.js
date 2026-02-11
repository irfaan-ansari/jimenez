/************************************************************
 * Jimenez Produce – New Account Application Backend (FULL)
 *
 * ✅ Saves applications into "Applications" sheet
 * ✅ Stores uploads in Drive folder (from base64):
 *    - Resale Certificate
 *    - Driver License Front
 *    - Driver License Back
 *    - Signature (PNG)
 * ✅ Generates a PDF copy of the application for internal records
 * ✅ Sends internal "New Application" email (admin) with the SAME light design
 * ✅ Menu: Approve / Decline / Put On Hold
 * ✅ Status emails to Rep + Customer (HTML + plain-text fallback for deliverability)
 *
 * IMPORTANT EMAILS:
 * - ADMIN_EMAIL (.net) = your admin inbox (Outlook/GoDaddy) to receive notifications
 * - PUBLIC_REPLY_EMAIL (.com) = public company inquiry/reply address
 ************************************************************/

/***********************
 * 0) CONFIG
 ***********************/
const APPLICATION_SHEET_NAME = "Applications";

// Admin inbox (Outlook / GoDaddy) – receives internal notifications + BCC copies
const ADMIN_EMAIL = "info@jimenezproduce.net";

// Public reply-to (company inquiry inbox)
const PUBLIC_REPLY_EMAIL = "info@jimenezproduce.com";

// Drive folder for uploads + PDFs
const FOLDER_ID = "1f_n5Ktoifgaa098j8mS8epAVLxmTW0Ot";

// Portal link
const ORDER_PORTAL_URL = "https://order.jimenezproduce.com";

// Logo URL (we embed inline via CID so it displays even when remote images are blocked)
const JP_LOGO_URL =
  "https://static.wixstatic.com/media/753f18_7ec33b1a69444713a4a1f6aabe7cd38a~mv2.png";

// Very light background like your screenshot
const EMAIL_BG = "#f5f7f0"; // super light green/cream

/**
 * Full Personal Guarantee Agreement text
 * used inside generated PDF.
 */
const GUARANTEE_TEXT = `
By submitting this application, I certify that I am the individual personally responsible for all payments to Jimenez Produce LLC (“the Company”). I understand that no credit will be extended to my company unless I personally guarantee all amounts owed. I hereby unconditionally and irrevocably guarantee the full and prompt payment of any and all amounts due to Jimenez Produce LLC, including invoices, service charges, interest, fees, and any other obligations incurred by my company, whether existing now or arising in the future.

This personal guarantee is a continuing guarantee and remains in full force and effect until all balances are paid in full. I understand that I may terminate this guarantee only by providing written notice via certified mail, return receipt requested, to: Jimenez Produce LLC, 23141 Rubens Ln, Robertsdale, AL 36567. Termination will apply only to new transactions occurring after Jimenez Produce LLC receives and acknowledges my notice, and does not release me from responsibility for any amounts incurred prior to termination.

In the event of nonpayment or default, I agree to be personally liable for all outstanding balances, accrued interest, returned check fees, service charges, and all reasonable costs of collection, including attorney’s fees, court costs, and third-party collection fees. Jimenez Produce LLC may enforce this agreement in any jurisdiction where I or my assets are located, including but not limited to Alabama, Louisiana, Mississippi, Florida, and Georgia.

I waive any requirement that Jimenez Produce LLC first pursue my company or any other party before enforcing this guarantee, and I waive any right to receive notice of default, nonpayment, extensions of credit, or any other notices relating to the guaranteed debt.

By submitting this application, I affirm that I have read, understand, and agree to this Personal Guarantee Agreement, and that my electronic submission serves as my voluntary and legally binding signature under applicable state and federal law.
`;

/***********************
 * 1) Custom Menu
 ***********************/
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Jimenez Decision")
    .addItem("Approve", "approveSelectedApplication")
    .addItem("Decline", "declineSelectedApplication")
    .addItem("Put On Hold", "holdSelectedApplication")
    .addToUi();
}

/***********************
 * 2) Form Submission – doPost
 ***********************/
function doPost(e) {
  try {
    if (!e)
      return jsonResponse_({ result: "error", message: "No event object." });

    const p = e.parameter || {};

    // ---- Core data from form ----
    const data = {
      companyLegalName: p.company_legal_name || "",
      companyDBA: p.company_dba || "",
      ein: p.ein || "",
      companyAddressStreet: p.company_address_street || "",
      companyAddressCity: p.company_address_city || "",
      companyAddressState: p.company_address_state || "",
      companyAddressZip: p.company_address_zip || "",
      companyPhone: p.company_phone || "",

      officerFirst: p.officer_first_name || "",
      officerLast: p.officer_last_name || "",
      officerTitle: p.officer_title || "",
      officerMobile: p.officer_mobile || "",
      officerEmail: p.officer_email || "",

      homeAddressStreet: p.home_address_street || "",
      homeAddressCity: p.home_address_city || "",
      homeAddressState: p.home_address_state || "",
      homeAddressZip: p.home_address_zip || "",

      guarantorFirst: p.guarantor_first_name || "",
      guarantorLast: p.guarantor_last_name || "",
      guarantorTitle: p.guarantor_title || "",

      lockboxPermission: p.lockbox_permission || "",
      deliveryInstructions: p.delivery_instructions || "",

      primaryDay: p.primary_delivery_day || "",
      primaryWindow: p.primary_delivery_window || "",
      secondaryDay: p.secondary_delivery_day || "",
      secondaryWindow: p.secondary_delivery_window || "",

      receivingName: p.receiving_contact_name || "",
      receivingPhone: p.receiving_contact_phone || "",

      apEmail: p.ap_email || "",
      orderingName: p.ordering_contact_name || "",
      orderingPhone: p.ordering_contact_phone || "",

      salesRep: p.sales_rep_name || "",
      guarantorSignature: p.guarantor_signature || "", // typed name
      guaranteeAck: p.guarantee_ack || "", // checkbox
    };

    // ---- File uploads handled via base64 fields ----
    // Resale certificate
    const resaleCertUrl = saveFileFromBase64_({
      base64: p.resale_base64 || "",
      filename: p.resale_filename || "",
      mimeType: p.resale_mimeType || "application/octet-stream",
      data,
      kind: "ResaleCert",
    });

    // Driver License Front/Back
    const dlFrontUrl = saveFileFromBase64_({
      base64: p.dl_front_base64 || "",
      filename: p.dl_front_filename || "",
      mimeType: p.dl_front_mimeType || "application/octet-stream",
      data,
      kind: "DriverLicense_Front",
    });

    const dlBackUrl = saveFileFromBase64_({
      base64: p.dl_back_base64 || "",
      filename: p.dl_back_filename || "",
      mimeType: p.dl_back_mimeType || "application/octet-stream",
      data,
      kind: "DriverLicense_Back",
    });

    // Signature image (PNG from signature pad)
    const signatureFileUrl = saveFileFromBase64_({
      base64: p.signature_base64 || "",
      filename: p.signature_filename || "Signature.png",
      mimeType: p.signature_mimeType || "image/png",
      data,
      kind: "Signature",
    });

    // ---- Write to sheet ----
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(APPLICATION_SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(APPLICATION_SHEET_NAME);
      sheet.appendRow([
        "Timestamp",

        "Company Legal Name",
        "Company DBA",
        "EIN",
        "Company Street",
        "Company City",
        "Company State",
        "Company Zip",
        "Company Phone",

        "Officer First Name",
        "Officer Last Name",
        "Officer Title",
        "Officer Mobile",
        "Officer Email",

        "Home Street",
        "Home City",
        "Home State",
        "Home Zip",

        "Guarantor First Name",
        "Guarantor Last Name",
        "Guarantor Title",

        "Lockbox Permission",
        "Delivery Instructions",
        "Primary Delivery Day",
        "Primary Delivery Window",
        "Secondary Delivery Day",
        "Secondary Delivery Window",

        "Receiving Contact Name",
        "Receiving Contact Phone",

        "AP Email",
        "Ordering Contact Name",
        "Ordering Contact Phone",

        "Sales Rep",

        "Resale Certificate URL",
        "Driver License Front URL",
        "Driver License Back URL",
        "Signature File URL",

        "Guarantor Signature (Typed)",
        "Guarantee Acknowledged",

        "On Hold Reason (Rep)",
        "On Hold Reason (Customer)",
        "Approval Status",
        "Approval Timestamp",
        "Approved By",

        "Application PDF URL",
      ]);
    }

    sheet.appendRow([
      new Date(),

      data.companyLegalName,
      data.companyDBA,
      data.ein,
      data.companyAddressStreet,
      data.companyAddressCity,
      data.companyAddressState,
      data.companyAddressZip,
      data.companyPhone,

      data.officerFirst,
      data.officerLast,
      data.officerTitle,
      data.officerMobile,
      data.officerEmail,

      data.homeAddressStreet,
      data.homeAddressCity,
      data.homeAddressState,
      data.homeAddressZip,

      data.guarantorFirst,
      data.guarantorLast,
      data.guarantorTitle,

      data.lockboxPermission,
      data.deliveryInstructions,
      data.primaryDay,
      data.primaryWindow,
      data.secondaryDay,
      data.secondaryWindow,

      data.receivingName,
      data.receivingPhone,

      data.apEmail,
      data.orderingName,
      data.orderingPhone,

      data.salesRep,

      resaleCertUrl,
      dlFrontUrl,
      dlBackUrl,
      signatureFileUrl,

      data.guarantorSignature,
      data.guaranteeAck,

      "",
      "",
      "Pending",
      "",
      "",
      "", // PDF URL later
    ]);

    // ---- Generate PDF ----
    const pdfUrl = generateApplicationPdf_(data, {
      resaleCertUrl,
      dlFrontUrl,
      dlBackUrl,
      signatureFileUrl,
    });

    // Write PDF URL into last row
    const lastRow = sheet.getLastRow();
    try {
      const headerMap = getHeaderMap_(sheet);
      const pdfCol = headerMap["Application PDF URL"];
      if (pdfCol && pdfUrl) sheet.getRange(lastRow, pdfCol).setValue(pdfUrl);
    } catch (errPdfCol) {
      Logger.log("Error writing PDF URL to sheet: " + errPdfCol);
    }

    // ---- Internal email (admin) ----
    const subjectBusinessName =
      data.companyDBA || data.companyLegalName || "New Account";
    const subject = "New Account Application – " + subjectBusinessName;

    const internalEmail = buildInternalNewApplicationEmail_({
      ...data,
      resaleCertUrl,
      dlFrontUrl,
      dlBackUrl,
      signatureFileUrl,
      pdfUrl,
    });

    sendEmailPretty_({
      to: ADMIN_EMAIL,
      bcc: ADMIN_EMAIL, // keeps a copy no matter what
      replyTo: PUBLIC_REPLY_EMAIL,
      subject,
      htmlBody: internalEmail.html,
      body: internalEmail.text,
    });

    return jsonResponse_({ result: "success" });
  } catch (err) {
    Logger.log("Error in doPost: " + err);
    return jsonResponse_({ result: "error", message: err.toString() });
  }
}

/***********************
 * 3) File Saving (Base64 -> Drive)
 ***********************/
function saveFileFromBase64_(opts) {
  try {
    const base64 = String(opts.base64 || "");
    if (!base64) return "";

    const folder = DriveApp.getFolderById(FOLDER_ID);

    const cleanBase =
      base64.indexOf(",") >= 0 ? base64.split(",").pop() : base64;
    const bytes = Utilities.base64Decode(cleanBase);

    const businessName = getBusinessNameForFiles_(opts.data, "NewAccount");
    const safeNameBase =
      businessName.replace(/[^\w\s-]/g, "").substring(0, 70) || "NewAccount";
    const dateStr = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyyMMdd"
    );

    const mimeType = opts.mimeType || "application/octet-stream";
    const filename = String(opts.filename || "");
    const kind = String(opts.kind || "File");

    let ext = "";
    if (filename && filename.indexOf(".") > -1) {
      ext = filename.split(".").pop();
    } else if (mimeType === "application/pdf") ext = "pdf";
    else if (mimeType === "image/jpeg") ext = "jpg";
    else if (mimeType === "image/png") ext = "png";

    const finalName = `${safeNameBase}_${kind}_${dateStr}${
      ext ? "." + ext : ""
    }`;

    const blob = Utilities.newBlob(bytes, mimeType, finalName);
    const file = folder.createFile(blob).setName(finalName);
    return file.getUrl();
  } catch (err) {
    Logger.log("Error saving base64 file: " + err);
    return "";
  }
}

function getBusinessNameForFiles_(data, fallback) {
  const legal = String(data.companyLegalName || "").trim();
  const dba = String(data.companyDBA || "").trim();
  if (dba) return (legal || fallback || "NewAccount") + " (DBA " + dba + ")";
  return legal || fallback || "NewAccount";
}

/***********************
 * 4) PDF Generation
 ***********************/
function generateApplicationPdf_(data, files) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);

    const businessName = getBusinessNameForFiles_(data, "NewAccount");
    const safeName =
      businessName.replace(/[^\w\s-]/g, "").substring(0, 70) || "NewAccount";
    const dateStr = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyyMMdd"
    );

    const docName = `${safeName}_Application_${dateStr}`;
    const doc = DocumentApp.create(docName);
    const body = doc.getBody();

    body
      .appendParagraph("Jimenez Produce LLC")
      .setBold(true)
      .setFontSize(14)
      .setSpacingAfter(2);
    body
      .appendParagraph("New Account Application")
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body
      .appendParagraph("Business: " + (businessName || ""))
      .setSpacingAfter(2);
    body.appendParagraph("Submitted: " + new Date()).setSpacingAfter(12);

    // Section 1
    body
      .appendParagraph("Section 1 – Company Information")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.appendParagraph(
      "Company Legal Name: " + (data.companyLegalName || "")
    );
    body.appendParagraph("Company DBA: " + (data.companyDBA || ""));
    body.appendParagraph(
      "Employer Identification Number (EIN): " + (data.ein || "")
    );
    body.appendParagraph(
      "Company Address: " +
        [
          data.companyAddressStreet,
          data.companyAddressCity,
          data.companyAddressState,
          data.companyAddressZip,
        ]
          .filter(String)
          .join(", ")
    );
    body
      .appendParagraph("Company Phone: " + (data.companyPhone || ""))
      .setSpacingAfter(6);

    body.appendParagraph("Officer First Name: " + (data.officerFirst || ""));
    body.appendParagraph("Officer Last Name: " + (data.officerLast || ""));
    body.appendParagraph("Officer Title: " + (data.officerTitle || ""));
    body.appendParagraph(
      "Officer Mobile Phone Number: " + (data.officerMobile || "")
    );
    body.appendParagraph("Officer Email: " + (data.officerEmail || ""));

    body
      .appendParagraph(
        "Home Address: " +
          [
            data.homeAddressStreet,
            data.homeAddressCity,
            data.homeAddressState,
            data.homeAddressZip,
          ]
            .filter(String)
            .join(", ")
      )
      .setSpacingAfter(12);

    // Section 2
    body
      .appendParagraph("Section 2 – Personal Guarantor")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.appendParagraph(
      "Guarantor First Name: " + (data.guarantorFirst || "")
    );
    body.appendParagraph("Guarantor Last Name: " + (data.guarantorLast || ""));
    body
      .appendParagraph(
        "Guarantor Title With The Company: " + (data.guarantorTitle || "")
      )
      .setSpacingAfter(12);

    // Section 3
    body
      .appendParagraph("Section 3 – Delivery Information")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.appendParagraph(
      "Can we install a Lockbox?: " + (data.lockboxPermission || "")
    );
    body.appendParagraph("Delivery Instructions / Alarm Code:");
    body.appendParagraph(data.deliveryInstructions || "").setSpacingAfter(6);

    body.appendParagraph("Primary Delivery Day: " + (data.primaryDay || ""));
    body.appendParagraph(
      "Primary Delivery Time Window: " + (data.primaryWindow || "")
    );
    body.appendParagraph(
      "Secondary Delivery Day: " + (data.secondaryDay || "")
    );
    body
      .appendParagraph(
        "Secondary Delivery Time Window: " + (data.secondaryWindow || "")
      )
      .setSpacingAfter(12);

    body.appendParagraph(
      "Receiving Contact Name: " + (data.receivingName || "")
    );
    body
      .appendParagraph(
        "Receiving Contact Phone: " + (data.receivingPhone || "")
      )
      .setSpacingAfter(12);

    // Section 4
    body
      .appendParagraph("Section 4 – Additional Contacts")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.appendParagraph("Accounts Payable Email: " + (data.apEmail || ""));
    body.appendParagraph("Ordering Contact Name: " + (data.orderingName || ""));
    body
      .appendParagraph("Ordering Contact Phone: " + (data.orderingPhone || ""))
      .setSpacingAfter(12);

    // Section 5
    body
      .appendParagraph("Section 5 – Sales Representative")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body
      .appendParagraph("Sales Representative Name: " + (data.salesRep || ""))
      .setSpacingAfter(12);

    // Section 6 - Files
    body
      .appendParagraph("Section 6 – Documents")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);

    appendFileToDoc_(body, "Resale Certificate", files.resaleCertUrl);
    appendFileToDoc_(body, "Driver's License – Front", files.dlFrontUrl);
    appendFileToDoc_(body, "Driver's License – Back", files.dlBackUrl);

    body.appendParagraph("").setSpacingAfter(6);

    // Section 7 - Guarantee + Signature
    body
      .appendParagraph("Section 7 – Personal Guarantee Agreement")
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);

    GUARANTEE_TEXT.trim()
      .split(/\n\s*\n/)
      .forEach(function (block) {
        const t = block.trim();
        if (t) body.appendParagraph(t).setSpacingAfter(4);
      });

    body.appendParagraph("").setSpacingAfter(6);

    body
      .appendParagraph(
        "Electronic Signature (typed full name): " +
          (data.guarantorSignature || "—")
      )
      .setSpacingAfter(4);
    body
      .appendParagraph(
        "Guarantee Checkbox Acknowledgment: " + (data.guaranteeAck || "—")
      )
      .setSpacingAfter(10);

    // Embed signature image if possible
    if (files.signatureFileUrl) {
      const sigId = extractFileIdFromUrl_(files.signatureFileUrl);
      if (sigId) {
        try {
          const sigFile = DriveApp.getFileById(sigId);
          const sigMime = sigFile.getMimeType() || "";
          if (sigMime.indexOf("image/") === 0) {
            body.appendParagraph("Signature Image:").setSpacingAfter(4);
            body
              .appendImage(sigFile.getBlob())
              .setWidth(260)
              .getParent()
              .asParagraph()
              .setSpacingAfter(10);
          } else {
            body
              .appendParagraph("Signature file: " + files.signatureFileUrl)
              .setSpacingAfter(10);
          }
        } catch (e) {
          body
            .appendParagraph("Signature file: " + files.signatureFileUrl)
            .setSpacingAfter(10);
        }
      }
    }

    doc.saveAndClose();

    const pdfBlob = DriveApp.getFileById(doc.getId()).getAs("application/pdf");
    const pdfFileName = docName + ".pdf";
    const pdfFile = folder.createFile(pdfBlob).setName(pdfFileName);

    // remove the doc, keep pdf
    DriveApp.getFileById(doc.getId()).setTrashed(true);

    return pdfFile.getUrl();
  } catch (err) {
    Logger.log("Error generating application PDF: " + err);
    return "";
  }
}

function appendFileToDoc_(body, label, url) {
  if (!url) {
    body.appendParagraph(label + ": (not uploaded)").setSpacingAfter(8);
    return;
  }

  const fileId = extractFileIdFromUrl_(url);
  if (!fileId) {
    body.appendParagraph(label + " on file. Link: " + url).setSpacingAfter(8);
    return;
  }

  try {
    const f = DriveApp.getFileById(fileId);
    const mime = f.getMimeType() || "";
    if (mime.indexOf("image/") === 0) {
      body.appendParagraph(label + " (embedded):").setSpacingAfter(4);
      body
        .appendImage(f.getBlob())
        .setWidth(320)
        .getParent()
        .asParagraph()
        .setSpacingAfter(10);
    } else {
      body.appendParagraph(label + " on file. Link: " + url).setSpacingAfter(8);
    }
  } catch (e) {
    body.appendParagraph(label + " on file. Link: " + url).setSpacingAfter(8);
  }
}

/***********************
 * 5) Sheet Menu Actions
 ***********************/
function approveSelectedApplication() {
  handleRowStatus_("Approved");
}
function declineSelectedApplication() {
  handleRowStatus_("Declined");
}
function holdSelectedApplication() {
  handleRowStatus_("On Hold");
}

function handleRowStatus_(status) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(APPLICATION_SHEET_NAME);
  if (!sheet) {
    SpreadsheetApp.getUi().alert(
      'Sheet "' + APPLICATION_SHEET_NAME + '" not found.'
    );
    return;
  }

  const activeRange = sheet.getActiveRange();
  if (!activeRange) {
    SpreadsheetApp.getUi().alert("Select the row you want to update.");
    return;
  }

  const row = activeRange.getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert("Please select a data row (not the header).");
    return;
  }

  const headerMap = getHeaderMap_(sheet);
  const statusCol = headerMap["Approval Status"];
  const tsCol = headerMap["Approval Timestamp"];
  const approvedByCol = headerMap["Approved By"];

  if (statusCol) sheet.getRange(row, statusCol).setValue(status);
  if (tsCol) sheet.getRange(row, tsCol).setValue(new Date());
  if (approvedByCol)
    sheet
      .getRange(row, approvedByCol)
      .setValue(Session.getActiveUser().getEmail() || "");

  const data = getRowDataByHeader_(sheet, row);

  // Send status emails (rep + customer) with good design + deliverability fallback
  sendStatusEmails_(data, status);

  SpreadsheetApp.getUi().alert(
    'Application marked as "' + status + '" and emails sent.'
  );
}

/***********************
 * 6) Status Emails (Rep + Customer)
 ***********************/
function sendStatusEmails_(data, status) {
  const repEmail = getRepEmail_(data.salesRep) || ADMIN_EMAIL;
  const customerEmail = (data.officerEmail || data.apEmail || "").trim();

  const businessName = (
    data.companyDBA ||
    data.companyLegalName ||
    "New Account"
  ).trim();
  const subjectBase = `Jimenez Produce – ${status} – ${businessName}`;

  // Rep email (HTML + plain text fallback)
  const repEmailPack = buildRepStatusEmail_(data, status);
  sendEmailPretty_({
    to: repEmail,
    bcc: ADMIN_EMAIL,
    replyTo: PUBLIC_REPLY_EMAIL,
    subject: subjectBase + " (Rep)",
    htmlBody: repEmailPack.html,
    body: repEmailPack.text,
  });

  // Customer email (HTML + plain text fallback)
  if (customerEmail) {
    const custEmailPack = buildCustomerStatusEmail_(data, status);
    const custSubject =
      status === "Approved"
        ? "Your Jimenez Produce Account Has Been Approved"
        : status === "On Hold"
        ? "Your Jimenez Produce Application Is On Hold"
        : "Update on Your Jimenez Produce Application";

    sendEmailPretty_({
      to: customerEmail,
      bcc: ADMIN_EMAIL,
      replyTo: PUBLIC_REPLY_EMAIL,
      subject: custSubject,
      htmlBody: custEmailPack.html,
      body: custEmailPack.text,
    });
  } else {
    // If customer email missing, notify admin
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: "WARNING: Missing customer email for status update",
      body:
        `Status update attempted but no Officer Email or AP Email was found.\n\n` +
        `Business: ${businessName}\nSales Rep: ${data.salesRep || ""}\n`,
    });
  }
}

/***********************
 * 7) Email Templates (SAME LIGHT DESIGN + INLINE LOGO)
 ***********************/
function buildInternalNewApplicationEmail_(d) {
  const esc = escapeHtml_;
  const businessNameLine = formatBusinessLine_(d);
  const officerNameLine = esc(
    ((d.officerFirst || "") + " " + (d.officerLast || "")).trim()
  );

  const html = `
  <div style="background:${EMAIL_BG};padding:26px 0;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0"
                 style="max-width:640px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
            <tr>
              <td style="padding:18px 20px;border-bottom:1px solid #eef2f7;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="width:64px;vertical-align:middle;">
                      <div style="width:54px;height:54px;border-radius:999px;overflow:hidden;background:#ffffff;border:1px solid #e5e7eb;display:flex;align-items:center;justify-content:center;">
                        <!-- CID logo (not distorted) -->
                        <img src="cid:jpLogo" alt="Jimenez Produce"
                             style="max-width:54px;max-height:54px;width:auto;height:auto;display:block;" />
                      </div>
                    </td>
                    <td style="vertical-align:middle;">
                      <div style="font-size:22px;font-weight:800;color:#111827;line-height:1.1;">Jimenez Produce</div>
                      <div style="font-size:16px;color:#6b7280;margin-top:2px;">New Customer Application Notification</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 20px 6px;">
                <div style="font-size:18px;font-weight:800;color:#111827;margin-bottom:6px;">
                  New Customer Application Submitted
                </div>
                <div style="font-size:13px;color:#4b5563;">
                  A new customer application has been submitted via the online form.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:10px 20px 4px;">
                <div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:8px;">Business Information</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size:13px;color:#374151;">
                  ${emailRow_("Business Name:", businessNameLine)}
                  ${emailRow_("Sales Representative:", esc(d.salesRep || "—"))}
                  ${emailRow_("Company Phone:", esc(d.companyPhone || "—"))}
                  ${emailRow_(
                    "Lockbox Permission:",
                    esc(d.lockboxPermission || "—")
                  )}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:12px 20px 4px;">
                <div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:8px;">Officer / Guarantor Contact</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size:13px;color:#374151;">
                  ${emailRow_("Officer Name:", officerNameLine || "—")}
                  ${emailRow_("Officer Title:", esc(d.officerTitle || "—"))}
                  ${emailRow_(
                    "Officer Mobile (Primary):",
                    esc(d.officerMobile || "—")
                  )}
                  ${emailRow_(
                    "Officer Email:",
                    d.officerEmail
                      ? `<a href="mailto:${esc(
                          d.officerEmail
                        )}" style="color:#2563eb;text-decoration:none;">${esc(
                          d.officerEmail
                        )}</a>`
                      : "—"
                  )}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:12px 20px 4px;">
                <div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:8px;">Resale Certificate</div>
                <div style="font-size:13px;color:#374151;">
                  ${
                    d.resaleCertUrl
                      ? `<a href="${esc(
                          d.resaleCertUrl
                        )}" target="_blank" style="color:#2563eb;text-decoration:none;">View Uploaded Resale Certificate</a>`
                      : "No file URL recorded."
                  }
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:12px 20px 4px;">
                <div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:8px;">Driver’s License</div>
                <div style="font-size:13px;color:#374151;line-height:1.8;">
                  ${
                    d.dlFrontUrl
                      ? `<a href="${esc(
                          d.dlFrontUrl
                        )}" target="_blank" style="color:#2563eb;text-decoration:none;">View Driver License – Front</a>`
                      : "Front: —"
                  }<br>
                  ${
                    d.dlBackUrl
                      ? `<a href="${esc(
                          d.dlBackUrl
                        )}" target="_blank" style="color:#2563eb;text-decoration:none;">View Driver License – Back</a>`
                      : "Back: —"
                  }
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:12px 20px 4px;">
                <div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:8px;">Signature</div>
                <div style="font-size:13px;color:#374151;">
                  ${esc(d.guarantorSignature || "—")}
                  ${
                    d.signatureFileUrl
                      ? `&nbsp;•&nbsp;<a href="${esc(
                          d.signatureFileUrl
                        )}" target="_blank" style="color:#2563eb;text-decoration:none;">View Signature File</a>`
                      : ""
                  }
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:12px 20px 14px;">
                <div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:8px;">Application PDF</div>
                <div style="font-size:13px;color:#374151;">
                  ${
                    d.pdfUrl
                      ? `<a href="${esc(
                          d.pdfUrl
                        )}" target="_blank" style="color:#2563eb;text-decoration:none;">View Completed Application PDF</a>`
                      : "No PDF link recorded."
                  }
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:12px 20px 16px;border-top:1px solid #eef2f7;">
                <div style="font-size:11px;color:#9ca3af;">
                  This message was generated automatically from the Jimenez Produce online account application system.
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>`;

  const text =
    `Jimenez Produce – New Customer Application Notification\n\n` +
    `Business: ${stripTags_(businessNameLine)}\n` +
    `Sales Rep: ${d.salesRep || "—"}\n` +
    `Company Phone: ${d.companyPhone || "—"}\n` +
    `Lockbox Permission: ${d.lockboxPermission || "—"}\n\n` +
    `Officer: ${
      ((d.officerFirst || "") + " " + (d.officerLast || "")).trim() || "—"
    }\n` +
    `Officer Title: ${d.officerTitle || "—"}\n` +
    `Officer Mobile: ${d.officerMobile || "—"}\n` +
    `Officer Email: ${d.officerEmail || "—"}\n\n` +
    `Resale Certificate: ${d.resaleCertUrl || "—"}\n` +
    `DL Front: ${d.dlFrontUrl || "—"}\n` +
    `DL Back: ${d.dlBackUrl || "—"}\n` +
    `Signature: ${d.signatureFileUrl || "—"}\n` +
    `Application PDF: ${d.pdfUrl || "—"}\n`;

  return { html, text };
}

function buildRepStatusEmail_(data, status) {
  const esc = escapeHtml_;
  const businessNameLine = formatBusinessLine_(data);
  const officerName =
    ((data.officerFirst || "") + " " + (data.officerLast || "")).trim() || "";

  const statusLine =
    status === "Approved"
      ? "has been approved."
      : status === "On Hold"
      ? "is currently on hold."
      : "has been declined.";

  const onHoldBlock =
    status === "On Hold"
      ? `
      <div style="margin-top:14px;padding:12px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa;">
        <div style="font-size:13px;font-weight:800;color:#111827;">On Hold Details</div>
        <div style="margin-top:8px;font-size:13px;color:#374151;">
          <strong>On Hold Reason (Rep – Internal):</strong><br>
          <div style="white-space:pre-wrap;">${esc(
            String(data.onHoldReasonRep || "").trim() || "—"
          )}</div>
        </div>
        <div style="margin-top:10px;font-size:13px;color:#374151;">
          <strong>On Hold Reason (Customer):</strong><br>
          <div style="white-space:pre-wrap;">${esc(
            String(data.onHoldReasonCustomer || "").trim() || "—"
          )}</div>
        </div>
      </div>
    `
      : "";

  const html = `
  <div style="background:${EMAIL_BG};padding:26px 0;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0"
                 style="max-width:640px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
            <tr>
              <td style="padding:18px 20px;border-bottom:1px solid #eef2f7;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="width:64px;vertical-align:middle;">
                      <div style="width:54px;height:54px;border-radius:999px;overflow:hidden;background:#ffffff;border:1px solid #e5e7eb;display:flex;align-items:center;justify-content:center;">
                        <img src="cid:jpLogo" alt="Jimenez Produce"
                             style="max-width:54px;max-height:54px;width:auto;height:auto;display:block;" />
                      </div>
                    </td>
                    <td style="vertical-align:middle;">
                      <div style="font-size:22px;font-weight:800;color:#111827;line-height:1.1;">Jimenez Produce</div>
                      <div style="font-size:16px;color:#6b7280;margin-top:2px;">Application Status: ${esc(
                        status
                      )}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 20px 6px;">
                <div style="font-size:14px;color:#111827;font-weight:700;">Customer Application Update</div>
                <div style="font-size:13px;color:#4b5563;margin-top:4px;">
                  The application for <strong>${
                    businessNameLine || "this account"
                  }</strong> ${statusLine}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:10px 20px 10px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;color:#374151;">
                  ${emailRow_("Business Name:", businessNameLine || "—")}
                  ${emailRow_("Primary Contact:", esc(officerName || "—"))}
                  ${emailRow_(
                    "Officer Mobile:",
                    esc(data.officerMobile || "—")
                  )}
                  ${emailRow_("Officer Email:", esc(data.officerEmail || "—"))}
                  ${emailRow_("Order Contact:", esc(data.orderingName || "—"))}
                  ${emailRow_(
                    "Order Contact Number:",
                    esc(data.orderingPhone || "—")
                  )}
                </table>

                ${onHoldBlock}
              </td>
            </tr>

            <tr>
              <td style="padding:12px 20px 16px;border-top:1px solid #eef2f7;">
                <div style="font-size:11px;color:#9ca3af;">
                  Internal rep notice. Reply-to: ${esc(PUBLIC_REPLY_EMAIL)}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;

  const text =
    `Jimenez Produce – Rep Notice\n\n` +
    `Status: ${status}\n` +
    `Business: ${stripTags_(businessNameLine)}\n` +
    `Officer: ${officerName || "—"}\n` +
    `Officer Email: ${data.officerEmail || "—"}\n` +
    `Officer Mobile: ${data.officerMobile || "—"}\n` +
    (status === "On Hold"
      ? `\nOn Hold (Rep): ${
          String(data.onHoldReasonRep || "").trim() || "—"
        }\n` +
        `On Hold (Customer): ${
          String(data.onHoldReasonCustomer || "").trim() || "—"
        }\n`
      : "");

  return { html, text };
}

function buildCustomerStatusEmail_(data, status) {
  const esc = escapeHtml_;
  const businessNameLine = formatBusinessLine_(data);
  const officerName =
    ((data.officerFirst || "") + " " + (data.officerLast || "")).trim() || "";

  let introLine = "";
  let bodyLine = "";
  let buttonHtml = "";
  let extraText = "";

  if (status === "Approved") {
    introLine = "Your account has been approved.";
    bodyLine =
      "You can now place orders through our online ordering portal using the button below.";
    buttonHtml = `
      <div style="margin-top:16px;">
        <a href="${esc(ORDER_PORTAL_URL)}" target="_blank"
           style="display:inline-block;padding:12px 22px;border-radius:999px;background:#80b83e;color:#ffffff;text-decoration:none;font-weight:800;font-size:13px;">
          Order Online
        </a>
      </div>`;
    extraText = `Order online: ${ORDER_PORTAL_URL}\n`;
  } else if (status === "On Hold") {
    introLine = "Your application is currently on hold.";
    const reason = String(data.onHoldReasonCustomer || "").trim();
    bodyLine =
      "Our team is reviewing a few details on your account." +
      (reason ? `\n\nDetails:\n${reason}` : "") +
      "\n\nWe will contact you once this is resolved or if we need any additional information.";
  } else {
    introLine = "Your application has been reviewed.";
    bodyLine =
      "At this time we are not able to open an account. If you have questions, please contact our office or your sales representative.";
  }

  const greeting = officerName ? `Dear ${esc(officerName)},` : "Dear Customer,";

  const html = `
  <div style="background:${EMAIL_BG};padding:26px 0;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0"
                 style="max-width:640px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
            <tr>
              <td style="padding:18px 20px;border-bottom:1px solid #eef2f7;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="width:64px;vertical-align:middle;">
                      <div style="width:54px;height:54px;border-radius:999px;overflow:hidden;background:#ffffff;border:1px solid #e5e7eb;display:flex;align-items:center;justify-content:center;">
                        <img src="cid:jpLogo" alt="Jimenez Produce"
                             style="max-width:54px;max-height:54px;width:auto;height:auto;display:block;" />
                      </div>
                    </td>
                    <td style="vertical-align:middle;">
                      <div style="font-size:22px;font-weight:800;color:#111827;line-height:1.1;">Jimenez Produce</div>
                      <div style="font-size:16px;color:#6b7280;margin-top:2px;">Application Status: ${esc(
                        status
                      )}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 20px 14px;">
                <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:6px;">${greeting}</div>
                <div style="font-size:13px;color:#374151;margin-bottom:8px;">
                  <strong>Business:</strong> ${
                    businessNameLine || "your business"
                  }
                </div>

                <div style="font-size:13px;font-weight:800;color:#111827;margin-bottom:6px;">${esc(
                  introLine
                )}</div>

                <div style="font-size:13px;color:#4b5563;line-height:1.6;white-space:pre-wrap;">
${esc(bodyLine)}
                </div>

                ${buttonHtml}

                <div style="margin-top:18px;border-top:1px solid #eef2f7;padding-top:12px;font-size:12px;color:#6b7280;">
                  Office: <a href="tel:+12512622607" style="color:#2563eb;text-decoration:none;">(251) 262-2607</a>
                  &nbsp;•&nbsp;
                  Email: <a href="mailto:${esc(
                    PUBLIC_REPLY_EMAIL
                  )}" style="color:#2563eb;text-decoration:none;">${esc(
    PUBLIC_REPLY_EMAIL
  )}</a>
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>`;

  const text =
    `Jimenez Produce – Application Status Update\n\n` +
    (officerName ? `Dear ${officerName},\n\n` : "Dear Customer,\n\n") +
    `Status: ${status}\n` +
    `Business: ${stripTags_(businessNameLine)}\n\n` +
    `${introLine}\n\n` +
    `${bodyLine}\n\n` +
    (extraText ? extraText + "\n" : "") +
    `Jimenez Produce\n(251) 262-2607\n${PUBLIC_REPLY_EMAIL}\n`;

  return { html, text };
}

/***********************
 * 8) Send Email (Pretty HTML + Plain fallback + Inline Logo CID)
 ***********************/
function sendEmailPretty_(opts) {
  const inline = getInlineLogo_(); // { jpLogo: Blob } or null
  const mailOpts = {
    to: opts.to,
    subject: opts.subject,
    name: "Jimenez Produce",
    replyTo: opts.replyTo || PUBLIC_REPLY_EMAIL,
    htmlBody: opts.htmlBody,
    body: opts.body || "Jimenez Produce",
  };

  if (opts.bcc) mailOpts.bcc = opts.bcc;

  if (inline) {
    mailOpts.inlineImages = inline;
  } else {
    // If logo fetch fails, still send email (image just won’t show)
    mailOpts.htmlBody = (opts.htmlBody || "").replace(
      /<img[^>]*cid:jpLogo[^>]*>/gi,
      ""
    );
  }

  MailApp.sendEmail(mailOpts);
}

function getInlineLogo_() {
  try {
    const resp = UrlFetchApp.fetch(JP_LOGO_URL, { muteHttpExceptions: true });
    if (resp.getResponseCode() !== 200) return null;

    const blob = resp.getBlob().setName("jpLogo.png");
    return { jpLogo: blob };
  } catch (e) {
    Logger.log("Logo fetch failed: " + e);
    return null;
  }
}

/***********************
 * 9) Helpers (Sheet + Data)
 ***********************/
function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getHeaderMap_(sheet) {
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const map = {};
  headers.forEach(function (h, i) {
    if (h) map[String(h).trim()] = i + 1;
  });
  return map;
}

function getRowDataByHeader_(sheet, row) {
  const headerMap = getHeaderMap_(sheet);

  function val(header) {
    const col = headerMap[header];
    return col ? sheet.getRange(row, col).getValue() : "";
  }

  return {
    companyLegalName: val("Company Legal Name"),
    companyDBA: val("Company DBA"),
    ein: val("EIN"),
    companyAddressStreet: val("Company Street"),
    companyAddressCity: val("Company City"),
    companyAddressState: val("Company State"),
    companyAddressZip: val("Company Zip"),
    companyPhone: val("Company Phone"),

    officerFirst: val("Officer First Name"),
    officerLast: val("Officer Last Name"),
    officerTitle: val("Officer Title"),
    officerMobile: val("Officer Mobile"),
    officerEmail: val("Officer Email"),

    homeAddressStreet: val("Home Street"),
    homeAddressCity: val("Home City"),
    homeAddressState: val("Home State"),
    homeAddressZip: val("Home Zip"),

    guarantorFirst: val("Guarantor First Name"),
    guarantorLast: val("Guarantor Last Name"),
    guarantorTitle: val("Guarantor Title"),

    lockboxPermission: val("Lockbox Permission"),
    deliveryInstructions: val("Delivery Instructions"),

    primaryDay: val("Primary Delivery Day"),
    primaryWindow: val("Primary Delivery Window"),
    secondaryDay: val("Secondary Delivery Day"),
    secondaryWindow: val("Secondary Delivery Window"),

    receivingName: val("Receiving Contact Name"),
    receivingPhone: val("Receiving Contact Phone"),

    apEmail: val("AP Email"),
    orderingName: val("Ordering Contact Name"),
    orderingPhone: val("Ordering Contact Phone"),

    salesRep: val("Sales Rep"),

    resaleCertUrl: val("Resale Certificate URL"),
    dlFrontUrl: val("Driver License Front URL"),
    dlBackUrl: val("Driver License Back URL"),
    signatureFileUrl: val("Signature File URL"),

    guarantorSignature: val("Guarantor Signature (Typed)"),
    guaranteeAck: val("Guarantee Acknowledged"),

    onHoldReasonRep: val("On Hold Reason (Rep)") || "",
    onHoldReasonCustomer: val("On Hold Reason (Customer)") || "",
  };
}

function escapeHtml_(str) {
  return String(str || "").replace(/[&<>"']/g, function (s) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[s];
  });
}

function stripTags_(html) {
  return String(html || "").replace(/<[^>]*>/g, "");
}

function formatBusinessLine_(data) {
  const esc = escapeHtml_;
  let business = esc(data.companyLegalName || "");
  if (data.companyDBA) business += " (DBA: " + esc(data.companyDBA) + ")";
  return business || "—";
}

function emailRow_(label, valueHtml) {
  return `
    <tr>
      <td style="padding:6px 0;width:38%;font-weight:800;color:#111827;">${label}</td>
      <td style="padding:6px 0;color:#374151;">${valueHtml || "—"}</td>
    </tr>`;
}

/***********************
 * 10) Rep Email Mapping (Andres REMOVED permanently)
 ***********************/
function getRepEmail_(repName) {
  if (!repName) return "";
  const key = String(repName).trim().toLowerCase();

  const map = {
    elizabeth: "elizabeth@jimenezproduce.com",
    jorge: "jorge@jimenezproduce.com",
    yhessenia: "yhessenia@jimenezproduce.com",
    other: ADMIN_EMAIL,
  };

  if (map[key]) return map[key];

  // If anything unknown, do NOT guess an address — route to admin
  return ADMIN_EMAIL;
}

/***********************
 * 11) Drive URL helpers
 ***********************/
function extractFileIdFromUrl_(url) {
  if (!url) return "";
  let m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m && m[1]) return m[1];
  m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m && m[1]) return m[1];
  return "";
}

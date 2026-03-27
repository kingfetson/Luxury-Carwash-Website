// ============================================================
//  AquaShield Car Wash Nairobi — Code.gs
//  Google Apps Script Web App — Booking Capture Backend
// ============================================================
//
//  HOW TO DEPLOY (one-time setup, ~5 minutes):
//
//  1. Open Google Sheets → create a new spreadsheet.
//     Name it "AquaShield – Bookings".
//
//  2. Extensions → Apps Script
//
//  3. Delete any existing code, paste THIS entire file.
//
//  4. Set NOTIFY_EMAIL for instant booking alerts (optional).
//
//  5. Deploy → New Deployment:
//       Type           → Web App
//       Execute as     → Me
//       Who has access → Anyone
//     Copy the Web App URL.
//
//  6. Paste the URL into script.js as SHEETS_WEBHOOK_URL.
//
//  7. Done. Every form submission → new row in your sheet.
// ============================================================

// ─── CONFIGURATION ───────────────────────────────────────────
var SHEET_NAME    = 'Bookings';
var NOTIFY_EMAIL  = '';              // e.g. 'manager@aquashield.co.ke'
var EMAIL_SUBJECT = '🚗 New Car Wash Booking — AquaShield';
// ─────────────────────────────────────────────────────────────

/**
 * Handles POST from the website booking form.
 */
function doPost(e) {
  try {
    var p = e.parameter;

    var name    = p.name            || '';
    var phone   = p.phone           || '';
    var vehicle = p.vehicle         || 'Not specified';
    var service = p.service         || 'Not specified';
    var pkg     = p['package']      || 'Not specified';
    var date    = p.preferredDate   || 'Not specified';
    var time    = p.preferredTime   || 'Any time';
    var notes   = p.notes           || '—';
    var ts      = p.submittedAt     || new Date().toLocaleString();
    var pageUrl = p.pageUrl         || '—';
    var ua      = p.userAgent       || '—';

    // Server-side validation
    if (!name || !phone || !service) {
      return jsonResponse({ result: 'error', error: 'Name, phone, and service are required.' });
    }

    // Get or create sheet
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);

      // Header row
      sheet.appendRow([
        'Timestamp (Nairobi)',
        'Client Name',
        'Phone',
        'Vehicle',
        'Service',
        'Package',
        'Preferred Date',
        'Preferred Time',
        'Notes',
        'Status',
        'Assigned Bay',
        'Payment',
        'Device',
        'Page URL',
      ]);

      // Style header
      var hdr = sheet.getRange(1, 1, 1, 14);
      hdr.setFontWeight('bold');
      hdr.setBackground('#0e1117');
      hdr.setFontColor('#00d4e8');
      sheet.setFrozenRows(1);

      // Column widths
      var widths = [200, 160, 140, 220, 200, 180, 130, 120, 280, 120, 120, 110, 100, 220];
      widths.forEach(function(w, i) { sheet.setColumnWidth(i + 1, w); });
    }

    // Detect device from user agent
    var device = /android|iphone|ipad|mobile/i.test(ua) ? 'Mobile' : 'Desktop';

    // Append booking row
    sheet.appendRow([
      ts,
      name,
      phone,
      vehicle,
      service,
      pkg,
      date,
      time,
      notes,
      'New',      // Status — update to: Confirmed / In Progress / Done / No-Show
      '',         // Assigned Bay — Bay 1 / Bay 2 / Bay 3
      '',         // Payment — M-Pesa / Cash / Card / Pending
      device,
      pageUrl,
    ]);

    // Highlight new row (cyan tint for easy scanning)
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 14).setBackground('#e8fafc');

    // Optional: Bold the vehicle & service columns for quick scan
    sheet.getRange(lastRow, 4, 1, 2).setFontWeight('bold');

    // Optional email notification
    if (NOTIFY_EMAIL) {
      var body =
        '🚗 New Car Wash Booking — AquaShield\n\n' +
        'Client   : ' + name    + '\n' +
        'Phone    : ' + phone   + '\n' +
        'Vehicle  : ' + vehicle + '\n' +
        'Service  : ' + service + '\n' +
        'Package  : ' + pkg     + '\n' +
        'Date     : ' + date    + '\n' +
        'Time     : ' + time    + '\n' +
        'Notes    : ' + notes   + '\n\n' +
        'Received : ' + ts      + '\n\n' +
        'View spreadsheet: ' + ss.getUrl();

      MailApp.sendEmail(NOTIFY_EMAIL, EMAIL_SUBJECT, body);
    }

    return jsonResponse({ result: 'success' });

  } catch (err) {
    Logger.log('doPost error: ' + err.message);
    return jsonResponse({ result: 'error', error: err.message });
  }
}


/**
 * Health check — open Web App URL in browser to verify it's live.
 */
function doGet() {
  return HtmlService.createHtmlOutput(
    '<h2 style="font-family:monospace;color:#00d4e8;background:#0e1117;padding:40px;margin:0">' +
    '✓ AquaShield Booking Webhook — LIVE</h2>' +
    '<p style="font-family:monospace;background:#0e1117;color:#8899aa;padding:0 40px 40px">POST booking data here.</p>'
  );
}


/**
 * JSON response with correct MIME type.
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

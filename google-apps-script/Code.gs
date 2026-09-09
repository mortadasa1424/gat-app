/**
 * Leen GAT lead-capture Web App — final version.
 *
 * Accepts the frontend's form-encoded (URLSearchParams) POST body, or a JSON
 * body if the frontend ever switches back to one. Validates and writes one
 * row per lead into the "Leads" sheet, mapping values to columns by header
 * NAME (not position), and never silently swallows an error — every failure
 * path is logged with console.error so it shows up in Executions, and every
 * response is still valid JSON so the platform never sees an uncaught
 * exception.
 *
 * grade_level convention: the displayed label IS the value sent here and
 * stored in the sheet, verbatim — no translation, no internal code. Only
 * these four exact strings are accepted: "10th Grade", "11th Grade",
 * "12th Grade", "Other".
 *
 * SETUP:
 *   1. Put your real spreadsheet ID in SPREADSHEET_ID below.
 *   2. Paste this whole file over your existing Code.gs. Save.
 *   3. Deploy > Manage deployments > edit your existing deployment >
 *      Version: "New version" > Deploy.
 *      This step is required — saving alone does NOT update the live /exec
 *      URL. The web app keeps serving the code from the last deployed
 *      version until you explicitly create a new one.
 *   4. Submit the form from the browser, then open the Apps Script editor >
 *      Executions (left sidebar) and open the newest doPost run to read the
 *      logs.
 */

// TODO: put your real spreadsheet ID here.
const SPREADSHEET_ID = 'PUT-YOUR-EXISTING-SPREADSHEET-ID-HERE';
const SHEET_NAME = 'Leads';

// Exact column order required in the sheet.
const REQUIRED_HEADERS = [
  'received_at',
  'lead_id',
  'name',
  'phone',
  'grade_level',
];

const ALLOWED_GRADE_LEVELS = ['10th Grade', '11th Grade', '12th Grade', 'Other'];

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/**
 * Accepts either a form-encoded body (auto-parsed by Apps Script into
 * e.parameter — this is what the current frontend sends) or a JSON body.
 * Always returns a plain object; never throws.
 */
function parsePayload_(e) {
  if (!e) {
    console.error('parsePayload_: no event object at all.');
    return {};
  }

  if (e.parameter && Object.keys(e.parameter).length > 0) {
    console.log('parsePayload_: form-encoded e.parameter = ' + JSON.stringify(e.parameter));
    return e.parameter;
  }

  var raw = e.postData && e.postData.contents;
  console.log('parsePayload_: e.parameter empty. postData.type=' + (e.postData && e.postData.type) + ' raw=' + raw);
  if (raw) {
    try {
      var parsed = JSON.parse(raw);
      console.log('parsePayload_: parsed raw body as JSON = ' + JSON.stringify(parsed));
      return parsed;
    } catch (err) {
      console.error('parsePayload_: raw body present but not valid JSON, and e.parameter was empty. Error: ' + err);
    }
  }

  console.error('parsePayload_: no usable payload found on this request.');
  return {};
}

/**
 * Validates and normalizes the parsed payload.
 * Returns { ok: true, data } or { ok: false, error }.
 */
function validateAndClean_(payload) {
  var name = String(payload.name || '').trim();

  var phone = String(payload.phone || '').trim();
  if (!phone) {
    return { ok: false, error: 'phone is required' };
  }

  var gradeLevel = String(payload.grade_level || '').trim();
  if (!gradeLevel) {
    return { ok: false, error: 'grade_level is required' };
  }
  if (ALLOWED_GRADE_LEVELS.indexOf(gradeLevel) === -1) {
    return { ok: false, error: 'grade_level not in allowed list (10th Grade/11th Grade/12th Grade/Other): ' + gradeLevel };
  }

  return {
    ok: true,
    data: {
      name: name,
      phone: phone,
      grade_level: gradeLevel,
    },
  };
}

// ---------------------------------------------------------------------------
// Sheet access
// ---------------------------------------------------------------------------

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOrCreateSheet_(ss) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    console.log('getOrCreateSheet_: sheet "' + SHEET_NAME + '" did not exist, creating it.');
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeaders_(sheet) {
  var lastCol = sheet.getLastColumn();
  var existing = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

  if (existing.length === 0) {
    console.log('ensureHeaders_: writing header row: ' + REQUIRED_HEADERS.join(', '));
    sheet.getRange(1, 1, 1, REQUIRED_HEADERS.length).setValues([REQUIRED_HEADERS]);
    return REQUIRED_HEADERS;
  }

  var missing = REQUIRED_HEADERS.filter(function (h) { return existing.indexOf(h) === -1; });
  if (missing.length > 0) {
    console.log('ensureHeaders_: sheet is missing headers ' + missing.join(', ') + ' — appending them.');
    sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
    return existing.concat(missing);
  }

  return existing;
}

/**
 * Appends one row, mapping each value to the column whose header matches its
 * key by NAME, so this keeps working regardless of column order.
 */
function appendRowByHeaders_(sheet, dataObj) {
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var row = headers.map(function (h) {
    return Object.prototype.hasOwnProperty.call(dataObj, h) ? dataObj[h] : '';
  });
  console.log('appendRowByHeaders_: headers=' + JSON.stringify(headers) + ' row=' + JSON.stringify(row));
  sheet.appendRow(row);
}

// ---------------------------------------------------------------------------
// HTTP handlers
// ---------------------------------------------------------------------------

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return jsonResponse_({ ok: true, success: true, message: 'Leen GAT lead webhook is live.' });
}

function doPost(e) {
  try {
    console.log('doPost: postData.type=' + (e.postData && e.postData.type) + ' postData.length=' + (e.postData && e.postData.length));

    var payload = parsePayload_(e);
    console.log('doPost: parsed payload = ' + JSON.stringify(payload));

    var validated = validateAndClean_(payload);
    if (!validated.ok) {
      console.error('doPost: validation failed — ' + validated.error + '. payload=' + JSON.stringify(payload));
      return jsonResponse_({ success: false, error: validated.error });
    }

    var ss = getSpreadsheet_();
    var sheet = getOrCreateSheet_(ss);
    ensureHeaders_(sheet);

    var leadId = Utilities.getUuid();
    var receivedAt = new Date().toISOString();

    appendRowByHeaders_(sheet, {
      received_at: receivedAt,
      lead_id: leadId,
      name: validated.data.name,
      phone: validated.data.phone,
      grade_level: validated.data.grade_level,
    });

    console.log('doPost: row appended successfully. lead_id=' + leadId);
    return jsonResponse_({ success: true, lead_id: leadId });
  } catch (err) {
    console.error('doPost: unhandled error — ' + err + '\n' + (err && err.stack));
    return jsonResponse_({ success: false, error: String(err) });
  }
}

// ---------------------------------------------------------------------------
// Manual utilities (run these from the Apps Script editor, not from the web)
// ---------------------------------------------------------------------------

/** One-off setup: creates the sheet and header row if they don't exist yet. */
function setupLeadsSheet() {
  var ss = getSpreadsheet_();
  var sheet = getOrCreateSheet_(ss);
  var headers = ensureHeaders_(sheet);
  console.log('setupLeadsSheet: headers are now ' + JSON.stringify(headers));
}

/** Sanity check: writes one row directly, bypassing HTTP entirely. */
function testWrite() {
  var ss = getSpreadsheet_();
  var sheet = getOrCreateSheet_(ss);
  ensureHeaders_(sheet);
  appendRowByHeaders_(sheet, {
    received_at: new Date().toISOString(),
    lead_id: Utilities.getUuid(),
    name: 'Manual Test',
    phone: '+966500000000',
    grade_level: '12th Grade',
  });
  console.log('testWrite: done.');
}

/** Simulates exactly what the browser's no-cors form POST sends. */
function testDoPostFormEncoded() {
  var fakeEvent = {
    parameter: {
      name: 'Simulated Form POST',
      phone: '+966511111111',
      grade_level: 'Other',
    },
    postData: null,
  };
  var result = doPost(fakeEvent);
  console.log('testDoPostFormEncoded: response=' + result.getContent());
}

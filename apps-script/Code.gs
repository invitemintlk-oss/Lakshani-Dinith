/**
 * Lakshani & Akalanka — RSVP receiver (Google Apps Script)
 *
 * Sheet: https://docs.google.com/spreadsheets/d/1C8X1s3MWCfZrgtfBQFSN4B0LmL3APbG6xD9_upavsA8/edit
 *
 * Tabs created automatically:
 *   - "Wedding RSVP"     (16 Jan 2027, Ahaspokuna Holiday Resort)
 *   - "Homecoming RSVP"  (20 Jan 2027, Sirimali Grand Meridian Hotel)
 *   - "Summary"          (live totals for both events)
 *
 * Deploy: Deploy → New deployment → Web app
 *         Execute as: Me   |   Who has access: Anyone
 * Then paste the /exec URL into SCRIPT_URL in src/App.tsx.
 */

const SPREADSHEET_ID = "1C8X1s3MWCfZrgtfBQFSN4B0LmL3APbG6xD9_upavsA8";

const SHEETS = {
  wedding: "Wedding RSVP",
  homecoming: "Homecoming RSVP",
};

const HEADERS = ["Timestamp", "Invited As", "Name", "Attending", "Guests", "Wish"];

const COLORS = {
  wedding: { header: "#be185d", band: "#fdf2f8" },   // pink
  homecoming: { header: "#b91c1c", band: "#fef2f2" }, // red
};

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return json({ result: "error", error: "Server busy, please try again." });
  }

  try {
    const p = (e && e.parameter) || {};

    if (p.formName !== "rsvp") {
      return json({ result: "error", error: "Invalid formName" });
    }

    const event = p.Event === "homecoming" ? "homecoming" : "wedding";
    const sheet = getEventSheet(event);

    const guests = Math.max(0, parseInt(p.Guests, 10) || 0);
    const attending = guests > 0 ? "Yes" : "No";

    sheet.appendRow([
      new Date(),
      clean(p["Invited As"]),
      clean(p.Name),
      attending,
      guests,
      clean(p.Wish),
    ]);

    return json({ result: "success", event: event, row: sheet.getLastRow() });
  } catch (err) {
    return json({ result: "error", error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

/** Returns the tab for an event, creating and styling it if needed. */
function getEventSheet(event) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const name = SHEETS[event];
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    styleSheet(sheet, event);
    ensureSummary(ss);
  } else if (sheet.getRange(1, 1).getValue() !== HEADERS[0]) {
    styleSheet(sheet, event);
  }
  return sheet;
}

function styleSheet(sheet, event) {
  const c = COLORS[event];
  const header = sheet.getRange(1, 1, 1, HEADERS.length);
  header
    .setValues([HEADERS])
    .setFontWeight("bold")
    .setFontColor("#ffffff")
    .setBackground(c.header)
    .setHorizontalAlignment("center");
  sheet.setFrozenRows(1);

  sheet.setColumnWidth(1, 170); // Timestamp
  sheet.setColumnWidth(2, 200); // Invited As
  sheet.setColumnWidth(3, 200); // Name
  sheet.setColumnWidth(4, 90);  // Attending
  sheet.setColumnWidth(5, 80);  // Guests
  sheet.setColumnWidth(6, 380); // Wish

  sheet.getRange("A2:A").setNumberFormat("yyyy-mm-dd hh:mm");
  sheet.getRange("D2:E").setHorizontalAlignment("center");
  sheet.getRange("F2:F").setWrap(true);

  // Highlight declines
  const rules = sheet.getConditionalFormatRules();
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$D2="No"')
      .setBackground("#f5f5f4")
      .setFontColor("#78716c")
      .setRanges([sheet.getRange("A2:F")])
      .build()
  );
  sheet.setConditionalFormatRules(rules);

  // Alternating row colours
  if (sheet.getBandings().length === 0) {
    sheet.getRange("A1:F1000")
      .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false)
      .setHeaderRowColor(c.header)
      .setFirstRowColor("#ffffff")
      .setSecondRowColor(c.band);
  }
}

/** Live totals for both events. */
function ensureSummary(ss) {
  let s = ss.getSheetByName("Summary");
  if (!s) s = ss.insertSheet("Summary", 0);

  const w = "'" + SHEETS.wedding + "'";
  const h = "'" + SHEETS.homecoming + "'";
  const hasW = !!ss.getSheetByName(SHEETS.wedding);
  const hasH = !!ss.getSheetByName(SHEETS.homecoming);
  const f = (has, formula) => (has ? formula : 0);

  s.clear();
  s.getRange("A1:D1")
    .setValues([["Event", "Responses", "Attending (guests)", "Declined"]])
    .setFontWeight("bold").setFontColor("#ffffff").setBackground("#44403c");
  s.getRange("A2:D3").setValues([
    [
      "Wedding · 16 Jan 2027",
      f(hasW, "=COUNTA(" + w + "!C2:C)"),
      f(hasW, "=SUM(" + w + "!E2:E)"),
      f(hasW, '=COUNTIF(' + w + '!D2:D,"No")'),
    ],
    [
      "Homecoming · 20 Jan 2027",
      f(hasH, "=COUNTA(" + h + "!C2:C)"),
      f(hasH, "=SUM(" + h + "!E2:E)"),
      f(hasH, '=COUNTIF(' + h + '!D2:D,"No")'),
    ],
  ]);
  s.getRange("A2:A2").setBackground("#fdf2f8");
  s.getRange("A3:A3").setBackground("#fef2f2");
  s.getRange("B2:D3").setHorizontalAlignment("center");
  s.setColumnWidth(1, 220);
  s.setColumnWidths(2, 3, 150);
  s.setFrozenRows(1);
}

/** Run once from the editor (▶ Run → setup) to create all tabs and grant permissions. */
function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  getEventSheet("wedding");
  getEventSheet("homecoming");
  ensureSummary(ss);
}

/** Run from the editor to add a sample row and check everything works. */
function testRsvp() {
  const res = handleRequest({
    parameter: {
      formName: "rsvp",
      Event: "wedding",
      "Invited As": "Mr. Test",
      Name: "Test Guest",
      Guests: "2",
      Wish: "Congratulations!",
    },
  });
  Logger.log(res.getContent());
}

function clean(v) {
  // Strip leading = + - @ so guest input can't become a spreadsheet formula
  return String(v == null ? "" : v).trim().slice(0, 1000).replace(/^[=+\-@]+/, "");
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

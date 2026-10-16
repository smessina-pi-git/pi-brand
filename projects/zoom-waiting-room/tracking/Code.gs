// Download log for the Zoom waiting room builder.
// One row per successful Download click. Nothing personal: no name, no logo, no message.
// Setup: see ../README.md, "Download tracking".

var SHEET = 'Downloads';

function doPost(e) {
  var d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) {}
  var mode = d.mode === 'partner' ? 'partner' : d.mode === 'internal' ? 'internal' : '';
  if (!mode) return out('ignored');
  var sh = sheet();
  sh.appendRow([
    new Date(),
    mode,
    clean(d.profile, 40),
    clean(d.browser, 40),
    clean(d.host, 80),
    clean(d.v, 20)
  ]);
  return out('ok');
}

function sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.appendRow(['time', 'mode', 'profile', 'browser', 'host', 'version']);
    sh.setFrozenRows(1);
  }
  return sh;
}

// the URL is public: a value starting with = + - @ would become a formula, so store it as text
function clean(v, n) {
  var s = String(v || '').slice(0, n);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function out(s) { return ContentService.createTextOutput(s); }

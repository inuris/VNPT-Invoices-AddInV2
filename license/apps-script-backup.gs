// Backup/reference copy of the Apps Script backing /license.
// Lives in the real Google Apps Script project bound to the Google Sheet
// (SS_ID below) — not executed from this repo. Kept here for version
// history and context since Apps Script itself isn't git-tracked.
// Snapshot taken: 2026-10-02.

var SS_ID = '1fhF2O5LeeVxEckGijEyjBH-IfzVijc3TdtsPwBDPPaQ';
// ====== Cột kết quả trong Form (G, H, I) ======
var COL_STATUS = 7;
var COL_LICENSE = 8;
var COL_EXP = 9;

function doGet(e) {
  try {
    var email = String(e.parameter.email || '').trim();
    var passcode = String(e.parameter.passcode || '').trim();

    var auth = authenticateUser_(email, passcode);
    if (!auth.ok) {
      var msg = auth.reason === 'locked' ? 'Tài khoản đã bị khóa' : 'Sai email hoặc passcode';
      return jsonResponse_({ status: 'error', message: msg, data: null });
    }

    var sheet = SpreadsheetApp.openById(SS_ID).getSheetByName('Form');
    var values = sheet.getDataRange().getValues();
    var headers = values[0];
    var idx = {};
    headers.forEach(function (h, i) { idx[h] = i; });

    var records = values.slice(1)
      .filter(function (row) {
        return String(row[idx.Email] || '').trim().toLowerCase() === email.toLowerCase()
            && String(row[idx.LicenseKey] || '').trim() !== '';
      })
      .map(function (row) {
        return {
          date: formatCell_(row[idx.Timestamp], 'dd/MM/yyyy HH:mm'),
          mst: String(row[idx.TaxCode] || ''),
          license: row[idx.LicenseKey],
          exp: formatCell_(row[idx.ExpireDate], 'dd/MM/yyyy'),
          note: row[idx.Note] || ''
        };
      })
      .reverse(); // mới nhất trước

    return jsonResponse_({ status: 'success', message: 'OK', data: records });
  } catch (err) {
    return jsonResponse_({ status: 'error', message: err.message, data: null });
  }
}

// Sheet có thể tự parse Timestamp/ExpireDate thành kiểu Date dù ghi vào là string — ép lại cho chắc.
function formatCell_(v, pattern) {
  var d;
  if (Object.prototype.toString.call(v) === '[object Date]') {
    d = v;
  } else if (typeof v === 'string') {
    var m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/); // dd/MM/yyyy HH:mm[:ss]
    if (m) d = new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5]);
    else {
      var m2 = v.match(/^(\d{4})-(\d{2})-(\d{2})/); // yyyy-MM-dd
      if (m2) d = new Date(+m2[1], +m2[2] - 1, +m2[3]);
    }
  }
  if (!d || isNaN(d.getTime())) return v; // "Vĩnh viễn" hoặc giá trị lạ -> giữ nguyên
  return Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', pattern);
}

// ====== Đọc cấu hình từ Script Properties ======
function getConfig_() {
  var props = PropertiesService.getScriptProperties();
  return {
    workerUrl: props.getProperty('WORKER_URL'),
    apiSecret: props.getProperty('API_SECRET')
  };
}

function doPost(e) {
  try {

    if (e.parameter.action === 'reset_passcode') {
      return handleResetPasscode_(String(e.parameter.email || '').trim());
    }

    var sheet = SpreadsheetApp.openById(SS_ID).getSheetByName('Form');
    var row = recordData_(sheet, e);

    var email = String(e.parameter.Email || '').trim();
    var passcode = String(e.parameter.Passcode || '').trim();
    var mst = String(e.parameter.TaxCode || '').trim();
    var monthsRaw = String(e.parameter.ValidRange || '').trim();

    var auth = authenticateUser_(email, passcode);
    if (!auth.ok) {
      var msg = auth.reason === 'locked' ? 'Tài khoản đã bị khóa' : 'Sai passcode hoặc user không active';
      setStatus_(sheet, row, msg);
      return jsonResponse_({ status: false, error: msg });
    }

    if (!mst) {
      setStatus_(sheet, row, 'Thiếu MST');
      return jsonResponse_({ status: false, error: 'missing mst' });
    }

    var exp = computeExpiry_(monthsRaw);
    var result = requestLicense_(mst, exp);
    if (!result.ok) {
      setStatus_(sheet, row, 'Worker lỗi: ' + result.error);
      return jsonResponse_({ status: false, error: result.error });
    }

    writeResult_(sheet, row, result.license, exp);
    return jsonResponse_({ status: true });
  } catch (err) {
    return jsonResponse_({ status: false, error: err.message });
  }
}

function recordData_(sheet, e) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    row.push(headers[i] === 'Timestamp'
      ? Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm:ss')
      : (e.parameter[headers[i]] || ''));
  }
  sheet.appendRow(row);
  return sheet.getLastRow();
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ====== Xác thực user theo tab Users ======
function authenticateUser_(email, passcode) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (String(row[0]).trim().toLowerCase() !== email.toLowerCase()) continue;

    var active = (row[2] === 1 || row[2] === '1' || row[2] === true);
    if (!active) return { ok: false, reason: 'locked' };

    var rowNum = i + 1;
    if (String(row[1]).trim() === passcode) {
      if (Number(row[3]) !== 0) sheet.getRange(rowNum, 4).setValue(0);
      return { ok: true };
    }

    var retry = (Number(row[3]) || 0) + 1;
    sheet.getRange(rowNum, 4).setValue(retry);
    if (retry >= 10) sheet.getRange(rowNum, 3).setValue(0);
    return { ok: false, reason: 'wrong' };
  }
  return { ok: false, reason: 'notfound' };
}

// ====== Tính ngày hết hạn từ số tháng ======
function computeExpiry_(monthsRaw) {
  var months = parseInt(monthsRaw, 10);
  if (isNaN(months) || months <= 0) return ''; // '' = vĩnh viễn
  var d = new Date();
  d.setMonth(d.getMonth() + months);
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

// ====== Gọi Cloudflare Worker để ký license ======
function requestLicense_(mst, exp) {
  var config = getConfig_();
  var resp;
  try {
    resp = UrlFetchApp.fetch(config.workerUrl, {
      method: 'post',
      contentType: 'application/json',
      headers: { 'X-Api-Key': config.apiSecret },
      payload: JSON.stringify({ mst: mst, exp: exp }),
      muteHttpExceptions: true
    });
  } catch (err) {
    return { ok: false, error: err.message };
  }
  try {
    return JSON.parse(resp.getContentText());
  } catch (err) {
    return { ok: false, error: 'invalid worker response' };
  }
}

// ====== Ghi trạng thái lỗi (dừng sớm, không sinh license) ======
function setStatus_(sheet, row, status) {
  sheet.getRange(row, COL_STATUS).setValue(status);
}

// ====== Ghi kết quả thành công ======
function writeResult_(sheet, row, license, exp) {
  sheet.getRange(row, COL_STATUS).setValue('OK');
  sheet.getRange(row, COL_LICENSE).setValue(license);
  sheet.getRange(row, COL_EXP).setValue(exp || 'Vĩnh viễn');
}

function handleResetPasscode_(email) {
  email = String(email || '').trim().toLowerCase();
  var sheet = SpreadsheetApp.openById(SS_ID).getSheetByName('Users');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var active = (data[i][2] === 1 || data[i][2] === '1' || data[i][2] === true);
    if (String(data[i][0]).trim().toLowerCase() === email && active) {
      var newCode = String(Math.floor(100000 + Math.random() * 900000));
      sheet.getRange(i + 1, 2).setValue(newCode);

      var html =
        '<div style="font-family:Arial,sans-serif;max-width:420px;margin:0 auto;padding:24px;color:#16161A">' +
          '<h2 style="margin:0 0 12px;font-size:18px;color:#16161A">VNPT Invoices Add-in V2 - License Generator</h2>' +
          '<p style="margin:0 0 16px;font-size:14px;color:#55534E">Passcode mới:</p>' +
          '<div style="font-family:Consolas,monospace;font-size:24px;font-weight:700;letter-spacing:4px;' +
            'background:#F1F1F4;border-radius:10px;padding:14px 20px;text-align:center;color:#4F46E5">' +
            newCode +
          '</div>' +
        '</div>';

      MailApp.sendEmail({
        to: data[i][0],
        name: 'VNPT Invoices Add-in V2',
        subject: 'Reset Passcode',
        body: 'Passcode mới: ' + newCode, // fallback cho client không đọc HTML
        htmlBody: html
      });
      break;
    }
  }
  return jsonResponse_({ status: true, message: 'Nếu email có trong hệ thống, passcode mới đã được gửi.' });
}

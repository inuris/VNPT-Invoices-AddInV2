# License Generator — system context

Self-service license-key generator for AM (Account Manager) staff. Lets AM
staff create signed license keys for customers without holding the ECDSA
private key, with request tracking and basic account hygiene.

## Architecture

```
/license/index.html (this repo, GitHub Pages)
        │  fetch (POST no-cors for writes, GET plain fetch for reads)
        ▼
Google Apps Script Web App (doGet/doPost)
  bound to Google Sheet SS_ID = 1fhF2O5LeeVxEckGijEyjBH-IfzVijc3TdtsPwBDPPaQ
        │  UrlFetchApp POST, header X-Api-Key
        ▼
Cloudflare Worker (holds ECDSA P-256 private key as secret)
  signs license: base64url(JSON payload) + '.' + base64url(signature)
  payload = {msts:[mst], exp?}  (exp omitted = permanent)
```

Apps Script has no native ECDSA support, so signing is delegated to the
Worker. The Worker mirrors `/licgen/index.html`'s client-side signing logic
exactly, so licenses stay compatible with the already-deployed Excel add-in
verifier.

`license/apps-script-backup.gs` in this repo is a **backup/reference copy**
of the live Apps Script code. It is not executed from this repo — Apps
Script itself isn't git-tracked. Standing rule: every Apps Script change
must be written into that `.gs` file and committed/pushed here; the user
copies it into the real Apps Script editor manually.

## Data model (Google Sheet, SS_ID above)

**Tab `Form`** — one row per license request. Columns include (at least):
`Timestamp, Email, Passcode, TaxCode, ValidRange, Note, Status, LicenseKey, ExpireDate`.
`recordData_` builds the row dynamically from the sheet's actual header row,
so column order/renaming doesn't need a code change — except header
`"Passcode"` is special-cased to always write `''` (never logs the real
passcode; see Known issues/fixes).
`COL_STATUS=7, COL_LICENSE=8, COL_EXP=9` (G/H/I) are fixed by position for
writing the result after the fact (`setStatus_`/`writeResult_`).

**Tab `Users`** — auth + lockout state. Columns A–D:
- A: email (username)
- B: passcode
- C: active (1/0)
- D: retry (failed-attempt counter)

## Flows

### Create license request (`doPost`, default action)
1. `recordData_` appends a row to `Form` immediately (so every attempt is
   logged, even failures), masking Passcode.
2. `authenticateUser_(email, passcode)` — see Auth below.
   - Fail → `setStatus_` writes the reason into the row's Status cell,
     returns `{status:false, error}`.
3. Require `TaxCode` non-empty → else Status="Thiếu MST".
4. `computeExpiry_(ValidRange)` — months string → `yyyy-MM-dd` expiry date,
   or `''` for permanent.
5. `requestLicense_(mst, exp)` — POSTs to Cloudflare Worker with
   `X-Api-Key` header; Worker returns `{ok, license}` or `{ok:false, error}`.
   - Fail → Status="Worker lỗi: ...".
6. `writeResult_` — Status="OK", LicenseKey, ExpireDate (or "Vĩnh viễn").

Front end calls this via `fetch(..., {method:'POST', mode:'no-cors', ...})`
— response is unreadable by design (fire-and-forget); the page just shows
"Đã nhận yêu cầu, bấm Tải lại sau vài phút để nhận license." No email is
sent for this flow (email-on-submit was removed once the "Tải" history
view existed).

### Lookup history (`doGet`)
1. `authenticateUser_(email, passcode)` from query params.
   - Fail → `{status:'error', message, data:null}`.
2. Read all of `Form`, filter rows where `Email` matches (case-insensitive)
   AND `LicenseKey` is non-empty (hides pending/failed rows).
3. Map to `{date, mst, license, exp, note}`, dates formatted via
   `formatCell_` (`dd/MM/yyyy HH:mm` for request date, `dd/MM/yyyy` for
   expiry; literal "Vĩnh viễn" passes through unchanged).
4. Reverse (newest first), return `{status:'success', data:records}`.

Front end uses a **plain fetch** (no `no-cors`) for this — confirmed
working in practice, so the response IS readable. Client does its own
filter-by-MST and pagination (20/page) over the full returned set.

### Passcode auth (`authenticateUser_`, used by both doGet and doPost)
- No matching email → `{ok:false, reason:'notfound'}`.
- Matching email, `active` falsy (0/''/false) → `{ok:false, reason:'locked'}`
  (checked before passcode comparison).
- Passcode matches → reset `retry` to 0 if nonzero, `{ok:true}`.
- Passcode wrong → increment `retry`; if `retry>=10`, set `active=0`
  (locks the account); `{ok:false, reason:'wrong'}`.

Callers map `reason==='locked'` to "Tài khoản đã bị khóa"; other reasons to
a generic wrong-email-or-passcode message (doesn't distinguish
not-found vs wrong-passcode, to avoid leaking which emails are registered).

### Self-service passcode reset (`doPost`, `action=reset_passcode`)
Checked as the very first line in `doPost`'s try block (before
`recordData_` runs — this ordering matters, see Known issues/fixes).
`handleResetPasscode_(email)`:
1. Generic response message is fixed regardless of outcome: "Nếu email có
   trong hệ thống, passcode mới đã được gửi." (privacy: never reveals
   whether the email exists).
2. 60-second cooldown per email via `CacheService.getScriptCache()`
   (key `reset_cd_<email>`) — if hit, returns the generic message with no
   further action. Protects MailApp's daily quota and avoids passcode
   churn from repeated clicks/retries.
3. If email matches a `Users` row: generate random 6-digit passcode,
   overwrite passcode/active=1/retry=0 (reset **unlocks** the account too
   — intentional, self-service recovery path), send email (HTML + plain
   text fallback via `MailApp.sendEmail`), set the cooldown cache entry.
4. Always returns the generic message.

Front end: "Reset passcode" link/button → native `confirm()` dialog against
the already-entered Email field → no-cors POST → shows "Kiểm tra email để
nhận passcode mới." No extra inputs.

## Front end (`license/index.html`)

- Shared auth block (Email + Passcode) at top, persisted to `localStorage`
  (`lic_email`, `lic_passcode` — passcode included, per explicit decision).
- 2-column layout (`grid-template-columns:3fr 7fr`, stacks under 860px):
  - Left card "Tạo license": the request form (MST, ValidRange dropdown,
    Note, submit).
  - Right card "Danh sách yêu cầu": icon-only "Tải" button next to the
    heading (not far-right), MST filter input (far right, ~20 chars wide),
    results table (Ngày yêu cầu, MST, License w/ truncation + copy button,
    Thời hạn, Ghi chú), pagination (20/page).
- `WEB_APP_URL` and `PAGE_SIZE=20` are the two config constants in the
  inline `<script>`.

## Known issues already fixed (for institutional memory)

- Sheet tab name must be exactly `'Form'` (not `'Form_Responses'`) —
  `getSheetByName` returns `null` silently on mismatch, crashing on the
  next `.getRange()`/`.getDataRange()` call.
- `reset_passcode` action check must run **before** `recordData_`/
  `e.parameter.Email` (capitalized) is read in `doPost` — originally the
  reset branch ran after the license-request variables were parsed and
  reused the wrong-cased `email` var, so it silently matched nothing.
- `handleResetPasscode_` originally required `active===true` to match a
  Users row, so a locked account (active=0) could never self-unlock via
  reset. Fixed: reset works regardless of active state, and a successful
  reset sets `active=1, retry=0`.
- TaxCode column must be **Plain Text** format in Google Sheets, or Sheets
  strips leading zeros from MSTs (e.g. `0315890356` → `315890356`). Not a
  code issue — a Sheets formatting setting.
- Passcode was being logged in plaintext into the `Form` tracking sheet on
  every request (via `recordData_`'s generic header-copy loop). Fixed:
  `"Passcode"` header is special-cased to always write `''`.
- No rate limit on `reset_passcode` risked exhausting MailApp's daily quota
  (a real "no email arrived" incident was traced to mail quota/delivery,
  not code) and letting repeated clicks churn a user's passcode. Fixed:
  60s per-email cooldown via `CacheService`.

## Accepted limitations (not fixed, by design/low priority)

- Minor race condition on concurrent `retry` increments (two near-simultaneous
  wrong-passcode attempts could both read the same stale retry count before
  either writes). Low stakes: worst case is a slightly delayed lockout.
- `doGet` reads the entire `Form` sheet on every call and filters in Apps
  Script. Fine at current scale; revisit (e.g. a per-user index or caching)
  only if the sheet grows large enough to make this slow.
- `doGet`'s generic auth-failure message doesn't distinguish "not found"
  from "wrong passcode" (intentional, to avoid leaking which emails are
  registered) — but this means a legitimate user mistyping their email
  sees the same message as a wrong passcode, slightly muddying
  self-diagnosis. Accepted trade-off for privacy.

## Debugging tips

- `no-cors` fetch responses are opaque in the browser. To see a real error
  from the Web App, call it directly with PowerShell's
  `Invoke-RestMethod -Method Post -Body @{...}` (not `curl.exe`, which
  needs `-L` to follow Google's redirect and then hits a separate
  `411 Length Required` curl bug on the redirected POST).
- Check Apps Script **Executions** log for exceptions swallowed by
  `try/catch` blocks that return a JSON error instead of throwing.
- "Passcode regenerated but no email" → check MailApp daily quota first
  (Executions log will show "Service invoked too many times for one day:
  email" if so), then Spam/Junk folder.

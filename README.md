# VNPT-Invoices-AddInV2 — Release & Update

Public repository hosting the **release artifacts**, the **ClickOnce install
page** (GitHub Pages), and the **auto-update manifest** for the VNPT
Invoices Excel add-in. (Source code is in a private repository.)

Everything now lives on `main` — this repo no longer uses a separate
`gh-pages` branch. **GitHub Pages must be set to serve from `main` / `/`
(root)** in repo Settings → Pages.

Served at:

> https://inuris.github.io/VNPT-Invoices-AddInV2/

## Layout

```
index.html                      ← trang tải (giữ nguyên)
.nojekyll                       ← tắt Jekyll (BẮT BUỘC để phục vụ mọi file)
setup.exe                       ← bootstrapper cài đặt
VNPT.Invoices.AddInV2.vsto      ← deployment manifest
Application Files/…             ← các bản build theo phiên bản (.deploy)
VNPT.Invoices.AddInV2.zip       ← trọn bộ publish, zip tự động (nút "Tải bộ cài")
update.json                     ← auto-update manifest (add-in đọc khi khởi động)
profile-json-generator/…        ← công cụ phụ trợ
```

**KHÔNG sửa tay** các file ClickOnce ở đây. Mỗi lần phát hành, chạy từ repo
**source**:

```powershell
powershell -ExecutionPolicy Bypass -File tools\deploy-to-pages.ps1 -PublishDir "C:\Code\VNPT-Invoices-Cursor\publish"
```

Script sẽ đồng bộ đầu ra Publish vào nhánh `main` (giữ `index.html` +
`.nojekyll`) rồi push → Pages tự cập nhật.

> Điều kiện để add-in **tự nâng cấp không cần gỡ bản cũ**: trong VS
> **Publish → Installation Folder URL** phải đặt đúng
> `https://inuris.github.io/VNPT-Invoices-AddInV2/` và Publish tới cùng URL
> mỗi bản.

## Auto-update manifest

The add-in checks this file on startup:

- Manifest (raw): `https://raw.githubusercontent.com/inuris/VNPT-Invoices-AddInV2/main/update.json`
- Releases: `https://github.com/inuris/VNPT-Invoices-AddInV2/releases/latest`

`update.json` fields:

| Field | Meaning |
|-------|---------|
| `latestVersion` | Newest published version in short `x.y` form, e.g. `1.1` (matches the release build's major.minor). |
| `downloadUrl` | Where the add-in opens when the user chooses to update (defaults to the latest release page). |
| `notes` | Short change summary shown to the user. |
| `mandatory` | `true` to re-notify even if the user dismissed this version. |

## Install button on `index.html`

**"Tải bộ cài"** is the only button, and it's the primary/required install
path for both new installs and updates — it links to
`VNPT.Invoices.AddInV2.zip` right next to `index.html` on this same site.

This zip is **not** a GitHub Release asset (that was tried and it broke —
GitHub's `releases/latest/download/<name>` link 404s the moment one release's
asset filename doesn't match exactly, and nothing enforces that). It's just a
regular file on `main`, rebuilt automatically by `deploy-to-pages.ps1` on
every publish — same mechanism as `setup.exe`, no manual step, nothing to
misname.

**Why not just link `setup.exe`/the `.vsto` directly and skip the zip?**
Tried that too — modern browsers download ClickOnce manifests instead of
invoking them, which breaks ClickOnce's security-zone check
(`file://` vs the `https://` the manifest expects). And a signed-but-untrusted
manifest (see below) hits a hard, non-interactive `SecurityException` when
activated that way. Running `setup.exe` **interactively** after unzipping
sidesteps both: it goes through the normal "publisher can't be verified,
install anyway?" prompt instead.

**The one rule that matters for updates to work via this path**: unzip to
the **same fixed folder every time** (e.g. `C:\VNPT-AddIn\`, overwrite in
place) and run `setup.exe` from there — never straight out of a zip/RAR
viewer's temp extraction folder. ClickOnce identifies a local install by the
path `setup.exe` ran from; a different path each time looks like a
conflicting install rather than an upgrade, and blocks with
`AddInAlreadyInstalledException` until the old one is manually uninstalled.
This is called out on the download page itself now.

**Signing**: the manifest is currently signed with Visual Studio's
auto-generated temporary dev certificate — self-signed, not trusted on any
machine but the one that created it. That's why the interactive "install
anyway" prompt matters (an actual trusted CA cert wouldn't need it). Fine for
this scale of internal rollout; a real code-signing certificate would remove
the warning if that's ever worth the cost.

ClickOnce's own **silent in-app auto-update** (checking the fixed
`Installation Folder URL` in the background, no page visit needed) still
works on top of this for machines that already got a clean first install —
it's just not the primary distribution path being relied on here.

## Publishing a new version

1. Run `tools\deploy-to-pages.ps1` from the source repo — pushes the new
   ClickOnce build **and** rebuilds `VNPT.Invoices.AddInV2.zip` to `main` in
   one step.
2. Update `update.json` → set `latestVersion` to that version, refresh
   `notes`, commit to `main`.

Clients running an older build will see the update prompt on next Excel open.
GitHub Releases are still fine to use for changelog/tag history if you want,
just not required for either download button.

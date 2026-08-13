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

**"Tải bộ cài"** is the only button, and it's the only one needed: it links
to `VNPT.Invoices.AddInV2.zip` right next to `index.html` on this same site.
Unzip and run `setup.exe` from inside the extracted folder — that performs a
normal ClickOnce install pointed at this same Pages URL, so **later versions
auto-update inside the add-in itself** (no need to come back to this page).

This zip is **not** a GitHub Release asset (that was tried and it broke —
GitHub's `releases/latest/download/<name>` link 404s the moment one release's
asset filename doesn't match exactly, and nothing enforces that). It's just a
regular file on `main`, rebuilt automatically by `deploy-to-pages.ps1` on
every publish — same mechanism as `setup.exe`, no manual step, nothing to
misname.

## Publishing a new version

1. Run `tools\deploy-to-pages.ps1` from the source repo — pushes the new
   ClickOnce build **and** rebuilds `VNPT.Invoices.AddInV2.zip` to `main` in
   one step.
2. Update `update.json` → set `latestVersion` to that version, refresh
   `notes`, commit to `main`.

Clients running an older build will see the update prompt on next Excel open.
GitHub Releases are still fine to use for changelog/tag history if you want,
just not required for either download button.

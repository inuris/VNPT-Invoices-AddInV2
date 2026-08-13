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

## Publishing a new version

1. Run `tools\deploy-to-pages.ps1` from the source repo to push the new
   ClickOnce build to `main`.
2. Create a GitHub Release here (tag `vX.Y.Z.W`) and attach the installer/zip.
3. Update `update.json` → set `latestVersion` to that version, refresh
   `notes`, commit to `main`.

Clients running an older build will see the update prompt on next Excel open.

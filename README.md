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
index.html                          ← trang tải (giữ nguyên)
.nojekyll                           ← tắt Jekyll (BẮT BUỘC để phục vụ mọi file)
setup.exe                           ← bootstrapper cài đặt
VNPT.Invoices.AddInV2.vsto          ← deployment manifest
Application Files/…                 ← các bản build theo phiên bản (.deploy)
VNPT.Invoices.AddInV2-Setup.exe     ← self-extracting installer, tự động (nút "Tải bộ cài")
update.json                         ← auto-update manifest (add-in đọc khi khởi động)
profile-json-generator/…            ← công cụ phụ trợ
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
`VNPT.Invoices.AddInV2-Setup.exe`, a **self-extracting installer (7-Zip SFX)**,
right next to `index.html` on this same site.

### Why SFX instead of a plain zip (tried first, replaced)

A plain zip needs the user to extract it correctly before running
`setup.exe`. In practice people ran `setup.exe` straight out of the zip/RAR
viewer's temp extraction view instead — a different random temp path every
single time. ClickOnce identifies a local install by the path `setup.exe`
ran from, so each of those looked like a *conflicting* install rather than
an upgrade, and blocked with `AddInAlreadyInstalledException` until the old
one was manually uninstalled. Telling users "always extract to the same
fixed folder" didn't hold up in practice.

The SFX removes the failure mode instead of documenting around it: the
install path (`%LocalAppData%\VNPT-AddIn` by default) is baked into the
`.exe` itself via `tools/make-sfx.ps1` (source repo) — nothing for the user
to choose or get wrong. Running the `.exe` extracts to that fixed path and
launches `setup.exe` from there automatically, every time.

**Why not just link `setup.exe`/the `.vsto` directly and skip packaging
entirely?** Also tried — modern browsers download ClickOnce manifests
instead of invoking them, which breaks ClickOnce's security-zone check
(`file://` vs the `https://` the manifest expects). And a
signed-but-untrusted manifest (see below) hits a hard, non-interactive
`SecurityException` when activated that way. `setup.exe` run interactively
(which is what the SFX does after extracting) sidesteps both — it goes
through the normal "publisher can't be verified, install anyway?" prompt
instead.

**Signing**: the manifest is currently signed with Visual Studio's
auto-generated temporary dev certificate — self-signed, not trusted on any
machine but the one that created it. That's why the interactive "install
anyway" prompt matters (an actual trusted CA cert wouldn't need it, and the
SFX can't skip it either — that's ClickOnce's own trust check, not a
packaging problem). Fine for this scale of internal rollout; a real
code-signing certificate would remove the warning if that's ever worth the
cost.

ClickOnce's own **silent in-app auto-update** (checking the fixed
`Installation Folder URL` in the background, no page visit needed) still
works on top of this for machines that already got a clean first install —
it's just not the primary distribution path being relied on here.

## Publishing a new version

1. Run `tools\deploy-to-pages.ps1` from the source repo — pushes the new
   ClickOnce build **and** rebuilds `VNPT.Invoices.AddInV2-Setup.exe` to
   `main` in one step (needs `7zSD.sfx` from the **LZMA SDK** package —
   *not* "7-Zip Extra", which stopped including it in 2014 — see
   `tools/make-sfx.ps1`).
2. Update `update.json` → set `latestVersion` to that version, refresh
   `notes`, commit to `main`.

Clients running an older build will see the update prompt on next Excel open.
GitHub Releases are still fine to use for changelog/tag history if you want,
just not required for either download button.

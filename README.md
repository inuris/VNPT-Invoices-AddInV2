# VNPT-Invoices-AddInV2 — Release & Update

Public repository hosting the **release artifacts** and the **auto-update manifest**
for the VNPT Invoices Excel add-in. (Source code is in a private repository.)

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

1. Create a GitHub Release here (tag `vX.Y.Z.W`) and attach the installer/zip.
2. Update `update.json` → set `latestVersion` to that version, refresh `notes`, commit to `main`.

Clients running an older build will see the update prompt on next Excel open.

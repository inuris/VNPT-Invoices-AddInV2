# Sơ đồ phát hành bản mới

Nguồn tham khảo: `RELEASE.md` và `docs/DEPLOY.md` trong repo Source. Sơ đồ này
cho thấy **2 cơ chế báo bản-mới khác nhau** chạy song song sau khi phát hành —
điểm hay bị nhầm là chỉ có một.

```mermaid
flowchart TD
    subgraph DEV["Máy dev"]
        V["VnptVersion.cs\nCurrent = 'x.y'"]
        PUB["\\publish\\\n(VS Publish output)"]
        V -- "VS: Build Release → Publish" --> PUB
    end

    subgraph SRC["Repo Source (private)"]
        V
    end

    subgraph PAGES_REPO["Repo Publish (public) — nhánh main"]
        BIN["setup.exe / .vsto\nApplication Files\\"]
        REL["GitHub Release\ntag vX.Y, đính kèm\nVNPT.Invoices.AddInV2.zip"]
        JSON["update.json\n{ latestVersion, notes }"]
    end

    PUB -- "publish.ps1 → deploy-to-pages.ps1\npush thẳng file ClickOnce" --> BIN
    PUB -- "zip cả \\publish\\,\ntạo Release mới" --> REL
    V -- "make-update-json.ps1\nghi latestVersion" --> JSON
    JSON -- "commit + push" --> BIN

    BIN -- "GitHub Pages serve tại\ninuris.github.io/VNPT-Invoices-AddInV2" --> SITE["index.html\n('Tải bộ cài' button)"]
    REL --> SITE

    SITE -- "user mới / máy offline:\ntải zip, giải nén, chạy setup.exe" --> NEWUSER["Người dùng cài lần đầu"]

    BIN -- "ClickOnce tự kiểm tra\nInstallation URL cố định,\ntải phần thay đổi" --> OLDUSER["Người dùng đã cài\n(mở Excel)"]
    JSON -- "add-in đọc update.json khi mở Excel\n→ hiện popup 'Đã có bản mới'" --> OLDUSER
```

## Đọc sơ đồ này thế nào

- **Cột trái (DEV/SRC)**: chỗ duy nhất bump version — `VnptVersion.cs`. Mọi
  thứ khác (nhãn ribbon, `update.json`, so sánh bản khi kiểm tra cập nhật) đọc
  từ hằng số này, không sửa ở đâu khác.
- **3 nhánh ra khỏi `\publish\`**: file ClickOnce (đẩy thẳng bằng script),
  zip cho GitHub Release, và `update.json` (sinh riêng từ `make-update-json.ps1`,
  **không tự động đi kèm khi chạy `publish.ps1`** — phải commit tay).
- **2 đường tới người dùng đã cài** (`OLDUSER`) là **độc lập nhau**:
  - ClickOnce tự âm thầm tải phần đổi khi mở Excel — không cần `update.json`.
  - Popup "Đã có bản mới" trong add-in là do add-in tự đọc `update.json` —
    không phải ClickOnce. Quên bước commit `update.json` thì ClickOnce vẫn
    tự cập nhật bình thường, chỉ là không có popup báo trước.
- **Người dùng cài lần đầu / máy offline** đi qua nút "Tải bộ cài" → zip
  (Release asset), không đụng tới `update.json` hay cơ chế ClickOnce
  tự-kiểm-tra cho tới sau khi đã cài xong.

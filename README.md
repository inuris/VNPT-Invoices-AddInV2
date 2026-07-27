# gh-pages — trang cài đặt ClickOnce (tự động quản lý)

Nhánh này được **GitHub Pages** phục vụ tại:

> https://inuris.github.io/VNPT-Invoices-AddInV2/

Nội dung nhánh là **đầu ra Publish (ClickOnce)** của add-in:

```
index.html                      ← trang tải (giữ nguyên)
.nojekyll                       ← tắt Jekyll (BẮT BUỘC để phục vụ mọi file)
setup.exe                       ← bootstrapper cài đặt
VNPT.Invoices.AddInV2.vsto      ← deployment manifest
Application Files/…             ← các bản build theo phiên bản (.deploy)
```

**KHÔNG sửa tay** các file ClickOnce ở đây. Mỗi lần phát hành, chạy từ repo **source**:

```powershell
pwsh tools/deploy-to-pages.ps1 -PublishDir "C:\Code\VNPT-Invoices-Cursor\publish"
```

Script sẽ đồng bộ đầu ra Publish vào nhánh này (giữ `index.html` + `.nojekyll`) rồi push → Pages tự cập nhật.

> Điều kiện để add-in **tự nâng cấp không cần gỡ bản cũ**: trong VS **Publish → Installation Folder URL**
> phải đặt đúng `https://inuris.github.io/VNPT-Invoices-AddInV2/` và Publish tới cùng URL mỗi bản.

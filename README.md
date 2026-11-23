# VNPT Invoices Add-in

Add-in cho Microsoft Excel giúp tạo và phát hành hóa đơn điện tử VNPT Invoice ngay trên bảng tính, gồm:

- Hóa đơn GTGT
- Phiếu xuất kho
- Chứng từ khấu trừ thuế TNCN

Trang tải về: **https://inuris.github.io/VNPT-Invoices-AddInV2/**

## Yêu cầu

- Windows có cài Microsoft Excel (Office 2010 trở lên)
- .NET Framework 4.8
- Tài khoản VNPT Invoice của doanh nghiệp

## Cài đặt

1. Mở [trang tải về](https://inuris.github.io/VNPT-Invoices-AddInV2/) và bấm **Tải bộ cài**.
2. Chạy file `VNPT.Invoices.AddInV2-Setup.exe` vừa tải.
3. Nếu Windows báo không xác minh được nhà phát hành, chọn **Cài đặt** (Install) để tiếp tục.
4. Mở lại Excel, add-in nằm ở thẻ **VNPT Invoice** trên thanh ribbon.

## Cập nhật

Khi có phiên bản mới, add-in hiện thông báo trên thanh ribbon. Bấm vào thông báo để mở trang tải về, tải bộ cài và
chạy lại như lúc cài đặt. Không cần gỡ bản cũ, cấu hình kết nối được giữ nguyên.

Nội dung từng phiên bản: [CHANGELOG.md](CHANGELOG.md).

## Bản quyền

Add-in có 30 ngày dùng thử cho mỗi mã số thuế. Để tiếp tục sử dụng, liên hệ bộ phận hỗ trợ để nhận mã kích hoạt, sau
đó nhập vào mục **Đăng ký sử dụng** trong add-in.

## Công cụ đi kèm

- [Tạo JSON cấu hình kết nối](https://inuris.github.io/VNPT-Invoices-AddInV2/profile-json-generator/): tạo sẵn file
  cấu hình kết nối để nhập vào add-in, tránh phải khai báo thủ công trên từng máy.

## Hướng dẫn và hỗ trợ

- Hướng dẫn sử dụng: https://vnpt-invoice-addin.gitbook.io/vnpt-invoice-addin-v2
- Hỗ trợ: TTKDGP — Phòng Giải pháp số

---

Các file cài đặt trong repo được tạo tự động mỗi lần phát hành, vui lòng không chỉnh sửa trực tiếp.

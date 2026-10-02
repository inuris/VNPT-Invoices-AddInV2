# Changelog

Mọi thay đổi đáng chú ý của VNPT Invoices Add-in được ghi ở đây, mới nhất ở trên cùng.

> **1.0 – 1.4**: không thể khôi phục — các bản này có trước khi repo bắt đầu được Git theo dõi
> (commit đầu tiên của repo đã là bản 1.5). Không có `update.json`/log nào lưu lại nội dung các
> bản này.

## 2.5 — 2026-09-30

Bảo mật: mã hóa file cấu hình kết nối (mật khẩu CAdmin/WebService) bằng Windows DPAPI thay vì lưu
chữ thường; tự nâng cấp file cũ, không cần nhập lại tài khoản.

## 2.4 — 2026-09-25

CusAddress (GTGT) chỉ bắt buộc khi có TenDonVi+MaSoThue; sửa publish.ps1 dùng đường dẫn tương đối.

## 2.3 — 2026-09-04

Bổ sung đầy đủ mã lỗi VNPT trả về (thông báo lỗi chi tiết hơn); GTGT tt78 hỗ trợ đủ Extra1-11 và
suất 8%.

## 2.2 — 2026-08-22

Hóa đơn GTGT chuyển sang chuẩn XML tt78; đọc số tiền ngoại tệ có phần lẻ (cents); fix lỗi cài đặt
khi cùng phiên bản (ClickOnce).

## 2.1 — 2026-08-22

Nút Mẫu đổi thành dropdown chọn thẳng GTGT/PXK/CTT; bỏ ép Kiểm tra dữ liệu trước khi Tạo nháp/Tạo
& phát hành; fix lỗi kết nối khi Domain lỡ nhập kèm http(s)://; hỗ trợ thứ tự cột tùy chỉnh khi
Tạo mẫu.

## 2.0 — 2026-08-18

Đổi thông báo kích hoạt license; nút license trên ribbon báo trước khi license sắp hết hạn (còn
dưới 30 ngày).

## 1.9 — 2026-08-18

Sửa lỗi có thể khiến Excel thỉnh thoảng không nạp được add-in sau khi mở lại (giới hạn thời gian
chờ mạng khi kiểm tra bản mới, chạy trễ hơn để không tranh chấp với lúc ribbon đang nạp).

## 1.8 — 2026-08-18

Sửa nút "Tạo & phát hành" bị mất dấu &; gọn lại hộp thoại Đăng ký sử dụng; icon add-in hiện đúng
trong Add/Remove Programs; bộ cài không còn cõng theo các bản cũ.

## 1.7 — 2026-08-17

Thêm hỗ trợ hóa đơn cho thuê tài chính, hóa đơn chiết khấu thương mại (SBKe/NBKe) và hàng hóa đặc
trưng (xe ô tô/xe máy, dịch vụ vận chuyển, TMĐT) — cấu hình qua Profile Generator, không cần sửa
tay JSON.

## 1.6 — 2026-08-17

Thêm cột hóa đơn đặc thù (HDDThu, TCHDon, TTHHDTrung) và cột định danh người mua trong mẫu GTGT
(tùy chọn theo profile); kiểm tra chặt hơn dữ liệu cột số; sửa lỗi mất cấu hình cột mở rộng khi
lưu Cài đặt kết nối; chỉnh giao diện.

## 1.5 — 2026-08-17

(Không có ghi chú trong `update.json` — commit gần nhất lúc bump: "reposition connection settings
dialog buttons".)

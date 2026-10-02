# Changelog

## [2.5] - 2026-09-30

### Security
- Mã hóa file cấu hình kết nối (DPAPI) thay vì lưu chữ thường
- Tự nâng cấp file cấu hình cũ, không cần nhập lại tài khoản

## [2.4] - 2026-09-25

### Fixed
- CusAddress (GTGT) chỉ bắt buộc khi có TenDonVi + MaSoThue
- `publish.ps1` dùng đường dẫn tương đối, không phụ thuộc tên thư mục checkout

## [2.3] - 2026-09-04

### Added
- Đầy đủ mã lỗi VNPT trả về, thông báo chi tiết hơn
- GTGT (tt78) hỗ trợ Extra1-11 và suất 8%

## [2.2] - 2026-08-22

### Changed
- Hóa đơn GTGT chuyển sang chuẩn XML tt78

### Added
- Đọc số tiền ngoại tệ có phần lẻ (cents)

### Fixed
- Lỗi cài đặt khi cùng phiên bản (ClickOnce)

## [2.1] - 2026-08-22

### Added
- Thứ tự cột tùy chỉnh khi Tạo mẫu

### Changed
- Nút Mẫu đổi thành dropdown chọn thẳng GTGT/PXK/CTT
- Bỏ ép Kiểm tra dữ liệu trước khi Tạo nháp/Tạo & phát hành

### Fixed
- Lỗi kết nối khi Domain nhập kèm `http(s)://`

## [2.0] - 2026-08-18

### Added
- Cảnh báo license sắp hết hạn (dưới 30 ngày) trên ribbon

### Changed
- Thông báo kích hoạt license

## [1.9] - 2026-08-18

### Fixed
- Excel thỉnh thoảng không nạp được add-in sau khi mở lại

## [1.8] - 2026-08-18

### Changed
- Gọn lại hộp thoại Đăng ký sử dụng

### Fixed
- Nút "Tạo & phát hành" mất dấu `&`
- Icon add-in hiện đúng trong Add/Remove Programs
- Bộ cài không còn cõng theo các bản cũ

## [1.7] - 2026-08-17

### Added
- Hóa đơn cho thuê tài chính
- Hóa đơn chiết khấu thương mại (SBKe/NBKe)
- Hàng hóa đặc trưng (xe ô tô/xe máy, vận chuyển, TMĐT)
- Cấu hình qua Profile Generator, không cần sửa tay JSON

## [1.6] - 2026-08-17

### Added
- Cột hóa đơn đặc thù (HDDThu, TCHDon, TTHHDTrung)
- Cột định danh người mua trong mẫu GTGT (tùy chọn theo profile)

### Changed
- Kiểm tra chặt hơn dữ liệu cột số
- Chỉnh giao diện

### Fixed
- Mất cấu hình cột mở rộng khi lưu Cài đặt kết nối

## [1.5] - 2026-08-17

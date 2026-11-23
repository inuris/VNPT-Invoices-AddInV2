# Changelog

## [Unreleased]

## [2.13] - 2026-11-19

### Changed
- Bỏ hỗ trợ import file cấu hình kết nối định dạng cũ
- Tối ưu cấu trúc mã nguồn

### Security
- Nhúng file cấu hình vào add-in

### Fixed
- Lỗi gọi sai tên loại chứng từ trong thông báo sau khi gửi

## [2.12] - 2026-11-19

### Changed
- Cài đặt nâng cao: hiển thị dạng tab theo loại chứng từ
- Kiểm tra phiên bản mới qua GitHub Release (cần cho phép `github.com`, `release-assets.githubusercontent.com`)

## [2.11] - 2026-11-18

### Added
- Bổ sung Cài đặt nâng cao cho từng kết nối

### Changed
- Tạo mẫu theo cột đã map
- Cập nhật cấu trúc profile

## [2.10] - 2026-11-18

### Changed
- Hiện "Đang gửi..." khi thao tác Tạo/Phát hành
- Kiểm tra dữ liệu trước khi Tạo/Phát hành
- Xác nhận khi gửi chứng từ/hóa đơn đã có mã tra cứu
- CTT: Email, MaKhachHang, DDanh, QTich bỏ bắt buộc
- Tối ưu chuyển sheet

### Fixed
- Lỗi ghi lệch dòng cột `KetQua`
- Lỗi sai số dòng trong thông báo lỗi
- Lỗi vị trí chú thích và cột `KetQua` trên sheet mẫu
- Lỗi mất cấu hình kết nối khi file hỏng
- Lỗi import file cấu hình sai vẫn báo thành công
- Giới hạn dung lượng file log
- Lỗi hiển thị số dài dạng `1.23E+15`

## [2.9] - 2026-11-17

### Added
- PXK: hỗ trợ ngoại tệ (`LoaiTienTe`, `TyGia`, `HinhThucThanhToan`)
- GTGT/PXK: hỗ trợ cột `Fkey`
- Công thức `TEXT` hỗ trợ ô ngày
- Tùy chọn dấu thập phân cho file ERP

### Fixed
- Chặn gửi khi file ERP có lỗi công thức hoặc map sai
- PXK: lỗi 1503 khi thiếu tỷ giá

## [2.8] - 2026-11-16

### Added
- Hỗ trợ cột công thức trong profile

## [2.7] - 2026-11-16

### Added
- GTGT: bổ sung cột `Extra`, ngân hàng và số tài khoản người mua
- Hỗ trợ file Excel xuất từ ERP (map cột)
- Hỗ trợ bảng mã VNI

### Fixed
- Lỗi mất thứ tự cột khi lưu cấu hình kết nối
- Lỗi Kiểm tra dữ liệu không nhận cột mở rộng

## [2.6] - 2026-10-12

### Added
- Bỏ qua dòng đang Ẩn (Hide) trong Excel khi Tạo nháp/Tạo & phát hành/Kiểm tra dữ liệu (CTT/GTGT/PXK)

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

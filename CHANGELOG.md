# Changelog

## [Unreleased]

## [2.9] - 2026-11-17

### Added
- PXK: cột tùy chọn `LoaiTienTe`, `TyGia`, `HinhThucThanhToan` (phiếu xuất kho bằng ngoại tệ); không có cột thì VND như cũ
- GTGT/PXK: cột tùy chọn `Fkey` làm khóa chứng từ (`<key>`), máy chủ chặn gửi trùng; trống thì tự sinh như cũ
- Công thức `TEXT(ô, "dd/mm/yyyy")` hiểu ô ngày (định dạng ngày kiểu Excel); ô chữ giữ nguyên
- Hồ sơ `columnMapping`: số lưu dạng chữ ở cột số mặc định hiểu `"."` là dấu thập phân (khai `decimalSeparator: ","` nếu file khác) — trước đây máy vùng miền Việt Nam đọc `"1.15"` thành 115

### Fixed
- File ERP (`columnMapping`): lỗi công thức (`compose.<Cột>.formula` sai cú pháp, thiếu cột, chữ trong phép tính) giờ chặn Tạo nháp/Tạo & phát hành/Xem XML và hiện danh sách lỗi; trước đây chuỗi `#LỖI công thức: …` có thể đi vào hóa đơn hoặc cột số bị coi là trống
- File ERP: `map` khai cột nguồn → `STT` mà sheet không có cột đó (gõ sai tên, nhầm file) thì báo lỗi, không gộp cả sheet thành 1 hóa đơn. Không map cột nào sang `STT` vẫn tự thêm `STT = 1` như cũ, Kiểm tra dữ liệu ghi chú rõ
- File ERP: không áp dụng được `columnMapping`/`textEncoding` thì dừng và báo lỗi thay vì đọc tiếp dữ liệu gốc
- Hồ sơ `columnMapping` không khai `type` khi đọc CTT không còn bị thêm cột `STT`
- PXK: luôn gửi thẻ `<TGia>` (cột TyGia trống ⇒ mặc định 1); trước đây thiếu thẻ thì máy chủ báo lỗi 1503

### Changed
- Kiểm tra dữ liệu: ghi chú các cột khai trong `map` nhưng không có trên sheet

## [2.8] - 2026-11-16

### Added
- Hồ sơ `columnMapping`: cột tính bằng công thức kiểu Excel (`compose.<Cột>.formula`): `+ - * /`, `&`, `TEXT(giá trị, "định dạng")`; ghi đè cột đích, lỗi ghi `#LỖI công thức: …`. Dạng cũ `date` vẫn đọc được

## [2.7] - 2026-11-16

### Added
- GTGT: cột `Extra` (không số) → TTChung/TTKhac (tt78 `<Extra>`), giống Extra1/Extra2
- GTGT: cột `NganHangNguoiMua` → NMua/TNHang (tt78 `CusBankName`), `SoTaiKhoanNguoiMua` → NMua/STKNHang (tt78 `CusBankNo`)
- Đọc file Excel xuất từ ERP khác: hồ sơ khai `columnMapping` (đổi tên cột, dòng tiêu đề, giá trị mặc định, ghép ngày từ 3 cột; không có cột STT thì cả file là 1 hóa đơn) — chuẩn hóa trong bộ nhớ, không sửa file
- `textEncoding` trong hồ sơ: chuyển chữ VNI-Windows → Unicode (`"vni"`; bỏ trống = Unicode, không đổi); Kiểm tra dữ liệu cảnh báo khi thấy chữ VNI mà hồ sơ để Unicode

### Fixed
- Lưu cấu hình kết nối không còn làm mất thứ tự cột (`columnOrder`)
- Kiểm tra dữ liệu GTGT/PXK nhận cột mở rộng của hồ sơ giống lúc Tạo nháp

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

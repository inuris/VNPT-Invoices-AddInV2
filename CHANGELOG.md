# Changelog

## [Unreleased]

## [2.11] - 2026-11-18

### Added
- Cài đặt kết nối: nút bánh răng cạnh nút xóa trên mỗi kết nối mở Cài đặt nâng cao của kết nối đó — đổi mã hóa chữ (Unicode/VNI), dòng tiêu đề và dấu thập phân cho từng loại (hóa đơn, phiếu xuất kho, chứng từ) mà không cần import lại file JSON

### Changed
- Tạo mẫu: kết nối có map cột (file ERP) thì sheet mẫu ra đúng dạng file ERP của khách: tên cột gốc, các cột dùng trong công thức (vd năm/tháng/ngày), tiêu đề ở đúng dòng khai trong hồ sơ. Trước đây luôn ra mẫu chuẩn, không đọc được bằng hồ sơ đó
- Hồ sơ kết nối: bỏ thuộc tính `inputSource` (không còn tác dụng; file cũ có thuộc tính này vẫn import được)

## [2.10] - 2026-11-18

### Changed
- Tạo nháp / Tạo & phát hành: trong lúc chờ máy chủ VNPT trả lời hiện cửa sổ "Đang gửi…", Excel không còn đứng hình (trước đây treo tới 60 giây khi mạng chậm, dễ tưởng lỗi rồi bấm gửi lại)
- Tạo nháp / Tạo & phát hành / Xem XML chặn cùng các lỗi như Kiểm tra dữ liệu: thiếu cột bắt buộc, ô ở cột số là chữ (GTGT/PXK), dòng CTT thiếu dữ liệu bắt buộc — báo danh sách dòng lỗi, không gửi chứng từ nào. Trước đây dòng CTT lỗi bị bỏ qua im lặng (chỉ gửi các dòng còn lại, báo thành công) và ô số là chữ bị coi như trống
- Tạo nháp / Tạo & phát hành: sheet có chứng từ đã có Fkey ở cột `KetQua` (đã gửi trước đó) thì hỏi trước khi gửi: chỉ gửi chứng từ chưa có Fkey, gửi lại tất cả, hoặc hủy. Trước đây bấm lại là gửi trùng toàn bộ mà không hỏi
- CTT: `Email`, `MaKhachHang`, `DDanh`, `QTich` không còn bắt buộc (khớp cấu hình). Dòng để trống các ô này, hoặc sheet không có các cột này, vẫn gửi được
- Chuyển sheet và Kiểm tra dữ liệu nhẹ hơn: không đọc và giải mã lại file cấu hình kết nối khi file chưa đổi, trạng thái bản quyền chỉ tính 1 lần mỗi lần chuyển sheet
- Cột `KetQua` chỉ ghi lại các dòng của chứng từ vừa gửi; Fkey của chứng từ không gửi lần này được giữ nguyên (trước đây cả cột bị xóa mỗi lần gửi)

### Fixed
- Cột `KetQua`: bảng dữ liệu không bắt đầu từ dòng 1 (phía trên có dòng trống) thì Fkey/lỗi vẫn ghi đúng dòng của hóa đơn; trước đây bị lệch lên trên đúng bằng số dòng trống
- Cột `KetQua` với file ERP có `headerRow` > 1: tiêu đề `KetQua` đặt ở đúng dòng tiêu đề (trước đây nằm ở dòng 1 nên lần sau không tìm lại được cột)
- Hồ sơ `columnMapping`: `headerRow` là số dòng trên sheet như đang thấy trong Excel; trước đây nếu dòng đầu sheet trống thì add-in đếm lệch và lấy nhầm dòng tiêu đề
- Thông báo lỗi theo dòng (công thức, cột số, dòng CTT) ghi đúng số dòng trên sheet khi phía trên bảng có dòng trống
- Sheet mẫu: chú thích "cột chữ ĐỎ = bắt buộc" chuyển vào ghi chú của ô tiêu đề đầu tiên; trước đây nằm ở một ô trên dòng tiêu đề nên cột `KetQua` bị đẩy ra xa. Sheet mẫu tạo từ bản cũ: cột `KetQua` được đặt ngay sau cột tiêu đề cuối
- File cấu hình kết nối (`vnpt-profiles.json`) không đọc được (đổi máy/đổi tài khoản Windows, file hỏng): mở Cài đặt kết nối sẽ báo rõ, và khi lưu kết nối mới thì file cũ được sao lưu thành `vnpt-profiles.json.hong-<ngày giờ>` thay vì bị ghi đè mất
- File cấu hình kết nối ghi qua file tạm rồi mới thay file chính, bản ngay trước đó giữ ở `vnpt-profiles.json.bak` (Excel tắt giữa chừng không làm hỏng file)
- Import cấu hình: file sai định dạng hoặc không có kết nối nào thì báo lỗi, không còn báo "Đã tải cấu hình"
- File log `addin.log` không còn to mãi: quá 1 MB thì chuyển thành `addin.log.1` và ghi file mới
- Cài đặt kết nối: kéo đổi kích thước cửa sổ không còn đọc lại file cấu hình kết nối liên tục
- Ô kiểu số ở cột chữ (mã số thuế, số điện thoại, số tài khoản, cột mở rộng…) gửi đi với dấu chấm thập phân, không phụ thuộc vùng miền máy, và không còn ra dạng `1.23E+15` với số dài
- Nút báo có bản mới trên ribbon chỉ cập nhật trên luồng giao diện (tránh lỗi hiếm khi Excel vừa mở)

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

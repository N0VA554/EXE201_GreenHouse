# Minigame Phân Loại Rác

## Mô tả
Minigame kéo thả rác vào thùng rác tương ứng để học cách phân loại rác thải một cách vui nhộn và tương tác.

## Tính năng

### 🎮 Gameplay
- **Kéo thả**: Kéo các loại rác và thả vào thùng rác tương ứng
- **4 loại rác**: Rác vô cơ, rác hữu cơ, rác nguy hại, rác tái chế
- **Random items**: Mỗi lần chơi sẽ có các loại rác khác nhau
- **Thời gian**: 60 giây để hoàn thành game
- **Điểm số**: +10 điểm cho mỗi lần phân loại đúng

### 🎯 Levels
- **Level 1-5**: Tăng dần số lượng rác cần phân loại
- **Level 1**: 7 rác
- **Level 2**: 9 rác  
- **Level 3**: 11 rác
- **Level 4**: 13 rác
- **Level 5**: 15 rác

### 📊 Thống kê
- Điểm số tổng cộng
- Độ chính xác (%)
- Thời gian còn lại
- Tiến độ hoàn thành

### 🎨 Giao diện
- **Responsive**: Hoạt động tốt trên desktop và mobile
- **Animations**: Hiệu ứng kéo thả mượt mà
- **Visual feedback**: Thông báo đúng/sai rõ ràng
- **Modern UI**: Thiết kế đẹp mắt với gradient và shadow

## Cách chơi

1. **Bắt đầu**: Chọn level và nhấn "Bắt đầu chơi"
2. **Phân loại**: Kéo rác từ khu vực bên dưới và thả vào thùng rác tương ứng
3. **Điểm số**: Mỗi lần đúng được +10 điểm
4. **Thời gian**: Hoàn thành trước khi hết thời gian
5. **Kết thúc**: Xem thống kê và chơi lại hoặc level tiếp theo

## Cấu trúc code

```
src/pages/RecyclingGame/
├── index.tsx              # Component chính
├── RecyclingGame.module.css # Styles
└── README.md              # Hướng dẫn này
```

## Assets sử dụng

### Thùng rác
- `rac_vo_co.png` - Thùng rác vô cơ
- `rac_huu_co.png` - Thùng rác hữu cơ  
- `rac_nguy_hiem.png` - Thùng rác nguy hại
- `rac_tai_che.png` - Thùng rác tái chế

### Rác vô cơ (19 items)
- Mảnh gương vỡ, gốm vỡ, vữa xây dựng, khẩu trang y tế, đĩa CD/DVD, bóng đèn, ống hút nhựa, dây thun, vỏ mì, nilon, vỏ kẹo, bánh răng, cao su, mút xốp, mảnh nhựa tổng hợp, mảnh gốm, gương vỡ

### Rác hữu cơ (19 items)  
- Vỏ trứng đã đập, bánh hỏng, gạo mốc, hoa khô/héo, cam hỏng, trái cây hỏng, bánh mì hỏng, lá cây khô, xác trà tươi, mụn cua, rau thừa, vỏ dưa hấu, đồ ăn thừa, vỏ tỏi/hành, cỏ cắt, bã cà phê, vỏ trái cây

### Rác nguy hại (1 item)
- Pin

### Rác tái chế (20 items)
- Tạp chí, giấy gói quà, khay đựng trứng, nhựa PVC, nắp nhôm/kim loại/nhựa, vỏ bia/sữa, vỏ đựng trái cây, vỏ chai nước rửa chén, vỏ chai nhựa PET, hộp bánh bằng thiếc, lõi giấy vệ sinh, vỏ hộp thuốc, vỏ chai nhựa, vỏ hộp sữa, giấy báo, chai thủy tinh, thùng carton

## Công nghệ sử dụng

- **React 18** với TypeScript
- **CSS Modules** cho styling
- **HTML5 Drag & Drop API** cho kéo thả
- **React Hooks** (useState, useEffect, useRef)
- **Responsive Design** với CSS Grid và Flexbox

## Tương lai

- [ ] Thêm âm thanh
- [ ] Thêm leaderboard
- [ ] Thêm achievements
- [ ] Thêm tutorial
- [ ] Thêm multiplayer mode
- [ ] Thêm dark mode 
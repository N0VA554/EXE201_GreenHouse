import React, { useState, useEffect, useRef } from 'react';
import styles from './RecyclingGame.module.css';

// Import các hình ảnh thùng rác
import binVoCo from '../../assets/thung_rac/rac_vo_co.png';
import binHuuCo from '../../assets/thung_rac/rac_huu_co.png';
import binNguyHiem from '../../assets/thung_rac/rac_nguy_hiem.png';
import binTaiChe from '../../assets/thung_rac/rac_tai_che.png';

// Import các hình ảnh rác vô cơ
import manhGuongVo from '../../assets/rac_vo_co/manh_guong_vo.png';
import gomVo from '../../assets/rac_vo_co/gom_vo.png';
import vuaXayDung from '../../assets/rac_vo_co/vua_xay_dung.png';
import khauTrangYTe from '../../assets/rac_vo_co/khau_trang_y_te.png';
import diaCd from '../../assets/rac_vo_co/dia_cd.png';
import diaDvd from '../../assets/rac_vo_co/dia_dvd.png';
import bongDenDai from '../../assets/rac_vo_co/bong_den_dai.png';
import bongDenTron from '../../assets/rac_vo_co/bong_den_tron.png';
import ongHutNhua from '../../assets/rac_vo_co/ong_hut_nhua.png';
import dayThun from '../../assets/rac_vo_co/day_thun.png';
import voMi from '../../assets/rac_vo_co/vo_mi.png';
import nilon from '../../assets/rac_vo_co/nilon.png';
import voKeo from '../../assets/rac_vo_co/vo_keo.png';
import banhRang from '../../assets/rac_vo_co/banh_rang.png';
import caoSu from '../../assets/rac_vo_co/cao_su.png';
import mutXop from '../../assets/rac_vo_co/mut_xop.png';
import manhNhuaTongHop from '../../assets/rac_vo_co/manh_nhua_tong_hop.png';
import manhGom from '../../assets/rac_vo_co/manh_gom.png';
import guongVo from '../../assets/rac_vo_co/guong_vo.png';

// Import các hình ảnh rác hữu cơ
import voTrungDaDap from '../../assets/rac_huu_co/vo_trung_da_dap.png';
import banhHu from '../../assets/rac_huu_co/banh_hu.png';
import gaoMoc from '../../assets/rac_huu_co/gao_moc.png';
import hoaKho from '../../assets/rac_huu_co/hoa_kho.png';
import hoaHeo from '../../assets/rac_huu_co/hoa_heo.png';
import camHu from '../../assets/rac_huu_co/cam_hu.png';
import traiCayHu from '../../assets/rac_huu_co/trai_cay_hu.png';
import banhMiHu from '../../assets/rac_huu_co/banh_mi_hu.png';
import laCayKho from '../../assets/rac_huu_co/la_cay_kho_2.png';
import xacTraTuoi from '../../assets/rac_huu_co/xac_tra_tuoi.png';
import munCua from '../../assets/rac_huu_co/mun_cua.png';
import rauThua from '../../assets/rac_huu_co/rau_thua.png';
import voDuaHau from '../../assets/rac_huu_co/vo_dua_hau.png';
import doAnThua from '../../assets/rac_huu_co/do_an_thua.png';
import voToi from '../../assets/rac_huu_co/vo_toi.png';
import voHanh from '../../assets/rac_huu_co/vo_hanh.png';
import coCat from '../../assets/rac_huu_co/co_cat.png';
import baCaPhe from '../../assets/rac_huu_co/ba_ca_phe.png';
import voTraiCay from '../../assets/rac_huu_co/vo_trai_cay.png';

// Import các hình ảnh rác nguy hại mới
import racThaiDienTu from '../../assets/rac_nguy_hiem/rac_thai_dien_tu.jpg';
import kimLoaiNangLinhKien from '../../assets/rac_nguy_hiem/kimm_loai_nang_linh_kien_may_moc.png';
import kimTiem from '../../assets/rac_nguy_hiem/kim_tiem.png';
import chatThaiRanYTe from '../../assets/rac_nguy_hiem/chat-thai-ran-y-te.jpg';
import baoBiHoaChat from '../../assets/rac_nguy_hiem/bao_bi_hoa_chat.png';
import thuocHetHan from '../../assets/rac_nguy_hiem/thuoc_het_han.png';
import dungMoiCongNghiep from '../../assets/rac_nguy_hiem/dung_moi_cong_nghiep.png';
import nhietKeThuyNgan from '../../assets/rac_nguy_hiem/nhiet_ke_thuy_ngan.png';
import bongDenHuynhQuangTron from '../../assets/rac_nguy_hiem/bong_den_huynh_quang_loai_tron.png';
import bongDenHuynhQuangDai from '../../assets/rac_nguy_hiem/bong_den_huynh_quang_loai_dai.png';
import chatTayRua from '../../assets/rac_nguy_hiem/chat_tay_rua.png';
import dauMay from '../../assets/rac_nguy_hiem/dau_may.png';
import dauNhotThua from '../../assets/rac_nguy_hiem/dau_nhot_thua.png';
import sonGocDau from '../../assets/rac_nguy_hiem/son_goc_dau.png';
import acQuy from '../../assets/rac_nguy_hiem/ac_quy.jpg';
import pinNguyHiem from '../../assets/rac_nguy_hiem/pin.png';

// Import các hình ảnh rác tái chế
import tapChi from '../../assets/rac_tai_che/tap_chi.png';
import giayGoiQua from '../../assets/rac_tai_che/giay_goi_qua.png';
import khayDungTrung from '../../assets/rac_tai_che/khay_dung_trung.png';
import nhuaPvc from '../../assets/rac_tai_che/nhua_pvc.png';
import napNhom from '../../assets/rac_tai_che/nap_nhom.png';
import napKimLoai from '../../assets/rac_tai_che/nap_kim_loai.png';
import napNhua from '../../assets/rac_tai_che/nap_nhua.png';
import voBia from '../../assets/rac_tai_che/vo_bia.png';
import voSuaDac from '../../assets/rac_tai_che/vo_sua_dac.png';
import voDungTraiCay from '../../assets/rac_tai_che/vo_dung_trai_cay.png';
import voChaiNuocRuaChen from '../../assets/rac_tai_che/Vo_chai_nuoc_rua_chen.png';
import voChaiNhuaPet from '../../assets/rac_tai_che/vo-chai_nhua_PET.png';
import hopBanhBangThiec from '../../assets/rac_tai_che/hop_banh_bang_thiec.png';
import loiGiayVeSinh from '../../assets/rac_tai_che/loi_giay_ve_sinh.png';
import voHopThuoc from '../../assets/rac_tai_che/Vo_hop_thuoc.png';
import voChaiNhua from '../../assets/rac_tai_che/vo_chai_nhua.png';
import voHopSua from '../../assets/rac_tai_che/vo_hop_sua.png';
import giayBao from '../../assets/rac_tai_che/giay_bao.png';
import chaiThuyTinh from '../../assets/rac_tai_che/chai_thuy_tinh.png';
import thungCarton from '../../assets/rac_tai_che/thung-carton.jpg';

interface TrashItem {
  id: string;
  name: string;
  image: string;
  category: 'rac_vo_co' | 'rac_huu_co' | 'rac_nguy_hiem' | 'rac_tai_che';
}

interface TrashBin {
  id: string;
  name: string;
  category: 'rac_vo_co' | 'rac_huu_co' | 'rac_nguy_hiem' | 'rac_tai_che';
  image: string;
}

const RecyclingGame: React.FC = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90); // Tăng thời gian lên 90 giây
  const [currentItems, setCurrentItems] = useState<TrashItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<TrashItem | null>(null);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [correctItems, setCorrectItems] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isDragging, setIsDragging] = useState(false);
  const [nextItemIndex, setNextItemIndex] = useState(0);
  const [availableTrash, setAvailableTrash] = useState<TrashItem[]>([]);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const addItemRef = useRef<NodeJS.Timeout | null>(null);

  // Định nghĩa các loại thùng rác
  const trashBins: TrashBin[] = [
    {
      id: 'bin_vo_co',
      name: 'Rác vô cơ',
      category: 'rac_vo_co',
      image: binVoCo
    },
    {
      id: 'bin_huu_co',
      name: 'Rác hữu cơ',
      category: 'rac_huu_co',
      image: binHuuCo
    },
    {
      id: 'bin_nguy_hiem',
      name: 'Rác nguy hại',
      category: 'rac_nguy_hiem',
      image: binNguyHiem
    },
    {
      id: 'bin_tai_che',
      name: 'Rác tái chế',
      category: 'rac_tai_che',
      image: binTaiChe
    }
  ];

  // Định nghĩa các loại rác với import đúng
  const allTrashItems: TrashItem[] = React.useMemo(() => [
    // Rác vô cơ
    { id: '1', name: 'Mảnh gương vỡ', image: manhGuongVo, category: 'rac_vo_co' },
    { id: '2', name: 'Gốm vỡ', image: gomVo, category: 'rac_vo_co' },
    { id: '3', name: 'Vữa xây dựng', image: vuaXayDung, category: 'rac_vo_co' },
    { id: '4', name: 'Khẩu trang y tế', image: khauTrangYTe, category: 'rac_vo_co' },
    { id: '5', name: 'Đĩa CD', image: diaCd, category: 'rac_vo_co' },
    { id: '6', name: 'Đĩa DVD', image: diaDvd, category: 'rac_vo_co' },
    
    { id: '9', name: 'Ống hút nhựa', image: ongHutNhua, category: 'rac_vo_co' },
    { id: '10', name: 'Dây thun', image: dayThun, category: 'rac_vo_co' },
    { id: '11', name: 'Vỏ mì', image: voMi, category: 'rac_vo_co' },
    { id: '12', name: 'Nilon', image: nilon, category: 'rac_vo_co' },
    { id: '13', name: 'Vỏ kẹo', image: voKeo, category: 'rac_vo_co' },
    { id: '14', name: 'Bánh răng', image: banhRang, category: 'rac_vo_co' },
    { id: '15', name: 'Cao su', image: caoSu, category: 'rac_vo_co' },
    { id: '16', name: 'Mút xốp', image: mutXop, category: 'rac_vo_co' },
    { id: '17', name: 'Mảnh nhựa tổng hợp', image: manhNhuaTongHop, category: 'rac_vo_co' },
    { id: '18', name: 'Mảnh gốm', image: manhGom, category: 'rac_vo_co' },
    { id: '19', name: 'Gương vỡ', image: guongVo, category: 'rac_vo_co' },

    // Rác hữu cơ
    { id: '20', name: 'Vỏ trứng đã đập', image: voTrungDaDap, category: 'rac_huu_co' },
    { id: '21', name: 'Bánh hỏng', image: banhHu, category: 'rac_huu_co' },
    { id: '22', name: 'Gạo mốc', image: gaoMoc, category: 'rac_huu_co' },
    { id: '23', name: 'Hoa khô', image: hoaKho, category: 'rac_huu_co' },
    { id: '24', name: 'Hoa héo', image: hoaHeo, category: 'rac_huu_co' },
    { id: '25', name: 'Cam hỏng', image: camHu, category: 'rac_huu_co' },
    { id: '26', name: 'Trái cây hỏng', image: traiCayHu, category: 'rac_huu_co' },
    { id: '27', name: 'Bánh mì hỏng', image: banhMiHu, category: 'rac_huu_co' },
    { id: '28', name: 'Lá cây khô', image: laCayKho, category: 'rac_huu_co' },
    { id: '29', name: 'Xác trà tươi', image: xacTraTuoi, category: 'rac_huu_co' },
    { id: '30', name: 'Mụn cua', image: munCua, category: 'rac_huu_co' },
    { id: '31', name: 'Rau thừa', image: rauThua, category: 'rac_huu_co' },
    { id: '32', name: 'Vỏ dưa hấu', image: voDuaHau, category: 'rac_huu_co' },
    { id: '33', name: 'Đồ ăn thừa', image: doAnThua, category: 'rac_huu_co' },
    { id: '34', name: 'Vỏ tỏi', image: voToi, category: 'rac_huu_co' },
    { id: '35', name: 'Vỏ hành', image: voHanh, category: 'rac_huu_co' },
    { id: '36', name: 'Cỏ cắt', image: coCat, category: 'rac_huu_co' },
    { id: '37', name: 'Bã cà phê', image: baCaPhe, category: 'rac_huu_co' },
    { id: '38', name: 'Vỏ trái cây', image: voTraiCay, category: 'rac_huu_co' },

    // Rác nguy hại (cập nhật mới)
    { id: 'nguy1', name: 'Rác thải điện tử', image: racThaiDienTu, category: 'rac_nguy_hiem' },
    { id: 'nguy2', name: 'Kim loại nặng, linh kiện máy móc', image: kimLoaiNangLinhKien, category: 'rac_nguy_hiem' },
    { id: 'nguy3', name: 'Kim tiêm', image: kimTiem, category: 'rac_nguy_hiem' },
    { id: 'nguy4', name: 'Chất thải rắn y tế', image: chatThaiRanYTe, category: 'rac_nguy_hiem' },
    { id: 'nguy5', name: 'Bao bì hóa chất', image: baoBiHoaChat, category: 'rac_nguy_hiem' },
    { id: 'nguy6', name: 'Thuốc hết hạn', image: thuocHetHan, category: 'rac_nguy_hiem' },
    { id: 'nguy7', name: 'Dung môi công nghiệp', image: dungMoiCongNghiep, category: 'rac_nguy_hiem' },
    { id: 'nguy8', name: 'Nhiệt kế thủy ngân', image: nhietKeThuyNgan, category: 'rac_nguy_hiem' },
    { id: 'nguy9', name: 'Bóng đèn huỳnh quang tròn', image: bongDenHuynhQuangTron, category: 'rac_nguy_hiem' },
    { id: 'nguy10', name: 'Bóng đèn huỳnh quang dài', image: bongDenHuynhQuangDai, category: 'rac_nguy_hiem' },
    { id: 'nguy11', name: 'Chất tẩy rửa', image: chatTayRua, category: 'rac_nguy_hiem' },
    { id: 'nguy12', name: 'Dầu máy', image: dauMay, category: 'rac_nguy_hiem' },
    { id: 'nguy13', name: 'Dầu nhớt thừa', image: dauNhotThua, category: 'rac_nguy_hiem' },
    { id: 'nguy14', name: 'Sơn gốc dầu', image: sonGocDau, category: 'rac_nguy_hiem' },
    { id: 'nguy15', name: 'Ắc quy', image: acQuy, category: 'rac_nguy_hiem' },
    { id: 'nguy16', name: 'Pin', image: pinNguyHiem, category: 'rac_nguy_hiem' },

    // Rác tái chế
    { id: '40', name: 'Tạp chí', image: tapChi, category: 'rac_tai_che' },
    { id: '41', name: 'Giấy gói quà', image: giayGoiQua, category: 'rac_tai_che' },
    { id: '42', name: 'Khay đựng trứng', image: khayDungTrung, category: 'rac_tai_che' },
    { id: '43', name: 'Nhựa PVC', image: nhuaPvc, category: 'rac_tai_che' },
    { id: '44', name: 'Nắp nhôm', image: napNhom, category: 'rac_tai_che' },
    { id: '45', name: 'Nắp kim loại', image: napKimLoai, category: 'rac_tai_che' },
    { id: '46', name: 'Nắp nhựa', image: napNhua, category: 'rac_tai_che' },
    { id: '47', name: 'Vỏ bia', image: voBia, category: 'rac_tai_che' },
    { id: '48', name: 'Vỏ sữa đặc', image: voSuaDac, category: 'rac_tai_che' },
    { id: '49', name: 'Vỏ đựng trái cây', image: voDungTraiCay, category: 'rac_tai_che' },
    { id: '50', name: 'Vỏ chai nước rửa chén', image: voChaiNuocRuaChen, category: 'rac_tai_che' },
    { id: '51', name: 'Vỏ chai nhựa PET', image: voChaiNhuaPet, category: 'rac_tai_che' },
    { id: '52', name: 'Hộp bánh bằng thiếc', image: hopBanhBangThiec, category: 'rac_tai_che' },
    { id: '53', name: 'Lõi giấy vệ sinh', image: loiGiayVeSinh, category: 'rac_tai_che' },
    { id: '54', name: 'Vỏ hộp thuốc', image: voHopThuoc, category: 'rac_tai_che' },
    { id: '55', name: 'Vỏ chai nhựa', image: voChaiNhua, category: 'rac_tai_che' },
    { id: '56', name: 'Vỏ hộp sữa', image: voHopSua, category: 'rac_tai_che' },
    { id: '57', name: 'Giấy báo', image: giayBao, category: 'rac_tai_che' },
    { id: '58', name: 'Chai thủy tinh', image: chaiThuyTinh, category: 'rac_tai_che' },
    { id: '59', name: 'Thùng carton', image: thungCarton, category: 'rac_tai_che' }
  ], []);

  // Thêm rác mới liên tục (chỉ khi số lượng rác trên hàng < 6)
  const addNewTrashItem = React.useCallback(() => {
    if (gameState !== 'playing') return;
  
    setCurrentItems(prevItems => {
      if (prevItems.length >= 6 || availableTrash.length === 0) return prevItems;
  
      const [newItem, ...restQueue] = availableTrash;
  
      // Cập nhật hàng chờ còn lại
      setAvailableTrash(restQueue);
  
      // Trả về mảng mới với item mới
      return [
        ...prevItems,
        { ...newItem, id: `${newItem.id}_${Date.now()}_${Math.random()}` }
      ];
    });
  }, [gameState, availableTrash]);
  

  // Bắt đầu game
  const startGame = () => {
    // Bắt đầu với 10 rác random
    const shuffled = [...allTrashItems].sort(() => Math.random() - 0.5);
    const initialItems = shuffled.slice(0, 6).map((item, index) => ({
      ...item,
      id: `${item.id}_${Date.now()}_${index}`
    }));

    setAvailableTrash(shuffled.slice(6)); // phần còn lại là hàng chờ
    setCurrentItems(initialItems);

    setTotalProcessed(0);
    setCorrectItems(0);
    setScore(0);
    setTimeLeft(90);
    setGameState('playing');
    setShowMessage(false);
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState('gameOver');
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameState, timeLeft]);

  // Thêm rác mới liên tục khi game đang chơi
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      addItemRef.current = setInterval(addNewTrashItem, 4000); // Thêm mỗi 4 giây
    } else if (gameState !== 'playing') {
      if (addItemRef.current) {
        clearInterval(addItemRef.current);
      }
    }

    return () => {
      if (addItemRef.current) {
        clearInterval(addItemRef.current);
      }
    };
  }, [gameState, timeLeft, addNewTrashItem]);

  // Xử lý kéo thả
  const handleDragStart = (e: React.DragEvent, item: TrashItem) => {
    setDraggedItem(item);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetBin: TrashBin) => {
    e.preventDefault();

    if (!draggedItem) return;

    setTotalProcessed(prev => prev + 1);

    if (draggedItem.category === targetBin.category) {
      // Đúng thùng rác
      setScore(prev => prev + 10);
      setCorrectItems(prev => prev + 1);
      setCurrentItems(prev => prev.filter(item => item.id !== draggedItem.id));
      setMessage('Chính xác! +10 điểm');
      setMessageType('success');

      // Thêm rác mới ngay lập tức khi phân loại đúng
      setTimeout(() => {
        addNewTrashItem();
      }, 500);
    } else {
      // Sai thùng rác - rác sẽ quay về vị trí cũ
      setMessage('Sai rồi! Hãy thử lại');
      setMessageType('error');
    }

    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
    setDraggedItem(null);
    setIsDragging(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAccuracy = () => {
    if (totalProcessed === 0) return 0;
    return Math.round((correctItems / totalProcessed) * 100);
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setTimeLeft(90);
    setCurrentItems([]);
    setCorrectItems(0);
    setTotalProcessed(0);
    setShowMessage(false);
    setNextItemIndex(0);
    if (addItemRef.current) {
      clearInterval(addItemRef.current);
    }
  };

  return (
    <div className={styles.container}>
      {gameState === 'menu' && (
        <div className={styles.menu}>
          <h1 className={styles.title}>🎮 Minigame Phân Loại Rác</h1>
          <p className={styles.description}>
            Kéo thả rác vào đúng thùng rác tương ứng để ghi điểm!<br />
            Rác sẽ xuất hiện liên tục, hãy phân loại nhanh chóng!
          </p>
          <button className={styles.startButton} onClick={startGame}>
            🚀 Bắt đầu chơi
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className={styles.gameContainer} ref={gameContainerRef}>
          {/* Header */}
          <div className={styles.gameHeader}>
            <div className={styles.gameInfo}>
              <div className={styles.score}>Điểm: {score}</div>
              <div className={styles.time}>Thời gian: {formatTime(timeLeft)}</div>
              <div className={styles.progress}>
                Đã xử lý: {totalProcessed} | Đúng: {correctItems} ({getAccuracy()}%)
              </div>
            </div>
          </div>

          {/* Rác cần phân loại - ĐẶT Ở TRÊN */}
          <div className={styles.trashItemsContainer}>
            {currentItems.map((item) => (
              <div
                key={item.id}
                className={`${styles.trashItem} ${isDragging && draggedItem?.id === item.id ? styles.dragging : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
              >
                <img src={item.image} alt={item.name} className={styles.itemImage} />
                <div className={styles.itemName}>{item.name}</div>
              </div>
            ))}
          </div>

          {/* Thùng rác - ĐẶT Ở DƯỚI */}
          <div className={styles.trashBinsContainer}>
            {trashBins.map((bin) => (
              <div
                key={bin.id}
                className={`${styles.trashBin} ${isDragging ? styles.dragOver : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, bin)}
              >
                <img src={bin.image} alt={bin.name} className={styles.binImage} />
                <div className={styles.binLabel}>{bin.name}</div>
              </div>
            ))}
          </div>

          {/* Thông báo */}
          {showMessage && (
            <div className={`${styles.message} ${styles[messageType]}`}>
              {message}
            </div>
          )}
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className={styles.gameOver}>
          <h2 className={styles.gameOverTitle}>🎯 Kết thúc game!</h2>
          <div className={styles.gameOverStats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Điểm số:</span>
              <span className={styles.statValue}>{score}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Độ chính xác:</span>
              <span className={styles.statValue}>{getAccuracy()}%</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Đã xử lý:</span>
              <span className={styles.statValue}>{totalProcessed} rác</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Thời gian còn lại:</span>
              <span className={styles.statValue}>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className={styles.gameOverActions}>
            <button className={styles.playAgainButton} onClick={resetGame}>
              🔄 Chơi lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecyclingGame; 
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

// Import Models
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');
const Shop = require('../src/models/Shop');
const Order = require('../src/models/Order');
const Campaign = require('../src/models/Campaign');
const Coupon = require('../src/models/Coupon');
const Cart = require('../src/models/Cart');
const Notification = require('../src/models/Notification');
const CoinTransaction = require('../src/models/CoinTransaction');
const OTP = require('../src/models/OTP');

const seedData = async () => {
  try {
    await connectDB();

    // 1. Xóa dữ liệu cũ
    console.log('🧹 Clearing old data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Shop.deleteMany({}),
      Order.deleteMany({}),
      Campaign.deleteMany({}),
      Coupon.deleteMany({}),
      Cart.deleteMany({}),
      Notification.deleteMany({}),
      CoinTransaction.deleteMany({}),
      OTP.deleteMany({})
    ]);

    // 2. Seed Shop (1 duy nhất theo plan)
    const shop = await Shop.create({
      name: 'UTEShop Official Store',
      address: '01 Võ Văn Ngân, Linh Chiểu, Thủ Đức, TP.HCM',
      phone: '02837221223',
      logo_url: 'https://ute.edu.vn/logo.png',
      description: 'Cửa hàng chính thức của trường ĐH Sư phạm Kỹ thuật TP.HCM'
    });

    // 3. Seed Users (5 người dùng với các vai trò khác nhau)
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      { full_name: 'Admin System', email: 'admin@uteshop.vn', password: hashedPassword, role: 'admin', status: 'active' },
      { full_name: 'Vendor Nguyễn Văn A', email: 'vendor@gmail.com', password: hashedPassword, role: 'vendor', status: 'active' },
      { full_name: 'Customer Trần Thị B', email: 'customer1@gmail.com', password: hashedPassword, role: 'customer', status: 'active', coin_balance: 500, addresses: [{ label: 'KTX Khu A', recipient_name: 'Trần Thị B', recipient_phone: '0901234567', street_address: 'Phòng 402, KTX Khu A' }] },
      { full_name: 'Customer Lê Văn C', email: 'customer2@gmail.com', password: hashedPassword, role: 'customer', status: 'active', coin_balance: 200 },
      { full_name: 'Shipper Hoàng Văn D', email: 'shipper@gmail.com', password: hashedPassword, role: 'shipper', status: 'active', shipper_details: { vehicle_type: 'Xe máy', license_plate: '59-X1 123.45', is_available: true } }
    ]);

    // 4. Seed Categories (5 danh mục)
    const categories = await Category.insertMany([
      { name: 'Đồng phục', slug: 'dong-phuc', description: 'Đồ đồng phục các khoa' },
      { name: 'Sách & Giáo trình', slug: 'sach-giao-trinh', description: 'Tài liệu học tập chính quy' },
      { name: 'Văn phòng phẩm', slug: 'van-phong-pham', description: 'Bút, vở, dụng cụ học tập' },
      { name: 'Quà lưu niệm', slug: 'qua-luu-niem', description: 'Gấu bông, móc khóa logo UTE' },
      { name: 'Đồ điện tử', slug: 'do-dien-tu', description: 'Chuột, bàn phím, phụ kiện máy tính' }
    ]);

    // 5. Seed Products (25 sản phẩm - 5 mỗi danh mục)
    const products = await Product.insertMany([
      // ═══ ĐỒNG PHỤC (categories[0]) ═══
      { 
        name: 'Áo thun UTE Blue', slug: 'ao-thun-ute-blue', base_price: 120000, shop: shop._id, category: categories[0]._id, sku: 'UTE-AT-01',
        description: 'Áo thun đồng phục chất liệu cotton thoáng mát, phù hợp hoạt động học tập và ngoại khóa.',
        variants: [{ variant_name: 'Size', variant_value: 'M', stock_quantity: 50 }, { variant_name: 'Size', variant_value: 'L', stock_quantity: 40 }],
        average_rating: 4.6, review_count: 120, view_count: 320, tags: ['featured', 'sale'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/1a56db/ffffff?text=Ao+Thun+UTE', sort_order: 1 }]
      },
      { 
        name: 'Áo Polo UTE Premium', slug: 'ao-polo-ute-premium', base_price: 180000, shop: shop._id, category: categories[0]._id, sku: 'UTE-AT-02',
        description: 'Áo polo cao cấp có thêu logo UTE, chất liệu cá sấu mềm mại, thấm hút mồ hôi tốt.',
        variants: [{ variant_name: 'Size', variant_value: 'M', stock_quantity: 30 }, { variant_name: 'Size', variant_value: 'XL', stock_quantity: 25 }],
        average_rating: 4.8, review_count: 85, view_count: 280, tags: ['new', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/2563eb/ffffff?text=Polo+UTE', sort_order: 1 }]
      },
      { 
        name: 'Áo khoác UTE Hoodie', slug: 'ao-khoac-ute-hoodie', base_price: 250000, shop: shop._id, category: categories[0]._id, sku: 'UTE-AT-03',
        description: 'Áo khoác hoodie logo UTE, chất nỉ bông dày dặn, giữ ấm trong mùa mưa.',
        variants: [{ variant_name: 'Size', variant_value: 'L', stock_quantity: 20 }, { variant_name: 'Size', variant_value: 'XL', stock_quantity: 15 }],
        average_rating: 4.9, review_count: 67, view_count: 450, tags: ['hot', 'new'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/1e40af/ffffff?text=Hoodie+UTE', sort_order: 1 }]
      },
      { 
        name: 'Quần tây đồng phục UTE', slug: 'quan-tay-dong-phuc', base_price: 150000, shop: shop._id, category: categories[0]._id, sku: 'UTE-AT-04',
        description: 'Quần tây đồng phục chính hãng, ống suông thoải mái, vải không nhăn.',
        variants: [{ variant_name: 'Size', variant_value: '29', stock_quantity: 40 }, { variant_name: 'Size', variant_value: '31', stock_quantity: 35 }],
        average_rating: 4.3, review_count: 42, view_count: 190, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/3b82f6/ffffff?text=Quan+Tay', sort_order: 1 }]
      },
      { 
        name: 'Nón lưỡi trai UTE', slug: 'non-luoi-trai-ute', base_price: 65000, shop: shop._id, category: categories[0]._id, sku: 'UTE-AT-05',
        description: 'Nón lưỡi trai thêu logo UTE, chất liệu kaki cao cấp, chống nắng tốt.',
        stock_quantity: 100, average_rating: 4.4, review_count: 156, view_count: 520, tags: ['sale', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/60a5fa/ffffff?text=Non+UTE', sort_order: 1 }]
      },

      // ═══ SÁCH & GIÁO TRÌNH (categories[1]) ═══
      { 
        name: 'Giáo trình Triết học', slug: 'giao-trinh-triet', base_price: 45000, shop: shop._id, category: categories[1]._id, sku: 'UTE-GT-01',
        description: 'Giáo trình Triết học dành cho sinh viên năm nhất, cập nhật nội dung mới nhất.',
        stock_quantity: 100, average_rating: 4.2, review_count: 54, view_count: 210, tags: ['new'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/059669/ffffff?text=Triet+Hoc', sort_order: 1 }]
      },
      { 
        name: 'Giáo trình Lập trình C++', slug: 'giao-trinh-cpp', base_price: 68000, shop: shop._id, category: categories[1]._id, sku: 'UTE-GT-02',
        description: 'Tài liệu lập trình C++ từ cơ bản đến nâng cao, có bài tập thực hành.',
        stock_quantity: 80, average_rating: 4.7, review_count: 132, view_count: 680, tags: ['featured', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/10b981/ffffff?text=Lap+Trinh+C%2B%2B', sort_order: 1 }]
      },
      { 
        name: 'Sách Toán cao cấp A1', slug: 'toan-cao-cap-a1', base_price: 55000, shop: shop._id, category: categories[1]._id, sku: 'UTE-GT-03',
        description: 'Sách Toán cao cấp A1, bao gồm lý thuyết và bài tập có lời giải.',
        stock_quantity: 120, average_rating: 4.0, review_count: 88, view_count: 340, tags: ['new'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/34d399/ffffff?text=Toan+A1', sort_order: 1 }]
      },
      { 
        name: 'Giáo trình Vật lý đại cương', slug: 'vat-ly-dai-cuong', base_price: 62000, shop: shop._id, category: categories[1]._id, sku: 'UTE-GT-04',
        description: 'Giáo trình Vật lý đại cương dành cho khối ngành kỹ thuật.',
        stock_quantity: 65, average_rating: 4.1, review_count: 47, view_count: 180, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/6ee7b7/333333?text=Vat+Ly', sort_order: 1 }]
      },
      { 
        name: 'Sách Tiếng Anh chuyên ngành IT', slug: 'tieng-anh-chuyen-nganh-it', base_price: 78000, shop: shop._id, category: categories[1]._id, sku: 'UTE-GT-05',
        description: 'Tài liệu Tiếng Anh chuyên ngành Công nghệ Thông tin, kèm từ vựng và bài đọc.',
        stock_quantity: 50, average_rating: 4.5, review_count: 63, view_count: 410, tags: ['new', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/047857/ffffff?text=English+IT', sort_order: 1 }]
      },

      // ═══ VĂN PHÒNG PHẨM (categories[2]) ═══
      { 
        name: 'Bút bi Logo UTE', slug: 'but-bi-ute', base_price: 5000, shop: shop._id, category: categories[2]._id, sku: 'UTE-VP-01',
        description: 'Bút bi logo UTE viết trơn, mực đậm, phù hợp cho sinh viên.',
        stock_quantity: 500, average_rating: 4.5, review_count: 230, view_count: 410, tags: ['hot', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/f59e0b/ffffff?text=But+Bi', sort_order: 1 }]
      },
      { 
        name: 'Vở kẻ ngang UTE 200 trang', slug: 'vo-ke-ngang-200', base_price: 12000, shop: shop._id, category: categories[2]._id, sku: 'UTE-VP-02',
        description: 'Vở kẻ ngang 200 trang bìa cứng, giấy trắng không lem mực.',
        stock_quantity: 300, average_rating: 4.3, review_count: 178, view_count: 350, tags: ['sale'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/fbbf24/333333?text=Vo+200+Trang', sort_order: 1 }]
      },
      { 
        name: 'Bộ bút highlight pastel 6 màu', slug: 'but-highlight-pastel', base_price: 35000, shop: shop._id, category: categories[2]._id, sku: 'UTE-VP-03',
        description: 'Bộ bút highlight màu pastel dịu mắt, không bị nhòe khi gạch chân.',
        stock_quantity: 150, average_rating: 4.8, review_count: 95, view_count: 620, tags: ['new', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/fcd34d/333333?text=Highlight', sort_order: 1 }]
      },
      { 
        name: 'Thước kẻ nhựa dẻo 30cm', slug: 'thuoc-ke-30cm', base_price: 8000, shop: shop._id, category: categories[2]._id, sku: 'UTE-VP-04',
        description: 'Thước kẻ nhựa dẻo trong suốt 30cm, bền bỉ không gãy.',
        stock_quantity: 400, average_rating: 4.1, review_count: 67, view_count: 120, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/d97706/ffffff?text=Thuoc+Ke', sort_order: 1 }]
      },
      { 
        name: 'Balo laptop chống sốc UTE', slug: 'balo-laptop-ute', base_price: 320000, shop: shop._id, category: categories[2]._id, sku: 'UTE-VP-05',
        description: 'Balo laptop 15.6 inch chống sốc, nhiều ngăn tiện lợi, logo UTE thêu nổi.',
        stock_quantity: 25, average_rating: 4.9, review_count: 42, view_count: 780, tags: ['new', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/92400e/ffffff?text=Balo+UTE', sort_order: 1 }]
      },

      // ═══ QUÀ LƯU NIỆM (categories[3]) ═══
      { 
        name: 'Gấu bông UTE 20cm', slug: 'gau-bong-ute', base_price: 85000, shop: shop._id, category: categories[3]._id, sku: 'UTE-QL-01',
        description: 'Gấu bông lưu niệm mềm mại, quà tặng ý nghĩa cho sinh viên.',
        stock_quantity: 20, average_rating: 4.8, review_count: 75, view_count: 290, tags: ['sale'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/ec4899/ffffff?text=Gau+Bong', sort_order: 1 }]
      },
      { 
        name: 'Móc khóa logo UTE kim loại', slug: 'moc-khoa-ute', base_price: 25000, shop: shop._id, category: categories[3]._id, sku: 'UTE-QL-02',
        description: 'Móc khóa kim loại khắc logo UTE, nhỏ gọn sang trọng, quà lưu niệm ý nghĩa.',
        stock_quantity: 200, average_rating: 4.6, review_count: 189, view_count: 550, tags: ['hot', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/f472b6/ffffff?text=Moc+Khoa', sort_order: 1 }]
      },
      { 
        name: 'Ly sứ UTE 350ml', slug: 'ly-su-ute', base_price: 55000, shop: shop._id, category: categories[3]._id, sku: 'UTE-QL-03',
        description: 'Ly sứ in logo UTE, dung tích 350ml, có nắp đậy, giữ nhiệt tốt.',
        stock_quantity: 60, average_rating: 4.4, review_count: 56, view_count: 310, tags: ['new'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/db2777/ffffff?text=Ly+Su+UTE', sort_order: 1 }]
      },
      { 
        name: 'Sticker UTE set 50 hình', slug: 'sticker-ute-set', base_price: 15000, shop: shop._id, category: categories[3]._id, sku: 'UTE-QL-04',
        description: 'Bộ 50 sticker vinyl UTE chống nước, dán laptop, bình nước, sổ tay.',
        stock_quantity: 350, average_rating: 4.7, review_count: 234, view_count: 890, tags: ['hot', 'sale'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/be185d/ffffff?text=Sticker+UTE', sort_order: 1 }]
      },
      { 
        name: 'Khung ảnh kỷ yếu UTE', slug: 'khung-anh-ky-yeu', base_price: 95000, shop: shop._id, category: categories[3]._id, sku: 'UTE-QL-05',
        description: 'Khung ảnh kỷ yếu gỗ tự nhiên, khắc laser logo UTE, kèm chân đế.',
        stock_quantity: 30, average_rating: 4.9, review_count: 28, view_count: 160, tags: ['new', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/9d174d/ffffff?text=Khung+Anh', sort_order: 1 }]
      },

      // ═══ ĐỒ ĐIỆN TỬ (categories[4]) ═══
      { 
        name: 'Chuột không dây Logitech', slug: 'chuot-logitech', base_price: 250000, shop: shop._id, category: categories[4]._id, sku: 'UTE-DT-01',
        description: 'Chuột không dây nhỏ gọn, kết nối ổn định, phù hợp học tập và làm việc.',
        stock_quantity: 15, average_rating: 4.7, review_count: 98, view_count: 360, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/7c3aed/ffffff?text=Chuot+Logitech', sort_order: 1 }]
      },
      { 
        name: 'Bàn phím cơ mini 60%', slug: 'ban-phim-co-mini', base_price: 450000, shop: shop._id, category: categories[4]._id, sku: 'UTE-DT-02',
        description: 'Bàn phím cơ mini 60%, switch Red, LED RGB, kết nối USB-C.',
        stock_quantity: 10, average_rating: 4.8, review_count: 76, view_count: 520, tags: ['new', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/8b5cf6/ffffff?text=Ban+Phim+Co', sort_order: 1 }]
      },
      { 
        name: 'Tai nghe Bluetooth TWS', slug: 'tai-nghe-tws', base_price: 180000, shop: shop._id, category: categories[4]._id, sku: 'UTE-DT-03',
        description: 'Tai nghe True Wireless, pin 24h, chống ồn, mic rõ ràng cho học online.',
        stock_quantity: 40, average_rating: 4.5, review_count: 143, view_count: 710, tags: ['sale', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/a78bfa/ffffff?text=Tai+Nghe+TWS', sort_order: 1 }]
      },
      { 
        name: 'USB Flash Drive 32GB', slug: 'usb-flash-32gb', base_price: 95000, shop: shop._id, category: categories[4]._id, sku: 'UTE-DT-04',
        description: 'USB 3.0 tốc độ cao 32GB, vỏ kim loại nhỏ gọn, kèm móc treo.',
        stock_quantity: 80, average_rating: 4.3, review_count: 112, view_count: 240, tags: ['hot'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/6d28d9/ffffff?text=USB+32GB', sort_order: 1 }]
      },
      { 
        name: 'Đế tản nhiệt laptop 2 quạt', slug: 'de-tan-nhiet-laptop', base_price: 220000, shop: shop._id, category: categories[4]._id, sku: 'UTE-DT-05',
        description: 'Đế tản nhiệt laptop 2 quạt lớn, nâng cao 15 độ, giảm nhiệt hiệu quả.',
        stock_quantity: 18, average_rating: 4.6, review_count: 54, view_count: 330, tags: ['new', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://placehold.co/400x400/4c1d95/ffffff?text=De+Tan+Nhiet', sort_order: 1 }]
      }
    ]);

    // 6. Seed Campaigns & Coupons
    const campaign = await Campaign.create({ 
      name: 'Chào mừng tân sinh viên', slug: 'chao-tan-sv', start_at: new Date(), end_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
      type: 'discount', value: 10 
    });
    const coupons = await Coupon.insertMany([
      { code: 'UTE10', type: 'percent', value: 10, campaign: campaign._id, status: 'active' },
      { code: 'WELCOME50', type: 'fixed_amount', value: 50000, min_order_total: 200000, status: 'active' },
      { code: 'FREESHIP', type: 'fixed_amount', value: 15000, status: 'active' },
      { code: 'COINBACK', type: 'percent', value: 5, status: 'active' },
      { code: 'SV-GIOI', type: 'percent', value: 20, status: 'active' }
    ]);

    // 7. Seed Orders (5 đơn hàng)
    const orders = await Order.insertMany([
      { 
        order_code: 'ORD001', customer: users[2]._id, shipper: users[4]._id, status: 'completed', total_base: 120000, shipping_fee: 15000, total_final: 135000, payment_status: 'paid',
        items: [{ product: products[0]._id, quantity: 1, price_at_buy: 120000 }],
        history: [{ status: 'pending', note: 'Chờ xác nhận' }, { status: 'completed', note: 'Giao hàng thành công' }]
      },
      { order_code: 'ORD002', customer: users[3]._id, status: 'pending', total_base: 45000, total_final: 45000, items: [{ product: products[1]._id, quantity: 1, price_at_buy: 45000 }] },
      { order_code: 'ORD003', customer: users[2]._id, status: 'shipping', total_base: 85000, total_final: 85000, items: [{ product: products[3]._id, quantity: 1, price_at_buy: 85000 }] },
      { order_code: 'ORD004', customer: users[3]._id, status: 'cancelled', total_base: 5000, total_final: 5000, items: [{ product: products[2]._id, quantity: 1, price_at_buy: 5000 }], cancellation: { user: users[3]._id, reason: 'Đặt nhầm' } },
      { order_code: 'ORD005', customer: users[2]._id, status: 'pending', total_base: 250000, total_final: 250000, items: [{ product: products[4]._id, quantity: 1, price_at_buy: 250000 }] }
    ]);

    // 8. Seed Carts
    await Cart.insertMany(users.filter(u => u.role === 'customer').map(u => ({
      user: u._id, items: [{ product: products[0]._id, quantity: 1 }]
    })));

    // 9. Seed Notifications
    await Notification.insertMany([
      { user: users[2]._id, title: 'Đơn hàng đã giao', content: 'Đơn hàng ORD001 đã hoàn tất', type: 'order' },
      { user: users[3]._id, title: 'Khuyến mãi mới', content: 'Nhập mã UTE10 để được giảm 10%', type: 'promotion' },
      { user: users[2]._id, title: 'Hệ thống bảo trì', content: 'Hệ thống sẽ bảo trì vào 12h đêm nay', type: 'system' },
      { user: users[4]._id, title: 'Đơn hàng mới', content: 'Bạn có đơn hàng ORD003 cần giao', type: 'order' },
      { user: users[3]._id, title: 'Hủy đơn thành công', content: 'Đơn hàng ORD004 đã được hủy', type: 'order' }
    ]);

    // 10. Seed CoinTransactions
    await CoinTransaction.insertMany([
      { user: users[2]._id, amount: 10, type: 'earn', balance_before: 490, balance_after: 500, description: 'Tích xu từ đơn ORD001' },
      { user: users[3]._id, amount: -50, type: 'spend', balance_before: 250, balance_after: 200, description: 'Dùng xu cho đơn ORD002' },
      { user: users[2]._id, amount: 100, type: 'earn', balance_before: 0, balance_after: 100, description: 'Thưởng đăng ký' },
      { user: users[3]._id, amount: 50, type: 'refund', balance_before: 200, balance_after: 250, description: 'Hoàn xu đơn ORD004' },
      { user: users[2]._id, amount: 20, type: 'earn', balance_before: 100, balance_after: 120, description: 'Tham gia sự kiện' }
    ]);

    console.log('🚀 SEEDING COMPLETED SUCCESSFULLY!');
    process.exit();
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedData();

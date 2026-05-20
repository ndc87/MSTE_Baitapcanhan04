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

    // 2. Seed Shop
    const shop = await Shop.create({
      name: 'BootZone - Chuyên Giày Đá Bóng',
      address: '01 Võ Văn Ngân, Linh Chiểu, Thủ Đức, TP.HCM',
      phone: '02837221223',
      logo_url: 'https://ute.edu.vn/logo.png',
      description: 'Chuyên cung cấp giày đá bóng chính hãng và phụ kiện bóng đá'
    });

    // 3. Seed Users
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      { full_name: 'Admin System', email: 'admin@bootzone.vn', password: hashedPassword, role: 'admin', status: 'active' },
      { full_name: 'Vendor Nguyễn Văn A', email: 'vendor@gmail.com', password: hashedPassword, role: 'vendor', status: 'active' },
      { full_name: 'Customer Trần Thị B', email: 'customer1@gmail.com', password: hashedPassword, role: 'customer', status: 'active', coin_balance: 500, addresses: [{ label: 'Nhà riêng', recipient_name: 'Trần Thị B', recipient_phone: '0901234567', street_address: '123 Nguyễn Huệ, Q1, TP.HCM' }] },
      { full_name: 'Customer Lê Văn C', email: 'customer2@gmail.com', password: hashedPassword, role: 'customer', status: 'active', coin_balance: 200 },
      { full_name: 'Shipper Hoàng Văn D', email: 'shipper@gmail.com', password: hashedPassword, role: 'shipper', status: 'active', shipper_details: { vehicle_type: 'Xe máy', license_plate: '59-X1 123.45', is_available: true } }
    ]);

    // 4. Seed Categories (5 danh mục)
    const categories = await Category.insertMany([
      { name: 'Giày đá bóng', slug: 'giay-da-bong', description: 'Giày đá bóng sân cỏ nhân tạo, sân cỏ tự nhiên, futsal' },
      { name: 'Dây giày', slug: 'day-giay', description: 'Dây giày thay thế cho giày đá bóng các loại' },
      { name: 'Vệ sinh giày', slug: 've-sinh-giay', description: 'Dung dịch, bộ kit vệ sinh và bảo quản giày đá bóng' },
      { name: 'Băng quấn & Bảo vệ', slug: 'bang-quan-bao-ve', description: 'Băng quấn cổ chân, bảo vệ ống đồng, tất đá bóng' },
      { name: 'Quần áo đá bóng', slug: 'quan-ao-da-bong', description: 'Áo đấu, quần short, bộ đồ tập luyện bóng đá' }
    ]);

    // 5. Seed Products
    const products = await Product.insertMany([
      // ═══════════════════════════════════════════════════
      // ═══ GIÀY ĐÁ BÓNG (30 sản phẩm) ═══════════════
      // ═══════════════════════════════════════════════════

      // --- Nike ---
      {
        name: 'Nike Mercurial Vapor 15 Elite FG', slug: 'nike-mercurial-vapor-15-elite', base_price: 6500000, shop: shop._id, category: categories[0]._id, sku: 'NK-MV15E-01',
        description: 'Giày đá bóng Nike Mercurial Vapor 15 Elite sân cỏ tự nhiên (FG). Công nghệ Zoom Air, trọng lượng siêu nhẹ, tăng tốc cực đỉnh. Phù hợp cho tiền đạo và tiền vệ cánh.',
        variants: [{ variant_name: 'Size', variant_value: '40', stock_quantity: 10 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 15 }, { variant_name: 'Size', variant_value: '43', stock_quantity: 8 }],
        average_rating: 4.9, review_count: 245, view_count: 1200, tags: ['featured', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Nike Phantom GX 2 Elite FG', slug: 'nike-phantom-gx2-elite', base_price: 7200000, shop: shop._id, category: categories[0]._id, sku: 'NK-PGX2E-01',
        description: 'Nike Phantom GX 2 Elite FG với bề mặt Gripknit cải tiến, kiểm soát bóng tuyệt vời, lý tưởng cho tiền vệ sáng tạo.',
        variants: [{ variant_name: 'Size', variant_value: '41', stock_quantity: 12 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 10 }],
        average_rating: 4.8, review_count: 189, view_count: 980, tags: ['new', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Nike Mercurial Superfly 9 Academy TF', slug: 'nike-superfly-9-tf', base_price: 2800000, shop: shop._id, category: categories[0]._id, sku: 'NK-SF9A-01',
        description: 'Giày Nike Mercurial Superfly 9 Academy sân cỏ nhân tạo (TF), cổ cao ôm chân, đế đinh TF bám sân tốt.',
        variants: [{ variant_name: 'Size', variant_value: '40', stock_quantity: 20 }, { variant_name: 'Size', variant_value: '41', stock_quantity: 25 }, { variant_name: 'Size', variant_value: '43', stock_quantity: 15 }],
        average_rating: 4.6, review_count: 312, view_count: 1500, tags: ['hot', 'sale'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Nike Tiempo Legend 10 Elite FG', slug: 'nike-tiempo-legend-10-elite', base_price: 5800000, shop: shop._id, category: categories[0]._id, sku: 'NK-TL10E-01',
        description: 'Nike Tiempo Legend 10 Elite FG, da kangaroo cao cấp, cảm giác bóng tự nhiên nhất, dành cho trung vệ và tiền vệ trung tâm.',
        variants: [{ variant_name: 'Size', variant_value: '41', stock_quantity: 8 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 12 }],
        average_rating: 4.7, review_count: 167, view_count: 850, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Nike Phantom Luna 2 Elite TF', slug: 'nike-phantom-luna-2-tf', base_price: 4500000, shop: shop._id, category: categories[0]._id, sku: 'NK-PL2E-01',
        description: 'Nike Phantom Luna 2 Elite TF thiết kế dành cho sân cỏ nhân tạo, đệm êm ái, da tổng hợp mềm mại.',
        variants: [{ variant_name: 'Size', variant_value: '40', stock_quantity: 10 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 14 }],
        average_rating: 4.5, review_count: 98, view_count: 620, tags: ['new'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Nike Mercurial Vapor 15 Club IC', slug: 'nike-vapor-15-club-ic', base_price: 1800000, shop: shop._id, category: categories[0]._id, sku: 'NK-MV15C-01',
        description: 'Giày futsal Nike Mercurial Vapor 15 Club IC, đế bằng non-marking, tốc độ trên sàn trong nhà.',
        variants: [{ variant_name: 'Size', variant_value: '39', stock_quantity: 30 }, { variant_name: 'Size', variant_value: '41', stock_quantity: 20 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 18 }],
        average_rating: 4.4, review_count: 420, view_count: 2100, tags: ['sale', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop', sort_order: 1 }]
      },

      // --- Adidas ---
      {
        name: 'Adidas Predator Elite FG', slug: 'adidas-predator-elite-fg', base_price: 6800000, shop: shop._id, category: categories[0]._id, sku: 'AD-PRE-01',
        description: 'Adidas Predator Elite FG với bề mặt Hybridfeel, xoáy bóng cực mạnh, huyền thoại sân cỏ tái sinh.',
        variants: [{ variant_name: 'Size', variant_value: '41', stock_quantity: 10 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 12 }],
        average_rating: 4.8, review_count: 198, view_count: 1050, tags: ['featured', 'new'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Adidas X Crazyfast.1 FG', slug: 'adidas-x-crazyfast-1-fg', base_price: 5500000, shop: shop._id, category: categories[0]._id, sku: 'AD-XCF1-01',
        description: 'Adidas X Crazyfast.1 FG siêu nhẹ với công nghệ Speedframe, dành cho những cầu thủ tốc độ.',
        variants: [{ variant_name: 'Size', variant_value: '40', stock_quantity: 8 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 15 }],
        average_rating: 4.7, review_count: 145, view_count: 780, tags: ['hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Adidas Copa Pure 2 Elite FG', slug: 'adidas-copa-pure-2-elite', base_price: 5200000, shop: shop._id, category: categories[0]._id, sku: 'AD-CP2E-01',
        description: 'Adidas Copa Pure 2 Elite FG, da K-Leather mềm mại, cảm giác bóng chân thực, kiểm soát bóng hoàn hảo.',
        variants: [{ variant_name: 'Size', variant_value: '41', stock_quantity: 10 }, { variant_name: 'Size', variant_value: '43', stock_quantity: 8 }],
        average_rating: 4.6, review_count: 112, view_count: 650, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Adidas Predator Accuracy.3 TF', slug: 'adidas-predator-accuracy-3-tf', base_price: 2200000, shop: shop._id, category: categories[0]._id, sku: 'AD-PA3-01',
        description: 'Adidas Predator Accuracy.3 TF sân cỏ nhân tạo, bề mặt texture tăng ma sát, giá tầm trung chất lượng cao.',
        variants: [{ variant_name: 'Size', variant_value: '40', stock_quantity: 25 }, { variant_name: 'Size', variant_value: '41', stock_quantity: 30 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 20 }],
        average_rating: 4.5, review_count: 356, view_count: 1800, tags: ['sale', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Adidas X Speedportal.1 IC', slug: 'adidas-x-speedportal-ic', base_price: 3200000, shop: shop._id, category: categories[0]._id, sku: 'AD-XSP1-01',
        description: 'Adidas X Speedportal.1 IC giày futsal, lưới Speedskin mỏng nhẹ, bám sàn tuyệt vời.',
        variants: [{ variant_name: 'Size', variant_value: '40', stock_quantity: 15 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 12 }],
        average_rating: 4.4, review_count: 87, view_count: 490, tags: ['new'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Adidas F50 League TF', slug: 'adidas-f50-league-tf', base_price: 2500000, shop: shop._id, category: categories[0]._id, sku: 'AD-F50L-01',
        description: 'Adidas F50 League TF huyền thoại trở lại, thiết kế retro hiện đại, nhẹ và nhanh.',
        variants: [{ variant_name: 'Size', variant_value: '41', stock_quantity: 18 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 22 }],
        average_rating: 4.6, review_count: 134, view_count: 720, tags: ['new', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop', sort_order: 1 }]
      },

      // --- Puma ---
      {
        name: 'Puma Future 7 Ultimate FG/AG', slug: 'puma-future-7-ultimate', base_price: 5800000, shop: shop._id, category: categories[0]._id, sku: 'PM-F7U-01',
        description: 'Puma Future 7 Ultimate FG/AG với Dynamic Motion System, linh hoạt tối đa, Neymar Edition.',
        variants: [{ variant_name: 'Size', variant_value: '41', stock_quantity: 8 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 10 }],
        average_rating: 4.7, review_count: 112, view_count: 670, tags: ['featured', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Puma Ultra Ultimate FG/AG', slug: 'puma-ultra-ultimate', base_price: 5200000, shop: shop._id, category: categories[0]._id, sku: 'PM-UU-01',
        description: 'Puma Ultra Ultimate siêu nhẹ chỉ 160g, ULTRAWEAVE upper, tốc độ thuần túy trên sân cỏ.',
        variants: [{ variant_name: 'Size', variant_value: '40', stock_quantity: 6 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 9 }],
        average_rating: 4.6, review_count: 89, view_count: 520, tags: ['new'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Puma King Ultimate FG/AG', slug: 'puma-king-ultimate', base_price: 4800000, shop: shop._id, category: categories[0]._id, sku: 'PM-KU-01',
        description: 'Puma King Ultimate FG/AG, da K-Leather huyền thoại, cảm giác chạm bóng mượt mà.',
        variants: [{ variant_name: 'Size', variant_value: '41', stock_quantity: 10 }, { variant_name: 'Size', variant_value: '43', stock_quantity: 7 }],
        average_rating: 4.8, review_count: 156, view_count: 890, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1581068505002-0a74dcdd0d08?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Puma Future 7 Play TT', slug: 'puma-future-7-play-tt', base_price: 1600000, shop: shop._id, category: categories[0]._id, sku: 'PM-F7P-01',
        description: 'Puma Future 7 Play TT giá rẻ chất lượng, sân cỏ nhân tạo, thiết kế năng động.',
        variants: [{ variant_name: 'Size', variant_value: '39', stock_quantity: 35 }, { variant_name: 'Size', variant_value: '41', stock_quantity: 28 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 22 }],
        average_rating: 4.3, review_count: 278, view_count: 1400, tags: ['sale', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=400&h=400&fit=crop', sort_order: 1 }]
      },

      // --- Mizuno ---
      {
        name: 'Mizuno Morelia Neo III Elite', slug: 'mizuno-morelia-neo-3-elite', base_price: 6200000, shop: shop._id, category: categories[0]._id, sku: 'MZ-MN3E-01',
        description: 'Mizuno Morelia Neo III Elite, da kangaroo Nhật Bản cao cấp nhất, nhẹ và bền, Made in Japan.',
        variants: [{ variant_name: 'Size', variant_value: '41', stock_quantity: 5 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 7 }],
        average_rating: 4.9, review_count: 87, view_count: 560, tags: ['featured', 'new'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Mizuno Alpha Japan TF', slug: 'mizuno-alpha-japan-tf', base_price: 3800000, shop: shop._id, category: categories[0]._id, sku: 'MZ-AJ-01',
        description: 'Mizuno Alpha Japan TF sân cỏ nhân tạo, công nghệ KawaKami Wave, da nhẹ bám bóng tốt.',
        variants: [{ variant_name: 'Size', variant_value: '40', stock_quantity: 10 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 8 }],
        average_rating: 4.7, review_count: 65, view_count: 380, tags: ['new'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Mizuno Morelia II Club TF', slug: 'mizuno-morelia-2-club-tf', base_price: 1500000, shop: shop._id, category: categories[0]._id, sku: 'MZ-M2C-01',
        description: 'Mizuno Morelia II Club TF, phiên bản giá rẻ của dòng huyền thoại Morelia, phù hợp tập luyện.',
        variants: [{ variant_name: 'Size', variant_value: '40', stock_quantity: 30 }, { variant_name: 'Size', variant_value: '41', stock_quantity: 25 }, { variant_name: 'Size', variant_value: '43', stock_quantity: 15 }],
        average_rating: 4.4, review_count: 198, view_count: 950, tags: ['sale'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?w=400&h=400&fit=crop', sort_order: 1 }]
      },

      // --- New Balance ---
      {
        name: 'New Balance Furon V7+ FG', slug: 'nb-furon-v7-fg', base_price: 4200000, shop: shop._id, category: categories[0]._id, sku: 'NB-FV7-01',
        description: 'New Balance Furon V7+ FG, Hypoknit upper ôm chân, đế FuelCell đàn hồi, Son Heung-min Edition.',
        variants: [{ variant_name: 'Size', variant_value: '41', stock_quantity: 10 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 12 }],
        average_rating: 4.6, review_count: 78, view_count: 430, tags: ['new', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'New Balance Tekela V4 Pro TF', slug: 'nb-tekela-v4-tf', base_price: 3500000, shop: shop._id, category: categories[0]._id, sku: 'NB-TV4-01',
        description: 'New Balance Tekela V4 Pro TF, kiểm soát bóng 360 độ, Kinetic Stitch upper.',
        variants: [{ variant_name: 'Size', variant_value: '40', stock_quantity: 12 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 10 }],
        average_rating: 4.5, review_count: 56, view_count: 320, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop', sort_order: 1 }]
      },

      // --- Joma, Kamito, Kelme ---
      {
        name: 'Joma Top Flex TF', slug: 'joma-top-flex-tf', base_price: 1200000, shop: shop._id, category: categories[0]._id, sku: 'JM-TF-01',
        description: 'Joma Top Flex TF hàng Tây Ban Nha, đế ôm chân, phù hợp sân cỏ nhân tạo Việt Nam.',
        variants: [{ variant_name: 'Size', variant_value: '39', stock_quantity: 30 }, { variant_name: 'Size', variant_value: '41', stock_quantity: 25 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 20 }],
        average_rating: 4.3, review_count: 345, view_count: 1600, tags: ['sale', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Kamito TA11 Pro TF', slug: 'kamito-ta11-pro-tf', base_price: 890000, shop: shop._id, category: categories[0]._id, sku: 'KM-TA11-01',
        description: 'Kamito TA11 Pro TF thương hiệu Việt Nam, thiết kế cho chân Việt, giá siêu rẻ.',
        variants: [{ variant_name: 'Size', variant_value: '39', stock_quantity: 40 }, { variant_name: 'Size', variant_value: '40', stock_quantity: 35 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 25 }],
        average_rating: 4.2, review_count: 567, view_count: 2800, tags: ['sale'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Kelme Star 360 TF', slug: 'kelme-star-360-tf', base_price: 750000, shop: shop._id, category: categories[0]._id, sku: 'KL-S360-01',
        description: 'Kelme Star 360 TF giá rẻ nhất phân khúc, đế TF bền bỉ, phù hợp người mới chơi.',
        variants: [{ variant_name: 'Size', variant_value: '39', stock_quantity: 50 }, { variant_name: 'Size', variant_value: '41', stock_quantity: 40 }, { variant_name: 'Size', variant_value: '43', stock_quantity: 30 }],
        average_rating: 4.0, review_count: 789, view_count: 3500, tags: ['sale', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1612188842101-f976582390b2?w=400&h=400&fit=crop', sort_order: 1 }]
      },

      // --- Thêm Nike/Adidas đặc biệt ---
      {
        name: 'Nike Zoom Mercurial Vapor 15 TF - Mbappe Rosa', slug: 'nike-vapor-15-mbappe-rosa', base_price: 3200000, shop: shop._id, category: categories[0]._id, sku: 'NK-MV15M-01',
        description: 'Phiên bản Mbappe Rosa màu hồng độc đáo, Zoom Air cushioning, sân cỏ nhân tạo.',
        variants: [{ variant_name: 'Size', variant_value: '40', stock_quantity: 12 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 15 }],
        average_rating: 4.7, review_count: 234, view_count: 1300, tags: ['hot', 'new'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Adidas Predator Edge.1 Low FG', slug: 'adidas-predator-edge-low', base_price: 4800000, shop: shop._id, category: categories[0]._id, sku: 'AD-PE1L-01',
        description: 'Adidas Predator Edge.1 Low FG phiên bản cổ thấp, Zone Skin 2.0, sút phạt cực chuẩn.',
        variants: [{ variant_name: 'Size', variant_value: '41', stock_quantity: 8 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 10 }],
        average_rating: 4.6, review_count: 145, view_count: 780, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Nike React Gato IC', slug: 'nike-react-gato-ic', base_price: 2900000, shop: shop._id, category: categories[0]._id, sku: 'NK-RG-01',
        description: 'Nike React Gato IC giày futsal chuyên nghiệp, đệm React êm ái, kiểm soát bóng tuyệt hảo trên sàn.',
        variants: [{ variant_name: 'Size', variant_value: '40', stock_quantity: 15 }, { variant_name: 'Size', variant_value: '41', stock_quantity: 18 }],
        average_rating: 4.5, review_count: 167, view_count: 890, tags: ['new', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1618898909019-010e4e234c55?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Adidas Nemeziz Messi.1 TF', slug: 'adidas-nemeziz-messi-tf', base_price: 3500000, shop: shop._id, category: categories[0]._id, sku: 'AD-NM1-01',
        description: 'Phiên bản Messi đặc biệt, Agility Bandage System, di chuyển xoay sở linh hoạt.',
        variants: [{ variant_name: 'Size', variant_value: '40', stock_quantity: 10 }, { variant_name: 'Size', variant_value: '42', stock_quantity: 12 }],
        average_rating: 4.7, review_count: 223, view_count: 1100, tags: ['hot', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=400&h=400&fit=crop', sort_order: 1 }]
      },

      // ═══════════════════════════════════════════════════
      // ═══ DÂY GIÀY (7 sản phẩm) ════════════════════
      // ═══════════════════════════════════════════════════
      {
        name: 'Dây giày đá bóng Oval 120cm', slug: 'day-giay-oval-120cm', base_price: 35000, shop: shop._id, category: categories[1]._id, sku: 'DG-OV120-01',
        description: 'Dây giày oval tiêu chuẩn 120cm, bền bỉ, không bai giãn, phù hợp mọi loại giày đá bóng.',
        stock_quantity: 500, average_rating: 4.5, review_count: 189, view_count: 450, tags: ['hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Dây giày dẹt Premium 130cm', slug: 'day-giay-dep-130cm', base_price: 45000, shop: shop._id, category: categories[1]._id, sku: 'DG-DP130-01',
        description: 'Dây giày dẹt premium 130cm, chất liệu polyester bện chặt, không tuột khi chơi.',
        stock_quantity: 300, average_rating: 4.6, review_count: 134, view_count: 380, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Dây giày Neon phát sáng', slug: 'day-giay-neon', base_price: 55000, shop: shop._id, category: categories[1]._id, sku: 'DG-NEON-01',
        description: 'Dây giày neon phát sáng trong tối, nổi bật trên sân, có nhiều màu: xanh, cam, hồng.',
        stock_quantity: 200, average_rating: 4.3, review_count: 98, view_count: 560, tags: ['new', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1556048219-bb6978360b84?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Dây giày không buộc Quick Lace', slug: 'day-giay-quick-lace', base_price: 85000, shop: shop._id, category: categories[1]._id, sku: 'DG-QL-01',
        description: 'Hệ thống dây giày không buộc Quick Lace, khóa tự động, tiện lợi và nhanh chóng.',
        stock_quantity: 150, average_rating: 4.7, review_count: 76, view_count: 420, tags: ['new', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Dây giày tròn chống nước 110cm', slug: 'day-giay-tron-chong-nuoc', base_price: 40000, shop: shop._id, category: categories[1]._id, sku: 'DG-CN110-01',
        description: 'Dây giày tròn phủ lớp chống nước, lý tưởng cho trời mưa và sân ướt.',
        stock_quantity: 250, average_rating: 4.4, review_count: 67, view_count: 280, tags: ['sale'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Dây giày Nike chính hãng', slug: 'day-giay-nike-chinh-hang', base_price: 120000, shop: shop._id, category: categories[1]._id, sku: 'DG-NK-01',
        description: 'Dây giày Nike chính hãng thay thế, phù hợp dòng Mercurial và Phantom.',
        stock_quantity: 100, average_rating: 4.8, review_count: 45, view_count: 310, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Bộ 3 đôi dây giày đa năng', slug: 'bo-3-doi-day-giay', base_price: 75000, shop: shop._id, category: categories[1]._id, sku: 'DG-B3-01',
        description: 'Bộ 3 đôi dây giày (trắng, đen, xám) 120cm, tiết kiệm chi phí, luôn có dây dự phòng.',
        stock_quantity: 180, average_rating: 4.5, review_count: 112, view_count: 340, tags: ['sale', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&h=400&fit=crop', sort_order: 1 }]
      },

      // ═══════════════════════════════════════════════════
      // ═══ VỆ SINH GIÀY (7 sản phẩm) ════════════════
      // ═══════════════════════════════════════════════════
      {
        name: 'Bộ Kit vệ sinh giày Premium', slug: 'kit-ve-sinh-giay-premium', base_price: 250000, shop: shop._id, category: categories[2]._id, sku: 'VS-KIT-01',
        description: 'Bộ kit vệ sinh giày cao cấp: dung dịch 200ml + bàn chải 3 loại + khăn microfiber. Làm sạch mọi chất liệu.',
        stock_quantity: 60, average_rating: 4.8, review_count: 156, view_count: 780, tags: ['featured', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1617606002806-94e279c22567?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Dung dịch vệ sinh giày 200ml', slug: 'dung-dich-ve-sinh-200ml', base_price: 85000, shop: shop._id, category: categories[2]._id, sku: 'VS-DD200-01',
        description: 'Dung dịch vệ sinh giày 200ml, công thức không chứa hóa chất mạnh, an toàn cho da giày.',
        stock_quantity: 150, average_rating: 4.6, review_count: 234, view_count: 560, tags: ['hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Spray khử mùi giày thể thao', slug: 'spray-khu-mui-giay', base_price: 65000, shop: shop._id, category: categories[2]._id, sku: 'VS-SKM-01',
        description: 'Spray khử mùi giày 150ml, diệt khuẩn 99.9%, hương thơm dịu nhẹ, khô nhanh.',
        stock_quantity: 200, average_rating: 4.5, review_count: 312, view_count: 890, tags: ['sale', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Bàn chải vệ sinh giày chuyên dụng', slug: 'ban-chai-ve-sinh-giay', base_price: 45000, shop: shop._id, category: categories[2]._id, sku: 'VS-BC-01',
        description: 'Bàn chải lông mềm chuyên dụng cho giày đá bóng, không làm xước bề mặt da.',
        stock_quantity: 300, average_rating: 4.4, review_count: 178, view_count: 420, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Túi đựng giày thể thao chống nước', slug: 'tui-dung-giay-chong-nuoc', base_price: 120000, shop: shop._id, category: categories[2]._id, sku: 'VS-TDG-01',
        description: 'Túi đựng giày chống nước, thoáng khí, có ngăn riêng, tiện mang đến sân bóng.',
        stock_quantity: 100, average_rating: 4.7, review_count: 89, view_count: 450, tags: ['new', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Kem dưỡng da giày leather', slug: 'kem-duong-da-giay', base_price: 95000, shop: shop._id, category: categories[2]._id, sku: 'VS-KDD-01',
        description: 'Kem dưỡng da giày leather/K-leather, giữ da mềm mại, chống nứt nẻ, kéo dài tuổi thọ giày.',
        stock_quantity: 80, average_rating: 4.6, review_count: 67, view_count: 320, tags: ['new'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Cây giữ form giày (Shoe Tree)', slug: 'cay-giu-form-giay', base_price: 75000, shop: shop._id, category: categories[2]._id, sku: 'VS-ST-01',
        description: 'Cây giữ form giày bằng nhựa ABS, chống biến dạng, thoáng khí, size universal.',
        stock_quantity: 120, average_rating: 4.3, review_count: 98, view_count: 280, tags: ['sale'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=400&h=400&fit=crop', sort_order: 1 }]
      },

      // ═══════════════════════════════════════════════════
      // ═══ BĂNG QUẤN & BẢO VỆ (7 sản phẩm) ═════════
      // ═══════════════════════════════════════════════════
      {
        name: 'Băng quấn cổ chân Nike Pro', slug: 'bang-quan-co-chan-nike', base_price: 180000, shop: shop._id, category: categories[3]._id, sku: 'BQ-NK-01',
        description: 'Băng quấn cổ chân Nike Pro Ankle Sleeve, nén vừa phải, hỗ trợ phòng chống chấn thương.',
        stock_quantity: 80, average_rating: 4.8, review_count: 234, view_count: 890, tags: ['featured', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Ống bảo vệ ống đồng Adidas', slug: 'ong-bao-ve-ong-dong-adidas', base_price: 220000, shop: shop._id, category: categories[3]._id, sku: 'BQ-AD-01',
        description: 'Ống bảo vệ ống đồng Adidas X Pro, nhẹ chỉ 80g, EVA foam chống va đập, kèm dây cài.',
        stock_quantity: 60, average_rating: 4.7, review_count: 167, view_count: 650, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Tất đá bóng dài chuyên dụng', slug: 'tat-da-bong-dai', base_price: 65000, shop: shop._id, category: categories[3]._id, sku: 'BQ-TDB-01',
        description: 'Tất đá bóng dài qua gối, chống trơn Grip, đệm bảo vệ gót và mu bàn chân.',
        stock_quantity: 200, average_rating: 4.5, review_count: 456, view_count: 1200, tags: ['sale', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Băng keo thể thao Athletic Tape 5cm', slug: 'bang-keo-athletic-tape', base_price: 35000, shop: shop._id, category: categories[3]._id, sku: 'BQ-AT-01',
        description: 'Băng keo thể thao 5cm x 10m, dính chắc, thoáng khí, dùng cố định cổ chân và bắp chân.',
        stock_quantity: 400, average_rating: 4.4, review_count: 289, view_count: 780, tags: ['sale'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Lót giày thể thao chống sốc', slug: 'lot-giay-chong-soc', base_price: 95000, shop: shop._id, category: categories[3]._id, sku: 'BQ-LG-01',
        description: 'Lót giày thể thao Ortholite chống sốc, thoáng khí, giảm mỏi chân khi thi đấu dài.',
        stock_quantity: 150, average_rating: 4.6, review_count: 178, view_count: 520, tags: ['new', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1562183241-840b8af0721e?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Tất ngắn chống trơn Grip Socks', slug: 'tat-ngan-grip-socks', base_price: 120000, shop: shop._id, category: categories[3]._id, sku: 'BQ-GS-01',
        description: 'Tất ngắn chống trơn Grip Socks, silicon dưới đế, mang trong giày không bị trượt.',
        stock_quantity: 100, average_rating: 4.7, review_count: 198, view_count: 680, tags: ['hot', 'new'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Đai bảo vệ đầu gối thể thao', slug: 'dai-bao-ve-dau-goi', base_price: 150000, shop: shop._id, category: categories[3]._id, sku: 'BQ-DG-01',
        description: 'Đai bảo vệ đầu gối có lò xo hỗ trợ, phòng tránh chấn thương dây chằng khi đá bóng.',
        stock_quantity: 70, average_rating: 4.5, review_count: 112, view_count: 430, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=400&fit=crop', sort_order: 1 }]
      },

      // ═══════════════════════════════════════════════════
      // ═══ QUẦN ÁO ĐÁ BÓNG (7 sản phẩm) ════════════
      // ═══════════════════════════════════════════════════
      {
        name: 'Áo đấu Real Madrid 2024/25 Home', slug: 'ao-dau-real-madrid-home', base_price: 350000, shop: shop._id, category: categories[4]._id, sku: 'QA-RM-01',
        description: 'Áo đấu Real Madrid 2024/25 sân nhà, chất vải Dri-FIT thoáng mát, thêu logo chuẩn.',
        variants: [{ variant_name: 'Size', variant_value: 'M', stock_quantity: 25 }, { variant_name: 'Size', variant_value: 'L', stock_quantity: 30 }, { variant_name: 'Size', variant_value: 'XL', stock_quantity: 20 }],
        average_rating: 4.7, review_count: 345, view_count: 1500, tags: ['hot', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Áo đấu Barcelona 2024/25 Away', slug: 'ao-dau-barca-away', base_price: 350000, shop: shop._id, category: categories[4]._id, sku: 'QA-FCB-01',
        description: 'Áo đấu Barcelona 2024/25 sân khách, thiết kế mới lạ, vải polyester cao cấp thấm hút mồ hôi.',
        variants: [{ variant_name: 'Size', variant_value: 'M', stock_quantity: 20 }, { variant_name: 'Size', variant_value: 'L', stock_quantity: 25 }],
        average_rating: 4.6, review_count: 298, view_count: 1300, tags: ['hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Áo đấu Đội tuyển Việt Nam 2024', slug: 'ao-dau-tuyen-viet-nam', base_price: 280000, shop: shop._id, category: categories[4]._id, sku: 'QA-VN-01',
        description: 'Áo đấu chính thức ĐTVN 2024, Grand Sport, màu đỏ truyền thống, in tên và số tùy chọn.',
        variants: [{ variant_name: 'Size', variant_value: 'M', stock_quantity: 40 }, { variant_name: 'Size', variant_value: 'L', stock_quantity: 35 }, { variant_name: 'Size', variant_value: 'XL', stock_quantity: 25 }],
        average_rating: 4.8, review_count: 567, view_count: 2800, tags: ['featured', 'new'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Quần short đá bóng Nike Dri-FIT', slug: 'quan-short-nike-dri-fit', base_price: 180000, shop: shop._id, category: categories[4]._id, sku: 'QA-QS-01',
        description: 'Quần short đá bóng Nike Dri-FIT, thoải mái vận động, túi dây kéo, chất vải mau khô.',
        variants: [{ variant_name: 'Size', variant_value: 'M', stock_quantity: 30 }, { variant_name: 'Size', variant_value: 'L', stock_quantity: 35 }],
        average_rating: 4.5, review_count: 234, view_count: 980, tags: ['sale'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Bộ đồ tập luyện bóng đá Adidas', slug: 'bo-do-tap-luyen-adidas', base_price: 450000, shop: shop._id, category: categories[4]._id, sku: 'QA-BDT-01',
        description: 'Bộ đồ tập luyện Adidas Tiro 24 (áo dài tay + quần dài), co giãn 4 chiều, thoáng mát.',
        variants: [{ variant_name: 'Size', variant_value: 'M', stock_quantity: 15 }, { variant_name: 'Size', variant_value: 'L', stock_quantity: 20 }, { variant_name: 'Size', variant_value: 'XL', stock_quantity: 12 }],
        average_rating: 4.6, review_count: 156, view_count: 720, tags: ['new', 'featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Áo thủ môn tay dài có đệm', slug: 'ao-thu-mon-tay-dai', base_price: 320000, shop: shop._id, category: categories[4]._id, sku: 'QA-TM-01',
        description: 'Áo thủ môn tay dài có đệm khuỷu tay, chất vải chống mài mòn, nhiều màu lựa chọn.',
        variants: [{ variant_name: 'Size', variant_value: 'M', stock_quantity: 12 }, { variant_name: 'Size', variant_value: 'L', stock_quantity: 15 }],
        average_rating: 4.4, review_count: 89, view_count: 430, tags: ['featured'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=400&fit=crop', sort_order: 1 }]
      },
      {
        name: 'Găng tay thủ môn Adidas Predator', slug: 'gang-tay-thu-mon-predator', base_price: 550000, shop: shop._id, category: categories[4]._id, sku: 'QA-GT-01',
        description: 'Găng tay thủ môn Adidas Predator Pro, mặt latex URG 2.0, bám bóng tuyệt vời, dây cuốn cổ tay.',
        variants: [{ variant_name: 'Size', variant_value: '8', stock_quantity: 10 }, { variant_name: 'Size', variant_value: '9', stock_quantity: 12 }, { variant_name: 'Size', variant_value: '10', stock_quantity: 8 }],
        average_rating: 4.7, review_count: 123, view_count: 560, tags: ['new', 'hot'],
        media: [{ media_type: 'image', media_url: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400&h=400&fit=crop', sort_order: 1 }]
      }
    ]);

    // 6. Seed Campaigns & Coupons
    const campaign = await Campaign.create({
      name: 'Mùa giải mới 2024/25', slug: 'mua-giai-moi', start_at: new Date(), end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      type: 'discount', value: 15
    });
    const coupons = await Coupon.insertMany([
      { code: 'BOOT10', type: 'percent', value: 10, campaign: campaign._id, status: 'active' },
      { code: 'NEWSEASON', type: 'fixed_amount', value: 100000, min_order_total: 500000, status: 'active' },
      { code: 'FREESHIP', type: 'fixed_amount', value: 30000, status: 'active' },
      { code: 'GOAL20', type: 'percent', value: 20, status: 'active' },
      { code: 'FIRSTKICK', type: 'percent', value: 15, status: 'active' }
    ]);

    // 7. Seed Orders
    await Order.insertMany([
      {
        order_code: 'ORD001', customer: users[2]._id, shipper: users[4]._id, status: 'completed', total_base: 6500000, shipping_fee: 30000, total_final: 6530000, payment_status: 'paid',
        items: [{ product: products[0]._id, quantity: 1, price_at_buy: 6500000 }],
        shipping_address: '123 Nguyễn Huệ, Q1', shipping_phone: '0901234567',
        history: [{ status: 'pending', note: 'Đơn mới' }, { status: 'completed', note: 'Giao thành công' }]
      },
      { order_code: 'ORD002', customer: users[3]._id, status: 'pending', total_base: 2800000, total_final: 2830000, shipping_fee: 30000, items: [{ product: products[2]._id, quantity: 1, price_at_buy: 2800000 }], shipping_address: '456 Lê Lợi, Q3', shipping_phone: '0987654321' },
      { order_code: 'ORD003', customer: users[2]._id, status: 'shipping', total_base: 250000, total_final: 280000, shipping_fee: 30000, items: [{ product: products[30]._id, quantity: 1, price_at_buy: 250000 }], shipping_address: '123 Nguyễn Huệ, Q1', shipping_phone: '0901234567' },
    ]);

    // 8. Seed Carts
    await Cart.insertMany(users.filter(u => u.role === 'customer').map(u => ({
      user: u._id, items: [{ product: products[0]._id, quantity: 1 }]
    })));

    // 9. Seed Notifications
    await Notification.insertMany([
      { user: users[2]._id, title: 'Đơn hàng đã giao', content: 'Đơn hàng ORD001 đã hoàn tất', type: 'order' },
      { user: users[3]._id, title: 'Khuyến mãi mùa giải mới', content: 'Nhập mã BOOT10 để giảm 10%!', type: 'promotion' },
      { user: users[2]._id, title: 'Flash Sale giày đá bóng', content: 'Giảm đến 50% các mẫu giày hot', type: 'promotion' },
    ]);

    // 10. Seed CoinTransactions
    await CoinTransaction.insertMany([
      { user: users[2]._id, amount: 100, type: 'earn', balance_before: 400, balance_after: 500, description: 'Tích xu từ đơn ORD001' },
      { user: users[3]._id, amount: 50, type: 'earn', balance_before: 150, balance_after: 200, description: 'Thưởng đăng ký' },
    ]);

    console.log(`🚀 SEEDING COMPLETED! ${products.length} products created.`);
    process.exit();
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedData();

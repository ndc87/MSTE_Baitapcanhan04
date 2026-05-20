const User = require('../models/User');
const Product = require('../models/Product');
const response = require('../utils/response');

// ── ADDRESS MANAGEMENT ──

exports.addAddress = async (req, res) => {
  try {
    const { label, recipient_name, recipient_phone, street_address } = req.body;

    if (!recipient_name || !recipient_phone || !street_address) {
      return response.error(res, {
        statusCode: 400,
        message: 'Vui lòng điền đầy đủ thông tin địa chỉ'
      });
    }

    const user = await User.findById(req.user._id);
    user.addresses.push({ label, recipient_name, recipient_phone, street_address });
    await user.save();

    return response.success(res, {
      message: 'Thêm địa chỉ thành công',
      data: user.addresses
    });
  } catch (error) {
    return response.error(res, { statusCode: 500, message: 'Lỗi server', errors: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { label, recipient_name, recipient_phone, street_address } = req.body;

    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(addressId);
    if (!addr) {
      return response.error(res, { statusCode: 404, message: 'Không tìm thấy địa chỉ' });
    }

    if (label) addr.label = label;
    if (recipient_name) addr.recipient_name = recipient_name;
    if (recipient_phone) addr.recipient_phone = recipient_phone;
    if (street_address) addr.street_address = street_address;
    await user.save();

    return response.success(res, {
      message: 'Cập nhật địa chỉ thành công',
      data: user.addresses
    });
  } catch (error) {
    return response.error(res, { statusCode: 500, message: 'Lỗi server', errors: error.message });
  }
};

exports.removeAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    user.addresses.pull({ _id: addressId });
    await user.save();

    return response.success(res, {
      message: 'Xóa địa chỉ thành công',
      data: user.addresses
    });
  } catch (error) {
    return response.error(res, { statusCode: 500, message: 'Lỗi server', errors: error.message });
  }
};

// ── WISHLIST MANAGEMENT ──

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    return response.success(res, {
      message: 'Lấy danh sách yêu thích thành công',
      data: user.wishlist || []
    });
  } catch (error) {
    return response.error(res, { statusCode: 500, message: 'Lỗi server', errors: error.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return response.error(res, { statusCode: 404, message: 'Không tìm thấy sản phẩm' });
    }

    const user = await User.findById(req.user._id);
    const index = user.wishlist.indexOf(productId);

    let action;
    if (index > -1) {
      user.wishlist.splice(index, 1);
      action = 'removed';
    } else {
      user.wishlist.push(productId);
      action = 'added';
    }
    await user.save();

    return response.success(res, {
      message: action === 'added' ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích',
      data: { action, wishlist: user.wishlist }
    });
  } catch (error) {
    return response.error(res, { statusCode: 500, message: 'Lỗi server', errors: error.message });
  }
};

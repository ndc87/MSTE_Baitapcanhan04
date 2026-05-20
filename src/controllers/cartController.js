const Cart = require('../models/Cart');
const Product = require('../models/Product');
const response = require('../utils/response');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    return response.success(res, {
      message: 'Lấy giỏ hàng thành công',
      data: cart
    });
  } catch (error) {
    return response.error(res, {
      statusCode: 500,
      message: 'Lỗi server khi lấy giỏ hàng',
      errors: error.message
    });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variantId, note } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return response.error(res, {
        statusCode: 404,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId && p.variant_id?.toString() === variantId);

    if (itemIndex > -1) {
      // Item exists, update quantity
      cart.items[itemIndex].quantity += Number(quantity);
      if (note) cart.items[itemIndex].note = note;
    } else {
      // New item
      cart.items.push({ product: productId, variant_id: variantId, quantity, note });
    }

    await cart.save();
    
    // Populate to return full data
    cart = await cart.populate('items.product');

    return response.success(res, {
      message: 'Thêm vào giỏ hàng thành công',
      data: cart
    });
  } catch (error) {
    return response.error(res, {
      statusCode: 500,
      message: 'Lỗi server khi thêm vào giỏ hàng',
      errors: error.message
    });
  }
};

// Update item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity < 1) {
      return response.error(res, {
        statusCode: 400,
        message: 'Số lượng phải lớn hơn 0'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return response.error(res, {
        statusCode: 404,
        message: 'Giỏ hàng không tồn tại'
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return response.error(res, {
        statusCode: 404,
        message: 'Sản phẩm không có trong giỏ hàng'
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    return response.success(res, {
      message: 'Cập nhật số lượng thành công',
      data: cart
    });
  } catch (error) {
    return response.error(res, {
      statusCode: 500,
      message: 'Lỗi server khi cập nhật giỏ hàng',
      errors: error.message
    });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return response.error(res, {
        statusCode: 404,
        message: 'Giỏ hàng không tồn tại'
      });
    }

    cart.items.pull({ _id: itemId });
    await cart.save();
    await cart.populate('items.product');

    return response.success(res, {
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
      data: cart
    });
  } catch (error) {
    return response.error(res, {
      statusCode: 500,
      message: 'Lỗi server khi xóa sản phẩm',
      errors: error.message
    });
  }
};

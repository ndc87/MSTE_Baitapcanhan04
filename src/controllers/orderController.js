const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const response = require('../utils/response');
const { v4: uuidv4 } = require('uuid');

// Create order from cart (Checkout)
exports.checkout = async (req, res) => {
  try {
    const { payment_method = 'cod', shipping_address, shipping_phone } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return response.error(res, {
        statusCode: 400,
        message: 'Giỏ hàng trống'
      });
    }

    if (!shipping_address || !shipping_phone) {
      return response.error(res, {
        statusCode: 400,
        message: 'Vui lòng cung cấp địa chỉ và số điện thoại giao hàng'
      });
    }

    let total_base = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product) continue;
      // Use base_price from Product model
      const price = item.product.base_price || 0; 
      const itemTotal = price * item.quantity;
      total_base += itemTotal;

      orderItems.push({
        product: item.product._id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price_at_buy: price
      });
    }

    const shipping_fee = 30000; // Example flat fee
    const total_final = total_base + shipping_fee;

    const newOrder = new Order({
      order_code: uuidv4().split('-')[0].toUpperCase(), // Short code for UI
      customer: req.user._id,
      status: 'pending',
      total_base,
      shipping_fee,
      total_final,
      payment_status: payment_method === 'cod' ? 'pending' : 'pending', // e-wallet will be updated later
      payment_method,
      shipping_address,
      shipping_phone,
      items: orderItems,
      history: [{
        status: 'pending',
        note: 'Đơn hàng mới tạo',
        updated_by: req.user._id
      }]
    });

    await newOrder.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    return response.success(res, {
      message: 'Đặt hàng thành công',
      data: newOrder
    });

  } catch (error) {
    return response.error(res, {
      statusCode: 500,
      message: 'Lỗi server khi đặt hàng',
      errors: error.message
    });
  }
};

// Get order history for current user
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name media base_price'); 

    return response.success(res, {
      message: 'Lấy lịch sử đơn hàng thành công',
      data: orders
    });
  } catch (error) {
    return response.error(res, {
      statusCode: 500,
      message: 'Lỗi server khi lấy lịch sử đơn hàng',
      errors: error.message
    });
  }
};

// Get order details
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.user._id })
      .populate('items.product');

    if (!order) {
      return response.error(res, {
        statusCode: 404,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    return response.success(res, {
      message: 'Lấy chi tiết đơn hàng thành công',
      data: order
    });
  } catch (error) {
    return response.error(res, {
      statusCode: 500,
      message: 'Lỗi server',
      errors: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });

    if (!order) {
      return response.error(res, {
        statusCode: 404,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Check time limit (30 minutes)
    const orderTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const diffMinutes = Math.floor((currentTime - orderTime) / (1000 * 60));

    if (diffMinutes > 30 && order.status !== 'preparing') {
      return response.error(res, {
        statusCode: 400,
        message: 'Chỉ có thể hủy đơn hàng trong vòng 30 phút đầu'
      });
    }

    if (order.status === 'pending' || order.status === 'confirmed') {
      order.status = 'cancelled';
      order.cancellation = {
        user: req.user._id,
        reason: reason || 'Người dùng hủy',
        cancelled_at: new Date()
      };
      order.history.push({
        status: 'cancelled',
        note: reason || 'Người dùng hủy',
        updated_by: req.user._id
      });
    } else if (order.status === 'preparing') {
      order.status = 'cancel_requested';
      order.history.push({
        status: 'cancel_requested',
        note: reason || 'Người dùng yêu cầu hủy',
        updated_by: req.user._id
      });
    } else {
      return response.error(res, {
        statusCode: 400,
        message: 'Không thể hủy đơn hàng ở trạng thái hiện tại'
      });
    }

    await order.save();

    return response.success(res, {
      message: order.status === 'cancelled' ? 'Hủy đơn hàng thành công' : 'Đã gửi yêu cầu hủy đơn cho shop',
      data: order
    });
  } catch (error) {
    return response.error(res, {
      statusCode: 500,
      message: 'Lỗi server khi hủy đơn hàng',
      errors: error.message
    });
  }
};

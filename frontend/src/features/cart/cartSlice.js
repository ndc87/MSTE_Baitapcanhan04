import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const response = await api.get('/cart');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (cartData, thunkAPI) => {
  try {
    const response = await api.post('/cart/add', cartData);
    toast.success('Thêm vào giỏ hàng thành công');
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Lỗi thêm vào giỏ hàng');
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ itemId, quantity }, thunkAPI) => {
  try {
    const response = await api.put(`/cart/update/${itemId}`, { quantity });
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Lỗi cập nhật giỏ hàng');
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (itemId, thunkAPI) => {
  try {
    const response = await api.delete(`/cart/remove/${itemId}`);
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

const initialState = {
  dbCart: null,    // Cart object from DB
  items: [],       // Mapped array of items for UI
  isOpen: false,
  isLoading: false,
};

const mapCartItems = (dbCart) => {
  if (!dbCart || !dbCart.items) return [];
  return dbCart.items.map(item => ({
    _id: item._id, // cart item ID
    id: item.product?._id, // product ID
    title: item.product?.name || 'Sản phẩm',
    price: item.product?.base_price || 0,
    images: item.product?.media?.map(m => m.media_url) || [],
    quantity: item.quantity,
    stock: item.product?.stock || 99,
  }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.dbCart = null;
      state.items = [];
    },
    openCart(state) { state.isOpen = true; },
    closeCart(state) { state.isOpen = false; },
    toggleCart(state) { state.isOpen = !state.isOpen; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dbCart = action.payload;
        state.items = mapCartItems(action.payload);
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.dbCart = action.payload;
        state.items = mapCartItems(action.payload);
        state.isOpen = true; // open drawer when add
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.dbCart = action.payload;
        state.items = mapCartItems(action.payload);
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.dbCart = action.payload;
        state.items = mapCartItems(action.payload);
      });
  }
});

export const selectCartItems  = (state) => state.cart.items;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectCartCount  = (state) => state.cart.items.reduce((s, i) => s + i.quantity, 0);
export const selectCartTotal  = (state) => state.cart.items.reduce((s, i) => s + i.price * i.quantity, 0);

export const { clearCartState, openCart, closeCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer;

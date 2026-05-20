import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api/cart';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (cartData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/add`, cartData, config);
    toast.success('Thêm vào giỏ hàng thành công');
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Lỗi thêm vào giỏ hàng');
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ itemId, quantity }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/update/${itemId}`, { quantity }, config);
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Lỗi cập nhật giỏ hàng');
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (itemId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}/remove/${itemId}`, config);
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    isLoading: false,
    isError: false,
    message: ''
  },
  reducers: {
    clearCartState: (state) => {
      state.cart = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  }
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;

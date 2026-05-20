import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import toast from 'react-hot-toast';
import { clearCartState } from '../features/cart/cartSlice';

export const checkout = createAsyncThunk('orders/checkout', async (orderData, thunkAPI) => {
  try {
    const response = await api.post('/orders/checkout', orderData);
    toast.success('Đặt hàng thành công!');
    thunkAPI.dispatch(clearCartState());
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Lỗi đặt hàng');
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, thunkAPI) => {
  try {
    const response = await api.get('/orders');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const cancelOrder = createAsyncThunk('orders/cancelOrder', async ({ id, reason }, thunkAPI) => {
  try {
    const response = await api.post(`/orders/${id}/cancel`, { reason });
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Lỗi hủy đơn hàng');
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    isLoading: false,
    isError: false,
    message: ''
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => { state.isLoading = true; })
      .addCase(checkout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(checkout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => { state.isLoading = true; })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  }
});

export default orderSlice.reducer;

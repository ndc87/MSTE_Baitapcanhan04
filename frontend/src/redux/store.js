import { configureStore } from '@reduxjs/toolkit';
import authReducer     from './authSlice';
import cartReducer     from '../features/cart/cartSlice';
import productsReducer from '../features/products/productsSlice';
import orderReducer    from './orderSlice';

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    cart:     cartReducer,
    products: productsReducer,
    orders:   orderReducer,
  },
});

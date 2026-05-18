import { createSlice } from '@reduxjs/toolkit';
import { MOCK_PRODUCTS } from '../../mock/products';

const initialState = {
  items: MOCK_PRODUCTS,
  filtered: MOCK_PRODUCTS,
  isLoading: false,
  error: null,
  currentProduct: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action) {
      state.items = action.payload;
    },
    setCurrentProduct(state, action) {
      state.currentProduct = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearCurrentProduct(state) {
      state.currentProduct = null;
    },
  },
});

// Selectors
export const selectAllProducts    = (state) => state.products.items;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsLoading= (state) => state.products.isLoading;

export const {
  setProducts,
  setCurrentProduct,
  setLoading,
  setError,
  clearCurrentProduct,
} = productsSlice.actions;

export default productsSlice.reducer;

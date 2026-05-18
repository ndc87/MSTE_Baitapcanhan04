import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],      // [{ id, slug, title, price, images, quantity, stock, ... }]
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const incoming = action.payload;
      const existing = state.items.find((i) => i.id === incoming.id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + (incoming.quantity ?? 1), incoming.stock);
      } else {
        state.items.push({ ...incoming, quantity: incoming.quantity ?? 1 });
      }
      state.isOpen = true; // auto-open drawer on add
    },
    removeItem(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.quantity = Math.max(1, Math.min(quantity, item.stock));
    },
    clearCart(state) {
      state.items = [];
    },
    openCart(state) {
      state.isOpen = true;
    },
    closeCart(state) {
      state.isOpen = false;
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
  },
});

// Selectors
export const selectCartItems  = (state) => state.cart.items;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectCartCount  = (state) => state.cart.items.reduce((s, i) => s + i.quantity, 0);
export const selectCartTotal  = (state) => state.cart.items.reduce((s, i) => s + i.price * i.quantity, 0);

export const { addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer;

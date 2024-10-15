import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      cartItems: JSON.parse(localStorage.getItem('cartItems')) || [], // Load from local storage
    };
  },
  mutations: {
    addToCart(state, item) {
      const existingItem = state.cartItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity; // Update quantity if item already exists
      } else {
        state.cartItems.push(item); // Add new item with quantity
      }
      this.commit('SAVE_CART_ITEMS'); // Save to local storage
    },
    increaseQuantity(state, itemId) {
      const item = state.cartItems.find(cartItem => cartItem.id === itemId);
      if (item) {
        item.quantity += 1;
        this.commit('SAVE_CART_ITEMS'); // Save to local storage
      }
    },
    decreaseQuantity(state, itemId) {
      const item = state.cartItems.find(cartItem => cartItem.id === itemId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item && item.quantity === 1) {
        state.cartItems = state.cartItems.filter(cartItem => cartItem.id !== itemId); // Remove item if quantity reaches 0
      }
      this.commit('SAVE_CART_ITEMS'); // Save to local storage
    },
    removeFromCart(state, itemId) {
      state.cartItems = state.cartItems.filter(item => item.id !== itemId);
      this.commit('SAVE_CART_ITEMS'); // Save updated cart to local storage
    },
    SAVE_CART_ITEMS(state) {
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems)); // Save to local storage
    }
  },
  actions: {
    addtocart({ commit }, item) {
      commit('addToCart', item);
    },
    increaseQuantity({ commit }, itemId) {
      commit('increaseQuantity', itemId);
    },
    decreaseQuantity({ commit }, itemId) {
      commit('decreaseQuantity', itemId);
    },
    removeFromCart({ commit }, itemId) {
      commit('removeFromCart', itemId);
    }
  },
  getters: {
    cartItems: state => state.cartItems,
    totalPrice: state => {
      return state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    }
  }
});

export default store;

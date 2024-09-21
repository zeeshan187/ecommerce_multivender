import React, { createContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const item = action.payload;
      const existingItemIndex = state.items.findIndex(i => i.id === item.id);

      if (existingItemIndex >= 0) {
        const updatedItems = state.items.map((i, index) =>
          index === existingItemIndex ? { ...i, quantity: i.quantity + 1 } : i
        );
        return { ...state, items: updatedItems };
      }

      return { ...state, items: [...state.items, { ...item, quantity: 1 }] };
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  return (
    <CartContext.Provider value={{ items: state.items, addItem }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

import React, { createContext, useReducer } from 'react';
import cartReducer from './cartReducer';

// Cart-Context
const cartContext = createContext();

// Initial State
const initialState = {
    cartItems: []
};

// Cart-Provider Component
const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Dispatched Actions
    const addItem = (item) => {
        return dispatch({
            type: 'ADD_TO_CART',
            payload: { item: { ...item, quantity: 1 } }
        });
    };

    const removeItem = (itemId) => {
        return dispatch({
            type: 'REMOVE_FROM_CART',
            payload: { itemId }
        });
    };

    const incrementItem = (itemId) => {
        dispatch({
            type: 'INCREMENT_ITEM',
            payload: { itemId }
        });

        const updatedItem = state.cartItems.find(item => item.id === itemId);
        return updatedItem.quantity;
    };

    const decrementItem = (itemId) => {
        dispatch({
            type: 'DECREMENT_ITEM',
            payload: { itemId }
        });

        const updatedItem = state.cartItems.find(item => item.id === itemId);
        return updatedItem.quantity;
    };

    // Context values
    const values = {
        ...state,
        addItem,
        removeItem,
        incrementItem,
        decrementItem
    };

    return (
        <cartContext.Provider value={values}>
            {children}
        </cartContext.Provider>
    );
};

export default cartContext;
export { CartProvider };

// src/frontend/Context/CartContext.jsx
//import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = item => {
        setCartItems(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prev, item];
        });
    };

    const updateQuantity = (id, qty) => {
        setCartItems(prev =>
            prev.map(i => (i.id === id ? { ...i, quantity: Math.max(qty, 1) } : i))
        );
    };

    const removeFromCart = id => {
        setCartItems(prev => prev.filter(i => i.id !== id));
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}
CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
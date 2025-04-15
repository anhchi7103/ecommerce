import { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300; index++){
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    
    const [cartItems, setCartItems] = useState({});
    const [all_products, setAll_products] = useState([]);

    useEffect(() => {
        fetch("http://localhost:4000/get-allproducts").then((response) => response.json()).then((data) => setAll_products(data));     
    }, [])

    const addToCart = (product, quantity = 1) => {
        setCartItems((prev) => ({
            ...prev,
            [product.id]: {
                ...product,
                quantity: (prev[product.id]?.quantity || 0) + quantity,
            },
        }));
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev };
            if (updatedCart[itemId]) {
                const item = { ...updatedCart[itemId] }; 
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    updatedCart[itemId] = item;
                } else {
                    delete updatedCart[itemId];
                }
            }
            return updatedCart;
        });
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const item = cartItems[itemId];
            totalAmount += item.price * item.quantity;
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const itemId in cartItems) {
            const item = cartItems[itemId];
            if (item.quantity > 0) {
                totalItem += item.quantity;
            }
        }
        return totalItem;
    };

    const contextValue = { all_products, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
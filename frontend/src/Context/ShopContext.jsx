import { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const [all_products, setAll_products] = useState([]);

    //fetch products
    useEffect(() => {
        fetch("http://localhost:4000/get-allproducts").then((response) => response.json()).then((data) => setAll_products(data));
    }, [])

    //fetch cart items
    useEffect(() => {
        const userId = '67fbdc2a945d615f6ff71505'; // static user for now

        const fetchCart = async () => {
            try {
                const res = await fetch(`http://localhost:4000/cart/${userId}`);
                const data = await res.json();

                if (data.success) {
                    const cartObj = {};
                    data.cart.forEach(item => {
                        cartObj[item.productId] = {
                            productId: item.productId,
                            quantity: item.quantity
                        };
                    });
                    setCartItems(cartObj);
                }
            } catch (err) {
                console.error('Error fetching cart:', err);
            }
        };

        fetchCart();
    }, []);


    const addToCart = async (product, quantity = 1) => {
        const userId = "67fbdc2a945d615f6ff71505"; // Replace with the actual logged-in user's ID or token-based ID

        await fetch("http://localhost:4000/cart/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId,
                productId: product._id,
                quantity
            })
        });

        // Update local state only if needed
        setCartItems((prev) => ({
            ...prev,
            [product._id]: {
                ...product,
                quantity: (prev[product._id]?.quantity || 0) + quantity,
            },
        }));
    };


    const removeFromCart = async (itemId) => {
        const userId = "67fbdc2a945d615f6ff71505"; // replace with dynamic user later

        try {
            const res = await fetch("http://localhost:4000/cart/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, productId: itemId }),
            });

            if (!res.ok) {
                console.error("Failed to update cart");
                return;
            }

            const data = await res.json();
            const { productId, quantity } = data.updated;

            setCartItems((prevCart) => {
                const updatedCart = { ...prevCart };

                if (quantity <= 0) {
                    // Remove item if quantity is 0
                    delete updatedCart[productId];
                } else {
                    // Update quantity
                    updatedCart[productId] = {
                        ...updatedCart[productId],
                        quantity,
                    };
                }

                return updatedCart;
            });

        } catch (err) {
            console.error("Error updating cart:", err);
        }
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
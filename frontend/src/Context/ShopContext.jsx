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
    const [triggerRender, setTriggerRender] = useState(false);

    //fetch products
    useEffect(() => {
        fetch("http://localhost:4000/get-allproducts").then((response) => response.json()).then((data) => setAll_products(data));
    }, [])

    //fetch cart items
    useEffect(() => {
        // const userId = '67fbdc2a945d615f6ff71505'; // static user for now

        const userId = localStorage.getItem("UserID"); // get userId dynamically

        if (!userId) {
            console.error("No userId found in localStorage");
            return;
        }

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
        const userId = localStorage.getItem("UserID"); // get userId dynamically

        if (!userId) {
            console.error("No userId found in localStorage");
            return;
        }
        try {
            const res = await fetch("http://localhost:4000/cart/add", {
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

            if (!res.ok) {
                console.error("Failed to add to cart");
                return;
            }

            const data = await res.json();
            const updatedItem = data.updated;

            // setCartItems((prev) => {
            //     const updatedCart = { ...prev };
            //     const fullProduct = all_products.find(p => p._id === updatedItem.productId) || product;

            //     updatedCart[updatedItem.productId] = {
            //         ...fullProduct,
            //         quantity: updatedItem.quantity,
            //     };

            //     return updatedCart;
            // });

            setCartItems((prev) => ({
                ...prev,
                [updatedItem.productId]: {
                    ...updatedItem
                }
            }));

        } catch (err) {
            console.error("Error adding to cart:", err);
        }
    };

    const removeFromCart = async (itemId) => {
        const userId = localStorage.getItem("UserID"); // get userId dynamically

        if (!userId) {
            console.error("No userId found in localStorage");
            return;
        }
        
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

            // const data = await res.json();
            // const { productId, quantity } = data.updated;
            const data = await res.json();

            if (!data.updated) {
                // Assume product was removed entirely
                setCartItems((prevCart) => {
                    const updatedCart = { ...prevCart };
                    delete updatedCart[itemId];
                    return updatedCart;
                });
                return;
            }

            const { productId, quantity } = data.updated;

            setCartItems((prevCart) => {
                const updatedCart = { ...prevCart };

                if (quantity <= 0) {
                    delete updatedCart[productId];
                } else {
                    updatedCart[productId] = {
                        ...updatedCart[productId],
                        quantity,
                    };
                }

                return updatedCart;
            });

            // setCartItems((prevCart) => {
            //     const { [productId]: _, ...rest } = prevCart; // this removes productId
            //     if (quantity <= 0) {
            //         return { ...rest }; // removed product entirely
            //     } else {
            //         return {
            //             ...prevCart,
            //             [productId]: {
            //                 ...prevCart[productId],
            //                 quantity,
            //             },
            //         };
            //     }
            // });

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

    const contextValue = { all_products, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems, triggerRender, setTriggerRender };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
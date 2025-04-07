import { createContext, useState } from "react";
import all_products from "../assets/all_products"

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const contextValue = { all_products };
    const [cartItems, setCartItems] = useState({});

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
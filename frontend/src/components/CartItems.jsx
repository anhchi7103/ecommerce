import { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext';
import { TbTrash } from 'react-icons/tb';
import { NavLink } from 'react-router-dom';


const CartItems = () => {
    const { cartItems, all_products, removeFromCart} = useContext(ShopContext);

    const mergedCartItems = Object.values(cartItems).map((cartItem) => {
        const product = all_products.find(p => String(p._id) === cartItem.productId);
        if (!product) return null;
        return {
            ...product,
            quantity: cartItem.quantity
        };
    }).filter(Boolean); // remove nulls


    const totalAmount = mergedCartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    console.log("cartItems state:", cartItems);
    console.log("mergedCartItems:", mergedCartItems);

    return (
        <section className='max_padd_container pt-28'>
            <table className='w-full mx-auto'>
                <thead>
                    <tr className='bg-slate-900/10 regular-18 sm:regular-22 text-start py-12'>
                        <th className='p-1 py-2'> Picture </th>
                        <th className='p-1 py-2'> Product </th>
                        <th className='p-1 py-2'> Unit Price </th>
                        <th className='p-1 py-2'> Quantity </th>
                        <th className='p-1 py-2'> Total </th>
                        <th className='p-1 py-2'> Remove </th>
                    </tr>
                </thead>
                {/* cart */}
                <tbody>
                    {mergedCartItems.map((item) => (
                        <tr key={item._id} className='border-b border-slate-900/20 p-6 medium-14 text-center'>
                            <td className='flexCenter'>
                                <img src={item.images} alt="prdctImg" height={43} width={43} className='rounded-lg ring-1 ring-slate-900/5 my-1' />
                            </td>
                            <td><div className='line-clamp-3'>{item.name}</div></td>
                            <td>{item.price}</td>
                            <td className='w-16 h-16'>{item.quantity}</td>
                            <td>{item.price * item.quantity}</td>
                            <td>
                                <div className='bold-22 pl-14'>
                                    <TbTrash onClick={() => removeFromCart(item._id)} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* receipt */}
            <div className='flexCenter'>
                <div className='flexCenter flex-col gap-20 my-16 p-8 md:flex-row rounded-md bg-white w-full max-w-[500px]'>
                    <div className='flex flex-col gap-10'>
                        <h4 className='bold-20'>Receipt</h4>
                        <div className='flex-row w-60'>
                            <div className='flexBetween py-4'>
                                <h4 className='bold-18'>Subtotal:</h4>
                                <h4 className='bold-18'>{totalAmount}</h4>
                            </div>
                            <hr />
                            <div className='flexBetween py-4'>
                                <h4 className='medium-16'>Shipping Fee:</h4>
                                <h4 className='text-gray-30 font-semibold'>Free</h4>
                            </div>
                            <hr />
                        </div>
                        <NavLink to="/checkout" className='btn_dark_rounded w-44 flexCenter'>Checkout</NavLink>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CartItems
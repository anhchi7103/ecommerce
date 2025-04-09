import product_rt_1 from '../assets/product_rt_1.png'
import product_rt_2 from '../assets/product_rt_2.png'
import product_rt_3 from '../assets/product_rt_3.png'
import product_rt_4 from '../assets/product_rt_4.png'
import { MdStar } from 'react-icons/md'
import { FaHeart } from 'react-icons/fa'
import { useContext, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'

const ProductDisplay = (props) => {

  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity); // Truyền sản phẩm cùng số lượng tùy chỉnh
    alert(`${quantity} ${product.name} added to cart!`);
    console.log(product);
  };

  return (
    <section>
      <div className='flex flex-col gap-14 xl:flex-row'>
        {/*left side */}
        <div className='flex gap-x-2 xl:flex-1'>
          <div className='flex flex-col gap-[7px] flex-wrap'>
            <img src={product_rt_1} alt="prdctImg" className='max-h-[99px]' />
            <img src={product_rt_2} alt="prdctImg" className='max-h-[99px]' />
            <img src={product_rt_3} alt="prdctImg" className='max-h-[99px]' />
            <img src={product_rt_4} alt="prdctImg" className='max-h-[99px]' />
          </div>

          <div>
            <img src={product.image} alt="" />
          </div>
        </div>
        {/* right side */}
        <div className='flex-col flex xl:flex-[1.7]'>
          <h3 className='h3'>{product.name}</h3>
          <div className='flex gap-x-2 text-secondary medium-22'>
            <MdStar />
            <MdStar />
            <MdStar />
            <MdStar />
            <p>(111)</p>
          </div>
          <div className='flex gap-x-6 medium-20 my-4'>
            <div className='line-through'>{product.old_price}</div>
            <div className='text-secondary'>{product.new_price}</div>
          </div>
          <div className='mb-4'>
            <h4 className='bold-16'>Quantity</h4>
            <div className='flex gap-3 my-3'>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="h-10 w-20 pl-5 bg-white border rounded-xl text-secondary"
              />
            </div>
            <div className='flex flex-col gap-y-3 mb-4 max-w-[555px]'>
              <div className='flex flex-row'>
                <button onClick={handleAddToCart} className='btn_dark_outline !rounded-none uppercase reguar-14 tracking-widest xl:flex-1'>Add to cart</button>
                <button className='btn_secondary_rounded !rounded-none'> {<FaHeart />} </button>
              </div>
              <button className='btn_dark_rounded !rounded-none uppercase reguar-14 tracking-widest'>Buy now</button>
            </div>
            <p><span className='medium-16 text-tertiary'>Category: </span> Women | Jacket | Winter</p>
            <p><span className='medium-16 text-tertiary'>Tags: </span> Modern | Latest </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDisplay
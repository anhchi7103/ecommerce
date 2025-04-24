import React from 'react'
import { Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'

const Item = ({_id, name, images, price}) => {
  return (
    <div className='rounded-x1 overflow-hidden shadow-lg'>
        <div className='relative flexCenter group overflow-hidden transition-all duration-100'>
            <Link to={`/product/${_id}`} className='h-12 w-12 bg-white rounded-full flexCenter absolute top-1/2 bottom-1/2 !py-2 z-20 scale-0 group-hover:scale-100 transition-all duration-700'> <FaSearch className='scale-125 hover:rotate-90 hover:scale-125 transition-all duration-200' /> </Link>
            <img onClick={window.scrollTo(0, 0)} src={images} alt="productImg" className='w-full block object-cover group-hover:scale-110 transition-all duration-1000'/>
        </div>
        <div className='p-4 overflow-hidden'>
            <h4 className='my-[6px] medium-16 line-clamp-2 text-gray-30'>{name}</h4>
            <div className='flex gap-5'>
                <div className='bold-16'>${price}</div>
                {/* <div className='text-secondary bold-16 line-through'>{old_price}</div> */}
            </div>
        </div>
    </div>
  )
}

export default Item
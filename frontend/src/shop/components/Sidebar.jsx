import React from 'react'
import {Link} from 'react-router-dom'
import addProduct from '../../assets/addproduct.png'
import listProduct from '../../assets/listproduct.png'

const Sidebar = () => {
    return (
        <div className='p-8 flex justify-center gap-x-2 gap-y-5 bg-white sm:gap-x-4 lg:flex-col lg:pt-20 lg:max_w_60 lg:h-screen lg:justify-start lg: pl-6'>
            <Link to={'/shop/addproduct'}>
                <button className='flexCenter gap-2 rounded-md bg-primary h-12 w-44 xs:w-44 medium-16'>
                    <img src={addProduct} alt="" height={50} width={50} />
                    <span>Add Product</span>
                </button>
            </Link>
            <Link to={'/shop/listproduct'}>
                <button className='flexCenter gap-2 rounded-md bg-primary h-12 w-44 xs:w-44 medium-16'>
                    <img src={listProduct} alt="" height={50} width={50} />
                    <span>Product List</span>
                </button>
            </Link>
      </div>
    )
}

export default Sidebar
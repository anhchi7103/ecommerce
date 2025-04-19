import React, {useContext, useState} from 'react'
import { MdSearch } from 'react-icons/md'
import Item from '../components/Item'
import { ShopContext } from '../Context/ShopContext'

const Category = ({banner}) => {
  const {all_products} = useContext(ShopContext);

  return (
    <section className='max_padd_container py-12 xl:py-28'>
      <div>
        <div>
          <img src={banner} alt="" className='block my-7 mx-auto'/>
        </div>
        <div className='flexBetween my-8 mx-2'>
          <h5><span className='font-bold'>Showing 1-12</span> out of 36 products</h5>
          <form /*onSubmit={handleSearch}*/ className="flex h-14 w-1/3 rounded-xl border border-gray-300 overflow-hidden">
              <input
                type="text"
                placeholder="Search for products/shops"
                /*value={searchKeyword}
                onChange={handleSearchInputChange}*/
                className="flex-1 pl-5 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                aria-label="Search"
              />
              <button type="submit" className="bold text-xl text-secondary px-4"> <MdSearch /> </button>
            </form>
        </div>
        {/*container*/}
        <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
          {all_products.map((item) => {
            if (1)
            {
              return <Item key={item._id} _id={item._id} images={item.images} name={item.name} price={item.price} ></Item>
            }
          })}
        </div>
        <div className='mt-16 text-center'>
          <button className='btn_dark_rounded'>Load more</button>
        </div>
      </div>
    </section>
  )
}

export default Category
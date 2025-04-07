import React from 'react'

const ShopInfo = () => {
  return (
    <div className='my-10 p-5 flex flex-col gap-14 xl:flex-row bg-white rounded-xl'>
      {/* Avatar + Tên shop*/}
      <div className="flex items-center gap-x-2 xl:flex-[0.7]">
        <img src="/src/assets/shop_logo.jpg" alt="Shop avatar" className="w-20 h-20 rounded-full object-cover"/>
        <div className='mx-4 flex flex-col gap-y-1 '>
          <h2 className="font-semibold text-gray-800">Shop Name</h2>
          <p className="text-gray-500">sample description</p>
          <button className='btn_dark_rounded !px-5'> Shop Profile </button>
        </div>
      </div>

      <div className='border bg-gray-20'></div>

      <div className='flex-col xl:flex-[1.7] grid grid-cols-3 gap-x-5 text-sm text-gray-700'>
        <div>
          <p className="text-gray-400">Ratings</p>
          <p className="text-red-500">2k</p>
        </div>
        <div>
          <p className="text-gray-400">Responding Rate</p>
          <p className="text-red-500">79%</p>
        </div>
        <div>
          <p className="text-gray-400">Joinded</p>
          <p className="text-red-500">34 months ago</p>
        </div>
        <div>
          <p className="text-gray-400">Products</p>
          <p className="text-red-500">105</p>
        </div>
        <div>
          <p className="text-gray-400">Estimated reply time</p>
          <p className="text-red-500">A few hours</p>
        </div>
        <div>
          <p className="text-gray-400">Followers</p>
          <p className="text-red-500">7,3k</p>
        </div>
      </div>
    </div>
  )
}

export default ShopInfo
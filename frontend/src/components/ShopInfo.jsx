import React, { useEffect, useState } from 'react';

const ShopInfo = (props) => {
  const { product } = props;
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(`http://localhost:4000/get-shop-by-id/${product.shop_id}`);
        const data = await res.json();
        setShop(data);
      } catch (err) {
        console.error("Failed to fetch shop info:", err);
      }
    };

    if (product?.shop_id) {
      fetchShop();
    }
  }, [product]);

  return (
    <div className='my-10 p-5 flex flex-col gap-14 xl:flex-row bg-white rounded-xl'>
      {/* Avatar + Tên shop*/}
      <div className="flex items-center gap-x-2 xl:flex-[0.7]">
        <img src="/src/assets/shop_logo.jpg" alt="Shop avatar" className="w-20 h-20 rounded-full object-cover"/>
        <div className='mx-4 flex flex-col gap-y-1 '>
          <h2 className="font-semibold text-gray-800">{shop ? shop.shop_name : "Shop Name"}</h2>
          <p className="text-gray-500">{shop ? shop.description : '-'}</p>
          <button className='btn_dark_rounded !px-5'> Shop Profile </button>
        </div>
      </div>

      <div className='border bg-gray-20'></div>

      <div className='flex-col xl:flex-[1.7] grid grid-cols-3 gap-x-5 text-sm text-gray-700'>
        <div>
          <p className="text-gray-400">Rating</p>
          <p className="text-red-500">{shop ? shop.rating : '-'}</p>
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
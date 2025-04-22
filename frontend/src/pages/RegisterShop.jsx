import React, { useState } from 'react';

// const { userId } = useParams(); // ✅ lấy owner_id

const RegisterShop = () => {
  const [formData, setFormData] = useState({
    shop_name: '',
    description: '',
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerShop = async () => {
    const userId = localStorage.getItem('UserID');
    if (!userId) {
      alert("You must be logged in to register a shop.");
      return;
    }

    const shopData = {
        owner_id: userId,
        shop_name: formData.shop_name,
        description: formData.description
    };

    try {
      const response = await fetch('http://localhost:4000/register-shop/' + userId, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopData),
      });
      const data = await response.json();

      if (data.success) {
        alert("Shop registered successfully!");
        window.location.replace('/shop/home');
      } else {
        alert(data.error || "Failed to register shop.");
      }
    } catch (err) {
      console.error("Error registering shop:", err);
      alert("Server error.");
    }
  };

  return (
    <section className='max_padd_container flexCenter flex-col pt-32'>
      <div className='max-w-[555px] min-w-[530px] bg-white m-auto px-14 py-10 rounded-md'>
        <h3 className='h3'>Register Shop</h3>
        <div className='flex flex-col gap-4 mt-7'>
          <input
            name="shop_name"
            value={formData.shop_name}
            onChange={changeHandler}
            type="text"
            placeholder='Shop Name'
            className='h-14 pl-5 bg-slate-900/5 outline-none rounded-xl'
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={changeHandler}
            placeholder='Shop Description'
            rows="5"
            className='p-4 bg-slate-900/5 outline-none rounded-xl'
          />
        </div>

        <button onClick={(e) => { e.preventDefault(); registerShop(); }} className='btn_dark_rounded my-5 w-full !rounded-md'>Create Shop</button>
      </div>
    </section>
  );
};

export default RegisterShop;
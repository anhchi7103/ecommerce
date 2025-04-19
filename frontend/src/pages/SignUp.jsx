import React from 'react'
import { useState } from 'react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password_hash: '',
    address: [
      {
        address_id: 'addr001',
        street: '',
        city: '',
        country: ''
      }
    ],
    payment_methods: [
      {
        method_id: 'pm001',
        type: 'Cash',
        details: 'Paid by cash'
      }
    ],
    rank: 'regular',
    wishlist: [],
    // cart_data: (() => {
    //   const obj = {};
    //   for (let i = 0; i < 300; i++) obj[i] = 0;
    //   return obj;
    // })()  
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    
    // Nested address fields
    if (name.startsWith('address_')) {
      const field = name.split('address_')[1];
      setFormData({
        ...formData,
        address: [{ ...formData.address[0], [field]: value }]
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const signup = async () => {
    console.log("Signup formData:", formData);
    let responseData;

    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then((response) => response.json())
    .then((data) => responseData = data);

    if (responseData.success) {
      //localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/login');
      alert("Register new account successfully!");
    } else {
      alert(responseData.errors);
    }
  };

  return (
    <section className='max_padd_container flexCenter flex-col pt-32'>
      <div className='max-w-[555px] bg-white m-auto px-14 py-10 rounded-md'>
        <h3 className='h3'>Sign Up</h3>
        <div className='flex flex-col gap-4 mt-7'>

          <input name="username" value={formData.username} onChange={changeHandler} type="text" placeholder='Username' className='h-14 pl-5 bg-slate-900/5 outline-none rounded-xl'/>
          <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' className='h-14 pl-5 bg-slate-900/5 outline-none rounded-xl'/>
          <input name="password_hash" value={formData.password_hash} onChange={changeHandler} type="password" placeholder='Password' className='h-14 pl-5 bg-slate-900/5 outline-none rounded-xl'/>
          <input name="first_name" value={formData.first_name} onChange={changeHandler} type="text" placeholder='First Name' className='h-14 pl-5 bg-slate-900/5 outline-none rounded-xl'/>
          <input name="last_name" value={formData.last_name} onChange={changeHandler} type="text" placeholder='Last Name' className='h-14 pl-5 bg-slate-900/5 outline-none rounded-xl'/>
          <input name="phone_number" value={formData.phone_number} onChange={changeHandler} type="text" placeholder='Phone Number' className='h-14 pl-5 bg-slate-900/5 outline-none rounded-xl'/>

          {/* Address Fields */}
          <input name="address_street" value={formData.address[0].street} onChange={changeHandler} type="text" placeholder='Street' className='h-14 pl-5 bg-slate-900/5 outline-none rounded-xl'/>
          <input name="address_city" value={formData.address[0].city} onChange={changeHandler} type="text" placeholder='City' className='h-14 pl-5 bg-slate-900/5 outline-none rounded-xl'/>
          <input name="address_country" value={formData.address[0].country} onChange={changeHandler} type="text" placeholder='Country' className='h-14 pl-5 bg-slate-900/5 outline-none rounded-xl'/>

        </div>

        <button onClick={(e) => { e.preventDefault(); signup(); }} className='btn_dark_rounded my-5 w-full !rounded-md'>Continue</button>

        <p className='flexCenter text-black font-bold gap-1'>
          Already have an account? <span className='text-secondary underline cursor-pointer'>Login</span>
        </p>

        <div className='flexCenter mt-6 gap-3'>
          <input type="checkbox" name="" id="" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </section>
  );
};

export default SignUp
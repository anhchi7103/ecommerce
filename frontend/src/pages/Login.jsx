import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <section className='max_padd_container flexCenter flex-col pt-32'>
      <div className='w-[555px] h-[450px] bg-white m-auto px-14 py-10 rounded-md'>
        <h3 className='h3'>Login</h3>
        <form className='flex flex-col gap-4 mt-7'>
          <input type="text" placeholder='Tên đăng nhập' className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl' /*value={username} onChange={(e) => setUsername(e.target.value)}*//>
          <input type="password" placeholder='Mật khẩu' className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl' /*value={password} onChange={(e) => setPassword(e.target.value)}*/ />
          <button type='submit' className='btn_dark_rounded my-5 w-full !rounded-md'>Login</button>
          <p className='flexCenter text-black font-bold gap-1'>Don't have an account?<Link to={'/signup'} className={'flex'}><span className='text-secondary underline cursor-pointer'>Register</span> </Link> </p>
        </form>
        {/*
        {errorMessage && <p className='flexCenter text-base py-5 text-red-500'>{errorMessage}</p>}
        {successMessage && <p className='text-green-500'>{successMessage}</p>}
        */}
      </div>
    </section>
  )
}

export default Login
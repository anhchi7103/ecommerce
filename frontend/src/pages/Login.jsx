import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  // const [formData, setFormData] = useState({
  //   username:"",
  //   password_hash:"",
  //   email:""
  // });

  const changeHandler = (e) => {
    setFormData({...formData, [e.target.name]:e.target.value});
  }

  const login = async () => {
    console.log("Signup function executed", formData);
    let responseData;
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept: 'application/formData',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData) 
    }).then((response) => response.json()).then((data) => responseData=data)

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/');
    }
    else {
      alert(responseData.errors)
    }
  }

  return (
    <section className='max_padd_container flexCenter flex-col pt-32'>
      <div className='w-[555px] h-[450px] bg-white m-auto px-14 py-10 rounded-md'>
        <h3 className='h3'>Login</h3>
        <form className='flex flex-col gap-4 mt-7'>
          <input type="text" placeholder='Tên đăng nhập' className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl' /*value={username} onChange={(e) => setUsername(e.target.value)}*//>
          <input type="password" placeholder='Mật khẩu' className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl' /*value={password} onChange={(e) => setPassword(e.target.value)}*/ />
          <button onClick={() => {login()}} type='submit' className='btn_dark_rounded my-5 w-full !rounded-md'>Login</button>
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
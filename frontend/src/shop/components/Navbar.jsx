import React from 'react'
import logo from '../../assets/logo.svg'
import profileImg from '../../assets/profile.png'

const Navbar = () => {
    return (
        <nav className='max_padd_container flexBetween bg-white py-2 shadow-sm relative'>
            <div>
                <img src={logo} alt="" />
            </div>
            <div className='uppercase bold-22 text-white bg-secondary px-3 rounded-md tracking-widest line-clamp-1 max-xs:bold-18 max-xs:py-2'>Admin panel</div>
            <div>
                <img src={profileImg} alt="" className='h-12 w-12 rounded-full' />
            </div>
        </nav>
    )
}

export default Navbar
import { NavLink } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { MdOutlineLocalOffer } from 'react-icons/md'

const Hero = () => {
  return (
    <section className='relative bg-hero bg-center bg-no-repeat h-screen w-full'>
        <div className="max_padd_container relative top-10 xs:top-52">
            <h1 className='h3 max-w-[37rem]'> The perfect way to convert your traffic into sales  </h1>
            <p className='text-gray-50 regular-16 mt-6 max-w-[33rem]'>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magnam veritatis sapiente ullam animi nisi. Molestiae, nesciunt. Impedit rerum, quibusdam odit dolorem iste, aut illum aliquid facere nobis nostrum dolore exercitationem!
            </p>
            <div className='flexStart !items-center gap-x-4 my-10'>
                <div className='bold-16 sm:bold-20'> 176k <span className='regular-16 sm:regular-20'>Excellent Reviews </span></div>
            </div>
            <div className='max-xs:flex-col flex gap-2'>
                <NavLink to='' className={"btn_dark_rounded flexCenter"}> Buy Now </NavLink>
                <NavLink to='' className={"btn_dark_rounded flexCenter gap-x-1"}> <MdOutlineLocalOffer className='text-2x1'/> Offers </NavLink>
            </div>
        </div>
    </section>
  )
}

export default Hero
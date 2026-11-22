import React from 'react'
import logo from '../assets/sidenote-feather-transparent.png'

const NavbarProfileMobile = ({isMenuOpen, setisMenuOpen, }) => {
  return (
    <>
    
    <div className='fixed w-full lg:hidden h-auto px-3 flex items-center justify-between border-b top-0 z-50 bg-zinc-950 border-zinc-800'>

        <div className='flex md:ml-8 ml-4 w-12 md:w-18 py-2 items-center justify-center'>
            <img src={logo} alt="SideNote" />
        </div>

        <div className='flex w-1/5 items-center justify-center py-1.5 px-3'>

        <button onClick={() => {
          setisMenuOpen(!isMenuOpen);
        }} className='tracking-normal hover:scale-97 active:scale-97 font-medium text-2xl md:text-5xl'>☰</button>

        </div>

    </div>
    
    </>
  )
}

export default NavbarProfileMobile
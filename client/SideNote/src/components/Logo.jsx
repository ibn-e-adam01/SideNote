import React from 'react'
import logo from '../assets/sidenote-logo-full-transparent.png'

const Logo = () => {
  return (
    <>
    
    <div className='w-full h-1/3 flex items-center justify-center px-4'>
        <img className='md:w-1/3 2xl:w-1/4 2xl:h-1/4 xl:w-1/5 xl:h-1/5 lg:w-1/5 lg:h-1/5 md:h-1/3 h-1/2 w-1/2' src={logo} alt="SideNote" />
    </div>
    
    </>
  )
}

export default Logo
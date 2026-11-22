import { faHouse, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

const MenuBarMobile = ({Logout,isHomeOpen, setisHomeOpen, isProfileOpen, setisProfileOpen}) => {
  return (
    <>
    
    <div className='lg:hidden flex h-screen top-12 md:top-30 fixed items-start justify-end w-full'>

        <div className='w-1/2 md:w-1/3 border-t flex flex-col items-center justify-start gap-4 h-screen bg-zinc-900 px-2 py-2 border-l border-zinc-700 opacity-90'>
        
        <button onClick={() => {
            setisHomeOpen(true);
            setisProfileOpen(false);
        }} className={`w-full border cursor-pointer hover:bg-zinc-950 border-zinc-800  flex items-center justify-start ${isHomeOpen == true? 'bg-zinc-800' : ''} gap-2 h-auto px-4 py-2 rounded-md`}>
            <FontAwesomeIcon icon={faHouse} />
            Home
        </button>
        <button onClick={() => {
            setisProfileOpen(true);
            setisHomeOpen(false);
            getPostData();
            getUserData();
        }} to='/sidenote' className={`w-full border cursor-pointer hover:bg-zinc-950 border-zinc-800 ${isProfileOpen == true? 'bg-zinc-800' : ''} flex items-center justify-start gap-2 h-auto px-4 py-2 rounded-md`}>
            <FontAwesomeIcon icon={faUser} />
            Profile
        </button>
        <button onClick={Logout} className='w-full border hover:bg-red-800 cursor-pointer hover:text-zinc-100 border-red-950 text-red-500  flex items-center justify-start gap-2 h-auto px-4 py-2 rounded-md'>
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
        </button>
        
        </div>

    </div>
    
    
    </>
  )
}

export default MenuBarMobile
import { faArrowLeft, faHouse, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import React from 'react'
import axios from 'axios';
import logo from './assets/sidenote-logo-horizontal-transparent.png'

const Sidebar = ({isMenuOpen, setisMenuOpen, Logout, AllPosts, setAllPosts, getPostData, getUserData, Posts, setPosts, User, setUser, isHomeOpen, setisHomeOpen, isProfileOpen, setisProfileOpen}) => {
  
    return (
    <>
    
    <div className='h-screen sticky top-0 self-start w-2/10 lg:w-3/10 hidden border-r border-zinc-700 gap-4 px-4 py-1.5 lg:flex flex-col items-center justify-start'>
    
    <div className='w-9/10 border-b border-zinc-800 h-auto py-1 flex items-center justify-center'>
        <img src={logo} alt="SideNote" />
    </div>

    <div className='flex text-zinc-200 font-semibold tracking-tighter text-2xl flex-col items-center justify-center w-full gap-3'>

        <button onClick={() => {
            setisHomeOpen(true);
            setisProfileOpen(false);
            setisMenuOpen(false);
        }} className={`w-full border cursor-pointer hover:bg-zinc-900 active:bg-zinc-900 border-zinc-800  flex items-center justify-start ${isHomeOpen == true? 'bg-zinc-900' : ''} gap-2 h-auto px-4 py-2 rounded-md`}>
            <FontAwesomeIcon icon={faHouse} />
            Home
        </button>
        <button onClick={() => {
            setisProfileOpen(true);
            setisHomeOpen(false);
            setisMenuOpen(false);
            getPostData();
            getUserData();
        }} to='/sidenote' className={`w-full border cursor-pointer hover:bg-zinc-900 active:bg-zinc-900 border-zinc-800 ${isProfileOpen == true? 'bg-zinc-900' : ''} flex items-center justify-start gap-2 h-auto px-4 py-2 rounded-md`}>
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

export default Sidebar
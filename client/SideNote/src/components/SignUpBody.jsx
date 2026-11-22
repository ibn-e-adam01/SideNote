import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const SignUpBody = () => {

    const [Username, setUsername] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Error1, setError1] = useState('');
    const [Error2, setError2] = useState('');
    const [Error3, setError3] = useState('');
    const [IsLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_B_API_URL;

    const submitUserData = async (e) => {

        e.preventDefault();
        const data = {
            Username,
            Email,
            Password
        }

    try{
        let res = await axios.post(`http://${API_URL}/createAccount`, data, {
            headers: {
                'Content-Type':'application/json'
            }, withCredentials: true
        });

        if(res?.data){
            setIsLoading(false);
            navigate('/sidenote');
        } else {
            setIsLoading(true);
        }
     } catch (err) {

            console.error(err.message);
            setError1('Enter required username!');
            setError2('Enter required email!');
            setError3('Enter required password!');
        }
    }

  return (
    <>
    
    <form onSubmit={submitUserData} className='w-full flex items-start justify-center py-0.5 px-4 h-screen'>

        <div className='md:border border-zinc-800 flex flex-col gap-3 text-white px-6 md:py-4 rounded-md h-auto xl:w-1/3 2xl:w-1/4 md:w-6/10'>
        
            <div className='w-full h-auto py-0.5 md:gap-1 px-2 flex items-start flex-col'>
                <h1 className='font-bold tracking-tight text-xl md:text-3xl'>Create Account</h1>
                <h3 className='ml-0.5 font-semibold text-zinc-300 tracking-tighter md:tracking-[0.07rem] text-xs md:text-sm'>Join our community today.</h3>
            </div>

            <div className='w-full h-auto gap-4 py-0.5 px-2 flex items-start flex-col'>

                <div className={`w-full flex items-center justify-start gap-2 h-auto md:py-3 py-2 px-4 border hover:bg-zinc-900 active:bg-zinc-900 ${Error1 ?'border-red-500' : 'border-zinc-800'} rounded-md`}><FontAwesomeIcon icon={faUser} /><input onChange={(e) => {
                    setUsername(e.target.value);
                    setError1('');
                }} className='outline-none w-full' type="text" name="" id="" placeholder='Username' /></div>

                {Error1 &&
                <div className='w-full h-auto text-xs text-red-500 flex items-center justify-start px-2'>
                    <p>{Error1}</p>
                </div>
                }


                <div className={`w-full hover:bg-zinc-900 active:bg-zinc-900 flex items-center justify-start gap-2 h-auto md:py-3 py-2 px-4 border ${Error2 ?'border-red-500' : 'border-zinc-800'} rounded-md`}><FontAwesomeIcon icon={faEnvelope} /><input onChange={(e) => {
                    setEmail(e.target.value);
                    setError2('');
                }} className='outline-none w-full' type="email" name="" id="" placeholder='Email' /></div>

                {Error2 &&
                <div className='w-full h-auto text-xs text-red-500 flex items-center justify-start px-2'>
                    <p>{Error2}</p>
                </div>
                }

                <div className={`w-full flex items-center justify-start gap-2 h-auto md:py-3 py-2 px-4 border hover:bg-zinc-900 active:bg-zinc-900 ${Error3 ?'border-red-500' : 'border-zinc-800'} rounded-md`}><FontAwesomeIcon icon={faLock} /><input onChange={(e) => {
                    setPassword(e.target.value);
                    setError3('');
                }} className='outline-none w-full' type="password" name="" id="" placeholder='Password' /></div>

                {Error3 &&
                <div className='w-full h-auto text-xs text-red-500 flex items-center justify-start px-2'>
                    <p>{Error3}</p>
                </div>
                }

                <button className='hover:bg-zinc-100 hover:border hover:border-zinc-500 hover:text-zinc-900  cursor-pointer w-full rounded-md md:py-2.5 py-1.5 text-lg px-4 bg-zinc-200 text-zinc-800 font-semibold tracking-tight active:bg-zinc-300 active:border active:border-zinc-500 active:text-zinc-900'>


                {IsLoading == false && 
                    <p>Sign In</p>
                } {IsLoading == true &&
                    
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-500 border-t-zinc-950 animate-spin" />
                    
                 }


                </button>

                <div className='w-full h-auto py-0.5 px-3 flex items-center justify-center'>
                    <h4 className='text-zinc-300 text-sm tracking-tight font-semibold'>Or</h4>
                </div>

                <button className='hover:bg-zinc-900 flex items-center justify-center gap-1  hover:text-zinc-100 cursor-pointer w-full rounded-md md:py-2.5 py-1.5 text-md px-4 font-semibold border border-zinc-800 tracking-tight active:bg-zinc-900 active:border active:border-zinc-700 active:text-zinc-100'><FontAwesomeIcon icon={faGoogle} />Continue with Google</button>

                <div className='gap-2 w-full h-auto py-0.5 px-3 flex items-center justify-center'>
                    <h4 className='text-zinc-300 text-xs md:text-sm tracking-tight font-semibold'>Already have an account?</h4>
                    <Link to='/signin' className='font-semibold hover:underline text-xs md:text-sm'>Sign In</Link>
                </div>

            </div>
        
        </div>

    </form>
    
    
    </>
  )
}

export default SignUpBody
import React, { useEffect } from 'react'
import Logo from '../components/Logo'
import LoginBody from '../components/LoginBody'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {


  const navigate = useNavigate();

  const getUserData = async () => {

        try{
        let res = await axios.get(`${API_URL}/getuser`,{
          withCredentials:true
        });
  
        if(res?.data?.success == true){
          navigate('/sidenote');
        }
        } catch (err) {
      if (err.response && err.response.status === 401) {
        // Redirect them away so they don't see an empty page glitch
        navigate('/'); 
      }
    }
  }

  useEffect(() => {
    getUserData();
  },[])


  return (
    <>
        <Logo />
        <LoginBody />
    </>
  )
}

export default Login
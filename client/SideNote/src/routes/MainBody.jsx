import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ProfileBody from '../components/ProfileBody'
import Home from '../components/Home';
import Lenis from 'lenis'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MainBody = () => {
  const [isProfileOpen, setisProfileOpen] = useState(false);
  const [isHomeOpen, setisHomeOpen] = useState(true);
  const [User, setUser] = useState([]);
  const [Posts, setPosts] = useState([]);
  const [Comments, setComments] = useState([]);
  const [AllPosts, setAllPosts] = useState([]);
  const [isComment, setisComment] = useState(false);
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [CmtPostId, setCmtPostId] = useState('');
  const navigate = useNavigate();


  const API_URL = import.meta.env.VITE_B_API_URL;


  const Logout = async () => {
        let res = await axios.post(`http://${API_URL}/logout`, {}, {
            headers:{
                'Content-Type':'application/json'
            }, withCredentials:true
        });

        if(res?.data){
            navigate('/signin');
        }
    }

  // Initialize Lenis
const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

  const getPostData = async () => {
    try{
        let res = await axios.get(`http://${API_URL}/getposts`,{
          withCredentials:true
        });
  
        if(res?.data){
          setPosts(res?.data?.posts.reverse());
        }
      } catch (err) {
      if (err.response && err.response.status === 401) {
        // Redirect them away so they don't see an empty page glitch
        navigate('/signin'); 
      }
    }
    }

  const getAllPostsData = async () => {
        let res = await axios.get(`http://${API_URL}/getAllposts`,{
          withCredentials:true
        });
  
        if(res?.data){
          setAllPosts(res?.data?.allposts);
        }
      }

      const getUserData = async () => {

        try{
        let res = await axios.get(`http://${API_URL}/getuser`,{
          withCredentials:true
        });
  
        if(res?.data){
          setUser([res?.data?.user]);
        }
        } catch (err) {
      if (err.response && err.response.status === 401) {
        // Redirect them away so they don't see an empty page glitch
        navigate('/signin'); 
      }
    }
  }


    const addLike = async (postId) => {
    let res = await axios.post(`http://${API_URL}/addLike/${postId}`, {}, {
      headers: {
        'Content-Type':'application/json'
      }, withCredentials:true
    });

    if(res?.data?.success == true){
      getAllPostsData();
      getPostData();
    }
  }

  const removeLike = async (postId) => {

    let res = await axios.patch(`http://${API_URL}/removeLike/${postId}`, {}, {
      headers: {
        'Content-Type':'application/json'
      }, withCredentials:true
    });

    if(res?.data?.success == true){
      getAllPostsData();
      getPostData();
    }

  }



  useEffect(() => {
      getUserData();
      getPostData();
      getAllPostsData(); 
    }, []);
    

  return (
    <>
    
    <div className='w-full flex items-start'>
        <Sidebar Logout={Logout} isComment={isComment} setisComment={setisComment} isMenuOpen={isMenuOpen} setisMenuOpen={setisMenuOpen} AllPosts={AllPosts} getAllPostsData={getAllPostsData} setAllPosts={setAllPosts} getPostData={getPostData} getUserData={getUserData} Posts={Posts} setPosts={setPosts} User={User} setUser={setUser} isHomeOpen={isHomeOpen} setisHomeOpen={setisHomeOpen} isProfileOpen={isProfileOpen} setisProfileOpen={setisProfileOpen}/>

        {isProfileOpen == true?
        <ProfileBody removeLike={removeLike} CmtPostId={CmtPostId} setCmtPostId={setCmtPostId} addLike={addLike} Comments={Comments} setComments={setComments} isMenuOpen={isMenuOpen} setisMenuOpen={setisMenuOpen} Logout={Logout} isComment={isComment} setisComment={setisComment} AllPosts={AllPosts} getAllPostsData={getAllPostsData} setAllPosts={setAllPosts} getPostData={getPostData} getUserData={getUserData} Posts={Posts} setPosts={setPosts} User={User} setUser={setUser} isHomeOpen={isHomeOpen} setisHomeOpen={setisHomeOpen} isProfileOpen={isProfileOpen} setisProfileOpen={setisProfileOpen}/> :

        <Home removeLike={removeLike} CmtPostId={CmtPostId} setCmtPostId={setCmtPostId} addLike={addLike} Comments={Comments} setComments={setComments} isMenuOpen={isMenuOpen} setisMenuOpen={setisMenuOpen} Logout={Logout} isComment={isComment} setisComment={setisComment} AllPosts={AllPosts} getAllPostsData={getAllPostsData} setAllPosts={setAllPosts} getPostData={getPostData} getUserData={getUserData} Posts={Posts} setPosts={setPosts} User={User} setUser={setUser} isHomeOpen={isHomeOpen} setisHomeOpen={setisHomeOpen} isProfileOpen={isProfileOpen} setisProfileOpen={setisProfileOpen}/>

        }
    </div>
    
    </>
  )
}

export default MainBody
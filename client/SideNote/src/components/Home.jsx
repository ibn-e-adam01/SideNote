import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment as faCommentRegular, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { faComment as faCommentSolid, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import NavbarProfileMobile from './NavbarProfileMobile';
import axios from 'axios';
import CommentSection from './CommentSection';
import MenuBarMobile from './MenuBarMobile';
import { useEffect } from 'react';

const Home = ({removeLike, CmtPostId, setCmtPostId, LikedPost, setLikedPost, addLike, Comments, setComments, isMenuOpen, setisMenuOpen, Logout, isComment, setisComment, getAllPostsData, getUserData, getPostData, AllPosts, setAllPosts, Posts, setPosts, User, setUser, isHomeOpen, setisHomeOpen, isProfileOpen, setisProfileOpen}) => {
  const [Post, setPost] = useState('');
  const [isDltOpen, setisDltOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const reversedPosts = AllPosts ? [...AllPosts].reverse() : [];

  const API_URL = import.meta.env.VITE_B_API_URL;

  const filteredPosts = AllPosts.filter(post => 
    post.post?.toLowerCase().includes(searchQuery.toLowerCase())
  ); // need post? instead of just post as some post may be empty and hence will crash the app.

  const sendPost = async (e) => {

    e.preventDefault();
    if(Post){

      const postData ={
      Post
    }

    let res = await axios.post(`http://${API_URL}/createPost`, postData, {
      headers: {
        'Content-Type':'application/json'
      }, withCredentials:true
    });

    if(res?.data){
      setPost('')
      getAllPostsData();
      getUserData();
    }

    }
    
  }

  const getInitials = (name = 'User') => {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join('');
  };

  const formatTime = (date) => {
    if (!date) return '';

    const timestamp = new Date(date).getTime();

    if (Number.isNaN(timestamp)) return '';

    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return new Date(date).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
    
    <div className='w-full h-auto relative top-15 md:top-29 lg:static tracking-tighter flex flex-col items-center  px-2 py-2 justify-start gap-3 text-zinc-200 font-semibold'>
    <div className='flex items-center justify-center w-full absolute z-170'>
      <NavbarProfileMobile isMenuOpen={isMenuOpen} setisMenuOpen={setisMenuOpen}/>
    </div>

    {isMenuOpen == true &&
    <div className='w-full backdrop-blur-sm bg-black/70 fixed z-120 md:top-27 top-12 right-0 h-screen'>
      <MenuBarMobile Logout={Logout} isHomeOpen={isHomeOpen} isProfileOpen={isProfileOpen} setisHomeOpen={setisHomeOpen} setisProfileOpen={setisProfileOpen}/>
    </div>
    }

      {isComment == true &&
      <div className='xl:w-6/10 lg:w-5/10 md:w-6/10 w-9/10 fixed xl:right-40  z-190'>
      <CommentSection User={User} setUser={setUser} getAllPostsData={getAllPostsData} Comments={Comments} setComments={setComments} CmtPostId={CmtPostId} setCmtPostId={setCmtPostId} isComment={isComment} setisComment={setisComment}  />
      </div>
      }

      <div className='w-full md:gap-0 gap-3 h-auto py-2 px-2 flex items-center justify-between'>

        <div className='w-full flex mx-3 items-center justify-start gap-2 h-auto md:py-3 py-2 px-4 border hover:bg-zinc-950 active:bg-zinc-950 border-zinc-700 rounded-4xl'><FontAwesomeIcon className='text-zinc-400' icon={faMagnifyingGlass} /><input className='outline-none w-full' type="text" name="" id="" placeholder='Search Posts...' value={searchQuery} onChange={(e) => {
          setSearchQuery(e.target.value);
        }} /></div>
      
      <div className='md:w-1/2 flex md:mr-3 lg:mr-0  items-center justify-end'>
        <button onClick={() => {
          setisProfileOpen(true);
          setisHomeOpen(false);
          getPostData();
          getUserData();
        }} className='md:w-12 w-9 h-9 cursor-pointer hover:scale-97 md:h-12 overflow-hidden flex items-center justify-center rounded-full md:border-2 active:scale-97 bg-zinc-950 border-zinc-200'>
               {User && User.map((user) => (
                <div key={user?._id} className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700 text-sm font-semibold text-zinc-200">
                    {getInitials(user?.username)}
            </div>
               ))}
       </button>
       </div>
      
      </div>
      
        <div className='w-full absolute z-70 md:top-18 xl:top-17 top-16 -left-2 xl:left-82 lg:left-60 2xl:left-150 px-8 flex-col flex items-start justify-center'>

          {searchQuery && filteredPosts.map((post) => (
          <div key={post?._id} className='shrink-0 xl:w-1/2 lg:w-5/10 md:w-7/10 w-9/10 cursor-pointer flex items-center justify-start gap-2 h-auto md:py-3 py-2 px-4 border bg-zinc-900 hover:bg-zinc-950 active:bg-zinc-950 border-zinc-700'>
          <div className='flex w-full h-full justify-between items-center'>
          <p className='text-md'>{post?.post}</p>
          <p className='text-md text-orange-500'>~ {post?.authorName}</p>
          </div>
          
          </div>
          ))}

          {searchQuery && filteredPosts.length == 0 && 
          <div className='w-1/2 cursor-default flex items-center justify-start gap-2 h-auto md:py-3 py-2 px-4 border bg-zinc-900 hover:bg-zinc-950 active:bg-zinc-950 border-zinc-700'>
          
          <p className='text-md'>No posts match your search.</p>
          
          </div>
          }
        </div>
        


      <form onSubmit={sendPost} className='w-full px-3 py-1 flex items-center justify-start'>

        <div className='PostBox gap-4 md:w-7/10 w-full border border-zinc-800 rounded-md h-auto py-4 px-4 flex flex-col justify-center items-center'>
        
         <div className='w-full flex items-center justify-start gap-2 h-auto md:py-3 py-2 px-4 border bg-zinc-950 hover:bg-zinc-900 active:bg-zinc-900 border-zinc-700 rounded-md'><textarea onChange={(e) => {
          setPost(e.target.value);
         }} className='outline-none w-full resize-none font-normal' type="text" name="" id="" value={Post} placeholder="What's on your mind?" ></textarea></div>
        

        <div className='w-full flex items-center justify-end gap-5 px-4 '>

          <button type='submit' disabled={!Post} className={`md:text-md text-sm ${Post? 'cursor-pointer hover:scale-97' : 'disabled:text-zinc-600 disabled:cursor-not-allowed'}`} onClick={(e) => {
            setPost('');
          }}>Clear</button>


          <button type='submit' disabled={!Post} className={`cursor-pointer w-auto rounded-4xl md:py-1.5 py-1 text-sm md:px-7 px-4 bg-zinc-200 text-zinc-800 font-semibold tracking-tight ${Post? 'active:bg-zinc-300 active:border active:border-zinc-500 active:text-zinc-900 hover:scale-97 hover:bg-zinc-100 hover:border hover:border-zinc-500 hover:text-zinc-900' : 'disabled:bg-zinc-600 disabled:cursor-not-allowed'}`}>Post</button>
        </div>
        </div>
      </form>


      <div className='mt-2 mb-2 w-full h-auto px-4 py-1.5'>
        <h1 className='md:text-2xl text-lg'>Public Posts</h1>
      </div>

          
      <div className='Posts w-full h-auto lg:px-0 md:px-1.5 py-1.5 gap-3 flex flex-col justify-center items-start'>
          {User.length > 0 && reversedPosts?.length > 0 && reversedPosts.map((post) => {
            // console.log("User: \n", User);
            // console.log("Post Likes: \n", post.likes);
            const isLiked = post.likes.some(
              (id) => id.toString() === User[0]._id.toString()
            );
            return(
        <div className='eachPost rounded-md border bg-zinc-950 hover:bg-zinc-900 active:bg-zinc-900 border-zinc-800 px-6 py-3 flex flex-col items-start gap-4 justify-center w-9/10 mx-1.5 bg'>

          <div className='flex items-center w-full justify-center gap-3'>
            <div className='flex items-center justify-start gap-3 w-full'>
              <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700 text-sm font-semibold text-zinc-200">
                    {getInitials(post?.authorName)}
                </div>
            <div className='flex items-center justify-center gap-2'>
              <h1 className={`md:text-sm text-xs ${post?.author === User[0]._id? 'text-emerald-500' : ''}`}>{post?.authorName}{post?.author === User[0]._id? ' (You)' : ''}</h1>

              
              
              <p className='md:text-xs font-normal text-xs text-zinc-400'>• {formatTime(
               post.postedOn || post.createdAt
              )}</p>
            

            </div>
          </div>
          </div>

          <div onClick={() => {
              setisComment(true);
              setCmtPostId(post._id);
        }}  className='h-auto w-full cursor-pointer flex items-center justify-start'>
            <p className='font-normal md:text-md lg:text-lg text-xs'>{post?.post}</p>
          </div>
          <div className='w-full flex items-center justify-start gap-5'>
            <div className='flex text-zinc-400 gap-1 items-center justify-center'>
              {!isLiked &&
            <button className='hover:scale-97 active:scale-125 transition-transform duration-200 cursor-pointer' onClick={() => {
              addLike(post._id);
            }}> <FontAwesomeIcon icon={faHeartRegular}/></button>
            } {isLiked &&
            
            <button className='hover:scale-97 active:scale-125 transition-transform duration-200 cursor-pointer' onClick={() => {
              removeLike(post._id);
            }}> <FontAwesomeIcon className='text-red-500' icon={faHeartSolid}/></button>
            
            }
            <h5 className='text-sm'>{(post.likes).length}</h5>
            </div>
            <div className='flex text-zinc-400 gap-1 items-center justify-center'>
            <button className='hover:scale-97 cursor-pointer' onClick={() => {
              setisComment(true);
              setCmtPostId(post._id);
            }}> <FontAwesomeIcon icon={faCommentRegular}/></button>
            <h5 className='text-sm'>{(post.comments).length}</h5>
            </div>
           
          </div>
        </div>
              );
            })}

            {reversedPosts?.length == 0 &&

            
          
          <div className='w-full flex items-center justify-center py-2 px-4 md:text-lg text-xs'>

            

            <h1 className='text-zinc-400'>No Public Posts Yet.</h1>

          </div>
          
          }

      </div>

    </div>
    
    </>
  )
}

export default Home
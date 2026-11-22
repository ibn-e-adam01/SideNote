import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faComment as faCommentRegular, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { faComment as faCommentSolid, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import NavbarProfileMobile from './NavbarProfileMobile';
import axios from 'axios';
import MenuBarMobile from './MenuBarMobile';
import CommentSection from './CommentSection';
import EditProfile from './EditProfile';

const ProfileBody = ({removeLike, CmtPostId, setCmtPostId, LikedPost, setLikedPost, addLike, Comments, setComments, isMenuOpen, setisMenuOpen, Logout, isComment, setisComment, getAllPostsData, getUserData, getPostData, AllPosts, setAllPosts, Posts, setPosts, User, setUser, isHomeOpen, setisHomeOpen, isProfileOpen, setisProfileOpen}) => {

  const [isEditProfile, setIsEditProfile] = useState(false);

  const API_URL = import.meta.env.VITE_B_API_URL;

  const handleProfileUpdate = async (FormData) => {
    let res = await axios.patch(`${API_URL}/updateProfile`, FormData, {
      withCredentials:true
    });
    if(res?.data?.success === true){
      setIsEditProfile(false);
      getUserData();
    }
  }
  

  const deletePost = async (postId) => {
    let res = await axios.delete(`${API_URL}/deletePost/${postId}`, {
      withCredentials:true
    });
    if(res?.data?.success === true){
      getAllPostsData();
      getPostData();
    }
  }

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

  const getInitials = (name = 'User') => {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join('');
  };
  
  return (
    <>
    
    <div className='w-full h-auto relative top-15 md:top-29 lg:static tracking-tighter flex flex-col py-2 justify-start  text-zinc-200 font-semibold'>

      <div className='flex items-center justify-center w-full absolute z-170'>
      <NavbarProfileMobile isMenuOpen={isMenuOpen} setisMenuOpen={setisMenuOpen}/>
    </div>

      {isMenuOpen == true &&
    <div className='w-full backdrop-blur-sm bg-black/70 fixed z-120 md:top-20 top-12 right-0 h-screen'>
      <MenuBarMobile Logout={Logout} isHomeOpen={isHomeOpen} isProfileOpen={isProfileOpen} setisHomeOpen={setisHomeOpen} setisProfileOpen={setisProfileOpen}/>
    </div>
    }

      {isComment == true &&
      <div className='xl:w-6/10 lg:w-5/10 md:w-6/10 w-9/10 fixed xl:right-40  z-190'>
      <CommentSection getAllPostsData={getAllPostsData} Comments={Comments} setComments={setComments} CmtPostId={CmtPostId} setCmtPostId={setCmtPostId} isComment={isComment} setisComment={setisComment}  />
      </div>
      }

<div className='px-5'>
        <div className='w-full lg:border border-zinc-800 rounded-md flex-col h-1/2 lg:h-1/1 lg:py-6 py-3 lg:px-6 px-3 flex items-start justify-start'>
        <div className='flex items-center justify-start gap-5'>
            {/* <button className='hover:scale-97 cursor-pointer active:scale-97 w-1/2 md:w-1/4 lg:w-1/6 xl:w-1/7 2xl:w-1/8  overflow-hidden flex items-center justify-center rounded-full border bg-zinc-950 border-zinc-800'>
                <img className='w-full h-full object-cover' src="\src\assets\sidenote-feather-transparent.png" alt="" />
            </button> */}
          {User && User.map((user) => (
            <div key={user._id} className="shrink-0 w-20 h-20 md:w-30 md:h-30 rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700 text-2xl md:text-4xl font-semibold text-zinc-200">
                    {getInitials(user?.username)}
            </div>

          ))}

            {/* <button className='cursor-pointer hover:scale-97 w-auto px-1 py-1 border-2 border-zinc-800 flex items-center justify-center rounded-full relative -left-14 z-50 top-11'>
            
            <FontAwesomeIcon className='' icon={faCamera} />
            
            </button> */}
            {User.length > 0 && User.map((user) => (
            <div key={user._id} className='flex items-start px-3 flex-col justify-center gap-0.5'>
              <Link to='/sidenote' className='md:text-3xl text-lg'>{user?.username}</Link>
              <Link to='/sidenote' className='md:text-lg text-xs text-zinc-400'>{user?.tagname}</Link>
              {!user.bio &&
              <p className='cursor-default md:text-sm text-xs text-zinc-400'>Question everything, understand what you can.</p>
              }
              {user.bio &&
              <p className='cursor-default md:text-sm text-xs text-orange-400'>{user?.bio}</p>
              }
            </div>
            ))
            }
          </div>
          {User.length > 0 && User.map((user) => (
          <div className='w-full h-1/2 py-2 px-3 flex items-center md:justify-evenly justify-between'>
          
          <div className='flex flex-col items-center justify-center gap-0.5'>
            <h1 className='md:text-2xl text-lg hover:scale-97 hover:text-zinc-300 cursor-pointer'>{(user?.posts).length}</h1>
            <h4 className='md:text-md text-xs text-zinc-400 cursor-default'>Posts</h4>
          </div>
          <div className='flex flex-col items-center justify-center gap-0.5'>
            <h1 className='md:text-2xl text-lg hover:scale-97 hover:text-zinc-300 cursor-pointer'>0</h1>
            <h4 className='md:text-md text-xs text-zinc-400 cursor-default'>Followers</h4>
          </div>
          <div className='flex flex-col items-center justify-center gap-0.5'>
            <h1 className='md:text-2xl text-lg hover:scale-97 hover:text-zinc-300 cursor-pointer'>0</h1>
            <h4 className='md:text-md text-xs text-zinc-400 cursor-default'>Following</h4>
          </div>
          
          </div>
          ))
           }

          <div className='w-full h-auto py-1.5'>
            <button onClick={() => setIsEditProfile(true)} className='hover:bg-zinc-900 flex hover:scale-98 active:bg-zinc-900 items-center justify-center gap-1  hover:text-zinc-100 cursor-pointer w-full rounded-4xl md:py-2.5 py-2 md:text-lg text-sm px-4 font-semibold border border-zinc-500 tracking-tight  active:border active:border-zinc-500 active:text-zinc-100'>Edit Profile</button>
          </div>
        </div>
{User.length > 0 && User.map((user) => (
  <>
    {isEditProfile && (
      <EditProfile handleProfileUpdate={handleProfileUpdate}
          initialData={{
            username: user.username,
            tagname: user.tagname,
            bio: user.bio
          }}
          onClose={() => setIsEditProfile(false)}
          onSave={handleProfileUpdate}
        />
      )}

      </>

    ))}
        
      <div className='mt-2 mb-2 w-full h-auto px-3 py-1.5'>
        <h1 className='md:text-2xl text-lg'>My Posts</h1>
      </div>

      <div className='Posts w-full h-auto lg:px-0 px-1 py-1.5 gap-5 flex flex-col justify-center items-start'>
        {User && Posts?.length > 0 && Posts.map((post) => {

          const isLiked = post.likes.some(
              (id) => id.toString() === User[0]._id.toString()
            );

            return(
        <div key={post?._id} className='eachPost rounded-md bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 active:bg-zinc-900 px-6 py-4 flex flex-col items-start gap-4 justify-center w-full'>

          <div className='flex items-center w-full justify-center gap-3'>
            <div className='flex items-center justify-start gap-3 w-full'>
            <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700 text-sm font-semibold text-zinc-200">
                    {getInitials(post?.authorName)}
            </div>
            <div className='flex items-center justify-center gap-2'>
              {User.length > 0 && User.map((user) => (
              <h1 className='md:text-sm text-xs text-emerald-500'>{user?.username} (You)</h1>
              ))
              }

              <p className='md:text-xs font-normal text-xs text-zinc-400'>• {formatTime(
               post.postedOn || post.createdAt
              )}</p>
            
            </div>
          </div>
          <div className='px-3 flex items-center justify-center'>

            <button onClick={() => {
              deletePost(post._id);
            }} className=' hover:scale-97 active:125 transition-transform duration-200 cursor-pointer text-red-500'><p className='md:text-sm text-xs'>Delete</p></button>
          </div>
          </div>

          <div onClick={() => {
          setisComment(true);
          setCmtPostId(post._id);
        }} className='h-auto w-full cursor-pointer flex items-center justify-start'>
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
            <button className='cursor-pointer hover:scale-97 active:scale-125' onClick={() => {
              setisComment(true);
              setCmtPostId(post._id);
            }}><FontAwesomeIcon icon={faCommentRegular}/></button>
            <h5 className='text-sm'>{(post.comments).length}</h5>
            </div>
          </div>
        </div>
        );
          })}

          

          {User && Posts?.length == 0 &&
          
          <div className='w-full flex items-center justify-center py-2 px-4 md:text-lg text-xs'>

            <h1 className='text-zinc-400'>No Posts Yet.</h1>

          </div>
          
          }
      </div>
      

  </div>

    </div>
    
    </>
  )
}

export default ProfileBody
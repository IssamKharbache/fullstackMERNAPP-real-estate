import React from 'react'
import {useSelector } from 'react-redux'
import {FaSignOutAlt} from 'react-icons/fa';

export default function Profile() {
  const {currentUser} = useSelector((state)=>state.user);
  return (
    
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-4xl text-center p-3 m-4'>Profile</h1>
      <form className='flex flex-col gap-4 '>
        <img src={currentUser.userAvatar} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-3' alt="avatare" />
        <input type="text" id='username' placeholder='Username' className='border p-3 rounded-lg shadow-lg' />
        <input type="email" id='email' placeholder='Email' className='border p-3 rounded-lg shadow-lg' />
        <input type="password" id='password' placeholder='Username' className='border p-3 rounded-lg shadow-lg' />
        <button  className='bg-green-800 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-50'>Update</button>
      </form>
      <div className='flex justify-between p-5'>
        <span className='text-red-700 cursor-pointer hover:opacity-80'>Delete Account</span>
       
      </div>
     
    </div>
  )
}



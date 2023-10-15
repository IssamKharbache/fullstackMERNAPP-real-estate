import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>SignUp</h1>
      <form className='flex flex-col gap-4 shadow-sm'>
        <input type="text" placeholder='Username here' className='border p-3 rounded-lg' id="username" />
        <input type="email" placeholder='Email here' className='border p-3 rounded-lg' id="username" />
        <input type="password" placeholder='Password here here' className='border p-3 rounded-lg' id="password" />
        <button  className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-75 disabled:opacity-40' >Sign up</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>already Have an account ?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700 font-bold'>Sign in</span>
        </Link>
      </div>
  
    </div>
  )
} 

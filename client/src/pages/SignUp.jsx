import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import {AiFillEyeInvisible ,AiFillEye} from 'react-icons/ai';
export default function SignUp() {
  const [formData,setFormData] = useState({});
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const [open , setOpen] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData(prevValue => ({ ...prevValue,  [e.target.id]: e.target.value}));
  }   
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await fetch('api/auth/signup',{
        method: "POST",
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        setError(data.message);
        setLoading(false);
        return;
  
      }setLoading(false);
      setError(null);
      navigate('/sign-in');
     
    } catch (error) {
      setLoading(false);
    }
   

  }
  const toggle = ()=>{
    setOpen(!open); 
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>SignUp</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 shadow-sm'>
        <input type="text" placeholder='Username here' className='border p-3 rounded-lg' id="username"  onChange={handleChange} />
        <input type="email" placeholder='Email here' className='border p-3 rounded-lg' id="email"   onChange={handleChange}/>
        <div className="relative flex flex-col gap-4">
         <input type={open ? 'text':'password'} id='password' placeholder='Password' className='border p-3 rounded-lg shadow-lg focus:outline-double relative' onChange={handleChange}  />
         <div className='text-2xl absolute top-3 right-5'>  
         {
          open ?  <AiFillEye className='cursor-pointer' onClick={toggle}/> : <AiFillEyeInvisible  className='cursor-pointer' onClick={toggle}/>  
         }
        
         
         </div>
       </div>
        <button disabled ={loading}  className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-75 disabled:opacity-40' >{loading ? "Loading..." : "Sign up"}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>already Have an account ?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700 font-bold'>Sign in</span>
        </Link>
      </div>
  {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
} 

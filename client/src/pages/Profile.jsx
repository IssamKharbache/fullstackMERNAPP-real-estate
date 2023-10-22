import React, { useState ,useEffect ,useRef} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import {FaPencilAlt , FaEye} from 'react-icons/fa';
import {AiFillEyeInvisible ,AiFillEye} from 'react-icons/ai'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from  'firebase/storage';
import { app } from '../firebase';
import  {updateUserStart,updateUserSuccess,updateUserFailure} from '../redux/user/userSlice.js';

export default function Profile() {

  /*
  firebasse storage rules 
  rules_version = '2';
// Craft rules based on data in your Firestore database
// allow write: if firestore.get(
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write : if
      request.resource.size <2 *1024 *1024 &&
      request.resource.contentType.matches('image/.*')
  }
  }
}
  */


  const fileRef = useRef(null);

  const {currentUser} = useSelector((state)=>state.user);
  const [file,setFile] = useState(undefined);
  const [filepercentage,setFilePercentage] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});

  const [open , setOpen] = useState(false);
  const dispatch = useDispatch();
 

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);

  const handleFileUpload = () =>{
const storage = getStorage(app);
const fileName = new Date().getTime() + file.name;
const storageRef = ref(storage,fileName);
const uploadTask = uploadBytesResumable(storageRef,file); 

uploadTask.on('state_changed',(snapshot)=>{
  const progress = (snapshot.bytesTransferred/snapshot.totalBytes) *100;
  setFilePercentage(Math.round(progress));
},
(error)=>{
setFileUploadError(true);
},
()=>{
  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
 setFormData({...formData,userAvatar:downloadURL});

  })
})
  }
//get form data
  const handleChange = (e) =>{
setFormData({...formData,
  [e.target.id]:e.target.value}
  );
  }
  const handleSubmit = (e) =>{
    e.preventDefault();
    dispatch(updateUserStart(formData));
  }
//submit update handler
  const submitHandler = async (e) =>{
      e.preventDefault();
      try {
        dispatch(updateUserStart());
        const res  = await fetch(`/api/user/update/${currentUser._id}`,{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(formData)
        });

        const data = await res.json();
        if(data.success === false){
          dispatch(updateUserFailure(data.message));
          return ;
        }
          dispatch(updateUserSuccess(data));

      } catch (error) {
        dispatch(updateUserFailure(error.message));
      }
  }
const toggle = ()=>{
  setOpen(!open); 
}
   return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-4xl text-center p-3 m-4'>Profile</h1>
      <form onSubmit={submitHandler} className='flex flex-col gap-4 '>
      <div className='flex p-5 max-w-lg mx-auto'>
        <input type="file"  ref={fileRef} accept='image/*' onChange={(e)=>setFile(e.target.files[0])}  hidden/>
          <img  onClick={()=>fileRef.current.click()} src={formData.userAvatar || currentUser.userAvatar} className='rounded-full h-24 w-24 object-cover cursor-pointer self
          -center mt-3' alt="avatare" />
          <FaPencilAlt onClick={()=>fileRef.current.click()} className='text-white-800 cursor-pointer' />
        </div>
        <p className=' text-sm self-center font-semibold '>
            {fileUploadError ?(
            <span className='text-red-700'>
              Error Image upload(Image must be less than 2mb)
            </span> ) :  filepercentage > 0 && filepercentage<100 ?
             (<span className='text-slate-700'>{`Uploading ${filepercentage}`}</span>) : (filepercentage ===100  ? <span className='text-green-700'>Image uploaded successfully</span>  : " " )}
             </p>
       <input type="text" id='username' defaultValue={currentUser.username} placeholder='Username' className='border p-3 rounded-lg shadow-lg focus:outline-double'  onChange={handleChange} />
       <input type="email" id='email' placeholder='Email' defaultValue={currentUser.email} className='border p-3 rounded-lg shadow-lg focus:outline-double' onChange={handleChange} />   
       <div className="relative flex flex-col gap-4">
         <input type={open ? 'text':'password'} id='password' placeholder='Password' className='border p-3 rounded-lg shadow-lg focus:outline-double relative' onChange={handleChange}  />
         <div className='text-2xl absolute top-3 right-5'>  
         {
          open ?  <AiFillEye className='cursor-pointer' onClick={toggle}/> : <AiFillEyeInvisible  className='cursor-pointer' onClick={toggle}/>  
         }
        
         
         </div>
       </div>
        <button  className='bg-green-800 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-50'>Update</button>
        <div className=' flex justify-between'>
          <p className=' text-red-500 font-semibold  cursor-pointer hover:opacity-80 center'>Delete Account</p>
          <p className=' text-red-500  font-semibold  cursor-pointer hover:opacity-80 '>Sign out</p>
        </div>
      </form>
      
    </div>
    
  )
}



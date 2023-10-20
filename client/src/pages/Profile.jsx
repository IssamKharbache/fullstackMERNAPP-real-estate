import React, { useState ,useEffect ,useRef} from 'react';
import {useSelector } from 'react-redux';
import {FaPencilAlt} from 'react-icons/fa';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from  'firebase/storage';
import { app } from '../firebase';

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
   return (
    
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-4xl text-center p-3 m-4'>Profile</h1>
      <form className='flex flex-col gap-4 '>
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
       
        <input type="text" id='username' placeholder='Username' className='border p-3 rounded-lg shadow-lg' />
        <input type="email" id='email' placeholder='Email' className='border p-3 rounded-lg shadow-lg' />
        <input type="password" id='password' placeholder='Password' className='border p-3 rounded-lg shadow-lg' />
        <button  className='bg-green-800 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-50'>Update</button>
       <button className=' text-red-500 rounded-lg p-3 cursor-pointer hover:opacity-80 center'>Delete Account</button>
      </form>
    
     
    </div>
  )
}



import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice.js";
import { Link, useNavigate } from "react-router-dom";

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

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filepercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  const [updatesuccess, setupdateSuccess] = useState(false);

  const [userlistings, setUserListings] = useState([]);
  const [showlistingserror, setShowListingsError] = useState(false);

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, userAvatar: downloadURL });
        });
      }
    );
  };
  //get form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //submit update handler
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setupdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data.message));
      navigate("/sign-in");
    } catch (error) {
      deleteUserFailure(error.message);
    }
  };
  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data.message));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };
  //hide/show password
  const toggle = () => {
    setOpen(!open);
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleDeleteListings = async (listingId) => {
    try {
      const res = await fetch(`api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-4xl text-center p-3 m-4">Profile</h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4 ">
        {updatesuccess ? (
          <p className="text-green-500 mx-auto h-10  font-bold">
            User updated successfully{" "}
          </p>
        ) : (
          ""
        )}

        <div className="flex p-5 max-w-lg mx-auto">
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            hidden
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.userAvatar || currentUser.userAvatar}
            className="rounded-full h-24 w-24 object-cover cursor-pointer self
          -center mt-3"
            alt="avatare"
          />
          <FaPencilAlt
            onClick={() => fileRef.current.click()}
            className="text-white-800 cursor-pointer"
          />
        </div>
        {error && (
          <p className="mt-7  mx-auto  h-10 text-center text-red-500 font-bold w-72 pt-2">
            {error}
          </p>
        )}

        <p className=" text-sm self-center font-semibold ">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload(Image must be less than 2mb)
            </span>
          ) : filepercentage > 0 && filepercentage < 100 ? (
            <span className="text-slate-700">{`Uploading ${filepercentage}`}</span>
          ) : filepercentage === 100 ? (
            <span className="text-green-700">Done uploading image</span>
          ) : (
            " "
          )}
        </p>
        <input
          type="text"
          id="username"
          defaultValue={currentUser.username}
          placeholder="Username"
          className="border p-3 rounded-lg shadow-lg focus:outline-double"
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg shadow-lg focus:outline-double"
          onChange={handleChange}
        />
        <div className="relative flex flex-col gap-4">
          <input
            type={open ? "text" : "password"}
            id="password"
            placeholder="Password"
            className="border p-3 rounded-lg shadow-lg focus:outline-double relative"
            onChange={handleChange}
          />
          <div className="text-2xl absolute top-3 right-5">
            {open ? (
              <AiFillEye className="cursor-pointer" onClick={toggle} />
            ) : (
              <AiFillEyeInvisible className="cursor-pointer" onClick={toggle} />
            )}
          </div>
        </div>
        <button
          disabled={loading}
          className="bg-blue-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                class="inline w-6 h-6 mr-2 text-gray-900 animate-spin dark:text-gray-900 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          ) : (
            "Update"
          )}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg text-center uppercase hover:opacity-95"
          to="/create-listing"
        >
          Create listing
        </Link>

        <div className=" flex justify-between">
          <p
            className=" text-red-500 font-semibold  cursor-pointer hover:opacity-80 center"
            onClick={handleDeleteUser}
          >
            Delete Account
          </p>
          <p
            onClick={handleSignout}
            className=" text-red-500  font-semibold  cursor-pointer hover:opacity-80 "
          >
            Sign out
          </p>
        </div>
        <button
          type="button"
          className="bg-slate-700 h-12 rounded-lg hover:opacity-80 text-white"
          onClick={handleShowListings}
        >
          Show Listings
        </button>
      </form>
      <p className="text-red-500">
        {showlistingserror ? "Error showing listings " : ""}
      </p>

      {userlistings && userlistings.length > 0 && (
        <div className="flex flex-col gap-4 p-3">
          <h1 className="text-center text-2xl font-semibold">Your Lisings</h1>
          {userlistings.map((listing) => (
            <div
              key={listing._id}
              className=" gap-3 border rounded-lg p-3 border-gray-500 flex justify-between items-center"
            >
              <Link to={`/listings/${currentUser._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  className="h-16 w-16 object-contain rounded-lg"
                ></img>
              </Link>
              <Link
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                to={`/listings/${currentUser._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleDeleteListings(listing._id)}
                  type="button"
                  className="text-red-500 hover:opacity-70 font-bold uppercase"
                >
                  delete
                </button>
                <button
                  type="button"
                  className="text-green-600 hover:opacity-70 uppercase font-bold"
                >
                  edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

export default function CreateListing() {
  //states to handle changes
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  // states to hundle errors and loading effect
  const [imagesUploadError, setImagesUploadError] = useState(false);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  //handling uplodading listing images
  const handleImageSubmit = (e) => {
    if (files.length > 0 && formData.imageUrls.length + files.length < 7) {
      setUploading(true);
      const promises = [];
      setImagesUploadError(false);

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImagesUploadError(false);
          setImageUploadSuccess(true);
          setImageUploadSuccess("Images uploaded successfully");
          setUploading(false);
        })
        .catch((err) => {
          setImagesUploadError("Image upload failed (2mb max per image)");
          setImageUploadSuccess(false);
          setUploading(false);
        });
    } else {
      setImagesUploadError("You can only upload 6 images per listing");
      setImageUploadSuccess(false);
      setUploading(false);
    }
  };

  const storeImage = async (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + image.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  //handle deleting image
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, ind) => ind !== index),
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="5"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Adress"
            className="border p-3 rounded-lg"
            id="adress"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-4" />
              <span className="font-semibold">Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-4" />
              <span className="font-semibold">Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-4" />
              <span className="font-semibold">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-4" />
              <span className="font-semibold">Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-4" />
              <span className="font-semibold">Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input
                type="number"
                min={1}
                className="focus:outline-none border border-gray-400 p-2 w-14 font-bold text-center rounded-lg"
                max={10}
                required
                defaultValue={1}
                id="bedrooms"
              />
              <p className="font-bold p-3">Beds</p>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                min={1}
                className="focus:outline-none border border-gray-400 p-2 w-14 font-bold text-center rounded-lg"
                max={10}
                required
                defaultValue={1}
                id="bedrooms"
              />
              <p className="font-bold p-1">Baths</p>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                min={0}
                className="focus:outline-none border border-gray-400 p-2 w-14 font-bold text-center rounded-lg"
                required
                id="bathrooms"
              />
              <div className="flex flex-col items-center">
                <p className="font-bold p-1">Regular Price</p>
                <span className="text-xs">($ / months)</span>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                min={0}
                className="focus:outline-none border border-gray-400 p-2 w-14 font-bold text-center rounded-lg"
                required
                id="regularprice"
              />
              <div className="flex flex-col items-center">
                <p className="font-bold p-1"> Discounted price</p>
                <span className="text-xs">($ / months)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4 ">
          {imagesUploadError ? (
            <p className="text-center text-red-500  pt-2">
              {imagesUploadError}
            </p>
          ) : (
            ""
          )}
          {imageUploadSuccess ? (
            <p className="text-green-500 pt-2">{imageUploadSuccess}</p>
          ) : (
            ""
          )}
          <p className="font-semibold">Images : </p>
          <span className="text-xs font-normal text-gray-600 ml-2">
            The first image will be the cover(max 6)
          </span>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-500 rounded-xl w-full"
              type="file"
              accept="image/*"
              multiple
              id="images"
            />

            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="bg-green-400 p-3 text-white rounded-lg hover:bg-green-500 uppercase justify-center hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="inline w-6 h-6 mr-2 text-gray-900 animate-spin dark:text-gray-900 fill-green-600"
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
                    <span class="sr-only">Loading...</span>
                  </svg>
                </div>
              ) : (
                "Upload"
              )}
            </button>
          </div>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listingimg"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-700 hover:opacity-60 uppercase p-2"
                >
                  Delete
                </button>
              </div>
            ))}

          <button className="p-3  bg-stone-700 text-white rounded-lg hover:bg-stone-500  ">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

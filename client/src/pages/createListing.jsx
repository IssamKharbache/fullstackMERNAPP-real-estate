export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create listing{" "}
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
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
          <p className="font-semibold">Images : </p>
          <span className="text-xs font-normal text-gray-600 ml-2">
            The first image will be the cover(max 6)
          </span>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-500 rounded-xl w-full"
              type="file"
              accept="/images/*"
              multiple
              id="images"
            />
            <button className="bg-green-400 p-3 text-white rounded-lg hover:bg-green-500 uppercase hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>
          <button className="p-3  bg-stone-700 text-white rounded-lg hover:bg-stone-500  ">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

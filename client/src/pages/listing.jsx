import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { Contact } from "../components/Contact.jsx";

import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaParking,
  FaChair,
  FaBath,
} from "react-icons/fa";

import "swiper/css/bundle";
import { useSelector } from "react-redux";

export default function ListingPage() {
  const params = useParams();
  SwiperCore.use([Navigation]);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorListing, setError] = useState("");

  const [contactForm, setContactForm] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/listing/getListingdata/${params.listingId}`
        );
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(true);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {errorListing && (
        <p className="text-center my-7 text-2xl text-red-700">
          Something went wrong!
        </p>
      )}
      {listing && !loading && !errorListing && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px] w-[max-width]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-4 gap-4">
            <p
              className={`w-full max-w-[200px] text-white text-center text-xl p-1 rounded-md ${
                listing.type === "rent" ? "bg-gray-700" : "bg-slate-800"
              }`}
            >
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </p>
            <p className="text-2xl flex uppercase">{listing.name}</p>

            {listing.offer ? (
              <div className="flex gap-2">
                <s className="w-full max-w-[200px] text-white text-center text-xl p-1 rounded-md bg-red-800">
                  ${listing.regularPrice}
                </s>
                <p className="w-full max-w-[200px] text-white text-center text-xl p-1 rounded-md bg-green-700">
                  ${listing.discountedPrice}
                </p>
              </div>
            ) : (
              <p className="w-full max-w-[200px] text-white text-center text-xl p-1 rounded-md bg-green-700">
                ${listing.regularPrice}
                {listing.type === "rent" && "/month"}
              </p>
            )}

            <p className="flex items-center mt-6 gap-4 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.adress}
            </p>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className=" text-sm whitespace-nowrap flex flex-wr gap-4 items-center sm:gap-6">
              <li className="flex items-center gap-1 font-semibold text-green-900  ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 font-semibold text-blue-800">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Bathrooms`
                  : `${listing.bathrooms} Bathroom`}
              </li>
              <li
                className={`flex items-center gap-1 font-semibold ${
                  listing.parking ? "text-green-800 " : "text-red-800"
                }`}
              >
                <FaParking className="text-lg" />
                {listing.parking ? "Parking Spot" : "No parking"}
              </li>
              <li
                className={`flex items-center gap-1 font-semibold ${
                  listing.furnished ? "text-green-800 " : "text-red-800"
                }`}
              >
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser &&
              !contactForm &&
              listing.userRef !== currentUser._id && (
                <button
                  type="button"
                  onClick={() => setContactForm(true)}
                  className="bg-emerald-700 text-white rounded-lg p-3 hover:opacity-80 font-bold"
                >
                  Contact owner
                </button>
              )}
            {contactForm && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
}

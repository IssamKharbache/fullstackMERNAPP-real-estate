import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Contact = ({ listing }) => {
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setOwner(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOwner();
  }, [listing.userRef]);

  const onchange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {owner && (
        <div className="flex flex-col gap-2">
          <p>
            Contact : <span className="font-semibold">{owner.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="w-full border border-gray-400 p-3 rounded-lg"
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onchange}
            placeholder="Contact with message here..."
          ></textarea>
          <Link
            to={`mailto:${owner.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-teal-800 text-white p-3 rounded-lg text-center hover:opacity-90 shadow-lg"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

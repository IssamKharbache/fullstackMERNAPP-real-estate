import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSignOutAlt } from "react-icons/fa";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-gray-700 shadow-lg ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-white">Real</span>
            <span className="text-gray-400">Esatate</span>
          </h1>
        </Link>

        <form className="bg-slate-100 p-2 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search...."
            className="bg-transparent focus:outline-none w-24 sm:w-64 md:54"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4 ">
          <Link to="/">
            <li className="font-poppins hidden sm:inline text-white  hover:text-gray-400">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden font-poppins sm:inline text-white hover:text-gray-400 ">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.userAvatar}
                alt="profile"
              />
            ) : (
              <li className="sm:inline font-poppins text-white hover:text-gray-400">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

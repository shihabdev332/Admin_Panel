import React from "react";
import Logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";

const Navbar = ({ token, setToken }) => {
  const handleToken = () => {
    setToken("");
  };
  return (
    <header className="border-b border-b-gray-600 w-full sticky top-0 left-0 z-50 bg-white">
      <div className="py-2 px-10 md:px-32 lg:px-40 flex items-center justify-between">
        <div className="">
          <Link to={"/"}>
            <img src={Logo} alt="logo" className="h-12 " />
            <p className="text-xs text-blue-600 uppercase px-3 font-bold">
              Admin Panel
            </p>
          </Link>
        </div>

        {token ? (
          <button
            onClick={handleToken}
            className="bg-black/80 text-white py-2 px-7 rounded-full hover:bg-black cursor-pointer ml-5"
          >
            Log Out
          </button>
        ) : (
          <button className="bg-black/80 text-white py-2 px-7 rounded-full hover:bg-black cursor-pointer ml-5">login</button>
        )}
      </div>
    </header>
  );
};

export default Navbar;

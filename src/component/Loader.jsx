import React from "react";
import { FiLoader } from "react-icons/fi";

const Loader = () => {
  return (
    <div className="text-orange-600 text-5xl py-40 w-full flex items-center justify-center">
      <FiLoader className="animate-spin"/>
      <p className="text-lg text-black font-medium tracking-wide mt-1">Loading...</p>
    </div>
  );
};

export default Loader;

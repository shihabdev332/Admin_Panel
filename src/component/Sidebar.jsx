import React from "react";
import { NavLink } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { CiCircleList } from "react-icons/ci";
import { FaBorderAll } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa6";
import { FcSalesPerformance } from "react-icons/fc";
const Sidebar = () => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-4 pl-2 md:pl-6">
        <NavLink
          to={"/add"}
          className="flex items-center justify-center md:justify-normal gap-3 border border-gray-400 border-r-0 py-2 px-3 bg-gray-100 hover:bg-black/80 hover:text-white duration-300"
        >
          <span className="inline-flex border border-gray-300 items-center rounded-full text-lg p-1">
            <IoMdAdd />
          </span>
          <p className="hidden md:inline-flex font-semibold">Add Items</p>
        </NavLink>
        <NavLink
          to={"/list"}
          className="flex items-center justify-center md:justify-normal gap-3 border border-gray-400 border-r-0 py-2 px-3 bg-gray-100 hover:bg-black/80 hover:text-white duration-300"
        >
          <span className="inline-flex border border-gray-300 items-center rounded-full text-lg p-1">
           <CiCircleList />
          </span>
          <p className="hidden md:inline-flex font-semibold">Product List </p>
        </NavLink>
        <NavLink
          to={"/order"}
          className="flex items-center justify-center md:justify-normal gap-3 border border-gray-400 border-r-0 py-2 px-3 bg-gray-100 hover:bg-black/80 hover:text-white duration-300"
        >
          <span className="inline-flex border border-gray-300 items-center rounded-full text-lg p-1">
            <FaBorderAll />
          </span>
          <p className="hidden md:inline-flex font-semibold">Orders</p>
        </NavLink>
       
        <NavLink
          to={"/user"}
          className="flex items-center justify-center md:justify-normal gap-3 border border-gray-400 border-r-0 py-2 px-3 bg-gray-100 hover:bg-black/80 hover:text-white duration-300"
        >
          <span className="inline-flex border border-gray-300 items-center rounded-full text-lg p-1">
            <FaUserCheck />
          </span>
          <p className="hidden md:inline-flex font-semibold">User Lists</p>
        </NavLink>

         <NavLink
          to={"/sales"}
          className="flex items-center justify-center md:justify-normal gap-3 border border-gray-400 border-r-0 py-2 px-3 bg-gray-100 hover:bg-black/80 hover:text-white duration-300"
        >
          <span className="inline-flex border border-gray-300 items-center rounded-full text-lg p-1">
           <FcSalesPerformance />
          </span>
          <p className="hidden md:inline-flex font-semibold">Total Sales</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

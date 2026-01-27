import React, { useState, useEffect } from "react";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import User from "./pages/User";
import Login from "./component/Login";
import TotalSales from "./pages/TotalSales";

const App = () => {
  // Initialize token from localStorage
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Sync token with localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <main className="w-full bg-gray-50 min-h-screen">
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar token={token} setToken={setToken} />
          <div className="flex w-full">
            {/* Sidebar Sidebar Section */}
            <div className="w-[18%] fixed min-h-screen border-r border-gray-400 shadow-2xl bg-white">
              <Sidebar />
            </div>

            {/* Main Content Section */}
            <div className="flex-1 px-5 py-2 ml-[18%]">
              <Routes>
                <Route path="/" element={<Home token={token} />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/order" element={<Orders token={token} />} />
                <Route path="/user" element={<User token={token} />} />
                <Route path="/sales" element={<TotalSales token={token} />} />
                <Route path="/add/:id?" element={<Add token={token} />} />
              </Routes>
              
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default App;

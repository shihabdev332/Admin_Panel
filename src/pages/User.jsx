import React, { useEffect, useState } from "react";
import { serverUrl } from "../../config";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../component/ui/Loader";
import Title from "../component/Title";
import { IoPersonAdd, IoMailOutline, IoKeyOutline } from "react-icons/io5";
import { FaTrash, FaUserEdit, FaUserCircle } from "react-icons/fa";
import NewUserForm from "../component/NewUserForm";

const Users = () => {
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("adminToken");

  const getUserList = async () => {
    if (!token) return toast.error("Admin not logged in!");
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/api/user/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response?.data?.success) setUsersList(response.data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  // ✅ Password Change Handler
  const handleChangePassword = async (email) => {
    const newPassword = window.prompt("Enter new password for " + email);
    if (!newPassword || newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters!");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${serverUrl}/api/user/change-password`,
        { email, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) toast.success("Password updated successfully!");
      else toast.error(response.data.message);
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed Remove User Logic (With Protection)
  const handleRemoveUser = async (user) => {
    // English Comment: Check if the user is an admin and if they are the only admin left
    const adminCount = usersList.filter((u) => u.isAdmin).length;
    
    if (user.isAdmin && adminCount <= 1) {
      return toast.error("Action Denied! At least one administrator must remain.");
    }

    const confirmRemoval = window.confirm(`Are you sure you want to remove ${user.name}?`);
    if (!confirmRemoval) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${serverUrl}/api/user/remove`,
        { _id: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.data?.success) {
        toast.success("User removed successfully");
        getUserList();
      }
    } catch (error) {
      toast.error("Failed to remove user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {isLoading && <Loader />}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Title>User Management</Title>
            <p className="text-gray-500 text-sm mt-1">Manage team roles and security settings.</p>
          </div>
          <button onClick={() => { setSelectedUser(null); setIsOpen(true); }} className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95">
            <IoPersonAdd className="text-lg" /> Add New User
          </button>
        </div>

        {usersList?.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-600 tracking-wider">User Details</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-600 tracking-wider hidden md:table-cell">Role</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {usersList.map((item) => (
                    <tr key={item?._id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 leading-none">{item?.name}</p>
                            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1.5"><IoMailOutline /> {item.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item?.isAdmin ? "bg-green-100 text-green-700 border border-green-200" : "bg-blue-100 text-blue-700 border border-blue-200"}`}>
                          {item?.isAdmin ? "Administrator" : "User Member"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          {/* English Comment: Password Change Button */}
                          <button onClick={() => handleChangePassword(item.email)} className="p-2 text-gray-400 hover:text-orange-600 bg-gray-50 hover:bg-orange-50 rounded-lg transition-all" title="Change Password">
                            <IoKeyOutline className="text-lg" />
                          </button>
                          <button onClick={() => { setSelectedUser(item); setIsOpen(true); }} className="p-2 text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-lg transition-all" title="Edit Profile">
                            <FaUserEdit className="text-lg" />
                          </button>
                          <button onClick={() => handleRemoveUser(item)} className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-all" title="Delete User">
                            <FaTrash className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100 mt-4">
            <IoPersonAdd className="text-5xl text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No users available</h3>
          </div>
        )}
      </div>

      <NewUserForm isOpen={isOpen} setIsOpen={setIsOpen} close={() => setIsOpen(false)} getUserList={getUserList} setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
    </div>
  );
};

export default Users;
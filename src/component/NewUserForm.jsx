import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import Input from "./ui/Input";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { serverUrl } from "../../config";


const NewUserForm = ({
  isOpen,
  setIsOpen,
  close,
  selectedUser,
  getUserList,
}) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (selectedUser) {
     setFormData({
       _id: selectedUser?._id || null,
      name: selectedUser?.name || "",
      email: selectedUser?.email || "",
      password: "",
     })
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    }
  }, [selectedUser]);
 

  const handleChange=(e)=>{
    const {name, value} =e.target;
    setFormData((prevData)=>({
      ...prevData, 
      [name]:value,
    }))
  };


  const handleAddOrUpdateUser=async(e)=>{
    e.preventDefault();
    try {
      let response;
      if(selectedUser){
        response=await axios.put(
          `${serverUrl}/api/user/update/${selectedUser?._id}`,
          formData
        )
      }else{
        response=await axios.post(`${serverUrl}/api/user/register`, formData)
      }

      const data = await response?.data;

      if(data?.success){
        toast.success(data?.message);
        setIsOpen(false);
        getUserList();
      }
    } catch (error) {
     console.log("User save error", error);
     toast.error(error?.response?.data?.message || "An error occurred")          
    }
  }


 

  return (
    <>
      {isOpen && (
        <div className="fixed w-full min-h-screen bg-black/70 top-0 left-0">
          <Dialog
            open={isOpen}
            as="div"
            onClose={close}
            className="relative z-10 focus:outline-none"
          >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel className="w-full max-w-xl items-center justify-center shadow-lg shadow-orange-300 rounded-lg px-10 py-5 bg-white">
                  <div className="flex items-center justify-between ">
                    <DialogTitle>
                      {selectedUser ? "Edit user" : "Add User"}
                    </DialogTitle>
                    <IoMdClose
                      onClick={() => setIsOpen(false)}
                      className="text-lg hover:text-red-600 duration-300 cursor-pointer"
                    />
                  </div>

                  <div className="mt-3">
                    <form onSubmit={handleAddOrUpdateUser} className="flex flex-col gap-5">
                      <div className="flex flex-col gap-5">
                        <label htmlFor="name">Your Name</label>
                        <Input
                          id="name"
                          type="text"
                          name="name"
                          placeholder="Your Name"
                          onChange={handleChange}
                          value={formData.name}
                        />
                      </div>
                       <div className="flex flex-col gap-5">
                        <label htmlFor="email">Your Email</label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          placeholder="Enter Email"
                          onChange={handleChange}
                          value={formData.email}
                        />
                      </div>
                       <div className="flex flex-col gap-5">
                        <label htmlFor="password">Enter Password</label>
                        <Input
                          id="password"
                          type="password"
                          name="password"
                          placeholder="Enter Password"
                          onChange={handleChange}
                          value={formData.password}
                        />
                      </div>
                     <button type="submit" className="bg-black/80 py-2  hover:bg-black text-white cursor-pointer ">Submit</button>
                    </form>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default NewUserForm;

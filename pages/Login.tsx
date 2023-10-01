import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { login } from '../slice/authSlice';
import {AiFillCaretLeft} from "react-icons/ai"

function Login() {
    const router = useRouter();
    const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("https://ams-back.vercel.app/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(login({ token: data.token, role: data.role, email:data.email, department:data.department }));
        toast.success("Login Successful!");
        if (data.role === 'head') {
            router.push('/GetAttendance');
          } else {
            router.push('/AddAttendace');
          }
    } else {
      console.error("Login failed");
      toast.error("Login Failed!")
    }
  };
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#009FF8]">
       <div className="flex justify-center px-5 py-4 bg-[#009FF8] space-x-4">
        <Link href="/" className="flex bg-[#009FF8]  space-x-4">
        <img
            className=" h-8 w-auto"
            src="https://blogger.googleusercontent.com/img/a/AVvXsEjmL38K-8tCjcNKGjvAGHeVHkyN8t1lo68bXI2oqe2WVp8RVuF9ombU-79T9guiG2Z4FRk18nhzTWz5-ZkPpy993uWl7D59MyfLyfz0I5d4fKH2XuKhSC0h9SqofVdxzM-lplb8s_pCCZk3sUyccrZEL3uWAkliNXGUWWX_uCg6txRFRASiN-24sUvaUT0"
            alt="Workflow"
          />
        <p className="font-semibold text-white text-xl"> JEC-AMS</p>
        </Link>
      </div>
      <div className="sm:mx-auto  mx-5 mt-1 flex justify-between sm:w-full sm:max-w-md">
        <Link href="/">
      <AiFillCaretLeft className="text-2xl text-white" />
      </Link>
          <h2 className="mb-8  text-center text-xl font-serif font-semibold text-white">Login here!</h2>
         <p></p>
        </div>
        </div>
        <div className="min-h-full bg-white  example2 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className=" mx-8 rounded-md py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </div>
    <div className=""> <p className="text-center">Don’t have an account? <Link href="/Register"> <p className=" pt-5 text-blue-800 font-semibold">Sign up!</p></Link></p>   </div>   
          </form>
          <ToastContainer />
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
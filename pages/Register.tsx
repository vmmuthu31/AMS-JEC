import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    department: "",
    role: "faculty",
    secretCode:"",
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
    const response = await fetch("https://ams-back.vercel.app/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast.success("Signup Successfull Please Login!")
    
    
    } else {
      console.error("Sign-in failed");
      toast.error("Signup Failed!")
    }
  };
  return (
    <div>
       <div className="flex px-5 py-4 bg-black space-x-4">
      <img
            className=" h-8 w-auto"
            src="https://blogger.googleusercontent.com/img/a/AVvXsEjmL38K-8tCjcNKGjvAGHeVHkyN8t1lo68bXI2oqe2WVp8RVuF9ombU-79T9guiG2Z4FRk18nhzTWz5-ZkPpy993uWl7D59MyfLyfz0I5d4fKH2XuKhSC0h9SqofVdxzM-lplb8s_pCCZk3sUyccrZEL3uWAkliNXGUWWX_uCg6txRFRASiN-24sUvaUT0"
            alt="Workflow"
          />
        <p className="font-semibold text-white text-xl"> JEC-AMS</p>
      </div>
        <div className="min-h-full flex flex-col justify-center pb-5 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          
          <h2 className="mt-2 text-center text-2xl font-serif font-bold text-gray-900">Sign up here!</h2>
         
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-400 mx-8 rounded-md py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
              <label htmlFor="department" className="block text-sm font-medium text-black">
                Department
              </label>
              <div className="mt-1">
                <input
                  id="department"
                  name="department"
                  type="text"
                  autoComplete="department"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
    <label htmlFor="role" className="block text-sm font-medium text-black">
        Faculty/HOD
    </label>
    <div className="mt-1">
    <select
    id="role"
    name="role"
    autoComplete="role"
    required
    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    value={formData.role}
    onChange={handleInputChange}
>
    <option value="" disabled>Select Role</option> {/* Add this line */}
    <option value="faculty">Faculty</option>
    <option value="head">HOD</option>
</select>
    </div>
</div>

{/* Conditionally render secret code input based on role */}
{formData.role === 'head' && (
    <div className="mt-4">
        <label htmlFor="secretCode" className="block text-sm font-medium text-black">
            Secret Pin
        </label>
        <div className="mt-1">
            <input
                id="secretCode"
                name="secretCode"
                type="text"
                autoComplete="off"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.secretCode || ''}
                onChange={handleInputChange}
            />
        </div>
    </div>
)}


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
                Sign up
              </button>
            </div>
           <Link href="/Login"> <p className="flex justify-end pt-5 text-blue-800 font-semibold">Existing User?</p></Link>
          </form>
          <ToastContainer />
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
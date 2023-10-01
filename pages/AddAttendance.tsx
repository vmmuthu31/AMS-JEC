import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux'; 
import 'react-toastify/dist/ReactToastify.css';

function AddAttendace() {
    const router = useRouter();
    const currentDate = new Date().toISOString().split('T')[0];
    const token = useSelector(state => state.auth.token); 
    const department = useSelector(state => state.auth.department); 
    console.log(token)
    const initialFormData = {
      "date": currentDate,
      "class": "",
      "total": "",
      "department":department,
      "present": "",
      "year": "1",
      "absentees": "",
      "absent": "",
  };
    const [formData, setFormData] = useState(initialFormData);

  const absent= formData.total - formData.present;
  formData.absent = absent.toString();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("https://ams-back.vercel.app/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast.success("Uploaded the attendance!")
      setFormData(initialFormData);
      router.push("/Dashboard")
    } else {
      console.error(" failed");
      toast.error("Submit all details!")
    }
  };
  return (
    <div>
      <div className="flex px-5 py-4 bg-[#009FF8] space-x-4">
      <Link href="/Dashboard" className="flex mx-auto bg-[#009FF8] space-x-4">
      <img
            className=" h-8 w-auto"
            src="https://blogger.googleusercontent.com/img/a/AVvXsEjmL38K-8tCjcNKGjvAGHeVHkyN8t1lo68bXI2oqe2WVp8RVuF9ombU-79T9guiG2Z4FRk18nhzTWz5-ZkPpy993uWl7D59MyfLyfz0I5d4fKH2XuKhSC0h9SqofVdxzM-lplb8s_pCCZk3sUyccrZEL3uWAkliNXGUWWX_uCg6txRFRASiN-24sUvaUT0"
            alt="Workflow"
          />
        <p className="font-semibold text-white pt-1 text-xl"> JEC-AMS</p>
        </Link>
      </div>
        <div className="min-h-full flex flex-col justify-center pb-5 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md"> 
          <h2 className="mt-4 text-center text-xl font-serif  text-blue-400">Please select the Year and update your department  attendance for today.</h2>
        </div>
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-400 mx-8 rounded-md py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
    <label htmlFor="year" className="block text-sm font-medium text-black">
        Year
    </label>
    <div className="mt-1">
    <select
    id="year"
    name="year"
    autoComplete="year"
    required
    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    value={formData.year}
    onChange={handleInputChange}
>
    <option value="" disabled>Select Year</option> {/* Add this line */}
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
</select>
    </div>
</div>
<div>
    <label htmlFor="class" className="block text-sm font-medium text-black">
        Section
    </label>
    <div className="mt-1">
    <input
                  id="class"
                  name="class"
                  type="text"
                  autoComplete="class"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.class}
                  onChange={handleInputChange}
                />
    </div>
</div>

            <div>
              <label htmlFor="class" className="block text-sm font-medium text-black">
              Total Students *
              </label>
              <div className="mt-1">
                <input
                  id="total"
                  name="total"
                  type="number"
                  autoComplete="total"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.total}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="present" className="block text-sm font-medium text-black">
              Students Present  *
              </label>
              <div className="mt-1">
                <input
                  id="present"
                  name="present"
                  type="number"
                  autoComplete="present"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.present}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="absentees" className="block text-sm font-medium text-black">
              Absentees Number *
              </label>
              <div className="mt-1">
                <input
                  id="absentees"
                  name="absentees"
                  type="text"
                  autoComplete="absentees"
                  required
                  className="appearance-none h-20 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.absentees}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              Absentee Count:{formData.total - formData.present}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Upload
              </button>
            </div>
           </form>
          <ToastContainer />
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddAttendace
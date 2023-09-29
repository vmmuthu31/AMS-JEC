"use client"
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'; 

function GetAttendance() {
  
      const [attendance, setAttendance] = useState([]);
      const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
      const token = useSelector(state => state.auth.token); 
      useEffect(() => {
        // Fetch data on component mount
        fetch("https://ams-back.vercel.app//attendance?date=" + selectedDate, {
            headers: {
                'Authorization': token 
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                setAttendance(data);
            } else {
                console.error("Received data is not an array:", data);
            }
        })
        .catch(error => {
            console.error("Error fetching attendance:", error);
        });
    }, [selectedDate]); // Refetch when selectedDate changes
    
    const groupedAttendance = attendance.reduce((acc, record) => {
        if (!acc[record.year]) {
            acc[record.year] = [];
        }
        acc[record.year].push(record);
        return acc;
    }, {});
      const handleDateChange = (e) => {
          setSelectedDate(e.target.value);
      };
  return (
    <div className="flex flex-col">
            <div className="flex space-x-3 px-5 py-4 bg-black">
                <img
                    className="h-8 w-auto"
                    src="https://blogger.googleusercontent.com/img/a/AVvXsEjmL38K-8tCjcNKGjvAGHeVHkyN8t1lo68bXI2oqe2WVp8RVuF9ombU-79T9guiG2Z4FRk18nhzTWz5-ZkPpy993uWl7D59MyfLyfz0I5d4fKH2XuKhSC0h9SqofVdxzM-lplb8s_pCCZk3sUyccrZEL3uWAkliNXGUWWX_uCg6txRFRASiN-24sUvaUT0"
                    alt="Workflow"
                />
                <p className="font-semibold text-white text-xl ">JEC-AMS</p>
            </div>
            <div className='flex justify-end pt-3 space-x-2'>
            <label className='text-lg' htmlFor="dateSelect">Select Date: </label>
            <input 
    type="date" 
    id="dateSelect" 
    value={selectedDate} 
    onChange={handleDateChange}
/>

            </div>
            <div className="p-4">
            <div  className="">
                <h2 className="text-center text-2xl font-serif font-bold text-gray-900 mb-4">Today's Attendance</h2>
                {Object.entries(groupedAttendance).map(([year, records]) => (
                     <div key={year} className="my-6">
                     <h3 className="text-lg font-serif font-bold mb-4">{`Year ${year} Attendance`}</h3>
            
                    <table className="min-w-full px-10 divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
              
                  <th
                    scope="col"
                    className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Section
                  </th>
                  <th
                    scope="col"
                    className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Present
                  </th>
                  <th
                    scope="col"
                    className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Absent
                  </th>
                  {/* <th
                    scope="col"
                    className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Absentees
                  </th> */}
                  <th
                    scope="col"
                    className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Percentage
                  </th>
                 
                </tr>
              </thead>
              <tbody className="bg-white text-center divide-y divide-gray-200">
              {records.map(record => (
    <tr key={record._id}>
       
        <td className="px-1 py-4 text-center whitespace-nowrap text-sm text-gray-500">{record.class}</td>
        <td className="px-1 py-4 text-center whitespace-nowrap text-sm text-gray-500">{record.present}</td>
        <td className="px-1 py-4 text-center whitespace-nowrap text-sm text-gray-500">{record.absent}</td>
        {/* If absentees property isn't present in the record, you might want to comment this out or handle it differently */}
        {/* <td className="px-1 py-4 whitespace-nowrap  text-center  text-sm  text-gray-500">{record.absentees}</td> */}
        <td className={`px-1 py-4 whitespace-nowrap text-sm font-bold text-center ${(record.present / record.total) * 100 < 50 ? 'text-red-800' : 'text-green-800'}`}>
    {((record.present / record.total) * 100).toFixed(2)}%
</td>


    </tr>
))}

              </tbody>
            </table>
            </div>
            ))}

    </div>    
    </div>
    </div>
  )
}

export default GetAttendance
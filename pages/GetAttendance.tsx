"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'; 

function GetAttendance() {
  
      const [attendance, setAttendance] = useState([]);
      const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
      const token = useSelector(state => state.auth.token); 
      useEffect(() => {
        // Fetch data on component mount
        fetch("https://ams-back.vercel.app/api/attendance?date=" + selectedDate, {
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
    
    const groupedAttendanceByDepartment = attendance.reduce((acc, record) => {
      if (!acc[record.department]) {
          acc[record.department] = {};
      }
      if (!acc[record.department][record.year]) {
          acc[record.department][record.year] = [];
      }
      acc[record.department][record.year].push(record);
      return acc;
  }, {});
  const aggregateDataByDepartment = Object.entries(groupedAttendanceByDepartment).reduce((acc, [department, yearRecords]) => {
    acc[department] = { total: 0, present: 0, absent: 0 };
    Object.values(yearRecords).forEach(records => {
      records.forEach(record => {
        acc[department].total += record.total;
        acc[department].present += record.present;
        acc[department].absent += record.absent;
      });
    });
    return acc;
  }, {});

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
};

  return (
    <div className="flex flex-col">
           <div className="flex px-5 py-4 bg-[#009FF8] space-x-4">
      <Link href="/Dashboard" className="flex mx-auto  bg-[#009FF8] space-x-4">
                <img
                    className="h-8 w-auto"
                    src="https://blogger.googleusercontent.com/img/a/AVvXsEjmL38K-8tCjcNKGjvAGHeVHkyN8t1lo68bXI2oqe2WVp8RVuF9ombU-79T9guiG2Z4FRk18nhzTWz5-ZkPpy993uWl7D59MyfLyfz0I5d4fKH2XuKhSC0h9SqofVdxzM-lplb8s_pCCZk3sUyccrZEL3uWAkliNXGUWWX_uCg6txRFRASiN-24sUvaUT0"
                    alt="Workflow"
                />
                <p className="font-semibold text-white text-xl ">JEC-AMS</p>
                </Link>
            </div>
            <h2 className="mt-4 text-center text-xl font-serif  text-blue-400">You can view the Entire Department&apos;s Attendance here.</h2>
            <div className='flex justify-end pt-3 space-x-2 px-3'>
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
               
                {Object.entries(groupedAttendanceByDepartment).map(([department, yearRecords]) => (

<div key={department} className="">

<h3 className="text-lg font-serif font-bold mb-4">{`Department: ${department}`}</h3>
{Object.entries(yearRecords).map(([year, records]) => (
  <div key={year} className="my-6">
    <h4 className="text-md font-serif font-semibold mb-4">{`Year ${year} Attendance`}</h4>
            
                  
          
              
              {records.map(record => (
    <div key={record._id}>
       <div className=" border rounded-2xl mb-3 border-blue-400 text-center ">

        <div className='flex justify-between mx-5'>
        <p className="px-1 py-2 font-bold text-left text-sm text-gray-800">Total Number of Students-{record.total}</p>
        <p className={`px-1 py-2 whitespace-nowrap text-sm font-bold text-center ${
  (record.present / record.total) * 100 < 50 
    ? 'text-red-800' 
    : (record.present / record.total) * 100 < 75 
      ? 'text-orange-800' 
      : 'text-green-800'
}`}>
  {((record.present / record.total) * 100).toFixed(2)}%
</p>

        </div>
        <div className='flex justify-center'>
        <p className="px-1 py-2 font-bold text-left mx-4 text-sm text-gray-800">No. OF PRESENT-{record.present}</p>
        <p className="px-1 py-2 font-bold text-left mx-4 text-sm text-gray-800">NO. OF ABSENT-{record.absent}</p>
        </div>
        <p className=" text-left font-bold whitespace-nowrap text-md mx-5 text-gray-800">Absentees Roll Numbers:-</p>
        <p className="px-1 py-2 text-center text-sm text-red-600 font-bold underline">{record.absentees}</p>
        {/* If absentees property isn't present in the record, you might want to comment this out or handle it differently */}
        {/* <td className="px-1 py-4 whitespace-nowrap  text-center  text-sm  text-gray-500">{record.absentees}</td> */}
        
</div>
    </div>
))}


              </div>
          
           
            ))}
            <div className=" mb-3  text-center ">
              <p className="px-1 py-1 font-bold text-left text-sm text-gray-800">Total Number of Students in Department: {aggregateDataByDepartment[department].total}</p>
              <p className="px-1 py-1 font-bold text-left text-sm text-gray-800">Total Present: {aggregateDataByDepartment[department].present}</p>
              <p className="px-1 py-1 font-bold text-left text-sm text-gray-800">Total Absent: {aggregateDataByDepartment[department].absent}</p>
              <p className={`px-1 py-1 whitespace-nowrap text-sm font-bold text-left ${
                (aggregateDataByDepartment[department].present / aggregateDataByDepartment[department].total) * 100 < 50
                  ? 'text-red-800'
                  : (aggregateDataByDepartment[department].present / aggregateDataByDepartment[department].total) * 100 < 75
                    ? 'text-orange-800'
                    : 'text-green-800'
              }`}>
          Department Percentage      {((aggregateDataByDepartment[department].present / aggregateDataByDepartment[department].total) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        ))}

    </div>   
     
    </div>
    </div>
  )
}

export default GetAttendance
"use client";
import { useState } from "react";
import Image from "next/image";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Navbar from "../components/Navbar";

export default function Schedule() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [status, setStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
  
    console.log("Submitting form data:", data); // Debugging Step
    try {
      const response = await fetch("/api/sendTicket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      console.log("API Response Status:", response.status); // Debugging Step 2
      const responseData = await response.json();
      console.log("API Response Data:", responseData); // Debugging Step 3

      
      if (response.ok) {
        setStatus("success");
        event.target.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setStatus("error");
    }
  };

  const handleDayClick = (value) => {
    const eventTitle = prompt("Enter event name:");
    if (eventTitle) {
      setEvents((prev) => ({
        ...prev,
        [value.toDateString()]: eventTitle,
      }));
    }
  };

  return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar/>
        <section className="relative w-full h-[300px] flex items-center justify-center bg-gray-800">
          <div className="absolute inset-0">
            <Image
                src="/team.png"
                alt="Team"
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
            />
          </div>
          <h1 className="relative z-10 text-4xl font-bold text-white">SCHEDULE</h1>
        </section>

        <section className="max-w-5xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-center text-xl font-semibold mb-4">Select a Date</h2>
          <div className="flex justify-center">
            <Calendar
                onChange={setDate}
                value={date}
                onClickDay={handleDayClick}
                tileContent={({date, view}) =>
                    view === "month" && events[date.toDateString()] ? (
                        <p className="text-xs bg-green-200 text-green-800 p-1 mt-1 rounded">
                          {events[date.toDateString()]}
                        </p>
                    ) : null
                }
            />
          </div>
        </section>

        <section className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-green-700 mb-4">REQUESTING HOURS/TIMEOFF</h2>
          <p className="text-sm text-gray-600 mb-4">
            When submitting a time-off request, please note that if it is made with short notice, it may not be
            approved.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">REQUEST TYPE</label>
                <select name="requestType" className="w-full mt-1 p-2 border rounded">
                  <option>Time-on/Time-off</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">DATE(S)</label>
                <input name="dates" type="text" placeholder="mm/dd/yyyy" className="w-full mt-1 p-2 border rounded"/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">REASON</label>
              <textarea name="reason" className="w-full mt-1 p-2 border rounded" rows="3"></textarea>
            </div>
            <button type="submit" className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-600 w-full">
              SUBMIT REQUEST
            </button>
          </form>

          {status === "success" && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
                Your request has been sent successfully!
              </div>
          )}
          {status === "error" && (
              <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
                An error occurred while sending your request. Please try again.
              </div>
          )}
        </section>

        <section className="max-w-5xl mx-auto mt-12 bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold text-green-700">PAYCHECKS AND PAYSTUBS</h2>
          <p className="text-sm text-gray-600 mt-2">
            HRDC provides a secure portal for employees to view paystubs and track payment history.
          </p>
          <h2 className="text-xl font-semibold text-green-700">
            NOTICE: THIS FEATURE IS UNAVAILABLE UNTIL WE RECEIVE THE HRDC TIMESHEET FROM KRISTA
          </h2>
          <button className="bg-teal-700 text-white px-4 py-2 mt-4 rounded hover:bg-teal-600">
            GO TO PORTAL
          </button>
        </section>

        <footer className="w-full bg-gray-900 text-white text-center py-4 mt-auto"
                style={{backgroundColor: "var(--secondary-blue)"}}>
          <p className="text-[10px]">&copy; 2025 HRDC, INC. ALL RIGHTS RESERVED</p>
        </footer>
      </div>
  );
}


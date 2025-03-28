import React, { useState } from "react";
import Image from "next/image";

export default function Support() {
  const [status, setStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
  
    try {
      const response = await fetch("/api/sendTicket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
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
  

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <div className="relative w-full h-90">
        {/* Background Image */}
        <Image
          src="/tech.png" // Make sure the file is inside the "public" folder
          alt="Support"
          fill // replaces layout="fill"
          className="object-cover"
          priority
        />
        
        {/* Overlay */}
        <div className="absolute inset-0  flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">SUPPORT</h1>
        </div>
      </div>

      {/* Support Form Section */}
      <div className="w-full max-w-3xl p-6 text-center">
        <h2 className="text-2xl font-semibold text-green-700">TECHNICAL DIFFICULTIES?</h2>
        <p className="text-gray-700 mt-4">
          Need a hand? Our dedicated tech support team is here to help you with any issues—whether it’s accessing your paychecks, navigating or accessing the HRDC portal, or anything else. No problem is too big or small; we’ll work quickly and help solve your issues.
        </p>

        <form className="mt-6 flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input type="text" name="issue" placeholder="ISSUE" className="border p-3 w-full rounded-md" required />
          <input type="email" name="email" placeholder="EMAIL" className="border p-3 w-full rounded-md" required />
          <textarea name="message" placeholder="MESSAGE" className="border p-3 w-full rounded-md h-32" required />
          <button type="submit" className="bg-green-700 text-white py-3 px-6 rounded-md hover:bg-green-800">
            SEND TICKET
          </button>
        </form>

        {status === "success" && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
            Your ticket has been sent successfully!
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
            An error occurred while sending your ticket. Please try again.
          </div>
        )}
      </div>

      {/* Offices Section */}
      <div className="w-full bg-green-900 text-white py-12 mt-12">
        <h2 className="text-center text-2xl font-semibold mb-8">OFFICES</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
          <div>
            <h3 className="font-bold">BOZEMAN</h3>
            <p>32 S. Tracy Ave, Bozeman, MT 59715</p>
            <p>Phone: 406.587.4486 (Relay 711)</p>
            <p><a href="mailto:HELLO@THEHRDC.ORG" className="underline">HELLO@THEHRDC.ORG</a></p>
          </div>
          <div>
            <h3 className="font-bold">LIVINGSTON</h3>
            <p>121 S. 2nd St., Livingston, MT 59047</p>
            <p>Phone: 406.333.2537 (Relay 711)</p>
            <p><a href="mailto:HELLO.LIVINGSTON@THEHRDC.ORG" className="underline">HELLO.LIVINGSTON@THEHRDC.ORG</a></p>
          </div>
          <div>
            <h3 className="font-bold">WHITE SULFUR SPRINGS</h3>
            <p>107 E. Main St./P.O. Box 327, White Sulphur Springs, MT 59645</p>
            <p>Phone: 406.547.3775 (Relay 711)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

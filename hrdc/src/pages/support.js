"use client";
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
    <div className="flex flex-col items-center w-full bg-gray-100 min-h-screen">

      <div className="relative w-full h-64 md:h-96">
        <Image
          src="/tech-support.jpg"
          alt="Support"
          fill
          className="object-cover"
          priority
        />
        {/* Film overlay with white text box */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white/60 backdrop-brightness-75 w-[550px] h-[150px] flex items-center justify-center">
            <h1
              className="text-[44px] font-bold text-black"
              style={{ fontFamily: '"Gotham", Helvetica' }}
            >
              SUPPORT
            </h1>
          </div>
        </div>
      </div>

      <div className="bg-[var(--primary)] text-white py-4 px-6 rounded-t-lg text-center w-full max-w-3xl mt-12">
        <h2 className="text-2xl font-bold tracking-wide">TECHNICAL DIFFICULTIES?</h2>
      </div>

      <section className="w-full max-w-3xl px-6 py-8 bg-white rounded-b-lg shadow-md">
        <p className="text-gray-700 mb-6 text-center">
          Need a hand? Our dedicated tech support team is here to help you with any issues—whether it’s accessing your paychecks, navigating or accessing the HRDC portal, or anything else. No problem is too big or small; we’ll work quickly and help solve your issues.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ISSUE
            </label>
            <input
              type="text"
              name="issue"
              placeholder="Describe the issue"
              className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              MESSAGE
            </label>
            <textarea
              name="message"
              placeholder="Tell us more about the problem..."
              className="w-full border border-gray-300 p-3 rounded h-32 focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--primary)] text-white font-semibold py-3 rounded hover:bg-[var(--secondary-blue)] transition-colors"
          >
            SEND TICKET
          </button>
        </form>

        {status === "success" && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md text-center">
            Your ticket has been sent successfully!
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md text-center">
            An error occurred while sending your ticket. Please try again.
          </div>
        )}
      </section>

      <section className="w-full bg-[var(--secondary-gold)] text-white py-12 mt-16">
        <h2 className="text-center text-[42px] font-semibold mb-8">OFFICES</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto px-4">
          <div>
            <h3 className="font-bold">BOZEMAN</h3>
            <p>32 S. Tracy Ave, Bozeman, MT 59715</p>
            <p>Phone: 406.587.4486 (Relay 711)</p>
            <p>
              <a href="mailto:HELLO@THEHRDC.ORG" className="underline">
                HELLO@THEHRDC.ORG
              </a>
            </p>
          </div>
          <div>
            <h3 className="font-bold">LIVINGSTON</h3>
            <p>121 S. 2nd St., Livingston, MT 59047</p>
            <p>Phone: 406.333.2537 (Relay 711)</p>
            <p>
              <a href="mailto:HELLO.LIVINGSTON@THEHRDC.ORG" className="underline">
                HELLO.LIVINGSTON@THEHRDC.ORG
              </a>
            </p>
          </div>
          <div>
            <h3 className="font-bold">WHITE SULPHUR SPRINGS</h3>
            <p>107 E. Main St./P.O. Box 327, White Sulphur Springs, MT 59645</p>
            <p>Phone: 406.547.3775 (Relay 711)</p>
          </div>
        </div>
      </section>
    </div>
  );
}

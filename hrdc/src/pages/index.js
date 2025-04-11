"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { getUserRole, USER_ROLES } from "./api/user-management";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebookF } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const role = await getUserRole(user.uid);
        setUserRole(role);
      }
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = userRole === USER_ROLES.ADMIN;

  return (
    <div className="min-h-screen flex flex-col items-center bg-[var(--whitebg-color)] text-[var(--black)]">

      <div className="relative w-full h-64 md:h-96">
        <Image
          src="/bzn.jpg"
          alt="Quick Links Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white/60 backdrop-brightness-75 w-[550px] h-[150px] flex items-center justify-center">
            <h1
              className="text-[44px] font-bold text-black"
              style={{ fontFamily: '"Gotham", Helvetica' }}
            >
              QUICK LINKS
            </h1>
          </div>
        </div>
      </div>

      <section className="mt-12 w-full max-w-xl shadow-md rounded-lg overflow-hidden">
        <div className="bg-[var(--secondary-gold)] px-6 py-8 space-y-4">
          <button className="block w-full py-2 rounded-lg text-lg font-medium bg-[var(--primary)] text-white transition hover:bg-[var(--secondary-blue)]">
            Important Files
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="block w-full py-2 rounded-lg text-lg font-medium bg-[var(--primary)] text-white transition hover:bg-[var(--secondary-blue)]"
            >
              Modify Documents
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 w-full mt-1 rounded-md shadow-lg border border-[var(--secondary-blue)] bg-white text-[var(--black)]">
                {["Create", "Edit", "Delete"].map((action, index) => (
                  <button
                    key={index}
                    className="block w-full text-left px-4 py-2 hover:bg-[var(--faded-white-for-cards)]"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/profile" className="block">
            <button className="block w-full py-2 rounded-lg text-lg font-medium bg-[var(--primary)] text-white transition hover:bg-[var(--secondary-blue)]">
              User Privileges
            </button>
          </Link>

          <Link href="/directory" className="block">
            <button className="block w-full py-2 rounded-lg text-lg font-medium bg-[var(--primary)] text-white transition hover:bg-[var(--secondary-blue)]">
              Document Directory
            </button>
          </Link>

          <Link href="/announcements" className="block">
            <button className="block w-full py-2 rounded-lg text-lg font-medium bg-[var(--primary)] text-white transition hover:bg-[var(--secondary-blue)]">
              Announcements
            </button>
          </Link>
        </div>
      </section>

      <section className="mt-16 w-full max-w-xl bg-white rounded-lg shadow-md px-6 py-8 text-center">
        <h3 className="text-3xl font-extrabold text-[var(--primary)] mb-4 tracking-wide">
          SUPPORT OUR SOCIALS
        </h3>
        <p className="text-sm text-gray-700 mb-6">
          Stay connected with HRDC! Follow us for updates, announcements, and community highlights.
        </p>
        <div className="flex justify-center space-x-16 text-5xl mt-8">
          <a
            href="https://www.instagram.com/thehrdc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-700 transition transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="https://www.facebook.com/HRDCBzn#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-800 transition transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
        </div>
      </section>
    </div>
  );
}

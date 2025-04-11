import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  const menuItems = [
    { label: "HOME", href: "/" },
    { label: "DOCUMENTS", href: "/directory" },
    { label: "SUPPORT", href: "/support" },
    { label: "SCHEDULE", href: "/schedule" },
    { label: "ANNOUNCEMENTS", href: "/announcements" },
  ];

  return (
    <nav className="w-full relative bg-[var(--primary)] text-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* logo */}
        <div className="w-[160px] hover:bg-[var(--secondary-blue)] rounded-full transition-colors duration-200 py-2 pl-2 pr-[13px]">
          <Link href="/">
            <Image
              src="/horizontal-1-color-HRDC-logo.svg"
              alt="HRDC Logo"
              width={160}
              height={200}
              className="cursor-pointer"
              priority
            />
          </Link>
        </div>

        <div className="flex items-center">
          <div className="hidden lg:flex space-x-8 text-lg font-semibold mr-8">
            {menuItems.map(({ label, href }) => (
              <div
                key={label}
                className="hover:bg-[var(--secondary-blue)] rounded transition-colors duration-200"
              >
                <Link href={href} className="block px-2 py-1">
                  {label}
                </Link>
              </div>
            ))}
          </div>

          <div className="flex items-center ml-[10px] space-x-4">
            <div className="hover:bg-[var(--secondary-blue)] rounded-full transition-colors duration-200 p-2">
              <Link href="/login">
                <Image
                  src="/person.svg"
                  alt="Login"
                  width={32}
                  height={32}
                  className="cursor-pointer"
                />
              </Link>
            </div>

            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="bg-[var(--primary)] rounded-full p-2 transition-colors duration-200 hover:bg-[var(--secondary-blue)]"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full z-50 bg-[var(--primary)] text-white flex flex-col items-center py-4 lg:hidden">
          {menuItems.map(({ label, href }, idx) => (
            <div
              key={label}
              className={`w-full hover:bg-[var(--secondary-blue)] transition-colors duration-200 ${
                idx < menuItems.length - 1
                  ? "border-b border-white border-opacity-30"
                  : ""
              }`}
            >
              <Link
                href={href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-center text-white"
              >
                {label}
              </Link>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

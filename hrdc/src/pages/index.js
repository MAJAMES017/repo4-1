// pages/index.js
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from ".//../firebase-config";

export default function Home() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center bg-white text-gray-900 relative">
            {/* Top left: Profile link */}
            <div className="absolute top-4 left-4">
                <Link href="/profile">
                    {user ? (
                        <Image src="/profile-icon.png" alt="Profile" width={40} height={40} className="cursor-pointer" />
                    ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span>User</span>
                        </div>
                    )}
                </Link>
            </div>

            {/* Top right: Login button (if not logged in) or user's name */}
            <div className="absolute top-4 right-4">
                {!user ? (
                    <Link href="/login">
                        <button className="bg-blue-500 text-white px-3 py-2 rounded-md">Login</button>
                    </Link>
                ) : (
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-800">{user.displayName}</span>
                        <Image src="/profile-icon.png" alt="Profile" width={40} height={40} className="cursor-pointer" />
                    </div>
                )}
            </div>

            <header className="w-full bg-teal-800 text-white py-6 flex flex-col items-center">
                <Image src="/logo.png" alt="HRDC Logo" width={100} height={50} />
                <h1 className="text-lg font-semibold mt-2">EMPLOYEE RESOURCES</h1>
            </header>

            <section className="bg-green-200 mt-8 p-6 rounded-lg shadow-md w-3/4 max-w-lg text-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">QUICK LINKS</h2>
                <div className="space-y-4">
                    <button className="block w-full bg-teal-700 text-white py-2 rounded-lg text-lg font-medium hover:bg-teal-600">
                        Important Files
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                            className="block w-full bg-teal-700 text-white py-2 rounded-lg text-lg font-medium hover:bg-teal-600"
                        >
                            Modify Documents
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute left-0 w-full bg-white border border-gray-300 shadow-lg rounded-md mt-1 text-gray-900">
                                {["Create", "Edit", "Delete"].map((action, index) => (
                                    <button key={index} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                                        {action}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="block w-full bg-teal-700 text-white py-2 rounded-lg text-lg font-medium hover:bg-teal-600">
                        User Privileges
                    </button>
                    <button className="block w-full bg-teal-700 text-white py-2 rounded-lg text-lg font-medium hover:bg-teal-600">
                        Document Directory
                    </button>
                </div>
            </section>

            <section className="mt-10 text-center">
                <p className="text-gray-600 font-medium">Can't find what you are looking for?</p>
                <input
                    type="text"
                    placeholder="Search documents..."
                    className="mt-3 w-3/4 max-w-sm p-2 border border-gray-400 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-sm text-gray-500 mt-2">YEAR + _MONTH + _FileName</p>
            </section>
        </div>
    );
}

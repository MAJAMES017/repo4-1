// pages/signup.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from ".//../firebase-config"; // adjust the path if necessary
import Link from "next/link";
import Image from "next/image"; // Added import for Image
import Navbar from "../components/Navbar";
import { createUserProfile } from "./api/user-management"; // Add this import

const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Add this line to create the user profile in Firestore
        await createUserProfile(result.user);
        // onAuthStateChanged will redirect on successful account creation
    } catch (err) {
        setError(err.message);
    }
};

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    // Redirect if user is already logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push("/");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged will redirect on successful account creation
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--faded-white-for-cards)]">
            <Navbar/>
            {/* Added header from login.js */}
            <header
                className="w-full py-6 flex flex-col items-center"
                style={{backgroundColor: "var(--primary)"}}
            >
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="HRDC Logo"
                        width={100}
                        height={50}
                        priority
                    />
                </Link>
            </header>

            <div className="flex-grow flex items-center justify-center">
                <div
                    className="p-8 rounded shadow-md w-full max-w-md"
                    style={{backgroundColor: "var(--whitebg-color)"}}
                >
                    <h1
                        className="mb-6 text-center"
                        style={{
                            fontFamily: "var(--h-2-font-family)",
                            fontWeight: "var(--h-2-font-weight)",
                            fontSize: "var(--h-2-font-size)",
                            color: "var(--black)"
                        }}
                    >
                        Create Account
                    </h1>
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 rounded-md"
                            style={{
                                backgroundColor: "var(--whitebg-color)",
                                border: "1px solid #9ca3af"
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-2 rounded-md"
                            style={{
                                backgroundColor: "var(--whitebg-color)",
                                border: "1px solid #9ca3af"
                            }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full p-2 rounded-md"
                            style={{
                                backgroundColor: "var(--whitebg-color)",
                                border: "1px solid #9ca3af"
                            }}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="w-full text-white py-2 rounded-md hover:bg-[var(--secondary-blue)]"
                            style={{backgroundColor: "var(--primary)"}}
                        >
                            Create Account
                        </button>
                    </form>
                    {error && (
                        <div
                            className="mt-4 text-center"
                            style={{
                                color: "red",
                                fontFamily: "var(--primary-body-copy-font-family)",
                                fontSize: "var(--primary-body-copy-font-size)"
                            }}
                        >
                            {error}
                        </div>
                    )}
                    <div
                        className="mt-4 text-center"
                        style={{
                            fontFamily: "var(--primary-body-copy-font-family)",
                            color: "var(--black)"
                        }}
                    >
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="underline"
                            style={{color: "var(--secondary-blue)"}}
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
            <footer className="w-full bg-gray-900 text-white text-center py-4 mt-auto"
                    style={{backgroundColor: "var(--secondary-blue)"}}>
                <p className="text-[10px]">&copy; 2025 HRDC, INC. ALL RIGHTS RESERVED</p>
            </footer>
        </div>
    );
}
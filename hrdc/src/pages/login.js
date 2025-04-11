//pages/login.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { auth } from "../firebase-config";
import { createUserProfile, getUserRole } from "./api/user-management";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const router = useRouter();

    // Check if user is already logged in, but don't redirect automatically
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                const role = await getUserRole(user.uid);
                setUserRole(role);
            }
        });
        return () => unsubscribe();
    }, []);


    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setCurrentUser(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // Create user profile if it doesn't exist
            await createUserProfile(result.user);
            router.push("/");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            // Create user profile if it doesn't exist
            await createUserProfile(result.user);
            router.push("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--faded-white-for-cards)]">
            <Navbar/>
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
                    {currentUser ? (
                        <div className="text-center">
                            <h1
                                className="mb-6"
                                style={{
                                    fontFamily: "var(--h-2-font-family)",
                                    fontWeight: "var(--h-2-font-weight)",
                                    fontSize: "var(--h-2-font-size)",
                                    color: "var(--black)"
                                }}
                            >
                                Change Account
                            </h1>
                            <div className="mb-4">
                                Currently signed in as: <strong>{currentUser.email}</strong>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="w-full text-white py-2 rounded-md mb-4 hover:bg-[var(--secondary-blue)]"
                                style={{backgroundColor: "var(--primary)"}}
                            >
                                Sign Out
                            </button>
                            <Link
                                href="/"
                                className="block w-full text-center text-white py-2 rounded-md hover:bg-[var(--secondary-blue)]"
                                style={{backgroundColor: "var(--secondary-gold)"}}
                            >
                                Return to Home
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1
                                className="mb-6 text-center"
                                style={{
                                    fontFamily: "var(--h-2-font-family)",
                                    fontWeight: "var(--h-2-font-weight)",
                                    fontSize: "var(--h-2-font-size)",
                                    color: "var(--black)"
                                }}
                            >
                                Login
                            </h1>

                            {/* Google Login */}
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full text-white py-2 rounded-md mb-4 hover:bg-[var(--secondary-blue)]"
                                style={{backgroundColor: "var(--primary)"}}
                            >
                                Sign in with Google
                            </button>

                            {/* Separator */}
                            <div className="flex items-center my-4">
                                <div
                                    className="flex-grow border-t"
                                    style={{borderColor: "var(--secondary-blue)"}}
                                ></div>
                                <span className="px-4" style={{color: "var(--black)"}}>
                                    or
                                </span>
                                <div
                                    className="flex-grow border-t"
                                    style={{borderColor: "var(--secondary-blue)"}}
                                ></div>
                            </div>

                            {/* Email/Password Login */}
                            <form onSubmit={handleEmailLogin} className="space-y-4">
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
                                <button
                                    type="submit"
                                    className="w-full text-white py-2 rounded-md hover:bg-[var(--secondary-blue)]"
                                    style={{backgroundColor: "var(--primary)"}}
                                >
                                    Login
                                </button>
                            </form>

                            <div
                                className="mt-4 text-center"
                                style={{
                                    fontFamily: "var(--primary-body-copy-font-family)",
                                    color: "var(--black)"
                                }}
                            >
                                Don't have an account?{" "}
                                <Link
                                    href="/signup"
                                    className="underline"
                                    style={{color: "var(--secondary-blue)"}}
                                >
                                    Create one
                                </Link>
                            </div>
                        </>
                    )}

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
                </div>
            </div>
            <footer className="w-full bg-gray-900 text-white text-center py-4 mt-auto"
                    style={{backgroundColor: "var(--secondary-blue)"}}>
                <p className="text-[10px]">&copy; 2025 HRDC, INC. ALL RIGHTS RESERVED</p>
            </footer>
        </div>
    );
}
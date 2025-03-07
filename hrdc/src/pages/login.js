// pages/login.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";
import { auth } from ".//../firebase-config"; // adjust the path if needed

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // onAuthStateChanged will redirect on successful login
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged will redirect on successful login
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

                {/* Google Login */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-blue-500 text-white py-2 rounded-md mb-4 hover:bg-blue-600"
                >
                    Sign in with Google
                </button>

                {/* Separator */}
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-4 text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Email/Password Login */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border border-gray-400 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border border-gray-400 rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                    >
                        Login
                    </button>
                </form>

                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                <p className="mt-4 text-center">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-blue-500 underline">Create one</a>
                </p>
            </div>
        </div>
    );
}

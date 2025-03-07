// pages/signup.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from ".//../firebase-config"; // adjust the path if necessary
import Link from "next/link";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-semibold mb-6 text-center">Create Account</h1>
                <form onSubmit={handleSignUp} className="space-y-4">
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
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full p-2 border border-gray-400 rounded-md"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                    >
                        Create Account
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                <p className="mt-4 text-center">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 underline">Log in</a>
                </p>
            </div>
        </div>
    );
}

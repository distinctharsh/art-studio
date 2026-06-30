"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user_auth.php?action=register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user_token", data.token);
        window.location.href = "/profile";
      } else {
        setError(data.error || "Failed to create account.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-6 max-w-lg mx-auto w-full min-h-screen">
        <div className="bg-[#050505] border border-white/[0.02] p-8 md:p-12 rounded-xl">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl font-light text-zinc-100">Create Account</h1>
            <p className="text-zinc-500 text-xs mt-2">Join unseen_art studio to track your orders.</p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-zinc-900/40 border border-zinc-800 focus:border-accent p-3.5 rounded text-xs text-zinc-200 focus:outline-none transition-colors"
                placeholder="Enter your name"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Username *</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-zinc-900/40 border border-zinc-800 focus:border-accent p-3.5 rounded text-xs text-zinc-200 focus:outline-none transition-colors"
                placeholder="Choose a username"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-zinc-900/40 border border-zinc-800 focus:border-accent p-3.5 rounded text-xs text-zinc-200 focus:outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Phone Number (Optional)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-zinc-900/40 border border-zinc-800 focus:border-accent p-3.5 rounded text-xs text-zinc-200 focus:outline-none transition-colors"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-zinc-900/40 border border-zinc-800 focus:border-accent p-3.5 rounded text-xs text-zinc-200 focus:outline-none transition-colors"
                placeholder="Create a password"
              />
            </div>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="py-3.5 bg-accent hover:bg-accent-light text-black text-xs font-semibold tracking-widest uppercase rounded transition-all mt-4 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

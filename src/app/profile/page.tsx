"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  created_at: string;
}

interface Order {
  id: number;
  painting_id: string; // or order details
  status: string;
  created_at: string;
  total_amount?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user_auth.php?action=me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          fetchOrders(token);
        } else {
          localStorage.removeItem("user_token");
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setLoading(false);
      }
    };

    const fetchOrders = async (token: string) => {
      try {
        const response = await fetch("/api/orders.php", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-zinc-500 font-serif">Loading profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12 border-b border-white/[0.05] pb-6">
          <div>
            <h1 className="font-serif text-4xl font-light text-zinc-100">
              Welcome, <span className="italic font-normal text-accent">{user.name.split(' ')[0]}</span>.
            </h1>
            <p className="text-zinc-500 text-sm mt-2 font-mono">{user.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left Column: Account Details */}
          <div className="md:col-span-1 flex flex-col gap-8">
            <div className="bg-[#050505] border border-white/[0.02] p-6 rounded-xl">
              <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-6">
                Account Details
              </h3>
              
              <div className="flex flex-col gap-4">
                <div>
                  <span className="block text-[10px] uppercase text-zinc-600 mb-1">Full Name</span>
                  <span className="text-sm text-zinc-200">{user.name}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-zinc-600 mb-1">Username</span>
                  <span className="text-sm text-zinc-200">@{user.username}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-zinc-600 mb-1">Phone</span>
                  <span className="text-sm text-zinc-200">{user.phone || "Not provided"}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-zinc-600 mb-1">Member Since</span>
                  <span className="text-sm text-zinc-200">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#050505] border border-white/[0.02] p-6 rounded-xl">
              <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-3">
                Total Orders
              </h3>
              <span className="font-serif text-4xl text-zinc-100">{orders.length}</span>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="md:col-span-2">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-6">
              Order History
            </h3>
            
            {orders.length === 0 ? (
              <div className="bg-[#050505] border border-white/[0.02] p-12 rounded-xl text-center flex flex-col items-center gap-4">
                <p className="text-zinc-500 text-sm font-serif italic">You haven't placed any orders yet.</p>
                <Link 
                  href="/gallery"
                  className="py-2.5 px-6 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold tracking-widest uppercase rounded transition-all mt-2"
                >
                  Explore Gallery
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-[#050505] border border-white/[0.02] p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-sm text-zinc-200 font-medium block">Order #{order.id}</span>
                      <span className="text-xs text-zinc-500 mt-1 block">Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="block text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Status</span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                          order.status === 'Processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-zinc-800 text-zinc-300'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      {order.total_amount && (
                         <div className="text-right">
                          <span className="block text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Total</span>
                          <span className="text-sm text-zinc-200">{order.total_amount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Painting } from "@/components/PaintingCard";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  artwork: string;
  message: string;
  status: "Unsolved" | "Solved";
  created_at: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"inquiries" | "paintings" | "add">("inquiries");
  const [inquiryFilter, setInquiryFilter] = useState<"Unsolved" | "Solved">("Unsolved");
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // New painting form state
  const [newPainting, setNewPainting] = useState({
    id: "",
    title: "",
    medium: "",
    dimensions: "",
    year: "",
    status: "Available" as "Available" | "Sold",
    price: "",
    image: "",
    description: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const response = await fetch('/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('admin_token', data.token);
      } else {
        setLoginError(data.error || "Login failed");
      }
    } catch (error) {
      setLoginError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchData();
    }
  }, [isAuthenticated, token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch inquiries
      const inquiriesRes = await fetch('/api/inquiries.php', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json();
        // Fallback for old data without status
        const processedInquiries = inquiriesData.map((i: any) => ({
          ...i,
          status: i.status || "Unsolved"
        }));
        setInquiries(processedInquiries);
      }

      // Fetch paintings
      const paintingsRes = await fetch('/api/paintings.php');
      if (paintingsRes.ok) {
        const paintingsData = await paintingsRes.json();
        setPaintings(paintingsData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken("");
    setIsAuthenticated(false);
  };

  const handleAddPainting = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/paintings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newPainting),
      });

      if (response.ok) {
        alert('Painting added successfully!');
        setNewPainting({
          id: "", title: "", medium: "", dimensions: "", year: "",
          status: "Available", price: "", image: "", description: "",
        });
        fetchData();
      } else {
        alert('Failed to add painting');
      }
    } catch (error) {
      alert('Failed to add painting');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: "Available" | "Sold") => {
    try {
      const response = await fetch('/api/paintings.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleUpdateInquiryStatus = async (id: number, status: "Unsolved" | "Solved") => {
    try {
      const response = await fetch('/api/inquiries.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });
      if (response.ok) {
        fetchData();
        if (selectedInquiry) {
          setSelectedInquiry({ ...selectedInquiry, status });
        }
      }
    } catch (error) {
      alert('Failed to update inquiry status');
    }
  };

  const handleDeletePainting = async (id: string) => {
    if (!confirm('Are you sure you want to delete this painting?')) return;
    try {
      const response = await fetch(`/api/paintings.php?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      alert('Failed to delete painting');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex flex-col min-h-screen bg-black">
        <header className="w-full bg-[#050505] border-b border-white/[0.05] p-6 flex justify-between items-center">
          <Link href="/" className="font-serif text-xl font-light text-zinc-100">
            unseen<span className="italic font-normal text-accent font-serif">_art</span> studio
          </Link>
          <span className="text-xs uppercase tracking-widest text-zinc-500">Admin Portal</span>
        </header>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md bg-[#080808] border border-white/[0.05] p-8 rounded-lg shadow-2xl">
            <h1 className="font-serif text-3xl text-zinc-100 mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 p-3.5 rounded text-xs text-zinc-200 focus:outline-none focus:border-accent transition-colors"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              {loginError && (
                <p className="text-red-400 text-xs">{loginError}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-accent hover:bg-accent-light text-black text-xs font-semibold tracking-widest uppercase rounded transition-all disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Login to Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  const filteredInquiries = inquiries.filter(inq => inq.status === inquiryFilter);

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans">
      {/* Dedicated Admin Header */}
      <header className="sticky top-0 z-40 w-full bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.05] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="font-serif text-xl font-light text-zinc-100">
            unseen<span className="italic font-normal text-accent font-serif">_art</span>
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600 border-l border-zinc-800 pl-4 py-1">
            Admin Dashboard
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors">
            View Live Site
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {/* Navigation Tabs */}
        <div className="flex gap-8 mb-10 border-b border-zinc-900">
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`text-xs uppercase tracking-widest pb-4 transition-colors ${
              activeTab === "inquiries" ? "text-accent border-b-2 border-accent" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Inquiries
          </button>
          <button
            onClick={() => setActiveTab("paintings")}
            className={`text-xs uppercase tracking-widest pb-4 transition-colors ${
              activeTab === "paintings" ? "text-accent border-b-2 border-accent" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Paintings Inventory
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`text-xs uppercase tracking-widest pb-4 transition-colors ${
              activeTab === "add" ? "text-accent border-b-2 border-accent" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Add New Work
          </button>
        </div>

        {loading && <p className="text-zinc-500 text-sm animate-pulse mb-8">Synchronizing data...</p>}

        {/* Inquiries View */}
        {activeTab === "inquiries" && !loading && (
          <div className="flex flex-col gap-6">
            {/* Status Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setInquiryFilter("Unsolved")}
                className={`px-4 py-2 text-xs rounded-full transition-colors ${
                  inquiryFilter === "Unsolved" 
                    ? "bg-accent/10 text-accent border border-accent/20" 
                    : "bg-zinc-900 text-zinc-500 border border-transparent hover:text-zinc-300"
                }`}
              >
                Unsolved ({inquiries.filter(i => i.status === "Unsolved").length})
              </button>
              <button
                onClick={() => setInquiryFilter("Solved")}
                className={`px-4 py-2 text-xs rounded-full transition-colors ${
                  inquiryFilter === "Solved" 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "bg-zinc-900 text-zinc-500 border border-transparent hover:text-zinc-300"
                }`}
              >
                Solved ({inquiries.filter(i => i.status === "Solved").length})
              </button>
            </div>

            <div className="bg-[#080808] border border-white/[0.05] rounded-xl overflow-hidden shadow-2xl">
              {filteredInquiries.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 text-sm font-serif italic">
                  No {inquiryFilter.toLowerCase()} inquiries at the moment.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-zinc-900/40">
                      <tr>
                        <th className="p-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Date</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Name</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Subject</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Preview</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                      {filteredInquiries.map((inquiry) => (
                        <tr 
                          key={inquiry.id} 
                          className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                          onClick={() => setSelectedInquiry(inquiry)}
                        >
                          <td className="p-4 text-xs text-zinc-500">{new Date(inquiry.created_at).toLocaleDateString()}</td>
                          <td className="p-4 text-sm text-zinc-200">
                            {inquiry.name}
                            <span className="block text-xs text-zinc-500 mt-1">{inquiry.email}</span>
                          </td>
                          <td className="p-4 text-sm text-zinc-300">{inquiry.subject}</td>
                          <td className="p-4 text-xs text-zinc-500 max-w-[200px] truncate">
                            {inquiry.message}
                          </td>
                          <td className="p-4 text-right">
                            <button className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                              View Details →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Paintings Tab */}
        {activeTab === "paintings" && !loading && (
          <div className="bg-[#080808] border border-white/[0.05] rounded-xl overflow-hidden shadow-2xl">
            {paintings.length === 0 ? (
              <p className="p-12 text-center text-zinc-500 text-sm font-serif italic">No paintings found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-zinc-900/40">
                    <tr>
                      <th className="p-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Artwork</th>
                      <th className="p-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Details</th>
                      <th className="p-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Price</th>
                      <th className="p-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Status</th>
                      <th className="p-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {paintings.map((painting) => (
                      <tr key={painting.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <span className="text-sm text-zinc-200 block">{painting.title}</span>
                          <span className="text-xs text-zinc-500">{painting.year}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-xs text-zinc-400 block">{painting.medium}</span>
                          <span className="text-xs text-zinc-500">{painting.dimensions}</span>
                        </td>
                        <td className="p-4 text-sm text-zinc-300">{painting.price}</td>
                        <td className="p-4">
                          <select
                            value={painting.status}
                            onChange={(e) => handleUpdateStatus(painting.id, e.target.value as "Available" | "Sold")}
                            className={`text-xs p-1.5 rounded border focus:outline-none focus:ring-1 focus:ring-accent ${
                              painting.status === "Available" 
                                ? "bg-accent/10 border-accent/20 text-accent" 
                                : "bg-zinc-900 border-zinc-800 text-zinc-500"
                            }`}
                          >
                            <option value="Available">Available</option>
                            <option value="Sold">Sold</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeletePainting(painting.id)}
                            className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-400/10 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add Painting Tab */}
        {activeTab === "add" && (
          <div className="bg-[#080808] border border-white/[0.05] rounded-xl p-8 max-w-4xl shadow-2xl">
            <h2 className="font-serif text-2xl text-zinc-100 mb-8">Catalog New Artwork</h2>
            <form onSubmit={handleAddPainting} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">
                  Identifier slug *
                </label>
                <input
                  type="text"
                  value={newPainting.id}
                  onChange={(e) => setNewPainting({ ...newPainting, id: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded text-sm text-zinc-200 focus:outline-none focus:border-accent"
                  placeholder="e.g., quiet-moments"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">
                  Title *
                </label>
                <input
                  type="text"
                  value={newPainting.title}
                  onChange={(e) => setNewPainting({ ...newPainting, title: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded text-sm text-zinc-200 focus:outline-none focus:border-accent"
                  placeholder="Artwork title"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">
                  Medium *
                </label>
                <input
                  type="text"
                  value={newPainting.medium}
                  onChange={(e) => setNewPainting({ ...newPainting, medium: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded text-sm text-zinc-200 focus:outline-none focus:border-accent"
                  placeholder="e.g., Oil and gesso on raw canvas"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">
                  Dimensions *
                </label>
                <input
                  type="text"
                  value={newPainting.dimensions}
                  onChange={(e) => setNewPainting({ ...newPainting, dimensions: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded text-sm text-zinc-200 focus:outline-none focus:border-accent"
                  placeholder="e.g., 36 x 48 inches"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">
                  Year *
                </label>
                <input
                  type="text"
                  value={newPainting.year}
                  onChange={(e) => setNewPainting({ ...newPainting, year: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded text-sm text-zinc-200 focus:outline-none focus:border-accent"
                  placeholder="e.g., 2026"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">
                  Price *
                </label>
                <input
                  type="text"
                  value={newPainting.price}
                  onChange={(e) => setNewPainting({ ...newPainting, price: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded text-sm text-zinc-200 focus:outline-none focus:border-accent"
                  placeholder="e.g., INR 75,000"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">
                  Primary Image Path *
                </label>
                <input
                  type="text"
                  value={newPainting.image}
                  onChange={(e) => setNewPainting({ ...newPainting, image: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded text-sm text-zinc-200 focus:outline-none focus:border-accent"
                  placeholder="/images/painting_name.png"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">
                  Status
                </label>
                <select
                  value={newPainting.status}
                  onChange={(e) => setNewPainting({ ...newPainting, status: e.target.value as "Available" | "Sold" })}
                  className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded text-sm text-zinc-200 focus:outline-none focus:border-accent"
                >
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">
                  Curatorial Description
                </label>
                <textarea
                  value={newPainting.description}
                  onChange={(e) => setNewPainting({ ...newPainting, description: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded text-sm text-zinc-200 focus:outline-none focus:border-accent h-32 resize-none"
                  placeholder="A detailed description of the artwork's themes and process..."
                />
              </div>
              <div className="md:col-span-2 pt-4 border-t border-zinc-900">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-3.5 bg-accent hover:bg-accent-light text-black text-xs font-semibold tracking-widest uppercase rounded transition-all disabled:opacity-50"
                >
                  {loading ? "Cataloging..." : "Add to Inventory"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#080808] border border-white/[0.1] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-[#080808]/90 backdrop-blur-md border-b border-white/[0.05] p-6 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-2xl text-zinc-100">{selectedInquiry.subject}</h3>
                <p className="text-xs text-zinc-500 mt-1">Received {new Date(selectedInquiry.created_at).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 hover:bg-zinc-800 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8 flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-6 bg-zinc-900/30 p-6 rounded-lg border border-white/[0.02]">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">From</span>
                  <span className="block text-sm text-zinc-200">{selectedInquiry.name}</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-sm text-accent hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Specific Artwork</span>
                  <span className="block text-sm text-zinc-200">
                    {selectedInquiry.artwork && selectedInquiry.artwork !== "None" ? selectedInquiry.artwork : "N/A (General)"}
                  </span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-3">Message</span>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message}
                </p>
              </div>

              <div className="pt-6 border-t border-zinc-900 flex justify-between items-center">
                <span className="text-xs text-zinc-500">
                  Current Status: <strong className={selectedInquiry.status === "Solved" ? "text-emerald-400 font-normal" : "text-accent font-normal"}>{selectedInquiry.status}</strong>
                </span>
                
                <button
                  onClick={() => handleUpdateInquiryStatus(
                    selectedInquiry.id, 
                    selectedInquiry.status === "Unsolved" ? "Solved" : "Unsolved"
                  )}
                  className={`px-6 py-2.5 rounded text-xs font-medium transition-colors ${
                    selectedInquiry.status === "Unsolved"
                      ? "bg-emerald-500 hover:bg-emerald-400 text-black"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  }`}
                >
                  {selectedInquiry.status === "Unsolved" ? "Mark as Solved" : "Reopen Inquiry"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

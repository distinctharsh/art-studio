"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Painting } from "@/components/PaintingCard";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  artwork: string;
  message: string;
  created_at: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"inquiries" | "paintings" | "add">("inquiries");
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(false);

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

  // Handle login
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
        // Store token in localStorage for persistence
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

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated
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
        setInquiries(inquiriesData);
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken("");
    setIsAuthenticated(false);
  };

  // Handle adding new painting
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
          id: "",
          title: "",
          medium: "",
          dimensions: "",
          year: "",
          status: "Available",
          price: "",
          image: "",
          description: "",
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

  // Handle updating painting status
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
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  // Handle deleting painting
  const handleDeletePainting = async (id: string) => {
    if (!confirm('Are you sure you want to delete this painting?')) return;

    try {
      const response = await fetch(`/api/paintings.php?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchData();
      } else {
        alert('Failed to delete painting');
      }
    } catch (error) {
      alert('Failed to delete painting');
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center min-h-screen bg-black px-6">
          <div className="w-full max-w-md bg-[#080808] border border-white/[0.05] p-8 rounded-lg">
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
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-zinc-200 focus:outline-none focus:border-accent"
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
                className="w-full py-3 bg-accent hover:bg-accent-light text-black font-semibold rounded transition-all disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Admin dashboard
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-black min-h-screen pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-serif text-4xl text-zinc-100">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white rounded text-xs transition-all"
            >
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-zinc-900 pb-4">
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`text-xs uppercase tracking-widest pb-2 ${
                activeTab === "inquiries" ? "text-accent border-b-2 border-accent" : "text-zinc-500"
              }`}
            >
              Inquiries
            </button>
            <button
              onClick={() => setActiveTab("paintings")}
              className={`text-xs uppercase tracking-widest pb-2 ${
                activeTab === "paintings" ? "text-accent border-b-2 border-accent" : "text-zinc-500"
              }`}
            >
              Paintings
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`text-xs uppercase tracking-widest pb-2 ${
                activeTab === "add" ? "text-accent border-b-2 border-accent" : "text-zinc-500"
              }`}
            >
              Add Painting
            </button>
          </div>

          {/* Content */}
          {loading && <p className="text-zinc-500 text-sm">Loading...</p>}

          {/* Inquiries Tab */}
          {activeTab === "inquiries" && !loading && (
            <div className="bg-[#080808] border border-white/[0.05] rounded-lg overflow-hidden">
              {inquiries.length === 0 ? (
                <p className="p-8 text-zinc-500 text-sm">No inquiries yet</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-zinc-900/50">
                    <tr>
                      <th className="text-left p-4 text-xs uppercase tracking-widest text-zinc-500">Date</th>
                      <th className="text-left p-4 text-xs uppercase tracking-widest text-zinc-500">Name</th>
                      <th className="text-left p-4 text-xs uppercase tracking-widest text-zinc-500">Email</th>
                      <th className="text-left p-4 text-xs uppercase tracking-widest text-zinc-500">Subject</th>
                      <th className="text-left p-4 text-xs uppercase tracking-widest text-zinc-500">Artwork</th>
                      <th className="text-left p-4 text-xs uppercase tracking-widest text-zinc-500">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="border-t border-zinc-900">
                        <td className="p-4 text-xs text-zinc-400">{new Date(inquiry.created_at).toLocaleDateString()}</td>
                        <td className="p-4 text-sm text-zinc-200">{inquiry.name}</td>
                        <td className="p-4 text-sm text-zinc-400">{inquiry.email}</td>
                        <td className="p-4 text-sm text-zinc-200">{inquiry.subject}</td>
                        <td className="p-4 text-sm text-zinc-400">{inquiry.artwork}</td>
                        <td className="p-4 text-sm text-zinc-300 max-w-md truncate">{inquiry.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Paintings Tab */}
          {activeTab === "paintings" && !loading && (
            <div className="bg-[#080808] border border-white/[0.05] rounded-lg overflow-hidden">
              {paintings.length === 0 ? (
                <p className="p-8 text-zinc-500 text-sm">No paintings yet</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-zinc-900/50">
                    <tr>
                      <th className="text-left p-4 text-xs uppercase tracking-widest text-zinc-500">Title</th>
                      <th className="text-left p-4 text-xs uppercase tracking-widest text-zinc-500">Medium</th>
                      <th className="text-left p-4 text-xs uppercase tracking-widest text-zinc-500">Dimensions</th>
                      <th className="text-left p-4 text-xs uppercase tracking-widest text-zinc-500">Year</th>
                      <th className="text-left p-4 text-xs uppercase tracking-widest text-zinc-500">Price</th>
                      <th className="text-left p-4 text-xs uppercase tracking-widest text-zinc-500">Status</th>
                      <th className="text-left p-4 text-xs uppercase tracking-widest text-zinc-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paintings.map((painting) => (
                      <tr key={painting.id} className="border-t border-zinc-900">
                        <td className="p-4 text-sm text-zinc-200">{painting.title}</td>
                        <td className="p-4 text-sm text-zinc-400">{painting.medium}</td>
                        <td className="p-4 text-sm text-zinc-400">{painting.dimensions}</td>
                        <td className="p-4 text-sm text-zinc-400">{painting.year}</td>
                        <td className="p-4 text-sm text-zinc-400">{painting.price}</td>
                        <td className="p-4">
                          <select
                            value={painting.status}
                            onChange={(e) => handleUpdateStatus(painting.id, e.target.value as "Available" | "Sold")}
                            className="bg-zinc-900 border border-zinc-800 text-xs p-2 rounded text-zinc-200"
                          >
                            <option value="Available">Available</option>
                            <option value="Sold">Sold</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDeletePainting(painting.id)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Add Painting Tab */}
          {activeTab === "add" && (
            <div className="bg-[#080808] border border-white/[0.05] rounded-lg p-8">
              <h2 className="font-serif text-2xl text-zinc-100 mb-6">Add New Painting</h2>
              <form onSubmit={handleAddPainting} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block">
                    ID (unique identifier)
                  </label>
                  <input
                    type="text"
                    value={newPainting.id}
                    onChange={(e) => setNewPainting({ ...newPainting, id: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-zinc-200 focus:outline-none focus:border-accent"
                    placeholder="e.g., quiet-moments"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPainting.title}
                    onChange={(e) => setNewPainting({ ...newPainting, title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-zinc-200 focus:outline-none focus:border-accent"
                    placeholder="Painting title"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block">
                    Medium
                  </label>
                  <input
                    type="text"
                    value={newPainting.medium}
                    onChange={(e) => setNewPainting({ ...newPainting, medium: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-zinc-200 focus:outline-none focus:border-accent"
                    placeholder="e.g., Acrylic on canvas"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={newPainting.dimensions}
                    onChange={(e) => setNewPainting({ ...newPainting, dimensions: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-zinc-200 focus:outline-none focus:border-accent"
                    placeholder="e.g., 36 x 48 inches"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block">
                    Year
                  </label>
                  <input
                    type="text"
                    value={newPainting.year}
                    onChange={(e) => setNewPainting({ ...newPainting, year: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-zinc-200 focus:outline-none focus:border-accent"
                    placeholder="e.g., 2025"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block">
                    Price
                  </label>
                  <input
                    type="text"
                    value={newPainting.price}
                    onChange={(e) => setNewPainting({ ...newPainting, price: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-zinc-200 focus:outline-none focus:border-accent"
                    placeholder="e.g., INR 52,000"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block">
                    Image Path
                  </label>
                  <input
                    type="text"
                    value={newPainting.image}
                    onChange={(e) => setNewPainting({ ...newPainting, image: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-zinc-200 focus:outline-none focus:border-accent"
                    placeholder="/images/painting_1.png"
                    required
                  />
                  <p className="text-xs text-zinc-500 mt-1">Upload image to /public/images/ first</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block">
                    Status
                  </label>
                  <select
                    value={newPainting.status}
                    onChange={(e) => setNewPainting({ ...newPainting, status: e.target.value as "Available" | "Sold" })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-zinc-200 focus:outline-none focus:border-accent"
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block">
                    Description
                  </label>
                  <textarea
                    value={newPainting.description}
                    onChange={(e) => setNewPainting({ ...newPainting, description: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-zinc-200 focus:outline-none focus:border-accent h-32"
                    placeholder="Painting description..."
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-accent hover:bg-accent-light text-black font-semibold rounded transition-all disabled:opacity-50"
                  >
                    {loading ? "Adding..." : "Add Painting"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

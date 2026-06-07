"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function ContactContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Commission Request",
    artwork: "None",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill artwork selection if passed via query params (e.g. ?painting=quiet-moments)
  useEffect(() => {
    const paintingParam = searchParams.get("painting");
    if (paintingParam) {
      // Convert URL param to matches in our list (capitalized format)
      const formatted = paintingParam
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setFormData((prev) => ({
        ...prev,
        subject: "Artwork Purchase",
        artwork: formatted,
      }));
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Reset form after a brief delay
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "Commission Request",
        artwork: "None",
        message: "",
      });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
      {/* Left Column: Contact info */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <span className="text-xs tracking-[0.3em] text-zinc-500 uppercase font-medium">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-zinc-100 leading-tight">
          Start a <span className="italic font-normal text-accent font-serif">conversation</span>.
        </h1>

        <div className="w-16 h-[1px] bg-accent/40 my-2" />

        <div className="flex flex-col gap-8 text-sm text-zinc-400">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-2">
              Studio Location
            </h3>
            <p className="font-serif italic">By appointment only</p>
            <p className="font-serif italic">Colaba, Mumbai, India</p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-2">
              Direct Contact
            </h3>
            <p className="hover:text-accent transition-colors font-mono">
              hello@unseenart.studio
            </p>
          </div>

          <div className="bg-[#050505] border border-white/[0.02] p-6 rounded-lg">
            <h3 className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
              Commission Parameters
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-zinc-500 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                Minimum dimensions start at 24 x 30 inches.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                Creation timelines range between 6 to 8 weeks.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                A 50% deposit is required to secure commission slots.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                Worldwide shipping is fully crated and insured.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column: Inquiry Form */}
      <div className="lg:col-span-7 bg-[#050505] border border-white/[0.02] p-8 md:p-12 rounded-xl">
        {submitted ? (
          <div className="h-full flex flex-col items-center justify-center py-16 text-center gap-4 fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-zinc-100 font-light">
              Message Sent
            </h3>
            <p className="max-w-xs text-zinc-500 text-xs leading-relaxed font-sans">
              Thank you for reaching out. Surbhi will review your details and respond to your inquiry within 48 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name field */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                  Your Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-zinc-900/40 border border-zinc-800 focus:border-accent p-3.5 rounded text-xs text-zinc-200 focus:outline-none transition-colors"
                />
              </div>

              {/* Email field */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-zinc-900/40 border border-zinc-800 focus:border-accent p-3.5 rounded text-xs text-zinc-200 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                  Inquiry Type *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-zinc-900/40 border border-zinc-800 focus:border-accent p-3.5 rounded text-xs text-zinc-200 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="Commission Request" className="bg-zinc-950 text-zinc-200">Commission Request</option>
                  <option value="Artwork Purchase" className="bg-zinc-950 text-zinc-200">Artwork Purchase</option>
                  <option value="Studio Appointment" className="bg-zinc-950 text-zinc-200">Studio Appointment</option>
                  <option value="General Inquiry" className="bg-zinc-950 text-zinc-200">General Inquiry</option>
                </select>
              </div>

              {/* Artwork of interest */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                  Specific Artwork (Optional)
                </label>
                <select
                  value={formData.artwork}
                  onChange={(e) => setFormData({ ...formData, artwork: e.target.value })}
                  className="bg-zinc-900/40 border border-zinc-800 focus:border-accent p-3.5 rounded text-xs text-zinc-200 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="None" className="bg-zinc-950 text-zinc-200">None / Custom</option>
                  <option value="Quiet Moments" className="bg-zinc-950 text-zinc-200">Quiet Moments</option>
                  <option value="Memory of Water" className="bg-zinc-950 text-zinc-200">Memory of Water</option>
                  <option value="Fields of Gold" className="bg-zinc-950 text-zinc-200">Fields of Gold</option>
                  <option value="Silent Reverie" className="bg-zinc-950 text-zinc-200">Silent Reverie</option>
                  <option value="Echoes of Silence" className="bg-zinc-950 text-zinc-200">Echoes of Silence</option>
                </select>
              </div>
            </div>

            {/* Message field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                Your Message *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Share your ideas, space parameters, or shipping queries..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-zinc-900/40 border border-zinc-800 focus:border-accent p-3.5 rounded text-xs text-zinc-200 focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="py-4 bg-accent hover:bg-accent-light text-zinc-950 text-xs font-semibold tracking-widest uppercase rounded transition-all duration-300 mt-2"
            >
              SEND INQUIRY
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        <Suspense fallback={
          <div className="min-h-[50vh] flex items-center justify-center text-zinc-500 font-serif">
            Loading form...
          </div>
        }>
          <ContactContent />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

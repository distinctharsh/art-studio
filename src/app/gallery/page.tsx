"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaintingCard, { Painting } from "@/components/PaintingCard";
import { fetchPaintings, fallbackPaintings } from "@/data/paintings";

function GalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "SOLD">("ALL");
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [paintings, setPaintings] = useState<Painting[]>(fallbackPaintings);
  const [loading, setLoading] = useState(true);

  // Fetch paintings on mount
  useEffect(() => {
    async function loadPaintings() {
      try {
        const data = await fetchPaintings();
        setPaintings(data);
      } catch (error) {
        console.error('Failed to load paintings:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPaintings();
  }, []);

  // Handle URL parameter for displaying details of a specific painting (?id=...)
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const painting = paintings.find((p) => p.id === id);
      if (painting) {
        setSelectedPainting(painting);
      }
    } else {
      setSelectedPainting(null);
    }
  }, [searchParams, paintings]);

  const closeLightbox = () => {
    setSelectedPainting(null);
    setCurrentImageIndex(0);
    setInquirySubmitted(false);
    setFormData({ name: "", email: "", message: "" });
    // Remove query param without reload
    router.push("/gallery", { scroll: false });
  };

  const handleInquireClick = (painting: Painting) => {
    setSelectedPainting(painting);
    setCurrentImageIndex(0);
    // Add query param
    router.push(`/gallery?id=${painting.id}`, { scroll: false });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/inquiries.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: 'Artwork Inquiry',
          artwork: selectedPainting?.title || 'None',
          message: formData.message,
        }),
      });

      if (response.ok) {
        setInquirySubmitted(true);
        setTimeout(() => {
          closeLightbox();
        }, 2500);
      } else {
        alert('Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  const filteredPaintings = paintings.filter((p) => {
    if (filter === "AVAILABLE") return p.status === "Available";
    if (filter === "SOLD") return p.status === "Sold";
    return true;
  });

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Gallery Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="flex flex-col gap-2">
            <span className="text-xs tracking-[0.3em] text-zinc-500 uppercase font-medium">
              The Collection
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-light text-zinc-100 leading-tight">
              Every painting, <span className="italic font-normal text-accent font-serif">at a glance</span>.
            </h1>
          </div>

          {/* Filter Options */}
          <div className="flex items-center gap-8 text-[11px] tracking-[0.25em] font-medium border-b border-zinc-900 pb-2 w-full md:w-auto">
            {(["ALL", "AVAILABLE", "SOLD"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`pb-1 hover:text-white transition-all relative ${
                  filter === option ? "text-accent" : "text-zinc-500"
                }`}
              >
                {option}
                {filter === option && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Paintings Grid */}
        {filteredPaintings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPaintings.map((painting) => (
              <PaintingCard
                key={painting.id}
                painting={painting}
                onInquire={handleInquireClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-500 font-serif">
            No paintings found in this category.
          </div>
        )}

        {/* Painting Details & Inquiry Lightbox Modal */}
        {selectedPainting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all duration-300">
            {/* Click outside to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={closeLightbox} />

            {/* Modal Box */}
            <div className="relative w-full max-w-5xl bg-[#080808] border border-white/[0.05] rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 z-10 max-h-[90vh] md:max-h-[85vh] shadow-2xl">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 border border-white/10 rounded-full text-zinc-400 hover:text-white transition-all z-20"
                aria-label="Close details"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Left Side: Artwork Image(s) */}
              <div className="relative flex flex-col bg-zinc-900 border-r border-white/[0.05]">
                <div className="relative aspect-[3/4] md:aspect-auto w-full h-72 md:h-[65%] w-full">
                  <Image
                    src={selectedPainting.additional_images && selectedPainting.additional_images.length > 0 
                      ? [selectedPainting.image, ...selectedPainting.additional_images][currentImageIndex] 
                      : selectedPainting.image}
                    alt={selectedPainting.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                  />
                </div>
                
                {/* Thumbnails if additional images exist */}
                {selectedPainting.additional_images && selectedPainting.additional_images.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto p-4 md:p-6 bg-black/40 flex-1">
                    {[selectedPainting.image, ...selectedPainting.additional_images].map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 border-2 rounded overflow-hidden transition-all duration-300 ${
                          currentImageIndex === idx ? "border-accent opacity-100" : "border-transparent opacity-50 hover:opacity-100"
                        }`}
                      >
                        <Image src={imgUrl} alt={`${selectedPainting.title} view ${idx + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Details & Form */}
              <div className="p-8 md:p-12 overflow-y-auto flex flex-col justify-between">
                <div>
                  {/* Status Badge */}
                  <span className="inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest border border-accent/20 bg-accent/5 text-accent rounded mb-4">
                    {selectedPainting.status}
                  </span>

                  <h2 className="font-serif text-3xl font-light text-zinc-100 tracking-wide mb-2">
                    {selectedPainting.title}
                  </h2>
                  <p className="font-serif text-lg text-accent/80 font-light mb-6">
                    {selectedPainting.price}
                  </p>

                  {/* Artwork Specs */}
                  <div className="grid grid-cols-2 gap-4 pb-6 border-b border-zinc-900 text-xs text-zinc-400">
                    <div>
                      <p className="text-zinc-600 uppercase tracking-widest text-[9px] mb-1">Medium</p>
                      <p className="font-serif">{selectedPainting.medium}</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 uppercase tracking-widest text-[9px] mb-1">Dimensions</p>
                      <p className="font-serif">{selectedPainting.dimensions}</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 uppercase tracking-widest text-[9px] mb-1">Created In</p>
                      <p className="font-serif">{selectedPainting.year}</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 uppercase tracking-widest text-[9px] mb-1">Artist</p>
                      <p className="font-serif">Surbhi</p>
                    </div>
                  </div>

                  {/* Artwork Bio */}
                  <p className="py-6 text-sm text-zinc-400 leading-relaxed font-serif italic font-light">
                    This beautiful piece is carefully layered and textured by hand using prime materials in Surbhi's Mumbai workshop. Perfect for adding a warm organic vibe to a contemporary home.
                  </p>
                </div>

                {/* Inquiry Form */}
                <div className="pt-6 border-t border-zinc-900">
                  {selectedPainting.status === "Available" ? (
                    inquirySubmitted ? (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-center text-xs tracking-wider">
                        Thank you! Your inquiry has been sent to Surbhi.
                      </div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                        <h3 className="text-xs uppercase tracking-widest font-semibold text-zinc-200">
                          Inquire about this piece
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            required
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-zinc-900/50 border border-zinc-800 text-xs p-3 rounded focus:outline-none focus:border-accent text-zinc-200"
                          />
                          <input
                            required
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-zinc-900/50 border border-zinc-800 text-xs p-3 rounded focus:outline-none focus:border-accent text-zinc-200"
                          />
                        </div>
                        <textarea
                          required
                          rows={2}
                          placeholder="Your message... (e.g. shipping request or custom offer)"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="bg-zinc-900/50 border border-zinc-800 text-xs p-3 rounded focus:outline-none focus:border-accent text-zinc-200 resize-none"
                        />
                        <button
                          type="submit"
                          className="py-3 bg-accent hover:bg-accent-light text-zinc-950 text-xs font-semibold tracking-widest uppercase rounded transition-all duration-300"
                        >
                          SUBMIT INQUIRY
                        </button>
                      </form>
                    )
                  ) : (
                    <div className="p-4 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded text-center text-xs tracking-wider">
                      This piece is already sold. Feel free to contact Surbhi for a commission.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-serif">
        Loading collection...
      </div>
    }>
      <GalleryContent />
    </Suspense>
  );
}

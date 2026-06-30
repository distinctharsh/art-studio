"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaintingCard, { Painting } from "@/components/PaintingCard";
import { fetchPaintings, fallbackPaintings } from "@/data/paintings";

export default function Home() {
  const [featuredPaintings, setFeaturedPaintings] = useState<Painting[]>(fallbackPaintings.slice(0, 3));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPaintings() {
      try {
        const paintings = await fetchPaintings();
        setFeaturedPaintings(paintings.slice(0, 3));
      } catch (error) {
        console.error('Failed to load paintings:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPaintings();
  }, []);

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full min-h-[95vh] flex items-center justify-center pt-24 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/studio_hero.png"
              alt="Artist studio painting background"
              fill
              priority
              className="object-cover opacity-65"
            />
            {/* Dark gradient mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl w-full mx-auto px-6 py-20 flex flex-col justify-between min-h-[70vh]">
            <div className="w-full">
              {/* Studio Metadata */}
              <p className="text-xs tracking-[0.3em] text-accent/80 font-medium mb-6 uppercase fade-in">
                A Studio of One — Delhi, India
              </p>

              {/* Main Heading */}
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-[1.15] text-zinc-100 max-w-4xl tracking-tight fade-in">
                Art beyond words, <br />
                {/* <span className="italic font-normal text-accent/90">cannot express</span> */}
                 {/* <br /> */}
                cannot express.
              </h1>
            </div>

            {/* Bottom Panel - Right Side Block */}
            <div className="w-full flex flex-col md:flex-row justify-between items-end gap-10 mt-16 md:mt-24">
              {/* Decorative Line */}
              <div className="max-w-md md:text-left flex flex-col md:items-start gap-6">
                <p className="font-serif text-lg leading-relaxed text-zinc-400 italic font-light">
                  Original works on canvas and paper by Surbhi. <br />
                  Slow, layered, made by hand — each piece is one of one.
                </p>
                <Link
                  href="/gallery"
                  className="inline-block py-4 px-8 bg-accent hover:bg-accent-light text-zinc-950 text-xs font-semibold tracking-[0.2em] rounded shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 text-center w-full sm:w-auto"
                >
                  VIEW THE COLLECTION
                </Link>
              </div>

              <div className="hidden md:block w-32 h-[1px] bg-zinc-800 self-center" />
              
              
            </div>
          </div>

          {/* Scroll Down Hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 animate-bounce">
            <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </section>

        {/* Artist Statement Section */}
        <section className="bg-black py-24 md:py-32 border-t border-white/[0.02] px-6">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
            <span className="text-xs tracking-[0.25em] text-accent uppercase font-medium">The Artist Statement</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-zinc-100 leading-snug max-w-2xl italic">
              "Art is a trace of presence, a container for the quiet moments that escape the noise of daily lives."
            </h2>
            <div className="w-12 h-[1px] bg-zinc-800" />
            <p className="max-w-xl text-zinc-500 text-sm leading-relaxed font-serif">
              Surbhi's studio is located in the heart of Mumbai, where she develops deeply layered, mixed-media paintings. Working primarily with raw canvas, gesso, charcoal, and acrylics, she creates tactile works that feel earthy yet ethereal, offering a space of quiet contemplation.
            </p>
            <Link
              href="/about"
              className="text-xs tracking-[0.2em] text-zinc-400 hover:text-accent border-b border-zinc-800 hover:border-accent pb-1 transition-all duration-300 mt-4"
            >
              READ HER STORY
            </Link>
          </div>
        </section>

        {/* Featured Collection Preview Section */}
        <section className="bg-[#050505] py-24 px-6 border-t border-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            {/* Header info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
              <div>
                <p className="text-xs tracking-[0.25em] text-zinc-500 uppercase font-medium mb-3">Selected Works</p>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-zinc-100">
                  Featured Paintings
                </h2>
              </div>
              <Link
                href="/gallery"
                className="text-xs tracking-[0.2em] text-accent hover:text-white border-b border-accent/30 hover:border-white pb-1 transition-all duration-300"
              >
                VIEW ENTIRE GALLERY
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPaintings.map((painting) => (
                <PaintingCard key={painting.id} painting={painting} />
              ))}
            </div>
          </div>
        </section>

        {/* Studio Visit & Inquiry CTA */}
        <section className="bg-black py-24 px-6 border-t border-white/[0.02]">
          <div className="max-w-4xl mx-auto bg-[#070707] border border-white/[0.02] p-8 md:p-16 rounded-lg text-center flex flex-col items-center gap-6">
            <h3 className="font-serif text-2xl md:text-3xl font-light text-zinc-100">
              Interested in a Custom Piece?
            </h3>
            <p className="max-w-md text-zinc-500 text-sm leading-relaxed font-serif">
              Surbhi is open to commissions and private studio visits by appointment. Get in touch to discuss dimensions, colors, and layout ideas.
            </p>
            <Link
              href="/contact"
              className="inline-block mt-4 py-3 px-8 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold tracking-[0.15em] rounded transition-all duration-300"
            >
              START A CONVERSATION
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] text-zinc-400 border-t border-white/[0.03] pt-16 pb-8 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-16">
        {/* Brand Description Column */}
        <div className="md:col-span-6 flex flex-col gap-4">
          <Link href="/" className="font-serif text-xl font-light tracking-wide text-zinc-100">
            unseen<span className="italic font-normal text-accent font-serif">_art</span> studio
          </Link>
          <p className="max-w-md text-sm leading-relaxed text-zinc-500 font-serif italic">
            Original paintings by Surbhi — works exploring memory, color and the quiet moments between things. Each piece is one of a kind.
          </p>
        </div>

        {/* Explore Links Column */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-200 border-b border-zinc-800 pb-2">
            Explore
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/gallery" className="hover:text-white transition-colors duration-200">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors duration-200">
                About the Artist
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors duration-200">
                Inquire
              </Link>
            </li>
          </ul>
        </div>

        {/* Studio Info Column */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-200 border-b border-zinc-800 pb-2">
            Studio
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm text-zinc-500">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent" />
              Visit by appointment
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent" />
              Worldwide shipping
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent" />
              Commissions welcome
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-zinc-900 text-xs text-zinc-600 gap-4">
        <div>
          © {new Date().getFullYear()} unseen_art studio. All works © Surbhi.
        </div>
        <div className="flex gap-4">
          <Link href="/contact" className="hover:text-zinc-400 transition-colors">
            Support
          </Link>
          <span className="text-zinc-800">|</span>
          <span className="cursor-not-allowed hover:text-zinc-400 transition-colors">
            Admin
          </span>
        </div>
      </div>
    </footer>
  );
}

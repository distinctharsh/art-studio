"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem("user_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "GALLERY", href: "/gallery" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-black/40 backdrop-blur-md border-b border-white/[0.03]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="font-serif text-xl md:text-2xl font-light tracking-wide hover:opacity-80 transition-opacity"
        >
          unseen<span className="italic font-normal text-accent font-serif">_art</span> studio
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs tracking-[0.2em] font-sans transition-all duration-300 relative py-2 hover:text-white ${
                  isActive ? "text-white" : "text-zinc-400"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent transition-transform duration-300" />
                )}
              </Link>
            );
          })}
          
          <div className="w-[1px] h-4 bg-zinc-800" />

          {isLoggedIn ? (
            <Link 
              href="/profile"
              className="text-xs tracking-[0.2em] font-sans text-accent hover:text-accent-light transition-colors relative py-2 flex items-center gap-2"
            >
              PROFILE
            </Link>
          ) : (
            <Link 
              href="/login"
              className="text-xs tracking-[0.2em] font-sans text-zinc-400 hover:text-white transition-colors relative py-2"
            >
              LOGIN
            </Link>
          )}
        </nav>

        {/* Mobile Nav Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 text-zinc-300 hover:text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          <span
            className={`h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
              isOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-current transform transition duration-300 ease-in-out mt-1.5 ${
              isOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
            }`}
          />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 w-full h-screen bg-black/95 z-40 transition-all duration-500 ease-in-out flex flex-col items-center justify-center ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Close button in Drawer */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-zinc-400 hover:text-white"
          aria-label="Close Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <nav className="flex flex-col items-center gap-8 text-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg tracking-[0.25em] font-sans transition-colors duration-300 ${
                  isActive ? "text-accent" : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="w-12 h-[1px] bg-zinc-800" />
          
          {isLoggedIn ? (
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="text-lg tracking-[0.25em] font-sans transition-colors duration-300 text-accent hover:text-accent-light"
            >
              PROFILE
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-lg tracking-[0.25em] font-sans transition-colors duration-300 text-zinc-400 hover:text-white"
            >
              LOGIN
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { images } from "@/app/assets/images";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-xl shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={images.logo.dark}
              alt="Vittl"
              width={80}
              height={28}
              priority
              className="h-7 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/chi-siamo"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Chi siamo
            </Link>
            <Link
              href="/piani"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Piani
            </Link>
            <Link
              href="/contatti"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contatti
            </Link>
            <Link
              href="/login"
              className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105"
            >
              Accedi
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
            <Link
              href="/"
              className="block text-sm font-medium text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/chi-siamo"
              className="block text-sm font-medium text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Chi siamo
            </Link>
            <Link
              href="/recensioni"
              className="block text-sm font-medium text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Recensioni
            </Link>
            <Link
              href="/contatti"
              className="block text-sm font-medium text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contatti
            </Link>
            <Link
              href="/login"
              className="block px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accedi
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

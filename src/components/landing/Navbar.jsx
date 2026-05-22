import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Products", href: "#products" },
  { label: "Solutions", href: "#solutions" },
  { label: "Developers", href: "#developers" },
  { label: "Resources", href: "#resources" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100"
        : "bg-transparent"
    }`}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <svg viewBox="0 0 60 25" className="w-14 h-auto" fill="none">
              <text x="0" y="20" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="22" fill="#0A2540">
                FlutterStack
              </text>
            </svg>
            <span className="text-[22px] font-black tracking-tight text-[#0A2540]">FlutterStack</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-0.5 px-3.5 py-2 text-sm font-medium text-[#425466] hover:text-[#0A2540] transition-colors rounded-lg hover:bg-gray-50"
              >
                {link.label}
                {link.label !== "Pricing" && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="#" className="text-sm font-medium text-[#425466] hover:text-[#0A2540] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-[#D1D9E0]">
              Sign in
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 text-sm font-medium text-white bg-[#635BFF] hover:bg-[#5751e8] px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Contact sales
              <span className="text-base leading-none">›</span>
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between px-3 py-3 text-sm font-medium text-[#425466] hover:text-[#0A2540] rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                  {link.label !== "Pricing" && <ChevronDown className="w-4 h-4 opacity-50" />}
                </a>
              ))}
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <a href="#" className="text-sm font-medium text-center text-[#425466] px-4 py-2.5 rounded-lg border border-gray-200">Sign in</a>
                <a href="#" className="text-sm font-medium text-center text-white bg-[#635BFF] px-4 py-2.5 rounded-lg">Contact sales</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
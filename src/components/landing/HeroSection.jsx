import React from 'react';
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ticker = [
  { label: "Global GDP running on FlutterStack:", value: "1.65089762%" },
];

const logos = [
  "MetLife", "ramp ↗", "Marriott", "Figma", "Woo", "▲ Vercel", "Uber", "DoorDash", "Shopify",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Aurora Wave Background - positioned right side like Stripe */}
      <div className="absolute top-0 right-0 w-[55%] h-full pointer-events-none select-none">
        <div className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 70% at 80% 30%, rgba(255,150,50,0.55) 0%, transparent 60%),
              radial-gradient(ellipse 60% 80% at 100% 60%, rgba(255,80,120,0.50) 0%, transparent 55%),
              radial-gradient(ellipse 70% 60% at 60% 10%, rgba(180,130,255,0.45) 0%, transparent 50%),
              radial-gradient(ellipse 50% 90% at 90% 20%, rgba(100,90,255,0.4) 0%, transparent 50%)
            `,
          }}
        />
        {/* Flowing ribbon shapes */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 800 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#FF3B80" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#635BFF" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.3" />
            </linearGradient>
            <filter id="blur1">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
          <path
            d="M200,0 C350,100 500,50 700,200 C850,320 750,500 600,600 C450,700 200,650 100,800 C50,870 100,900 200,900 L800,900 L800,0 Z"
            fill="url(#grad1)"
            opacity="0.6"
          />
          <path
            d="M400,0 C550,80 650,150 750,300 C820,400 780,550 700,650 C600,760 400,750 350,900 L800,900 L800,0 Z"
            fill="url(#grad2)"
            opacity="0.5"
          />
          <path
            d="M500,0 C600,120 700,200 780,350 C820,450 800,600 750,700 C700,800 600,850 550,900 L800,900 L800,0 Z"
            fill="rgba(255,100,50,0.25)"
          />
        </svg>
        {/* Soft white fade on left edge */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
      </div>

      {/* Ticker Bar */}
      <div className="relative z-10 pt-[70px]">
        <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-[#425466] mb-10"
          >
            <span className="font-medium">Global GDP running on FlutterStack:</span>
            <span className="font-semibold text-[#0A2540] ml-1.5 tabular-nums">1.65089762%</span>
          </motion.div>

          {/* Headline */}
          <div className="max-w-[600px]">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[52px] sm:text-[60px] lg:text-[68px] font-extrabold leading-[1.05] tracking-tight text-[#0A2540] mb-6"
            >
              <span className="text-[#0A2540]">Financial infrastructure</span>
              <br />
              <span className="text-[#0A2540]">to grow </span>
              <span className="text-[#635BFF]">your revenue.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[18px] sm:text-[20px] text-[#425466] leading-relaxed mb-10 max-w-[520px]"
            >
              Accept payments, offer financial services, and implement custom revenue models—from your first transaction to your billionth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <a
                href="#"
                className="flex items-center gap-2 bg-[#635BFF] hover:bg-[#5751E8] text-white font-medium text-base px-6 py-3.5 rounded-lg transition-colors shadow-md shadow-[#635BFF]/25"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="flex items-center gap-2.5 text-[#0A2540] font-medium text-base px-5 py-3.5 rounded-lg border border-[#D1D9E0] hover:bg-gray-50 transition-colors bg-white"
              >
                {/* Google G */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Logos Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative z-10 mt-32 border-t border-gray-100 bg-white"
      >
        <div className="max-w-[1200px] mx-auto px-6 py-7">
          <div className="flex items-center gap-10 flex-wrap">
            {logos.map((logo) => (
              <span key={logo} className="text-sm font-semibold text-[#8898AA] whitespace-nowrap">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
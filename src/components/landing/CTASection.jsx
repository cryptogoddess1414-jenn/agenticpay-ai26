import React from 'react';
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-[#0A2540]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[40px] sm:text-[52px] font-extrabold text-white leading-tight tracking-tight mb-5">
            Ready to get started?
          </h2>
          <p className="text-lg text-[#8898AA] max-w-xl mx-auto mb-10">
            Join millions of businesses using FlutterStack to grow their revenue. Free forever for personal projects.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="flex items-center gap-2 bg-[#635BFF] hover:bg-[#5751E8] text-white font-semibold text-base px-8 py-4 rounded-lg transition-colors shadow-lg shadow-[#635BFF]/30"
            >
              Start now <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-white font-semibold text-base px-8 py-4 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
            >
              Contact sales
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
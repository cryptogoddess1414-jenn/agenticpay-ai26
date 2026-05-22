import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-blue-600 animate-gradient" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* Glow orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-400/20 rounded-full blur-[60px]" />

          <div className="relative z-10 px-8 py-20 lg:px-16 lg:py-24 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-8">
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span className="text-xs font-semibold text-white/90 tracking-wide">
                Get started in under 5 minutes
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
              Ready to build{" "}
              <br className="hidden sm:block" />
              something amazing?
            </h2>
            <p className="max-w-xl mx-auto text-lg text-white/70 mb-10">
              Join 50,000+ Flutter developers who ship faster with FlutterStack. 
              Free forever for personal projects.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8 h-14 text-base font-semibold shadow-2xl group"
              >
                Start Building Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white/90 hover:text-white hover:bg-white/10 rounded-2xl px-8 h-14 text-base font-semibold"
              >
                Talk to Sales
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
import React from 'react';
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const products = [
  {
    tag: "Payments",
    title: "Accept and optimize payments globally — online and in person",
    description: "A complete payments platform engineered for the most demanding businesses.",
    link: "Explore Payments",
    bg: "bg-[#F0EFFF]",
    accent: "text-[#635BFF]",
  },
  {
    tag: "Billing",
    title: "Flexible subscription and usage billing for SaaS",
    description: "Handle subscriptions, metered billing, multi-currency, and revenue recognition automatically.",
    link: "Explore Billing",
    bg: "bg-[#F0F9FF]",
    accent: "text-[#1DA1F2]",
  },
  {
    tag: "Connect",
    title: "Embed payments and financial services in your platform",
    description: "The fastest way to embed payments, payouts, and financial services for your marketplace or SaaS.",
    link: "Explore Connect",
    bg: "bg-[#F0FFF4]",
    accent: "text-[#059669]",
  },
  {
    tag: "Radar",
    title: "Machine learning fraud prevention",
    description: "Block fraud before it costs you. Adaptive fraud models trained on billions of data points.",
    link: "Explore Radar",
    bg: "bg-[#FFF7F0]",
    accent: "text-[#F97316]",
  },
  {
    tag: "Issuing",
    title: "Create cards instantly for your platform users",
    description: "Issue virtual or physical cards to your users in minutes. Full spend controls and real-time authorizations.",
    link: "Explore Issuing",
    bg: "bg-[#FDF0FF]",
    accent: "text-[#9333EA]",
  },
  {
    tag: "Terminal",
    title: "In-person payments for any business",
    description: "Accept in-person payments at the point of sale. Pre-certified readers, seamless SDK integration.",
    link: "Explore Terminal",
    bg: "bg-[#F0F4FF]",
    accent: "text-[#4F46E5]",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#F6F9FC] border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-[36px] sm:text-[44px] font-extrabold text-[#0A2540] leading-tight tracking-tight">
            Everything you need to build great financial products.
          </h2>
          <p className="text-lg text-[#425466] mt-3 max-w-2xl">
            FlutterStack provides a modular set of tools — use the pieces you need, leave the rest.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <motion.div
              key={p.tag}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-md transition-shadow group"
            >
              <div className={`text-xs font-bold uppercase tracking-widest ${p.accent} mb-3`}>{p.tag}</div>
              <h3 className="text-[17px] font-bold text-[#0A2540] leading-snug mb-3">{p.title}</h3>
              <p className="text-sm text-[#425466] leading-relaxed mb-5">{p.description}</p>
              <a href="#" className={`flex items-center gap-1.5 text-sm font-semibold ${p.accent} hover:underline`}>
                {p.link} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
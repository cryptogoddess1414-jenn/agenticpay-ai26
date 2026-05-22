import React from 'react';
import { motion } from "framer-motion";

const stats = [
  { value: "135+", label: "currencies and payment methods supported" },
  { value: "$1.9T", label: "in payments volume processed in 2025" },
  { value: "99.999%", label: "historical uptime for FlutterStack services" },
  { value: "200M+", label: "active subscriptions managed on Billing" },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-[#0A2540]">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[36px] sm:text-[44px] font-extrabold text-white leading-tight tracking-tight">
            The backbone of global commerce
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center lg:text-left border-t border-white/10 pt-6"
            >
              <div className="text-[40px] sm:text-[48px] font-black text-white leading-none mb-3">
                {stat.value}
              </div>
              <div className="text-sm text-[#8898AA] leading-snug">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
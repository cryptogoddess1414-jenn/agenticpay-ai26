import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const stories = [
  {
    company: "Hertz",
    headline: "Hertz unifies commerce with FlutterStack.",
    stats: [
      { value: "160", label: "countries" },
      { value: "11K+", label: "locations globally" },
    ],
    products: "Payments, Terminal, Connect, Radar",
    img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop",
  },
  {
    company: "URBN",
    headline: "URBN consolidates $5 billion in online and in-store revenue.",
    stats: [
      { value: "5+", label: "consumer brands" },
      { value: "700+", label: "store locations" },
    ],
    products: "Payments, Terminal, Connect, Radar, Link",
    img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop",
  },
  {
    company: "Instacart",
    headline: "Instacart powers online grocery delivery with FlutterStack.",
    stats: [
      { value: "600K+", label: "shoppers" },
      { value: "1.8K", label: "retail partners" },
    ],
    products: "Payments, Connect, Data Pipeline, Issuing",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
  },
];

export default function CustomerStoriesSection() {
  const [active, setActive] = useState(0);
  const story = stories[active];

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-[36px] sm:text-[44px] font-extrabold text-[#0A2540] leading-tight tracking-tight">
            Powering businesses of all sizes.
          </h2>
          <p className="text-lg text-[#425466] mt-3">
            Run your business on a reliable platform that adapts to your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Accordion list */}
          <div className="space-y-1">
            {stories.map((s, i) => (
              <div
                key={s.company}
                className={`border-b border-gray-100 cursor-pointer transition-all`}
                onClick={() => setActive(i)}
              >
                <div className={`py-5 ${active === i ? "" : "hover:bg-gray-50 px-2 rounded-lg"}`}>
                  <h3 className={`text-base font-bold leading-snug ${active === i ? "text-[#635BFF]" : "text-[#0A2540]"}`}>
                    {s.headline}
                  </h3>
                  {active === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4"
                    >
                      <div className="flex gap-6 mb-3">
                        {s.stats.map(stat => (
                          <div key={stat.label}>
                            <div className="text-2xl font-black text-[#0A2540]">{stat.value}</div>
                            <div className="text-xs text-[#8898AA]">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-[#8898AA] mb-3">
                        <span className="font-semibold text-[#425466]">Products used: </span>{s.products}
                      </div>
                      <a href="#" className="flex items-center gap-1.5 text-sm text-[#635BFF] font-medium hover:underline">
                        Read the story <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </motion.div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Image */}
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={story.img}
              alt={story.company}
              className="w-full h-72 lg:h-80 object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const solutions = [
  {
    id: "payments",
    label: "Accept and optimize payments globally",
    description: "A complete payments platform engineered to reduce friction and convert more revenue. We handle the complexities of global payments so you can focus on building great products.",
    tag: "Payments",
    color: "#0A2540",
    preview: (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Checkout UI */}
        <div className="p-5 border-b border-gray-100 bg-[#F6F9FC]">
          <div className="text-xs text-[#8898AA] mb-1">roastery.com/checkout</div>
          <div className="text-sm font-semibold text-[#0A2540]">Pay Roastery</div>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="text-xs text-[#8898AA]">Email</label>
            <div className="mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#0A2540] bg-white">jane.diaz@stripe.com</div>
          </div>
          <div>
            <label className="text-xs text-[#8898AA]">Payment method</label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {["Card", "Klarna", "PayPal"].map(m => (
                <div key={m} className={`px-2 py-2 border rounded-lg text-xs text-center font-medium ${m === "Card" ? "border-[#635BFF] bg-[#F0EFFF] text-[#635BFF]" : "border-gray-200 text-[#425466]"}`}>{m}</div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#8898AA] bg-white">1234 5678 9012 3456</div>
            <div className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#8898AA] bg-white">MM / YY</div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-sm">
            <span className="text-[#425466]">Total</span>
            <span className="font-bold text-[#0A2540]">$165.38</span>
          </div>
          <button className="w-full bg-[#635BFF] text-white py-2.5 rounded-lg font-medium text-sm">Continue</button>
        </div>
      </div>
    ),
  },
  {
    id: "billing",
    label: "Enable any billing model",
    description: "Whether you charge per seat, per usage, or through subscriptions — FlutterStack Billing supports every model. Start simple and evolve as you grow.",
    tag: "Billing",
    color: "#0A2540",
    preview: (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-5">
        <div className="text-xs font-semibold text-[#8898AA] uppercase tracking-wider mb-4">Usage Billing</div>
        <div className="mb-4">
          <div className="text-sm font-bold text-[#0A2540]">Pro Plan</div>
          <div className="text-xs text-[#425466]">Billed monthly</div>
        </div>
        <div className="bg-[#F6F9FC] rounded-xl p-4 mb-4">
          <div className="text-xs text-[#8898AA] mb-1">Tokens used (last 30 days)</div>
          <div className="text-2xl font-bold text-[#0A2540]">1,500,000,000</div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-[#635BFF] to-[#A78BFA] rounded-full" />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#425466]">$0.01 per 1,000 units</span>
          <span className="font-bold text-[#0A2540]">$15,000.00</span>
        </div>
      </div>
    ),
  },
  {
    id: "connect",
    label: "Embed payments in your platform",
    description: "With FlutterStack Connect, you can onboard businesses, process payments on their behalf, and handle payouts — all without managing complex compliance.",
    tag: "Connect",
    color: "#0A2540",
    preview: (
      <div className="bg-[#0A2540] rounded-2xl shadow-xl overflow-hidden p-5">
        <div className="text-xs font-semibold text-[#8898AA] uppercase tracking-wider mb-4">Platform Dashboard</div>
        {[
          { name: "Acme Corp", amount: "$12,450", status: "Active", color: "bg-green-400" },
          { name: "NovaPay", amount: "$8,920", status: "Pending", color: "bg-yellow-400" },
          { name: "Vercel Inc.", amount: "$31,200", status: "Active", color: "bg-green-400" },
        ].map(item => (
          <div key={item.name} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-sm text-white font-medium">{item.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-white">{item.amount}</div>
              <div className="text-xs text-[#8898AA]">{item.status}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

export default function FlexibleSolutionsSection() {
  const [active, setActive] = useState("payments");
  const activeSolution = solutions.find(s => s.id === active);

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-[40px] sm:text-[48px] font-extrabold text-[#0A2540] leading-tight tracking-tight">
            Flexible solutions for every business model.{" "}
            <span className="text-[#635BFF]">Grow your business with a comprehensive set of payments and financial tools.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Tabs */}
          <div>
            {solutions.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`group cursor-pointer border-l-2 pl-6 py-4 mb-2 transition-all duration-200 ${
                  active === s.id ? "border-[#635BFF]" : "border-gray-200 hover:border-gray-400"
                }`}
                onClick={() => setActive(s.id)}
              >
                <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${active === s.id ? "text-[#635BFF]" : "text-[#8898AA]"}`}>
                  {s.tag}
                </div>
                <div className={`text-base font-bold mb-1 ${active === s.id ? "text-[#0A2540]" : "text-[#425466] group-hover:text-[#0A2540]"}`}>
                  {s.label}
                </div>
                {active === s.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-sm text-[#425466] leading-relaxed mt-2"
                  >
                    {s.description}
                    <a href="#" className="flex items-center gap-1.5 text-[#635BFF] font-medium mt-3 text-sm hover:underline">
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Preview */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeSolution?.preview}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
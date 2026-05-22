import React from 'react';
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Integrated",
    price: null,
    customPrice: "2.9% + 30¢",
    priceNote: "per successful card charge",
    description: "A fully integrated suite of financial and payments products.",
    cta: "Get started",
    ctaStyle: "border border-[#D1D9E0] text-[#0A2540] hover:bg-gray-50",
    features: [
      "Payments",
      "Billing",
      "Invoicing",
      "Radar fraud protection",
      "Access to 135+ currencies",
      "No setup fees",
    ],
  },
  {
    name: "Customized",
    price: null,
    customPrice: "Custom",
    priceNote: "tailored volume discounts",
    description: "Large payment volume or unique business models? Let's talk.",
    cta: "Contact sales",
    ctaStyle: "bg-[#635BFF] text-white hover:bg-[#5751E8]",
    popular: true,
    features: [
      "Everything in Integrated",
      "Volume discounts",
      "Multi-product discounts",
      "Country-specific rates",
      "Dedicated account management",
      "Priority support",
    ],
  },
  {
    name: "Crypto",
    price: null,
    customPrice: "1% + 0¢",
    priceNote: "per crypto transaction",
    description: "Accept Bitcoin, Ethereum, USDC, and 100+ cryptocurrencies via Coinbase Commerce.",
    cta: "Connect Coinbase",
    ctaStyle: "bg-[#0052FF] text-white hover:bg-[#0045D8]",
    coinbase: true,
    features: [
      "Powered by Coinbase Commerce",
      "BTC, ETH, USDC, SOL & more",
      "Self-custody — funds go direct to your wallet",
      "No chargebacks",
      "Global, borderless payments",
      "Real-time payment confirmation",
    ],
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-[#635BFF] mb-3">Pricing</div>
          <h2 className="text-[36px] sm:text-[44px] font-extrabold text-[#0A2540] leading-tight tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-[#425466] mt-3 max-w-xl">
            Only pay for what you use. No monthly fees, no hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-2xl border p-8 ${plan.popular ? "border-[#635BFF] shadow-lg shadow-[#635BFF]/10" : plan.coinbase ? "border-[#0052FF] shadow-lg shadow-[#0052FF]/10" : "border-gray-200"}`}
            >
              {plan.popular && (
                <div className="text-xs font-bold text-[#635BFF] uppercase tracking-widest mb-4">Most popular</div>
              )}
              {plan.coinbase && (
                <div className="flex items-center gap-2 mb-4">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0052FF">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8a7.2 7.2 0 110 14.4A7.2 7.2 0 0112 4.8zm2.88 4.32H9.12a.72.72 0 00-.72.72v4.32a.72.72 0 00.72.72h5.76a.72.72 0 00.72-.72V9.84a.72.72 0 00-.72-.72z"/>
                  </svg>
                  <span className="text-xs font-bold text-[#0052FF] uppercase tracking-widest">Coinbase Commerce</span>
                </div>
              )}
              <div className="text-sm font-semibold text-[#425466] mb-2">{plan.name}</div>
              <div className="text-[36px] font-black text-[#0A2540] leading-none mb-1">{plan.customPrice}</div>
              <div className="text-sm text-[#8898AA] mb-4">{plan.priceNote}</div>
              <p className="text-sm text-[#425466] mb-6 leading-relaxed">{plan.description}</p>
              <a
                href="#"
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium text-sm transition-colors mb-7 ${plan.ctaStyle}`}
              >
                {plan.cta} <ArrowRight className="w-4 h-4" />
              </a>
              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#425466]">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.coinbase ? "text-[#0052FF]" : "text-[#635BFF]"}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
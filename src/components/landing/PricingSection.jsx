import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for side projects and learning",
    features: [
      "10K API requests/mo",
      "500 active users",
      "2 GB storage",
      "Community support",
      "Basic analytics",
    ],
    cta: "Start Free",
    variant: "outline",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing apps and small teams",
    features: [
      "1M API requests/mo",
      "Unlimited users",
      "50 GB storage",
      "Priority support",
      "Advanced analytics",
      "Custom domains",
      "Team collaboration",
    ],
    cta: "Start 14-day Trial",
    variant: "default",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For scale and compliance needs",
    features: [
      "Unlimited everything",
      "99.99% SLA",
      "SOC 2 compliance",
      "Dedicated support",
      "Custom integrations",
      "On-premise option",
      "SSO & SAML",
    ],
    cta: "Contact Sales",
    variant: "outline",
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-primary">Pricing</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-4 mb-6">
            Start free,{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              scale infinitely
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            No credit card required. Upgrade when you're ready.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative ${plan.popular ? 'md:-mt-4 md:mb-0' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-primary to-purple-500 text-white rounded-full text-xs font-bold shadow-lg shadow-primary/25">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}
              <div className={`relative bg-card rounded-2xl p-8 h-full flex flex-col border ${
                plan.popular 
                  ? 'border-primary/40 shadow-2xl shadow-primary/10' 
                  : 'border-border shadow-sm hover:shadow-lg'
              } transition-all duration-300 hover:border-primary/20`}>
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.popular ? 'bg-primary/15' : 'bg-accent'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.popular ? 'text-primary' : 'text-foreground'}`} />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.variant}
                  className={`w-full rounded-xl h-12 text-sm font-semibold group ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-lg shadow-primary/25' 
                      : ''
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { motion } from "framer-motion";

const integrations = [
  { name: "Firebase", icon: "🔥", color: "bg-orange-50 border-orange-200" },
  { name: "Supabase", icon: "⚡", color: "bg-emerald-50 border-emerald-200" },
  { name: "Stripe", icon: "💳", color: "bg-purple-50 border-purple-200" },
  { name: "AWS", icon: "☁️", color: "bg-yellow-50 border-yellow-200" },
  { name: "GitHub", icon: "🐙", color: "bg-slate-50 border-slate-200" },
  { name: "Vercel", icon: "▲", color: "bg-slate-50 border-slate-200" },
  { name: "Sentry", icon: "🛡️", color: "bg-red-50 border-red-200" },
  { name: "Algolia", icon: "🔍", color: "bg-blue-50 border-blue-200" },
  { name: "Twilio", icon: "📱", color: "bg-red-50 border-red-200" },
  { name: "SendGrid", icon: "📧", color: "bg-blue-50 border-blue-200" },
  { name: "RevenueCat", icon: "🐱", color: "bg-pink-50 border-pink-200" },
  { name: "OneSignal", icon: "🔔", color: "bg-red-50 border-red-200" },
];

export default function IntegrationsSection() {
  return (
    <section id="integrations" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-primary">Integrations</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-4 mb-6">
            Connects with{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              everything
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            First-class integrations with the tools you already use. 
            One-click setup, zero configuration headaches.
          </p>
        </motion.div>

        {/* Integration Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {integrations.map((integration, i) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="group flex flex-col items-center gap-3 p-5 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {integration.icon}
                </div>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {integration.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connector Lines Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 flex items-center justify-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-2xl shadow-sm">
            <span className="text-sm text-muted-foreground">And</span>
            <span className="text-lg font-bold text-primary">50+</span>
            <span className="text-sm text-muted-foreground">more integrations available</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
import React from 'react';
import { motion } from "framer-motion";
import { 
  CreditCard, Shield, Database, Wifi, 
  Smartphone, Globe, Layers, Terminal 
} from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Payments",
    description: "Accept payments globally with our pre-built Flutter widgets. Stripe, Apple Pay, and Google Pay out of the box.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Shield,
    title: "Authentication",
    description: "Social logins, magic links, and biometric auth. Fully integrated with Flutter's native security layer.",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    icon: Database,
    title: "Real-time Database",
    description: "Firestore-compatible real-time sync with offline support. Your data, everywhere, instantly.",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    icon: Wifi,
    title: "Edge Functions",
    description: "Deploy serverless functions at the edge. Sub-50ms latency globally with automatic scaling.",
    gradient: "from-orange-500 to-red-400",
  },
  {
    icon: Smartphone,
    title: "Push Notifications",
    description: "Cross-platform push notifications with rich media. Segment, target, and automate campaigns.",
    gradient: "from-primary to-purple-400",
  },
  {
    icon: Globe,
    title: "CDN & Hosting",
    description: "Global CDN with automatic image optimization. Deploy Flutter Web apps with zero configuration.",
    gradient: "from-teal-500 to-blue-400",
  },
  {
    icon: Layers,
    title: "State Management",
    description: "Built-in reactive state with automatic persistence. No more boilerplate, just clean architecture.",
    gradient: "from-pink-500 to-rose-400",
  },
  {
    icon: Terminal,
    title: "CLI & DevTools",
    description: "Powerful CLI for scaffolding, testing, and deployment. Integrated debugging dashboard.",
    gradient: "from-slate-600 to-slate-400",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-primary">Everything you need</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-4 mb-6">
            One SDK.{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Every feature.
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Stop piecing together dozens of services. FlutterStack gives you 
            a unified, type-safe SDK for the entire backend.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 h-full">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-blue-500/8 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent border border-primary/15 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary tracking-wide uppercase">
            Now with Flutter 3.24 Support
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6"
        >
          <span className="block text-foreground">Build full-stack</span>
          <span className="block bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
            Flutter apps
          </span>
          <span className="block text-foreground">at lightspeed</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10"
        >
          The infrastructure platform for modern Flutter developers. 
          Payments, auth, databases, and real-time APIs — 
          all in one elegant SDK.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white rounded-2xl px-8 h-14 text-base font-semibold shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all group"
          >
            Start Building
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-2xl px-8 h-14 text-base font-semibold border-border hover:bg-accent group"
          >
            <Play className="w-4 h-4 mr-2 text-primary" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "50K+", label: "Developers" },
            { value: "99.9%", label: "Uptime" },
            { value: "2M+", label: "API Calls/day" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-50" />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-background rounded-lg text-xs text-muted-foreground">
                  <span className="text-green-500">●</span>
                  flutterstack.dev/dashboard
                </div>
              </div>
            </div>
            {/* Dashboard Preview */}
            <div className="p-6 lg:p-8 bg-gradient-to-br from-card to-muted/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Monthly Revenue", value: "$48,290", change: "+12.5%", color: "text-green-500" },
                  { label: "Active Users", value: "12,847", change: "+8.2%", color: "text-green-500" },
                  { label: "API Requests", value: "2.1M", change: "+23.1%", color: "text-green-500" },
                ].map((card) => (
                  <div key={card.label} className="bg-background/80 backdrop-blur rounded-xl p-4 border border-border">
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                    <span className={`text-xs font-medium ${card.color}`}>{card.change}</span>
                  </div>
                ))}
              </div>
              {/* Chart placeholder */}
              <div className="bg-background/80 backdrop-blur rounded-xl p-4 border border-border">
                <div className="flex items-end gap-1.5 h-32">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-md" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
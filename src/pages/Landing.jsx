import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import CodePreviewSection from '../components/landing/CodePreviewSection';
import IntegrationsSection from '../components/landing/IntegrationsSection';
import PricingSection from '../components/landing/PricingSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import FooterSection from '../components/landing/FooterSection';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CodePreviewSection />
      <IntegrationsSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
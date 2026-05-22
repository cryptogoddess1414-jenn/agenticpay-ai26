import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FlexibleSolutionsSection from '../components/landing/FlexibleSolutionsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import StatsSection from '../components/landing/StatsSection';
import CustomerStoriesSection from '../components/landing/CustomerStoriesSection';
import PricingSection from '../components/landing/PricingSection';
import CTASection from '../components/landing/CTASection';
import FooterSection from '../components/landing/FooterSection';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FlexibleSolutionsSection />
      <FeaturesSection />
      <StatsSection />
      <CustomerStoriesSection />
      <PricingSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
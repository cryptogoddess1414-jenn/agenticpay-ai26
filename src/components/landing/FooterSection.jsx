import React from 'react';

const footerLinks = {
  Products: ["Payments", "Billing", "Webhooks", "API Keys", "AI Analytics", "Agent Actions", "Identity", "Reporting"],
  Solutions: ["Enterprise", "Startups", "E-commerce", "SaaS", "Marketplaces", "Creator Economy"],
  Developers: ["Documentation", "API Reference", "API Status", "API Changelog", "Build with AI"],
  Company: ["About AgenticPay", "Customers", "Jobs", "Newsroom", "AgenticPay Blog", "AI Sessions"],
  Help: ["Support Center", "Support Plans", "Guides", "Contact Us"],
};

export default function FooterSection() {
  return (
    <footer className="bg-[#0A2540] border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-14">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#635BFF] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                  <path d="M12 2L3 7l9 5 9-5-9-5z" fill="white" fillOpacity="0.9"/>
                  <path d="M3 12l9 5 9-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 17l9 5 9-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6"/>
                </svg>
              </div>
              <span className="text-[20px] font-black text-white tracking-tight">AgenticPay <span className="text-[#635BFF]">AI</span></span>
            </div>
            <p className="text-sm text-[#8898AA] leading-relaxed">
              Intelligent payment infrastructure for the agentic era.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[#8898AA] hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8898AA]">© 2026 AgenticPay AI, Inc.</p>
          <div className="flex flex-wrap items-center gap-6">
            {["Privacy & Terms", "Privacy Center", "Cookie Settings", "Do Not Sell"].map((item) => (
              <a key={item} href="#" className="text-xs text-[#8898AA] hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
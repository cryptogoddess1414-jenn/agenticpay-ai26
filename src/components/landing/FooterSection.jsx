import React from 'react';

const footerLinks = {
  Products: ["Payments", "Billing", "Connect", "Radar", "Issuing", "Terminal", "Identity", "Climate"],
  Solutions: ["Enterprise", "Startups", "E-commerce", "SaaS", "Marketplaces", "Creator Economy"],
  Developers: ["Documentation", "API Reference", "API Status", "API Changelog", "Build with AI"],
  Company: ["About Stripe", "Customers", "Jobs", "Newsroom", "Stripe Press", "Stripe Sessions"],
  Help: ["Support Center", "Support Plans", "Guides", "Contact Us"],
};

export default function FooterSection() {
  return (
    <footer className="bg-[#0A2540] border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-14">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="text-[22px] font-black text-white tracking-tight mb-3">
              Flutter<span className="text-[#635BFF]">Stack</span>
            </div>
            <p className="text-sm text-[#8898AA] leading-relaxed">
              Financial infrastructure for the internet.
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
          <p className="text-xs text-[#8898AA]">© 2026 FlutterStack, Inc.</p>
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
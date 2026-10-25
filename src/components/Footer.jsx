import React from 'react';
import { BUSINESS_EMAIL } from '../config/razorpay';

const Footer = () => {
  return (
    <footer className="w-full bg-[#e8ece4] px-6 py-12 md:py-16 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        
        {/* Left Side: Brand and Copyright */}
        <div className="max-w-sm">
          <h2 className="text-2xl font-serif text-[#3a5a40] font-bold mb-4">Archi</h2>
          <p className="text-[#555555] text-sm leading-relaxed">
            © 2026 Archi Counseling. Cultivating tranquility through professional care.
          </p>
          <a href={`mailto:${BUSINESS_EMAIL}`} className="inline-block mt-3 text-sm text-[#3a5a40] hover:underline">
            {BUSINESS_EMAIL}
          </a>
        </div>

        {/* Right Side: Links */}
        <div className="flex gap-12 md:gap-24">
          {/* Practice Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[#8c7355] text-xs font-bold uppercase tracking-wider mb-2">Practice</h3>
            <a href="#" className="text-[#555555] hover:text-[#3a5a40] text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#555555] hover:text-[#3a5a40] text-sm transition-colors">Terms of Service</a>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[#8c7355] text-xs font-bold uppercase tracking-wider mb-2">Resources</h3>
            <a href="#" className="text-[#555555] hover:text-[#3a5a40] text-sm transition-colors">Patient Portal</a>
            <a href="#" className="text-[#555555] hover:text-[#3a5a40] text-sm transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
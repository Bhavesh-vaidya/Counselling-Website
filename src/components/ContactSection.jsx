import React from 'react';

const ContactSection = () => {
  return (
    <div className="w-full bg-[#f4f3ef] py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-[#f0eee9]">
        <h2 className="text-3xl font-serif text-[#1a1a1a] mb-8">Reach out to us</h2>
        <form className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col">
              <label className="text-xs font-bold text-[#888888] uppercase mb-2">Full Name</label>
              <input type="text" placeholder="John Doe" className="border-b border-[#dcdcdc] py-2 focus:outline-none focus:border-[#3a5a40] bg-transparent" />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-xs font-bold text-[#888888] uppercase mb-2">Email Address</label>
              <input type="email" placeholder="john@example.com" className="border-b border-[#dcdcdc] py-2 focus:outline-none focus:border-[#3a5a40] bg-transparent" />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-[#888888] uppercase mb-2">How can we help?</label>
            <input type="text" placeholder="Briefly describe your situation..." className="border-b border-[#dcdcdc] py-2 focus:outline-none focus:border-[#3a5a40] bg-transparent" />
          </div>
          <button type="button" className="bg-[#8c7355] hover:bg-[#7a644a] text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors mt-4">
            SEND MESSAGE
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactSection;
import React from 'react';
import ScheduleSession from '../components/ScheduleSession';
import ContactSection from '../components/ContactSection';

const ServiceClarity = () => {
  return (
    <div className="w-full bg-[#fcfbf9] text-[#333333] font-sans">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <span className="text-[#888888] text-xs font-bold tracking-widest uppercase block">Individual Counseling</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">Emotional Clarity Session</h1>
          <p className="text-[#555555] leading-relaxed max-w-md">
            A dedicated space to navigate complex emotions and gain perspective. We focus on uncovering patterns and building resilience for lasting mental well-being.
          </p>
          <div className="flex items-end gap-2 pt-2">
            <span className="text-3xl font-bold text-[#1a1a1a]">₹1,500</span>
            <span className="text-[#555555] text-sm pb-1">/ per 60 min session</span>
          </div>
          <div className="flex gap-3 pt-4">
            <span className="bg-[#e8ece4] text-[#4a5f46] text-xs font-medium px-4 py-2 rounded-full">Evidence-Based</span>
            <span className="bg-[#e8ece4] text-[#4a5f46] text-xs font-medium px-4 py-2 rounded-full">Safe Space</span>
          </div>
        </div>
        <div className="flex-1 w-full">
          <img src="/assets/service-clarity-hero.jpg" alt="Therapy room armchair" className="w-full h-[450px] object-cover rounded-3xl shadow-lg" />
        </div>
      </section>

      {/* What to expect */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-serif text-[#1a1a1a] mb-10 text-center md:text-left">What to expect from your journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#fcfaf8] p-8 rounded-2xl border border-[#f0eee9]">
            <h3 className="text-xl font-bold mb-3">Safe space for expression</h3>
            <p className="text-[#555555] text-sm leading-relaxed mb-6">Our sessions provide a confidential, non-judgmental environment where your voice is heard and your emotions are validated without reservation.</p>
            <div className="w-10 h-10 bg-[#e8ece4] rounded-full flex items-center justify-center text-[#4a5f46]">🤝</div>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-[#f0eee9] shadow-sm">
            <div className="w-10 h-10 bg-[#fdf3e7] rounded-full flex items-center justify-center text-[#a68a64] mb-6">📊</div>
            <h3 className="text-xl font-bold mb-3">Evidence-Based</h3>
            <p className="text-[#555555] text-sm leading-relaxed">Methodologies grounded in proven psychological science.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-[#f0eee9] shadow-sm">
            <h3 className="text-xl font-bold mb-3">Personalized growth plan</h3>
            <p className="text-[#555555] text-sm leading-relaxed mb-6">We co-create a roadmap specifically tailored to your unique emotional landscape and long-term goals.</p>
            <div className="w-10 h-10 bg-[#eef3ea] rounded-full flex items-center justify-center text-[#3a5a40]">📝</div>
          </div>
          <div className="bg-[#fcfaf8] p-8 rounded-2xl border border-[#f0eee9]">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold">Holistic Approach</h3>
              <div className="w-10 h-10 bg-[#faebd7] rounded-full flex items-center justify-center text-[#8c7355]">🌿</div>
            </div>
            <p className="text-[#555555] text-sm leading-relaxed">Integrating mind, body, and emotional awareness to achieve a comprehensive sense of balance and mental resilience.</p>
          </div>
        </div>
      </section>

      {/* Shared Components */}
      <section className="px-6">
        <ScheduleSession serviceName="Emotional Clarity Session" price="₹1,500" duration="60 Minutes" />
      </section>
      <ContactSection />
    </div>
  );
};

export default ServiceClarity;
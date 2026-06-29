import React from 'react';
import ScheduleSession from '../components/ScheduleSession';
import ContactSection from '../components/ContactSection';

const ServiceGuided = () => {
  return (
    <div className="w-full bg-[#fcfbf9] text-[#333333] font-sans">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <span className="bg-[#fdf3e7] text-[#a68a64] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full inline-block">Individual Therapy</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">Guided Counseling Session</h1>
          <p className="text-[#555555] leading-relaxed max-w-md">
            A supportive space addressing anxiety, stress, overthinking, and self-esteem. Focused on building practical tools and emotional resilience for daily life.
          </p>
          <div className="flex items-end gap-2 pt-2">
            <span className="text-3xl font-bold text-[#1a1a1a]">₹1,800</span>
            <span className="text-[#555555] text-sm pb-1">/ per session (60 mins)</span>
          </div>
          <button className="mt-4 bg-[#1a1a1a] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#333333] transition-colors">
            SECURE YOUR SPOT
          </button>
        </div>
        <div className="flex-1 w-full">
          <img src="/assets/service-guided-hero.jpg" alt="Therapy room" className="w-full h-[450px] object-cover rounded-3xl shadow-lg" />
        </div>
      </section>

      {/* What to expect */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-serif text-[#1a1a1a] mb-10 border-l-4 border-[#3a5a40] pl-4">What to expect from your journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-[#f0eee9] shadow-sm">
            <div className="w-10 h-10 bg-[#e8ece4] rounded-full flex items-center justify-center text-[#4a5f46] mb-4">🧠</div>
            <h3 className="text-xl font-bold mb-3">Emotional Regulation</h3>
            <p className="text-[#555555] text-sm leading-relaxed">Learn to navigate high-intensity emotions with grace. We focus on identifying triggers and developing physiological grounding techniques to keep you centered.</p>
          </div>
          <div className="bg-[#fcfaf8] p-8 rounded-2xl border border-[#f0eee9]">
            <div className="w-10 h-10 bg-[#faebd7] rounded-full flex items-center justify-center text-[#8c7355] mb-4">🛠️</div>
            <h3 className="text-xl font-bold mb-3">Practical Strategies</h3>
            <p className="text-[#555555] text-sm leading-relaxed">Actionable steps to manage daily stressors immediately.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-[#f0eee9] shadow-sm">
            <div className="w-10 h-10 bg-[#eef3ea] rounded-full flex items-center justify-center text-[#3a5a40] mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3">Collaborative Goal Setting</h3>
            <p className="text-[#555555] text-sm leading-relaxed">We define clear milestones together for your personal evolution.</p>
          </div>
          <div className="md:col-span-2 bg-[#2c3e40] text-white p-8 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-3">Sustainable Growth</h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-sm">Not just a quick fix, but a foundation for long-term mental resilience and self-awareness that stays with you.</p>
            </div>
            <div className="hidden md:flex w-16 h-16 bg-[#3a5255] rounded-xl items-center justify-center text-2xl">📈</div>
          </div>
        </div>
      </section>

      {/* Shared Components */}
      <section className="px-6">
        <ScheduleSession serviceName="Guided Counseling Session" price="₹1,800" duration="60 Minutes" />
      </section>
    </div>
  );
};

export default ServiceGuided;